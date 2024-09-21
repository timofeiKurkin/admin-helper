
interface WantedItemType {
    name: string
}
export const indexOfObject = <T extends WantedItemType>(arr: T[], wanted: WantedItemType) => {
    return arr.findIndex((item) => (item.name === wanted.name))
}