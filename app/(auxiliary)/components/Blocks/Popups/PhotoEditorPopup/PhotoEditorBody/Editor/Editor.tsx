import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Crop, PixelCrop, ReactCrop} from "react-image-crop";
import Image from "next/image";
import styles from "./Editor.module.scss";
import 'react-image-crop/src/ReactCrop.scss';
import {centerPositionOfAxes, determineOrientation, getScaledSizesOfImage} from "@/app/(auxiliary)/func/editorHandlers";
import {useDebounceEffect} from "@/app/(auxiliary)/hooks/useDebounceEffect";
import {
    canvasPreview,
    getRotateDimensions
} from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorBody/canvasPreview";
import {HORIZONTAL, PossibleCroppingBoundaryType, VERTICAL} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {selectUserDevice} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";

type keys = ["desktopAdaptive", "padAdaptive", "padAdaptive640_992"]
const editorAdaptiveSizes = {
    desktopAdaptive: 640,
    padAdaptive: 600,
    padAdaptive640_992: 375
}


interface PropsType {
    photo: File;
    setCrop: (newCrop: Crop) => void;
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
        useState<PossibleCroppingBoundaryType>()

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
    // const previewCanvasRef = useRef<HTMLCanvasElement>(null)
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
     * Функция, которая срабатывает при инициализации изображения в редакторе.
     * Используется для определения оригинальных размеров изображения и его ориентации.
     * Определяет пропорциональное соотношение сторон, чтобы корректно поместить фотографию в редактор
     * @param e
     * @param currentCrop
     */
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>, currentCrop: Crop) => {
        setIsChanging(true)

        const {
            naturalWidth,
            width,
            naturalHeight,
            height
        } = e.currentTarget // Информация об изображении из компонента Image

        /**
         * Измененный размеры в соответствии с масштабом соотношения оригинала и окна редактора
         */
        const {naturalWidthScaled, naturalHeightScaled} = getScaledSizesOfImage(
            naturalWidth,
            naturalHeight,
            width,
            height
        )
        const currentOrientation = determineOrientation(naturalWidth, naturalHeight)
        setImageOrientation(currentOrientation)

        /**
         * Условие, если изображение открывается впервые и не имеет своего crop.
         */
        if (!currentCrop.x && !currentCrop.y && currentCrop.unit === "%") {
            const {x, y} = updateCropHandler(
                width,
                height,
                naturalWidthScaled,
                naturalHeightScaled
            ) // Создание и обновление crop и completedCrop

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

    /**
     * Функция, срабатывающая при изменении crop. Принимает новый crop и устанавливает его в состояние.
     * Т.е. функция на прямую не редактирует фотографию.
     * @param pixelCrop - значения crop в пикселях
     */
    const changeCropHandler = useCallback((pixelCrop: PixelCrop) => {
        if (croppingBoundary) {
            setIsChanging(true)

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
            } = croppingBoundary

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
            setCroppingBoundary(undefined)
        }
    }, [imgSrc]);

    /**
     * Эффект для обновления crop при повороте изображения.
     */
    useEffect(() => {
        if (imgRef.current) {
            const {
                naturalWidth,
                naturalHeight,
                width,
                height
            } = imgRef.current // Информация об изображении из компонента Image

            if (rotate && naturalWidth && naturalHeight && width && height) {
                setIsChanging(true) // Изменение статуса редактирования

                const orientation = determineOrientation(naturalWidth, naturalHeight)
                if ((rotate < 90 && rotate > -90) || (rotate === 180 || rotate === -180)) {
                    setImageOrientation(orientation === HORIZONTAL ? HORIZONTAL : VERTICAL)
                } else {
                    setImageOrientation(orientation === VERTICAL ? HORIZONTAL : VERTICAL)
                }

                const {
                    naturalRotatedWidth,
                    naturalRotatedHeight
                } = getRotateDimensions(naturalWidth, naturalHeight, rotate)

                const {
                    naturalWidthScaled,
                    naturalHeightScaled
                } = getScaledSizesOfImage(naturalRotatedWidth, naturalRotatedHeight, width, height)

                updateCropHandler(width, height, naturalWidthScaled, naturalHeightScaled)
            }
        }
    }, [
        rotate,
        updateCropHandler,
    ]);

    useEffect(() => {
        setIsChanging(true)
    }, [scale]);

    /**
     * Эффект, срабатывающий при изменении crop
     */
    useDebounceEffect({
        fn: async () => {
            if (
                completedCrop.width &&
                completedCrop.height &&
                imgRef.current &&
                croppingBoundary
            ) {
                await canvasPreview({
                    image: imgRef.current,
                    canvas: canvas,
                    crop: completedCrop,
                    scale,
                    rotate,
                    imageOrientation: croppingBoundary.orientation
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
                                   onLoad={(e) => onImageLoad(e, crop)}
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