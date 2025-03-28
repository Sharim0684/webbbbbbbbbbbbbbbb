from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
    Group,
    Permission,
)
from django.db import models
from django.utils.timezone import now


class UserManager(BaseUserManager):
    def create_user(self, name, email, phone_number, gender, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(
            name=name, email=email, phone_number=phone_number, gender=gender
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, name, email, phone_number, gender, password=None):
        user = self.create_user(name, email, phone_number, gender, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = [("male", "Male"), ("female", "Female"), ("other", "Other")]

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    password = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    role = models.CharField(max_length=50, default="user")
    profile_picture_url = models.URLField(blank=True, null=True)
    email_verified_at = models.DateTimeField(null=True, blank=True)
    last_login_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    groups = models.ManyToManyField(
        Group, related_name="custom_user_groups", blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission, related_name="custom_user_permissions", blank=True
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "phone_number", "gender"]

    def __str__(self):
        return self.email


class Person(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name
