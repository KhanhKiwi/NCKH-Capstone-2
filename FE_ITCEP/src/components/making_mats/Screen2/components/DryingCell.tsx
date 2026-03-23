import type { DryingCellType } from "../types"
import { useState } from "react"

type Props = {
  cell: DryingCellType
  onDrop: (cellId: number, bundleIndex: number)=>void
  onHarvest?: (cellId: number, bundleIndex: number) => void
  onCatchBug?: (cellId: number, bugId: string) => void
  weather?: string
  onDragStart?: (bundleIndex: number, progress: number) => void
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: (e: React.DragEvent) => void
}

const DryingCell = ({ cell, onDrop, onHarvest, onCatchBug, weather, onDragStart, onDragOver, onDragLeave }: Props) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const getColor = () => {
    if (cell.quality === "best") return "linear-gradient(135deg, #a7d86e, #8ec45a)"
    if (cell.quality === "bad") return "linear-gradient(135deg, #f0a550, #e8924a)"
    return "linear-gradient(135deg, #e8d9c3, #dfc9a8)"
  }

  const getQualityLabel = () => {
    if (cell.quality === "best") return "⭐ Tốt nhất"
    if (cell.quality === "bad") return "▽ Kém"
    return "◯ Bình thường"
  }

  const getQualityColor = () => {
    if (cell.quality === "best") return "#468c1d"
    if (cell.quality === "bad") return "#c45a1a"
    return "#8b7a5a"
  }

  const getSpeedMultiplier = () => {
    if (cell.quality === "best") return 1.2
    if (cell.quality === "bad") return 0.5
    return 1.0
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
    if (onDragOver) onDragOver(e)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    setIsDragOver(false)
    if (onDragLeave) onDragLeave(e)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const bundleIndex = e.dataTransfer.getData('bundleIndex')
    if (bundleIndex !== null && bundleIndex !== undefined) {
      onDrop(cell.id, parseInt(bundleIndex))
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        minHeight: '100px',
        background: getColor(),
        border: isDragOver ? "3px solid #A0522D" : "2px solid #d4a574",
        borderRadius: '12px',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        padding: '15px',
        boxShadow: isDragOver ? '0 8px 16px rgba(255, 149, 0, 0.4)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        transform: isDragOver ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-3px); }
            75% { transform: translateX(3px); }
          }
          @keyframes rainDamage {
            0% { color: #5a4a3a; }
            50% { color: #A0522D; }
            100% { color: #5a4a3a; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes bug-crawl {
            0% { transform: translate(-50%, -50%) translateX(0px) rotateZ(0deg); }
            25% { transform: translate(-50%, -50%) translateX(3px) rotateZ(15deg); }
            50% { transform: translate(-50%, -50%) translateX(-2px) rotateZ(-10deg); }
            75% { transform: translate(-50%, -50%) translateX(2px) rotateZ(10deg); }
            100% { transform: translate(-50%, -50%) translateX(0px) rotateZ(0deg); }
          }
        `}
      </style>
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        color: getQualityColor(),
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        {getQualityLabel()}
      </div>

      {cell.hasSedge ? (
        <div 
          draggable
          onDragStart={(e) => {
            if (cell.bundleIndex !== undefined) {
              e.dataTransfer.effectAllowed = 'move'
              e.dataTransfer.setData('bundleIndex', cell.bundleIndex.toString())
              e.dataTransfer.setData('fromCellId', cell.id.toString())
              e.dataTransfer.setData('progress', cell.progress.toString())
              if (onDragStart) onDragStart(cell.bundleIndex, cell.progress)
            }
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'grab',
            position: 'relative'
          }}
        >
          {/* Sedge bundle visualization */}
          <div style={{
            width: '35px',
            height: '80px',
            background: cell.status === 'damaged' 
              ? 'linear-gradient(90deg, #4a3728 0%, #3d2f1f 50%, #2a1f15 100%)'
              : 'linear-gradient(90deg, #8B7355 0%, #6B5D4F 50%, #5A4A40 100%)',
            borderRadius: '3px',
            position: 'relative',
            boxShadow: cell.status === 'damaged'
              ? '0 4px 12px rgba(0, 0, 0, 0.6), inset 0 0 8px rgba(0, 0, 0, 0.8)'
              : '0 4px 8px rgba(0, 0, 0, 0.3)',
            border: cell.status === 'damaged' ? '1px solid #1a0f0a' : '1px solid #15803d',
            animation: cell.status === 'damaged' ? 'shake 0.5s ease-in-out infinite' : 'none'
          }}>
            {/* SVG texture */}
            <svg
              width="35"
              height="80"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: cell.status === 'damaged' ? 0.3 : 1
              }}
            >
              {/* Top leaves */}
              <line x1="6" y1="0" x2="4" y2="-5" stroke={cell.status === 'damaged' ? '#8b7355' : '#8B7355'} strokeWidth="2" opacity="0.8" />
              <line x1="17" y1="0" x2="16" y2="-6" stroke={cell.status === 'damaged' ? '#8b7355' : '#8B7355'} strokeWidth="2" opacity="0.8" />
              <line x1="29" y1="0" x2="31" y2="-5" stroke={cell.status === 'damaged' ? '#8b7355' : '#8B7355'} strokeWidth="2" opacity="0.8" />
              
              {/* Texture lines */}
              <line x1="4" y1="12" x2="10" y2="40" stroke={cell.status === 'damaged' ? '#2a1f15' : '#15803d'} strokeWidth="1" opacity="0.5" />
              <line x1="17" y1="8" x2="17" y2="52" stroke={cell.status === 'damaged' ? '#2a1f15' : '#164e63'} strokeWidth="1" opacity="0.4" />
              <line x1="31" y1="15" x2="25" y2="60" stroke={cell.status === 'damaged' ? '#2a1f15' : '#15803d'} strokeWidth="1" opacity="0.5" />
            </svg>

            {/* Bugs rendering */}
            {cell.bugs && cell.bugs.length > 0 && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'auto'
              }}>
                {cell.bugs.map(bug => (
                  <svg
                    key={bug.id}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (onCatchBug) {
                        onCatchBug(cell.id, bug.id)
                      }
                    }}
                    style={{
                      position: 'absolute',
                      left: `${bug.x}%`,
                      top: `${bug.y}%`,
                      cursor: 'pointer',
                      transform: 'translate(-50%, -50%)',
                      animation: 'bug-crawl 2s infinite ease-in-out',
                      transition: 'all 0.2s ease',
                      filter: `drop-shadow(0 0 4px ${bug.color})`
                    }}
                  >
                    {/* Antennae */}
                    <line x1="8" y1="2" x2="5" y2="1" stroke={bug.color} strokeWidth="1" strokeLinecap="round" />
                    <line x1="8" y1="2" x2="11" y2="1" stroke={bug.color} strokeWidth="1" strokeLinecap="round" />
                    
                    {/* Head */}
                    <circle cx="8" cy="4" r="2" fill={bug.color} />
                    
                    {/* Body segments */}
                    <ellipse cx="8" cy="8" rx="2.5" ry="3" fill={bug.color} opacity="0.9" />
                    <circle cx="8" cy="12" r="2" fill={bug.color} opacity="0.8" />
                    
                    {/* Legs - left side */}
                    <line x1="5.5" y1="7" x2="2" y2="6" stroke={bug.color} strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="5.5" y1="9" x2="2" y2="10" stroke={bug.color} strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="5.5" y1="11" x2="2" y2="13" stroke={bug.color} strokeWidth="1.5" strokeLinecap="round" />
                    
                    {/* Legs - right side */}
                    <line x1="10.5" y1="7" x2="14" y2="6" stroke={bug.color} strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="10.5" y1="9" x2="14" y2="10" stroke={bug.color} strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="10.5" y1="11" x2="14" y2="13" stroke={bug.color} strokeWidth="1.5" strokeLinecap="round" />
                    
                    {/* Eyes */}
                    <circle cx="7" cy="3.5" r="0.5" fill="white" opacity="0.8" />
                    <circle cx="9" cy="3.5" r="0.5" fill="white" opacity="0.8" />
                  </svg>
                ))}
              </div>
            )}
          </div>
          
          {/* Progress percentage */}
          <div style={{
            fontSize: '22px',
            fontWeight: 'bold',
            color: cell.status === 'damaged' ? '#8b4513' : '#5a4a3a',
            textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)',
            animation: weather === 'rainy' && cell.status !== 'ready' && cell.status !== 'damaged' ? 'rainDamage 0.8s ease infinite' : 'none'
          }}>
            {Math.floor(cell.progress)}%
          </div>

          {/* Harvest button for ready status */}
          {cell.status === 'ready' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (cell.bundleIndex !== undefined && onHarvest) {
                  onHarvest(cell.id, cell.bundleIndex)
                }
              }}
              style={{
                background: 'linear-gradient(135deg, #CD853F, #8B4513)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(160, 82, 45, 0.5)',
                animation: 'pulse 1.5s ease-in-out infinite',
                marginTop: '4px'
              }}
              title="Chi tay lấy cối"
            >
              ✋
            </button>
          )}
        </div>
      ) : (
        <div style={{
          fontSize: '12px',
          color: '#8b7a5a',
          textAlign: 'center'
        }}>
          Kéo cói<br/>vào đây
        </div>
      )}

      {cell.hasSedge && (
        <div style={{
          fontSize: '10px',
          color: '#6b5b4b',
          marginTop: '5px'
        }}>
          Tốc độ x{getSpeedMultiplier()}.0
        </div>
      )}

    </div>
  )
}

export default DryingCell