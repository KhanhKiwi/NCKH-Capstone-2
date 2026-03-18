import { useState } from 'react'

type Props = {
  total:number
  placedBundles?: Set<number>
  draggingBundleIndex?: number | null
  draggedBundleProgress?: number
  setDraggingBundleIndex?: (index: number | null) => void
  setBundleProgress?: (setter: (prev: Map<number, number>) => Map<number, number>) => void
  onReturn?: (cellId: number, bundleIndex: number) => void
  onDragStart?: (e: React.DragEvent, index: number) => void
}

const SedgeBasket = ({ total, placedBundles = new Set(), draggingBundleIndex, draggedBundleProgress = 0, setDraggingBundleIndex, setBundleProgress, onReturn, onDragStart }: Props) => {
  const [returnedMessage, setReturnedMessage] = useState<{ bundleIndex: number; progress: number } | null>(null)

  const handleBundleReturned = (bundleIndex: number, progress: number) => {
    setReturnedMessage({ bundleIndex, progress })
    setTimeout(() => {
      setReturnedMessage(null)
    }, 3000)
  }
  // Tạo các vị trí ngẫu nhiên cho các bó cói - phân tán khắp nơi
  const getRandomPosition = (index: number) => {
    const cols = 5
    const col = index % cols
    
    return {
      left: `${15 + col * 18}%`,
      top: `${20 + (index * 27) % 80}%`,
      transform: `rotate(${-20 + (index * 37) % 40}deg) skewY(${-5 + (index * 13) % 10}deg)`,
      transition: 'all 0.3s ease'
    }
  }

  return (
    <div 
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      }}
      onDrop={(e) => {
        e.preventDefault()
        const bundleIndex = e.dataTransfer.getData('bundleIndex')
        const fromCellId = e.dataTransfer.getData('fromCellId')
        const progress = e.dataTransfer.getData('progress')
        
        if (bundleIndex && fromCellId && onReturn) {
          onReturn(parseInt(fromCellId), parseInt(bundleIndex))
          // Lưu progress của bundle vào map
          if (progress && setBundleProgress) {
            setBundleProgress(prevMap => {
              const newMap = new Map(prevMap)
              newMap.set(parseInt(bundleIndex), parseFloat(progress))
              return newMap
            })
          }
        }
      }}
      style={{
      background: 'linear-gradient(135deg, #8b7355, #a0886b)',
      border: '2px solid #d4a574',
      borderRadius: '12px',
      padding: '30px',
      color: 'white',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        zIndex: 10
      }}>
        <div style={{ fontSize: '32px' }}>🧺</div>
        <h3 style={{
          margin: 0,
          fontSize: '22px',
          fontWeight: 'bold'
        }}>
          Giỏ cói ({total || 10} bộ)
        </h3>
      </div>

      {/* Dragged bundle progress indicator */}
      {draggingBundleIndex !== null && draggedBundleProgress !== undefined && (
        <div style={{
          position: 'absolute',
          top: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(4px)',
          border: '2px solid #22c55e'
        }}>
          <span>🌾 Cói #{(draggingBundleIndex ?? 0) + 1}</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#22c55e' }}>
            {Math.floor(draggedBundleProgress)}%
          </span>
        </div>
      )}

      {/* Scattered sedge bundles */}
      <div style={{
        position: 'relative',
        flex: 1,
        minHeight: '300px'
      }}>
        {/* Background ground */}
        <svg
          width="100%"
          height="100%"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0.3,
            zIndex: 0,
            pointerEvents: 'none'
          }}
        >
          <defs>
            <pattern id="ground" x="20" y="20" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="#5a4a3a" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ground)" />
        </svg>

        {/* Bundles */}
        {Array.from({ length: total || 10 })
          .map((_, i) => i)
          .filter(i => !placedBundles.has(i) || draggingBundleIndex === i)
          .map((i) => {
            const isDragging = draggingBundleIndex === i
            return (
          <div
            key={i}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move'
              e.dataTransfer.setData('bundleIndex', i.toString())
              
              // Create custom drag image
              const dragImage = document.createElement('div')
              dragImage.style.position = 'absolute'
              dragImage.style.width = '45px'
              dragImage.style.height = '100px'
              dragImage.style.background = 'linear-gradient(90deg, #22c55e 0%, #16a34a 50%, #15803d 100%)'
              dragImage.style.borderRadius = '3px'
              dragImage.style.border = '2px solid #15803d'
              dragImage.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.5)'
              dragImage.style.zIndex = '-1'
              dragImage.style.opacity = '0.8'
              document.body.appendChild(dragImage)
              e.dataTransfer.setDragImage(dragImage, 22, 50)
              setTimeout(() => document.body.removeChild(dragImage), 0)
              
              if (setDraggingBundleIndex) setDraggingBundleIndex(i)
              if (onDragStart) onDragStart(e, i)
            }}
            onDragEnd={() => {
              if (setDraggingBundleIndex) setDraggingBundleIndex(null)
            }}
            style={{
              position: 'absolute',
              cursor: isDragging ? 'grabbing' : 'grab',
              opacity: isDragging ? 1 : 1,
              zIndex: isDragging ? 100 : 1,
              ...getRandomPosition(i)
            }}
          >
            {/* Sedge bundle */}
            <div
              style={{
                width: '45px',
                height: '100px',
                background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
                borderRadius: '3px',
                position: 'relative',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4), inset -2px 0 4px rgba(0, 0, 0, 0.2)',
                border: '1px solid #15803d',
                transition: 'all 0.2s ease'
              }}
            >
              {/* SVG texture */}
              <svg
                width="45"
                height="100"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              >
                {/* Top leaves */}
                <line x1="8" y1="0" x2="5" y2="-6" stroke="#22c55e" strokeWidth="2" opacity="0.8" />
                <line x1="22" y1="0" x2="20" y2="-8" stroke="#22c55e" strokeWidth="2" opacity="0.8" />
                <line x1="37" y1="0" x2="40" y2="-6" stroke="#22c55e" strokeWidth="2" opacity="0.8" />
                
                {/* Texture lines */}
                <line x1="5" y1="15" x2="12" y2="50" stroke="#15803d" strokeWidth="1" opacity="0.5" />
                <line x1="22" y1="10" x2="22" y2="65" stroke="#164e63" strokeWidth="1" opacity="0.4" />
                <line x1="40" y1="20" x2="33" y2="75" stroke="#15803d" strokeWidth="1" opacity="0.5" />
              </svg>

              {/* Number label */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)',
                  zIndex: 10
                }}
              >
                {i + 1}
              </div>
            </div>
          </div>
            )
          })}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.95)',
          textAlign: 'center',
          fontStyle: 'italic',
          marginTop: '15px',
          zIndex: 10
        }}
      >
        Kéo cói vào các ô phơi để bắt đầu - tốc độ phơi tùy vị trí
      </div>

    </div>
  )
}

export default SedgeBasket