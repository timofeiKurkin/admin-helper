import React, {FC, useEffect} from 'react';
import PopupScroll from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupScroll/PopupScroll";
import styles from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/DropZone.module.scss";
import UploadFile from "@/app/(auxiliary)/components/UI/SVG/UploadFile/UploadFile";
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {white_1} from "@/styles/colors";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {selectRootPageContent, setNewNotification} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import {PHOTO_KEY, PhotoAndVideoKeysTypes} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {GetInputPropsType, GetRootPropsType} from "@/app/(auxiliary)/types/DropZoneTypes/DropZoneTypes";
import {formattedTime} from "@/app/(auxiliary)/func/formattedTime";
import {addFileData} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {
    changePhotoSettings, changePopupVisibility,
    setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import {defaultPhotoSettings} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";

interface PropsType {
    inputProps: {
        getRootProps: GetRootPropsType;
        getInputProps: GetInputPropsType;
    }
    isDragActive: boolean;
    type: PhotoAndVideoKeysTypes;
    visibleDragDropZone: () => void;
    createPhotoPreviews: (newFiles: File[]) => void
}

const DesktopDropZone: FC<PropsType> = ({
                                            inputProps,
                                            isDragActive,
                                            type,
                                            visibleDragDropZone,
                                            createPhotoPreviews
                                        }) => {
    const dispatch = useAppDispatch()
    const content = useAppSelector(selectRootPageContent).contentOfUploadBlock

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

                        visibleDragDropZone()
                        dispatch(setCurrentOpenedFileName({
                            fileName: newFile.name
                        }))
                        dispatch(changePopupVisibility({type: PHOTO_KEY}))
                        dispatch(setNewNotification({message: "Файлы были успешно загружены!"}))
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
        visibleDragDropZone
    ])

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
                           className={styles.dropInput}/>

                    <div className={styles.dropZoneContentWrapper}>
                        <div className={styles.dropZoneContent}>
                            <UploadFile animationStatus={isDragActive}/>

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
                                            <Button onClick={visibleDragDropZone}
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
};

export default DesktopDropZone;