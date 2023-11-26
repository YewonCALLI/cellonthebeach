import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs
} from "firebase/firestore";
import {
  Environment,
  OrbitControls,
  useGLTF,
  useAnimations,
  useFBX,
  useHelper,
} from "@react-three/drei";
import * as THREE from "three";
import { MyElement3D } from "../MyElement3D";
import { auth, db } from "../firebase-config.js";
import "../css/chat.css";
import { playBackground } from "./Background.js";




//Real Interaction Sound
export const Chat = (props) => {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesRef = collection(db, "messages");
  let i= 0;

  useEffect(() => {
    // 컴포넌트가 처음으로 마운트될 때 초기 메시지를 가져오기
    const fetchMessages = async () => {
      const queryMessages = query(
        messagesRef,
        where("room", "==", room),
        orderBy("createdAt")
      );

      const snapshot = await getDocs(queryMessages);
  

      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
        let messages = [];
        snapshot.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id });
        });
        setMessages(messages);
      });

      setLoadedMessages(messages);
    };

    fetchMessages();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    //Message가 비어있으면 아무것도 하지 않음
    if (newMessage === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid: auth.currentUser.uid,
      room,
    });

    setNewMessage("");
  };

  const playAudio = (path) => {
    const audio = new Audio("../sounds/ambientSound.wav");
    audio.play(0.1);
  };

  const playKick = (path) => {
    const audio = new Audio("../sounds/kick.wav"); 
    audio.play(0.1);
  }

  const [loadedMessages, setLoadedMessages] = useState([
    {
      text: messages,
      createdAt: serverTimestamp(),
      uid: auth.currentUser.uid,
      room,
    },
  ]);

  // const sound = () => {
  //   for (var i = 0; i < loadedMessages.length; i++) {
  //     if (loadedMessages[i].text == "pCube1") {
  //       playKick();
  //     }
  //   }
  // };

  // console.log(loadedMessages.length)
  var intervalId;
  setTimeout(function() {
  intervalId = setInterval(function() {
    while(i < loadedMessages.length){
      if(loadedMessages[i].text == "pCube1"){
        playKick();

      }
      else if(loadedMessages[i].text == "polySurface10"){
        playAudio();
      }
      console.log(loadedMessages[i].text);
      console.log(i);
      i++;
    }
  }, 100);
}, 15000);

  // 5초 후에 clearInterval() 함수를 사용하여 타이머 중지
  setTimeout(function() {
    clearInterval(intervalId);
  }, 60000);


  return (
    <>
    <playBackground/>
    <div className="chat-app">
      <div className="chat-title">Cell on the beach</div>

      <div className="header">
        <span> Welcome to : Room {room} </span>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <div className="message" key={message.id}>
            <span className="user"> {message.uid}님이 입장하였습니다. </span>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          className="new-message-input"
          placeholder="Type your message here..."
          onChange={(e) => setNewMessage(e.object.name)}
          value={newMessage}
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
    </>
  );
};

