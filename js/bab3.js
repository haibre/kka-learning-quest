window.KKA = window.KKA || {};

KKA.bab3 = {
  levels: [
    {
      name: 'Level 1 — Jalan Lurus',
      grid: [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      bot: { row: 0, col: 0, dir: 'right' },
      finish: { row: 0, col: 3 },
      hint: 'Coba: Maju, Maju, Maju'
    },
    {
      name: 'Level 2 — Belok Sekali',
      grid: [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0],
        [0, 1, 1, 0]
      ],
      bot: { row: 0, col: 0, dir: 'right' },
      finish: { row: 2, col: 3 },
      hint: 'Perlu belok kanan di suatu titik!'
    },
    {
      name: 'Level 3 — Labirin Mini',
      grid: [
        [0, 1, 0, 0],
        [0, 1, 0, 1],
        [0, 0, 0, 1],
        [1, 1, 0, 0]
      ],
      bot: { row: 0, col: 0, dir: 'down' },
      finish: { row: 3, col: 3 },
      hint: 'Pecah rute menjadi beberapa bagian kecil, lalu cari jalan keluarnya.'
    }
  ],
  conceptQuestions: [
    {
      id: 'dekomposisi',
      title: 'Soal 1',
      question: 'Saat membuat aplikasi kantin, langkah mana yang paling membantu menyelesaikan masalah?',
      options: ['Membagi pekerjaan menjadi menu, pembayaran, dan laporan', 'Memilih warna tombol', 'Menghapus semua fitur'],
      answer: 0,
      explanation: 'Masalah besar lebih mudah dikerjakan jika dibagi menjadi bagian-bagian kecil.'
    },
    {
      id: 'pattern',
      title: 'Soal 2',
      question: 'Kamu melihat pelanggan selalu memilih menu yang sama setiap hari. Apa yang sedang kamu cari?',
      options: ['Pola kebiasaan pelanggan', 'Kesalahan ejaan', 'Ukuran layar'],
      answer: 0,
      explanation: 'Kamu sedang menemukan kebiasaan atau kesamaan yang berulang.'
    },
    {
      id: 'abstraksi',
      title: 'Soal 3',
      question: 'Untuk peta rute sekolah, informasi mana yang paling penting?',
      options: ['Jalan dan tujuan utama', 'Warna semua rumah', 'Jumlah jendela setiap gedung'],
      answer: 0,
      explanation: 'Pilih informasi penting dan abaikan detail yang tidak diperlukan.'
    },
    {
      id: 'algoritma',
      title: 'Soal 4',
      question: 'Manakah contoh langkah yang paling teratur untuk menyelesaikan masalah?',
      options: ['Mengikuti langkah yang sudah diurutkan', 'Memilih hiasan terlebih dahulu', 'Menghapus semua langkah'],
      answer: 0,
      explanation: 'Langkah yang terurut membantu kita mencapai tujuan dengan jelas.'
    }
  ],
  flowchartBlocks: [
    { id: 'start', label: 'Mulai', icon: '🟢', type: 'terminator' },
    { id: 'input', label: 'Masukkan nilai', icon: '📥', type: 'input' },
    { id: 'decision', label: 'Nilai ≥ 75?', icon: '🔷', type: 'decision' },
    { id: 'process', label: 'Tentukan status', icon: '⚙️', type: 'process' },
    { id: 'output', label: 'Tampilkan hasil', icon: '📤', type: 'input' },
    { id: 'end', label: 'Selesai', icon: '🔴', type: 'terminator' }
  ],
  flowchartExpected: ['start', 'input', 'decision', 'process', 'output', 'end'],
  flowchartOrder: [],
  currentLevel: 0,
  instructions: [],
  flowchartSteps: [],
  conceptAnswers: {},
  flowchartComplete: false,
  isRunning: false,
  
  init() {
    const completed = KKA.state.data.bab3.levelsCompleted || [];
    this.currentLevel = completed.length;
    if (this.currentLevel >= 3) {
      this.showComplete();
      return;
    }
    this.flowchartSteps = [];
    this.conceptAnswers = {};
    this.flowchartComplete = false;
    this.shuffleFlowchartBlocks();
    this.renderLevel();
  },
  
  renderLevel() {
    const level = this.levels[this.currentLevel];
    const container = document.getElementById('bab3-content');
    document.getElementById('bab3-level').textContent = `Level ${this.currentLevel + 1}/3`;
    this.instructions = [];
    
    container.innerHTML = `
      <div class="bot-education">
        <p>🧠 <strong>Berpikir Komputasional</strong>: Pecah masalah besar menjadi langkah-langkah kecil, lalu susun urutan penyelesaian yang jelas.</p>
      </div>
      ${this.renderConceptQuestions()}
      ${this.renderFlowchartGame()}
      <h3 style="text-align:center">${level.name}</h3>
      <div id="bot-grid" class="grid-4x4">
        ${this.renderGrid(level)}
      </div>
      <div class="instruction-section">
        <p style="margin-bottom:0.5rem">Instruksi:</p>
        <div id="instruction-queue" class="instruction-queue"></div>
      </div>
      <div class="instruction-panel">
        <button class="btn btn-primary" onclick="KKA.bab3.addInstruction('maju')">⬆️ Maju</button>
        <button class="btn btn-accent" onclick="KKA.bab3.addInstruction('kiri')">↩️ Belok Kiri</button>
        <button class="btn btn-accent" onclick="KKA.bab3.addInstruction('kanan')">↪️ Belok Kanan</button>
      </div>
      <div class="bot-controls">
        <button class="btn btn-success" onclick="KKA.bab3.run()" id="bot-run-btn">▶️ Jalankan</button>
        <button class="btn btn-outline" onclick="KKA.bab3.removeLastInstruction()">↩ Hapus Terakhir</button>
        <button class="btn btn-outline" onclick="KKA.bab3.clearInstructions()">🗑️ Reset</button>
        <button class="btn hint-btn" onclick="KKA.bab3.showHint()">💡 Hint (-5 XP)</button>
      </div>
      <div id="bot-message" class="bot-message"></div>
    `;
    this.updateInstructionDisplay();
  },

  renderConceptQuestions() {
    return `
      <section class="concept-section">
        <h3>🧠 Kenali Konsepnya</h3>
        <p class="concept-intro">Jawab empat contoh soal singkat sebelum membantu bot.</p>
        <div class="concept-grid">
          ${this.conceptQuestions.map(question => `
            <article class="concept-card" id="concept-${question.id}">
              <h4>${question.title}</h4>
              <p>${question.question}</p>
              <div class="concept-options">
                ${question.options.map((option, index) => `<button class="btn btn-outline concept-option" onclick="KKA.bab3.answerConcept('${question.id}', ${index})">${option}</button>`).join('')}
              </div>
              <div class="concept-feedback" id="concept-feedback-${question.id}"></div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  },

  answerConcept(questionId, answerIndex) {
    const question = this.conceptQuestions.find(item => item.id === questionId);
    const feedback = document.getElementById(`concept-feedback-${questionId}`);
    const card = document.getElementById(`concept-${questionId}`);
    if (!question || !feedback || !card) return;

    const isCorrect = answerIndex === question.answer;
    this.conceptAnswers[questionId] = isCorrect;
    feedback.textContent = isCorrect ? `✅ Benar! ${question.explanation}` : '❌ Belum tepat. Coba pilih jawaban lain.';
    feedback.className = `concept-feedback ${isCorrect ? 'success' : 'error'}`;
    card.querySelectorAll('.concept-option').forEach((button, index) => {
      button.classList.toggle('correct', isCorrect && index === question.answer);
      button.classList.toggle('wrong', !isCorrect && index === answerIndex);
    });
    if (isCorrect && Object.keys(this.conceptAnswers).length === this.conceptQuestions.length && Object.values(this.conceptAnswers).every(Boolean)) {
      KKA.ui.showNotification('Semua konsep dipahami! Sekarang susun flowchart.', 'success');
    }
  },

  renderFlowchartGame() {
    const placed = this.flowchartSteps.map((id, index) => {
      const block = this.flowchartBlocks.find(item => item.id === id);
      return `<span class="flow-step flow-shape-${block.type}"><b>${index + 1}</b> ${block.icon} ${block.label}</span>`;
    }).join('<span class="flow-arrow">→</span>');
    const blocks = this.flowchartOrder.map(id => this.flowchartBlocks.find(block => block.id === id));
    const available = blocks.map(block => `
      <button class="btn btn-outline flow-block flow-shape-${block.type}" onclick="KKA.bab3.addFlowStep('${block.id}')" ${this.flowchartComplete ? 'disabled' : ''}>
        ${block.icon} ${block.label}
      </button>
    `).join('');

    return `
      <section class="flowchart-section">
        <h3>🔀 Game Flowchart Algoritma</h3>
        <p>Buat alur untuk menentukan apakah seorang siswa lulus. Klik blok sesuai urutan algoritma.</p>
        <div class="flow-sequence">${placed || '<span class="flow-empty">Belum ada blok. Mulai dari "Mulai".</span>'}</div>
        <div class="flow-blocks">${available}</div>
        <button class="btn btn-outline" onclick="KKA.bab3.resetFlowchart()">🗑️ Reset Flowchart</button>
        <div id="flowchart-feedback" class="concept-feedback"></div>
      </section>
    `;
  },

  addFlowStep(blockId) {
    if (this.flowchartComplete) return;
    const expected = this.flowchartExpected[this.flowchartSteps.length];
    const feedback = document.getElementById('flowchart-feedback');
    if (blockId !== expected) {
      if (feedback) {
        feedback.textContent = '❌ Urutannya belum tepat. Pikirkan langkah berikutnya dari alur input → keputusan → output.';
        feedback.className = 'concept-feedback error';
      }
      KKA.audio.playWrong();
      return;
    }

    this.flowchartSteps.push(blockId);
    const completed = this.flowchartSteps.length === this.flowchartExpected.length;
    if (completed) {
      this.flowchartComplete = true;
      KKA.audio.playCorrect();
      KKA.state.addXP(KKA.config.XP.BOT_FINISH);
    }
    this.refreshFlowchart();
    if (completed) {
      const refreshedFeedback = document.getElementById('flowchart-feedback');
      if (refreshedFeedback) {
        refreshedFeedback.textContent = '🎉 Flowchart benar! Alur algoritmamu sudah lengkap.';
        refreshedFeedback.className = 'concept-feedback success';
      }
    }
  },

  resetFlowchart() {
    this.flowchartSteps = [];
    this.flowchartComplete = false;
    this.shuffleFlowchartBlocks();
    this.refreshFlowchart();
  },

  shuffleFlowchartBlocks() {
    this.flowchartOrder = this.flowchartBlocks.map(block => block.id);
    for (let index = this.flowchartOrder.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [this.flowchartOrder[index], this.flowchartOrder[randomIndex]] = [this.flowchartOrder[randomIndex], this.flowchartOrder[index]];
    }
  },

  refreshFlowchart() {
    const section = document.querySelector('.flowchart-section');
    if (!section) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.renderFlowchartGame();
    section.replaceWith(wrapper.firstElementChild);
  },
  
  renderGrid(level) {
    let html = '';
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        let cls = 'grid-cell';
        let content = '';
        if (level.grid[r][c] === 1) {
          cls += ' wall';
          content = '🧱';
        }
        if (r === level.bot.row && c === level.bot.col) {
          cls += ' bot';
          content = '🤖';
        }
        if (r === level.finish.row && c === level.finish.col) {
          cls += ' finish';
          content = '🏁';
        }
        html += `<div class="${cls}" id="cell-${r}-${c}">${content}</div>`;
      }
    }
    return html;
  },
  
  addInstruction(type) {
    if (this.isRunning) return;
    KKA.audio.playClick();
    this.instructions.push(type);
    this.updateInstructionDisplay();
  },
  
  removeLastInstruction() {
    if (this.isRunning) return;
    this.instructions.pop();
    this.updateInstructionDisplay();
  },
  
  clearInstructions() {
    if (this.isRunning) return;
    this.instructions = [];
    this.updateInstructionDisplay();
  },
  
  updateInstructionDisplay() {
    const queue = document.getElementById('instruction-queue');
    if (!queue) return;
    const labels = { maju: '⬆️ Maju', kiri: '↩️ Kiri', kanan: '↪️ Kanan' };
    queue.innerHTML = this.instructions.length === 0 
      ? '<span style="opacity:0.5">Belum ada instruksi...</span>'
      : this.instructions.map((inst, i) => `<span class="instruction-tag">${labels[inst]}</span>`).join('');
  },
  
  async run() {
    if (this.isRunning || this.instructions.length === 0) return;
    this.isRunning = true;
    document.getElementById('bot-run-btn').disabled = true;
    
    const level = this.levels[this.currentLevel];
    let pos = { ...level.bot };
    const directions = { right: {dr:0,dc:1}, left: {dr:0,dc:-1}, up: {dr:-1,dc:0}, down: {dr:1,dc:0} };
    const turnLeft = { right:'up', up:'left', left:'down', down:'right' };
    const turnRight = { right:'down', down:'left', left:'up', up:'right' };
    
    let success = true;
    const msgEl = document.getElementById('bot-message');
    msgEl.innerHTML = '';
    msgEl.className = 'bot-message';
    
    for (let i = 0; i < this.instructions.length; i++) {
      const tags = document.getElementById('instruction-queue').children;
      if (tags[i] && tags[i].classList) tags[i].classList.add('active');
      
      const inst = this.instructions[i];
      
      if (inst === 'maju') {
        const d = directions[pos.dir];
        const newRow = pos.row + d.dr;
        const newCol = pos.col + d.dc;
        
        if (newRow < 0 || newRow >= 4 || newCol < 0 || newCol >= 4) {
          msgEl.innerHTML = '💥 Bot keluar dari peta! Coba lagi!';
          msgEl.className = 'bot-message error';
          KKA.audio.playWrong();
          success = false;
          break;
        }
        
        if (level.grid[newRow][newCol] === 1) {
          msgEl.innerHTML = '💥 Bot menabrak dinding! Coba lagi!';
          msgEl.className = 'bot-message error';
          KKA.audio.playWrong();
          success = false;
          break;
        }
        
        const oldCell = document.getElementById(`cell-${pos.row}-${pos.col}`);
        if(oldCell) {
            oldCell.textContent = '';
            oldCell.classList.remove('bot');
        }
        pos.row = newRow;
        pos.col = newCol;
        const newCell = document.getElementById(`cell-${pos.row}-${pos.col}`);
        if(newCell) {
            newCell.textContent = '🤖';
            newCell.classList.add('bot');
        }
      } else if (inst === 'kiri') {
        pos.dir = turnLeft[pos.dir];
      } else if (inst === 'kanan') {
        pos.dir = turnRight[pos.dir];
      }
      
      await new Promise(r => setTimeout(r, 400));
      if (tags[i] && tags[i].classList) tags[i].classList.remove('active');
    }
    
    if (success) {
      if (pos.row === level.finish.row && pos.col === level.finish.col) {
        msgEl.innerHTML = '🎉 Bot sampai di tujuan! Hebat!';
        msgEl.className = 'bot-message success';
        KKA.audio.playCorrect();
        KKA.state.addXP(KKA.config.XP.BOT_FINISH);
        KKA.ui.showNotification(`+${KKA.config.XP.BOT_FINISH} XP! Level selesai! 🎉`, 'xp');
        KKA.state.incrementCombo();
        
        if (!KKA.state.data.bab3.levelsCompleted.includes(this.currentLevel)) {
          KKA.state.data.bab3.levelsCompleted.push(this.currentLevel);
        }
        
        if (KKA.state.data.bab3.levelsCompleted.length >= 3) {
          KKA.state.data.bab3.completed = true;
          KKA.state.unlockBadge('bot-commander');
        }
        KKA.state.save();
        
        setTimeout(() => {
          if (this.currentLevel < 2) {
            msgEl.innerHTML += '<br><button class="btn btn-primary" onclick="KKA.bab3.nextLevel()" style="margin-top:1rem">Level Berikutnya →</button>';
          } else {
            this.showComplete();
          }
        }, 500);
      } else {
        msgEl.innerHTML = '🤔 Bot belum sampai ke tujuan. Tambahkan instruksi lagi!';
        msgEl.className = 'bot-message info';
      }
    } else {
        setTimeout(() => {
            this.renderLevel();
        }, 1500);
    }
    
    this.isRunning = false;
    const runBtn = document.getElementById('bot-run-btn');
    if (runBtn) runBtn.disabled = false;
  },
  
  nextLevel() {
    this.currentLevel++;
    this.renderLevel();
  },
  
  showHint() {
    const level = this.levels[this.currentLevel];
    KKA.state.addXP(KKA.config.XP.HINT_PENALTY);
    KKA.ui.showNotification(`💡 Hint: ${level.hint} (${KKA.config.XP.HINT_PENALTY} XP)`, 'info');
  },
  
  showComplete() {
    const container = document.getElementById('bab3-content');
    if(!container) return;
    container.innerHTML = `
      <div class="summary-card" style="animation: scaleIn 0.5s ease">
        <h3>🎉 Bab 3 Selesai!</h3>
        <div class="summary-stars">⭐⭐⭐</div>
        <p>🤖 Badge Bot Commander diraih!</p>
        <p>Kamu telah menguasai cara memecah masalah dan menyusun langkah penyelesaian!</p>
        <button class="btn btn-primary" onclick="KKA.ui.showScreen('screen-dashboard')">Kembali ke Dashboard</button>
        <button class="btn btn-outline" onclick="KKA.bab3.reset()" style="margin-top:0.5rem">Main Lagi 🔄</button>
      </div>
    `;
  },
  
  reset() {
    KKA.state.data.bab3.levelsCompleted = [];
    KKA.state.data.bab3.completed = false;
    KKA.state.save();
    this.currentLevel = 0;
    this.instructions = [];
    this.isRunning = false;
    this.renderLevel();
  }
};
