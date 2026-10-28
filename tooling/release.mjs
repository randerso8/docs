import {fileURLToPath} from 'node:url';
import {prepareRelease,finalizeRelease} from './local-workflow.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),[command,...args]=process.argv.slice(2);
try{
 if(command==='prepare'){
  const version=args.shift(),authors=[],changes=[],ids=[];
  while(args.length){const a=args.shift();if(['--author','--change'].includes(a)){const value=args.shift();if(!value)throw Error('Missing '+a+' value');(a==='--author'?authors:changes).push(value);}else if(a.startsWith('--'))throw Error('Unknown argument');else ids.push(a);}
  console.log(prepareRelease(root,version,authors,ids,changes));
 }else if(command==='finalize'&&args.length===2)console.log(finalizeRelease(root,args[0],args[1]));
 else throw Error('Usage: node tooling/release.mjs prepare VERSION --author ID --change TEXT DOCUMENT_ID... | finalize CANDIDATE.json LOCAL_REFERENCE');
}catch(error){console.error(error.message);process.exitCode=1;}
