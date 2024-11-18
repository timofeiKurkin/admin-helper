import React, { FC, useState } from 'react';
import styles from "./FilePreviewWithHandlers.module.scss";
import DeleteFile from "@/app/(auxiliary)/components/UI/SVG/DeleteFile/DeleteFile";
import ChangePhoto from "@/app/(auxiliary)/components/UI/SVG/ChangePhoto/ChangePhoto";
import FilePreviewBlock from "@/app/(auxiliary)/components/Blocks/FilePreviewBlock/FilePreviewBlock";
import { RemoveFileFuncType } from "@/app/(auxiliary)/types/FormTypes/PopupTypes/FuncTypes";
import { useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { selectUserDevice } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import FilePreviewMobile from './FilePreviewMobile';
import { DivMouseEventHandler } from '@/app/(auxiliary)/types/AppTypes/AppTypes';

interface PropsType {
    file: File;
    removeFile: RemoveFileFuncType;
    openFile: (fileName: string) => void;
    index: number;
}


const FilePreviewWithHandlers: FC<PropsType> = ({
    file,
    removeFile,
    openFile,
    index
}) => {
    const userDevice = useAppSelector(selectUserDevice)
    const [visibleHover, setVisibleHover] = useState<boolean>(false)

    const handleHover = (hoverStatus: boolean) => {
        setVisibleHover(hoverStatus)
    }

    const handleRemove = (e: DivMouseEventHandler) => {
        e.stopPropagation()
        removeFile(file.name)
    }

    if (!userDevice.phoneAdaptive) {
        return (
            <div className={styles.filePreviewWrapper}
                onMouseEnter={() => handleHover(true)}
                onMouseLeave={() => handleHover(false)}>

                {visibleHover ? (
                    <div className={styles.fileCover}
                        onClick={() => openFile(file.name)}>
                        <div className={styles.fileRemove}
                            onClick={(e) => handleRemove(e)}>
                            <DeleteFile />
                        </div>

                        <ChangePhoto />
                    </div>
                ) : null}

                <FilePreviewBlock url={URL.createObjectURL(file)}
                    alt={file.name} />
            </div>
        );
    } else {
        return <FilePreviewMobile file={file} handleRemove={handleRemove} index={index}/>
    }
}

export default FilePreviewWithHandlers;