'use client';

import { useState } from 'react';
import { AnalysisResult, IssueSeverity } from '@/lib/types';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const severityConfig: Record<IssueSeverity, { bg: string; text: string; dot: string; label: string }> = {
  high:   { bg: 'bg-red-50 border-red-200',    text: 'text-red-700',    dot: 'bg-red-500',    label: 'High priority' },
  medium: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500',  label: 'Review'        },
  low:    { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400',  label: 'Minor'         },
};

const issueTypeLabel: Record<string, string> = {
  duplicate_charge:            'Duplicate charge',
  upcoding:                    'Upcoding',
  unbundling:                  'Unbundling',
  service_not_rendered:        'Service not rendered',
  balance_billing:             'Balance billing',
  incorrect_coding:            'Incorrect code',
  missing_insurance_adjustment:'Missing adjustment',
  other:                       'Billing issue',
};

export default function ResultsStep({ result, onReset }: Props) {
  const [copied, setCopied] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  const copyLetter = () => {
    navigator.clipboard.writeText(result.dispute_letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highCount = result.issues.filter((i) => i.severity === 'high').length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Summary banner */}
      <div className={`rounded-2xl p-6 border ${highCount > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Analysis complete</p>
            <h2 className={`text-xl font-bold mb-1 ${highCount > 0 ? 'text-red-800' : 'text-green-800'}`}>
              {result.summary.headline}
            </h2>
            <p className="text-sm text-slate-600">
              {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''} found ·{' '}
              <strong>Up to {result.summary.potential_savings} in potential savings</strong>
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-slate-800">{result.summary.total_billed}</div>
            <div className="text-xs text-slate-500">billed total</div>
          </div>
        </div>
      </div>

      {/* Issues */}
      {result.issues.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Issues found ({result.issues.length})
          </h3>
          <div className="space-y-3">
            {result.issues.map((issue, i) => {
              const cfg = severityConfig[issue.severity];
              return (
                <div key={i} className={`rounded-xl border p-4 ${cfg.bg}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-sm font-semibold ${cfg.text}`}>
                          {issueTypeLabel[issue.type] ?? 'Billing issue'}
                        </span>
                        <span className="text-xs bg-white/60 border border-current/20 rounded px-1.5 py-0.5 text-slate-500">
                          {cfg.label}
                        </span>
                        {issue.disputed_amount && issue.disputed_amount !== 'unknown' && (
                          <span className="text-xs font-bold text-slate-700 ml-auto">
                            {issue.disputed_amount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mb-1">
                        <span className="font-medium">Line item: </span>{issue.line_item}
                      </p>
                      <p className="text-xs text-slate-600 mb-2">{issue.description}</p>
                      <p className="text-xs font-medium text-slate-700">
                        → {issue.action}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Next steps */}
      {result.next_steps?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Your next steps</h3>
          <ol className="space-y-2">
            {result.next_steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Assistance programs */}
      {result.assistance_programs?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Financial assistance you may qualify for
          </h3>
          <div className="space-y-3">
            {result.assistance_programs.map((program, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {program.url ? (
                      <a href={program.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline decoration-dotted">
                        {program.name}
                      </a>
                    ) : program.name}
                  </p>
                  <p className="text-xs text-slate-500">{program.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Eligibility: {program.eligibility_hint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dispute letter */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => setLetterOpen(!letterOpen)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div>
            <h3 className="text-sm font-semibold text-slate-700">Your dispute letter</h3>
            <p className="text-xs text-slate-500">Ready to copy, customize, and send</p>
          </div>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${letterOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {letterOpen && (
          <div className="border-t border-slate-200">
            <div className="p-5">
              <pre className="whitespace-pre-wrap text-xs font-mono text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                {result.dispute_letter}
              </pre>
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={copyLetter}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy letter
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <button
          onClick={onReset}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          ← Analyze another bill
        </button>
        <p className="text-xs text-slate-400">
          This is not legal advice. Consider consulting a patient advocate for complex cases.
        </p>
      </div>
    </div>
  );
}
