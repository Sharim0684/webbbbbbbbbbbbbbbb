
import requests
import logging
from urllib.parse import urlencode
from django.shortcuts import redirect
from django.http import JsonResponse, HttpResponse
from django.conf import settings

logger = logging.getLogger(__name__)  # Setup logging

LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
LINKEDIN_ACCESS_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"

# def linkedin_login(request):
#     """ Generate LinkedIn Login URL """
#     auth_params = {
#         "response_type": "code",
#         "client_id": settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_KEY,
#         "redirect_uri": settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_REDIRECT_URI,
#         "scope": " ".join(settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_SCOPE),
#     }
#     auth_url = f"{LINKEDIN_AUTH_URL}?{urlencode(auth_params)}"
    
#     if request.headers.get('Accept') == 'application/json':
#         return JsonResponse({"linkedin_auth_url": auth_url})  # Postman support
    
#     return redirect(auth_url)

LINKEDIN_CLIENT_ID = "86embapip2hnsy"
LINKEDIN_REDIRECT_URI = "http://127.0.0.1:8000/api/linkedin_auth/callback/" 
def linkedin_login(request):
    auth_url = (
        f"https://www.linkedin.com/oauth/v2/authorization"
        f"?response_type=code"
        f"&client_id={LINKEDIN_CLIENT_ID}"
        f"&redirect_uri={LINKEDIN_REDIRECT_URI}"
        f"&scope=openid%20profile%20w_member_social%20email"
    )
    return redirect(auth_url)


# def linkedin_callback(request):
#     """ Handle LinkedIn OAuth Callback """
#     code = request.GET.get("code")
#     if not code:
#         return JsonResponse({"error": "Authorization code not found"}, status=400)

#     # Exchange authorization code for access token
#     token_data = {
#         "grant_type": "authorization_code",
#         "code": code,
#         "redirect_uri": settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_REDIRECT_URI,
#         "client_id": settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_KEY,
#         "client_secret": settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_SECRET,
#     }

#     headers = {"Content-Type": "application/x-www-form-urlencoded"}
    
#     try:
#         with requests.Session() as session:
#             token_response = session.post(LINKEDIN_ACCESS_TOKEN_URL, data=token_data, headers=headers)
#             token_response.raise_for_status()  # Raise error for bad status codes
#             token_json = token_response.json()
#     except requests.exceptions.RequestException as e:
#         logger.error(f"LinkedIn API Error: {str(e)}")
#         return JsonResponse({"error": "Failed to retrieve access token", "details": str(e)}, status=500)

#     access_token = token_json.get("access_token")
#     if not access_token:
#         return JsonResponse({"error": "Failed to retrieve access token", "response": token_json}, status=400)
    
#     print("access_token is : ", access_token)

#     # Store token in cookies (Secure in Production)
#     response = redirect("https://www.linkedin.com/feed/")
#     response.set_cookie("linkedin_access_token", access_token, httponly=True, max_age=3600)
    
#     return response

# from django.shortcuts import redirect
# from django.http import HttpResponse

# def linkedin_callback(request):
#     code = request.GET.get("code")
#     if not code:
#         return HttpResponse("<script>window.close();</script>")  # Close if no code

#     # JavaScript to send message to the opener (React frontend)
#     response_script = f"""
#     <script>
#         window.opener.postMessage({{ code: "{code}" }}, "http://localhost:3000");
#         window.close();
#     </script>
#     """
#     return HttpResponse(response_script)

# LINKEDIN_CLIENT_ID = "78brnp8l5qkltk"

# sathish
LINKEDIN_CLIENT_ID = "86r5wm65cgbvd7"


# LINKEDIN_CLIENT_SECRET = "WPL_AP1.0wU1icrcLTTySvoB.v0iLDQ=="

# sathish
LINKEDIN_CLIENT_SECRET = "WPL_AP1.KAu7ZOrSsVZgJtz7.b85PDg=="


# LINKEDIN_REDIRECT_URI = "http://127.0.0.1:8000/api/linkedin_auth/callback/"

# sathish
LINKEDIN_REDIRECT_URI = "http://localhost:8000/linkedin/callback"


LINKEDIN_ACCESS_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"

def linkedin_callback(request):
    """ Handle LinkedIn OAuth Callback """
    code = request.GET.get("code")  # Get Authorization Code
    if not code:
        return JsonResponse({"error": "Authorization code not found"}, status=400)
 
    # Exchange authorization code for access token
    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": LINKEDIN_REDIRECT_URI,
        "client_id": LINKEDIN_CLIENT_ID,
        "client_secret": LINKEDIN_CLIENT_SECRET,
    }
 
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
 
    try:
        with requests.Session() as session:
            token_response = session.post(LINKEDIN_ACCESS_TOKEN_URL, data=token_data, headers=headers)
            token_response.raise_for_status()
            token_json = token_response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"LinkedIn API Error: {str(e)}")
        return JsonResponse({"error": "Failed to retrieve access token", "details": str(e)}, status=500)
 
    access_token = token_json.get("access_token")
    if not access_token:
        return JsonResponse({"error": "Failed to retrieve access token", "response": token_json}, status=400)
 
    # ✅ Print in backend console
    print(f"✅ Access Token (Backend Console): {access_token}")
 
    html_response = f"""
    <html>
    <head>
        <script>
            # window.onload = function() {{
            #     let accessToken = '{access_token}';
            #     // Log token and send to parent window
            #     console.log("✅ LinkedIn Access Token: ", accessToken);
            #     window.opener.postMessage({{
            #         type: 'social_auth',
            #         provider: 'LinkedIn',
            #         access_token: accessToken
            #     }}, '*');
            #     localStorage.setItem('linkedin_access_token', accessToken);
               
            #     // Redirect to LinkedIn sign-in page
            #     window.location.href = "https://www.linkedin.com/uas/login";
            # }};

            window.onload = function() {{
          window.opener.postMessage(window.location.href, "http://localhost:3000/"); // or your parent origin
            }};
        </script>
        
    </head>     
    <body>
        <div style="text-align: center; margin-top: 50px;">
            <h2>Successfully logged in with LinkedIn!</h2>
            <p>Redirecting to LinkedIn sign-in...</p>
        </div>
    </body>
    </html>
    """
    return HttpResponse(html_response)
 
