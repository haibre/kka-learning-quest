# 🚀 KKA Learning Quest — Kelas X

Media pembelajaran interaktif berbasis web untuk mata pelajaran **Koding & Kecerdasan Artifisial (KKA) Kelas X**.

## 📋 Fitur

- **Bab 1: Literasi Digital** — Game Swipe Safety (15 skenario keamanan digital)
- **Bab 2: Struktur Data & Algoritma** — 11 Minigame interaktif dengan ronde dan soal acak:
  - Stack (Push/Pop), Queue (Enqueue/Dequeue), Array Index Quiz
  - Linear Search, Binary Search
  - Bubble Sort, Selection Sort, Insertion Sort
  - Bug Hunter Detective, Circuit & Gate Battles, AI Prompt Master
- **Bab 3: Berpikir Komputasional** — Bot Navigator (3 level labirin)
- **Bab 4: Dasar Pemrograman** — Fill Python Code (6 puzzle)
- **Sistem Gamifikasi**: XP, Level, 15 Badge, Combo Multiplier
- **Dashboard Guru**: Monitoring progress semua siswa
- **Reset Progres Siswa**: Guru dapat menghapus XP, badge, dan progres game siswa dari tabel dashboard
- **Dark/Light Mode**: Tema bisa diubah
- **Responsive**: Bisa diakses dari HP, tablet, dan desktop

## 🛠️ Cara Setup

### Tanpa Backend (Mode Offline)
Cukup buka `index.html` di browser. Data disimpan di localStorage browser.

### Dengan Backend (Supabase)

1. **Buat project Supabase** di [supabase.com](https://supabase.com)
2. **Jalankan SQL** dari file `supabase-setup.sql` di SQL Editor Supabase
3. **Aktifkan Email Auth** di Supabase Dashboard → Authentication → Providers
4. **Salin credentials** (URL + Anon Key) dari Settings → API
5. **Update `js/config.js`**:
   ```javascript
   KKA.config.SUPABASE_URL = 'https://your-project.supabase.co';
   KKA.config.SUPABASE_ANON_KEY = 'your-anon-key';
   ```
6. **Buat akun guru**:
   - Register via aplikasi seperti biasa
   - Di Supabase SQL Editor, jalankan:
     ```sql
     UPDATE public.profiles SET role = 'guru' WHERE nama = 'Nama Guru';
     ```

### Deploy ke Vercel

1. Push project ke GitHub
2. Import repository di [vercel.com](https://vercel.com)
3. Deploy otomatis! 🚀
4. Akses: `https://your-project.vercel.app`
5. Dashboard guru: `https://your-project.vercel.app/guru`

## 📁 Struktur File

```
kka-learning-quest/
├── index.html          # Aplikasi utama siswa
├── guru.html           # Dashboard monitoring guru
├── js/
│   ├── config.js       # Konfigurasi Supabase & game
│   ├── audio.js        # Sound effects (Web Audio API)
│   ├── state.js        # State management & persistence
│   ├── auth.js         # Autentikasi Supabase
│   ├── ui.js           # Navigasi & UI utilities
│   ├── bab1.js         # Bab 1: Literasi Digital
│   ├── bab2.js         # Bab 2: Struktur Data & Algoritma
│   ├── bab3.js         # Bab 3: Berpikir Komputasional
│   ├── bab4.js         # Bab 4: Dasar Pemrograman
│   └── app.js          # Entry point aplikasi
├── vercel.json         # Konfigurasi Vercel
├── supabase-setup.sql  # Script setup database
└── README.md           # Dokumentasi ini
```

## 🏆 Sistem Badge

| Badge | Syarat |
|-------|--------|
| 🛡️ Digital Guardian | Selesaikan Bab 1 (min. 8 benar) |
| 📚 Stack Master | Selesaikan minigame Stack |
| 🎟️ Queue Pro | Selesaikan minigame Queue |
| 📊 Array Wizard | Selesaikan quiz Array |
| 🔍 Linear Detective | Selesaikan Linear Search |
| ⚡ Binary Ninja | Selesaikan Binary Search |
| 🫧 Bubble Champion | Selesaikan Bubble Sort |
| 🎯 Selection Sniper | Selesaikan Selection Sort |
| 🃏 Insertion Ace | Selesaikan Insertion Sort |
| 🤖 Bot Commander | Selesaikan Bot Navigator |
| 🐍 Python Coder | Selesaikan Bab 4 (min. 4 benar) |
| 👑 KKA Legend | Raih semua badge di atas |

## 📝 Lisensi

Dibuat untuk keperluan pendidikan KKA Kelas X.
