import{ useFrame,useThree } from "@react-three/fiber"
import { useRef, useState, useEffect } from "react"
import { Environment, OrbitControls, useGLTF, useAnimations, useFBX ,useHelper, useTexture} from "@react-three/drei"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { DirectionalLightHelper, PointLightHelper } from "three"
import * as THREE from 'three'
import {addDoc, collection, onSnapshot, serverTimestamp, query, where, orderBy} from 'firebase/firestore';
import {auth, db} from './firebase-config.js';

import "./css/chat.css"

const MyElement3D = (props) =>{

    const {room} = props;
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesRef = collection(db, 'messages');

    const cube = useRef()
    const model = useFBX("./models/factory_anim_v001.fbx")
    const model2 = useGLTF("./models/raw.glb")
    const pointLight = useRef()
    const pointLight1 = useRef()
    const directionalLight = useRef()
    const texture = useTexture("./images/texture.jpeg")
   

    const mixer = new THREE.AnimationMixer(model);
    const animationClip = model.animations && model.animations[0];


    if (animationClip) {
        const action = mixer.clipAction(animationClip);
        action.play();
    }

    useFrame((state) => {
        if(animationClip){
        mixer.update(state.clock.getDelta());
        }
    });



    useHelper(directionalLight, THREE.DirectionalLightHelper, 1, "teal")
    useHelper(pointLight, THREE.PointLightHelper, 1, "teal")
    useHelper(pointLight1, THREE.PointLightHelper, 1, "teal")

    // const animations = useAnimations(model.animations, model.scene)
    // const action = animations.actions[actionNames[0]]

    // useFrame((state) => {
    //     clicked_location.getWorldPosition(target)
    //     state.camera.position.copy(clicked_location.position)-(new THREE.Vector3(1, 1, 1))
    //     state.camera.lookAt(clicked_location.position)
    // })

    const { camera } = useThree();


    useEffect(() => {
        const queryMessages = query(messagesRef, where('room', '==', room), orderBy('createdAt'))
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
            messages.push({...doc.data(), id: doc.id});
            });
            setMessages(messages);
        })
        return () => unsubscribe();
    }, [])

    const playAudio = (path) => {
        const audio = new Audio("./sounds/background.m4a");
        audio.play();
    };
    
    const playKick = (path) => {
        const audio = new Audio("./sounds/kick.wav"); 
        audio.play();
    }

    const [loadedMessages, setLoadedMessages] = useState([
        {
          text: messages,
          createdAt: serverTimestamp(),
          uid: auth.currentUser.uid,
          room,
        },
    ]);

    useEffect(() => {
        for (var i = 0; i < loadedMessages.length; i++) {
          if (loadedMessages[i].text == "factory01") {
            playKick();
            console.log(loadedMessages[i].text)
          }
          if (loadedMessages[i].text == "pCube1") {
            playAudio();
          }
        }
    }, [loadedMessages]);
    


    const handleSubmit = async (e) => {
        // e.preventDefault();

        //Message가 비어있으면 아무것도 하지 않음
        if(newMessage === '') return;

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            uid: auth.currentUser.uid,
            room,
        });

    }


    model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      }
    );

    const LightController = (props) => (
        <>
            <directionalLight 
                ref={directionalLight}
                castShadow
                position={[10, 10, 10]}
                intensity={4}
                shadow-camera-near={1}
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
                shadow-camera-far={200}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
            />
            <ambientLight intensity={0.8}/>
            <pointLight ref={pointLight} castShadow position={[-10, 0, -20]} intensity={0.5} useHelper={true}/>
            <pointLight ref={pointLight1} castShadow position={[0, 0, 0]} intensity={1.5} useHelper={true}/>   
        </>
    );
    
    return(
        <>
        <Environment preset="sunset"/>
        <LightController />
        <primitive scale={3.0} position={[0, 0, 0]} object={model2.scene}></primitive>
        
        <primitive 
        scale={0.01}
        position={[0, 0, 0]}
        object={model}
        onClick={ (event) =>
        {
            // target = clicked_location.position 
            setNewMessage(event.object.name)
            handleSubmit(event)
            event.object.material.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`)
            event.stopPropagation()
        } }

        onPointerEnter={ () => { document.body.style.cursor = 'pointer' } }
        onPointerLeave={ () => { document.body.style.cursor = 'default' } }
    
        />

        <mesh>
            <primitive scale={0.01} position={[0, 0, 0]} object={model.children[106]}></primitive>
            <meshStandardMaterial map={texture}/>
        </mesh>

    </>

    
    )
}

export default MyElement3D