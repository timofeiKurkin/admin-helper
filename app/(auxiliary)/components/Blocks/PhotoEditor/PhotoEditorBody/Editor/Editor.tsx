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
import {log} from "node:util";


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
        const {x, y} = updateCropHandler(width, height, naturalWidthScaled, naturalHeightScaled)
        const currentOrientation = naturalWidth >= naturalHeight ? HORIZONTAL : VERTICAL

        setImageOrientation(() => currentOrientation)
        setCroppingBoundary({
            x, y,
            width: naturalWidthScaled,
            height: naturalHeightScaled,
            orientation: currentOrientation
        })
    }

    const changeCropHandler = (pixelCrop: PixelCrop, _percentCrop: PercentCrop) => {
        if (croppingBoundary) {
            const {
                width,
                height,
                x,
                y,
                orientation // Оригинальная ориентация изображения. В отличие от imageOrientation не изменяется и является ориентиром
            } = croppingBoundary // Оригинальные размеры фото и его положение по осям. За эти значения нельзя выходить
            const {
                width: cropWidth,
                height: cropHeight,
                x: cropX,
                y: cropY
            } = pixelCrop // Текущие значения размера и положения рамки обрезки фото

            const currentOrientation = orientation === HORIZONTAL ? (imageOrientation === HORIZONTAL) : (imageOrientation === VERTICAL)

            const sizeBoundary = currentOrientation ? (
                cropWidth <= width && cropHeight <= height
            ) : (
                cropWidth <= height && cropHeight <= width
            )  // Условие, контролирующее, что размер рамки обрезки не выйдет за пределы оригинала

            const positionBoundaryY = currentOrientation ? (
                cropY >= y && cropY <= (y + height) - cropHeight
            ) : (
                cropY >= x && cropY <= (x + width) - cropHeight
            ) // Условие, контролирующее, что рамка обрезки не выйдет за пределы оси Y

            const positionBoundaryX = currentOrientation ? (
                cropX >= x && cropX <= (x + width) - cropWidth
            ) : (
                cropX >= y && cropX <= (y + height) - cropWidth
            ) // Условие, контролирующее, что рамка обрезки не выйдет за пределы оси X

            const positionBoundary = positionBoundaryX && positionBoundaryY
            const couldChangeCrop = sizeBoundary && positionBoundary // Финальное условие, позволяющее изменить crop

            if (couldChangeCrop) {
                setCrop(pixelCrop)
            } else {
                setCrop((prevState) => imageOrientation === HORIZONTAL ? (
                    {
                        ...prevState,
                        width: pixelCrop.width,
                        x: pixelCrop.x
                    }
                ) : (
                    {
                        ...prevState,
                        height: pixelCrop.height,
                        y: pixelCrop.y
                    }
                )) // Создание эффекта "скольжения" по границе рамки за счет установки новых значений для каждой оси и сохранения предыдущих
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
                previewCanvasRef.current &&
                croppingBoundary
            ) {
                await canvasPreview({
                    image: imgRef.current,
                    canvas: previewCanvasRef.current,
                    crop: completedCrop,
                    scale,
                    rotate,
                    imageOrientation: croppingBoundary.orientation
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