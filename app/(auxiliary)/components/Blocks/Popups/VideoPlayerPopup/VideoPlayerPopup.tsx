import React from 'react';
import PopupsWrapper from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupsWrapper";
import VideoPlayerData from "@/data/interface/video-player/data.json"
import {VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {VideoPlayerDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import VideoPlayerBody
    from "@/app/(auxiliary)/components/Blocks/Popups/VideoPlayerPopup/VideoPlayerBody/VideoPlayerBody";

const VideoPlayerPopup = () => {
    const videoPlayerData: VideoPlayerDataType = VideoPlayerData
    const videoInput = VIDEO_KEY

    return (
        <PopupsWrapper popupTitle={videoPlayerData.title} type={videoInput}>
            <VideoPlayerBody type={videoInput} data={videoPlayerData}/>
        </PopupsWrapper>
    );
};

export default VideoPlayerPopup;