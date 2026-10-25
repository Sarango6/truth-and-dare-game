/**
 * test-suite.js - Automated Verification of Truth or Dare Game Engine
 * Validates all business logic, validation, edge cases, and state transitions.
 */

import { GameState, THEMES, VISUAL_THEMES, DEFAULT_SACRIFICES } from '../js/game.js';
import { StorageManager } from '../js/storage.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('=== RUNNING TRUTH OR DARE AUTOMATED VERIFICATION ===\n');

// 1. SETUP TESTS
console.log('[1. Setup Tests]');
const game = new GameState();

// 0 players cannot proceed
assert(!game.canProceedFromSetup(), 'Cannot proceed from setup with 0 players');

// Empty name rejected
let res = game.addPlayer('', 'avatar-1');
assert(!res.success && res.error.includes('empty'), 'Empty player name is rejected');

// Whitespace-only name rejected
res = game.addPlayer('   ', 'avatar-1');
assert(!res.success && res.error.includes('empty'), 'Whitespace-only name is rejected');

// Add 1 player
res = game.addPlayer('Alice', 'avatar-1');
assert(res.success && game.players.length === 1, 'Player "Alice" added successfully');
assert(!game.canProceedFromSetup(), 'Cannot proceed from setup with only 1 player');

// Duplicate name rejection (case-insensitive & whitespace trimmed)
res = game.addPlayer('   alice   ', 'avatar-2');
assert(!res.success && res.error.includes('already exists'), 'Duplicate name "   alice   " rejected against "Alice"');

// Add second player -> 2 players can start
res = game.addPlayer('Bob', 'avatar-2');
assert(res.success && game.players.length === 2, 'Player "Bob" added successfully');
assert(game.canProceedFromSetup(), '2 players can proceed from setup');

// Add up to 20 players
for (let i = 3; i <= 20; i++) {
  res = game.addPlayer(`Player_${i}`, 'avatar-1');
  assert(res.success, `Player_${i} added`);
}
assert(game.players.length === 20, 'Exactly 20 players added');

// 21st player is rejected
res = game.addPlayer('Player_21', 'avatar-1');
assert(!res.success && res.error.includes('Maximum 20 players'), '21st player is rejected');

// Remove player
const removedId = game.players[19].id;
res = game.removePlayer(removedId);
assert(res.success && game.players.length === 19, 'Player removed correctly');

// Edit player
const playerToEdit = game.players[0]; // Alice
res = game.editPlayer(playerToEdit.id, 'Alice Cooper', 'avatar-3');
assert(res.success && game.players[0].name === 'Alice Cooper', 'Player name edited correctly');

// Reset to a clean 3-player game for subsequent tests
game.reset();
game.addPlayer('Alice', 'avatar-1');
game.addPlayer('Bob', 'avatar-2');
game.addPlayer('Charlie', 'avatar-3');
assert(game.players.length === 3, 'Clean 3-player game initialized');

// 2. SACRIFICES CUSTOMIZATION
console.log('\n[2. Sacrifices Tests]');
const initialSacrificesCount = game.sacrifices.length;
res = game.addCustomSacrifice('Sing a karaoke chorus');
assert(res.success && game.sacrifices.length === initialSacrificesCount + 1, 'Custom sacrifice added');

// Prevent duplicate sacrifice
res = game.addCustomSacrifice('sing a karaoke chorus');
assert(!res.success, 'Duplicate sacrifice rejected');
assert(game.sacrifices.length === 7, 'Custom sacrifice list stays synchronized with its count');
res = game.setSacrificeCount(0);
assert(!res.success, 'Sacrifice count below minimum is rejected');
res = game.setSacrificeCount(21);
assert(!res.success, 'Sacrifice count above maximum is rejected');
const livesBeforeSacrificeSettings = game.players.map(player => player.lives);
res = game.setSacrificeCount(1);
assert(res.success && game.sacrifices.length === 1, 'Sacrifice count can be reduced to one');
res = game.setSacrificeCount(6);
assert(res.success && game.sacrifices.length === 6, 'Sacrifice count can be expanded back to six');
assert(game.players.every((player, index) => player.lives === livesBeforeSacrificeSettings[index]), 'Changing sacrifice count does not change lives');
res = game.updateSacrifice(0, '   ');
assert(!res.success, 'Whitespace-only sacrifice descriptions are rejected');
res = game.updateSacrifice(0, game.sacrifices[1]);
assert(!res.success, 'Duplicate edited sacrifice descriptions are rejected');

// 3. THEME TESTS
console.log('\n[3. Theme Tests]');
res = game.setTheme('funny');
assert(res.success && game.resolvedThemeKey === 'funny', 'Built-in theme "funny" selected');

res = game.setTheme('random');
assert(res.success && game.themeKey === 'random', 'Random theme selected');
assert(game.resolvedThemeKey !== 'random', 'Random theme resolved to concrete theme');

res = game.setTheme('custom', 'Late Night Squad');
assert(res.success && game.customThemeName === 'Late Night Squad', 'Custom theme name configured');
assert(game.getThemeDisplayName() === 'Late Night Squad', 'Display name returns custom theme');

// 4. QUESTION SUBMISSIONS & PRIVACY
console.log('\n[4. Question Submissions & Anonymity]');
game.setPhase('submissions');
game.initSubmissions();

const p1 = game.getCurrentSubmittingPlayer();
assert(p1.name === 'Alice', 'First submitting player is Alice');

// Empty field validation
res = game.submitPlayerQuestions(p1.id, '', 'Truth 2', 'Dare 1', 'Dare 2');
assert(!res.success && res.error.includes('cannot be empty'), 'Empty Truth 1 rejected');

// Short text validation (<5 chars)
res = game.submitPlayerQuestions(p1.id, 'Why?', 'Valid truth question', 'Dare 1 challenge text', 'Dare 2 challenge text');
assert(!res.success && res.error.includes('at least 5 characters'), 'Short text (<5 chars) rejected');

// Duplicate questions within submission
res = game.submitPlayerQuestions(p1.id, 'Tell your biggest secret here?', 'Tell your biggest secret here?', 'Do 10 pushups', 'Dance for 10 seconds');
assert(!res.success && res.error.includes('cannot be identical'), 'Duplicate questions within submission rejected');

// Valid submission for Alice
res = game.submitPlayerQuestions(p1.id, 'What is your most embarrassing moment?', 'Who was your first celebrity crush?', 'Do your best alien impression', 'Sing the chorus of your favorite song');
assert(res.success && !res.isComplete, 'Alice submitted 2 truths and 2 dares');

// Bob submission
const p2 = game.getCurrentSubmittingPlayer();
assert(p2.name === 'Bob', 'Second submitting player is Bob');
res = game.submitPlayerQuestions(p2.id, 'What is a weird habit you secretly have?', 'Have you ever broken something and blamed someone else?', 'Speak in an accent until your next turn', 'Balance a spoon on your nose for 10 seconds');
assert(res.success && !res.isComplete, 'Bob submitted questions');

// Charlie submission (final player)
const p3 = game.getCurrentSubmittingPlayer();
assert(p3.name === 'Charlie', 'Third submitting player is Charlie');
res = game.submitPlayerQuestions(p3.id, 'What is the biggest lie you ever told your parents?', 'What irrational fear do you secretly hold?', 'Wear your socks on your hands for a round', 'Act like a dramatic soap opera character');
assert(res.success && res.isComplete, 'Charlie submitted questions and submissions marked complete');

// Check question counts: 3 players * 4 = 12 total (6 truths, 6 dares)
assert(game.questions.length === 12, 'Total questions count is exactly 12 (3 * 4)');
const truths = game.questions.filter(q => q.type === 'truth');
const dares = game.questions.filter(q => q.type === 'dare');
assert(truths.length === 6, 'Total truths count is 6');
assert(dares.length === 6, 'Total dares count is 6');

// Contributor IDs are internal eligibility metadata, never UI-facing.
assert(game.questions.every(q => typeof q.contributorId === 'string'), 'Every question has an internal contributor ID');
assert(game.questions.every(q => !('contributorName' in q) && !('author' in q)), 'Question objects do not leak contributor names');

// 5. LOBBY VERIFICATION
console.log('\n[5. Lobby Tests]');
game.setPhase('lobby');
const lobbySummary = game.getLobbySummary();
assert(lobbySummary.totalPlayers === 3, 'Lobby shows 3 players');
assert(lobbySummary.totalQuestions === 12, 'Lobby shows 12 challenges');
assert(lobbySummary.totalTruths === 6, 'Lobby shows 6 truths');
assert(lobbySummary.totalDares === 6, 'Lobby shows 6 dares');
assert(lobbySummary.players.every(p => p.lives === 3), 'All players start with 3 lives');

// 6. MAIN GAMEPLAY, ROUND CYCLES & DOUBLE-CLICK PROTECTION
console.log('\n[6. Main Gameplay Tests]');
game.setPhase('playing');
assert(game.currentRound === 1, 'Starts at Round 1');

// Draw challenge Round 1
res = game.startRoundDrawing('random');
assert(res.success, 'Challenge drawn successfully');
assert(res.player !== null, 'Eligible player selected');
assert(res.question !== null, 'Unused question selected');
assert(!('contributorId' in res.question), 'Revealed question projection omits contributor metadata');
assert(res.question.id !== game.questions.find(q => q.id === res.question.id && q.contributorId === res.player.id)?.id, 'Player never receives their own question');

const firstPlayerId = res.player.id;
const firstQuestionId = res.question.id;

// Accept challenge
res = game.acceptChallenge();
assert(res.success, 'Challenge accepted');
const qObj = game.questions.find(q => q.id === firstQuestionId);
assert(qObj.used === true, 'Accepted question marked as used (consumed)');
assert(game.history.length === 1, 'History recorded 1 turn');
assert(!game.history[0].contributor, 'History entry does NOT leak contributor identity');

// Advance round
res = game.nextRound();
assert(game.currentRound === 2, 'Advanced to Round 2');
assert(!res.isGameOver, 'Game is not over');

// Draw challenge Round 2 - verify consecutive repeat avoidance
res = game.startRoundDrawing('random');
assert(res.success, 'Round 2 challenge drawn');
assert(res.player.id !== firstPlayerId, 'Consecutive repeat of same player was avoided');

// Test Safety Veto (no life lost, question not permanently consumed)
const vetoedQuestionId = res.question.id;
const playerLivesBeforeVeto = res.player.lives;
res = game.safetyVeto();
assert(res.success, 'Safety veto accepted');
assert(game.getActivePlayer().lives === playerLivesBeforeVeto, 'Safety veto did NOT deduct any life');
const vq = game.questions.find(q => q.id === vetoedQuestionId);
assert(vq.used === false, 'Safety veto did not mark question as permanently consumed');

// Redraw after veto
res = game.redrawForVeto('dare');
assert(res.success, 'Redrawn challenge for same player successfully');

// Test Sacrifice a Life
const playerBeforeSacrifice = game.getActivePlayer();
const livesBefore = playerBeforeSacrifice.lives;
res = game.sacrificeLife(game.sacrifices[0]);
assert(res.success, 'Sacrifice recorded');
assert(playerBeforeSacrifice.lives === livesBefore - 1, 'Exactly 1 life deducted upon confirmed sacrifice');
assert(res.remainingLives === 2, 'Player has 2 lives remaining');

// Confirmed sacrifice is idempotent and selection can be resumed after cancellation.
game.nextRound();
res = game.startRoundDrawing('random');
assert(res.success, 'Challenge available for staged sacrifice test');
const stagedLives = game.getActivePlayer().lives;
res = game.sacrificeLife();
assert(res.success && res.awaitingSacrificeSelection, 'Confirmed sacrifice deducts one life before selection');
assert(game.getActivePlayer().lives === stagedLives - 1, 'Staged sacrifice deducts exactly one life');
res = game.sacrificeLife();
assert(!res.success && game.getActivePlayer().lives === stagedLives - 1, 'Repeated sacrifice confirmation cannot deduct twice');
res = game.completeSacrifice(game.sacrifices[0]);
assert(res.success && game.history[0].sacrificeDetail === game.sacrifices[0], 'Configured sacrifice completion records one history entry');

// Next round
game.nextRound();
assert(game.currentRound === 4, 'Advanced to Round 4');

// 7. ELIMINATION & GAME OVER CONDITIONS
console.log('\n[7. Elimination & Game End Tests]');
// Deduct remaining 2 lives from Bob
const bob = game.players.find(p => p.name === 'Bob');
bob.lives = 0; // Simulated elimination
const eligible = game.getEligiblePlayers();
assert(!eligible.some(p => p.id === bob.id), 'Player with 0 lives is excluded from eligible player pool');

// Eliminate all players to test graceful game ending
for (const p of game.players) {
  p.lives = 0;
}
assert(game.getEligiblePlayers().length === 0, 'All players have 0 lives');
res = game.startRoundDrawing('random');
assert(!res.success && res.isGameOver, 'Game gracefully ends when all players reach 0 lives');
assert(game.phase === 'summary', 'Phase transitioned to summary');

// 8. SUMMARY & AWARDS
console.log('\n[8. Summary & Awards Tests]');
const summary = game.getEndGameSummary();
assert(summary.totalCompletedChallenges === 1, 'Summary matches recorded challenge count');
assert(summary.totalSacrifices === 2, 'Summary matches recorded sacrifice count');
assert(summary.totalVetoes === 1, 'Summary matches recorded veto count');
assert(Array.isArray(summary.awards) && summary.awards.length > 0, 'Dynamic fun awards generated');

// 9. REPLAY MODES
console.log('\n[9. Replay Mode Tests]');
// Test replay with same players
res = game.replayGame('same_players');
assert(res.success, 'Replay with same players successful');
assert(game.players.every(p => p.lives === 3), 'All player lives reset to 3');
assert(game.questions.every(q => q.used === false), 'All questions reset to unused');
assert(game.currentRound === 1, 'Round counter reset to 1');
assert(game.phase === 'lobby', 'Returns to lobby');

// Test replay fresh game
res = game.replayGame('fresh');
assert(res.success, 'Fresh game reset successful');
assert(game.players.length === 0, 'Fresh game clears players');
assert(game.questions.length === 0, 'Fresh game clears questions');
assert(game.phase === 'setup', 'Returns to setup');

// 10. STORAGE PERSISTENCE & FAULT TOLERANCE
console.log('\n[10. Storage Tests]');
const sampleState = {
  phase: 'playing',
  players: [
    { id: 'p_1', name: 'Zoe', avatar: 'avatar-1', isSvg: true, lives: 3 },
    { id: 'p_2', name: 'Max', avatar: 'avatar-2', isSvg: true, lives: 2 }
  ]
};

// In Node environment, test storage mock fault-tolerance
assert(typeof StorageManager.isStorageAvailable === 'function', 'StorageManager has isStorageAvailable method');
assert(typeof StorageManager.saveGameState === 'function', 'StorageManager has saveGameState method');
assert(typeof StorageManager.loadGameState === 'function', 'StorageManager has loadGameState method');

const storageValues = {};
globalThis.window = {
  localStorage: {
    setItem: (key, value) => { storageValues[key] = value; },
    getItem: (key) => storageValues[key] || null,
    removeItem: (key) => { delete storageValues[key]; }
  }
};
storageValues.truth_dare_party_game_state_v1 = JSON.stringify({
  schemaVersion: 1,
  state: {
    phase: 'playing',
    players: [{ id: 'legacy', name: 'Legacy', lives: 2 }],
    sacrifices: ['Legacy safe option'],
    questions: [{ id: 'legacy-q', type: 'truth', text: 'Legacy question', used: false }]
  }
});
const migrated = StorageManager.loadGameState();
assert(migrated && migrated.sacrificeCount === 1, 'Version 1 saved game migrates sacrifice settings');
assert(migrated.questions[0].contributorId === null, 'Legacy questions receive a safe missing-contributor default');
storageValues.truth_dare_party_game_state_v1 = '{bad json';
assert(StorageManager.loadGameState() === null, 'Corrupted saved JSON is discarded without throwing');

console.log(`\n========================================`);
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
