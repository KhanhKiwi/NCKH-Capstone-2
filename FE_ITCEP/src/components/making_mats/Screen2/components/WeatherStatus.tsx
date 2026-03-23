type Props = {
  weather: string
  wind: string
  isWeatherChanging?: boolean
}

const WeatherStatus = ({ weather, wind, isWeatherChanging = false }: Props) => {
  const getWeatherEmoji = (w: string) => {
    switch(w.toLowerCase()) {
      case 'sunny': return '☀️'
      case 'cloudy': return '☁️'
      case 'rainy': return '🌧️'
      default: return '🌤️'
    }
  }

  const getWindEmoji = (w: string) => {
    switch(w.toLowerCase()) {
      case 'calm': return '🍃'
      case 'moderate': return '💨'
      case 'strong': return '⛈️'
      default: return '💨'
    }
  }

  const getWeatherLabel = (w: string) => {
    switch(w.toLowerCase()) {
      case 'sunny': return 'Nắng'
      case 'cloudy': return 'Mây'
      case 'rainy': return 'Mưa'
      default: return w
    }
  }

  const getWindLabel = (w: string) => {
    switch(w.toLowerCase()) {
      case 'calm': return 'Lành'
      case 'moderate': return 'Trung bình'
      case 'strong': return 'Mạnh'
      default: return w
    }
  }

  const getWeatherColor = (w: string) => {
    switch(w.toLowerCase()) {
      case 'sunny': return '#fbbf24'
      case 'cloudy': return '#d1d5db'
      case 'rainy': return '#60a5fa'
      default: return '#fbbf24'
    }
  }

  const getWeatherBgGradient = (w: string) => {
    switch(w.toLowerCase()) {
      case 'sunny': 
        return 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))'
      case 'cloudy':
        return 'linear-gradient(135deg, rgba(209, 213, 219, 0.1), rgba(156, 163, 175, 0.1))'
      case 'rainy':
        return 'linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(59, 130, 246, 0.1))'
      default: return 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))'
    }
  }

  return (
    <div style={{
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.9)',
      border: `2px solid ${getWeatherColor(weather)}`,
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      <style>
        {`
          @keyframes weatherChange {
            0% {
              transform: scale(0.8) rotateZ(-5deg);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1) rotateZ(0);
              opacity: 1;
            }
          }

          @keyframes rainFalling {
            0% {
              transform: translateY(-10px);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(10px);
              opacity: 0;
            }
          }

          @keyframes cloudDrift {
            0% {
              transform: translateX(-20px);
            }
            50% {
              transform: translateX(20px);
            }
            100% {
              transform: translateX(-20px);
            }
          }

          @keyframes sunRays {
            0% {
              transform: rotate(0deg) scale(1);
            }
            50% {
              transform: rotate(180deg) scale(1.1);
            }
            100% {
              transform: rotate(360deg) scale(1);
            }
          }

          @keyframes windBlow {
            0% {
              transform: skewX(-2deg);
            }
            50% {
              transform: skewX(2deg);
            }
            100% {
              transform: skewX(-2deg);
            }
          }

          .weather-emoji-container {
            animation: ${isWeatherChanging ? 'weatherChange 0.6s ease-out' : 'none'};
          }
        `}
      </style>

      {/* Background weather effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: getWeatherBgGradient(weather),
        pointerEvents: 'none'
      }} />

      {/* Rain effect for rainy weather */}
      {weather.toLowerCase() === 'rainy' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          opacity: 0.3,
          pointerEvents: 'none'
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`rain-${i}`}
              style={{
                position: 'absolute',
                left: `${20 + i * 15}%`,
                top: '-10px',
                width: '2px',
                height: '8px',
                background: '#60a5fa',
                borderRadius: '1px',
                animation: `rainFalling 0.8s ease-in infinite`,
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Cloud drift for cloudy weather */}
      {weather.toLowerCase() === 'cloudy' && (
        <div style={{
          position: 'absolute',
          top: '5px',
          left: 0,
          right: 0,
          bottom: 0,
          animation: 'cloudDrift 6s ease-in-out infinite',
          pointerEvents: 'none'
        }}>
          <div style={{
            fontSize: '24px',
            opacity: 0.2,
            textAlign: 'center'
          }}>☁️ ☁️ ☁️</div>
        </div>
      )}

      {/* Sun rays for sunny weather */}
      {weather.toLowerCase() === 'sunny' && (
        <div style={{
          position: 'absolute',
          top: '5px',
          right: '10px',
          fontSize: '12px',
          opacity: 0.2,
          animation: 'sunRays 8s linear infinite',
          pointerEvents: 'none'
        }}>
          ✨ ✨ ✨
        </div>
      )}

      {/* Weather Display */}
      <div style={{ textAlign: 'center', zIndex: 1, position: 'relative' }}>
        <div className="weather-emoji-container" style={{
          fontSize: '32px',
          marginBottom: '8px',
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {getWeatherEmoji(weather)}
        </div>
        <div style={{ fontSize: '12px', color: '#8b6f47', fontWeight: 'bold' }}>
          Thời tiết
        </div>
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: getWeatherColor(weather)
        }}>
          {getWeatherLabel(weather)}
        </div>
        {isWeatherChanging && (
          <div style={{
            fontSize: '10px',
            color: '#A0522D',
            marginTop: '4px',
            fontWeight: 'bold',
            animation: 'weatherChange 0.6s ease-out'
          }}>
            Đang thay đổi...
          </div>
        )}
      </div>

      <div style={{
        fontSize: '32px',
        color: '#d4a574',
        opacity: 0.5,
        zIndex: 1
      }}>
        |
      </div>

      {/* Wind Display */}
      <div style={{
        textAlign: 'center',
        zIndex: 1,
        position: 'relative',
        animation: wind.toLowerCase() === 'strong' ? 'windBlow 1.5s ease-in-out infinite' : 'none'
      }}>
        <div style={{
          fontSize: '32px',
          marginBottom: '8px',
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {getWindEmoji(wind)}
        </div>
        <div style={{ fontSize: '12px', color: '#8b6f47', fontWeight: 'bold' }}>
          Gió
        </div>
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#5a4a3a'
        }}>
          {getWindLabel(wind)}
        </div>
      </div>
    </div>
  )
}

export default WeatherStatus