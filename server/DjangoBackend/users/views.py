from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from social_django.utils import load_strategy
from social_core.backends.google import GoogleOAuth2
from social_core.backends.facebook import FacebookOAuth2
from social_core.backends.linkedin import LinkedinOAuth2

class OAuthLoginView(APIView):
    def post(self, request):
        provider = request.data.get("provider")
        token = request.data.get("token")

        if provider == "google":
            backend = GoogleOAuth2(load_strategy())
        elif provider == "facebook":
            backend = FacebookOAuth2(load_strategy())
        elif provider == "linkedin":
            backend = LinkedinOAuth2(load_strategy())
        else:
            return Response({"error": "Invalid provider"}, status=400)

        user = backend.do_auth(token)
        if user:
            return Response({"message": "Login successful", "user": user.email})
        return Response({"error": "Authentication failed"}, status=400)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(username=validated_data['username'], email=validated_data['email'])
        user.set_encrypted_password(validated_data['password'])
        user.save()
        return user
