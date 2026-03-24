import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../../styles/Screen3/Phase3/game.css'
/* GuidePerson standalone removed — keep GuideDialog avatar only when needed */
import GuideDialog from '../../../util/shared/GuideDialog'

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
  const getDuration = (w: Weather) => (w === 'rain' ? 25 : w === 'cloudy' ? 30 : 40)
  const [secondsLeft, setSecondsLeft] = useState<number>(() => getDuration(weather))
  const [grassesOut, setGrassesOut] = useState<boolean>(false)
  const [running, setRunning] = useState<boolean>(false)
  const [startFlash, setStartFlash] = useState<boolean>(false)
  const navigate = useNavigate()
  const [bundles, setBundles] = useState<Array<{id:number,left:number,length:number,color:string,progress:number,stage:string,top?:number,swayAmt?:number,swaySpeed?:number}>>([])
  const bundleColors = ['#d35400','#f1c40f','#27ae60','#9b59b6']
  const weatherSubtitle = weather === 'sunny'
    ? 'Điều kiện lý tưởng để làm khô sợi cói'
    : weather === 'rain'
      ? 'Điều kiện không tốt để phơi. Hãy đưa cói vào tránh ướt.'
      : 'Tiến độ không thay đổi.'

  function handleToggleGrasses() {
    if (!grassesOut) {
      // bring bundles out: if none exist, spawn; otherwise keep existing (preserve progress)
      if (!bundles || bundles.length === 0) {
        const arr = Array.from({ length: 7 }).map((_, i) => {
          const left = 60 + i * 110 + (Math.random() - 0.5) * 40
          const length = 80 + Math.random() * 60
          const top = 180 + (Math.random() - 0.5) * 30
          const color = bundleColors[i % bundleColors.length]
          const swayAmt = 3 + Math.random() * 6 // degrees
          const swaySpeed = 2.5 + Math.random() * 2.5 // seconds
          return { id: Date.now() + i, left, length, top, color, progress: 0, stage: 'enter', swayAmt, swaySpeed }
        })
        setBundles(arr)
        // after entrance animation, set stage to idle
        setTimeout(() => {
          setBundles(prev => prev.map(b => ({ ...b, stage: 'idle' })))
        }, 600)
      } else {
        // bring existing bundles back into view (preserve progress)
        setBundles(prev => prev.map(b => ({ ...b, stage: 'enter' })))
        setTimeout(() => {
          setBundles(prev => prev.map(b => ({ ...b, stage: 'idle' })))
        }, 600)
      }
      setGrassesOut(true)
    } else {
      // bring bundles in: play exit animation, then hide (but preserve bundle data)
      setBundles(prev => prev.map(b => ({ ...b, stage: 'exit' })))
      setTimeout(() => {
        setGrassesOut(false)
        // keep `bundles` array so progress is preserved while bundles are in
      }, 520)
    }
  }

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60)
    const ss = s % 60
    return `${mm}:${String(ss).padStart(2, '0')}`
  }

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s > 1) return s - 1
        // when it reaches 0 (or 1->0), advance weather (seconds will reset in effect below)
        setWeatherIndex(i => (i + 1) % weatherStates.length)
        return 0
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  // Reset timer when weather changes to its configured duration
  useEffect(() => {
    setSecondsLeft(getDuration(weather))
  }, [weather])

  // Drying logic: every 5s, bundles progress changes by weather — only while bundles are out
  useEffect(() => {
    if (!grassesOut || !running) return
    const t = setInterval(() => {
      setBundles(prev => prev.map(b => {
        let p = b.progress ?? 0
        if (weather === 'sunny') p = Math.min(100, p + 5)
        else if (weather === 'rain') p = Math.max(0, p - 5)
        // cloudy: no change
        return { ...b, progress: p }
      }))
    }, 5000)
    return () => clearInterval(t)
  }, [weather, grassesOut, running])
  const overall = bundles && bundles.length ? Math.round(bundles.reduce((s, x) => s + (x.progress || 0), 0) / bundles.length) : 0

  // Stop the timer automatically when overall reaches 100%
  useEffect(() => {
    if (overall >= 100) {
      setRunning(false)
    }
  }, [overall])

  // Map weather -> video file (place files in `public/weather/` or use external URLs)
  const weatherVideoMap: Record<string, string> = {
    sunny: '/weather/sunny.mp4',
    rain: '/weather/rain.mp4',
    cloudy: '/weather/cloudy.mp4'
  }

  const videoSrc = weatherVideoMap[weather]

  return (
    <div className="phase3-root">
      <div style={{position:'absolute', right:40, top:96, zIndex:40, transition: 'transform 320ms ease'}}>
        {
          (() => {
            // compute a transient event for GuideDialog based on local state
            let weatherEvent: string | undefined = undefined
            if (startFlash) {
              weatherEvent = 'started'
            } else {
              const nextWeather = weatherStates[(weatherIndex + 1) % weatherStates.length]
              // if currently raining and about to finish
              if (weather === 'rain' && secondsLeft <= 10) {
                weatherEvent = 'soon_clear'
              // if we are close to a weather change and next is rain
              } else if (secondsLeft <= 10 && nextWeather === 'rain') {
                weatherEvent = 'soon_rain'
              // if we are close to a weather change and next is sunny
              } else if (secondsLeft <= 10 && nextWeather === 'sunny') {
                weatherEvent = 'sun_coming'
              // otherwise if currently raining, show raining
              } else if (weather === 'rain') {
                weatherEvent = 'raining'
              }
            }

            return (
                <GuideDialog
                started={running}
                showRequireStart={false}
                win={overall >= 100}
                progress={overall}
                phase="phase3"
                weather={weather}
                event={weatherEvent}
                onNext={() => navigate('/phase4')}
              />
            )
          })()
        }
      </div>
      {/* GuidePerson removed — using GuideDialog avatar only */}
      <div className={`hero-card ${weather} ${grassesOut || bundles.length ? 'with-grasses' : ''}`}>
        <div className="hero-media" aria-hidden>
          {videoSrc ? (
            <video className="hero-video" src={videoSrc} autoPlay loop muted playsInline />
          ) : (
            <div aria-hidden />
          )}
        </div>
        <div className="hero-overlay" />
        {weather === 'rain' && (
          <div
            className="rain-overlay"
            style={{backgroundImage: `url('https://media.istockphoto.com/id/1127768977/vi/anh/m%C6%B0a-l%E1%BB%9Bn-m%C3%B9a-xu%C3%A2n-%E1%BB%9F-n%C3%B4ng-th%C3%B4n.jpg?b=1&s=612x612&w=0&k=20&c=dFs45HTlbTYNFWMJKmSpIurNIn2ou-onpar87iuHNpM=')`}}
          />
        )}
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
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                {overall === 100 ? (
                  <button className="btn-cta" onClick={() => {
                    try {
                      localStorage.setItem('phase3_stars', String(3))
                      localStorage.setItem('phase3_overall', String(overall))
                    } catch (e) { }
                    navigate('/phase4')
                  }}>Màn tiếp theo</button>
                ) : (
                  <>
                    <button
                      className="btn-cta"
                      onClick={() => {
                        setRunning(prev => {
                          const next = !prev
                          if (next) {
                            setStartFlash(true)
                            setTimeout(() => setStartFlash(false), 4000)
                          }
                          return next
                        })
                      }}
                      aria-pressed={running}
                    >
                      {running ? 'Tạm dừng' : 'Bắt đầu'}
                    </button>
                    {running && (
                      <button className="btn-cta" onClick={handleToggleGrasses}>{grassesOut ? 'Đưa cói vào' : 'Đưa cói ra'}</button>
                    )}
                  </>
                )}
              </div>
          </div>
        </div>
        {(grassesOut && bundles.length > 0) && (
          <div className="drying-line" aria-hidden>
            <div className="rope" />
            {bundles.map(b => (
              <div
                key={b.id}
                className={`bundle ${b.stage || 'idle'} sway`}
                style={{
                  left: b.left,
                  ['--length' as any]: `${b.length}px`,
                  ['--color' as any]: b.color,
                  ['--bundle-top' as any]: `${b.top || 200}px`,
                  ['--sway-amt' as any]: `${b.swayAmt || 4}deg`,
                  ['--sway-speed' as any]: `${b.swaySpeed || 3}s`
                }}
              >
                <div className="bundle-rope" />
                <div
                  className="bundle-body"
                  style={{ height: `${b.length}px`, ['--color' as any]: b.color }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="info-row">
        <div className={`info-card ${secondsLeft <= 10 ? 'warning' : ''}`}>
          <div className="info-top">
            <div className="info-meta"><span className="meta-ico">{weatherInfo[weather].icon}</span> THỜI TIẾT</div>
          </div>
          <div className="info-title">{weatherInfo[weather].label} (<span className={`time ${secondsLeft <= 10 ? 'time-warning' : ''}`}>{formatTime(secondsLeft)}</span>)</div>
          <div className="info-sub">{weatherSubtitle}</div>
        </div>

        <div className="info-card">
          <div className="info-top">
            <div className="info-meta"><span className="meta-ico">💧</span> TIẾN ĐỘ KHÔ</div>
            <div className="progress-percent">{overall}%</div>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${overall}%` }} /></div>
          <div className="info-sub">Sợi cói đang dần ùa và sáng dần lên...</div>
        </div>
      </div>

      {/* Removed static 'Các loại cói đang phơi' panel per request */}
    </div>
  )
}

 
