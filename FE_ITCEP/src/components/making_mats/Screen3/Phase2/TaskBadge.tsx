
export default function TaskBadge({ text }: { text: string }){
  return (
    <div style={{display:'flex',alignItems:'center',gap:12}}>
      <div className="info-badge">🔔 {text}</div>
    </div>
  )
}
