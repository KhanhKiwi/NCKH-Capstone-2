import { type FC } from 'react'

type Props = {
  gameOver: boolean
  win: boolean
  restart: () => void
}

const Overlay: FC<Props> = ({ gameOver, win, restart }) => {
  if (!gameOver && !win) return null
  return (
    <div className="game-overlay">
      {gameOver && !win && (
        <div className="overlay-panel lose panel-enter">
          <div className="overlay-icon"><i className="fa-solid fa-face-sad-tear" aria-hidden /></div>
          <h2>Rất tiếc — bạn đã thua</h2>

          <div className="overlay-actions">
            <button className="btn-restart" onClick={restart}>Chơi lại</button>
          </div>
        </div>
      )}

      {win && (
        <div className="overlay-panel panel-enter">
          <h2>Bạn thắng!</h2>
          <p>Bạn đã hoàn thành trước khi hết thời gian.</p>
          <div className="overlay-actions">
            <button onClick={restart}>Chơi lại</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Overlay
