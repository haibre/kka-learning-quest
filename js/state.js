window.KKA = window.KKA || {};

KKA.state = {
  data: {
    xp: 0,
    level: 1,
    combo: 0,
    maxCombo: 0,
    badges: [],
    bab1: { completed: false, correct: 0, total: 15, scenarios: [] },
    bab2: { stack: false, queue: false, array: false, linear: false, binary: false, bubble: false, selection: false, insertion: false, bughunter: false, circuit: false, prompt: false },
    bab3: { completed: false, levelsCompleted: [] },
    bab4: { completed: false, correct: 0, total: 6, puzzles: [] }
  },
  saveQueue: Promise.resolve(),
  
  async init() {
    this.loadLocal();
    if (KKA.auth && KKA.auth.isLoggedIn()) {
      await this.loadFromSupabase();
    }
  },
  
  addXP(amount) {
    const oldLevel = this.getLevel().name;
    this.data.xp += amount;
    
    const newLevelConfig = this.getLevel();
    if (newLevelConfig.name !== oldLevel) {
      // Level Up!
      this.data.level = KKA.config.LEVELS.indexOf(newLevelConfig) + 1;
      if (KKA.ui) KKA.ui.showNotification(`Level Up! Kamu sekarang ${newLevelConfig.name} ${newLevelConfig.emoji}`, 'success');
      if (KKA.audio) KKA.audio.playLevelUp();
    } else {
      if (KKA.ui) KKA.ui.showNotification(`+${amount} XP`, 'xp');
    }
    this.save();
    if (KKA.ui) KKA.ui.updateDashboard();
  },
  
  incrementCombo() {
    this.data.combo++;
    if (this.data.combo > this.data.maxCombo) {
      this.data.maxCombo = this.data.combo;
    }
    if (this.data.combo >= 3) {
      this.addXP(KKA.config.XP.COMBO_BONUS);
      if (KKA.audio) KKA.audio.playCombo();
    }
    if (KKA.ui) KKA.ui.updateDashboard();
  },
  
  resetCombo() {
    this.data.combo = 0;
    if (KKA.ui) KKA.ui.updateDashboard();
  },
  
  unlockBadge(badgeId) {
    if (!this.data.badges.includes(badgeId)) {
      this.data.badges.push(badgeId);
      
      const badgeConf = KKA.config.BADGES.find(b => b.id === badgeId);
      if (KKA.ui && badgeConf) KKA.ui.showBadgeUnlock(badgeConf);
      
      // Check legend badge
      const nonLegendBadges = KKA.config.BADGES.filter(b => b.id !== 'kka-legend');
      const hasAll = nonLegendBadges.every(b => this.data.badges.includes(b.id));
      if (hasAll && !this.data.badges.includes('kka-legend')) {
        setTimeout(() => this.unlockBadge('kka-legend'), 4000); // Unlock after a delay
      }
      this.save();
    }
  },
  
  completeActivity(bab, activity) {
    if (bab === 'bab2') {
      this.data.bab2[activity] = true;
    } else if (bab === 'bab3') {
      if (!this.data.bab3.levelsCompleted.includes(activity)) {
        this.data.bab3.levelsCompleted.push(activity);
      }
    }
    this.save();
  },
  
  getLevel() {
    let current = KKA.config.LEVELS[0];
    for (let i = KKA.config.LEVELS.length - 1; i >= 0; i--) {
      if (this.data.xp >= KKA.config.LEVELS[i].minXP) {
        current = KKA.config.LEVELS[i];
        break;
      }
    }
    return current;
  },
  
  getLevelProgress() {
    const levelConfig = this.getLevel();
    const idx = KKA.config.LEVELS.indexOf(levelConfig);
    const nextLevel = KKA.config.LEVELS[idx + 1];
    
    if (!nextLevel) return { current: this.data.xp, next: 'MAX', percentage: 100 };
    
    const range = nextLevel.minXP - levelConfig.minXP;
    const progress = this.data.xp - levelConfig.minXP;
    const percentage = Math.min(100, Math.max(0, (progress / range) * 100));
    
    return {
      current: this.data.xp,
      next: nextLevel.minXP - this.data.xp,
      percentage
    };
  },
  
  saveLocal() {
    localStorage.setItem('kka-progress', JSON.stringify(this.data));
  },
  
  loadLocal() {
    const saved = localStorage.getItem('kka-progress');
    if (saved) {
      try {
        this.data = JSON.parse(saved);
        this.normalizeBab2Progress();
      } catch (e) {
        console.error("Error loading local state", e);
      }
    }
  },

  normalizeBab2Progress() {
    const bab2 = this.data.bab2 || {};
    const legacyKeys = {
      linearsearch: 'linear',
      binarysearch: 'binary',
      bubblesort: 'bubble',
      selectionsort: 'selection',
      insertionsort: 'insertion'
    };

    Object.keys(legacyKeys).forEach(legacyKey => {
      if (bab2[legacyKey] === true) bab2[legacyKeys[legacyKey]] = true;
      delete bab2[legacyKey];
    });

    this.data.bab2 = {
      stack: bab2.stack === true,
      queue: bab2.queue === true,
      array: bab2.array === true,
      linear: bab2.linear === true,
      binary: bab2.binary === true,
      bubble: bab2.bubble === true,
      selection: bab2.selection === true,
      insertion: bab2.insertion === true,
      bughunter: bab2.bughunter === true,
      circuit: bab2.circuit === true,
      prompt: bab2.prompt === true
    };
  },
  
  async saveToSupabase() {
    if (KKA.auth && KKA.auth.isLoggedIn() && KKA.auth.supabase) {
      try {
        const { error } = await KKA.auth.supabase.rpc('save_student_progress', {
          progress_data: this.data
        });
        if (error) throw error;
      } catch (e) {
        console.error('Error saving progress to Supabase:', e);
        if (KKA.ui) KKA.ui.showNotification('Progress belum tersimpan ke server', 'error');
      }
    }
  },
  
  async loadFromSupabase() {
    if (KKA.auth && KKA.auth.isLoggedIn() && KKA.auth.supabase) {
      const user = KKA.auth.getUser();
      try {
        const { data, error } = await KKA.auth.supabase
          .from('progress')
          .select('data')
          .eq('user_id', user.id)
          .single();
        if (data && data.data) {
          this.data = data.data;
          this.normalizeBab2Progress();
          this.saveLocal();
        }
      } catch (e) {
        console.error("Error loading from supabase", e);
      }
    }
  },
  
  save() {
    this.saveLocal();
    this.saveQueue = this.saveQueue
      .catch(() => {})
      .then(() => this.saveToSupabase());
    return this.saveQueue;
  },
  
  load() {
    this.loadLocal();
    this.loadFromSupabase();
  },
  
  getBab1Progress() {
    return (this.data.bab1.correct / this.data.bab1.total) * 100;
  },
  
  getBab2Progress() {
    const keys = ['stack', 'queue', 'array', 'linear', 'binary', 'bubble', 'selection', 'insertion', 'bughunter', 'circuit', 'prompt'];
    const completed = keys.filter(k => this.data.bab2[k] === true).length;
    return (completed / 11) * 100;
  },
  
  getBab3Progress() {
    return (this.data.bab3.levelsCompleted.length / 3) * 100;
  },
  
  getBab4Progress() {
    return (this.data.bab4.correct / this.data.bab4.total) * 100;
  }
};
