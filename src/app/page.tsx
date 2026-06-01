'use client';

import { useState } from 'react';
import { AppState, AnalysisResult } from '@/lib/types';
import UploadStep from '@/components/UploadStep';
import AnalyzingStep from '@/components/AnalyzingStep';
import ResultsStep from '@/components/ResultsStep';

export default function Home() {
  const [state, setState] = useState<AppState>('upload');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (billText: string) => {
    setState('analyzing');
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billText }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setState('upload');
        return;
      }

      setResult(data as AnalysisResult);
      setState('results');
    } catch {
      setError('Something went wrong. Please try again.');
      setState('upload');
    }
  };

  const reset = () => {
    setState('upload');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900">Medical Bill Negotiator</h1>
              <p className="text-xs text-slate-500">AI-powered billing advocate</p>
            </div>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-medium">
            Free · No account needed
          </span>
        </div>
      </header>

      {/* Hero (upload state only) */}
      {state === 'upload' && (
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-6 py-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Your medical bill is probably wrong.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Up to 80% of hospital bills contain errors. Paste yours below and we'll find
              the problems, tell you exactly what to dispute, and write the letter for you.
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        {state === 'upload' && <UploadStep onAnalyze={analyze} />}
        {state === 'analyzing' && <AnalyzingStep />}
        {state === 'results' && result && (
          <ResultsStep result={result} onReset={reset} />
        )}
      </main>
    </div>
  );
}
