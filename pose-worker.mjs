let pose=null,hands=null;
onmessage=async({data:d})=>{
 if(d.type==='init'){try{postMessage({type:'stage',message:'Loading tracking runtime…'});const {FilesetResolver,PoseLandmarker,HandLandmarker}=await import('./pose/vision.mjs');postMessage({type:'stage',message:'Loading tracking WASM…'});const fs=await FilesetResolver.forVisionTasks(new URL('./pose',self.location.href).href);postMessage({type:'stage',message:'Loading body model…'});pose=await PoseLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:new URL('./pose/pose_landmarker_lite.task',self.location.href).href,delegate:'CPU'},canvas:new OffscreenCanvas(480,360),runningMode:'VIDEO',numPoses:1});
  try{postMessage({type:'stage',message:'Loading finger model…'});hands=await HandLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:new URL('./pose/hand_landmarker.task',self.location.href).href,delegate:'CPU'},canvas:new OffscreenCanvas(480,360),runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:.6,minHandPresenceConfidence:.6,minTrackingConfidence:.6});}catch{}
  postMessage({type:'ready',hands:!!hands});
 }catch(e){postMessage({type:'error',message:e.message});}return;}
 if(d.type==='frame'){const start=performance.now();try{const lm=pose.detectForVideo(d.bitmap,d.timestamp).landmarks?.[0];let handResult=null;try{if(hands)handResult=hands.detectForVideo(d.bitmap,d.timestamp);}catch{}
  postMessage({type:'result',lm,hands:handResult,timestamp:d.timestamp,duration:performance.now()-start});
 }catch(e){postMessage({type:'frameError',message:e.message});}finally{d.bitmap.close();}}
};
