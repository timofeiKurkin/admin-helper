import React, {FC, useEffect, useRef, useState} from 'react';
import {Crop, PixelCrop, ReactCrop} from "react-image-crop";
import Image from "next/image";
import styles from "./Editor.module.scss";
import 'react-image-crop/src/ReactCrop.scss';
import {centerAspectCrop, onDownloadCropClick} from "@/app/(auxiliary)/func/editorHandlers";
import {useAppDispatch} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {useDebounceEffect} from "@/app/(auxiliary)/hooks/useDebounceEffect";
import {canvasPreview} from "@/app/(auxiliary)/components/Blocks/PhotoEditor/canvasPreview";
import {changePhotoSettings} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PhotoEditorSlice/PhotoEditorSlice";


interface PropsType {
    currentPhoto: File; // CustomFileType;
    scale: number;
    rotate: number;
}

const Editor: FC<PropsType> = ({
                                   currentPhoto,
                                   scale,
                                   rotate
                               }) => {
    const dispatch = useAppDispatch()

    const [imgSrc, setImgSrc] =
        useState<string>(() => URL.createObjectURL(currentPhoto))
    const [crop, setCrop] = useState<Crop>({
        unit: "%",
        x: 0,
        y: 0,
        width: 100,
        height: 100
    })
    const [completedCrop, setCompletedCrop] =
        useState<PixelCrop>({
            unit: "px",
            x: 0,
            y: 0,
            width: 640,
            height: 640,
        })
    // const [aspect, setAspect] = useState<number>(0)
    const aspect = 0

    console.log("crop: ", crop)
    console.log("completedCrop: ", completedCrop)
    console.log("")

    const imgRef = useRef<HTMLImageElement>(null)
    const blobUrlRef = useRef('')
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        setImgSrc(() => URL.createObjectURL(currentPhoto))
    }, [currentPhoto])

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (aspect) {
            const {width, height} = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    // useEffect(() => {
    //     if (crop) {
    //         dispatch(changePhotoSettings({
    //             imgRef,
    //             fileName: currentPhoto.name,
    //             crop,
    //             scale,
    //             aspect,
    //             rotate,
    //             completedCrop,
    //             previewCanvasRef,
    //             hiddenAnchorRef
    //         }))
    //     }
    // }, [
    //     aspect,
    //     completedCrop,
    //     crop,
    //     currentPhoto.name,
    //     dispatch,
    //     rotate,
    //     scale
    // ]);

    useDebounceEffect({
        fn: async () => {
            if (
                completedCrop.width &&
                completedCrop.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                await canvasPreview({
                    image: imgRef.current,
                    canvas: previewCanvasRef.current,
                    crop: completedCrop,
                    scale,
                    rotate
                })
            }
        },
        waitTime: 100,
        deps: [completedCrop, scale, rotate]
    })

    return (
        <div className={styles.editorBody}>
            <div className={styles.editorBackground}>
                <div className={styles.editorWrapper}>
                    {imgSrc && (
                        <ReactCrop crop={crop}
                                   onChange={(_, percentageCrop) => setCrop(percentageCrop)}
                                   onComplete={(c) => setCompletedCrop(c)}
                                   aspect={aspect}
                                   className={styles.reactCrop}
                                   maxWidth={640}
                                   minWidth={100}
                                   maxHeight={640}
                                   minHeight={100}
                        >
                            <Image ref={imgRef}
                                   width={640}
                                   height={640}
                                   src={imgSrc}
                                   style={{
                                       transform: `scale(${scale}) rotate(${rotate}deg)`,
                                       objectFit: "contain"
                                   }}
                                   onLoad={onImageLoad}
                                   alt={"image for crop"}
                            />
                        </ReactCrop>
                    )}

                    <div style={{
                        position: "absolute",
                        top: 100,
                        zIndex: 5,
                    }}>
                        <a onClick={() => onDownloadCropClick({
                            imgRef: imgRef,
                            previewCanvasRef: previewCanvasRef,
                            completedCrop: completedCrop,
                            blobUrlRef,
                            hiddenAnchorRef: hiddenAnchorRef
                        })}>
                            download
                        </a>
                    </div>

                    <div style={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        visibility: "visible",
                        zIndex: 99
                    }}>
                        <canvas ref={previewCanvasRef}
                                style={{
                                    objectFit: 'contain',
                                    width: completedCrop.width,
                                    height: completedCrop.height
                                }}/>
                        <a ref={hiddenAnchorRef}
                           download
                           href={"#hidden"}></a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;