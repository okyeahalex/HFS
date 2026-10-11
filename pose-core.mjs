export const CONNECTIONS=[[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24]];
const clamp=v=>Math.max(-1,Math.min(1,v));
export class PoseController{
 constructor(){this.reset();}
 reset(){this.neutral=null;this.samples=[];this.x=0;this.y=0;this.status='Relax your arms and hold still';this.ready=false;this.lastValid=false;}
 lost(){this.x=0;this.y=0;this.lastValid=false;if(!this.neutral)this.samples=[];this.status='Tracking lost · controls neutral';return {x:0,y:0};}
 update(lm,sensitivity=.7,mapping='hands'){
 const required=mapping==='onehand'?[11,12,16]:mapping==='onehand_left'?[11,12,15]:[11,12,15,16];
 if(!lm||required.some(i=>!lm[i]||(lm[i].visibility??1)<.55))return this.lost();this.lastValid=true;
 const width=Math.max(.14,Math.abs(lm[11].x-lm[12].x));
 const wrists=mapping==='onehand'?lm[16]:mapping==='onehand_left'?lm[15]:{x:(lm[15].x+lm[16].x)/2,y:(lm[15].y+lm[16].y)/2};
 const x=mapping==='shoulders'?(lm[12].y-lm[11].y)/width:-(wrists.x-(lm[11].x+lm[12].x)/2)/width;
 const y=((lm[11].y+lm[12].y)/2-wrists.y)/width;
 if(!this.neutral){const last=this.samples.at(-1);if(last&&(Math.abs(x-last.x)>.2||Math.abs(y-last.y)>.35))this.samples=[];
 this.samples.push({x,y});this.status=`Relax arms · calibrating ${this.samples.length}/15`;
 if(this.samples.length>=15){this.neutral={x:this.samples.reduce((s,v)=>s+v.x,0)/15,y:this.samples.reduce((s,v)=>s+v.y,0)/15};this.ready=true;this.status='Ready · click Start body flight';}return {x:0,y:0};}
 const dead=v=>Math.abs(v)<.11?0:clamp((Math.abs(v)-.11)/.89)*Math.sign(v);
 this.x+=(dead((x-this.neutral.x)*1.6*sensitivity)-this.x)*.30;
 this.y+=(dead((y-this.neutral.y)*1.35*sensitivity)-this.y)*.30;
 this.status=mapping==='shoulders'?'Tilt shoulders gently · lift/lower hands':mapping==='onehand'?'Move your right hand left/right and up/down':mapping==='onehand_left'?'Move your left hand left/right and up/down':'Move both hands together like a gentle joystick';
 return {x:this.x,y:this.y};
 }
}
