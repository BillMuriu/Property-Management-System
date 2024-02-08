from django.contrib.auth.models import User
from rest_framework import generics, status, serializers
from .models import PropertyManager, Landlord
from .serializers import PropertyManagerSerializer, LandlordSerializer, UserSerializer


class LandlordListCreateAPIView(generics.ListCreateAPIView):
    queryset = Landlord.objects.all()
    serializer_class = LandlordSerializer


class LandlordRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Landlord.objects.all()
    serializer_class = LandlordSerializer
