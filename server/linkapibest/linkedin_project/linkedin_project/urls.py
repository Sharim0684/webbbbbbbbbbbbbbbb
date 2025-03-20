# from django.contrib import admin
# from django.urls import path, include

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('auth/', include('linkedin_auth.urls')),  # Include LinkedIn auth URLs
# ]



from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    """ Health check API to verify if the server is running """
    return JsonResponse({"status": "ok"}, safe=False)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('linkedin/', include('linkedin_auth.urls')),  # LinkedIn authentication API routes
    path('', health_check, name="health_check"),  # Root health check
]


