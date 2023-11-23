import React, { useState, useRef } from 'react';
import "./App.css";
import { Auth } from './components/Auth';
import Cookies from 'universal-cookie';
import {Chat } from './components/Chat';
const cookies = new Cookies();

function Room(){
    const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
    const [room, setRoom] = useState(null);

    const roomInputRef = useRef(null);

    console.log(isAuth);

    if(!isAuth){
        return(
        <div>
            <Auth setIsAuth={setIsAuth}/>
        </div>
        )
    }
    return(
        <div>{
            room ? (
                <Chat room={room}/>
            ) : (
                <div className='room'>
                    <label>Enter Room Name: </label>
                    <input ref={roomInputRef}/>
                    <button onClick={() => setRoom(roomInputRef.current.value)}>
                        Enter Chat
                    </button>
                </div>
            )
            }        
        </div>
    )
}

export default Room; 