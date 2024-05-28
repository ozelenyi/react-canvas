import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
    clearCanvas,
    drawLine,
    getCanvasMouseCoordinates,
    getStraitenedLineEnd,
    isLineComplete,
} from '../helpers'
import { SIZE_DIMENSIONS } from '../App'
import { CanvasSizeType, Line } from '../models'

/**
 * Responsible for drawing one line at a time and on mouseup transfer it to permanent canvas
 */
const DrawingCanvas = ({
    canvasSize,
    setLinesArray,
}: {
    canvasSize: CanvasSizeType
    setLinesArray: React.Dispatch<React.SetStateAction<Line[]>>
}) => {
    const [isDrawing, setIsDrawing] = useState(false)
    const canvas = useRef<HTMLCanvasElement>(null)
    const [drawingLine, setDrawingLine] = useState<Line>({
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
    })

    // react to size changes
    useEffect(() => {
        const canvasEl = canvas.current
        if (canvasEl) {
            canvasEl.width = SIZE_DIMENSIONS[canvasSize]?.width
            canvasEl.height = SIZE_DIMENSIONS[canvasSize]?.height
        }
    }, [canvasSize])

    // constanly redraw current line
    useEffect(() => {
        const context = canvas.current?.getContext('2d')
        if (!context || !canvas.current) return

        clearCanvas(context, canvas.current)
        drawLine(context, drawingLine)
    }, [drawingLine])

    const onMouseDown = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
            // start drawing
            setIsDrawing(true)
            const context = e.currentTarget.getContext('2d')
            console.log(e.nativeEvent.offsetX, e.nativeEvent.offsetY)

            // begin path.
            if (context) {
                setDrawingLine({
                    start: {
                        x: e.nativeEvent.offsetX,
                        y: e.nativeEvent.offsetY,
                    },
                })
            }
        },
        []
    )

    const onMouseMove = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
            // only handle mouse moves when the mouse is already down.
            if (isDrawing) {
                const context = e.currentTarget.getContext('2d')
                if (context) {
                    let point = getCanvasMouseCoordinates(e, canvas.current)
                    // adjust line to 90 deg angle
                    const adustedPoint = getStraitenedLineEnd(
                        point,
                        drawingLine
                    )
                    if (adustedPoint) {
                        setDrawingLine({ ...drawingLine, end: adustedPoint })
                    }
                }
            }
        },
        [isDrawing, drawingLine, setDrawingLine]
    )

    const onMouseUp = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
            // end drawing.
            setIsDrawing(false)
            // transfer line to permanent canvas
            if (isLineComplete(drawingLine)) {
                setLinesArray((prevLinesArray) => [
                    ...prevLinesArray,
                    drawingLine,
                ])
                // reset drawing line
                setDrawingLine({
                    start: { x: 0, y: 0 },
                    end: { x: 0, y: 0 },
                })
            }
        },
        [drawingLine, setLinesArray, setDrawingLine]
    )

    return (
        <canvas
            id="drawingCanvas"
            data-testid="drawingCanvas"
            ref={canvas}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        ></canvas>
    )
}

export default DrawingCanvas
