import React, {FC} from 'react';

interface PropsType {
    videoURL: string;
}

const VideoPlayer: FC<PropsType> = ({videoURL}) => {
    console.log("video URL: ", videoURL)

    return (
        <div>

        </div>
    );
};

export default VideoPlayer;