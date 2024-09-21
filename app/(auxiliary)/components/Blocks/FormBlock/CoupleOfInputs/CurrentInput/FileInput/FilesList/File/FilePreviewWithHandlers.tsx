import React, {FC, useState} from 'react';
import styles from "./File.module.scss";
import DeleteFile from "@/app/(auxiliary)/components/UI/SVG/DeleteFile/DeleteFile";
import ChangePhoto from "@/app/(auxiliary)/components/UI/SVG/ChangePhoto/ChangePhoto";
import FilePreview from "@/app/(auxiliary)/components/Blocks/FilePreviewBlock/FilePreviewBlock";
import {RemoveFileFuncType} from "@/app/(auxiliary)/types/PopupTypes/FuncTypes";

interface PropsType {
    file: File; // CustomFileType;
    // file: FilePreviewType; // CustomFileType;
    removeFile: RemoveFileFuncType;
    openFile: (fileName: string) => void;

}


const FilePreviewWithHandlers: FC<PropsType> = ({
                                                    file,
                                                    removeFile,
                                                    openFile
                                                }) => {

    const [visibleHover, setVisibleHover] = useState<boolean>(false)

    const handleHover = (hoverStatus: boolean) => {
        setVisibleHover(hoverStatus)
    }

    const handleRemove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        removeFile(file.name)
    }

    return (
        <div className={styles.filePreviewWrapper}
             onMouseEnter={() => handleHover(true)}
             onMouseLeave={() => handleHover(false)}>

            {visibleHover ? (
                <div className={styles.fileCover}
                     onClick={() => openFile(file.name)}>
                    <div className={styles.fileRemove}
                         onClick={(e) => handleRemove(e)}>
                        <DeleteFile/>
                    </div>

                    <ChangePhoto/>
                </div>
            ) : null}

            <FilePreview url={URL.createObjectURL(file)}
                         alt={file.name}/>
        </div>
    );
}


// const FilePreviewWithHandlers = memo(PreviewWithHandlers);

export default FilePreviewWithHandlers;