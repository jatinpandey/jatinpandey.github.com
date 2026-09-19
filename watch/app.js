import {parts,findParts} from './components.js';
import {createWatch} from './model.js?v=20260918-6';
import {flow,phases,displayBranch} from './flow.js';
const $=s=>document.querySelector(s);let model,selected=null;
function select(id,options){const p=parts.find(p=>p.id===id);if(!p)return false;stopFlow(true);selected=id;model?.select(id,options);$('#detail').hidden=false;document.body.classList.add('detail-open');$('#detail-category').textContent=p.category;$('#detail-title').textContent=p.name;$('#detail-summary').textContent=p.summary;$('#detail-what').textContent=p.what;$('#detail-role').textContent=p.role;$('#detail-how').textContent=p.how;$('#connection-list').hidden=true;$('#connections').textContent='Show connected parts';$('#connection-list').replaceChildren();for(const link of p.links){const connected=parts.find(x=>x.id===link);const b=document.createElement('button');b.textContent=connected.name;b.onclick=()=>select(link);$('#connection-list').append(b)}$('#search-results').hidden=true;return true}
function clear(){selected=null;model?.select(null);$('#detail').hidden=true;document.body.classList.remove('detail-open')}
$('#detail-close').onclick=clear;$('#focus-part').onclick=()=>selected&&model?.focus(selected);$('#connections').onclick=()=>{$('#connection-list').hidden=!$('#connection-list').hidden;$('#connections').textContent=$('#connection-list').hidden?'Show connected parts':'Hide connected parts'};
// Guided walkthrough: step through flow.js, one part at a time, from crown to hairspring.
// Its start button is removed for now, so nothing opens the sheet; the stepper itself still works.
const flowStart=$('#flow-start');
let step=-1;
const track=$('#flow-track');
flow.forEach((s,i)=>{const dot=document.createElement('button');dot.className='flow-dot';dot.dataset.phase=s.phase;dot.title=`${i+1}. ${s.title}`;dot.setAttribute('aria-label',`Step ${i+1}: ${s.title}`);if(i&&s.phase!==flow[i-1].phase)dot.classList.add('phase-start');dot.onclick=()=>goTo(i);track.append(dot)});
function goTo(i){step=i;const s=flow[i],last=i===flow.length-1;
 $('#flow-phase').textContent=phases[s.phase];
 $('#flow-title').textContent=s.title;$('#flow-what').textContent=s.what;$('#flow-handoff').textContent=s.handoff;
 const branch=displayBranch.from===s.part;$('#flow-branch').hidden=!branch;
 if(branch)$('#flow-branch').textContent=`${displayBranch.title} — ${displayBranch.steps.map(b=>parts.find(p=>p.id===b.part).name).join(' → ')}.`;
 // The last step glows at the escape wheel it hands back to, even though Next restarts.
 const nextPart=last?s.loopsBackTo:flow[i+1].part;
 model?.flowStep({part:s.part,supporting:s.supporting,done:flow.slice(0,i).flatMap(d=>[d.part,...(d.supporting??[])]),next:nextPart});
 $('#flow-back').disabled=i===0;$('#flow-next').textContent=last?'Start over':'Next';renderBar();
 [...track.children].forEach((dot,n)=>{dot.classList.toggle('current',n===i);dot.classList.toggle('done',n<i)});
}
// Collapsed leaves the bar, progress track and Back/Next, so the watch stays visible.
let collapsed=false;
function renderBar(){const s=flow[step];$('#flow-count').textContent=collapsed&&s?`Step ${step+1} of ${flow.length} · ${s.title}`:`Step ${step+1} of ${flow.length}`}
function setCollapsed(v){collapsed=v;$('#flow-body').hidden=v;$('#flow-toggle').textContent=v?'▴':'▾';$('#flow-toggle').setAttribute('aria-expanded',String(!v));$('#flow-toggle').setAttribute('aria-label',`${v?'Expand':'Collapse'} walkthrough`);renderBar()}
$('#flow-toggle').onclick=()=>setCollapsed(!collapsed);
function startFlow(){clear();$('#flow').hidden=false;if(flowStart)flowStart.hidden=true;goTo(0);$('#flow-next').focus()}
// Leaves the walkthrough. A part picked on the model or in search takes over the highlight itself.
function stopFlow(keepHighlight){if(step<0)return;step=-1;$('#flow').hidden=true;if(flowStart)flowStart.hidden=false;if(!keepHighlight)model?.select(null)}
if(flowStart)flowStart.onclick=startFlow;$('#flow-close').onclick=()=>stopFlow();
$('#flow-back').onclick=()=>step>0&&goTo(step-1);
// The last step still points at the escape wheel it hands back to, but Next starts again at step 1.
$('#flow-next').onclick=()=>goTo(step===flow.length-1?0:step+1);
const search=$('#search'),results=$('#search-results');function updateSearch(){const q=search.value.trim();results.replaceChildren();if(!q){results.hidden=true;return}const matches=findParts(q);results.hidden=false;if(!matches.length){const p=document.createElement('p');p.textContent='No components found. Try “spring” or “seconds”.';results.append(p);return}for(const p of matches){const button=document.createElement('button');const label=document.createElement('span');label.textContent=p.name;const meta=document.createElement('small');meta.textContent=p.category;button.append(label,meta);button.onclick=()=>{select(p.id);search.value=p.name;search.focus()};results.append(button)}}search.oninput=updateSearch;search.onfocus=()=>{if(search.value)updateSearch()};search.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();results.querySelector('button')?.focus()}if(e.key==='Enter'){const match=findParts(search.value)[0];if(match){select(match.id);search.value=match.name}}if(e.key==='Escape'){results.hidden=true;search.blur()}};results.onkeydown=e=>{const buttons=[...results.querySelectorAll('button')],i=buttons.indexOf(document.activeElement);if(e.key==='ArrowDown'){e.preventDefault();buttons[(i+1)%buttons.length]?.focus()}if(e.key==='ArrowUp'){e.preventDefault();if(i===0)search.focus();else buttons[i-1]?.focus()}if(e.key==='Escape'){results.hidden=true;search.focus()}};document.addEventListener('pointerdown',e=>{if(!e.target.closest('.search-wrap'))results.hidden=true});
function playUI(){const playing=model?.isPlaying()??false;$('#play').textContent=playing?'Ⅱ':'▶';$('#play').setAttribute('aria-label',playing?'Pause animation':'Play animation')}
$('#play').onclick=()=>{model?.setPlaying(!model.isPlaying());playUI()};$('#step').onclick=()=>{model?.step();playUI()};$('#speed').onchange=e=>model?.setSpeed(Number(e.target.value));$('#explode').oninput=e=>{const v=Number(e.target.value);$('#explode-value').textContent=`${v}%`;model?.setExplode(v/100)};
const about=$('#about');$('#about-open').onclick=()=>about.showModal();$('#about-close').onclick=()=>about.close();about.addEventListener('click',e=>{if(e.target===about){const r=about.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)about.close()}});
document.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(e.key==='/'){e.preventDefault();search.focus()}if(e.key==='Escape'){if(about.open)about.close();else if(step>=0)stopFlow();else clear()}if(step>=0&&!about.open){if(e.key==='ArrowRight'){e.preventDefault();$('#flow-next').click()}if(e.key==='ArrowLeft'){e.preventDefault();$('#flow-back').click()}}if(e.code==='Space'&&document.activeElement===document.body&&!about.open){e.preventDefault();$('#play').click()}});
// Tapping empty space around the watch clears the selection.
try{model=createWatch($('#viewport'),select,clear);$('#loading').hidden=true;playUI()}catch(error){$('#loading').hidden=true;$('#error').hidden=false;console.error('Watch rendering failed',error);document.querySelectorAll('.transport button,.transport input,.transport select,#focus-part,#flow-start').forEach(b=>b.disabled=true)}
// The same search and selection actions are available to supporting agents.
if(document.modelContext?.registerTool){const lifecycle=new AbortController();const specs=[{name:'find_watch_components',description:'Find watch components by name, synonym, or role.',inputSchema:{type:'object',properties:{query:{type:'string',minLength:1}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:true},execute(input){if(!input||typeof input.query!=='string'||!input.query.trim())throw new Error('A nonempty query is required.');return{components:findParts(input.query).map(({id,name,category})=>({id,name,category}))}}},{name:'inspect_watch_component',description:'Select a component in the watch model and open its description.',inputSchema:{type:'object',properties:{id:{type:'string'}},required:['id'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||typeof input.id!=='string'||!parts.some(p=>p.id===input.id))throw new Error('Unknown watch component.');select(input.id);return{selected,descriptionVisible:!$('#detail').hidden,modelAvailable:!!model}}}];for(const tool of specs){try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{})}catch{}}addEventListener('pagehide',()=>lifecycle.abort(),{once:true})}
