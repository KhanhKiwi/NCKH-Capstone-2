import type { DryingCellType } from "../types"
import DryingCell from "./DryingCell"

type Props = {
  cells: DryingCellType[]
  dropSedge:(cellId:number, bundleIndex:number)=>void
  onBundleDragStart?: (bundleIndex: number, progress: number) => void
  onHarvest?: (cellId: number, bundleIndex: number) => void
  weather?: string
}

const DryingGrid = ({ cells, dropSedge, onBundleDragStart, onHarvest, weather }: Props) => {

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f5d9b8 0%, #f9e4c8 100%)',
      border: '2px solid #d4a574',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: '15px'
      }}>
        {cells.map(cell => (
          <DryingCell
            key={cell.id}
            cell={cell}
            onDrop={dropSedge}
            onDragStart={onBundleDragStart}
            onHarvest={onHarvest}
            weather={weather}
          />
        ))}
      </div>
    </div>
  )
}

export default DryingGrid