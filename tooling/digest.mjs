import fs from 'node:fs';
import {parseDocument,digestJson} from './lib.mjs';
const file=process.argv[2];
if(!file||process.argv.length!==3)throw Error('Usage: node tooling/digest.mjs DOCUMENT.md|RECORD.json');
const text=fs.readFileSync(file,'utf8');
if(file.endsWith('.md'))console.log(parseDocument(text,file).digest);
else{
 const record=JSON.parse(text.replace(/^\uFEFF/,''));
 console.log(digestJson(record,Object.hasOwn(record,'approval')?['approval']:['approvals']));
}
