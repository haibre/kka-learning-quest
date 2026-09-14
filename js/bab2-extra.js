window.KKA = window.KKA || {};

(function () {
  const questionGame = function (config) {
    return {
      questions: config.questions,
      index: 0,
      score: 0,
      answered: false,
      init() {
        this.index = 0;
        this.score = 0;
        this.answered = false;
        this.render();
      },
      answer(choice) {
        if (this.answered) return;
        this.answered = true;
        const question = this.questions[this.index];
        const buttons = document.querySelectorAll('#' + config.content + ' .game-option');
        buttons.forEach(button => { button.disabled = true; });
        if (choice === question.answer) {
          this.score += 1;
          if (KKA.audio) KKA.audio.playCorrect();
          if (KKA.state) KKA.state.incrementCombo();
          if (KKA.ui) KKA.ui.showNotification('Benar! +15 XP', 'success');
          if (KKA.state) KKA.state.addXP(15);
        } else {
          if (KKA.audio) KKA.audio.playWrong();
          if (KKA.state) KKA.state.resetCombo();
          if (KKA.ui) KKA.ui.showNotification('Belum tepat. Pelajari penjelasannya.', 'error');
        }
        const feedback = document.getElementById(config.content + '-feedback');
        if (feedback) {
          feedback.innerHTML = (choice === question.answer ? '✅ Tepat! ' : '❌ Belum tepat. ') + question.explanation;
          feedback.style.color = choice === question.answer ? 'var(--secondary)' : 'var(--danger)';
        }
        const nextButton = document.getElementById(config.content + '-next');
        if (nextButton) {
          nextButton.disabled = false;
          nextButton.focus();
        }
      },
      next() {
        if (!this.answered) return;
        this.index += 1;
        if (this.index >= this.questions.length) {
          KKA.bab2.showCompletion(config.content, config.name, config.badge, config.activity);
        } else {
          this.answered = false;
          this.render();
        }
      },
      render() {
        const container = document.getElementById(config.content);
        if (!container) return;
        const question = this.questions[this.index];
        container.innerHTML = '<div class="game-panel" style="max-width:900px;margin:0 auto;">' +
          '<p style="color:var(--text-secondary);">Soal ' + (this.index + 1) + ' dari ' + this.questions.length + ' | Skor ' + this.score + '</p>' +
          '<h3>' + question.title + '</h3>' +
          '<p>' + question.text + '</p>' +
          '<div class="game-options">' + question.options.map((option, index) => '<button class="btn btn-outline game-option" onclick="KKA.bab2.' + config.key + '.answer(' + index + ')">' + String.fromCharCode(65 + index) + '. ' + option + '</button>').join('') + '</div>' +
          '<p id="' + config.content + '-feedback" style="min-height:48px;margin-top:16px;"></p>' +
          '<button id="' + config.content + '-next" class="btn btn-primary" style="margin-top:8px;" onclick="KKA.bab2.' + config.key + '.next()" disabled>Lanjut →</button>' +
          '<br>' +
          '<button class="btn btn-sm btn-outline" onclick="KKA.bab2.hint(-5)">💡 Hint (-5 XP)</button>' +
          '</div>';
      }
    };
  };

  KKA.bab2.bughunter = questionGame({
    key: 'bughunter', content: 'bughunter-content', name: 'Bug Hunter', badge: 'bug-hunter', activity: 'bughunter',
    questions: [
      { title: 'Visual Debugging', text: 'Flowchart memiliki cabang "nilai >= 75" yang menuju ke "Tidak Lulus". Apa perbaikannya?', options: ['Tukar arah cabang benar dan salah', 'Hapus blok Mulai', 'Ubah menjadi perulangan'], answer: 0, explanation: 'Kondisi nilai minimal 75 harus menuju status Lulus.' },
      { title: 'Code Tracing', text: 'Jika x = 3 lalu x = x + 4, berapa nilai akhir x?', options: ['1', '7', '12'], answer: 1, explanation: 'Nilai 3 ditambah 4 menghasilkan 7.' },
      { title: 'Infinite Loop', text: 'Baris mana yang dapat membuat while berjalan tanpa henti?', options: ['while i < 5:', 'i = i + 1', 'print(i)'], answer: 0, explanation: 'Tanpa perubahan i di dalam loop, kondisi dapat terus bernilai benar.' },
      { title: 'Logic Error', text: 'Program harus menampilkan "Genap" jika angka habis dibagi 2. Kondisi yang benar adalah...', options: ['angka % 2 == 0', 'angka / 2 == 0', 'angka % 2 == 1'], answer: 0, explanation: 'Sisa bagi 2 sama dengan 0 berarti angka genap.' },
      { title: 'Syntax Error', text: 'Apa yang kurang dari kode: if nilai > 80 print("A")?', options: ['Titik dua setelah kondisi', 'Tanda tambah', 'Kurung siku'], answer: 0, explanation: 'Blok if Python membutuhkan tanda titik dua.' },
      { title: 'Dry Run', text: 'Urutan output dari for i in [1, 2, 3]: print(i) adalah...', options: ['3, 2, 1', '1, 2, 3', '1, 3, 2'], answer: 1, explanation: 'Perulangan membaca elemen list dari kiri ke kanan.' }
    ]
  });

  KKA.bab2.circuit = questionGame({
    key: 'circuit', content: 'circuit-content', name: 'Circuit Gates', badge: 'circuit-master', activity: 'circuit',
    questions: [
      { title: 'AND Gate', text: 'A = 1 dan B = 1. Output AND adalah...', options: ['0', '1', 'Tidak tentu'], answer: 1, explanation: 'AND bernilai 1 hanya jika semua input bernilai 1.' },
      { title: 'OR Gate', text: 'A = 0 dan B = 1. Output OR adalah...', options: ['0', '1', '2'], answer: 1, explanation: 'OR bernilai 1 jika minimal satu input bernilai 1.' },
      { title: 'NOT Gate', text: 'Apa output NOT dari sinyal 0?', options: ['0', '1', '2'], answer: 1, explanation: 'NOT membalik sinyal 0 menjadi 1.' },
      { title: 'XOR Gate', text: 'Kapan XOR menghasilkan 1?', options: ['Kedua input sama', 'Kedua input berbeda', 'Semua input 1'], answer: 1, explanation: 'XOR aktif ketika tepat satu input bernilai 1.' },
      { title: 'Kombinasi Gate', text: 'A = 1, B = 0. Gate yang menghasilkan 1 dari A dan B adalah...', options: ['AND', 'OR', 'NOT A dan NOT B'], answer: 1, explanation: 'OR menghasilkan 1 karena salah satu input aktif.' },
      { title: 'Truth Table', text: 'Untuk AND, baris output 0 terjadi ketika...', options: ['Ada minimal satu input 0', 'Semua input 1', 'Input selalu berbeda'], answer: 0, explanation: 'Satu input 0 sudah cukup membuat AND menjadi 0.' }
    ]
  });

  KKA.bab2.prompt = questionGame({
    key: 'prompt', content: 'prompt-content', name: 'AI Prompt Master', badge: 'prompt-master', activity: 'prompt',
    questions: [
      { title: 'Constraint Prompting', text: 'Prompt mana paling jelas untuk meminta ringkasan?', options: ['Ringkas teks ini maksimal 3 kalimat dan gunakan bahasa sederhana.', 'Jelaskan semuanya.', 'Buat bagus.'], answer: 0, explanation: 'Prompt yang baik menyebutkan tugas, batasan, dan gaya output.' },
      { title: 'Spot the Bias', text: 'Kalimat mana yang perlu dihindari karena bias?', options: ['Bandingkan dua pilihan berdasarkan data.', 'Anak laki-laki pasti lebih jago teknologi.', 'Jelaskan kelebihan dan kekurangannya.'], answer: 1, explanation: 'Pernyataan tersebut menggeneralisasi kemampuan berdasarkan gender.' },
      { title: 'Role & Context', text: 'Tambahan apa yang membuat prompt tutor lebih terarah?', options: ['Kamu adalah tutor kelas X; jelaskan dengan contoh.', 'Jawab secepatnya.', 'Pakai kata sebanyak mungkin.'], answer: 0, explanation: 'Peran dan konteks membantu AI menyesuaikan jawaban.' },
      { title: 'Output Format', text: 'Jika membutuhkan langkah-langkah, instruksi format yang tepat adalah...', options: ['Tulis dalam daftar bernomor.', 'Jawab bebas.', 'Jangan gunakan struktur.'], answer: 0, explanation: 'Format eksplisit membuat hasil lebih mudah dipakai.' },
      { title: 'Relevansi', text: 'Prompt mana yang mencegah informasi tidak relevan?', options: ['Jawab hanya berdasarkan data pada paragraf berikut.', 'Tambahkan semua hal yang kamu tahu.', 'Buat jawaban sepanjang mungkin.'], answer: 0, explanation: 'Batas sumber menjaga jawaban tetap relevan.' },
      { title: 'Evaluasi Jawaban', text: 'Langkah aman setelah menerima jawaban AI adalah...', options: ['Periksa fakta dan sumber penting.', 'Langsung salin tanpa membaca.', 'Anggap semua jawaban pasti benar.'], answer: 0, explanation: 'AI dapat keliru, jadi hasilnya tetap perlu diverifikasi.' }
    ]
  });
}());
