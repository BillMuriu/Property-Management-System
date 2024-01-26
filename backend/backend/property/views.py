from django.shortcuts import render
from rest_framework import generics
from .models import (
    Property,
    Unit,
    Maintenance,
    PropertyOtherRecurringBill,
    UnitOtherRecurringBill
)
from .serializers import (
    PropertySerializer,
    UnitSerializer,
    MaintenanceSerializer,
    PropertyOtherRecurringBillSerializer,
    UnitOtherRecurringBillSerializer

)

'''
Propery CRUD operations
'''


class PropertyListView(generics.ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer


class PropertyDetailView(generics.RetrieveAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer


class PropertyCreateView(generics.CreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer


class PropertyUpdateView(generics.UpdateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer


class PropertyDeleteView(generics.DestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer


'''
UNIT CRUD OPERATIONS
'''


class UnitListCreateAPIView(generics.ListCreateAPIView):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer


class UnitRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer


class UnitUpdateAPIView(generics.UpdateAPIView):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer


class UnitDestroyAPIView(generics.DestroyAPIView):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer


'''
MAINTENANCE CRUD OPERATIONS
'''


class MaintenanceListCreateAPIView(generics.ListCreateAPIView):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer


class MaintenanceRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer


'''
PROPERTY RECURRING BILLS CRUD
'''


class PropertyOtherRecurringBillListCreateAPIView(generics.ListCreateAPIView):
    queryset = PropertyOtherRecurringBill.objects.all()
    serializer_class = PropertyOtherRecurringBillSerializer


class PropertyOtherRecurringBillRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PropertyOtherRecurringBill.objects.all()
    serializer_class = PropertyOtherRecurringBillSerializer


'''
UNIT RECURRING BILLS CRUD
'''


class UnitOtherRecurringBillListCreateAPIView(generics.ListCreateAPIView):
    queryset = UnitOtherRecurringBill.objects.all()
    serializer_class = UnitOtherRecurringBillSerializer


class UnitOtherRecurringBillRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UnitOtherRecurringBill.objects.all()
    serializer_class = UnitOtherRecurringBillSerializer
