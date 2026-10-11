import {course,evaluate,weightsCount} from './flight-core.mjs';
import {MAPS,configuration} from './game-config.mjs';
onmessage=async({data})=>{try{const {id,vehicle='trainer',assist='guided',existing}=data,gates=course(id),wind=MAPS[id].wind,cfg=configuration(vehicle,assist);cfg.startHeight=MAPS[id].low?-5:100;cfg.obstacleTheme=MAPS[id].low?MAPS[id].theme:null;if(MAPS[id].low&&cfg.hover)cfg.speed*=.6;
const zero=Array(weightsCount).fill(0);let bestW=zero,best=evaluate(zero,gates,wind,cfg).score;
if(existing){const s=evaluate(existing,gates,wind,cfg).score;if(s>best){best=s;bestW=existing;}}
let pop=[bestW,...Array.from({length:35},()=>bestW.map(v=>v+(Math.random()*2-1)*.8))];
for(let gen=0;gen<32;gen++){const ranked=pop.map(w=>({w,...evaluate(w,gates,wind,cfg)})).sort((a,b)=>b.score-a.score);
if(ranked[0].score>best){best=ranked[0].score;bestW=ranked[0].w.slice();}
const current=evaluate(bestW,gates,wind,cfg);
postMessage({gen:gen+1,total:32,score:best,average:ranked.reduce((s,r)=>s+r.score,0)/ranked.length,worst:ranked.at(-1).score,hits:current.hits,gateCount:gates.length,path:current.path,trials:[ranked[0],ranked[Math.floor(ranked.length/2)],ranked.at(-1)].map(r=>({path:r.path,hits:r.hits,score:r.score})),population:ranked.map(r=>r.score)});
pop=ranked.slice(0,5).map(r=>r.w.slice());while(pop.length<36){const w=ranked[Math.floor(Math.random()*10)].w;pop.push(w.map(v=>Math.random()<.16?v+(Math.random()*2-1)*.5:v));}
await new Promise(r=>setTimeout(r,130));}
postMessage({done:true,w:bestW,score:best});}catch(e){postMessage({error:e.message});}};
