import React from "react"
import Chart from "../components/predictions"
import Player from "../components/player"
const AnalysisSection = (props) => {
    const {graphData, videoUrl} = props
    return (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "space-evenly"}}>
            <Chart graphData={graphData}/>
            <Player videoUrl={videoUrl}/>
        </div>
    )
}

export default AnalysisSection