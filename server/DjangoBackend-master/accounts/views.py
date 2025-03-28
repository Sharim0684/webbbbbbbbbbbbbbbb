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

User = get_user_model()
FACEBOOK_APP_ID = settings.SOCIAL_AUTH_FACEBOOK_KEY
FACEBOOK_APP_SECRET = settings.SOCIAL_AUTH_FACEBOOK_SECRET
REDIRECT_URI = "https://127.0.0.1:8000/accounts/facebook/callback/"
# Create your views 
class FacebookLoginView(APIView):
    def get(self, request):
        """Redirects user to Facebook Login"""
        fb_auth_url = "https://www.facebook.com/v18.0/dialog/oauth"
        params = {
            "client_id": FACEBOOK_APP_ID,
            "redirect_uri": REDIRECT_URI,
            "scope": "email,public_profile",
            "response_type": "code",
        }
        auth_url = f"{fb_auth_url}?{urllib.parse.urlencode(params)}"
        return redirect(auth_url)

class FacebookCallbackView(APIView):
    def get(self, request):
        """Handles Facebook Callback and returns user info"""
        code = request.GET.get("code")
        if not code:
            return Response({"error": "Authorization code not provided"}, status=400)

        # Exchange code for access token
        token_url = "https://graph.facebook.com/v18.0/oauth/access_token"
        params = {
            "client_id": FACEBOOK_APP_ID,
            "client_secret": FACEBOOK_APP_SECRET,
            "redirect_uri": REDIRECT_URI,
            "code": code,
        }
        token_response = requests.get(token_url, params=params).json()

        if "access_token" not in token_response:
            return Response({"error": "Failed to get access token", "details": token_response}, status=400)

        access_token = token_response["access_token"]

        # Get user info from Facebook
        user_info_url = "https://graph.facebook.com/me"
        user_info_params = {
            "fields": "id,name,email",
            "access_token": access_token,
        }
        user_info = requests.get(user_info_url, params=user_info_params).json()

        return Response({
            "message": "Successfully logged in with Facebook",
            "user_info": {
                "facebook_id" : user_info.get("id"),
                "name" : user_info.get("name"),
                "email": user_info.get("email", "Email not provided"),
            },
            "access_token": access_token,
        })
        
INSTAGRAM_APP_ID = settings.SOCIAL_AUTH_INSTAGRAM_KEY
INSTAGRAM_APP_SECRET = settings.SOCIAL_AUTH_INSTAGRAM_SECRET
INSTAGRAM_REDIRECT_URI = "https://127.0.0.1:8000/accounts/instagram/callback/"

class InstagramLoginView(APIView):
    def get(self, request):
        """Redirect users to Instagram for authentication"""
        ig_auth_url = "https://api.instagram.com/oauth/authorize"
        params = {
            "client_id": INSTAGRAM_APP_ID,
            "redirect_uri": INSTAGRAM_REDIRECT_URI,
            "scope": "public_profile",
            "response_type": "code",
        }
        auth_url = f"{ig_auth_url}?{urllib.parse.urlencode(params)}"
        return redirect(auth_url)

class InstagramCallbackView(APIView):
    def get(self, request):
        """Exchange authorization code for access token"""
        code = request.GET.get("code")
        if not code:
            return Response({"error": "Authorization code not provided"}, status=400)

        token_url = "https://api.instagram.com/oauth/access_token"
        payload = {
            "client_id": INSTAGRAM_APP_ID,
            "client_secret": INSTAGRAM_APP_SECRET,
            "grant_type": "authorization_code",
            "redirect_uri": INSTAGRAM_REDIRECT_URI,
            "code": code,
        }

        token_response = requests.post(token_url, data=payload).json()

        if "access_token" not in token_response:
            return Response({"error": "Failed to get access token", "details": token_response}, status=400)

        access_token = token_response["access_token"]
        user_id = token_response["user_id"]

        # Get user profile details
        user_info_url = f"https://graph.instagram.com/{user_id}"
        user_params = {
            "fields": "id,username,account_type",
            "access_token": access_token,
        }
        user_info = requests.get(user_info_url, params=user_params).json()

        return Response({
            "message": "Successfully logged in with Instagram",
            "user_info": {
                "instagram_id": user_info.get("id"),
                "username": user_info.get("username"),
                "account_type": user_info.get("account_type"),
            },
            "access_token": access_token  # ✅ Returning access token for posting
        })
        
        
        
TWITTER_CLIENT_ID = settings.TWITTER_CLIENT_ID
TWITTER_CLIENT_SECRET = settings.TWITTER_CLIENT_SECRET
TWITTER_REDIRECT_URI = "https://127.0.0.1:8000/accounts/twitter/callback/"

class TwitterLoginView(APIView):
    def get(self, request):
        """Redirects user to Twitter Login"""
        twitter_auth_url = "https://twitter.com/i/oauth2/authorize"
        params = {
            "response_type": "code",
            "client_id": TWITTER_CLIENT_ID,
            "redirect_uri": TWITTER_REDIRECT_URI,
            "scope": "tweet.read users.read follows.read",
            "state": "random_state_string",
            "code_challenge": "challenge",
            "code_challenge_method": "plain",
        }
        auth_url = f"{twitter_auth_url}?{urllib.parse.urlencode(params)}"
        return redirect(auth_url)


class TwitterCallbackView(APIView):
    def get(self, request):
        """Handles Twitter Callback and returns user info"""
        code = request.GET.get("code")
        if not code:
            return Response({"error": "Authorization code not provided"}, status=400)

        token_url = "https://api.twitter.com/2/oauth2/token"
        
        # Encode client ID and secret
        client_id_secret = f"{TWITTER_CLIENT_ID}:{TWITTER_CLIENT_SECRET}"
        encoded_credentials = base64.b64encode(client_id_secret.encode()).decode()

        payload = {
            "grant_type": "authorization_code",
            "redirect_uri": TWITTER_REDIRECT_URI,
            "code": code,
            "code_verifier": "challenge",
        }

        headers = {
            "Authorization": f"Basic {encoded_credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
        }

        token_response = requests.post(token_url, data=payload, headers=headers).json()

        if "access_token" not in token_response:
            return Response({"error": "Failed to get access token", "details": token_response}, status=400)

        access_token = token_response["access_token"]

        user_info_url = "https://api.twitter.com/2/users/me"
        headers = {
            "Authorization": f"Bearer {access_token}",
        }

        user_info = requests.get(user_info_url, headers=headers).json()

        return Response({
            "message": "Successfully logged in with Twitter",
            "user_info": user_info,
            "access_token": access_token,
        })