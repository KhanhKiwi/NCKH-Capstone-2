export default function ColorSelector({
  swatchColors,
  selectedColor,
  onSelect,
}: {
  swatchColors: string[]
  selectedColor: string | null
  onSelect: (c: string) => void
}){
  return (
    <div className="phase2-top">
      {swatchColors.map((c,i)=> (
        <div key={c} className={`color-wrap ${selectedColor===c? 'selected':''}`}>
          <div className="badge">{i===0? 'ĐỎ THEO MỐC' : i===1? 'VÀNG NGHỆ' : 'XANH LÁ'}</div>
          <div className={`color-circle ${selectedColor===c? 'selected':''}`} style={{ background:c }} onClick={() => onSelect(c)}>
            <div className="circle-icon">≈≈≈</div>
          </div>
          <div className="circle-title">Nhuộn màu {i+1}</div>
          <div className="circle-sub">Sôi nhẹ - {i===0? '85°C' : i===1? '82°C' : '80°C'}</div>
        </div>
      ))}
    </div>
  )
}
