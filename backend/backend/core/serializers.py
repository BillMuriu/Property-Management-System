from rest_framework import serializers
from .models import PropertyManager, Landlord, CustomUser
from property.models import Property
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']


class CustomUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = CustomUser
        fields = ['user', 'role']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        custom_user = CustomUser.objects.create(user=user, **validated_data)
        return custom_user


class PropertyManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyManager
        fields = '__all__'


class LandlordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landlord
        fields = '__all__'
