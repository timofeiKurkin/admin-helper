import {PixelCrop} from 'react-image-crop'
import {HORIZONTAL, ImageOrientationType, VERTICAL} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";

const TO_RADIANS = Math.PI / 180


/**
 * Функция для определения оригинальных размеров изображения при повороте
 * @param naturalWidth
 * @param naturalHeight
 * @param rotateAngle
 */
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

interface CanvasPreviewProps {
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
    scale: number,
    rotate: number,
    imageOrientation: ImageOrientationType;
}

export const canvasPreview = async ({
                                        image,
                                        canvas,
                                        crop,
                                        scale = 1,
                                        rotate = 0,
                                        imageOrientation
                                    }: CanvasPreviewProps): Promise<File> => {
    const ctx = canvas.getContext('2d') // Получаем 2Д контекст для рисования на холсте

    if (!ctx) {
        throw new Error('No 2d context')
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height) // Отчистить холст перед отображением изображения

    const pixelRatio = window.devicePixelRatio
    const {
        naturalWidth,
        width,
        naturalHeight,
        height
    } = image

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

    const centerX = squareSize / 2 // Координаты X для позиционирования изображения на холсте по центру
    const centerY = squareSize / 2 // Координаты Y для позиционирования изображения на холсте по центру

    const positionImageCenterY = imageOrientation === HORIZONTAL ? (centerX - (naturalHeight / 2)) + (centerY - (naturalWidth / 2)) : 0
    const positionImageCenterX = imageOrientation === VERTICAL ? (centerX - (naturalWidth / 2)) + (centerY - (naturalHeight / 2)) : 0

    ctx.save()

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    /**
     * Перемещает контекст таким образом, чтобы область обрезки переместилась в начало системы координат canvas (0, 0)
     */
    ctx.translate(-cropX, -cropY)


    /**
     * Перемещает начало координат в центр изображения, чтобы поворот происходил относительно его центра
     */
    ctx.translate(centerX, centerY)


    /**
     * Поворачивает изображение на заданный угол в радианах
     */
    ctx.rotate(rotateRads)


    /**
     * Масштабирует изображение по осям X и Y на указанное значение
     */
    ctx.scale(scale, scale)

    /**
     * Перемещает начало координат обратно в верхний левый угол изображения после выполнения поворота и масштабирования
     */
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(
        image,
        0, 0,
        squareSize, squareSize,

        positionImageCenterX, positionImageCenterY,
        squareSize, squareSize
    )

    ctx.restore();

    return new Promise((res) => {
        canvas.toBlob((blob) => {
            if (blob) {
                const newFile = new File([blob], image.alt, {
                    type: "image/png",
                    lastModified: Date.now()
                })

                res(newFile)
            }
        }, "image/png", 1)
    })
}
