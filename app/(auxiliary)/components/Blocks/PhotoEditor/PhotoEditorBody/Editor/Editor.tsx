import React, {FC, useEffect, useRef, useState} from 'react';
import {centerCrop, Crop, makeAspectCrop, PixelCrop, ReactCrop} from "react-image-crop";
import {useDebounceEffect} from "@/app/(auxiliary)/hooks/useDebounceEffect";
import {canvasPreview} from "@/app/(auxiliary)/components/Blocks/PhotoEditor/canvasPreview";
import Image from "next/image";
import styles from "./Editor.module.scss";
import 'react-image-crop/src/ReactCrop.scss';
import {centerAspectCrop} from "@/app/(auxiliary)/func/editorHandlers";
import {log} from "node:util";


interface PropsType {
    currentPhoto: File;
    scale: number;
    rotate: number;
}

const Editor: FC<PropsType> = ({
                                   currentPhoto,
                                   scale,
                                   rotate
                               }) => {
    console.log("currentPhoto: ", currentPhoto)

    const [imgSrc, setImgSrc] =
        useState<string>(() => URL.createObjectURL(currentPhoto))
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] =
        useState<PixelCrop>({
            unit: "px",
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        })
    const [aspect, setAspect] = useState<number>(0)

    const imgRef = useRef<HTMLImageElement>(null)
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
    const blobUrlRef = useRef('')

    useEffect(() => {
        setImgSrc(() => URL.createObjectURL(currentPhoto))
    }, [currentPhoto])

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (aspect) {
            const {width, height} = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    // useDebounceEffect({
    //     fn: async () => {
    //         if (
    //             completedCrop.width &&
    //             completedCrop.height &&
    //             imgRef.current &&
    //             previewCanvasRef.current
    //         ) {
    //             // We use canvasPreview as it's much faster than imgPreview.
    //             await canvasPreview({
    //                 image: imgRef.current,
    //                 canvas: previewCanvasRef.current,
    //                 crop: completedCrop,
    //                 scale,
    //                 rotate
    //             })
    //         }
    //     },
    //     waitTime: 100,
    //     deps: [completedCrop, scale, rotate]
    // })

    return (
        <div className={styles.editorBody}>
            <div className={styles.editorBackground}>
                <div className={styles.editorWrapper}>
                    {imgSrc && (
                        <ReactCrop crop={crop}
                                   onChange={(_, percentageCrop) => setCrop(percentageCrop)}
                                   onComplete={(c) => setCompletedCrop(c)}
                                   aspect={aspect}
                                   minWidth={100}
                                   className={styles.reactCrop}
                            // style={{transform: `scale(${scale}) rotate(${rotate}deg)`}}
                                   minHeight={100}
                        >
                            <Image ref={imgRef}
                                   width={640}
                                   height={360}
                                   src={imgSrc}
                                   style={{transform: `scale(${scale}) rotate(${rotate}deg)`}}
                                   onLoad={onImageLoad}
                                   alt={"image for crop"}
                            />
                        </ReactCrop>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Editor;