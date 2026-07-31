import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

const initialMessages = [
  {
    sender: 'bot',
    timestamp: '9:42 AM',
    text: 'Here is a practical governance approach for AI deployment.',
    points: [
      'Fairness',
      'Transparency',
      'Accountability',
      'Privacy',
      'Safety & Security',
      'Human Oversight',
    ],
  },
];

export default function ChatWindow() {
  return (
    <div className="flex h-[calc(100vh-190px)] min-h-[420px] flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-[#F8FAFC]">
      <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-6 pt-5 sm:px-6 lg:px-8">
        {initialMessages.map((message, index) => (
          <ChatBubble key={`${message.sender}-${index}`} message={message} />
        ))}
      </div>

      <ChatInput />
    </div>
  );
}
