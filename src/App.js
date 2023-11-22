import './App.css'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ScrollControls, useScroll } from '@react-three/drei'
import { getProject, val } from '@theatre/core'

import {Modal} from './Modal.js'
import MyElement3D from './MyElement3D.js'

import flyThroughState from './fly.json'


function App() {
  // const sheet = getProject('Fly Through', { state: flyThroughState }).sheet(
  //   'Scene'
  // )

  const openModal = () => {
    if(document.querySelector(".container").classList.contains("modal-open")){
      document.querySelector(".container").classList.remove("modal-open");
    }else{
        document.querySelector(".container").classList.add("modal-open");
    }
  };

  return (
    <>

     <Canvas
      shadows
      camera = {{position: [0, 2, 0], fov: 90}}
      >
      <MyElement3D />
      <OrbitControls/>
      </Canvas>
      <a className="click-button" 
      onClick={() => {
        openModal();
      }}>
      <img class="Vector1" src="./images/fi-rr-interrogation.png"/>
      </a>
    </>
  )
}

export default App;



