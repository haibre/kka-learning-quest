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
      hint: 'Dekomposisi: pecah menjadi beberapa bagian kecil!'
    }
  ],
  currentLevel: 0,
  instructions: [],
  isRunning: false,
  
  init() {
    const completed = KKA.state.data.bab3.levelsCompleted || [];
    this.currentLevel = completed.length;
    if (this.currentLevel >= 3) {
      this.showComplete();
      return;
    }
    this.renderLevel();
  },
  
  renderLevel() {
    const level = this.levels[this.currentLevel];
    const container = document.getElementById('bab3-content');
    document.getElementById('bab3-level').textContent = `Level ${this.currentLevel + 1}/3`;
    this.instructions = [];
    
    container.innerHTML = `
      <div class="bot-education">
        <p>🧠 <strong>Berpikir Komputasional</strong>: Pecah masalah besar menjadi langkah-langkah kecil (Dekomposisi), lalu susun algoritma untuk menyelesaikannya.</p>
      </div>
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
        <p>Kamu telah menguasai konsep Dekomposisi dan Algoritma!</p>
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
