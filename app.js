const $=s=>document.querySelector(s);
const video=$('#preview'), input=$('#videoInput'), audioInput=$('#audioInput');
let videoURL=null,audioURL=null;

function fmt(sec){if(!isFinite(sec))sec=0;const m=Math.floor(sec/60),s=Math.floor(sec%60);return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
function loadVideo(file){
  if(videoURL)URL.revokeObjectURL(videoURL);
  videoURL=URL.createObjectURL(file);
  video.src=videoURL; video.style.display='block'; $('#emptyState').style.display='none';
  $('#status').textContent=file.name; $('#toolMessage').textContent='Video loaded locally. Nothing is uploaded.';
  const clip=document.createElement('div');clip.className='clip';clip.textContent=file.name;
  $('#videoTrack').replaceChildren(clip);
}
$('#newBtn').onclick=()=>input.click(); $('#openBtn').onclick=()=>input.click();
input.onchange=e=>{if(e.target.files[0])loadVideo(e.target.files[0])};

$('#playBtn').onclick=()=>{if(video.paused){video.play();$('#playBtn').textContent='❚❚'}else{video.pause();$('#playBtn').textContent='▶'}};
video.ontimeupdate=()=>{
 if(video.duration){$('#scrubber').value=video.currentTime/video.duration*100;$('#time').textContent=`${fmt(video.currentTime)} / ${fmt(video.duration)}`;}
};
video.onloadedmetadata=()=>{$('#durationLabel').textContent=fmt(video.duration);};
$('#scrubber').oninput=e=>{if(video.duration)video.currentTime=video.duration*e.target.value/100};
$('#speed').oninput=e=>{video.playbackRate=+e.target.value;$('#speedValue').textContent=e.target.value+'×'};
$('#volume').oninput=e=>{video.volume=+e.target.value;$('#volumeValue').textContent=Math.round(e.target.value*100)+'%'};

function tool(name){
 const messages={
  trim:'Trim mode selected — use the timeline handles in the next editing module.',
  split:'Split marker placed at '+fmt(video.currentTime)+'.',
  music:'Choose an audio file from your device.',
  text:'Text overlay enabled. Tap Text again to edit the title.',
  effects:'Effects panel selected — cinematic effects module ready to expand.',
  speed:'Speed control is active on the right panel.',
  filter:'Filter selected — choose a cinematic look in the next module.',
  volume:'Volume control is active on the right panel.'
 };
 $('#toolMessage').textContent=messages[name]||'Tool selected';
 if(name==='music')audioInput.click();
 if(name==='text')$('#textOverlay').classList.toggle('hidden');
 if(name==='split') video.pause();
}
document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>tool(b.dataset.tool));
audioInput.onchange=e=>{
 const f=e.target.files[0];if(!f)return;
 if(audioURL)URL.revokeObjectURL(audioURL);audioURL=URL.createObjectURL(f);
 $('#toolMessage').textContent='Music loaded locally: '+f.name;
};
$('#fitBtn').onclick=()=>document.fullscreenElement?document.exitFullscreen():$('#previewWrap').requestFullscreen?.();
$('#exportBtn').onclick=()=>{
 if(!videoURL){alert('Add a video first.');return}
 // Browser-native export placeholder: download original local media.
 // Real trim/effect rendering can be added with ffmpeg.wasm/WebCodecs.
 const a=document.createElement('a');a.href=videoURL;a.download='mithra-video.mp4';a.click();
 $('#toolMessage').textContent='Export started. Advanced rendered export can be added with ffmpeg.wasm.';
};
