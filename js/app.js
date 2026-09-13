window.KKA = window.KKA || {};

KKA.app = {
  async init() {
    // 1. Initialize audio (on first click)
    document.addEventListener('click', () => {
      if (KKA.audio) KKA.audio.init();
    }, { once: true });
    
    // 2. Load theme preference
    const theme = localStorage.getItem('kka-theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      const btn = document.getElementById('theme-toggle');
      if (btn) btn.innerText = theme === 'light' ? '☀️' : '🌙';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // 3. Initialize auth
    if (KKA.auth) await KKA.auth.init();
    
    // 4. Initialize state
    if (KKA.state) await KKA.state.init();
    
    // 5. Create landing particles
    this.createParticles();
    
    // 6. Navigate
    if (KKA.auth && KKA.auth.isLoggedIn()) {
      KKA.ui.showScreen('screen-dashboard');
    }
  },

  createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 10 + 5;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.background = Math.random() > 0.5 ? 'var(--primary)' : 'var(--secondary)';
      p.style.position = 'absolute';
      p.style.borderRadius = '50%';
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.opacity = Math.random() * 0.5 + 0.2;
      p.style.animation = `float ${Math.random() * 3 + 2}s ease-in-out infinite alternate`;
      container.appendChild(p);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  KKA.app.init();
});
