import React from  'react';





const handleVideoOnPlay = () => {
    setInterval(async ()=> {
      if(intializing){
        setIntializing(false);
      }
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
      const displaySize = {
        width:videoWidth,
        height:videoHeight
      }
      faceapi.matchDimensions(canvasRef.current,displaySize);
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections , displaySize);
      canvasRef.current.getContext('2d').clearRect(0,0,videoWidth,videoHeight);
       faceapi.draw.drawDetections(canvasRef.current,resizedDetections);
       faceapi.draw.drawDetections(canvasRef.current,resizedDetections);
  
      console.log(detections);
    },100)
  }

  //TODO:install dependencies done
//TODO:import dependencies done
//TODO:setup canvas and webcam done 
//TODO:define refs to then done 
//TODO:load facemesh posenet done 
//TODO:defining the detection functions done
//TODO:drawing the marks from utilities in tfjs done
//TODO:Defining the drawing functions done

//TODO:implementing the face expression net from face api js


import React , {useRef,useEffect,useState} from "react";
import * as tf from "@tensorflow/tfjs";
import * as faceapi from 'face-api.js';

import Webcam from "react-webcam";

import { drawMesh } from './utilities';
import './App.css';
import { nets } from "face-api.js";




function App(){

const [intializing, setIntializing] = useState(false);



  const webcamRef = useRef(null);
  const canvasRef = useRef(null);


  //loading posenet

  const runFaceMesh = async () => {
    const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    setInterval(()=>{
      detect(net);
    },20)
  };

  const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + './models';
    setIntializing(true);
       Promise.all ([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)]).then(start);
       }
       loadModels();
      
const start = () => {
  navigator.getUserMedia({
    video:{}
  },
  stream => webcamRef.current.srcObject = stream)
}
  const detect = async (net) => {
    if(

      // checking the webcamReference 
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ){
      //getting the video refernce 
      const video =  webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      //setting the video width and height

      webcamRef.current.videoWidth = videoWidth;
      webcamRef.current.videoHeight = videoHeight;

      //setting the canvas height and width
      
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face =  await net.estimateFaces({input:video});
      //canvas context

      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(() => {drawMesh(face,ctx)});
      
    }
  };





  useEffect(()=> {runFaceMesh()},   []);
  useEffect(()=> {loadModels()},[])



  return (
    <div className="App">
      <header className="App-header">
        <span style={{alignContent:'center'}}>{intializing ? 'initializing' :'Loaded model'}</span>
        <h3>Hello kolork</h3>
        <Webcam 
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
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
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
