import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseDocument,validateSchema,validateRepository,catalogOf,jsonText,compareBaseline,digestJson,releaseErrors,secretErrors,validDate} from '../tooling/lib.mjs';

const repo=fileURLToPath(new URL('../',import.meta.url));
const today='2026-10-23';
const baseMetadata={id:'STD-101',title:'Fixture standard',type:'standard',status:'draft',revision:1,owner:'Software Engineering team',classification:'internal',authors:['author'],created:today,updated:today,review_due:'2027-01-23',applicability:{technologies:[],workloads:[]},required_approvals:['engineering'],approvals:[],depends_on:[],requirements:[],requires:[],supersedes:[]};
const raw=(m,body='# Fixture standard\n\nContent.\n')=>`---\n${JSON.stringify(m,null,2)}\n---\n\n${body}`;
const document=(changes={},body,file='standards/test.md')=>parseDocument(raw({...structuredClone(baseMetadata),...changes},body),file);
const config=()=>({name:'fixture',owner:'Software Engineering team',classification:'internal',phase:'active',approved_release:null,review:{mode:'hosted',delegation_evidence:null},hosting:{provider:'private-host',repository_url:'https://example.invalid/team/standards',private:true,protected_reviews_verified:true},roles:{engineering:['reviewer'],security:['security-reviewer'],release:['release-reviewer']}});
function sign(doc){
 const approvals=doc.metadata.required_approvals.map(role=>({approver:role==='security'?'security-reviewer':'reviewer',role,date:today,digest:doc.digest,evidence:'https://example.invalid/review/1'}));
 return parseDocument(raw({...doc.metadata,approvals},doc.body),doc.file);
}
function fixture(t,docs=[document()]){
 fs.mkdirSync(path.join(repo,'work'),{recursive:true});
 const tmpParent=fs.realpathSync(path.join(repo,'work'));
 const root=fs.mkdtempSync(path.join(tmpParent,'system-documents-test-'));
 fs.cpSync(path.join(repo,'schemas'),path.join(root,'schemas'),{recursive:true});
 fs.writeFileSync(path.join(root,'repository.json'),jsonText(config()));
 for(const d of docs){fs.mkdirSync(path.dirname(path.join(root,d.file)),{recursive:true});fs.writeFileSync(path.join(root,d.file),raw(d.metadata,d.body));}
 t.after(()=>{
   const relative=path.relative(tmpParent,path.resolve(root));
   assert.ok(/^system-documents-test-[^/\\]+$/.test(relative),'cleanup stays in the isolated fixture');
   fs.rmSync(root,{recursive:true,force:true});
 });
 return root;
}
const check=(root,options={})=>validateRepository(root,{today,catalog:false,...options});
const has=(result,fragment)=>assert.ok(result.errors.some(e=>e.includes(fragment)),JSON.stringify(result.errors));
const schema=name=>JSON.parse(fs.readFileSync(path.join(repo,`schemas/${name}.schema.json`),'utf8'));

test('valid draft repository passes without pretending to be approved',t=>{
 const result=check(fixture(t));assert.deepEqual(result.errors,[]);assert.equal(result.documents[0].metadata.status,'draft');
});
test('document metadata rejects missing and unknown fields',()=>{
 const m=structuredClone(baseMetadata);delete m.owner;m.unexpected=true;
 const errors=validateSchema(schema('document'),m);assert.ok(errors.some(e=>e.includes('missing owner')));assert.ok(errors.some(e=>e.includes('unknown field')));
});
test('real calendar dates and supported schema keywords are enforced',()=>{
 assert.equal(validDate('2026-02-30'),false);assert.equal(validDate('2028-02-29'),true);
 assert.throws(()=>validateSchema({type:'string',maxLength:1},'ab'),/Unsupported schema keyword/);
});
test('ordinary YAML is rejected rather than parsed ambiguously',()=>assert.throws(()=>parseDocument('---\nid: STD-101\n---\n# Test\n'),/valid JSON/));
test('approval digest ignores record ordering and approval records but binds content',()=>{
 const doc=document();const reordered=parseDocument(raw(Object.fromEntries(Object.entries(doc.metadata).reverse()),doc.body));
 assert.equal(doc.digest,reordered.digest);assert.equal(sign(doc).digest,doc.digest);
 assert.notEqual(document({},'# Fixture standard\n\nDifferent.\n').digest,doc.digest);
 assert.equal(doc.digest,parseDocument(doc.source.replaceAll('\n','\r\n')).digest);
});
test('duplicate document identity is rejected',t=>{
 has(check(fixture(t,[document(),document({},undefined,'standards/other.md')])),'duplicate document ID');
});
test('a requirement cannot have two owners',t=>{
 const body='# Fixture standard\n\n## SEC-AUTH-001 — Access\n\nMUST enforce access.\n';
 const a=document({requirements:['SEC-AUTH-001']},body);
 const b=document({id:'STD-102',requirements:['SEC-AUTH-001']},body,'standards/other.md');
 has(check(fixture(t,[a,b])),'duplicate requirement owner');
});
test('owned requirements need a canonical heading',t=>has(check(fixture(t,[document({requirements:['SEC-AUTH-001']})])),'needs a heading'));
test('references need a known owner and declared document dependency',t=>{
 has(check(fixture(t,[document({requires:['SEC-AUTH-001']})])),'unknown requirement');
 const a=document({requirements:['SEC-AUTH-001']},'# Fixture standard\n\n## SEC-AUTH-001 — Access\n\nMUST enforce access.\n');
 const b=document({id:'STD-102',requires:['SEC-AUTH-001']},undefined,'standards/other.md');
 has(check(fixture(t,[a,b])),'must be in depends_on');
});
test('undeclared requirement references are rejected',t=>has(check(fixture(t,[document({},'# Fixture standard\n\nFollow SEC-AUTH-001.\n')])),'undeclared requirement reference'));
test('missing dependencies and dependency cycles are rejected',t=>{
 has(check(fixture(t,[document({depends_on:['STD-999']})])),'missing dependency');
 const a=document({depends_on:['STD-102']});const b=document({id:'STD-102',depends_on:['STD-101']},undefined,'standards/other.md');
 has(check(fixture(t,[a,b])),'Dependency cycle');
});
test('approved content cannot depend on drafts',t=>{
 const a=sign(document({status:'approved',depends_on:['STD-102']}));const b=document({id:'STD-102'},undefined,'standards/other.md');
 has(check(fixture(t,[a,b])),'depends on unapproved guidance');
});
test('independently approved content with delegated reviewer passes',t=>assert.deepEqual(check(fixture(t,[sign(document({status:'approved'}))])).errors,[]));
test('unapproved status claims and invented reviewer identities fail',t=>{
 has(check(fixture(t,[document({status:'approved'})])),'missing engineering approval');
 const d=sign(document({status:'approved'}));d.metadata.approvals[0].approver='invented';
 has(check(fixture(t,[d])),'not delegated');
});
test('self-approval and stale digests fail',t=>{
 const self=sign(document({status:'approved',authors:['reviewer']}));has(check(fixture(t,[self])),'author cannot approve');
 const stale=sign(document({status:'approved'}));stale.metadata.title='Changed';has(check(fixture(t,[stale])),'stale approval digest');
});
test('security paths require delegated security review',t=>{
 const d=sign(document({status:'approved'},undefined,'standards/security/test.md'));
 has(check(fixture(t,[d])),'security review is required');
 const reviewed=sign(document({status:'approved',required_approvals:['engineering','security']},undefined,'standards/security/test.md'));
 assert.deepEqual(check(fixture(t,[reviewed])).errors,[]);
});
test('expired approval reviews and invalid chronology fail',t=>{
 const expired=sign(document({status:'approved',updated:'2026-01-01',created:'2026-01-01',review_due:'2026-10-22'}));
 has(check(fixture(t,[expired])),'review expired');
 has(check(fixture(t,[document({updated:'2026-10-24'})])),'invalid document chronology');
});
test('draft banners must be removed before approved content is released',t=>{
 const d=sign(document({status:'approved'},'# Fixture standard\n\n> Draft for review.\n'));
 has(check(fixture(t,[d])),'draft banner remains');
});
test('local links and heading anchors are checked',t=>{
 const broken=document({},'# Fixture standard\n\n[Missing](missing.md)\n');has(check(fixture(t,[broken])),'broken link');
 const badAnchor=document({},'# Fixture standard\n\n[Missing](#absent)\n');has(check(fixture(t,[badAnchor])),'broken anchor');
 const escaped=document({},'# Fixture standard\n\n[Outside](../../outside.md)\n');has(check(fixture(t,[escaped])),'link leaves repository');
 const valid=document({},'# Fixture standard\n\n[Self](#fixture-standard)\n');assert.deepEqual(check(fixture(t,[valid])).errors,[]);
});
test('basic Markdown structure and unclosed fences are checked',t=>{
 const bad=document({},'# Fixture standard\n\n```text\nunfinished\n');has(check(fixture(t,[bad])),'unclosed code fence');
});
test('supersession must be reciprocal',t=>has(check(fixture(t,[document({supersedes:['STD-999']})])),'unknown predecessor'));
test('secret diagnostics suppress the matched value',()=>{
 const token=['AKIA','A'.repeat(16)].join('');
 const errors=secretErrors('example.md',token);assert.equal(errors.length,1);assert.equal(errors.join('').includes(token),false);
 assert.equal(secretErrors('.env','').length,1);
});
test('catalog is deterministic and stale edits fail',t=>{
 const root=fixture(t);const d=document();fs.mkdirSync(path.join(root,'catalog'));fs.writeFileSync(path.join(root,'catalog/documents.json'),jsonText(catalogOf([d])));
 assert.deepEqual(check(root,{catalog:true}).errors,[]);
 fs.writeFileSync(path.join(root,d.file),raw({...d.metadata,title:'New title'},d.body));has(check(root,{catalog:true}),'Catalog is missing or stale');
});
test('lifecycle baseline prevents skipping review and deleting approved history',()=>{
 has({errors:compareBaseline([document()],[sign(document({status:'approved'}))])},'invalid lifecycle transition');
 has({errors:compareBaseline([sign(document({status:'approved'}))],[])},'cannot delete reviewed record');
});
test('approved edits need revision increases and retired content is immutable',()=>{
 const before=sign(document({status:'approved'}));const edited=sign(document({status:'approved'},'# Fixture standard\n\nChanged.\n'));
 has({errors:compareBaseline([before],[edited])},'needs a new revision');
 const old=sign(document({status:'retired'}));const next=sign(document({status:'retired',revision:2}));
 has({errors:compareBaseline([old],[next])},'retired content is immutable');
});
test('a properly revised approved change passes baseline checks',()=>{
 const old=sign(document({status:'approved'}));const next=sign(document({status:'approved',revision:2},'# Fixture standard\n\nChanged.\n'));
 assert.deepEqual(compareBaseline([old],[next]),[]);
});
function manifestFor(docs){
 const manifest={version:'1.0.0',classification:'internal',authors:['release-author'],documents:docs.map(d=>({id:d.metadata.id,digest:d.digest})),changes:['Initial approved baseline.'],approval:null};
 manifest.approval={approver:'release-reviewer',role:'release',date:today,digest:digestJson(manifest,['approval']),evidence:'https://example.invalid/review/release'};
 return manifest;
}
test('release gate rejects bootstrap and unapproved selected documents',()=>{
 const docs=[document()],m=manifestFor(docs),c=config();c.phase='bootstrap';c.hosting.protected_reviews_verified=false;
 const result={errors:releaseErrors(m,docs,c,today)};has(result,'bootstrap');has(result,'unverified');has(result,'is not approved');
});
test('release closure and manifest approvals are bound to exact contents',()=>{
 const dependency=sign(document({status:'approved',id:'STD-102'},undefined,'standards/other.md'));
 const selected=sign(document({status:'approved',depends_on:['STD-102']}));
 const m=manifestFor([selected]);has({errors:releaseErrors(m,[selected,dependency],config(),today)},'missing dependency');
 m.changes.push('Changed after review.');has({errors:releaseErrors(m,[selected,dependency],config(),today)},'stale approval digest');
});
test('complete reviewed release passes offline gates',t=>{
 const docs=[sign(document({status:'approved'}))],root=fixture(t,docs),manifest=manifestFor(docs);
 assert.deepEqual(validateSchema(schema('release'),manifest),[]);
 fs.mkdirSync(path.join(root,'releases/manifests'),{recursive:true});fs.writeFileSync(path.join(root,'releases/manifests/1.0.0.json'),jsonText(manifest));
 assert.deepEqual(check(root,{release:'releases/manifests/1.0.0.json'}).errors,[]);
});
test('incomplete application templates cannot masquerade as completed adoption',()=>{
 const template=JSON.parse(fs.readFileSync(path.join(repo,'templates/application-docs/standards-lock.json'),'utf8'));
 assert.ok(validateSchema(schema('standards-lock'),template).length>0);
 const valid={repository:'https://example.invalid/team/standards',release:'v1.0.0',commit:'a'.repeat(40),manifest:'releases/manifests/1.0.0.json'};
 assert.deepEqual(validateSchema(schema('standards-lock'),valid),[]);
});
import {execFileSync} from 'node:child_process';

test('Git baseline integration checks a real immutable base commit',t=>{
 const initial=document();
 const root=fixture(t,[initial]);
 const git=(args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
 git(['init','--initial-branch=main']);
 git(['add','--all']);
 git(['-c','user.name=Validator Fixture','-c','user.email=fixture@example.invalid','commit','-m','Temporary validator fixture']);
 const base=git(['rev-parse','HEAD']);
 assert.deepEqual(check(root,{base}).errors,[]);
 const changed=sign(document({status:'approved'}));
 fs.writeFileSync(path.join(root,changed.file),raw(changed.metadata,changed.body));
 has(check(root,{base}),'invalid lifecycle transition');
});
function commitFixture(root){
 const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
 git(['init','--initial-branch=main']);git(['add','--all']);
 git(['-c','user.name=Validator Fixture','-c','user.email=fixture@example.invalid','commit','-m','Temporary validator fixture']);
 return git(['rev-parse','HEAD']);
}
test('new release manifests receive full release validation in base comparisons',t=>{
 const draft=document(),root=fixture(t,[draft]),base=commitFixture(root);
 fs.mkdirSync(path.join(root,'releases/manifests'),{recursive:true});
 fs.writeFileSync(path.join(root,'releases/manifests/1.0.0.json'),jsonText(manifestFor([draft])));
 has(check(root,{base}),'is not approved');
});
test('existing release manifests cannot be rewritten after their base commit',t=>{
 const docs=[sign(document({status:'approved'}))],root=fixture(t,docs),manifest=manifestFor(docs);
 fs.mkdirSync(path.join(root,'releases/manifests'),{recursive:true});
 const target=path.join(root,'releases/manifests/1.0.0.json');fs.writeFileSync(target,jsonText(manifest));
 const base=commitFixture(root);assert.deepEqual(check(root,{base}).errors,[]);
 manifest.changes.push('Attempt to rewrite history.');fs.writeFileSync(target,jsonText(manifest));
 has(check(root,{base}),'released manifests are immutable');
});

import {reviewRecordDigest,delegationDigest,readReviewRecord} from '../tooling/lib.mjs';
import {delegationRequest,prepareReview,storeReviewRecord,applyReview,prepareRelease,finalizeRelease} from '../tooling/local-workflow.mjs';
function localFixture(t,docs=[document()]){
 const root=fixture(t,docs),c=config();c.review={mode:'local',delegation_evidence:null};c.hosting={provider:'local',repository_url:null,private:true,protected_reviews_verified:false};
 fs.writeFileSync(path.join(root,'repository.json'),jsonText(c));fs.writeFileSync(path.join(root,'.gitignore'),'work/\n');
 attestDelegation(root,c);return root;
}
function attestDelegation(root,c){
 fs.writeFileSync(path.join(root,'repository.json'),jsonText(c));
 const form=delegationRequest(root);
 c.review.delegation_evidence=storeReviewRecord(root,{...form,reviewer:'fixture-team-delegator',date:today,decision:'approved',statement:'Synthetic test only: the fixture owner attests this exact role roster.'});
 fs.writeFileSync(path.join(root,'repository.json'),jsonText(c));return c;
}
function attestation(d,role='engineering',changes={}){
 return {schema_version:1,classification:'internal',subject:{kind:'document',id:d.metadata.id,digest:d.digest},reviewer:role==='security'?'security-reviewer':'reviewer',role,date:today,decision:'approved',statement:'Synthetic test only: reviewed this exact subject.',...changes};
}
function localSign(root,d){
 const approvals=d.metadata.required_approvals.map(role=>{const r=attestation(d,role);return {approver:r.reviewer,role,date:today,digest:d.digest,evidence:storeReviewRecord(root,r)};});
 return parseDocument(raw({...d.metadata,approvals},d.body),d.file);
}
function setDoc(root,d){fs.writeFileSync(path.join(root,d.file),raw(d.metadata,d.body));}
function loadCandidate(root,request){const r=JSON.parse(fs.readFileSync(path.join(root,request),'utf8'));return parseDocument(fs.readFileSync(path.join(root,r.candidate),'utf8'),r.target);}

test('local delegated review passes without hosted flags or HTTPS evidence',t=>{
 const d=document({status:'approved'}),root=localFixture(t,[d]);setDoc(root,localSign(root,d));assert.deepEqual(check(root).errors,[]);
});
test('local review requires delegation and detects roster changes',t=>{
 const root=localFixture(t),file=path.join(root,'repository.json'),c=JSON.parse(fs.readFileSync(file));
 c.roles.engineering.push('another-reviewer');fs.writeFileSync(file,jsonText(c));has(check(root),'subject digest mismatch');
 c.review.delegation_evidence=null;fs.writeFileSync(file,jsonText(c));has(check(root),'missing delegation evidence');
});
test('local and hosted evidence cannot silently substitute for each other',t=>{
 const d=sign(document({status:'approved'})),root=localFixture(t,[d]);has(check(root),'requires local evidence');
 const local=localSign(root,d);setDoc(root,local);const c=config();fs.writeFileSync(path.join(root,'repository.json'),jsonText(c));has(check(root),'requires HTTPS evidence');
});
test('local references reject traversal and record content-address tampering',t=>{
 const root=localFixture(t),d=document({status:'approved'}),r=attestation(d),ref=storeReviewRecord(root,r);
 assert.throws(()=>readReviewRecord(root,'local:reviews/records/../../outside.json'),/Invalid local evidence reference/);
 const file=path.join(root,ref.slice(6));r.statement='Changed after storage';fs.writeFileSync(file,jsonText(r));has(check(root),'filename digest mismatch');
});
test('local approvals bind subject, reviewer, role, date, and approval decision',t=>{
 const d=document({status:'approved'}),root=localFixture(t,[d]);
 const variants=[
  {subject:{kind:'document',id:'STD-999',digest:d.digest}},
  {subject:{kind:'document',id:d.metadata.id,digest:'b'.repeat(64)}},
  {reviewer:'another-reviewer'},
  {role:'security'},
  {date:'2026-10-22'},
  {decision:'rejected'}
 ];
 for(const variation of variants){
  const ref=storeReviewRecord(root,attestation(d,'engineering',variation));
  setDoc(root,parseDocument(raw({...d.metadata,approvals:[{approver:'reviewer',role:'engineering',date:today,digest:d.digest,evidence:ref}]},d.body),d.file));
  assert.ok(check(root).errors.some(e=>e.startsWith('Local evidence:')),JSON.stringify(variation));
 }
});
test('record storage rejects malformed, future, inconsistent, and secret-bearing claims',t=>{
 const root=localFixture(t),r=attestation(document());
 assert.throws(()=>storeReviewRecord(root,{...r,unexpected:true}),/unknown field/);
 assert.throws(()=>storeReviewRecord(root,{...r,date:'2099-01-01'}),/future/);
 assert.throws(()=>storeReviewRecord(root,{...r,role:'release'}),/role does not match/);
 assert.throws(()=>storeReviewRecord(root,{...r,statement:['AKIA','A'.repeat(16)].join('')}),/value suppressed/);
});
test('preparation leaves live drafts unchanged and application requires in-review source',t=>{
 const root=localFixture(t),source=fs.readFileSync(path.join(root,'standards/test.md'),'utf8');
 const request=prepareReview(root,'standards/test.md'),candidate=loadCandidate(root,request),ref=storeReviewRecord(root,attestation(candidate));
 assert.equal(fs.readFileSync(path.join(root,'standards/test.md'),'utf8'),source);
 assert.throws(()=>applyReview(root,request,[ref]),/must be in-review/);
 const submitted=document({status:'in-review'});setDoc(root,submitted);
 const fresh=prepareReview(root,'standards/test.md');assert.notEqual(fresh,request);
});
test('review application rejects stale source and modified candidate without changing live content',t=>{
 const root=localFixture(t,[document({status:'in-review'})]),request=prepareReview(root,'standards/test.md'),d=loadCandidate(root,request),ref=storeReviewRecord(root,attestation(d));
 const target=path.join(root,'standards/test.md'),original=fs.readFileSync(target,'utf8');fs.appendFileSync(target,'\n');
 assert.throws(()=>applyReview(root,request,[ref]),/Source changed/);assert.equal(fs.readFileSync(target,'utf8'),original+'\n');
 fs.writeFileSync(target,original);const r=JSON.parse(fs.readFileSync(path.join(root,request)));fs.appendFileSync(path.join(root,r.candidate),'\nChanged.\n');
 assert.throws(()=>applyReview(root,request,[ref]),/digest mismatch/);assert.equal(fs.readFileSync(target,'utf8'),original);
});
test('review application enforces independent approval and complete security coverage',t=>{
 const d=document({status:'in-review',required_approvals:['engineering','security']},undefined,'standards/security/test.md'),root=localFixture(t,[d]),request=prepareReview(root,d.file),candidate=loadCandidate(root,request),ref=storeReviewRecord(root,attestation(candidate));
 assert.throws(()=>applyReview(root,request,[ref]),/missing security approval/);
 assert.equal(parseDocument(fs.readFileSync(path.join(root,d.file),'utf8')).metadata.status,'in-review');
 const second=storeReviewRecord(root,attestation(candidate,'security'));assert.equal(applyReview(root,request,[ref,second]).id,d.metadata.id);
 const self=document({status:'in-review',authors:['reviewer']},undefined,'standards/self.md');setDoc(root,self);const req=prepareReview(root,self.file),c=loadCandidate(root,req),selfRef=storeReviewRecord(root,attestation(c));assert.throws(()=>applyReview(root,req,[selfRef]),/author cannot approve/);
});
test('committed local review records cannot be deleted from later baselines',t=>{
 const root=localFixture(t),c=JSON.parse(fs.readFileSync(path.join(root,'repository.json'))),ref=c.review.delegation_evidence,base=commitFixture(root);
 fs.unlinkSync(path.join(root,ref.slice(6)));has(check(root,{base}),'review records are immutable');
});
test('local document review and release complete with an immutable local Git pin',t=>{
 const root=localFixture(t,[document({status:'in-review'})]),base=commitFixture(root),request=prepareReview(root,'standards/test.md'),candidate=loadCandidate(root,request),ref=storeReviewRecord(root,attestation(candidate));
 applyReview(root,request,[ref]);
 const file=prepareRelease(root,'1.0.0',['release-author'],['STD-101'],['Synthetic fixture baseline.']);
 const m=JSON.parse(fs.readFileSync(path.join(root,file))),releaseRef=storeReviewRecord(root,{schema_version:1,classification:'internal',subject:{kind:'release',id:m.version,digest:digestJson(m,['approval'])},reviewer:'release-reviewer',role:'release',date:today,decision:'approved',statement:'Synthetic test only: release scope and exact manifest reviewed.'});
 const output=finalizeRelease(root,file,releaseRef);assert.equal(output,'releases/manifests/1.0.0.json');assert.deepEqual(check(root,{base,release:output}).errors,[]);
 const commit=commitFixture(root),git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();git(['tag','v1.0.0']);assert.equal(git(['rev-parse','refs/tags/v1.0.0^{commit}']),commit);
 const pinned=JSON.parse(git(['show',commit+':'+output]));assert.equal(pinned.approval.digest,digestJson(pinned,['approval']));assert.throws(()=>finalizeRelease(root,file,releaseRef),/already exists/);
});
test('release candidates require approved closure and independent release approval',t=>{
 const root=localFixture(t);assert.throws(()=>prepareRelease(root,'1.0.0',['release-author'],['STD-101'],['Test.']),/requires approved documents/);
 const d=localSign(root,document({status:'approved'}));setDoc(root,d);
 const file=prepareRelease(root,'1.0.0',['release-reviewer'],['STD-101'],['Synthetic fixture.']),m=JSON.parse(fs.readFileSync(path.join(root,file))),ref=storeReviewRecord(root,{schema_version:1,classification:'internal',subject:{kind:'release',id:m.version,digest:digestJson(m,['approval'])},reviewer:'release-reviewer',role:'release',date:today,decision:'approved',statement:'Synthetic test only.'});
 assert.throws(()=>finalizeRelease(root,file,ref),/author cannot approve/);assert.equal(fs.existsSync(path.join(root,'releases/manifests/1.0.0.json')),false);
});
test('local application pins accept an absolute file URI but still require an exact commit',()=>{
 const pin={repository:'file:///C:/internal/system-documents',release:'v1.0.0',commit:'a'.repeat(40),manifest:'releases/manifests/1.0.0.json'};
 assert.deepEqual(validateSchema(schema('standards-lock'),pin),[]);pin.commit='main';assert.ok(validateSchema(schema('standards-lock'),pin).length);
});

test('audit: nested work folders remain governed while root scratch stays excluded',t=>{
 const nested=document({id:'STD-102'},undefined,'standards/work/nested.md'),root=fixture(t,[document(),nested]);
 fs.mkdirSync(path.join(root,'work'),{recursive:true});fs.writeFileSync(path.join(root,'work/ignored.md'),'Scratch without metadata.\n');
 const result=check(root);assert.deepEqual(result.errors,[]);assert.equal(result.documents.length,2);
});
function replaceCandidate(root,requestFile,transform){
 const request=JSON.parse(fs.readFileSync(path.join(root,requestFile))),d=loadCandidate(root,requestFile),changed=transform(d);
 const candidate=parseDocument(raw(changed.metadata,changed.body),request.target);
 fs.writeFileSync(path.join(root,request.candidate),raw(candidate.metadata,candidate.body));request.candidate_digest=candidate.digest;fs.writeFileSync(path.join(root,requestFile),jsonText(request));return candidate;
}
test('audit: valid attestations cannot authorize a candidate revision decrease',t=>{
 const d=document({status:'in-review',revision:3}),root=localFixture(t,[d]),request=prepareReview(root,d.file),candidate=replaceCandidate(root,request,d=>{d.metadata.revision=2;return d;}),ref=storeReviewRecord(root,attestation(candidate));
 assert.throws(()=>applyReview(root,request,[ref]),/revision decreased/);assert.equal(parseDocument(fs.readFileSync(path.join(root,d.file),'utf8')).metadata.revision,3);
});
test('audit: applying a candidate cannot silently remove required review roles',t=>{
 const d=document({status:'in-review',required_approvals:['engineering','security']}),root=localFixture(t,[d]),request=prepareReview(root,d.file),candidate=replaceCandidate(root,request,d=>{d.metadata.required_approvals=['engineering'];return d;}),ref=storeReviewRecord(root,attestation(candidate));
 assert.throws(()=>applyReview(root,request,[ref]),/required review roles/);assert.equal(parseDocument(fs.readFileSync(path.join(root,d.file),'utf8')).metadata.status,'in-review');
});
test('audit: lifecycle and release control IDs retain security review even after a move',t=>{
 for(const id of ['GOV-002','GOV-004','GOV-011']){
  const d=sign(document({id,status:'approved'},undefined,'governance/moved-control.md'));has(check(fixture(t,[d])),'security review is required');
 }
});
test('audit: retired evidence survives reviewer departure while active authority fails closed',t=>{
 const d=document({status:'retired'}),root=localFixture(t,[d]);setDoc(root,localSign(root,d));
 const c=JSON.parse(fs.readFileSync(path.join(root,'repository.json')));c.roles.engineering=[];attestDelegation(root,c);
 assert.deepEqual(check(root).errors,[]);
 const active=document({status:'approved'});setDoc(root,localSign(root,active));has(check(root),'not delegated');
});
test('audit: review preparation rejects invalid metadata before creating a package',t=>{
 const d=document({id:'invalid-id'}),root=localFixture(t,[d]);assert.throws(()=>prepareReview(root,d.file),/invalid format/);assert.equal(fs.existsSync(path.join(root,'work/review-requests')),false);
});
test('audit: approved release pointers reject arbitrary strings',()=>{
 const c=config();c.approved_release='main';assert.ok(validateSchema(schema('repository'),c).length);c.approved_release='v1.2.3';assert.deepEqual(validateSchema(schema('repository'),c),[]);
});
test('audit: bearer fixture structural checks reject missing 401 challenges',t=>{
 const root=fixture(t),pack=path.join(root,'examples/validation-job');fs.mkdirSync(path.dirname(pack),{recursive:true});fs.cpSync(path.join(repo,'examples/validation-job'),pack,{recursive:true});
 const file=path.join(pack,'openapi.json'),spec=JSON.parse(fs.readFileSync(file));delete spec.paths['/v1/validation-jobs'].post.responses['401'].headers;fs.writeFileSync(file,jsonText(spec));
 assert.throws(()=>execFileSync(process.execPath,[path.join(pack,'check-artifacts.mjs')],{stdio:['ignore','pipe','pipe']}));
});

test('audit: a new retirement still requires current delegated approval against its baseline',t=>{
 const initial=document({status:'deprecated'}),root=localFixture(t,[initial]);setDoc(root,localSign(root,initial));const base=commitFixture(root);
 const c=JSON.parse(fs.readFileSync(path.join(root,'repository.json')));c.roles.engineering=[];attestDelegation(root,c);
 const retired=document({status:'retired',revision:2});setDoc(root,localSign(root,retired));has(check(root,{base}),'not delegated');
});

test('audit: changing approved review rules needs the previous role authority',()=>{
 const old=sign(document({status:'approved',required_approvals:['engineering','security']}));
 const next=sign(document({status:'approved',revision:2,required_approvals:['engineering']}));
 has({errors:compareBaseline([old],[next])},'previous security role approval');
 next.metadata.approvals.push({approver:'security-reviewer',role:'security',date:today,digest:next.digest,evidence:'https://example.invalid/review/policy-change'});
 assert.deepEqual(compareBaseline([old],[next]),[]);
});

test('coherence: no-profile adoption requires an actual workload description and rationale',()=>{
 const adoption={application:'synthetic-processor',owner:'fixture-owner',technologies:['python'],workloads:[],lock_file:'standards-lock.json',exceptions:[],workload_description:'Continuous local computation; no API, calendar trigger, finite input run, messages, durable state, or remote effects.',profile_selection_rationale:'Reviewed the five specialized profiles; none matches this described behavior.'};
 assert.deepEqual(validateSchema(schema('adoption'),adoption),[]);
 for(const field of ['workload_description','profile_selection_rationale']){
  const missing=structuredClone(adoption);delete missing[field];assert.ok(validateSchema(schema('adoption'),missing).some(e=>e.includes('missing '+field)));
  assert.ok(validateSchema(schema('adoption'),{...adoption,[field]:'   '}).length);
 }
 assert.ok(validateSchema(schema('adoption'),{...adoption,workloads:['scheduler','scheduler']}).some(e=>e.includes('duplicate items')));
 const template=JSON.parse(fs.readFileSync(path.join(repo,'templates/application-docs/standards-adoption.json'),'utf8'));
 assert.ok(validateSchema(schema('adoption'),template).length,'Unfilled template is not completed adoption');
});

const supportRequirements=['GOV-TECH-001','GOV-TECH-002','GOV-TECH-003','GOV-TECH-004','GOV-TECH-005'];
function supportFixtureDocuments(changes={}){
 const source=document({id:'GOV-010',type:'governance',requirements:supportRequirements},'# Fixture standard\n\n'+supportRequirements.map(id=>'### '+id+' — Fixture obligation\n\nSynthetic fixture obligation.\n').join('\n'),'governance/support.md');
 const decision=document({id:'ARC-201',type:'technology-support-decision',required_approvals:['engineering','security'],applicability:{technologies:['python'],workloads:[]},depends_on:['GOV-010'],requires:supportRequirements,...changes},'# Fixture standard\n\nSynthetic support parameters; no product is actually approved.\n','architecture/decisions/support.md');
 return [source,decision];
}
test('coherence: support parameter decisions validate and retain their discovery type',t=>{
 const docs=supportFixtureDocuments();assert.deepEqual(check(fixture(t,docs)).errors,[]);
 assert.equal(catalogOf(docs).documents.find(d=>d.id==='ARC-201').type,'technology-support-decision');
 assert.deepEqual(docs[1].metadata.requirements,[]);
});
test('coherence: support decisions cannot omit affected technology or owning requirements',t=>{
 for(const [change,message] of [
  [{applicability:{technologies:[],workloads:[]}},'support decision must declare affected technologies'],
  [{depends_on:[]},'support decision must depend on GOV-010'],
  [{requires:supportRequirements.slice(1)},'support decision must reference GOV-TECH-001']
 ])has(check(fixture(t,supportFixtureDocuments(change))),message);
});
test('coherence: support decisions require security review and cannot own new obligations',t=>{
 has(check(fixture(t,supportFixtureDocuments({required_approvals:['engineering']}))),'security review is required');
 has(check(fixture(t,supportFixtureDocuments({requirements:['TECH-SUPPORT-001']}))),'this document type cannot own normative requirements');
});
