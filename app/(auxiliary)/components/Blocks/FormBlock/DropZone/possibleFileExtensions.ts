export const possiblePhotoExtensions = [
    ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp"
]

export const possibleVideoExtensions = [
    // ".mp4", ".mkv", ".webm", ".avi", ".mov", ".wmv", ".flv", ".m4v", ".mpg", ".mpeg", ".3gp"
    ".mp4", ".webm"
]

export const acceptSettings: { [type: string]: { [permissions: string]: string[] } } = {
    "video": {
        "video/mp4": possibleVideoExtensions,
        // "video/ogg": [".ogv"]
    },
    "photo": {
        "image/*": possiblePhotoExtensions
    }
}

export const maxFiles: {[type: string]: number} = {
    "video": 3,
    "photo": 10
}

export const maxSize: {[type: string]: number} = {
    "video": 200 * 1024 * 1024,
    "photo": 5 * 1024 * 1024
}