import {fileURLToPath} from 'node:url';
import {validateRepository} from './lib.mjs';
const options={};
const args=process.argv.slice(2);
while(args.length){
  const arg=args.shift();
  if(!['--base','--release'].includes(arg)||!args.length)throw Error('Usage: node tooling/validate.mjs [--base FULL_COMMIT] [--release releases/manifests/VERSION.json]');
  options[arg.slice(2)]=args.shift();
}
const result=validateRepository(fileURLToPath(new URL('../',import.meta.url)),options);
for(const warning of result.warnings)console.warn(`WARNING: ${warning}`);
for(const error of result.errors)console.error(`ERROR: ${error}`);
if(result.errors.length){console.error(`Validation failed with ${result.errors.length} error(s).`);process.exitCode=1;}
else console.log(`Validation passed: ${result.documents.length} governed documents, ${result.warnings.length} warning(s). Human identity, delegation, storage, and any host controls require external verification.`);
