import * as THREE from './vendor/three.module.js';

// Small, deterministic machining maps: no external assets or texture downloads.
export function createFinishes(renderer) {
 const size=512;
 function texture(kind) {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
  const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(size,size);
  let seed=137;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const dx=x-size/2,dy=y-size/2,r=Math.hypot(dx,dy);
   let v=180+(random()-.5)*9;
   if(kind==='brushed')v+=Math.sin(y*2.4)*12+Math.sin(y*.43)*4;
   if(kind==='turned')v+=Math.sin(r*2.3)*17+Math.sin(r*.55)*5;
   if(kind==='stripes')v+=Math.sin(y/size*Math.PI*16)*23+Math.sin(y*2.3)*7;
   if(kind==='pearl'){
    const row=Math.floor(y/64),px=((x+(row%2)*32)%64)-32,py=(y%64)-32;
    v+=Math.sin(Math.hypot(px,py)*1.5)*6+Math.cos(Math.atan2(py,px)*2)*5;
   }
   const i=(y*size+x)*4;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=v;pixels.data[i+3]=255;
  }
  ctx.putImageData(pixels,0,0);
  const map=new THREE.CanvasTexture(canvas);map.wrapS=map.wrapT=THREE.RepeatWrapping;
  map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  return map;
 }
 const brushed=texture('brushed'),turned=texture('turned'),stripes=texture('stripes'),pearl=texture('pearl');
 pearl.repeat.set(3,3);
 const metal=(color,roughness,map,bumpScale=.007)=>new THREE.MeshStandardMaterial({color,metalness:1,roughness,roughnessMap:map,bumpMap:map,bumpScale});
 return {
  silver:metal(0xc4c8cd,.4,brushed),
  plate:metal(0xbec0bd,.48,pearl,.002),
  bridge:metal(0xd0d2d1,.43,stripes,.003),
  brass:metal(0xc39a4d,.36,turned,.005),
  steel:metal(0x8b939b,.31,brushed,.004),
  turned:metal(0xc5c9ce,.32,turned,.004),
  polish:new THREE.MeshStandardMaterial({color:0xd5d9df,metalness:1,roughness:.12}),
  dark:new THREE.MeshStandardMaterial({color:0x172635,metalness:.9,roughness:.23}),
  blue:new THREE.MeshStandardMaterial({color:0x153b69,metalness:.95,roughness:.2}),
  ruby:new THREE.MeshPhysicalMaterial({color:0x9f1449,metalness:0,roughness:.12,clearcoat:1,clearcoatRoughness:.08,ior:1.76}),
  white:new THREE.MeshPhysicalMaterial({color:0xe9e5d9,metalness:.08,roughness:.33,clearcoat:.35}),
 };
}

// Project machining maps in local XY so an extruded part has consistent scale.
export function surfaceUV(geometry,scale=1) {
 const p=geometry.attributes.position,uv=geometry.attributes.uv;
 for(let i=0;i<p.count;i++)uv.setXY(i,p.getX(i)/scale+.5,p.getY(i)/scale+.5);
 uv.needsUpdate=true;
 return geometry;
}

// Flat spring ribbon, with actual thickness and upright sidewalls.
export function ribbonSpring(inner,outer,turns,height,thickness,z=0,phase=0,segments=480) {
 const vertices=[],indices=[],uvs=[];
 for(let i=0;i<=segments;i++){
  const t=i/segments,r=inner+(outer-inner)*t,a=t*turns*Math.PI*2+phase*(1-t);
  for(const [dr,dz] of [[-thickness/2,-height/2],[thickness/2,-height/2],[thickness/2,height/2],[-thickness/2,height/2]]){
   vertices.push(Math.cos(a)*(r+dr),Math.sin(a)*(r+dr),z+dz);uvs.push(t*turns,dz/height+.5);
  }
  if(i<segments)for(let j=0;j<4;j++){
   const a=i*4+j,b=i*4+(j+1)%4,c=b+4,d=a+4;indices.push(a,d,b,b,d,c);
  }
 }
 indices.push(0,1,2,0,2,3);
 const end=segments*4;indices.push(end,end+2,end+1,end,end+3,end+2);
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
 geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
 geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
