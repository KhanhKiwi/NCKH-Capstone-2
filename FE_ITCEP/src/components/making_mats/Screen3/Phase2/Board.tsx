export default function Board({
  containerRef,
  reeds,
  paddleX,
  paddleRef,
  selectedColor,
  dragEnabled,
  onPaddlePointerDown,
  onChangeColor,
}: any){
  return (
    <div className="phase2-board" ref={containerRef}>
      {reeds.map((r: any) => (
        <div
          key={r.id}
          className="reed"
          style={{
            left: r.x,
            width: r.width,
            height: r.height,
            transform: `translateY(${r.y}px) rotate(${r.rot || 0}deg)`,
            opacity: 0.98
          }}
        />
      ))}

      {selectedColor && (
        <div
          className={`paddle ${dragEnabled? 'dragging':''}`}
          ref={paddleRef}
          style={{ left: paddleX, background: selectedColor }}
          onPointerDown={onPaddlePointerDown}
        />
      )}

      <div className="board-side">
        {['#e74c3c','#f1c40f','#27ae60'].map((c)=> (
          <button
            key={c}
            className={`swatch ${selectedColor===c? 'selected':''}`}
            style={{ background: c }}
            onClick={() => onChangeColor(c)}
            aria-label={`Chọn màu ${c}`}
          />
        ))}
      </div>
    </div>
  )
}
