import React, {FC} from 'react';
import Image from "next/image";
import styles from "./File.module.scss";

interface PropsType {
    file: File;
    removeHandler: (fileName: string) => void;
}

const File: FC<PropsType> = ({
                                 file,
                                 removeHandler
                             }) => {

    return (
        <div className={styles.fileWrapper}>

            <div className={styles.fileRemove}
                 onClick={() => removeHandler(file.name)}>rm</div>

            <Image src={URL.createObjectURL(file)}
                   alt={"user-file"}
                   width={80}
                   height={70}
                   quality={100}
                   onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                   style={{objectFit: "cover"}}
            />
        </div>
    );
};

export default File;