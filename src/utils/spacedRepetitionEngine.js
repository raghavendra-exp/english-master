/**
 * spacedRepetitionEngine.js
 * Leitner 5-Box Spaced Repetition Algorithm
 * Intervals:
 *   Box 1: Review in 1 day
 *   Box 2: Review in 3 days
 *   Box 3: Review in 7 days
 *   Box 4: Review in 15 days
 *   Box 5: Review in 30 days (Mastered)
 */

const STORAGE_KEY_SRS = 'em_srs_cards_v1';

export const spacedRepetitionEngine = {
  getCards() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SRS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  saveCards(cards) {
    try {
      localStorage.setItem(STORAGE_KEY_SRS, JSON.stringify(cards));
    } catch (e) {}
  },

  getBoxIntervalDays(box) {
    switch (box) {
      case 1: return 1;
      case 2: return 3;
      case 3: return 7;
      case 4: return 15;
      case 5: return 30;
      default: return 1;
    }
  },

  processCardResponse(cardId, isCorrect, cardMeta = {}) {
    const cards = this.getCards();
    const now = Date.now();
    const current = cards[cardId] || {
      id: cardId,
      box: 1,
      totalReviews: 0,
      consecutiveCorrect: 0,
      lastReviewed: now,
      nextReviewDate: now,
      ...cardMeta
    };

    current.totalReviews += 1;
    current.lastReviewed = now;

    if (isCorrect) {
      current.consecutiveCorrect += 1;
      if (current.box < 5) {
        current.box += 1;
      }
    } else {
      current.consecutiveCorrect = 0;
      current.box = 1; // Demote back to Box 1 for immediate consolidation
    }

    const intervalDays = this.getBoxIntervalDays(current.box);
    current.nextReviewDate = now + intervalDays * 24 * 60 * 60 * 1000;

    cards[cardId] = current;
    this.saveCards(cards);
    return current;
  },

  getDueCards() {
    const cards = this.getCards();
    const now = Date.now();
    return Object.values(cards).filter(card => card.nextReviewDate <= now);
  },

  getBoxDistribution() {
    const cards = this.getCards();
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    Object.values(cards).forEach(c => {
      dist[c.box] = (dist[c.box] || 0) + 1;
    });
    return dist;
  }
};
