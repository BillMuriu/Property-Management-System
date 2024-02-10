from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework import generics, status, serializers
from .models import PropertyManager, Landlord
from .serializers import PropertyManagerSerializer, LandlordSerializer, UserSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


# Token View


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserCreateAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class PropertyManagerListCreateAPIView(generics.ListCreateAPIView):
    queryset = PropertyManager.objects.all()
    serializer_class = PropertyManagerSerializer


class PropertyManagerRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PropertyManager.objects.all()
    serializer_class = PropertyManagerSerializer


class LandlordListCreateAPIView(generics.ListCreateAPIView):
    queryset = Landlord.objects.all()
    serializer_class = LandlordSerializer


class LandlordRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Landlord.objects.all()
    serializer_class = LandlordSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_landlord(request):
    # Get the requesting user
    user = request.user

    # Filter the Landlord queryset based on the requesting user
    try:
        landlord = Landlord.objects.get(user=user)
    except Landlord.DoesNotExist:
        return Response({"message": "Landlord not found for the user."}, status=status.HTTP_404_NOT_FOUND)

    # Serialize the landlord object
    serializer = LandlordSerializer(landlord)
    return Response(serializer.data)
