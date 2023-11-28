import React, { useState, useRef } from 'react';
import "./App.css";
import { Auth } from './components/Auth';
import Cookies from 'universal-cookie';
import {Chat } from './components/Chat';
import { Canvas} from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';
import { Background } from './components/Background';
import MyElement3D from './MyElement3D';
import "./css/intro.css"
import "./css/room.css"
const cookies = new Cookies();

function Room(){
    const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
    const [room, setRoom] = useState(null);
    

    const roomInputRef = useRef(null);
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
            room ? (<>
                <div className='background'>
                    <div className='chat'>
                        <Chat room={room}/>
                    </div>

                    <Canvas shadows camera = {{position: [2, 0, 0], fov: 90}}>      
                        <MyElement3D room = {room}/>
                        <OrbitControls/>
                    </Canvas>
                </div>
                </>
            ) : (
                <div className='background'>
                    <div className="loading">
                        <div class="loader"></div>
                    </div>

                    <div className='title'>
                        접속되었습니다.
                    </div>

                    <div className='room'>
                        <label className='room_text'>Enter Room Name</label>
                        <div className='room_2'>
                            <input className= "room_input" ref={roomInputRef}/>
                            <button className= "room_complete" onClick={() => setRoom(roomInputRef.current.value)}>
                                ✦Start✦
                            </button>
                        </div>
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