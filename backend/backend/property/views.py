from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from django.http import HttpResponse
from django.views import View
from decimal import Decimal
from datetime import datetime
from rest_framework.views import APIView
from django.shortcuts import render
from django.template.loader import render_to_string
import pdfkit

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
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')
        start_date, end_date = self.parse_date_range(
            start_date_str, end_date_str)

        queryset = Tenant.objects.all()
        response_data = []

        for tenant_data in self.get_tenants_data(queryset):
            category_sums = self.calculate_category_sums(
                tenant_data, start_date, end_date)
            balance_carried_forward = self.calculate_balance_carried_forward(
                tenant_data, start_date)
            amount_paid = self.calculate_amount_paid(
                tenant_data, start_date, end_date)
            balance = category_sums['Amount Due'] - amount_paid

            response_data.append({
                'tenant_id': tenant_data['id'],
                'unit': tenant_data['unit'],
                'property_name': tenant_data['property'],
                'phone_number': tenant_data['phone_number'],
                'category_sums': category_sums,
                'total_amount_due': category_sums['Amount Due'],
                'balance_carried_forward': balance_carried_forward,
                'amount_paid': amount_paid,
                'balance': balance
            })

        return Response(response_data)

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


class PropertyStatementPDFDownload(View):
    serializer_class = TenantSerializer
    template_name = 'property/pdf/property-statement.html'

    def get(self, request):
        # Get start_date and end_date from request query parameters
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')

        # Convert start_date and end_date strings to datetime objects
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')

        # Get all tenants
        queryset = Tenant.objects.all()
        response_data = []

        for tenant_data in self.get_tenants_data(queryset):
            category_sums = self.calculate_category_sums(
                tenant_data, start_date, end_date)
            balance_carried_forward = self.calculate_balance_carried_forward(
                tenant_data, start_date)
            amount_paid = self.calculate_amount_paid(
                tenant_data, start_date, end_date)
            balance = category_sums['Amount Due'] - amount_paid

            response_data.append({
                'tenant_id': tenant_data['id'],
                'unit': tenant_data['unit'],
                'property_name': tenant_data['property'],
                'phone_number': tenant_data['phone_number'],
                'category_sums': category_sums,
                'total_amount_due': category_sums['Amount Due'],
                'balance_carried_forward': balance_carried_forward,
                'amount_paid': amount_paid,
                'balance': balance
            })

        # Render PDF template with response_data
        html_content = render_to_string(
            self.template_name, {'response_data': response_data})

        # Configure wkhtmltopdf
        config = pdfkit.configuration(
            wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe")

        # Generate PDF
        pdf = pdfkit.from_string(html_content, False, configuration=config)

        # Create HTTP response with PDF content
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="property_statement.pdf"'
        return response

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
