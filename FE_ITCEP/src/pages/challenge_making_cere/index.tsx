import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import Screen1P1 from '../making_ceramics/Screen1/Phase1'
import Screen1P2 from '../making_ceramics/Screen1/Phase2'
import Screen2P1 from '../making_ceramics/Screen2/Phase1'
import Screen3P1 from '../making_ceramics/Screen3/Phase1'
import Screen3P2 from '../making_ceramics/Screen3/Phase2'
import Screen4P1 from '../making_ceramics/Screen4/Phase1'
import Screen5P1 from '../making_ceramics/Screen5/Phase1'
import Screen5P2 from '../making_ceramics/Screen5/Phase2'

const SEQUENCE = [
  { id: '1-1', comp: Screen1P1 },
  { id: '1-2', comp: Screen1P2 },
  { id: '2-1', comp: Screen2P1 },
  { id: '3-1', comp: Screen3P1 },
  { id: '3-2', comp: Screen3P2 },
  { id: '4-1', comp: Screen4P1 },
  { id: '5-1', comp: Screen5P1 },
  { id: '5-2', comp: Screen5P2 },
]

export default function ChallengeMakingCere() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  const step = SEQUENCE[index]
  if (!step) {
    // finished all levels
    navigate('/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng')
    return null
  }

  const Comp: any = step.comp

  // debug: log render and step changes so we can trace where the flow stops
  React.useEffect(() => {
    console.log('[challenge] current index ->', index, 'step ->', step?.id)
  }, [index, step?.id])

  const handleComplete = (result?: any) => {
    console.log('challenge level complete', { index, result })
    setIndex(i => i + 1)
  }

  class ErrorBoundary extends React.Component<any, { error: any }>{
    constructor(props: any){ super(props); this.state = { error: null } }
    static getDerivedStateFromError(err: any){ return { error: err } }
    componentDidCatch(err: any, info: any){ console.error('Challenge error', err, info) }
    render(){
      if (this.state.error) {
        return (
          <div style={{padding:40}}>
            <h3 style={{fontSize:18,fontWeight:700}}>Đã xảy ra lỗi trong chế độ Thử thách</h3>
            <pre style={{whiteSpace:'pre-wrap',marginTop:12,color:'#b33'}}>{String(this.state.error)}</pre>
            <div style={{marginTop:12}}>
              <button onClick={() => window.location.reload()} style={{marginRight:8}}>Tải lại</button>
              <button onClick={() => navigate('/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng')}>Quay lại</button>
            </div>
          </div>
        )
      }
      return this.props.children
    }
  }

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(180deg,#fffaf0,#fff0eb)'}}>
      <div style={{padding:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h2 style={{fontSize:20,fontWeight:700}}>Chế độ Thử thách — Làng Gốm (Bát Tràng)</h2>
          <div style={{fontSize:14,color:'#6b5a4a'}}>Màn {index + 1} / {SEQUENCE.length}</div>
        </div>
      </div>
      <ErrorBoundary>
        {/* key ensures remount when step changes; pass onComplete and a debug prop */}
        <Comp key={step.id} onComplete={(res: any) => { console.log('[challenge] onComplete from', step.id, res); handleComplete(res) }} debugId={step.id} />
      </ErrorBoundary>
    </div>
  )
}
