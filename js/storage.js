/**
 * storage.js - Local Storage Management for Truth or Dare Party Game
 * Handles state persistence, versioning, error boundaries, and settings.
 */

const STORAGE_SCHEMA_VERSION = 1;
const STORAGE_KEYS = {
  GAME_STATE: 'truth_dare_party_game_state_v1',
  SETTINGS: 'truth_dare_party_settings_v1'
};

export const StorageManager = {
  /**
   * Check if localStorage is available and functional in current browser environment.
   * Handles security restrictions, private browsing quota errors, etc.
   * @returns {boolean}
   */
  isStorageAvailable() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__truth_dare_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('localStorage is not available or blocked:', e);
      return false;
    }
  },

  /**
   * Save the active game state to local storage with metadata and schema version.
   * @param {Object} state - Authoritative game state
   * @returns {boolean} - Whether save succeeded
   */
  saveGameState(state) {
    if (!this.isStorageAvailable() || !state) return false;

    try {
      const payload = {
        schemaVersion: STORAGE_SCHEMA_VERSION,
        timestamp: Date.now(),
        state: state
      };
      window.localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(payload));
      return true;
    } catch (err) {
      console.error('Failed to save game state to localStorage:', err);
      return false;
    }
  },

  /**
   * Load saved game state from storage.
   * Gracefully handles malformed JSON, corrupted data, or schema mismatch.
   * @returns {Object|null} - Restored state or null if absent/invalid
   */
  loadGameState() {
    if (!this.isStorageAvailable()) return null;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;

      // Validate schema version
      if (parsed.schemaVersion !== STORAGE_SCHEMA_VERSION) {
        console.warn(`Saved schema version (${parsed.schemaVersion}) does not match current (${STORAGE_SCHEMA_VERSION}). Discarding.`);
        this.clearGameState();
        return null;
      }

      // Basic structure validation
      const state = parsed.state;
      if (!state || typeof state !== 'object' || !state.phase) {
        console.warn('Corrupted game state detected. Discarding.');
        this.clearGameState();
        return null;
      }

      return state;
    } catch (err) {
      console.error('Error reading/parsing saved game state:', err);
      // Clean up corrupt storage
      this.clearGameState();
      return null;
    }
  },

  /**
   * Check whether a valid, resumable game session exists in storage.
   * Only games that are past setup (e.g. theme, submissions, lobby, playing) and not summary count as resumable.
   * @returns {boolean}
   */
  hasSavedGame() {
    const state = this.loadGameState();
    if (!state) return false;
    // Resumable if phase is beyond welcome and not finished summary
    const resumablePhases = ['setup', 'theme', 'submissions', 'lobby', 'playing'];
    return resumablePhases.includes(state.phase) && Array.isArray(state.players) && state.players.length >= 2;
  },

  /**
   * Clear saved game state from storage.
   * @returns {boolean}
   */
  clearGameState() {
    if (!this.isStorageAvailable()) return false;
    try {
      window.localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
      return true;
    } catch (err) {
      console.error('Failed to clear game state:', err);
      return false;
    }
  },

  /**
   * Save user preferences (sound mute, reduced motion, theme).
   * @param {Object} settings
   * @returns {boolean}
   */
  saveSettings(settings) {
    if (!this.isStorageAvailable()) return false;
    try {
      window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (err) {
      console.error('Failed to save settings:', err);
      return false;
    }
  },

  /**
   * Load user preferences with sensible defaults.
   * @returns {Object}
   */
  loadSettings() {
    const defaults = {
      isMuted: false,
      volume: 0.7,
      reducedMotion: false,
      visualTheme: 'midnight-neon'
    };

    if (!this.isStorageAvailable()) return defaults;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      return { ...defaults, ...parsed };
    } catch (err) {
      console.warn('Could not load settings, using defaults:', err);
      return defaults;
    }
  }
};
