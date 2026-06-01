'use client';

import { useState } from 'react';
import { SAMPLE_BILL } from '@/lib/prompts';

interface Props {
  onAnalyze: (text: string) => void;
}

export default function UploadStep({ onAnalyze }: Props) {
  const [text, setText] = useState('');

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { stat: '30–80%', label: 'of medical bills contain errors' },
          { stat: '$1,300', label: 'average overcharge per hospital stay' },
          { stat: '0%', label: 'cost to dispute — free to fight back' },
        ].map(({ stat, label }) => (
          <div key={stat} className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-700">{stat}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Paste your bill or Explanation of Benefits (EOB)
          </label>
          <textarea
            className="w-full h-64 text-sm text-slate-700 placeholder-slate-400 border border-slate-200 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            placeholder="Paste the text from your medical bill, hospital statement, or EOB here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Privacy note */}
        <div className="mx-6 mb-4 flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
          <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-xs text-green-700">
            <strong>Your data is never stored.</strong> We analyze your bill in memory and discard it immediately. Nothing is saved to a database or used to train AI models.
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <button
            onClick={() => onAnalyze(text)}
            disabled={!text.trim()}
            className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Analyze my bill →
          </button>
          <button
            onClick={() => setText(SAMPLE_BILL)}
            className="py-3 px-4 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Load sample bill
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 mt-4">
        Works with hospital bills, EOBs, physician statements, and itemized receipts
      </p>
    </div>
  );
}
