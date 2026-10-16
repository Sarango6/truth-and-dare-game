/**
 * app.js - Main Application Orchestrator for Truth or Dare Party Game
 * Connects GameState, UIManager, and StorageManager.
 */

import { GameState, VISUAL_THEMES, THEMES } from './game.js';
import { UIManager, AVATAR_LIST } from './ui.js';
import { StorageManager } from './storage.js';

class App {
  constructor() {
    this.game = new GameState();
    this.ui = new UIManager();
    this.storage = StorageManager;
    
    // UI state flags
    this.isDrawing = false;
    this.selectedAvatarId = 'avatar-1';
    this.selectedAvatarIsSvg = true;
    this.editingPlayerId = null;
    this.preferredChallengeType = 'random'; // 'random' | 'truth' | 'dare'
  }

  init() {
    this.ui.init();
    this.loadSettings();
    this.bindEvents();
    this.checkResumeAvailability();

    // Default to welcome screen
    this.ui.showScreen('screen-welcome');
  }

  /* ==========================================================================
     SETTINGS & PERSISTENCE
     ========================================================================== */

  loadSettings() {
    const settings = this.storage.loadSettings();
    this.ui.sound.setMuted(settings.isMuted);
    this.ui.sound.setVolume(settings.volume);
    this.game.setVisualTheme(settings.visualTheme || 'midnight-neon');
    this.ui.applyVisualTheme(this.game.visualThemeKey);

    // Sync settings controls
    const muteBtn = document.getElementById('btn-header-mute');
    if (muteBtn) {
      muteBtn.textContent = settings.isMuted ? '🔇' : '🔊';
      muteBtn.setAttribute('aria-label', settings.isMuted ? 'Unmute sounds' : 'Mute sounds');
    }

    const settingsMute = document.getElementById('setting-sound-mute');
    if (settingsMute) settingsMute.checked = settings.isMuted;

    const settingsVol = document.getElementById('setting-sound-volume');
    if (settingsVol) settingsVol.value = Math.round(settings.volume * 100);

    const settingsTheme = document.getElementById('setting-visual-theme');
    if (settingsTheme) settingsTheme.value = this.game.visualThemeKey;
  }

  saveSettings() {
    this.storage.saveSettings({
      isMuted: this.ui.sound.isMuted,
      volume: this.ui.sound.volume,
      visualTheme: this.game.visualThemeKey
    });
  }

  saveGame() {
    this.storage.saveGameState(this.game.exportState());
    this.checkResumeAvailability();
  }

  checkResumeAvailability() {
    const continueBtn = document.getElementById('btn-welcome-continue');
    if (!continueBtn) return;

    const hasSaved = this.storage.hasSavedGame();
    continueBtn.style.display = hasSaved ? 'inline-flex' : 'none';
  }

  /* ==========================================================================
     EVENT BINDINGS
     ========================================================================== */

  bindEvents() {
    // Audio unlock on first user gesture anywhere
    const unlockAudio = () => {
      this.ui.sound.init();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    // Prevent accidental page unload during active gameplay
    window.addEventListener('beforeunload', (e) => {
      if (this.game.phase === 'playing' && this.game.getRemainingQuestions().length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    // Global keyboard handlers (Escape closes modals)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.ui.closeAllModals();
      }
    });

    // Modal close buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.ui.sound.playClick();
        const targetModalId = btn.getAttribute('data-close-modal');
        if (targetModalId) {
          this.ui.closeModal(targetModalId);
        } else {
          this.ui.closeAllModals();
        }
      });
    });

    // Header controls
    const muteToggle = document.getElementById('btn-header-mute');
    if (muteToggle) {
      muteToggle.addEventListener('click', () => {
        const newMuted = !this.ui.sound.isMuted;
        this.ui.sound.setMuted(newMuted);
        muteToggle.textContent = newMuted ? '🔇' : '🔊';
        muteToggle.setAttribute('aria-label', newMuted ? 'Unmute sounds' : 'Mute sounds');
        const sMute = document.getElementById('setting-sound-mute');
        if (sMute) sMute.checked = newMuted;
        this.saveSettings();
        if (!newMuted) this.ui.sound.playClick();
      });
    }

    const settingsOpen = document.getElementById('btn-header-settings');
    if (settingsOpen) {
      settingsOpen.addEventListener('click', () => {
        this.ui.sound.playClick();
        this.ui.openModal('modal-settings');
      });
    }

    // Settings Modal controls
    const settingMute = document.getElementById('setting-sound-mute');
    if (settingMute) {
      settingMute.addEventListener('change', (e) => {
        this.ui.sound.setMuted(e.target.checked);
        if (muteToggle) muteToggle.textContent = e.target.checked ? '🔇' : '🔊';
        this.saveSettings();
      });
    }

    const settingVolume = document.getElementById('setting-sound-volume');
    if (settingVolume) {
      settingVolume.addEventListener('input', (e) => {
        const vol = parseInt(e.target.value, 10) / 100;
        this.ui.sound.setVolume(vol);
        this.saveSettings();
      });
    }

    const settingTheme = document.getElementById('setting-visual-theme');
    if (settingTheme) {
      settingTheme.addEventListener('change', (e) => {
        this.game.setVisualTheme(e.target.value);
        this.ui.applyVisualTheme(this.game.visualThemeKey);
        this.saveSettings();
        this.saveGame();
      });
    }

    // ================= SCREEN A: WELCOME =================
    const startNewBtn = document.getElementById('btn-welcome-start');
    if (startNewBtn) {
      startNewBtn.addEventListener('click', () => {
        this.ui.sound.playClick();
        if (this.storage.hasSavedGame()) {
          this.ui.openModal('modal-new-game-confirm');
        } else {
          this.startNewGameFlow();
        }
      });
    }

    const confirmNewGameBtn = document.getElementById('btn-confirm-start-new');
    if (confirmNewGameBtn) {
      confirmNewGameBtn.addEventListener('click', () => {
        this.ui.sound.playClick();
        this.ui.closeModal('modal-new-game-confirm');
        this.storage.clearGameState();
        this.startNewGameFlow();
      });
    }

    const continueBtn = document.getElementById('btn-welcome-continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        this.ui.sound.playClick();
        this.resumeSavedGame();
      });
    }

    const rulesBtn = document.getElementById('btn-welcome-rules');
    if (rulesBtn) {
      rulesBtn.addEventListener('click', () => {
        this.ui.sound.playClick();
        this.ui.openModal('modal-rules');
      });
    }

    // ================= SCREEN B: SETUP =================
    const setupBackBtn = document.getElementById('btn-setup-back');
    if (setupBackBtn) {
      setupBackBtn.addEventListener('click', () => {
        this.ui.sound.playClick();
        this.ui.showScreen('screen-welcome');
      });
    }

    // Avatar selector rendering
    this.ui.renderAvatarSelector('setup-avatar-grid', this.selectedAvatarId, (id, isSvg) => {
      this.selectedAvatarId = id;
      this.selectedAvatarIsSvg = isSvg;
    });

    const addPlayerBtn = document.getElementById('btn-add-player');
    const playerNameInput = document.getElementById('input-player-name');

    const handleAddPlayer = () => {
      const name = playerNameInput.value;
      const res = this.game.addPlayer(name, this.selectedAvatarId, this.selectedAvatarIsSvg);
      if (!res.success) {
        this.ui.showToast(res.error, 'error');
        this.ui.sound.playBuzzer();
        return;
      }

      this.ui.sound.playClick();
      playerNameInput.value = '';
      playerNameInput.focus();

      // Cycle avatar to next one for convenience
      const currentIndex = AVATAR_LIST.findIndex(a => a.id === this.selectedAvatarId);
      const nextAv = AVATAR_LIST[(currentIndex + 1) % AVATAR_LIST.length];
      this.selectedAvatarId = nextAv.id;
      this.selectedAvatarIsSvg = nextAv.isSvg;
      this.ui.renderAvatarSelector('setup-avatar-grid', this.selectedAvatarId, (id, isSvg) => {
        this.selectedAvatarId = id;
        this.selectedAvatarIsSvg = isSvg;
      });

      this.refreshSetupPlayerList();
      this.saveGame();
    };

    if (addPlayerBtn) addPlayerBtn.addEventListener('click', handleAddPlayer);
    if (playerNameInput) {
      playerNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddPlayer();
        }
      });
    }

    // Group name input
    const groupNameInput = document.getElementById('input-group-name');
    if (groupNameInput) {
      groupNameInput.addEventListener('input', (e) => {
        this.game.setGroupName(e.target.value);
        this.saveGame();
      });
    }

    // Setup Continue Button
    const setupContinueBtn = document.getElementById('setup-continue-btn');
    if (setupContinueBtn) {
      setupContinueBtn.addEventListener('click', () => {
        if (!this.game.canProceedFromSetup()) {
          this.ui.showToast('Please add at least 2 players to continue.', 'error');
          return;
        }
        this.ui.sound.playClick();
        this.game.setPhase('theme');
        this.renderThemeScreen();
        this.ui.showScreen('screen-theme');
        this.saveGame();
      });
    }

    // Manage Sacrifices Modal
    const manageSacrificesBtn = document.getElementById('btn-manage-sacrifices');
    if (manageSacrificesBtn) {
      manageSacrificesBtn.addEventListener('click', () => {
        this.ui.sound.playClick();
        this.renderSacrificesModalList();
        this.ui.openModal('modal-manage-sacrifices');
      });
    }

    const addSacrificeBtn = document.getElementById('btn-add-custom-sacrifice');
    const sacrificeInput = document.getElementById('input-new-sacrifice');
    if (addSacrificeBtn && sacrificeInput) {
      addSacrificeBtn.addEventListener('click', () => {
        const text = sacrificeInput.value;
        const res = this.game.addCustomSacrifice(text);
        if (!res.success) {
          this.ui.showToast(res.error, 'error');
          return;
        }
        this.ui.sound.playClick();
        sacrificeInput.value = '';
        this.renderSacrificesModalList();
        this.saveGame();
      });
    }

    // Edit Player Modal confirm
    const saveEditPlayerBtn = document.getElementById('btn-save-edit-player');
    if (saveEditPlayerBtn) {
      saveEditPlayerBtn.addEventListener('click', () => {
        const newName = document.getElementById('edit-player-name-input').value;
        const res = this.game.editPlayer(this.editingPlayerId, newName, this.editSelectedAvatarId, this.editSelectedAvatarIsSvg);
        if (!res.success) {
          this.ui.showToast(res.error, 'error');
          return;
        }
        this.ui.sound.playClick();
        this.ui.closeModal('modal-edit-player');
        this.refreshSetupPlayerList();
        this.saveGame();
      });
    }

    // ================= SCREEN C: THEME SELECTION =================
    const themeBackBtn = document.getElementById('btn-theme-back');
    if (themeBackBtn) {
      themeBackBtn.addEventListener('click', () => {
        this.ui.sound.playClick();
        this.game.setPhase('setup');
        this.ui.showScreen('screen-setup');
      });
    }

    const confirmThemeBtn = document.getElementById('btn-confirm-theme');
    if (confirmThemeBtn) {
      confirmThemeBtn.addEventListener('click', () => {
        this.ui.sound.playClick();
        const customNameInput = document.getElementById('input-custom-theme-name');
        const customName = customNameInput ? customNameInput.value : '';

        this.game.setTheme(this.game.themeKey, customName);

        // Advance to Question Submissions
        this.game.setPhase('submissions');
        this.game.initSubmissions();
        this.startSubmissionStep();
        this.saveGame();
      });
    }

    // ================= SCREEN D: QUESTION SUBMISSIONS =================
    // Privacy curtain unveil
    const subReadyBtn = document.getElementById('btn-sub-ready');
    if (subReadyBtn) {
      subReadyBtn.addEventListener('click', () => {
        this.ui.sound.playClick();
        document.getElementById('sub-privacy-curtain').style.display = 'none';
        document.getElementById('sub-form-wrap').style.display = 'block';
      });
    }

    // Submission character counter bindings
    ['sub-truth-1', 'sub-truth-2', 'sub-dare-1', 'sub-dare-2'].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => {
          const map = {
            'sub-truth-1': 'sub-t1-count',
            'sub-truth-2': 'sub-t2-count',
            'sub-dare-1': 'sub-d1-count',
            'sub-dare-2': 'sub-d2-count'
          };
          this.ui.updateCharCounter(id, map[id]);
        });
      }
    });

    // Inspiration buttons
    document.querySelectorAll('[data-inspire]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.ui.sound.playClick();
        const targetInputId = btn.getAttribute('data-inspire');
        const type = targetInputId.includes('truth') ? 'truth' : 'dare';
        this.ui.showInspirationModal(this.game.resolvedThemeKey, type, targetInputId);
      });
    });

    // Submit Questions Form
    const submitQuestionsBtn = document.getElementById('btn-submit-questions');
    if (submitQuestionsBtn) {
      submitQuestionsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const curPlayer = this.game.getCurrentSubmittingPlayer();
        if (!curPlayer) return;

        const t1 = document.getElementById('sub-truth-1').value;
        const t2 = document.getElementById('sub-truth-2').value;
        const d1 = document.getElementById('sub-dare-1').value;
        const d2 = document.getElementById('sub-dare-2').value;

        const res = this.game.submitPlayerQuestions(curPlayer.id, t1, t2, d1, d2);
        if (!res.success) {
          this.ui.showToast(res.error, 'error');
          this.ui.sound.playBuzzer();
          return;
        }

        this.ui.sound.playSuccess();

        if (res.isComplete) {
          // All players finished submission!
          this.ui.confetti.burst(50);
          this.game.setPhase('lobby');
          this.renderLobbyScreen();
          this.ui.showScreen('screen-lobby');
          this.ui.showToast('🎉 All questions submitted & anonymized!', 'success');
        } else {
          // Proceed to next contributor
          this.startSubmissionStep();
          this.ui.showToast(`Saved! Pass device to ${res.nextPlayer.name}`, 'info');
        }

        this.saveGame();
      });
    }

    // ================= SCREEN E: LOBBY =================
    const lobbyStartBtn = document.getElementById('btn-lobby-start-game');
    if (lobbyStartBtn) {
      lobbyStartBtn.addEventListener('click', () => {
        this.ui.sound.playFanfare();
        this.game.setPhase('playing');
        this.renderGameScreen();
        this.ui.showScreen('screen-playing');
        this.saveGame();
      });
    }

    // ================= SCREEN F: MAIN GAMEPLAY =================
    // Draw button / Roulette trigger
    const drawBtn = document.getElementById('btn-draw-challenge');
    if (drawBtn) {
      drawBtn.addEventListener('click', () => {
        if (this.isDrawing) return; // Prevent double-clicking / rapid taps
        this.isDrawing = true;
        drawBtn.disabled = true;

        this.ui.sound.playClick();
        this.handleDrawTurn();
      });
    }

    // Type preference radio pills
    document.querySelectorAll('.type-pref-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        this.ui.sound.playClick();
        document.querySelectorAll('.type-pref-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.preferredChallengeType = pill.getAttribute('data-type') || 'random';
      });
    });

    // Accept Challenge button
    const acceptBtn = document.getElementById('btn-accept-challenge');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        const res = this.game.acceptChallenge();
        if (!res.success) {
          this.ui.showToast(res.error, 'error');
          return;
        }

        this.ui.sound.playSuccess();
        this.ui.confetti.burst(45);
        this.ui.showRoundResolved('completed');
        this.updateRosterAndLives();
        this.saveGame();
      });
    }

    // Sacrifice Life button
    const sacrificeBtn = document.getElementById('btn-sacrifice-life');
    if (sacrificeBtn) {
      sacrificeBtn.addEventListener('click', () => {
        const activePlayer = this.game.getActivePlayer();
        if (!activePlayer) return;

        this.ui.sound.playClick();
        this.ui.renderSacrificeConfirmation(
          activePlayer,
          // onConfirm:
          () => {
            this.handleSacrificeSelection(activePlayer);
          },
          // onCancel:
          () => {
            this.ui.showToast('Sacrifice cancelled. Keep at the challenge!', 'info');
          }
        );
      });
    }

    // Safety Veto button
    const vetoBtn = document.getElementById('btn-safety-veto');
    if (vetoBtn) {
      vetoBtn.addEventListener('click', () => {
        this.ui.sound.playVeto();
        const res = this.game.safetyVeto();
        if (!res.success) {
          this.ui.showToast(res.error, 'error');
          return;
        }

        this.ui.showToast('🛡️ Safety Veto honored! No penalty. Redrawing a new challenge...', 'info');

        // Automatically redraw another challenge for this player without advancing round
        setTimeout(() => {
          const redrawRes = this.game.redrawForVeto(this.preferredChallengeType);
          if (redrawRes.success) {
            this.ui.revealChallengeCard(redrawRes.question);
          } else {
            this.ui.showToast(redrawRes.error, 'error');
            this.ui.showRoundResolved('vetoed');
          }
          this.saveGame();
        }, 600);
      });
    }

    // Next Round button
    const nextRoundBtn = document.getElementById('btn-next-round');
    if (nextRoundBtn) {
      nextRoundBtn.addEventListener('click', () => {
        this.ui.sound.playClick();
        this.handleNextRound();
      });
    }

    // History Drawer toggle
    const historyBtn = document.getElementById('btn-game-history');
    if (historyBtn) {
      historyBtn.addEventListener('click', () => {
        this.ui.sound.playClick();
        this.ui.renderHistoryDrawer(this.game.history);
        this.ui.openModal('modal-history');
      });
    }

    // End Game Confirm button
    const endGameBtn = document.getElementById('btn-game-end');
    if (endGameBtn) {
      endGameBtn.addEventListener('click', () => {
        this.ui.sound.playClick();
        this.ui.openModal('modal-end-game-confirm');
      });
    }

    const confirmEndGameBtn = document.getElementById('btn-confirm-end-game');
    if (confirmEndGameBtn) {
      confirmEndGameBtn.addEventListener('click', () => {
        this.ui.sound.playClick();
        this.ui.closeModal('modal-end-game-confirm');
        this.game.setPhase('summary');
        this.renderEndGameScreen();
        this.ui.showScreen('screen-summary');
        this.saveGame();
      });
    }
  }

  /* ==========================================================================
     FLOW CONTROLLER METHODS
     ========================================================================== */

  startNewGameFlow() {
    this.game.reset();
    this.game.setPhase('setup');
    const groupNameInput = document.getElementById('input-group-name');
    if (groupNameInput) groupNameInput.value = this.game.groupName;
    this.refreshSetupPlayerList();
    this.ui.showScreen('screen-setup');
    this.saveGame();
  }

  resumeSavedGame() {
    const saved = this.storage.loadGameState();
    if (!saved) {
      this.ui.showToast('No valid saved game found.', 'error');
      return;
    }

    this.game.importState(saved);
    this.ui.applyVisualTheme(this.game.visualThemeKey);

    // Route to appropriate screen based on saved phase
    switch (this.game.phase) {
      case 'setup':
        this.refreshSetupPlayerList();
        this.ui.showScreen('screen-setup');
        break;
      case 'theme':
        this.renderThemeScreen();
        this.ui.showScreen('screen-theme');
        break;
      case 'submissions':
        this.startSubmissionStep();
        this.ui.showScreen('screen-submissions');
        break;
      case 'lobby':
        this.renderLobbyScreen();
        this.ui.showScreen('screen-lobby');
        break;
      case 'playing':
        this.renderGameScreen();
        this.ui.showScreen('screen-playing');
        // Restore active card state if turn was revealed
        if (this.game.activeTurn && this.game.activeTurn.status === 'revealed') {
          const q = this.game.getActiveQuestion();
          if (q) this.ui.revealChallengeCard(q);
        } else if (this.game.activeTurn && ['accepted', 'sacrificed', 'vetoed'].includes(this.game.activeTurn.status)) {
          this.ui.showRoundResolved(this.game.activeTurn.status, this.game.activeTurn.sacrificeDetail);
        } else {
          this.ui.resetChallengeCard();
        }
        break;
      case 'summary':
        this.renderEndGameScreen();
        this.ui.showScreen('screen-summary');
        break;
      default:
        this.startNewGameFlow();
    }

    this.ui.showToast('Game session resumed!', 'success');
  }

  refreshSetupPlayerList() {
    this.ui.renderPlayerList(
      this.game.players,
      // onRemove:
      (playerId) => {
        this.game.removePlayer(playerId);
        this.refreshSetupPlayerList();
        this.saveGame();
      },
      // onEdit:
      (player) => {
        this.openEditPlayerModal(player);
      }
    );
  }

  openEditPlayerModal(player) {
    this.editingPlayerId = player.id;
    this.editSelectedAvatarId = player.avatar;
    this.editSelectedAvatarIsSvg = player.isSvg;

    const nameInput = document.getElementById('edit-player-name-input');
    if (nameInput) nameInput.value = player.name;

    this.ui.renderAvatarSelector('edit-avatar-grid', player.avatar, (id, isSvg) => {
      this.editSelectedAvatarId = id;
      this.editSelectedAvatarIsSvg = isSvg;
    });

    this.ui.openModal('modal-edit-player');
  }

  renderSacrificesModalList() {
    const list = document.getElementById('manage-sacrifices-list');
    if (!list) return;

    list.innerHTML = '';
    this.game.sacrifices.forEach((task, idx) => {
      const item = document.createElement('div');
      item.className = 'manage-sacrifice-item';
      item.innerHTML = `
        <span class="sacrifice-text">${idx + 1}. ${this.ui.renderHearts(0)} ${escapeHtml(task)}</span>
        <button type="button" class="btn-icon btn-delete" aria-label="Delete sacrifice">🗑️</button>
      `;

      item.querySelector('.btn-delete').addEventListener('click', () => {
        const res = this.game.removeSacrifice(idx);
        if (!res.success) {
          this.ui.showToast(res.error, 'error');
          return;
        }
        this.ui.sound.playClick();
        this.renderSacrificesModalList();
        this.saveGame();
      });

      list.appendChild(item);
    });
  }

  renderThemeScreen() {
    this.ui.renderThemeCards(this.game.themeKey, (key) => {
      this.game.setTheme(key);
      this.saveGame();
    });

    const customInput = document.getElementById('input-custom-theme-name');
    if (customInput) customInput.value = this.game.customThemeName;

    const customWrap = document.getElementById('custom-theme-input-wrap');
    if (customWrap) customWrap.style.display = this.game.themeKey === 'custom' ? 'block' : 'none';
  }

  startSubmissionStep() {
    const curPlayer = this.game.getCurrentSubmittingPlayer();
    if (!curPlayer) return;

    this.ui.showScreen('screen-submissions');

    // Show privacy curtain first!
    const curtain = document.getElementById('sub-privacy-curtain');
    const formWrap = document.getElementById('sub-form-wrap');
    const curtainName = document.getElementById('curtain-player-name');

    if (curtain) curtain.style.display = 'block';
    if (formWrap) formWrap.style.display = 'none';
    if (curtainName) curtainName.textContent = curPlayer.name;

    this.ui.renderSubmissionStep(curPlayer, this.game.submissions, this.game.players.length);
  }

  renderLobbyScreen() {
    const summary = this.game.getLobbySummary();
    this.ui.renderLobby(summary);
  }

  renderGameScreen() {
    this.ui.renderGameHeader(this.game);
    this.ui.renderPlayerRosterBar(this.game.players, this.game.activeTurn ? this.game.activeTurn.playerId : null);

    const activePlayer = this.game.getActivePlayer();
    if (activePlayer) {
      this.ui.renderActivePlayer(activePlayer);
    } else {
      const banner = document.getElementById('active-player-banner');
      if (banner) {
        banner.innerHTML = `
          <div class="ready-banner">
            <span class="ready-icon">🎲</span>
            <h2>Press Draw Challenge to Begin Round!</h2>
          </div>
        `;
      }
    }
  }

  async handleDrawTurn() {
    const eligible = this.game.getEligiblePlayers();
    if (eligible.length === 0) {
      this.ui.showToast('All players have run out of lives! Game over.', 'error');
      this.game.setPhase('summary');
      this.renderEndGameScreen();
      this.ui.showScreen('screen-summary');
      this.isDrawing = false;
      return;
    }

    const remaining = this.game.getRemainingQuestions();
    if (remaining.length === 0) {
      this.ui.showToast('All questions exhausted! Game over.', 'info');
      this.game.setPhase('summary');
      this.renderEndGameScreen();
      this.ui.showScreen('screen-summary');
      this.isDrawing = false;
      return;
    }

    // Step 1: Draw challenge from game logic
    const drawRes = this.game.startRoundDrawing(this.preferredChallengeType);
    if (!drawRes.success) {
      this.ui.showToast(drawRes.error, 'error');
      this.isDrawing = false;
      const drawBtn = document.getElementById('btn-draw-challenge');
      if (drawBtn) drawBtn.disabled = false;
      return;
    }

    // Step 2: Animate roulette wheel landing on selected player
    await this.ui.animatePlayerRoulette(eligible, drawRes.player);

    // Step 3: Reveal challenge card with 3D flip animation
    setTimeout(() => {
      this.ui.revealChallengeCard(drawRes.question);
      this.updateRosterAndLives();
      this.isDrawing = false;
      this.saveGame();
    }, 400);
  }

  handleSacrificeSelection(player) {
    this.ui.renderSacrificeSelector(this.game.sacrifices, (chosenSacrifice) => {
      // Check if it's the 10-second silly dance
      if (chosenSacrifice.toLowerCase().includes('dance')) {
        this.ui.startDanceTimer(() => {
          this.executeSacrifice(player, chosenSacrifice);
        });
      } else {
        this.executeSacrifice(player, chosenSacrifice);
      }
    });
  }

  executeSacrifice(player, chosenSacrifice) {
    const res = this.game.sacrificeLife(chosenSacrifice);
    if (!res.success) {
      this.ui.showToast(res.error, 'error');
      return;
    }

    this.ui.sound.playBuzzer();
    this.ui.showRoundResolved('sacrificed', chosenSacrifice);
    this.updateRosterAndLives();

    if (res.isEliminated) {
      this.ui.showToast(`💔 ${player.name} has lost all 3 lives and is eliminated from future rounds!`, 'error');
    }

    this.saveGame();
  }

  handleNextRound() {
    const res = this.game.nextRound();
    this.ui.resetChallengeCard();

    const drawBtn = document.getElementById('btn-draw-challenge');
    if (drawBtn) drawBtn.disabled = false;
    this.isDrawing = false;

    if (res.isGameOver) {
      this.game.setPhase('summary');
      this.renderEndGameScreen();
      this.ui.showScreen('screen-summary');
    } else {
      this.renderGameScreen();
    }

    this.saveGame();
  }

  updateRosterAndLives() {
    this.ui.renderGameHeader(this.game);
    this.ui.renderPlayerRosterBar(this.game.players, this.game.activeTurn ? this.game.activeTurn.playerId : null);

    const activePlayer = this.game.getActivePlayer();
    if (activePlayer) {
      this.ui.renderActivePlayer(activePlayer);
    }
  }

  renderEndGameScreen() {
    const summary = this.game.getEndGameSummary();
    this.ui.renderEndGameSummary(
      summary,
      // onPlayAgain:
      () => {
        this.ui.openModal('modal-play-again-choice');
      },
      // onHome:
      () => {
        this.ui.showScreen('screen-welcome');
        this.checkResumeAvailability();
      }
    );

    // Play again choice modal handlers
    const replaySameBtn = document.getElementById('btn-replay-same-players');
    const replayFreshBtn = document.getElementById('btn-replay-fresh-game');

    if (replaySameBtn) {
      replaySameBtn.onclick = () => {
        this.ui.sound.playClick();
        this.ui.closeModal('modal-play-again-choice');
        this.game.replayGame('same_players');
        this.renderLobbyScreen();
        this.ui.showScreen('screen-lobby');
        this.saveGame();
      };
    }

    if (replayFreshBtn) {
      replayFreshBtn.onclick = () => {
        this.ui.sound.playClick();
        this.ui.closeModal('modal-play-again-choice');
        this.startNewGameFlow();
      };
    }
  }
}

// Global bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
  window.__truthDareApp = app; // Accessible for manual verification or test inspection
});
