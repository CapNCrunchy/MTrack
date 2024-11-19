from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, UserLoginSerializer, UserSignUpSerializer
from rest_framework import permissions, status


from .models import Medication, UserMedication

# Create your views here.
class UserSignUp(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = UserSignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.create(serializer.validated_data)
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        # check for errors
        if serializer.errors:
            if 'email' in serializer.errors:
                return Response({'error': serializer.errors['email'][0]}, status=status.HTTP_400_BAD_REQUEST)
            if 'password' in serializer.errors:
                return Response({'error': serializer.errors['password'][0]}, status=status.HTTP_400_BAD_REQUEST)
            if 'name' in serializer.errors:
                return Response({'error': serializer.errors['name'][0]}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = [SessionAuthentication]
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            return Response(status=status.HTTP_200_OK)
        # check for errors
        if serializer.errors:
            if 'non_field_errors' in serializer.errors:
                return Response({'error': serializer.errors['non_field_errors'][0]}, status=status.HTTP_400_BAD_REQUEST)
            if 'email' in serializer.errors:
                return Response({'error': serializer.errors['email'][0]}, status=status.HTTP_400_BAD_REQUEST)
            if 'password' in serializer.errors:
                return Response({'error': serializer.errors['password'][0]}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Unknown error'}, status=status.HTTP_400_BAD_REQUEST)
    
class UserLogout(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)
    
