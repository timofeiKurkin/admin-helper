import React, {FC, memo} from 'react';
import {ImageProps} from "next/image";
import Image from "next/image";

interface PropsType {
    url: string;
    alt: string;
    imageProps?: ImageProps;
}

const FilePreview: FC<PropsType> = (props) => {
    return (
        <Image {...props.imageProps}
               src={props.url}
               alt={props.alt}
               fill={true}
               quality={100}
               onLoad={() => URL.revokeObjectURL(props.url)}
               style={{
                   objectFit: "cover",
                   width: "100%",
                   height: "100%",
                   cursor: "pointer"
               }}
        />
    );
}

const FilePreviewBlock = memo(FilePreview);

export default FilePreviewBlock;