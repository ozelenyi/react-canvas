import { Line } from './models'

export const getCanvasMouseCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement | null
) => {
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const offsetX = Math.floor((e.clientX - rect.left) * scaleX)
    const offsetY = Math.floor((e.clientY - rect.top) * scaleY)

    return { x: offsetX, y: offsetY }
}

export const getStraitenedLineEnd = (currentEnd: any, line: any) => {
    if (!line.start) return null
    const xDiff = Math.abs(currentEnd.x - line.start.x)
    const yDiff = Math.abs(currentEnd.y - line.start.y)
    return {
        x: xDiff > yDiff ? currentEnd.x : line.start.x,
        y: xDiff > yDiff ? line.start.y : currentEnd.y,
    }
}

export const drawLine = (context: CanvasRenderingContext2D, line: Line) => {
    const { start, end } = line
    if (!start || !end || !context) return

    context.beginPath()
    context.lineWidth = 5
    context.lineCap = 'round'
    context.strokeStyle = '#ACD3ED'
    context.moveTo(start.x, start.y)
    context.lineTo(end.x, end.y)
    context.stroke()
}

export const isLineComplete = (line: Line): boolean =>
    !!(line?.start?.x && line?.start?.y && line?.end?.x && line?.end?.y)

export const clearCanvas = (
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
) => {
    if (!context || !canvas) return
    const { width, height } = canvas
    context.clearRect(0, 0, width, height)
}
