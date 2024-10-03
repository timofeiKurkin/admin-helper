export const formattedTime = () => {
    return new Date().toLocaleDateString("ru-RU", {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).split(", ").join("-")
}