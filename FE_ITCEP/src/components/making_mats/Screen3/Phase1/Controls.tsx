const Controls = () => {
  return (
    <div className="board-bottom">
      <div className="control-cards">
        <div className="control-card primary-card" role="button" tabIndex={0}>
          <div className="icon"><i className="fa-solid fa-cut"></i></div>
          <div className="texts">
            <div className="meta">Đang có hiện tại</div>
            <div className="title">Dao chí thép</div>
          </div>
        </div>

        <div className="control-card muted-card" role="button" tabIndex={0}>
          <div className="icon muted"><i className="fa-solid fa-tint"></i></div>
          <div className="texts">
            <div className="meta">BỔ TRỢ (KHÓA)</div>
            <div className="title">Nước làm mềm</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Controls
