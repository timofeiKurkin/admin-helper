import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Crop, PixelCrop, ReactCrop } from "react-image-crop";
import Image from "next/image";
import styles from "./Editor.module.scss";
import 'react-image-crop/src/ReactCrop.scss';
import {
    centerPositionOfAxes,
    determineOrientation,
    findElement,
    getScaledSizesOfImage
} from "@/app/(auxiliary)/func/editorHandlers";
import { useDebounceEffect } from "@/app/(auxiliary)/hooks/useDebounceEffect";
import {
    canvasPreview,
    getRotateDimensions
} from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorBody/canvasPreview";
import {
    HORIZONTAL,
    ImageOrientationType,
    PossibleCroppingBoundaryType,
    VERTICAL
} from "@/app/(auxiliary)/types/FormTypes/PopupTypes/PopupTypes";
import { useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { selectUserDevice } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";

type keys = ["desktopAdaptive", "padAdaptive", "padAdaptive640_992"]
const editorAdaptiveSizes = {
    desktopAdaptive: 640,
    padAdaptive: 600,
    padAdaptive640_992: 375
}


interface PropsType {
    photo: File;
    setCrop: (newCrop: Crop, name: string) => void;
    updatePhoto: (newFile: File) => void;
    crop: Crop;
    scale: number;
    rotate: number;
}

const Editor: FC<PropsType> = ({
    photo,
    setCrop,
    updatePhoto,
    crop,
    scale,
    rotate
}) => {
    const userDevice = useAppSelector(selectUserDevice)
    const editorSize = editorAdaptiveSizes[(Object.keys(userDevice) as keys).filter((key) => userDevice[key])[0]]

    const [imgSrc, setImgSrc] =
        useState<string>(URL.createObjectURL(photo))

    const [imageOrientation, setImageOrientation] =
        useState<"vertical" | "horizontal">(HORIZONTAL)

    /**
     * Состояние, хранящее информацию об оригинальном изображении
     */
    const [croppingBoundary, setCroppingBoundary] =
        useState<PossibleCroppingBoundaryType[]>([])
    const thereIsBoundary = useCallback((name: string) => croppingBoundary.find((item) => item.name === name), [croppingBoundary])

    /**
     * Статус для отслеживания изменения. Если происходит какое-либо изменения фото, то статус меняется на true, в обратном случае - на false.
     * Нужно для асинхронной функции canvasPreview, которая после выполнения изменяет preview у всех фото.
     */
    const [isChanging, setIsChanging] = useState<boolean>(false)

    const [completedCrop, setCompletedCrop] =
        useState<PixelCrop>(
            {
                // ...crop,
                unit: "px",
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            }
        )

    const aspect = 0
    const imgRef = useRef<HTMLImageElement>(null)
    const canvas = document.createElement("canvas")

    /**
     * Функция для создания и обновления crop на время редактирования фотографии, а также редактирует финальный crop
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
        const { x, y } = centerPositionOfAxes(width, height, widthScaled, heightScaled)

        const cropSettings = {
            x: x,
            y: y,
            width: widthScaled,
            height: heightScaled
        }

        setCrop({
            unit: "px",
            ...cropSettings
        }, photo.name)
        setCompletedCrop({
            unit: "px",
            ...cropSettings
        })

        return { x, y }
    }, [
        setCrop,
        photo.name
    ])


    /**
     * Функция, которая срабатывает при инициализации изображения в редакторе.
     * Используется для определения оригинальных размеров изображения и его ориентации.
     * Определяет пропорциональное соотношение сторон, чтобы корректно поместить фотографию в редактор
     * @param e
     * @param currentCrop
     * @param photoName
     */
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>, currentCrop: Crop, photoName: string) => {
        const {
            naturalWidth,
            width,
            naturalHeight,
            height
        } = e.currentTarget // Информация об изображении из компонента Image

        /**
         * Измененный размеры в соответствии с масштабом соотношения оригинала и окна редактора
         */
        const { naturalWidthScaled, naturalHeightScaled } = getScaledSizesOfImage(
            naturalWidth,
            naturalHeight,
            width,
            height
        )
        const currentOrientation = determineOrientation(naturalWidth, naturalHeight)
        setImageOrientation(currentOrientation)

        /**
         * Условие, если изображение открывается впервые и не имеет своего crop. Нужно сохранить оригинальный crop и из него создать новый.
         */
        if (!currentCrop.x && !currentCrop.y && currentCrop.unit === "%") {
            const { x, y } = updateCropHandler(
                width,
                height,
                naturalWidthScaled,
                naturalHeightScaled
            ) // Создание и обновление crop и completedCrop

            setCroppingBoundary((prevState) => [...prevState, {
                x, y,
                width: naturalWidthScaled,
                height: naturalHeightScaled,
                orientation: currentOrientation,
                name: photoName
            }])
        } else {
            const { x, y } = centerPositionOfAxes(width, height, naturalWidthScaled, naturalHeightScaled)

            const boundary = thereIsBoundary(photoName)
            setCroppingBoundary((prevState) => {
                if (!boundary) {
                    return [...prevState, {
                        x, y,
                        width: naturalWidthScaled,
                        height: naturalHeightScaled,
                        orientation: currentOrientation,
                        name: photoName
                    }]
                }

                return prevState
            })

            // prevState.map((item) => {
            //                         if (findElement(item, photoName)) {
            //                             return {
            //                                 x, y,
            //                                 width: naturalWidthScaled,
            //                                 height: naturalHeightScaled,
            //                                 orientation: currentOrientation,
            //                                 name: photoName
            //                             }
            //                         }
            //                         return item
            //                     })
        }
    }

    /**
     * Функция для получения ориентации изображения.
     * Во-первых, определяется оригинальная ориентация изображения. Во-вторых, определяется ориентация этого изображения в данный момент. Это необходимо, поскольку оригинальные изображения бывают вертикальные или горизонтальные
     * @param orientation
     */
    const getCurrentOrientation = useCallback((orientation: ImageOrientationType) => {
        return orientation === HORIZONTAL ? (imageOrientation === HORIZONTAL) : (imageOrientation === VERTICAL)
    }, [imageOrientation])

    /**
     * Функция, срабатывающая при изменении crop. Принимает новый crop и устанавливает его в состояние.
     * Т.е. функция на прямую не редактирует фотографию.
     * @param pixelCrop - значения crop в пикселях
     */
    const changeCropHandler = useCallback((pixelCrop: PixelCrop, photoName: string) => {
        const boundary = thereIsBoundary(photoName)
        if (croppingBoundary.length && boundary) {

            /**
             * Оригинальные размеры фото и его положение по осям.
             * За значения осей и размеров фото нельзя выходить
             */
            const {
                width,
                height,
                x,
                y,
                orientation // Оригинальная ориентация изображения. В отличие от состояния imageOrientation не изменяется и является ориентиром
            } = boundary

            const {
                width: cropWidth,
                height: cropHeight,
                x: cropX,
                y: cropY
            } = pixelCrop // Текущие значения размера и положения рамки обрезки фото

            const currentOrientation = getCurrentOrientation(orientation)

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
                setCrop(pixelCrop, photo.name)
            } else {
                /**
                 * Создание эффекта "скольжения" по границе рамки за счет установки новых значений для каждой оси и сохранения предыдущих
                 */
                if (imageOrientation === HORIZONTAL) {
                    setCrop({
                        ...crop,
                        width: pixelCrop.width,
                        x: pixelCrop.x
                    }, photo.name)
                } else {
                    setCrop({
                        ...crop,
                        height: pixelCrop.height,
                        y: pixelCrop.y
                    }, photo.name)
                }
            }
        }
    }, [
        crop,
        croppingBoundary.length,
        getCurrentOrientation,
        imageOrientation,
        photo.name,
        setCrop,
        thereIsBoundary
    ])

    /**
     * Первый эффект для создания url фотографии и отображения ее в редакторе.
     * Второй эффект для удаления ссылки на фотографию
     */
    useEffect(() => {
        setImgSrc(URL.createObjectURL(photo))
    }, [photo])
    useEffect(() => {
        return () => {
            URL.revokeObjectURL(imgSrc)
            setCompletedCrop({
                unit: "px",
                width: 0,
                height: 0,
                x: 0, y: 0
            })
        }
    }, [imgSrc]);

    /**
     * Эффект для обновления crop при повороте изображения.
     */
    useEffect(() => {
        if (imgRef.current && rotate) {
            const {
                naturalWidth, // 0
                naturalHeight, // 0
                width,
                height
            } = imgRef.current // Информация об изображении из компонента Image

            if (naturalWidth && naturalHeight && width && height) {
                const orientation = determineOrientation(naturalWidth, naturalHeight)

                if ((rotate < 90 && rotate > -90) || (rotate === 180 || rotate === -180)) {
                    setImageOrientation(orientation === HORIZONTAL ? HORIZONTAL : VERTICAL)
                } else {
                    setImageOrientation(orientation === VERTICAL ? HORIZONTAL : VERTICAL)
                }

                const {
                    naturalRotatedWidth,
                    naturalRotatedHeight
                } = getRotateDimensions(naturalWidth, naturalHeight, rotate) // 0, 0, num

                const {
                    naturalWidthScaled,
                    naturalHeightScaled
                } = getScaledSizesOfImage(naturalRotatedWidth, naturalRotatedHeight, width, height) // 0, 0, num, num

                updateCropHandler(width, height, naturalWidthScaled, naturalHeightScaled) // num, num, NaN, NaN
            }
        }
    }, [
        rotate,
        updateCropHandler
    ]);

    /**
     * Эффект, когда пользователь поворачивает изображение к 0 градусов. Это значение поворота совпадает с оригинальным, поэтому нужно отслеживать, что этот 0 после поворота, а не первой загрузки изображения.
     */
    useEffect(() => {
        if (!rotate) {
            const boundary = thereIsBoundary(photo.name)
            if (boundary) {
                const {
                    width,
                    height,
                    x, y, orientation
                } = boundary

                const rotateOrientation = orientation === HORIZONTAL ?
                    crop.width <= width && crop.height > height :
                    crop.width > width && crop.height <= height

                /**
                 * Условие, что после поворота изображения на 0 градусов, настройки и превью возвращаются к изначальным значениям.
                 */
                if (rotateOrientation) {
                    const resetCrop: Crop & PixelCrop = {
                        x,
                        y,
                        width,
                        height,
                        unit: "px"
                    }
                    setCompletedCrop(resetCrop)
                    setCrop(resetCrop, photo.name)
                    updatePhoto(photo)
                    setImageOrientation(orientation)
                }
            }
        }

    }, [
        crop.height,
        crop.width,
        photo,
        rotate,
        setCrop,
        thereIsBoundary,
        croppingBoundary,
        updatePhoto
    ]);

    useEffect(() => {
        setIsChanging(true)
    }, [scale]);

    /**
     * Эффект, срабатывающий при изменении crop
     */
    useDebounceEffect({
        fn: async () => {
            const boundary = thereIsBoundary(photo.name)
            if (
                completedCrop.width &&
                completedCrop.height &&
                imgRef.current &&
                boundary
            ) {
                const { orientation } = boundary
                await canvasPreview({
                    image: imgRef.current,
                    canvas: canvas,
                    crop: completedCrop,
                    scale,
                    rotate,
                    imageOrientation: orientation
                }).then((file) => {
                    if (file && isChanging) {
                        setIsChanging(false)
                        updatePhoto(file)
                    }
                })
            }
        },
        waitTime: 200,
        deps: [
            completedCrop,
            scale,
            rotate,
            isChanging
        ]
    })

    useEffect(() => {
        const boundary = thereIsBoundary(photo.name)
        if (boundary) {
            const {
                width,
                height,
                x, y, orientation
            } = boundary

            setIsChanging(() => {
                return x !== crop.x ||
                    y !== crop.y ||
                    width !== crop.width ||
                    height !== crop.height ||
                    orientation !== imageOrientation;
            })
        }
    }, [
        crop.height,
        crop.width,
        crop.x,
        crop.y,
        imageOrientation,
        photo.name,
        thereIsBoundary
    ]);

    return (
        <div className={styles.editorBody}>
            <div className={styles.editorBackground}>
                <div className={styles.editorWrapper}>
                    {imgSrc && (
                        <ReactCrop crop={crop}
                            onChange={(e) => changeCropHandler(e, photo.name)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                            className={styles.reactCrop}
                            maxWidth={editorSize}
                            minWidth={100}
                            maxHeight={editorSize}
                            minHeight={100}
                        >
                            <Image ref={imgRef}
                                width={editorSize}
                                height={editorSize}
                                src={imgSrc}
                                style={{
                                    transform: `scale(${scale}) rotate(${rotate}deg)`,
                                    objectFit: "contain"
                                }}
                                onLoad={(e) => onImageLoad(e, crop, photo.name)}
                                alt={photo.name}
                            />
                        </ReactCrop>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Editor;