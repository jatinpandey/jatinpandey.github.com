import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {movementAt,TAU} from './mechanics.js';
export function createWatch(host,onPick,onMiss=()=>{}){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#eff1f2');
 const camera=new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.05,120);camera.up.set(0,0,1);camera.position.set(0,-7.5,15);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.setClearColor('#eff1f2');renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.45;host.appendChild(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=1.1;controls.maxDistance=40;controls.target.set(0,0,.3);controls.maxPolarAngle=Math.PI*.95;
 scene.add(new THREE.HemisphereLight(0xffffff,0x8394a5,3));const key=new THREE.DirectionalLight(0xfff8ea,4);key.position.set(-4,3,10);scene.add(key);const fill=new THREE.DirectionalLight(0xb9d8ff,2.3);fill.position.set(5,-2,5);scene.add(fill);
 // A small studio environment gives real metallic parts a broad reflection.
 const envScene=new THREE.Scene();envScene.background=new THREE.Color('#b8c2ca');
 for(const [x,y,z,w,h] of [[0,0,8,14,8],[-6,0,0,4,12],[5,4,4,3,9]]){const box=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide}));box.position.set(x,y,z);box.lookAt(0,0,0);envScene.add(box)}
 const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(envScene,.08).texture;pmrem.dispose();
 const root=new THREE.Group();scene.add(root);const registry=new Map(),meshes=[];
 const mats={silver:new THREE.MeshStandardMaterial({color:0xbac3cc,metalness:.86,roughness:.31}),brass:new THREE.MeshStandardMaterial({color:0xc5a35a,metalness:.78,roughness:.28}),steel:new THREE.MeshStandardMaterial({color:0x717e8b,metalness:.9,roughness:.24}),dark:new THREE.MeshStandardMaterial({color:0x344452,metalness:.8,roughness:.28}),ruby:new THREE.MeshStandardMaterial({color:0x9e2855,metalness:.2,roughness:.19}),white:new THREE.MeshStandardMaterial({color:0xf5f3ec,metalness:.1,roughness:.5})};
 function part(id,x=0,y=0,z=0,layer=0){const g=new THREE.Group();g.position.set(x,y,z);g.userData={id,base:new THREE.Vector3(x,y,z),layer};root.add(g);if(!registry.has(id))registry.set(id,[]);registry.get(id).push(g);return g}
 function add(g,geo,mat=mats.silver,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat.clone());m.position.set(x,y,z);m.userData.id=g.userData.id;m.userData.baseColor=m.material.color.clone();m.userData.baseEmissive=m.material.emissive.clone();m.userData.baseSurface={metalness:m.material.metalness,roughness:m.material.roughness,opacity:m.material.opacity,transparent:m.material.transparent,depthWrite:m.material.depthWrite};g.add(m);meshes.push(m);return m}
 function cylinder(g,r,h,mat,x=0,y=0,z=0){const geo=new THREE.CylinderGeometry(r,r,h,64);geo.rotateX(Math.PI/2);return add(g,geo,mat,x,y,z)}
 function ring(g,r,width,h,mat,z=0){const s=new THREE.Shape();s.absarc(0,0,r,0,TAU,false);const hole=new THREE.Path();hole.absarc(0,0,r-width,0,TAU,true);s.holes.push(hole);const geo=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.012,bevelThickness:.01,curveSegments:96});geo.translate(0,0,-h/2);return add(g,geo,mat,0,0,z)}
 function bar(g,x1,y1,x2,y2,w,h,mat,z=0){const len=Math.hypot(x2-x1,y2-y1);const m=add(g,new THREE.BoxGeometry(len,w,h),mat,(x1+x2)/2,(y1+y2)/2,z);m.rotation.z=Math.atan2(y2-y1,x2-x1);return m}
 function screw(g,x,y,z,r=.085){cylinder(g,r,.04,mats.steel,x,y,z);bar(g,x-r*.7,y,x+r*.7,y,.018,.015,mats.dark,z+.03)}
 function wheel(g,r,teeth,mat,z=0,solid=false){const shape=new THREE.Shape();const pitch=TAU/teeth;for(let t=0;t<teeth;t++)for(const [f,k] of [[0,.965],[.22,.965],[.35,1.025],[.65,1.025],[.78,.965]]){const a=(t+f)*pitch,x=Math.cos(a)*r*k,y=Math.sin(a)*r*k;if(t===0&&f===0)shape.moveTo(x,y);else shape.lineTo(x,y)}shape.closePath();if(!solid){for(let j=0;j<5;j++){const a=j*TAU/5;const hole=new THREE.Path();const cx=Math.cos(a)*r*.52,cy=Math.sin(a)*r*.52;hole.absellipse(cx,cy,r*.24,r*.18,0,TAU,true,a);shape.holes.push(hole)}}const geo=new THREE.ExtrudeGeometry(shape,{depth:.075,bevelEnabled:true,bevelSize:.012,bevelThickness:.009,bevelSegments:2,curveSegments:16});const m=add(g,geo,mat,0,0,z);cylinder(g,r*.13,.15,mats.steel,0,0,z+.025);return m}
 function springGeometry(inner,outer,turns,z,phase=0){const pts=[];for(let j=0;j<=240;j++){const t=j/240,r=inner+(outer-inner)*t,a=t*turns*TAU+phase*(1-t);pts.push(new THREE.Vector3(Math.cos(a)*r,Math.sin(a)*r,z))}return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),240,.014,4,false)}
 // Recessed silver mainplate, perimeter detail, bridge pillars.
 const plate=part('plates',0,0,-.3,-.3);cylinder(plate,3.25,.2,mats.silver);ring(plate,3.2,.075,.04,mats.steel,.13);
 for(let n=0;n<9;n++){let a=n*TAU/9+.2;screw(plate,Math.cos(a)*3.02,Math.sin(a)*3.02,.13,.07)}
 // Concentric turned finishing, very shallow so it remains geometry at close zoom.
 for(let n=0;n<11;n++)ring(plate,.35+n*.25,.009,.004,mats.silver,.105);
 const positions={barrel:[-1.5,.89],centre:[0,0],third:[1.061,.6125],fourth:[1.7,-.213],escape:[.95,-.68],balance:[-1.2,-1.5]};
 const barrel=part('barrel',...positions.barrel,.05,.4);wheel(barrel,1.55,96,mats.brass,0,true);ring(barrel,1.48,.08,.28,mats.brass,.15);cylinder(barrel,.14,.55,mats.steel,0,0,.2);
 const main=part('mainspring',...positions.barrel,.27,.8);add(main,springGeometry(.2,1.35,8,0),mats.steel);
 const train={};const configs=[['centre',1.05,72,.19375,12,.15],['third',.95,80,.175,12,.3],['fourth',.78,80,.095,8,.45],['escape',.49,15,.078,8,.6]];
 for(const [id,r,teeth,pr,pt,z] of configs){const g=part(id,...positions[id],z,1+z);train[id]=g;wheel(g,pr,pt,mats.steel,-.14,true);wheel(g,r,teeth,mats.brass,0);cylinder(g,.045,.8,mats.steel,0,0,0)}
 // Escape-wheel teeth taper to points, instead of ordinary involute teeth.
 const e=train.escape;const old=e.children[2];if(old){old.visible=false;}const es=new THREE.Shape();for(let j=0;j<15;j++){for(const [f,r] of [[0,.4],[.18,.52],[.26,.52],[.4,.41]]){const a=(j+f)*TAU/15;if(!j&&!f)es.moveTo(Math.cos(a)*r,Math.sin(a)*r);else es.lineTo(Math.cos(a)*r,Math.sin(a)*r)}}es.closePath();const eh=new THREE.Path();eh.absarc(0,0,.29,0,TAU,true);es.holes.push(eh);add(e,new THREE.ExtrudeGeometry(es,{depth:.055,bevelEnabled:false}),mats.brass,0,0,.1);for(let n=0;n<3;n++){let a=n*TAU/3;bar(e,0,0,Math.cos(a)*.34,Math.sin(a)*.34,.06,.05,mats.brass,.12)}
 const balance=part('balance',...positions.balance,.65,1.5);ring(balance,1.05,.12,.12,mats.brass);bar(balance,-.95,0,.95,0,.10,.12,mats.brass);bar(balance,0,-.95,0,.95,.10,.12,mats.brass);cylinder(balance,.10,.38,mats.steel);for(let n=0;n<12;n++){let a=n*TAU/12;screw(balance,Math.cos(a)*1.00,Math.sin(a)*1.00,.075,.047)}
 const hair=part('hairspring',...positions.balance,.91,2.2);const hairMesh=add(hair,springGeometry(.09,.76,6,0),mats.dark);cylinder(hair,.09,.07,mats.steel);
 const roller=part('roller',...positions.balance,.48,1.2);cylinder(roller,.21,.07,mats.steel);cylinder(roller,.042,.12,mats.ruby,.15,0,.02);
 const fork=part('fork',-.05,-1.0,.78,1.7);bar(fork,-.12,-.06,-.85,-.38,.075,.065,mats.steel);bar(fork,-.85,-.33,-1.02,-.35,.05,.065,mats.steel);bar(fork,-.82,-.43,-.98,-.49,.05,.065,mats.steel);bar(fork,-.12,-.06,.27,.16,.085,.065,mats.steel);bar(fork,.27,.16,.62,.01,.07,.065,mats.steel);bar(fork,.27,.16,.52,.51,.07,.065,mats.steel);add(fork,new THREE.BoxGeometry(.16,.08,.09),mats.ruby,.60,.01,.025);add(fork,new THREE.BoxGeometry(.16,.08,.09),mats.ruby,.52,.51,.025);cylinder(fork,.065,.35,mats.steel,-.1,-.07,0);
 // Winding hardware above the barrel; hidden initially to expose the mainspring.
 const winding=part('winding',...positions.barrel,.94,2.4);wheel(winding,.68,48,mats.silver,0,true);screw(winding,0,0,.14,.12);const crownWheel=part('winding',-1.17,2.05,.94,2.4);wheel(crownWheel,.48,36,mats.silver,0,true);screw(crownWheel,0,0,.13,.10);
 const click=part('click',-2.1,1.6,1.02,2.4);bar(click,-.15,0,.28,.12,.12,.06,mats.steel);screw(click,-.13,0,.06);add(click,new THREE.TorusGeometry(.27,.02,6,32,Math.PI*.85),mats.dark,.03,-.1,0);
 const crown=part('crown',3.75,.55,.0,.15);const stem=cylinder(crown,.065,2.1,mats.steel,-.6,0,0);stem.rotation.y=Math.PI/2;const knob=cylinder(crown,.32,.4,mats.silver,.25,0,0);knob.rotation.y=Math.PI/2;for(let n=0;n<32;n++){const a=n*TAU/32;const m=add(crown,new THREE.BoxGeometry(.39,.025,.025),mats.steel,.25,Math.cos(a)*.319,Math.sin(a)*.319)}
 const keyless=part('keyless',2.37,.58,.14,1);wheel(keyless,.26,16,mats.steel,0,true);bar(keyless,-.38,.2,.32,.1,.12,.05,mats.steel,.1);screw(keyless,-.37,.2,.15);bar(keyless,-.15,-.2,.25,-.1,.08,.06,mats.silver,.12);
 const jewels=part('jewels',0,0,0,1.8);for(const [id,[x,y]] of Object.entries(positions)){if(id==='barrel')continue;const z=id==='balance'?1.1:.85;cylinder(jewels,.105,.06,mats.brass,x,y,z);cylinder(jewels,.06,.075,mats.ruby,x,y,z+.02);cylinder(jewels,.022,.09,mats.dark,x,y,z+.03)}ring(jewels,.16,.027,.025,mats.brass,1.11).position.set(-1.2,-1.5,1.11);
 const bridges=part('plates',0,0,1.03,3);bar(bridges,-2.8,1.4,-.8,1.9,.38,.16,mats.silver);bar(bridges,-.8,1.9,.05,.05,.4,.16,mats.silver);bar(bridges,.05,.05,2.4,.6,.34,.16,mats.silver);for(const [x,y] of [[-2.8,1.4],[-.8,1.9],[2.4,.6]])screw(bridges,x,y,.12);bar(bridges,-2.7,-1.5,-1.2,-1.5,.22,.15,mats.silver,.15);screw(bridges,-2.7,-1.5,.25);
 const cannon=part('cannon',0,0,-.55,-1);cylinder(cannon,.12,.5,mats.brass);wheel(cannon,.22,12,mats.brass,0,true);
 const motion=part('motion',.62,0,-.6,-1.3);wheel(motion,.4,36,mats.brass,0);const hour=part('motion',0,0,-.75,-1.4);wheel(hour,.48,48,mats.brass,0);cylinder(hour,.19,.3,mats.brass);
 // A real dial mesh, with vector tick marks and a small-seconds register.
 const dial=part('hands',0,0,-1.0,-2.2);cylinder(dial,3.03,.09,mats.white);for(let n=0;n<60;n++){const a=n*TAU/60;const major=n%5===0;bar(dial,Math.sin(a)*(major?2.58:2.73),Math.cos(a)*(major?2.58:2.73),Math.sin(a)*2.86,Math.cos(a)*2.86,major?.045:.018,.01,mats.dark,-.057)}
 const minute=part('hands',0,0,-1.13,-2.3);bar(minute,0,-.25,0,2.35,.065,.035,mats.dark);cylinder(minute,.10,.04,mats.brass);const hourHand=part('hands',0,0,-1.18,-2.4);bar(hourHand,0,-.18,0,1.55,.11,.035,mats.dark);
 const seconds=part('hands',...positions.fourth,-1.13,-2.3);ring(seconds,.48,.014,.012,mats.dark);const secondsNeedle=new THREE.Group();seconds.add(secondsNeedle);secondsNeedle.userData.id='hands';bar(secondsNeedle,0,-.1,0,.40,.022,.02,mats.dark);
 const casing=part('case',0,0,-.3,0);ring(casing,3.50,.24,.80,mats.silver);const bezel=part('case',0,0,-1.1,-2.6);ring(bezel,3.5,.43,.15,mats.silver);const glass=part('case',0,0,-1.25,-2.8);const crystalMat=new THREE.MeshPhysicalMaterial({color:0xe1f0fa,metalness:0,roughness:.05,transparent:true,opacity:.13,depthWrite:false});cylinder(glass,3.05,.025,crystalMat);
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
  for(const m of meshes){
   const mat=m.material,base=m.userData.baseSurface,id=m.userData.id;
   mat.color.copy(m.userData.baseColor);mat.emissive.set(0);mat.emissiveIntensity=0;
   Object.assign(mat,base);
   if(current.has(id)){
    // Matte navy stays distinct under bright studio reflections, including jewels.
    mat.color.set(0x082b50);mat.metalness=0;mat.roughness=.78;
    mat.opacity=1;mat.transparent=false;mat.depthWrite=true;
   }else if(id===nextId){
    // The part about to receive the energy glows faintly, without going solid.
    mat.emissive.set(0x1f4b73);mat.emissiveIntensity=.45;
   }else if(trail.has(id)){
    // Already covered: tinted toward the highlight colour, but still metallic.
    mat.color.lerp(trailTint,.5);mat.metalness=Math.min(mat.metalness,.4);mat.roughness=.62;
   }
   mat.needsUpdate=true;
  }
 }

 // A part tapped on the model is already in view, so leave the camera and layers alone.
 // Parts chosen from search or links may be buried, so reveal them.
 function reveal(id){hidden.clear();if(id==='mainspring'){hidden.add('winding');hidden.add('click')}if(['cannon','motion','hands'].includes(id)){view('dial');if(id!=='hands')hidden.add('hands');hidden.add('case')}}
 function select(id,{fromModel=false}={}){current=new Set(id?[id]:[]);trail.clear();nextId=null;if(id&&!fromModel)reveal(id);visibility();highlight()}
 // One step of the guided walkthrough, with the parts behind and ahead of it.
 function flowStep({part,supporting=[],done=[],next=null}){current=new Set([part,...supporting]);trail=new Set(done);nextId=next;reveal(part);visibility();highlight()}
 // Back the camera off until the whole watch, crown included, fits between the side panels.
 // A page opened in a hidden tab can report a zero-sized window, so fall back to a laptop size.
 function fitDistance(){const w=innerWidth||1280,h=innerHeight||800;const radius=4.3,halfFov=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),aspect=w/h;const clearWidth=w<700?.95:Math.min(1,Math.max(.45,(w-380)/w));return Math.min(38,Math.max(radius/(halfFov*.72),radius/(halfFov*aspect*clearWidth)))}
 function viewPosition(name){const distance=fitDistance();const map={angle:[0,-distance*.44,distance*.91],top:[0,-.01,distance],side:[0,-distance,1],dial:[0,.01,-distance]};return new THREE.Vector3(...map[name])}
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
