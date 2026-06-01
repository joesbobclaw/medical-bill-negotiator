'use client';

const steps = [
  'Reading your bill...',
  'Checking for duplicate charges...',
  'Reviewing billing codes...',
  'Looking for insurance errors...',
  'Drafting your dispute letter...',
];

export default function AnalyzingStep() {
  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">Analyzing your bill</h2>
      <p className="text-slate-500 text-sm mb-8">This takes about 15 seconds</p>

      <div className="text-left space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            </div>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
