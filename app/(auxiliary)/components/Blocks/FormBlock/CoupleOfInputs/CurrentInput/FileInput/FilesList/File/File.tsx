import React, {FC, useState} from 'react';
import Image from "next/image";
import styles from "./File.module.scss";
import DeleteFile from "@/app/(auxiliary)/components/UI/SVG/DeleteFile/DeleteFile";
import ChangePhoto from "@/app/(auxiliary)/components/UI/SVG/ChangePhoto/ChangePhoto";
import FilePreviewBlock from "@/app/(auxiliary)/components/Blocks/FilePreviewBlock/FilePreviewBlock";

interface PropsType {
    file: File;
    fileIndex: number;
    removeHandler: (fileName: string) => void;
    changeFile: (fileName: string, index: number) => void;

}

const File: FC<PropsType> = ({
                                 file,
                                 fileIndex,
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
        <div className={styles.fileWrapper}
             onMouseEnter={() => handleHover(true)}
             onMouseLeave={() => handleHover(false)}>

            {visibleHover ? (
                <div className={styles.fileCover}
                     onClick={() => changeFile(file.name, fileIndex)}>
                    <div className={styles.fileRemove}
                         onClick={(e) => handleRemove(e)}>
                        <DeleteFile/>
                    </div>

                    <ChangePhoto/>
                </div>
            ) : null}

            <FilePreviewBlock file={file}
                              alt={`user's file - ${file.name}`}/>
        </div>
    );
};

export default File;