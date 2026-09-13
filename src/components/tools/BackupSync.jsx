import React, { useState } from 'react';
import { 
  Download, Upload, ShieldCheck, CheckCircle2, 
  AlertTriangle, RefreshCw, FileText, Sparkles 
} from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function BackupSync() {
  const [importJson, setImportJson] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  const handleExport = () => {
    const dataStr = dataManager.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `english_master_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setStatusMessage({ type: 'success', text: 'Backup file generated and downloaded successfully!' });
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const res = dataManager.importAllData(importJson);
    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Data successfully restored! Refresh the page to load updated statistics.' });
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Client-Side Privacy & Sync
          </span>
          <span className="text-xs text-slate-400">• 100% Offline</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
          Backup, Restore & Data Sync
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          All your progress, streak, error book records, and bookmarks reside safely in your browser's local storage.
        </p>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200' 
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-900 dark:text-rose-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Backup and Restore Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Export Complete Backup (JSON)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Download your full student profile: bookmarks, error book history, Leitner flashcard boxes, and mock scores as a single portable JSON file.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Backup File
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Restore / Import Backup (JSON)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Paste your exported JSON backup string below to restore your progress across different devices or browsers.
            </p>
          </div>

          <textarea
            placeholder="Paste backup JSON string here..."
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono outline-none text-slate-800 dark:text-slate-200"
          />

          <button
            onClick={handleImport}
            disabled={!importJson.trim()}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 disabled:opacity-40 font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" /> Restore Data
          </button>
        </div>

      </div>

    </div>
  );
}
