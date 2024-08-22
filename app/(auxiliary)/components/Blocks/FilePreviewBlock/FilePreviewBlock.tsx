import React, {FC} from 'react';
import {ImageProps} from "next/image";
import Image from "next/image";

interface PropsType {
    file: File;
    alt: string;
    imageProps?: ImageProps;
}

const FilePreviewBlock: FC<PropsType> = (props) => {
    return (
        <Image {...props.imageProps}
               src={URL.createObjectURL(props.file)}
               alt={props.alt}
               fill={true}
               quality={100}
               onLoad={() => URL.revokeObjectURL(URL.createObjectURL(props.file))}
               style={{
                   objectFit: "cover",
                   width: "100%",
                   height: "100%",
                   cursor: "pointer"
               }}
        />
    );
};

export default FilePreviewBlock;