import { useEffect, useState } from 'react'
import '../../../styles/Screen3/Phase3/game.css'

const samples = [
  { title: 'Cói Đỏ', sub: 'Đã khô' },
  { title: 'Cói Xanh', sub: 'Đang phơi (70%)' },
  { title: 'Cói Vàng', sub: 'Đã khô' },
  { title: 'Cói Tím', sub: 'Đang phơi (90%)' }
]

export default function Phase3(){
  const weatherStates = ['rain', 'sunny', 'cloudy'] as const
  type Weather = (typeof weatherStates)[number]
  const weatherInfo: Record<Weather, { icon: string; label: string }> = {
    rain: { icon: '🌧', label: 'Mưa lớn' },
    sunny: { icon: '☀️', label: 'Nắng vàng rực rỡ' },
    cloudy: { icon: '☁️', label: 'Âm u' }
  }

  const [weatherIndex, setWeatherIndex] = useState<number>(1) // default sunny
  const weather = weatherStates[weatherIndex]
  const START_SECONDS = 40
  const [secondsLeft, setSecondsLeft] = useState<number>(START_SECONDS)

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60)
    const ss = s % 60
    return `${mm}:${String(ss).padStart(2, '0')}`
  }

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s > 1) return s - 1
        // when it reaches 0 (or 1->0), advance weather and reset
        setWeatherIndex(i => (i + 1) % weatherStates.length)
        return START_SECONDS
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="phase3-root">
      <div className={`hero-card ${weather}`}>
        <div className="hero-media" aria-hidden />
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-left">
            <h1 className="hero-title">Sân phơi đình làng</h1>
            <p className="hero-desc">Treo các bó cói lên để phơi khô tự nhiên</p>
          </div>
          <div className="hero-right">
            <div className="weather-display">
              <span className="weather-ico">{weatherInfo[weather].icon}</span>
              <span className="weather-label">{weatherInfo[weather].label}</span>
            </div>
            <button className="btn-cta">Dừng lại</button>
          </div>
        </div>
      </div>

      <div className="info-row">
        <div className={`info-card ${secondsLeft <= 10 ? 'warning' : ''}`}>
          <div className="info-top">
            <div className="info-meta"><span className="meta-ico">{weatherInfo[weather].icon}</span> THỜI TIẾT</div>
            <div className="meta-badge">{weatherInfo[weather].label}</div>
          </div>
          <div className="info-title">{weatherInfo[weather].label} (<span className={`time ${secondsLeft <= 10 ? 'time-warning' : ''}`}>{formatTime(secondsLeft)}</span>)</div>
          <div className="info-sub">Điều kiện lý tưởng để làm khô sợi cói</div>
        </div>

        <div className="info-card">
          <div className="info-top">
            <div className="info-meta"><span className="meta-ico">💧</span> TIẾN ĐỘ KHÔ</div>
            <div className="meta-badge">Sắp hoàn thành</div>
          </div>
          <div className="info-title progress-percent">85%</div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: '85%' }} /></div>
          <div className="info-sub">Sợi cói đang dần ùa và sáng dần lên...</div>
        </div>
      </div>

      <h3 className="section-title">Các loại cói đang phơi</h3>
      <div className="grid-cards">
        {samples.map((s, i) => (
          <div className="card" key={i}>
            <div className="card-image" style={{ backgroundPosition: 'center', backgroundSize: 'cover' }} />
            <div className="card-body">
              <div className="card-title">{s.title}</div>
              <div className="card-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
