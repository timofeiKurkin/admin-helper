import React, {FC} from 'react';
import styles from "./VideoPlayer.module.scss"
import ReactPlayer from "react-player";

interface PropsType {
    videoURL: string;
}

const VideoPlayer: FC<PropsType> = ({videoURL}) => {
    return (
        <div className={styles.videoPlayerWrapper}>
            <div className={styles.videoPlayerBackground}>
                <div className={styles.videoPlayerBody}>
                    <ReactPlayer width={640} height={360} url={videoURL} controls/>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;