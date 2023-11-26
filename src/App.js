import './App.css'
import { useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ScrollControls, useScroll } from '@react-three/drei'
import { getProject, val } from '@theatre/core'
import { Auth } from './components/Auth'
import {auth} from './firebase-config.js'
import MyElement3D from './MyElement3D'
import flyThroughState from './fly.json';
import Cookies from 'universal-cookie'
const cookies = new Cookies()


function App() {
  // const sheet = getProject('Fly Through', { state: flyThroughState }).sheet(
  //   'Scene'
  // )

  const openModal = () => {
    if(document.querySelector(".container").classList.contains("modal-open")){
      document.querySelector(".container").classList.remokpve("modal-open");
    }else{
        document.querySelector(".container").classList.add("modal-open");
    }
  };

  
  return (
    <>
      <div className='background'>
      <Canvas
      shadows
      camera = {{position: [0, 0, 0], fov: 90}}
      >      
      <MyElement3D />
      <OrbitControls/>
      </Canvas>
      </div>
      <a className="click-button" 
      onClick={() => {
        openModal();
      }}>
      <img class="Vector1" src="./images/fi-rr-interrogation.png"/>
      </a>
      <div className="container">
          <div class="Rectangle-1">
          <div class="info_title">
              조작법
          </div>
          <div class="Rectangle-2"></div>
          <div class="info_text">
              세포 곳곳에 있는 물체를 클릭해보세요!<br/>
              다른 소리와 다른 시각을 체험하실 수 있습니다.
          </div>
          </div>
      </div>
    </>
  )
}

export default App;



