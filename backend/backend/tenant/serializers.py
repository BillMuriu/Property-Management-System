from rest_framework import serializers
from .models import Tenant, RentDeposit


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = '__all__'


class RentDepositSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentDeposit
        fields = '__all__'
