import { useState, useEffect } from 'react';
import {addDoc, collection, onSnapshot, serverTimestamp, query, where, orderBy} from 'firebase/firestore';
import {auth, db } from '../firebase-config';

export const Chat = (props) => {
    const {room} = props;
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesRef = collection(db, 'messages');

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


    const handleSubmit = async (e) => {
        e.preventDefault();

        //Message가 비어있으면 아무것도 하지 않음
        if(newMessage === '') return;

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            uid: auth.currentUser.uid,
            room,
        });

        setNewMessage('');
    }

    return (
        <div className = "chat-app">
            <div className = "header">
                <h1> Welcome to : {room} </h1>
            </div>
            <div className='messages'>
            {messages.map((message) => (
                <div className='message' key={message.id}>
                <span className='user'> {message.uid}</span>
                {message.text}
                </div>
            ))}
            </div>
            <form onSubmit={handleSubmit} className="new-message-form">
                <input 
                className="new-message-input" 
                placeholder="Type your message here..."
                onChange = {(e) => setNewMessage(e.target.value)}
                value = {newMessage}/>
                <button type="submit" className="send-button">
                    Send
                </button>
            </form>
        </div>
    )
}