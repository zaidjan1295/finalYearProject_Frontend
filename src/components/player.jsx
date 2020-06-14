import React from 'react'
import ReactPlayer from 'react-player'
 
// Render a YouTube video player
const Player = (props) => {
    return (
        <ReactPlayer 
            url={props.videoUrl}
            controls={true}
            muted={false}
        />
    )
}

export default Player