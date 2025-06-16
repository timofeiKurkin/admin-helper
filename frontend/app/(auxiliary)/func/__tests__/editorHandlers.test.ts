import {centerPositionOfAxes, getScaledSizesOfImage, rotatePoints, stickToClosestValue} from "../editorHandlers"

describe("getScaledSizesOfImage", () => {
    it("scales a square image proportionally to canvas", () => {
        const result = getScaledSizesOfImage(500, 500, 1000, 1000)
        expect(result).toEqual({naturalWidthScaled: 1000, naturalHeightScaled: 1000})
    })

    it("scales a portrait image proportionally to canvas", () => {
        const result = getScaledSizesOfImage(600, 900, 640, 640)
        expect(result).toEqual({
            naturalWidthScaled: Math.floor(600 * (640 / 900)),
            naturalHeightScaled: 640
        })
    })

    it("scales a landscape image proportionally to canvas", () => {
        const result = getScaledSizesOfImage(1200, 800, 640, 640)
        expect(result).toEqual({
            naturalWidthScaled: 640,
            naturalHeightScaled: Math.floor(800 * (640 / 1200))
        })
    })

    it("handles zero dimensions safely", () => {
        const result = getScaledSizesOfImage(0, 800, 640, 640)
        expect(result).toEqual({naturalWidthScaled: 0, naturalHeightScaled: 640})
    })
})


describe("centerPositionOfAxes", () => {
    it("returns zero for perfectly fitting image", () => {
        const result = centerPositionOfAxes(800, 600, 800, 600)
        expect(result).toEqual({x: 0, y: 0})
    })

    it("centers a smaller image in both directions", () => {
        const result = centerPositionOfAxes(1000, 800, 800, 600)
        expect(result).toEqual({x: 100, y: 100}) // (1000 - 800)/2, (800 - 600)/2
    })

    it("centers only vertically when width matches", () => {
        const result = centerPositionOfAxes(800, 800, 800, 600)
        expect(result).toEqual({x: 0, y: 100})
    })

    it("centers only horizontally when height matches", () => {
        const result = centerPositionOfAxes(800, 600, 600, 600)
        expect(result).toEqual({x: 100, y: 0})
    })

    it("handles zero sizes safely", () => {
        const result = centerPositionOfAxes(0, 0, 0, 0)
        expect(result).toEqual({x: 0, y: 0})
    })
})

describe("stickToClosestValue", () => {
    it("returns value when no stickPoints are close enough", () => {
        const result = stickToClosestValue(123, rotatePoints, 1)
        expect(result).toBe(123)
    })

    it("sticks to closest point within stickStep", () => {
        const result = stickToClosestValue(89, rotatePoints, 2)
        expect(result).toBe(90)
    })

    it("sticks to lower closest point within stickStep", () => {
        const result = stickToClosestValue(-89, rotatePoints, 2)
        expect(result).toBe(-90)
    })

    it("returns exact match immediately", () => {
        const result = stickToClosestValue(90, rotatePoints, 5)
        expect(result).toBe(90)
    })

    it("works with negative values", () => {
        const result = stickToClosestValue(-123, rotatePoints, 1)
        expect(result).toBe(-123)
    })
})
