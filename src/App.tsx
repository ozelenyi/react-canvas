import React, { useEffect, useState } from 'react'
import './App.scss'
import ShowingCanvas from './components/ShowingCanvas'
import DrawingCanvas from './components/DrawingCanvas'
import { CanvasSizeType, Line } from './models'

export const SIZE_DIMENSIONS: {
    [key: string]: { width: number; height: number }
} = {
    sm: { width: 300, height: 200 },
    md: { width: 600, height: 400 },
    lg: { width: 900, height: 600 },
}

const App = () => {
    const [canvasSize, setCanvasSize] = useState<CanvasSizeType>('md')
    const [linesArray, setLinesArray] = useState<Line[]>([])

    // set intial canvas size
    useEffect(() => {
        setCanvasSize('md')
    }, [])

    const onChangeCanvasSize = (
        event: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setCanvasSize(event.target.value as CanvasSizeType)
    }

    return (
        <div className="App">
            <div className="wrapper">
                <p>
                    <label htmlFor="size">Canvas size: </label>
                    <select
                        name="size"
                        id="size"
                        value={canvasSize}
                        onChange={(event) => onChangeCanvasSize(event)}
                    >
                        <option value="sm">small</option>
                        <option value="md">medium</option>
                        <option value="lg">large</option>
                    </select>
                </p>
                <div className="canvas-wrapper">
                    <div
                        className="canvas-wrapper__container"
                        style={{
                            width: SIZE_DIMENSIONS[canvasSize]?.width,
                            height: SIZE_DIMENSIONS[canvasSize]?.height,
                        }}
                    >
                        <DrawingCanvas
                            canvasSize={canvasSize}
                            setLinesArray={setLinesArray}
                        ></DrawingCanvas>
                        <ShowingCanvas
                            canvasSize={canvasSize}
                            linesArray={linesArray}
                        ></ShowingCanvas>
                    </div>
                </div>
            </div>

            <div className="lines-list">
                <div className="lines-list__container">
                    <p>List on lines:</p>
                    {linesArray.map((l, i) => (
                        <div
                            key={
                                i +
                                '' +
                                l?.start?.x +
                                l?.start?.y +
                                l?.end?.x +
                                l?.end?.y
                            }
                        >{`Line ${i + 1} - points [${l.start?.x}, ${l.start?.y}, ${l.end?.x}, ${l.end?.y}]`}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default App
