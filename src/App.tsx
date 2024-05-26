import React, { useEffect, useRef, useState } from 'react'
import './App.scss'

const SIZE_DIMENSIONS: { [key: string]: { width: number; height: number } } = {
    sm: { width: 300, height: 200 },
    md: { width: 600, height: 400 },
    lg: { width: 900, height: 600 },
}

const App = () => {
    const canvas = useRef<HTMLCanvasElement>(null)
    let context: CanvasRenderingContext2D | null
    const [isDrawing, setIsDrawing] = useState(false)
    const [line, setLine] = useState<any>({})
    const [canvasSize, setCanvasSize] = useState('md')


    // set intial canvas size in useEffect
    useEffect(() => {
        setCanvasSize('md')
    }, [])

    // initialize the canvas context
    useEffect(() => {
        // dynamically assign the width and height to canvas
        const canvasEl = canvas.current
        if (canvasEl) {
            canvasEl.width = SIZE_DIMENSIONS[canvasSize]?.width;
            canvasEl.height = SIZE_DIMENSIONS[canvasSize]?.height;
            // get context of the canvas
            context = canvasEl.getContext('2d')
        }
    }, [canvasSize])

    const clearCanvas = (
        context: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement
    ) => {
        if (!context || !canvas) return
        const { width, height } = canvas
        context.clearRect(0, 0, width, height)
    }

    const resizeCanvas = (
        event: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setCanvasSize(event.target.value)
    }

    const getCanvasMouseCoordinates = (
        e: React.MouseEvent<HTMLCanvasElement>,
        canvas: HTMLCanvasElement | null
    ) => {
        if (!canvas) return null

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height
        const offsetX = (e.clientX - rect.left) * scaleX
        const offsetY = (e.clientY - rect.top) * scaleY

        return { x: offsetX, y: offsetY }
    }

    const getStraitenedLineEnd = (currentEnd: any, line: any) => {
        if (!line.start) return null
        const xDiff = Math.abs(currentEnd.x - line.start.x)
        const yDiff = Math.abs(currentEnd.y - line.start.y)
        return {
            x: xDiff > yDiff ? currentEnd.x : line.start.x,
            y: xDiff > yDiff ? line.start.y : currentEnd.y,
        }
    }

    return (
        <div className="App">
            <div>
                <div>
                    <select
                        name="size"
                        id="size"
                        value={canvasSize}
                        onChange={(event) =>
                            resizeCanvas(event)
                        }
                    >
                        <option value="sm">small</option>
                        <option value="md">medium</option>
                        <option value="lg">large</option>
                    </select>
                </div>
                <canvas
                    ref={canvas}
                    onMouseDown={(e) => {
                        // start drawing
                        setIsDrawing(true)
                        const context = e.currentTarget.getContext('2d')
                        // begin path.
                        if (context) {
                            context.beginPath()
                            context.lineWidth = 5
                            context.lineCap = 'round'
                            context.strokeStyle = '#ACD3ED'
                            context.moveTo(
                                e.nativeEvent.offsetX,
                                e.nativeEvent.offsetY
                            )
                            //   line.start = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
                            setLine({
                                start: {
                                    x: e.nativeEvent.offsetX,
                                    y: e.nativeEvent.offsetY,
                                },
                            })
                            console.log('LINE START: ', line)
                        }
                    }}
                    onMouseMove={(e) => {
                        // only handle mouse moves when the mouse is already down.
                        if (isDrawing) {
                            const context = e.currentTarget.getContext('2d')
                            if (context) {
                                let point = getCanvasMouseCoordinates(
                                    e,
                                    canvas.current
                                )
                                const adustedPoint = getStraitenedLineEnd(point, line)
                                context.lineTo(
                                    adustedPoint?.x,
                                    adustedPoint?.y
                                )
                                setLine({ ...line, end: adustedPoint })
                                console.log('LINE MOVE: ', line)    
                                context.stroke()
                            }
                        }
                    }}
                    onMouseUp={(e) => {
                        // end drawing.
                        const context = e.currentTarget.getContext('2d')
                        if (context) {
                            let point = getCanvasMouseCoordinates(
                                e,
                                canvas.current
                            )
                      
                            const newEnd = getStraitenedLineEnd(point, line)
                            // context.moveTo(
                            //     line.start.x,
                            //     line.start.y
                            // )
                  
                            // context.lineTo(newEnd?.x, newEnd?.y)
                            // context.stroke()
                            console.log('LINE END: ', line)
                            setIsDrawing(false)
                        }
                    }}
                ></canvas>
            </div>
        </div>
    )
}

export default App
