from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
import re
from .models import User, Person


class SignupSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'name',
            'email',
            'phone_number',
            'gender',
            'password',
            'confirm_password',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'confirm_password': {'write_only': True}
        }

    def validate_email(self, value):
        """Validate email format and uniqueness"""
        try:
            validate_email(value)
        except serializers.ValidationError:
            raise serializers.ValidationError('Invalid email format')
        
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already exists')
        return value

    def validate_phone_number(self, value):
        """Validate phone number format"""
        if not re.match(r'^\+?\d{10,15}$', value):
            raise serializers.ValidationError('Invalid phone number format')
        return value

    def validate(self, data):
        """Validate password confirmation"""
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match'})
        return data

    def create(self, validated_data):
        """Create user with hashed password"""
        validated_data.pop('confirm_password')
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class PersonSerializer(serializers.ModelSerializer):
    """Serializer for Person model"""
    
    class Meta:
        model = Person
        fields = '__all__'
        read_only_fields = ['user']

    def create(self, validated_data):
        """Create person associated with user"""
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    person = PersonSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'name',
            'email',
            'phone_number',
            'gender',
            'person'
        ]
        read_only_fields = ['id']


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """Validate user credentials"""
        user = User.objects.filter(email=data['email']).first()
        if not user or not user.check_password(data['password']):
            raise serializers.ValidationError('Invalid credentials')
        return data


class CredentialsSerializer(serializers.Serializer):
    """Serializer for social media credentials"""
    platform = serializers.CharField()
    access_token = serializers.CharField()
    refresh_token = serializers.CharField(required=False)
    token_expires_at = serializers.DateTimeField(required=False)

    def validate_platform(self, value):
        """Validate platform name"""
        valid_platforms = ['facebook', 'linkedin', 'instagram']
        if value.lower() not in valid_platforms:
            raise serializers.ValidationError('Invalid platform')
        return value.lower()

    def validate(self, data):
        """Validate token expiration"""
        if 'token_expires_at' in data:
            if data['token_expires_at'] < timezone.now():
                raise serializers.ValidationError('Token has expired')
        return data

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                "Password and confirm password must be the same."
            )
        return data

    def validate_name(self, value):
        if not re.match("^[a-zA-Z ]*$", value):
            raise serializers.ValidationError("Name cannot contain special characters.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_phone_number(self, value):
        if not re.match(r"^[0-9]{10,15}$", value):
            raise serializers.ValidationError("Enter a valid phone number.")
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Phone number already exists.")
        return value

    def validate_password(self, value):
        if not re.match(
            r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
            value,
        ):
            raise serializers.ValidationError(
                "Password must contain at least 8 characters, one uppercase, one lowercase, one digit, and one special character."
            )
        return value

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        validated_data["password"] = make_password(validated_data["password"])
        return User.objects.create(**validated_data)


class PersonSerializer(serializers.ModelSerializer):
    # Explicit field declarations help to enforce requirements and validations.
    name = serializers.CharField(required=True, max_length=100)
    # age = serializers.IntegerField(required=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = Person
        # Included the auto-generated primary key (id) in responses.
        fields = ("id", "name", "age", "email")


class SocialAuthSerializer(serializers.Serializer):
    provider = serializers.CharField()
    access_token = serializers.CharField()
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'phone_number', 'gender', 'social_provider')


