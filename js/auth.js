window.KKA = window.KKA || {};

KKA.auth = {
  supabase: null,
  mode: 'login', // 'login' or 'register'
  user: null,
  offlineUser: null,
  
  async init() {
    if (KKA.config.SUPABASE_URL && KKA.config.SUPABASE_ANON_KEY) {
      if (window.supabase) {
        this.supabase = window.supabase.createClient(KKA.config.SUPABASE_URL, KKA.config.SUPABASE_ANON_KEY);
        try {
          const { data: { session } } = await this.supabase.auth.getSession();
          this.user = session ? session.user : null;

          if (this.user) {
            try {
              await this.ensureStudentProfile();
            } catch (error) {
              console.error('Student session rejected:', error);
              this.user = null;
              await this.supabase.auth.signOut();
            }
          }

          this.supabase.auth.onAuthStateChange((event, nextSession) => {
            this.user = nextSession ? nextSession.user : null;
            if (event === 'SIGNED_IN' && this.user) {
              this.ensureStudentProfile()
                .then(() => KKA.ui.showScreen('screen-dashboard'))
                .catch(async error => {
                  this.showError(error.message);
                  await this.supabase.auth.signOut();
                });
            }
            if (event === 'SIGNED_OUT') {
              this.offlineUser = null;
              localStorage.removeItem('kka-user');
              KKA.ui.showScreen('screen-landing');
            }
          });
        } catch(e) {
          console.error("Supabase init error:", e);
        }
      }
    }
    
    // Check offline user
    const savedOffline = localStorage.getItem('kka-user');
    if (savedOffline && !this.supabase) {
      try {
        this.offlineUser = JSON.parse(savedOffline);
      } catch(e){}
    }
  },
  
  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    const regFields = document.getElementById('auth-register-fields');
    const title = document.getElementById('auth-title');
    const btn = document.getElementById('auth-submit-btn');
    const switchLink = document.getElementById('auth-switch-link');
    
    if (this.mode === 'register') {
      regFields.style.display = 'block';
      title.innerText = 'Daftar';
      btn.innerText = 'Daftar';
      switchLink.innerText = 'Masuk di sini';
    } else {
      regFields.style.display = 'none';
      title.innerText = 'Masuk';
      btn.innerText = 'Masuk';
      switchLink.innerText = 'Daftar di sini';
    }
    document.getElementById('auth-error').style.display = 'none';
  },
  
  showError(msg) {
    const err = document.getElementById('auth-error');
    err.innerText = msg;
    err.style.display = 'block';
  },
  
  async handleSubmit() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    
    if (!email || !password) {
      return this.showError('Email dan password wajib diisi');
    }
    
    if (!this.supabase) {
      // Offline fallback
      let nama = 'Siswa';
      let kelas = '';
      if (this.mode === 'register') {
        nama = document.getElementById('auth-nama').value.trim() || 'Siswa';
        kelas = document.getElementById('auth-kelas').value.trim();
      }
      this.offlineLogin(nama, kelas);
      return;
    }
    
    try {
      if (this.mode === 'login') {
        await this.login(email, password);
      } else {
        const nama = document.getElementById('auth-nama').value.trim();
        const kelas = document.getElementById('auth-kelas').value.trim();
        if (!nama) return this.showError('Nama wajib diisi');
        await this.register(nama, kelas, email, password);
      }
    } catch(e) {
      this.showError(e.message || 'Terjadi kesalahan');
    }
  },
  
  async login(email, password) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.user = data.user;
    await this.ensureStudentProfile();
    await KKA.state.loadFromSupabase();
    KKA.ui.showScreen('screen-dashboard');
  },

  async ensureStudentProfile() {
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .select('nama, kelas, role')
      .eq('id', this.user.id)
      .maybeSingle();

    if (error) throw new Error(`Profile siswa tidak dapat dibaca: ${error.message}`);
    if (!profile) throw new Error('Akun belum memiliki profile siswa. Jalankan trigger atau query repair Supabase.');
    if (profile.role !== 'siswa') throw new Error('Akun ini bukan akun siswa. Gunakan halaman login yang sesuai.');

    this.offlineUser = { nama: profile.nama, kelas: profile.kelas };
    localStorage.setItem('kka-user', JSON.stringify(this.offlineUser));
    return profile;
  },
  
  async register(nama, kelas, email, password) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nama, kelas }
      }
    });
    if (error) throw error;
    this.user = data.user;

    if (!this.user) {
      throw new Error('Pendaftaran gagal. Akun belum dibuat oleh Supabase.');
    }

    if (!data.session) {
      this.offlineUser = { nama, kelas };
      localStorage.setItem('kka-user', JSON.stringify(this.offlineUser));
      this.showError('Akun berhasil dibuat. Silakan cek email untuk konfirmasi sebelum masuk.');
      return;
    }
    
    this.offlineUser = { nama, kelas };
    localStorage.setItem('kka-user', JSON.stringify(this.offlineUser));
    KKA.ui.showScreen('screen-dashboard');
  },
  
  async logout() {
    if (this.supabase) {
      await this.supabase.auth.signOut();
    }
    this.user = null;
    this.offlineUser = null;
    localStorage.removeItem('kka-user');
    KKA.state.data = {
      xp: 0, level: 1, combo: 0, maxCombo: 0, badges: [],
      bab1: { completed: false, correct: 0, total: 10, scenarios: [] },
      bab2: { stack: false, queue: false, array: false, linear: false, binary: false, bubble: false, selection: false, insertion: false },
      bab3: { completed: false, levelsCompleted: [] },
      bab4: { completed: false, correct: 0, total: 6, puzzles: [] }
    };
    KKA.state.saveLocal();
    KKA.ui.showScreen('screen-landing');
  },
  
  getUser() {
    return this.user;
  },
  
  isLoggedIn() {
    return !!this.user || !!this.offlineUser;
  },
  
  offlineLogin(nama, kelas) {
    this.offlineUser = { nama, kelas };
    localStorage.setItem('kka-user', JSON.stringify(this.offlineUser));
    KKA.ui.showNotification('Mode Offline: Data disimpan secara lokal', 'info');
    KKA.ui.showScreen('screen-dashboard');
  }
};
