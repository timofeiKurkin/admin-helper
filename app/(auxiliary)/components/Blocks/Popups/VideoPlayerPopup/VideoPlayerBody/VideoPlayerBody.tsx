import React, { FC, useCallback, useEffect, useState } from 'react';
import { VideoPlayerDataType } from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import { VIDEO_KEY } from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import { useAppDispatch, useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    deleteFile,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import VideoPlayer
    from "@/app/(auxiliary)/components/Blocks/Popups/VideoPlayerPopup/VideoPlayerBody/VideoPlayer/VideoPlayer";
import styles from "./VideoPlayerBody.module.scss"
import popupsCommonStyles from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupsCommonStyles.module.scss"
import PopupFileList from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupFileList/PopupFileList";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {
    changePopupVisibility,
    selectOpenedFileName,
    selectVideoOrientations, setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import { CustomFile, HORIZONTAL } from "@/app/(auxiliary)/types/FormTypes/PopupTypes/PopupTypes";
import { findElement } from "@/app/(auxiliary)/func/editorHandlers";


interface PropsType {
    data: VideoPlayerDataType;
    type: typeof VIDEO_KEY;
}

const VideoPlayerBody: FC<PropsType> = ({ data, type }) => {
    const dispatch = useAppDispatch()
    const { files, filesFinally } = useAppSelector(selectFormFileData)[type]
    const openedFileName = useAppSelector(selectOpenedFileName)
    const videoOrientations = useAppSelector(selectVideoOrientations).find((orient) => orient.name === openedFileName) || { orientation: HORIZONTAL }

    /**
     * Callback для поиска файла или настройки файла по его названию. Используется в инициализации состояния и его обновления
     */
    const findCurrentFile = useCallback(findElement, [])

    // const [listOfPreviews, setListOfPreviews] = useState<CustomFile[]>([])

    const [videoURl, setVideoURl] = useState<string>(() => URL.createObjectURL(
        files.find((f) => findCurrentFile(f, openedFileName)) ||
        files[0]
    )
    )

    const switchToAnotherFile = (fileName: string) => {
        setVideoURl(URL.createObjectURL(
            files.find((f) => findCurrentFile(f, fileName)) ||
            files[0]
        ))
        dispatch(setCurrentOpenedFileName({ fileName }))
    }

    const closeVideoPlayer = () => {
        dispatch(changePopupVisibility({ type }))
    }

    const removeFile = (removedName: string) => {
        if (files.length <= 1) {
            dispatch(changePopupVisibility({ type }))
        } else {
            const anotherFile = files.filter((f) => f.name !== removedName)[0].name
            setVideoURl(URL.createObjectURL(
                files.find((f) => findCurrentFile(f, anotherFile)) ||
                files[0]
            ))
            dispatch(setCurrentOpenedFileName({ fileName: anotherFile }))
        }

        dispatch(deleteFile({
            key: type,
            data: {
                name: removedName
            }
        }))
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
        // setListOfPreviews(files.map((file, i) => Object.assign(file, {id: i})))
    })

    useEffect(() => {
        return () => {
            if (videoURl) {
                URL.revokeObjectURL(videoURl)
            }
        }
    }, [videoURl]);

    return (
        <div className={`${popupsCommonStyles.popupBody} ${styles.videoPlayerBody}`}>
            <VideoPlayer video={videoURl} orientation={videoOrientations.orientation} />

            <div className={styles.nothing}></div>

            <PopupFileList titleOfList={data.photoList.uploadedPhotos}
                listOfPreviews={filesFinally as CustomFile[]}
                func={{
                    switchToAnotherFile,
                    removeFile
                }} />

            <div className={`${styles.closeButton} ${popupsCommonStyles.buttons}`}>
                <Button onClick={closeVideoPlayer}>
                    {data.buttons.close}
                </Button>
            </div>
        </div>
    );
};

export default VideoPlayerBody;