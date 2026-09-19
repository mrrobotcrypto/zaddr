/**
 * ZADDR // TRIBUTE — "NICE TO NOT MEET YOU"
 * 
 * Cinematic Cypherpunk Art Installation & 10-Second Teaser Video Recorder
 * Features:
 * - Web Audio API dark ambient drone & cryptographic synth
 * - Interactive Orchard Lens with floating quantum ash particle physics
 * - Exact 12-frame dissolution continuum
 * - In-browser 10s 60fps video generation (.webm) ready to tweet
 */

(function () {
  'use strict';

  // ── 1. Web Audio API Ambient Atmosphere ───────────────────────────────────
  let audioCtx = null;
  let isSoundOn = true;
  let masterGain = null;
  let droneOsc = null;
  let subOsc = null;
  let noiseNode = null;

  function initAmbientAudio() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      // Sub-bass 55Hz drone (A1 note - deep cypherpunk hum)
      subOsc = audioCtx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(55, audioCtx.currentTime);

      const subGain = audioCtx.createGain();
      subGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start();

      // Atmospheric filtered noise (tape hiss / CRT static)
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.05;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, audioCtx.currentTime);

      noiseNode.connect(filter);
      filter.connect(masterGain);
      noiseNode.start();
    } catch (e) {
      console.warn('Audio initialization deferred:', e);
    }
  }

  function playProbeTone(freq = 440) {
    if (!isSoundOn || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  // Audio Toggle
  const soundBtn = document.getElementById('soundBtn');
  const soundLabel = document.getElementById('soundLabel');
  soundBtn.addEventListener('click', () => {
    isSoundOn = !isSoundOn;
    if (isSoundOn) {
      initAmbientAudio();
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
      if (masterGain) masterGain.gain.setTargetAtTime(0.08, audioCtx.currentTime, 0.1);
      soundLabel.textContent = 'ATMOSPHERE: ON';
      soundBtn.querySelector('.sound-wave').style.opacity = '1';
    } else {
      if (masterGain && audioCtx) masterGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.1);
      soundLabel.textContent = 'ATMOSPHERE: OFF';
      soundBtn.querySelector('.sound-wave').style.opacity = '0.3';
    }
  });

  // Enable audio on first user gesture
  window.addEventListener('pointerdown', () => {
    if (isSoundOn && !audioCtx) initAmbientAudio();
  }, { once: true });

  // ── 2. Pixel Art Generation for the 3 Tribute Faces ───────────────────────
  const GRID = 32;
  let activeFaceId = '0112';

  function createFacePixels(id) {
    const p = new Uint32Array(GRID * GRID);

    // Color Constants (ABGR 32-bit format)
    const C_VOID = 0xff080808;
    const C_SKIN = 0xff385572;
    const C_SKIN_SHADOW = 0xff24384a;
    const C_GOLD = 0xff28b7f4;
    const C_CYAN = 0xffe6c230;
    const C_WHITE = 0xffffffff;
    const C_RED = 0xff3333d0;
    const C_COAT = 0xff141414;
    const C_COAT_TRIM = 0xff282828;

    p.fill(C_VOID);

    if (id === '0112') {
      // #0112 THE DISSIDENT (Cyber trenchcoat, cyan optic implant, golden neural bridge)
      // Hair / Hood
      for (let y = 6; y <= 12; y++) {
        for (let x = 8; x <= 23; x++) p[y * GRID + x] = C_COAT;
      }
      // Face Block
      for (let y = 12; y <= 24; y++) {
        for (let x = 9; x <= 22; x++) {
          p[y * GRID + x] = (x > 17) ? C_SKIN_SHADOW : C_SKIN;
        }
      }
      // Glowing Cyan Optic Implant (Left Eye)
      for (let y = 15; y <= 18; y++) {
        for (let x = 11; x <= 14; x++) p[y * GRID + x] = C_CYAN;
      }
      p[16 * GRID + 12] = C_WHITE;

      // Dark Shrouded Right Eye
      for (let y = 15; y <= 18; y++) {
        for (let x = 17; x <= 20; x++) p[y * GRID + x] = C_COAT;
      }
      p[16 * GRID + 18] = C_GOLD; // Tiny gold reflection

      // Gold Neural Bridge on cheek
      p[19 * GRID + 11] = C_GOLD;
      p[20 * GRID + 11] = C_GOLD;
      p[20 * GRID + 12] = C_GOLD;

      // High Trenchcoat Collar
      for (let y = 25; y <= 31; y++) {
        for (let x = 4; x <= 27; x++) p[y * GRID + x] = C_COAT;
      }
      for (let y = 24; y <= 27; y++) {
        p[y * GRID + 8] = C_COAT_TRIM;
        p[y * GRID + 23] = C_COAT_TRIM;
      }
    } else if (id === '0842') {
      // #0842 THE SHADOW (Dark cypherpunk hooded cowl, dual glowing eyes)
      // Deep Hood Cowl
      for (let y = 5; y <= 26; y++) {
        for (let x = 7; x <= 24; x++) {
          if (y < 12 || x <= 9 || x >= 22) p[y * GRID + x] = C_COAT;
        }
      }
      // Face in shadow
      for (let y = 13; y <= 23; y++) {
        for (let x = 10; x <= 21; x++) p[y * GRID + x] = 0xff101010;
      }
      // Piercing Golden Eyes
      p[16 * GRID + 12] = C_GOLD;
      p[16 * GRID + 13] = C_GOLD;
      p[16 * GRID + 18] = C_GOLD;
      p[16 * GRID + 19] = C_GOLD;

      // Lower Cyber Mask
      for (let y = 20; y <= 24; y++) {
        for (let x = 12; x <= 19; x++) p[y * GRID + x] = C_COAT_TRIM;
      }
      p[22 * GRID + 15] = C_GOLD;
      p[22 * GRID + 16] = C_GOLD;

      // Shoulders
      for (let y = 26; y <= 31; y++) {
        for (let x = 3; x <= 28; x++) p[y * GRID + x] = C_COAT;
      }
    } else {
      // #1984 THE PUNK (High cyber mohawk, corporate collar, HUD target reticle)
      // Red Mohawk
      for (let y = 3; y <= 11; y++) {
        for (let x = 14; x <= 17; x++) p[y * GRID + x] = C_RED;
      }
      // Head
      for (let y = 11; y <= 24; y++) {
        for (let x = 9; x <= 22; x++) p[y * GRID + x] = (x > 16) ? C_SKIN_SHADOW : C_SKIN;
      }
      // Large HUD Target Grid over Left Eye
      for (let y = 13; y <= 19; y++) {
        for (let x = 10; x <= 16; x++) {
          if (x === 13 || y === 16 || x === 10 || x === 16 || y === 13 || y === 19) {
            p[y * GRID + x] = C_CYAN;
          }
        }
      }
      p[16 * GRID + 13] = C_WHITE;
      p[16 * GRID + 19] = C_CYAN;

      // Collar
      for (let y = 25; y <= 31; y++) {
        for (let x = 5; x <= 26; x++) p[y * GRID + x] = C_COAT;
      }
    }

    return p;
  }

  // ── 3. 12-Frame Dissolution Engine & Particle Simulation ──────────────────
  const artCanvas = document.getElementById('artCanvas');
  const artCtx = artCanvas.getContext('2d');
  artCtx.imageSmoothingEnabled = false;

  const BAYER = [
     0, 32,  8, 40,  2, 34, 10, 42,
    48, 16, 56, 24, 50, 18, 58, 26,
    12, 44,  4, 36, 14, 46,  6, 38,
    60, 28, 52, 20, 62, 30, 54, 22,
     3, 35, 11, 43,  1, 33,  9, 41,
    51, 19, 59, 27, 49, 17, 57, 25,
    15, 47,  7, 39, 13, 45,  5, 37,
    63, 31, 55, 23, 61, 29, 53, 21
  ];

  let currentBasePixels = createFacePixels(activeFaceId);
  let globalFrameProgress = 1; // 1 to 12
  let isHovering = false;
  let mouseGridX = -1;
  let mouseGridY = -1;

  // Quantum Ash Particles
  const particles = [];

  function spawnParticle(x, y, color) {
    if (particles.length > 120) return;
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -0.8 - Math.random() * 1.5,
      life: 1.0,
      decay: 0.02 + Math.random() * 0.03,
      size: Math.random() > 0.7 ? 2 : 1,
      color: color || '#f4b728'
    });
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= pt.decay;
      if (pt.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  function drawParticles(ctxTarget, scale) {
    for (const pt of particles) {
      ctxTarget.fillStyle = pt.color;
      ctxTarget.globalAlpha = pt.life;
      ctxTarget.fillRect(pt.x * scale, pt.y * scale, pt.size * (scale / 12), pt.size * (scale / 12));
    }
    ctxTarget.globalAlpha = 1.0;
  }

  // Generate 1 of 12 dissolution frames at a given progress (1.0 to 12.0)
  function renderFrameToBuffer(basePixels, progress, mouseX = -1, mouseY = -1) {
    const off = document.createElement('canvas');
    off.width = GRID;
    off.height = GRID;
    const offCtx = off.getContext('2d');
    const imgData = offCtx.createImageData(GRID, GRID);
    const data = new Uint32Array(imgData.data.buffer);

    const normProg = Math.max(0, Math.min(1, (progress - 1) / 11)); // 0.0 to 1.0

    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        const idx = y * GRID + x;
        const orig = basePixels[idx];

        // If mouse is near, probe dissolves faster around the reticle
        let localProg = normProg;
        if (mouseX >= 0 && mouseY >= 0) {
          const dist = Math.hypot(x - mouseX, y - mouseY);
          if (dist < 7) {
            localProg = Math.min(1.0, localProg + (1 - dist / 7) * 0.75);
            if (Math.random() < 0.12 && orig !== 0xff080808) {
              spawnParticle(x, y, (Math.random() > 0.5 ? '#f4b728' : '#4ad07f'));
            }
          }
        }

        const bayerVal = BAYER[(y % 8) * 8 + (x % 8)] / 64;

        if (localProg > 0 && bayerVal < localProg) {
          // Dissolved
          if (localProg >= 0.98) {
            // Final Shielded Void: pitch black with single Orchard beacon dot
            data[idx] = (x === 15 && y === 16) ? 0xff28b7f4 : 0xff000000;
          } else {
            // Emitting crypto static
            if (Math.random() > 0.88) {
              data[idx] = 0xff28b7f4; // Gold particle
            } else if (Math.random() > 0.82) {
              data[idx] = 0xff4ad07f; // Green shielded
            } else {
              data[idx] = 0xff050505; // Void
            }
          }
        } else {
          // Intact
          const r = orig & 0xff;
          const g = (orig >> 8) & 0xff;
          const b = (orig >> 16) & 0xff;
          const factor = 1 - (localProg * 0.3);
          data[idx] = (0xff << 24) | ((b * factor) << 16) | ((g * factor) << 8) | (r * factor);
        }
      }
    }

    offCtx.putImageData(imgData, 0, 0);
    return off;
  }

  // Main Render Loop (60 FPS)
  let lastTime = 0;
  let dissolveCycleTime = 0;

  function render(time) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    // Ambient 12-frame dissolve loop (cycle every 6 seconds)
    dissolveCycleTime += dt;
    if (!isHovering) {
      const cycleProg = (Math.sin(dissolveCycleTime * 1.2) + 1) / 2; // 0 to 1
      globalFrameProgress = 1 + cycleProg * 11;
    }

    const frameInt = Math.round(globalFrameProgress);
    document.getElementById('hudFrame').textContent = `FRAME: ${String(frameInt).padStart(2, '0')}/12`;
    document.getElementById('hudCoords').textContent = frameInt === 12 ? 'ORCHARD: 100% SHIELDED' : `SHIELDING: ${(frameInt/12*100).toFixed(0)}%`;

    // Render frame to canvas
    const frameBuffer = renderFrameToBuffer(currentBasePixels, globalFrameProgress, isHovering ? mouseGridX : -1, isHovering ? mouseGridY : -1);

    artCtx.clearRect(0, 0, artCanvas.width, artCanvas.height);
    artCtx.drawImage(frameBuffer, 0, 0, artCanvas.width, artCanvas.height);

    // Render Quantum Ash particles
    updateParticles();
    drawParticles(artCtx, artCanvas.width / GRID);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  // ── 4. Mouse / Touch Orchard Probe Interaction ────────────────────────────
  const canvasFrame = document.getElementById('canvasFrame');
  const lensReticle = document.getElementById('lensReticle');

  canvasFrame.addEventListener('pointerenter', () => {
    isHovering = true;
    lensReticle.style.display = 'block';
  });

  canvasFrame.addEventListener('pointerleave', () => {
    isHovering = false;
    lensReticle.style.display = 'none';
    mouseGridX = -1;
    mouseGridY = -1;
  });

  canvasFrame.addEventListener('pointermove', (e) => {
    const rect = canvasFrame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lensReticle.style.left = `${x}px`;
    lensReticle.style.top = `${y}px`;

    mouseGridX = Math.floor((x / rect.width) * GRID);
    mouseGridY = Math.floor((y / rect.height) * GRID);

    if (Math.random() < 0.25) {
      playProbeTone(350 + (x / rect.width) * 400);
    }
  });

  // Face Picker
  const pickerBtns = document.querySelectorAll('.picker-btn');
  const faceTitle = document.getElementById('faceTitle');
  const TITLES = {
    '0112': '#0112 · THE DISSIDENT',
    '0842': '#0842 · THE SHADOW',
    '1984': '#1984 · THE PUNK',
  };

  pickerBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      pickerBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFaceId = btn.getAttribute('data-face');
      currentBasePixels = createFacePixels(activeFaceId);
      faceTitle.textContent = TITLES[activeFaceId];
      playProbeTone(800);
    });
  });

  // ── 5. Cinematic 10-Second Video Teaser Recorder (The Core Weapon) ─────────
  const recordTeaserBtn = document.getElementById('recordTeaserBtn');
  const recOverlay = document.getElementById('recOverlay');
  const recCanvas = document.getElementById('recCanvas');
  const recCtx = recCanvas.getContext('2d');
  const recCountdown = document.getElementById('recCountdown');
  const recStatusLine = document.getElementById('recStatusLine');

  recordTeaserBtn.addEventListener('click', () => {
    initAmbientAudio();
    startCinematicTeaserRecording();
  });

  async function startCinematicTeaserRecording() {
    recOverlay.style.display = 'flex';
    recStatusLine.textContent = 'INITIALIZING MEDIA RECORDER & 60FPS STREAM...';
    recCountdown.textContent = '10s REMAINING';

    const stream = recCanvas.captureStream(60);
    let recorder;
    let chunks = [];

    try {
      recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    } catch (e) {
      recorder = new MediaRecorder(stream);
    }

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zaddr-tribute-teaser-${activeFaceId}.webm`;
      a.click();

      recStatusLine.textContent = '✓ VIDEO EXPORTED! READY TO TWEET TO @ZADDRNET';
      setTimeout(() => {
        recOverlay.style.display = 'none';
        // Open the pitch modal with ready-made tweet
        document.getElementById('manifestoModal').style.display = 'flex';
      }, 1400);
    };

    recorder.start();

    // 10-Second Scripted Animation Sequence
    const DURATION = 10.0;
    const startTime = performance.now();

    function renderScene(now) {
      const elapsed = (now - startTime) / 1000;
      const remaining = Math.max(0, DURATION - elapsed);
      recCountdown.textContent = `${remaining.toFixed(1)}s REMAINING`;

      recCtx.fillStyle = '#000000';
      recCtx.fillRect(0, 0, recCanvas.width, recCanvas.height);

      if (elapsed < 3.2) {
        // Scene 1 (0 to 3.2s): Minimalist Typography Intro
        recStatusLine.textContent = 'SCENE 1 // SCRIPTING PHILOSOPHY MANIFESTO...';
        recCtx.textAlign = 'center';
        recCtx.font = '700 24px "JetBrains Mono", monospace';
        recCtx.fillStyle = '#f4b728';
        recCtx.fillText('ZADDR // ZCASH ORCHARD POOL', 360, 290);

        recCtx.font = '500 20px "JetBrains Mono", monospace';
        recCtx.fillStyle = '#e0e0e0';
        recCtx.fillText('A name people can pay.', 360, 360);
        recCtx.fillText('Payments nobody can read.', 360, 400);

        recCtx.font = '400 13px "JetBrains Mono", monospace';
        recCtx.fillStyle = '#6a6a6a';
        recCtx.fillText('178 characters dissolved into sovereign identity.', 360, 480);
      } else if (elapsed < 7.0) {
        // Scene 2 (3.2 to 7.0s): 12-Frame Dissolution Reveal
        recStatusLine.textContent = 'SCENE 2 // 12-FRAME DISSOLUTION CONTINUUM...';
        const t = (elapsed - 3.2) / 3.8; // 0 to 1
        const frameP = 1 + t * 11; // 1 to 12

        const buf = renderFrameToBuffer(currentBasePixels, frameP, -1, -1);

        // Draw centered at 384x384
        recCtx.drawImage(buf, 168, 120, 384, 384);

        // Gold border
        recCtx.strokeStyle = '#f4b728';
        recCtx.lineWidth = 1.5;
        recCtx.strokeRect(168, 120, 384, 384);

        // Subtitles
        recCtx.textAlign = 'center';
        recCtx.font = '700 14px "JetBrains Mono", monospace';
        recCtx.fillStyle = '#f4b728';
        recCtx.fillText(`FRAME ${String(Math.round(frameP)).padStart(2, '0')} / 12`, 360, 550);

        recCtx.font = '500 18px "JetBrains Mono", monospace';
        recCtx.fillStyle = '#ffffff';
        recCtx.fillText('The art is public. The ownership is not.', 360, 590);
      } else {
        // Scene 3 (7.0 to 10.0s): The Slogan & Logo Outro
        recStatusLine.textContent = 'SCENE 3 // FINAL OUTRO & ZADDR GLYPH...';

        // Glowing Z logo
        recCtx.strokeStyle = '#f4b728';
        recCtx.lineWidth = 5;
        recCtx.beginPath();
        recCtx.moveTo(330, 240);
        recCtx.lineTo(390, 240);
        recCtx.lineTo(330, 310);
        recCtx.lineTo(390, 310);
        recCtx.stroke();

        recCtx.textAlign = 'center';
        recCtx.font = '800 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif';
        recCtx.fillStyle = '#ffffff';
        recCtx.fillText('Nice to not meet you.', 360, 390);

        recCtx.font = '700 15px "JetBrains Mono", monospace';
        recCtx.fillStyle = '#f4b728';
        recCtx.fillText('2,800 FACES ON ZCASH · MINT 21 SEPT', 360, 440);

        recCtx.font = '400 12px "JetBrains Mono", monospace';
        recCtx.fillStyle = '#6a6a6a';
        recCtx.fillText('@zaddrnet · zaddr.net', 360, 480);
      }

      if (elapsed < DURATION) {
        requestAnimationFrame(renderScene);
      } else {
        recorder.stop();
      }
    }

    requestAnimationFrame(renderScene);
  }

  // ── 6. Manifesto Modal & Copy Actions ─────────────────────────────────────
  const infoBtn = document.getElementById('infoBtn');
  const manifestoModal = document.getElementById('manifestoModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const copyTweetBtn = document.getElementById('copyTweetBtn');
  const copyDmBtn = document.getElementById('copyDmBtn');

  infoBtn.addEventListener('click', () => {
    manifestoModal.style.display = 'flex';
  });

  modalCloseBtn.addEventListener('click', () => {
    manifestoModal.style.display = 'none';
  });

  manifestoModal.addEventListener('click', (e) => {
    if (e.target === manifestoModal) manifestoModal.style.display = 'none';
  });

  copyTweetBtn.addEventListener('click', () => {
    const text = document.getElementById('tweetBox').textContent;
    navigator.clipboard.writeText(text).then(() => {
      copyTweetBtn.textContent = '✓ COPIED TWEET!';
      setTimeout(() => { copyTweetBtn.textContent = 'COPY TWEET TEXT'; }, 2000);
    });
  });

  copyDmBtn.addEventListener('click', () => {
    const text = document.getElementById('dmBox').textContent;
    navigator.clipboard.writeText(text).then(() => {
      copyDmBtn.textContent = '✓ COPIED DM!';
      setTimeout(() => { copyDmBtn.textContent = 'COPY DM TEXT'; }, 2000);
    });
  });

})();
