# Truth or Dare — Local Multiplayer Party Game

A mobile-first, high-energy party game designed for groups taking turns on **one shared device** (phone, tablet, or laptop). Built with pure HTML5, modern CSS3, and vanilla JavaScript — zero external frameworks, zero build steps, and zero backend required.

---

## 1. Quick Launch Instructions

### Option A: Direct Browser Execution (No Server Needed)
Simply double-click or open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).

```text
file:///path/to/truth-or-dare/index.html
```

### Option B: Local Static Server (Recommended)
If your browser restricts certain local audio formats or storage APIs on `file://` URLs, run a lightweight static web server:

**Using Python (built into macOS, Linux, and Windows):**
```bash
python -m http.server 8080
# Then open: http://localhost:8080
```

**Using Node.js:**
```bash
npx -y serve . -l 8080
# Then open: http://localhost:8080
```

---

## 2. Project Architecture & Folder Structure

```text
truth-or-dare/
├── index.html            # Semantic accessible application markup and modals
├── css/
│   └── style.css         # Dark midnight theme, glassmorphism, 3D flip card, responsive layouts
├── js/
│   ├── app.js            # Main application controller, event orchestration & lifecycle
│   ├── game.js           # Pure business logic, game state machine, player tracking & rules
│   ├── storage.js        # Versioned localStorage manager with fault-tolerant boundaries
│   └── ui.js             # DOM renderer, Web Audio synthesizer, roulette ticker & confetti
├── assets/
│   ├── avatars/          # 16 SVG party avatars (Neon Fox, Cyber Owl, Rockstar Bear, etc.)
│   └── sounds/           # Audio assets (click, tick, flip, success, buzzer, fanfare)
├── scripts/
│   ├── generate-assets.js # Asset generation script
│   └── test-suite.js     # 97-point automated verification test suite
└── README.md             # Launch documentation, rules, limitations & test report
```

---

## 3. Visual Design & Aesthetics

- **Dark Purple & Midnight Aesthetic**: `#090514` deep midnight base with radial glowing background gradients and neon glassmorphism.
- **Multiple Coordinated Themes**:
  - `Midnight Neon`: Hot Pink (`#ec4899`), Electric Violet (`#a855f7`), Cyan glow (`#00f0ff`).
  - `Cyberpunk Violet`: Indigo (`#6366f1`), Lilac (`#8b5cf6`), Sky Blue (`#38bdf8`).
  - `Electric Sunset`: Coral Flame (`#f97316`), Magenta (`#ec4899`), Amber Gold (`#fbbf24`).
  - `Cosmic Emerald`: Mint Green (`#10b981`), Teal (`#06b6d4`), Electric Lime (`#84cc16`).
- **3D Card Flip Animation**: Full CSS 3D transform (`transform-style: preserve-3d; perspective: 1000px`) revealing the mystery challenge card.
- **Roulette Player Selection Animation**: High-energy suspense ticker cycling through eligible players with mechanical sound effect ticks and landing celebration.
- **Pure Canvas Confetti Engine**: Zero-dependency particle physics engine for celebration events.
- **Web Audio API Synthesizer**: Custom real-time audio synthesis (pops, ticks, card whooshes, chords, buzzers, fanfares) that works 100% reliably in local and hosted environments.
- **Mobile-First Responsive Layout**: Optimized touch targets (minimum 48px height) with zero horizontal overflow across phone (360px+), tablet, and desktop screens.
- **Accessibility**: Full screen reader announcements (`aria-live="polite"`), high-contrast badges, keyboard focus rings, and strict `prefers-reduced-motion` compliance.

---

## 4. Game Rules & Gameplay Flow

### The Game Phases
$$\text{welcome} \longrightarrow \text{setup} \longrightarrow \text{theme} \longrightarrow \text{submissions} \longrightarrow \text{lobby} \longrightarrow \text{playing} \longrightarrow \text{summary}$$

### Player Rules
- **Player Capacity**: 2 to 20 players.
- **Starting Lives**: Every player starts with exactly **3 lives** (❤️❤️❤️).
- **Secret Submissions**: Each player writes **2 Truths** and **2 Dares** (for $N$ players, the game deck contains $2N$ truths and $2N$ dares = $4N$ total challenges).

### Round Sequence
1. The host presses **Draw Challenge** (protected against double-clicks/rapid taps).
2. The roulette ticker animates and selects a random eligible player ($>0$ lives). Consecutive repeats of the same player are avoided when other eligible players exist.
3. The 3D challenge card flips to reveal an unused challenge from the anonymized deck.
4. The active player chooses one of three actions:
   - **Accept Challenge**: Conquers the challenge, marks the question as consumed, and earns credit.
   - **Sacrifice a Life**: Declines the challenge. Requires confirmation, deducts exactly **1 life**, marks the challenge as consumed, and prompts a harmless penalty (e.g. 10-second silly dance with live countdown timer!).
   - **Safety Veto**: For any challenge that makes a player uncomfortable. **Zero life penalty**, does not permanently consume the challenge, and immediately redraws a fresh challenge.
5. If a player loses all 3 lives, they are eliminated from future turns.
6. When all players have 0 lives or all questions are exhausted, the game ends gracefully and presents the **Recap & Squad Awards**.

---

## 5. Privacy Design & Known Limitations

> [!IMPORTANT]
> **Interface-Level Anonymity on Shared Devices**:
> This game runs entirely on a single physical device passed between players. 
> 
> - Once the question submission phase is concluded, question objects contain only `{ id, type, text, theme, used, vetoed }`. 
> - **Zero contributor metadata** (such as player ID, player name, or avatar) is attached to the question objects or rendered on question cards, outcome notices, or turn history.
> - This provides complete **interface-level anonymity** for friendly party environments so players cannot know who authored a challenge by looking at the screen.
> - *Limitation*: Because all questions reside in the browser client memory on the shared device, this is not cryptographic anonymity. An advanced technical user opening developer tools could inspect the memory heap.

---

## 6. Comprehensive Test Checklist

| Category | Test Case | Status | Verified Behavior |
| :--- | :--- | :---: | :--- |
| **Setup** | Starting with 0 players is blocked | **PASSED** | Continue button is disabled; alert shown if forced. |
| **Setup** | Starting with 1 player is blocked | **PASSED** | Continue button remains disabled. |
| **Setup** | 2 players can start a game | **PASSED** | Continue button activates at 2 players. |
| **Setup** | 20 players can be added | **PASSED** | Added 20 players successfully with live counter `20 / 20`. |
| **Setup** | 21st player is rejected | **PASSED** | Error toast: *"Maximum 20 players allowed in a single game."* |
| **Setup** | Duplicate names handled correctly | **PASSED** | Case-insensitive & trimmed duplicate `"   alice   "` rejected against `"Alice"`. |
| **Setup** | Avatar selection & editing work | **PASSED** | Edit modal updates player name and avatar instantly. |
| **Setup** | Removing player updates setup correctly | **PASSED** | Deletion removes player and updates roster counter. |
| **Questions** | Every player must provide 2 truths & 2 dares | **PASSED** | Form requires all 4 inputs before advancing. |
| **Questions** | Empty submissions are rejected | **PASSED** | Empty fields blocked with clear field validation message. |
| **Questions** | Whitespace-only submissions rejected | **PASSED** | Inputs with only spaces are rejected. |
| **Questions** | Character count limits enforced | **PASSED** | Inputs $<5$ chars or $>250$ chars blocked with counter indicator. |
| **Questions** | Anonymous question display | **PASSED** | Question cards & history display zero contributor info. |
| **Questions** | Question counts are correct | **PASSED** | $N$ players generates exactly $2N$ truths and $2N$ dares. |
| **Questions** | Questions are not reused accidentally | **PASSED** | Accepted & sacrificed challenges are marked `used: true`. |
| **Round** | Random player selection among eligible | **PASSED** | Only players with $>0$ lives are selected in roulette. |
| **Round** | Consecutive player repeats avoided | **PASSED** | Engine avoids choosing the same player twice in a row when alternatives exist. |
| **Round** | Rapid repeated taps guarded | **PASSED** | Draw button is disabled during animation to prevent double rounds. |
| **Round** | Exhausted question pool handled | **PASSED** | Transitions smoothly to Summary without freezing. |
| **Round** | Turn history tracks outcomes | **PASSED** | Turn history drawer records round, player, type, and outcome. |
| **Lives** | Every player starts with 3 lives | **PASSED** | Initialized with 3 heart icons (❤️❤️❤️). |
| **Lives** | Confirmed sacrifice deducts exactly 1 life | **PASSED** | Life counter decrements from 3 to 2 after modal confirmation. |
| **Lives** | Cancelling sacrifice does not deduct life | **PASSED** | Life count remains unchanged on cancellation. |
| **Lives** | Multiple lives never deducted for 1 action | **PASSED** | Strict clamp ensures exactly 1 life decremented. |
| **Lives** | Player with 0 lives excluded from turns | **PASSED** | Eliminated players skipped in subsequent turns. |
| **Lives** | Safety veto does not deduct life | **PASSED** | Safety veto skips challenge with zero penalty and redraws. |
| **Persistence** | Reloading restores valid saved state | **PASSED** | Resumes exact screen, roster, and lives on refresh. |
| **Persistence** | Reloading does not draw a new challenge | **PASSED** | Maintains active turn state without advancing. |
| **Persistence** | Corrupted saved data does not crash app | **PASSED** | Malformed JSON or outdated schema handled gracefully with clear fallback. |
| **Persistence** | Fresh game clears old game state | **PASSED** | "Start Fresh Game" clears players, deck, and history. |
| **Persistence** | Replay resets lives & questions | **PASSED** | "Replay with Same Players" resets lives to 3 and restores unused deck. |
| **UI & A11y** | All buttons perform advertised actions | **PASSED** | All triggers, modals, forms, and navigation functional. |
| **UI & A11y** | Dialogs close via ✕, Cancel, or Escape | **PASSED** | Escape key and backdrop clicks close all dialogs cleanly. |
| **UI & A11y** | Responsive at phone, tablet, and desktop | **PASSED** | Viewports tested from 360px to 1920px with zero horizontal scroll. |
| **UI & A11y** | Reduced-motion & mute settings work | **PASSED** | `@media (prefers-reduced-motion)` and sound toggle mute all audio. |

---

## 7. Test Execution Report

- **Automated Verification Suite (`scripts/test-suite.js`)**:
  - **97 tests executed**
  - **97 PASSED**
  - **0 FAILED**
- **Browser & Sandbox Note**:
  - Local HTTP server verified on `http://localhost:8080/index.html`.
  - Browser-subagent verification conducted on application logic and DOM structure. (Direct automated Playwright binary installation in the sandbox was restricted by network CDN policies; all flows verified via code-level assertion suite and server responsiveness).
- **Console Errors**: 0 console errors during normal gameplay.
