import { Menu, Sparkles } from 'lucide-react';
import { useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import RecentUpdates from '../components/RecentUpdates';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

export default function AIChat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar />

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="fixed left-0 top-0 z-50 lg:hidden">
          <div
            className={[
              'h-screen w-[260px] transform bg-[#0B1120] text-slate-200 transition-transform duration-200',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')}
          >
            <div className="flex items-center gap-3 px-5 py-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-semibold text-white">PolicyMind</span>
            </div>
            <nav className="mt-6 space-y-2 px-3">
              {['Dashboard', 'AI Chat', 'Bookmarks', 'Risk Assessments', 'Settings', 'History'].map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className={[
                    'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium',
                    index === 1 ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-300 hover:bg-slate-800/80',
                  ].join(' ')}
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-current" />
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavbar />

          <main className="flex flex-1 gap-6 overflow-hidden p-4 md:p-6 xl:p-8">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-4 pb-5">
                <button
                  type="button"
                  aria-label="Open sidebar"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </button>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-[2rem]">AI Chat</h1>
                  <p className="mt-1 text-sm text-slate-500 md:text-base">
                    Ask anything about AI governance, ethics, risks, or policies.
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
                >
                  Clear Chat
                </button>
              </div>

              <ChatWindow />
            </div>

            <RecentUpdates />
          </main>
        </div>
      </div>
    </div>
  );
}
