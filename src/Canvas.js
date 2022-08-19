import { useEffect } from "react"
import { init } from "./gl"
import './Canvas.css'

const Canvas = (props) => {

	useEffect(() => {
		// console.log(props.urls);
		init(props.artists);
	}, []);

	return (
  	<>
			<canvas id="webgl-canvas" width={1920} height={1080}></canvas>
    </>
  )
}

export default Canvas