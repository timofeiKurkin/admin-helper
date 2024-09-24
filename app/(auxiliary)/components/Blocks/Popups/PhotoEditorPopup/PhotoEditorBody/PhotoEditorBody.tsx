import React, {FC, useCallback, useState} from 'react';
import styles from "./PhotoEditorBody.module.scss";
import popupsCommonStyles from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupsCommomStyles.module.scss"
import SeparatingLine from "@/app/(auxiliary)/components/UI/SeparatingLine/SeparatingLine";
import {PhotoEditorDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import {blue_light} from "@/styles/colors";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    changePopupVisibility,
    selectOpenedFileName,
    selectPhotoListSettings,
    setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import {
    getDefaultPhotoSettings,
    rotatePoints,
    rotateStickPoint,
    scalePoints,
    scaleStickPoint,
    stickToClosestValue
} from "@/app/(auxiliary)/func/editorHandlers";
import {PhotoEditorSettingsType} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";
import {Crop} from "react-image-crop";
import {
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
        useState<File[]>(() => formFileData.filesFinally)

    //

    /**
     * Callback для поиска файла или настройки файла по его названию. Используется в инициализации состояния и его обновления
     */
    const findCurrentFile = useCallback(<T extends { name: string }>(file: T, name: string) => file.name === name, [])

    //

    /**
     * Выбранное изображение в данный момент пользователем в виде объекта с типом File
     */
    const [photo, setPhoto] =
        useState<File>(() => (
            formFileData.files.find((f) => findCurrentFile(f, fileName)) || {} as File
        ))

    /**
     * Настройки для выбранного в данный момент изображения.
     * Настройки выбранного изображения извлекаются из состояния temporaryPhotosSettings
     */
    const [currentPhotoSettings, setCurrentPhotoSettings] =
        useState<PhotoEditorSettingsType>(
            () => temporaryPhotosSettings.find((f) => findCurrentFile(f, fileName)) || getDefaultPhotoSettings(fileName)
        )

    /**
     * Значение увеличения открытой фотографии
     */
    const [scale, setScale] =
        useState(() => currentPhotoSettings.scale)

    /**
     * Значение поворота открытой фотографии
     */
    const [rotate, setRotate] =
        useState(() => currentPhotoSettings.rotate)

    /**
     * Настройка обрезки
     */
    const [crop, setCrop] = useState<Crop>(() => currentPhotoSettings.crop)
    const updateCrop = useCallback((newCrop: Crop) => setCrop(newCrop), [])

    /**
     *
     * @param value
     */
    const scaleImageHandler = (value: number) => {
        setScale(stickToClosestValue(value, scalePoints, scaleStickPoint))
    }

    /**
     *
     * @param value
     */
    const rotateImageHandler = (value: number) => {
        const newValue = Math.min(180, Math.max(-180, Number(value)))
        setRotate(stickToClosestValue(newValue, rotatePoints, rotateStickPoint))
    }

    /**
     * Сбросить настройки увеличения и поворота у выбранной фотографии
     */
    const resetSettingsHandler = () => {
        setCurrentPhotoSettings(getDefaultPhotoSettings(fileName))
        setScale(1)
        setRotate(0)
    }

    const getAnotherSettings = useCallback((anotherFileName: string) => {
        return temporaryPhotosSettings
            .find((f) => findCurrentFile(f, anotherFileName)) ||
            getDefaultPhotoSettings(anotherFileName)
    }, [
        findCurrentFile,
        temporaryPhotosSettings
    ])

    /**
     * Переключение на другой файл
     * @param anotherFileName
     */
    const switchToAnotherFile = (anotherFileName: string) => {
        const prevFileName = currentPhotoSettings.name

        if (prevFileName === anotherFileName) return
        dispatch(setCurrentOpenedFileName({fileName: anotherFileName}))

        setTemporaryPhotosSettings((prevState) => {
            return prevState.map((settings) => {
                if (settings.name === prevFileName) {
                    return {
                        ...settings,
                        scale,
                        rotate,
                        crop
                    }
                }

                return settings
            })
        })

        setPhoto(formFileData.files.find((f) => findCurrentFile(f, anotherFileName)) || {} as File)

        const anotherSetting = getAnotherSettings(anotherFileName)
        setCurrentPhotoSettings(anotherSetting)
        updateCrop(anotherSetting.crop)
        setRotate(anotherSetting.rotate)
        setScale(anotherSetting.scale)
    }

    /**
     * Удаление файла из списка
     * @param removedFileName
     */
    const removeFile = (removedFileName: string) => {
        dispatch(deleteFile({key: type, data: {name: removedFileName}}))

        setListOfPreviews((prevState) => prevState.filter((preview) => preview.name !== removedFileName))
        setTemporaryPhotosSettings((prevState) => prevState.filter((setting) => setting.name !== removedFileName))

        if (listOfPreviews.length <= 1) {
            dispatch(changePopupVisibility({type}))
        } else {
            const anotherFile = formFileData.filesNames.filter((name) => name !== removedFileName)[0]
            dispatch(setCurrentOpenedFileName({fileName: anotherFile}))
            switchToAnotherFile(anotherFile)
        }
    }

    const updatePhotoPreview = (newFile: File) => {
        setListOfPreviews((prevState) => {
            return prevState.map((file) => {
                if (file.name === newFile.name) {
                    return newFile
                }
                return file
            })
        })
    }

    return (
        <div className={`${popupsCommonStyles.popupBody} ${styles.photoEditorBody}`}>
            <div className={styles.editorGrid}>
                <Editor scale={scale}
                        rotate={rotate}
                        setCrop={updateCrop}
                        updatePhoto={updatePhotoPreview}
                        crop={crop}
                        photo={photo}/>
            </div>

            <div className={styles.editorControlsWrapper}>
                <EditorControls
                    scaleProps={{
                        value: scale,
                        data: data.editor.scale,
                        updateFunc: scaleImageHandler
                    }}
                    rotateProps={{
                        value: rotate,
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

            <PopupFileList listOfPreviews={listOfPreviews}
                           titleOfList={data.title}
                           func={{
                               switchToAnotherFile,
                               removeFile
                           }}
            />

            <div className={`${popupsCommonStyles.buttons} ${styles.photoEditorButtons}`}>
                <SaveSettings data={data.buttons.save}
                              type={type}
                              settingsForSaving={temporaryPhotosSettings}
                              listOfFiles={listOfPreviews}/>

                <ClosePopup data={data.buttons.close} type={type}/>
            </div>
        </div>
    );
};

export default PhotoEditorBody;