import type { TutorialStep, TutorialState } from '../hooks/useTutorial'

interface TutorialOverlayProps {
  step: TutorialStep
  stepIndex: number
  totalSteps: number
  tutorialState: TutorialState
  onNext: () => void
  onSkip: () => void
}

const TutorialOverlay = ({
  step,
  stepIndex,
  totalSteps,
  tutorialState,
  onNext,
  onSkip
}: TutorialOverlayProps) => {
  if (!tutorialState.isActive || !step) return null

  const isLastStep = stepIndex === totalSteps - 1
  const progress = ((stepIndex + 1) / totalSteps) * 100

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
          backdropFilter: 'blur(2px)'
        }}
      />

      {/* Tutorial Card */}
      <div
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '30px',
          maxWidth: '400px',
          zIndex: 1001,
          animation: 'slideIn 0.3s ease-out'
        }}
      >
        <style>
          {`
            @keyframes slideIn {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }

            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }

            .tutorial-pulse {
              animation: pulse 2s infinite;
            }

            .tutorial-skip-btn:hover {
              background-color: #e5e7eb;
            }
          `}
        </style>

        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '12px'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              color: '#5a4a3a',
              fontWeight: 'bold'
            }}>
              {step.title}
            </h2>
            <button
              onClick={onSkip}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                color: '#aaa'
              }}
            >
              ✕
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#e5e7eb',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: '#22c55e',
                transition: 'width 0.3s ease'
              }}
            />
          </div>

          <div style={{
            fontSize: '12px',
            color: '#8b6f47',
            fontWeight: 'bold'
          }}>
            Bước {stepIndex + 1}/{totalSteps}
          </div>
        </div>

        {/* Content */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{
            margin: '0 0 12px 0',
            fontSize: '13px',
            color: '#666',
            fontStyle: 'italic'
          }}>
            {step.description}
          </p>

          <div style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #fcd34d',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '16px',
              color: '#5a4a3a',
              lineHeight: '1.5',
              margin: 0
            }}>
              {step.instruction}
            </div>
          </div>

          {step.action && (
            <div style={{
              backgroundColor: '#f0f9ff',
              border: '2px dashed #0ea5e9',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '13px',
              color: '#0369a1',
              textAlign: 'center'
            }}>
              ✓ Hãy hoàn thành hành động: <strong>{getActionName(step.action)}</strong>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isLastStep ? '1fr' : '1fr 1fr',
          gap: '12px'
        }}>
          {!isLastStep && (
            <button
              onClick={onSkip}
              className="tutorial-skip-btn"
              style={{
                padding: '12px 16px',
                backgroundColor: '#f3f4f6',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#6b7280',
                transition: 'all 0.2s'
              }}
            >
              Bỏ qua
            </button>
          )}

          <button
            onClick={isLastStep ? onSkip : onNext}
            style={{
              padding: '12px 16px',
              backgroundColor: '#22c55e',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'white',
              transition: 'all 0.2s',
              gridColumn: isLastStep ? '1 / -1' : 'auto'
            }}
          >
            {isLastStep ? '🎉 Bắt đầu chơi!' : 'Tiếp theo →'}
          </button>
        </div>

        {/* Step indicator dots */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginTop: '16px',
          justifyContent: 'center'
        }}>
          {Array.from({ length: Math.min(totalSteps, 8) }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: i <= stepIndex ? '#22c55e' : '#d1d5db',
                transition: 'background-color 0.2s'
              }}
            />
          ))}
        </div>
      </div>
    </>
  )
}

const getActionName = (action: string): string => {
  const actionMap: Record<string, string> = {
    startDragging: 'Kéo cối từ giỏ',
    dropBundleOnCell: 'Thả cối vào ô phơi',
    harvestBundle: 'Thu hoạch cối',
    observeProgress: 'Quan sát tiến độ'
  }
  return actionMap[action] || action
}

export default TutorialOverlay
