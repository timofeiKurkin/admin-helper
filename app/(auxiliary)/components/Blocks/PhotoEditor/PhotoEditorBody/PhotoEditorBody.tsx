import React, {FC, useCallback, useEffect, useState} from 'react';
import Editor from "@/app/(auxiliary)/components/Blocks/PhotoEditor/PhotoEditorBody/Editor/Editor";
import styles from "./PhotoEditorBody.module.scss";
import SeparatingLine from "@/app/(auxiliary)/components/UI/SeparatingLine/SeparatingLine";
import FileList from "@/app/(auxiliary)/components/Blocks/PhotoEditor/PhotoEditorBody/FileList/FileList";
import {PhotoEditorDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {blue_dark, blue_light, grey} from "@/styles/colors";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import Range from "@/app/(auxiliary)/components/UI/Inputs/Range/Range";
import {FileListStateType} from "@/app/(auxiliary)/types/AppTypes/Context";
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectCurrentFileName,
    selectPhotoListSettings
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PhotoEditorSlice/PhotoEditorSlice";
import SmallText from "@/app/(auxiliary)/components/UI/TextTemplates/SmallText";
import {stickToClosestValue} from "@/app/(auxiliary)/func/editorHandlers";


interface PropsType {
    data: PhotoEditorDataType;
    contentForEditor: {
        fileList: FileListStateType;
        switchToAnotherFile: (fileName: string) => void;
    }
    visiblePhotoEditor: () => void;
}

const PhotoEditorBody: FC<PropsType> = ({
                                            data,
                                            contentForEditor,
                                            visiblePhotoEditor
                                        }) => {
    const currentFileName = useAppSelector(selectCurrentFileName)
    const photoSettings = useAppSelector(selectPhotoListSettings).find((photo) => photo.fileName === currentFileName)

    const findCurrentFile = useCallback((file: File) => {
        return file.name === currentFileName
    }, [currentFileName])

    const [currentPhotoURL, setCurrentPhotoURL] =
        useState<File>(() => (
            contentForEditor.fileList.files.find(findCurrentFile) || {} as File
        ))

    const [scale, setScale] = useState(1)
    const scalePoints = [0.5, 1, 2, 2.5]

    const [rotate, setRotate] = useState(0)
    const rotatePoints = [-180, -90, 0, 90, 180]

    useEffect(() => {
        setCurrentPhotoURL(contentForEditor.fileList.files.find(findCurrentFile) || {} as File)
    }, [
        findCurrentFile,
        contentForEditor.fileList,
    ])

    const scaleImageHandler = (value: number) => {
        const stickStep = 0.05
        setScale(stickToClosestValue(value, scalePoints, stickStep))
    }

    const rotateImageHandler = (value: number) => {
        const newValue = Math.min(180, Math.max(-180, Number(value)))
        const stickStep = 5
        setRotate(stickToClosestValue(newValue, rotatePoints, stickStep))
    }

    const resetSettingsHandler = () => {
        setScale(() => 1)
        setRotate(() => 0)
    }

    return (
        <div className={styles.photoEditorBody}>
            <div className={styles.editorGrid}>
                <Editor scale={scale}
                        rotate={rotate}
                        currentPhoto={currentPhotoURL}/>
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
                            {scalePoints.map((scaleX, index) => {
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
                              switchToAnotherFile: contentForEditor.switchToAnotherFile,
                          }}
                />
            </div>

            <div className={styles.photoEditorButtons}>
                <Button style={{backgroundColor: blue_dark}}>
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