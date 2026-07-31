import {
  Bookmark,
  Gauge,
  Gavel,
  History,
  LogOut,
  MessageSquareText,
  Settings,
} from 'lucide-react'

export default function Sidebar({
  className = '',
  navItems = [],
  activeSection,
  onSelectSection,
  onLogout,
}) {
  return (
    <aside
      className={[
        'flex h-full w-64 flex-col border-r border-slate-800 bg-[#0f2347] text-slate-200',
        className,
      ].join(' ')}
    >
      <div className="border-b border-slate-700/60 px-5 py-5">
        <p className="text-2xl font-semibold tracking-tight text-white">PolicyMind</p>
        <p className="mt-1 text-xs text-blue-200">AI Governance & Compliance</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = item.id === activeSection

            let Icon = Gauge

            if (item.id === 'chat') {
              Icon = MessageSquareText
            }

            if (item.id === 'bookmarks') {
              Icon = Bookmark
            }

            if (item.id === 'risk') {
              Icon = Gavel
            }

            if (item.id === 'history') {
              Icon = History
            }

            if (item.id === 'settings') {
              Icon = Settings
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={[
                  'w-full rounded-lg px-3 py-2.5 text-left text-sm transition duration-200',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-blue-100 hover:bg-blue-700/40 hover:text-white',
                ].join(' ')}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="truncate font-medium">{item.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="border-t border-slate-700/60 p-3">
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-blue-100 transition duration-200 hover:bg-blue-700/40 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
