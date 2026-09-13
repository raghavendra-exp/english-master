import React, { useState } from 'react';
import { 
  Compass, CheckCircle2, Circle, ArrowRight, 
  Sparkles, Award, BookOpen, Clock 
} from 'lucide-react';

export default function StudyRoadmaps({ allData = {}, onNavigate }) {
  const studyPlans = allData.studyPlans || {};
  const [activePlan, setActivePlan] = useState('startFromZero');
  const [completedDays, setCompletedDays] = useState(() => {
    try {
      const saved = localStorage.getItem('em_completed_days_v1');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const toggleDayComplete = (dayId) => {
    const updated = { ...completedDays, [dayId]: !completedDays[dayId] };
    setCompletedDays(updated);
    try {
      localStorage.setItem('em_completed_days_v1', JSON.stringify(updated));
    } catch (e) {}
  };

  const currentPlanData = studyPlans[activePlan] || studyPlans.startFromZero;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Curriculum Roadmap
            </span>
            <span className="text-xs text-slate-400">• Day-by-Day Guides</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Study Roadmaps & Study Plans
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Step-by-step sequential progressions designed to guide beginners to competitive banking exam readiness.
          </p>
        </div>

        {/* Plan Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
          <button
            onClick={() => setActivePlan('startFromZero')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activePlan === 'startFromZero'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Start From Zero (14-Day)
          </button>
          <button
            onClick={() => setActivePlan('thirtyDayPlan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activePlan === 'thirtyDayPlan'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            30-Day Comprehensive Plan
          </button>
        </div>
      </div>

      {/* Plan Details Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            {currentPlanData?.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {currentPlanData?.description}
          </p>
        </div>

        {/* Start From Zero Days Grid */}
        {activePlan === 'startFromZero' && (
          <div className="space-y-3">
            {(currentPlanData?.days || []).map((d) => {
              const isDone = !!completedDays[`zero_day_${d.day}`];
              return (
                <div
                  key={d.day}
                  onClick={() => toggleDayComplete(`zero_day_${d.day}`)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                    isDone 
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800' 
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isDone ? 'bg-emerald-600 text-white' : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    }`}>
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : `D${d.day}`}
                    </div>

                    <div>
                      <h3 className={`font-bold text-xs sm:text-sm ${isDone ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                        {d.topic}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {d.tasks}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    isDone ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {isDone ? 'Done' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* 30-Day Phases */}
        {activePlan === 'thirtyDayPlan' && (
          <div className="space-y-4">
            {(currentPlanData?.phases || []).map((ph, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                    {ph.phase}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                    {ph.focus}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>Mastery Goal:</strong> {ph.goal}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
