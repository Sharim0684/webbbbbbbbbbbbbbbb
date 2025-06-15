import { AuthService } from '../services/authService';

export const OAuthService = {
    currentPlatform: null,
    currentToken: null,
    tokenExpiry: null,

    async authorize(platform) {
        try {
            // First get authentication token
            const token = await AuthService.getToken();
            const response = await fetch(`${AuthService.BASE_URL}/auth/${platform}/authorize/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Authorization failed');
            }

            const data = await response.json();
            const authUrl = data.authorization_url;
            
            // Open authorization in a new window
            const authWindow = window.open(authUrl, '_blank', 'width=600,height=800');
            
            // Listen for callback message
            window.addEventListener('message', async (event) => {
                if (event.origin !== 'http://127.0.0.1:8000') return;
                
                try {
                    // Exchange code for token
                    const exchangeResponse = await fetch(`${AuthService.BASE_URL}/${platform}/token-exchange/`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            code: event.data.code,
                            redirect_uri: event.data.redirect_uri
                        })
                    });

                    if (!exchangeResponse.ok) {
                        throw new Error('Token exchange failed');
                    }

                    const tokenData = await exchangeResponse.json();
                    localStorage.setItem(`${platform}Token`, tokenData.access_token);
                    localStorage.setItem(`${platform}Expiry`, Date.now() + tokenData.expires_in * 1000);
                    
                    // Update user platforms
                    await this.updateUserPlatforms();
                } catch (error) {
                    console.error('Callback error:', error);
                    throw error;
                }
            }, { once: true });
        } catch (error) {
            console.error('Authorization error:', error);
            throw error;
        }
    },

    async getPlatformCredentials(platform) {
        try {
            const token = await AuthService.getToken();
            const response = await fetch(`${AuthService.BASE_URL}/social/get-credentials/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ platform })
            });

            if (!response.ok) {
                throw new Error('Failed to get platform credentials');
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting platform credentials:', error);
            throw error;
        }
    },

    async updateUserPlatforms() {
        try {
            const token = await AuthService.getToken();
            const response = await fetch(`${AuthService.BASE_URL}/user-platforms/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user platforms');
            }

            const platforms = await response.json();
            localStorage.setItem('userPlatforms', JSON.stringify(platforms));
            return platforms;
        } catch (error) {
            console.error('Error updating user platforms:', error);
            throw error;
        }
    }
};
