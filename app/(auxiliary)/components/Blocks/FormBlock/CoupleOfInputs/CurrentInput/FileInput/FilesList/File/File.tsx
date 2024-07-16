import React, {FC} from 'react';
import Image from "next/image";
import styles from "./File.module.scss";

interface PropsType {
    file: File;
}

const File: FC<PropsType> = ({file}) => {

    return (
        <div className={styles.fileWrapper}>
            <Image src={file.preview}
                   alt={"user-file"}
                   width={80}
                   height={70}
                   quality={100}
                   onLoad={() => URL.revokeObjectURL(file.preview)}
                   style={{objectFit: "contain"}}
            />
        </div>
    );
};

export default File;