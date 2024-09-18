import React, {FC} from 'react';
import {VideoPlayerDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import {VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";

interface PropsType {
    data: VideoPlayerDataType;
    type: typeof VIDEO_KEY;
}

const VideoPlayerBody: FC<PropsType> = ({data, type}) => {

    const formFileData = useAppSelector(selectFormFileData)[type]

    

    return (
        <div>

        </div>
    );
};

export default VideoPlayerBody;