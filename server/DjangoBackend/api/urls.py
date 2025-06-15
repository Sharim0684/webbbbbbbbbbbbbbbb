from django.urls import path
from .views import (
    SignupAPIView,
    LoginAPIView,
    PersonViewSet,
    health_check,
    SocialLoginView,
    AutoLoginView,
    PlatformSelectionView,
    CheckCredentialsView,
    CreatePostView,
    OAuthCallbackView,
    FacebookLoginView,
    FacebookCallbackView,
    facebook_token_exchange,
    InstagramLoginView,
    InstagramCallbackView,
    InstagramTokenExchangeView,
    InstagramTestView,
    LinkedInLoginView,
    LinkedInCallbackView,
    LinkedInTokenExchangeView,
    LinkedInShareView,
    GetCredentialsView
)

from .views import UserPlatformsView
from . import views

urlpatterns = [
    # Authentication endpoints
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('health/', health_check, name='health-check'),
    
    # Social Authentication endpoints
    path('auth/facebook/authorize/', views.facebook_authorize, name='facebook_authorize'),
    path('auth/linkedin/authorize/', views.linkedin_authorize, name='linkedin_authorize'),
    path('auth/facebook/callback/', OAuthCallbackView.as_view(), name='facebook_callback'),
    path('auth/linkedin/callback/', OAuthCallbackView.as_view(), name='linkedin_callback'),
    path('auth/facebook/login/', SocialLoginView.as_view(), name='facebook-login'),
    path('auth/linkedin/login/', SocialLoginView.as_view(), name='linkedin-login'),
    path('auth/instagram/login/', InstagramLoginView.as_view(), name='instagram-login'),
    
    # Platform management endpoints
    path('user-platforms/', UserPlatformsView.as_view(), name='user-platforms'),
    path('platforms/', PlatformSelectionView.as_view(), name='platform-selection'),
    path('auth/check-credentials/', CheckCredentialsView.as_view(), name='check-credentials'),
    path('social/get-credentials/', GetCredentialsView.as_view(), name='get-credentials'),
    path('social/post/', CreatePostView.as_view(), name='create-post'),
    
    # Profile management endpoints
    path('auth/auto-login/', AutoLoginView.as_view(), name='auto-login'),
    path('person/', PersonViewSet.as_view({'get': 'list', 'post': 'create'}), name='person-list'),
    path('person/<int:pk>/', PersonViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='person-detail'),
    
    # Auto-login endpoint
    path('auth/auto-login/', AutoLoginView.as_view(), name='auto-login'),


      # Facebook URLs
    path('facebook/login/', FacebookLoginView.as_view(), name='facebook-login'),
    path('facebook/callback/', FacebookCallbackView.as_view(), name='facebook-callback'),
    #path('facebook/token-exchange/', facebook_token_exchange.as_view(), name='facebook-token-exchange'),
    path('facebook/token-exchange/', facebook_token_exchange, name='facebook_token_exchange'),

    # Instagram URLs (using Facebook's Graph API)
    path('instagram/login/', InstagramLoginView.as_view(), name='instagram-login'),
    path('instagram/callback/', InstagramCallbackView.as_view(), name='instagram-callback'),
    path('instagram/token-exchange/', InstagramTokenExchangeView.as_view(), name='instagram-token-exchange'),

    # LinkedIn URLs
    path('linkedin/login/', LinkedInLoginView.as_view(), name='linkedin-login'),
    path('linkedin/callback/', LinkedInCallbackView.as_view(), name='linkedin-callback'),
    path('linkedin/token-exchange/', LinkedInTokenExchangeView.as_view(), name='linkedin-token-exchange'),
    path('linkedin/share/', LinkedInShareView.as_view(), name='linkedin-share'),
    path('instagram/test/', InstagramTestView.as_view(), name='instagram-test'),

]

