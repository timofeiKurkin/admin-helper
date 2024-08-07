export const formattedTime = () => {
    return new Date().toLocaleDateString("ru-RU", {
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
        second: '2-digit'
    }).split(", ").join("-")
}