import { Bell, Search, UserCircle2 } from 'lucide-react';

export default function TopNavbar() {
  return (
    <header className="h-[70px] border-b border-slate-200 bg-white px-6">
      <div className="flex h-full items-center justify-end gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        <button
          type="button"
          aria-label="Profile"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
        >
          <UserCircle2 className="h-7 w-7" />
        </button>
      </div>
    </header>
  );
}
