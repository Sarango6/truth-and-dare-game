const fs = require('fs');
const path = require('path');

const avatarDir = path.join(__dirname, '..', 'assets', 'avatars');
const soundDir = path.join(__dirname, '..', 'assets', 'sounds');

fs.mkdirSync(avatarDir, { recursive: true });
fs.mkdirSync(soundDir, { recursive: true });

// 16 distinct, stylish SVG avatars
const avatars = [
  {
    id: 'avatar-1',
    name: 'Neon Fox',
    bg: ['#ff5e62', '#ff9966'],
    content: `
      <!-- Fox ears -->
      <polygon points="32,24 45,52 20,48" fill="#ff7a00" stroke="#fff" stroke-width="2"/>
      <polygon points="33,28 42,48 24,46" fill="#ffe0b2"/>
      <polygon points="68,24 80,48 55,52" fill="#ff7a00" stroke="#fff" stroke-width="2"/>
      <polygon points="67,28 76,46 58,48" fill="#ffe0b2"/>
      <!-- Head -->
      <path d="M22,48 Q50,38 78,48 Q82,72 50,88 Q18,72 22,48 Z" fill="#ff9100"/>
      <!-- Cheeks -->
      <path d="M22,58 Q36,68 50,70 Q64,68 78,58 Q72,82 50,88 Q28,82 22,58 Z" fill="#ffffff"/>
      <!-- Eyes -->
      <ellipse cx="38" cy="56" rx="4" ry="5" fill="#2d1b4e"/>
      <circle cx="39" cy="54" r="1.5" fill="#fff"/>
      <ellipse cx="62" cy="56" rx="4" ry="5" fill="#2d1b4e"/>
      <circle cx="63" cy="54" r="1.5" fill="#fff"/>
      <!-- Nose -->
      <polygon points="50,68 46,64 54,64" fill="#2d1b4e"/>
      <!-- Cool glasses -->
      <rect x="28" y="50" width="18" height="12" rx="4" fill="#00f0ff" opacity="0.85" stroke="#fff" stroke-width="1.5"/>
      <rect x="54" y="50" width="18" height="12" rx="4" fill="#00f0ff" opacity="0.85" stroke="#fff" stroke-width="1.5"/>
      <line x1="46" y1="56" x2="54" y2="56" stroke="#fff" stroke-width="2"/>
    `
  },
  {
    id: 'avatar-2',
    name: 'Party Panda',
    bg: ['#667eea', '#764ba2'],
    content: `
      <!-- Ears -->
      <circle cx="30" cy="32" r="12" fill="#1f1b2c"/>
      <circle cx="70" cy="32" r="12" fill="#1f1b2c"/>
      <!-- Face -->
      <circle cx="50" cy="54" r="28" fill="#f8fafc"/>
      <!-- Eye patches -->
      <ellipse cx="38" cy="52" rx="8" ry="10" transform="rotate(-15 38 52)" fill="#1f1b2c"/>
      <ellipse cx="62" cy="52" rx="8" ry="10" transform="rotate(15 62 52)" fill="#1f1b2c"/>
      <circle cx="39" cy="51" r="3" fill="#fff"/>
      <circle cx="61" cy="51" r="3" fill="#fff"/>
      <!-- Nose & Mouth -->
      <ellipse cx="50" cy="62" rx="4" ry="3" fill="#1f1b2c"/>
      <path d="M46,67 Q50,71 54,67" stroke="#1f1b2c" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Party hat -->
      <polygon points="50,12 40,36 60,36" fill="#ec4899"/>
      <circle cx="50" cy="11" r="3" fill="#facc15"/>
      <line x1="42" y1="30" x2="58" y2="30" stroke="#38bdf8" stroke-width="2"/>
    `
  },
  {
    id: 'avatar-3',
    name: 'Cool Cat',
    bg: ['#f857a6', '#ff5858'],
    content: `
      <!-- Ears -->
      <polygon points="26,26 40,46 22,46" fill="#7c3aed"/>
      <polygon points="28,30 38,44 24,44" fill="#f472b6"/>
      <polygon points="74,26 78,46 60,46" fill="#7c3aed"/>
      <polygon points="72,30 76,44 62,44" fill="#f472b6"/>
      <!-- Face -->
      <circle cx="50" cy="55" r="26" fill="#9333ea"/>
      <!-- Cheeks -->
      <ellipse cx="36" cy="62" rx="5" ry="3" fill="#ec4899" opacity="0.6"/>
      <ellipse cx="64" cy="62" rx="5" ry="3" fill="#ec4899" opacity="0.6"/>
      <!-- Sunglasses -->
      <polygon points="28,48 48,48 44,60 30,58" fill="#1e1b4b" stroke="#facc15" stroke-width="1.5"/>
      <polygon points="52,48 72,48 70,58 56,60" fill="#1e1b4b" stroke="#facc15" stroke-width="1.5"/>
      <line x1="48" y1="52" x2="52" y2="52" stroke="#facc15" stroke-width="2"/>
      <!-- Nose & Mouth -->
      <polygon points="50,64 47,62 53,62" fill="#fbcfe8"/>
      <path d="M47,66 Q50,70 53,66" stroke="#fbcfe8" stroke-width="1.5" fill="none"/>
      <!-- Whiskers -->
      <line x1="20" y1="62" x2="30" y2="63" stroke="#e9d5ff" stroke-width="1.5"/>
      <line x1="20" y1="67" x2="30" y2="66" stroke="#e9d5ff" stroke-width="1.5"/>
      <line x1="80" y1="62" x2="70" y2="63" stroke="#e9d5ff" stroke-width="1.5"/>
      <line x1="80" y1="67" x2="70" y2="66" stroke="#e9d5ff" stroke-width="1.5"/>
    `
  },
  {
    id: 'avatar-4',
    name: 'Space Astro',
    bg: ['#0f172a', '#1e293b'],
    content: `
      <!-- Helmet outline -->
      <rect x="22" y="22" width="56" height="56" rx="24" fill="#e2e8f0" stroke="#94a3b8" stroke-width="3"/>
      <!-- Visor -->
      <rect x="28" y="28" width="44" height="42" rx="16" fill="#0284c7"/>
      <!-- Visor reflection -->
      <path d="M34,34 Q50,30 64,36 Q60,46 34,42 Z" fill="#38bdf8" opacity="0.7"/>
      <circle cx="62" cy="40" r="3" fill="#fff" opacity="0.8"/>
      <!-- Helmet mic -->
      <rect x="20" y="56" width="6" height="12" rx="3" fill="#64748b"/>
      <rect x="74" y="56" width="6" height="12" rx="3" fill="#64748b"/>
      <!-- Badge -->
      <circle cx="50" cy="84" r="8" fill="#f43f5e"/>
      <polygon points="50,78 52,82 56,82 53,85 54,89 50,86 46,89 47,85 44,82 48,82" fill="#fff"/>
    `
  },
  {
    id: 'avatar-5',
    name: 'Cyber Owl',
    bg: ['#134e5e', '#71b280'],
    content: `
      <!-- Owl ears/horns -->
      <polygon points="26,20 38,40 22,38" fill="#047857"/>
      <polygon points="74,20 78,38 62,40" fill="#047857"/>
      <!-- Body -->
      <ellipse cx="50" cy="56" rx="28" ry="30" fill="#10b981"/>
      <!-- Cyber goggles -->
      <circle cx="37" cy="50" r="12" fill="#0f172a" stroke="#fbbf24" stroke-width="2.5"/>
      <circle cx="63" cy="50" r="12" fill="#0f172a" stroke="#fbbf24" stroke-width="2.5"/>
      <line x1="49" y1="50" x2="51" y2="50" stroke="#fbbf24" stroke-width="3"/>
      <circle cx="37" cy="50" r="6" fill="#06b6d4"/>
      <circle cx="63" cy="50" r="6" fill="#06b6d4"/>
      <circle cx="38" cy="48" r="2" fill="#fff"/>
      <circle cx="64" cy="48" r="2" fill="#fff"/>
      <!-- Beak -->
      <polygon points="50,60 46,67 54,67" fill="#f59e0b"/>
      <!-- Feathers -->
      <path d="M40,73 Q50,76 60,73" stroke="#047857" stroke-width="2" fill="none"/>
      <path d="M42,80 Q50,83 58,80" stroke="#047857" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'avatar-6',
    name: 'Rockstar Bear',
    bg: ['#4b1248', '#f0c27b'],
    content: `
      <!-- Ears -->
      <circle cx="28" cy="30" r="11" fill="#78350f"/>
      <circle cx="28" cy="30" r="6" fill="#fbbf24"/>
      <circle cx="72" cy="30" r="11" fill="#78350f"/>
      <circle cx="72" cy="30" r="6" fill="#fbbf24"/>
      <!-- Head -->
      <circle cx="50" cy="56" r="28" fill="#92400e"/>
      <!-- Muzzle -->
      <ellipse cx="50" cy="65" rx="14" ry="10" fill="#fef3c7"/>
      <!-- Nose & Mouth -->
      <ellipse cx="50" cy="61" rx="5" ry="3.5" fill="#1e1b4b"/>
      <path d="M50,64.5 L50,69 M46,69 Q50,73 54,69" stroke="#1e1b4b" stroke-width="2" fill="none"/>
      <!-- Lightning Bolt Eye Makeup -->
      <polygon points="34,42 41,52 37,52 42,60 33,52 37,52" fill="#ef4444"/>
      <!-- Right eye -->
      <ellipse cx="62" cy="52" rx="4" ry="4" fill="#1e1b4b"/>
      <circle cx="63" cy="50" r="1.5" fill="#fff"/>
      <!-- Bandana -->
      <path d="M22,42 Q50,48 78,42 L74,36 Q50,42 26,36 Z" fill="#dc2626"/>
    `
  },
  {
    id: 'avatar-7',
    name: 'Magic Unicorn',
    bg: ['#8a2387', '#e94057'],
    content: `
      <!-- Horn -->
      <polygon points="50,8 44,32 56,32" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
      <line x1="46" y1="26" x2="54" y2="22" stroke="#fff" stroke-width="1.5"/>
      <line x1="47" y1="18" x2="53" y2="14" stroke="#fff" stroke-width="1.5"/>
      <!-- Head -->
      <path d="M30,36 Q50,30 70,36 Q74,68 64,80 Q50,84 36,80 Q26,68 30,36 Z" fill="#f8fafc"/>
      <!-- Mane -->
      <path d="M30,32 Q20,50 32,70" stroke="#ec4899" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M26,38 Q16,56 28,74" stroke="#8b5cf6" stroke-width="5" fill="none" stroke-linecap="round"/>
      <!-- Eyes with lashes -->
      <path d="M38,55 Q44,48 50,55" stroke="#4c1d95" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <line x1="39" y1="52" x2="36" y2="48" stroke="#4c1d95" stroke-width="1.5"/>
      <line x1="49" y1="52" x2="52" y2="48" stroke="#4c1d95" stroke-width="1.5"/>
      <!-- Star on cheek -->
      <polygon points="58,62 59,64 61,64 60,66 60,68 58,67 56,68 56,66 55,64 57,64" fill="#fbbf24"/>
      <!-- Muzzle -->
      <circle cx="50" cy="72" r="2" fill="#f472b6"/>
    `
  },
  {
    id: 'avatar-8',
    name: 'Dino Dude',
    bg: ['#00b09b', '#96c93d'],
    content: `
      <!-- Spikes -->
      <polygon points="34,22 42,32 30,34" fill="#059669"/>
      <polygon points="46,18 54,28 42,30" fill="#059669"/>
      <polygon points="58,22 66,32 54,34" fill="#059669"/>
      <!-- Head -->
      <path d="M26,42 Q50,30 74,42 Q78,72 50,82 Q22,72 26,42 Z" fill="#10b981"/>
      <!-- Big Googly Eyes -->
      <circle cx="38" cy="48" r="8" fill="#fff"/>
      <circle cx="40" cy="48" r="4" fill="#064e3b"/>
      <circle cx="62" cy="48" r="8" fill="#fff"/>
      <circle cx="60" cy="48" r="4" fill="#064e3b"/>
      <!-- Nostrils -->
      <ellipse cx="44" cy="62" rx="2" ry="3" fill="#047857"/>
      <ellipse cx="56" cy="62" rx="2" ry="3" fill="#047857"/>
      <!-- Grin with teeth -->
      <path d="M34,68 Q50,78 66,68" stroke="#047857" stroke-width="2.5" fill="none"/>
      <polygon points="42,69 45,74 48,70" fill="#fff"/>
      <polygon points="52,70 55,74 58,69" fill="#fff"/>
    `
  },
  {
    id: 'avatar-9',
    name: 'Lucky Dog',
    bg: ['#f12711', '#f5af19'],
    content: `
      <!-- Floppy Ears -->
      <ellipse cx="22" cy="46" rx="8" ry="18" transform="rotate(-15 22 46)" fill="#78350f"/>
      <ellipse cx="78" cy="46" rx="8" ry="18" transform="rotate(15 78 46)" fill="#78350f"/>
      <!-- Head -->
      <circle cx="50" cy="54" r="26" fill="#fef3c7"/>
      <!-- Eye patch -->
      <circle cx="38" cy="50" r="10" fill="#d97706"/>
      <!-- Eyes -->
      <circle cx="38" cy="50" r="4" fill="#1c1917"/>
      <circle cx="39" cy="48" r="1.5" fill="#fff"/>
      <circle cx="62" cy="50" r="4" fill="#1c1917"/>
      <circle cx="63" cy="48" r="1.5" fill="#fff"/>
      <!-- Nose & Mouth -->
      <polygon points="50,62 44,56 56,56" fill="#1c1917"/>
      <path d="M46,65 Q50,69 54,65" stroke="#1c1917" stroke-width="2" fill="none"/>
      <!-- Tongue out -->
      <path d="M48,67 Q50,75 54,72 Q54,66 50,66" fill="#ef4444"/>
    `
  },
  {
    id: 'avatar-10',
    name: 'Groovy Frog',
    bg: ['#11998e', '#38ef7d'],
    content: `
      <!-- Big top eyes -->
      <circle cx="32" cy="34" r="12" fill="#22c55e"/>
      <circle cx="32" cy="34" r="8" fill="#fff"/>
      <circle cx="34" cy="34" r="4" fill="#14532d"/>
      <circle cx="68" cy="34" r="12" fill="#22c55e"/>
      <circle cx="68" cy="34" r="8" fill="#fff"/>
      <circle cx="66" cy="34" r="4" fill="#14532d"/>
      <!-- Head -->
      <ellipse cx="50" cy="58" rx="30" ry="22" fill="#4ade80"/>
      <!-- Rosy cheeks -->
      <circle cx="28" cy="58" r="5" fill="#f43f5e" opacity="0.6"/>
      <circle cx="72" cy="58" r="5" fill="#f43f5e" opacity="0.6"/>
      <!-- Cute smile -->
      <path d="M34,60 Q50,74 66,60" stroke="#166534" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Flower on head -->
      <circle cx="50" cy="24" r="4" fill="#fbbf24"/>
      <circle cx="46" cy="22" r="3" fill="#f472b6"/>
      <circle cx="54" cy="22" r="3" fill="#f472b6"/>
      <circle cx="50" cy="18" r="3" fill="#f472b6"/>
    `
  },
  {
    id: 'avatar-11',
    name: 'Fire Dragon',
    bg: ['#b224ef', '#7579ff'],
    content: `
      <!-- Horns -->
      <path d="M30,30 Q22,14 16,16 Q24,24 28,34" fill="#f59e0b"/>
      <path d="M70,30 Q78,14 84,16 Q76,24 72,34" fill="#f59e0b"/>
      <!-- Head -->
      <path d="M26,38 Q50,28 74,38 Q82,72 50,84 Q18,72 26,38 Z" fill="#8b5cf6"/>
      <!-- Snout -->
      <path d="M36,54 Q50,50 64,54 Q66,74 50,76 Q34,74 36,54 Z" fill="#a78bfa"/>
      <!-- Slit eyes -->
      <ellipse cx="36" cy="46" rx="5" ry="7" fill="#fde047"/>
      <line x1="36" y1="40" x2="36" y2="52" stroke="#4c1d95" stroke-width="2.5"/>
      <ellipse cx="64" cy="46" rx="5" ry="7" fill="#fde047"/>
      <line x1="64" y1="40" x2="64" y2="52" stroke="#4c1d95" stroke-width="2.5"/>
      <!-- Smoke puff -->
      <circle cx="44" cy="64" r="2" fill="#5b21b6"/>
      <circle cx="56" cy="64" r="2" fill="#5b21b6"/>
      <path d="M50,78 Q52,86 48,90" stroke="#f97316" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'avatar-12',
    name: 'Robo Buddy',
    bg: ['#2b5876', '#4e4376'],
    content: `
      <!-- Antenna -->
      <line x1="50" y1="14" x2="50" y2="28" stroke="#94a3b8" stroke-width="3"/>
      <circle cx="50" cy="12" r="5" fill="#ef4444"/>
      <!-- Head block -->
      <rect x="24" y="28" width="52" height="46" rx="10" fill="#475569" stroke="#64748b" stroke-width="2"/>
      <!-- Screen/Visor -->
      <rect x="30" y="36" width="40" height="22" rx="6" fill="#0f172a"/>
      <!-- Digital Eyes -->
      <circle cx="40" cy="47" r="4" fill="#00f0ff"/>
      <circle cx="60" cy="47" r="4" fill="#00f0ff"/>
      <!-- Mouth dial -->
      <line x1="36" y1="64" x2="64" y2="64" stroke="#22c55e" stroke-width="2" stroke-dasharray="3,3"/>
      <!-- Ear bolts -->
      <rect x="18" y="44" width="6" height="14" rx="2" fill="#94a3b8"/>
      <rect x="76" y="44" width="6" height="14" rx="2" fill="#94a3b8"/>
    `
  },
  {
    id: 'avatar-13',
    name: 'Disco Koala',
    bg: ['#ff0844', '#ffb199'],
    content: `
      <!-- Fluffy ears -->
      <circle cx="24" cy="36" r="14" fill="#94a3b8"/>
      <circle cx="24" cy="36" r="8" fill="#f1f5f9"/>
      <circle cx="76" cy="36" r="14" fill="#94a3b8"/>
      <circle cx="76" cy="36" r="8" fill="#f1f5f9"/>
      <!-- Head -->
      <ellipse cx="50" cy="54" rx="28" ry="24" fill="#cbd5e1"/>
      <!-- Big oval dark nose -->
      <ellipse cx="50" cy="58" rx="8" ry="12" fill="#1e293b"/>
      <ellipse cx="48" cy="54" rx="2.5" ry="4" fill="#475569"/>
      <!-- Starry Eyes -->
      <polygon points="36,44 38,48 42,48 39,51 40,55 36,52 32,55 33,51 30,48 34,48" fill="#f59e0b"/>
      <polygon points="64,44 66,48 70,48 67,51 68,55 64,52 60,55 61,51 58,48 62,48" fill="#f59e0b"/>
      <!-- Smile -->
      <path d="M42,72 Q50,76 58,72" stroke="#334155" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'avatar-14',
    name: 'Pixel Ghost',
    bg: ['#3023ae', '#c86dd7'],
    content: `
      <!-- Ghost body -->
      <path d="M26,50 Q26,24 50,24 Q74,24 74,50 L74,76 L66,70 L58,76 L50,70 L42,76 L34,70 L26,76 Z" fill="#f8fafc"/>
      <!-- Eyes -->
      <circle cx="40" cy="44" r="5" fill="#1e1b4b"/>
      <circle cx="42" cy="42" r="2" fill="#fff"/>
      <circle cx="60" cy="44" r="5" fill="#1e1b4b"/>
      <circle cx="62" cy="42" r="2" fill="#fff"/>
      <!-- Rosy blush -->
      <circle cx="34" cy="52" r="4" fill="#f43f5e" opacity="0.4"/>
      <circle cx="66" cy="52" r="4" fill="#f43f5e" opacity="0.4"/>
      <!-- O mouth -->
      <ellipse cx="50" cy="54" rx="3" ry="5" fill="#1e1b4b"/>
    `
  },
  {
    id: 'avatar-15',
    name: 'Chill Penguin',
    bg: ['#2193b0', '#6dd5ed'],
    content: `
      <!-- Body/Head -->
      <ellipse cx="50" cy="52" rx="26" ry="30" fill="#0f172a"/>
      <!-- White belly -->
      <ellipse cx="50" cy="58" rx="18" ry="22" fill="#f8fafc"/>
      <!-- Eyes -->
      <circle cx="42" cy="46" r="3.5" fill="#0f172a"/>
      <circle cx="43" cy="44" r="1" fill="#fff"/>
      <circle cx="58" cy="46" r="3.5" fill="#0f172a"/>
      <circle cx="59" cy="44" r="1" fill="#fff"/>
      <!-- Beak -->
      <polygon points="50,56 43,50 57,50" fill="#f59e0b"/>
      <!-- Headphone -->
      <path d="M24,48 A26,26 0 0,1 76,48" stroke="#ec4899" stroke-width="4" fill="none"/>
      <rect x="20" y="44" width="7" height="12" rx="3" fill="#ec4899"/>
      <rect x="73" y="44" width="7" height="12" rx="3" fill="#ec4899"/>
    `
  },
  {
    id: 'avatar-16',
    name: 'Gamer Bunny',
    bg: ['#ff416c', '#ff4b2b'],
    content: `
      <!-- Long ears -->
      <ellipse cx="36" cy="24" rx="7" ry="18" transform="rotate(-10 36 24)" fill="#fff"/>
      <ellipse cx="36" cy="24" rx="4" ry="13" transform="rotate(-10 36 24)" fill="#f472b6"/>
      <ellipse cx="64" cy="24" rx="7" ry="18" transform="rotate(10 64 24)" fill="#fff"/>
      <ellipse cx="64" cy="24" rx="4" ry="13" transform="rotate(10 64 24)" fill="#f472b6"/>
      <!-- Face -->
      <circle cx="50" cy="56" r="26" fill="#fff"/>
      <!-- Heart nose -->
      <polygon points="50,62 46,58 54,58" fill="#ec4899"/>
      <!-- Big anime eyes -->
      <ellipse cx="38" cy="50" rx="5" ry="7" fill="#831843"/>
      <circle cx="39" cy="48" r="2" fill="#fff"/>
      <ellipse cx="62" cy="50" rx="5" ry="7" fill="#831843"/>
      <circle cx="63" cy="48" r="2" fill="#fff"/>
      <!-- Mouth -->
      <path d="M46,65 Q50,68 54,65" stroke="#831843" stroke-width="1.5" fill="none"/>
      <!-- Gaming headset -->
      <path d="M24,52 A26,26 0 0,1 76,52" stroke="#3b82f6" stroke-width="4" fill="none"/>
      <rect x="20" y="48" width="7" height="12" rx="3" fill="#3b82f6"/>
      <rect x="73" y="48" width="7" height="12" rx="3" fill="#3b82f6"/>
      <line x1="26" y1="58" x2="36" y2="64" stroke="#3b82f6" stroke-width="2"/>
      <circle cx="37" cy="65" r="2" fill="#ef4444"/>
    `
  }
];

avatars.forEach(av => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="grad-${av.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${av.bg[0]}" />
      <stop offset="100%" stop-color="${av.bg[1]}" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#grad-${av.id})" />
  ${av.content}
</svg>`;
  fs.writeFileSync(path.join(avatarDir, `${av.id}.svg`), svg.trim());
});

console.log(`Generated ${avatars.length} avatar SVGs in assets/avatars/`);

// Generate simple WAV files so assets/sounds has authentic playable audio files
function createWavFile(filename, durationSec, getSample) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2; // 16-bit mono
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // AudioFormat (PCM)
  buffer.writeUInt16LE(1, 22);  // NumChannels (Mono)
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
  buffer.writeUInt16LE(2, 32);  // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, getSample(t, durationSec)));
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  fs.writeFileSync(path.join(soundDir, filename), buffer);
}

// 1. click.wav
createWavFile('click.wav', 0.08, (t) => {
  const env = Math.exp(-t * 50);
  return Math.sin(2 * Math.PI * 800 * t) * env;
});

// 2. tick.wav
createWavFile('tick.wav', 0.05, (t) => {
  const env = Math.exp(-t * 80);
  return (Math.sin(2 * Math.PI * 1200 * t) + Math.sin(2 * Math.PI * 1800 * t)) * 0.5 * env;
});

// 3. flip.wav
createWavFile('flip.wav', 0.15, (t) => {
  const env = Math.exp(-t * 20);
  const freq = 300 + t * 400;
  return Math.sin(2 * Math.PI * freq * t) * env;
});

// 4. success.wav (Major chord chime)
createWavFile('success.wav', 0.4, (t) => {
  const env = Math.exp(-t * 8);
  return (Math.sin(2 * Math.PI * 523.25 * t) + Math.sin(2 * Math.PI * 659.25 * t) + Math.sin(2 * Math.PI * 783.99 * t)) / 3 * env;
});

// 5. buzzer.wav (Dissonant buzz for sacrifice / life loss)
createWavFile('buzzer.wav', 0.3, (t) => {
  const env = Math.exp(-t * 6);
  return (Math.sin(2 * Math.PI * 130 * t) + Math.sin(2 * Math.PI * 138 * t)) * 0.5 * env;
});

// 6. fanfare.wav (Celebratory arpeggio)
createWavFile('fanfare.wav', 0.6, (t) => {
  const env = Math.exp(-t * 4);
  let freq = 440;
  if (t > 0.15 && t <= 0.3) freq = 554.37;
  else if (t > 0.3 && t <= 0.45) freq = 659.25;
  else if (t > 0.45) freq = 880;
  return Math.sin(2 * Math.PI * freq * t) * env;
});

console.log('Generated WAV audio files in assets/sounds/');
