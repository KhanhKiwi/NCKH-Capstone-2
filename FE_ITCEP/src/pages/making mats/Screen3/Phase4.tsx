import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import '../../../styles/Screen3/Phase4/game.css'

export default function Phase4(){
  const navigate = useNavigate()

  const phaseStars = useMemo(() => {
    try {
      const p1 = parseInt(localStorage.getItem('phase1_stars') || '0', 10)
      const p2 = parseInt(localStorage.getItem('phase2_stars') || '0', 10)
      const p3 = parseInt(localStorage.getItem('phase3_stars') || '0', 10)
      return { p1, p2, p3 }
    } catch (e) {
      return { p1: 0, p2: 0, p3: 0 }
    }
  }, [])

  const average = (phaseStars.p1 + phaseStars.p2 + phaseStars.p3) / 3
  const finalStars = average > 2.5 ? 3 : 2

  function playAgain(){
    try {
      localStorage.removeItem('phase1_stars')
      localStorage.removeItem('phase2_stars')
      localStorage.removeItem('phase3_stars')
      localStorage.removeItem('phase1_elapsed')
      localStorage.removeItem('phase2_result')
      localStorage.removeItem('phase3_overall')
    } catch (e) {}
    navigate('/')
  }

  function shareScore(){
    try {
      const text = `Kết quả: ${finalStars} sao (${phaseStars.p1}, ${phaseStars.p2}, ${phaseStars.p3})`
      navigator.clipboard.writeText(text)
      alert('Kết quả đã được sao chép vào clipboard')
    } catch (e) { alert('Không thể chia sẻ: ' + e) }
  }

  return (
    <div className="phase4-root">
      <div className="overlay-bg" />
      <div className="dialog-card">
        <button className="close-x" onClick={() => navigate('/')}>×</button>
        <div className="dialog-inner">
          <div className="top-row">
            <div className="level-title">Level Complete</div>
            <div className="progress-number">100%</div>
          </div>

          <div className="progress-area">
            <div className="progress-label">QUEST PROGRESS</div>
            <div className="progress-track"><div className="progress-fill" style={{width: '100%'}} /></div>
          </div>

          <div className="medal-area">
            <div className="medal-circle">🏅</div>
            <div className="medal-caption">MASTER<br/>CRAFTSMAN</div>
          </div>

          <div className="star-row">
            {[0,1,2].map(i => (
              <div key={i} className={`star ${i < finalStars ? 'active' : ''}`}>★</div>
            ))}
          </div>

          <div className="action-row">
            <button className="btn-play" onClick={playAgain}>Play Again</button>
            <button className="btn-share" onClick={shareScore}>Share Score</button>
          </div>
        </div>
      </div>
    </div>
  )
}
