import {
  AlertTriangle,
  Brain,
  Bell,
  ChevronRight,
  CircleAlert,
  Clock3,
  Download,
  Eye,
  FileText,
  Folder,
  Grid2X2,
  Lock,
  MenuSquare,
  Menu,
  PlusCircle,
  RefreshCw,
  Scale,
  Search,
  ShieldCheck,
  Shield,
  Upload,
  Users,
  Verified,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatInput from '../components/ChatInput'
import MessageBubble from '../components/MessageBubble'
import Sidebar from '../components/Sidebar'

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'chat', label: 'AI Chat' },
  { id: 'bookmarks', label: 'Bookmarks' },
  { id: 'risk', label: 'Risk Assessment' },
  { id: 'history', label: 'History' },
  { id: 'settings', label: 'Settings' },
]

const starterMessages = [
  {
    id: 'm1',
    role: 'assistant',
    text: 'Welcome to PolicyMind. I can help with governance controls, regulatory checks, and policy interpretation.',
  },
]

const stats = [
  { label: 'Knowledge Base', value: '5 Documents', note: '+2 this week' },
  { label: 'Compliance Reports', value: '12 Generated', note: 'Last: 2h ago' },
  { label: 'Questions Asked', value: '156', note: 'Active sessions' },
  { label: 'Compliance Score', value: '92%', note: 'Stable' },
]

const docs = [
  { name: 'EU AI Act (Official Text)', date: 'Oct 12, 2023' },
  { name: 'EU AI Act Annexes', date: 'Oct 15, 2023' },
  { name: 'Digital Personal Data Protection Act', date: 'Nov 05, 2023' },
  { name: 'NIST AI Risk Management Framework', date: 'Dec 01, 2023' },
  { name: 'MeitY AI Advisories', date: 'Jan 10, 2024' },
]

const updates = [
  {
    time: '2 hours ago',
    title: 'New EU AI Act Amendments',
    body: 'System updated indexing for Annex IV.',
  },
  {
    time: 'Yesterday',
    title: 'NIST Framework Revision',
    body: 'Cross-reference with local policy V2.4 completed.',
  },
  {
    time: '3 days ago',
    title: 'Privacy Policy Update',
    body: 'Marketing department data flow added.',
  },
]

export default function Chat() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [messages, setMessages] = useState(starterMessages)
  const [prompt, setPrompt] = useState('')

  const handleSend = () => {
    const trimmedPrompt = prompt.trim()

    if (!trimmedPrompt) {
      return
    }

    const userMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      text: trimmedPrompt,
    }

    const assistantMessage = {
      id: `${Date.now()}-assistant`,
      role: 'assistant',
      text: 'I analyzed your query. I can map relevant controls, cite policy sections, and suggest compliance actions based on your governance context.',
    }

    setMessages((current) => [...current, userMessage, assistantMessage])
    setPrompt('')
  }

  const handleLogout = () => {
    navigate('/')
  }

  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back, PolicyMind Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Real-time governance oversight and policy alignment status.</p>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <article
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-xs font-medium text-slate-500">{item.note}</p>
              <p className="mt-3 text-sm text-slate-500">{item.label}</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-900">{item.value}</h3>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-12 gap-4">
          <article className="col-span-12 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-900">Knowledge Base</h4>
              <button type="button" className="text-sm font-semibold text-blue-600 transition hover:text-blue-500">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Document Name</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold">Date Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {docs.map((doc) => (
                    <tr key={doc.name} className="transition hover:bg-slate-50">
                      <td className="px-3 py-3 text-sm font-medium text-slate-800">{doc.name}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">Indexed</span>
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-slate-500">{doc.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="col-span-12 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-4">
            <h4 className="mb-4 text-lg font-semibold text-slate-900">Recent Updates</h4>
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">{update.time}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{update.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{update.body}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid grid-cols-12 gap-4">
          <article className="col-span-12 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-6">
            <h4 className="mb-4 text-lg font-semibold text-slate-900">Compliance Overview</h4>
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="relative h-36 w-36 rounded-full bg-[conic-gradient(#2563eb_0_60%,#f59e0b_60_85%,#dc2626_85_100%)] p-3">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">92</p>
                    <p className="text-xs text-slate-500">Score</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Low Risk</span>
                  <span className="font-semibold text-slate-900">60%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Medium Risk</span>
                  <span className="font-semibold text-slate-900">25%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">High Risk</span>
                  <span className="font-semibold text-slate-900">15%</span>
                </div>
                <div>
                  <p className="mb-1 text-xs text-slate-500">Overall Compliance Progress</p>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-full w-[92%] rounded-full bg-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="col-span-12 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-6">
            <h4 className="mb-4 text-lg font-semibold text-slate-900">Recent Activity</h4>
            <div className="space-y-3">
              {[
                { title: 'Hiring Policy Review', note: 'AI recruitment bias check passed', state: 'Done' },
                { title: 'Data Privacy Audit', note: 'LOD mapping in progress', state: 'Running' },
                { title: 'Vendor Risk Assessment', note: 'Cloud provider SOC2 verification', state: 'Done' },
              ].map((activity) => (
                <div
                  key={activity.title}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                    <p className="text-xs text-slate-500">{activity.note}</p>
                  </div>
                  <span
                    className={[
                      'rounded px-2 py-1 text-xs font-semibold',
                      activity.state === 'Running' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600',
                    ].join(' ')}
                  >
                    {activity.state}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    )
  }

  const renderAssistant = () => {
    return (
      <div className="space-y-5 pb-28">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Welcome to PolicyMind</h2>
          <p className="mt-1 text-sm text-slate-500">Your AI-powered compliance and governance assistant.</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              'What is the EU AI Act?',
              'What are prohibited AI systems?',
              'What are the four functions of NIST AI RMF?',
              'What are key penalties under DPDP Act?',
            ].map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => setPrompt(question)}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-left text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                {question}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </section>
      </div>
    )
  }

  const renderRisk = () => {
    const items = [
      {
        title: 'Privacy Risk',
        level: 'Critical',
        icon: Lock,
        desc: 'Potential for PII leakage through model inversion attacks or unintended data memorization in training sets.',
        steps: ['Apply Differential Privacy', 'PII Anonymization Layer'],
        law: 'GDPR Art. 32',
      },
      {
        title: 'Bias Risk',
        level: 'High',
        icon: Scale,
        desc: 'Inherent biases in historical datasets leading to skewed outputs for underrepresented groups.',
        steps: ['Fairness Re-weighting', 'Counterfactual Evaluation'],
        law: 'EU AI Act Art. 10',
      },
      {
        title: 'Security Risk',
        level: 'Medium',
        icon: Shield,
        desc: 'Vulnerability to prompt injection attacks allowing users to bypass system-level safety guardrails.',
        steps: ['Input Sanitization Proxy', 'Red Teaming Schedules'],
        law: 'NIST AI RMF',
      },
      {
        title: 'Transparency',
        level: 'Low',
        icon: Eye,
        desc: 'Inadequate disclosure of AI usage to end-users, potentially violating right-to-know expectations.',
        steps: ['Clear AI Disclaimers', 'Model Card Publication'],
        law: 'EU AI Act Art. 52',
      },
      {
        title: 'Human Oversight',
        level: 'High',
        icon: Users,
        desc: 'Automated decision-making without a human-in-the-loop for high-stakes approval scenarios.',
        steps: ['Manual Review Triggers', 'Override Capability Auth'],
        law: 'GDPR Art. 22',
      },
      {
        title: 'Explainability',
        level: 'Medium',
        icon: Brain,
        desc: 'Black-box complexity of neural systems makes output reasoning difficult to audit for compliance.',
        steps: ['SHAP/LIME Integration', 'Saliency Map Audits'],
        law: 'ISO/IEC 42001',
      },
    ]

    const getTagStyle = (level) => {
      if (level === 'Critical') {
        return 'bg-red-100 text-red-700'
      }

      if (level === 'High') {
        return 'bg-blue-100 text-blue-700'
      }

      return 'bg-slate-100 text-slate-600'
    }

    return (
      <div className="space-y-5">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Regulatory Risk Assessment</h2>
              <p className="mt-1 text-sm text-slate-500">
                Audit for: <span className="font-semibold text-slate-700">LLM-Deployment-v4-Internal</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Export Report
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <RefreshCw className="h-4 w-4" />
                Re-Assess
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <article className="rounded-xl border border-slate-200 p-4 lg:col-span-4">
              <p className="mb-4 text-sm font-semibold text-slate-700">Overall Risk Profile</p>

              <div className="mx-auto h-40 w-40 rounded-full bg-[conic-gradient(#2563eb_0_74%,#e2e8f0_74_100%)] p-3">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
                  <p className="text-4xl font-bold leading-none text-slate-900">74</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-blue-600">Moderate</p>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-slate-500">Score calculated based on 124 compliance parameters.</p>
            </article>

            <div className="grid grid-cols-1 gap-4 lg:col-span-8 lg:grid-cols-2">
              <article className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">Active</span>
                </div>

                <p className="text-sm text-slate-500">Policy Coverage</p>
                <p className="mt-1 text-3xl font-semibold text-slate-900">88.4%</p>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div className="h-full w-[88.4%] rounded-full bg-blue-600" />
                </div>
              </article>

              <article className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="rounded-xl bg-red-100 p-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">Needs Action</span>
                </div>

                <p className="text-sm text-slate-500">High-Severity Risks</p>
                <p className="mt-1 text-3xl font-semibold text-slate-900">03</p>
                <p className="mt-3 text-xs italic text-slate-500">2 mitigated in the last 24h</p>
              </article>

              <article className="rounded-xl border border-slate-200 p-4 lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900">Risk Trend (Last 30 Days)</h4>
                  <select className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>

                <div className="flex h-28 items-end gap-2">
                  {[40, 55, 45, 70, 60, 85, 75, 65, 50, 45].map((value, index) => (
                    <div
                      key={`${value}-${index}`}
                      className="flex-1 rounded-t-sm bg-blue-200 transition hover:bg-blue-500"
                      style={{ height: `${value}%` }}
                    />
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900">Risk Categorization Matrix</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                </div>
                <span className={['rounded-full px-2 py-1 text-xs font-semibold', getTagStyle(item.level)].join(' ')}>
                  {item.level}
                </span>
              </div>

              <p className="mb-4 flex-1 text-sm text-slate-500">{item.desc}</p>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-600">Mitigation Steps</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  {item.steps.map((step) => (
                    <li key={step} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {item.law}
                </span>
                <button className="inline-flex items-center gap-1 font-semibold text-blue-600 transition hover:text-blue-500">
                  View Clause
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
          </div>
        </section>
      </div>
    )
  }

  const renderBookmarks = () => {
    const docs = [
      {
        title: 'EU AI Act',
        description: 'Regulatory framework for artificial intelligence in the European Union, focusing on high-risk applications.',
        category: 'Regulation',
        region: 'EU',
        sections: '142 Sections',
        updated: 'Updated Oct 24, 2023',
        progress: '85%',
        progressClass: 'bg-blue-600',
        iconClass: 'bg-blue-100 text-blue-600',
        icon: FileText,
      },
      {
        title: 'NIST AI RMF 1.0',
        description: "National Institute of Standards and Technology's Artificial Intelligence Risk Management Framework.",
        category: 'Framework',
        region: 'USA',
        sections: '28 Sections',
        updated: 'Updated Jan 12, 2024',
        progress: '60%',
        progressClass: 'bg-blue-500',
        iconClass: 'bg-slate-200 text-slate-700',
        icon: FileText,
      },
      {
        title: 'GDPR Compliance',
        description: 'General Data Protection Regulation provisions specifically for automated decision-making systems.',
        category: 'Regulation',
        region: 'EU',
        sections: '99 Articles',
        updated: 'Updated Feb 05, 2024',
        progress: '95%',
        progressClass: 'bg-red-500',
        iconClass: 'bg-red-100 text-red-600',
        icon: Shield,
      },
      {
        title: 'Data Governance v2.4',
        description: 'Internal corporate guidelines for data residency, encryption, and AI model training datasets.',
        category: 'Internal Policy',
        region: 'Internal',
        sections: '12 Sections',
        updated: 'Updated 2 days ago',
        progress: '40%',
        progressClass: 'bg-slate-500',
        iconClass: 'bg-slate-200 text-slate-600',
        icon: Folder,
      },
      {
        title: 'ISO/IEC 42001',
        description: 'International standard for Artificial Intelligence Management Systems (AIMS).',
        category: 'Standard',
        region: 'Global',
        sections: '56 Sections',
        updated: 'Updated Jan 28, 2024',
        progress: '72%',
        progressClass: 'bg-blue-600',
        iconClass: 'bg-blue-100 text-blue-600',
        icon: Verified,
      },
    ]

    return (
      <div className="space-y-5">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Knowledge Base</h2>
            <p className="mt-1 text-sm text-slate-500">Manage and explore 24 core institutional regulations and frameworks.</p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
            <Upload className="h-4 w-4" />
            Upload New
          </button>
        </section>

        <section className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filter By:</span>

          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
            <option>Region: All</option>
            <option>European Union</option>
            <option>United States</option>
            <option>Global</option>
            <option>Asia Pacific</option>
          </select>

          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
            <option>Category: All</option>
            <option>Regulation</option>
            <option>Framework</option>
            <option>Internal Policy</option>
            <option>Standard</option>
          </select>

          <button className="rounded-lg px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50">Clear All</button>

          <div className="ml-auto flex items-center gap-1 text-slate-500">
            <button className="rounded-md bg-white p-2 text-slate-800 shadow-sm">
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button className="rounded-md p-2 transition hover:bg-white">
              <MenuSquare className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {docs.map((doc) => (
            <article
              key={doc.title}
              className="flex min-h-[250px] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className={['rounded-xl p-2.5', doc.iconClass].join(' ')}>
                  <doc.icon className="h-5 w-5" />
                </div>

                <div className="text-right">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                    {doc.category}
                  </span>
                  <p className="mt-1 text-[11px] text-slate-500">{doc.region}</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-slate-900">{doc.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{doc.description}</p>

              <div className="mt-auto pt-4">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={['h-full rounded-full', doc.progressClass].join(' ')} style={{ width: doc.progress }} />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <MenuSquare className="h-3.5 w-3.5" />
                    {doc.sections}
                  </span>
                  <span>{doc.updated}</span>
                </div>
              </div>
            </article>
          ))}

          <article className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-4 text-center transition hover:bg-slate-50">
            <div className="rounded-full bg-slate-100 p-3 text-slate-500">
              <PlusCircle className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-600">Add Policy Source</p>
            <p className="mt-1 max-w-[180px] text-xs text-slate-500">Drag and drop PDF or Doc files here</p>
          </article>
        </section>
      </div>
    )
  }

  const renderHistory = () => {
    const historyRows = [
      {
        name: 'AI Recruitment Platform Compliance Review',
        score: 96,
        date: '12 July 2026',
        risk: 'Medium Risk',
        project: 'SmartHire AI',
        tags: ['EU AI Act', 'NIST AI RMF', 'DPDP Act'],
      },
      {
        name: 'Customer Sentiment Analysis Audit',
        score: 98,
        date: '10 July 2026',
        risk: 'Low Risk',
        project: 'SupportBot V4',
        tags: ['GDPR Compliance', 'OECD AI Principles'],
      },
    ]

    return (
      <div className="space-y-5">
        <section>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Assessment History</h2>
          <p className="mt-1 text-sm text-slate-500">
            View previously completed AI compliance assessments, regulatory reviews, and governance reports.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Completed Assessments</p>
            <div className="mt-2 flex items-end gap-2">
              <p className="text-4xl font-bold leading-none text-slate-900">58</p>
              <p className="pb-1 text-sm font-bold text-emerald-600">+12%</p>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Avg Compliance Score</p>
            <div className="mt-2 flex items-center gap-3">
              <p className="text-4xl font-bold leading-none text-slate-900">96%</p>
              <div className="h-1 w-12 rounded-full bg-slate-200">
                <div className="h-full w-[96%] rounded-full bg-blue-600" />
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-red-600">High Risk Assessments</p>
            <div className="mt-2 flex items-center gap-3">
              <p className="text-4xl font-bold leading-none text-slate-900">8</p>
              <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">ATTENTION REQ.</span>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Reports Generated</p>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-4xl font-bold leading-none text-slate-900">58</p>
              <ShieldCheck className="h-5 w-5 text-slate-300" />
            </div>
          </article>
        </section>

        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-12 space-y-4 xl:col-span-8">
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              {['Risk Level', 'Assessment Date', 'Regulation Used'].map((filter) => (
                <select
                  key={filter}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                >
                  <option>{filter}</option>
                </select>
              ))}

              <div className="ml-auto flex items-center gap-2 text-xs">
                <span className="font-bold uppercase tracking-wide text-slate-500">Sort By:</span>
                <select className="rounded-full border border-slate-200 bg-white px-3 py-2 font-semibold text-blue-600 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Highest Score</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {historyRows.map((row) => (
                <article
                  key={row.name}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                      <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="36" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          fill="none"
                          stroke={row.score >= 97 ? '#10b981' : '#316bf3'}
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray="226"
                          strokeDashoffset={Math.round((100 - row.score) * 2.26)}
                        />
                      </svg>

                      <span className="absolute text-lg font-bold text-slate-800">{row.score}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={[
                              'rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-wide',
                              row.risk === 'Low Risk' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700',
                            ].join(' ')}
                          >
                            {row.risk}
                          </span>
                          <span className="text-xs font-bold text-emerald-600">Passed</span>
                        </div>

                        <span className="text-xs font-medium text-slate-500">{row.date}</span>
                      </div>

                      <h3 className="text-lg font-semibold text-slate-900">{row.name}</h3>
                      <p className="mt-0.5 text-sm text-slate-500">Project: {row.project}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {row.tags.map((tag) => (
                          <span key={tag} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-500">
                          View Report
                        </button>
                        <button className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                          PDF
                        </button>
                        <button className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                          Sources
                        </button>

                        <button className="ml-auto rounded-lg border border-slate-300 p-2 text-slate-500 transition hover:bg-slate-50">
                          <Clock3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button className="h-8 w-8 rounded-md border border-slate-300 text-slate-500 transition hover:bg-slate-50">&lt;</button>
              <button className="h-8 w-8 rounded-md bg-blue-600 text-sm font-bold text-white">1</button>
              <button className="h-8 w-8 rounded-md border border-slate-300 text-sm text-slate-500 transition hover:bg-slate-50">2</button>
              <button className="h-8 w-8 rounded-md border border-slate-300 text-sm text-slate-500 transition hover:bg-slate-50">3</button>
              <span className="px-1 text-sm text-slate-400">...</span>
              <button className="h-8 w-8 rounded-md border border-slate-300 text-sm text-slate-500 transition hover:bg-slate-50">8</button>
              <button className="h-8 w-8 rounded-md border border-slate-300 text-slate-500 transition hover:bg-slate-50">&gt;</button>
            </div>
          </div>

          <aside className="col-span-12 space-y-4 xl:col-span-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Compliance Trend</h4>
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-500">Details</button>
              </div>

              <div className="flex h-40 items-end gap-2 border-b border-slate-200 pb-4">
                {[
                  { value: 60, color: 'bg-blue-100' },
                  { value: 74, color: 'bg-blue-200' },
                  { value: 82, color: 'bg-blue-300' },
                  { value: 88, color: 'bg-blue-400' },
                  { value: 96, color: 'bg-blue-600' },
                ].map((bar) => (
                  <div key={bar.value} className={['group relative flex-1 rounded-t-md', bar.color].join(' ')} style={{ height: `${bar.value}%` }}>
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                      {bar.value}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-wide text-slate-500">
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Risk Distribution</h4>
              <div className="flex items-center gap-5">
                <div className="relative h-28 w-28 rounded-full bg-[conic-gradient(#22c55e_0_72%,#f59e0b_72_86%,#ef4444_86_100%)] p-3">
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
                    <p className="text-2xl font-bold text-slate-900">58</p>
                    <p className="text-[10px] font-semibold text-slate-500">TOTAL</p>
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Low
                    </span>
                    <span className="font-semibold text-slate-800">42</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-400" /> Medium
                    </span>
                    <span className="font-semibold text-slate-800">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> High
                    </span>
                    <span className="font-semibold text-slate-800">8</span>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Assessment Timeline</h4>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
                  <div>
                    <p className="text-[11px] font-bold uppercase text-blue-600">Today, 09:12 AM</p>
                    <p className="font-semibold text-slate-800">Medical Diagnosis Assessment Completed</p>
                    <p className="text-xs text-slate-500">Regulatory review for NeuroScan AI finished with 94% compliance.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-[11px] font-bold uppercase text-slate-500">Yesterday</p>
                    <p className="font-semibold text-slate-800">AI Recruitment Assessment Passed</p>
                    <p className="text-xs text-slate-500">SmartHire AI project report generated and archived.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <div>
                    <p className="text-[11px] font-bold uppercase text-slate-500">3 Days Ago</p>
                    <p className="font-semibold text-slate-800">Draft Saved: Fintech Risk Model</p>
                    <p className="text-xs text-slate-500">Assessment for CapitalOne integration in progress.</p>
                  </div>
                </div>
              </div>

              <button className="mt-4 w-full rounded-lg border border-blue-200 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-50">
                View Full Timeline
              </button>
            </article>

            <article className="rounded-2xl bg-[#0f2347] p-4 text-white shadow-sm">
              <h4 className="text-xl font-semibold">Need a custom audit?</h4>
              <p className="mt-1 text-sm text-blue-100">
                Our AI can draft custom governance frameworks based on your specific industry standards.
              </p>
              <button className="mt-4 w-full rounded-xl bg-blue-500 py-2.5 text-sm font-bold transition hover:bg-blue-400">
                Start AI Consultation
              </button>
            </article>
          </aside>
        </section>
      </div>
    )
  }

  const renderSettings = () => {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your workspace, security, and AI infrastructure.</p>

        <div className="mt-6 grid grid-cols-12 gap-5">
          <aside className="col-span-12 space-y-2 lg:col-span-3">
            {['Profile', 'Privacy & Security', 'Notifications', 'Knowledge Base', 'Danger Zone'].map((item) => (
              <button
                key={item}
                type="button"
                className={[
                  'w-full rounded-lg px-3 py-2 text-left text-sm transition',
                  item === 'Profile' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100',
                ].join(' ')}
              >
                {item}
              </button>
            ))}
          </aside>

          <div className="col-span-12 rounded-lg border border-slate-200 p-4 lg:col-span-9">
            <h3 className="text-lg font-semibold text-slate-900">Public Profile</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block text-slate-500">Full Name</span>
                <input
                  defaultValue="Elena Vance"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block text-slate-500">Email Address</span>
                <input
                  defaultValue="e.vance@luminion.corp"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block text-sm md:col-span-2">
                <span className="mb-1 block text-slate-500">Organization</span>
                <input
                  defaultValue="Luminon Industries"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>

            <div className="mt-5 flex justify-end">
              <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const renderSection = () => {
    if (activeSection === 'chat') {
      return renderAssistant()
    }

    if (activeSection === 'bookmarks') {
      return renderBookmarks()
    }

    if (activeSection === 'risk') {
      return renderRisk()
    }

    if (activeSection === 'history') {
      return renderHistory()
    }

    if (activeSection === 'settings') {
      return renderSettings()
    }

    return renderDashboard()
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-800">
      <div className="flex min-h-screen">
        <div className="hidden xl:fixed xl:inset-y-0 xl:left-0 xl:z-40 xl:block">
          <Sidebar
            navItems={navItems}
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            onLogout={handleLogout}
          />
        </div>

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-40 bg-slate-900/35 xl:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={[
            'fixed left-0 top-0 z-50 h-screen transition-transform duration-200 xl:hidden',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
        >
          <Sidebar
            className="shadow-2xl"
            navItems={navItems}
            activeSection={activeSection}
            onSelectSection={(id) => {
              setActiveSection(id)
              setSidebarOpen(false)
            }}
            onLogout={handleLogout}
          />
        </div>

        <main className="relative min-w-0 flex-1 xl:ml-64">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
            <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 xl:hidden"
                  aria-label="Open sidebar"
                >
                  <Menu className="h-4 w-4" />
                </button>

                <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 sm:flex sm:min-w-[320px]">
                  <Search className="h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search regulations, policies or audits..."
                    className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
              <button
                type="button"
                  className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
                  aria-label="Notifications"
              >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </button>

                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-800">Compliance Officer</p>
                  <p className="text-xs text-slate-500">Admin Access</p>
                </div>

                <div className="h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80"
                    alt="Compliance officer"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </header>

          <section className="mx-auto w-full max-w-[1400px] px-4 pb-24 pt-6 sm:px-6">
            {renderSection()}
          </section>

          {activeSection === 'chat' && (
            <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white xl:left-64">
              <ChatInput value={prompt} onChange={setPrompt} onSend={handleSend} />
            </div>
          )}

          <footer className="border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 text-xs text-slate-500">
              <p>PolicyMind - AI Governance & Compliance Assistant</p>
              <div className="hidden items-center gap-3 sm:flex">
                <button className="transition hover:text-slate-700">Privacy Policy</button>
                <button className="transition hover:text-slate-700">Audit Logs</button>
                <button className="transition hover:text-slate-700">API Docs</button>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Floating quick action for dashboard parity */}
      {activeSection === 'history' && (
        <button
          type="button"
          className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500"
        >
          New Assessment
          <X className="h-4 w-4" />
        </button>
      )}

      {activeSection === 'dashboard' && (
        <div className="pointer-events-none fixed bottom-4 left-0 right-0 text-center text-[11px] text-slate-400">
          Powered by Local AI. Answers generated only from locally stored regulations and policy documents.
        </div>
      )}
    </div>
  )
}
