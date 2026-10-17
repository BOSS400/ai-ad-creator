const $ = id => document.getElementById(id);
const canvas = $("adCanvas"), ctx = canvas.getContext("2d");
let productImage = null, animationFrame = null, recorder = null, chunks = [], recordingStream = null;
const W=canvas.width,H=canvas.height;
const palettes={bold:["#111827","#6d5dfc","#ffcc70"],premium:["#10151d","#b9c4d6","#f6f1e7"],friendly:["#102a35","#2dd4bf","#fef3c7"]};

$("photoInput").addEventListener("change",e=>{
  const f=e.target.files&&e.target.files[0]; if(!f)return;
  const url=URL.createObjectURL(f); const im=new Image();
  im.onload=()=>{productImage=im;$("photoPreview").src=url;$("photoPreview").hidden=false;$("uploadPlaceholder").hidden=true;drawAd(0);setStatus("Photo added. Generate ad copy, then preview or export.");};
  im.onerror=()=>setStatus("Could not open that image. Try a JPG or PNG."); im.src=url;
});

function clean(s){return (s||"").trim();}
function details(){return {name:clean($("productName").value)||"Your Next Favourite Product",price:clean($("productPrice").value),benefit:clean($("benefit").value),link:clean($("productLink").value),audience:$("audience").value,style:$("adStyle").value,duration:Number($("duration").value)}}
function formatPrice(p){if(!p)return "";return "₹"+p.replace(/[₹,\s]/g,"");}
function buildScript(){
  const d=details(), price=formatPrice(d.price);
  const open={bold:`Looking for your next favourite find? Meet the ${d.name}.`,premium:`Discover the ${d.name}.`,friendly:`Hey! Take a look at the ${d.name}.`}[d.style];
  const benefit=d.benefit?`${d.benefit}.`:"A product worth checking out.";
  return `${open} ${benefit} ${price?`Listed at ${price}. `:""}Made for ${d.audience.toLowerCase()}. Check the details and see if it is right for you. Tap the link to learn more.`;
}
function buildCaption(){
 const d=details(),price=formatPrice(d.price);
 return `✨ Meet the ${d.name}${price?" — "+price:""}!\n${d.benefit?d.benefit+". ":""}Discover the details and decide if it’s right for you.\n${d.link?`Shop / learn more: ${d.link}\n`:""}#ProductFinds #SmartShopping #ProductReview #OnlineShopping\n\nAffiliate disclosure: I may earn a commission if you buy through my link, at no extra cost to you. Check the seller page for the latest price and availability.`;
}
$("generateCopy").addEventListener("click",()=>{$("scriptText").value=buildScript();$("captionText").value=buildCaption();drawAd(0);setStatus("Ad copy and caption generated. Edit the script if you like.");});
$("makeCaption").addEventListener("click",()=>{$("captionText").value=buildCaption();setStatus("Caption generated.");});
$("copyCaption").addEventListener("click",async()=>{const t=$("captionText").value||buildCaption();try{await navigator.clipboard.writeText(t);setStatus("Caption copied.");}catch(e){$("captionText").focus();$("captionText").select();setStatus("Caption selected. Long-press and choose Copy.");}});
function say(text){
 if(!("speechSynthesis" in window)){setStatus("This browser does not support built-in speech. Try Chrome on Android.");return}
 speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=$("voiceLanguage").value;u.rate=0.94;
 const voices=speechSynthesis.getVoices();const match=voices.find(v=>v.lang.toLowerCase()==u.lang.toLowerCase())||voices.find(v=>v.lang.toLowerCase().startsWith(u.lang.slice(0,2).toLowerCase()));if(match)u.voice=match;
 u.onstart=()=>setStatus("Voiceover playing…");u.onend=()=>setStatus("Voiceover finished.");u.onerror=()=>setStatus("Voice playback was unavailable. Check device/browser voice settings.");speechSynthesis.speak(u);
}
$("previewVoice").addEventListener("click",()=>say(clean($("scriptText").value)||buildScript()));
function roundedRect(x,y,w,h,r,fill){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();}
function wrapText(text,x,y,maxWidth,lineHeight,maxLines=3){ctx.textAlign="center";let words=text.split(/\s+/),line="",lines=[];for(const word of words){const test=line?line+" "+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word}else line=test}if(line)lines.push(line);lines=lines.slice(0,maxLines);lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineHeight));return lines.length*lineHeight}
function drawProductImage(y,scale=1){
 const box={x:95,y:y,w:530,h:470};
 roundedRect(box.x,box.y,box.w,box.h,30,"#ffffff");
 if(productImage){
  const pad=24, maxW=box.w-pad*2,maxH=box.h-pad*2,ratio=Math.min(maxW/productImage.width,maxH/productImage.height);
  const iw=productImage.width*ratio*scale,ih=productImage.height*ratio*scale;
  ctx.save();ctx.beginPath();ctx.roundRect(box.x+8,box.y+8,box.w-16,box.h-16,22);ctx.clip();ctx.drawImage(productImage,box.x+(box.w-iw)/2,box.y+(box.h-ih)/2,iw,ih);ctx.restore();
 }else{
  ctx.fillStyle="#d8def0";ctx.textAlign="center";ctx.font="bold 27px system-ui";ctx.fillText("YOUR PRODUCT PHOTO",W/2,y+220);
  ctx.font="100px system-ui";ctx.fillText("✦",W/2,y+335);
 }
}
function drawAd(t){
 const d=details(),p=palettes[d.style]||palettes.bold;
 const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,p[0]);bg.addColorStop(1,"#242b4a");ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 ctx.globalAlpha=.12;ctx.fillStyle=p[1];ctx.beginPath();ctx.arc(W*.85,H*.12,220+Math.sin(t/400)*18,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
 ctx.fillStyle=p[2];ctx.textAlign="center";ctx.font="bold 23px system-ui";ctx.fillText("YOUR NEXT GREAT FIND",W/2,90);
 ctx.fillStyle="#ffffff";ctx.font="800 48px system-ui";wrapText(d.name,W/2,165,610,58,2);
 const shift=Math.sin(t/550)*9;drawProductImage(300+shift,1+Math.sin(t/700)*.018);
 ctx.fillStyle=p[2];ctx.font="bold 31px system-ui";ctx.fillText(d.benefit||"Worth a closer look",W/2,845);
 if(d.price){roundedRect(190,890,340,82,25,p[1]);ctx.fillStyle="#fff";ctx.font="bold 42px system-ui";ctx.fillText(formatPrice(d.price),W/2,945)}
 roundedRect(110,1010,500,100,28,p[2]);ctx.fillStyle="#10172b";ctx.font="bold 32px system-ui";ctx.fillText("CHECK IT OUT",W/2,1072);
 ctx.fillStyle="#d7def0";ctx.font="20px system-ui";ctx.fillText("Details & price may change · Check seller page",W/2,1165);
 ctx.fillStyle="#aebaff";ctx.font="bold 19px system-ui";ctx.fillText("MADE WITH AI AD CREATOR",W/2,1220);
}
function animate(){drawAd(performance.now());animationFrame=requestAnimationFrame(animate)}
$("previewAd").addEventListener("click",()=>{if(animationFrame){cancelAnimationFrame(animationFrame);animationFrame=null;$("previewAd").textContent="▶ Preview animation";drawAd(0)}else{animate();$("previewAd").textContent="■ Stop preview";setStatus("Previewing animated product ad.");}});
function setStatus(s){$("status").textContent=s}
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
$("exportVideo").addEventListener("click",async()=>{
 if(!canvas.captureStream||!window.MediaRecorder){setStatus("Video export is not supported in this browser. Try updated Chrome on Android.");return}
 if(!productImage){setStatus("Please add a product photo before exporting.");return}
 const btn=$("exportVideo");btn.disabled=true;$("downloadLink").hidden=true;
 try{
  if(animationFrame){cancelAnimationFrame(animationFrame);animationFrame=null;$("previewAd").textContent="▶ Preview animation"}
  drawAd(0);
  recordingStream=canvas.captureStream(30);chunks=[];
  const mimeTypes=["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"];
  const mime=mimeTypes.find(t=>MediaRecorder.isTypeSupported(t))||"";
  recorder=new MediaRecorder(recordingStream,mime?{mimeType:mime}:undefined);
  recorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
  recorder.onstop=()=>{
   const blob=new Blob(chunks,{type:recorder.mimeType||"video/webm"}),url=URL.createObjectURL(blob);
   const a=$("downloadLink");a.href=url;a.download="ai-product-ad.webm";a.textContent="⬇ Download your video";a.hidden=false;
   setStatus("Video ready! Download it, then upload it to Instagram Reels or YouTube Shorts.");
   recordingStream.getTracks().forEach(t=>t.stop());btn.disabled=false;
  };
  recorder.start(250);setStatus("Creating video… keep this page open.");
  const start=performance.now(),duration=details().duration*1000;
  await new Promise(resolve=>{
   function frame(now){drawAd(now-start);if(now-start<duration){requestAnimationFrame(frame)}else{recorder.stop();resolve()}}
   requestAnimationFrame(frame)
  });
 }catch(err){setStatus("Could not export video in this browser. Try Chrome and allow the page to stay active.");btn.disabled=false;if(recordingStream)recordingStream.getTracks().forEach(t=>t.stop())}
});
["productName","productPrice","benefit","adStyle"].forEach(id=>$(id).addEventListener("input",()=>drawAd(0)));
drawAd(0);
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
