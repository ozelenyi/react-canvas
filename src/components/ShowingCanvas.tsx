import { useEffect, useRef } from 'react'
import { drawLine } from '../helpers'
import { SIZE_DIMENSIONS } from '../App'
import { CanvasSizeType, Line } from '../models'

/**
 * Canvas to show all drawn lines
 */
const ShowingCanvas = ({
    canvasSize,
    linesArray,
}: {
    canvasSize: CanvasSizeType
    linesArray: Line[]
}) => {
    const canvas = useRef<HTMLCanvasElement>(null)

    // react to lines changes
    useEffect(() => {
        const context = canvas.current?.getContext('2d')
        if (!context || !canvas.current) return
        // workaround for displaying lines after size switch
        setTimeout(() => linesArray.forEach((l) => drawLine(context, l), 0))
    }, [linesArray, canvasSize])

    // react to size changes
    useEffect(() => {
        const canvasEl = canvas.current
        if (canvasEl) {
            canvasEl.width = SIZE_DIMENSIONS[canvasSize]?.width
            canvasEl.height = SIZE_DIMENSIONS[canvasSize]?.height
        }
    }, [canvasSize])

    return <canvas id="showingCanvas" ref={canvas}></canvas>
}

export default ShowingCanvas
