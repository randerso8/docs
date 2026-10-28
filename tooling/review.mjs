import {fileURLToPath} from 'node:url';
import {delegationRequest,prepareReview,storeReviewRecord,applyReview,readJson} from './local-workflow.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),[command,...args]=process.argv.slice(2);
try{
 if(command==='delegation'&&!args.length)console.log(JSON.stringify(delegationRequest(root),null,2));
 else if(command==='prepare'&&args.length===1)console.log(prepareReview(root,args[0]));
 else if(command==='store'&&args.length===1)console.log(storeReviewRecord(root,readJson(args[0])));
 else if(command==='apply'&&args.length>=2)console.log(JSON.stringify(applyReview(root,args[0],args.slice(1)),null,2));
 else throw Error('Usage: node tooling/review.mjs delegation | prepare DOCUMENT.md | store COMPLETED_RECORD.json | apply REQUEST.json LOCAL_REFERENCE...');
}catch(error){console.error(error.message);process.exitCode=1;}
