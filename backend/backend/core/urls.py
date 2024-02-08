from django.urls import path
from .views import (
    LandlordListCreateAPIView, LandlordRetrieveUpdateDestroyAPIView
)

urlpatterns = [
    path('landlords/', LandlordListCreateAPIView.as_view(),
         name='landlord-list-create'),
    path('landlords/<int:pk>/',
         LandlordRetrieveUpdateDestroyAPIView.as_view(), name='landlord-detail'),
]
