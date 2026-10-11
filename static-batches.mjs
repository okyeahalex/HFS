// Draw repeated solid scenery with shared geometry. Keep local batches small
// enough for camera/shadow frustum culling; collision data remains independent.
export function batchStaticBoxes(T,world,excluded=[],chunkSize=400){
 const skip=new Set(excluded),groups=new Map(),removedGeo=new Set(),removedMat=new Set();
 const signature=m=>[m.type,m.color?.getHex(),m.emissive?.getHex(),m.emissiveIntensity,m.roughness,m.metalness,m.side,m.opacity,m.depthWrite,m.depthTest,m.map?.uuid,m.emissiveMap?.uuid,m.normalMap?.uuid,m.alphaTest,m.flatShading,m.vertexColors,m.wireframe,m.polygonOffset,m.polygonOffsetFactor,m.polygonOffsetUnits].join('|');
 world.updateMatrixWorld(true);
 for(const o of [...world.children]){if(!o.isMesh||!o.visible||skip.has(o)||o.geometry.type!=='BoxGeometry'||Array.isArray(o.material)||o.material.transparent)continue;
  const key=signature(o.material)+'|'+o.castShadow+'|'+o.receiveShadow+'|'+Math.floor(o.position.z/chunkSize);
  if(!groups.has(key))groups.set(key,[]);groups.get(key).push(o);
 }
 let count=0,batches=0;const unit=new T.BoxGeometry(1,1,1),scale=new T.Matrix4(),matrix=new T.Matrix4();
 for(const objects of groups.values()){if(objects.length<3)continue;const first=objects[0],batch=new T.InstancedMesh(unit,first.material,objects.length);batch.castShadow=first.castShadow;batch.receiveShadow=first.receiveShadow;
  objects.forEach((o,i)=>{const g=o.geometry.parameters;scale.makeScale(g.width,g.height,g.depth);matrix.multiplyMatrices(o.matrix,scale);batch.setMatrixAt(i,matrix);removedGeo.add(o.geometry);removedMat.add(o.material);world.remove(o);});
  batch.instanceMatrix.setUsage(T.StaticDrawUsage);batch.computeBoundingBox();batch.computeBoundingSphere();world.add(batch);count+=objects.length;batches++;
 }
 if(!batches)unit.dispose();const usedGeo=new Set(),usedMat=new Set();world.traverse(o=>{if(o.geometry)usedGeo.add(o.geometry);if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])usedMat.add(m);});for(const g of removedGeo)if(!usedGeo.has(g))g.dispose();for(const m of removedMat)if(!usedMat.has(m))m.dispose();
 world.userData.batchStats={originalBoxes:count,batches,savedDraws:count-batches};return world.userData.batchStats;
}
