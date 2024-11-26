import FilePreviewBlock from '@/app/(auxiliary)/components/Blocks/FilePreviewBlock/FilePreviewBlock';
import { PhotoAndVideoKeysType } from '@/app/(auxiliary)/types/AppTypes/InputHooksTypes';
import React, { FC, memo } from 'react'

interface PropsType {
    type: PhotoAndVideoKeysType;
    file: File;
}

const PreviewAdaptive: FC<PropsType> = memo(({ type, file }) => {
    return type === "video" ?
        (
            <>
                {Object.keys(file).length === 1 ? (
                    <FilePreviewBlock url={URL.createObjectURL(file)}
                        alt={file.name} />
                ) : (
                    <FilePreviewBlock url={"/default_video.png"}
                        alt={"video_prev"} />
                )}
            </>
        ) : (
            <FilePreviewBlock url={URL.createObjectURL(file)}
                alt={file.name} />
        )
})

export default PreviewAdaptive