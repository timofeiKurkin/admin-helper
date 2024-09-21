import React, {FC, useEffect, useState} from 'react';
import styles from "./VideoPlayer.module.scss"
import ReactPlayer from "react-player";
import {HORIZONTAL, ImageOrientationType, VERTICAL} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";

interface PropsType {
    video: string;
    orientation: ImageOrientationType;
}

const VideoPlayer: FC<PropsType> = ({
                                        video,
                                        orientation
                                    }) => {

    // const [url, setUrl] = useState<string>(URL.createObjectURL(video))
    //
    // const [width, setWidth] = useState<number>(640)
    // const [height, setHeight] = useState(360)

    return (
        <div className={styles.videoPlayerWrapper}>
            <div className={styles.videoPlayerBackground}>
                <div className={styles.videoPlayerBody}>
                    <ReactPlayer width={orientation === HORIZONTAL ? 640 : 360}
                                 height={orientation === VERTICAL ? 360 : 640}
                                 url={video}
                                 volume={0.5}
                                 controls/>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;