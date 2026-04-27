import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FeedbackOverlayProps {
  message?: string;
  type?: 'info' | 'success' | 'error';
  visible?: boolean;
  onDismiss?: () => void;
}

export function FeedbackOverlay({ message, type = 'info', visible = false, onDismiss }: FeedbackOverlayProps) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);
    if (visible) {
      const timer = setTimeout(() => {
        setShow(false);
        onDismiss?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  if (!show || !message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      default: return AlertCircle;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'rgba(74, 124, 89, 0.95)',
          border: '#5a8a6a',
          icon: '#d4f4dd'
        };
      case 'error':
        return {
          bg: 'rgba(184, 84, 80, 0.95)',
          border: '#c46460',
          icon: '#ffd4d2'
        };
      default:
        return {
          bg: 'rgba(107, 142, 154, 0.95)',
          border: '#7a9aaa',
          icon: '#d4e4ea'
        };
    }
  };

  const Icon = getIcon();
  const colors = getColors();

  return (
    <div className="absolute inset-x-0 top-24 md:top-28 lg:top-32 z-50 flex justify-center px-6 md:px-8 pointer-events-none">
      <div
        className="flex items-start gap-3 md:gap-4 p-4 md:p-5 lg:p-6 rounded-xl shadow-lg max-w-sm md:max-w-md lg:max-w-lg pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-300"
        style={{
          background: colors.bg,
          border: `2px solid ${colors.border}`,
          backdropFilter: 'blur(8px)'
        }}
      >
        <Icon
          className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5"
          style={{ color: colors.icon, strokeWidth: 2.5 }}
        />
        <p
          style={{
            fontSize: 'clamp(12px, 2.5vw, 15px)',
            lineHeight: 1.4,
            color: '#ffffff',
            fontWeight: 500,
            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
