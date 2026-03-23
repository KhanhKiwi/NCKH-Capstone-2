import { useEffect, useState } from "react"
import { GRID_DATA } from "../constants"
import type { DryingCellType } from "../types"

const WEATHER_CYCLE = ["sunny", "cloudy", "rainy"] as const
const WEATHER_DURATION = 15000 // 15 seconds per weather state
const WIND_MAP = {
  sunny: "calm",
  cloudy: "moderate",
  rainy: "strong"
} as const

export const useDryingGame = () => {

  const [cells, setCells] = useState<DryingCellType[]>(GRID_DATA)
  const [totalBundles] = useState(10)
  const [placedBundles, setPlacedBundles] = useState<Set<number>>(new Set())
  const [draggingBundleIndex, setDraggingBundleIndex] = useState<number | null>(null)
  const [draggedBundleProgress, setDraggedBundleProgress] = useState<number>(0)
  const [bundleProgress, setBundleProgress] = useState<Map<number, number>>(new Map())

  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)

  // Dynamic weather system
  const [weatherIndex, setWeatherIndex] = useState(0)
  const [weather, setWeather] = useState<string>(WEATHER_CYCLE[0])
  const [wind, setWind] = useState<string>(WIND_MAP.sunny)
  const [weatherNotification, setWeatherNotification] = useState<{
    message: string
    timestamp: number
  } | null>(null)
  const [isWeatherChanging, setIsWeatherChanging] = useState(false)
  const [damageNotification, setDamageNotification] = useState<{
    message: string
    bundleIndex: number
    timestamp: number
  } | null>(null)

  const dropSedge = (cellId: number, bundleIndex: number) => {

    if (placedBundles.has(bundleIndex)) return

    const savedProgress = bundleProgress.get(bundleIndex) ?? 0

    setCells(prev =>
      prev.map(cell =>
        cell.id === cellId && !cell.hasSedge
          ? { ...cell, hasSedge: true, bundleIndex: bundleIndex, progress: savedProgress, status: 'drying' as const }
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
          ? { ...cell, hasSedge: false, progress: 0, status: undefined }
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

  // Harvest ready sedge (90-105%)
  const harvestSedge = (cellId: number, bundleIndex: number) => {
    setCells(prev =>
      prev.map(cell =>
        cell.id === cellId && cell.status === 'ready'
          ? { ...cell, hasSedge: false, progress: 0, status: undefined }
          : cell
      )
    )

    setPlacedBundles(prev => {
      const newSet = new Set(prev)
      newSet.delete(bundleIndex)
      return newSet
    })

    // Lưu progress vào bundle map
    setBundleProgress(prevMap => {
      const newMap = new Map(prevMap)
      const currentCell = cells.find(c => c.id === cellId)
      if (currentCell) {
        newMap.set(bundleIndex, currentCell.progress)
      }
      return newMap
    })

    setDraggingBundleIndex(null)
    setDraggedBundleProgress(0)
  }

  // Monitor damaged cells and remove them after 2 seconds
  useEffect(() => {
    const damagedCells = cells.filter(c => c.status === 'damaged' && c.hasSedge)
    
    if (damagedCells.length > 0) {
      damagedCells.forEach(cell => {
        if (cell.bundleIndex !== undefined) {
          // Show notification
          setDamageNotification({
            message: `Cối #${cell.bundleIndex + 1} bị hỏng! 😞`,
            bundleIndex: cell.bundleIndex,
            timestamp: Date.now()
          })

          // Remove damaged cell after 2 seconds
          setTimeout(() => {
            setCells(prev =>
              prev.map(c =>
                c.id === cell.id
                  ? { ...c, hasSedge: false, progress: 0, status: undefined }
                  : c
              )
            )

            setPlacedBundles(prev => {
              const newSet = new Set(prev)
              if (cell.bundleIndex !== undefined) {
                newSet.delete(cell.bundleIndex)
              }
              return newSet
            })
          }, 2000)
        }
      })
    }
  }, [cells.some(c => c.status === 'damaged')])

  // Weather change effect
  useEffect(() => {
    const weatherTimer = setInterval(() => {
      setWeatherIndex(prev => {
        const nextIndex = (prev + 1) % WEATHER_CYCLE.length
        const nextWeather = WEATHER_CYCLE[nextIndex]
        const nextWind = WIND_MAP[nextWeather as keyof typeof WIND_MAP]
        
        // Trigger animation and notification
        setIsWeatherChanging(true)
        setTimeout(() => setIsWeatherChanging(false), 600)
        
        // Set notification
        const weatherNotifications = {
          sunny: "☀️ Trời nắng đẹp! Tận dụng để phơi cối nhanh hơn!",
          cloudy: "☁️ Trời mây! Quá trình phơi sẽ chậm hơn...",
          rainy: "🌧️ Trời mưa! Cần kéo cối vào mái che ngay!"
        } as const
        
        setWeatherNotification({
          message: weatherNotifications[nextWeather as keyof typeof weatherNotifications],
          timestamp: Date.now()
        })
        
        // Update weather and wind
        setWeather(nextWeather)
        setWind(nextWind)
        
        return nextIndex
      })
    }, WEATHER_DURATION)

    return () => clearInterval(weatherTimer)
  }, [])

  // Drying progress effect
  useEffect(() => {

    const interval = setInterval(() => {

      setCells(prev =>
        prev.map(cell => {

          if (!cell.hasSedge) return cell

          // Handle rainy weather - reduce progress
          if (weather === 'rainy') {
            let newProgress = Math.max(cell.progress - 0.5, 0) // Decrease by 0.5% per second when rainy
            return { ...cell, progress: newProgress }
          }

          // Normal drying when not rainy
          let newProgress = cell.progress + cell.speed

          // Cối bị hỏng khi vượt quá 110%
          if (newProgress > 110) {
            return { ...cell, progress: newProgress, status: 'damaged' as const }
          }

          // Trạng thái ready khi 90-105%
          if (newProgress >= 90 && newProgress <= 105) {
            return { ...cell, progress: newProgress, status: 'ready' as const }
          }

          // Giới hạn ở 100% nếu không bị hỏng
          if (newProgress >= 100 && newProgress <= 110) {
            setScore(s => s + 10)
            return { ...cell, progress: newProgress, status: 'ready' as const }
          }

          return {
            ...cell,
            progress: newProgress,
            status: 'drying' as const
          }

        })
      )

      setProgress(prev => Math.min(prev + 1, 100))

    }, 1000)

    return () => clearInterval(interval)

  }, [weather])

  return {
    cells,
    basket: totalBundles - placedBundles.size,
    score,
    progress,
    weather,
    wind,
    weatherNotification,
    damageNotification,
    isWeatherChanging,
    dropSedge,
    returnSedge,
    harvestSedge,
    placedBundles,
    draggingBundleIndex,
    setDraggingBundleIndex,
    draggedBundleProgress,
    setDraggedBundleProgress,
    bundleProgress,
    setBundleProgress
  }
}