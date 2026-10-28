import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {parseDocument,loadDocuments,validateSchema,validateRepository,jsonText,digestJson,reviewRecordDigest,readReviewRecord,delegationDigest,secretErrors,walk,managedDirectories,compareBaseline} from './lib.mjs';

const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const today=()=>new Date().toISOString().slice(0,10);
const readJson=file=>{try{return JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));}catch{throw Error('Cannot read valid JSON: '+path.basename(file));}};
const configOf=root=>readJson(path.join(root,'repository.json'));
function inside(root,file,{existing=false}={}){
 const base=path.resolve(root),target=path.resolve(base,file),relative=path.relative(base,target);
 if(relative.startsWith('..')||path.isAbsolute(relative)||!relative)throw Error('Path must stay inside repository');
 let check=target;while(!fs.existsSync(check))check=path.dirname(check);
 const actual=fs.realpathSync(check),realRelative=path.relative(fs.realpathSync(base),actual);
 if(realRelative.startsWith('..')||path.isAbsolute(realRelative))throw Error('Resolved path leaves repository');
 if(existing&&!fs.existsSync(target))throw Error('Expected existing repository file');
 return target;
}
const relative=(root,file)=>path.relative(path.resolve(root),inside(root,file)).replaceAll('\\','/');
const serialize=d=>`---\n${JSON.stringify(d.metadata,null,2)}\n---\n\n${d.body}`;
function writeNew(file,text){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,text,{flag:'wx'});}
function reviewSchema(root){return readJson(path.join(root,'schemas/review-record.schema.json'));}
function requireValid(result){if(result.errors.length)throw Error(result.errors.join('\n'));}

// Validate prospective changes in an isolated local copy before mutating live records.
function preview(root,updates,options={}){
 const parent=inside(root,'work');fs.mkdirSync(parent,{recursive:true});
 const temporary=fs.mkdtempSync(path.join(parent,'workflow-preview-'));
 try{
  for(const file of walk(root)){const target=inside(temporary,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(inside(root,file,{existing:true}),target);}
  for(const [file,text] of updates){const target=inside(temporary,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,text);}
  return validateRepository(temporary,{catalog:false,...options});
 }finally{
  const rel=path.relative(fs.realpathSync(parent),fs.realpathSync(temporary));
  if(!/^workflow-preview-[^/\\]+$/.test(rel))throw Error('Unsafe preview cleanup target');
  fs.rmSync(temporary,{recursive:true,force:true});
 }
}

export function delegationRequest(root){
 const c=configOf(root);
 return {schema_version:1,classification:'internal',subject:{kind:'delegation',id:c.name,digest:delegationDigest(c)},reviewer:null,role:'delegation',date:null,decision:null,statement:null};
}
export function storeReviewRecord(root,record){
 const secrets=secretErrors('review-record.json',jsonText(record));if(secrets.length)throw Error(secrets.join('\n'));
 const issues=validateSchema(reviewSchema(root),record,'review record');
 if(issues.length)throw Error(issues.join('\n'));
 const roles={document:['engineering','security'],exception:['engineering','security'],release:['release'],delegation:['delegation']};
 if(!roles[record.subject.kind].includes(record.role))throw Error('Review role does not match subject kind');
 if(record.date>today())throw Error('Review date is in the future');
 const reference=`local:reviews/records/${reviewRecordDigest(record)}.json`;
 const target=inside(root,reference.slice(6));
 if(fs.existsSync(target))readReviewRecord(root,reference);
 else writeNew(target,jsonText(record));
 return reference;
}
export function prepareReview(root,file){
 const target=inside(root,file,{existing:true}),rel=relative(root,file);
 if(!managedDirectories.includes(rel.split('/')[0])||!rel.endsWith('.md'))throw Error('Review target must be a governed Markdown document');
 const source=fs.readFileSync(target),current=parseDocument(source.toString('utf8'),rel);
 const issues=validateSchema(readJson(path.join(root,'schemas/document.schema.json')),current.metadata,rel);
 if(issues.length)throw Error(issues.join('\n'));
 if(!['draft','in-review'].includes(current.metadata.status))throw Error('Submit a draft/in-review revision before preparing approval');
 const candidate=parseDocument(serialize({metadata:{...current.metadata,status:'approved',approvals:[]},body:current.body.replace(/^> Draft[^\n]*(?:\n\n)?/m,'')}),rel);
 const folder=`work/review-requests/${candidate.metadata.id}-${candidate.digest}-${hash(source).slice(0,16)}`;
 const request={schema_version:1,target:rel,source_sha256:hash(source),candidate:`${folder}/candidate.md`,candidate_digest:candidate.digest};
 const requestFile=`${folder}/request.json`;
 if(fs.existsSync(inside(root,requestFile)))throw Error('Review request already exists; do not overwrite it');
 writeNew(inside(root,request.candidate),serialize(candidate));
 const record={schema_version:1,classification:'internal',subject:{kind:'document',id:candidate.metadata.id,digest:candidate.digest},reviewer:null,role:null,date:null,decision:null,statement:null};
 writeNew(inside(root,`${folder}/review-form.json`),jsonText(record));
 writeNew(inside(root,requestFile),jsonText(request));
 writeNew(inside(root,`${folder}/README.md`),`# Pending human review\n\nReview candidate.md and its source dependencies. This ignored work package is not approved authority. Complete a separate copy of review-form.json for each required role: ${candidate.metadata.required_approvals.join(', ')}.\n\nLive source status: ${current.metadata.status}. Application requires an unchanged in-review source. If it is draft, submit it as in-review, commit that review baseline, and prepare a fresh request. No live status or approval was changed.\n`);
 return requestFile;
}
export function applyReview(root,requestFile,references){
 const request=readJson(inside(root,requestFile,{existing:true}));
 if(request.schema_version!==1||!Array.isArray(references)||!references.length)throw Error('Review request and records are required');
 const target=inside(root,request.target,{existing:true}),rel=relative(root,request.target);
 if(!managedDirectories.includes(rel.split('/')[0])||!rel.endsWith('.md'))throw Error('Review target must be a governed Markdown document');
 const source=fs.readFileSync(target),old=parseDocument(source.toString('utf8'),rel);
 if(old.metadata.status!=='in-review')throw Error('Live source must be in-review; submit and prepare a fresh request');
 if(hash(source)!==request.source_sha256)throw Error('Source changed after request preparation');
 if(!/^work\/review-requests\/[^/]+\/candidate\.md$/.test(request.candidate))throw Error('Invalid review candidate path');
 const candidate=parseDocument(fs.readFileSync(inside(root,request.candidate,{existing:true}),'utf8'),rel);
 if(candidate.metadata.id!==old.metadata.id||candidate.metadata.status!=='approved'||candidate.metadata.approvals.length||candidate.digest!==request.candidate_digest)throw Error('Candidate identity, state, or digest mismatch');
 const transitions=compareBaseline([old],[candidate]);
 if(transitions.length)throw Error(transitions.join('\n'));
 if(old.metadata.required_approvals.some(role=>!candidate.metadata.required_approvals.includes(role)))throw Error('Candidate cannot remove required review roles; revise the live proposal and obtain policy-change review first');
 candidate.metadata.approvals=references.map(reference=>{const r=readReviewRecord(root,reference);return {approver:r.reviewer,role:r.role,date:r.date,digest:r.subject.digest,evidence:reference};});
 const text=serialize(candidate),result=preview(root,[[rel,text]]);
 requireValid(result);
 // Recheck the live bytes after preview, then apply only this document. Catalog regeneration is separate.
 if(hash(fs.readFileSync(target))!==request.source_sha256)throw Error('Source changed during review application');
 fs.writeFileSync(target,text);
 return {id:candidate.metadata.id,digest:candidate.digest};
}
export function prepareRelease(root,version,authors,ids,changes){
 if(!/^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/.test(version))throw Error('Expected a numeric MAJOR.MINOR.PATCH version');
 if(!authors.length||authors.some(a=>!a.trim())||!ids.length||!changes.length)throw Error('Release authors, selected documents, and change notes are required');
 requireValid(validateRepository(root,{catalog:false}));
 const all=loadDocuments(root),byId=new Map(all.map(d=>[d.metadata.id,d])),owners=new Map(all.flatMap(d=>d.metadata.requirements.map(r=>[r,d.metadata.id]))),selected=new Set();
 const add=id=>{if(selected.has(id))return;const d=byId.get(id);if(!d)throw Error('Unknown document '+id);if(!['approved','deprecated'].includes(d.metadata.status))throw Error('Release requires approved documents: '+id);selected.add(id);for(const next of [...d.metadata.depends_on,...d.metadata.requires.map(r=>owners.get(r))])add(next);};
 ids.forEach(add);
 if(fs.existsSync(inside(root,`releases/manifests/${version}.json`)))throw Error('Release version already exists');
 const m={version,classification:'internal',authors:[...new Set(authors)],documents:[...selected].sort().map(id=>({id,digest:byId.get(id).digest})),changes,approval:null};
 const file=`work/release-candidates/${version}/manifest.json`;
 writeNew(inside(root,file),jsonText(m));
 const form={schema_version:1,classification:'internal',subject:{kind:'release',id:version,digest:digestJson(m,['approval'])},reviewer:null,role:'release',date:null,decision:null,statement:null};
 writeNew(inside(root,`work/release-candidates/${version}/review-form.json`),jsonText(form));
 return file;
}
export function finalizeRelease(root,file,reference){
 if(!/^work\/release-candidates\/[^/]+\/manifest\.json$/.test(relative(root,file)))throw Error('Expected an ignored local release candidate');
 const m=readJson(inside(root,file,{existing:true}));
 const r=readReviewRecord(root,reference);
 m.approval={approver:r.reviewer,role:r.role,date:r.date,digest:r.subject.digest,evidence:reference};
 const schema=readJson(path.join(root,'schemas/release.schema.json')),issues=validateSchema(schema,m,'release candidate');
 if(issues.length)throw Error(issues.join('\n'));
 const rel=`releases/manifests/${m.version}.json`,target=inside(root,rel);
 if(fs.existsSync(target))throw Error('Release version already exists');
 requireValid(preview(root,[[rel,jsonText(m)]],{release:rel}));
 writeNew(target,jsonText(m));
 return rel;
}
export {readJson};
