from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .views import (
    LandlordListCreateAPIView, LandlordRetrieveUpdateDestroyAPIView,
    PropertyManagerListCreateAPIView, PropertyManagerRetrieveUpdateDestroyAPIView,
    UserCreateAPIView,
    MyTokenObtainPairView,
    user_landlord

)

urlpatterns = [
    path('create_user/', UserCreateAPIView.as_view(), name='create_user'),

    path('property-managers/', PropertyManagerListCreateAPIView.as_view(),
         name='property-manager-list-create'),
    path('property-managers/<int:pk>/', PropertyManagerRetrieveUpdateDestroyAPIView.as_view(),
         name='property-manager-retrieve-update-destroy'),

    path('landlords/', LandlordListCreateAPIView.as_view(),
         name='landlord-list-create'),
    path('landlords/<int:pk>/',
         LandlordRetrieveUpdateDestroyAPIView.as_view(), name='landlord-detail'),


    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    path('user_landlord/', user_landlord,
         name='check_landlord_status'),

]
