export const TAU=Math.PI*2;
export const BEATS_PER_SECOND=5;
// Fifteen escape-wheel teeth; each beat advances half a tooth. A short
// smooth transition followed by a dwell shows the locking interval.
export function movementAt(time){
 const beats=Math.max(0,time)*BEATS_PER_SECOND, whole=Math.floor(beats), phase=beats-whole;
 const x=Math.min(1,phase/.24), release=x*x*(3-2*x);
 const escape=(whole+release)*TAU/30;
 return {escape,fourth:-escape/10,third:escape/100,centre:-escape/600,barrel:escape/4800,
 balance:Math.sin(beats*Math.PI)*4.35,fork:Math.tanh(Math.sin((beats-.08)*Math.PI)*7)*.18,
 phase:phase<.24?'Impulse':'Locked'};
}
