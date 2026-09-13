window.KKA = window.KKA || {};

KKA.config = {
  // Supabase — isi dengan kredensial proyek Anda
  SUPABASE_URL: 'https://peocwwlbvqjgpnnmkqmr.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlb2N3d2xidnFqZ3Bubm1rcW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyOTA1OTIsImV4cCI6MjEwNDg2NjU5Mn0.ZWNYVP8xIyzRcfZLjDVAdnw1g8JJc1X1kTrkGT-EoPg',

  XP: {
    CORRECT_BAB1: 15,
    MINIGAME_COMPLETE: 25,
    BOT_FINISH: 30,
    PUZZLE_CORRECT: 20,
    COMBO_BONUS: 10,
    HINT_PENALTY: -5
  },

  LEVELS: [
    { name: 'Pemula', emoji: '🌱', minXP: 0 },
    { name: 'Penjelajah', emoji: '🧭', minXP: 100 },
    { name: 'Coder Muda', emoji: '💻', minXP: 250 },
    { name: 'Hacker Hebat', emoji: '⚡', minXP: 500 },
    { name: 'Mastermind', emoji: '👑', minXP: 800 }
  ],

  BADGES: [
    { id: 'digital-guardian', name: 'Digital Guardian', emoji: '🛡️', desc: 'Selesaikan semua skenario Bab 1', bab: 1 },
    { id: 'stack-master', name: 'Stack Master', emoji: '📚', desc: 'Selesaikan minigame Stack', bab: 2 },
    { id: 'queue-pro', name: 'Queue Pro', emoji: '🎟️', desc: 'Selesaikan minigame Queue', bab: 2 },
    { id: 'array-wizard', name: 'Array Wizard', emoji: '📊', desc: 'Selesaikan quiz Array', bab: 2 },
    { id: 'linear-detective', name: 'Linear Detective', emoji: '🔍', desc: 'Selesaikan Linear Search', bab: 2 },
    { id: 'binary-ninja', name: 'Binary Ninja', emoji: '⚡', desc: 'Selesaikan Binary Search', bab: 2 },
    { id: 'bubble-champion', name: 'Bubble Champion', emoji: '🫧', desc: 'Selesaikan Bubble Sort', bab: 2 },
    { id: 'selection-sniper', name: 'Selection Sniper', emoji: '🎯', desc: 'Selesaikan Selection Sort', bab: 2 },
    { id: 'insertion-ace', name: 'Insertion Ace', emoji: '🃏', desc: 'Selesaikan Insertion Sort', bab: 2 },
    { id: 'bot-commander', name: 'Bot Commander', emoji: '🤖', desc: 'Selesaikan Bot Navigator', bab: 3 },
    { id: 'python-coder', name: 'Python Coder', emoji: '🐍', desc: 'Selesaikan semua puzzle Python', bab: 4 },
    { id: 'kka-legend', name: 'KKA Legend', emoji: '👑', desc: 'Raih semua badge lainnya', bab: 0 }
  ]
};
