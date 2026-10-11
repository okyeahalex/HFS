import test from 'node:test';import assert from 'node:assert/strict';import {PoseController} from '../pose-core.mjs';
function landmarks(){const lm=Array.from({length:33},()=>({x:.5,y:.5,visibility:1}));lm[11]={x:.65,y:.45,visibility:1};lm[12]={x:.35,y:.45,visibility:1};lm[15]={x:.7,y:.7,visibility:1};lm[16]={x:.3,y:.7,visibility:1};return lm;}
function calibrated(mapping='hands'){const p=new PoseController();for(let i=0;i<20;i++)p.update(landmarks(),.7,mapping);return p;}
test('neutral calibration avoids unwanted initial climb',()=>{const p=calibrated();assert.ok(p.ready);assert.deepEqual(p.update(landmarks()),{x:0,y:0});});
test('lowering anatomical left shoulder banks left',()=>{const p=calibrated('shoulders'),lm=landmarks();lm[11].y+=.12;assert.ok(p.update(lm,.7,'shoulders').x<0);});
test('raising hands pitches up',()=>{const p=calibrated(),lm=landmarks();lm[15].y-=.2;lm[16].y-=.2;assert.ok(p.update(lm).y>0);});
test('missing or low visibility pose neutralizes inputs',()=>{const p=calibrated(),lm=landmarks();lm[11].y+=.12;p.update(lm);assert.deepEqual(p.update(null),{x:0,y:0});lm[15].visibility=.2;assert.deepEqual(p.update(lm),{x:0,y:0});});
test('recalibration discards prior reference',()=>{const p=calibrated();p.reset();assert.equal(p.ready,false);assert.equal(p.neutral,null);assert.deepEqual(p.update(landmarks()),{x:0,y:0});});

test('hand joystick movement steers in the mirrored direction',()=>{const p=calibrated(),lm=landmarks();lm[15].x+=.12;lm[16].x+=.12;assert.ok(p.update(lm).x<0);});
test('whole-body sideways movement does not steer hand joystick',()=>{const p=calibrated(),lm=landmarks();for(const i of [11,12,15,16])lm[i].x+=.12;assert.deepEqual(p.update(lm),{x:0,y:0});});
test('single-hand mode does not require the other wrist',()=>{const p=calibrated('onehand'),lm=landmarks();lm[15].visibility=0;lm[16].x+=.12;assert.ok(p.update(lm,.7,'onehand').x<0);});
test('left-hand mode calibrates and steers without the right wrist',()=>{const p=new PoseController(),lm=landmarks();lm[16].visibility=0;for(let i=0;i<20;i++)p.update(lm,.7,'onehand_left');assert.ok(p.ready);lm[15].x+=.12;assert.ok(p.update(lm,.7,'onehand_left').x<0);lm[15].visibility=0;assert.deepEqual(p.update(lm,.7,'onehand_left'),{x:0,y:0});});
