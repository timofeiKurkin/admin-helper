import React, {MutableRefObject, RefObject} from "react";
import {centerCrop, convertToPixelCrop, makeAspectCrop, PixelCrop} from "react-image-crop";
import {getRotateDimensions} from "@/app/(auxiliary)/components/Blocks/PhotoEditor/canvasPreview";
import {defaultPhotoSettings, PhotoEditorSettingsType} from "@/app/(auxiliary)/types/PhotoEditorTypes/PhotoEditorTypes";


export const scalePoints = [0.5, 1, 2, 2.5]
export const rotatePoints = [-180, -90, 0, 90, 180]

/**
 * Функция для сохранения соотношения пропорций у фотографий в редакторе. Т.к. размер фотографий разный, а размер редактора одинаковый, нужно учесть соотношение сторон. Т.е. пропорционально уменьшить или увеличить изображение, чтобы оно влезло в редактор
 * @param naturalWidth
 * @param naturalHeight
 * @param imgSize
 */
export const getScaledSizesOfImage = (
    naturalWidth: number,
    naturalHeight: number,
    imgSize: number
) => {
    /**
     * Взять максимальную ширину или высоту для создания холста в виде квадрата
     */
    const squareSize = Math.max(naturalWidth, naturalHeight)

    /**
     * Т.к. изображение рисуется на квадрате, нужно узнать только одно значение коэффициента пропорции оригинального квадрата (squareSize*squareSize) и квадрата в редакторе (640*640 на экране 1920px)
     *
     */
    const scale = imgSize / squareSize

    /**
     * Вычисление ширины и высоты изображения после его изменения пропорционально оригинальным размерам и размеру холста в редакторе
     */
    const naturalWidthScaled = Math.floor(naturalWidth * scale)
    const naturalHeightScaled = Math.floor(naturalHeight * scale)

    return {
        naturalWidthScaled, naturalHeightScaled
    }
}


/**
 * Функция, которая определяет координаты X и Y, для позиционирования рамки обрезки crop, соответственно размерам и положению изображения на холсте
 * @param width
 * @param height
 * @param widthScaled
 * @param heightScaled
 */
export const centerPositionOfAxes = (
    width: number,
    height: number,
    widthScaled: number,
    heightScaled: number
) => {
    /**
     * Координаты для позиционирования crop по оси Y. Позиционирование так, чтобы crop помещал в себя всю ширину изображения на холсте
     */
    const centerImageY = height !== heightScaled ? (height / 2 - heightScaled / 2) : 0

    /**
     * Координаты для позиционирования crop по оси X. Позиционирование так, чтобы crop помещал в себя всю длину изображения на холсте
     */
    const centerImageX = width !== widthScaled ? (width / 2 - widthScaled / 2) : 0

    return {
        x: centerImageX, y: centerImageY
    }
}


interface OnDownloadCropClickArgs {
    imgRef: RefObject<HTMLImageElement>;
    previewCanvasRef: RefObject<HTMLCanvasElement>;
    completedCrop: PixelCrop;
    blobUrlRef: MutableRefObject<string>;
    hiddenAnchorRef: RefObject<HTMLAnchorElement>;
    rotate: number;
}

/**
 * Проверочная функция для загрузки фотографии после редактирования
 * @param imgRef
 * @param previewCanvasRef
 * @param completedCrop
 * @param blobUrlRef
 * @param hiddenAnchorRef
 * @param rotate
 */
export const onDownloadCropClick = async ({
                                              imgRef,
                                              previewCanvasRef,
                                              completedCrop,
                                              blobUrlRef,
                                              hiddenAnchorRef,
                                              rotate
                                          }: OnDownloadCropClickArgs) => {
    const image = imgRef.current
    const previewCanvas = previewCanvasRef.current

    if (!image || !previewCanvas || !completedCrop) {
        throw new Error('Crop canvas does not exist')
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY

    const {naturalRotatedWidth, naturalRotatedHeight} =
        getRotateDimensions(image.naturalWidth, image.naturalHeight, rotate)

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const offscreen = new OffscreenCanvas(
        completedCrop.width,
        completedCrop.height,
    )
    const ctx = offscreen.getContext('2d')
    if (!ctx) {
        throw new Error('No 2d context')
    }

    ctx.drawImage(
        previewCanvas,
        0,
        0,
        previewCanvas.width,
        previewCanvas.height,
        0,
        0,
        offscreen.width,
        offscreen.height,
    )


    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
        type: 'image/jpeg',
        quality: 1
    })

    if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
    }
    blobUrlRef.current = URL.createObjectURL(blob)

    if (hiddenAnchorRef.current) {
        hiddenAnchorRef.current.href = blobUrlRef.current
        hiddenAnchorRef.current.click()
    }
}

const onSelectFile = ({
                          e,
                          setCrop,
                          setImgSrc
                      }: {
    e: React.ChangeEvent<HTMLInputElement>;
    setCrop: (value: number | undefined) => void
    setImgSrc: (value: string) => void
}) => {
    if (e.target.files && e.target.files.length > 0) {
        setCrop(undefined) // Makes crop preview update between images.
        const reader = new FileReader()
        reader.addEventListener('load', () =>
            setImgSrc(reader.result?.toString() || ''),
        )
        reader.readAsDataURL(e.target.files[0])
    }
}


/**
 * Не используется. Функция для включения и отключения аспекта.
 * Аспект - значение, обозначающее соотношение сторон фотографии. Он сохраняет соотношение сторон и, соответственно, не дает в редакторе изменить размеры crop
 * @param aspect
 * @param setAspect
 * @param imgRef
 * @param setCrop
 * @param setCompletedCrop
 */
function handleToggleAspectClick({
                                     aspect,
                                     setAspect,
                                     imgRef,
                                     setCrop,
                                     setCompletedCrop
                                 }: {
    aspect: any;
    setAspect: any;
    imgRef: any;
    setCrop: any;
    setCompletedCrop: any;
}) {
    if (aspect) {
        setAspect(undefined)
    } else {
        setAspect(16 / 9)

        if (imgRef.current) {
            const {width, height} = imgRef.current
            const newCrop = centerAspectCrop(width, height, 16 / 9)
            setCrop(newCrop)
            // Updates the preview
            setCompletedCrop(convertToPixelCrop(newCrop, width, height))
        }
    }
}


/**
 * Не используется. Функция для позиционирования аспекта по центру
 * @param mediaWidth
 * @param mediaHeight
 * @param aspect
 */
export const centerAspectCrop = (
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
) => {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 100,
                height: 100
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight
    )
}

/**
 * Функция для input с типом "range". Создает эффект "прилипания" к обозначенным значениям.
 * @param value - актуальное значение
 * @param stickPoints - список значений, к которым ползунок "прилипает"
 * @param stickStep - шаг, обозначающий сколько должно быть до значения из stickPoints, чтобы ползунок "прилип".
 */
export const stickToClosestValue = (value: number, stickPoints: number[], stickStep: number) => {
    const closestStickPoint = stickPoints.reduce((prev, current) =>
        Math.abs(current - value) < Math.abs((prev - value)) ? current : prev
    )

    if (Math.abs(value - closestStickPoint) <= stickStep) {
        return closestStickPoint
    }

    return value
}


export const getDefaultPhotoSettings = (fileName: string): PhotoEditorSettingsType => {
    return {...defaultPhotoSettings, name: fileName}
}

export const findFile = <T extends { name: string }>(file: T, fileName: string) => {
    return file.name === fileName
}
