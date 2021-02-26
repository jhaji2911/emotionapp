//TODO: merging with face mesh
//TODO:get the json object to display it on the button
//TODO: implement it it in the api


import React , {useRef,useEffect,useState} from "react";
import * as faceapi from 'face-api.js';
// import * as facemesh from "@tensorflow-models/face-landmarks-detection";
// import Webcam from "react-webcam";

import './App.css';



function App() {
const videoHeight=480
const videoWidth=640
const [intializing, setIntializing] = useState(false);
const videoRef = useRef(null);
const canvasRef = useRef(null);

useEffect(()=> {
  const loadModels = async () => {
    


    const MODEL_URL = process.env.PUBLIC_URL + './models';
    setIntializing(true);
       Promise.all ([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)]).then(start);
       }
       loadModels();

},[]);

 
const start = () => {
  navigator.getUserMedia({
    video:{}
  },
    (stream) => (videoRef.current.srcObject = stream)  
,
(err) => console.log(err)
  )
}

const onhandleDisplay =  async () =>{
setInterval(async () =>{
  if(intializing){
    setIntializing(false);
  }
  canvasRef.current.innerHTML = await faceapi.createCanvasFromMedia(videoRef.current);
  const displaySize = {
    width:videoWidth,
    height:videoHeight
  }
  faceapi.matchDimensions(canvasRef.current,displaySize);
  const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
  const resizedDetections = faceapi.resizeResults(detections , displaySize);
      canvasRef.current.getContext('2d').clearRect(0,0,videoWidth,videoHeight);
       faceapi.draw.drawDetections(canvasRef.current,resizedDetections);
       faceapi.draw.drawFaceLandmarks(canvasRef.current,resizedDetections);
       faceapi.draw.drawFaceExpressions(canvasRef.current,resizedDetections);
       console.log(detections)
} ,100)
}

return(
  <div className="App">
   
    <span>{intializing? 'Initializing':'LockAndLoad'}</span>
    <div style={{display:'flex',justifyContent:"center"}}>
  <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth} onPlay={onhandleDisplay}/>
  <canvas ref={canvasRef} style={{position:'absolute'}}/>
    </div>
  </div> 
)

}


export default App;
