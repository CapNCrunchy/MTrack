from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Medication

UserModel = get_user_model()

class UserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["email", "password", "name"]

    def create(self, validated_data):
        user = UserModel.objects.create_user(**validated_data)
        return user
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user:
            return user
        raise serializers.ValidationError("User not found")
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["email", "name"]

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ["name", "form", "strength"]