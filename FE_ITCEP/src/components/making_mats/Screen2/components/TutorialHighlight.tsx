import { useEffect, useState } from 'react'
import type { TutorialStep } from '../hooks/useTutorial'

interface HighlightBox {
  top: number
  left: number
  width: number
  height: number
}

interface TutorialHighlightProps {
  step: TutorialStep
  isActive: boolean
}

const TutorialHighlight = ({ step, isActive }: TutorialHighlightProps) => {
  const [highlightBox, setHighlightBox] = useState<HighlightBox | null>(null)

  useEffect(() => {
    if (!isActive || !step.highlightElement) {
      setHighlightBox(null)
      return
    }

    const updateHighlight = () => {
      const element = document.querySelector(step.highlightElement!)
      if (element) {
        const rect = element.getBoundingClientRect()
        setHighlightBox({
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16
        })
      }
    }

    updateHighlight()
    const resizeObserver = new ResizeObserver(updateHighlight)
    const element = document.querySelector(step.highlightElement!)
    if (element) {
      resizeObserver.observe(element)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [step.highlightElement, isActive])

  if (!isActive || !highlightBox) return null

  return (
    <>
      <style>
        {`
          @keyframes highlightPulse {
            0%, 100% {
              box-shadow: 0 0 0 4px #22c55e, 0 0 20px 6px rgba(34, 197, 94, 0.3);
            }
            50% {
              box-shadow: 0 0 0 6px #22c55e, 0 0 30px 10px rgba(34, 197, 94, 0.5);
            }
          }

          .tutorial-highlight {
            animation: highlightPulse 1.5s ease-in-out infinite;
          }
        `}
      </style>

      {/* Scrim overlay with cutout */}
      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 999,
          pointerEvents: 'none'
        }}
      >
        <defs>
          <mask id="highlight-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={highlightBox.left}
              y={highlightBox.top}
              width={highlightBox.width}
              height={highlightBox.height}
              fill="black"
              rx="12"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="black"
          opacity="0.5"
          mask="url(#highlight-mask)"
        />
      </svg>

      {/* Highlight border */}
      <div
        className="tutorial-highlight"
        style={{
          position: 'fixed',
          top: highlightBox.top,
          left: highlightBox.left,
          width: highlightBox.width,
          height: highlightBox.height,
          border: '4px solid #22c55e',
          borderRadius: '12px',
          pointerEvents: 'none',
          zIndex: 999,
          boxShadow: '0 0 0 4px #22c55e, 0 0 20px 6px rgba(34, 197, 94, 0.3)'
        }}
      />

      {/* Arrow pointing to element */}
      <div
        style={{
          position: 'fixed',
          top: highlightBox.top - 30,
          left: highlightBox.left + highlightBox.width / 2,
          transform: 'translateX(-50%)',
          fontSize: '32px',
          animation: 'bounce 1s infinite',
          pointerEvents: 'none',
          zIndex: 1000
        }}
      >
        ⬇️
      </div>

      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-10px); }
          }
        `}
      </style>
    </>
  )
}

export default TutorialHighlight
