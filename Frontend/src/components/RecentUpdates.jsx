import { ArrowUpRight, FileText } from 'lucide-react';

const updates = [
  'EU AI Act: Key Highlights',
  'NIST AI RMF 1.0: Latest Updates',
  'ISO/IEC 42001 Overview',
  'OECD AI Principles: Summary',
  'UNESCO Ethics of AI: Key Points',
  'Microsoft Responsible AI Standard',
];

export default function RecentUpdates() {
  return (
    <aside className="hidden w-[330px] shrink-0 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm lg:block">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Recent Updates</h3>
        <button type="button" className="text-sm font-medium text-blue-600 transition hover:text-blue-500">
          View All
        </button>
      </div>

      <div className="space-y-2">
        {updates.map((item, index) => (
          <button
            key={item}
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-slate-100"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700">{item}</p>
              <p className="mt-1 text-xs text-slate-500">
                {index === 0 ? 'May 10, 2024' : index === 1 ? 'May 7, 2024' : index === 2 ? 'May 2, 2024' : index === 3 ? 'Apr 29, 2024' : index === 4 ? 'Apr 22, 2024' : 'Apr 18, 2024'}
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </button>
        ))}
      </div>
    </aside>
  );
}
