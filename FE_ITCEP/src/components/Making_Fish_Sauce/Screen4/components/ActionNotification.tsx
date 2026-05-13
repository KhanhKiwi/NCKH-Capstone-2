import { useEffect } from 'react';

interface ActionNotificationProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export function ActionNotification({ message, show, onClose }: ActionNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-br from-[#5f7c8a] to-[#4a6572] text-white px-6 py-4 rounded-xl shadow-2xl border border-white/20 backdrop-blur-xl flex items-center gap-3 min-w-[280px] max-w-md">
        <span className="text-lg flex-shrink-0">✓</span>
        <p className="text-sm flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
