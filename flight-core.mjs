import {obstacleColliders} from './obstacle-layout.mjs';
import {worldHit} from './world-collision.mjs';
import {MAPS,VEHICLES,DIFFICULTIES} from './game-config.mjs';
// Assisted, SI-unit point-mass flight model. No renderer or browser dependencies.
export const DT = 1/60, G = 9.81, RADIUS = 12, VERSION = 'v6-obstacles';
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
export function course(id=0){const m=MAPS[id]||MAPS[0];return Array.from({length:m.count},(_,i)=>({x:Math.sin(i*m.phase)*m.amp,y:(m.low?-5:100)+Math.sin(i*.47)*m.height,z:(m.low?-115:-150)-i*m.spacing,r:m.radius}));}
export function pilot(x=0,cfg={}){return {x,y:cfg.startHeight??100,z:30,speed:cfg.speed||55,heading:0,bank:0,pitch:0,gamma:0,vx:0,vy:0,vz:-(cfg.speed||55),gate:0,hits:0,miss:0,time:0,done:false,crashed:false,reason:'',results:[],event:null,boost:1,stall:false,pathError:0};}
export function resolveGates(p,old,gates){
 while(p.gate<gates.length){const g=gates[p.gate];if(p.z>g.z)break;
  // Signed plane crossing, with a swept intersection (no tunnelling at low FPS).
  const dz=p.z-old.z,t=dz===0?1:clamp((g.z-old.z)/dz,0,1);
  const x=old.x+(p.x-old.x)*t,y=old.y+(p.y-old.y)*t;
  const hit=old.z>=g.z&&Math.hypot(x-g.x,y-g.y)<=g.r;
  const idx=p.gate++;p.hits+=Number(hit);p.miss+=Number(!hit);
  p.results.push(hit);p.event={index:idx,hit,time:p.time};
  if(p.gate===gates.length){p.done=true;p.finishTime=p.time-(1-t)*DT;}
 }
}
export function step(p,control,dt,gates,wind=0,cfg={}){
 if(p.done)return;
 const old={x:p.x,y:p.y,z:p.z};p.time+=dt;wind*=.8+.2*Math.sin(p.time*.7);
 const roll=clamp(control[0]||0,-1,1),elevator=clamp(control[1]||0,-1,1);
 const boost=!!control[2]&&p.boost>.005;
 p.boost=clamp(p.boost+(boost?-.22:.075)*dt,0,1);
 const assisted=cfg.assist&&cfg.assist!=='simulation';
 const precision=!!control[4],authority=precision?.45:1;
 const targetSpeed=(cfg.speed||55)*(precision?.5:1)*(boost?(cfg.boost||1.4):1);
 if(assisted||cfg.hover){
  // Beginner controls are a self-centering joystick, not accumulated bank turns.
  const drone=cfg.kind==='drone',blimp=cfg.kind==='airship';
  const hovering=cfg.hover&&!!control[3];
  p.speed+=( (hovering?0:targetSpeed)-p.speed)*(1-Math.exp(-dt*1.6));
  p.bank+=(roll*(drone?.28:blimp?.18:.52)-p.bank)*(1-Math.exp(-dt*3.2));
  p.pitch+=(elevator*.20*(cfg.climb||1)-p.pitch)*(1-Math.exp(-dt*3));
  if(drone||blimp){p.heading+=(roll*(drone?.18:.32)-p.heading)*(1-Math.exp(-dt*2));p.vx+=(roll*(drone?22:12)*authority+wind*.5-p.vx)*(1-Math.exp(-dt*5));p.vy+=(elevator*(drone?13:7)*authority-p.vy)*(1-Math.exp(-dt*3));p.vz=-p.speed;}
  else{p.heading+=(roll*.65*(cfg.turn||1)-p.heading)*(1-Math.exp(-dt*2.6));p.gamma+=(p.pitch-p.gamma)*(1-Math.exp(-dt*3));p.vx=Math.sin(p.heading)*p.speed+wind*.5;p.vy=Math.sin(p.gamma)*p.speed;p.vz=-Math.cos(p.heading)*p.speed;}
  p.stall=false;
 }else{
  p.bank+=(roll*.96-p.bank)*(1-Math.exp(-dt*3));p.pitch+=(elevator*.48-p.pitch)*(1-Math.exp(-dt*2));
  const stallSpeed=25/Math.sqrt(Math.max(.3,Math.cos(p.bank)));p.stall=p.speed<stallSpeed;
  const liftAuthority=clamp((p.speed-12)/(stallSpeed-12),0,1);
  p.gamma+=((p.pitch-p.gamma)*1.4*liftAuthority-(1-liftAuthority)*.42)*dt;p.gamma=clamp(p.gamma,-.85,.55);
  const trim=cfg.speed||55,drag=.0025*p.speed*p.speed+.9+Math.abs(p.bank)*.9,thrust=(.0025*trim*trim+.9)*(boost?(cfg.boost||1.65):1);
  p.speed=clamp(p.speed+(thrust-drag-G*Math.sin(p.gamma))*dt,8,110);
  p.heading=wrap(p.heading+G*Math.tan(p.bank)/Math.max(p.speed,15)*(cfg.turn||1)*dt);
  const horizontal=p.speed*Math.cos(p.gamma);p.vx=Math.sin(p.heading)*horizontal+wind*(.7+.3*Math.sin(p.time*.6));p.vy=Math.sin(p.gamma)*p.speed;p.vz=-Math.cos(p.heading)*horizontal;
 }
 p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;
 const g=gates[p.gate];if(g)p.pathError+=Math.min(200,Math.hypot(p.x-g.x,p.y-g.y))*dt;
 if(p.y<=-10){p.y=-10;p.done=true;p.crashed=true;p.reason='Ground impact';return;}
 if(p.time>=(cfg.timeLimit??180)){p.done=true;p.reason='Flight time limit';return;}
 resolveGates(p,old,gates);
}
export const weightsCount=112;
export function forward(w,v){let h=[],k=0;for(let j=0;j<10;j++){let s=0;for(let i=0;i<8;i++)s+=v[i]*w[k++];h.push(Math.tanh(s+w[80+j]));}k=90;return [0,1].map(j=>{let s=0;for(let i=0;i<10;i++)s+=h[i]*w[k++];return Math.tanh(s+w[110+j]);});}
export function autopilot(p,gates,w=null,wind=0,cfg={}){if(!gates.length)return [0,0,false];const g=gates[Math.min(p.gate,gates.length-1)];
 const dz=Math.max(30,p.z-g.z),dx=g.x-p.x;
 const desiredHeading=Math.atan2(dx,dz)-wind/Math.max(p.speed,20);
 const error=wrap(desiredHeading-p.heading);
 const bank=clamp(error*4.5,-.86,.86);
 let roll=clamp(bank/.96,-1,1);
 let pitch=clamp(Math.atan2(g.y-p.y,Math.max(70,dz))/.48,-.85,.85);
 if(cfg.assist&&cfg.assist!=='simulation'||cfg.hover){
  if(cfg.kind==='drone'||cfg.kind==='airship'){roll=clamp((dx/Math.max(1,dz/Math.max(p.speed,10))-wind*.5)/(cfg.kind==='drone'?22:12),-1,1);pitch=clamp((g.y-p.y)/Math.max(1,dz/Math.max(p.speed,10))/(cfg.kind==='drone'?13:7),-1,1);}
  else{roll=clamp(desiredHeading/(.65*(cfg.turn||1)),-1,1);pitch=clamp(Math.atan2(g.y-p.y,Math.max(45,dz))/(.20*(cfg.climb||1)),-1,1);}
 }
 if(w){const a=forward(w,[clamp(dx/80,-2,2),clamp((g.y-p.y)/40,-2,2),p.heading,p.bank,p.gamma,clamp(dz/200,0,2),p.speed/60,1]);roll=clamp(roll+a[0]*.12,-1,1);pitch=clamp(pitch+a[1]*.12,-1,1);}
 return [roll,pitch,false];
}
export function evaluate(w,gates,wind=0,cfg={}){let score=0,hits=0,path=[];const solids=cfg.obstacleTheme?obstacleColliders(cfg.obstacleTheme):[];for(const x of [-5,5]){const p=pilot(x,cfg);for(let i=0;i<14400&&!p.done;i++){const old={x:p.x,y:p.y,z:p.z};step(p,autopilot(p,gates,w,wind,cfg),DT,gates,wind,cfg);if(solids.length&&worldHit(old,p,solids,cfg.kind==='drone'?.65:2)){p.done=true;p.crashed=true;}if(x===-5&&i%30===0)path.push({x:p.x,y:p.y,z:p.z});}score+=p.hits*1000-p.miss*500-(p.crashed?4000:0)-p.pathError*.04-p.time;hits+=p.hits;}return {score:score/2,hits:hits/2,path};}
export function guidedControl(p,input,gates,cfg,wind=0){if(cfg.assist!=='guided'||!gates.length||cfg.hover&&input[3])return input;const a=autopilot(p,gates,null,wind,cfg);return [clamp(a[0]+input[0]*.42,-1,1),clamp(a[1]+input[1]*.42,-1,1),input[2],input[3]];}
export function opponentControl(p,gates,w,wind,cfg,difficulty='rookie',dt=DT){const d=DIFFICULTIES[difficulty]||DIFFICULTIES.rookie;
 const target=gates[p.gate];let aim=gates;if(target){aim=gates.slice();const deliberateMiss=d.missEvery&&p.gate%d.missEvery===d.missEvery-1;aim[p.gate]={...target,x:target.x+(deliberateMiss?target.r*2.6:Math.sin(p.time*.8+p.gate)*target.r*d.error),y:target.y+Math.sin(p.time*.4)*target.r*d.error};}
 const a=autopilot(p,aim,difficulty==='expert'||difficulty==='skilled'?w:null,wind,cfg);
 p.botControl??=[0,0];const smooth=d.reaction?1-Math.exp(-dt/d.reaction):1;for(let i=0;i<2;i++)p.botControl[i]+=(a[i]-p.botControl[i])*smooth;
 return [p.botControl[0],p.botControl[1],false];
}
export function adjustedTime(p,delay=0){return (p.finishTime??Infinity)+p.miss*6+delay;}
export function segmentDistance(point,a,b){const vx=b.x-a.x,vy=b.y-a.y,vz=b.z-a.z,d=vx*vx+vy*vy+vz*vz;const t=d?clamp(((point.x-a.x)*vx+(point.y-a.y)*vy+(point.z-a.z)*vz)/d,0,1):0;return Math.hypot(point.x-a.x-t*vx,point.y-a.y-t*vy,point.z-a.z-t*vz);}
