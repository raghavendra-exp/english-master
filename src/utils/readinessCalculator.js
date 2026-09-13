/**
 * readinessCalculator.js
 * Multi-factor algorithmic evaluation of a student's readiness for SBI/IBPS/RRB English.
 * Evaluates: Grammar, Lexicon, Comprehension, Mock Percentiles, and Pacing.
 */

import { dataManager } from './dataManager';

export const readinessCalculator = {
  calculateScore() {
    const stats = dataManager.getUserStats();
    const history = dataManager.getPracticeHistory();
    const mockHistory = dataManager.getMockHistory();
    const mistakes = dataManager.getMistakes();

    let score = 0;

    // 1. Overall Practice Volume & Accuracy (Max 35 points)
    const attempts = stats.totalQuestionsAttempted || 0;
    const correct = stats.totalCorrect || 0;
    const accuracy = attempts > 0 ? (correct / attempts) : 0;

    if (attempts >= 100) score += 15;
    else score += (attempts / 100) * 15;

    score += accuracy * 20; // up to 20 pts for 100% accuracy

    // 2. Syllabus Topic Breadth (Max 25 points)
    const topicsTracked = Object.keys(history);
    const minBreadth = Math.min(topicsTracked.length, 8);
    score += (minBreadth / 8) * 15;

    // Quality of performance across high-yield topics
    let highYieldScores = 0;
    let highYieldCount = 0;
    ['error-detection', 'reading-comprehension', 'cloze-test', 'fillers'].forEach(top => {
      if (history[top] && history[top].attempted >= 5) {
        highYieldScores += (history[top].correct / history[top].attempted);
        highYieldCount++;
      }
    });
    if (highYieldCount > 0) {
      score += (highYieldScores / highYieldCount) * 10;
    }

    // 3. Mock Test Benchmark (Max 25 points)
    if (mockHistory.length > 0) {
      const latestMock = mockHistory[0];
      const mockPct = latestMock.percentage || 0;
      score += (mockPct / 100) * 20;
      if (mockHistory.length >= 3) score += 5; // Bonus for taking multiple mocks
    } else {
      score += 5; // Base starting credit
    }

    // 4. Mistakes Resolution / Error Book Revision (Max 15 points)
    const totalMistakes = mistakes.length;
    const revisedMistakes = mistakes.filter(m => m.revised).length;
    if (totalMistakes > 0) {
      score += (revisedMistakes / totalMistakes) * 15;
    } else if (attempts >= 20) {
      score += 15; // Clean sheet with significant practice
    } else {
      score += 8;
    }

    const finalScore = Math.min(100, Math.max(10, Math.round(score)));
    return {
      score: finalScore,
      tier: this.getTier(finalScore),
      breakdown: {
        accuracy: Math.round(accuracy * 100),
        attempts,
        topicsCovered: topicsTracked.length,
        mocksAttempted: mockHistory.length,
        unrevisedMistakes: totalMistakes - revisedMistakes
      }
    };
  },

  getTier(score) {
    if (score < 41) return { label: 'Beginner', badgeColor: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300', advice: 'Focus on Grammar Foundation rules and 10 daily vocabulary words.' };
    if (score < 61) return { label: 'Developing', badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300', advice: 'Practice Error Detection Scanner and Double Fillers with elimination techniques.' };
    if (score < 81) return { label: 'Good', badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', advice: 'Take full timed Prelims mocks and train on RC Speed reading challenges.' };
    if (score < 91) return { label: 'Strong', badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', advice: 'Fine-tune subtle traps in Mains Cloze Tests and 6-Sentence Para Jumbles.' };
    return { label: 'Exam Ready', badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300', advice: 'Excellent! Maintain daily speed drills and review your Error Book before exam day.' };
  },

  getTopicDiagnosis() {
    const history = dataManager.getPracticeHistory();
    const topicList = Object.entries(history).map(([topicId, data]) => {
      const acc = data.attempted > 0 ? (data.correct / data.attempted) * 100 : 0;
      return { topicId, ...data, accuracy: Math.round(acc) };
    });

    if (topicList.length === 0) {
      return { weakest: null, strongest: null, topicList: [] };
    }

    topicList.sort((a, b) => a.accuracy - b.accuracy);
    return {
      weakest: topicList[0],
      strongest: topicList[topicList.length - 1],
      topicList
    };
  },

  generateStudyPlan(durationMinutes = 45) {
    const { weakest } = this.getTopicDiagnosis();
    const weakTopic = weakest ? weakest.topicId : 'error-detection';

    switch (durationMinutes) {
      case 15:
        return [
          { time: '5 mins', activity: 'Vocabulary Power: 5 Editorial Words & Etymology', icon: 'BookOpen' },
          { time: '7 mins', activity: `Weakness Drill: 5 Questions on ${weakTopic}`, icon: 'Target' },
          { time: '3 mins', activity: 'Speed Lab: 20-second Rapid Fire Blitz', icon: 'Zap' }
        ];
      case 30:
        return [
          { time: '8 mins', activity: 'Grammar Rule Mastery: Subject-Verb & Inversion', icon: 'Book' },
          { time: '10 mins', activity: 'Error Detection Scanner: Clickable 5-segment drills', icon: 'Search' },
          { time: '7 mins', activity: 'Cloze Test Lab: 1 Complete Multi-blank passage', icon: 'FileText' },
          { time: '5 mins', activity: 'Review 3 mistakes from My Error Book', icon: 'AlertCircle' }
        ];
      case 60:
        return [
          { time: '15 mins', activity: 'Reading Comprehension Lab: 1 Banking Article + WPM Speed Test', icon: 'Compass' },
          { time: '15 mins', activity: 'Grammar & Syntax: Conditionals and Non-Finite Verbs', icon: 'Book' },
          { time: '15 mins', activity: 'Para Jumbles: Drag-and-Drop 5-sentence sequence ordering', icon: 'Move' },
          { time: '10 mins', activity: 'Full Forms & Idioms: Leitner Spaced Repetition deck', icon: 'Layers' },
          { time: '5 mins', activity: 'Record and classify any new mistakes in Error Book', icon: 'CheckCircle' }
        ];
      case 90:
      case 120:
      default:
        return [
          { time: '20 mins', activity: 'Full 30-Question Prelims Mock Simulation with negative marking', icon: 'Award' },
          { time: '15 mins', activity: 'Post-Mock Scorecard & Question-by-Question Diagnostic Review', icon: 'BarChart2' },
          { time: '20 mins', activity: 'RC Deep-Dive: 2 Financial Passages (Tone, Inference, Theme)', icon: 'BookOpen' },
          { time: '15 mins', activity: 'Advanced Error Scanner: Modifiers, Parallelism & Redundancy', icon: 'Search' },
          { time: '10 mins', activity: 'Editorial Word Power: Collocations and Confusing Words', icon: 'Layers' },
          { time: '10 mins', activity: 'Speed Lab Blitz & Spaced Repetition Card Consolidation', icon: 'Zap' }
        ];
    }
  },

  analyzeConfidenceAccuracy() {
    const logs = dataManager.getConfidenceLogs();
    if (logs.length === 0) return null;

    let overconfident = 0; // High confidence but wrong
    let underconfident = 0; // Guessing/unsure but correct
    let calibratedCorrect = 0; // High confidence and correct
    let calibratedIncorrect = 0; // Guessing and wrong

    logs.forEach(log => {
      const isHighConf = log.confidence === 'Very sure' || log.confidence === 'Fairly sure';
      if (isHighConf && !log.isCorrect) overconfident++;
      else if (!isHighConf && log.isCorrect) underconfident++;
      else if (isHighConf && log.isCorrect) calibratedCorrect++;
      else calibratedIncorrect++;
    });

    const total = logs.length;
    return {
      total,
      overconfidentCount: overconfident,
      overconfidentRate: Math.round((overconfident / total) * 100),
      underconfidentCount: underconfident,
      underconfidentRate: Math.round((underconfident / total) * 100),
      calibratedRate: Math.round(((calibratedCorrect + calibratedIncorrect) / total) * 100)
    };
  }
};
