from django.urls import path, include
from api.views import FacebookLoginAPIView,FacebookLoginView

urlpatterns = [

    path('api/facebook-login/', FacebookLoginAPIView.as_view(), name='facebook-login'),
    path('social-auth/', include('social_django.urls', namespace='social')),
    path('api/', include('api.urls')),  # Keep this for other APIs

]
