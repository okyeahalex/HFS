import {segmentDistance} from './flight-core.mjs';
export function modeInteractions(mode,state,p,old,dt,items){
 const s={...state};for(const b of items.beacons||[])if(!b.collected&&segmentDistance(b,old,p)<b.r){b.collected=true;if(b.obj)b.obj.visible=false;s.points+=b.points;s.landmarks=(s.landmarks||0)+1;s.lastBeacon=b.label;}
 if(mode==='hunt'){for(const orb of items.pickups||[])if(!orb.collected&&segmentDistance(orb,old,p)<orb.r){orb.collected=true;if(orb.obj)orb.obj.visible=false;s.points+=orb.points;s.collected++;}}
 if(mode==='survival'){
 s.invincible=Math.max(0,s.invincible-dt);let hit=false;
 for(const h of items.hazards||[])if(!h.hit&&segmentDistance(h,old,p)<h.r+2){h.hit=true;if(h.obj)h.obj.visible=false;hit=true;}
 const bounds=items.bounds||{x:130,minY:40,maxY:190};
 if((Math.abs(p.x)>bounds.x||p.y<bounds.minY||p.y>bounds.maxY)&&s.invincible<=0)hit=true;
 if(hit&&s.invincible<=0){s.health--;s.invincible=2;if(s.health<=0){s.health=0;p.done=true;p.reason='SURVIVAL ENDED';}}
 }
 return s;
}
