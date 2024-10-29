import styles from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/DropZone.module.scss";
import PopupScroll from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupDisableScroll/PopupDisableScroll";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import UploadFile from "@/app/(auxiliary)/components/UI/SVG/UploadFile/UploadFile";
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";
import { formattedTime } from "@/app/(auxiliary)/func/formattedTime";
import { useAppDispatch } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { setNewNotification } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import {
    changePhotoSettings, changePopupVisibility,
    setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import { addFileData } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import { PHOTO_KEY, PhotoAndVideoKeysType } from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import { ContentOfUploadBlockType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType';
import { GetInputPropsType, GetRootPropsType } from "@/app/(auxiliary)/types/FormTypes/DropZoneTypes/DropZoneTypes";
import { defaultPhotoSettings } from "@/app/(auxiliary)/types/FormTypes/PopupTypes/PopupTypes";
import rootPageData from "@/data/interface/root-page/data.json";
import { white_1 } from "@/styles/colors";
import { FC, useEffect } from 'react';

interface PropsType {
    inputProps: {
        getRootProps: GetRootPropsType;
        getInputProps: GetInputPropsType;
    }
    isDragActive: boolean;
    type: PhotoAndVideoKeysType;
    openDragDropZone: () => void;
    createPhotoPreviews: (newFiles: File[]) => void
}

const DesktopDropZone: FC<PropsType> = ({
    inputProps,
    isDragActive,
    type,
    openDragDropZone,
    createPhotoPreviews
}) => {
    const dispatch = useAppDispatch()

    const content: ContentOfUploadBlockType = rootPageData.contentOfUploadBlock

    /**
     * Эффект для получения изображения из буфера обмена при нажатии клавиш CTRL+V в открытой зоне
     */
    useEffect(() => {
        if (type === PHOTO_KEY) {
            const handleKeyDown = async () => {
                try {
                    const data = await navigator.clipboard.read()

                    if (data[0].types.includes("image/png")) {
                        const blobOutput = await data[0].getType("image/png")
                        const pastedImageName = `pasted-image-${formattedTime()}`
                        const newFile = new File([blobOutput], pastedImageName)

                        dispatch(addFileData({
                            key: type,
                            data: {
                                validationStatus: true,
                                value: [newFile] // If state is of files
                            }
                        }))
                        dispatch(changePhotoSettings({
                            ...defaultPhotoSettings,
                            name: newFile.name
                        }))

                        createPhotoPreviews([newFile])

                        openDragDropZone()
                        dispatch(setCurrentOpenedFileName({
                            fileName: newFile.name
                        }))
                        dispatch(changePopupVisibility({ type: PHOTO_KEY }))
                        dispatch(setNewNotification({ type: "success", message: "Файлы были успешно загружены!" }))
                    }
                } catch (e) {
                    console.error("Error with paste a clipboard: ", e)
                }
            }

            window.addEventListener("paste", handleKeyDown)

            return () => {
                window.removeEventListener("paste", handleKeyDown)
            }
        }
    }, [
        createPhotoPreviews,
        dispatch,
        type,
        openDragDropZone
    ])

    if (Object.keys(content).length !== 0) {
        return (
            <PopupScroll>
                <div className={styles.dropZoneWrapper}>
                    <div {...inputProps.getRootProps({
                        style: {
                            width: "inherit",
                            height: "inherit",
                            userSelect: "none",
                            // cursor: uploadingFilesStatus ? "default" : "pointer"
                        }
                    })}>
                        <input {...inputProps.getInputProps({})}
                            className={styles.dropInput} />

                        <div className={styles.dropZoneContentWrapper}>
                            <div className={styles.dropZoneContent}>
                                <UploadFile animationStatus={isDragActive} />

                                {
                                    isDragActive ? (
                                        <div className={styles.dropZoneText}>
                                            <Title>{content.isDragContent}</Title>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={styles.dropZoneText}>
                                                <Title>{content[type]}</Title>
                                            </div>

                                            <div className={styles.closeDropZone}
                                                onClick={(e) => e.stopPropagation()}>
                                                <Button onClick={openDragDropZone}
                                                    style={{
                                                        backgroundColor: white_1
                                                    }}>{content.button}</Button>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </PopupScroll>
        );
    }
};

export default DesktopDropZone;