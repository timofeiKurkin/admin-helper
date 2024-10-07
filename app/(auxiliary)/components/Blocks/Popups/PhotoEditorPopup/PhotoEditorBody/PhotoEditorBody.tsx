import React, {FC, useCallback, useState} from 'react';
import styles from "./PhotoEditorBody.module.scss";
import popupsCommonStyles from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupsCommomStyles.module.scss"
import SeparatingLine from "@/app/(auxiliary)/components/UI/SeparatingLine/SeparatingLine";
import {PhotoEditorDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import {blue_light} from "@/styles/colors";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    changePhotoSettings,
    changePopupVisibility,
    selectOpenedFileName,
    selectPhotoListSettings,
    setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import {findElement, scalePoints, scaleStickPoint, stickToClosestValue} from "@/app/(auxiliary)/func/editorHandlers";
import {CustomFile, PhotoEditorSettingsType, PhotoSettingKeysType} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";
import {Crop} from "react-image-crop";
import {
    changePreview,
    deleteFile,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {PHOTO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import Editor from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorBody/Editor/Editor";
import PopupFileList from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupFileList/PopupFileList";
import SaveSettings
    from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorBody/Buttons/SaveSettings/SaveSettings";
import EditorControls
    from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorBody/EditorControls/EditorControls";
import ClosePopup
    from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorBody/Buttons/ClosePopup/ClosePopup";


interface PropsType {
    data: PhotoEditorDataType;
    type: typeof PHOTO_KEY;
}

const PhotoEditorBody: FC<PropsType> = ({
                                            data,
                                            type
                                        }) => {
    const dispatch = useAppDispatch()
    const formFileData = useAppSelector(selectFormFileData)[type]

    /**
     * Название открытого в данный момент файла
     */
    const fileName = useAppSelector(selectOpenedFileName)

    /**
     * Настройки изображений из состояния приложения. Если добавлены новые фотографии, то создается объект с настройками по умолчанию, т.е. объект для файла существует и не является пустым
     */
    const photosSettings = useAppSelector(selectPhotoListSettings)

    /**
     * Временные настройки для фотографий фоторедактора, пока пользователь не нажмет кнопку "Сохранить", они не будут приняты в финальное состояние
     */
    const [temporaryPhotosSettings, setTemporaryPhotosSettings] =
        useState<PhotoEditorSettingsType[]>(() => photosSettings)

    /**
     * Файлы для превью фотографий для списка фото в редакторе и в форме
     */
    const [listOfPreviews, setListOfPreviews] =
        useState<CustomFile[]>(() => formFileData.filesFinally.map((file, i) => Object.assign(file, {id: i})))
    //

    /**
     * Callback для поиска файла или настройки файла по его названию. Используется в инициализации состояния и его обновления
     */
    const findCurrentFile = useCallback(findElement, [])

    //

    /**
     * Выбранное изображение в данный момент пользователем в виде объекта с типом File
     */
    const [photo, setPhoto] =
        useState<File>(() => (
            formFileData.files.find((f) => findCurrentFile(f, fileName))!
        ))

    /**
     * Настройки для выбранного в данный момент изображения.
     * Настройки выбранного изображения извлекаются из состояния temporaryPhotosSettings
     */
    const [currentPhotoSettings, setCurrentPhotoSettings] =
        useState<PhotoEditorSettingsType>(
            () => temporaryPhotosSettings.find((f) => findCurrentFile(f, fileName))!
        )

    const updatePhotoSettings = useCallback(<T extends string | number | Crop>(key: PhotoSettingKeysType, newValue: T) => {
        setCurrentPhotoSettings((prevState) => ({
            ...prevState,
            [key]: newValue
        }))
    }, [])

    const updateCrop = useCallback((newCrop: Crop, name: string) => {
        if (name === fileName) updatePhotoSettings("crop", newCrop)
    }, [updatePhotoSettings, fileName])

    /**
     *
     * @param value
     */
    const scaleImageHandler = (value: number) => {
        updatePhotoSettings("scale", stickToClosestValue(value, scalePoints, scaleStickPoint))
    }

    /**
     *
     * @param value
     */
    const rotateImageHandler = (value: number) => {
        updatePhotoSettings("rotate", Math.min(180, Math.max(-180, Number(value))))
    }

    /**
     * Сбросить настройки увеличения и поворота у выбранной фотографии
     */
    const resetSettingsHandler = () => {
        setCurrentPhotoSettings((prevState) => ({
            ...prevState,
            scale: 1,
            rotate: 0,
        }))
    }

    const getAnotherSettings = useCallback((anotherFileName: string) => {
        return temporaryPhotosSettings.find((setting) => findCurrentFile(setting, anotherFileName))!
    }, [
        findCurrentFile,
        temporaryPhotosSettings
    ])

    /**
     * Переключение на другой файл
     * @param anotherFileName
     */
    const switchToAnotherFile = (anotherFileName: string) => {
        if (fileName === anotherFileName && photo.name === anotherFileName) return

        setTemporaryPhotosSettings((prevState) => {
            return prevState.map((settings) => {
                if (settings.name === fileName) return currentPhotoSettings
                return settings
            })
        })

        setPhoto(formFileData.files.find((f) => findCurrentFile(f, anotherFileName)) || {} as File)
        const anotherSetting = getAnotherSettings(anotherFileName)
        setCurrentPhotoSettings(anotherSetting)
        dispatch(setCurrentOpenedFileName({fileName: anotherFileName}))
    }

    /**
     * Удаление файла из списка
     * @param removedFileName
     */
    const removeFile = (removedFileName: string) => {
        const prevFileName = currentPhotoSettings.name

        dispatch(deleteFile({key: type, data: {name: removedFileName}}))

        setListOfPreviews((prevState) => prevState.filter((preview) => preview.name !== removedFileName))
        setTemporaryPhotosSettings((prevState) => prevState.filter((setting) => setting.name !== removedFileName))

        if (listOfPreviews.length > 1 && removedFileName === prevFileName) {
            const anotherFile = formFileData.filesNames.filter((name) => name !== removedFileName)[0]
            switchToAnotherFile(anotherFile)
        } else if (listOfPreviews.length <= 1) {
            dispatch(changePopupVisibility({type}))
            dispatch(setCurrentOpenedFileName({fileName: ''}))
        }
    }

    const updatePhotoPreview = useCallback((newFile: File) => {
        setListOfPreviews((prevState) => {
            return prevState.map((file) => {
                if (file.name === newFile.name) {
                    return Object.assign(newFile, {id: file.id})
                }
                return file
            })
        })
    }, [])

    const saveSettingsHandler = () => {
        /**
         * Изменение preview у всего списка фотографий
         */
        dispatch(changePreview({
            key: type,
            data: listOfPreviews
        }))

        /**
         * Сохранение всех настроек для каждого фото
         */
        const listOfSettings = temporaryPhotosSettings.map((setting) => {
            if (setting.name === currentPhotoSettings.name) return currentPhotoSettings
            return setting
        })
        dispatch(changePhotoSettings(listOfSettings))
        dispatch(changePopupVisibility({type}))
        dispatch(setCurrentOpenedFileName({fileName: ""}))
    }

    return (
        <div className={`${popupsCommonStyles.popupBody} ${styles.photoEditorBody}`}>
            <div className={styles.editorGrid}>
                {fileName === photo.name ? (
                    <Editor scale={currentPhotoSettings.scale}
                            rotate={currentPhotoSettings.rotate}
                            setCrop={updateCrop}
                            updatePhoto={updatePhotoPreview}
                            crop={currentPhotoSettings.crop}
                            photo={photo}/>
                ) : null}
            </div>

            <div className={styles.editorControlsWrapper}>
                <EditorControls
                    scaleProps={{
                        value: currentPhotoSettings.scale,
                        data: data.editor.scale,
                        updateFunc: scaleImageHandler
                    }}
                    rotateProps={{
                        value: currentPhotoSettings.rotate,
                        data: data.editor.rotate,
                        updateFunc: rotateImageHandler
                    }}/>

                <div className={styles.resetSettings}
                     onClick={() => resetSettingsHandler()}>
                    <Text style={{color: blue_light}}>
                        {data.editor.resetSettings}
                    </Text>
                </div>
            </div>

            <SeparatingLine className={styles.separatedLine}/>

            <PopupFileList titleOfList={data.photoList.uploadedPhotos}
                           listOfPreviews={listOfPreviews}
                           func={{
                               switchToAnotherFile,
                               removeFile
                           }}/>

            <div className={`${popupsCommonStyles.buttons} ${styles.photoEditorButtons}`}>
                <SaveSettings data={data.buttons.save}
                              saveSettings={saveSettingsHandler}/>

                <ClosePopup data={data.buttons.close} type={type}/>
            </div>
        </div>
    );
};

export default PhotoEditorBody;