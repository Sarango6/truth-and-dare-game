/**
 * game.js - Game State Machine & Pure Business Logic for Truth or Dare Party Game
 * Independent of DOM manipulation.
 */

export const THEMES = {
  random: { id: 'random', name: 'Random Theme', description: 'Surprise mix randomly picked for each game' },
  funny: { id: 'funny', name: 'Funny & Laughs', description: 'Hilarious banter, absurd challenges & pure comedy' },
  friendship: { id: 'friendship', name: 'Friendship & Deep Bonds', description: 'Heart-to-heart moments, nostalgic memories & gratitude' },
  school: { id: 'school', name: 'School & College', description: 'Classroom secrets, campus crushes & exam memories' },
  flirty: { id: 'flirty', name: 'Flirty & Charming', description: 'Lighthearted romantic confessions & playful dares' },
  adventure: { id: 'adventure', name: 'Wild & Adventurous', description: 'Bold physical challenges & thrilling daredevil stunts' },
  custom: { id: 'custom', name: 'Custom Theme', description: 'Your own personalized party theme' }
};

export const VISUAL_THEMES = [
  { id: 'midnight-neon', name: 'Midnight Neon', colors: ['#a855f7', '#ec4899', '#00f0ff'] },
  { id: 'cyber-violet', name: 'Cyberpunk Violet', colors: ['#6366f1', '#a855f7', '#38bdf8'] },
  { id: 'electric-sunset', name: 'Electric Sunset', colors: ['#f97316', '#ec4899', '#fbbf24'] },
  { id: 'cosmic-emerald', name: 'Cosmic Emerald', colors: ['#10b981', '#06b6d4', '#84cc16'] }
];

export const DEFAULT_SACRIFICES = [
  "Tell a joke.",
  "Do a silly dance for 10 seconds.",
  "Speak in a funny accent for one turn.",
  "Make a funny face.",
  "Perform a tongue twister.",
  "Answer a bonus lighthearted question."
];
export const MIN_SACRIFICES = 1;
export const MAX_SACRIFICES = 20;
export const MAX_SACRIFICE_LENGTH = 120;

// Curated ideas for inspiration during question submission
export const THEME_IDEAS = {
  funny: {
    truths: [
      "What is the most ridiculous thing you've bought online while bored?",
      "Have you ever waved at someone who wasn't actually waving at you?",
      "What is your weirdest irrational fear?",
      "What is the silliest lie you told that people actually believed?"
    ],
    dares: [
      "Do your best impression of a chicken laying an egg.",
      "Speak only in opera singing for the next two minutes.",
      "Pretend to be an alien reporting Earth to your home planet.",
      "Wear your socks on your hands until the next round."
    ]
  },
  friendship: {
    truths: [
      "What is your favorite memory with someone in this room?",
      "Who in this group would you trust with your biggest secret?",
      "What is one thing someone here did that you never thanked them for?",
      "Which friend here would survive the longest in a zombie apocalypse?"
    ],
    dares: [
      "Give a sincere 30-second compliment to the player on your left.",
      "Do a synchronized high-five routine with the player across from you.",
      "Create a secret handshake with the person next to you right now.",
      "Send a wholesome supportive text to a mutual friend not here."
    ]
  },
  school: {
    truths: [
      "What was your most embarrassing moment in front of a teacher or class?",
      "Did you ever blame your pet or sibling for missing homework?",
      "Who was your first celebrity or school crush?",
      "What was the most ridiculous rule your school ever enforced?"
    ],
    dares: [
      "Recite the alphabet backwards as fast as you can.",
      "Act like a strict teacher giving a lecture on why chewing gum is evil.",
      "Give an impromptu graduation speech thanking the furniture.",
      "Stand like a model student and strike a dramatic school picture pose."
    ]
  },
  flirty: {
    truths: [
      "What is the cheesiest pickup line that would actually work on you?",
      "What was your most awkward first date story?",
      "What is your idea of a perfect spontaneous romantic evening?",
      "Have you ever had a crush on someone completely unexpected?"
    ],
    dares: [
      "Deliver the most dramatic movie-style romantic line to the room.",
      "Wink charmingly at every player in the circle in a row.",
      "Serenade an imaginary crush with whatever pop song you can remember.",
      "Model walk across the room like you're on a Paris fashion runway."
    ]
  },
  adventure: {
    truths: [
      "What is the wildest spontaneous thing you've ever done on vacation?",
      "If you were dropped in the jungle tomorrow, what 1 item would you want?",
      "What is one adrenaline-filled bucket list goal you haven't done yet?",
      "Would you rather skydive from a plane or scuba dive with sharks?"
    ],
    dares: [
      "Do 15 quick jumping jacks while shouting motivational slogans.",
      "Hold an intense superhero pose without moving for 20 seconds.",
      "Challenge any player to an arm-wrestling or thumb-war duel.",
      "Balance a book on your head and walk around the circle smoothly."
    ]
  },
  custom: {
    truths: [
      "What is one mystery about you that nobody in this room knows?",
      "If you could switch lives with any player for 24 hours, who and why?",
      "What is the most bizarre food combination you secretly enjoy?",
      "What is something you pretend to dislike but secretly love?"
    ],
    dares: [
      "Create a 15-second commercial promoting a random object in the room.",
      "Invent a new dance move, name it, and teach it to the group.",
      "Speak without using the letter 'E' for the next 30 seconds.",
      "Narrate the next round like a high-stakes sports commentator."
    ]
  }
};

export class GameState {
  constructor() {
    this.reset();
  }

  /**
   * Reset the game to initial fresh state
   */
  reset() {
    this.phase = 'welcome'; // 'welcome' | 'setup' | 'theme' | 'submissions' | 'lobby' | 'playing' | 'summary'
    this.groupName = 'The Party Squad';
    this.players = []; // [{ id, name, avatar, isSvg, lives: 3 }]
    this.themeKey = 'random';
    this.resolvedThemeKey = 'funny';
    this.customThemeName = '';
    this.visualThemeKey = 'midnight-neon';
    this.sacrifices = [...DEFAULT_SACRIFICES];
    this.sacrificeCount = this.sacrifices.length;
    
    // Submissions state
    this.submissions = {
      currentPlayerIndex: 0,
      completedPlayerIds: []
    };
    
    // Contributor IDs are internal-only and are never returned by UI renderers.
    this.questions = []; // [{ id, contributorId, type, text, theme, used, vetoed }]
    
    // Gameplay state
    this.currentRound = 1;
    this.activeTurn = null; 
    // activeTurn structure:
    // {
    //   playerId: string,
    //   questionId: string | null,
    //   chosenType: 'truth' | 'dare' | 'random',
    //   status: 'idle' | 'drawing' | 'revealed' | 'accepted' | 'sacrificed' | 'vetoed',
    //   sacrificeDetail: string | null
    // }
    this.lastSelectedPlayerId = null;
    this.history = []; // [{ round, playerId, playerName, playerAvatar, type, questionText, outcome, sacrificeDetail, timestamp }]
    
    // Aggregated stats
    this.stats = {
      totalCompletedChallenges: 0,
      totalSacrifices: 0,
      totalVetoes: 0,
      completedTruths: 0,
      completedDares: 0
    };
  }

  /* ==========================================================================
     PHASE & NAVIGATION
     ========================================================================== */

  setPhase(newPhase) {
    const validPhases = ['welcome', 'setup', 'theme', 'submissions', 'lobby', 'playing', 'summary'];
    if (!validPhases.includes(newPhase)) {
      throw new Error(`Invalid phase: ${newPhase}`);
    }
    this.phase = newPhase;
    return this.phase;
  }

  /* ==========================================================================
     PLAYER MANAGEMENT (SCREEN B)
     ========================================================================== */

  /**
   * Add a new player to the game.
   * Enforces 2-20 player limits and case-insensitive unique name validation.
   */
  addPlayer(name, avatar, isSvg = true) {
    const trimmed = (name || '').trim();
    if (!trimmed) {
      return { success: false, error: 'Player name cannot be empty.' };
    }
    if (trimmed.length > 25) {
      return { success: false, error: 'Player name cannot exceed 25 characters.' };
    }
    if (this.players.length >= 20) {
      return { success: false, error: 'Maximum 20 players allowed in a single game.' };
    }

    // Check duplicate name (case-insensitive & trimmed)
    const exists = this.players.some(p => p.name.trim().toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      return { success: false, error: `A player named "${trimmed}" already exists. Please choose a unique name.` };
    }

    const newPlayer = {
      id: 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5),
      name: trimmed,
      avatar: avatar || 'avatar-1',
      isSvg: Boolean(isSvg),
      lives: 3
    };

    this.players.push(newPlayer);
    return { success: true, player: newPlayer };
  }

  editPlayer(playerId, newName, newAvatar, isSvg = true) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      return { success: false, error: 'Player not found.' };
    }
    const trimmed = (newName || '').trim();
    if (!trimmed) {
      return { success: false, error: 'Player name cannot be empty.' };
    }
    if (trimmed.length > 25) {
      return { success: false, error: 'Player name cannot exceed 25 characters.' };
    }

    // Duplicate check excluding self
    const duplicate = this.players.some(p => p.id !== playerId && p.name.trim().toLowerCase() === trimmed.toLowerCase());
    if (duplicate) {
      return { success: false, error: `Another player named "${trimmed}" already exists.` };
    }

    player.name = trimmed;
    if (newAvatar) player.avatar = newAvatar;
    player.isSvg = Boolean(isSvg);

    return { success: true, player };
  }

  removePlayer(playerId) {
    const index = this.players.findIndex(p => p.id === playerId);
    if (index === -1) {
      return { success: false, error: 'Player not found.' };
    }
    this.players.splice(index, 1);
    return { success: true, remainingCount: this.players.length };
  }

  setGroupName(name) {
    this.groupName = (name || '').trim() || 'The Party Squad';
    return this.groupName;
  }

  canProceedFromSetup() {
    return this.players.length >= 2 && this.players.length <= 20;
  }

  /* ==========================================================================
     THEME SELECTION (SCREEN C)
     ========================================================================== */

  setTheme(themeKey, customName = '') {
    if (!THEMES[themeKey]) {
      return { success: false, error: 'Invalid theme selected.' };
    }
    this.themeKey = themeKey;

    if (themeKey === 'custom') {
      this.customThemeName = (customName || '').trim() || 'Custom Party Fun';
      this.resolvedThemeKey = 'custom';
    } else if (themeKey === 'random') {
      // Must randomly choose one of the supported themes excluding 'random' itself
      const supported = ['funny', 'friendship', 'school', 'flirty', 'adventure'];
      const chosen = supported[Math.floor(Math.random() * supported.length)];
      this.resolvedThemeKey = chosen;
      this.customThemeName = '';
    } else {
      this.resolvedThemeKey = themeKey;
      this.customThemeName = '';
    }

    return { 
      success: true, 
      themeKey: this.themeKey, 
      resolvedTheme: this.resolvedThemeKey, 
      themeName: this.getThemeDisplayName() 
    };
  }

  setVisualTheme(visualThemeKey) {
    const valid = VISUAL_THEMES.some(vt => vt.id === visualThemeKey);
    this.visualThemeKey = valid ? visualThemeKey : 'midnight-neon';
    return this.visualThemeKey;
  }

  getThemeDisplayName() {
    if (this.themeKey === 'custom') {
      return this.customThemeName || 'Custom Party';
    }
    if (this.themeKey === 'random') {
      const resolved = THEMES[this.resolvedThemeKey];
      return `Random (${resolved ? resolved.name : 'Surprise'})`;
    }
    return THEMES[this.resolvedThemeKey]?.name || 'Party Theme';
  }

  /* ==========================================================================
     SACRIFICE MANAGEMENT (SCREEN G & SETUP)
     ========================================================================== */

  addCustomSacrifice(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) {
      return { success: false, error: 'Sacrifice description cannot be empty.' };
    }
    if (trimmed.length > MAX_SACRIFICE_LENGTH) {
      return { success: false, error: `Sacrifice description cannot exceed ${MAX_SACRIFICE_LENGTH} characters.` };
    }
    if (this.sacrifices.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      return { success: false, error: 'This sacrifice already exists in the list.' };
    }
    if (this.sacrifices.length >= MAX_SACRIFICES) {
      return { success: false, error: `You can have at most ${MAX_SACRIFICES} sacrifice options.` };
    }
    this.sacrifices.push(trimmed);
    this.sacrificeCount = this.sacrifices.length;
    return { success: true, sacrifices: this.sacrifices };
  }

  setSacrificeCount(count) {
    const nextCount = Number.parseInt(count, 10);
    if (!Number.isInteger(nextCount) || nextCount < MIN_SACRIFICES || nextCount > MAX_SACRIFICES) {
      return { success: false, error: `Sacrifice options must be between ${MIN_SACRIFICES} and ${MAX_SACRIFICES}.` };
    }
    if (nextCount > this.sacrifices.length) {
      const defaults = DEFAULT_SACRIFICES.filter(item => !this.sacrifices.some(existing => existing.toLowerCase() === item.toLowerCase()));
      this.sacrifices.push(...defaults.slice(0, nextCount - this.sacrifices.length));
      while (this.sacrifices.length < nextCount) {
        this.sacrifices.push(`Custom harmless option ${this.sacrifices.length + 1}`);
      }
    } else if (nextCount < this.sacrifices.length) {
      this.sacrifices = this.sacrifices.slice(0, nextCount);
    }
    this.sacrificeCount = nextCount;
    return { success: true, sacrifices: this.sacrifices };
  }

  updateSacrifice(index, text) {
    const trimmed = (text || '').trim();
    if (index < 0 || index >= this.sacrifices.length) {
      return { success: false, error: 'Invalid sacrifice index.' };
    }
    if (!trimmed) {
      return { success: false, error: 'Sacrifice description cannot be empty.' };
    }
    if (trimmed.length > MAX_SACRIFICE_LENGTH) {
      return { success: false, error: `Sacrifice description cannot exceed ${MAX_SACRIFICE_LENGTH} characters.` };
    }
    if (this.sacrifices.some((item, itemIndex) => itemIndex !== index && item.toLowerCase() === trimmed.toLowerCase())) {
      return { success: false, error: 'This sacrifice already exists in the list.' };
    }
    this.sacrifices[index] = trimmed;
    return { success: true, sacrifices: this.sacrifices };
  }

  removeSacrifice(index) {
    if (index < 0 || index >= this.sacrifices.length) {
      return { success: false, error: 'Invalid sacrifice index.' };
    }
    if (this.sacrifices.length <= MIN_SACRIFICES) {
      return { success: false, error: `Must keep at least ${MIN_SACRIFICES} sacrifice available in the game.` };
    }
    this.sacrifices.splice(index, 1);
    this.sacrificeCount = this.sacrifices.length;
    return { success: true, sacrifices: this.sacrifices };
  }

  /* ==========================================================================
     QUESTION SUBMISSIONS (SCREEN D)
     ========================================================================== */

  initSubmissions() {
    this.submissions = {
      currentPlayerIndex: 0,
      completedPlayerIds: []
    };
    this.questions = [];
  }

  getCurrentSubmittingPlayer() {
    if (this.submissions.currentPlayerIndex >= this.players.length) {
      return null;
    }
    return this.players[this.submissions.currentPlayerIndex];
  }

  /**
   * Submit questions for the current player.
   * Requires exactly 2 truths and 2 dares.
   * Validates non-empty strings, character boundaries, and duplicate text.
   * 
   * Contributor IDs are stored only for eligibility checks and are never rendered.
   */
  submitPlayerQuestions(playerId, truth1, truth2, dare1, dare2) {
    const player = this.getCurrentSubmittingPlayer();
    if (!player || player.id !== playerId) {
      return { success: false, error: 'Submission out of order or invalid player.' };
    }

    const t1 = (truth1 || '').trim();
    const t2 = (truth2 || '').trim();
    const d1 = (dare1 || '').trim();
    const d2 = (dare2 || '').trim();

    const items = [
      { label: 'Truth #1', text: t1, type: 'truth' },
      { label: 'Truth #2', text: t2, type: 'truth' },
      { label: 'Dare #1', text: d1, type: 'dare' },
      { label: 'Dare #2', text: d2, type: 'dare' }
    ];

    for (const item of items) {
      if (!item.text) {
        return { success: false, error: `${item.label} cannot be empty or whitespace only.` };
      }
      if (item.text.length < 5) {
        return { success: false, error: `${item.label} must be at least 5 characters long.` };
      }
      if (item.text.length > 250) {
        return { success: false, error: `${item.label} cannot exceed 250 characters.` };
      }
    }

    // Check accidental identical duplicates within submission
    if (t1.toLowerCase() === t2.toLowerCase()) {
      return { success: false, error: 'Truth #1 and Truth #2 cannot be identical.' };
    }
    if (d1.toLowerCase() === d2.toLowerCase()) {
      return { success: false, error: 'Dare #1 and Dare #2 cannot be identical.' };
    }

    // Contributor IDs stay internal; UI-facing question objects are projected without them.
    const createdQuestions = items.map((item, idx) => ({
      id: `q_${item.type}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}_${idx}`,
      contributorId: playerId,
      type: item.type,
      text: item.text,
      theme: this.resolvedThemeKey,
      used: false,
      vetoed: false
    }));

    this.questions.push(...createdQuestions);
    this.submissions.completedPlayerIds.push(playerId);
    this.submissions.currentPlayerIndex++;

    const isComplete = this.submissions.currentPlayerIndex >= this.players.length;
    if (isComplete) {
      // Shuffle the anonymized pool completely
      this.shuffleQuestions();
    }

    return {
      success: true,
      isComplete,
      nextPlayer: this.getCurrentSubmittingPlayer(),
      totalQuestions: this.questions.length
    };
  }

  shuffleQuestions() {
    for (let i = this.questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
    }
  }

  /* ==========================================================================
     LOBBY & SUMMARY METRICS (SCREEN E)
     ========================================================================== */

  getLobbySummary() {
    const totalTruths = this.questions.filter(q => q.type === 'truth').length;
    const totalDares = this.questions.filter(q => q.type === 'dare').length;

    return {
      groupName: this.groupName,
      themeName: this.getThemeDisplayName(),
      totalPlayers: this.players.length,
      totalQuestions: this.questions.length,
      totalTruths,
      totalDares,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isSvg: p.isSvg,
        lives: p.lives
      }))
    };
  }

  /* ==========================================================================
     GAMEPLAY & ROUND CYCLES (SCREEN F)
     ========================================================================== */

  getEligiblePlayers() {
    return this.players.filter(p => p.lives > 0);
  }

  getRemainingQuestions(type = null) {
    return this.questions.filter(q => {
      if (q.used) return false;
      if (q.vetoed) return false;
      if (type && q.type !== type) return false;
      return true;
    });
  }

  getEligibleQuestions(playerId, type = null) {
    return this.getRemainingQuestions(type).filter(q => q.contributorId !== playerId);
  }

  /**
   * Select the next player for the turn.
   * Excludes players with 0 lives.
   * Avoids consecutive selection of the same player when other eligible players exist.
   */
  pickNextPlayer() {
    const eligible = this.getEligiblePlayers();
    if (eligible.length === 0) {
      return null;
    }
    if (eligible.length === 1) {
      return eligible[0];
    }

    // Filter out last selected player if possible
    let pool = eligible;
    if (this.lastSelectedPlayerId) {
      const withoutLast = eligible.filter(p => p.id !== this.lastSelectedPlayerId);
      if (withoutLast.length > 0) {
        pool = withoutLast;
      }
    }

    const selected = pool[Math.floor(Math.random() * pool.length)];
    return selected;
  }

  /**
   * Initiate turn drawing.
   * Pre-determines the active player and draws an unused challenge matching preference (or random).
   */
  startRoundDrawing(preferredType = 'random') {
    if (this.activeTurn && this.activeTurn.status === 'drawing') {
      return { success: false, error: 'Draw already in progress.' };
    }

    const eligible = this.getEligiblePlayers();
    if (eligible.length === 0) {
      this.phase = 'summary';
      return { success: false, error: 'All players have run out of lives! Game over.', isGameOver: true };
    }

    const remainingAll = this.getRemainingQuestions();
    if (remainingAll.length === 0) {
      this.phase = 'summary';
      return { success: false, error: 'All questions have been used! Game over.', isGameOver: true };
    }

    const player = this.pickNextPlayer();
    if (!player) {
      this.phase = 'summary';
      return { success: false, error: 'No eligible players available.', isGameOver: true };
    }

    // Determine type: if preferredType is 'truth' or 'dare', check if available; fallback if needed
    let resolvedType = preferredType;
    if (preferredType === 'truth' || preferredType === 'dare') {
      if (this.getEligibleQuestions(player.id, preferredType).length === 0) {
        const alternateType = preferredType === 'truth' ? 'dare' : 'truth';
        if (this.getEligibleQuestions(player.id, alternateType).length > 0) {
          resolvedType = alternateType;
        }
      }
    } else {
      // Randomly pick between remaining available types
      const truths = this.getEligibleQuestions(player.id, 'truth');
      const dares = this.getEligibleQuestions(player.id, 'dare');
      if (truths.length > 0 && dares.length > 0) {
        resolvedType = Math.random() < 0.5 ? 'truth' : 'dare';
      } else if (truths.length > 0) {
        resolvedType = 'truth';
      } else {
        resolvedType = 'dare';
      }
    }

    // Pick random unused question of resolvedType
    const availablePool = this.getEligibleQuestions(player.id, resolvedType);
    if (availablePool.length === 0) {
      return { success: false, error: `No unused ${resolvedType} challenge is available for this player. Choose another round preference or add eligible questions.` };
    }
    const chosenQuestion = availablePool[Math.floor(Math.random() * availablePool.length)];

    this.activeTurn = {
      playerId: player.id,
      questionId: chosenQuestion.id,
      chosenType: resolvedType,
      status: 'revealed', // card ready to be flipped/revealed
      sacrificeDetail: null
    };

    this.lastSelectedPlayerId = player.id;

    return {
      success: true,
      player,
      question: {
        id: chosenQuestion.id,
        type: chosenQuestion.type,
        text: chosenQuestion.text,
        theme: chosenQuestion.theme
      },
      remainingCount: this.getRemainingQuestions().length - 1
    };
  }

  getActivePlayer() {
    if (!this.activeTurn || !this.activeTurn.playerId) return null;
    return this.players.find(p => p.id === this.activeTurn.playerId) || null;
  }

  getActiveQuestion() {
    if (!this.activeTurn || !this.activeTurn.questionId) return null;
    return this.questions.find(q => q.id === this.activeTurn.questionId) || null;
  }

  /**
   * Accept the current challenge.
   * Marks question as permanently consumed (used = true).
   * Records completed turn in history.
   */
  acceptChallenge() {
    if (!this.activeTurn || this.activeTurn.status !== 'revealed') {
      return { success: false, error: 'No active challenge to accept.' };
    }

    const player = this.getActivePlayer();
    const question = this.getActiveQuestion();

    if (!player || !question) {
      return { success: false, error: 'Player or challenge state corrupted.' };
    }

    // Mark question as used
    question.used = true;
    this.activeTurn.status = 'accepted';

    // Record stats
    this.stats.totalCompletedChallenges++;
    if (question.type === 'truth') {
      this.stats.completedTruths++;
    } else {
      this.stats.completedDares++;
    }

    // Record turn in history (WITHOUT contributor identity!)
    this.history.unshift({
      round: this.currentRound,
      playerId: player.id,
      playerName: player.name,
      playerAvatar: player.avatar,
      isSvg: player.isSvg,
      type: question.type,
      questionText: question.text,
      outcome: 'completed',
      timestamp: Date.now()
    });

    return {
      success: true,
      player,
      question,
      outcome: 'completed'
    };
  }

  /**
   * Sacrifice a life instead of doing the challenge.
   * Deducts exactly 1 life.
   * Marks question as used according to game rules.
   * Records sacrifice task.
   */
  sacrificeLife(sacrificeTask = null) {
    if (!this.activeTurn || !['revealed', 'sacrifice-pending'].includes(this.activeTurn.status)) {
      return { success: false, error: 'No active challenge to sacrifice.' };
    }

    const player = this.getActivePlayer();
    const question = this.getActiveQuestion();

    if (!player || !question) {
      return { success: false, error: 'Player or challenge state corrupted.' };
    }

    if (player.lives <= 0) {
      return { success: false, error: 'Player has no lives left to sacrifice.' };
    }

    if (sacrificeTask && !this.sacrifices.some(task => task === sacrificeTask.trim())) {
      return { success: false, error: 'Choose a valid configured sacrifice option.' };
    }

    if (this.activeTurn.status === 'sacrifice-pending') {
      return { success: false, error: 'Life already deducted. Choose a sacrifice option to complete this turn.' };
    }

    // Deduct exactly 1 life after confirmation, before option selection.
    player.lives = Math.max(0, player.lives - 1);
    question.used = true;
    this.activeTurn.status = 'sacrifice-pending';
    this.activeTurn.sacrificeDetail = null;

    if (sacrificeTask) {
      return this.completeSacrifice(sacrificeTask);
    }

    return {
      success: true,
      player,
      remainingLives: player.lives,
      isEliminated: player.lives === 0,
      awaitingSacrificeSelection: true
    };
  }

  completeSacrifice(sacrificeTask) {
    if (!this.activeTurn || this.activeTurn.status !== 'sacrifice-pending') {
      return { success: false, error: 'No pending sacrifice to complete.' };
    }
    const player = this.getActivePlayer();
    const question = this.getActiveQuestion();
    const trimmedTask = (sacrificeTask || '').trim();
    if (!player || !question) {
      return { success: false, error: 'Player or challenge state corrupted.' };
    }
    if (!trimmedTask || !this.sacrifices.some(task => task === trimmedTask)) {
      return { success: false, error: 'Choose a valid configured sacrifice option.' };
    }

    this.activeTurn.status = 'sacrificed';
    this.activeTurn.sacrificeDetail = trimmedTask;
    this.stats.totalSacrifices++;

    this.history.unshift({
      round: this.currentRound,
      playerId: player.id,
      playerName: player.name,
      playerAvatar: player.avatar,
      isSvg: player.isSvg,
      type: question.type,
      questionText: question.text,
      outcome: 'sacrificed',
      sacrificeDetail: trimmedTask,
      remainingLives: player.lives,
      timestamp: Date.now()
    });

    const isEliminated = player.lives === 0;

    return {
      success: true,
      player,
      remainingLives: player.lives,
      isEliminated,
      sacrificeTask: trimmedTask
    };
  }

  /**
   * Safety Veto:
   * When a player feels uncomfortable with a challenge.
   * Does NOT deduct life.
   * Does NOT permanently consume the challenge (returns it safely or shelves it).
   * Host can immediately draw another challenge for this player.
   */
  safetyVeto() {
    if (!this.activeTurn || this.activeTurn.status !== 'revealed') {
      return { success: false, error: 'No active challenge to veto.' };
    }

    const player = this.getActivePlayer();
    const question = this.getActiveQuestion();

    if (!player || !question) {
      return { success: false, error: 'Player or challenge state corrupted.' };
    }

    // Safety veto does NOT consume the question, sets vetoed flag
    question.vetoed = true;
    question.used = false; // Remains safe
    this.activeTurn.status = 'vetoed';

    this.stats.totalVetoes++;

    this.history.unshift({
      round: this.currentRound,
      playerId: player.id,
      playerName: player.name,
      playerAvatar: player.avatar,
      isSvg: player.isSvg,
      type: question.type,
      questionText: 'Safety Veto Exercised',
      outcome: 'vetoed',
      timestamp: Date.now()
    });

    return {
      success: true,
      player,
      message: 'Safety veto accepted. No life deducted.'
    };
  }

  /**
   * Draw another challenge for the same player following a Safety Veto
   */
  redrawForVeto(preferredType = 'random') {
    if (!this.activeTurn || this.activeTurn.status !== 'vetoed') {
      return { success: false, error: 'Can only redraw after a safety veto.' };
    }

    const remaining = this.getEligibleQuestions(this.activeTurn.playerId, preferredType === 'truth' || preferredType === 'dare' ? preferredType : null);
    if (remaining.length === 0) {
      return { success: false, error: `No unused eligible ${preferredType === 'truth' || preferredType === 'dare' ? preferredType : ''} replacement is available. The round is paused.` };
    }

    const chosenQuestion = remaining[Math.floor(Math.random() * remaining.length)];
    this.activeTurn.questionId = chosenQuestion.id;
    this.activeTurn.chosenType = chosenQuestion.type;
    this.activeTurn.status = 'revealed';

    return {
      success: true,
      player: this.getActivePlayer(),
      question: {
        id: chosenQuestion.id,
        type: chosenQuestion.type,
        text: chosenQuestion.text,
        theme: chosenQuestion.theme
      }
    };
  }

  /**
   * Conclude the current round and prepare for the next round.
   * Checks if game has reached termination condition.
   */
  nextRound() {
    this.currentRound++;
    this.activeTurn = null;

    // Check game termination conditions
    const eligiblePlayers = this.getEligiblePlayers();
    const remainingQuestions = this.getRemainingQuestions();

    const isGameOver = eligiblePlayers.length === 0 || remainingQuestions.length === 0;
    if (isGameOver) {
      this.phase = 'summary';
    }

    return {
      isGameOver,
      currentRound: this.currentRound,
      eligiblePlayerCount: eligiblePlayers.length,
      remainingQuestionCount: remainingQuestions.length
    };
  }

  /* ==========================================================================
     SUMMARY & FUN AWARDS (SCREEN H)
     ========================================================================== */

  calculateAwards() {
    const awards = [];

    // Player stats map
    const playerStats = {};
    for (const p of this.players) {
      playerStats[p.id] = {
        name: p.name,
        avatar: p.avatar,
        isSvg: p.isSvg,
        lives: p.lives,
        daresDone: 0,
        truthsDone: 0,
        sacrificesDone: 0
      };
    }

    for (const h of this.history) {
      if (!playerStats[h.playerId]) continue;
      if (h.outcome === 'completed') {
        if (h.type === 'dare') playerStats[h.playerId].daresDone++;
        if (h.type === 'truth') playerStats[h.playerId].truthsDone++;
      } else if (h.outcome === 'sacrificed') {
        playerStats[h.playerId].sacrificesDone++;
      }
    }

    const list = Object.values(playerStats);

    // 1. Fearless Daredevil (most dares)
    const maxDares = Math.max(...list.map(p => p.daresDone), 0);
    if (maxDares > 0) {
      const top = list.find(p => p.daresDone === maxDares);
      awards.push({
        title: '🔥 Fearless Daredevil',
        description: `Conquered ${top.daresDone} wild dare${top.daresDone > 1 ? 's' : ''}!`,
        playerName: top.name,
        avatar: top.avatar,
        isSvg: top.isSvg
      });
    }

    // 2. Truth Seeker (most truths)
    const maxTruths = Math.max(...list.map(p => p.truthsDone), 0);
    if (maxTruths > 0) {
      const top = list.find(p => p.truthsDone === maxTruths);
      awards.push({
        title: '💎 The Honest Heart',
        description: `Answered ${top.truthsDone} deep truth${top.truthsDone > 1 ? 's' : ''} without flinching.`,
        playerName: top.name,
        avatar: top.avatar,
        isSvg: top.isSvg
      });
    }

    // 3. Iron Survivor (most remaining lives)
    const maxLives = Math.max(...list.map(p => p.lives), 0);
    if (maxLives > 0) {
      const top = list.find(p => p.lives === maxLives);
      awards.push({
        title: '🛡️ Iron Survivor',
        description: `Held strong with ${top.lives} heart${top.lives > 1 ? 's' : ''} intact.`,
        playerName: top.name,
        avatar: top.avatar,
        isSvg: top.isSvg
      });
    }

    // 4. Wild Joker / Sacrifice Champion (most sacrifices)
    const maxSacrifices = Math.max(...list.map(p => p.sacrificesDone), 0);
    if (maxSacrifices > 0) {
      const top = list.find(p => p.sacrificesDone === maxSacrifices);
      awards.push({
        title: '🎭 Chaos Champion',
        description: `Embraced penalty tasks with ${top.sacrificesDone} hilarious sacrifice${top.sacrificesDone > 1 ? 's' : ''}!`,
        playerName: top.name,
        avatar: top.avatar,
        isSvg: top.isSvg
      });
    }

    // Fallback if no specific awards triggered
    if (awards.length === 0 && list.length > 0) {
      awards.push({
        title: '🎉 Party MVP',
        description: 'Brought unstoppable energy to the party session!',
        playerName: list[0].name,
        avatar: list[0].avatar,
        isSvg: list[0].isSvg
      });
    }

    return awards;
  }

  getEndGameSummary() {
    return {
      totalRounds: this.currentRound - 1,
      totalCompletedChallenges: this.stats.totalCompletedChallenges,
      totalSacrifices: this.stats.totalSacrifices,
      totalVetoes: this.stats.totalVetoes,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isSvg: p.isSvg,
        finalLives: p.lives
      })),
      awards: this.calculateAwards()
    };
  }

  /**
   * Replay game mode:
   * 'same_players': Resets player lives to 3, resets questions to unused, clears history & round count.
   * 'fresh': Clears players and questions, returns to setup.
   */
  replayGame(mode = 'same_players') {
    if (mode === 'same_players') {
      this.phase = 'lobby';
      this.currentRound = 1;
      this.activeTurn = null;
      this.lastSelectedPlayerId = null;
      this.history = [];
      this.stats = {
        totalCompletedChallenges: 0,
        totalSacrifices: 0,
        totalVetoes: 0,
        completedTruths: 0,
        completedDares: 0
      };

      // Reset all player lives to 3
      for (const p of this.players) {
        p.lives = 3;
      }

      // Reset all questions to unused and reshuffle
      for (const q of this.questions) {
        q.used = false;
        q.vetoed = false;
      }
      this.shuffleQuestions();

      return { success: true, mode: 'same_players' };
    } else {
      // Fresh game
      this.reset();
      this.phase = 'setup';
      return { success: true, mode: 'fresh' };
    }
  }

  /* ==========================================================================
     STATE EXPORT & IMPORT FOR PERSISTENCE
     ========================================================================== */

  exportState() {
    return {
      phase: this.phase,
      groupName: this.groupName,
      players: this.players,
      themeKey: this.themeKey,
      resolvedThemeKey: this.resolvedThemeKey,
      customThemeName: this.customThemeName,
      visualThemeKey: this.visualThemeKey,
      sacrifices: this.sacrifices,
      sacrificeCount: this.sacrificeCount,
      submissions: this.submissions,
      questions: this.questions,
      currentRound: this.currentRound,
      activeTurn: this.activeTurn,
      lastSelectedPlayerId: this.lastSelectedPlayerId,
      history: this.history,
      stats: this.stats
    };
  }

  importState(data) {
    if (!data || typeof data !== 'object') return false;

    this.phase = data.phase || 'welcome';
    this.groupName = data.groupName || 'The Party Squad';
    this.players = Array.isArray(data.players) ? data.players.map(player => ({
      ...player,
      lives: Number.isInteger(player.lives) ? Math.max(0, Math.min(3, player.lives)) : 3
    })) : [];
    this.themeKey = data.themeKey || 'random';
    this.resolvedThemeKey = data.resolvedThemeKey || 'funny';
    this.customThemeName = data.customThemeName || '';
    this.visualThemeKey = data.visualThemeKey || 'midnight-neon';
    this.sacrifices = Array.isArray(data.sacrifices) && data.sacrifices.length > 0
      ? data.sacrifices.filter(item => typeof item === 'string' && item.trim()).slice(0, MAX_SACRIFICES)
      : [...DEFAULT_SACRIFICES];
    this.sacrificeCount = this.sacrifices.length;
    const requestedSacrificeCount = Number.parseInt(data.sacrificeCount, 10);
    if (Number.isInteger(requestedSacrificeCount)) {
      this.setSacrificeCount(requestedSacrificeCount);
    }
    this.submissions = data.submissions || { currentPlayerIndex: 0, completedPlayerIds: [] };
    this.questions = Array.isArray(data.questions) ? data.questions.map(question => ({
      ...question,
      contributorId: question.contributorId || null,
      used: Boolean(question.used),
      vetoed: Boolean(question.vetoed)
    })) : [];
    this.currentRound = data.currentRound || 1;
    this.activeTurn = data.activeTurn || null;
    this.lastSelectedPlayerId = data.lastSelectedPlayerId || null;
    this.history = Array.isArray(data.history) ? data.history : [];
    this.stats = data.stats || {
      totalCompletedChallenges: 0,
      totalSacrifices: 0,
      totalVetoes: 0,
      completedTruths: 0,
      completedDares: 0
    };

    return true;
  }
}
