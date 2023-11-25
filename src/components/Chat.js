import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
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

export const Chat = (props) => {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesRef = collection(db, "messages");

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
    const audio = new Audio("../sounds/background.m4a");
    audio.play();
  };

  const playKick = (path) => {
    const audio = new Audio("../sounds/kick.wav"); 
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

  console.log(loadedMessages)

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

  return (
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
  );
};
