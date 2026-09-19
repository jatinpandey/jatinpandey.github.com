import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {movementAt,TAU} from './mechanics.js';
import {createFinishes,surfaceUV,ribbonSpring} from './finishes.js?v=20260918-6';
export function createWatch(host,onPick,onMiss=()=>{}){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#eff1f2');
 const camera=new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.05,120);camera.up.set(0,0,1);camera.position.set(0,-7.5,15);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.setClearColor('#eff1f2');renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;host.appendChild(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=1.1;controls.maxDistance=40;controls.target.set(0,0,.3);controls.maxPolarAngle=Math.PI*.95;
 // Broad reflection cards and a dark studio surround let polished edges read as metal.
 scene.add(new THREE.HemisphereLight(0xf3f6ff,0x58606b,.65));
 const key=new THREE.DirectionalLight(0xfff2dd,3.1);key.position.set(-3,-4,9);key.castShadow=true;
 key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:.5,far:25});
 key.shadow.bias=-.00012;key.shadow.normalBias=.018;key.shadow.radius=3;scene.add(key);
 const fill=new THREE.DirectionalLight(0xc9ddff,.9);fill.position.set(5,1,4);scene.add(fill);
 const back=new THREE.DirectionalLight(0xffffff,1.4);back.position.set(-2,3,-6);scene.add(back);
 const envScene=new THREE.Scene();envScene.background=new THREE.Color('#69717c');
 for(const [x,y,z,w,h,intensity] of [[0,-4,8,8,8,3],[-3,-2,7,5,9,5],[5,1,4,2,8,3],[0,6,2,8,2,4],[-5,0,-3,3,6,2],[-2,-4,-8,7,8,3]]){
  const card=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color().setScalar(intensity),side:THREE.DoubleSide}));
  card.position.set(x,y,z);card.lookAt(0,0,0);envScene.add(card);
 }
 const pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(envScene,.025);
 scene.environment=environment.texture;scene.environmentIntensity=1.05;pmrem.dispose();
 envScene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
 const root=new THREE.Group();scene.add(root);const registry=new Map(),meshes=[];
 const mats=createFinishes(renderer);
 function part(id,x=0,y=0,z=0,layer=0){const g=new THREE.Group();g.position.set(x,y,z);g.userData={id,base:new THREE.Vector3(x,y,z),layer};root.add(g);if(!registry.has(id))registry.set(id,[]);registry.get(id).push(g);return g}
 function add(g,geo,mat=mats.silver,x=0,y=0,z=0){
  const materials=(Array.isArray(mat)?mat:[mat]).map(m=>m.clone());
  const m=new THREE.Mesh(geo,Array.isArray(mat)?materials:materials[0]);m.position.set(x,y,z);m.userData.id=g.userData.id;
  m.userData.surfaces=materials.map(material=>({material,color:material.color.clone(),base:{metalness:material.metalness,roughness:material.roughness,opacity:material.opacity,transparent:material.transparent,depthWrite:material.depthWrite,bumpScale:material.bumpScale,envMapIntensity:material.envMapIntensity,...(material.isMeshPhysicalMaterial?{clearcoat:material.clearcoat,transmission:material.transmission}: {})}}));
  m.castShadow=!materials.some(m=>m.transparent);m.receiveShadow=true;g.add(m);meshes.push(m);return m;
 }
 function cylinder(g,r,h,mat,x=0,y=0,z=0){const geo=new THREE.CylinderGeometry(r,r,h,r>.3?96:32);geo.rotateX(Math.PI/2);surfaceUV(geo,r*2);return add(g,geo,mat,x,y,z)}
 function extrude(shape,h,bevel=.018){const geo=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:64});geo.translate(0,0,-h/2);return surfaceUV(geo,2);}
 function ring(g,r,width,h,mat,z=0){const s=new THREE.Shape();s.absarc(0,0,r,0,TAU,false);const hole=new THREE.Path();hole.absarc(0,0,r-width,0,TAU,true);s.holes.push(hole);return add(g,extrude(s,h,Math.min(.012,width*.2)),mat,0,0,z)}
 function bar(g,x1,y1,x2,y2,w,h,mat,z=0){
  const len=Math.hypot(x2-x1,y2-y1),r=Math.min(w*.25,.04),s=new THREE.Shape(),l=-len/2,b=-w/2;
  s.moveTo(l+r,b);s.lineTo(l+len-r,b);s.quadraticCurveTo(l+len,b,l+len,b+r);s.lineTo(l+len,b+w-r);s.quadraticCurveTo(l+len,b+w,l+len-r,b+w);s.lineTo(l+r,b+w);s.quadraticCurveTo(l,b+w,l,b+w-r);s.lineTo(l,b+r);s.quadraticCurveTo(l,b,l+r,b);
  const m=add(g,extrude(s,h,Math.min(.008,h*.15)),mat,(x1+x2)/2,(y1+y2)/2,z);m.rotation.z=Math.atan2(y2-y1,x2-x1);return m;
 }
 function screw(g,x,y,z,r=.085){
  cylinder(g,r*1.18,.018,mats.dark,x,y,z-.014);
  const head=new THREE.Shape();head.absarc(0,0,r,0,TAU,false);
  const slot=new THREE.Path(),w=r*.15,l=r*.78;slot.moveTo(-l,-w);slot.lineTo(-l,w);slot.lineTo(l,w);slot.lineTo(l,-w);slot.closePath();head.holes.push(slot);
  const m=add(g,extrude(head,.028,.005),[mats.blue,mats.polish],x,y,z+.012);m.rotation.z=(x*2.4+y*1.7)%Math.PI;
 }
 function wheel(g,r,teeth,mat,z=0,solid=false){const shape=new THREE.Shape();const pitch=TAU/teeth;for(let t=0;t<teeth;t++)for(const [f,k] of [[0,.965],[.22,.965],[.35,1.025],[.65,1.025],[.78,.965]]){const a=(t+f)*pitch,x=Math.cos(a)*r*k,y=Math.sin(a)*r*k;if(t===0&&f===0)shape.moveTo(x,y);else shape.lineTo(x,y)}shape.closePath();if(!solid){for(let j=0;j<5;j++){
  const a=j*TAU/5,spread=.43,hole=new THREE.Path();
  hole.moveTo(Math.cos(a-spread)*r*.26,Math.sin(a-spread)*r*.26);
  hole.lineTo(Math.cos(a-spread)*r*.79,Math.sin(a-spread)*r*.79);
  hole.absarc(0,0,r*.79,a-spread,a+spread,false);
  hole.lineTo(Math.cos(a+spread)*r*.26,Math.sin(a+spread)*r*.26);
  hole.absarc(0,0,r*.26,a+spread,a-spread,true);hole.closePath();shape.holes.push(hole);
 }}const geo=new THREE.ExtrudeGeometry(shape,{depth:.075,bevelEnabled:true,bevelSize:.012,bevelThickness:.009,bevelSegments:3,curveSegments:24});surfaceUV(geo,r*2);const edge=mat.clone();edge.roughness=.14;edge.bumpMap=null;edge.roughnessMap=null;const m=add(g,geo,[mat,edge],0,0,z);edge.dispose();cylinder(g,r*.13,.15,mats.steel,0,0,z+.025);return m}
 function springGeometry(inner,outer,turns,z,phase=0){return ribbonSpring(inner,outer,turns,.028,.008,z,phase,360)}
 // Pearled mainplate, machined recess lips and countersunk blued screws.
 const plate=part('plates',0,0,-.3,-.3);cylinder(plate,3.25,.2,mats.plate);ring(plate,3.2,.075,.035,mats.polish,.13);
 for(let n=0;n<9;n++){const a=n*TAU/9+.2;screw(plate,Math.cos(a)*3.02,Math.sin(a)*3.02,.13,.07)}
 for(const [x,y,r] of [[-1.5,.89,1.57],[-1.2,-1.5,1.1],[1.7,-.213,.84]]){
  const lip=ring(plate,r,.018,.012,mats.polish,.111);lip.position.set(x,y,.111);
 }
 const positions={barrel:[-1.5,.89],centre:[0,0],third:[1.061,.6125],fourth:[1.7,-.213],escape:[.95,-.68],balance:[-1.2,-1.5]};
 const barrel=part('barrel',...positions.barrel,.05,.4);wheel(barrel,1.55,96,mats.brass,0,true);ring(barrel,1.48,.08,.28,mats.brass,.15);cylinder(barrel,.14,.55,mats.steel,0,0,.2);
 const main=part('mainspring',...positions.barrel,.27,.8);add(main,ribbonSpring(.2,1.35,8,.17,.024),mats.steel);
 const train={};const configs=[['centre',1.05,72,.19375,12,.15],['third',.95,80,.175,12,.3],['fourth',.78,80,.095,8,.45],['escape',.49,15,.078,8,.6]];
 for(const [id,r,teeth,pr,pt,z] of configs){const g=part(id,...positions[id],z,1+z);train[id]=g;wheel(g,pr,pt,mats.steel,-.14,true);wheel(g,r,teeth,mats.brass,0);cylinder(g,.045,.8,mats.steel,0,0,0)}
 // Escape-wheel teeth taper to points, instead of ordinary involute teeth.
 const e=train.escape;const old=e.children[2];if(old){old.visible=false;}const es=new THREE.Shape();for(let j=0;j<15;j++){for(const [f,r] of [[0,.4],[.18,.52],[.26,.52],[.4,.41]]){const a=(j+f)*TAU/15;if(!j&&!f)es.moveTo(Math.cos(a)*r,Math.sin(a)*r);else es.lineTo(Math.cos(a)*r,Math.sin(a)*r)}}es.closePath();const eh=new THREE.Path();eh.absarc(0,0,.29,0,TAU,true);es.holes.push(eh);add(e,new THREE.ExtrudeGeometry(es,{depth:.055,bevelEnabled:false}),mats.brass,0,0,.1);for(let n=0;n<3;n++){let a=n*TAU/3;bar(e,0,0,Math.cos(a)*.34,Math.sin(a)*.34,.06,.05,mats.brass,.12)}
 const balance=part('balance',...positions.balance,.65,1.5);ring(balance,1.05,.12,.12,mats.brass);bar(balance,-.95,0,.95,0,.10,.12,mats.brass);bar(balance,0,-.95,0,.95,.10,.12,mats.brass);cylinder(balance,.10,.38,mats.steel);for(let n=0;n<12;n++){let a=n*TAU/12;screw(balance,Math.cos(a)*1.00,Math.sin(a)*1.00,.075,.047)}
 const hair=part('hairspring',...positions.balance,.91,2.2);const hairMesh=add(hair,springGeometry(.09,.76,6,0),mats.dark);cylinder(hair,.09,.07,mats.steel);
 const roller=part('roller',...positions.balance,.48,1.2);cylinder(roller,.21,.07,mats.steel);cylinder(roller,.042,.12,mats.ruby,.15,0,.02);
 const fork=part('fork',-.05,-1.0,.78,1.7);bar(fork,-.12,-.06,-.85,-.38,.075,.065,mats.steel);bar(fork,-.85,-.33,-1.02,-.35,.05,.065,mats.steel);bar(fork,-.82,-.43,-.98,-.49,.05,.065,mats.steel);bar(fork,-.12,-.06,.27,.16,.085,.065,mats.steel);bar(fork,.27,.16,.62,.01,.07,.065,mats.steel);bar(fork,.27,.16,.52,.51,.07,.065,mats.steel);add(fork,new THREE.BoxGeometry(.16,.08,.09),mats.ruby,.60,.01,.025);add(fork,new THREE.BoxGeometry(.16,.08,.09),mats.ruby,.52,.51,.025);cylinder(fork,.065,.35,mats.steel,-.1,-.07,0);
 // Winding hardware above the barrel; hidden initially to expose the mainspring.
 const winding=part('winding',...positions.barrel,.94,2.4);wheel(winding,.68,48,mats.turned,0,true);screw(winding,0,0,.14,.12);const crownWheel=part('winding',-1.17,2.05,.94,2.4);wheel(crownWheel,.48,36,mats.turned,0,true);screw(crownWheel,0,0,.13,.10);
 const click=part('click',-2.1,1.6,1.02,2.4);bar(click,-.15,0,.28,.12,.12,.06,mats.steel);screw(click,-.13,0,.06);add(click,new THREE.TorusGeometry(.27,.02,6,32,Math.PI*.85),mats.dark,.03,-.1,0);
 const crown=part('crown',3.75,.55,.0,.15);const stem=cylinder(crown,.065,2.1,mats.polish,-.6,0,0);stem.rotation.y=Math.PI/2;
 const knob=cylinder(crown,.30,.4,mats.silver,.25,0,0);knob.rotation.y=Math.PI/2;
 for(let n=0;n<40;n++){const a=n*TAU/40;const tooth=bar(crown,.07,0,.43,0,.027,.034,mats.polish);tooth.position.set(.25,Math.cos(a)*.3,Math.sin(a)*.3);tooth.rotation.x=a;}
 for(const x of [.055,.445]){const edge=ring(crown,.305,.028,.025,mats.polish);edge.rotation.y=Math.PI/2;edge.position.set(x,0,0);}
 const cap=cylinder(crown,.266,.014,mats.turned,.46,0,0);cap.rotation.y=Math.PI/2;
 const keyless=part('keyless',2.37,.58,.14,1);wheel(keyless,.26,16,mats.steel,0,true);bar(keyless,-.38,.2,.32,.1,.12,.05,mats.steel,.1);screw(keyless,-.37,.2,.15);bar(keyless,-.15,-.2,.25,-.1,.08,.06,mats.silver,.12);
 const jewels=part('jewels',0,0,0,1.8);
 for(const [id,[x,y]] of Object.entries(positions)){
  if(id==='barrel')continue;const z=id==='balance'?1.24:1.145;
  cylinder(jewels,.135,.045,mats.polish,x,y,z-.025);
  const setting=ring(jewels,.106,.033,.035,mats.brass);setting.position.set(x,y,z);
  const jewel=ring(jewels,.073,.049,.034,mats.ruby);jewel.position.set(x,y,z+.015);
  cylinder(jewels,.02,.065,mats.polish,x,y,z+.015);
 }
 // Sculpted open bridges keep the train readable, with striped faces and polished anglage.
 const bridges=part('plates',0,0,1.03,3);
 function bridge(points,z=0){
  const s=new THREE.Shape();s.moveTo(...points[0]);for(let i=1;i<points.length;i++)s.lineTo(...points[i]);s.closePath();
  return add(bridges,extrude(s,.12,.035),[mats.bridge,mats.polish],0,0,z);
 }
 bridge([[-2.98,1.34],[-2.84,1.66],[-1.03,2.21],[-.66,2.13],[-.45,1.89],[.21,.23],[.27,-.07],[.06,-.22],[-.19,-.12],[-.24,.15],[-.99,1.66],[-2.75,1.18]]);
 bridge([[-.11,.21],[.1,-.15],[.48,.01],[1.12,.40],[1.43,.35],[1.50,-.32],[1.78,-.41],[1.91,-.19],[1.67,.43],[2.54,.36],[2.69,.55],[2.56,.80],[1.16,.84],[.95,.79],[.28,.42]]);
 bridge([[-2.86,-1.64],[-2.83,-1.28],[-2.49,-1.23],[-1.34,-1.34],[-1.07,-1.4],[-1.05,-1.6],[-1.34,-1.68],[-2.55,-1.8]],.13);
 for(const [x,y] of [[-2.76,1.41],[-.84,1.93],[2.43,.58]])screw(bridges,x,y,.11);
 screw(bridges,-2.66,-1.5,.24);
 // Balance shock spring and regulator pointer.
 const shock=ring(jewels,.17,.018,.02,mats.brass);shock.position.set(-1.2,-1.5,1.3);
 bar(jewels,-1.33,-1.61,-1.2,-1.35,.023,.018,mats.brass,1.31);
 bar(jewels,-1.07,-1.61,-1.2,-1.35,.023,.018,mats.brass,1.31);
 bar(bridges,-1.36,-1.51,-1.76,-1.24,.045,.025,mats.polish,.26);
 const cannon=part('cannon',0,0,-.55,-1);cylinder(cannon,.12,.5,mats.brass);wheel(cannon,.22,12,mats.brass,0,true);
 const motion=part('motion',.62,0,-.6,-1.3);wheel(motion,.4,36,mats.brass,0);const hour=part('motion',0,0,-.75,-1.4);wheel(hour,.48,48,mats.brass,0);cylinder(hour,.19,.3,mats.brass);
 // A real dial mesh, with vector tick marks and a small-seconds register.
 const dial=part('hands',0,0,-1.0,-2.2);cylinder(dial,3.03,.09,mats.white);for(let n=0;n<60;n++){const a=n*TAU/60;const major=n%5===0;bar(dial,Math.sin(a)*(major?2.58:2.73),Math.cos(a)*(major?2.58:2.73),Math.sin(a)*2.86,Math.cos(a)*2.86,major?.065:.014,major?.025:.008,major?mats.polish:mats.dark,-.064)}
 function hand(g,length,width){
  const s=new THREE.Shape();s.moveTo(0,length);s.lineTo(-width,.2);s.lineTo(-width*.65,-.25);s.quadraticCurveTo(0,-.36,width*.65,-.25);s.lineTo(width,.2);s.closePath();
  add(g,extrude(s,.027,.008),[mats.blue,mats.polish]);
  // A polished ridge divides the two facets of the tapered hand.
  bar(g,0,-.18,0,length-.06,.014,.008,mats.polish,-.023);
  cylinder(g,.11,.045,mats.polish);cylinder(g,.047,.05,mats.blue);
 }
 const minute=part('hands',0,0,-1.13,-2.3);hand(minute,2.35,.067);
 const hourHand=part('hands',0,0,-1.2,-2.4);hand(hourHand,1.6,.11);
 const seconds=part('hands',...positions.fourth,-1.13,-2.3);ring(seconds,.48,.014,.012,mats.dark);for(let n=0;n<60;n++){const a=n*TAU/60,r=n%5===0?.36:.41;bar(seconds,Math.sin(a)*r,Math.cos(a)*r,Math.sin(a)*.45,Math.cos(a)*.45,n%5===0?.015:.008,.007,mats.dark,-.02)}const secondsNeedle=new THREE.Group();seconds.add(secondsNeedle);secondsNeedle.userData.id='hands';bar(secondsNeedle,0,-.1,0,.40,.022,.02,mats.dark);
 const casing=part('case',0,0,-.3,0);
 const caseProfile=[[3.26,-.4],[3.40,-.44],[3.48,-.36],[3.52,-.20],[3.53,.15],[3.49,.34],[3.42,.40],[3.26,.40],[3.26,-.4]].map(([r,z])=>new THREE.Vector2(r,z));
 const caseGeo=new THREE.LatheGeometry(caseProfile,128);caseGeo.rotateX(Math.PI/2);add(casing,caseGeo,mats.silver);
 ring(casing,3.51,.10,.045,mats.polish,.43);ring(casing,3.51,.10,.045,mats.polish,-.43);
 ring(casing,3.275,.032,.035,mats.dark,.35);
 const bezel=part('case',0,0,-1.1,-2.6);ring(bezel,3.5,.43,.15,mats.polish);ring(bezel,3.1,.04,.025,mats.dark,-.09);
 for(const sx of [-1,1])for(const sy of [-1,1]){
  const lug=new THREE.Shape();lug.moveTo(sx*1.73,sy*2.92);lug.lineTo(sx*1.44,sy*3.96);lug.quadraticCurveTo(sx*1.42,sy*4.08,sx*1.2,sy*4.06);lug.lineTo(sx*1.1,sy*3.32);lug.closePath();
  add(casing,extrude(lug,.46,.065),[mats.silver,mats.polish],0,0,-.09);
 }
 for(const sy of [-1,1])bar(casing,-1.32,sy*3.78,1.32,sy*3.78,.085,.085,mats.polish,-.12);
 const glass=part('case',0,0,-1.25,-2.8);
 const crystalMat=new THREE.MeshPhysicalMaterial({color:0xf5faff,metalness:0,roughness:.06,transmission:.96,thickness:.05,ior:1.46,transparent:true,opacity:.24,depthWrite:false,clearcoat:1});
 cylinder(glass,3.05,.04,crystalMat);crystalMat.dispose();
 // Contact shadow anchors the assembly without a distracting floor plane.
 const cv=document.createElement('canvas');cv.width=cv.height=128;const ctx=cv.getContext('2d');const grad=ctx.createRadialGradient(64,64,5,64,64,64);grad.addColorStop(0,'rgba(58,72,88,.25)');grad.addColorStop(1,'rgba(58,72,88,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);const shadow=new THREE.Mesh(new THREE.PlaneGeometry(10,10),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false}));shadow.position.z=-1.5;scene.add(shadow);
 let explode=0,time=0,last=performance.now(),playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,speed=.1,targetCamera=null,targetLook=null;
 // Every part is visible; only a search pick that sits under the dial hides what covers it.
 const hidden=new Set();
 function visibility(){for(const [id,gs] of registry)for(const g of gs)g.visible=!hidden.has(id)}
 visibility();
 // Three highlight states: the parts in focus now, the ones the energy has already passed
 // through, and the one it reaches next. Everything else keeps its own finish.
 let current=new Set(),trail=new Set(),nextId=null;
 const trailTint=new THREE.Color(0x35638f);
 function highlight(){
  for(const m of meshes)for(const surface of m.userData.surfaces){
   const mat=surface.material,id=m.userData.id;
   mat.color.copy(surface.color);mat.emissive.set(0);mat.emissiveIntensity=0;Object.assign(mat,surface.base);
   if(current.has(id)){
    mat.color.set(0x082b50);mat.metalness=0;mat.roughness=.78;mat.envMapIntensity=.15;mat.bumpScale=0;
    mat.opacity=1;mat.transparent=false;mat.depthWrite=true;
    if(mat.isMeshPhysicalMaterial){mat.clearcoat=0;mat.transmission=0;}
   }else if(id===nextId){mat.emissive.set(0x1f4b73);mat.emissiveIntensity=.45;
   }else if(trail.has(id)){mat.color.lerp(trailTint,.5);mat.metalness=Math.min(mat.metalness,.4);mat.roughness=.62;}
   mat.needsUpdate=true;
  }
 }

 // A part tapped on the model is already in view, so leave the camera and layers alone.
 // Parts chosen from search or links may be buried, so reveal them.
 function reveal(id){hidden.clear();if(id==='mainspring'){hidden.add('winding');hidden.add('click')}if(['cannon','motion','hands'].includes(id)){view('dial');if(id!=='hands')hidden.add('hands');hidden.add('case')}}
 function select(id,{fromModel=false}={}){current=new Set(id?[id]:[]);trail.clear();nextId=null;if(id&&!fromModel)reveal(id);if(!id)hidden.clear();visibility();highlight()}
 // One step of the guided walkthrough, with the parts behind and ahead of it.
 function flowStep({part,supporting=[],done=[],next=null}){current=new Set([part,...supporting]);trail=new Set(done);nextId=next;reveal(part);visibility();highlight()}
 // Back the camera off until the whole watch, crown included, fits between the side panels.
 // A page opened in a hidden tab can report a zero-sized window, so fall back to a laptop size.
 function fitDistance(){const w=innerWidth||1280,h=innerHeight||800;const radius=4.3,halfFov=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),aspect=w/h;const clearWidth=w<700?.95:Math.min(1,Math.max(.45,(w-380)/w));return Math.min(38,Math.max(radius/(halfFov*.72),radius/(halfFov*aspect*clearWidth)))}
 function viewPosition(name){const distance=fitDistance();const map={angle:[0,-distance*.56,distance*.83],top:[0,-.01,distance],side:[0,-distance,1],dial:[0,.01,-distance]};return new THREE.Vector3(...map[name])}
 function view(name){const target=new THREE.Vector3(0,0,explode?1:0);targetCamera=viewPosition(name).add(target);targetLook=target;}
 function focus(id){const gs=registry.get(id);if(!gs)return;const box=new THREE.Box3();gs.filter(g=>g.visible).forEach(g=>box.expandByObject(g));const center=box.getCenter(new THREE.Vector3());const radius=box.getSize(new THREE.Vector3()).length()/2;const direction=camera.position.clone().sub(controls.target).normalize();targetLook=center;targetCamera=center.clone().add(direction.multiplyScalar(Math.max(1.6,radius*3.3)));}
 let down=null;renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};targetCamera=null;targetLook=null});renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;const rect=renderer.domElement.getBoundingClientRect(),p=new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);const ray=new THREE.Raycaster();ray.setFromCamera(p,camera);const hits=ray.intersectObjects(meshes.filter(m=>{let p=m;while(p){if(!p.visible)return false;p=p.parent}return true}),false);if(hits.length)onPick(hits[0].object.userData.id,{fromModel:true});else onMiss();down=null});renderer.domElement.addEventListener('wheel',()=>{targetCamera=null;targetLook=null},{passive:true});
 function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}addEventListener('resize',resize);camera.position.copy(viewPosition('angle'));controls.target.set(0,0,0);
 function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;if(playing&&!document.hidden)time+=dt*speed;const a=movementAt(time);for(const id of ['centre','third','fourth','escape'])train[id].rotation.z=a[id];barrel.rotation.z=a.barrel;main.rotation.z=a.barrel;balance.rotation.z=a.balance;roller.rotation.z=a.balance;fork.rotation.z=a.fork;cannon.rotation.z=a.centre;minute.rotation.z=a.centre+Math.PI*.18;hourHand.rotation.z=a.centre/12+Math.PI*.65;secondsNeedle.rotation.z=a.fourth;
 // Fixed outer spring stud; deform only the inner turns with the balance.
 if((playing&&now-lastSpringFrame>33)||needsFrame){lastSpringFrame=now;const oldGeo=hairMesh.geometry;hairMesh.geometry=springGeometry(.09,.76,6,0,a.balance*.45);oldGeo.dispose();needsFrame=false;}
 for(const gs of registry.values())for(const g of gs){const b=g.userData.base,l=g.userData.layer;g.position.set(b.x+explode*b.x*.25,b.y+explode*b.y*.25,b.z+explode*l*.7)}
 if(targetCamera){camera.position.lerp(targetCamera,.09);controls.target.lerp(targetLook,.09);if(camera.position.distanceTo(targetCamera)<.015){targetCamera=null;targetLook=null}}controls.update();renderer.render(scene,camera)}let needsFrame=true,lastSpringFrame=0;requestAnimationFrame(animate);
 return {select,flowStep,focus,setSpeed:v=>speed=v,setPlaying:v=>{playing=v;return playing},isPlaying:()=>playing,step:()=>{playing=false;time=(Math.floor(time*5+1e-6)+1)/5;needsFrame=true},setExplode:v=>explode=v,dispose:()=>renderer.dispose()};
}
