import React, {FC, useContext} from 'react';
import styles from "./FilesList.module.scss";
import ButtonText from "@/app/(auxiliary)/components/UI/TextTemplates/ButtonText";
import File
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FilesList/File/File";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";

interface PropsType {
    placeholder: string;
}

const FilesList: FC<PropsType> = ({placeholder}) => {
    const {appState} = useContext(AppContext)
    console.log("appState in FilesList", appState)

    return (
        <div className={styles.filesListWrapper}>
            <div className={styles.filesList}>
                {appState.photoList?.length ? (
                        appState.photoList.map((file, i) => (
                            <File file={file} key={`key=${i}`}/>
                        ))
                    )
                    :
                    <div className={styles.emptyList}>
                        <ButtonText>{placeholder}</ButtonText>
                    </div>
                }
            </div>
        </div>
    );
};

export default FilesList;