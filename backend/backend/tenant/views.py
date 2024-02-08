from rest_framework import generics
from .models import Tenant, RentDeposit
from .serializers import TenantSerializer, RentDepositSerializer


'''
TENANT DEPOSIT CRUD
'''


class TenantListView(generics.ListCreateAPIView):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer


class TenantDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer


'''
RENT DEPOSIT CRUD
'''


class RentDepositListView(generics.ListCreateAPIView):
    queryset = RentDeposit.objects.all()
    serializer_class = RentDepositSerializer


class RentDepositDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RentDeposit.objects.all()
    serializer_class = RentDepositSerializer
