import React, {FC, useState} from 'react';
import styles from "./File.module.scss";
import DeleteFile from "@/app/(auxiliary)/components/UI/SVG/DeleteFile/DeleteFile";
import ChangePhoto from "@/app/(auxiliary)/components/UI/SVG/ChangePhoto/ChangePhoto";
import FilePreview from "@/app/(auxiliary)/components/Blocks/FilePreviewBlock/FilePreviewBlock";

interface PropsType {
    file: File; // CustomFileType;
    // file: FilePreviewType; // CustomFileType;
    removeHandler: (fileName: string) => void;
    changeFile: (fileName: string) => void;

}


const FilePreviewWithHandlers: FC<PropsType> = ({
                                                    file,
                                                    removeHandler,
                                                    changeFile
                                                }) => {

    const [visibleHover, setVisibleHover] = useState<boolean>(false)

    const handleHover = (hoverStatus: boolean) => {
        setVisibleHover(hoverStatus)
    }

    const handleRemove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        removeHandler(file.name)
    }

    return (
        <div className={styles.filePreviewWrapper}
             onMouseEnter={() => handleHover(true)}
             onMouseLeave={() => handleHover(false)}>

            {visibleHover ? (
                <div className={styles.fileCover}
                     onClick={() => changeFile(file.name)}>
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