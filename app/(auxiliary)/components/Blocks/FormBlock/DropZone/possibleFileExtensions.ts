export const possiblePhotoExtensions = [
    ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp"
]

export const possibleVideoExtensions = [
    ".mp4", ".mkv", ".webm", ".avi", ".mov", ".wmv", ".flv", ".m4v", ".mpg", ".mpeg", ".3gp"
]

export const acceptSettings: { [type: string]: { [permissions: string]: string[] } } = {
    "video": {
        "video/*": possibleVideoExtensions
    },
    "photo": {
        "image/*": possiblePhotoExtensions
    }
}