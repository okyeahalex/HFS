export const HAND_CONNECTIONS=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,(a.z||0)-(b.z||0));
export function closedFist(lm){if(!lm||lm.length<21||lm.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||!Number.isFinite(p.z??0)))return false;const palm=distance(lm[0],lm[9]);if(palm<1e-5)return false;let curled=0,straight=0;
 for(const [m,p,t]of [[5,6,8],[9,10,12],[13,14,16],[17,18,20]]){const a=lm[m],b=lm[p],c=lm[t],u=[b.x-a.x,b.y-a.y,(b.z||0)-(a.z||0)],v=[c.x-b.x,c.y-b.y,(c.z||0)-(b.z||0)],n=Math.hypot(...u)*Math.hypot(...v);if(n<1e-8)return false;const cosine=u.reduce((sum,x,i)=>sum+x*v[i],0)/n,ratio=distance(c,lm[0])/Math.max(1e-6,distance(b,lm[0]));if(cosine<.35&&ratio<1.25)curled++;if(cosine>.75&&ratio>1.1)straight++;}
 return curled>=3&&straight===0;
}
export class FistBoost{
 constructor(){this.reset();}
 reset(){this.active=false;this.since=null;this.status='Open hands to steer · close fists to boost';this.closed=[];}
 lost(){this.reset();this.status='Hands not tracked · boost released';return false;}
 update(result,pose,mapping,ready,now,setting='auto'){
  const mode=setting==='auto'?(mapping==='onehand'?'right':mapping==='onehand_left'?'left':'both'):setting;
  if(mode==='off'){this.reset();this.status='Fist boost off · Shift still works';return false;}
  if(!ready){this.reset();this.status='Calibrate steering first · keep hands open';return false;}
  const hands=result?.landmarks||[];const chosen=[];
  for(const wrist of mode==='both'?[15,16]:[mode==='left'?15:16]){const p=pose?.[wrist];if(!p||(p.visibility??0)<.55)return this.lost();let best=-1,near=.16;for(let i=0;i<hands.length;i++){if(chosen.includes(i)||!hands[i]?.[0]||(result.handedness?.[i]?.[0]?.score??1)<.65)continue;const d=Math.hypot(hands[i][0].x-p.x,hands[i][0].y-p.y);if(d<near){near=d;best=i;}}if(best<0)return this.lost();chosen.push(best);}
  this.closed=hands.map((h,i)=>closedFist(result.worldLandmarks?.[i]||h));const close=chosen.every(i=>this.closed[i]);
  if(close){this.since??=now;this.active=now-this.since>=180;this.status=this.active?'FIST BOOST ACTIVE · open hand to release':'Fist detected · hold briefly to boost';}else{this.active=false;this.since=null;this.status=mode==='both'?'Close BOTH fists to boost':'Close your '+mode.toUpperCase()+' fist to boost';}
  return this.active;
 }
}
