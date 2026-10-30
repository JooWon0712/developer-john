import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

// All commands are fixture shims. No NAS, Docker daemon or authenticated API is used.
const bash = process.env.NAS_TEST_BASH || (process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : 'bash');
const posix = value => process.platform === 'win32' ? value.replaceAll('\\', '/').replace(/^([A-Za-z]):/, (_, drive) => `/${drive.toLowerCase()}`) : value;
const quote = value => `'${value.replaceAll("'", "'\\''")}'`;
const source = fs.readFileSync(new URL('./register-nas-project.sh', import.meta.url), 'utf8');
const ownId = 'a'.repeat(64), otherId = 'b'.repeat(64);
const projectId = '22222222-2222-2222-2222-222222222222';
const otherProjectId = '11111111-1111-1111-1111-111111111111';

function mockCommand() {
const fs = require('node:fs');
const fix = value => process.platform === 'win32' ? value.replace(/^\/([A-Za-z])\//, (_, drive) => drive.toUpperCase() + ':/') : value;
const apiRoot = process.platform === 'win32' ? process.env.TEST_APP_ROOT.replace(/^([A-Za-z]):/, (_, drive) => '/' + drive.toLowerCase()) : process.env.TEST_APP_ROOT;
const statePath = fix(process.env.TEST_REGISTER_STATE);
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const [command, ...args] = process.argv.slice(2);
function save() { fs.writeFileSync(statePath, JSON.stringify(state)); }
function output(value) { process.stdout.write(JSON.stringify(value) + '\n'); }
if (command === 'id') { console.log('0'); process.exit(0); }
if (command === 'docker') {
  state.dockerCalls.push(args[0]); save();
  if (args[0] === 'ps') { console.log(state.containers.map(c => c.id).join('\n')); process.exit(0); }
  if (args[0] === 'inspect') {
    const c = state.containers.find(c => c.id === args.at(-1));
    if (!c) process.exit(1);
    output(c); process.exit(0);
  }
  throw new Error('A Docker mutation was requested: ' + args[0]);
}
if (command === 'synowebapi') {
  const fields = Object.fromEntries(args.filter(a => a.includes('=')).map(a => { const at=a.indexOf('=');return [a.slice(0,at),a.slice(at+1)]; }));
  if (fields.api !== 'SYNO.Docker.Project' || fields.version !== '1' || !['list','get','create'].includes(fields.method)) throw new Error('Forbidden API request');
  const params = Object.fromEntries(Object.entries(fields).filter(([key]) => !['api','version','method'].includes(key)).map(([key,value]) => [key,JSON.parse(value)]));
  state.apiCalls.push({method:fields.method,params}); save();
  if (fields.method === 'list') { output({success:true,data:state.listArray ? [] : state.projects}); process.exit(0); }
  if (fields.method === 'get') { output({success:true,data:state.projects[params.id]}); process.exit(0); }
  if (state.rejectCreate) { output({success:false,error:{code:104,content:'RAW_SECRET_SENTINEL'}}); process.exit(0); }
  if (state.recreate) state.containers.find(c => c.project === 'developer-john').id = 'c'.repeat(64);
  state.projects[process.env.TEST_PROJECT_ID] = {
    name:params.name,share_path:params.share_path,path:apiRoot,status:'running',
    content:params.content,containerIds:state.missingAssociation ? [] : state.containers.filter(c=>c.project==='developer-john').map(c=>c.id),
  };
  if (state.omitAssociation) delete state.projects[process.env.TEST_PROJECT_ID].containerIds;
  save(); output({success:true,data:{id:process.env.TEST_PROJECT_ID,name:params.name}}); process.exit(0);
}
if (command !== 'jq') throw new Error('Unknown fixture command');
let flags='', query, files=[], vars={};
for(let i=0;i<args.length;i++) {
  const a=args[i];
  if(a==='--arg'||a==='--argjson') { const key=args[++i],value=args[++i];vars[key]=a==='--argjson'?JSON.parse(value):value; }
  else if(a.startsWith('-')) flags+=a.slice(1);
  else if(query===undefined) query=a;
  else files.push(a);
}
const q=query.replace(/\s+/g,' ').trim();
const raw=files.map(f=>fs.readFileSync(fix(f),'utf8')).join('');
let input=flags.includes('n')?null:flags.includes('R')?raw:flags.includes('s')?raw.trim().split('\n').filter(Boolean).map(JSON.parse):JSON.parse(raw);
let result, sequence=false;
const entries=()=>Object.entries(input.data).map(([key,value])=>({key,value}));
if(q==='$value') result=vars.value;
else if(q==='.') result=input;
else if(q==='sort_by(.id)') result=input.sort((a,b)=>a.id.localeCompare(b.id));
else if(q==='.success == true') result=input.success===true;
else if(q==='.error.code // "unknown"') result=input.error?.code??'unknown';
else if(q==='.data | type == "object"') result=input.data!==null&&typeof input.data==='object'&&!Array.isArray(input.data);
else if(q==='.data | to_entries | map(select(.value.name == $project)) | length') result=entries().filter(e=>e.value.name===vars.project).length;
else if(q==='.data | to_entries[] | select(.value.name == $project) | .key') { result=entries().filter(e=>e.value.name===vars.project).map(e=>e.key);sequence=true; }
else if(q==='.data[$id]') result=input.data[vars.id];
else if(q==='.data') result=input.data;
else if(q.startsWith('.data | to_entries | map({id: .key,')) result=entries().map(e=>({id:e.key,name:e.value.name,status:e.value.status??null,container_count:(e.value.containerIds??[]).length})).sort((a,b)=>a.id.localeCompare(b.id));
else if(q.startsWith('.name == $project and')) {
 const s=input.share_path??'',p=input.path??'';
 const allowed=[vars.root,vars.share,vars.root+'/docker-compose.yaml',vars.share+'/docker-compose.yaml'];
 result=input.name===vars.project&&(s===''||s===vars.share)&&(p===''||allowed.includes(p))&&(s===vars.share||allowed.includes(p));
}
else if(q.startsWith('[.[] | select(.project == $project and .service == "web")] as $own')) {
 const own=input.filter(c=>c.project===vars.project&&c.service==='web');
 result=own.length===1&&own[0].running===true&&own[0].image.endsWith(':'+vars.release);
}
else if(q==='[.[] | select(.project == $project and .service == "web") | .id]') result=input.filter(c=>c.project===vars.project&&c.service==='web').map(c=>c.id);
else if(q==='has("containerIds")') result=Object.hasOwn(input,'containerIds');
else if(q==='.containerIds | type == "array"') result=Array.isArray(input.containerIds);
else if(q==='($own - .containerIds) | length == 0') result=vars.own.every(id=>input.containerIds.includes(id));
else throw new Error('Unsupported jq test expression: '+q);
const values=sequence?result:[result];
for(const value of values) process.stdout.write((flags.includes('r')&&typeof value==='string'?value:JSON.stringify(value))+'\n');
if(flags.includes('e')&&(values.length===0||values.at(-1)===false||values.at(-1)===null)) process.exit(1);
}
const mockSource = `(${mockCommand.toString()})();`;

function fixture(options = {}) {
  fs.mkdirSync('.cache', { recursive:true });
  const root=fs.mkdtempSync(path.resolve('.cache/nas-register-test-'));
  const app=path.join(root,'developer-john'), bin=path.join(root,'bin'), temp=path.join(root,'tmp');
  for(const dir of [path.join(app,'logs'),bin,temp]) fs.mkdirSync(dir,{recursive:true});
  const release='current-release';
  const manifest=`name: developer-john\nservices:\n  web:\n    image: developer-john:${release}\n    environment:\n      PUBLIC_TEXT: "CONTENT_SENTINEL and 'quotes'"\n`;
  fs.writeFileSync(path.join(app,'.deployment-owner'),'developer-john\n');
  fs.writeFileSync(path.join(app,'current-release'),release+'\n');
  fs.writeFileSync(path.join(app,'docker-compose.yaml'),manifest);
  fs.writeFileSync(path.join(app,`logs/${release}.compose.yaml`),manifest);
  const stateFile=path.join(root,'state.json');
  const containers=[{id:ownId,project:'developer-john',service:'web',image:`developer-john:${release}`,running:true},{id:otherId,project:'m0n_r',service:'mon-r',image:'mon-r:local',running:true}];
  const projects={[otherProjectId]:{name:'m0n_r',share_path:'/docker/m0n_r',status:'running',containerIds:[otherId]}};
  if(options.existing) projects[projectId]={name:'developer-john',share_path:options.wrongPath?'/docker/another-app':'/docker/developer-john',path:posix(app),status:'running',containerIds:[ownId]};
  fs.writeFileSync(stateFile,JSON.stringify({containers,projects,apiCalls:[],dockerCalls:[],...options}));
  const mock=path.join(root,'mock.cjs');fs.writeFileSync(mock,mockSource);
  for(const command of ['docker','synowebapi','jq','id']) fs.writeFileSync(path.join(bin,command),`#!/bin/sh\nexec ${quote(posix(process.execPath))} ${quote(mock.replaceAll('\\','/'))} ${quote(command)} "$@"\n`,{mode:0o755});
  fs.writeFileSync(path.join(bin,'sleep'),'#!/bin/sh\nexit 0\n',{mode:0o755});
  const runner=path.join(root,'register.sh');
  assert.ok(source.includes('share_path="/docker/$project"'));
  fs.writeFileSync(runner,source.replace('share_path="/docker/$project"','share_path="/docker/$project"\napp_root="$TEST_APP_ROOT"\nPATH="$TEST_FAKE_BIN:$PATH"'));
  return {app,manifest,temp,readState:()=>JSON.parse(fs.readFileSync(stateFile,'utf8')),run(){
    return spawnSync(bash,[posix(runner),'/volume1/docker/developer-john','developer-john',release],{encoding:'utf8',timeout:30_000,env:{...process.env,MSYS2_ARG_CONV_EXCL:'*',TMPDIR:posix(temp),TEST_FAKE_BIN:posix(bin),TEST_REGISTER_STATE:posix(stateFile),TEST_APP_ROOT:posix(app),TEST_PROJECT_ID:projectId}});
  }};
}
function success(result){assert.equal(result.status,0,result.stdout+result.stderr+(result.error?.message??''));}
function verifiedReadOnly(f){assert.deepEqual([...new Set(f.readState().dockerCalls)].sort(),['inspect','ps']);assert.deepEqual(fs.readdirSync(f.temp),[]);}

test('new DSM metadata uses encoded content without any container actions',()=>{
  const f=fixture();const result=f.run();success(result);
  const state=f.readState();const creates=state.apiCalls.filter(c=>c.method==='create');assert.equal(creates.length,1);
  assert.deepEqual(creates[0].params,{name:'developer-john',share_path:'/docker/developer-john',content:f.manifest,enable_service_portal:false,service_portal_name:'',service_portal_port:0,service_portal_protocol:''});
  assert.deepEqual(state.containers.map(c=>c.id),[ownId,otherId]);
  assert.equal(state.projects[otherProjectId].name,'m0n_r');
  assert.doesNotMatch(result.stdout+fs.readFileSync(path.join(f.app,'logs/current-release.registration.log'),'utf8'),/CONTENT_SENTINEL|RAW_SECRET_SENTINEL/);
  verifiedReadOnly(f);
});
test('an existing matching registration is reused without create',()=>{
  const f=fixture({existing:true});success(f.run());assert.equal(f.readState().apiCalls.filter(c=>c.method==='create').length,0);verifiedReadOnly(f);
});
test('an existing name at another path is rejected without changes',()=>{
  const f=fixture({existing:true,wrongPath:true});const result=f.run();assert.notEqual(result.status,0);assert.match(result.stderr,/path does not match/);assert.equal(f.readState().apiCalls.filter(c=>c.method==='create').length,0);verifiedReadOnly(f);
});
test('unsupported create fails explicitly and does not leak API error content',()=>{
  const f=fixture({rejectCreate:true});const result=f.run();assert.notEqual(result.status,0);assert.match(result.stderr,/rejected or unsupported \(code=104\)/);assert.doesNotMatch(result.stdout+result.stderr,/RAW_SECRET_SENTINEL/);verifiedReadOnly(f);
});
test('a stale management manifest is rejected before authenticated API calls',()=>{
  const f=fixture();fs.appendFileSync(path.join(f.app,'docker-compose.yaml'),'stale\n');const result=f.run();assert.notEqual(result.status,0);assert.match(result.stderr,/does not match/);assert.deepEqual(f.readState().apiCalls,[]);
});
test('unexpected container recreation is reported without compensating mutations',()=>{
  const f=fixture({recreate:true});const result=f.run();assert.notEqual(result.status,0);assert.match(result.stderr,/Container state changed/);assert.equal(f.readState().containers[0].id,'c'.repeat(64));assert.equal(f.readState().apiCalls.filter(c=>c.method==='create').length,1);verifiedReadOnly(f);
});
test('missing container association only retries read-only get calls',()=>{
  const f=fixture({missingAssociation:true});const result=f.run();assert.notEqual(result.status,0);assert.match(result.stderr,/does not reference/);assert.equal(f.readState().apiCalls.filter(c=>c.method==='get').length,10);assert.equal(f.readState().apiCalls.filter(c=>c.method==='create').length,1);verifiedReadOnly(f);
});
test('a supported API without containerIds still verifies registration identity',()=>{
  const f=fixture({omitAssociation:true});success(f.run());verifiedReadOnly(f);
});
test('an unsupported project list format never attempts create',()=>{
  const f=fixture({listArray:true});const result=f.run();assert.notEqual(result.status,0);assert.match(result.stderr,/Unsupported DSM project list format/);assert.equal(f.readState().apiCalls.filter(c=>c.method==='create').length,0);verifiedReadOnly(f);
});
