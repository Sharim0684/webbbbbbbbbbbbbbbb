# import requests
# from django.http import JsonResponse
# from django.shortcuts import redirect
# from django.conf import settings
# from django.http import HttpResponse
# from django.utils.http import urlencode

# LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
# LINKEDIN_ACCESS_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"
# LINKEDIN_API_URL = "https://api.linkedin.com/v2/me"

# def linkedin_login(request):
#     """ Redirect user to LinkedIn authentication page """
#     auth_params = {
#         "response_type": "code",
#         "client_id": settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_KEY,
#         "redirect_uri": settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_REDIRECT_URI,
#         "scope": " ".join(settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_SCOPE)
#     }
#     auth_url = f"{LINKEDIN_AUTH_URL}?{urlencode(auth_params)}"
#     return redirect(auth_url)

# def linkedin_callback(request):
#     """ Handle LinkedIn OAuth Callback """
#     code = request.GET.get('code')
#     if not code:
#         return JsonResponse({'error': 'Code not provided'}, status=400)

#     # Exchange code for access token
#     token_data = {
#         'grant_type': 'authorization_code',
#         'code': code,
#         'redirect_uri': settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_REDIRECT_URI,
#         'client_id': settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_KEY,
#         'client_secret': settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_SECRET,
#     }

#     token_response = requests.post(LINKEDIN_ACCESS_TOKEN_URL, data=token_data)
#     token_json = token_response.json()

#     access_token = token_json.get('access_token')
#     if not access_token:
#         return JsonResponse({'error': 'Failed to retrieve access token'}, status=400)

#     # Store access token in cookies
#     response = redirect("https://www.linkedin.com/feed/")  # Redirect to LinkedIn home after login
#     response.set_cookie('linkedin_access_token', access_token, httponly=True, max_age=3600)

#     return response

# def linkedin_post(request):
#     """ Post content to LinkedIn """
#     access_token = request.COOKIES.get('linkedin_access_token')
#     if not access_token:
#         return JsonResponse({'error': 'Access token required'}, status=400)

#     post_data = {
#         "author": "urn:li:person:YOUR_PERSON_URN",
#         "lifecycleState": "PUBLISHED",
#         "specificContent": {
#             "com.linkedin.ugc.ShareContent": {
#                 "shareCommentary": {
#                     "text": "Hello LinkedIn, posting via Django API!"
#                 },
#                 "shareMediaCategory": "NONE"
#             }
#         },
#         "visibility": {
#             "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
#         }
#     }

#     headers = {
#         'Authorization': f'Bearer {access_token}',
#         'Content-Type': 'application/json',
#         'X-Restli-Protocol-Version': '2.0.0'
#     }

#     response = requests.post("https://api.linkedin.com/v2/ugcPosts", json=post_data, headers=headers)
#     return JsonResponse(response.json())


import requests
from django.http import JsonResponse
from django.shortcuts import redirect
from django.conf import settings
from django.utils.http import urlencode

# LinkedIn API Endpoints
LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
LINKEDIN_ACCESS_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"
LINKEDIN_POST_URL = "https://api.linkedin.com/v2/ugcPosts"

def linkedin_login(request):
    """ Provide LinkedIn login URL instead of direct redirect """
    auth_params = {
        "response_type": "code",
        "client_id": settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_KEY,
        "redirect_uri": settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_REDIRECT_URI,
        "scope": " ".join(settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_SCOPE),
    }
    auth_url = f"{LINKEDIN_AUTH_URL}?{urlencode(auth_params)}"

    if request.headers.get('Accept') == 'application/json':  
        return JsonResponse({"linkedin_auth_url": auth_url})  # Return JSON in Postman

    return redirect(auth_url)

def linkedin_callback(request):
    """ Handle LinkedIn OAuth Callback """
    code = request.GET.get('code')
    if not code:
        return JsonResponse({'error': 'Code not provided'}, status=400)

    # Exchange code for access token
    token_data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_REDIRECT_URI,
        'client_id': settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_KEY,
        'client_secret': settings.SOCIAL_AUTH_LINKEDIN_OAUTH2_SECRET,
    }

    token_response = requests.post(LINKEDIN_ACCESS_TOKEN_URL, data=token_data)
    token_json = token_response.json()

    access_token = token_json.get('access_token')
    if not access_token:
        return JsonResponse({'error': 'Failed to retrieve access token'}, status=400)

    # 🔹 Print Access Token in VS Code Terminal
    print("\n🔹 LinkedIn Access Token:", access_token, "\n")

    # Store access token in cookies
    response = redirect("https://www.linkedin.com/feed/")  # Redirect to LinkedIn home after login
    response.set_cookie('linkedin_access_token', access_token, httponly=True, max_age=3600)

    return response
    

def linkedin_post(request):
    """ Post content to LinkedIn """
    access_token = request.COOKIES.get('linkedin_access_token')
    if not access_token:
        return JsonResponse({'error': 'Access token required'}, status=400)

    post_data = {
        "author": "urn:li:person:YOUR_PERSON_URN",
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": "Hello LinkedIn, posting via Django API!"},
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"}
    }

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
    }

    response = requests.post(LINKEDIN_POST_URL, json=post_data, headers=headers)
    return JsonResponse(response.json())


 