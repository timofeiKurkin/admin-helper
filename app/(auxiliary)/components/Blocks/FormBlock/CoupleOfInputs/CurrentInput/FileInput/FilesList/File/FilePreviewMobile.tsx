import React, { FC } from 'react'
import styles from "./FilePreviewWithHandlers.module.scss"
import Text from '@/app/(auxiliary)/components/UI/TextTemplates/Text';
import DeleteFile from '@/app/(auxiliary)/components/UI/SVG/DeleteFile/DeleteFile';
import { DivMouseEventHandler } from '@/app/(auxiliary)/types/AppTypes/AppTypes';
import FilePreviewBlock from '@/app/(auxiliary)/components/Blocks/FilePreviewBlock/FilePreviewBlock';
import TextMedium from '@/app/(auxiliary)/components/UI/TextTemplates/TextMedium';


interface PropsType {
    file: File;
    handleRemove: (e: DivMouseEventHandler) => void;
    index: number
}

const FilePreviewMobile: FC<PropsType> = ({ file, handleRemove, index }) => {


    return (
        <div className={styles.filePreviewMobileWrapper}>

            <TextMedium>{index + 1}</TextMedium>

            <div className={styles.filePreviewWrapper}>
                <FilePreviewBlock url={URL.createObjectURL(file)}
                    alt={file.name} />
            </div>

            <div className={styles.filePreviewMobileFilename}>
                <TextMedium>{file.name.split(".").slice(0, -1)}</TextMedium>
            </div>


            <div className={styles.fileRemove}
                onClick={(e) => handleRemove(e)}>
                <DeleteFile />
            </div>
        </div>
    )
}

export default FilePreviewMobile