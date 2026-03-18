import { useEffect, useState } from "react"
import { GRID_DATA } from "../constants"
import type { DryingCellType } from "../types"

export const useDryingGame = () => {

  const [cells, setCells] = useState<DryingCellType[]>(GRID_DATA)
  const [totalBundles] = useState(10)
  const [placedBundles, setPlacedBundles] = useState<Set<number>>(new Set())
  const [draggingBundleIndex, setDraggingBundleIndex] = useState<number | null>(null)
  const [draggedBundleProgress, setDraggedBundleProgress] = useState<number>(0)
  const [bundleProgress, setBundleProgress] = useState<Map<number, number>>(new Map())

  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)

  const [weather] = useState("rain")
  const [wind] = useState("strong")

  const dropSedge = (cellId: number, bundleIndex: number) => {

    if (placedBundles.has(bundleIndex)) return

    const savedProgress = bundleProgress.get(bundleIndex) ?? 0

    setCells(prev =>
      prev.map(cell =>
        cell.id === cellId && !cell.hasSedge
          ? { ...cell, hasSedge: true, bundleIndex: bundleIndex, progress: savedProgress }
          : cell
      )
    )

    setPlacedBundles(prev => new Set([...prev, bundleIndex]))
    setDraggingBundleIndex(null)
    setDraggedBundleProgress(0)
  }

  const returnSedge = (cellId: number, bundleIndex: number) => {
    setCells(prev =>
      prev.map(cell =>
        cell.id === cellId
          ? { ...cell, hasSedge: false, progress: 0 }
          : cell
      )
    )

    setPlacedBundles(prev => {
      const newSet = new Set(prev)
      newSet.delete(bundleIndex)
      return newSet
    })

    // Lưu progress khi lấy cối vào giỏ
    setCells(prev => {
      const cell = prev.find(c => c.id === cellId)
      if (cell && cell.progress !== undefined) {
        setBundleProgress(prevMap => new Map(prevMap).set(bundleIndex, cell.progress))
      }
      return prev
    })

    setDraggingBundleIndex(null)
    setDraggedBundleProgress(0)
  }

  useEffect(() => {

    const interval = setInterval(() => {

      setCells(prev =>
        prev.map(cell => {

          if (!cell.hasSedge) return cell

          let newProgress = cell.progress + cell.speed

          if (newProgress >= 100) {
            setScore(s => s + 10)
            return { ...cell, progress: 100 }
          }

          return {
            ...cell,
            progress: newProgress
          }

        })
      )

      setProgress(prev => Math.min(prev + 1, 100))

    }, 1000)

    return () => clearInterval(interval)

  }, [])

  return {
    cells,
    basket: totalBundles - placedBundles.size,
    score,
    progress,
    weather,
    wind,
    dropSedge,
    returnSedge,
    placedBundles,
    draggingBundleIndex,
    setDraggingBundleIndex,
    draggedBundleProgress,
    setDraggedBundleProgress,
    bundleProgress,
    setBundleProgress
  }
}