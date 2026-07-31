import { useEffect, useState } from 'react'
import { runSimulation } from '../api/policypilot'

const defaultSystem = {
  sector: 'employment',
  personal_data_used: ['resume'],
  uses_biometric_or_emotion_data: false,
  affected_group: 'public',
  decision_level: 'human_assisted',
  jurisdiction: 'both',
  deployment_status: 'not_launched',
  org_size: 'startup',
}

const sectorOptions = [
  'employment',
  'credit_scoring',
  'education',
  'law_enforcement',
  'healthcare',
  'critical_infrastructure',
  'customer_service',
  'other',
]

const personalDataOptions = ['resume', 'financial', 'health', 'biometric', 'none']
const affectedGroupOptions = ['public', 'employees_only', 'assists_human_only']
const decisionLevelOptions = ['fully_automated', 'human_assisted']
const jurisdictionOptions = ['eu', 'india', 'both']
const deploymentStatusOptions = ['not_launched', 'already_deployed']
const orgSizeOptions = ['startup', 'sme', 'enterprise']

function getTierClasses(tier) {
  if (!tier) {
    return 'bg-slate-100 text-slate-600'
  }

  if (tier === 'Limited') {
    return 'bg-emerald-100 text-emerald-700'
  }

  if (tier === 'High') {
    return 'bg-orange-100 text-orange-700'
  }

  return 'bg-red-100 text-red-700'
}

export default function RiskSimulationPanel() {
  const [system, setSystem] = useState(defaultSystem)
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        setError('')
        const payload = await runSimulation(system)

        if (active) {
          setResults(payload)
        }
      } catch (err) {
        if (active) {
          setError('Simulation could not run. Please make sure the backend is running on http://localhost:8000.')
          setResults({})
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }, 300)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [system])

  const handleFieldChange = (field, value) => {
    setSystem((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const togglePersonalData = (value) => {
    setSystem((current) => {
      const currentValues = current.personal_data_used || []
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]

      return {
        ...current,
        personal_data_used: nextValues,
      }
    })
  }

  const renderResultCard = (label, result) => {
    if (!result) return null

    return (
      <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-lg font-semibold text-slate-900">{label.toUpperCase()} Jurisdiction</p>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getTierClasses(result.risk_tier)}`}>
            {result.risk_tier ?? 'No Tier'}
          </span>
        </div>

        <p className="text-sm font-medium text-slate-700">{result.reason}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-600">Matched clause</p>
        <p className="mt-1 text-sm text-slate-600">{result.matched_clause}</p>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Checklist</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {result.checklist.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Risk Simulator</h2>
        <p className="mt-1 text-sm text-slate-500">
          Live compliance simulation for AI deployments across EU and India requirements.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Sector</span>
              <select
                value={system.sector}
                onChange={(event) => handleFieldChange('sector', event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                {sectorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Jurisdiction</span>
              <select
                value={system.jurisdiction}
                onChange={(event) => handleFieldChange('jurisdiction', event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                {jurisdictionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Affected group</span>
              <select
                value={system.affected_group}
                onChange={(event) => handleFieldChange('affected_group', event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                {affectedGroupOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Decision level</span>
              <select
                value={system.decision_level}
                onChange={(event) => handleFieldChange('decision_level', event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                {decisionLevelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Deployment status</span>
              <select
                value={system.deployment_status}
                onChange={(event) => handleFieldChange('deployment_status', event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                {deploymentStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Organization size</span>
              <select
                value={system.org_size}
                onChange={(event) => handleFieldChange('org_size', event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                {orgSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-slate-700">Personal data used</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {personalDataOptions.map((option) => {
                const checked = (system.personal_data_used || []).includes(option)

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => togglePersonalData(option)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      checked
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-700">Uses biometric or emotion data</span>
              <button
                type="button"
                onClick={() => handleFieldChange('uses_biometric_or_emotion_data', !system.uses_biometric_or_emotion_data)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                  system.uses_biometric_or_emotion_data ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white transition ${
                    system.uses_biometric_or_emotion_data ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-slate-900">Live classification</h3>
            {loading && <span className="text-xs font-semibold text-blue-600">Running…</span>}
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          {!loading && !error && Object.keys(results).length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
              No simulation yet.
            </div>
          )}

          {!loading && Object.keys(results).length > 0 && (
            <div className="space-y-4">
              {Object.entries(results).map(([key, value]) => renderResultCard(key, value))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
