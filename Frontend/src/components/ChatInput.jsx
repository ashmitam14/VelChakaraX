import { Paperclip, SendHorizonal } from 'lucide-react';

export default function ChatInput() {
  return (
    <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 shadow-sm transition focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]">
          <input
            type="text"
            placeholder="Ask anything about AI governance, ethics, risks, or policies..."
            className="flex-1 border-0 bg-transparent px-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />

          <button
            type="button"
            aria-label="Attach file"
            className="mr-2 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Send message"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-500"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-center text-[11px] text-slate-400">
          AI-generated guidance. Not legal advice.
        </p>
      </div>
    </div>
  );
}
