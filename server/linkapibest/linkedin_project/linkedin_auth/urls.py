# from django.urls import path
# from .views import linkedin_login, linkedin_callback, linkedin_post

# urlpatterns = [
#     path('linkedin/', linkedin_login, name='linkedin_login'),
#     path('linkedin/callback/', linkedin_callback, name='linkedin_callback'),
#     path('linkedin/post/', linkedin_post, name='linkedin_post'),
# ]



from django.urls import path
from .views import linkedin_login, linkedin_callback, linkedin_post

urlpatterns = [
    path('login/', linkedin_login, name='linkedin_login'),
    path('callback/', linkedin_callback, name='linkedin_callback'),
    path('post/', linkedin_post, name='linkedin_post'),
]


