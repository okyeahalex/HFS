import test from 'node:test';import assert from 'node:assert/strict';
import {pilot,step,DT,course,opponentControl} from '../flight-core.mjs';
import {configuration,MAPS,DIFFICULTIES} from '../game-config.mjs';
import {raceControl,collisionRadius} from '../race-ai.mjs';
import {obstacleColliders} from '../obstacle-layout.mjs';import {worldHit} from '../world-collision.mjs';
for(const id of [6,7])for(const difficulty of Object.keys(DIFFICULTIES))test(`${MAPS[id].name} AI completes at ${difficulty} difficulty without obstacle crashes`,()=>{
 const cfg={...configuration('drone','arcade'),speed:34*.6*DIFFICULTIES[difficulty].speed,startHeight:-5,timeLimit:360},p=pilot(5,cfg),gs=course(id),solids=obstacleColliders(MAPS[id].theme);
 for(let i=0;i<22000&&!p.done;i++){const old={x:p.x,y:p.y,z:p.z};step(p,raceControl(p,gs,null,MAPS[id].wind,cfg,difficulty,DT,solids),DT,gs,MAPS[id].wind,cfg);assert.equal(worldHit(old,p,solids,collisionRadius(cfg)),null,`impact at gate ${p.gate}`);}
 assert.equal(p.gate,gs.length);assert.equal(p.crashed,false);assert.ok(p.finishTime<360);
});
test('avoidance leaves ordinary difficulty behavior unchanged in clear air',()=>{const cfg=configuration('trainer','arcade'),a=pilot(5,cfg),b=pilot(5,cfg),gs=course(0);for(let i=0;i<500;i++){const plain=opponentControl(a,gs,null,0,cfg,'rookie',DT),safe=raceControl(b,gs,null,0,cfg,'rookie',DT,[]);assert.deepEqual(safe.slice(0,3),plain);step(a,plain,DT,gs,0,cfg);step(b,safe,DT,gs,0,cfg);}assert.equal(a.x,b.x);assert.equal(a.z,b.z);});
