export const trimLongTitle = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.split("").slice(0, ++maxLength).join("") + "..." : text
}