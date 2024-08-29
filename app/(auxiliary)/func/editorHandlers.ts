import React, {MutableRefObject, RefObject} from "react";
import {centerCrop, convertToPixelCrop, makeAspectCrop, PixelCrop} from "react-image-crop";

interface OnDownloadCropClickArgs {
    imgRef: RefObject<HTMLImageElement>;
    previewCanvasRef: RefObject<HTMLCanvasElement>;
    completedCrop: PixelCrop;
    blobUrlRef: MutableRefObject<string>;
    hiddenAnchorRef: RefObject<HTMLAnchorElement>;
}

export const onDownloadCropClick = async ({
                                              imgRef,
                                              previewCanvasRef,
                                              completedCrop,
                                              blobUrlRef,
                                              hiddenAnchorRef
                                          }: OnDownloadCropClickArgs) => {
    const image = imgRef.current
    const previewCanvas = previewCanvasRef.current


    if (!image || !previewCanvas || !completedCrop) {
        throw new Error('Crop canvas does not exist')
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const offscreen = new OffscreenCanvas(
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
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
        type: 'image/png',
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
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight
    )
}
