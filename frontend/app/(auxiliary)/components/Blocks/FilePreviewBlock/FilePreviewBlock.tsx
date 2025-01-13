import React, { FC } from 'react';
import Image, { ImageProps } from "next/image";

interface PropsType {
    url: string;
    alt: string;
    imageProps?: ImageProps;
}

const FilePreviewBlock: FC<PropsType> = (props) => {
    return (
        <Image {...props.imageProps}
            src={props.url}
            alt={props.alt}
            fill={true}
            quality={100}
            onLoad={() => URL.revokeObjectURL(props.url)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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