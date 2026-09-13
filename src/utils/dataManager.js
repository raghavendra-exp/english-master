/**
 * dataManager.js
 * Centralized client-side state coordinator using localStorage.
 * Zero-backend architecture with full offline capability and JSON backup/sync.
 */

const STORAGE_KEYS = {
  USER_STATS: 'em_user_stats_v1',
  MISTAKES_BOOK: 'em_mistakes_book_v1',
  BOOKMARKS: 'em_bookmarks_v1',
  NOTES: 'em_notes_v1',
  MOCK_HISTORY: 'em_mock_history_v1',
  PRACTICE_HISTORY: 'em_practice_history_v1',
  CONFIDENCE_LOGS: 'em_confidence_logs_v1',
  SETTINGS: 'em_settings_v1',
  STUDY_PROGRESS: 'em_study_progress_v1'
};

export const dataManager = {
  // --- USER STATS, STREAKS & XP ---
  getUserStats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_STATS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error("Failed to load user stats", e);
    }
    return {
      xp: 0,
      level: 1,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalQuestionsAttempted: 0,
      totalCorrect: 0,
      totalTimeSpentSeconds: 0,
      badges: ['Novice Scholar']
    };
  },

  saveUserStats(stats) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error("Failed to save user stats", e);
    }
  },

  addXP(points) {
    const stats = this.getUserStats();
    stats.xp = (stats.xp || 0) + points;
    // Level calculation: Every 250 XP is 1 level
    const newLevel = Math.floor(stats.xp / 250) + 1;
    if (newLevel > stats.level) {
      stats.level = newLevel;
    }
    this.checkAndUpdateStreak(stats);
    this.saveUserStats(stats);
    return stats;
  },

  checkAndUpdateStreak(stats) {
    const today = new Date().toISOString().split('T')[0];
    if (!stats.lastActiveDate) {
      stats.lastActiveDate = today;
      stats.streak = 1;
      return;
    }
    if (stats.lastActiveDate === today) {
      return; // Already active today
    }
    
    const lastDate = new Date(stats.lastActiveDate);
    const currentDate = new Date(today);
    const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      stats.streak = (stats.streak || 0) + 1;
      if (stats.streak === 7 && !stats.badges.includes('7-Day Streak Master')) {
        stats.badges.push('7-Day Streak Master');
      }
    } else if (diffDays > 1) {
      stats.streak = 1; // Reset streak
    }
    stats.lastActiveDate = today;
  },

  // --- PRACTICE & ATTEMPT LOGGING ---
  recordAttempt(questionId, topicId, isCorrect, timeSpentSec, confidence = 'Fairly sure', mistakeType = null) {
    const stats = this.getUserStats();
    stats.totalQuestionsAttempted = (stats.totalQuestionsAttempted || 0) + 1;
    if (isCorrect) {
      stats.totalCorrect = (stats.totalCorrect || 0) + 1;
    }
    stats.totalTimeSpentSeconds = (stats.totalTimeSpentSeconds || 0) + timeSpentSec;
    this.saveUserStats(stats);

    // Save confidence log
    const confidenceLogs = this.getConfidenceLogs();
    confidenceLogs.push({
      questionId,
      topicId,
      confidence,
      isCorrect,
      timestamp: Date.now()
    });
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIDENCE_LOGS, JSON.stringify(confidenceLogs.slice(-500)));
    } catch (e) {}

    // Save practice history
    const history = this.getPracticeHistory();
    if (!history[topicId]) {
      history[topicId] = { attempted: 0, correct: 0, totalTime: 0 };
    }
    history[topicId].attempted += 1;
    if (isCorrect) history[topicId].correct += 1;
    history[topicId].totalTime += timeSpentSec;
    try {
      localStorage.setItem(STORAGE_KEYS.PRACTICE_HISTORY, JSON.stringify(history));
    } catch (e) {}

    // Auto-record to Mistakes Book if incorrect
    if (!isCorrect) {
      this.recordMistake(questionId, topicId, mistakeType || 'Careless Error');
    }
  },

  getPracticeHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRACTICE_HISTORY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  getConfidenceLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONFIDENCE_LOGS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // --- MY ERROR BOOK (MISTAKES NOTEBOOK) ---
  getMistakes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISTAKES_BOOK);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  recordMistake(questionId, topicId, mistakeCategory = 'Concept Error', notes = '') {
    const mistakes = this.getMistakes();
    const existingIndex = mistakes.findIndex(m => m.questionId === questionId);
    const entry = {
      questionId,
      topicId,
      mistakeCategory, // 'Concept Error', 'Vocabulary Error', 'Careless Error', 'Time-pressure Error', 'Misreading', 'Guess'
      notes,
      timestamp: Date.now(),
      revised: false
    };

    if (existingIndex >= 0) {
      mistakes[existingIndex] = { ...mistakes[existingIndex], ...entry, repeatCount: (mistakes[existingIndex].repeatCount || 1) + 1 };
    } else {
      mistakes.unshift({ ...entry, repeatCount: 1 });
    }
    try {
      localStorage.setItem(STORAGE_KEYS.MISTAKES_BOOK, JSON.stringify(mistakes));
    } catch (e) {}
  },

  markMistakeRevised(questionId) {
    const mistakes = this.getMistakes();
    const item = mistakes.find(m => m.questionId === questionId);
    if (item) {
      item.revised = true;
      try {
        localStorage.setItem(STORAGE_KEYS.MISTAKES_BOOK, JSON.stringify(mistakes));
      } catch (e) {}
    }
  },

  removeMistake(questionId) {
    const mistakes = this.getMistakes().filter(m => m.questionId !== questionId);
    try {
      localStorage.setItem(STORAGE_KEYS.MISTAKES_BOOK, JSON.stringify(mistakes));
    } catch (e) {}
  },

  // --- BOOKMARKS & NOTES ---
  getBookmarks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  toggleBookmark(item) {
    const bookmarks = this.getBookmarks();
    const idx = bookmarks.findIndex(b => b.id === item.id);
    if (idx >= 0) {
      bookmarks.splice(idx, 1);
    } else {
      bookmarks.unshift({ ...item, savedAt: Date.now() });
    }
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {}
    return idx < 0; // returns true if now bookmarked
  },

  isBookmarked(id) {
    const bookmarks = this.getBookmarks();
    return bookmarks.some(b => b.id === id);
  },

  getNotes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  saveNote(targetId, noteText) {
    const notes = this.getNotes();
    if (!noteText.trim()) {
      delete notes[targetId];
    } else {
      notes[targetId] = { text: noteText, updatedAt: Date.now() };
    }
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {}
  },

  // --- MOCK TEST HISTORY ---
  saveMockResult(mockResult) {
    try {
      const history = this.getMockHistory();
      history.unshift({ ...mockResult, date: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEYS.MOCK_HISTORY, JSON.stringify(history.slice(0, 30)));
    } catch (e) {
      console.error("Failed to save mock result", e);
    }
  },

  getMockHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOCK_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // --- SETTINGS (Language, Theme, Sound) ---
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {
      language: 'en', // 'en' or 'hi'
      theme: 'light', // 'light' or 'dark'
      soundEffects: true,
      hintsEnabled: true,
      highContrast: false,
      reduceMotion: false
    };
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {}
  },

  // --- 1-CLICK BACKUP & RESTORE ---
  exportAllData() {
    const dump = {
      version: '2026.09',
      exportDate: new Date().toISOString(),
      userStats: this.getUserStats(),
      mistakes: this.getMistakes(),
      bookmarks: this.getBookmarks(),
      notes: this.getNotes(),
      mockHistory: this.getMockHistory(),
      practiceHistory: this.getPracticeHistory(),
      confidenceLogs: this.getConfidenceLogs(),
      settings: this.getSettings()
    };
    return JSON.stringify(dump, null, 2);
  },

  importAllData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.userStats) localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(data.userStats));
      if (data.mistakes) localStorage.setItem(STORAGE_KEYS.MISTAKES_BOOK, JSON.stringify(data.mistakes));
      if (data.bookmarks) localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(data.bookmarks));
      if (data.notes) localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.notes));
      if (data.mockHistory) localStorage.setItem(STORAGE_KEYS.MOCK_HISTORY, JSON.stringify(data.mockHistory));
      if (data.practiceHistory) localStorage.setItem(STORAGE_KEYS.PRACTICE_HISTORY, JSON.stringify(data.practiceHistory));
      if (data.confidenceLogs) localStorage.setItem(STORAGE_KEYS.CONFIDENCE_LOGS, JSON.stringify(data.confidenceLogs));
      if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      return { success: true, message: "All data successfully restored!" };
    } catch (e) {
      return { success: false, message: "Invalid backup JSON file." };
    }
  }
};
