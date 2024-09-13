import React, {FC, useCallback, useState} from 'react';
import Editor from "@/app/(auxiliary)/components/Blocks/PhotoEditor/PhotoEditorBody/Editor/Editor";
import styles from "./PhotoEditorBody.module.scss";
import SeparatingLine from "@/app/(auxiliary)/components/UI/SeparatingLine/SeparatingLine";
import FileList from "@/app/(auxiliary)/components/Blocks/PhotoEditor/PhotoEditorBody/EditorFileList/EditorFileList";
import {PhotoEditorDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {blue_dark, blue_light, grey} from "@/styles/colors";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import Range from "@/app/(auxiliary)/components/UI/Inputs/Range/Range";
import {FileListStateType} from "@/app/(auxiliary)/types/AppTypes/Context";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    changePhotoSettings,
    selectCurrentFileName,
    selectPhotoListSettings
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


interface PropsType {
    data: PhotoEditorDataType;
    contentForEditor: {
        fileList: FileListStateType;
    }
    visiblePhotoEditor: () => void;
}

const PhotoEditorBody: FC<PropsType> = ({
                                            data,
                                            contentForEditor,
                                            visiblePhotoEditor
                                        }) => {
    const dispatch = useAppDispatch()

    /**
     * Название открытого в данный момент файла
     */
    const currentFileName = useAppSelector(selectCurrentFileName)

    /**
     * Настройки изображений из состояния приложения. Если добавлены новые фотографии, то создается объект с настройками по умолчанию, т.е. объект для файла существует и не является пустым
     */
    const photosSettings = useAppSelector(selectPhotoListSettings)

    /**
     * Временные настройки для фотографий фоторедактора, пока пользователь не нажмет кнопку "Сохранить", они не будут приняты в финальное состояние
     */
    const [temporaryPhotosSettings, setTemporaryPhotosSettings] =
        useState<PhotoEditorSettingsType[]>(() => photosSettings)

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
    const [currentPhoto, setCurrentPhoto] =
        useState<File>(() => (
            contentForEditor.fileList.files.find((f) => findCurrentFile(f, currentFileName)) || {} as File
        ))

    /**
     * Настройки для выбранного в данный момент изображения.
     * Настройки выбранного изображения извлекаются из состояния temporaryPhotosSettings
     */
    const [currentPhotoSettings, setCurrentPhotoSettings] =
        useState(() => temporaryPhotosSettings.find((f) => findCurrentFile(f, currentFileName)) || getDefaultPhotoSettings(currentFileName))

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
        setCurrentPhotoSettings((prevState) => ({...prevState, scale: 1, rotate: 0}))
        setScale(() => 1)
        setRotate(() => 0)
    }

    /**
     * Сохранить настройки фотографий и закрыть редактор
     * @param settings
     */
    const saveSettingsHandler = (settings: PhotoEditorSettingsType) => {
        dispatch(changePhotoSettings(settings))
        visiblePhotoEditor()
    }

    /**
     * Переключение на другой файл
     * @param anotherFileName
     */
    const switchToAnotherFile = (anotherFileName: string) => {
        const prevFileName = currentPhotoSettings.name
        // console.log("")

        setTemporaryPhotosSettings((prevState) => {
            return prevState.map((settings) => {
                if (settings.name === prevFileName) {

                    // console.log("prev name: ", prevFileName)
                    // console.log("crop: ", crop)
                    // console.log("rotate: ", rotate)

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

        setCurrentPhoto(contentForEditor.fileList.files.find((f) => findCurrentFile(f, anotherFileName)) || {} as File)
        const anotherSetting = temporaryPhotosSettings.find((f) => findCurrentFile(f, anotherFileName)) || getDefaultPhotoSettings(anotherFileName)
        // console.log("another settings after updating temporary list of settings: ", anotherSetting)

        setCurrentPhotoSettings(anotherSetting)
        updateCrop(anotherSetting.crop)
        setRotate(anotherSetting.rotate)
        setScale(anotherSetting.scale)
    }

    // console.log("temporary list: ", temporaryPhotosSettings)

    return (
        <div className={styles.photoEditorBody}>
            <div className={styles.editorGrid}>
                <Editor scale={scale}
                        rotate={rotate}
                        setCrop={updateCrop}
                        crop={crop}
                        currentPhoto={currentPhoto}/>
            </div>

            <div className={styles.editorControlsWrapper}>
                {/*{content.rotate}*/}

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
                                          onClick={() => scaleImageHandler(scaleX)}
                                    >
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
                               step={1}
                        />

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
                    <Text style={{color: blue_light}}>{data.editor.resetSettings}</Text>
                </div>
            </div>

            <SeparatingLine className={styles.separatedLine}/>

            <div className={styles.fileListGrid}>
                <FileList data={data.photoList}
                          contentForEditor={{
                              fileList: contentForEditor.fileList,
                              switchToAnotherFile: switchToAnotherFile,
                          }}
                />
            </div>

            <div className={styles.photoEditorButtons}>
                <Button style={{backgroundColor: blue_dark}} onClick={() => saveSettingsHandler({
                    name: currentFileName,
                    scale,
                    rotate,
                    crop
                })}>
                    {data.buttons.save}
                </Button>
                <Button onClick={visiblePhotoEditor}
                        style={{backgroundColor: grey}}
                >{data.buttons.close}</Button>
            </div>
        </div>
    );
};

export default PhotoEditorBody;