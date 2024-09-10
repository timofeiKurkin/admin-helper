import {PixelCrop} from 'react-image-crop'
import {h} from "../../../../../../it-nk-service-backend/venv/Lib/site-packages/torch/utils/model_dump/preact.mjs";
import {ImageOrientationType} from "@/app/(auxiliary)/types/PhotoEditorTypes/PhotoEditorTypes";

const TO_RADIANS = Math.PI / 180

interface CanvasPreviewProps {
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
    scale: number,
    rotate: number,
    imageOrientation: ImageOrientationType;
}

export const getRotateDimensions = (
    naturalWidth: number,
    naturalHeight: number,
    rotateAngle: number
) => {
    const radians = (rotateAngle * Math.PI) / 180;

    // Вычисляем косинус и синус угла
    const cosAngle = Math.cos(radians);
    const sinAngle = Math.sin(radians);

    // Вычисляем новые размеры изображения
    const newWidth = Math.abs(naturalWidth * cosAngle) + Math.abs(naturalHeight * sinAngle);
    const newHeight = Math.abs(naturalWidth * sinAngle) + Math.abs(naturalHeight * cosAngle);

    return {
        naturalRotatedWidth: Math.round(newWidth),
        naturalRotatedHeight: Math.round(newHeight)
    };
}


export const canvasPreview = async ({
                                        image,
                                        canvas,
                                        crop,
                                        scale = 1,
                                        rotate = 0,
                                        imageOrientation
                                    }: CanvasPreviewProps) => {
    const ctx = canvas.getContext('2d') // Получаем 2Д контекст для рисования на холсте

    if (!ctx) {
        throw new Error('No 2d context')
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const pixelRatio = window.devicePixelRatio
    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    const {
        naturalWidth,
        width,
        naturalHeight,
        height
    } = image
    // const {naturalWidth, naturalHeight} = getRotateDimensions(image.naturalWidth, image.naturalHeight, rotate) // Размер оригинального изображения при повороте

    // console.log("j", width, height)
    // console.log("n", naturalWidth, naturalHeight)
    const rotateRads = rotate * TO_RADIANS // Вычисление угла поворота

    const squareSize = Math.max(naturalWidth, naturalHeight) // Взять максимальную ширину или высоту для создания холста в виде квадрата

    const scaleX = squareSize / width // Коэффициент масштабирования по оси X для приведения изображения к оригинальным размерам. TODO: scaleX и scaleY равны и это может быть не правильно
    const scaleY = squareSize / height // Коэффициент масштабирования по оси Y для приведения изображения к оригинальным размерам

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio) // Указать размеры холста // Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio) // Указать размеры холста // Math.floor(crop.height * scaleY * pixelRatio)

    ctx.scale(pixelRatio, pixelRatio) // Компенсация количества пикселей на Retina-дисплеях
    ctx.imageSmoothingQuality = "high" // Установка сглаживания изображения

    const cropX = crop.x * scaleX // Определение координат обрезки изображения по координатам X
    const cropY = crop.y * scaleY // Определение координат обрезки изображения по координатам Y
    // console.log("crop X and Y: ", crop.x, crop.y)

    const centerX = squareSize / 2 // Координаты X для позиционирования изображения на холсте по центру
    const centerY = squareSize / 2 // Координаты Y для позиционирования изображения на холсте по центру

    const positionImageCenterY = (centerX - (naturalHeight / 2)) + (centerY - (naturalWidth / 2))
    // const positionImageCenterX = (centerX - (naturalHeight / 2)) + (centerY - (naturalWidth / 2))

    ctx.save()

    ctx.translate(-cropX, -cropY) // Перемещает контекст таким образом, чтобы область обрезки переместилась в начало системы координат canvas (0, 0)
    ctx.translate(centerX, centerY) // Перемещает начало координат в центр изображения, чтобы поворот происходил относительно его центра
    ctx.rotate(rotateRads) // Поворачивает изображение на заданный угол в радианах
    ctx.scale(scale, scale) // Масштабирует изображение по осям X и Y на указанное значение

    ctx.translate(-centerX, -centerY) // Перемещает начало координат обратно в верхний левый угол изображения после выполнения поворота и масштабирования
    ctx.drawImage(
        image,
        0, 0,
        squareSize, squareSize,

        0, positionImageCenterY,
        squareSize, squareSize
    )

    // ctx.strokeStyle = "red"
    // ctx.lineWidth = 3
    // ctx.strokeRect(0, 0, canvas.width, canvas.height) // Визуальная рамка для определение границы
    // console.log(`current canvas width: ${canvas.width} and height: ${canvas.height}`)


    // ctx.drawImage(
    //     image,
    //     crop.x, // Координаты X по отношению к оригинальному изображению для обрезки
    //     crop.y, // Координаты Y по отношению к оригинальному изображению для обрезки
    //     width, // Ширина обрезки оригинального изображения
    //     height, // Высота обрезки оригинального изображения
    //
    //     0, // Координаты для центрирования на пустом холсте canvas
    //     0, // Координаты для центрирования на пустом холсте canvas
    //     width, // Ширина для отображения изображения на canvas
    //     height // Высота для отображения изображения на canvas
    // )

    // const croppedCtx = canvas.getContext("2d")
    //
    // if (!croppedCtx) {
    //     throw new Error('No 2d context')
    // }
    //
    // canvas.width = crop.width
    // canvas.height = crop.height
    //
    // croppedCtx.drawImage(
    //     canvas,
    //     crop.x, crop.y,
    //     crop.width, crop.height,
    //     0, 0,
    //     crop.width, crop.height
    // )
    //
    // croppedCtx.restore()


    // const {width, height} =
    //     getRotateDimensions(image.naturalWidth, image.naturalHeight, rotate)
    // const scaleX = width / image.width // Соотношение с оригинальной шириной изображения
    // const scaleY = height / image.height // Соотношение с оригинальной высотой изображения
    //
    // canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    // canvas.height = Math.floor(crop.height * scaleY * pixelRatio)
    //
    // const cropX = crop.x * scaleX
    // const cropY = crop.y * scaleY
    //
    // const centerX = width / 2
    // const centerY = height / 2
    //
    // ctx.save()
    //
    // ctx.translate(-cropX, -cropY)
    // ctx.translate(centerX, centerY)
    // ctx.rotate(rotateRads)
    // ctx.scale(scale, scale)
    // ctx.translate(-centerX, -centerY)
    // ctx.drawImage(
    //     image,
    //     crop.x, crop.y,
    //     width, height,
    //     0, 0,
    //     width, height,
    // )


    // const scaleX = width / crop.width
    // const scaleY = height / crop.height
    //
    // canvas.width = image.width * scale * pixelRatio;
    // canvas.height = image.height * scale * pixelRatio;
    // console.log("canvas width and height: ", canvas.width, canvas.height)
    //
    // const centerX = canvas.width / 2
    // const centerY = canvas.height / 2
    //
    // const cropX = crop.x
    // const cropY = crop.y
    //
    // ctx.save();
    // ctx.translate(-cropX, -cropY)
    // ctx.translate(centerX, centerY);
    // ctx.rotate(rotateRads);
    // ctx.scale(scale, scale)
    // ctx.drawImage(
    //     image,
    //     cropX, // Координаты X по отношению к оригинальному изображению для обрезки
    //     cropY, // Координаты Y по отношению к оригинальному изображению для обрезки
    //     crop.width, // Ширина обрезки оригинального изображения
    //     crop.height, // Высота обрезки оригинального изображения
    //
    //     cropX, // Координаты для центрирования на пустом холсте canvas
    //     cropY, // Координаты для центрирования на пустом холсте canvas
    //     image.width * scale, // Ширина для отображения изображения на canvas
    //     image.height * scale// Высота для отображения изображения на canvas
    // );


    // // Return as a blob
    // return new Promise((resolve, reject) => {
    //     canvas.toBlob((file) => {
    //         if (file) {
    //             resolve(URL.createObjectURL(file))
    //         }
    //     }, 'image/jpeg')
    // })

    ctx.restore();
}
