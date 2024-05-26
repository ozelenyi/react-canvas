import React, { useEffect, useRef, useState } from 'react'
import './App.scss'

const App = () => {
    const canvas = useRef<HTMLCanvasElement>(null);
    let context: CanvasRenderingContext2D | null;
    const [isDrawing, setIsDrawing] = useState(false);


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

    const SIZE_MIDENSIONS: {[key: string]: {width: number, height: number}} = {
        sm: {width: 100, height: 100},
        md: {width: 200, height: 200},
        lg: {width: 300, height: 300}
    }

     const resizeCanvasToDisplaySize = (
        canvas: any,
        event: React.ChangeEvent<HTMLSelectElement>
    ):void => {
        console.log(event)

        let {width, height} = SIZE_MIDENSIONS[event.target.value];

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
                <canvas ref={canvas} 
                onMouseDown={(e) => {
                    // start drawing
                    setIsDrawing(true);
                    const context = e.currentTarget.getContext("2d");
                    // begin path.
                    if (context) {
                      context.beginPath();
                      context.lineWidth = 5;
                      context.lineCap = "round";
                      context.strokeStyle = "#ACD3ED";
                      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                    }
                  }}
                  onMouseMove={(e) => {
                    // only handle mouse moves when the mouse is already down.
                    if (isDrawing) {
                      const context = e.currentTarget.getContext("2d");
                      if (context) {
                        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                        context.stroke();
                      }
                    }
                  }}
                  onMouseUp={() => {
                    // end drawing.
                    setIsDrawing(false);
                  }}></canvas>
            </div>
        </div>
    )
}

export default App

