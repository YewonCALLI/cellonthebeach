import React, { useState, useRef } from 'react';
import "./App.css";
import { Auth } from './components/Auth';
import Cookies from 'universal-cookie';
import {Chat } from './components/Chat';
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';
import "./css/intro.css"
const cookies = new Cookies();

function Room(){
    const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
    const [room, setRoom] = useState(null);

    const roomInputRef = useRef(null);

    console.log(isAuth);

    const signUserOut = async () => {
        await signOut(auth);
        cookies.remove("auth-token");
        setIsAuth(false);
    }

    if(!isAuth){
        return(
        <div>
            <Auth setIsAuth={setIsAuth}/>
        </div>
        )
    }
    return(
        <>{
            room ? (
                <Chat room={room}/>
            ) : (
                <div className='background'>
                    <div className="loading">
                        <div class="loader"></div>
                    </div>

                    <div className='title'>
                        접속되었습니다.
                    </div>

                    <div className='room'>
                        <label>Enter Room Name: </label>
                        <input ref={roomInputRef}/>
                        <button onClick={() => setRoom(roomInputRef.current.value)}>
                            Enter Chat
                        </button>
                    </div>
                </div>
            )
            }
            <div className='sign-out'>
                <button onClick={signUserOut}>Sign Out</button>
            </div>        
        </>
    )
}

export default Room; 