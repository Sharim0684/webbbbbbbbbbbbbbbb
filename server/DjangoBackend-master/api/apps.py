from django.apps import AppConfig
from django.contrib.auth.hashers import make_password
from django.conf import settings


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"

    def ready(self):
        try:
            from api import signals
        except Exception:
            print("Database not ready!!")