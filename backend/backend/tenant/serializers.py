from rest_framework import serializers
from .models import Tenant, RentDeposit
from financials.serializers import (
    InvoiceSerializer,
    PaymentSerializer,
    TenantStatementSerializer,
    RunningBalanceSerializer
)


class TenantSerializer(serializers.ModelSerializer):
    invoices = InvoiceSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    statements = TenantStatementSerializer(many=True, read_only=True)
    running_balance = RunningBalanceSerializer(read_only=True)

    class Meta:
        model = Tenant
        fields = '__all__'


class RentDepositSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentDeposit
        fields = '__all__'
