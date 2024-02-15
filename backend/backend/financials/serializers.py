from rest_framework import serializers
from .models import Invoice, InvoiceItem, Payment, Expense, TenantStatement
# from tenant.serializers import TenantStatementSerializer


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = '__all__'


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
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
