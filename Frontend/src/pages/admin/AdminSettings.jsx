import { useState, useEffect } from 'react'

export default function AdminSettings() {
  const [isRebuilding, setIsRebuilding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState(null)
  
  const [settings, setSettings] = useState({
    embedding_model: "sentence-transformers/all-MiniLM-L6-v2",
    chunk_size: 512,
    chunk_overlap: 64,
    top_k: 6
  })

  useEffect(() => {
    fetch('http://localhost:8000/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Failed to load settings", err))
  }, [])

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: isNaN(value) ? value : parseInt(value, 10)
    }))
  }

  const handleRebuild = async () => {
    setIsRebuilding(true)
    try {
      const res = await fetch('http://localhost:8000/rebuild', { method: 'POST' })
      if (res.ok) {
        showToast("Index rebuilt successfully!")
      } else {
        const error = await res.json()
        showToast(`Failed: ${error.detail || 'Unknown error'}`)
      }
    } catch (err) {
      showToast("Error rebuilding index")
    } finally {
      setIsRebuilding(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('http://localhost:8000/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        showToast("Settings saved successfully!")
      } else {
        showToast("Failed to save settings")
      }
    } catch (err) {
      showToast("Error saving settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm p-8 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-4 py-2 rounded-md shadow-lg text-sm transition-all animate-fade-in-down">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Left Column */}
        <div className="space-y-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Embedding Model</span>
            <select 
              name="embedding_model"
              value={settings.embedding_model}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 appearance-none"
            >
              <option value="sentence-transformers/all-MiniLM-L6-v2">MiniLM L6 v2</option>
              <option value="text-embedding-ada-002">text-embedding-ada-002</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Chunk Size</span>
            <input 
              type="number" 
              name="chunk_size"
              value={settings.chunk_size}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Chunk Overlap</span>
            <input 
              type="number" 
              name="chunk_overlap"
              value={settings.chunk_overlap}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
            />
          </label>
        </div>

        {/* Right Column */}
        <div className="space-y-6 flex flex-col">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Top-K Retrieval</span>
            <input 
              type="number" 
              name="top_k"
              value={settings.top_k}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
            />
          </label>

          <div className="mt-2">
            <span className="block text-sm font-medium text-slate-700 mb-2">Vector Database Status</span>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
              Connected and ready for retrieval.
            </div>
          </div>

          <div className="mt-auto flex items-center gap-3 pt-6">
            <button 
              onClick={handleRebuild}
              disabled={isRebuilding || isSaving}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {isRebuilding ? 'Rebuilding...' : 'Rebuild Index'}
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving || isRebuilding}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
