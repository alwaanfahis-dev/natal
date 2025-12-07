// Snow Canvas
const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');

let width = canvas.width = innerWidth;
let height = canvas.height = innerHeight;

const flakes = [];
const FLAKE_COUNT = Math.floor((width * height) / 60000);

function rand(min, max){return Math.random()*(max-min)+min}

function createFlakes(){
  for(let i=0;i<FLAKE_COUNT;i++){
    flakes.push({
      x: rand(0,width),
      y: rand(0,height),
      r: rand(0.8,3.6),
      d: rand(0.5,1.5)
    });
  }
}
createFlakes();

function draw(){
  ctx.clearRect(0,0,width,height);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for(const f of flakes){
    ctx.beginPath();
    ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
    ctx.fill();
  }
  update();
}

let angle = 0;
function update(){
  angle += 0.002;
  for(const f of flakes){
    f.y += Math.pow(f.d,1.3) + 0.3;
    f.x += Math.sin(angle + f.d) * 0.6;
    if(f.y > height+5){f.y = -10; f.x = rand(0,width)}
  }
}

let anim;
function loop(){draw();anim=requestAnimationFrame(loop)}
loop();

addEventListener('resize',()=>{
  width = canvas.width = innerWidth;
  height = canvas.height = innerHeight;
});

// Toggle Snow
const toggleSnowBtn = document.getElementById('toggleSnow');
let snowOn = true;

toggleSnowBtn.addEventListener('click',()=>{
  snowOn = !snowOn;
  if(!snowOn){
    cancelAnimationFrame(anim);
    ctx.clearRect(0,0,width,height);
    toggleSnowBtn.textContent = 'Hidupkan Salju';
  } else {
    loop();
    toggleSnowBtn.textContent = 'Matikan Salju';
  }
});

// Melody
const playBtn = document.getElementById('playMelody');
let audioCtx = null;

function playMelody(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const now = audioCtx.currentTime;

  const notes = [523.25,523.25,523.25,392.00,523.25,587.33,659.25];
  const durations = [0.28,0.28,0.28,0.5,0.5,0.5,0.8];

  let t = now;

  for(let i=0; i<notes.length; i++){
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();

    o.connect(g); g.connect(audioCtx.destination);

    o.type = 'sine';
    o.frequency.value = notes[i];

    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12, t+0.02);
    g.gain.linearRampToValueAtTime(0.0, t+durations[i]);

    o.start(t);
    o.stop(t+durations[i]);

    t += durations[i];
  }
}

playBtn.addEventListener('click',()=>{
  playMelody();
  playBtn.setAttribute('aria-pressed','true');
});
