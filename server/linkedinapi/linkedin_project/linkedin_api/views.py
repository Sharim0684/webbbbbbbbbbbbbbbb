from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from .linkedin_services import get_linkedin_email


from .serializers import (
    LinkedInAuthSerializer,
    LinkedInTokenSerializer,
    LinkedInProfileSerializer,
    LinkedInPostSerializer,
)

CLIENT_ID = "86embapip2hnsy"
CLIENT_SECRET = "WPL_AP1.UzATRB3rCrM44AYA.4sGm2g=="
REDIRECT_URI = "http://127.0.0.1:8000/linkedin_auth/callback/"
SCOPE = "openid profile w_member_social email"
@api_view(["GET"])
def linkedin_user_email(request):
    access_token = request.GET.get("access_token")
    if not access_token:
        return Response({"error": "Access token is required"}, status=400)

    email_data = get_linkedin_email(access_token)
    if email_data:
        return Response(email_data)
    return Response({"error": "Failed to fetch email"}, status=400)

# 1️ Get LinkedIn Authorization URL
@api_view(["GET"])
def linkedin_auth_url(request):
    auth_url = (
        "https://www.linkedin.com/oauth/v2/authorization"
        f"?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}"
        f"&scope={SCOPE.replace(' ', '%20')}"
    )
    return Response({"linkedin_auth_url": auth_url})

# 2️ Handle OAuth Callback & Get Access Token
@api_view(["POST"])
def linkedin_callback(request):
    serializer = LinkedInAuthSerializer(data=request.data)
    if serializer.is_valid():
        code = serializer.validated_data["code"]
        token_url = "https://www.linkedin.com/oauth/v2/accessToken"
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": REDIRECT_URI,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        }
        response = requests.post(token_url, data=data)
        if response.status_code == 200:
            return Response(response.json(), status=status.HTTP_200_OK)
        return Response(
            {"error": f"Failed to retrieve access token: {response.json()}"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 3️ Fetch LinkedIn Profile
@api_view(["GET"])
def linkedin_user_profile(request):
    serializer = LinkedInTokenSerializer(data=request.GET)
    if serializer.is_valid():
        access_token = serializer.validated_data["access_token"]
        headers = {
            "Authorization": f"Bearer {access_token}",
            "X-Restli-Protocol-Version": "2.0.0"  # Added required version header
        }
        profile_url = "https://api.linkedin.com/v2/me"

        response = requests.get(profile_url, headers=headers)
        if response.status_code == 200:
            profile_data = response.json()
            return Response(profile_data)
        return Response(
            {"error": f"Failed to fetch profile: {response.json()}"}, 
            status=response.status_code
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 4️ Post an Update on LinkedIn
@api_view(["POST"])
def linkedin_post_update(request):
    serializer = LinkedInPostSerializer(data=request.data)
    if serializer.is_valid():
        access_token = serializer.validated_data["access_token"]
        message = serializer.validated_data["message"]

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
        }

        user_id_url = "https://api.linkedin.com/v2/me"
        user_response = requests.get(user_id_url, headers=headers)

        if user_response.status_code != 200:
            return Response({"error": "Failed to fetch user ID"}, status=user_response.status_code)

        user_id = user_response.json().get("id")

        post_data = {
            "author": f"urn:li:person:{user_id}",
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {"text": message},
                    "shareMediaCategory": "NONE",
                }
            },
            "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
        }

        post_url = "https://api.linkedin.com/v2/ugcPosts"
        response = requests.post(post_url, json=post_data, headers=headers)

        if response.status_code == 201:
            return Response({"message": "Post created successfully"})
        return Response({"error": "Failed to create post"}, status=response.status_code)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
