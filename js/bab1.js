window.KKA = window.KKA || {};

KKA.bab1 = {
  scenarios: [
    {
      text: 'Kamu menerima email dari "bank" yang meminta untuk mengklik link dan memasukkan data kartu kredit. Apakah kamu akan mengikutinya?',
      answer: 'bahaya',
      explanation: '🚨 Ini adalah PHISHING! Bank resmi tidak pernah meminta data kartu kredit via email. Selalu akses website bank langsung dari browser.',
      category: 'Phishing'
    },
    {
      text: 'Kamu menggunakan password yang berbeda dan kuat untuk setiap akun online yang kamu miliki.',
      answer: 'aman',
      explanation: '✅ Bagus! Menggunakan password unik untuk setiap akun mencegah efek domino jika satu akun diretas.',
      category: 'Password'
    },
    {
      text: 'Temanmu meminta foto KTP untuk "membantu" mendaftar pinjaman online. Kamu mengirimkannya via WhatsApp.',
      answer: 'bahaya',
      explanation: '🚨 BAHAYA! Foto KTP bisa disalahgunakan untuk pinjaman ilegal atau penipuan identitas. Jangan pernah share dokumen pribadi secara digital.',
      category: 'Privasi Data'
    },
    {
      text: 'Kamu menerima permintaan pertemanan di media sosial dari seseorang yang tidak kamu kenal. Kamu langsung menerimanya.',
      answer: 'bahaya',
      explanation: '🚨 Hati-hati! Akun asing bisa jadi akun palsu (catfish) yang bertujuan menipu atau mengumpulkan informasi pribadimu.',
      category: 'Media Sosial'
    },
    {
      text: 'Kamu mengaktifkan Two-Factor Authentication (2FA) di semua akun penting seperti email dan media sosial.',
      answer: 'aman',
      explanation: '✅ Excellent! 2FA menambahkan lapisan keamanan ekstra. Meskipun password bocor, akunmu tetap terlindungi.',
      category: 'Keamanan Akun'
    },
    {
      text: 'Kamu menggunakan WiFi publik gratis di kafe untuk melakukan internet banking dan transfer uang.',
      answer: 'bahaya',
      explanation: '🚨 WiFi publik sangat rentan terhadap penyadapan (man-in-the-middle attack). Gunakan data seluler atau VPN untuk transaksi keuangan.',
      category: 'Jaringan'
    },
    {
      text: 'Kamu selalu memperbarui (update) sistem operasi dan aplikasi di HP dan laptopmu secara rutin.',
      answer: 'aman',
      explanation: '✅ Update rutin menutup celah keamanan (vulnerability) yang bisa dieksploitasi oleh hacker.',
      category: 'Keamanan Perangkat'
    },
    {
      text: 'Seseorang menelepon mengaku dari bank dan meminta kode OTP yang baru saja kamu terima via SMS.',
      answer: 'bahaya',
      explanation: '🚨 JANGAN PERNAH berikan kode OTP kepada siapapun! OTP bersifat rahasia dan hanya untukmu. Bank resmi tidak pernah meminta OTP.',
      category: 'OTP & Penipuan'
    },
    {
      text: 'Sebelum login di website, kamu selalu memeriksa apakah URL-nya benar dan menggunakan HTTPS (gembok hijau).',
      answer: 'aman',
      explanation: '✅ Memeriksa URL dan HTTPS melindungi dari website palsu (phishing). Perhatikan juga ejaan domain!',
      category: 'Browsing Aman'
    },
    {
      text: 'Kamu men-download aplikasi berbayar secara gratis dari website tidak resmi karena "hemat".',
      answer: 'bahaya',
      explanation: '🚨 Aplikasi bajakan sering mengandung malware, spyware, atau virus. Selalu download dari Play Store/App Store resmi.',
      category: 'Download Aman'
    },
    {
      text: 'Kamu memeriksa izin aplikasi dan menolak akses kamera untuk aplikasi kalkulator.',
      answer: 'aman',
      explanation: '✅ Izin aplikasi harus sesuai kebutuhan. Kalkulator tidak membutuhkan akses kamera.',
      category: 'Izin Aplikasi'
    },
    {
      text: 'Kamu membagikan lokasi rumah secara real-time di media sosial publik.',
      answer: 'bahaya',
      explanation: '🚨 Lokasi real-time dapat membahayakan privasi dan keamanan fisikmu.',
      category: 'Privasi Data'
    },
    {
      text: 'Sebelum meneruskan berita mengejutkan, kamu membandingkannya dengan sumber tepercaya.',
      answer: 'aman',
      explanation: '✅ Verifikasi silang membantu mencegah penyebaran hoaks dan informasi palsu.',
      category: 'Literasi Informasi'
    },
    {
      text: 'Kamu memasukkan password akun utama di komputer umum lalu membiarkannya tersimpan.',
      answer: 'bahaya',
      explanation: '🚨 Komputer umum dapat menyimpan sesi atau terkena keylogger. Selalu logout dan jangan simpan password.',
      category: 'Keamanan Perangkat'
    },
    {
      text: 'Kamu melaporkan akun yang melakukan cyberbullying dan menyimpan bukti percakapannya.',
      answer: 'aman',
      explanation: '✅ Menyimpan bukti dan melapor melalui kanal resmi adalah langkah tepat menghadapi cyberbullying.',
      category: 'Etika Digital'
    }
  ],
  currentIndex: 0,
  correctCount: 0,
  answered: false,
  
  init() {
    KKA.state.data.bab1.total = this.scenarios.length;
    this.currentIndex = 0;
    this.correctCount = KKA.state.data.bab1.correct || 0;
    
    if (KKA.state.data.bab1.completed) {
      this.showSummary();
      return;
    }
    
    this.currentIndex = KKA.state.data.bab1.scenarios.length;
    if (this.currentIndex >= this.scenarios.length) {
      this.showSummary();
      return;
    }
    this.showScenario();
  },
  
  showScenario() {
    const container = document.getElementById('bab1-content');
    const s = this.scenarios[this.currentIndex];
    container.innerHTML = `
      <style>
        .scenario-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 500px; margin: 0 auto; }
        .scenario-category { display: inline-block; background: #6366f1; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8em; font-weight: bold; margin-bottom: 15px; }
        .scenario-text { font-size: 1.2em; line-height: 1.5; margin-bottom: 20px; color: #1f2937; }
        .scenario-number { font-size: 0.9em; color: #6b7280; margin-bottom: 20px; }
        .scenario-buttons { display: flex; gap: 15px; justify-content: center; }
        .btn-safe { background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: transform 0.1s; }
        .btn-safe:hover { transform: scale(1.05); }
        .btn-danger-choice { background: #ef4444; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: transform 0.1s; }
        .btn-danger-choice:hover { transform: scale(1.05); }
        .result-badge { font-size: 1.5em; font-weight: bold; margin-bottom: 15px; }
        .result-correct { color: #10b981; }
        .result-wrong { color: #ef4444; }
        .explanation-text { font-size: 1.1em; line-height: 1.5; margin-bottom: 20px; color: #374151; }
        .summary-card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 500px; margin: 0 auto; }
        .summary-stars { font-size: 2em; margin: 15px 0; }
        .summary-score { font-size: 1.5em; font-weight: bold; margin-bottom: 15px; color: #1f2937; }
        .summary-buttons { display: flex; gap: 15px; justify-content: center; margin-top: 20px; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      </style>
      <div class="scenario-card" style="animation: slideIn 0.5s ease">
        <span class="scenario-category">${s.category}</span>
        <p class="scenario-text">${s.text}</p>
        <div class="scenario-number">Skenario ${this.currentIndex + 1} dari ${this.scenarios.length}</div>
        <div class="scenario-buttons">
          <button class="btn btn-safe" onclick="KKA.bab1.answer('aman')">✅ AMAN</button>
          <button class="btn btn-danger-choice" onclick="KKA.bab1.answer('bahaya')">❌ BAHAYA</button>
        </div>
      </div>
    `;
    const scoreElem = document.getElementById('bab1-score');
    if (scoreElem) scoreElem.textContent = `${this.correctCount}/${this.scenarios.length}`;
  },
  
  answer(choice) {
    if (this.answered) return;
    this.answered = true;
    const s = this.scenarios[this.currentIndex];
    const isCorrect = choice === s.answer;
    
    if (isCorrect) {
      this.correctCount++;
      KKA.state.addXP(KKA.config.XP.CORRECT_BAB1);
      KKA.state.incrementCombo();
      KKA.audio.playCorrect();
      KKA.ui.showNotification(`+${KKA.config.XP.CORRECT_BAB1} XP! Benar! 🎉`, 'xp');
    } else {
      KKA.state.resetCombo();
      KKA.audio.playWrong();
      KKA.ui.showNotification('Kurang tepat! Pelajari penjelasannya 📖', 'error');
    }
    
    KKA.state.data.bab1.scenarios.push({ index: this.currentIndex, correct: isCorrect });
    KKA.state.data.bab1.correct = this.correctCount;
    KKA.state.save();
    
    this.showExplanation(s, isCorrect);
  },
  
  showExplanation(scenario, isCorrect) {
    const container = document.getElementById('bab1-content');
    container.innerHTML = `
      <div class="scenario-card" style="animation: slideIn 0.4s ease">
        <div class="result-badge ${isCorrect ? 'result-correct' : 'result-wrong'}">
          ${isCorrect ? '✅ BENAR!' : '❌ SALAH!'}
        </div>
        <p class="explanation-text">${scenario.explanation}</p>
        <button class="btn btn-primary" style="background: #4f46e5; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;" onclick="KKA.bab1.next()">Lanjut →</button>
      </div>
    `;
    const scoreElem = document.getElementById('bab1-score');
    if (scoreElem) scoreElem.textContent = `${this.correctCount}/${this.scenarios.length}`;
  },
  
  next() {
    this.answered = false;
    this.currentIndex++;
    if (this.currentIndex >= this.scenarios.length) {
      KKA.state.data.bab1.completed = true;
      KKA.state.save();
      if (this.correctCount >= 8) {
        KKA.state.unlockBadge('digital-guardian');
      }
      this.showSummary();
    } else {
      this.showScenario();
    }
  },
  
  showSummary() {
    const container = document.getElementById('bab1-content');
    const percentage = Math.round((this.correctCount / this.scenarios.length) * 100);
    const stars = this.correctCount >= 9 ? '⭐⭐⭐' : this.correctCount >= 7 ? '⭐⭐' : '⭐';
    container.innerHTML = `
      <div class="summary-card" style="animation: scaleIn 0.5s ease">
        <h3>🎉 Bab 1 Selesai!</h3>
        <div class="summary-stars">${stars}</div>
        <div class="summary-score">${this.correctCount}/${this.scenarios.length} Benar (${percentage}%)</div>
        <p>${this.correctCount >= 8 ? '🛡️ Badge Digital Guardian diraih!' : 'Butuh minimal 8 benar untuk badge. Coba lagi!'}</p>
        <div class="summary-buttons">
          <button class="btn btn-primary" style="background: #4f46e5; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;" onclick="KKA.ui.showScreen('screen-dashboard')">Kembali ke Dashboard</button>
          ${this.correctCount < 8 ? `<button class="btn btn-outline" style="background: transparent; color: #4f46e5; border: 2px solid #4f46e5; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;" onclick="KKA.bab1.reset()">Coba Lagi 🔄</button>` : ''}
        </div>
      </div>
    `;
  },
  
  reset() {
    KKA.state.data.bab1 = { completed: false, correct: 0, total: this.scenarios.length, scenarios: [] };
    KKA.state.save();
    this.currentIndex = 0;
    this.correctCount = 0;
    this.answered = false;
    this.showScenario();
  }
};
