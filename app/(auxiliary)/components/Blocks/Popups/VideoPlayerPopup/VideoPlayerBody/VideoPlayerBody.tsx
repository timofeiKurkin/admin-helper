import React, {FC, useEffect} from 'react';
import {VideoPlayerDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import {VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import VideoPlayer
    from "@/app/(auxiliary)/components/Blocks/Popups/VideoPlayerPopup/VideoPlayerBody/VideoPlayer/VideoPlayer";

interface PropsType {
    data: VideoPlayerDataType;
    type: typeof VIDEO_KEY;
}

const VideoPlayerBody: FC<PropsType> = ({data, type}) => {

    const formFileData = useAppSelector(selectFormFileData)[type].files
    const firstVideo = formFileData[0]
    const firstVideoURl = URL.createObjectURL(firstVideo)

    useEffect(() => {
        return () => {
            if (firstVideoURl) {
                URL.revokeObjectURL(firstVideoURl)
            }
        }
    }, [firstVideoURl]);

    return (
        <div>
            <VideoPlayer videoURL={firstVideoURl}/>
        </div>
    );
};

export default VideoPlayerBody;