import {step,opponentControl,clamp} from './flight-core.mjs';
import {worldHit} from './world-collision.mjs';
export function collisionRadius(cfg){return cfg.kind==='drone'?.65:cfg.kind==='airship'?3:2;}
// Short-horizon steering search around the normal pilot. Scenery remains solid
// for both racers; this pilot forecasts collisions before committing to a turn.
export function raceControl(p,gates,brain,wind,cfg,difficulty,dt,colliders){
 const base=opponentControl(p,gates,brain,wind,cfg,difficulty,dt);
 p.planAge=(p.planAge??Infinity)+dt;
 if(p.planAge>=.2){p.planAge=0;const pad=collisionRadius(cfg),reach=Math.max(70,p.speed*4.2);const local=colliders.filter(c=>c.kind==='box'?c.max.z>=p.z-reach&&c.min.z<=p.z+5:c.z+c.radius>=p.z-reach&&c.z-c.radius<=p.z+5);
  let best=-Infinity,plan=[0,0,false];
  // Zero-offset pilot wins in clear air; detours are chosen only when useful.
  const choices=[[0,0,false]];
  if(local.length){for(const x of [-.8,-.4,0,.4,.8])for(const y of [-.5,0,.5])if(x||y)choices.push([x,y,false]);}
  for(const c of choices){const q={...p,results:p.results.slice(),botControl:p.botControl?.slice()},startZ=p.z;let score=0,crashed=false;
   for(let i=0;i<40&&!q.done;i++){const old={x:q.x,y:q.y,z:q.z};const a=opponentControl(q,gates,brain,wind,cfg,difficulty,.1);step(q,[clamp(a[0]+c[0],-1,1),clamp(a[1]+c[1],-1,1),false,c[2]],.1,gates,wind,cfg);if(q.crashed||worldHit(old,q,local,pad)){score=-100000+(i*.1)*500;crashed=true;break;}}
   if(!crashed){const g=gates[Math.min(q.gate,gates.length-1)];score=(q.hits-p.hits)*350-(q.miss-p.miss)*500+(startZ-q.z)*.6-(g?Math.hypot(q.x-g.x,(q.y-g.y)*1.4)*2:0)-Math.abs(c[0])*8-Math.abs(c[1])*10-(c[2]?30:0);}
   if(c===choices[0]&&!crashed){plan=c;break;}if(score>best){best=score;plan=c;}
  }p.racePlan=plan;
 }
 const c=p.racePlan||[0,0,false];return [clamp(base[0]+c[0],-1,1),clamp(base[1]+c[1],-1,1),false,c[2]];
}
