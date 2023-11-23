import { getAuth, signInAnonymously, signOut } from 'firebase/auth';
import { useState } from 'react';
import { auth, provider } from '../firebase-config';
import Cookies from 'universal-cookie'
import "../css/intro.css"
const cookies = new Cookies()

export const Auth = (props) => {
    const {setIsAuth} = props;
    const [user, setUser] = useState(null);
    const handleAnonymousSignIn = async () => {
        try{
          // 로그인 성공 시 호출되는 콜백
          const result = await signInAnonymously(auth, provider);
          cookies.set("auth-token", result.user.refreshToken)
          setIsAuth(true);
        }
        catch(error){
          // 로그인 실패 시 호출되는 콜백
          console.error('익명 로그인 실패:', error);
        };
    };
  
    const handleSignOut = () => {
      signOut(auth)
        try {
          // 로그아웃 성공 시 호출되는 콜백
          setUser(null);
        }
        catch(error){
          // 로그아웃 실패 시 호출되는 콜백
          console.error('로그아웃 실패:', error);
        };
    };
  
    return (
      <div className='background'>
        {user ? (
          <div>
            <p>로그인된 사용자: {user.uid}</p>
            <button onClick={handleSignOut}>로그아웃</button>
          </div>
        ) : (
          <button className="login" onClick={handleAnonymousSignIn}>login in to <br/> Cell on the beach</button>
        )}
      </div>
    );
};
  
