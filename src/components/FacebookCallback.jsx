import { useEffect } from 'react';

const FacebookCallback=()=>{
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        console.log(params)
    
        if (code && window.opener) {
          window.opener.postMessage({ code }, 'http://localhost:3000');
          window.close();
        }
      }, []);
    
      return <div>Logging in with Facebook...</div>;

}
export default FacebookCallback;

