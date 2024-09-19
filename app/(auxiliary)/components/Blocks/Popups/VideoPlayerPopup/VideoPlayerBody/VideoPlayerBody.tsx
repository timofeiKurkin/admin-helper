import React, {FC, useCallback, useEffect, useState} from 'react';
import {VideoPlayerDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import {VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import VideoPlayer
    from "@/app/(auxiliary)/components/Blocks/Popups/VideoPlayerPopup/VideoPlayerBody/VideoPlayer/VideoPlayer";
import styles from "./VideoPlayerBody.module.scss"
import popupsCommonStyles from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupsCommomStyles.module.scss"
import PopupFileList from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupFileList/PopupFileList";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {
    changeEditorVisibility, selectOpenedFileName, setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PhotoEditorSlice/PhotoEditorSlice";


interface PropsType {
    data: VideoPlayerDataType;
    type: typeof VIDEO_KEY;
}

const VideoPlayerBody: FC<PropsType> = ({data, type}) => {
    const dispatch = useAppDispatch()
    const formFileData = useAppSelector(selectFormFileData)[type]
    const files = formFileData.files
    const previews = formFileData.filesFinally
    const openedFileName = useAppSelector(selectOpenedFileName)

    /**
     * Callback для поиска файла или настройки файла по его названию. Используется в инициализации состояния и его обновления
     */
    const findCurrentFile = useCallback(<T extends { name: string }>(file: T, name: string) => {
        return file.name === name
    }, [])

    const [videoURl, setVideoURl] = useState<string>(() => URL.createObjectURL(
            files.find((f) => findCurrentFile(f, openedFileName)) ||
            files[0]
        )
    )

    const switchToAnotherFile = () => {
    }

    const closeVideoPlayer = () => {
        dispatch(changeEditorVisibility())
    }

    useEffect(() => {
        setVideoURl(() => URL.createObjectURL(
            files.find((f) => findCurrentFile(f, openedFileName)) ||
            files[0]
        ))
    }, [
        findCurrentFile,
        files,
        openedFileName
    ]);

    useEffect(() => {
        return () => {
            if (videoURl) {
                URL.revokeObjectURL(videoURl)
            }
        }
    }, [videoURl]);

    return (
        <div className={`${popupsCommonStyles.popupBody} ${styles.videoPlayerBody}`}>
            <VideoPlayer videoURL={videoURl}/>

            <PopupFileList contentForEditor={{
                titleOfList: data.photoList.uploadedPhotos,
                listOfPreviews: previews,
                switchToAnotherFile,
                type,
            }}/>

            <div className={`${styles.closeButton} ${popupsCommonStyles.buttons}`}>
                <Button onClick={closeVideoPlayer}>{data.buttons.close}</Button>
            </div>
        </div>
    );
};

export default VideoPlayerBody;