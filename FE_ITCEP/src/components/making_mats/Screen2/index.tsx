import WeatherStatus from "./components/WeatherStatus"
import DryingGrid from "./components/DryingGrid"
import SedgeBasket from "./components/SedgeBasket"
import GuideCharacter from "./components/GuideCharacter"
import TutorialOverlay from "./components/TutorialOverlay"
import TutorialHighlight from "./components/TutorialHighlight"
import TutorialBlocker from "./components/TutorialBlocker"
import { useDryingGame } from "./hooks/useDryingGame"
import { useTutorial } from "./hooks/useTutorial"

const Screen2 = () => {
  const game = useDryingGame()
  const tutorial = useTutorial()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%)',
      padding: '40px 20px',
      fontFamily: 'system-ui, Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#5a4a3a',
            marginBottom: '8px'
          }}>
            🌾 Level 2 – Drying the Sedge
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#7a6a5a',
            marginBottom: '20px'
          }}>
            Phơi cối dùng cách để làm chiều chất lượng
          </p>

          {/* Status Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px',
            background: 'rgba(255, 255, 255, 0.8)',
            border: '2px solid #d4a574',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#8b6f47', fontWeight: 'bold' }}>⭐ Sao</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#CD853F' }}>
                {Array(Math.max(game.stars, 0)).fill('⭐').join('')}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#8b6f47', fontWeight: 'bold' }}>⏱️ Thời gian</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#A0522D' }}>
                {Math.floor(game.timeRemaining / 1000 / 60)}:{String(Math.floor((game.timeRemaining / 1000) % 60)).padStart(2, '0')}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#8b6f47', fontWeight: 'bold' }}>🌾 Cói còn</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#CD853F' }}>{game.basket}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#5a4a3a'
            }}>
              <div style={{ fontWeight: 'bold' }}>🌾 Tiến độ phơi cối</div>
              <div style={{ fontWeight: 'bold' }}>{game.progress}%</div>
            </div>
            <div style={{
              width: '100%',
              height: '24px',
              background: '#e5e7eb',
              borderRadius: '12px',
              border: '2px solid #d4a574',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${game.progress}%`,
                background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                transition: 'width 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '8px',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {game.progress > 15 && `${game.progress}%`}
              </div>
            </div>
          </div>
        </div>

        {/* Weather & Guide Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div data-tutorial="weather-status">
            <WeatherStatus
              weather={game.weather}
              wind={game.wind}
              isWeatherChanging={game.isWeatherChanging}
            />
          </div>
          
          {/* Harvest Storage */}
          <div data-tutorial="harvest-storage" style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)',
            border: '2px solid #d4a574',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{ fontSize: '48px' }}>🏪</div>
            <div>
              <div style={{
                fontWeight: 'bold',
                color: '#5a4a3a',
                marginBottom: '5px'
              }}>
                Kho Thu Hoạch
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#7a6a5a'
              }}>
                {game.harvestedCount} bộ ✨
              </div>
            </div>
          </div>
        </div>

        {/* Drying Grid */}
        <div data-tutorial="drying-grid">
          <DryingGrid
            cells={game.cells}
            dropSedge={game.dropSedge}
            onBundleDragStart={game.setDraggedBundleProgress}
            onHarvest={game.harvestSedge}
            onCatchBug={game.catchBug}
            weather={game.weather}
          />
        </div>

        {/* Sedge Basket */}
        <div data-tutorial="sedge-basket">
          <SedgeBasket
            total={game.basket}
            totalBundles={game.totalBundles}
            placedBundles={game.placedBundles}
            harvestedBundles={game.harvestedBundles}
            draggingBundleIndex={game.draggingBundleIndex}
            draggedBundleProgress={game.draggedBundleProgress}
            setDraggingBundleIndex={game.setDraggingBundleIndex}
            onReturn={game.returnSedge}
          />
        </div>

      </div>

      {/* Guide Character - Floating */}
      <GuideCharacter 
        weather={game.weather}
        progress={game.progress}
        weatherNotification={game.weatherNotification}
        harvestedCount={game.harvestedCount}
      />

      {/* Tutorial Button */}
      <button
        onClick={tutorial.restartTutorial}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'all 0.2s',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb'
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#3b82f6'
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        ❓ Hướng dẫn
      </button>

      {/* Tutorial Components */}
      {tutorial.tutorialState.isActive && (
        <>
          <TutorialHighlight 
            step={tutorial.currentStep} 
            isActive={tutorial.tutorialState.isActive}
          />
          <TutorialBlocker 
            isActive={tutorial.currentStep?.disableOtherInteractions}
          />
          <TutorialOverlay
            step={tutorial.currentStep}
            stepIndex={tutorial.tutorialState.currentStepIndex}
            totalSteps={tutorial.allSteps.length}
            tutorialState={tutorial.tutorialState}
            onNext={tutorial.nextStep}
            onSkip={tutorial.skipTutorial}
            onCompleteStep={() => tutorial.completeStep(tutorial.currentStep.id)}
          />
        </>
      )}
    </div>
  )
}

export default Screen2