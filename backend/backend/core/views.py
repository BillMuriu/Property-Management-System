from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework import generics, status, serializers
from .models import PropertyManager, Landlord
from .serializers import PropertyManagerSerializer, LandlordSerializer, UserSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.response import Response
from rest_framework.decorators import api_view


# Token View


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class LandlordListCreateAPIView(generics.ListCreateAPIView):
    queryset = Landlord.objects.all()
    serializer_class = LandlordSerializer


class LandlordRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Landlord.objects.all()
    serializer_class = LandlordSerializer


def user_landlord(request):
    user = request.user
    user_name = user.get_full_name() if user.get_full_name() else user.username
    landlord_objects = Landlord.objects.filter(user=user)
    landlord_names = [landlord.first_name for landlord in landlord_objects]
    return JsonResponse({'user_name': user_name, 'landlord_names': landlord_names})
