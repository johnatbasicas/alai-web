/**
 * ALAI /ucenje — Application JS
 * Bismillahir-Rahmanir-Rahim
 *
 * Handles: language switching, scroll animations, audio players,
 * interactive 19 counter/explorer, geometric SVG generation.
 *
 * No external dependencies beyond wavesurfer.js (loaded separately when needed).
 */

'use strict';

// ===== LANGUAGE SYSTEM =====

const SUPPORTED_LANGS = ['bs', 'no', 'en'];
const DEFAULT_LANG = 'bs';
const STORAGE_KEY = 'ucenje-lang';

let currentLang = DEFAULT_LANG;

function detectLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

  const browserLang = navigator.language?.slice(0, 2).toLowerCase();
  if (browserLang === 'nb' || browserLang === 'nn' || browserLang === 'no') return 'no';
  if (browserLang === 'en') return 'en';
  return DEFAULT_LANG;
}

function applyLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLang = lang;

  // Update buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  });

  // Show/hide content
  SUPPORTED_LANGS.forEach(l => {
    document.querySelectorAll(`[data-lang-show="${l}"]`).forEach(el => {
      el.classList.toggle('lang-visible', l === lang);
    });
  });

  // Update html lang attr
  document.documentElement.lang = lang === 'bs' ? 'bs' : lang;

  localStorage.setItem(STORAGE_KEY, lang);

  // Update page title if element exists
  const titleEl = document.getElementById('page-title-dynamic');
  if (titleEl) {
    const titles = {
      bs: titleEl.dataset.bs,
      no: titleEl.dataset.no,
      en: titleEl.dataset.en,
    };
    if (titles[lang]) document.title = titles[lang];
  }

  // Dispatch event for other components
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

function switchLanguage(lang) {
  applyLang(lang);
}

// ===== SCROLL ANIMATIONS =====

function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // For grid cells, stagger children
        if (entry.target.classList.contains('grid-animate-parent')) {
          const cells = entry.target.querySelectorAll('.grid-cell');
          cells.forEach((cell, i) => {
            setTimeout(() => cell.classList.add('visible'), i * 15);
          });
        }
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.fade-in, .grid-animate-parent, .svg-draw, .timeline-bar').forEach(el => {
    observer.observe(el);
  });

  setTimeout(() => {
    document.querySelectorAll('.fade-in, .grid-animate-parent, .svg-draw, .timeline-bar, .grid-cell').forEach(el => {
      el.classList.add('visible');
    });
  }, 2000);
}

// ===== AUDIO PLAYER SYSTEM =====

/**
 * Initialize all audio players on the page.
 * Uses wavesurfer.js if available (loaded on audio pages).
 * Falls back to native HTML5 audio controls.
 */
function initAudioPlayers() {
  const players = document.querySelectorAll('[data-audio-player]');
  players.forEach(container => {
    const src = container.dataset.audioSrc;
    const waveDivId = container.dataset.waveDiv;

    if (!src) return;

    const playBtn = container.querySelector('.play-btn');
    const timeDisplay = container.querySelector('.audio-time');
    const waveDiv = waveDivId ? document.getElementById(waveDivId) : container.querySelector('.waveform-container');

    // Try to use WaveSurfer if loaded
    if (typeof WaveSurfer !== 'undefined' && waveDiv) {
      const ws = WaveSurfer.create({
        container: waveDiv,
        waveColor: '#c9a961',
        progressColor: '#1a1714',
        cursorColor: '#9e7c3f',
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        height: 64,
        normalize: true,
        backend: 'WebAudio',
        url: src,
      });

      let playing = false;

      ws.on('ready', () => {
        if (timeDisplay) {
          timeDisplay.textContent = formatTime(ws.getDuration()) + ' total';
        }
      });

      ws.on('audioprocess', () => {
        if (timeDisplay) {
          timeDisplay.textContent = formatTime(ws.getCurrentTime()) + ' / ' + formatTime(ws.getDuration());
        }
      });

      ws.on('play', () => {
        playing = true;
        updatePlayBtn(playBtn, true);
      });

      ws.on('pause', () => {
        playing = false;
        updatePlayBtn(playBtn, false);
      });

      ws.on('finish', () => {
        playing = false;
        updatePlayBtn(playBtn, false);
      });

      if (playBtn) {
        playBtn.addEventListener('click', () => {
          ws.playPause();
        });
      }

      // Expose on container for external control
      container._wavesurfer = ws;

    } else {
      // Native HTML5 fallback
      const audio = new Audio(src);
      let playing = false;

      // Draw a static decorative waveform if waveDiv exists
      if (waveDiv) {
        drawStaticWave(waveDiv);
        // Add click-to-seek (rough)
        waveDiv.addEventListener('click', (e) => {
          const rect = waveDiv.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          if (audio.duration) audio.currentTime = ratio * audio.duration;
        });
      }

      audio.addEventListener('timeupdate', () => {
        if (timeDisplay) {
          timeDisplay.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
        }
        // Update progress visual
        if (waveDiv && audio.duration) {
          const pct = (audio.currentTime / audio.duration) * 100;
          waveDiv.style.setProperty('--progress', pct + '%');
        }
      });

      audio.addEventListener('ended', () => {
        playing = false;
        updatePlayBtn(playBtn, false);
      });

      if (playBtn) {
        playBtn.addEventListener('click', () => {
          if (playing) {
            audio.pause();
            playing = false;
          } else {
            // Pause all other players first
            document.querySelectorAll('[data-audio-player]').forEach(p => {
              if (p !== container && p._audio) {
                p._audio.pause();
                updatePlayBtn(p.querySelector('.play-btn'), false);
              }
            });
            audio.play().catch(() => {});
            playing = true;
          }
          updatePlayBtn(playBtn, playing);
        });
      }

      container._audio = audio;
    }
  });
}

function updatePlayBtn(btn, isPlaying) {
  if (!btn) return;
  btn.setAttribute('aria-label', isPlaying ? 'Pauza' : 'Reprodukcija');
  btn.innerHTML = isPlaying ? pauseIcon() : playIcon();
}

function playIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
}

function pauseIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
}

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return m + ':' + String(s).padStart(2, '0');
}

function drawStaticWave(container) {
  container.innerHTML = '';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.gap = '2px';
  container.style.padding = '8px 4px';
  container.style.background = 'rgba(201,169,97,0.05)';
  container.style.borderRadius = '4px';
  container.style.position = 'relative';

  const barCount = Math.floor(container.offsetWidth / 5) || 80;
  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement('div');
    bar.className = 'wave-bar';
    const h = 8 + Math.random() * 48;
    bar.style.height = h + 'px';
    bar.style.animationDelay = (i * 0.04) + 's';
    container.appendChild(bar);
  }

  // Progress overlay
  const progress = document.createElement('div');
  progress.style.cssText = `
    position: absolute; inset: 0; left: 0;
    width: var(--progress, 0%);
    background: rgba(26,23,20,0.15);
    border-radius: 4px;
    pointer-events: none;
    transition: width 0.1s linear;
  `;
  container.appendChild(progress);
}

// ===== 19 COUNTER ANIMATION =====

function animateCounter(el, from, to, duration, onComplete) {
  const start = performance.now();
  const step = (timestamp) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (to - from) * eased);
    el.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = to;
      if (onComplete) onComplete();
    }
  };
  requestAnimationFrame(step);
}

function initCounters() {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseInt(el.dataset.counter, 10);
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(el, 0, target, 1800);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(el);
  });
}

// ===== 114-GRID (6x19) VISUALIZATION =====

function buildSurahGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Data: surah number -> ayah count (selected multiples highlighted)
  const specialSurahs = new Set([19, 38, 57, 76, 95, 114]); // multiples of 19
  const firstRevealed = 96;
  const keyVerse = 74; // contains 74:30

  container.classList.add('grid-animate-parent');

  for (let i = 1; i <= 114; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell surah-cell';

    const row = Math.floor((i - 1) / 19) + 1;
    const col = ((i - 1) % 19) + 1;

    cell.dataset.surah = i;
    cell.dataset.row = row;
    cell.dataset.col = col;

    // Determine class
    if (specialSurahs.has(i)) {
      cell.classList.add('surah-cell--multiple19');
    } else if (i === firstRevealed) {
      cell.classList.add('surah-cell--first');
    } else if (i === keyVerse) {
      cell.classList.add('surah-cell--keyverse');
    }

    // Tooltip
    cell.setAttribute('title', `Sura ${i} (red ${row}, kol ${col})`);
    cell.setAttribute('aria-label', `Sura ${i}`);

    // Number label
    const num = document.createElement('span');
    num.textContent = i;
    cell.appendChild(num);

    container.appendChild(cell);
  }
}

// ===== 19-TET KEYBOARD VISUALIZATION =====

function buildTetKeyboard(svgId) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const steps = 19;
  const width = svg.viewBox?.baseVal?.width || 760;
  const height = svg.viewBox?.baseVal?.height || 120;
  const keyWidth = width / steps;
  const keyMargin = 2;

  // Approximate "scale" steps in 19-TET: 0,3,6,8,11,14,17 = "white keys"
  const whiteSteps = new Set([0, 3, 6, 8, 11, 14, 17]);
  const majorThirdSteps = new Set([6]); // closest to major third
  const minorThirdSteps = new Set([5]);
  const fifthSteps = new Set([11]);

  for (let i = 0; i < steps; i++) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const x = i * keyWidth + keyMargin / 2;
    const w = keyWidth - keyMargin;

    let fill = '#e8e0d0'; // default: "black key equivalent"
    let keyHeight = height * 0.65;
    let y = 0;

    if (whiteSteps.has(i)) {
      fill = '#f5f0e8';
      keyHeight = height;
      y = 0;
    }

    if (majorThirdSteps.has(i)) fill = '#c9a961';
    if (minorThirdSteps.has(i)) fill = '#9e7c3f';
    if (fifthSteps.has(i)) fill = '#2d7d7a';
    if (i === 0) fill = '#1a1714'; // root

    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', w);
    rect.setAttribute('height', keyHeight);
    rect.setAttribute('rx', '2');
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', 'rgba(26,23,20,0.2)');
    rect.setAttribute('stroke-width', '0.5');

    // Step number label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x + w / 2);
    text.setAttribute('y', height - 6);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '9');
    text.setAttribute('fill', whiteSteps.has(i) ? '#1a1714' : '#c9a961');
    text.setAttribute('font-family', 'monospace');
    text.textContent = i;

    svg.appendChild(rect);
    svg.appendChild(text);
  }

  // Legend
  const legendItems = [
    { color: '#1a1714', label: 'Korijen' },
    { color: '#c9a961', label: 'Velika terca' },
    { color: '#9e7c3f', label: 'Mala terca' },
    { color: '#2d7d7a', label: 'Kvinta' },
  ];
  legendItems.forEach((item, idx) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const rx = 10 + idx * 150;
    const ry = height + 18;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', rx + 6);
    circle.setAttribute('cy', ry);
    circle.setAttribute('r', '5');
    circle.setAttribute('fill', item.color);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', rx + 16);
    label.setAttribute('y', ry + 4);
    label.setAttribute('font-size', '10');
    label.setAttribute('fill', '#4a4035');
    label.setAttribute('font-family', 'sans-serif');
    label.textContent = item.label;

    g.appendChild(circle);
    g.appendChild(label);
    svg.appendChild(g);
  });
}

// ===== GENERATE 19-POINTED STAR SVG =====

function drawStar19(svgId) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const cx = 200, cy = 200, r1 = 160, r2 = 80;
  const n = 19;
  const points = [];

  for (let i = 0; i < n; i++) {
    const angle1 = (i * 2 * Math.PI / n) - Math.PI / 2;
    const angle2 = ((i + 0.5) * 2 * Math.PI / n) - Math.PI / 2;
    points.push([cx + r1 * Math.cos(angle1), cy + r1 * Math.sin(angle1)]);
    points.push([cx + r2 * Math.cos(angle2), cy + r2 * Math.sin(angle2)]);
  }

  const pathData = points.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' ') + ' Z';

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#c9a961');
  path.setAttribute('stroke-width', '1.2');
  path.setAttribute('opacity', '0.7');
  path.classList.add('star-19', 'svg-draw');
  svg.appendChild(path);

  // Inner ring circles
  for (let i = 0; i < n; i++) {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', (cx + r1 * Math.cos(angle)).toFixed(2));
    dot.setAttribute('cy', (cy + r1 * Math.sin(angle)).toFixed(2));
    dot.setAttribute('r', '3');
    dot.setAttribute('fill', '#c9a961');
    dot.setAttribute('opacity', '0.5');
    svg.appendChild(dot);
  }

  // Center circle
  const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  center.setAttribute('cx', cx);
  center.setAttribute('cy', cy);
  center.setAttribute('r', '6');
  center.setAttribute('fill', '#c9a961');
  center.setAttribute('opacity', '0.8');
  svg.appendChild(center);

  // Concentric rings
  [40, 80, 120, 160].forEach((r, idx) => {
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', cx);
    ring.setAttribute('cy', cy);
    ring.setAttribute('r', r);
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', '#c9a961');
    ring.setAttribute('stroke-width', '0.5');
    ring.setAttribute('opacity', '0.2');
    ring.classList.add('ring-pulse');
    svg.appendChild(ring);
  });
}

// ===== INIT =====

function init() {
  // Language
  const lang = detectLang();
  applyLang(lang);

  // Scroll animations
  initScrollAnimations();

  // Counters
  initCounters();

  // Audio players
  initAudioPlayers();

  // Surah grid if present
  if (document.getElementById('surah-grid')) {
    buildSurahGrid('surah-grid');
    initScrollAnimations(); // re-run for newly added grid cells
  }

  // 19-TET keyboard if present
  if (document.getElementById('tet-keyboard-svg')) {
    buildTetKeyboard('tet-keyboard-svg');
  }

  // Star if present
  if (document.getElementById('star-19-svg')) {
    drawStar19('star-19-svg');
  }
}

// Run when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose globally
window.switchLanguage = switchLanguage;
window.animateCounter = animateCounter;
window.buildSurahGrid = buildSurahGrid;
