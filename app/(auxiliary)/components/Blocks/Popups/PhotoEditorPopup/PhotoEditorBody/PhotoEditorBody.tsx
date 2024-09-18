import React, {FC, useCallback, useEffect, useState} from 'react';
import styles from "./PhotoEditorBody.module.scss";
import popupsCommonStyles from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupsCommomStyles.module.scss"
import SeparatingLine from "@/app/(auxiliary)/components/UI/SeparatingLine/SeparatingLine";
import {PhotoEditorDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {blue_dark, blue_light, grey} from "@/styles/colors";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import Range from "@/app/(auxiliary)/components/UI/Inputs/Range/Range";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    changeEditorVisibility,
    changePhotoSettings,
    selectOpenedFileName,
    selectPhotoListSettings,
    setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PhotoEditorSlice/PhotoEditorSlice";
import SmallText from "@/app/(auxiliary)/components/UI/TextTemplates/SmallText";
import {
    getDefaultPhotoSettings,
    rotatePoints,
    scalePoints,
    stickToClosestValue
} from "@/app/(auxiliary)/func/editorHandlers";
import {PhotoEditorSettingsType} from "@/app/(auxiliary)/types/PhotoEditorTypes/PhotoEditorTypes";
import {Crop} from "react-image-crop";
import {
    changePhotosPreview,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {PHOTO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import Editor from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorBody/Editor/Editor";
import PopupFileList from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupFileList/PopupFileList";


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
        useState<File[]>(() => formFileData.filesFinally || formFileData.files)

    //

    /**
     * Callback для поиска файла или настройки файла по его названию. Используется в инициализации состояния и его обновления
     */
    const findCurrentFile = useCallback(<T extends { name: string }>(file: T, name: string) => {
        return file.name === name
    }, [])

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
        useState(() => temporaryPhotosSettings.find((f) => findCurrentFile(f, fileName)) || getDefaultPhotoSettings(fileName))

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
    const [crop, setCrop] = useState<Crop>(currentPhotoSettings.crop)
    const updateCrop = useCallback((newCrop: Crop) => setCrop(() => newCrop), [])

    const scaleImageHandler = (value: number) => {
        const stickStep = 0.05
        setScale(stickToClosestValue(value, scalePoints, stickStep))
    }

    const rotateImageHandler = (value: number) => {
        const newValue = Math.min(180, Math.max(-180, Number(value)))
        const stickStep = 5
        setRotate(stickToClosestValue(newValue, rotatePoints, stickStep))
    }

    /**
     * Сбросить настройки увеличения и поворота у выбранной фотографии
     */
    const resetSettingsHandler = () => {
        setCurrentPhotoSettings((prevState) => ({
            ...prevState,
            scale: 1,
            rotate: 0
        }))
        setScale(() => 1)
        setRotate(() => 0)
    }

    /**
     * Сохранить настройки фотографий и закрыть редактор
     * @param settings
     */
    const saveSettingsHandler = (settings: PhotoEditorSettingsType) => {
        /**
         * Изменение preview у всего списка фотографий
         */
        dispatch(changePhotosPreview(listOfPreviews))


        /**
         * Сохранение всех настроек для каждого фото
         */
        dispatch(changePhotoSettings(settings))
        dispatch(changeEditorVisibility())
    }

    const closeEditorHandler = () => {
        dispatch(changeEditorVisibility())
    }

    /**
     * Переключение на другой файл
     * @param anotherFileName
     */
    const switchToAnotherFile = (anotherFileName: string) => {
        const prevFileName = currentPhotoSettings.name

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
        const anotherSetting = temporaryPhotosSettings
            .find((f) =>
                findCurrentFile(f, anotherFileName)) || getDefaultPhotoSettings(anotherFileName)

        setCurrentPhotoSettings(anotherSetting)
        updateCrop(anotherSetting.crop)
        setRotate(anotherSetting.rotate)
        setScale(anotherSetting.scale)
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

    useEffect(() => {
        setListOfPreviews(() => formFileData.filesFinally || formFileData.files)
    }, [
        formFileData.files,
        formFileData.filesFinally
    ]);

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

                <div className={styles.editorControls}>
                    <div className={styles.editorTitle}><Text>{data.editor.scale}</Text></div>
                    <div className={styles.scaleWrapper}>
                        <Range onChange={(e) => scaleImageHandler(Number(e.target.value))}
                               value={scale}
                               maxValue={2.5}
                               minValue={0.5}
                               step={0.01}
                        />

                        <div className={styles.scaleSliderTicks}>
                            {scalePoints.map((scaleX) => {
                                const min = 0.5
                                const max = 2.5

                                return (
                                    <span key={`key=${scaleX}`}
                                          style={{
                                              left: `${((scaleX - min) / (max - min)) * 100}%`
                                          }}
                                          onClick={() => scaleImageHandler(scaleX)}>
                                        <SmallText>{scaleX}x</SmallText>
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                    <div className={styles.editorTitle}><Text>{data.editor.rotate}</Text></div>
                    <div className={styles.rotateWrapper}>
                        <Range onChange={(e) =>
                            rotateImageHandler(Number(e.target.value))
                        }
                               value={rotate}
                               maxValue={180}
                               minValue={-180}
                               step={1}/>

                        <div className={styles.rotateSliderTicks}>
                            {rotatePoints.map((degree) => (
                                <span key={`key=${degree}`}
                                      className={styles.sliderTick}
                                      onClick={() => rotateImageHandler(degree)}
                                >
                                    <SmallText>{degree}</SmallText>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.resetSettings} onClick={() => resetSettingsHandler()}>
                    <Text style={{color: blue_light}}>
                        {data.editor.resetSettings}
                    </Text>
                </div>
            </div>

            <SeparatingLine className={styles.separatedLine}/>

            <PopupFileList contentForEditor={{
                listOfPreviews: listOfPreviews,
                type: type,
                titleOfList: data.photoList.uploadedPhotos,
                switchToAnotherFile: switchToAnotherFile,
            }}
            />

            <div className={`${popupsCommonStyles.buttons} ${styles.photoEditorButtons}`}>
                <Button style={{backgroundColor: blue_dark}}
                        onClick={() => saveSettingsHandler({
                            name: fileName,
                            scale,
                            rotate,
                            crop
                        })}>
                    {data.buttons.save}
                </Button>

                <Button onClick={closeEditorHandler}
                        style={{backgroundColor: grey}}>
                    {data.buttons.close}
                </Button>
            </div>
        </div>
    );
};

export default PhotoEditorBody;