from rest_framework import serializers
from .models import Invoice, Payment, Expense, TenantStatement, RunningBalance
# from tenant.serializers import TenantStatementSerializer


class InvoiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Invoice
        fields = '__all__'


class RunningBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RunningBalance
        fields = '__all__'


class TenantStatementSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantStatement
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    # tenant_statement = TenantStatementSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
