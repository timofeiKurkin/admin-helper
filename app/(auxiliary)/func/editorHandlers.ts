import React, {MutableRefObject, RefObject} from "react";
import {centerCrop, convertToPixelCrop, makeAspectCrop, PixelCrop} from "react-image-crop";
import {getRotateDimensions} from "@/app/(auxiliary)/components/Blocks/PhotoEditor/canvasPreview";

interface OnDownloadCropClickArgs {
    imgRef: RefObject<HTMLImageElement>;
    previewCanvasRef: RefObject<HTMLCanvasElement>;
    completedCrop: PixelCrop;
    blobUrlRef: MutableRefObject<string>;
    hiddenAnchorRef: RefObject<HTMLAnchorElement>;
    rotate: number;
}


export const getScaledSizesOfImage = (
    naturalWidth: number,
    naturalHeight: number,
    imgSize: number
) => {
    const squareSize = Math.max(naturalWidth, naturalHeight) // Взять максимальную ширину или высоту для создания холста в виде квадрата
    const scaleX = imgSize / squareSize // Коэффициент масштабирования по оси X для приведения изображения к оригинальным размерам.
    const naturalWidthScaled = Math.floor(naturalWidth * scaleX)
    const naturalHeightScaled = Math.floor(naturalHeight * scaleX)

    return {
        naturalWidthScaled, naturalHeightScaled
    }
}


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

export const stickToClosestValue = (value: number, stickPoints: number[], stickStep: number) => {
    // const stickPoints = [-180, -90, 0, 90, 180]
    // const stickStep = 7

    const closestStickPoint = stickPoints.reduce((prev, current) =>
        Math.abs(current - value) < Math.abs((prev - value)) ? current : prev
    )

    if (Math.abs(value - closestStickPoint) <= stickStep) {
        return closestStickPoint
    }

    return value
}
