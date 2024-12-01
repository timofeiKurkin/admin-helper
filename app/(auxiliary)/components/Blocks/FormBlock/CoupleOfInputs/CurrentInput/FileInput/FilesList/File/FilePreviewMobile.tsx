import DeleteFile from '@/app/(auxiliary)/components/UI/SVG/DeleteFile/DeleteFile';
import TextMedium from '@/app/(auxiliary)/components/UI/TextTemplates/TextMedium';
import { DivMouseEventHandler } from '@/app/(auxiliary)/types/AppTypes/AppTypes';
import { PhotoAndVideoKeysType } from '@/app/(auxiliary)/types/AppTypes/InputHooksTypes';
import { FC, memo } from 'react';
import styles from "./FilePreviewWithHandlers.module.scss";
import covers from "@/app/(auxiliary)/components/UI/Covers/HideLongTitleCover.module.scss";
import PreviewAdaptive from './PreviewAdaptive';


interface PropsType {
    file: File;
    handleRemove: (e: DivMouseEventHandler) => void;
    index: number;
    type: PhotoAndVideoKeysType;
}

const FilePreviewMobile: FC<PropsType> = memo(({ file, handleRemove, index, type }) => {

    return (
        <div className={styles.filePreviewMobileWrapper}>

            <TextMedium>{index + 1}</TextMedium>

            <div className={styles.filePreviewWrapper}>
                <PreviewAdaptive type={type} file={file} />
            </div>

            <div className={`${styles.filePreviewMobileFilename} ${covers.hideLongTitleCover}`}>
                <TextMedium>{file.name}</TextMedium>
            </div>


            <div className={styles.fileRemove}
                onClick={(e) => handleRemove(e)}>
                <DeleteFile />
            </div>
        </div>
    )
})

export default FilePreviewMobile