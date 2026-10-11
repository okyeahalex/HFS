export function floatingPanel(root,defaults){
 const handle=root.querySelector('.panel-handle'),resize=root.querySelector('.panel-resize'),minimize=root.querySelector('.panel-minimize'),key='daedalus_window_'+root.id;let saved=null,placed=false,wasVisible=false,lastHeight;
 try{saved=JSON.parse(localStorage.getItem(key));}catch{}
 const visible=()=>!root.hidden&&getComputedStyle(root).display!=='none';
 function apply(r){const vw=innerWidth,vh=innerHeight,w=Math.max(Math.min(220,vw-16),Math.min(r.w,vw-16)),h=Math.max(root.classList.contains('minimized')?42:Math.min(180,vh-16),Math.min(r.h,vh-16));const x=Math.max(8,Math.min(r.x,vw-w-8)),y=Math.max(8,Math.min(r.y,vh-h-8));Object.assign(root.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px',right:'auto',bottom:'auto',maxWidth:'none',maxHeight:'none'});}
 function rect(){const r=root.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}
 function persist(){try{localStorage.setItem(key,JSON.stringify({...rect(),h:root.classList.contains('minimized')?(lastHeight||defaults().h):rect().h}));}catch{}}
 function ensure(){if(!visible())return;if(!placed){const r=saved&&['x','y','w','h'].every(k=>Number.isFinite(saved[k]))?saved:defaults();apply(r);placed=true;}else apply(rect());}
 const observer=new MutationObserver(()=>{const v=visible();if(v&&!wasVisible)ensure();wasVisible=v;});observer.observe(root,{attributes:true,attributeFilter:['hidden','style']});ensure();
 function gesture(e,sizing){if(e.button!==0||e.target.closest('button,select,input'))return;e.preventDefault();root.style.zIndex=String(++floatingPanel.z);const start=rect(),x=e.clientX,y=e.clientY,target=e.currentTarget;target.setPointerCapture(e.pointerId);function move(v){apply({...start,x:sizing?start.x:start.x+v.clientX-x,y:sizing?start.y:start.y+v.clientY-y,w:sizing?start.w+v.clientX-x:start.w,h:sizing?start.h+v.clientY-y:start.h});}function end(){target.removeEventListener('pointermove',move);target.removeEventListener('pointerup',end);target.removeEventListener('pointercancel',end);persist();}target.addEventListener('pointermove',move);target.addEventListener('pointerup',end);target.addEventListener('pointercancel',end);}
 handle.addEventListener('pointerdown',e=>gesture(e,false));resize.addEventListener('pointerdown',e=>gesture(e,true));
 for(const [target,sizing] of [[handle,false],[resize,true]])target.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();const r=rect(),d=e.shiftKey?30:10,dx=e.key==='ArrowRight'?d:e.key==='ArrowLeft'?-d:0,dy=e.key==='ArrowDown'?d:e.key==='ArrowUp'?-d:0;apply({...r,x:r.x+(sizing?0:dx),y:r.y+(sizing?0:dy),w:r.w+(sizing?dx:0),h:r.h+(sizing?dy:0)});persist();});
 minimize.onclick=()=>{const collapsed=root.classList.toggle('minimized');minimize.textContent=collapsed?'＋':'−';minimize.setAttribute('aria-label',collapsed?'Expand panel':'Minimize panel');if(collapsed){lastHeight=rect().h;root.style.height='42px';}else{const r=rect();apply({...r,h:lastHeight||300});}};
 addEventListener('resize',()=>{if(visible()){if(root.classList.contains('minimized')){const r=rect();apply({...r,h:lastHeight||300});root.style.height='42px';}else ensure();}});
 return {ensure};
}
floatingPanel.z=12;
