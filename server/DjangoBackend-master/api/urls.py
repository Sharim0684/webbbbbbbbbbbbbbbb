from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonViewSet, health_check, SignupAPIView, LoginAPIView

router = DefaultRouter()
router.register(r"person", PersonViewSet, basename="person")

urlpatterns = [
    path("", include(router.urls)),
    path("health/", health_check, name="health_check"),
    path("signup/", SignupAPIView.as_view(), name="signup"),
    path("login/", LoginAPIView.as_view(), name="login"),
]
