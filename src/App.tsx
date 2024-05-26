import React, { useEffect, useRef } from 'react'
import './App.scss'

const App = () => {
    const canvas = useRef<HTMLCanvasElement>(null)
    let context: CanvasRenderingContext2D | null

    // initialize the canvas context
    useEffect(() => {
        // dynamically assign the width and height to canvas
        const canvasEl = canvas.current
        if (canvasEl) {
            canvasEl.width = canvasEl?.clientWidth || 0
            canvasEl.height = canvasEl.clientHeight
            // get context of the canvas
            context = canvasEl.getContext('2d')
        }
    }, [])

    useEffect(() => {
        drawLine({ x: 20, y: 20, x1: 20, y1: 100 })

        if (context) {
            context.fillStyle = '#000000'
            context.beginPath()
            context.arc(50, 100, 20, 0, 2 * Math.PI)
            context.fill()
        }
    }, [])

    // draw a line
    const drawLine = (info: any, style: any = {}) => {
        const { x, y, x1, y1 } = info
        const { color = 'black', width = 1 } = style

        if (context) {
            context.beginPath()
            context.moveTo(x, y)
            context.lineTo(x1, y1)
            context.strokeStyle = color
            context.lineWidth = width
            context.stroke()
        }
    }

     const resizeCanvasToDisplaySize = (
        canvas: any,
        event: React.ChangeEvent<HTMLSelectElement>
    ):void => {
        console.log(event)

        let width, height

        switch (event.target.value) {
            case 'sm':
                width = 100
                height = 100
                break
            case 'md':
                width = 200
                height = 200
                break
            case 'lg':
                width = 300
                height = 300
                break
                default:
                    width = 100
                    height = 100
        }

        if (context && (canvas.width !== width || canvas.height !== height)) {
            context.canvas.width = width
            context.canvas.height = height
        }
    }

    return (
        <div className="App">
            <div>
                <div>
                    <select
                        name="size"
                        id="size"
                        onChange={(event) =>
                            resizeCanvasToDisplaySize(canvas, event)
                        }
                    >
                        <option value="sm">small</option>
                        <option value="md">medium</option>
                        <option value="lg">large</option>
                    </select>
                </div>
                <canvas ref={canvas}></canvas>
            </div>
        </div>
    )
}

export default App
