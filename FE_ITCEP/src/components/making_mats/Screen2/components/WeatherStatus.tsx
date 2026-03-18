type Props = {
  weather: string
  wind: string
}

const WeatherStatus = ({ weather, wind }: Props) => {
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

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.9)',
      border: '2px solid #d4a574',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>
          {getWeatherEmoji(weather)}
        </div>
        <div style={{ fontSize: '12px', color: '#8b6f47', fontWeight: 'bold' }}>
          Thời tiết
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#5a4a3a' }}>
          {getWeatherLabel(weather)}
        </div>
      </div>

      <div style={{ fontSize: '32px', color: '#d4a574' }}>|</div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>
          {getWindEmoji(wind)}
        </div>
        <div style={{ fontSize: '12px', color: '#8b6f47', fontWeight: 'bold' }}>
          Gió
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#5a4a3a' }}>
          {getWindLabel(wind)}
        </div>
      </div>
    </div>
  )
}

export default WeatherStatus