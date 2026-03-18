    import type { DryingCellType } from "../types"
import { useState } from "react"

type Props = {
  cell: DryingCellType
  onDrop: (cellId: number, bundleIndex: number)=>void
  onDragStart?: (bundleIndex: number, progress: number) => void
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: (e: React.DragEvent) => void
}

const DryingCell = ({ cell, onDrop, onDragStart, onDragOver, onDragLeave }: Props) => {
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
            cursor: 'grab'
          }}
        >
          {/* Sedge bundle visualization */}
          <div style={{
            width: '35px',
            height: '80px',
            background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
            borderRadius: '3px',
            position: 'relative',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            border: '1px solid #15803d'
          }}>
            {/* SVG texture */}
            <svg
              width="35"
              height="80"
              style={{
                position: 'absolute',
                top: 0,
                left: 0
              }}
            >
              {/* Top leaves */}
              <line x1="6" y1="0" x2="4" y2="-5" stroke="#22c55e" strokeWidth="2" opacity="0.8" />
              <line x1="17" y1="0" x2="16" y2="-6" stroke="#22c55e" strokeWidth="2" opacity="0.8" />
              <line x1="29" y1="0" x2="31" y2="-5" stroke="#22c55e" strokeWidth="2" opacity="0.8" />
              
              {/* Texture lines */}
              <line x1="4" y1="12" x2="10" y2="40" stroke="#15803d" strokeWidth="1" opacity="0.5" />
              <line x1="17" y1="8" x2="17" y2="52" stroke="#164e63" strokeWidth="1" opacity="0.4" />
              <line x1="31" y1="15" x2="25" y2="60" stroke="#15803d" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
          
          {/* Progress percentage */}
          <div style={{
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#5a4a3a',
            textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)'
          }}>
            {Math.floor(cell.progress)}%
          </div>
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