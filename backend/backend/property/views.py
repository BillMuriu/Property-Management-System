from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from decimal import Decimal
from datetime import datetime
from rest_framework.views import APIView

from .models import (
    Property,
    Unit,
    Maintenance,
    PropertyOtherRecurringBill,
    UnitOtherRecurringBill,
    Utilities
)
from .serializers import (
    PropertySerializer,
    UnitSerializer,
    MaintenanceSerializer,
    PropertyOtherRecurringBillSerializer,
    UnitOtherRecurringBillSerializer,
    UtilitiesSerializer,

)

from tenant.models import Tenant
from tenant.serializers import TenantSerializer

from core.permissions import IsAdminUser, IsEditorUser, IsViewerUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

'''
Propery CRUD operations
'''


class PropertyListView(generics.ListCreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    # permission_classes = [IsAuthenticated,
    #                       (IsAdminUser | IsEditorUser | IsViewerUser)]


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
    # Add DjangoFilterBackend to enable filtering
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['property', 'unit_id_or_name',
                        'rent_amount', 'occupied', 'tax_rate']


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


'''
UTILITIES CRUD OPERATIONS
'''


class UtilitiesListCreateAPIView(generics.ListCreateAPIView):
    queryset = Utilities.objects.all()
    serializer_class = UtilitiesSerializer


class UtilitiesRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Utilities.objects.all()
    serializer_class = UtilitiesSerializer


class PropertyStatementListAPIView(APIView):
    serializer_class = TenantSerializer

    def get(self, request, *args, **kwargs):
        # Get start_date and end_date from request query parameters
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')

        # Convert start_date and end_date strings to datetime objects
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')

        # Get all tenants
        queryset = Tenant.objects.all()
        serializer = self.serializer_class(queryset, many=True)

        response_data = []

        for tenant_data in serializer.data:
            # Initialize category sums for each tenant
            category_sums = {
                'Rent': 0,
                'Water Bill': 0,
                'Deposit Invoices': 0,
                'Other Bills': 0,
                'Amount Due': 0
            }

            # Extract tenant details
            tenant_id = tenant_data['id']
            unit = tenant_data['unit']
            property_name = tenant_data['property']
            phone_number = tenant_data['phone_number']

            # Get tenant statements within the specified date range
            tenant_statements = tenant_data.get('statements', [])
            filtered_statements = []
            for statement in tenant_statements:
                statement_date_str = statement.get('transaction_date')
                statement_date = datetime.strptime(
                    statement_date_str, '%Y-%m-%d')
                if statement_date < start_date:
                    filtered_statements.append(statement)

            # Get the latest tenant statement within the filtered statements
            latest_statement = None
            if filtered_statements:
                latest_statement = max(
                    filtered_statements, key=lambda x: x.get('transaction_date'))

            # Calculate balance_carried_forward based on the latest statement
            balance_carried_forward = 0
            if latest_statement:
                running_balance = Decimal(
                    latest_statement.get('running_balance'))
                if running_balance > 0:
                    balance_carried_forward = running_balance

            invoices = tenant_data.get('invoices', [])

            for invoice in invoices:
                invoice_date_str = invoice.get('invoice_date')
                invoice_date = datetime.strptime(invoice_date_str, '%Y-%m-%d')

                # Check if invoice date is within the specified range
                if start_date <= invoice_date <= end_date:
                    item_name = invoice.get('item_name')
                    amount = invoice.get('amount')

                    if item_name == 'rent':
                        category_sums['Rent'] += Decimal(amount)
                    elif item_name == 'water':
                        category_sums['Water Bill'] += Decimal(amount)
                    elif 'rent_deposit' in item_name.lower():
                        category_sums['Deposit Invoices'] += Decimal(amount)
                    else:
                        category_sums['Other Bills'] += Decimal(amount)

                    # Add to total amount due for the tenant
                    category_sums['Amount Due'] += Decimal(amount)

            # Append category sums, tenant details, and balance_carried_forward to the response data
            response_data.append({
                'tenant_id': tenant_id,
                'unit': unit,
                'property_name': property_name,
                'phone_number': phone_number,
                'category_sums': category_sums,
                'total_amount_due': category_sums['Amount Due'],
                'balance_carried_forward': balance_carried_forward
            })

        return Response(response_data)
