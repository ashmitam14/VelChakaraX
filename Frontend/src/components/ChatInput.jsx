import { SendHorizonal } from 'lucide-react'

export default function ChatInput({ value, onChange, onSend }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <div className="border-t border-slate-200/90 bg-white/90 px-4 pb-4 pt-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.45)] transition duration-200 focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]">
        <textarea
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about policy clauses, compliance workflows, or legal risks..."
          className="max-h-40 min-h-[44px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />

        <button
          type="button"
          onClick={onSend}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition duration-200 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          aria-label="Send"
        >
          <SendHorizonal className="h-4 w-4" />
        </button>
      </div>

      <p className="mx-auto mt-2 max-w-4xl px-2 text-[11px] text-slate-400">
        AI-generated support for legal workflows. Review outputs before final decisions.
      </p>
    </div>
  )
}
