window.KKA = window.KKA || {};

KKA.bab4 = {
  puzzles: [
    {
      title: 'Puzzle 1: Bilangan Genap/Ganjil',
      description: 'Lengkapi kode untuk mengecek apakah bilangan genap atau ganjil!',
      code: [
        { text: 'angka = 7', type: 'normal' },
        { text: 'if angka ', type: 'normal', blank: { id: 'p1b1', answer: '% 2 == 0', width: '120px' }, after: ':' },
        { text: '    print("Genap")', type: 'normal' },
        { text: '', type: 'normal', blank: { id: 'p1b2', answer: 'else', width: '60px' }, after: ':' },
        { text: '    print("Ganjil")', type: 'normal' }
      ],
      expectedOutput: 'Ganjil',
      hint: 'Gunakan operator modulo (%) untuk sisa bagi. Genap = habis dibagi 2.'
    },
    {
      title: 'Puzzle 2: Konversi Nilai ke Grade',
      description: 'Lengkapi percabangan if-elif-else untuk konversi nilai!',
      code: [
        { text: 'nilai = 85', type: 'normal' },
        { text: 'if nilai >= 90:', type: 'normal' },
        { text: '    grade = "A"', type: 'normal' },
        { text: '', type: 'normal', blank: { id: 'p2b1', answer: 'elif', width: '60px' }, after: ' nilai >= 80:' },
        { text: '    grade = "B"', type: 'normal' },
        { text: 'elif nilai >= 70:', type: 'normal' },
        { text: '    grade = "C"', type: 'normal' },
        { text: 'else:', type: 'normal' },
        { text: '    grade = "D"', type: 'normal' },
        { text: '', type: 'normal', blank: { id: 'p2b2', answer: 'print(grade)', width: '130px' } }
      ],
      expectedOutput: 'B',
      hint: 'elif = else if dalam Python. Digunakan untuk kondisi tambahan.'
    },
    {
      title: 'Puzzle 3: Cetak Angka 1-10',
      description: 'Lengkapi for loop untuk mencetak angka 1 sampai 10!',
      code: [
        { text: '', type: 'normal', blank: { id: 'p3b1', answer: 'for', width: '50px' }, after: ' i in range(1, 11):' },
        { text: '    ', type: 'normal', blank: { id: 'p3b2', answer: 'print(i)', width: '100px' } }
      ],
      expectedOutput: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10',
      hint: 'for digunakan untuk perulangan. range(1, 11) menghasilkan angka 1-10.'
    },
    {
      title: 'Puzzle 4: Bilangan Ganjil Saja',
      description: 'Cetak hanya bilangan ganjil dari 1 sampai 10!',
      code: [
        { text: 'for i in range(1, 11):', type: 'normal' },
        { text: '    if i % 2 ', type: 'normal', blank: { id: 'p4b1', answer: '!= 0', width: '80px' }, after: ':' },
        { text: '        ', type: 'normal', blank: { id: 'p4b2', answer: 'print(i)', width: '100px' } }
      ],
      expectedOutput: '1\n3\n5\n7\n9',
      hint: 'Bilangan ganjil: sisa bagi 2 TIDAK sama dengan 0. Gunakan != 0'
    },
    {
      title: 'Puzzle 5: Hitung Total 1+2+...+10',
      description: 'Hitung jumlah dari 1 + 2 + 3 + ... + 10 menggunakan loop!',
      code: [
        { text: '', type: 'normal', blank: { id: 'p5b1', answer: 'total = 0', width: '110px' } },
        { text: 'for i in range(1, 11):', type: 'normal' },
        { text: '    total = total + ', type: 'normal', blank: { id: 'p5b2', answer: 'i', width: '40px' } },
        { text: 'print(total)', type: 'normal' }
      ],
      expectedOutput: '55',
      hint: 'Inisialisasi total = 0 sebelum loop, lalu tambahkan i di setiap iterasi.'
    },
    {
      title: 'Puzzle 6: Cek Tahun Kabisat',
      description: 'Lengkapi kode untuk mengecek apakah tahun 2024 adalah tahun kabisat!',
      code: [
        { text: 'tahun = 2024', type: 'normal' },
        { text: 'if tahun % 4 == 0 ', type: 'normal', blank: { id: 'p6b1', answer: 'and', width: '60px' }, after: ' tahun % 100 != 0:' },
        { text: '    print("Kabisat")', type: 'normal' },
        { text: '', type: 'normal', blank: { id: 'p6b2', answer: 'elif', width: '60px' }, after: ' tahun % 400 == 0:' },
        { text: '    print("Kabisat")', type: 'normal' },
        { text: 'else:', type: 'normal' },
        { text: '    print("Bukan Kabisat")', type: 'normal' }
      ],
      expectedOutput: 'Kabisat',
      hint: 'Tahun kabisat: habis dibagi 4 DAN tidak habis dibagi 100, ATAU habis dibagi 400. Gunakan "and" dan "elif".'
    }
  ],
  currentIndex: 0,
  correctCount: 0,
  
  init() {
    this.correctCount = KKA.state.data.bab4.correct || 0;
    this.currentIndex = (KKA.state.data.bab4.puzzles || []).length;
    if (this.currentIndex >= 6 || KKA.state.data.bab4.completed) {
      this.showSummary();
      return;
    }
    this.showPuzzle();
  },
  
  showPuzzle() {
    const puzzle = this.puzzles[this.currentIndex];
    const container = document.getElementById('bab4-content');
    document.getElementById('bab4-score').textContent = `${this.correctCount}/6`;
    
    let codeHTML = '';
    puzzle.code.forEach(line => {
      let lineHTML = '<div class="code-line">';
      
      if (line.blank) {
        lineHTML += `<span class="code-text">${this.syntaxHighlight(line.text)}</span>`;
        lineHTML += `<input type="text" class="code-blank" id="${line.blank.id}" style="width:${line.blank.width}" autocomplete="off" spellcheck="false" />`;
        if (line.after) lineHTML += `<span class="code-text">${this.syntaxHighlight(line.after)}</span>`;
      } else {
        lineHTML += `<span class="code-text">${this.syntaxHighlight(line.text)}</span>`;
      }
      lineHTML += '</div>';
      codeHTML += lineHTML;
    });
    
    container.innerHTML = `
      <div style="animation: slideIn 0.5s ease">
        <h3>${puzzle.title}</h3>
        <p>${puzzle.description}</p>
        <div class="code-editor">
          ${codeHTML}
        </div>
        <div style="display:flex; gap:0.5rem; margin-top:1rem; flex-wrap:wrap">
          <button class="btn btn-success" onclick="KKA.bab4.check()">▶️ Jalankan</button>
          <button class="btn hint-btn" onclick="KKA.bab4.showHint()">💡 Hint (-5 XP)</button>
        </div>
        <div id="bab4-terminal" class="terminal-output" style="display:none">
          <div class="terminal-header">Terminal Output:</div>
          <div id="bab4-output"></div>
        </div>
        <div id="bab4-result" style="margin-top:1rem"></div>
      </div>
    `;
    
    const firstBlank = container.querySelector('.code-blank');
    if (firstBlank) setTimeout(() => firstBlank.focus(), 100);
  },
  
  syntaxHighlight(text) {
    if (!text) return '';
    return text
      .replace(/"([^"]*)"/g, '<span class="py-string">"$1"</span>')
      .replace(/\b(if|else|elif|for|in|and|or|not|def|return|True|False|while|import|from|class|try|except)\b/g, '<span class="py-keyword">$1</span>')
      .replace(/\b(print|range|len|int|str|float|input|type)\b/g, '<span class="py-builtin">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="py-number">$1</span>')
      .replace(/(#.*)/g, '<span class="py-comment">$1</span>')
      .replace(/(=|!=|==|>=|<=|>|<|\+|-|\*|\/|%)/g, '<span class="py-operator">$1</span>');
  },
  
  check() {
    const puzzle = this.puzzles[this.currentIndex];
    let allCorrect = true;
    
    puzzle.code.forEach(line => {
      if (line.blank) {
        const input = document.getElementById(line.blank.id);
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = line.blank.answer.trim().toLowerCase();
        
        if (userAnswer === correctAnswer) {
          input.classList.add('correct');
          input.classList.remove('wrong');
        } else {
          input.classList.add('wrong');
          input.classList.remove('correct');
          allCorrect = false;
        }
      }
    });
    
    const terminal = document.getElementById('bab4-terminal');
    const output = document.getElementById('bab4-output');
    const result = document.getElementById('bab4-result');
    terminal.style.display = 'block';
    
    if (allCorrect) {
      output.innerHTML = puzzle.expectedOutput.replace(/\n/g, '<br>');
      output.className = '';
      this.correctCount++;
      KKA.state.addXP(KKA.config.XP.PUZZLE_CORRECT);
      KKA.state.incrementCombo();
      KKA.audio.playCorrect();
      KKA.ui.showNotification(`+${KKA.config.XP.PUZZLE_CORRECT} XP! Kode benar! 🎉`, 'xp');
      
      if (!KKA.state.data.bab4.puzzles) KKA.state.data.bab4.puzzles = [];
      KKA.state.data.bab4.puzzles.push({ index: this.currentIndex, correct: true });
      KKA.state.data.bab4.correct = this.correctCount;
      KKA.state.save();
      
      result.innerHTML = `
        <div class="result-badge result-correct" style="color: #28a745; font-weight: bold; margin-bottom: 0.5rem;">✅ Benar! Output sesuai!</div>
        <button class="btn btn-primary" onclick="KKA.bab4.next()" style="margin-top:0.5rem">Lanjut →</button>
      `;
    } else {
      let corrections = [];
      puzzle.code.forEach(line => {
        if (line.blank) {
          const input = document.getElementById(line.blank.id);
          if (input.value.trim().toLowerCase() !== line.blank.answer.trim().toLowerCase()) {
            corrections.push(`"${line.blank.answer}"`);
          }
        }
      });
      output.textContent = 'Error: Kode tidak benar';
      output.className = 'terminal-error';
      KKA.state.resetCombo();
      KKA.audio.playWrong();
      
      result.innerHTML = `
        <div class="result-badge result-wrong" style="color: #dc3545; font-weight: bold; margin-bottom: 0.5rem;">❌ Kurang tepat!</div>
        <p>Jawaban yang benar: ${corrections.join(', ')}</p>
        <p>Output seharusnya: <code>${puzzle.expectedOutput.replace(/\n/g, ' | ')}</code></p>
        <button class="btn btn-primary" onclick="KKA.bab4.next()" style="margin-top:0.5rem">Lanjut →</button>
      `;
      
      if (!KKA.state.data.bab4.puzzles) KKA.state.data.bab4.puzzles = [];
      KKA.state.data.bab4.puzzles.push({ index: this.currentIndex, correct: false });
      KKA.state.save();
    }
    
    document.getElementById('bab4-score').textContent = `${this.correctCount}/6`;
  },
  
  next() {
    this.currentIndex++;
    if (this.currentIndex >= 6) {
      KKA.state.data.bab4.completed = true;
      KKA.state.save();
      if (this.correctCount >= 4) {
        KKA.state.unlockBadge('python-coder');
      }
      this.showSummary();
    } else {
      this.showPuzzle();
    }
  },
  
  showHint() {
    const puzzle = this.puzzles[this.currentIndex];
    KKA.state.addXP(KKA.config.XP.HINT_PENALTY);
    KKA.ui.showNotification(`💡 ${puzzle.hint} (${KKA.config.XP.HINT_PENALTY} XP)`, 'info');
  },
  
  showSummary() {
    const container = document.getElementById('bab4-content');
    const percentage = Math.round((this.correctCount / 6) * 100);
    container.innerHTML = `
      <div class="summary-card" style="animation: scaleIn 0.5s ease">
        <h3>🎉 Bab 4 Selesai!</h3>
        <div class="summary-stars">${this.correctCount >= 5 ? '⭐⭐⭐' : this.correctCount >= 3 ? '⭐⭐' : '⭐'}</div>
        <div class="summary-score">${this.correctCount}/6 Benar (${percentage}%)</div>
        <p>${this.correctCount >= 4 ? '🐍 Badge Python Coder diraih!' : 'Butuh minimal 4 benar untuk badge. Coba lagi!'}</p>
        <div class="summary-buttons">
          <button class="btn btn-primary" onclick="KKA.ui.showScreen('screen-dashboard')">Kembali ke Dashboard</button>
          ${this.correctCount < 4 ? '<button class="btn btn-outline" onclick="KKA.bab4.reset()">Coba Lagi 🔄</button>' : '<button class="btn btn-outline" onclick="KKA.bab4.reset()">Main Lagi 🔄</button>'}
        </div>
      </div>
    `;
  },
  
  reset() {
    KKA.state.data.bab4 = { completed: false, correct: 0, total: 6, puzzles: [] };
    KKA.state.save();
    this.currentIndex = 0;
    this.correctCount = 0;
    this.showPuzzle();
  }
};
