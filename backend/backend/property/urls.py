from django.urls import path
from .views import (
    PropertyListView,
    PropertyCreateView,
    PropertyUpdateView,
    PropertyDeleteView,
    PropertyDetailView,

    UnitListCreateAPIView,
    UnitRetrieveAPIView,
    UnitUpdateAPIView,
    UnitDestroyAPIView,

    MaintenanceListCreateAPIView,
    MaintenanceRetrieveUpdateDestroyAPIView
)

urlpatterns = [
    # Property URLS
    path('', PropertyListView.as_view(), name='property-list'),
    path('<int:pk>/', PropertyDetailView.as_view(),
         name='property-detail'),
    path('create/', PropertyCreateView.as_view(), name='property-create'),
    path('<int:pk>/update/',
         PropertyUpdateView.as_view(), name='property-update'),
    path('<int:pk>/delete/',
         PropertyDeleteView.as_view(), name='property-delete'),

    # Unit URLS
    path('units/', UnitListCreateAPIView.as_view(), name='unit-list-create'),
    path('units/<int:pk>/', UnitRetrieveAPIView.as_view(), name='unit-retrieve'),
    path('units/<int:pk>/update/', UnitUpdateAPIView.as_view(), name='unit-update'),
    path('units/<int:pk>/delete/', UnitDestroyAPIView.as_view(), name='unit-delete'),


    # maintenance urls
    path('maintenance/', MaintenanceListCreateAPIView.as_view(),
         name='maintenance-list-create'),
    path('maintenance/<int:pk>/',
         MaintenanceRetrieveUpdateDestroyAPIView.as_view(), name='maintenance-detail'),
]
