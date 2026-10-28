import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

export const managedDirectories = ['governance','architecture','standards','technologies','workload-profiles','patterns'];
const governed = file => file.endsWith('.md') && managedDirectories.includes(file.split('/')[0]);
const skipped = new Set(['.git','node_modules','work','outputs']);
const normalize = value => value.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
export function walk(root, prefix='') {
  return fs.readdirSync(path.join(root,prefix), {withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en')).flatMap(entry=>{
    if (skipped.has(entry.name) && (!prefix || ['.git','node_modules'].includes(entry.name))) return [];
    const file=prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw Error(`Symbolic links are not allowed: ${file}`);
    return entry.isDirectory() ? walk(root,file) : [file];
  });
}
export function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])]));
  return value;
}
export function digestJson(value, excluded=['approvals']) {
  const copy={...value};
  for (const key of excluded) delete copy[key];
  return crypto.createHash('sha256').update(JSON.stringify(canonical(copy))).digest('hex');
}
export function parseDocument(source, file='document') {
  const normalized=normalize(source);
  const match=/^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(normalized);
  if (!match) throw Error(`${file}: missing JSON-compatible YAML front matter`);
  let metadata;
  try { metadata=JSON.parse(match[1]); } catch { throw Error(`${file}: front matter must use valid JSON syntax`); }
  const body=match[2].replace(/^\n+/, '').trimEnd()+'\n';
  const approvedContent={metadata:{...metadata},body};
  delete approvedContent.metadata.approvals;
  const digest=crypto.createHash('sha256').update(JSON.stringify(canonical(approvedContent))).digest('hex');
  return {file,metadata,body,digest,source:normalized};
}
export function loadDocuments(root) {
  return walk(root).filter(governed).map(file=>parseDocument(fs.readFileSync(path.join(root,file),'utf8'),file));
}
export function catalogOf(documents) {
  return {schema_version:1,authority:'Release manifest membership and lifecycle determine authority; catalog presence alone does not.',documents:documents.map(doc=>({path:doc.file,...doc.metadata,digest:doc.digest})).sort((a,b)=>a.id.localeCompare(b.id,'en'))};
}
export const jsonText = value => JSON.stringify(value,null,2)+'\n';
export function validDate(value) {
  return typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0,10)===value;
}
// Implements exactly the JSON Schema keywords used in schemas/. Unknown keywords fail closed.
export function validateSchema(schema,value,location='$') {
  const errors=[];
  const supported=new Set(['$schema','title','description','type','const','enum','minimum','minItems','uniqueItems','minLength','pattern','format','items','required','properties','additionalProperties']);
  for(const key of Object.keys(schema)) if(!supported.has(key)) throw Error(`Unsupported schema keyword: ${key}`);
  const kind=Array.isArray(value)?'array':value===null?'null':typeof value;
  const types=schema.type===undefined?[]:Array.isArray(schema.type)?schema.type:[schema.type];
  if(types.length && !types.some(t=>t===kind || (t==='integer' && Number.isInteger(value)))) return [`${location}: expected ${types.join('|')}`];
  if(Object.hasOwn(schema,'const') && JSON.stringify(value)!==JSON.stringify(schema.const)) errors.push(`${location}: unexpected constant`);
  if(schema.enum && !schema.enum.includes(value)) errors.push(`${location}: unsupported value ${value}`);
  if(typeof value==='number' && schema.minimum!==undefined && value<schema.minimum) errors.push(`${location}: below minimum`);
  if(typeof value==='string'){
    if(schema.minLength!==undefined && value.trim().length<schema.minLength) errors.push(`${location}: empty or too short`);
    if(schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${location}: invalid format`);
    if(schema.format && schema.format!=='date') throw Error(`Unsupported schema format: ${schema.format}`);
    if(schema.format==='date' && !validDate(value)) errors.push(`${location}: invalid calendar date`);
  }
  if(Array.isArray(value)){
    if(schema.minItems!==undefined && value.length<schema.minItems) errors.push(`${location}: too few items`);
    if(schema.uniqueItems && new Set(value.map(v=>JSON.stringify(canonical(v)))).size!==value.length) errors.push(`${location}: duplicate items`);
    if(schema.items) value.forEach((item,index)=>errors.push(...validateSchema(schema.items,item,`${location}[${index}]`)));
  }else if(value && typeof value==='object'){
    for(const key of schema.required??[]) if(!Object.hasOwn(value,key)) errors.push(`${location}: missing ${key}`);
    for(const [key,item] of Object.entries(value)){
      if(Object.hasOwn(schema.properties??{},key)) errors.push(...validateSchema(schema.properties[key],item,`${location}.${key}`));
      else if(schema.additionalProperties===false) errors.push(`${location}: unknown field ${key}`);
    }
  }
  return errors;
}
function stripFences(text){
  let fence=null;
  return text.split('\n').map(line=>{
    const match=/^\s*(`{3,}|~{3,})/.exec(line);
    if(match){if(!fence)fence=match[1][0];else if(fence===match[1][0])fence=null;return '';}
    return fence?'':line;
  }).join('\n');
}
function anchors(text){
  const counts=new Map();
  return new Set([...stripFences(text).matchAll(/^#{1,6}\s+(.+)$/gm)].map(match=>{
    const base=match[1].toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu,'').replace(/ /g,'-');
    const count=counts.get(base)??0;counts.set(base,count+1);return count?`${base}-${count}`:base;
  }));
}
export function markdownErrors(root,file,text){
  const errors=[];
  if(!text.endsWith('\n')) errors.push(`${file}: missing final newline`);
  if(/[ \t]+$/m.test(text)) errors.push(`${file}: trailing whitespace`);
  const body=text.startsWith('---\n')?text.replace(/^---\n[\s\S]*?\n---\n/,''):text;
  const plain=stripFences(body);
  if([...plain.matchAll(/^# /gm)].length!==1)errors.push(`${file}: expected one H1`);
  if(/^#{1,6} .+\n[^\n]/m.test(plain)) errors.push(`${file}: heading needs a blank line`);
  let fence=null;
  for(const line of body.split('\n')){const match=/^\s*(`{3,}|~{3,})/.exec(line);if(match){if(!fence)fence=match[1][0];else if(fence===match[1][0])fence=null;}}
  if(fence)errors.push(`${file}: unclosed code fence`);
  for(const match of plain.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)){
    let target=match[1].trim().replace(/^<|>$/g,'');
    if(/^(https?:|mailto:)/i.test(target))continue;
    if(/^[a-z][a-z0-9+.-]*:/i.test(target)){errors.push(`${file}: unsupported link protocol`);continue;}
    const [name,fragment]=target.split('#');
    let resolved;
    try{resolved=(name ? path.resolve(root,path.dirname(file),decodeURIComponent(name)) : path.resolve(root,file));}catch{errors.push(`${file}: invalid link encoding`);continue;}
    const rel=path.relative(root,resolved);
    if(rel.startsWith('..') || path.isAbsolute(rel)){errors.push(`${file}: link leaves repository`);continue;}
    if(!fs.existsSync(resolved)){errors.push(`${file}: broken link ${target}`);continue;}
    if(fragment && fs.statSync(resolved).isFile() && resolved.endsWith('.md')){
      let decoded;try{decoded=decodeURIComponent(fragment);}catch{errors.push(`${file}: invalid anchor encoding`);continue;}
      if(!anchors(normalize(fs.readFileSync(resolved,'utf8'))).has(decoded))errors.push(`${file}: broken anchor ${target}`);
    }
  }
  return errors;
}
export function secretErrors(file,text){
  const errors=[];
  if(/(^|\/)\.env(?:\.|$)|\.(?:pem|key|p12|pfx)$/i.test(file))errors.push(`${file}: prohibited sensitive file name`);
  const patterns=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\bAKIA[0-9A-Z]{16}\b/,/\bgh[pousr]_[A-Za-z0-9]{30,}\b/,/\bgithub_pat_[A-Za-z0-9_]{50,}\b/,/\b(?:postgres(?:ql)?|https?):\/\/[^\s/:]+:[^\s/@]+@/i];
  if(patterns.some(p=>p.test(text)))errors.push(`${file}: possible credential or private key (value suppressed)`);
  return errors;
}
function approvalErrors(doc,config,today,root,{verifyCurrentAuthority=false}={}){
  const m=doc.metadata,errors=[];
  const historical=m.status==='retired'&&!verifyCurrentAuthority;
  const needed=new Set(m.required_approvals);
  if(!needed.has('engineering'))errors.push(`${doc.file}: engineering review is required`);
  const securityControlIds=new Set(['GOV-002','GOV-003','GOV-004','GOV-011','STD-002','STD-003']);
  if(!historical && (securityControlIds.has(m.id) || m.type==='technology-support-decision' || doc.file==='governance/information-handling.md' || doc.file.startsWith('standards/security/') || doc.file.startsWith('standards/identity-and-access/'))){
    if(!needed.has('security'))errors.push(`${doc.file}: security review is required`);
  }
  for(const approval of m.approvals){
    if(m.authors.includes(approval.approver))errors.push(`${doc.file}: author cannot approve`);
    if(!historical&&!config.roles[approval.role]?.includes(approval.approver))errors.push(`${doc.file}: approver is not delegated for ${approval.role}`);
    if(approval.digest!==doc.digest)errors.push(`${doc.file}: stale approval digest`);
    if(approval.date>today || approval.date<m.updated)errors.push(`${doc.file}: invalid approval chronology`);
    errors.push(...approvalEvidenceErrors(root,approval,{kind:'document',id:m.id,digest:doc.digest},config,today,{historical}));
  }
  if(['approved','deprecated','retired'].includes(m.status)){
    for(const role of needed)if(!m.approvals.some(a=>a.role===role))errors.push(`${doc.file}: missing ${role} approval`);
    if(/^> Draft\b/m.test(doc.body))errors.push(`${doc.file}: draft banner remains on reviewed content`);
  }
  return errors;
}
const transitions={draft:['draft','in-review'], 'in-review':['in-review','draft','approved'], approved:['approved','in-review','deprecated'],deprecated:['deprecated','in-review','retired'],retired:['retired']};
export function compareBaseline(previous,current){
  const errors=[],byId=new Map(current.map(d=>[d.metadata.id,d]));
  for(const old of previous){
    const next=byId.get(old.metadata.id);
    if(!next){if(['approved','deprecated','retired'].includes(old.metadata.status))errors.push(`${old.file}: cannot delete reviewed record`);continue;}
    if(!transitions[old.metadata.status]?.includes(next.metadata.status))errors.push(`${next.file}: invalid lifecycle transition`);
    if(next.metadata.revision<old.metadata.revision)errors.push(`${next.file}: revision decreased`);
    if(old.digest!==next.digest && ['approved','deprecated'].includes(old.metadata.status) && ['approved','deprecated','retired'].includes(next.metadata.status)){
      for(const role of old.metadata.required_approvals)if(!next.metadata.approvals.some(a=>a.role===role))errors.push(`${next.file}: changing reviewed rules requires previous ${role} role approval`);
    }
    if(old.digest!==next.digest && ['approved','deprecated','retired'].includes(old.metadata.status)){
      if(next.metadata.revision<=old.metadata.revision)errors.push(`${next.file}: reviewed change needs a new revision`);
      if(old.metadata.status==='retired')errors.push(`${next.file}: retired content is immutable`);
    }
  }
  return errors;
}
function gitBaseline(root,commit){
  if(!/^[a-f0-9]{40}$/.test(commit))throw Error('Base must be a full 40-character commit hash');
  const args={cwd:root,encoding:'utf8',maxBuffer:16*1024*1024,stdio:['ignore','pipe','pipe']};
  const files=execFileSync('git',['ls-tree','-r','--name-only',commit],args).trim().split('\n');
  const read=file=>normalize(execFileSync('git',['show',`${commit}:${file}`],args));
  return {
    documents:files.filter(governed).map(file=>parseDocument(read(file),file)),
    manifests:new Map(files.filter(file=>/^releases\/manifests\/.*\.json$/.test(file)).map(file=>[file,read(file)])),
    reviewRecords:new Map(files.filter(file=>/^reviews\/records\/.*\.json$/.test(file)).map(file=>[file,read(file)]))
  };
}
export function releaseErrors(manifest,documents,config,today,root){
  const errors=[];
  if(config.phase!=='active')errors.push('Release blocked: repository is in bootstrap');
  if(config.review?.mode==='local'){
    if(config.hosting.provider!=='local' || !config.hosting.private)errors.push('Release blocked: local review requires local private storage');
    errors.push(...delegationErrors(root,config,today));
  }else if(config.review?.mode!=='hosted' || config.hosting.provider==='local' || config.hosting.provider==='undecided' || !config.hosting.repository_url || !config.hosting.private || !config.hosting.protected_reviews_verified)errors.push('Release blocked: private hosting and protected review are unverified');
  const byId=new Map(documents.map(d=>[d.metadata.id,d]));
  const selected=new Set(manifest.documents.map(d=>d.id));
  if(selected.size!==manifest.documents.length)errors.push('Release contains duplicate document IDs');
  const owners=new Map(documents.flatMap(d=>d.metadata.requirements.map(r=>[r,d.metadata.id])));
  for(const entry of manifest.documents){
    const doc=byId.get(entry.id);if(!doc){errors.push(`Release: unknown ${entry.id}`);continue;}
    if(!['approved','deprecated'].includes(doc.metadata.status))errors.push(`Release: ${entry.id} is not approved`);
    if(doc.digest!==entry.digest)errors.push(`Release: stale digest for ${entry.id}`);
    if(doc.metadata.review_due<today)errors.push(`Release: ${entry.id} review expired`);
    const dependencies=[...doc.metadata.depends_on,...doc.metadata.requires.map(r=>owners.get(r))];
    for(const dependency of dependencies)if(!selected.has(dependency))errors.push(`Release: missing dependency ${dependency} for ${entry.id}`);
  }
  const a=manifest.approval;
  if(!a)errors.push('Release: missing approval');
  if(a){
    if(manifest.authors?.includes(a.approver))errors.push('Release: author cannot approve');
    if(a.date>today)errors.push('Release: invalid approval chronology');
    errors.push(...approvalEvidenceErrors(root,a,{kind:'release',id:manifest.version,digest:digestJson(manifest,['approval'])},config,today));
    if(!config.roles.release.includes(a.approver))errors.push('Release: reviewer is not delegated for release');
    if(a.digest!==digestJson(manifest,['approval']))errors.push('Release: stale approval digest');
    if(a.date>today)errors.push('Release: approval date is in the future');
    for(const entry of manifest.documents){const d=byId.get(entry.id);if(d && a.date<d.metadata.updated)errors.push(`Release: approval predates ${entry.id}`);}
  }
  return errors;
}
export function validateRepository(root,options={}){
  const errors=[],warnings=[];
  const today=options.today??new Date().toISOString().slice(0,10);
  let files,config,documents;
  try{files=walk(root);config=JSON.parse(fs.readFileSync(path.join(root,'repository.json'),'utf8'));}catch(error){return {errors:[error.message],warnings,documents:[]};}
  const readSchema=name=>JSON.parse(fs.readFileSync(path.join(root,`schemas/${name}.schema.json`),'utf8'));
  errors.push(...validateSchema(readSchema('repository'),config,'repository.json'));
  if(errors.length)return {errors,warnings,documents:[]};
  if(config.review.mode==='local' && (config.phase==='active' || Object.values(config.roles).some(ids=>ids.length)))errors.push(...delegationErrors(root,config,today));
  for(const file of files.filter(f=>/^reviews\/records\/.*\.json$/.test(f))){
    try{readReviewRecord(root,`local:${file}`);}catch(error){errors.push(`${file}: ${error.message}`);}
  }
  for(const file of files){
    const absolute=path.join(root,file);
    if(fs.statSync(absolute).size>2*1024*1024){errors.push(`${file}: file exceeds 2 MiB; review attachments separately`);continue;}
    if(/\.(md|json|mjs|js|yml|yaml|txt|svg)$/.test(file)||path.basename(file).startsWith('.')){
      const text=normalize(fs.readFileSync(absolute,'utf8'));
      errors.push(...secretErrors(file,text));
      if(file.endsWith('.md'))errors.push(...markdownErrors(root,file,text));
    }else errors.push(...secretErrors(file,''));
  }
  documents=[];
  const schema=readSchema('document');
  for(const file of files.filter(governed)){
    try{
      const doc=parseDocument(fs.readFileSync(path.join(root,file),'utf8'),file);
      const issues=validateSchema(schema,doc.metadata,file);errors.push(...issues);
      if(!issues.length)documents.push(doc);
    }catch(error){errors.push(error.message);}
  }
  const byId=new Map(),owners=new Map();
  for(const doc of documents){
    const m=doc.metadata;
    if(byId.has(m.id))errors.push(`${doc.file}: duplicate document ID ${m.id}`);byId.set(m.id,doc);
    for(const req of m.requirements){
      if(owners.has(req))errors.push(`${doc.file}: duplicate requirement owner ${req}`);owners.set(req,m.id);
      if(!new RegExp(`^#{2,6} ${req}(?:\\s|$)`,'m').test(doc.body))errors.push(`${doc.file}: requirement ${req} needs a heading`);
    }
    if(!['governance','standard','technology'].includes(m.type)&&m.requirements.length)errors.push(`${doc.file}: this document type cannot own normative requirements`);
    if(m.type==='technology-support-decision'){
      if(!m.applicability.technologies.length)errors.push(doc.file+': support decision must declare affected technologies');
      if(!m.depends_on.includes('GOV-010'))errors.push(doc.file+': support decision must depend on GOV-010');
      for(const req of ['GOV-TECH-001','GOV-TECH-002','GOV-TECH-003','GOV-TECH-004','GOV-TECH-005']){
        if(!m.requires.includes(req))errors.push(doc.file+': support decision must reference '+req);
      }
    }
    if(m.created>m.updated||m.updated>today||m.review_due<m.updated)errors.push(`${doc.file}: invalid document chronology`);
    if(m.owner!==config.owner)errors.push(`${doc.file}: owner differs from accountable team`);
    if(m.review_due<today){if(['approved','deprecated'].includes(m.status))errors.push(`${doc.file}: review expired`);else if(m.status!=='retired')warnings.push(`${doc.file}: draft review overdue`);}
    errors.push(...approvalErrors(doc,config,today,root));
  }
  for(const doc of documents){
    const m=doc.metadata;
    for(const dependency of m.depends_on){
      const target=byId.get(dependency);
      if(!target)errors.push(`${doc.file}: missing dependency ${dependency}`);
      else if(['approved','deprecated'].includes(m.status)&&!['approved','deprecated'].includes(target.metadata.status))errors.push(`${doc.file}: approved content depends on unapproved guidance`);
    }
    for(const req of m.requires){
      const owner=owners.get(req);
      if(!owner)errors.push(`${doc.file}: unknown requirement ${req}`);
      else if(owner===m.id)errors.push(`${doc.file}: owned requirement must not be listed in requires`);
      else if(!m.depends_on.includes(owner))errors.push(`${doc.file}: requirement owner ${owner} must be in depends_on`);
    }
    for(const match of stripFences(doc.body).matchAll(/\b[A-Z]{2,8}-[A-Z0-9]{2,16}-[0-9]{3}\b/g)){
      if(!m.requirements.includes(match[0])&&!m.requires.includes(match[0]))errors.push(`${doc.file}: undeclared requirement reference ${match[0]}`);
    }
    for(const predecessor of m.supersedes){
      if(!byId.has(predecessor))errors.push(`${doc.file}: unknown predecessor ${predecessor}`);
      else if(byId.get(predecessor).metadata.superseded_by!==m.id)errors.push(`${doc.file}: supersession needs reciprocal successor`);
    }
    if(m.superseded_by&&!byId.get(m.superseded_by)?.metadata.supersedes.includes(m.id))errors.push(`${doc.file}: successor does not supersede this document`);
  }
  const visiting=new Set(),visited=new Set();
  function visit(id){if(visiting.has(id)){errors.push(`Dependency cycle at ${id}`);return;}if(visited.has(id))return;visiting.add(id);for(const next of byId.get(id)?.metadata.depends_on??[])visit(next);visiting.delete(id);visited.add(id);}
  for(const id of byId.keys())visit(id);
  if(options.catalog!==false){
    const file=path.join(root,'catalog/documents.json');
    if(!fs.existsSync(file)||normalize(fs.readFileSync(file,'utf8'))!==jsonText(catalogOf(documents)))errors.push('Catalog is missing or stale; run node tooling/catalog.mjs');
  }
  if(options.base){
    try{
      const baseline=gitBaseline(root,options.base);
      errors.push(...compareBaseline(baseline.documents,documents));
      const previousById=new Map(baseline.documents.map(d=>[d.metadata.id,d]));
      for(const doc of documents)if(doc.metadata.status==='retired'&&previousById.get(doc.metadata.id)?.metadata.status!=='retired')errors.push(...approvalErrors(doc,config,today,root,{verifyCurrentAuthority:true}));
      for(const [file,source] of baseline.reviewRecords){
        if(!files.includes(file)||normalize(fs.readFileSync(path.join(root,file),'utf8'))!==source)errors.push(`${file}: review records are immutable`);
      }
      const currentManifests=files.filter(file=>/^releases\/manifests\/.*\.json$/.test(file));
      for(const [file,source] of baseline.manifests){
        if(!currentManifests.includes(file)||normalize(fs.readFileSync(path.join(root,file),'utf8'))!==source)errors.push(`${file}: released manifests are immutable`);
      }
      for(const file of currentManifests.filter(file=>!baseline.manifests.has(file))){
        const manifest=JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
        const issues=validateSchema(readSchema('release'),manifest,file);
        errors.push(...issues);
        if(!issues.length){
          if(path.basename(file)!==`${manifest.version}.json`)errors.push('Release filename must match version');
          errors.push(...releaseErrors(manifest,documents,config,today,root));
        }
      }
    }catch(error){errors.push(`Baseline check failed: ${error.message}`);}
  }
  for(const file of files.filter(f=>/^releases\/manifests\/.*\.json$/.test(f))){
    try{errors.push(...validateSchema(readSchema('release'),JSON.parse(fs.readFileSync(path.join(root,file),'utf8')),file));}catch(error){errors.push(`${file}: ${error.message}`);}
  }
  if(options.release){
    const absolute=path.resolve(root,options.release),relative=path.relative(root,absolute).replaceAll('\\','/');
    if(!/^releases\/manifests\/[^/]+\.json$/.test(relative))errors.push('Release manifest must be inside releases/manifests/');
    else try{
      const manifest=JSON.parse(fs.readFileSync(absolute,'utf8'));
      const issues=validateSchema(readSchema('release'),manifest,relative);errors.push(...issues);
      if(!issues.length){
        if(path.basename(relative)!==`${manifest.version}.json`)errors.push('Release filename must match version');
        errors.push(...releaseErrors(manifest,documents,config,today,root));
      }
    }catch(error){errors.push(`Release check failed: ${error.message}`);}
  }
  return {errors:[...new Set(errors)],warnings,documents};
}


// Local attestations bind claims to exact subjects; human identity is an external trust boundary.
export function reviewRecordDigest(record){return digestJson(record,[]);}
export function delegationDigest(config){
  return digestJson({name:config.name,owner:config.owner,classification:config.classification,roles:Object.fromEntries(Object.entries(config.roles).map(([role,ids])=>[role,[...ids].sort()]))},[]);
}
export function readReviewRecord(root,reference){
  if(!root)throw Error('Local evidence requires a repository root');
  const match=/^local:reviews\/records\/([a-f0-9]{64})\.json$/.exec(reference);
  if(!match)throw Error('Invalid local evidence reference');
  const target=path.join(root,'reviews','records',match[1]+'.json');
  const actual=fs.realpathSync(target),relative=path.relative(fs.realpathSync(root),actual);
  if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('Local evidence leaves repository');
  if(fs.statSync(actual).size>2*1024*1024)throw Error('Review record exceeds size limit');
  let record;try{record=JSON.parse(normalize(fs.readFileSync(actual,'utf8')));}catch{throw Error('Review record is not valid JSON');}
  const schema=JSON.parse(fs.readFileSync(path.join(root,'schemas/review-record.schema.json'),'utf8'));
  if(secretErrors('review-record.json',jsonText(record)).length)throw Error('Review record contains possible credential (value suppressed)');
  const issues=validateSchema(schema,record,'review record');
  if(issues.length)throw Error(issues.join('; '));
  if(reviewRecordDigest(record)!==match[1])throw Error('Review record filename digest mismatch');
  const roles={document:['engineering','security'],exception:['engineering','security'],release:['release'],delegation:['delegation']};
  if(!roles[record.subject.kind].includes(record.role))throw Error('Review role does not match subject kind');
  return record;
}
export function localEvidenceErrors(root,reference,expected,today){
  try{
    const r=readReviewRecord(root,reference),errors=[];
    if(r.decision!=='approved')errors.push('Local evidence: decision is not approved');
    if(r.date>today)errors.push('Local evidence: review date is in the future');
    for(const key of ['kind','id','digest'])if(r.subject[key]!==expected[key])errors.push('Local evidence: subject '+key+' mismatch');
    for(const key of ['reviewer','role','date'])if(expected[key]!==undefined&&r[key]!==expected[key])errors.push('Local evidence: '+key+' mismatch');
    return errors;
  }catch(error){return ['Local evidence: '+error.message];}
}
export function delegationErrors(root,config,today){
  if(!config.review?.delegation_evidence)return ['Local review: missing delegation evidence'];
  return localEvidenceErrors(root,config.review.delegation_evidence,{kind:'delegation',id:config.name,digest:delegationDigest(config),role:'delegation'},today);
}
export function approvalEvidenceErrors(root,approval,subject,config,today,{historical=false}={}){
  if(config.review?.mode==='local'){
    if(!approval.evidence?.startsWith('local:'))return ['Local review requires local evidence'];
    return [...(historical?[]:delegationErrors(root,config,today)),...localEvidenceErrors(root,approval.evidence,{...subject,reviewer:approval.approver,role:approval.role,date:approval.date},today)];
  }
  return /^https:\/\/[^\s]+$/.test(approval.evidence??'')?[]:['Hosted review requires HTTPS evidence'];
}
