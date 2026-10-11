import test from 'node:test';import assert from 'node:assert/strict';import {segmentBox,worldHit} from '../world-collision.mjs';import {modeInteractions} from '../game-rules.mjs';
const building={kind:'box',min:{x:10,y:0,z:-20},max:{x:20,y:100,z:-10},label:'Building impact'};
test('fast aircraft cannot tunnel through a building',()=>assert.ok(segmentBox({x:15,y:50,z:0},{x:15,y:50,z:-50},building)));
test('aircraft above roof avoids collision',()=>assert.equal(segmentBox({x:15,y:110,z:0},{x:15,y:110,z:-50},building),false));
test('parallel flight beside building is safe',()=>assert.equal(segmentBox({x:0,y:50,z:0},{x:0,y:50,z:-50},building),false));
test('cone collision narrows toward summit',()=>{const c={kind:'cone',x:0,z:0,bottom:0,height:100,radius:50};assert.ok(worldHit({x:30,y:20,z:0},{x:30,y:20,z:0},[c]));assert.equal(worldHit({x:30,y:90,z:0},{x:30,y:90,z:0},[c]),null);});
test('landmarks award points once in free flight',()=>{const beacon={x:0,y:120,z:0,r:13,points:100,collected:false,label:'Rooftop'};const p={x:0,y:120,z:-20},old={x:0,y:120,z:20};let s=modeInteractions('free',{points:0,collected:0,landmarks:0,health:3,invincible:0},p,old,.02,{beacons:[beacon]});assert.equal(s.points,100);assert.equal(s.landmarks,1);s=modeInteractions('free',s,p,old,.02,{beacons:[beacon]});assert.equal(s.points,100);});
