import { useRef } from "react";
// import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

const App = () => {
  const webacamRef = useRef(null);
  const canvasRef = useRef(null);
  //Load facemesh
  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 640 },
      scale: 0.8,
    });
    setInterval(() => {
      detect(net)
    }, 100);
  };

  //Detect functions
  const detect = async (net) => {
    if (
      typeof webacamRef.current !== "undefined" &&
      webacamRef.current !== null &&
      webacamRef.current.video.readyState === 4
    ) {
      const video = webacamRef.current.video
      const videoWidth = webacamRef.current.video.videoWidth
      const videoHeight = webacamRef.current.video.videoHeight

      webacamRef.current.video.width = videoWidth
      webacamRef.current.video.height = videoHeight

      canvasRef.current.width =videoWidth
      canvasRef.current.height = videoHeight

      const face = await net.estimateFaces(video)
      console.log(face)
      const ctx = canvasRef.current.getContext('2d')
      drawMesh(face,ctx)
    }
  };
  runFacemesh()
  return (
    <div>
      <header>
        <Webcam
          ref={webacamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
};

export default App;
