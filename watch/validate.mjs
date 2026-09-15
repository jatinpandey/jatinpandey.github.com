import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {parts,findParts} from './components.js';
import {movementAt,TAU} from './mechanics.js';
import {flow,phases,displayBranch} from './flow.js';
// Every energy-flow step must name a real part and physically connect to the step before it.
const byId=id=>parts.find(p=>p.id===id),connected=(a,b)=>byId(a).links.includes(b)||byId(b).links.includes(a);
for(const [i,step] of flow.entries()){assert.ok(byId(step.part),step.part);assert.ok(phases[step.phase],step.phase);for(const field of ['title','what','handoff'])assert.ok(step[field],`${step.part} ${field}`);for(const id of step.supporting??[])assert.ok(byId(id),id);if(i)assert.ok(connected(flow[i-1].part,step.part),`${flow[i-1].part} → ${step.part}`)}
assert.equal(flow[0].part,'crown');assert.equal(flow.at(-1).part,'hairspring');assert.ok(flow.some(s=>s.part===flow.at(-1).loopsBackTo),'loop target');
assert.ok(flow.some(s=>s.part===displayBranch.from));displayBranch.steps.reduce((prev,s)=>{assert.ok(connected(prev,s.part),`${prev} → ${s.part}`);return s.part},displayBranch.from);
assert.equal(parts.length,20);assert.equal(new Set(parts.map(p=>p.id)).size,20);
for(const p of parts){for(const field of ['name','what','role','how'])assert.ok(p[field]);for(const link of p.links)assert.ok(parts.some(p=>p.id===link),link)}
assert.ok(findParts('oscillator').some(p=>p.id==='balance'));assert.ok(findParts('energy').some(p=>p.id==='mainspring'));assert.ok(findParts('center').some(p=>p.id==='centre'));assert.deepEqual(findParts('not-a-part-xyz'),[]);
const afterMinute=movementAt(60);assert.ok(Math.abs(afterMinute.fourth+TAU)<1e-9);assert.ok(Math.abs(movementAt(3600).centre+TAU)<1e-9);assert.ok(Math.abs(movementAt(.2).escape-TAU/30)<1e-9);
assert.equal(movementAt(.1).escape,movementAt(.18).escape,'escape wheel must dwell while locked');
const html=readFileSync('index.html','utf8');for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(!/^https?:/.test(match[1]))assert.ok(existsSync(match[1]),match[1])}const ids=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length,'unique HTML ids');console.log('Validated: 20 descriptions, component connections, energy-flow order, search aliases, gear ratios, escapement dwell, HTML IDs and local assets.');
