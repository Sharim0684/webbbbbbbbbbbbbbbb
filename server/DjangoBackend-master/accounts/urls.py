from django.urls import path
from .views import (
    FacebookLoginView, FacebookCallbackView, facebook_token_exchange,
    InstagramLoginView, InstagramCallbackView, InstagramTokenExchangeView,
    InstagramTestView,
    LinkedInLoginView, LinkedInCallbackView, LinkedInTokenExchangeView,LinkedInShareView
)

urlpatterns = [
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
