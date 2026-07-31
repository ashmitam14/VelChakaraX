import { motion } from 'framer-motion';
import { Bot, Clock3, Sparkles } from 'lucide-react';
import MessageActions from './MessageActions';

export default function ChatBubble({ message }) {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex justify-end"
      >
        <div className="max-w-[78%] rounded-2xl rounded-br-md bg-blue-100 px-4 py-3 text-sm leading-6 text-slate-800 shadow-sm">
          {message.text}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex justify-start"
    >
      <div className="max-w-[84%]">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sky-300">
            <Bot className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-slate-800">PolicyMind</span>
            <span className="text-slate-400">•</span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock3 className="h-3 w-3" />
              {message.timestamp}
            </span>
          </div>
        </div>

        <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_-22px_rgba(15,23,42,0.25)]">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Responsible AI principles
          </div>

          <ul className="space-y-3 text-sm leading-6 text-slate-600">
            {message.points.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <MessageActions />
      </div>
    </motion.div>
  );
}
