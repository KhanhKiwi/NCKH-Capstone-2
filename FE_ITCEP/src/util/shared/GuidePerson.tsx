import React, { useState } from 'react'

export default function GuidePerson({ size = 120 }: { size?: number }){
  const src = '/images/guide.png'
  const [showFallback, setShowFallback] = useState(false)
  const imgStyle: React.CSSProperties = {
    width: size,
    height: size,
    objectFit: 'cover',
    borderRadius: '50%',
    boxShadow: '0 12px 30px rgba(6,100,56,0.12)',
    border: '4px solid rgba(255,255,255,0.9)',
    backgroundColor: '#fff'
  }
  const fallbackStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: 'linear-gradient(180deg,#fff,#f3fff3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 30px rgba(6,100,56,0.08)',
    fontSize: Math.max(24, Math.floor(size * 0.45)),
    border: '4px solid rgba(255,255,255,0.9)'
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {!showFallback ? (
        <img src={src} alt="Hướng dẫn" style={imgStyle} onError={() => setShowFallback(true)} />
      ) : (
        <div style={fallbackStyle} aria-hidden>👩‍🌾</div>
      )}
    </div>
  )
}
