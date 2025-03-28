from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth.hashers import make_password
from .models import User

@receiver(post_migrate)
def create_admin_user(sender, **kwargs):
    if sender.name == "api":  # Ensure it runs only for your app
        if settings.ADMIN_EMAIL and not User.objects.filter(email=settings.ADMIN_EMAIL).exists():
            User.objects.create(
                name=settings.ADMIN_NAME,
                email=settings.ADMIN_EMAIL,
                phone_number=settings.ADMIN_PHONE,
                password=make_password(settings.ADMIN_PASSWORD),
                is_superuser=True,
                is_staff=True,
                is_active=True,
            )