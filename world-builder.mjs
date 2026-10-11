import {populateObstacleWorld} from './obstacle-world.mjs';
import {MAPS} from './game-config.mjs';
export function populateWorld(T,world,id,gates,mode){const m=MAPS[id],theme=m.theme;if(m.low)return populateObstacleWorld(T,world,id,gates,mode);
 const mat=(c,e=0)=>new T.MeshStandardMaterial({color:c,roughness:.8,emissive:c,emissiveIntensity:e});
 const add=(geo,material,parent=world)=>{const o=new T.Mesh(geo,material);parent.add(o);return o;};
 const box=(x,y,z,w,h,d,c)=>{const o=add(new T.BoxGeometry(w,h,d),mat(c));o.position.set(x,y,z);return o;};
 const ground=add(new T.PlaneGeometry(22000,22000),mat(m.ground));ground.rotation.x=-Math.PI/2;ground.position.set(0,-12,-3000);
 if(theme==='storm'){const grid=new T.GridHelper(10000,100,0x54798b,m.ground);grid.position.set(0,-11.7,-2500);world.add(grid);}
 const animated=[],colliders=[],beacons=[];
 const registerBox=(o,w,h,d,label='Building impact')=>{colliders.push({kind:'box',min:{x:o.position.x-w/2,y:o.position.y-h/2,z:o.position.z-d/2},max:{x:o.position.x+w/2,y:o.position.y+h/2,z:o.position.z+d/2},label});o.castShadow=true;o.receiveShadow=true;};
 // Repeating emissive window texture adds facade detail without hundreds of meshes.
 let facade;if(theme==='city'){const canvas=document.createElement('canvas');canvas.width=128;canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle='#182739';ctx.fillRect(0,0,128,256);for(let y=8;y<256;y+=16)for(let x=8;x<128;x+=16){const on=(x*13+y*7)%11<7;ctx.fillStyle=on?((x+y)%3?'#f5d3a1':'#7cdae4'):'#243c51';ctx.fillRect(x,y,6,8);}facade=new T.CanvasTexture(canvas);facade.colorSpace=T.SRGBColorSpace;facade.wrapS=facade.wrapT=T.RepeatWrapping;facade.anisotropy=4;
 const avenue=box(0,-11.4,-2700,215,.2,6600,0x18222c);avenue.receiveShadow=true;for(let i=0;i<45;i++){box(0,-11.2,200-i*150,2,.05,60,0xf2d38a);if(i%2===0)box(0,-11.1,200-i*150,1500,.06,35,0x202b35);}
 }
 const beaconAt=(x,y,z,label)=>{const p={x,y,z,r:13,points:100,collected:false,label};const root=new T.Group();root.position.set(x,y,z);world.add(root);const gem=add(new T.OctahedronGeometry(4),mat(0xffce62,1.2),root);const halo=add(new T.TorusGeometry(9,.25,6,40),mat(0xffce62,1),root);p.obj=root;beacons.push(p);};
 for(let i=0;i<100;i++){const side=i%2?1:-1,x=side*(240+(i*79%1100)),z=450-i*60,h=70+(i*37%160);
 if(theme==='city'){const w=55+(i%4)*12,d=65,cx=side*(150+Math.floor((i%10)/2)*130),cz=300-Math.floor(i/10)*540-(i%5)*95;const o=box(cx,h/2-12,cz,w,h,d,0x293c51);registerBox(o,w,h,d);o.material.map=facade;o.material.emissiveMap=facade;o.material.emissive.set(0xffffff);o.material.emissiveIntensity=.38;o.material.roughness=.4;
 const roof=box(cx,h-10,cz,w+3,2,d+3,0x3c5364);registerBox(roof,w+3,2,d+3);box(cx,h-4,cz,12,8,15,0x1c3547);
 if(i%6===0){beaconAt(cx,h+12,cz,'ROOFTOP CHECKPOINT');const pad=add(new T.TorusGeometry(12,.7,6,32),mat(0x71e1bf,.8));pad.rotation.x=Math.PI/2;pad.position.set(cx,h-8,cz);}
 if(i%9===0){const sign=box(cx-side*(w/2+.2),h*.65-12,cz, .6,10,35,0x2fe7d0);sign.material.emissiveIntensity=1.2;}
 }
 else{const color=theme==='desert'?(i%2?0xe0b678:0xc99958):theme==='ice'?0xb9d5dd:theme==='coast'?0x5b9a7f:theme==='storm'?0x4e665b:0x75a46b;const mountain=add(new T.ConeGeometry(95+(i%5)*24,h,theme==='valley'?12:7),mat(color));mountain.position.set(x,h/2-12,z);mountain.castShadow=true;mountain.receiveShadow=true;colliders.push({kind:'cone',x,z,radius:95+(i%5)*24,height:h,bottom:-12,label:'Terrain impact'});if(i%18===0)beaconAt(x,h+16,z,'SUMMIT CHECKPOINT');
 if(theme==='ice'&&i%2===0){const cap=add(new T.ConeGeometry(35,h*.27,7),mat(0xe2edf1));cap.position.set(x,h*.86-12,z);}
 if(theme==='desert'&&i%7===0){const arch=add(new T.TorusGeometry(60,10,8,24,Math.PI),mat(0xdca96b));arch.position.set(side*200,5,z);}
 if(theme==='coast'&&i%5===0){const trunk=add(new T.CylinderGeometry(1,1.5,25,6),mat(0x806147));trunk.position.set(side*200,0,z);for(let j=0;j<5;j++){const leaf=box(side*200,13,z,24,.7,4,0x378866);leaf.rotation.y=j*Math.PI/2.5;}}
 if(theme==='valley'&&i%9===0){box(side*195,28,z,2,80,2,0xe3e8e2);const rotor=new T.Group();rotor.position.set(side*195,66,z);world.add(rotor);for(let j=0;j<3;j++){const blade=add(new T.BoxGeometry(1.5,30,.6),mat(0xf3f3e5),rotor);blade.position.set(Math.sin(j*2.094)*15,Math.cos(j*2.094)*15,0);blade.rotation.z=-j*2.094;}animated.push(rotor);}}
 }
 if(theme==='ice'){for(let i=0;i<4;i++){const geo=new T.PlaneGeometry(1600,150,64,8),pos=geo.attributes.position;for(let j=0;j<pos.count;j++)pos.setY(j,pos.getY(j)+Math.sin(pos.getX(j)*.007+i)*65);geo.computeVertexNormals();const aurora=add(geo,new T.MeshBasicMaterial({color:i%2?0x7e77ff:0x49e6b3,side:T.DoubleSide,transparent:true,opacity:.22,depthWrite:false}));aurora.position.set((i%2?1:-1)*300,650+i*90,-1400-i*650);}}
 const night=theme==='city'||theme==='ice';if(night){const coords=[];for(let i=0;i<900;i++)coords.push(Math.sin(i*12.98)*4500,600+i*97%2400,Math.cos(i*7.13)*4000-2500);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(coords,3));world.add(new T.Points(geo,new T.PointsMaterial({color:0xe6f4ff,size:2})));}
 const cloudMat=new T.MeshBasicMaterial({color:theme==='storm'?0x647581:0xf2f7fb,transparent:true,opacity:theme==='storm'?.75:.55,depthWrite:false});const cloudGeo=new T.SphereGeometry(1,12,8);for(let i=0;i<45;i++){const c=add(cloudGeo,cloudMat);c.scale.set(85+i%4*40,theme==='storm'?25:12,50);c.position.set((i%2?1:-1)*(100+i*23%800),theme==='storm'?210+i%4*22:280+i%5*25,200-i*130);}
 if(theme==='desert'){const s=add(new T.SphereGeometry(190,20,12),new T.MeshBasicMaterial({color:0xffd489}));s.position.set(-1800,700,-5500);}
 const rings=[];if(['race','time','practice'].includes(mode)){for(const g of gates){const r=add(new T.TorusGeometry(g.r,.45,8,64),mat(0x5cdbce,.8));r.position.set(g.x,g.y,g.z);rings.push(r);}
 const curve=new T.CatmullRomCurve3([new T.Vector3(0,100,30),...gates.map(g=>new T.Vector3(g.x,g.y,g.z))]);const line=new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(500)),new T.LineDashedMaterial({color:0xc6f7e9,dashSize:8,gapSize:10,transparent:true,opacity:.35}));line.computeLineDistances();world.add(line);}
 const pickups=[],hazards=[];
 if(mode==='hunt'){for(let i=0;i<70;i++){const p={x:Math.sin(i*.53)*55,y:95+Math.cos(i*.61)*24,z:-100-i*60,r:13,collected:false};const o=add(new T.IcosahedronGeometry(3,1),mat(i%5===0?0xffdb71:0x60ffca,1));o.position.set(p.x,p.y,p.z);p.obj=o;p.points=i%5===0?30:10;pickups.push(p);}}
 if(mode==='survival'){for(let i=0;i<70;i++){const p={x:Math.sin(i*2.4)*85,y:70+(i*19%75),z:-150-i*55,r:9,hit:false};const o=add(new T.IcosahedronGeometry(7,0),mat(0xee6971,.6));o.position.set(p.x,p.y,p.z);const warning=add(new T.TorusGeometry(10,.18,6,24),mat(0xffb09a,.9),o);p.obj=o;hazards.push(p);}
 for(const side of [-1,1]){const line=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(side*130,40,40),new T.Vector3(side*130,40,-6000)]),new T.LineBasicMaterial({color:0xffa68b}));world.add(line);}}
 ground.receiveShadow=true;return {rings,pickups,hazards,animated,colliders,beacons};
}
