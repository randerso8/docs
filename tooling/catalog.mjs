import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {loadDocuments,catalogOf,jsonText} from './lib.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
if(process.argv.length>2)throw Error('catalog.mjs takes no arguments');
const documents=loadDocuments(root);
fs.mkdirSync(new URL('../catalog/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('../catalog/documents.json',import.meta.url),jsonText(catalogOf(documents)));
console.log(`Catalog generated from ${documents.length} source documents.`);
