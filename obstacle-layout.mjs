// Shared visible/collision dimensions, in metres. Ground is y=-12.
export function obstacleLayout(theme){const items=[];const dock=theme==='harbor';
 for(let i=0;i<24;i++){const z=-115-i*95,side=i%2?1:-1;
  for(const s of [-1,1]){
   items.push({type:'pole',x:s*26,y:-6,z,w:.45,h:12,d:.45,label:'Streetlight impact'});
   items.push({type:'lamp',x:s*23,y:-.3,z,w:6.5,h:.7,d:1.5,label:'Streetlight arm impact'});
  }
  if(i%3===0){items.push({type:'pole',x:side*9,y:-5,z:z-38,w:.5,h:14,d:.5,label:'Streetlight impact'});items.push({type:'lamp',x:side*6,y:1.5,z:z-38,w:6,h:.7,d:1.5,label:'Streetlight arm impact'});}
  if(i%3===1)items.push({type:dock?'container':'bus',x:side*12,y:dock?-3:-9.8,z:z-35,w:9,h:dock?18:4.4,d:22,label:dock?'Container impact':'Bus impact'});
  if(i%4===2){for(const s of [-1,1])items.push({type:'support',x:s*22,y:-5,z:z-40,w:2,h:14,d:2,label:'Bridge support impact'});items.push({type:'bridge',x:0,y:2,z:z-40,w:46,h:2,d:10,label:'Bridge impact'});}
  if(i%4===3)items.push({type:'barrier',x:side*12,y:-8,z:z-30,w:16,h:8,d:3,label:'Construction barrier impact'});
 }
 return items;
}

export function obstacleColliders(theme){return obstacleLayout(theme).map(p=>({kind:'box',label:p.label,min:{x:p.x-p.w/2,y:p.y-p.h/2,z:p.z-p.d/2},max:{x:p.x+p.w/2,y:p.y+p.h/2,z:p.z+p.d/2}}));}
