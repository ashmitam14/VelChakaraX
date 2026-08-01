import { Activity, ShieldCheck, MessageSquare } from 'lucide-react'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const [docCount, setDocCount] = useState(0)
  const [historyCount, setHistoryCount] = useState(0)
  const [recentQueries, setRecentQueries] = useState([])
  const [chartData, setChartData] = useState([
    { name: 'Mon', value: 0 },
    { name: 'Tue', value: 0 },
    { name: 'Wed', value: 0 },
    { name: 'Thu', value: 0 },
    { name: 'Fri', value: 0 },
    { name: 'Sat', value: 0 },
    { name: 'Sun', value: 0 },
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // Fetch Documents
        const docRes = await fetch('http://localhost:8000/documents')
        if (docRes.ok) {
          const docs = await docRes.json()
          setDocCount(docs.length)
        }

        // Fetch History
        const histRes = await fetch('http://localhost:8000/history')
        if (histRes.ok) {
          const history = await histRes.json()
          setHistoryCount(history.length)
          setRecentQueries(history.slice(0, 5).map(h => h.question || h.title))

          // Process chart data (count queries per day of week)
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          const counts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 }
          
          history.forEach(item => {
            const date = new Date(item.createdAt)
            const dayName = days[date.getDay()]
            if (counts[dayName] !== undefined) {
              counts[dayName]++
            }
          })
          
          setChartData([
            { name: 'Mon', value: counts['Mon'] },
            { name: 'Tue', value: counts['Tue'] },
            { name: 'Wed', value: counts['Wed'] },
            { name: 'Thu', value: counts['Thu'] },
            { name: 'Fri', value: counts['Fri'] },
            { name: 'Sat', value: counts['Sat'] },
            { name: 'Sun', value: counts['Sun'] },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const stats = [
    { name: 'Knowledge Documents', value: isLoading ? '...' : docCount.toString(), change: '+12%', bg: 'bg-slate-100', text: 'text-slate-900' },
    { name: 'Vector Chunks', value: '14.2K', change: '+8%', bg: 'bg-[#F3E8FF]', text: 'text-[#6B21A8]' },
    { name: 'Indexed Regulations', value: '32', change: '+3', bg: 'bg-[#ECFDF5]', text: 'text-[#065F46]' },
    { name: 'Total Queries', value: isLoading ? '...' : historyCount.toString(), change: '+19%', bg: 'bg-[#FFF7ED]', text: 'text-[#9A3412]' },
  ]

  const recentActivity = [
    { title: 'New regulation index', desc: 'EU AI Act annexes updated', time: '10 mins ago', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Document re-indexed', desc: 'Hiring Risk Assessment.pdf', time: '1 hr ago', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Query spike detected', desc: 'Policy Q&A volume increased', time: '3 hrs ago', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
  ]

  const defaultQueries = [
    'Can I use AI to screen employees?',
    'What are the consent rules?',
    'How do I assess AI risks?'
  ]

  const displayQueries = recentQueries.length > 0 ? recentQueries : defaultQueries

  const categories = [
    { name: 'Regulations', percent: 42 },
    { name: 'Policies', percent: 28 },
    { name: 'Risk', percent: 18 },
    { name: 'Guidance', percent: 12 },
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs py-1 px-2 rounded-md shadow-sm">
          {`${payload[0].value} queries`}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className={`rounded-xl p-5 ${stat.bg}`}>
            <p className="text-sm font-medium text-slate-600 mb-1">{stat.name}</p>
            <div className="flex items-end justify-between">
              <h3 className={`text-2xl font-bold ${stat.text}`}>{stat.value}</h3>
              <span className="text-sm font-medium text-slate-500">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Graph */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Analytics Graph</h3>
              <p className="text-sm text-slate-500">Trend of knowledge usage and compliance activity</p>
            </div>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <Tooltip cursor={{ fill: '#f1f5f9' }} content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Document Categories</h3>
          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">{cat.name}</span>
                  <span className="text-slate-500">{cat.percent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${cat.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50">
                <div className={`p-2 rounded-lg ${activity.bg}`}>
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-slate-900">{activity.title}</h4>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Queries & Health) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Recent Queries</h3>
            <div className="space-y-3">
              {displayQueries.map((query, i) => (
                <div key={i} className="flex items-center gap-3 text-sm p-3 rounded-lg bg-slate-50 text-slate-700">
                  <MessageSquare className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="truncate">{query}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-sm text-slate-600">Embedding Index</span>
                <span className="text-sm font-medium text-emerald-600">Healthy</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-sm text-slate-600">Vector Search</span>
                <span className="text-sm font-medium text-emerald-600">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Document Sync</span>
                <span className="text-sm font-medium text-amber-500">Warning</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
