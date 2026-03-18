import { useState, useEffect } from 'react'

interface GuideCharacterProps {
  weather: string
  progress: number
}

const GuideCharacter = ({ weather, progress }: GuideCharacterProps) => {
  const [message, setMessage] = useState('Chào mừng!')
  const [showBubble, setShowBubble] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      let newMessage = 'Chào mừng!'

      if (weather === 'rainy') {
        const rainyMessages = [
          'Trời mưa! Đưa cối vào mái che để bảo vệ',
          'Nhanh lên! Kéo cối vào để tránh mưa!',
          'Mưa rơi - hãy che chắn cối của bạn!',
        ]
        newMessage = rainyMessages[Math.floor(Math.random() * rainyMessages.length)]
      } else if (weather === 'sunny') {
        const sunnyMessages = [
          'Trời nắng đẹp! Tiếp tục phơi nào',
          'Tuyệt! Tận dụng thời tiết tốt này',
          'Nắng quá! Cối sẽ nằm nhanh đấy',
        ]
        newMessage = sunnyMessages[Math.floor(Math.random() * sunnyMessages.length)]
      } else if (weather === 'cloudy') {
        const cloudyMessages = [
          'Trời mây - phơi vừa đủ',
          'Thế này thì OK, cần kiên nhẫn',
          'Đợi nắng quay lại nhé',
        ]
        newMessage = cloudyMessages[Math.floor(Math.random() * cloudyMessages.length)]
      }

      if (progress >= 90) {
        const completeMessages = [
          '🎉 Tuyệt vời! Xong rồi!',
          '✨ Bạn làm tốt lắm!',
          '👏 Đã hoàn thành!',
        ]
        newMessage = completeMessages[Math.floor(Math.random() * completeMessages.length)]
      } else if (progress >= 50) {
        const midMessages = [
          'Hơi nữa! Tiếp tục nào',
          'Đang tiến bộ tốt lắm',
          'Cổ vũ bạn! Tiếp tục nhé',
        ]
        newMessage = midMessages[Math.floor(Math.random() * midMessages.length)]
      } else if (progress > 0 && progress < 30) {
        const earlyMessages = [
          'Bắt đầu tốt! Cố lên',
          'Vừa mới bắt đầu, cố lên nào',
          'Kiên nhẫn hay! Tiếp tục đi',
        ]
        newMessage = earlyMessages[Math.floor(Math.random() * earlyMessages.length)]
      } else if (progress === 0) {
        const startMessages = [
          'Kéo cối vào các ô để bắt đầu',
          'Hãy đặt cối lên vùng phơi',
          'Vào quá! Chọn vị trí tốt nhất',
        ]
        newMessage = startMessages[Math.floor(Math.random() * startMessages.length)]
      }

      setMessage(newMessage)
    }, 10000) // Thay đổi tin nhắn mỗi 10 giây

    return () => clearInterval(interval)
  }, [weather, progress])

  const handleClose = () => {
    setShowBubble(false)
    setTimeout(() => setShowBubble(true), 3000) // Bubble biến mất 3s rồi quay lại
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      left: '30px',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      animation: 'bounce 2s infinite'
    }}>
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* Speech Bubble */}
      {showBubble && (
        <div style={{
          background: 'linear-gradient(135deg, #fff8dc, #ffe8b6)',
          border: '2px solid #d4a574',
          borderRadius: '12px',
          padding: '15px',
          maxWidth: '220px',
          position: 'relative',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          animation: 'slideIn 0.3s ease-out',
          minHeight: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: '#ef4444',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>

          {/* Message */}
          <div style={{
            fontSize: '13px',
            color: '#5a4a3a',
            fontWeight: '500',
            lineHeight: '1.4',
            paddingRight: '20px'
          }}>
            {message}
          </div>

          {/* Tail */}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '20px',
            width: '0',
            height: '0',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid #d4a574'
          }} />
        </div>
      )}

      {/* Character */}
      <div style={{
        fontSize: '60px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #e8d9c3, #dfc9a8)',
        border: '3px solid #d4a574',
        borderRadius: '12px',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
      }}>
        👩‍🌾
      </div>

      {/* Name */}
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#5a4a3a',
        background: 'linear-gradient(135deg, #fef3c7, #fce7f3)',
        border: '2px solid #d4a574',
        borderRadius: '8px',
        padding: '5px 12px',
        textAlign: 'center',
        width: '80px'
      }}>
        Cô Ba
      </div>
    </div>
  )
}

export default GuideCharacter
