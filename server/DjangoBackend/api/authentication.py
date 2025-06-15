from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from rest_framework import exceptions
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed
from .models import SocialMediaCredentials
from django.contrib.auth import get_user_model
User = get_user_model()
import requests
from datetime import timedelta


class MultiPlatformTokenAuthentication(TokenAuthentication):
    """
    Custom authentication class that supports multiple tokens for different platforms.
    
    This authentication class will:
    1. Validate the primary authentication token
    2. Validate platform-specific tokens
    3. Handle token expiration and refresh
    """
    
    def authenticate(self, request):
        """
        Authenticate the request using both primary and platform tokens.
        
        Args:
            request: The incoming request
            
        Returns:
            Tuple of (user, token) if authentication succeeds
            
        Raises:
            AuthenticationFailed: If authentication fails
        """
        try:
            # Get the main authentication token
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            if not auth_header:
                raise AuthenticationFailed('No authentication token provided')
                
            # Extract token from header
            token_type, token = auth_header.split()
            if token_type.lower() != 'token':
                raise AuthenticationFailed('Invalid token type')
                
            # Validate the main token
            user = self._validate_main_token(token)
            
            # Get platform-specific token from query parameters
            platform = request.GET.get('platform')
            platform_token = request.GET.get('platform_token')
            
            if platform and platform_token:
                # Validate platform-specific token
                self._validate_platform_token(user, platform, platform_token)
                
            return (user, token)
            
        except Exception as e:
            raise AuthenticationFailed(str(e))

    def _validate_main_token(self, token: str) -> User:
        """Validate the main authentication token."""
        try:
            token_obj = Token.objects.select_related('user').get(key=token)
            user = token_obj.user
            
            # Check token expiration (24 hours)
            if token_obj.created < timezone.now() - timedelta(hours=24):
                token_obj.delete()
                raise AuthenticationFailed('Token has expired')
                
            return user
            
        except Token.DoesNotExist:
            raise AuthenticationFailed('Invalid token')

    def _validate_platform_token(self, user: User, platform: str, token: str) -> None:
        """Validate platform-specific token."""
        try:
            # Get the platform credentials
            credentials = SocialMediaCredentials.objects.get(
                user=user,
                platform=platform.lower()
            )
            
            # Check if token matches
            if credentials.access_token != token:
                raise AuthenticationFailed('Invalid platform token')
                
            # Check token expiration
            if credentials.token_expires_at and credentials.token_expires_at < timezone.now():
                raise AuthenticationFailed('Platform token has expired')
                
        except SocialMediaCredentials.DoesNotExist:
            raise AuthenticationFailed(f'No credentials found for platform: {platform}')


class SocialMediaTokenAuthentication(TokenAuthentication):
    """
    Custom authentication class specifically for social media endpoints.
    
    This class will:
    1. Validate the social media token
    2. Check platform permissions
    3. Handle token refresh for platforms that support it
    """
    
    def authenticate(self, request):
        """
        Authenticate the request for social media endpoints.
        
        Args:
            request: The incoming request
            
        Returns:
            Tuple of (user, token) if authentication succeeds
            
        Raises:
            AuthenticationFailed: If authentication fails
        """
        try:
            # Get platform from request
            platform = request.GET.get('platform')
            if not platform:
                raise AuthenticationFailed('Platform parameter is required')
                
            # Get token from header
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            if not auth_header:
                raise AuthenticationFailed('No authentication token provided')
                
            token_type, token = auth_header.split()
            if token_type.lower() != 'token':
                raise AuthenticationFailed('Invalid token type')
                
            # Validate token
            user = self._validate_token(platform, token)
            
            # Check if user has permission for this platform
            self._check_platform_permission(user, platform)
            
            return (user, token)
            
        except Exception as e:
            raise AuthenticationFailed(str(e))

    def _validate_token(self, platform: str, token: str) -> User:
        """Validate social media token."""
        try:
            # Get credentials for this platform
            credentials = SocialMediaCredentials.objects.get(
                access_token=token,
                platform=platform.lower()
            )
            
            # Check token expiration
            if credentials.token_expires_at and credentials.token_expires_at < timezone.now():
                # Try to refresh token if platform supports it
                if platform.lower() == 'linkedin':
                    self._refresh_linkedin_token(credentials)
                else:
                    raise AuthenticationFailed('Token has expired')
                    
            return credentials.user
            
        except SocialMediaCredentials.DoesNotExist:
            raise AuthenticationFailed('Invalid social media token')

    def _check_platform_permission(self, user: User, platform: str) -> None:
        """Check if user has permission to use this platform."""
        try:
            # Check if user has selected this platform
            selected_platform = SelectedPlatform.objects.get(
                user=user,
                platform=platform.lower(),
                is_selected=True
            )
            if not selected_platform:
                raise AuthenticationFailed('Platform not selected')
                
        except SelectedPlatform.DoesNotExist:
            raise AuthenticationFailed('Platform not selected')

    def _refresh_linkedin_token(self, credentials: SocialMediaCredentials) -> None:
        """Refresh LinkedIn token."""
        try:
            # Make API call to refresh LinkedIn token
            refresh_url = "https://www.linkedin.com/oauth/v2/accessToken"
            data = {
                'grant_type': 'refresh_token',
                'client_id': settings.LINKEDIN_CLIENT_ID,
                'client_secret': settings.LINKEDIN_CLIENT_SECRET,
                'refresh_token': credentials.refresh_token
            }
            
            response = requests.post(refresh_url, data=data)
            if response.status_code == 200:
                data = response.json()
                credentials.access_token = data['access_token']
                credentials.token_expires_at = timezone.now() + timedelta(seconds=data['expires_in'])
                credentials.save()
            else:
                raise AuthenticationFailed('Failed to refresh LinkedIn token')
                
        except Exception as e:
            raise AuthenticationFailed(f'Error refreshing LinkedIn token: {str(e)}')


class OAuth2Authentication(TokenAuthentication):
    """
    Custom authentication class for OAuth2 endpoints.
    
    This class will:
    1. Validate OAuth2 tokens
    2. Handle token exchange
    3. Store and validate refresh tokens
    """
    
    def authenticate(self, request):
        """
        Authenticate the request for OAuth2 endpoints.
        
        Args:
            request: The incoming request
            
        Returns:
            Tuple of (user, token) if authentication succeeds
            
        Raises:
            AuthenticationFailed: If authentication fails
        """
        try:
            # Get token from request
            token = request.POST.get('token') or request.GET.get('token')
            if not token:
                raise AuthenticationFailed('No token provided')
                
            # Get platform from request
            platform = request.POST.get('platform') or request.GET.get('platform')
            if not platform:
                raise AuthenticationFailed('No platform specified')
                
            # Validate and store token
            user = self._validate_and_store_token(platform, token)
            return (user, token)
            
        except Exception as e:
            raise AuthenticationFailed(str(e))

    def _validate_and_store_token(self, platform: str, token: str) -> User:
        """Validate and store OAuth2 token."""
        try:
            # Verify token with platform's API
            if platform.lower() == 'facebook':
                self._verify_facebook_token(token)
            elif platform.lower() == 'linkedin':
                self._verify_linkedin_token(token)
            elif platform.lower() == 'instagram':
                self._verify_instagram_token(token)
            else:
                raise AuthenticationFailed('Unsupported platform')
                
            # Store token in database
            user = self._get_or_create_user(platform, token)
            return user
            
        except Exception as e:
            raise AuthenticationFailed(str(e))

    def _verify_facebook_token(self, token: str) -> None:
        """Verify Facebook token."""
        try:
            verify_url = f"https://graph.facebook.com/debug_token?input_token={token}&access_token={settings.FACEBOOK_APP_ID}|{settings.FACEBOOK_APP_SECRET}"
            response = requests.get(verify_url)
            data = response.json()
            
            if not data.get('data', {}).get('is_valid'):
                raise AuthenticationFailed('Invalid Facebook token')
                
        except Exception as e:
            raise AuthenticationFailed(f'Error verifying Facebook token: {str(e)}')

    def _verify_linkedin_token(self, token: str) -> None:
        """Verify LinkedIn token."""
        try:
            verify_url = "https://api.linkedin.com/v2/me"
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(verify_url, headers=headers)
            
            if response.status_code != 200:
                raise AuthenticationFailed('Invalid LinkedIn token')
                
        except Exception as e:
            raise AuthenticationFailed(f'Error verifying LinkedIn token: {str(e)}')

    def _verify_instagram_token(self, token: str) -> None:
        """Verify Instagram token."""
        try:
            verify_url = f"https://graph.facebook.com/v18.0/me?access_token={token}"
            response = requests.get(verify_url)
            
            if response.status_code != 200:
                raise AuthenticationFailed('Invalid Instagram token')
                
        except Exception as e:
            raise AuthenticationFailed(f'Error verifying Instagram token: {str(e)}')

    def _get_or_create_user(self, platform: str, token: str) -> User:
        """Get or create user for the given platform and token."""
        try:
            # Try to get existing credentials
            credentials = SocialMediaCredentials.objects.filter(
                platform=platform.lower(),
                access_token=token
            ).first()
            
            if credentials:
                return credentials.user
                
            # Create new credentials
            user = User.objects.create_user(
                username=f'{platform}_user_{token[:10]}',
                email=f'{platform}_{token[:10]}@social.com'
            )
            
            SocialMediaCredentials.objects.create(
                user=user,
                platform=platform.lower(),
                access_token=token
            )
            
            return user
            
        except Exception as e:
            raise AuthenticationFailed(f'Error creating user: {str(e)}')