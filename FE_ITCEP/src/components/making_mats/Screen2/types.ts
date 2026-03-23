export type CellQuality = "best" | "normal" | "bad"
export type CellStatus = "drying" | "ready" | "damaged"

export type DryingCellType = {
  id: number
  quality: CellQuality
  speed: number
  hasSedge?: boolean
  bundleIndex?: number
  progress: number
  status?: CellStatus
}