interface NPCOverlayProps {
  data: { text: string; image: string }
  onClose?: () => void
}

export function NPCOverlay({ data, onClose }: NPCOverlayProps) {
  return (
    <div
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 1300,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 12,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: 360,
          background: 'rgba(17, 24, 39, 0.92)',
          border: '2px solid rgba(250, 204, 21, 0.45)',
          borderRadius: 14,
          padding: '12px 34px 12px 14px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.35)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          pointerEvents: 'auto',
        }}
      >
        {onClose ? (
          <button
            type="button"
            aria-label="Đóng NPC"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 8,
              right: 10,
              width: 24,
              height: 24,
              border: 'none',
              borderRadius: 9999,
              background: 'rgba(250, 204, 21, 0.18)',
              color: '#fde68a',
              fontSize: 18,
              lineHeight: '24px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              pointerEvents: 'auto',
            }}
          >
            ×
          </button>
        ) : null}
        <div style={{ fontSize: 12, color: '#fcd34d', marginBottom: 6, fontWeight: 700 }}>
          Anh Minh
        </div>
        <p
          style={{
            margin: 0,
            fontSize: '1rem',
            lineHeight: 1.45,
            color: '#fde68a',
            fontWeight: 600,
          }}
        >
          {data.text}
        </p>
      </div>

      <img
        src={`/images/${data.image}`}
        alt={`Anh Minh - ${data.image}`}
        onError={(e) => {
          const target = e.currentTarget
          if (target.src.endsWith('/Friendly.jpg')) return
          target.src = '/images/Friendly.jpg'
        }}
        style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          border: '2px solid rgba(250, 204, 21, 0.5)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          background: '#1f2937',
          objectFit: 'cover',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

