import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

// Narrow documentation-fixture checks. This is not a full OpenAPI/JSON Schema validator.
const base=fileURLToPath(new URL('./',import.meta.url));
const read=file=>JSON.parse(fs.readFileSync(path.join(base,file),'utf8').replace(/^\uFEFF/,''));
const spec=read('openapi.json');
const resolve=ref=>{
 assert.ok(ref.startsWith('#/'),'Only local JSON references are supported in this fixture');
 let node=spec;
 for(const segment of ref.slice(2).split('/').map(s=>s.replaceAll('~1','/').replaceAll('~0','~'))){
  assert.ok(node && Object.hasOwn(node,segment),`Unresolved JSON reference: ${ref}`);
  node=node[segment];
 }
 return node;
};
let references=0;
function inspect(node){
 if(!node||typeof node!=='object')return;
 if(typeof node.$ref==='string'){resolve(node.$ref);references++;}
 for(const value of Object.values(node))inspect(value);
}
inspect(spec);
const methods=new Set(['get','put','post','delete','patch','head','options','trace']);
const operationIds=new Set();
for(const [route,item] of Object.entries(spec.paths)){
 for(const [method,operation] of Object.entries(item)){
  if(!methods.has(method))continue;
  if(operation.responses?.['401']){
   const challenge=operation.responses['401'].headers?.['WWW-Authenticate'];
   assert.ok(challenge,'401 responses must declare WWW-Authenticate');
   assert.match(challenge.example,/^Bearer(?:\s|$)/,'Bearer fixture needs an applicable challenge');
  }
  assert.equal(typeof operation.operationId,'string');
  assert.ok(!operationIds.has(operation.operationId),'Operation IDs must be unique');operationIds.add(operation.operationId);
  const parameters=[...(item.parameters??[]),...(operation.parameters??[])].map(p=>p.$ref?resolve(p.$ref):p);
  for(const match of route.matchAll(/\{([^}]+)\}/g))assert.ok(parameters.some(p=>p.name===match[1]&&p.in==='path'&&p.required===true),`Missing required path parameter ${match[1]}`);
 }
}
for(const security of spec.security??[])for(const name of Object.keys(security))assert.ok(Object.hasOwn(spec.components.securitySchemes,name),`Missing security scheme ${name}`);
const create=read('samples/create-request.json');
const createSchema=spec.components.schemas.CreateValidationJob;
assert.deepEqual(Object.keys(create).sort(),createSchema.required.toSorted());
assert.match(create.datasetId,new RegExp(createSchema.properties.datasetId.pattern));
assert.ok(Number.isInteger(create.datasetVersion)&&create.datasetVersion>=1&&create.datasetVersion<=2147483647);
assert.deepEqual(create,spec.paths['/v1/validation-jobs'].post.requestBody.content['application/json'].example,'Request sample drifted from embedded example');
const variants=spec.components.schemas.Job.oneOf.map(r=>resolve(r.$ref));
for(const name of ['pending','succeeded','failed']){
 const sample=read(`samples/${name}-job.json`);
 const candidates=variants.filter(v=>v.properties.status.const===sample.status);
 assert.equal(candidates.length,1,'Sample state must identify one declared variant');
 const variant=candidates[0];
 for(const property of variant.required)assert.ok(Object.hasOwn(sample,property),`Missing sample field ${property}`);
 if(variant.additionalProperties===false)for(const property of Object.keys(sample))assert.ok(Object.hasOwn(variant.properties,property),`Undeclared sample field ${property}`);
 const embedded=spec.paths['/v1/validation-jobs/{jobId}'].get.responses['200'].content['application/json'].examples[name].value;
 assert.deepEqual(sample,embedded,'Response sample drifted from embedded contract example');
 if(sample.result){
  assert.ok(Number.isInteger(sample.result.totalCount)&&Number.isInteger(sample.result.invalidCount));
  assert.ok(sample.result.invalidCount>=0&&sample.result.invalidCount<=sample.result.totalCount);
  assert.ok(sample.result.totalCount<=spec.components.schemas.ValidationResult.properties.totalCount.maximum);
 }
}
const problem=read('samples/problem.json');
for(const property of spec.components.schemas.Problem.required)assert.ok(Object.hasOwn(problem,property));
const digest=crypto.createHash('sha256').update(`validate-dataset\n${create.datasetId}\n${create.datasetVersion}\n`).digest('hex');
const fingerprint=fs.readFileSync(path.join(base,'samples/intent-fingerprint.txt'),'utf8').match(/SHA-256: ([a-f0-9]{64})/);
assert.ok(fingerprint);assert.equal(digest,fingerprint[1],'Sample canonical fingerprint drifted');
console.log(`Reference structure passed: ${operationIds.size} operations, ${references} local JSON references, sample states/fields, and canonical fingerprint.`);
console.log('Full OpenAPI/JSON Schema validation and SQL/framework/security/concurrency execution remain pending.');
