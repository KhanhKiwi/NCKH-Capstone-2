import { useEffect, useState } from 'react'

interface TooltipPosition {
  top: number
  left: number
}

interface TutorialTooltipProps {
  text: string
  element?: string // CSS selector
  position?: 'top' | 'bottom' | 'left' | 'right'
  visible?: boolean
}

const TutorialTooltip = ({
  text,
  element,
  position = 'top',
  visible = true
}: TutorialTooltipProps) => {
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null)

  useEffect(() => {
    if (!visible || !element) return

    const updatePosition = () => {
      const el = document.querySelector(element)
      if (!el) return

      const rect = el.getBoundingClientRect()
      let top = rect.top
      let left = rect.left

      const offset = 16
      const tooltipWidth = 250
      const tooltipHeight = 80

      switch (position) {
        case 'top':
          top = rect.top - tooltipHeight - offset
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          break
        case 'bottom':
          top = rect.bottom + offset
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          break
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.left - tooltipWidth - offset
          break
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.right + offset
          break
      }

      setTooltipPos({
        top: Math.max(10, top),
        left: Math.max(10, left)
      })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [element, position, visible])

  if (!visible || !tooltipPos) return null

  const getArrowStyle = () => {
    const arrowSize = 8
    const styles: Record<string, React.CSSProperties> = {
      top: {
        bottom: `-${arrowSize}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: `${arrowSize}px solid transparent`,
        borderRight: `${arrowSize}px solid transparent`,
        borderTop: `${arrowSize}px solid #fbbf24`
      },
      bottom: {
        top: `-${arrowSize}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: `${arrowSize}px solid transparent`,
        borderRight: `${arrowSize}px solid transparent`,
        borderBottom: `${arrowSize}px solid #fbbf24`
      },
      left: {
        right: `-${arrowSize}px`,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: `${arrowSize}px solid transparent`,
        borderBottom: `${arrowSize}px solid transparent`,
        borderLeft: `${arrowSize}px solid #fbbf24`
      },
      right: {
        left: `-${arrowSize}px`,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: `${arrowSize}px solid transparent`,
        borderBottom: `${arrowSize}px solid transparent`,
        borderRight: `${arrowSize}px solid #fbbf24`
      }
    }
    return styles[position]
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: tooltipPos.top,
        left: tooltipPos.left,
        zIndex: 1002,
        pointerEvents: 'none',
        animation: 'fadeInScale 0.3s ease-out'
      }}
    >
      <style>
        {`
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>

      <div
        style={{
          backgroundColor: '#fbbf24',
          color: '#5a4a3a',
          padding: '12px 16px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '500',
          maxWidth: '250px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          lineHeight: '1.4',
          position: 'relative'
        }}
      >
        {text}
        <div
          style={{
            position: 'absolute',
            ...getArrowStyle()
          }}
        />
      </div>
    </div>
  )
}

export default TutorialTooltip
