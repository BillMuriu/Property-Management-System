from rest_framework import status
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from django.http import HttpResponse
from django.views import View
from django.utils import timezone
from decimal import Decimal
from datetime import datetime
from rest_framework.views import APIView
from django.shortcuts import render
from django.template.loader import render_to_string
import pdfkit
import requests
from django.db.models import Sum


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
from financials.models import Expense

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


class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
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
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')
        property_id = request.query_params.get('property_id')

        if not (start_date_str and end_date_str):
            return Response({'error': 'start_date and end_date are required'}, status=status.HTTP_400_BAD_REQUEST)

        start_date, end_date = self.parse_date_range(
            start_date_str, end_date_str)

        queryset = Tenant.objects.all()

        if property_id:
            queryset = queryset.filter(property=property_id)

        response_data = []

        property_instance = None
        total_amount_paid = 0
        total_category_amounts = {
            'Rent': 0,
            'Water Bill': 0,
            'Deposit Invoices': 0,
            'Other Bills': 0,
            'Amount Due': 0
        }
        total_balance = 0

        if property_id:
            try:
                property_instance = Property.objects.get(id=property_id)
                property_data = self.get_property_data(
                    property_instance, start_date, end_date)
            except Property.DoesNotExist:
                property_data = {}

        for tenant_data in self.get_tenants_data(queryset):
            tenant_response = {
                'tenant_id': tenant_data['id'],
                'unit': tenant_data['unit'],
                'property_name': tenant_data['property'],
                'phone_number': tenant_data['phone_number'],
                'category_sums': self.calculate_category_sums(tenant_data, start_date, end_date),
                'total_amount_due': 0,
                'balance_carried_forward': 0,
                'amount_paid': 0,
                'balance': 0,
            }

            tenant_response['total_amount_due'] = tenant_response['category_sums']['Amount Due']
            tenant_response['balance_carried_forward'] = self.calculate_balance_carried_forward(
                tenant_data, start_date)
            tenant_response['amount_paid'] = self.calculate_amount_paid(
                tenant_data, start_date, end_date)
            tenant_response['balance'] = tenant_response['total_amount_due'] - \
                tenant_response['amount_paid']

            total_amount_paid += tenant_response['amount_paid']
            for category, amount in tenant_response['category_sums'].items():
                total_category_amounts[category] += amount

            total_balance += tenant_response['balance']

            response_data.append({
                'tenant_data': tenant_response,
            })

        return Response({
            'tenants': response_data,
            'property_data': property_data,  # Include property data for the entire range
            'total_amount_paid': total_amount_paid,
            'total_category_amounts': total_category_amounts,
            'total_balance': total_balance
        })

    def get_property_data(self, property_instance, start_date, end_date):
        if not property_instance:
            return {}

        return {
            'expenses': self.get_expenses(property_instance, start_date, end_date),
            'tax_rate': property_instance.tax_rate,
            'management_fee': property_instance.management_fee
        }

    def get_expenses(self, property_instance, start_date, end_date):
        expenses = Expense.objects.filter(
            property=property_instance,
            expense_date__range=(start_date, end_date)
        ).values('id', 'amount', 'payment_method', 'expense_category', 'expense_date', 'status', 'notes', 'file_upload', 'property', 'unit')
        total_expense_amount = expenses.aggregate(total=Sum('amount'))['total']
        return {
            'expenses': list(expenses),
            'total_expense_amount': total_expense_amount if total_expense_amount else Decimal(0)
        }

    def parse_date_range(self, start_date_str, end_date_str):
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
        return start_date, end_date

    def get_tenants_data(self, queryset):
        serializer = self.serializer_class(queryset, many=True)
        return serializer.data

    def calculate_category_sums(self, tenant_data, start_date, end_date):
        category_sums = {
            'Rent': 0,
            'Water Bill': 0,
            'Deposit Invoices': 0,
            'Other Bills': 0,
            'Amount Due': 0
        }

        invoices = tenant_data.get('invoices', [])

        for invoice in invoices:
            invoice_date_str = invoice.get('invoice_date')
            invoice_date = datetime.strptime(invoice_date_str, '%Y-%m-%d')

            if start_date <= invoice_date <= end_date:
                item_name = invoice.get('item_name')
                amount = Decimal(invoice.get('amount'))

                if item_name == 'rent':
                    category_sums['Rent'] += amount
                elif item_name == 'water':
                    category_sums['Water Bill'] += amount
                elif 'rent_deposit' in item_name.lower():
                    category_sums['Deposit Invoices'] += amount
                else:
                    category_sums['Other Bills'] += amount

                category_sums['Amount Due'] += amount

        return category_sums

    def calculate_balance_carried_forward(self, tenant_data, start_date):
        tenant_statements = tenant_data.get('statements', [])
        filtered_statements = [statement for statement in tenant_statements
                               if datetime.strptime(statement.get('transaction_date'), '%Y-%m-%d') < start_date]

        if filtered_statements:
            latest_statement = max(filtered_statements,
                                   key=lambda x: x.get('transaction_date'))
            running_balance = Decimal(latest_statement.get('running_balance'))
            return max(0, running_balance)
        return 0

    def calculate_amount_paid(self, tenant_data, start_date, end_date):
        tenant_payments = tenant_data.get('payments', [])
        total_amount_paid = sum(Decimal(payment.get('paid_amount')) for payment in tenant_payments
                                if start_date <= datetime.strptime(payment.get('payment_date'), '%Y-%m-%d') <= end_date)
        return total_amount_paid


class PropertyStatementHTMLView(View):
    template_name = 'property/pdf/property-statement.html'

    def get(self, request):
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')
        property_id = request.GET.get('property_id')

        if not (start_date_str and end_date_str and property_id):
            return HttpResponse('Missing required parameters', status=400)

        try:
            property_instance = Property.objects.get(id=property_id)
            property_name = property_instance.name
        except Property.DoesNotExist:
            property_name = 'N/A'

        property_statement_api_url = f'http://127.0.0.1:8000/property/property-statements/?start_date={start_date_str}&end_date={end_date_str}&property_id={property_id}'

        try:
            api_response = requests.get(property_statement_api_url)
            api_data = api_response.json()
        except Exception as e:
            return HttpResponse('Error fetching data from API', status=500)

        date_created = datetime.now().strftime('%B %d, %Y %H:%M:%S')
        start_date_formatted = datetime.strptime(
            start_date_str, '%Y-%m-%d').strftime('%B %d, %Y')
        end_date_formatted = datetime.strptime(
            end_date_str, '%Y-%m-%d').strftime('%B %d, %Y')

        # Extracting relevant data from the API response
        total_amount_paid = api_data.get('total_amount_paid', 0)
        property_data = api_data.get('property_data', {})
        total_expense_amount = property_data.get(
            'expenses', {}).get('total_expense_amount', 0)
        tax_rate = property_data.get('tax_rate', 0)

        html_content = render_to_string(self.template_name, {
            'property_name': property_name,
            'date_created': date_created,
            'start_date': start_date_formatted,
            'end_date': end_date_formatted,
            'total_amount_paid': total_amount_paid,
            'total_expense_amount': total_expense_amount,
            'tax_rate': tax_rate
        })

        return HttpResponse(html_content)
