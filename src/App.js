//TODO: merging with face mesh
//TODO:get the json object to display it on the button
//TODO: implement it it in the api

//FIXME:fixing the useEffect and access the data of the news'
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from 'face-api.js';

//import axios from './axios';
import './App.css';





function App() {
  const videoHeight = 480;
  const videoWidth = 640;
  const [intializing, setIntializing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
 const [expl,setFalse] = useState(true);
 //const  [memes,setMemes] = useState({});

 
   useEffect(() => {
    const loadModels = async () => {



      const MODEL_URL = process.env.PUBLIC_URL + './models';
      setIntializing(true);
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)]).then(start);
    }
    loadModels();

  }, []);


  const start = () => {
    navigator.getUserMedia({
      video: {}
    },
      (stream) => (videoRef.current.srcObject = stream)
      ,
      (err) => console.log(err)
    )
  }

  const onhandleDisplay = async () => {
    setInterval(async () => {
      if (intializing) {
        setIntializing(false);
      }
      canvasRef.current.innerHTML = await faceapi.createCanvasFromMedia(videoRef.current);
      const displaySize = {
        width: videoWidth,
        height: videoHeight
      }
      faceapi.matchDimensions(canvasRef.current, displaySize);
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
      let resultsFound = [...detections]
    //  const expressionAngry = resultsFound.map(resultsFound => resultsFound.expressions.angry);
      const expressionSad = resultsFound.map(resultsFound => resultsFound.expressions.sad);
      // const expressionNeutral = resultsFound.map(resultsFound => resultsFound.expressions.neutral );
      const expressionHappy = resultsFound.map(resultsFound => resultsFound.expressions.happy);
      let computedHappy = Number(expressionHappy) * 10;
    //  let computedAngry = Number(expressionAngry) * 10;
      let computedSad = Number(expressionSad) * 10;
      //  let computedNeutral = Number(expressionNeutral)*10;
      // if (computedAngry > computedHappy && computedSad) {

      //   return exp = console.log("Angry😠");
      // }
       if (computedHappy >  computedSad) {
        
       setFalse(expl => !expl);
      }
      else if(computedSad > computedHappy) {
       setFalse(expl);
      }


      // const arrayMax = [computedAngry,computedHappy,computedNeutral,computedSad];
      // console.log(Math.max(arrayMax));
   

    }, 2500)

  }



 
  // useEffect( ()=> {
  // const fetchMemes  =     async () => { 
  //    await  axios.get()
  //     .then (response => {
  //   setMemes({memes:   response.data.data.memes[(Math.floor(Math.random()*10))]})
  //   console.log(memes)
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
      
  //   }
    
  //   fetchMemes()
  // },[]) 

  return (
    <>
    <div className="App">

      <span>{intializing ? 'Initializing' : 'LockAndLoad'}</span>
      <div style={{ display: 'flex', justifyContent: "center" }}>
        <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth} onPlay={onhandleDisplay} />
        <canvas ref={canvasRef} style={{ position: 'absolute' }} />
      </div>
      { expl ? 
      <div>
        <label>Sad🙁😯 </label><br />
      
      </div>
 : <div>
 <label> Happy😀😂</label><br />
</div>}
</div>
  <br/>

 
 
</>
  )
}
export default App;
