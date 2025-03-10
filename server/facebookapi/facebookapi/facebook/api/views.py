from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import redirect
from django.conf import settings
from django.http import JsonResponse
from django.views import View
from rest_framework import status,request

from django.http import JsonResponse
from django.views import View

class FacebookLoginView(View):
    def get(self, request):
        return JsonResponse({"message": "GET method successful"})

    def post(self, request):
        return JsonResponse({"message": "POST method successful"})


class FacebookLoginAPIView(APIView):
    def get(self, request):
        facebook_redirect_url = (
            f"https://www.facebook.com/v17.0/dialog/oauth?"
            f"client_id={settings.SOCIAL_AUTH_FACEBOOK_KEY}"
            f"&redirect_uri=http://localhost:3000/social-auth/complete/facebook/"
            f"&scope=email"
        )
        return redirect(facebook_redirect_url)
    

    def post(self, request):
        access_token = request.data.get('access_token')
        if not access_token:
            return Response(
                {"error": "Access token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response({"message": "POST request received successfully"})

    
# class FacebookLoginAPIView(APIView):
#     def get(self, request):
#         facebook_redirect_url = (
#             f"https://www.facebook.com/v17.0/dialog/oauth?"
#             f"client_id={settings.SOCIAL_AUTH_FACEBOOK_KEY}"
#             f"&redirect_uri=http://localhost:3000/social-auth/complete/facebook/"  # Change 8000 to 3000
#             f"&scope=email"
#         )
#         return redirect(facebook_redirect_url)
