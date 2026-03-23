import type { DryingCellType } from "../types"
import { useState } from "react"

type Props = {
  cell: DryingCellType
  onDrop: (cellId: number, bundleIndex: number)=>void
  onHarvest?: (cellId: number, bundleIndex: number) => void
  weather?: string
  onDragStart?: (bundleIndex: number, progress: number) => void
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: (e: React.DragEvent) => void
}

const DryingCell = ({ cell, onDrop, onHarvest, weather, onDragStart, onDragOver, onDragLeave }: Props) => {
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
        border: isDragOver ? "3px solid #ff9500" : "2px solid #d4a574",
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
            50% { color: #ef4444; }
            100% { color: #5a4a3a; }
          }
          @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
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
              : 'linear-gradient(90deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
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
              <line x1="6" y1="0" x2="4" y2="-5" stroke={cell.status === 'damaged' ? '#8b7355' : '#22c55e'} strokeWidth="2" opacity="0.8" />
              <line x1="17" y1="0" x2="16" y2="-6" stroke={cell.status === 'damaged' ? '#8b7355' : '#22c55e'} strokeWidth="2" opacity="0.8" />
              <line x1="29" y1="0" x2="31" y2="-5" stroke={cell.status === 'damaged' ? '#8b7355' : '#22c55e'} strokeWidth="2" opacity="0.8" />
              
              {/* Texture lines */}
              <line x1="4" y1="12" x2="10" y2="40" stroke={cell.status === 'damaged' ? '#2a1f15' : '#15803d'} strokeWidth="1" opacity="0.5" />
              <line x1="17" y1="8" x2="17" y2="52" stroke={cell.status === 'damaged' ? '#2a1f15' : '#164e63'} strokeWidth="1" opacity="0.4" />
              <line x1="31" y1="15" x2="25" y2="60" stroke={cell.status === 'damaged' ? '#2a1f15' : '#15803d'} strokeWidth="1" opacity="0.5" />
            </svg>
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
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
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
                boxShadow: '0 4px 8px rgba(245, 158, 11, 0.5)',
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
          Kéo cối<br/>vào đây
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
