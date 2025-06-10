
import datetime
from django.shortcuts import render
from rest_framework.views import APIView
from django.conf import settings
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from social_django.utils import load_strategy
from social_core.backends.facebook import FacebookOAuth2
from django.contrib.auth import get_user_model
import requests
from django.http import HttpResponse
import base64
from django.shortcuts import redirect
import urllib.parse
from rest_framework.decorators import api_view
from django.contrib.auth.models import User  # Use default User model
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
# accounts/views.py
from django.http import JsonResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
import requests
from django.utils.decorators import method_decorator
import json
from datetime import datetime




# Update the credentials at the top of the file
FACEBOOK_APP_ID = '10091952917526567'
FACEBOOK_APP_SECRET = 'fb48b09a5d16ca133b6d8254a59ae963'

INSTAGRAM_APP_ID = '1239687471059342'
INSTAGRAM_APP_SECRET = 'c741ad9e4be85144837940b63d8ec5a2'
INSTAGRAM_REDIRECT_URI="http://localhost:3000/instagram-callback/"
# LinkedIn credentials
CLIENT_ID = "86e36wve52muat"
CLIENT_SECRET = "WPL_AP1.Ll0mJ95VG9bZJSf2.WrN+Mw=="


class FacebookLoginView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Generate Facebook OAuth URL"""
        fb_auth_url = "https://www.facebook.com/v18.0/dialog/oauth"
        params = {
            "client_id": FACEBOOK_APP_ID,  # Use direct ID instead of settings
            "redirect_uri": "http://localhost:3000/facebook-callback",
            "scope": "email,public_profile",  # Updated scopes
            "response_type": "code",
            "state": request.GET.get('state', '')
        }
        auth_url = f"{fb_auth_url}?{urllib.parse.urlencode(params)}"
        return Response({"auth_url": auth_url})

class FacebookCallbackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            code = request.data.get("code")
            if not code:
                print("\n❌ Error: No authorization code provided")
                return Response({"error": "Authorization code not provided"}, status=400)

            # Exchange short-lived token
            token_url = "https://graph.facebook.com/v18.0/oauth/access_token"
            params = {
                "client_id": FACEBOOK_APP_ID,
                "client_secret": FACEBOOK_APP_SECRET,
                "redirect_uri": settings.FACEBOOK_REDIRECT_URI,
                "code": code
            }
            
            print("\n" + "="*70)
            print("🔄 FACEBOOK TOKEN EXCHANGE PROCESS")
            print("="*70)
            print("Step 1: Exchanging code for short-lived token...")
            
            token_response = requests.get(token_url, params=params)
            token_data = token_response.json()
            
            if "access_token" not in token_data:
                print("\n❌ Short-lived token exchange failed:", token_data)
                return Response({
                    "error": "Facebook token exchange failed",
                    "details": token_data
                }, status=400)

            short_lived_token = token_data["access_token"]
            
            # Exchange for long-lived token
            long_lived_token_url = "https://graph.facebook.com/v18.0/oauth/access_token"
            long_lived_params = {
                "grant_type": "fb_exchange_token",
                "client_id": FACEBOOK_APP_ID,
                "client_secret": FACEBOOK_APP_SECRET,
                "fb_exchange_token": short_lived_token
            }
            
            print("\nStep 2: Exchanging for long-lived token...")
            
            long_lived_response = requests.get(long_lived_token_url, params=long_lived_params)
            long_lived_data = long_lived_response.json()
            
            if "access_token" not in long_lived_data:
                print("\n❌ Long-lived token exchange failed:", long_lived_data)
                return Response({
                    "error": "Long-lived token exchange failed",
                    "details": long_lived_data
                }, status=400)

            access_token = long_lived_data["access_token"]
            
            # Print final token details
            print("\n" + "="*70)
            print("✅ FACEBOOK TOKEN EXCHANGE SUCCESSFUL")
            print("="*70)
            print(f"SHORT-LIVED TOKEN: {short_lived_token[:30]}...")
            print(f"LONG-LIVED TOKEN: {access_token[:30]}...")
            print(f"EXPIRES IN: {long_lived_data.get('expires_in')} seconds")
            print("="*70 + "\n")

            # Get user info
            user_info = self.get_user_info(access_token)
            
            return Response({
                "status": "success",
                "access_token": access_token,
                "token_type": long_lived_data.get("token_type", "bearer"),
                "expires_in": long_lived_data.get("expires_in"),
                "user_info": user_info
            })

        except Exception as e:
            print(f"\n❌ Error during token exchange: {str(e)}")
            return Response({
                "error": "Facebook authentication failed",
                "details": str(e)
            }, status=400)

    def get_user_info(self, access_token):
        """Helper method to get user info from Facebook"""
        user_info_url = "https://graph.facebook.com/me"
        params = {
            "fields": "id,name,email,picture",
            "access_token": access_token
        }
        response = requests.get(user_info_url, params=params)
        return response.json()

    def options(self, request, *args, **kwargs):
        """Handle OPTIONS requests for CORS"""
        response = Response()
        response["Access-Control-Allow-Origin"] = settings.FRONTEND_URL
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response["Access-Control-Allow-Credentials"] = "true"
        return Response



# @method_decorator(csrf_exempt, name='dispatch')
# class FacebookTokenExchangeView(APIView):
#     permission_classes = [AllowAny]
    
#     def post(self, request):
#         try:
#             access_token = request.data.get("access_token")
#             if not access_token:
#                 return Response({"error": "Access token required"}, status=400)

#             # Exchange for long-lived token
#             exchange_url = "https://graph.facebook.com/v18.0/oauth/access_token"
#             params = {
#                 "grant_type": "fb_exchange_token",
#                 "client_id": FACEBOOK_APP_ID,
#                 "client_secret": FACEBOOK_APP_SECRET,
#                 "fb_exchange_token": access_token
#             }
            
#             print("\n" + "="*70)
#             print("🔄 FACEBOOK TOKEN EXCHANGE PROCESS")
#             print("="*70)
#             print(f"Short-lived token: {access_token[:30]}...")
            
#             response = requests.get(exchange_url, params=params)
#             data = response.json()
            
#             if 'access_token' in data:
#                 long_lived_token = data['access_token']
#                 print("\n✅ LONG-LIVED TOKEN RECEIVED")
#                 print("="*70)
#                 print(f"Long-lived token: {long_lived_token[:30]}...")
#                 print(f"Expires in: {data.get('expires_in')} seconds")
#                 print("="*70 + "\n")
                
#                 return Response({
#                     "status": "success",
#                     "long_lived_token": long_lived_token,
#                     "expires_in": data.get("expires_in")
#                 })
#             else:
#                 print("\n❌ Token Exchange Failed:", data)
#                 return Response({
#                     "error": "Failed to exchange token",
#                     "details": data
#                 }, status=400)
                
#         except Exception as e:
#             print(f"\n❌ Error during token exchange: {str(e)}")
#             return Response({"error": str(e)}, status=500)

#     def options(self, request, *args, **kwargs):
#         response = Response()
#         response["Access-Control-Allow-Origin"] = "http://localhost:3000"
#         response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
#         response["Access-Control-Allow-Headers"] = "Content-Type"
#         response["Access-Control-Allow-Credentials"] = "true"
#         return response
 

@api_view(['POST'])
@csrf_exempt
def facebook_token_exchange(request):
    try:
        print("\n" + "="*70)
        print("🔄 FACEBOOK TOKEN EXCHANGE PROCESS")
        print("="*70)
        code = request.data.get('code')
        redirect_uri = request.data.get('redirect_uri')
        print(f"Code: {code}")
        print(f"Redirect URI: {redirect_uri}")
        print("="*70 + "\n")
        
        token_url = 'https://graph.facebook.com/v18.0/oauth/access_token'
        response = requests.get(token_url, params={
            'client_id': settings.SOCIAL_AUTH_FACEBOOK_KEY,
            'client_secret': settings.SOCIAL_AUTH_FACEBOOK_SECRET,
            'code': code,
            'redirect_uri': redirect_uri
        })
        
        data = response.json()
        
        if 'access_token' in data:
            print("\n" + "="*70)
            print("✅ FACEBOOK ACCESS TOKEN DETAILS")
            print("="*70)
            print(f"ACCESS TOKEN: {data['access_token']}")
            print(f"TOKEN TYPE: {data.get('token_type', 'Bearer')}")
            print(f"EXPIRES IN: {data.get('expires_in')} seconds")
            print("="*70 + "\n")
            
            return JsonResponse(data)
        
        print("\n❌ Token Exchange Failed:")
        print(json.dumps(data, indent=2))
        return JsonResponse({'error': 'Failed to get access token'}, status=400)
    
    except Exception as e:
        print(f"\n❌ Error in token exchange: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
        
# accounts/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import requests
import logging

# Setup logging
logger = logging.getLogger(__name__)


# Update Instagram login view
@method_decorator(csrf_exempt, name='dispatch')
class InstagramLoginView(APIView):
    permission_classes = [AllowAny]
 
    def get(self, request):
        """Generate Instagram OAuth URL"""
        params = {
            "client_id": INSTAGRAM_APP_ID,
            "redirect_uri": INSTAGRAM_REDIRECT_URI,
            "scope": "instagram_basic,instagram_content_publish,pages_show_list",  # Updated scope for Instagram
            "response_type": "code",
            "state": request.GET.get('state', '')
        }
       
        print("\n" + "="*70)
        print("🚀 NEW INSTAGRAM AUTH REQUEST")
        print("="*70)
        print(f"App ID: {INSTAGRAM_APP_ID}")
        print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*70 + "\n")
       
        # Use Instagram's specific endpoint
        auth_url = f"https://api.instagram.com/oauth/authorize?{urllib.parse.urlencode(params)}"
        return Response({"auth_url": auth_url, "auto_close": True})
 
@method_decorator(csrf_exempt, name='dispatch')
class InstagramCallbackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({"error": "No code provided"}, status=400)

        # Exchange code for token using Facebook's endpoint
        token_url = 'https://graph.facebook.com/v18.0/oauth/access_token'
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': INSTAGRAM_REDIRECT_URI,
            'client_id': INSTAGRAM_APP_ID,
            'client_secret': INSTAGRAM_APP_SECRET,
        }

        try:
            response = requests.post(token_url, data=data)
            token_data = response.json()

            if 'access_token' not in token_data:
                print(f"\n❌ Error: Failed to retrieve access token. Response: {json.dumps(token_data, indent=2)}")
                return Response({
                    "error": "Failed to retrieve access token",
                    "response": token_data
                }, status=400)

            access_token = token_data['access_token']
            expires_in = token_data.get('expires_in', 'N/A')
            token_type = token_data.get('token_type', 'Bearer')

            # Enhanced terminal printing
            print("\n" + "="*100)
            print(f"✅ INSTAGRAM ACCESS TOKEN RECEIVED AT {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print("="*100)
            print(f"ACCESS TOKEN: {access_token}")
            print(f"TOKEN TYPE: {token_type}")
            print(f"EXPIRES IN: {expires_in} seconds")
            print("="*100)

            # Get user info
            user_info = self.get_user_info(access_token)
            if user_info:
                print("\n" + "="*100)
                print("✅ USER INFORMATION RECEIVED")
                print("="*100)
                print(f"USERNAME: {user_info.get('username', 'N/A')}")
                print(f"USER ID: {user_info.get('id', 'N/A')}")
                print(f"ACCOUNT TYPE: {user_info.get('account_type', 'N/A')}")
                print(f"MEDIA COUNT: {user_info.get('media_count', 'N/A')}")
                print("="*100)

            response = Response({
                'status': 'success',
                'access_token': access_token,
                'token_type': token_type,
                'expires_in': expires_in,
                'user_info': user_info
            })

            response["Access-Control-Allow-Origin"] = "http://localhost:3000"
            response["Access-Control-Allow-Credentials"] = "true"

            return response

        except Exception as e:
            print(f"\n❌ Error during Instagram token exchange: {str(e)}")
            print(f"Error Details: {json.dumps(getattr(e, 'response', {}).get('json', {}), indent=2) if hasattr(e, 'response') else str(e)}")
            return Response({
                'error': 'Token exchange failed',
                'details': str(e)
            }, status=400)

    def get_user_info(self, access_token):
        # Get basic user info from Instagram
        user_url = 'https://graph.instagram.com/me'
        params = {
            'fields': 'id,username,account_type,media_count',
            'access_token': access_token
        }

        try:
            response = requests.get(user_url, params=params)
            return response.json()
        except Exception as e:
            print(f"❌ Error fetching user info: {str(e)}")
            return None
 

 
@method_decorator(csrf_exempt, name='dispatch')
class InstagramTokenExchangeView(APIView):
    permission_classes = [AllowAny]
 
    def post(self, request):
        access_token = request.data.get("access_token")
        if not access_token:
            return Response({"error": "Access token required"}, status=400)
 
        exchange_url = 'https://graph.instagram.com/access_token'
        params = {
            'grant_type': 'ig_exchange_token',
            'client_secret': INSTAGRAM_APP_SECRET,
            'access_token': access_token
        }
 
        try:
            response = requests.get(exchange_url, params=params)
            data = response.json()
 
            if 'access_token' in data:
                return Response({
                    "status": "success",
                    "long_lived_token": data["access_token"],
                    "expires_in": data.get("expires_in", None)
                })
            else:
                return Response({"error": "Failed to exchange token", "details": data}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500) 
    
import requests
import logging
import json
from django.shortcuts import redirect
import threading
import time
from django.http import JsonResponse
from django.conf import settings
from urllib.parse import urlencode
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

logger = logging.getLogger(__name__)

# LinkedIn API URLs and Credentials
LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
LINKEDIN_ACCESS_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"

# LinkedIn App Credentials
CLIENT_ID = "86e36wve52muat"
CLIENT_SECRET = "WPL_AP1.Ll0mJ95VG9bZJSf2.WrN+Mw=="
LINKEDIN_REDIRECT_URI = "http://localhost:3000/linkedin-callback"
 
# Update LinkedIn scopes to match developer app settings
LINKEDIN_SCOPES = [
 
'openid',
 
'profile',
 
'w_member_social',
 
'email'
 
]
 
@method_decorator(csrf_exempt, name='dispatch')
class LinkedInLoginView(APIView):
    permission_classes = [AllowAny]
 
    def get(self, request):
        """Generate LinkedIn OAuth URL"""
        state = request.GET.get('state', '')
        params = {
            "response_type": "code",
            "client_id": CLIENT_ID,
            "redirect_uri": LINKEDIN_REDIRECT_URI,
            "state": state,
            "scope": " ".join(LINKEDIN_SCOPES)
        }
        auth_url = f"{LINKEDIN_AUTH_URL}?{urlencode(params)}"
        return Response({"auth_url": auth_url})
 
class LinkedInCallbackView(APIView):
    permission_classes = [AllowAny]
 
    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({"error": "No code provided"}, status=400)
 
        token_url = "https://www.linkedin.com/oauth/v2/accessToken"
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': LINKEDIN_REDIRECT_URI,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
        }
 
        try:
            response = requests.post(token_url, data=data)
            token_data = response.json()
           
            # Enhanced terminal printing
            print("\n" + "="*100)
            print("🔵 LINKEDIN ACCESS TOKEN DETAILS")
            print("="*100)
            print(f"ACCESS TOKEN: {token_data.get('access_token')}")
            print(f"EXPIRES IN: {token_data.get('expires_in')} seconds")
            print(f"REDIRECT URI: {data['redirect_uri']}")
            print("="*100 + "\n")
 
            if not token_data.get('access_token'):
                return Response({
                    "error": "Failed to retrieve access token",
                    "response": token_data
                }, status=400)
 
            response = Response({
                'status': 'success',
                'access_token': token_data.get('access_token'),
                'expires_in': token_data.get('expires_in')
            })
           
            response["Access-Control-Allow-Origin"] = "http://localhost:3000"
            response["Access-Control-Allow-Credentials"] = "true"
            return response
 
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            return Response({'error': str(e)}, status=500)
 
    def options(self, request, *args, **kwargs):
        response = Response()
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        response["Access-Control-Allow-Credentials"] = "true"
        return response
# Step 3: Optional - Exchange code for a token (alternate method for post requests)
@method_decorator(csrf_exempt, name='dispatch')
class LinkedInTokenExchangeView(APIView):
    permission_classes = [AllowAny]
 
    def post(self, request):
        try:
            code = request.data.get('code')
            if not code:
                return Response({'error': 'Authorization code required'}, status=400)
 
            # Exchange code with LinkedIn
            token_url = 'https://www.linkedin.com/oauth/v2/accessToken'
            params = {
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'redirect_uri': 'http://localhost:3000/linkedin-callback',
                'grant_type': 'authorization_code',
                'code': code
            }

            print("\n" + "="*70)
            print("🔄 LINKEDIN TOKEN EXCHANGE PROCESS")
            print("="*70)
            print(f"Code: {code[:30]}...")
            print(f"Redirect URI: {params['redirect_uri']}")
            print("="*70 + "\n")
 
            token_response = requests.post(
                token_url,
                data=params,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
 
            token_data = token_response.json()
 
            if 'access_token' not in token_data:
                print("\n❌ LinkedIn token exchange failed:", token_data)
                return Response({
                    'error': 'LinkedIn token exchange failed',
                    'details': token_data
                }, status=400)
 
            access_token = token_data['access_token']
           
            # Enhanced terminal printing
            print("\n" + "="*70)
            print("✅ LINKEDIN ACCESS TOKEN RECEIVED")
            print("="*70)
            print(f"ACCESS TOKEN: {access_token}")
            print(f"TOKEN TYPE: {token_data.get('token_type', 'Bearer')}")
            print(f"EXPIRES IN: {token_data.get('expires_in')} seconds")
            print("="*70 + "\n")
 
            # Get user info
            user_info = self.get_user_info(access_token)
 
            response = Response({
                'status': 'success',
                'access_token': access_token,
                'token_type': token_data.get('token_type', 'bearer'),
                'expires_in': token_data.get('expires_in'),
                'user_info': user_info
            })
           
            response["Access-Control-Allow-Origin"] = "http://localhost:3000"
            response["Access-Control-Allow-Credentials"] = "true"
           
            return response
 
        except Exception as e:
            print(f"\n❌ Error during LinkedIn token exchange: {str(e)}\n")
            return Response({
                'error': 'Token exchange failed',
                'details': str(e)
            }, status=400)
 
    def get_user_info(self, access_token):
        """Get basic user info from LinkedIn"""
        user_url = 'https://api.linkedin.com/v2/me'
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json',
        }
        params = {
            'fields': 'id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams)'
        }
        return requests.get(user_url, headers=headers, params=params).json()
 
    def options(self, request, *args, **kwargs):
        """Handle CORS preflight requests"""
        response = Response()
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Credentials"] = "true"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

@method_decorator(csrf_exempt, name='dispatch')
class LinkedInShareView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            access_token = request.data.get('access_token')
            message = request.data.get('message')
            
            if not access_token or not message:
                return Response({
                    'error': 'Both access_token and message are required'
                }, status=400)
            
            # LinkedIn Share API endpoint
            share_url = 'https://api.linkedin.com/v2/ugcPosts'
            
            # Prepare the post content
            post_data = {
                "author": f"urn:li:person:{self.get_user_id(access_token)}",
                "lifecycleState": "PUBLISHED",
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {
                            "text": message
                        },
                        "shareMediaCategory": "NONE"
                    }
                },
                "visibility": {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                }
            }
            
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            }
            
            response = requests.post(share_url, json=post_data, headers=headers)
            response_data = response.json()
            
            if response.status_code == 201:
                return Response({
                    'status': 'success',
                    'post_id': response_data.get('id')
                })
            else:
                return Response({
                    'error': 'Failed to create post',
                    'details': response_data
                }, status=response.status_code)
                
        except Exception as e:
            return Response({
                'error': 'Failed to create LinkedIn post',
                'details': str(e)
            }, status=500)
    
    def get_user_id(self, access_token):
        """Get LinkedIn user ID from access token"""
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json',
        }
        response = requests.get('https://api.linkedin.com/v2/me', headers=headers)
        return response.json().get('id')
    
    def options(self, request, *args, **kwargs):
        response = Response()
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        response["Access-Control-Allow-Credentials"] = "true"
        return response


# Test endpoint to trigger Instagram OAuth and print access token
@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(ensure_csrf_cookie, name='dispatch')
class InstagramTestView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        print("\n" + "="*100)
        print("Starting Instagram OAuth Test")
        print("="*100)
        
        # Get the Instagram OAuth URL
        params = {
            "client_id": INSTAGRAM_APP_ID,
            "redirect_uri": INSTAGRAM_REDIRECT_URI,
            "scope": "instagram_basic,instagram_content_publish,pages_show_list",
            "response_type": "code",
            "state": "test_state"
        }
        
        auth_url = f"https://api.instagram.com/oauth/authorize?{urllib.parse.urlencode(params)}"
        print(f"\nOpening Instagram OAuth URL: {auth_url}")
        print("="*100)
        
        # Open the browser to start the OAuth flow
        webbrowser.open(auth_url)
        
        # Start a background thread to monitor the callback URL
        def monitor_callback():
            while True:
                try:
                    # Check if we have received the callback
                    if hasattr(self, 'access_token'):
                        print("\n" + "="*100)
                        print("✅ Instagram OAuth Flow Completed Successfully!")
                        print("="*100)
                        print(f"ACCESS TOKEN: {self.access_token}")
                        print("="*100)
                        break
                except Exception as e:
                    print(f"Error monitoring callback: {str(e)}")
                time.sleep(1)
        
        threading.Thread(target=monitor_callback, daemon=True).start()
        
        return Response({
            "status": "success",
            "message": "Instagram OAuth flow initiated. Check browser for login."
        })

    def post(self, request):
        # This will be called when the callback URL is hit
        code = request.data.get('code')
        if code:
            try:
                # Exchange code for token
                token_url = 'https://graph.facebook.com/v18.0/oauth/access_token'
                data = {
                    'grant_type': 'authorization_code',
                    'code': code,
                    'redirect_uri': INSTAGRAM_REDIRECT_URI,
                    'client_id': INSTAGRAM_APP_ID,
                    'client_secret': INSTAGRAM_APP_SECRET,
                }
                
                response = requests.post(token_url, data=data)
                token_data = response.json()
                
                if 'access_token' in token_data:
                    self.access_token = token_data['access_token']
                    return Response({
                        "status": "success",
                        "access_token": token_data['access_token']
                    })
                else:
                    return Response({
                        "error": "Failed to get access token",
                        "details": token_data
                    }, status=400)
            except Exception as e:
                return Response({
                    "error": str(e)
                }, status=400)
        return Response({"error": "No code provided"}, status=400)
