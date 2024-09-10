import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Crop, PercentCrop, PixelCrop, ReactCrop} from "react-image-crop";
import Image from "next/image";
import styles from "./Editor.module.scss";
import 'react-image-crop/src/ReactCrop.scss';
import {getScaledSizesOfImage, onDownloadCropClick} from "@/app/(auxiliary)/func/editorHandlers";
import {useAppDispatch} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {useDebounceEffect} from "@/app/(auxiliary)/hooks/useDebounceEffect";
import {canvasPreview, getRotateDimensions} from "@/app/(auxiliary)/components/Blocks/PhotoEditor/canvasPreview";
import {
    HORIZONTAL,
    PossibleCroppingBoundaryType,
    VERTICAL
} from "@/app/(auxiliary)/types/PhotoEditorTypes/PhotoEditorTypes";


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
    const [imageOrientation, setImageOrientation] = useState<"vertical" | "horizontal">(HORIZONTAL)

    const [croppingBoundary, setCroppingBoundary] = useState<PossibleCroppingBoundaryType>()

    const [crop, setCrop] = useState<Crop>(() => {
        return {
            unit: "%",
            x: 0,
            y: 0,
            width: 100,
            height: 100
        }
    })
    const [completedCrop, setCompletedCrop] =
        useState<PixelCrop>({
            unit: "px",
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        })
    const aspect = 0

    const imgRef = useRef<HTMLImageElement>(null)
    const blobUrlRef = useRef('')
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        setImgSrc(() => URL.createObjectURL(currentPhoto))
    }, [currentPhoto])

    const updateCropHandler = useCallback((
        width: number,
        height: number,
        widthScaled: number,
        heightScaled: number
    ) => {
        const centerImageY = height !== heightScaled ? (height / 2 - heightScaled / 2) : 0
        const centerImageX = width !== widthScaled ? (width / 2 - widthScaled / 2) : 0

        setCrop({
            unit: "px",
            x: centerImageX,
            y: centerImageY,
            width: widthScaled,
            height: heightScaled
        })
        setCompletedCrop({
            unit: "px",
            x: centerImageX,
            y: centerImageY,
            width: widthScaled,
            height: heightScaled
        })

        return {x: centerImageX, y: centerImageY}
    }, [])

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const {
            naturalWidth,
            width,
            naturalHeight,
            height
        } = e.currentTarget

        const {naturalWidthScaled, naturalHeightScaled} = getScaledSizesOfImage(naturalWidth, naturalHeight, width)

        const currentOrientation = naturalWidth >= naturalHeight ? HORIZONTAL : VERTICAL
        setImageOrientation(() => currentOrientation)
        const {x, y} = updateCropHandler(width, height, naturalWidthScaled, naturalHeightScaled)
        setCroppingBoundary({
            x, y,
            width: naturalWidthScaled,
            height: naturalHeightScaled,
            orientation: currentOrientation
        })
    }

    const changeCropHandler = (pixelCrop: PixelCrop, percentCrop: PercentCrop) => {
        if (croppingBoundary) {
            const sizeBoundary = pixelCrop.width <= croppingBoundary.width &&
                pixelCrop.height <= croppingBoundary.height

            const positionBoundaryY = croppingBoundary.orientation === HORIZONTAL ? (
                pixelCrop.y >= croppingBoundary.y && pixelCrop.y <= (croppingBoundary.y + croppingBoundary.height) - pixelCrop.height
            ) : (
                pixelCrop.x >= croppingBoundary.x && pixelCrop.x <= (croppingBoundary.x + croppingBoundary.width) - pixelCrop.width
            )
            const positionBoundaryX = croppingBoundary.orientation === HORIZONTAL ? (
                pixelCrop.x >= croppingBoundary.x && pixelCrop.x <= (croppingBoundary.x + croppingBoundary.width) - pixelCrop.width
            ) : (
                pixelCrop.y >= croppingBoundary.y && pixelCrop.y <= (croppingBoundary.y + croppingBoundary.height) - pixelCrop.height
            )
            const positionBoundary = positionBoundaryX && positionBoundaryY

            if (sizeBoundary && positionBoundary) {
                setCrop(pixelCrop)
            } else {
                setCrop({
                    ...crop,
                    x: pixelCrop.x
                })
            }
        }
    }

    useEffect(() => {
        if (imgRef.current && croppingBoundary) {
            const {naturalWidth, width, naturalHeight, height} = imgRef.current

            if (naturalWidth && naturalHeight && width && height) {
                const {
                    naturalRotatedWidth,
                    naturalRotatedHeight
                } = getRotateDimensions(naturalWidth, naturalHeight, rotate)

                const {
                    naturalWidthScaled,
                    naturalHeightScaled
                } = getScaledSizesOfImage(naturalRotatedWidth, naturalRotatedHeight, width)

                setImageOrientation(() => {
                    if ((rotate < 90 && rotate > -90) || (rotate === 180 || rotate === -180)) {
                        return croppingBoundary.orientation === HORIZONTAL ? HORIZONTAL : VERTICAL
                    }
                    return croppingBoundary.orientation === VERTICAL ? HORIZONTAL : VERTICAL
                })

                updateCropHandler(width, height, naturalWidthScaled, naturalHeightScaled)
            }

        }
    }, [
        rotate,
        imgRef,
        updateCropHandler,
        croppingBoundary
    ]);

    // useEffect(() => {}, []);

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
                    rotate,
                    imageOrientation
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
                                   onChange={changeCropHandler}
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
                            imgRef,
                            previewCanvasRef,
                            completedCrop,
                            blobUrlRef,
                            hiddenAnchorRef,
                            rotate
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