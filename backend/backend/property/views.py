from django.shortcuts import render
from rest_framework import generics
from .models import Property
from .serializers import PropertySerializer

# the PropertyListView


class PropertyListView(generics.ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
