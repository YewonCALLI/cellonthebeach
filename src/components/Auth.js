import { getAuth, signInAnonymously, signOut } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase-config.js';

export const Auth = () => {
    const [user, setUser] = useState(null);

    const handleAnonymousSignIn = () => {
        signInAnonymously(auth)
        .then((userCredential) => {
          // 로그인 성공 시 호출되는 콜백
          const { user } = userCredential;
          setUser(user);
        })
        .catch((error) => {
          // 로그인 실패 시 호출되는 콜백
          console.error('익명 로그인 실패:', error);
        });
    };
  
    const handleSignOut = () => {
      signOut(auth)
        .then(() => {
          // 로그아웃 성공 시 호출되는 콜백
          setUser(null);
        })
        .catch((error) => {
          // 로그아웃 실패 시 호출되는 콜백
          console.error('로그아웃 실패:', error);
        });
    };
  
    return (
      <div>
        {user ? (
          <div>
            <p>로그인된 사용자: {user.uid}</p>
            <button onClick={handleSignOut}>로그아웃</button>
          </div>
        ) : (
          <button onClick={handleAnonymousSignIn}>익명 로그인</button>
        )}
      </div>
    );
};
  
