window.KKA = window.KKA || {};

KKA.ui = {
  currentScreen: 'screen-landing',
  
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) {
      screen.classList.add('active');
      this.currentScreen = screenId;
    }
    
    if (screenId === 'screen-dashboard') this.updateDashboard();
    if (screenId === 'screen-bab2-hub') this.updateBab2Hub();
    if (screenId === 'screen-trophy') this.updateTrophyRoom();
    
    // Call init hooks if available in bab modules
    if (screenId.startsWith('screen-bab') && window.KKA[screenId.split('-')[1]]) {
      const bab = window.KKA[screenId.split('-')[1]];
      if (typeof bab.init === 'function') bab.init();
    }
  },
  
  showNotification(text, type='info') {
    const notif = document.getElementById('notification');
    notif.innerText = text;
    let color = 'var(--primary)';
    if(type === 'success') color = 'var(--secondary)';
    if(type === 'error') color = 'var(--danger)';
    if(type === 'xp') color = 'var(--accent)';
    
    notif.style.borderLeft = `4px solid ${color}`;
    notif.classList.add('show');
    
    setTimeout(() => {
      notif.classList.remove('show');
    }, 3000);
  },
  
  showBadgeUnlock(badge) {
    const modal = document.getElementById('badge-modal');
    const content = document.getElementById('badge-modal-content');
    
    content.innerHTML = `
      <div style="font-size: 4rem; margin-bottom: 10px;">${badge.emoji}</div>
      <h3>Badge Baru Terbuka!</h3>
      <h2 style="color: var(--accent); margin: 10px 0;">${badge.name}</h2>
      <p>${badge.desc}</p>
    `;
    
    modal.style.display = 'flex';
    if(KKA.audio) KKA.audio.playBadge();
    this.showConfetti();
  },
  
  closeModal() {
    document.getElementById('badge-modal').style.display = 'none';
  },
  
  showConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#A29BFE'];
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 3 + 2,
        vx: Math.random() * 2 - 1,
        rot: Math.random() * 360,
        vrot: Math.random() * 5 - 2.5
      });
    }
    
    let req;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      
      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.vrot;
        if (p.y < canvas.height) active = true;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      
      if (active) {
        req = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    draw();
    setTimeout(() => {
      cancelAnimationFrame(req);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 3000);
  },
  
  toggleTheme() {
    const html = document.documentElement;
    const btn = document.getElementById('theme-toggle');
    const current = html.getAttribute('data-theme') || 'dark';
    
    if (current === 'dark') {
      html.setAttribute('data-theme', 'light');
      btn.innerText = '☀️';
      localStorage.setItem('kka-theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      btn.innerText = '🌙';
      localStorage.setItem('kka-theme', 'dark');
    }
  },
  
  updateDashboard() {
    if (!KKA.auth || !KKA.state) return;
    
    const user = KKA.auth.offlineUser || { nama: 'Siswa', kelas: '' };
    document.getElementById('dash-nama').innerText = user.nama;
    document.getElementById('dash-kelas').innerText = user.kelas;
    
    const levelConfig = KKA.state.getLevel();
    document.getElementById('dash-level').innerText = levelConfig.name + ' ' + levelConfig.emoji;
    document.getElementById('dash-xp').innerText = KKA.state.data.xp;
    
    const progress = KKA.state.getLevelProgress();
    document.getElementById('dash-next-level').innerText = progress.next === 'MAX' ? 'Level Maksimal!' : `${progress.next} XP ke level berikutnya`;
    document.getElementById('dash-xp-fill').style.width = `${progress.percentage}%`;
    
    const combo = KKA.state.data.combo;
    const comboEl = document.getElementById('dash-combo');
    if (combo >= 2) {
      comboEl.style.display = 'block';
      document.getElementById('dash-combo-count').innerText = combo;
    } else {
      comboEl.style.display = 'none';
    }
    
    document.getElementById('dash-badge-count').innerText = KKA.state.data.badges.length;
    
    document.getElementById('progress-bab1').style.width = `${KKA.state.getBab1Progress()}%`;
    document.getElementById('progress-bab2').style.width = `${KKA.state.getBab2Progress()}%`;
    document.getElementById('progress-bab3').style.width = `${KKA.state.getBab3Progress()}%`;
    document.getElementById('progress-bab4').style.width = `${KKA.state.getBab4Progress()}%`;
  },
  
  updateBab2Hub() {
    if (!KKA.state) return;
    const d = KKA.state.data.bab2;
    const keys = Object.keys(d);
    keys.forEach(k => {
      const el = document.getElementById(`mg-${k}-status`);
      const card = document.getElementById(`mg-${k}`);
      if (el && d[k]) {
        el.innerText = '✅';
        if (card) card.style.borderLeftColor = 'var(--secondary)';
      }
    });
  },
  
  updateTrophyRoom() {
    if (!KKA.state) return;
    
    const grid = document.getElementById('trophy-grid');
    grid.innerHTML = '';
    
    const unlocked = KKA.state.data.badges;
    document.getElementById('trophy-count').innerText = `${unlocked.length}/${KKA.config.BADGES.length}`;
    
    const pct = (unlocked.length / KKA.config.BADGES.length) * 100;
    document.getElementById('trophy-progress-fill').style.width = `${pct}%`;
    
    KKA.config.BADGES.forEach(b => {
      const isUnlocked = unlocked.includes(b.id);
      const cls = isUnlocked ? 'unlocked' : 'locked';
      grid.innerHTML += `
        <div class="badge-card ${cls}">
          <span class="badge-emoji">${b.emoji}</span>
          <div class="badge-name">${b.name}</div>
          <div class="badge-desc">${b.desc}</div>
        </div>
      `;
    });
  }
};
