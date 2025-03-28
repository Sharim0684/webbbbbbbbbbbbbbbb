from django.urls import path
from .views import FacebookCallbackView, FacebookLoginView, InstagramCallbackView, InstagramLoginView, TwitterCallbackView, TwitterLoginView

urlpatterns = [
    path("facebook/login/", FacebookLoginView.as_view(), name="Facebook_login"),
    path("facebook/callback/", FacebookCallbackView.as_view(), name="Facebook_callback"),
    path("instagram/login/", InstagramLoginView.as_view(), name="Instagram_Login"),
    path("instagram/callback/", InstagramCallbackView.as_view(), name="Instagram_callback"),
    path("twitter/login/",TwitterLoginView.as_view(), name="Twitter_Login"),
    path("twitter/callback/", TwitterCallbackView.as_view(), name="Twitter_callback")
]
