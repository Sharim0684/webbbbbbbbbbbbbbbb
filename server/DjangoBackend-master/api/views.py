from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, status, filters
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import check_password
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.utils.timezone import now

from .models import User, Person
from .serializers import SignupSerializer, PersonSerializer


class SignupAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = jwt.encode(
                {"id": user.id, "email": user.email, "exp": datetime.utcnow() + timedelta(days=7)},
                settings.SECRET_KEY,
                algorithm="HS256",
            )
            return Response(
                {
                    "message": "Signup successful",
                    "userdata": {
                        "name": user.name,
                        "email": user.email,
                        "phone_number": user.phone_number,
                        "gender": user.gender,
                    },
                    "token": token,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Email does not exist."}, status=status.HTTP_400_BAD_REQUEST
            )

        if not check_password(password, user.password):
            return Response(
                {"error": "Incorrect password."}, status=status.HTTP_400_BAD_REQUEST
            )

        token = jwt.encode(
            {"id": user.id, "email": user.email, "exp": datetime.utcnow() + timedelta(days=7)},
            settings.SECRET_KEY,
            algorithm="HS256",
        )
        user.last_login = now()
        user.last_login_at = now()
        user.save()
        return Response(
            {
                "message": "Login successful",
                "userdata": {
                    "name": user.name,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "gender": user.gender,
                },
                "token": token,
            },
            status=status.HTTP_200_OK,
        )


class PersonViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Person model API endpoints.
    Provides GET (list & retrieve), POST (create), PUT (update), PATCH (partial update), and DELETE operations.
    Also supports filtering, searching, and sorting.
    """

    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    search_fields = ["name", "email", "age"]  # Allows searching by name or email
    ordering_fields = ["name", "age", "email"]  # Allows sorting by name, age, or email
    ordering = ["name"]  # Default ordering by name

    def create(self, request, *args, **kwargs):
        """
        Explicitly define required fields for request validation.
        """
        required_fields = ["name", "age", "email"]
        missing_fields = [
            field for field in required_fields if field not in request.data
        ]

        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().create(request, *args, **kwargs)

    def retrieve(self, request, pk=None):
        """
        Fetch a single Person by ID.
        """
        person = get_object_or_404(Person, pk=pk)
        serializer = self.get_serializer(person)
        return Response(serializer.data)

    def update(self, request, pk=None):
        """
        Fully updates a Person instance (PUT method).
        Requires all fields to be present in the request body.
        """
        person = get_object_or_404(Person, pk=pk)
        serializer = self.get_serializer(person, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        """
        Partially updates a Person instance (PATCH method).
        Allows updating specific fields without sending the entire object.
        """
        person = get_object_or_404(Person, pk=pk)
        serializer = self.get_serializer(person, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """
        Deletes a specific Person instance (DELETE method).
        """
        person = get_object_or_404(Person, pk=pk)
        person.delete()
        return Response(
            {"message": "Person deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


@api_view(["GET"])
def health_check(request):
    """
    A simple API view to check if the API is up and running.
    """
    return Response({"status": "API is up and running!"})
