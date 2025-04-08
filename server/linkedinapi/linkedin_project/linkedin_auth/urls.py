from django.urls import path
from .views import linkedin_login, linkedin_callback

urlpatterns = [
    path("login/", linkedin_login, name="linkedin_login"),
    path("linkedin/callback/", linkedin_callback, name="linkedin_callback"), 
]
