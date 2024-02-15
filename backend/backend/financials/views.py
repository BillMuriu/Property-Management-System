from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from .models import Invoice, Payment, Expense, TenantStatement, RunningBalance
from .serializers import (InvoiceSerializer,
                          PaymentSerializer,
                          ExpenseSerializer,
                          TenantStatementSerializer,
                          RunningBalanceSerializer
                          )


# Invoice views


class InvoiceListCreateAPIView(generics.ListCreateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Retrieve invoice data
        invoice = serializer.instance
        property = invoice.property
        tenant = invoice.tenant
        invoice_date = invoice.invoice_date
        invoice_status = invoice.invoice_status
        item_name = invoice.item_name
        amount = invoice.amount
        description = invoice.description

        # Check if a RunningBalance instance exists for the tenant, create one if not
        running_balance, created = RunningBalance.objects.get_or_create(
            tenant=tenant)
        if created:
            running_balance.balance = 0  # Initial balance for demonstration purposes
            running_balance.save()

        # Update running balance (adjust balance based on invoice amount)
        running_balance.balance += amount
        running_balance.save()

        # Create TenantStatement for the invoice
        TenantStatement.objects.create(
            transaction_date=invoice_date,
            item=item_name,
            money_due=amount,
            money_paid=0,
            running_balance=running_balance.balance,
            description=f"Invoice for {property} paid by {tenant}",
            tenant=tenant
        )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class InvoiceRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer


# Payment crud operations


class PaymentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Retrieve tenant and payment data
        payment = serializer.instance
        tenant = payment.tenant
        payment_date = payment.payment_date
        paid_amount = payment.paid_amount
        description = payment.description

        # Check if a RunningBalance instance exists for the tenant, create one if not
        running_balance, created = RunningBalance.objects.get_or_create(
            tenant=tenant)
        if created:
            running_balance.balance = 0
            running_balance.save()

        # Update running balance
        running_balance.balance -= paid_amount
        running_balance.save()

        # Create TenantStatement for the payment
        TenantStatement.objects.create(
            transaction_date=payment_date,
            item='',
            money_due=0,
            money_paid=paid_amount,
            running_balance=running_balance.balance,
            description=f"Payment made for {description}",
            tenant=tenant,
            payment=payment  # Link the payment to the tenant statement
        )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class PaymentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Get initial paid_amount before updating payment
        initial_paid_amount = instance.paid_amount

        # Update payment instance
        self.perform_update(serializer)

        # Get updated paid_amount after updating payment
        updated_instance = self.get_object()
        updated_paid_amount = updated_instance.paid_amount

        # Calculate the difference
        difference = updated_paid_amount - initial_paid_amount

        # Retrieve TenantStatement instance for the payment being updated
        tenant_statement = TenantStatement.objects.get(payment=instance)

        # Retrieve the initial running balance for the specific tenant statement
        initial_running_balance = tenant_statement.running_balance

        # Calculate the updated running balance for the specific tenant statement
        updated_running_balance = initial_running_balance - difference

        the_running_balance = RunningBalance.objects.get(
            tenant=instance.tenant)

        # Update running balance by subtracting the difference
        the_running_balance.balance += difference
        the_running_balance.save()

        # Update TenantStatement for the payment
        tenant_statement.transaction_date = updated_instance.payment_date
        tenant_statement.item = 'Payment'
        tenant_statement.money_due = 0
        tenant_statement.money_paid = updated_paid_amount
        # Use the updated running balance
        tenant_statement.running_balance = updated_running_balance
        tenant_statement.description = f"Payment updated for {updated_instance.description}"
        tenant_statement.tenant = updated_instance.tenant
        tenant_statement.save()

        other_tenant_statements = TenantStatement.objects.filter(
            tenant=tenant_statement.tenant,
            created_at__gt=tenant_statement.created_at
        )

        for statement in other_tenant_statements:
            statement.running_balance -= difference
            statement.save()

        return Response(serializer.data)


class TenantStatementListAPIView(generics.ListAPIView):
    queryset = TenantStatement.objects.all()
    serializer_class = TenantStatementSerializer


class ExpenseListCreateView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer


class ExpenseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
