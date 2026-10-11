import {MAPS} from './game-config.mjs';
import {obstacleLayout} from './obstacle-layout.mjs';
export function populateObstacleWorld(T,world,id,gates,mode){const dock=MAPS[id].theme==='harbor',colliders=[],beacons=[],rings=[],animated=[];
 const material=(color,roughness=.75,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
 const box=(x,y,z,w,h,d,mat,label)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),typeof mat==='number'?material(mat):mat);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;world.add(o);if(label)colliders.push({kind:'box',min:{x:x-w/2,y:y-h/2,z:z-d/2},max:{x:x+w/2,y:y+h/2,z:z+d/2},label});return o;};
 const texture=(kind)=>{const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');let seed=71;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};ctx.fillStyle=kind==='road'?'#43484b':'#a6a69e';ctx.fillRect(0,0,256,256);for(let i=0;i<12000;i++){const v=kind==='road'?60+rand()*35:120+rand()*70;ctx.fillStyle=`rgb(${v},${v},${v})`;ctx.fillRect(rand()*256,rand()*256,1+rand()*2,1);}if(kind==='wall'){for(let y=12;y<256;y+=32)for(let x=12;x<256;x+=32){ctx.fillStyle='#293f4d';ctx.fillRect(x,y,17,23);ctx.fillStyle='#819ea9';ctx.fillRect(x+1,y+1,7,20);ctx.fillStyle='#aeb4b4';ctx.fillRect(x+8,y+1,1,21);}}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(kind==='road'?5:1,kind==='road'?80:1);t.anisotropy=8;return t;};
 const road=material(0xffffff,.96);road.map=texture('road');box(0,-11.85,-1250,62,.2,3100,road);
 box(-40,-11.5,-1250,17,1,3100,0x9b9b93,'Curb impact');box(40,-11.5,-1250,17,1,3100,0x9b9b93,'Curb impact');
 box(-31,-11,-1250,.4,1,3100,0xd1cbb9,'Curb impact');box(31,-11,-1250,.4,1,3100,0xd1cbb9,'Curb impact');
 const ground=new T.Mesh(new T.PlaneGeometry(9000,9000),material(dock?0x367181:0x737c72));ground.rotation.x=-Math.PI/2;ground.position.set(0,-12,-1250);ground.receiveShadow=true;world.add(ground);
 for(let i=0;i<70;i++){box(0,-11.7,100-i*44,.2,.04,19,0xd8c698);for(const side of [-1,1])box(side*22,-11.65,100-i*44,.2,.04,22,0xd7dbd8);}
 const facade=material(0xffffff,.65);facade.map=texture('wall');
 for(let i=0;i<48;i++){const side=i%2?1:-1,x=side*(63+i%3*5),z=160-Math.floor(i/2)*125,h=dock?27+i%4*9:55+i*17%80;
  const b=box(x,h/2-12,z,28,h,88,facade,'Building impact');box(x,h-11,z,30,2,90,0x777e80,'Roof impact');box(x,h-7,z,7,7,12,0x757575,'Roof machinery impact');
  // Shopfront glazing, awnings and door frames at pedestrian height.
  if(!dock){box(x-side*14.1,-7,z,.25,7,68,material(0x406372,.15,.35));for(let j=-2;j<=2;j++)box(x-side*14.4,-7,z+j*15,.4,8,.5,0xaab1b0);box(x-side*16,-2.8,z,4,.5,72,i%3?0x506978:0x936a54,'Awning impact');}
 }
 const steel=material(0x75838b,.35,.7),rubber=material(0x171d22),glass=material(0x345362,.16,.35);
 for(const p of obstacleLayout(MAPS[id].theme)){let mat=steel;if(p.type==='bus')mat=material(0xbcbca9);if(p.type==='container')mat=material(p.z%2?0x935844:0x46767e);if(p.type==='barrier')mat=material(0xe4a94f);if(p.type==='bridge')mat=material(0x6c7377);
  const o=box(p.x,p.y,p.z,p.w,p.h,p.d,mat,p.label);
  if(p.type==='lamp'){const light=box(p.x,p.y-.4,p.z,3,.12,1,0xffe4af);light.material.emissive.set(0xffd393);light.material.emissiveIntensity=.8;}
  if(p.type==='bus'){box(p.x,p.y+.7,p.z,p.w+.05,1.4,15,glass);for(const side of [-1,1])for(const dz of [-7,7]){const wheel=new T.Mesh(new T.CylinderGeometry(.65,.65,1,12),rubber);wheel.rotation.z=Math.PI/2;wheel.position.set(p.x+side*4.4,p.y-1.8,p.z+dz);world.add(wheel);}}
  if(p.type==='container'){for(let j=0;j<10;j++)box(p.x+p.w/2+.05,p.y,p.z-10+j*2,.15,p.h,.3,steel);}
  if(p.type==='barrier'){for(let j=-2;j<=2;j++)box(p.x+j*3,p.y+2,p.z+1.55,1.3,5,.1,0x282a2b);}
 }
 // Trees and parked cars on the pavement are solid too.
 for(let i=0;i<28;i++){const side=i%2?1:-1,z=100-i*93;if(dock){box(side*45,8,z,3,40,3,0xbd975a,'Crane impact');box(side*29,28,z,35,2,3,0xbd975a,'Crane boom impact');}else{box(side*39,-7,z,.4,10,.4,0x6a5741,'Tree impact');const crown=box(side*39,-1,z,6,6,6,0x476749,'Tree crown impact');crown.visible=false;for(let j=0;j<3;j++){const leaf=new T.Mesh(new T.SphereGeometry(2.7,12,8),material(j%2?0x57704a:0x496442));leaf.position.set(side*39+Math.sin(j*2.1),-1+j*.6,z+Math.cos(j*2.1));leaf.castShadow=true;world.add(leaf);}const cx=side*27,cz=z-35;box(cx,-10.7,cz,2,1.5,4.5,material(i%2?0x7e4640:0x50677c,.4,.3),'Parked car impact');box(cx,-9.7,cz+.2,1.65,.9,2.2,glass,'Parked car impact');for(const s of [-1,1])for(const dz of [-1.4,1.4]){const wheel=new T.Mesh(new T.CylinderGeometry(.4,.4,.3,10),rubber);wheel.rotation.z=Math.PI/2;wheel.position.set(cx+s,-11.4,cz+dz);world.add(wheel);}}}
 if(['race','time','practice'].includes(mode))for(const g of gates){const r=new T.Mesh(new T.TorusGeometry(g.r,.12,6,40),material(0x67dbc1));r.material.emissive.set(0x36ad98);r.material.emissiveIntensity=.6;r.position.set(g.x,g.y,g.z);world.add(r);rings.push(r);}
 for(let i=0;i<8;i++){const p={x:(i%2?1:-1)*17,y:-5,z:-170-i*270,r:4,points:100,label:'STREET CHECKPOINT',collected:false};const o=new T.Mesh(new T.OctahedronGeometry(1.3),material(0xffda7b));o.material.emissive.set(0xffc04a);o.material.emissiveIntensity=1;o.position.set(p.x,p.y,p.z);world.add(o);p.obj=o;beacons.push(p);}
 const pickups=[],hazards=[];if(mode==='hunt'||mode==='survival')for(let i=0;i<55;i++){const p={x:Math.sin(i*.8)*18,y:-5+Math.cos(i*.6)*3,z:-100-i*42,r:mode==='hunt'?4:2,points:10,collected:false,hit:false};const o=new T.Mesh(new T.IcosahedronGeometry(mode==='hunt'?1:1.7),material(mode==='hunt'?0x5cf1cc:0xee6971));o.position.set(p.x,p.y,p.z);world.add(o);p.obj=o;(mode==='hunt'?pickups:hazards).push(p);}
 return {colliders,beacons,rings,pickups,hazards,animated};
}
