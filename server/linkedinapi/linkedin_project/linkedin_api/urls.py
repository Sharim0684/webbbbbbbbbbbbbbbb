from django.urls import path
from .views import (
    linkedin_auth_url,
    linkedin_callback,
    linkedin_user_profile,
    linkedin_user_email,
    linkedin_post_update,
)

urlpatterns = [
    path("linkedin/auth-url/", linkedin_auth_url, name="linkedin_auth_url"),
    path("linkedin/callback/", linkedin_callback, name="linkedin_callback"),
    path("linkedin/profile/", linkedin_user_profile, name="linkedin_user_profile"),
    path("linkedin/email/", linkedin_user_email, name="linkedin_user_email"),
    path("linkedin/post/", linkedin_post_update, name="linkedin_post_update"),
]
