export type CellQuality = "best" | "normal" | "bad"

export type DryingCellType = {
  id: number
  quality: CellQuality
  speed: number
  hasSedge?: boolean
  bundleIndex?: number
  progress: number
}