export const formattedTime = () => {
    const result = new Date().toLocaleDateString("ru-RU", {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).split(", ")
    const date = result[0]
    const time = result[1].split(":").join(".")
    
    return `${date}-${time}`
}