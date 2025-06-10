import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LinkedInCallback = () => {
    const location = useLocation();

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');
        if (code) {
            window.opener.postMessage({ code }, 'http://localhost:3000');
            window.close();
        }
    }, [location]);

    return null;
};

export default LinkedInCallback;