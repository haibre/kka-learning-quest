window.KKA = window.KKA || {};

KKA.bab2 = {
  initHub() {
    const games = ['stack', 'queue', 'array', 'linear', 'binary', 'bubble', 'selection', 'insertion'];
    games.forEach(g => {
      const el = document.getElementById(`mg-${g}-status`);
      if (el && KKA.state.data.bab2 && KKA.state.data.bab2[g]) {
        el.textContent = '✅';
      }
    });
  },

  showCompletion(containerId, minigameName, badgeId, badgeName) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
      <div style="text-align:center; padding: 20px; animation: scaleIn 0.5s ease">
        <h3>🎉 Selesai!</h3>
        <p>Kamu telah menyelesaikan minigame ${minigameName}.</p>
        <button style="background:#4f46e5; color:white; padding:10px 20px; border:none; border-radius:8px; cursor:pointer; margin-top:10px;" onclick="KKA.ui.showScreen('screen-bab2')">Kembali ke Arcade</button>
      </div>
    `;
    KKA.state.addXP(KKA.config.XP.MINIGAME_COMPLETE);
    KKA.state.completeActivity('bab2', minigameName.toLowerCase().replace(" ", ""));
    if (badgeId) {
        KKA.state.unlockBadge(badgeId);
    }
  },

  hint(penalty) {
    KKA.state.addXP(penalty);
    KKA.ui.showNotification('Hint dipakai (-5 XP)', 'info');
  },

  stack: {
    levels: [
      { target: ['merah', 'biru'] },
      { target: ['hijau', 'kuning', 'merah'] },
      { target: ['ungu', 'biru', 'hijau', 'kuning'] }
    ],
    levelIdx: 0,
    currentStack: [],
    
    init() {
      this.levelIdx = 0;
      this.start();
    },
    
    start() {
      this.currentStack = [];
      this.render();
    },

    push(color) {
      if (this.currentStack.length >= this.levels[this.levelIdx].target.length) return;
      this.currentStack.push(color);
      KKA.audio.playClick();
      this.render();
      this.checkWin();
    },

    pop() {
      if (this.currentStack.length === 0) return;
      this.currentStack.pop();
      KKA.audio.playClick();
      this.render();
    },
    
    checkWin() {
      const target = this.levels[this.levelIdx].target;
      if (this.currentStack.length === target.length) {
        let win = true;
        for (let i = 0; i < target.length; i++) {
          if (this.currentStack[i] !== target[i]) win = false;
        }
        if (win) {
          KKA.audio.playCorrect();
          setTimeout(() => {
            this.levelIdx++;
            if (this.levelIdx >= this.levels.length) {
              KKA.bab2.showCompletion('stack-content', 'Stack', 'stack-master', 'Stack Master');
            } else {
              this.start();
            }
          }, 1000);
        }
      }
    },

    render() {
      const container = document.getElementById('stack-content');
      const target = this.levels[this.levelIdx].target;
      
      const colors = {
        'merah': '#ef4444', 'kuning': '#f59e0b', 'hijau': '#10b981', 'biru': '#3b82f6', 'ungu': '#8b5cf6'
      };

      container.innerHTML = `
        <div style="background:white; padding:20px; border-radius:12px;">
          <h4>Stack = Tumpukan. LIFO: Last In, First Out. Elemen terakhir yang masuk akan keluar pertama.</h4>
          <div style="display:flex; justify-content:space-around; margin-top:20px;">
            <div>
              <h5>Target:</h5>
              <div style="display:flex; flex-direction:column-reverse; gap:5px; border-bottom: 4px solid #333; padding-bottom: 5px; width: 100px; height: 150px; justify-content: flex-start;">
                ${target.map(c => \`<div style="background:\${colors[c]}; height:30px; border-radius:4px; text-align:center; color:white;">\${c}</div>\`).join('')}
              </div>
            </div>
            <div>
              <h5>Stack Kamu:</h5>
              <div style="display:flex; flex-direction:column-reverse; gap:5px; border-bottom: 4px solid #333; padding-bottom: 5px; width: 100px; height: 150px; justify-content: flex-start;">
                ${this.currentStack.map(c => \`<div style="background:\${colors[c]}; height:30px; border-radius:4px; text-align:center; color:white; animation: slideIn 0.2s;">\${c}</div>\`).join('')}
              </div>
            </div>
          </div>
          <div style="margin-top:20px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            ${Object.keys(colors).map(c => \`<button style="background:\${colors[c]}; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;" onclick="KKA.bab2.stack.push('\${c}')">Push \${c}</button>\`).join('')}
            <button style="background:#374151; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;" onclick="KKA.bab2.stack.pop()">Pop</button>
            <button style="background:transparent; border:1px solid #ccc; padding:8px; cursor:pointer;" onclick="KKA.bab2.hint(-5)">Hint 💡</button>
          </div>
        </div>
      `;
    },
    reset() { this.init(); }
  },

  queue: {
    levels: [3, 5, 7],
    levelIdx: 0,
    chars: ['👨', '👩', '👦', '👧', '🧑', '👴'],
    q: [],
    incoming: [],
    
    init() {
      this.levelIdx = 0;
      this.start();
    },

    start() {
      this.q = [];
      this.incoming = [];
      const count = this.levels[this.levelIdx];
      for (let i = 0; i < count; i++) {
        this.incoming.push(this.chars[Math.floor(Math.random() * this.chars.length)]);
      }
      this.render();
    },

    enqueue() {
      if (this.incoming.length > 0) {
        this.q.push(this.incoming.shift());
        KKA.audio.playClick();
        this.render();
      }
    },

    dequeue() {
      if (this.q.length > 0) {
        this.q.shift();
        KKA.audio.playClick();
        this.render();
        if (this.incoming.length === 0 && this.q.length === 0) {
          KKA.audio.playCorrect();
          setTimeout(() => {
            this.levelIdx++;
            if (this.levelIdx >= this.levels.length) {
              KKA.bab2.showCompletion('queue-content', 'Queue', 'queue-pro', 'Queue Pro');
            } else {
              this.start();
            }
          }, 1000);
        }
      }
    },

    render() {
      const container = document.getElementById('queue-content');
      container.innerHTML = `
        <div style="background:white; padding:20px; border-radius:12px;">
          <h4>Queue = Antrean. FIFO: First In, First Out. Yang datang pertama, dilayani pertama.</h4>
          <p>Pelanggan menunggu: ${this.incoming.join(' ')}</p>
          <div style="display:flex; align-items:center; margin: 20px 0; height: 60px; border: 2px dashed #ccc; padding: 10px;">
            <div style="font-weight:bold; margin-right:10px;">LOKET 👈</div>
            ${this.q.map(c => \`<div style="font-size:2em; margin-right:5px; animation:scaleIn 0.2s;">\${c}</div>\`).join('')}
          </div>
          <div style="display:flex; gap:10px; justify-content:center;">
            <button style="background:#10b981; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;" onclick="KKA.bab2.queue.enqueue()" ${this.incoming.length===0?'disabled':''}>Enqueue (Antre)</button>
            <button style="background:#ef4444; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;" onclick="KKA.bab2.queue.dequeue()" ${this.q.length===0?'disabled':''}>Dequeue (Layani)</button>
            <button style="background:transparent; border:1px solid #ccc; padding:10px; cursor:pointer; border-radius:8px;" onclick="KKA.bab2.hint(-5)">Hint 💡</button>
          </div>
        </div>
      `;
    },
    reset() { this.init(); }
  },

  array: {
    arr: [],
    questionCount: 0,
    maxQuestions: 5,
    qType: 0,
    qIndex: 0,
    
    init() {
      this.questionCount = 0;
      this.generateQuestion();
    },

    generateQuestion() {
      this.arr = Array.from({length: 6}, () => Math.floor(Math.random() * 90) + 10);
      this.qType = Math.random() > 0.5 ? 0 : 1;
      this.qIndex = Math.floor(Math.random() * this.arr.length);
      this.render();
    },

    answer() {
      const input = document.getElementById('array-ans').value;
      const val = parseInt(input);
      let correct = false;
      if (this.qType === 0) {
        // Apa nilai di indeks X?
        correct = val === this.arr[this.qIndex];
      } else {
        // Di indeks berapa nilai Y?
        correct = val === this.qIndex;
      }

      if (correct) {
        KKA.audio.playCorrect();
        this.questionCount++;
        if (this.questionCount >= this.maxQuestions) {
          KKA.bab2.showCompletion('array-content', 'Array', 'array-wizard', 'Array Wizard');
        } else {
          this.generateQuestion();
        }
      } else {
        KKA.audio.playWrong();
        KKA.ui.showNotification('Salah, coba lagi!', 'error');
      }
    },

    render() {
      const container = document.getElementById('array-content');
      const qText = this.qType === 0 
        ? \`Apa nilai di indeks ke-\${this.qIndex}?\` 
        : \`Di indeks berapa nilai \${this.arr[this.qIndex]}?\`;
        
      container.innerHTML = `
        <div style="background:white; padding:20px; border-radius:12px; text-align:center;">
          <h4>Array menggunakan indeks yang dimulai dari 0, bukan 1!</h4>
          <div style="display:flex; justify-content:center; gap:5px; margin:20px 0;">
            ${this.arr.map((val, idx) => \`
              <div style="border:2px solid #ccc; border-radius:8px; width:50px; text-align:center; overflow:hidden;">
                <div style="background:#f3f4f6; font-size:0.8em; padding:2px; color:#6b7280;">\${idx}</div>
                <div style="padding:10px; font-weight:bold;">\${val}</div>
              </div>
            \`).join('')}
          </div>
          <p style="font-size:1.2em; font-weight:bold;">\${qText}</p>
          <input type="number" id="array-ans" style="padding:10px; font-size:1em; width:100px; text-align:center; border:1px solid #ccc; border-radius:8px;" />
          <button style="background:#4f46e5; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;" onclick="KKA.bab2.array.answer()">Jawab</button>
          <button style="background:transparent; border:1px solid #ccc; padding:10px; cursor:pointer; border-radius:8px;" onclick="KKA.bab2.hint(-5)">Hint 💡</button>
        </div>
      `;
    },
    reset() { this.init(); }
  },

  linear: {
    arr: [],
    target: 0,
    currentIndex: 0,
    
    init() {
      this.arr = Array.from({length: 8}, () => Math.floor(Math.random() * 90) + 10);
      this.target = this.arr[Math.floor(Math.random() * this.arr.length)];
      this.currentIndex = 0;
      this.render();
    },

    clickBox(idx) {
      if (idx !== this.currentIndex) {
        KKA.audio.playWrong();
        KKA.ui.showNotification('Harus cek dari kiri ke kanan (indeks terkecil)!', 'error');
        return;
      }
      
      KKA.audio.playClick();
      const box = document.getElementById(\`lbox-\${idx}\`);
      box.textContent = this.arr[idx];
      box.style.background = '#e5e7eb';
      
      if (this.arr[idx] === this.target) {
        box.style.background = '#10b981';
        box.style.color = 'white';
        KKA.audio.playCorrect();
        setTimeout(() => {
          KKA.bab2.showCompletion('linear-content', 'Linear Search', 'linear-detective', 'Linear Detective');
        }, 1000);
      } else {
        this.currentIndex++;
      }
    },

    render() {
      const container = document.getElementById('linear-content');
      container.innerHTML = `
        <div style="background:white; padding:20px; border-radius:12px; text-align:center;">
          <h4>Linear Search memeriksa satu per satu dari awal. Kompleksitas: O(n)</h4>
          <h3>Cari angka: <span style="color:#4f46e5;">\${this.target}</span></h3>
          <div style="display:flex; justify-content:center; gap:10px; margin:20px 0; flex-wrap:wrap;">
            ${this.arr.map((val, idx) => \`
              <div id="lbox-\${idx}" onclick="KKA.bab2.linear.clickBox(\${idx})" style="width:60px; height:60px; border:2px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.5em; font-weight:bold; cursor:pointer; background:#fff; color:#333;">
                ?
              </div>
            \`).join('')}
          </div>
          <button style="background:transparent; border:1px solid #ccc; padding:10px; cursor:pointer; border-radius:8px;" onclick="KKA.bab2.hint(-5)">Hint 💡</button>
        </div>
      `;
    },
    reset() { this.init(); }
  },

  binary: {
    arr: [],
    target: 0,
    left: 0,
    right: 0,
    
    init() {
      this.arr = Array.from({length: 15}, () => Math.floor(Math.random() * 90) + 10).sort((a,b) => a-b);
      this.target = this.arr[Math.floor(Math.random() * this.arr.length)];
      this.left = 0;
      this.right = this.arr.length - 1;
      this.render();
    },

    clickMid(idx) {
      const mid = Math.floor((this.left + this.right) / 2);
      if (idx !== mid) {
        KKA.audio.playWrong();
        KKA.ui.showNotification(\`Klik nilai tengah antara indeks \${this.left} dan \${this.right} (yaitu \${mid})!\`, 'error');
        return;
      }
      
      KKA.audio.playClick();
      const val = this.arr[mid];
      if (val === this.target) {
        KKA.audio.playCorrect();
        setTimeout(() => {
          KKA.bab2.showCompletion('binary-content', 'Binary Search', 'binary-ninja', 'Binary Ninja');
        }, 1000);
      } else if (val < this.target) {
        this.left = mid + 1;
        this.render();
      } else {
        this.right = mid - 1;
        this.render();
      }
    },

    render() {
      const container = document.getElementById('binary-content');
      container.innerHTML = `
        <div style="background:white; padding:20px; border-radius:12px; text-align:center;">
          <h4>Binary Search memangkas 50% data di tiap langkah. Kompleksitas: O(log n)</h4>
          <h3>Cari angka: <span style="color:#4f46e5;">\${this.target}</span></h3>
          <div style="display:flex; justify-content:center; gap:5px; margin:20px 0; flex-wrap:wrap;">
            ${this.arr.map((val, idx) => {
              const isActive = idx >= this.left && idx <= this.right;
              const isMid = isActive && idx === Math.floor((this.left + this.right) / 2);
              return \`
              <div onclick="KKA.bab2.binary.clickMid(\${idx})" style="width:40px; height:40px; border:2px solid \${isMid ? '#f59e0b' : '#ccc'}; border-radius:4px; display:flex; align-items:center; justify-content:center; font-weight:bold; cursor:\${isActive?'pointer':'not-allowed'}; background:\${isActive ? (isMid ? '#fef3c7' : '#fff') : '#e5e7eb'}; opacity:\${isActive ? '1' : '0.3'};">
                \${val}
              </div>
            \`}).join('')}
          </div>
          <p>Range Aktif: Indeks \${this.left} - \${this.right}</p>
          <button style="background:transparent; border:1px solid #ccc; padding:10px; cursor:pointer; border-radius:8px;" onclick="KKA.bab2.hint(-5)">Hint 💡</button>
        </div>
      `;
    },
    reset() { this.init(); }
  },

  bubble: {
    arr: [],
    idx: 0,
    sortedIdx: 6,
    
    init() {
      this.arr = Array.from({length: 6}, () => Math.floor(Math.random() * 90) + 10);
      this.idx = 0;
      this.sortedIdx = this.arr.length;
      this.render();
    },

    action(swap) {
      const v1 = this.arr[this.idx];
      const v2 = this.arr[this.idx + 1];
      const shouldSwap = v1 > v2;
      
      if (swap === shouldSwap) {
        KKA.audio.playClick();
        if (swap) {
          this.arr[this.idx] = v2;
          this.arr[this.idx + 1] = v1;
        }
      } else {
        KKA.audio.playWrong();
        KKA.ui.showNotification(swap ? 'Tidak perlu ditukar!' : 'Harusnya ditukar!', 'error');
        if (shouldSwap) {
          this.arr[this.idx] = v2;
          this.arr[this.idx + 1] = v1;
        }
      }
      
      this.idx++;
      if (this.idx >= this.sortedIdx - 1) {
        this.sortedIdx--;
        this.idx = 0;
      }
      
      this.render();
      
      if (this.sortedIdx <= 1) {
        KKA.audio.playCorrect();
        setTimeout(() => {
          KKA.bab2.showCompletion('bubble-content', 'Bubble Sort', 'bubble-champion', 'Bubble Champion');
        }, 1000);
      }
    },

    render() {
      const container = document.getElementById('bubble-content');
      container.innerHTML = `
        <div style="background:white; padding:20px; border-radius:12px; text-align:center;">
          <h4>Bubble Sort: Elemen terbesar 'menggelembung' ke atas.</h4>
          <div style="display:flex; justify-content:center; align-items:flex-end; gap:10px; height:150px; margin:20px 0;">
            ${this.arr.map((val, i) => {
              const isHighlight = i === this.idx || i === this.idx + 1;
              const isSorted = i >= this.sortedIdx;
              return \`
              <div style="width:40px; height:\${val}px; background:\${isSorted ? '#10b981' : (isHighlight ? '#f59e0b' : '#6366f1')}; border-radius:4px 4px 0 0; display:flex; justify-content:center; align-items:flex-end; color:white; font-size:0.8em; padding-bottom:5px; transition: 0.3s;">
                \${val}
              </div>
            \`}).join('')}
          </div>
          <div style="display:flex; gap:10px; justify-content:center;">
            <button style="background:#ef4444; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;" onclick="KKA.bab2.bubble.action(true)" ${this.sortedIdx <= 1 ? 'disabled' : ''}>Tukar</button>
            <button style="background:#10b981; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;" onclick="KKA.bab2.bubble.action(false)" ${this.sortedIdx <= 1 ? 'disabled' : ''}>Tetap</button>
          </div>
          <button style="background:transparent; border:1px solid #ccc; padding:10px; cursor:pointer; border-radius:8px; margin-top:10px;" onclick="KKA.bab2.hint(-5)">Hint 💡</button>
        </div>
      `;
    },
    reset() { this.init(); }
  },

  selection: {
    arr: [],
    sortedIdx: 0,
    
    init() {
      this.arr = Array.from({length: 6}, () => Math.floor(Math.random() * 90) + 10);
      this.sortedIdx = 0;
      this.render();
    },

    selectMin(idx) {
      if (idx < this.sortedIdx) return;
      
      let minIdx = this.sortedIdx;
      for (let i = this.sortedIdx + 1; i < this.arr.length; i++) {
        if (this.arr[i] < this.arr[minIdx]) minIdx = i;
      }
      
      if (idx === minIdx) {
        KKA.audio.playClick();
        const temp = this.arr[this.sortedIdx];
        this.arr[this.sortedIdx] = this.arr[idx];
        this.arr[idx] = temp;
        this.sortedIdx++;
        this.render();
        
        if (this.sortedIdx >= this.arr.length - 1) {
          this.sortedIdx = this.arr.length;
          this.render();
          KKA.audio.playCorrect();
          setTimeout(() => {
            KKA.bab2.showCompletion('selection-content', 'Selection Sort', 'selection-sniper', 'Selection Sniper');
          }, 1000);
        }
      } else {
        KKA.audio.playWrong();
        KKA.ui.showNotification(\`Salah! Nilai terkecil adalah \${this.arr[minIdx]}\`, 'error');
      }
    },

    render() {
      const container = document.getElementById('selection-content');
      container.innerHTML = `
        <div style="background:white; padding:20px; border-radius:12px; text-align:center;">
          <h4>Selection Sort: Cari nilai terkecil dari sisa data, lalu pindahkan.</h4>
          <p>Klik kotak dengan nilai TERKECIL di area ungu (belum terurut).</p>
          <div style="display:flex; justify-content:center; gap:10px; margin:20px 0; flex-wrap:wrap;">
            ${this.arr.map((val, idx) => {
              const isSorted = idx < this.sortedIdx;
              return \`
              <div onclick="KKA.bab2.selection.selectMin(\${idx})" style="width:60px; height:60px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.5em; font-weight:bold; cursor:\${isSorted ? 'default' : 'pointer'}; background:\${isSorted ? '#10b981' : '#a855f7'}; color:white; transition:0.3s;">
                \${val}
              </div>
            \`}).join('')}
          </div>
          <button style="background:transparent; border:1px solid #ccc; padding:10px; cursor:pointer; border-radius:8px;" onclick="KKA.bab2.hint(-5)">Hint 💡</button>
        </div>
      `;
    },
    reset() { this.init(); }
  },

  insertion: {
    arr: [],
    sortedCount: 1,
    
    init() {
      this.arr = Array.from({length: 6}, () => Math.floor(Math.random() * 90) + 10);
      this.sortedCount = 1;
      this.render();
    },

    insertAt(targetPos) {
      const val = this.arr[this.sortedCount];
      let correctPos = this.sortedCount;
      while (correctPos > 0 && this.arr[correctPos - 1] > val) {
        correctPos--;
      }
      
      if (targetPos === correctPos) {
        KKA.audio.playClick();
      } else {
        KKA.audio.playWrong();
        KKA.ui.showNotification(\`Salah posisi! Seharusnya di posisi \${correctPos}\`, 'error');
      }
      
      // Move element
      this.arr.splice(this.sortedCount, 1);
      this.arr.splice(correctPos, 0, val);
      this.sortedCount++;
      
      this.render();
      
      if (this.sortedCount >= this.arr.length) {
        KKA.audio.playCorrect();
        setTimeout(() => {
          KKA.bab2.showCompletion('insertion-content', 'Insertion Sort', 'insertion-ace', 'Insertion Ace');
        }, 1000);
      }
    },

    render() {
      const container = document.getElementById('insertion-content');
      if (this.sortedCount >= this.arr.length) {
        container.innerHTML = `
          <div style="background:white; padding:20px; border-radius:12px; text-align:center;">
            <h4>Selesai!</h4>
            <div style="display:flex; justify-content:center; gap:10px; margin:20px 0;">
              ${this.arr.map(val => \`<div style="width:50px; height:70px; background:#10b981; color:white; border-radius:4px; display:flex; align-items:center; justify-content:center; font-weight:bold;">\${val}</div>\`).join('')}
            </div>
          </div>
        `;
        return;
      }

      const activeVal = this.arr[this.sortedCount];
      
      let sortedHTML = '';
      for (let i = 0; i <= this.sortedCount; i++) {
        sortedHTML += \`<button style="background:transparent; border:2px dashed #ccc; width:20px; cursor:pointer;" onclick="KKA.bab2.insertion.insertAt(\${i})">+</button>\`;
        if (i < this.sortedCount) {
          sortedHTML += \`<div style="width:50px; height:70px; background:#10b981; color:white; border-radius:4px; display:flex; align-items:center; justify-content:center; font-weight:bold;">\${this.arr[i]}</div>\`;
        }
      }

      container.innerHTML = `
        <div style="background:white; padding:20px; border-radius:12px; text-align:center;">
          <h4>Insertion Sort: Sisipkan kartu ke posisi yang tepat.</h4>
          <p>Klik tanda <code>+</code> untuk menyisipkan <strong style="color:#ef4444; font-size:1.2em;">\${activeVal}</strong></p>
          <div style="display:flex; justify-content:center; gap:5px; margin:20px 0; min-height:80px; align-items:center;">
            ${sortedHTML}
          </div>
          <div style="display:flex; justify-content:center; gap:10px; opacity:0.5; margin-top:20px;">
            ${this.arr.slice(this.sortedCount + 1).map(val => \`<div style="width:40px; height:60px; background:#a855f7; color:white; border-radius:4px; display:flex; align-items:center; justify-content:center;">\${val}</div>\`).join('')}
          </div>
          <button style="background:transparent; border:1px solid #ccc; padding:10px; cursor:pointer; border-radius:8px; margin-top:10px;" onclick="KKA.bab2.hint(-5)">Hint 💡</button>
        </div>
      `;
    },
    reset() { this.init(); }
  }
};
