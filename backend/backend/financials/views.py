from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from .models import Invoice, InvoiceItem, Payment, Expense, TenantStatement
from .serializers import (InvoiceSerializer,
                          InvoiceItemSerializer,
                          PaymentSerializer,
                          ExpenseSerializer,
                          TenantStatementSerializer
                          )


# Invoice views


class InvoiceListCreateAPIView(generics.ListCreateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer


class InvoiceRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

# InvoiceItem views


class InvoiceItemListCreateAPIView(generics.ListCreateAPIView):
    queryset = InvoiceItem.objects.all()
    serializer_class = InvoiceItemSerializer


class InvoiceItemRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InvoiceItem.objects.all()
    serializer_class = InvoiceItemSerializer

# Payment crud operations


class PaymentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Retrieve tenant and payment data
        tenant = serializer.validated_data['tenant']
        payment_date = serializer.validated_data['payment_date']
        paid_amount = serializer.validated_data['paid_amount']
        description = serializer.validated_data['description']

        # Retrieve all TenantStatement instances for the specified tenant
        tenant_statements = TenantStatement.objects.filter(tenant=tenant)
        print(len(tenant_statements))

        # Calculate sum total of money_paid and money_due
        total_money_paid = sum(
            statement.money_paid for statement in tenant_statements)
        total_money_due = sum(
            statement.money_due for statement in tenant_statements)

        # Calculate running_balance
        running_balance = total_money_due - total_money_paid - paid_amount

        # Create TenantStatement
        TenantStatement.objects.create(
            transaction_date=payment_date,
            item="Payment",
            money_due=0,
            money_paid=paid_amount,
            running_balance=running_balance,
            description=f"Payment made for {description}",
            tenant=tenant
        )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class PaymentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class TenantStatementListAPIView(generics.ListAPIView):
    queryset = TenantStatement.objects.all()
    serializer_class = TenantStatementSerializer


class ExpenseListCreateView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer


class ExpenseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
