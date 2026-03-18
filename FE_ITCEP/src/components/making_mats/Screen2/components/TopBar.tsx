type Props = {
  score: number
  progress: number
}

const TopBar = ({ score, progress }: Props) => {

  return (
    <div style={{marginBottom:20}}>

      <div>Score: {score}</div>

      <div
        style={{
          width:"100%",
          height:10,
          background:"#ddd",
          marginTop:10
        }}
      >
        <div
          style={{
            width:`${progress}%`,
            height:"100%",
            background:"green"
          }}
        />
      </div>

    </div>
  )
}

export default TopBar