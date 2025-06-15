const BASE_URL = 'http://127.0.0.1:8000/api';

// Initialize Facebook SDK if not already initialized
if (typeof window.FB === 'undefined') {
  window.fbAsyncInit = function() {
    window.FB.init({
      appId: process.env.REACT_APP_FACEBOOK_APP_ID,
      cookie: true,
      xfbml: true,
      version: 'v17.0'
    });
  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}

// LinkedIn API configuration
const LINKEDIN_API_CONFIG = {
  BASE_URL: 'https://api.linkedin.com/v2',
  UGC_POSTS_ENDPOINT: '/ugcPosts',
  USER_INFO_ENDPOINT: '/userinfo',
  ASSETS_ENDPOINT: '/assets?action=registerUpload'
};

export const SocialAuthService = {
  async getCredentials() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${BASE_URL}/social/get-credentials/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credentials');
      }

      const data = await response.json();
      return data.credentials;
    } catch (error) {
      console.error('Error fetching credentials:', error);
      throw error;
    }
  },

  async createPost(content, platforms, media = null) {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${BASE_URL}/social/post/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          platforms,
          media,
          enable_likes: true,
          enable_comments: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  async getAccessToken(platform) {
    try {
      const credentials = await this.getCredentials(platform);
      if (!credentials) {
        throw new Error(`No credentials found for ${platform}`);
      }

      // For Facebook and LinkedIn, we need to refresh the token if expired
      if (credentials.platform_name === 'facebook' || credentials.platform_name === 'linkedin') {
        const now = new Date();
        if (credentials.token_expires_at && new Date(credentials.token_expires_at) < now) {
          // Token is expired, need to refresh
          const refreshResponse = await fetch(`${BASE_URL}/social/refresh-token/`, {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('authToken')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              platform: platform,
              refresh_token: credentials.refresh_token
            })
          });

          if (!refreshResponse.ok) {
            throw new Error('Failed to refresh token');
          }

          const refreshedData = await refreshResponse.json();
          credentials.access_token = refreshedData.access_token;
          credentials.token_expires_at = refreshedData.expires_at;
        }
      }

      return credentials.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  },

  async postToFacebook(content, media) {
    try {
      const token = await this.getAccessToken('facebook');
      if (!token) {
        throw new Error('No access token available for Facebook');
      }

      // Verify media type if provided
      if (media) {
        if (!(media instanceof File || media instanceof Blob)) {
          throw new Error('Invalid media file type');
        }
      }

      const pageId = '632392123280191';
      
      if (media) {
        // For image posts
        const formData = new FormData();
        formData.append('message', content);
        formData.append('access_token', token);
        formData.append('source', media);

        const response = await fetch(`https://graph.facebook.com/v17.0/${pageId}/photos`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to post image to Facebook: ${errorData.error?.message || 'Unknown error'}`);
        }
      } else {
        // For text-only posts
        const response = await fetch(`https://graph.facebook.com/v17.0/${pageId}/feed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: content,
            access_token: token
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to post text to Facebook: ${errorData.error?.message || 'Unknown error'}`);
        }
      }

      return true;
    } catch (error) {
      console.error('Error posting to Facebook:', error);
      throw error;
    }
  },

  async postToLinkedIn(content, media) {
    try {
      const token = await this.getAccessToken('linkedin');
      if (!token) {
        throw new Error('No access token available for LinkedIn');
      }

      // Verify media type if provided
      if (media) {
        if (!(media instanceof File || media instanceof Blob)) {
          throw new Error('Invalid media file type');
        }
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202308'
      };

      // Get LinkedIn user info
      const userInfoResponse = await fetch(`${LINKEDIN_API_CONFIG.BASE_URL}${LINKEDIN_API_CONFIG.USER_INFO_ENDPOINT}`, {
        headers: headers
      });

      if (!userInfoResponse.ok) {
        const errorData = await userInfoResponse.json();
        throw new Error(`Failed to get LinkedIn user info: ${errorData.message || 'Unknown error'}`);
      }

      const userInfo = await userInfoResponse.json();
      const userUrn = userInfo.sub;

      if (media) {
        // Handle image upload
        const registerUploadResponse = await fetch(`${LINKEDIN_API_CONFIG.BASE_URL}${LINKEDIN_API_CONFIG.ASSETS_ENDPOINT}`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            registerUploadRequest: {
              recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
              owner: `urn:li:person:${userUrn}`,
              serviceRelationships: [{
                relationshipType: 'OWNER',
                identifier: 'urn:li:userGeneratedContent'
              }]
            }
          })
        });

        if (!registerUploadResponse.ok) {
          const errorData = await registerUploadResponse.json();
          throw new Error(`Failed to register LinkedIn image upload: ${errorData.message || 'Unknown error'}`);
        }

        const uploadData = await registerUploadResponse.json();
        const uploadUrl = uploadData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
        const assetId = uploadData.value.asset;

        // Upload the image
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/octet-stream'
          },
          body: media
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload LinkedIn image');
        }

        // Create post with image
        const postResponse = await fetch(`${LINKEDIN_API_CONFIG.BASE_URL}${LINKEDIN_API_CONFIG.UGC_POSTS_ENDPOINT}`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            author: `urn:li:person:${userUrn}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                  text: content
                },
                shareMediaCategory: 'IMAGE',
                media: [{
                  status: 'READY',
                  description: {
                    text: content
                  },
                  media: assetId,
                  title: {
                    text: 'Shared via Social Media Manager'
                  }
                }],
                visibility: {
                  'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
              }
            }
          })
        });

        if (!postResponse.ok) {
          const errorData = await postResponse.json();
          throw new Error(`Failed to create LinkedIn post with image: ${errorData.message || 'Unknown error'}`);
        }
      } else {
        // Create text-only post
        const postResponse = await fetch(`${LINKEDIN_API_CONFIG.BASE_URL}${LINKEDIN_API_CONFIG.UGC_POSTS_ENDPOINT}`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            author: `urn:li:person:${userUrn}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                  text: content
                },
                shareMediaCategory: 'NONE'
              }
            },
            visibility: {
              'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
          })
        });

        if (!postResponse.ok) {
          const errorData = await postResponse.json();
          throw new Error(`Failed to create LinkedIn text post: ${errorData.message || 'Unknown error'}`);
        }
      }

      return true;
    } catch (error) {
      console.error('Error posting to LinkedIn:', error);
      throw error;
    }
  }
};

export default SocialAuthService;
