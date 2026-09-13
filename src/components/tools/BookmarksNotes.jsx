import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, BookOpen, FileText, ArrowRight } from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function BookmarksNotes({ onNavigate }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    setBookmarks(dataManager.getBookmarks());
    setNotes(dataManager.getNotes());
  }, []);

  const handleRemoveBookmark = (id) => {
    dataManager.toggleBookmark({ id });
    setBookmarks(dataManager.getBookmarks());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Personal Repository
          </span>
          <span className="text-xs text-slate-400">• {bookmarks.length} Bookmarks</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
          Bookmarks & Personal Study Notes
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Access your saved questions, grammar rules, vocabulary words, and annotations.
        </p>
      </div>

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-3">
          <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h2 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No bookmarks saved yet
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark ribbon icon on any question, grammar rule, or vocabulary card to review it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4 hover:border-amber-300 dark:hover:border-amber-700 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {b.type || 'Saved Item'}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {b.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {b.snippet}
                </p>
              </div>

              <button
                onClick={() => handleRemoveBookmark(b.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 transition"
                title="Remove Bookmark"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
