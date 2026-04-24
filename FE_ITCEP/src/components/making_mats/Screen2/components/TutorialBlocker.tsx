interface TutorialBlockerProps {
  isActive: boolean
  onInterceptClick?: () => void
}

const TutorialBlocker = ({ isActive, onInterceptClick }: TutorialBlockerProps) => {
  if (!isActive) return null

  return (
    <div
      onClick={onInterceptClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 995,
        cursor: 'not-allowed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '24px 32px',
          borderRadius: '16px',
          fontSize: '18px',
          fontWeight: 'bold',
          textAlign: 'center',
          backdropFilter: 'blur(4px)'
        }}
      >
        ⚠️ Hãy hoàn thành bước hướng dẫn trước!
      </div>
    </div>
  )
}

export default TutorialBlocker
