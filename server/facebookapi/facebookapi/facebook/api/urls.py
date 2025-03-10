from django.urls import path
from .views import FacebookLoginAPIView

urlpatterns = [
    path('facebook-login/', FacebookLoginAPIView.as_view(), name='facebook-login'),
]
