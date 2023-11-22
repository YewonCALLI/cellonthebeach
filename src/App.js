import './App.css'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ScrollControls, useScroll } from '@react-three/drei'
import { getProject, val } from '@theatre/core'
import { SheetProvider, PerspectiveCamera, useCurrentSheet } from '@theatre/r3f'

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
      {/* <JisuModel/> */}
      <OrbitControls/>
      {/* <ScrollControls pages={5} damping={1} maxSpeed={0.1}>
          <SheetProvider sheet={sheet}>
            <Scene />
          </SheetProvider>
        </ScrollControls> */}
     </Canvas>
      {/* <Modal/> */}
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

function Scene() {
  const sheet = useCurrentSheet()
  const scroll = useScroll()

  // our callback will run on every animation frame
  useFrame(() => {
    // the length of our sequence
    const sequenceLength = val(sheet.sequence.pointer.length)
    // update the "position" of the playhead in the sequence, as a fraction of its whole length
    sheet.sequence.position = scroll.offset * sequenceLength
  })

  return (
    <>
      <ambientLight />
      <MyElement3D/>
      <PerspectiveCamera
        theatreKey='Camera'
        makeDefault
        position={[0, 0, 0]}
        fov={180}
        near={0.1}
        far={70}
      />
    </>
  )
}

