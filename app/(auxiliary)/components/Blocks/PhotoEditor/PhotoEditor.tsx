import React, {useContext, useState} from 'react';
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import styles from "./PhotoEditor.module.scss"
import Image from "next/image";

const PhotoEditor = () => {
    const {appState, setAppState} = useContext(AppContext)
    const [result, setResult] = useState<string>("");

    const [imageForEditor, setImageForEditor] = useState<File>(() => {
        if (appState.userFormData?.file_data && appState.userFormData?.file_data["photo"]) {
            return appState.userFormData?.file_data["photo"].files[0]
        }

        return {} as File
    })

    console.log("result", result)
    console.log("imageForEditor", imageForEditor)

    return (
        <div className={styles.photoEditorWrapper}>
            <div className={styles.photoEditorBody}>
                {/*photo Editor*/}

            </div>
        </div>
    );
};

export default PhotoEditor;