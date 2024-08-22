import React, {FC, useState} from 'react';
import Image from "next/image";
import styles from "./File.module.scss";
import DeleteFile from "@/app/(auxiliary)/components/UI/SVG/DeleteFile/DeleteFile";
import ChangePhoto from "@/app/(auxiliary)/components/UI/SVG/ChangePhoto/ChangePhoto";

interface PropsType {
    file: File;
    removeHandler: (fileName: string) => void;
    openSelectedFile: (fileName: string) => void;
}

const File: FC<PropsType> = ({
                                 file,
                                 removeHandler,
                                 openSelectedFile
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
                     onClick={() => openSelectedFile(file.name)}>
                    <div className={styles.fileRemove}
                         onClick={(e) => handleRemove(e)}>
                        <DeleteFile/>
                    </div>

                    <ChangePhoto/>
                </div>
            ) : null}

            <Image src={URL.createObjectURL(file)}
                   alt={"user-file"}
                   fill={true}
                   quality={100}
                   onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                   style={{objectFit: "cover", width: "100%", height: "100%"}}
            />
        </div>
    );
};

export default File;