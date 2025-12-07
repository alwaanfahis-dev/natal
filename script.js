// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎄 Christmas page loaded successfully!');
  
  // Initialize all features
  initSnowEffect();
  initButtons();
  initTreeInteractions();
  createFloatingDecorations();
  initKeyboardShortcuts();
  initWishCarousel();
  initMusicPlayer();
  
  // Set initial theme
  updateThemeDisplay();
  updateCountdown();
});

// ================= SNOW EFFECT =================
let snowAnimation = null;
let snowOn = true;

function initSnowEffect() {
  const canvas = document.getElementById('snow');
  if (!canvas) {
    console.error('Snow canvas not found!');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  
  // Snowflake class
  class Snowflake {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 3 + 1;
      this.d = Math.random() * 1.5 + 0.5;
      this.wind = Math.random() * 0.5 - 0.25;
      this.wiggle = Math.random() * 0.02;
      this.angle = Math.random() * Math.PI * 2;
      this.opacity = Math.random() * 0.5 + 0.5;
    }
    
    update() {
      this.y += Math.pow(this.d, 1.2) * 0.5;
      this.x += Math.sin(this.angle) * 0.8 + this.wind;
      this.angle += this.wiggle;
      
      if (this.y > canvas.height + 5) {
        this.y = -10;
        this.x = Math.random() * canvas.width;
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
      ctx.closePath();
    }
  }
  
  // Create snowflakes
  const flakes = [];
  const FLAKE_COUNT = Math.floor((canvas.width * canvas.height) / 50000);
  
  function createSnowflakes() {
    flakes.length = 0;
    for (let i = 0; i < FLAKE_COUNT; i++) {
      flakes.push(new Snowflake());
    }
  }
  
  function drawSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flakes.forEach(flake => {
      flake.update();
      flake.draw();
    });
  }
  
  function animateSnow() {
    drawSnow();
    if (snowOn) {
      snowAnimation = requestAnimationFrame(animateSnow);
    }
  }
  
  // Initialize snow
  createSnowflakes();
  animateSnow();
  
  // Handle window resize
  window.addEventListener('resize', function() {
    resizeCanvas();
    createSnowflakes();
  });
  
  // Toggle snow button
  const toggleSnowBtn = document.getElementById('toggleSnow');
  if (toggleSnowBtn) {
    toggleSnowBtn.addEventListener('click', function() {
      snowOn = !snowOn;
      
      if (snowOn) {
        animateSnow();
        this.innerHTML = '<span class="btn-icon">❄️</span> Matikan Salju';
        createClickEffect(this, '#4cc9f0');
      } else {
        if (snowAnimation) {
          cancelAnimationFrame(snowAnimation);
        }
        this.innerHTML = '<span class="btn-icon">❄️</span> Hidupkan Salju';
        createClickEffect(this, '#e63946');
      }
    });
  }
}


// ================= BUTTON INTERACTIONS =================
function initButtons() {
  // Play music button
  const playMusicBtn = document.getElementById('playMusic');
  if (playMusicBtn) {
    playMusicBtn.addEventListener('click', function() {
      const musicModal = document.getElementById('musicModal');
      musicModal.classList.add('active');
      createClickEffect(this, '#f4c95d');
    });
  }
  
  // Toggle lights button
  const toggleLightsBtn = document.getElementById('toggleLights');
  if (toggleLightsBtn) {
    let lightsOn = true;
    
    toggleLightsBtn.addEventListener('click', function() {
      lightsOn = !lightsOn;
      const ornaments = document.querySelectorAll('.ornament');
      const star = document.querySelector('.star path');
      
      if (lightsOn) {
        ornaments.forEach(ornament => {
          ornament.style.filter = 'url(#glow)';
        });
        if (star) star.style.filter = 'url(#glow)';
        this.innerHTML = '<span class="btn-icon">✨</span> Matikan Lampu';
        createClickEffect(this, '#ffdd57');
      } else {
        ornaments.forEach(ornament => {
          ornament.style.filter = 'none';
        });
        if (star) star.style.filter = 'none';
        this.innerHTML = '<span class="btn-icon">✨</span> Hidupkan Lampu';
        createClickEffect(this, '#666');
      }
    });
  }
  
  // Show wishes button
  const showWishesBtn = document.getElementById('showWishes');
  if (showWishesBtn) {
    showWishesBtn.addEventListener('click', function() {
      showRandomWish();
      createClickEffect(this, '#9d4edd');
    });
  }
  
  // Change theme button
  const themeBtn = document.getElementById('changeTheme');
  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      changeTheme();
      createClickEffect(this, '#9d4edd');
    });
  }
  
  // Fireworks button
  const fireworksBtn = document.getElementById('fireworksBtn');
  if (fireworksBtn) {
    fireworksBtn.addEventListener('click', function() {
      createFireworks();
      createClickEffect(this, '#ff6b6b');
    });
  }
  
  // Add ornament button
  const addOrnamentBtn = document.getElementById('addOrnament');
  if (addOrnamentBtn) {
    addOrnamentBtn.addEventListener('click', function() {
      addRandomOrnament();
      createClickEffect(this, '#2ecc71');
    });
  }
  
  // Shake tree button
  const shakeTreeBtn = document.getElementById('shakeTree');
  if (shakeTreeBtn) {
    shakeTreeBtn.addEventListener('click', function() {
      shakeChristmasTree();
      createClickEffect(this, '#8b4513');
    });
  }
}

// ================= TREE INTERACTIONS =================
function initTreeInteractions() {
  const ornaments = document.querySelectorAll('.ornament');
  
  ornaments.forEach(ornament => {
    ornament.style.cursor = 'pointer';
    
    ornament.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      createSparkleEffect(rect.left + rect.width / 2, rect.top + rect.height / 2);
      playBellSound();
      
      // Flash effect
      const originalColor = this.getAttribute('fill');
      this.style.fill = '#ffffff';
      
      setTimeout(() => {
        this.style.fill = originalColor;
      }, 300);
    });
    
    // Add hover effect
    ornament.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.transition = 'transform 0.2s ease';
    });
    
    ornament.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
}

// ================= WISH CAROUSEL =================
function initWishCarousel() {
  const slides = document.querySelectorAll('.wish-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  
  function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  
  // Add click events to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });
  
  // Auto rotate slides every 5 seconds
  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);
}

function showRandomWish() {
  const wishes = [
    { icon: '🎄', text: 'Jangan sering2 lepas kacamata' },
    { icon: '⭐', text: 'Kirimin foto selfie lu' },
    { icon: '🎁', text: 'Ivena Chitiki C nya Cengo' },
    { icon: '🦌', text: 'Semoga dapet kado pemukul pingpong ye' },
    { icon: '⛄', text: 'Semoga gua diajak natalan dirumah lu' }
  ];
  
  const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
  
  // Create floating wish
  const wishElement = document.createElement('div');
  wishElement.className = 'floating-decoration';
  wishElement.innerHTML = `${randomWish.icon} ${randomWish.text}`;
  wishElement.style.left = '50%';
  wishElement.style.top = '50%';
  wishElement.style.transform = 'translate(-50%, -50%)';
  wishElement.style.fontSize = '18px';
  wishElement.style.color = '#f4c95d';
  wishElement.style.textAlign = 'center';
  wishElement.style.width = '300px';
  wishElement.style.zIndex = '1000';
  wishElement.style.animation = 'float 3s ease-out forwards';
  
  document.body.appendChild(wishElement);
  
  setTimeout(() => {
    if (wishElement.parentNode) {
      wishElement.remove();
    }
  }, 3000);
}

// ================= MUSIC PLAYER =================
function initMusicPlayer() {
  const musicModal = document.getElementById('musicModal');
  const closeModal = musicModal.querySelector('.modal-close');
  const songItems = musicModal.querySelectorAll('.song-item');
  const playPauseBtn = musicModal.querySelector('#playPauseBtn');
  const progressFill = musicModal.querySelector('.progress-fill');
  
  // Close modal
  closeModal.addEventListener('click', () => {
    musicModal.classList.remove('active');
  });
  
  // Close modal when clicking outside
  musicModal.addEventListener('click', (e) => {
    if (e.target === musicModal) {
      musicModal.classList.remove('active');
    }
  });
  
  // Song selection
  songItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (!e.target.classList.contains('play-btn')) {
        songItems.forEach(s => s.classList.remove('active'));
        item.classList.add('active');
        
        // Update player info
        const songTitle = item.querySelector('.song-title').textContent;
        const totalTime = item.querySelector('.song-duration').textContent;
        document.querySelector('#currentSong').textContent = songTitle;
        document.querySelector('.total-time').textContent = totalTime;
        
        // Start playing
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        progressFill.style.width = '0%';
        
        // Simulate playing
        simulateProgress();
      }
    });
    
    // Play button within song item
    const playBtn = item.querySelector('.play-btn');
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      songItems.forEach(s => s.classList.remove('active'));
      item.classList.add('active');
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      simulateProgress();
    });
  });
  
  // Play/Pause button
  let isPlaying = false;
  playPauseBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playPauseBtn.innerHTML = isPlaying 
      ? '<i class="fas fa-pause"></i>' 
      : '<i class="fas fa-play"></i>';
    
    if (isPlaying) {
      simulateProgress();
    }
  });
  
  // Volume control
  const volumeSlider = document.getElementById('volumeSlider');
  volumeSlider.addEventListener('input', (e) => {
    const volumeIcon = volumeSlider.previousElementSibling;
    const volume = e.target.value;
    
    if (volume == 0) {
      volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 50) {
      volumeIcon.className = 'fas fa-volume-down';
    } else {
      volumeIcon.className = 'fas fa-volume-up';
    }
  });
}

function simulateProgress() {
  const progressFill = document.querySelector('.progress-fill');
  const currentTime = document.querySelector('.current-time');
  const totalTime = document.querySelector('.total-time');
  
  let progress = 0;
  const interval = setInterval(() => {
    if (progress >= 100) {
      clearInterval(interval);
      return;
    }
    
    progress += 0.5;
    progressFill.style.width = `${progress}%`;
    
    // Update time display
    const totalSeconds = 165; // 2:45 in seconds
    const currentSeconds = Math.floor(totalSeconds * (progress / 100));
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
  }, 100);
}

// ================= NEW FEATURES =================
function addRandomOrnament() {
  const tree = document.getElementById('tree');
  const svgNS = "http://www.w3.org/2000/svg";
  
  const colors = ['#e63946', '#f4c95d', '#4cc9f0', '#2ecc71', '#9d4edd', '#ff6b6b'];
  const positions = [
    { cx: 100, cy: 60 },
    { cx: 150, cy: 120 },
    { cx: 50, cy: 120 },
    { cx: 80, cy: 180 },
    { cx: 120, cy: 200 },
    { cx: 140, cy: 140 }
  ];
  
  const randomPos = positions[Math.floor(Math.random() * positions.length)];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  const ornament = document.createElementNS(svgNS, 'circle');
  ornament.setAttribute('class', 'ornament');
  ornament.setAttribute('cx', randomPos.cx);
  ornament.setAttribute('cy', randomPos.cy);
  ornament.setAttribute('r', '6');
  ornament.setAttribute('fill', randomColor);
  ornament.style.cursor = 'pointer';
  ornament.style.filter = 'url(#glow)';
  
  // Add animation
  const animate = document.createElementNS(svgNS, 'animate');
  animate.setAttribute('attributeName', 'r');
  animate.setAttribute('values', '6;8;6');
  animate.setAttribute('dur', '2s');
  animate.setAttribute('repeatCount', 'indefinite');
  ornament.appendChild(animate);
  
  // Add to tree
  const g = tree.querySelector('g');
  g.appendChild(ornament);
  
  // Add interactivity
  ornament.addEventListener('click', function() {
    createSparkleEffect(
      tree.getBoundingClientRect().left + randomPos.cx * 1.3,
      tree.getBoundingClientRect().top + randomPos.cy * 1.1
    );
    playBellSound();
    
    const originalColor = this.getAttribute('fill');
    this.style.fill = '#ffffff';
    setTimeout(() => {
      this.style.fill = originalColor;
    }, 300);
  });
  
  ornament.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
  });
  
  ornament.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
}

function shakeChristmasTree() {
  const tree = document.getElementById('tree');
  
  // Add shake animation
  tree.style.animation = 'shake 0.5s ease-in-out';
  
  // Create falling ornaments effect
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      createFallingOrnament();
    }, i * 100);
  }
  
  // Play shake sound
  playShakeSound();
  
  // Reset animation
  setTimeout(() => {
    tree.style.animation = '';
  }, 500);
}

function createFallingOrnament() {
  const colors = ['#e63946', '#f4c95d', '#4cc9f0', '#2ecc71', '#9d4edd'];
  const ornament = document.createElement('div');
  ornament.className = 'floating-decoration';
  ornament.innerHTML = '🔴';
  ornament.style.left = Math.random() * 100 + 'vw';
  ornament.style.top = '20vh';
  ornament.style.fontSize = '24px';
  ornament.style.color = colors[Math.floor(Math.random() * colors.length)];
  ornament.style.animation = 'float 2s ease-in forwards';
  
  document.body.appendChild(ornament);
  
  setTimeout(() => {
    if (ornament.parentNode) {
      ornament.remove();
    }
  }, 2000);
}

function createFireworks() {
  const container = document.getElementById('fireworksContainer');
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  
  // Create multiple fireworks
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      createFirework(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight / 2,
        colors[Math.floor(Math.random() * colors.length)]
      );
    }, i * 300);
  }
}

function createFirework(x, y, color) {
  const firework = document.createElement('div');
  firework.className = 'firework';
  firework.style.left = x + 'px';
  firework.style.top = y + 'px';
  
  // Create particles
  const particleCount = 36;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'firework-particle';
    particle.style.backgroundColor = color;
    
    // Calculate direction
    const angle = (i * 360) / particleCount;
    const radians = angle * (Math.PI / 180);
    const distance = 50 + Math.random() * 50;
    
    particle.style.setProperty('--tx', Math.cos(radians) * distance + 'px');
    particle.style.setProperty('--ty', Math.sin(radians) * distance + 'px');
    
    firework.appendChild(particle);
  }
  
  document.body.appendChild(firework);
  
  // Remove after animation
  setTimeout(() => {
    if (firework.parentNode) {
      firework.remove();
    }
  }, 1000);
}

// ================= AUDIO FUNCTIONS =================
function playBellSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.log('Audio not available');
  }
}

function playShakeSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 400;
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log('Audio not available');
  }
}

// ================= VISUAL EFFECTS =================
function createSparkleEffect(x, y) {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('div');
      sparkle.className = 'floating-decoration';
      sparkle.innerHTML = '✨';
      sparkle.style.left = x + 'px';
      sparkle.style.top = y + 'px';
      sparkle.style.fontSize = (Math.random() * 10 + 15) + 'px';
      sparkle.style.zIndex = '1000';
      sparkle.style.animation = 'float 1s ease-out forwards';
      
      document.body.appendChild(sparkle);
      
      // Random movement
      setTimeout(() => {
        const moveX = (Math.random() * 100 - 50);
        const moveY = (Math.random() * -100 - 50);
        sparkle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        sparkle.style.opacity = '0';
      }, 10);
      
      // Remove after animation
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.remove();
        }
      }, 1000);
    }, i * 50);
  }
}

function createClickEffect(element, color) {
  const rect = element.getBoundingClientRect();
  const effect = document.createElement('div');
  effect.className = 'click-effect';
  effect.style.left = rect.left + rect.width / 2 + 'px';
  effect.style.top = rect.top + rect.height / 2 + 'px';
  effect.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
  
  document.body.appendChild(effect);
  
  setTimeout(() => {
    if (effect.parentNode) {
      effect.remove();
    }
  }, 600);
}

// ================= COUNTDOWN TIMER =================
function updateCountdown() {
  const countdownElement = document.getElementById('countdown');
  if (!countdownElement) return;
  
  const christmasDate = new Date('December 25, 2025 00:00:00').getTime();
  
  function update() {
    const now = new Date().getTime();
    const distance = christmasDate - now;
    
    if (distance < 0) {
      countdownElement.innerHTML = '🎄 Merry Christmas! 🎄';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  
  update();
  setInterval(update, 1000);
}

// ================= THEME SYSTEM =================
const themes = {
  classic: {
    bg1: '#0a1a1f',
    bg2: '#1d3b3a',
    accent: '#e63946',
    gold: '#f4c95d',
    name: 'Klasik'
  },
  winter: {
    bg1: '#0c1b2b',
    bg2: '#1a365d',
    accent: '#4299e1',
    gold: '#f6ad55',
    name: 'Musim Dingin'
  },
  candy: {
    bg1: '#2d1b69',
    bg2: '#6b21a8',
    accent: '#ec4899',
    gold: '#fbbf24',
    name: 'Permen'
  },
  forest: {
    bg1: '#052e16',
    bg2: '#14532d',
    accent: '#22c55e',
    gold: '#eab308',
    name: 'Hutan'
  }
};

let currentTheme = 'classic';

function changeTheme() {
  const themeNames = Object.keys(themes);
  const currentIndex = themeNames.indexOf(currentTheme);
  const nextTheme = themeNames[(currentIndex + 1) % themeNames.length];
  currentTheme = nextTheme;
  
  const theme = themes[nextTheme];
  const root = document.documentElement;
  
  root.style.setProperty('--bg1', theme.bg1);
  root.style.setProperty('--bg2', theme.bg2);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--gold', theme.gold);
  
  updateThemeDisplay();
}

function updateThemeDisplay() {
  const themeBtn = document.getElementById('changeTheme');
  if (themeBtn && themes[currentTheme]) {
    themeBtn.innerHTML = `<span class="btn-icon">🎨</span> Tema: ${themes[currentTheme].name}`;
  }
}

// ================= FLOATING DECORATIONS =================
function createFloatingDecorations() {
  const decorations = ['🎄', '🎅', '🦌', '⭐', '🔔', '🕯️', '❄️', '🎁'];
  
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const decor = document.createElement('div');
      decor.className = 'floating-decoration';
      decor.textContent = decorations[Math.floor(Math.random() * decorations.length)];
      decor.style.left = Math.random() * 100 + 'vw';
      decor.style.top = Math.random() * 100 + 'vh';
      decor.style.fontSize = Math.random() * 20 + 20 + 'px';
      decor.style.opacity = Math.random() * 0.3 + 0.2;
      decor.style.animationDuration = Math.random() * 10 + 10 + 's';
      decor.style.animationDelay = Math.random() * 5 + 's';
      
      document.body.appendChild(decor);
    }, i * 300);
  }
}

// ================= KEYBOARD SHORTCUTS =================
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Space to play music
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      const playBtn = document.getElementById('playMusic');
      if (playBtn) playBtn.click();
    }
    
    // S to toggle snow
    if (e.key === 's' || e.key === 'S') {
      const toggleSnowBtn = document.getElementById('toggleSnow');
      if (toggleSnowBtn) toggleSnowBtn.click();
    }
    
    // T to change theme
    if (e.key === 't' || e.key === 'T') {
      const themeBtn = document.getElementById('changeTheme');
      if (themeBtn) themeBtn.click();
    }
    
    // F for fireworks
    if (e.key === 'f' || e.key === 'F') {
      const fireworksBtn = document.getElementById('fireworksBtn');
      if (fireworksBtn) fireworksBtn.click();
    }
    
    // W for wishes
    if (e.key === 'w' || e.key === 'W') {
      const wishesBtn = document.getElementById('showWishes');
      if (wishesBtn) wishesBtn.click();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal.active');
      modals.forEach(modal => modal.classList.remove('active'));
    }
  });
}

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;
document.head.appendChild(style);
