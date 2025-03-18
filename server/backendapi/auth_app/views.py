from django.shortcuts import redirect, render
from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
import os
from dotenv import load_dotenv
import requests
from urllib.parse import urlencode, quote

load_dotenv()

# Facebook App Settings
FACEBOOK_APP_ID = '9296047703797645'
FACEBOOK_APP_SECRET = '3222ca34e356981bd8f448bbdf78eb62'
DOMAIN = 'localhost:8000'
REDIRECT_URI = f'http://{DOMAIN}/callback'
API_VERSION = 'v22.0'

def login_page(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    return render(request, 'login.html')

def facebook_login(request):
    try:
        # Build OAuth URL with minimal parameters
        oauth_url = (
            f"https://www.facebook.com/{API_VERSION}/dialog/oauth?"
            f"client_id={FACEBOOK_APP_ID}&"
            f"redirect_uri={quote(REDIRECT_URI)}&"
            f"scope=email,public_profile"
        )
        
        # For API testing
        if 'application/json' in request.headers.get('Accept', ''):
            return JsonResponse({
                'status': 'success',
                'login_url': oauth_url
            })
        
        return redirect(oauth_url)
        
    except Exception as e:
        messages.error(request, f'Login failed: {str(e)}')
        return redirect('login')

def callback(request):
    try:
        error = request.GET.get('error')
        if error:
            messages.error(request, request.GET.get('error_description', 'Authentication failed'))
            return redirect('login')

        code = request.GET.get('code')
        if not code:
            messages.error(request, 'No authorization code received')
            return redirect('login')

        # Exchange code for access token
        token_response = requests.get(
            f'https://graph.facebook.com/{API_VERSION}/oauth/access_token',
            params={
                'client_id': FACEBOOK_APP_ID,
                'client_secret': FACEBOOK_APP_SECRET,
                'code': code,
                'redirect_uri': REDIRECT_URI
            }
        )
        
        token_data = token_response.json()
        if 'error' in token_data:
            messages.error(request, token_data.get('error', {}).get('message', 'Failed to get token'))
            return redirect('login')

        access_token = token_data.get('access_token')

        # Get user data
        user_response = requests.get(
            f'https://graph.facebook.com/{API_VERSION}/me',
            params={
                'fields': 'id,name,email',
                'access_token': access_token
            }
        )
        
        user_data = user_response.json()
        if 'error' in user_data:
            messages.error(request, user_data.get('error', {}).get('message', 'Failed to get user data'))
            return redirect('login')

        # Get or create user
        try:
            user = User.objects.get(email=user_data.get('email'))
        except User.DoesNotExist:
            # Create new user
            username = f"facebook_{user_data.get('id')}"
            email = user_data.get('email')
            name_parts = user_data.get('name', '').split(' ', 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''

            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name
            )

        # Log the user in
        login(request, user)
        
        # Store access token in session
        request.session['facebook_access_token'] = access_token

        # Redirect to dashboard after successful login
        return redirect('dashboard')

    except Exception as e:
        messages.error(request, f'Login failed: {str(e)}')
        return redirect('login')

@login_required
def dashboard(request):
    return render(request, 'dashboard.html')
