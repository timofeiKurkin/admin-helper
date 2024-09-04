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
import {number} from "prop-types";


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
    const [rotate, setRotate] = useState(0)
    console.log("rotate: ", rotate)

    useEffect(() => {
        setCurrentPhotoURL(contentForEditor.fileList.files.find(findCurrentFile) || {} as File)
    }, [
        findCurrentFile,
        contentForEditor.fileList,
    ])

    const scaleImageHandler = (value: number) => {
        setScale(value)
    }

    const rotateImageHandler = (value: number) => {
        setRotate(value)
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
                    <Text>{data.editor.scale}</Text>
                    <Range onChange={(e) => scaleImageHandler(Number(e.target.value))}
                           value={scale}
                           maxValue={2.5}
                           minValue={0.5}
                           step={0.01}
                    />

                    <Text>{data.editor.rotate}</Text>
                    <div>
                        <Range onChange={(e) =>
                            rotateImageHandler(
                                // Math.round(
                                    Math.min(
                                        180,
                                        Math.max(-180, Number(e.target.value)))
                                // )
                            )
                        }
                               value={rotate}
                               maxValue={180}
                               minValue={-180}
                               step={1}
                        />

                        <div className={styles.rotateSliderTicks}>
                            {[-180, -90, 0, 90, 180].map((degree) => (
                                <span key={`key=${number}`}
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
                {photoSettings && (
                    <Button style={{backgroundColor: blue_dark}}>
                        {data.buttons.save}
                    </Button>
                )}
                <Button onClick={visiblePhotoEditor}
                        style={{backgroundColor: grey}}
                >{data.buttons.close}</Button>
            </div>
        </div>
    );
};

export default PhotoEditorBody;