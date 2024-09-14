import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Crop, PercentCrop, PixelCrop, ReactCrop} from "react-image-crop";
import Image from "next/image";
import styles from "./Editor.module.scss";
import 'react-image-crop/src/ReactCrop.scss';
import {centerPositionOfAxes, getScaledSizesOfImage, onDownloadCropClick} from "@/app/(auxiliary)/func/editorHandlers";
import {useDebounceEffect} from "@/app/(auxiliary)/hooks/useDebounceEffect";
import {canvasPreview, getRotateDimensions} from "@/app/(auxiliary)/components/Blocks/PhotoEditor/canvasPreview";
import {
    HORIZONTAL,
    PossibleCroppingBoundaryType,
    VERTICAL
} from "@/app/(auxiliary)/types/PhotoEditorTypes/PhotoEditorTypes";


interface PropsType {
    currentPhoto: File; // CustomFileType;
    setCrop: (newCrop: Crop) => void
    crop: Crop;
    scale: number;
    rotate: number;
}

const Editor: FC<PropsType> = ({
                                   currentPhoto,
                                   setCrop,
                                   crop,
                                   scale,
                                   rotate
                               }) => {

    const [imgSrc, setImgSrc] =
        useState<string>(() => URL.createObjectURL(currentPhoto))

    const [imageOrientation, setImageOrientation] =
        useState<"vertical" | "horizontal">(HORIZONTAL)

    const [croppingBoundary, setCroppingBoundary] =
        useState<PossibleCroppingBoundaryType>()

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

    /**
     * Функция для создания crop
     * @param width - оригинальная ширина изображения
     * @param height - оригинальная высота изображения
     * @param widthScaled - уменьшенная ширина изображения под редактор
     * @param heightScaled - уменьшенная высота изображения под редактор
     */
    const updateCropHandler = useCallback((
        width: number,
        height: number,
        widthScaled: number,
        heightScaled: number
    ) => {
        const {x, y} = centerPositionOfAxes(width, height, widthScaled, heightScaled)

        const cropSettings = {
            x: x,
            y: y,
            width: widthScaled,
            height: heightScaled
        }

        setCrop({
            unit: "px",
            ...cropSettings
        })
        setCompletedCrop({
            unit: "px",
            ...cropSettings
        })

        return {x, y}
    }, [setCrop])


    /**
     * Функция, которая срабатывает при отображении изображения в редакторе. Используется для определения оригинальных размеров изображения и его ориентации. Определяет пропорциональное соотношение сторон, чтобы корректно поместить фотографию в редактор
     * @param e
     * @param currentCrop
     */
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>, currentCrop: Crop) => {
        const {
            naturalWidth,
            width,
            naturalHeight,
            height
        } = e.currentTarget

        const {naturalWidthScaled, naturalHeightScaled} = getScaledSizesOfImage(
            naturalWidth,
            naturalHeight,
            width
        )
        const currentOrientation = naturalWidth >= naturalHeight ? HORIZONTAL : VERTICAL
        setImageOrientation(() => currentOrientation)

        if (!currentCrop.x && !currentCrop.y && currentCrop.unit === "%") {
            const {x, y} = updateCropHandler(
                width,
                height,
                naturalWidthScaled,
                naturalHeightScaled
            )

            setCroppingBoundary({
                x, y,
                width: naturalWidthScaled,
                height: naturalHeightScaled,
                orientation: currentOrientation
            })
        } else {
            const {x, y} = centerPositionOfAxes(width, height, naturalWidthScaled, naturalHeightScaled)

            setCroppingBoundary({
                x, y,
                width: naturalWidthScaled,
                height: naturalHeightScaled,
                orientation: currentOrientation
            })
        }
    }

    const changeCropHandler = useCallback((pixelCrop: PixelCrop, _percentCrop: PercentCrop) => {
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
                if (imageOrientation === HORIZONTAL) {
                    setCrop({
                        ...crop,
                        width: pixelCrop.width,
                        x: pixelCrop.x
                    })
                } else {
                    setCrop({
                        ...crop,
                        height: pixelCrop.height,
                        y: pixelCrop.y
                    })
                } // Создание эффекта "скольжения" по границе рамки за счет установки новых значений для каждой оси и сохранения предыдущих
            }
        }
    }, [
        croppingBoundary,
        imageOrientation,
        setCrop,
        crop
    ])

    useEffect(() => {
        setImgSrc(() => URL.createObjectURL(currentPhoto))
    }, [currentPhoto])

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
                }).then((url) => {
                    console.log("Created URl: ", url)
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
                                   onLoad={(e) => onImageLoad(e, crop)}
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