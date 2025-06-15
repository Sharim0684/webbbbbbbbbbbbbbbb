from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, status, filters
from django.shortcuts import get_object_or_404, redirect
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import check_password
from rest_framework.authentication import TokenAuthentication
import jwt
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import uuid
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.utils import timezone
from django.contrib.auth import get_user_model
from .authentication import MultiPlatformTokenAuthentication
from urllib.parse import urlencode

from .models import Person, SelectedPlatform, Credential # Changed from Credentials to Credential
from .serializers import SignupSerializer, PersonSerializer
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta

# Get custom User model
User = get_user_model()

class SignupAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = jwt.encode(
                {"id": user.id,"email": user.email, "exp": datetime.utcnow() + timedelta(days=7)},
                settings.SECRET_KEY,
                algorithm="HS256",
            )
            return Response(
                {
                    "message": "Signup successful",
                    "userdata": {
                        "name": user.name,
                        "email": user.email,
                        "phone_number": user.phone_number,
                        "gender": user.gender,
                    },
                    "token": token,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Email does not exist."}, status=status.HTTP_400_BAD_REQUEST
            )

        if not check_password(password, user.password):
            return Response(
                {"error": "Incorrect password."}, status=status.HTTP_400_BAD_REQUEST
            )

        token = jwt.encode(
            {"id": user.id, "email": user.email, "exp": datetime.utcnow() + timedelta(days=7)},
            settings.SECRET_KEY,
            algorithm="HS256",
        )
        user.last_login = now()
        user.last_login_at = now()
        user.save()
        return Response(
            {
                "message": "Login successful",
                "userdata": {
                    "name": user.name,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "gender": user.gender,
                },
                "token": token,
            },
            status=status.HTTP_200_OK,
        )


class PersonViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]  # Add this line
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    search_fields = ["name", "email", "age"]  # Allows searching by name or email
    ordering_fields = ["name", "age", "email"]  # Allows sorting by name, age, or email
    ordering = ["name"]  # Default ordering by name

    def create(self, request, *args, **kwargs):
        """
        Explicitly define required fields for request validation.
        """
        required_fields = ["name", "age", "email"]
        missing_fields = [
            field for field in required_fields if field not in request.data
        ]

        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().create(request, *args, **kwargs)

    def retrieve(self, request, pk=None):
        """
        Fetch a single Person by ID.
        """
        person = get_object_or_404(Person, pk=pk)
        serializer = self.get_serializer(person)
        return Response(serializer.data)

    def update(self, request, pk=None):
        """
        Fully updates a Person instance (PUT method).
        Requires all fields to be present in the request body.
        """
        person = get_object_or_404(Person, pk=pk)
        serializer = self.get_serializer(person, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        """
        Partially updates a Person instance (PATCH method).
        Allows updating specific fields without sending the entire object.
        """
        person = get_object_or_404(Person, pk=pk)
        serializer = self.get_serializer(person, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """
        Deletes a specific Person instance (DELETE method).
        """
        person = get_object_or_404(Person, pk=pk)
        person.delete()
        return Response(
            {"message": "Person deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


@api_view(["GET"])
def health_check(request):
    """
    A simple API view to check if the API is up and running.
    """
    return Response({"status": "API is up and running!"})


class SocialLoginView(APIView):
    permission_classes = [AllowAny]

    def get_provider(self, request):
        # Extract provider from URL path
        path = request.path
        if 'facebook' in path:
            return 'facebook'
        elif 'instagram' in path:
            return 'instagram'
        elif 'linkedin' in path:
            return 'linkedin'
        return None

    def post(self, request, *args, **kwargs):
        provider = self.get_provider(request)
        if not provider:
            return Response({'error': 'Invalid provider'}, status=status.HTTP_400_BAD_REQUEST)

        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({
                'error': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Try to find user by email, phone number, or Instagram username
            try:
                if '@' in username:
                    user = User.objects.get(email=username)
                elif username.isdigit():
                    user = User.objects.get(phone_number=username)
                else:
                    # For Instagram/LinkedIn usernames
                    user = User.objects.get(name=username)
                
                # Update user if needed
                if not user.social_provider:
                    user.social_provider = provider
                    # Add temporary phone number if not exists
                    if not user.phone_number:
                        user.phone_number = f'temp_{str(uuid.uuid4())[:8]}'
                    user.save()
            except User.DoesNotExist:
                # Create new user
                if '@' in username:
                    # Email login
                    user = User.objects.create(
                        email=username,
                        username=username.split('@')[0],  # Set username from email
                        name=username.split('@')[0],
                        phone_number=f'temp_{str(uuid.uuid4())[:8]}',
                        gender=''
                    )
                elif username.isdigit():
                    # Phone number login
                    user = User.objects.create(
                        email=f'{username}@temp.com',
                        username=username,  # Use phone number as username
                        name=f'user_{username}',
                        phone_number=username,
                        gender=''
                    )
                else:
                    # Instagram username login
                    user = User.objects.create(
                        email=f'{username}@instagram.temp',
                        username=username,  # Use Instagram username
                        name=username,
                        phone_number=f'temp_{str(uuid.uuid4())[:8]}',
                        gender=''
                    )
                user.set_password(password)
                user.social_provider = provider
                user.save()

            # Remove JWT token generation and only use Token
            token, _ = Token.objects.get_or_create(user=user)
            # After creating/updating user, store credentials
            # In post method, after LinkedIn authentication
            linkedin_auth = self.authenticate_linkedin(username, password)
            if linkedin_auth['success']:
                Credential.objects.update_or_create(  # Changed from SocialMediaCredentials to Credential
                    user=user,
                    platform_name=provider,
                    defaults={
                        'username': username,
                        'password': linkedin_auth['access_token']  # Store OAuth token
                    }
                )
            
            return Response({
                'message': f'{provider.capitalize()} login successful',
                'userdata': {
                    'name': user.name,
                    'email': user.email,
                    'phone_number': user.phone_number,
                    'provider': provider
                },
                'token': token.key
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Failed to process {provider} login: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

    def authenticate_instagram(self, username, password):
        api_url = 'https://api.instagram.com/oauth/access_token'
        params = {
            'client_id': settings.INSTAGRAM_APP_ID,
            'client_secret': settings.INSTAGRAM_APP_SECRET,
            'username': username,
            'password': password,
            'grant_type': 'password'
        }
        response = requests.post(api_url, params=params)
        if response.status_code == 200:
            data = response.json()
            # Store Instagram credentials
            Credential.objects.update_or_create(
                user=user,
                platform_name='instagram',
                defaults={
                    'access_token': data.get('access_token'),
                    'expires_at': datetime.now() + timedelta(days=60),  # Instagram tokens typically expire in 60 days
                    'created_at': datetime.now(),
                    'updated_at': datetime.now()
                }
            )
            return {
                'success': True,
                'access_token': data.get('access_token')
            }
        return {'success': False}

    def authenticate_facebook(self, username, password):
        try:
            # Validate Facebook credentials
            graph = facebook.GraphAPI()
            auth_response = graph.get_app_access_token(
                settings.FACEBOOK_APP_ID,
                settings.FACEBOOK_APP_SECRET
            )
            return {
                'success': True,
                'access_token': auth_response
            }
        except Exception:
            return {'success': False}

    def authenticate_linkedin(self, username, password):
        try:
            # LinkedIn OAuth2 authentication using authorization code flow
            auth_url = 'https://www.linkedin.com/oauth/v2/accessToken'
            data = {
                'grant_type': 'authorization_code',
                'code': password,  # This should be the authorization code from LinkedIn
                'client_id': settings.LINKEDIN_CLIENT_ID,
                'client_secret': settings.LINKEDIN_CLIENT_SECRET,
                'redirect_uri': f'{settings.FRONTEND_URL}/auth/linkedin/callback'
            }
            response = requests.post(auth_url, data=data)
            if response.status_code == 200:
                return {
                    'success': True,
                    'access_token': response.json()['access_token']
                }
            return {'success': False}
        except Exception:
            return {'success': False}

    def get_auth_url(self, provider):
        configs = {
            'facebook': {
                'client_id': settings.FACEBOOK_APP_ID,
                'redirect_uri': f'{settings.FRONTEND_URL}/auth/facebook/callback',
                'scope': 'email'
            },
            'instagram': {
                'client_id': settings.INSTAGRAM_APP_ID,
                'redirect_uri': f'{settings.FRONTEND_URL}/auth/instagram/callback',
                'scope': 'basic'
            },
            'linkedin': {
                'client_id': settings.LINKEDIN_CLIENT_ID,
                'redirect_uri': f'{settings.FRONTEND_URL}/auth/linkedin/callback',
                'scope': 'openid profile w_member_social email'
            }
        }
        
        if provider in configs:
            config = configs[provider]
            if provider == 'instagram':
                return f'https://api.instagram.com/oauth/authorize?client_id={config["client_id"]}&redirect_uri={config["redirect_uri"]}&scope={config["scope"]}&response_type=code'
            elif provider == 'linkedin':
                return f'https://www.linkedin.com/oauth/v2/authorization?client_id={config["client_id"]}&redirect_uri={config["redirect_uri"]}&scope={config["scope"]}&response_type=code&state=random_state_string'
            elif provider == 'facebook':
                return f'https://www.facebook.com/v12.0/dialog/oauth?client_id={config["client_id"]}&redirect_uri={config["redirect_uri"]}&scope={config["scope"]}'


class AutoLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        provider = request.data.get('provider')
        if not provider:
            return Response({'error': 'Provider is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Get all users from database for the given provider
        users = User.objects.filter(social_provider=provider)
        
        if not users.exists():
            return Response({'error': f'No users found for provider {provider}'}, 
                          status=status.HTTP_404_NOT_FOUND)

        
        user = users.first()

        # Replace JWT with Token authentication
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'message': f'{provider.capitalize()} auto-login successful',
            'userdata': {
                'name': user.name,
                'email': user.email,
                'phone_number': user.phone_number,
                'provider': provider
            },
            'token': token.key
        }, status=status.HTTP_200_OK)


class UserPlatformsView(APIView):
    authentication_classes = [MultiPlatformTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get unique platform names from users
        platforms = User.objects.exclude(social_provider='').values_list('social_provider', flat=True).distinct()
        
        return Response({
            'platforms': list(platforms)
        }, status=status.HTTP_200_OK)


class PlatformSelectionView(APIView):
    authentication_classes = [MultiPlatformTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        #
        platforms = SelectedPlatform.objects.filter(user=request.user)
        
       
        user_provider = request.user.social_provider
       
        all_platforms = []
        
        if user_provider:
            platform_info = {
                'facebook': {'name': 'Facebook', 'key': 'facebook'},
                'linkedin': {'name': 'LinkedIn', 'key': 'linkedin'},
                'instagram': {'name': 'Instagram', 'key': 'instagram'},
                'twitter': {'name': 'Twitter', 'key': 'twitter'}
            }
            
            if user_provider in platform_info:
                platform = platform_info[user_provider].copy()
                platform['is_selected'] = platforms.filter(
                    platform=platform['key'], 
                    is_selected=True
                ).exists()
                all_platforms.append(platform)

        return Response({
            'platforms': all_platforms
        })

    def post(self, request):
        platform = request.data.get('platform')
        if not platform:
            return Response(
                {'error': 'Platform is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        is_selected = request.data.get('is_selected', False)

        # Verify that the platform matches user's social provider
        if platform != request.user.social_provider:
            return Response(
                {'error': 'You can only select the platform you logged in with'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update or create platform selection
        obj, created = SelectedPlatform.objects.update_or_create(
            user=request.user,
            platform=platform,
            defaults={'is_selected': is_selected}
        )

        return Response({
            'platform': obj.platform,
            'is_selected': obj.is_selected
        })


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Post, SelectedPlatform, SocialMediaCredentials  # Add SocialMediaCredentials here
from rest_framework.permissions import IsAuthenticated
import facebook
from datetime import datetime

class TokenManagementMixin:
    def get_valid_facebook_token(self, credentials):
        """Get a valid Facebook access token."""
        if not credentials.password:  # password field stores the access token
            return None
            
        # Check if token needs refresh (assuming expiry is stored in extra_data)
        try:
            expires_at = float(credentials.extra_data.get('expires_at', 0))
            if datetime.utcnow().timestamp() > expires_at - 600:
                new_token = self.exchange_for_long_lived_token(credentials.password)
                if new_token:
                    credentials.password = new_token
                    credentials.extra_data['expires_at'] = (datetime.utcnow() + timedelta(days=60)).timestamp()
                    credentials.save()
                    return new_token
                return None
            return credentials.password
        except (ValueError, AttributeError):
            return credentials.password

    def exchange_for_long_lived_token(self, short_lived_token):
        """Exchange a short-lived Facebook token for a long-lived one."""
        url = "https://graph.facebook.com/v22.0/oauth/access_token"
        params = {
            "grant_type": "fb_exchange_token",
            "client_id": settings.FACEBOOK_APP_ID,
            "client_secret": settings.FACEBOOK_APP_SECRET,
            "fb_exchange_token": short_lived_token,
        }
        response = requests.get(url, params=params)

        if response.status_code == 200:
            return response.json().get('access_token')
        return None

    def get_valid_linkedin_token(self, credentials):
        """Get a valid LinkedIn access token."""
        if not credentials.password:  # password field stores the access token
            return None

        try:
            expires_at = float(credentials.extra_data.get('expires_at', 0))
            if datetime.utcnow().timestamp() > expires_at - 600:
                new_token = self.refresh_linkedin_token(credentials.password)
                if new_token:
                    credentials.password = new_token
                    credentials.extra_data['expires_at'] = (datetime.utcnow() + timedelta(days=60)).timestamp()
                    credentials.save()
                    return new_token
            return credentials.password
        except (ValueError, AttributeError):
            return credentials.password

    def refresh_linkedin_token(self, current_token):
        """Refresh LinkedIn access token."""
        url = "https://www.linkedin.com/oauth/v2/accessToken"
        data = {
            "grant_type": "refresh_token",
            "client_id": settings.LINKEDIN_CLIENT_ID,
            "client_secret": settings.LINKEDIN_CLIENT_SECRET,
            "refresh_token": current_token
        }
        
        response = requests.post(url, data=data)
        
        if response.status_code == 200:
            return response.json().get('access_token')
        return None


class CreatePostView(APIView):
    authentication_classes = [MultiPlatformTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        selected_platform = SelectedPlatform.objects.filter(
            user=request.user,
            is_selected=True
        ).first()

        if not selected_platform:
            return Response({
                'error': 'No platform selected'
            }, status=status.HTTP_400_BAD_REQUEST)

        content = request.data.get('content')
        media_file = request.FILES.get('media')
        enable_likes = request.data.get('enable_likes', False)
        enable_comments = request.data.get('enable_comments', False)

        errors = []
        is_published = False

        try:
            post = Post.objects.create(
                user=request.user,
                content=content,
                media=media_file,
                enable_likes=enable_likes,
                enable_comments=enable_comments
            )

            try:
                credentials = Credential.objects.get(
                    user=request.user,
                    platform_name=selected_platform.platform
                )
            except Credential.DoesNotExist:
                return Response({
                    'error': f'Credentials not found for {selected_platform.platform}'
                }, status=status.HTTP_400_BAD_REQUEST)

            if selected_platform.platform == 'facebook':
                try:
                    # Get Facebook credentials
                    credentials = Credential.objects.get(
                        user=request.user,
                        platform_name='facebook'
                    )
                    
                    # Use access_token instead of password
                    access_token = credentials.access_token
                    
                    if not access_token:
                        raise Exception("No Facebook access token found")

                    # Initialize Facebook Graph API with access token
                    graph = facebook.GraphAPI(access_token=access_token)
                    
                    # Post directly to the page using the page ID
                    page_id = '632392123280191'  # Your page ID
                    
                    try:
                        if media_file:
                            # For image posts
                            with open(post.media.path, 'rb') as image:
                                response = graph.put_photo(
                                    image=image,
                                    message=content,
                                    album_path=f'{page_id}/photos'
                                )
                        else:
                            # For text-only posts
                            response = graph.put_object(
                                parent_object=page_id,
                                connection_name='feed',
                                message=content
                            )

                        if response and 'id' in response:
                            post.facebook_post_id = response['id']
                            post.save()
                            is_published = True
                        else:
                            errors.append("Failed to create Facebook post")

                    except facebook.GraphAPIError as e:
                        errors.append(f"Facebook API Error: {str(e)}")
                        
                except Exception as e:
                    errors.append(f"Facebook error: {str(e)}")

            elif selected_platform.platform == 'linkedin':
                try:
                    headers = {
                        'Authorization': f'Bearer {credentials.access_token}',
                        'Content-Type': 'application/json',
                        'X-Restli-Protocol-Version': '2.0.0',
                        'LinkedIn-Version': '202308'
                    }

                    user_info_url = 'https://api.linkedin.com/v2/userinfo'
                    user_response = requests.get(user_info_url, headers=headers)

                    if user_response.status_code != 200:
                        errors.append(f"Failed to get LinkedIn user info: {user_response.text}")
                    else:
                        user_data = user_response.json()
                        user_urn = user_data.get('sub')

                        if media_file:
                            register_upload_url = 'https://api.linkedin.com/v2/assets?action=registerUpload'
                            register_data = {
                                "registerUploadRequest": {
                                    "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
                                    "owner": f"urn:li:person:{user_urn}",
                                    "serviceRelationships": [{
                                        "relationshipType": "OWNER",
                                        "identifier": "urn:li:userGeneratedContent"
                                    }]
                                }
                            }
                            upload_response = requests.post(register_upload_url, headers=headers, json=register_data)

                            if upload_response.status_code == 200:
                                upload_data = upload_response.json()
                                upload_url = upload_data['value']['uploadMechanism']['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']['uploadUrl']
                                asset_urn = upload_data['value']['asset']

                                with open(post.media.path, 'rb') as image:
                                    image_headers = {
                                        'Authorization': f'Bearer {credentials.access_token}'
                                    }
                                    image_upload_response = requests.post(upload_url, headers=image_headers, files={'file': image})

                                    if image_upload_response.status_code == 201:
                                        post_url = 'https://api.linkedin.com/v2/ugcPosts'
                                        post_data = {
                                            "author": f"urn:li:person:{user_urn}",
                                            "lifecycleState": "PUBLISHED",
                                            "specificContent": {
                                                "com.linkedin.ugc.ShareContent": {
                                                    "shareCommentary": {"text": content},
                                                    "shareMediaCategory": "IMAGE",
                                                    "media": [{
                                                        "status": "READY",
                                                        "description": {"text": content},
                                                        "media": asset_urn,
                                                        "title": {"text": f"Post by {user_data.get('name', 'User')}"}
                                                    }]
                                                }
                                            },
                                            "visibility": {
                                                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                                            }
                                        }
                                        response = requests.post(post_url, headers=headers, json=post_data)
                                        if response.status_code in [200, 201]:
                                            is_published = True
                                        else:
                                            errors.append(f"Failed to post to LinkedIn: {response.text}")
                                    else:
                                        errors.append(f"Failed to upload image to LinkedIn: {image_upload_response.text}")
                            else:
                                errors.append(f"Failed to register LinkedIn media upload: {upload_response.text}")
                        else:
                            post_data = {
                                "author": f"urn:li:person:{user_urn}",
                                "lifecycleState": "PUBLISHED",
                                "specificContent": {
                                    "com.linkedin.ugc.ShareContent": {
                                        "shareCommentary": {"text": content},
                                        "shareMediaCategory": "NONE"
                                    }
                                },
                                "visibility": {
                                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                                }
                            }
                            response = requests.post('https://api.linkedin.com/v2/ugcPosts', headers=headers, json=post_data)
                            if response.status_code in [200, 201]:
                                is_published = True
                            else:
                                errors.append(f"Failed to post to LinkedIn: {response.text}")
                except Exception as e:
                    errors.append(f"Error posting to LinkedIn: {str(e)}")

            post.is_published = is_published
            post.save()

            return Response({
                'message': 'Post created successfully' if is_published else 'Post created but failed to publish',
                'post_id': post.id,
                'is_published': is_published,
                'errors': errors
            })

        except Exception as e:
            return Response({
                'error': f'Failed to create post: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

    def _is_image(self, filename):
        return filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))

    def _is_video(self, filename):
        return filename.lower().endswith(('.mp4', '.mov', '.avi', '.wmv'))

    def _get_page_access_token(self, user_access_token):
        try:
            url = f"https://graph.facebook.com/v22.0/{settings.FACEBOOK_PAGE_ID}?fields=access_token&access_token={user_access_token}"
            response = requests.get(url)
            if response.status_code == 200:
                return response.json().get('access_token')
        except Exception:
            pass
        return None


class MultiPlatformTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        # Get primary token
        primary_auth = super().authenticate(request)
        if not primary_auth:
            return None

        user, _ = primary_auth

        # Get secondary token if exists
        secondary_token = request.headers.get('X-Secondary-Token')
        if secondary_token:
            try:
                Token.objects.get(key=secondary_token)
                # Store secondary token in request for later use
                request.secondary_token = secondary_token
            except Token.DoesNotExist:
                pass

        return (user, None)

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class GetCredentialsView(APIView):
    authentication_classes = [MultiPlatformTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get user's credentials
            credentials = Credential.objects.filter(user=request.user)
            credentials_data = []
            
            for cred in credentials:
                # Calculate time remaining until expiration
                time_remaining = None
                if cred.expires_at:
                    time_remaining = (cred.expires_at - timezone.now()).total_seconds()
                
                cred_data = {
                    'platform': cred.platform_name,
                    'access_token': cred.access_token,
                    
                }
                credentials_data.append(cred_data)
            
            return Response({
                'success': True,
                'credentials': credentials_data
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CheckCredentialsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        social_credentials = {
            'provider': user.social_provider,
            'is_authenticated': True,
            'platforms': []
        }

        # Get user's selected platforms
        platforms = SelectedPlatform.objects.filter(user=user)
        
        if user.social_provider:
            platform_info = {
                'facebook': {'name': 'Facebook', 'key': 'facebook'},
                'linkedin': {'name': 'LinkedIn', 'key': 'linkedin'},
                'instagram': {'name': 'Instagram', 'key': 'instagram'}
            }
            
            if user.social_provider in platform_info:
                platform = platform_info[user.social_provider].copy()
                platform['is_selected'] = platforms.filter(
                    platform=platform['key'], 
                    is_selected=True
                ).exists()
                social_credentials['platforms'].append(platform)

        return Response(social_credentials, status=status.HTTP_200_OK)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class FacebookAuthView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Facebook OAuth configuration
        client_id = settings.FACEBOOK_APP_ID
        redirect_uri = settings.FACEBOOK_REDIRECT_URI
        scope = 'pages_manage_posts,pages_read_engagement'
        
        # Facebook OAuth URL
        auth_url = f"https://www.facebook.com/v18.0/dialog/oauth?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}"
        
        return Response({
            'authorization_url': auth_url
        })

from urllib.parse import urlencode
from django.shortcuts import redirect
from urllib.parse import urlencode

def facebook_authorize(request):
    # Facebook OAuth configuration from settings
    client_id = settings.FACEBOOK_APP_ID
    redirect_uri = settings.FACEBOOK_REDIRECT_URI
    scope = 'pages_manage_posts,pages_read_engagement'
    
    # Construct Facebook OAuth URL
    auth_url = f"https://www.facebook.com/v18.0/dialog/oauth?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}"
    
    # Redirect to Facebook authorization page
    return redirect(auth_url)

@api_view(['GET'])
def linkedin_authorize(request):
    """Generate LinkedIn OAuth2 authorization URL and redirect user."""
    params = {
        'response_type': 'code',
        'client_id': settings.LINKEDIN_CLIENT_ID,
        'redirect_uri': f'{settings.SITE_URL}/api/auth/linkedin/callback/',
        'scope': 'openid profile w_member_social email',
        'state': 'random_state_string'  # You should generate this dynamically for security
    }
    
    auth_url = f'https://www.linkedin.com/oauth/v2/authorization?{urlencode(params)}'
    return redirect(auth_url)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    try:
        data = request.data
        responses = {}
        
        if data.get('platforms') & 2:  # Facebook
            responses['facebook'] = post_to_facebook(request.user.id, data['content'])
            
        if data.get('platforms') & 4:  # LinkedIn
            responses['linkedin'] = post_to_linkedin(request.user.id, data['content'])

        return Response(responses)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


class OAuthCallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.GET.get('code')
        if not code:
            return Response({'error': 'No authorization code provided'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        # Determine which platform callback this is
        path = request.path
        platform_name = 'facebook' if 'facebook' in path else 'linkedin'
        
        if platform_name == 'facebook':
            token_data = exchange_code_for_token(code)
        else:
            token_data = exchange_linkedin_code_for_token(code)

        if 'access_token' in token_data:
            try:
                credentials = Credentials.objects.get(
                    user=request.user,
                    platform_name=platform_name
                )
                credentials.access_token = token_data['access_token']
                credentials.token_expires_at = token_data.get('expires_at')
                credentials.token_type = token_data.get('token_type')
                credentials.save()
            except Credentials.DoesNotExist:
                Credentials.objects.create(
                    user=request.user,
                    platform_name=platform_name,
                    username=request.user.email,
                    access_token=token_data['access_token'],
                    token_expires_at=token_data.get('expires_at'),
                    token_type=token_data.get('token_type')
                )

            return Response({
                'status': 'success',
                'message': f'{platform_name.capitalize()} authentication successful'
            })
        else:
            return Response({
                'status': 'error',
                'message': token_data.get('message', 'Failed to obtain access token')
            }, status=status.HTTP_400_BAD_REQUEST)

            
class SocialPostView(APIView):
    authentication_classes = [MultiPlatformTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        content = request.data.get('content', '')
        media = request.data.get('media')
        selected_platforms = SelectedPlatform.objects.filter(
            user=request.user,
            is_selected=True
        )

        response_data = {
            'message': '',
            'post_id': None,
            'is_published': False,
            'errors': []
        }

        # Create post record
        post = Post.objects.create(
            user=request.user,
            content=content,
            media=media
        )
        response_data['post_id'] = post.id

        for platform in selected_platforms:
            try:
                credentials = Credential.objects.get(
                    user=request.user,
                    platform_name=platform.platform
                )

                if platform.platform == 'instagram':
                    if not media:
                        response_data['errors'].append("Instagram requires media content")
                        continue

                    # Get the media URL
                    if hasattr(media, 'url'):
                        media_url = request.build_absolute_uri(media.url)
                    else:
                        media_url = media

                    # Use stored credentials from database
                    access_token = credentials.access_token
                    instagram_business_id = "17841464618542985"

                    # Step 1: Create container
                    container_url = f"https://graph.facebook.com/v18.0/{instagram_business_id}/media"
                    container_params = {
                        "image_url": media_url,
                        "caption": content or "Posted via API",
                        "access_token": access_token,
                        "media_type": "IMAGE"
                    }

                    container_response = requests.post(container_url, params=container_params)
                    container_data = container_response.json()
                    
                    print("Container Response:", container_data)  # Debug log

                    if 'id' not in container_data:
                        error_msg = container_data.get('error', {}).get('message', 'Failed to create media container')
                        response_data['errors'].append(f"Instagram: {error_msg}")
                        continue

                    # Wait for container processing
                    time.sleep(10)

                    # Step 2: Publish container
                    publish_url = f"https://graph.facebook.com/v18.0/{instagram_business_id}/media_publish"
                    publish_params = {
                        "creation_id": container_data['id'],
                        "access_token": access_token
                    }

                    publish_response = requests.post(publish_url, params=publish_params)
                    publish_data = publish_response.json()
                    
                    print("Publish Response:", publish_data)  # Debug log

                    if 'id' in publish_data:
                        post.instagram_post_id = publish_data['id']
                        post.save()
                        response_data['is_published'] = True
                        response_data['message'] = "Post created successfully"
                    else:
                        error_msg = publish_data.get('error', {}).get('message', 'Failed to publish media')
                        response_data['errors'].append(f"Instagram: {error_msg}")

            except Credential.DoesNotExist:
                response_data['errors'].append(f"No credentials found for {platform.platform}")
            except Exception as e:
                response_data['errors'].append(f"{platform.platform}: {str(e)}")
                print(f"Exception details: {str(e)}")  # Debug log

        if response_data['is_published']:
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            if not response_data['message']:
                response_data['message'] = "Post created but failed to publish"
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


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
