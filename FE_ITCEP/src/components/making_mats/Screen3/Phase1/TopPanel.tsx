import { type FC } from 'react'

type Props = {
  progress: number
  secondsLeft: number
}

const TopPanel: FC<Props> = ({ progress, secondsLeft }) => {
  return (
    <div className="board-top">
      <div className="progress-card card-left">
        <div className="card-row">
          <div className="left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="check-ico">
              <circle cx="12" cy="12" r="11" fill="#eaffef" />
              <path d="M7.5 12.5l2.5 2.5L16.5 9" stroke="#2dbb63" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="label small">TIẾN ĐỘ CHẺ</div>
          </div>
          <div className="percent">{progress}%</div>
        </div>
        <div className="bar"><div className="fill" style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="timer-card card-right">
        <div className="card-row">
          <div className="timer-left">
            <div className="label small">THỜI GIAN CÒN LẠI</div>
            <div className="time">{Math.floor(secondsLeft/60).toString().padStart(1,'0')}:{(secondsLeft%60).toString().padStart(2,'0')}</div>
          </div>
          <div className="timer-ico">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="6" fill="#ffedd8"/>
              <path d="M12 7v6l4 2" stroke="#f08b44" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopPanel
