import { motion } from 'framer-motion';
import {
  BarChart3,
  BellDot,
  BookOpen,
  BrainCircuit,
  History,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Settings,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'AI Chat', icon: MessageSquareText, active: true },
  { label: 'Bookmarks', icon: BookOpen },
  { label: 'Risk Assessments', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
  { label: 'History', icon: History },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-[250px] shrink-0 bg-[#0B1120] text-slate-200 lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen">
      <div className="flex items-center gap-3 px-6 py-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/10 text-sky-300 shadow-sm">
          <div className="relative flex items-center justify-center">
            <BrainCircuit className="h-5 w-5" />
            <ShieldCheck className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#0B1120] p-0.5 text-blue-400" />
          </div>
        </div>
        <div>
          <p className="text-xl font-semibold tracking-tight text-white">PolicyMind</p>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-2 px-3">
        {navItems.map(({ label, icon: Icon, active }) => (
          <motion.button
            whileHover={{ x: 2 }}
            transition={{ type: 'spring', stiffness: 320, damping: 25 }}
            key={label}
            type="button"
            className={[
              'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-all duration-200',
              active
                ? 'bg-white text-blue-600 shadow-[0_8px_20px_rgba(15,23,42,0.12)]'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white',
            ].join(' ')}
          >
            <Icon className={['h-4 w-4', active ? 'text-blue-600' : 'text-slate-400'].join(' ')} />
            <span>{label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="border-t border-slate-700/80 px-3 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-slate-800/80 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
