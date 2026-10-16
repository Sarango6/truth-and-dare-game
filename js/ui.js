/**
 * ui.js - User Interface Controller, Rendering, Animations & Audio Engine
 * Handles all DOM interaction, sound synthesis, 3D card flips, roulette selector, and confetti.
 */

import { THEMES, VISUAL_THEMES, THEME_IDEAS } from './game.js';

// Predefined avatar collection for avatar selection grid
export const AVATAR_LIST = [
  { id: 'avatar-1', name: 'Neon Fox', isSvg: true, path: 'assets/avatars/avatar-1.svg' },
  { id: 'avatar-2', name: 'Party Panda', isSvg: true, path: 'assets/avatars/avatar-2.svg' },
  { id: 'avatar-3', name: 'Cool Cat', isSvg: true, path: 'assets/avatars/avatar-3.svg' },
  { id: 'avatar-4', name: 'Space Astro', isSvg: true, path: 'assets/avatars/avatar-4.svg' },
  { id: 'avatar-5', name: 'Cyber Owl', isSvg: true, path: 'assets/avatars/avatar-5.svg' },
  { id: 'avatar-6', name: 'Rockstar Bear', isSvg: true, path: 'assets/avatars/avatar-6.svg' },
  { id: 'avatar-7', name: 'Magic Unicorn', isSvg: true, path: 'assets/avatars/avatar-7.svg' },
  { id: 'avatar-8', name: 'Dino Dude', isSvg: true, path: 'assets/avatars/avatar-8.svg' },
  { id: 'avatar-9', name: 'Lucky Dog', isSvg: true, path: 'assets/avatars/avatar-9.svg' },
  { id: 'avatar-10', name: 'Groovy Frog', isSvg: true, path: 'assets/avatars/avatar-10.svg' },
  { id: 'avatar-11', name: 'Fire Dragon', isSvg: true, path: 'assets/avatars/avatar-11.svg' },
  { id: 'avatar-12', name: 'Robo Buddy', isSvg: true, path: 'assets/avatars/avatar-12.svg' },
  { id: 'avatar-13', name: 'Disco Koala', isSvg: true, path: 'assets/avatars/avatar-13.svg' },
  { id: 'avatar-14', name: 'Pixel Ghost', isSvg: true, path: 'assets/avatars/avatar-14.svg' },
  { id: 'avatar-15', name: 'Chill Penguin', isSvg: true, path: 'assets/avatars/avatar-15.svg' },
  { id: 'avatar-16', name: 'Gamer Bunny', isSvg: true, path: 'assets/avatars/avatar-16.svg' },
  // Extra fun emoji party avatars
  { id: 'emoji-party', name: 'Party Horn', isSvg: false, emoji: '🥳' },
  { id: 'emoji-fire', name: 'Flame', isSvg: false, emoji: '🔥' },
  { id: 'emoji-crown', name: 'Royal Crown', isSvg: false, emoji: '👑' },
  { id: 'emoji-sparkles', name: 'Magic Sparkles', isSvg: false, emoji: '✨' },
  { id: 'emoji-ghost', name: 'Spooky', isSvg: false, emoji: '👻' },
  { id: 'emoji-sunglasses', name: 'Cool Shades', isSvg: false, emoji: '😎' },
  { id: 'emoji-rocket', name: 'Space Rocket', isSvg: false, emoji: '🚀' },
  { id: 'emoji-pizza', name: 'Party Pizza', isSvg: false, emoji: '🍕' }
];

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 0.7;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  playClick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (err) {
      // Audio error ignored
    }
  }

  playTick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(this.volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (err) {}
  }

  playFlip() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.15);

      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (err) {}
  }

  playSuccess() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Major triad chime: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + i * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(this.volume * 0.3, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.35);
      });
    } catch (err) {}
  }

  playBuzzer() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(140, now);
      osc2.frequency.setValueAtTime(148, now); // Dissonant beating

      gain.gain.setValueAtTime(this.volume * 0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch (err) {}
  }

  playVeto() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.2);

      gain.gain.setValueAtTime(this.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (err) {}
  }

  playFanfare() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chords = [
        { f: 523.25, t: 0 },
        { f: 659.25, t: 0.12 },
        { f: 783.99, t: 0.24 },
        { f: 1046.50, t: 0.36 }
      ];
      chords.forEach(c => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + c.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(c.f, start);

        gain.gain.setValueAtTime(this.volume * 0.4, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.5);
      });
    } catch (err) {}
  }
}

export class ConfettiEngine {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
    this.particles = [];
    this.animId = null;
    this.resizeHandler = this.resize.bind(this);

    if (this.canvas) {
      window.addEventListener('resize', this.resizeHandler);
      this.resize();
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 60) {
    if (!this.canvas || !this.ctx) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.resize();
    const colors = ['#ff2e93', '#9d4edd', '#00f0ff', '#facc15', '#10b981', '#f43f5e'];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 80,
        y: this.canvas.height / 2 - 40,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        life: 1.0,
        decay: Math.random() * 0.015 + 0.012
      });
    }

    if (!this.animId) {
      this.loop();
    }
  }

  loop() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(this.loop.bind(this));
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animId = null;
    }
  }
}

export class UIManager {
  constructor() {
    this.sound = new SoundEngine();
    this.confetti = null;
    this.danceTimerInterval = null;
    this.danceRemaining = 10;
  }

  init() {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
      this.confetti = new ConfettiEngine(canvas);
    }
  }

  /* ==========================================================================
     THEME & VISUAL STYLING
     ========================================================================== */

  applyVisualTheme(themeKey) {
    document.documentElement.setAttribute('data-visual-theme', themeKey || 'midnight-neon');
  }

  /* ==========================================================================
     SCREEN TRANSITIONS
     ========================================================================== */

  showScreen(screenId) {
    const screens = document.querySelectorAll('.app-screen');
    screens.forEach(screen => {
      screen.classList.remove('active');
      screen.setAttribute('aria-hidden', 'true');
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      target.removeAttribute('aria-hidden');
      
      // Auto-focus first meaningful header or button for keyboard accessibility
      const focusTarget = target.querySelector('h1, h2, input, button:not([disabled])');
      if (focusTarget && typeof focusTarget.focus === 'function') {
        focusTarget.focus({ preventScroll: true });
      }
    }

    // Scroll window smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ==========================================================================
     ANNOUNCEMENTS (ACCESSIBILITY / SCREEN READERS)
     ========================================================================== */

  announce(message) {
    const el = document.getElementById('sr-announcements');
    if (el) {
      el.textContent = '';
      setTimeout(() => {
        el.textContent = message;
      }, 50);
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /* ==========================================================================
     MODALS & DIALOGS
     ========================================================================== */

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    modal.removeAttribute('aria-hidden');

    // Trap focus inside modal
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    });
  }

  /* ==========================================================================
     AVATAR RENDERING HELPER
     ========================================================================== */

  renderAvatarMarkup(avatarId, isSvg = true, altName = 'Avatar') {
    if (isSvg) {
      const av = AVATAR_LIST.find(a => a.id === avatarId);
      const src = av ? av.path : `assets/avatars/${avatarId}.svg`;
      return `<img src="${src}" alt="${altName}" class="avatar-img" loading="lazy" onerror="this.outerHTML='<span class=\\'avatar-fallback\\'>👤</span>'"/>`;
    } else {
      const av = AVATAR_LIST.find(a => a.id === avatarId);
      const emoji = av ? av.emoji : '😎';
      return `<span class="avatar-emoji" role="img" aria-label="${altName}">${emoji}</span>`;
    }
  }

  renderAvatarSelector(containerId, selectedAvatarId, onSelect) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    AVATAR_LIST.forEach(av => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `avatar-option-btn ${av.id === selectedAvatarId ? 'selected' : ''}`;
      btn.setAttribute('data-avatar-id', av.id);
      btn.setAttribute('aria-label', `Select ${av.name}`);

      if (av.isSvg) {
        btn.innerHTML = `<img src="${av.path}" alt="${av.name}" class="avatar-option-img" />`;
      } else {
        btn.innerHTML = `<span class="avatar-option-emoji">${av.emoji}</span>`;
      }

      btn.addEventListener('click', () => {
        this.sound.playClick();
        container.querySelectorAll('.avatar-option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (typeof onSelect === 'function') {
          onSelect(av.id, av.isSvg);
        }
      });

      container.appendChild(btn);
    });
  }

  /* ==========================================================================
     LIVES RENDERING HELPER
     ========================================================================== */

  renderHearts(lives, maxLives = 3) {
    let html = '<div class="hearts-container" aria-label="${lives} of ${maxLives} lives remaining">';
    for (let i = 0; i < maxLives; i++) {
      if (i < lives) {
        html += '<span class="heart-icon active" title="Life active">❤️</span>';
      } else {
        html += '<span class="heart-icon broken" title="Life lost">💔</span>';
      }
    }
    html += '</div>';
    return html;
  }

  /* ==========================================================================
     SCREEN B: PLAYER LIST RENDERING
     ========================================================================== */

  renderPlayerList(players, onRemove, onEdit) {
    const container = document.getElementById('setup-player-list');
    const countBadge = document.getElementById('setup-player-count');
    const continueBtn = document.getElementById('setup-continue-btn');

    if (countBadge) {
      countBadge.textContent = `${players.length} / 20 Players`;
    }

    if (continueBtn) {
      const isValid = players.length >= 2 && players.length <= 20;
      continueBtn.disabled = !isValid;
      continueBtn.title = isValid ? 'Proceed to theme selection' : 'Add at least 2 players to start';
    }

    if (!container) return;
    container.innerHTML = '';

    if (players.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">👥</span>
          <p>No players added yet. Add between 2 and 20 players to begin the party!</p>
        </div>
      `;
      return;
    }

    players.forEach((player, index) => {
      const card = document.createElement('div');
      card.className = 'player-setup-card';
      card.innerHTML = `
        <div class="player-card-avatar">
          ${this.renderAvatarMarkup(player.avatar, player.isSvg, player.name)}
        </div>
        <div class="player-card-info">
          <span class="player-card-num">#${index + 1}</span>
          <strong class="player-card-name">${escapeHtml(player.name)}</strong>
        </div>
        <div class="player-card-actions">
          <button type="button" class="btn-icon btn-edit" title="Edit player" aria-label="Edit ${escapeHtml(player.name)}">
            ✏️
          </button>
          <button type="button" class="btn-icon btn-delete" title="Remove player" aria-label="Remove ${escapeHtml(player.name)}">
            🗑️
          </button>
        </div>
      `;

      card.querySelector('.btn-edit').addEventListener('click', () => {
        this.sound.playClick();
        if (typeof onEdit === 'function') onEdit(player);
      });

      card.querySelector('.btn-delete').addEventListener('click', () => {
        this.sound.playClick();
        if (typeof onRemove === 'function') onRemove(player.id);
      });

      container.appendChild(card);
    });
  }

  /* ==========================================================================
     SCREEN C: THEME CARDS RENDERING
     ========================================================================== */

  renderThemeCards(selectedKey, onSelect) {
    const container = document.getElementById('theme-grid');
    if (!container) return;

    container.innerHTML = '';

    const themeIcons = {
      random: '🎲',
      funny: '😂',
      friendship: '🤝',
      school: '🎓',
      flirty: '💖',
      adventure: '🧗‍♂️',
      custom: '✨'
    };

    Object.values(THEMES).forEach(th => {
      const isSelected = th.id === selectedKey;
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `theme-select-card ${isSelected ? 'selected' : ''}`;
      card.setAttribute('data-theme-id', th.id);
      card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

      card.innerHTML = `
        <div class="theme-card-icon">${themeIcons[th.id] || '🎉'}</div>
        <h3 class="theme-card-title">${th.name}</h3>
        <p class="theme-card-desc">${th.description}</p>
        <div class="theme-card-check">${isSelected ? '✓ Selected' : 'Choose'}</div>
      `;

      card.addEventListener('click', () => {
        this.sound.playClick();
        container.querySelectorAll('.theme-select-card').forEach(c => {
          c.classList.remove('selected');
          c.setAttribute('aria-pressed', 'false');
          const check = c.querySelector('.theme-card-check');
          if (check) check.textContent = 'Choose';
        });

        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
        const check = card.querySelector('.theme-card-check');
        if (check) check.textContent = '✓ Selected';

        // Toggle custom input container visibility
        const customContainer = document.getElementById('custom-theme-input-wrap');
        if (customContainer) {
          customContainer.style.display = th.id === 'custom' ? 'block' : 'none';
        }

        if (typeof onSelect === 'function') {
          onSelect(th.id);
        }
      });

      container.appendChild(card);
    });
  }

  /* ==========================================================================
     SCREEN D: QUESTION SUBMISSION SCREEN RENDERING
     ========================================================================== */

  renderSubmissionStep(player, progress, totalPlayers) {
    const curPlayerEl = document.getElementById('sub-player-banner');
    const progressEl = document.getElementById('sub-progress-text');
    const progressBar = document.getElementById('sub-progress-bar');

    if (progressEl) {
      progressEl.textContent = `Player ${progress.currentPlayerIndex + 1} of ${totalPlayers}`;
    }
    if (progressBar) {
      const pct = Math.round(((progress.currentPlayerIndex) / totalPlayers) * 100);
      progressBar.style.width = `${pct}%`;
    }

    if (curPlayerEl && player) {
      curPlayerEl.innerHTML = `
        <div class="sub-avatar-wrap">
          ${this.renderAvatarMarkup(player.avatar, player.isSvg, player.name)}
        </div>
        <div class="sub-info">
          <span class="sub-badge">Contributor Turn</span>
          <h2 class="sub-player-name">${escapeHtml(player.name)}'s Secret Submissions</h2>
          <p class="sub-subtitle">Pass the device to <strong>${escapeHtml(player.name)}</strong>. Enter 2 truths and 2 dares below!</p>
        </div>
      `;
    }

    // Reset input fields
    ['sub-truth-1', 'sub-truth-2', 'sub-dare-1', 'sub-dare-2'].forEach(id => {
      const input = document.getElementById(id);
      if (input) input.value = '';
    });

    // Update character counters
    this.updateCharCounter('sub-truth-1', 'sub-t1-count');
    this.updateCharCounter('sub-truth-2', 'sub-t2-count');
    this.updateCharCounter('sub-dare-1', 'sub-d1-count');
    this.updateCharCounter('sub-dare-2', 'sub-d2-count');
  }

  updateCharCounter(inputId, counterId) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    if (!input || !counter) return;
    const len = input.value.trim().length;
    counter.textContent = `${len} / 250`;
    if (len > 250) {
      counter.classList.add('over-limit');
    } else {
      counter.classList.remove('over-limit');
    }
  }

  showInspirationModal(themeKey, type, targetInputId) {
    const modal = document.getElementById('modal-inspiration');
    const container = document.getElementById('inspiration-list');
    const title = document.getElementById('inspiration-title');

    if (!modal || !container) return;

    const themeData = THEME_IDEAS[themeKey] || THEME_IDEAS.funny;
    const list = type === 'truth' ? themeData.truths : themeData.dares;

    if (title) {
      title.textContent = `💡 ${type.toUpperCase()} Suggestions (${THEMES[themeKey]?.name || 'Party Theme'})`;
    }

    container.innerHTML = '';
    list.forEach(idea => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'inspiration-card';
      card.innerHTML = `
        <span class="inspiration-text">"${escapeHtml(idea)}"</span>
        <span class="inspiration-use-btn">Use Idea ↵</span>
      `;

      card.addEventListener('click', () => {
        this.sound.playClick();
        const input = document.getElementById(targetInputId);
        if (input) {
          input.value = idea;
          input.focus();
          // Update character count
          const counterId = targetInputId.replace('sub-', 'sub-') + '-count';
          const match = {
            'sub-truth-1': 'sub-t1-count',
            'sub-truth-2': 'sub-t2-count',
            'sub-dare-1': 'sub-d1-count',
            'sub-dare-2': 'sub-d2-count'
          };
          if (match[targetInputId]) {
            this.updateCharCounter(targetInputId, match[targetInputId]);
          }
        }
        this.closeModal('modal-inspiration');
      });

      container.appendChild(card);
    });

    this.openModal('modal-inspiration');
  }

  /* ==========================================================================
     SCREEN E: LOBBY RENDERING
     ========================================================================== */

  renderLobby(summary) {
    const groupNameEl = document.getElementById('lobby-group-name');
    const themeBadge = document.getElementById('lobby-theme-badge');
    const playerCount = document.getElementById('lobby-player-count');
    const questionCount = document.getElementById('lobby-question-count');
    const truthsCount = document.getElementById('lobby-truths-count');
    const daresCount = document.getElementById('lobby-dares-count');
    const roster = document.getElementById('lobby-roster-grid');

    if (groupNameEl) groupNameEl.textContent = summary.groupName;
    if (themeBadge) themeBadge.textContent = `🎯 Theme: ${summary.themeName}`;
    if (playerCount) playerCount.textContent = `${summary.totalPlayers} Players`;
    if (questionCount) questionCount.textContent = `${summary.totalQuestions} Challenges Total`;
    if (truthsCount) truthsCount.textContent = `${summary.totalTruths} Truths`;
    if (daresCount) daresCount.textContent = `${summary.totalDares} Dares`;

    if (roster) {
      roster.innerHTML = '';
      summary.players.forEach(p => {
        const item = document.createElement('div');
        item.className = 'lobby-player-badge';
        item.innerHTML = `
          <div class="lobby-player-avatar">
            ${this.renderAvatarMarkup(p.avatar, p.isSvg, p.name)}
          </div>
          <div class="lobby-player-details">
            <strong class="lobby-player-name">${escapeHtml(p.name)}</strong>
            <div class="lobby-player-lives">
              ${this.renderHearts(p.lives)}
            </div>
          </div>
        `;
        roster.appendChild(item);
      });
    }
  }

  /* ==========================================================================
     SCREEN F: MAIN GAMEPLAY RENDERING & ROULETTE ANIMATION
     ========================================================================== */

  renderGameHeader(gameState) {
    const roundEl = document.getElementById('game-round-badge');
    const themeEl = document.getElementById('game-theme-badge');
    const remainingCountEl = document.getElementById('game-remaining-badge');

    if (roundEl) roundEl.textContent = `Round ${gameState.currentRound}`;
    if (themeEl) themeEl.textContent = gameState.getThemeDisplayName();
    if (remainingCountEl) {
      const count = gameState.getRemainingQuestions().length;
      remainingCountEl.textContent = `${count} challenge${count === 1 ? '' : 's'} left`;
    }
  }

  renderPlayerRosterBar(players, activePlayerId) {
    const container = document.getElementById('game-roster-bar');
    if (!container) return;

    container.innerHTML = '';
    players.forEach(p => {
      const pill = document.createElement('div');
      pill.className = `game-roster-pill ${p.id === activePlayerId ? 'active-player' : ''} ${p.lives === 0 ? 'eliminated' : ''}`;
      pill.id = `roster-pill-${p.id}`;
      pill.innerHTML = `
        <div class="pill-avatar">${this.renderAvatarMarkup(p.avatar, p.isSvg, p.name)}</div>
        <div class="pill-info">
          <span class="pill-name">${escapeHtml(p.name)}</span>
          <span class="pill-lives">${p.lives > 0 ? '❤️'.repeat(p.lives) : '💀 Out'}</span>
        </div>
      `;
      container.appendChild(pill);
    });
  }

  /**
   * High-energy Roulette Player Selection animation.
   * Cycles through eligible players with tick sounds and suspense deceleration.
   * Returns a promise that resolves with the selected player.
   */
  animatePlayerRoulette(eligiblePlayers, selectedPlayer) {
    return new Promise(resolve => {
      const displayEl = document.getElementById('active-player-banner');
      const rouletteTicker = document.getElementById('roulette-ticker');
      
      // If prefers-reduced-motion is active, skip suspense animation
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || eligiblePlayers.length <= 1) {
        this.renderActivePlayer(selectedPlayer);
        resolve(selectedPlayer);
        return;
      }

      let speed = 70;
      let iterations = 0;
      const totalSteps = 16 + Math.floor(Math.random() * 6);
      let currentIndex = 0;

      const step = () => {
        const cur = eligiblePlayers[currentIndex % eligiblePlayers.length];
        this.sound.playTick();

        // Highlight in ticker & roster
        if (displayEl) {
          displayEl.innerHTML = `
            <div class="roulette-roll active">
              <div class="roulette-avatar">${this.renderAvatarMarkup(cur.avatar, cur.isSvg, cur.name)}</div>
              <div class="roulette-details">
                <span class="roulette-label">Selecting Player...</span>
                <h2 class="roulette-name">${escapeHtml(cur.name)}</h2>
              </div>
            </div>
          `;
        }

        document.querySelectorAll('.game-roster-pill').forEach(el => el.classList.remove('active-player'));
        const pill = document.getElementById(`roster-pill-${cur.id}`);
        if (pill) pill.classList.add('active-player');

        currentIndex++;
        iterations++;

        if (iterations < totalSteps) {
          speed = Math.floor(speed * 1.09); // Decelerate smoothly
          setTimeout(step, speed);
        } else {
          // Land firmly on the preselected player
          this.sound.playFanfare();
          this.renderActivePlayer(selectedPlayer);
          this.announce(`Selected player is ${selectedPlayer.name}`);
          resolve(selectedPlayer);
        }
      };

      step();
    });
  }

  renderActivePlayer(player) {
    const displayEl = document.getElementById('active-player-banner');
    if (!displayEl || !player) return;

    displayEl.innerHTML = `
      <div class="active-player-card">
        <div class="active-player-avatar">
          ${this.renderAvatarMarkup(player.avatar, player.isSvg, player.name)}
        </div>
        <div class="active-player-info">
          <span class="active-turn-label">Current Player Turn</span>
          <h2 class="active-player-name">${escapeHtml(player.name)}</h2>
          <div class="active-player-lives-wrap">
            ${this.renderHearts(player.lives)}
            <span class="lives-text">${player.lives} ${player.lives === 1 ? 'Life' : 'Lives'} Remaining</span>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll('.game-roster-pill').forEach(el => el.classList.remove('active-player'));
    const pill = document.getElementById(`roster-pill-${player.id}`);
    if (pill) pill.classList.add('active-player');
  }

  /**
   * 3D Card Flip reveal animation.
   * Renders the question text on card back and flips it!
   */
  revealChallengeCard(question) {
    const card = document.getElementById('challenge-card-3d');
    const cardBackTypeBadge = document.getElementById('card-back-type-badge');
    const cardBackText = document.getElementById('card-back-text');
    const cardActions = document.getElementById('card-actions-row');
    const drawControls = document.getElementById('draw-controls-wrap');

    if (!card || !question) return;

    this.sound.playFlip();

    // Populate question details
    const isTruth = question.type === 'truth';
    if (cardBackTypeBadge) {
      cardBackTypeBadge.className = `challenge-type-badge ${isTruth ? 'type-truth' : 'type-dare'}`;
      cardBackTypeBadge.innerHTML = isTruth ? '💎 TRUTH' : '🔥 DARE';
    }

    if (cardBackText) {
      cardBackText.textContent = question.text;
    }

    // Trigger 3D flip
    card.classList.add('flipped');

    // Show action buttons, hide draw trigger
    if (drawControls) drawControls.style.display = 'none';
    if (cardActions) cardActions.style.display = 'flex';

    this.announce(`Challenge revealed: ${isTruth ? 'Truth' : 'Dare'}. ${question.text}`);
  }

  resetChallengeCard() {
    const card = document.getElementById('challenge-card-3d');
    const cardActions = document.getElementById('card-actions-row');
    const nextRoundRow = document.getElementById('next-round-row');
    const drawControls = document.getElementById('draw-controls-wrap');

    if (card) card.classList.remove('flipped');
    if (cardActions) cardActions.style.display = 'none';
    if (nextRoundRow) nextRoundRow.style.display = 'none';
    if (drawControls) drawControls.style.display = 'flex';
  }

  showRoundResolved(outcome, details = '') {
    const cardActions = document.getElementById('card-actions-row');
    const nextRoundRow = document.getElementById('next-round-row');
    const outcomeNotice = document.getElementById('round-outcome-notice');

    if (cardActions) cardActions.style.display = 'none';
    if (nextRoundRow) nextRoundRow.style.display = 'flex';

    if (outcomeNotice) {
      let msg = '';
      if (outcome === 'completed') {
        msg = '🎉 Challenge Completed! Awesome job.';
      } else if (outcome === 'sacrificed') {
        msg = `💔 1 Life Sacrificed. Penalty: "${escapeHtml(details)}"`;
      } else if (outcome === 'vetoed') {
        msg = '🛡️ Safety Veto Exercised. No life deducted.';
      }
      outcomeNotice.innerHTML = msg;
    }
  }

  /* ==========================================================================
     SCREEN G: SACRIFICE SYSTEM & SILLY DANCE TIMER
     ========================================================================== */

  renderSacrificeConfirmation(player, onConfirm, onCancel) {
    const modal = document.getElementById('modal-sacrifice-confirm');
    const content = document.getElementById('sacrifice-confirm-body');

    if (!modal || !content || !player) return;

    const remainingAfter = Math.max(0, player.lives - 1);

    content.innerHTML = `
      <div class="sacrifice-warning-box">
        <span class="warning-icon">⚠️</span>
        <h3>Sacrifice 1 Life?</h3>
        <p>You are about to sacrifice a life instead of completing this challenge.</p>
        <div class="sacrifice-lives-calc">
          <div class="calc-col">
            <span class="calc-label">Current Lives</span>
            <span class="calc-val">${this.renderHearts(player.lives)} (${player.lives})</span>
          </div>
          <span class="calc-arrow">➔</span>
          <div class="calc-col">
            <span class="calc-label">After Sacrifice</span>
            <span class="calc-val">${this.renderHearts(remainingAfter)} (${remainingAfter})</span>
          </div>
        </div>
        ${remainingAfter === 0 ? '<p class="elimination-alert">🚨 Warning: Sacrificing will eliminate you from future rounds!</p>' : ''}
      </div>
    `;

    const confirmBtn = document.getElementById('btn-confirm-sacrifice');
    const cancelBtn = document.getElementById('btn-cancel-sacrifice');

    // Clean old listeners by cloning
    const newConfirm = confirmBtn.cloneNode(true);
    const newCancel = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

    newConfirm.addEventListener('click', () => {
      this.sound.playBuzzer();
      this.closeModal('modal-sacrifice-confirm');
      if (typeof onConfirm === 'function') onConfirm();
    });

    newCancel.addEventListener('click', () => {
      this.sound.playClick();
      this.closeModal('modal-sacrifice-confirm');
      if (typeof onCancel === 'function') onCancel();
    });

    this.openModal('modal-sacrifice-confirm');
  }

  renderSacrificeSelector(sacrifices, onSelectSacrifice) {
    const modal = document.getElementById('modal-sacrifice-select');
    const grid = document.getElementById('sacrifice-options-grid');
    const randomBtn = document.getElementById('btn-random-sacrifice');

    if (!modal || !grid) return;

    grid.innerHTML = '';
    sacrifices.forEach((task, idx) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'sacrifice-card';
      card.innerHTML = `
        <span class="sacrifice-num">#${idx + 1}</span>
        <strong class="sacrifice-text">${escapeHtml(task)}</strong>
        <span class="sacrifice-pick-arrow">Choose ➔</span>
      `;

      card.addEventListener('click', () => {
        this.sound.playClick();
        this.closeModal('modal-sacrifice-select');
        if (typeof onSelectSacrifice === 'function') onSelectSacrifice(task);
      });

      grid.appendChild(card);
    });

    // Random choice button
    if (randomBtn) {
      const newRandomBtn = randomBtn.cloneNode(true);
      randomBtn.parentNode.replaceChild(newRandomBtn, randomBtn);
      newRandomBtn.addEventListener('click', () => {
        this.sound.playClick();
        const pick = sacrifices[Math.floor(Math.random() * sacrifices.length)];
        this.closeModal('modal-sacrifice-select');
        if (typeof onSelectSacrifice === 'function') onSelectSacrifice(pick);
      });
    }

    this.openModal('modal-sacrifice-select');
  }

  /**
   * Interactive 10-Second Silly Dance Timer
   */
  startDanceTimer(onComplete) {
    const modal = document.getElementById('modal-dance-timer');
    const countDisplay = document.getElementById('dance-countdown');
    const circleProgress = document.getElementById('dance-circle-progress');
    const stopBtn = document.getElementById('btn-stop-dance');

    if (!modal || !countDisplay) return;

    this.danceRemaining = 10;
    countDisplay.textContent = this.danceRemaining;
    if (circleProgress) {
      circleProgress.style.strokeDashoffset = '0';
    }

    this.openModal('modal-dance-timer');
    this.sound.playSuccess();

    if (this.danceTimerInterval) clearInterval(this.danceTimerInterval);

    this.danceTimerInterval = setInterval(() => {
      this.danceRemaining--;
      countDisplay.textContent = this.danceRemaining;
      this.sound.playTick();

      if (circleProgress) {
        // Circumference for r=70 is ~440
        const offset = 440 * (1 - (this.danceRemaining / 10));
        circleProgress.style.strokeDashoffset = offset;
      }

      if (this.danceRemaining <= 0) {
        clearInterval(this.danceTimerInterval);
        this.danceTimerInterval = null;
        this.sound.playFanfare();
        this.confetti.burst(40);
        countDisplay.textContent = '🎉';
        setTimeout(() => {
          this.closeModal('modal-dance-timer');
          if (typeof onComplete === 'function') onComplete();
        }, 1200);
      }
    }, 1000);

    if (stopBtn) {
      stopBtn.onclick = () => {
        if (this.danceTimerInterval) {
          clearInterval(this.danceTimerInterval);
          this.danceTimerInterval = null;
        }
        this.closeModal('modal-dance-timer');
        if (typeof onComplete === 'function') onComplete();
      };
    }
  }

  /* ==========================================================================
     SCREEN H: END GAME SUMMARY RENDERING
     ========================================================================== */

  renderEndGameSummary(summary, onPlayAgain, onHome) {
    const roundsEl = document.getElementById('summary-total-rounds');
    const challengesEl = document.getElementById('summary-completed-challenges');
    const sacrificesEl = document.getElementById('summary-total-sacrifices');
    const vetoesEl = document.getElementById('summary-total-vetoes');
    const leaderboard = document.getElementById('summary-players-leaderboard');
    const awardsContainer = document.getElementById('summary-awards-grid');

    if (roundsEl) roundsEl.textContent = summary.totalRounds;
    if (challengesEl) challengesEl.textContent = summary.totalCompletedChallenges;
    if (sacrificesEl) sacrificesEl.textContent = summary.totalSacrifices;
    if (vetoesEl) vetoesEl.textContent = summary.totalVetoes;

    // Leaderboard
    if (leaderboard) {
      leaderboard.innerHTML = '';
      summary.players.forEach(p => {
        const row = document.createElement('div');
        row.className = 'leaderboard-row';
        row.innerHTML = `
          <div class="leaderboard-avatar">
            ${this.renderAvatarMarkup(p.avatar, p.isSvg, p.name)}
          </div>
          <div class="leaderboard-name-wrap">
            <strong class="leaderboard-name">${escapeHtml(p.name)}</strong>
            <span class="leaderboard-status">${p.finalLives > 0 ? 'Survivor' : 'Sacrificed in Action'}</span>
          </div>
          <div class="leaderboard-lives">
            ${this.renderHearts(p.finalLives)}
          </div>
        `;
        leaderboard.appendChild(row);
      });
    }

    // Awards
    if (awardsContainer) {
      awardsContainer.innerHTML = '';
      summary.awards.forEach(aw => {
        const card = document.createElement('div');
        card.className = 'award-card';
        card.innerHTML = `
          <div class="award-header">
            <span class="award-badge">${aw.title}</span>
          </div>
          <div class="award-recipient">
            <div class="award-avatar">${this.renderAvatarMarkup(aw.avatar, aw.isSvg, aw.playerName)}</div>
            <strong class="award-winner-name">${escapeHtml(aw.playerName)}</strong>
          </div>
          <p class="award-desc">${escapeHtml(aw.description)}</p>
        `;
        awardsContainer.appendChild(card);
      });
    }

    // Buttons
    const replayBtn = document.getElementById('btn-summary-replay');
    const homeBtn = document.getElementById('btn-summary-home');

    if (replayBtn) {
      replayBtn.onclick = () => {
        this.sound.playClick();
        if (typeof onPlayAgain === 'function') onPlayAgain();
      };
    }
    if (homeBtn) {
      homeBtn.onclick = () => {
        this.sound.playClick();
        if (typeof onHome === 'function') onHome();
      };
    }

    // Fanfare and confetti burst on summary!
    this.sound.playFanfare();
    if (this.confetti) {
      this.confetti.burst(80);
    }
  }

  /* ==========================================================================
     TURN HISTORY DRAWER
     ========================================================================== */

  renderHistoryDrawer(historyList) {
    const container = document.getElementById('history-drawer-list');
    if (!container) return;

    container.innerHTML = '';

    if (historyList.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📜</span>
          <p>No turns completed yet. Completed challenges will appear here.</p>
        </div>
      `;
      return;
    }

    // NOTE: History records active player and outcome, strictly omitting contributor identity!
    historyList.forEach(item => {
      const card = document.createElement('div');
      card.className = `history-item-card outcome-${item.outcome}`;
      
      let badgeLabel = item.type === 'truth' ? '💎 TRUTH' : '🔥 DARE';
      let outcomeLabel = '✓ Completed';
      if (item.outcome === 'sacrificed') outcomeLabel = '💔 Sacrificed Life';
      if (item.outcome === 'vetoed') outcomeLabel = '🛡️ Vetoed';

      card.innerHTML = `
        <div class="history-item-top">
          <div class="history-player">
            ${this.renderAvatarMarkup(item.playerAvatar, item.isSvg, item.playerName)}
            <strong class="history-player-name">${escapeHtml(item.playerName)}</strong>
          </div>
          <div class="history-badges">
            <span class="history-type-badge">${badgeLabel}</span>
            <span class="history-outcome-badge ${item.outcome}">${outcomeLabel}</span>
          </div>
        </div>
        <p class="history-question-text">"${escapeHtml(item.questionText)}"</p>
        ${item.sacrificeDetail ? `<div class="history-penalty-note">Penalty: ${escapeHtml(item.sacrificeDetail)}</div>` : ''}
        <span class="history-round-tag">Round ${item.round}</span>
      `;

      container.appendChild(card);
    });
  }
}

// Utility HTML escape helper to prevent XSS
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
