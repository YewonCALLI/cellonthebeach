import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import {
  Environment,
  OrbitControls,
  useGLTF,
  useAnimations,
  useFBX,
  useHelper,
  useTexture,
} from "@react-three/drei";
import { DirectionalLightHelper, PointLightHelper } from "three";
import * as THREE from "three";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase-config.js";
import gsap from "gsap";
import "./css/chat.css";


const MyElement3D = (props) => {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = collection(db, "messages");

  const cube = useRef();
  const model = useFBX("./models/nuclear_final2.fbx");
  const model2 = useGLTF("./models/raw.glb");
  const pointLight = useRef();
  const pointLight1 = useRef();
  const directionalLight = useRef();
  const texture = useTexture("./images/texture.jpeg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.flipY = false;

  const mixer = new THREE.AnimationMixer(model);
  const animationClip = model.animations && model.animations[0];

  // useHelper(directionalLight, THREE.DirectionalLightHelper, 1, "teal");
  // useHelper(pointLight, THREE.PointLightHelper, 1, "teal");
  // useHelper(pointLight1, THREE.PointLightHelper, 1, "teal");

  const { camera } = useThree();
  if (animationClip) {
    animationClip.duration = 9;
    const action = mixer.clipAction(animationClip);
    action.play();
  }

  //FBX 애니메이션 프레임
  useFrame(() => {
    if (animationClip) {
      mixer.update(0.001);
    }
  });



  //카메라 애니메이션 프레임
  // useFrame((state, delta) => {
  //   const radius = 3; // 원의 반지름
  //   const speed = 0.2; // 원을 따라 도는 속도

  //   const theta = speed * state.clock.elapsedTime; // 현재 시간에 따른 각도 계산

  //   // 카메라 위치 업데이트
  //   camera.position.x = radius * Math.cos(-theta);
  //   camera.position.y = 2.5;
  //   camera.position.z = radius * Math.sin(-theta);

  //   // 카메라가 항상 (0,0,0)을 향하도록 설정
  //   camera.lookAt(0, 1, 0);
  // });


  console.log(model.children);

  const BasicMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#e6a0d2"),
    roughness: 1.0,
    flatShading: false,
  });

  const BasicMaterial2 = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#e6a0d2"),
    emissive: new THREE.Color("#e6a0d2"),
    emissiveIntensity: 0.5
  });

  const BasicMaterial3 = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#e6a0d2"),
    emissive: new THREE.Color("#e6a0d2"),
    emissiveIntensity: 0.5,
    visible: false
  });


  model.children[2].material = BasicMaterial3;
  model.children[14].material = BasicMaterial3;
  model.children[15].material = BasicMaterial3;
  model.children[16].material = BasicMaterial3;


  //Write all model.children's material to BasicMaterial with for loop
  model.children[5].material = BasicMaterial2;

  model.children[88].children[1].traverse((child) => {
    child.material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.5,
      metalness: 0.5,
    });
  });

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, []);


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
  
    }
  }, [loadedMessages]);

  const handleSubmit = async (e) => {
    // e.preventDefault();

    //Message가 비어있으면 아무것도 하지 않음
    if (newMessage === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid: auth.currentUser.uid,
      room,
    });
  };

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // const moveCamera = () => {
  //   gsap.to(
  //   camera.position, {
  //     duration: 3, // 이동하는 데 걸리는 시간 (초)
  //     x: 0,
  //     y: 1,
  //     z: 2, // 목표 위치
  //     ease: "power2.inOut", // 이징 함수 설정
  //   });
  // };

  // useEffect(() => {
  //   moveCamera(); // 페이지가 로드될 때 카메라 이동 애니메이션 실행
  // }, []);

  const LightController = (props) => (
    <>
      <directionalLight
        ref={directionalLight}
        castShadow
        position={[10, 10, 10]}
        intensity={1}
        shadow-camera-near={1}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <ambientLight intensity={0.8} />
      <pointLight
        ref={pointLight}
        castShadow
        position={[-10, 0, -20]}
        intensity={0.5}
        useHelper={false}
      />
      <pointLight
        ref={pointLight1}
        castShadow
        position={[0, 0, 0]}
        intensity={1.5}
        useHelper={false}
      />
    </>
  );


  return (
    <>     
      <Environment preset="sunset" />
      <LightController />

      <primitive
        scale={0.01}
        position={[0, 0, 0]}
        object={model}
        onClick={(event) => {
          // target = clicked_location.position
          setNewMessage(event.object.name);
          handleSubmit(event);
          camera.lookAt(event.object);

          event.object.material.color.set(
            `hsl(${Math.random() * 360}, 100%, 75%)`
          );
          event.stopPropagation();
        }}
        onPointerEnter={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          document.body.style.cursor = "default";
        }}
      />
    </>
  );
};

export default MyElement3D;


