import { useState, useCallback } from 'react'

export interface TutorialStep {
  id: string
  title: string
  description: string
  instruction: string
  highlightElement?: string // CSS selector for element to highlight
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  action?: string // Action type needed to complete step (e.g., 'placeBundle', 'harvestBundle')
  allowSkip?: boolean
  disableOtherInteractions?: boolean
}

export interface TutorialState {
  isActive: boolean
  currentStepIndex: number
  completedSteps: Set<string>
  showTooltip: boolean
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: '👋 Chào mừng!',
    description: 'Hướng dẫn: Phơi cối để thu hoạch',
    instruction: 'Bạn sẽ học cách phơi cói để có chất lượng tốt nhất. Hãy theo dõi hướng dẫn từng bước!',
    tooltipPosition: 'bottom',
    allowSkip: true,
    disableOtherInteractions: false
  },
  {
    id: 'basket_intro',
    title: '🧺 Giỏ cối',
    description: 'Tìm hiểu về giỏ cối',
    instruction: 'Đây là giỏ cối của bạn. Nó chứa những bó cói chưa được phơi. Kéo một bó cối từ đây để bắt đầu!',
    highlightElement: '[data-tutorial="sedge-basket"]',
    tooltipPosition: 'top',
    action: 'startDragging',
    disableOtherInteractions: false,
    allowSkip: false
  },
  {
    id: 'drop_on_cell',
    title: '📍 Đặt cối lên vùng phơi',
    description: 'Thả cối vào ô phơi',
    instruction: 'Bây giờ, hãy thả bó cói lên một trong các ô phơi để bắt đầu phơi. Chọn ô có điều kiện tốt (Tốt nhất)!',
    highlightElement: '[data-tutorial="drying-grid"]',
    tooltipPosition: 'top',
    action: 'dropBundleOnCell',
    disableOtherInteractions: true,
    allowSkip: false
  },
  {
    id: 'observe_progress',
    title: '📊 Quan sát tiến độ',
    description: 'Theo dõi tiến độ phơi',
    instruction: 'Tuyệt! Bó cối đã được đặt. Bây giờ hãy quan sát tiến độ phơi của nó. Nó sẽ tăng dần khi trời nắng!',
    highlightElement: '[data-tutorial="drying-cell"]',
    tooltipPosition: 'bottom',
    disableOtherInteractions: false,
    allowSkip: true
  },
  {
    id: 'weather_impact',
    title: '🌤️ Ảnh hưởng của thời tiết',
    description: 'Hiểu tác động của thời tiết',
    instruction: 'Thời tiết ảnh hưởng đến tiến độ phơi! Trời nắng giúp phơi nhanh, nhưng trời mưa sẽ giảm tiến độ. Hãy chú ý!',
    highlightElement: '[data-tutorial="weather-status"]',
    tooltipPosition: 'bottom',
    disableOtherInteractions: false,
    allowSkip: true
  },
  {
    id: 'bug_protection',
    title: '🐛 Bảo vệ khỏi bỏ',
    description: 'Xử lý côn trùng',
    instruction: 'Nếu bỏ xuất hiện trên cối, hãy nhấp vào chúng để diệt! Bỏ sẽ làm giảm chất lượng cối của bạn.',
    disableOtherInteractions: false,
    allowSkip: true
  },
  {
    id: 'harvest_ready',
    title: '🎉 Chuẩn bị thu hoạch',
    description: 'Thu hoạch cối khi sẵn sàng',
    instruction: 'Khi tiến độ đạt 90-100%, cối sẽ sẵn sàng thu hoạch. Nhấp vào cối để thu hoạch nó vào kho!',
    highlightElement: '[data-tutorial="drying-cell"]',
    tooltipPosition: 'top',
    action: 'harvestBundle',
    disableOtherInteractions: false,
    allowSkip: false
  },
  {
    id: 'warehouse_storage',
    title: '🏪 Kho thu hoạch',
    description: 'Quản lý kho',
    instruction: 'Tuyệt! Cối đã được lưu vào kho. Bạn có thể thấy số lượng cối đã thu hoạch ở đây. Tiếp tục phơi thêm cối!',
    highlightElement: '[data-tutorial="harvest-storage"]',
    tooltipPosition: 'bottom',
    disableOtherInteractions: false,
    allowSkip: true
  },
  {
    id: 'complete',
    title: '✨ Hoàn thành!',
    description: 'Bạn đã học xong hướng dẫn cơ bản',
    instruction: 'Chúc mừng! Bạn đã nắm vững cách chơi. Bây giờ hãy phơi tất cả 10 bó cối để hoàn thành level!',
    tooltipPosition: 'bottom',
    allowSkip: true,
    disableOtherInteractions: false
  }
]

export const useTutorial = () => {
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    isActive: true,
    currentStepIndex: 0,
    completedSteps: new Set(),
    showTooltip: true
  })

  const currentStep = TUTORIAL_STEPS[tutorialState.currentStepIndex]

  const nextStep = useCallback(() => {
    setTutorialState(prev => {
      if (prev.currentStepIndex < TUTORIAL_STEPS.length - 1) {
        return {
          ...prev,
          currentStepIndex: prev.currentStepIndex + 1,
          completedSteps: new Set([...prev.completedSteps, currentStep.id])
        }
      }
      return prev
    })
  }, [currentStep.id])

  const completeStep = useCallback((stepId: string) => {
    setTutorialState(prev => {
      const newCompletedSteps = new Set([...prev.completedSteps, stepId])
      let nextIndex = prev.currentStepIndex

      // Auto-advance if current step is completed
      if (stepId === currentStep.id && prev.currentStepIndex < TUTORIAL_STEPS.length - 1) {
        nextIndex = prev.currentStepIndex + 1
      }

      return {
        ...prev,
        currentStepIndex: nextIndex,
        completedSteps: newCompletedSteps
      }
    })
  }, [currentStep.id])

  const skipTutorial = useCallback(() => {
    setTutorialState(prev => ({
      ...prev,
      isActive: false
    }))
  }, [])

  const restartTutorial = useCallback(() => {
    setTutorialState({
      isActive: true,
      currentStepIndex: 0,
      completedSteps: new Set(),
      showTooltip: true
    })
  }, [])

  const toggleTooltip = useCallback(() => {
    setTutorialState(prev => ({
      ...prev,
      showTooltip: !prev.showTooltip
    }))
  }, [])

  return {
    tutorialState,
    currentStep,
    nextStep,
    completeStep,
    skipTutorial,
    restartTutorial,
    toggleTooltip,
    allSteps: TUTORIAL_STEPS,
    isStepCompleted: (stepId: string) => tutorialState.completedSteps.has(stepId)
  }
}
