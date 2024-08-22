import React, {FC, useContext, useRef, useState} from 'react';
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import {centerCrop, Crop, makeAspectCrop, PixelCrop} from "react-image-crop";
import {useDebounceEffect} from "@/app/(auxiliary)/hooks/useDebounceEffect";
import {canvasPreview} from "@/app/(auxiliary)/components/Blocks/PhotoEditor/canvasPreview";
import {EditorType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorType";

const centerAspectCrop = (
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


interface PropsType {
    content: EditorType;
}

const Editor: FC<PropsType> = ({content}) => {
    const {appState} = useContext(AppContext)

    const [imgSrc, setImgSrc] = useState<string>(() => {
        if (appState.userFormData?.file_data && appState.userFormData?.file_data["photo"]) {
            return URL.createObjectURL(appState.userFormData?.file_data["photo"].files[0])
        }
        return ""
    })
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] =
        useState<PixelCrop>({
            unit: "px",
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        })
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState<number>(16 / 9)

    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
    const blobUrlRef = useRef('')

    // const [imageForEditor, setImageForEditor] = useState<File>(() => {
    //     if (appState.userFormData?.file_data && appState.userFormData?.file_data["photo"]) {
    //         return appState.userFormData?.file_data["photo"].files[0]
    //     }
    //
    //     return {} as File
    // })

    // const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files.length > 0) {
    //         setCrop(undefined) // Makes crop preview update between images.
    //         const reader = new FileReader()
    //         reader.addEventListener('load', () =>
    //             setImgSrc(reader.result?.toString() || ''),
    //         )
    //         reader.readAsDataURL(e.target.files[0])
    //     }
    // }

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (aspect) {
            const {width, height} = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    const onDownloadCropClick = async () => {
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

    // function handleToggleAspectClick() {
    //     if (aspect) {
    //         setAspect(undefined)
    //     } else {
    //         setAspect(16 / 9)
    //
    //         if (imgRef.current) {
    //             const {width, height} = imgRef.current
    //             const newCrop = centerAspectCrop(width, height, 16 / 9)
    //             setCrop(newCrop)
    //             // Updates the preview
    //             setCompletedCrop(convertToPixelCrop(newCrop, width, height))
    //         }
    //     }
    // }

    return (
        <div>
            {/*{imgSrc && (*/}
            {/*    <ReactCrop crop={crop}*/}
            {/*               onChange={(_, percentageCrop) => {*/}
            {/*                   setCrop(percentageCrop)*/}
            {/*               }}*/}
            {/*               onComplete={(c) => setCompletedCrop(c)}*/}
            {/*               aspect={aspect}*/}
            {/*               minHeight={100}*/}
            {/*    >*/}
            {/*        <Image ref={imgRef}*/}
            {/*               width={1200}*/}
            {/*               height={600}*/}
            {/*               style={{transform: `scale(${scale}) rotate(${rotate}deg)`}} src={imgSrc}*/}
            {/*               onLoad={onImageLoad}*/}
            {/*               alt={"image for crop"}/>*/}
            {/*    </ReactCrop>*/}
            {/*)}*/}

            {/*{completedCrop && (*/}
            {/*    <div>*/}
            {/*        <canvas ref={previewCanvasRef} style={{*/}
            {/*            width: completedCrop.width,*/}
            {/*            height: completedCrop.height*/}
            {/*        }}/>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};

export default Editor;