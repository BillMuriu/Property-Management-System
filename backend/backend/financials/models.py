from django.db import models
from core.models import Property, Unit
from tenant.models import Tenant

# Create your models here.


class Invoice(models.Model):
    INVOICE_STATUS_CHOICES = (
        ('open', 'Open'),
        ('draft', 'Draft'),
        ('credit-note', 'Credit Note'),
    )

    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name='invoices')
    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name='invoices')
    invoice_date = models.DateField()
    invoice_status = models.CharField(
        max_length=20, choices=INVOICE_STATUS_CHOICES)
    memo = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Invoice #{self.id} - {self.property.name} - {self.tenant.first_name} {self.tenant.last_name}"


class InvoiceItem(models.Model):
    WATER = 'water'
    ELECTRICITY = 'electricity'
    GARBAGE = 'garbage'
    SECURITY = 'security'
    INTERNET = 'internet'
    CLEANING = 'cleaning'
    SERVICE = 'service'
    OPENING_BALANCE = 'opening_balance'
    PARKING_FEE = 'parking_fee'
    VAT = 'vat'
    OTHER = 'other'
    RENT_DEPOSIT = 'rent_deposit'
    WATER_DEPOSIT = 'water_deposit'
    ELECTRICITY_DEPOSIT = 'electricity_deposit'
    CONTRACT_CHARGES = 'contract_charges'
    OTHER_DEPOSIT = 'other_deposit'

    ITEM_NAME_CHOICES = [
        (WATER, 'Water'),
        (ELECTRICITY, 'Electricity'),
        (GARBAGE, 'Garbage'),
        (SECURITY, 'Security'),
        (INTERNET, 'Internet'),
        (CLEANING, 'Cleaning'),
        (SERVICE, 'Service'),
        (OPENING_BALANCE, 'Opening Balance'),
        (PARKING_FEE, 'Parking Fee'),
        (VAT, 'VAT'),
        (OTHER, 'Other'),
        (RENT_DEPOSIT, 'Rent Deposit'),
        (WATER_DEPOSIT, 'Water Deposit'),
        (ELECTRICITY_DEPOSIT, 'Electricity Deposit'),
        (CONTRACT_CHARGES, 'Contract Charges'),
        (OTHER_DEPOSIT, 'Other Deposit'),
    ]

    invoice = models.ForeignKey(
        Invoice, on_delete=models.CASCADE, related_name='items')
    item_name = models.CharField(max_length=100, choices=ITEM_NAME_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Item: {self.item_name} - Amount: {self.amount}"


class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('confirmed', 'Confirmed'),
    )

    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name='payments')
    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name='payments')
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES)
    payment_type = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    bank_transaction_id = models.CharField(
        max_length=100, blank=True, null=True)
    file_upload = models.FileField(
        upload_to='payment_receipts/', blank=True, null=True)

    def __str__(self):
        return f"Payment #{self.id} - {self.property.name} - {self.tenant.first_name} {self.tenant.last_name}"


class Expense(models.Model):
    EXPENSE_STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('confirmed', 'Confirmed'),
    )

    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name='expenses')
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE,
                             null=True, blank=True, related_name='unit_expenses')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    expense_category = models.CharField(max_length=100)
    expense_date = models.DateField()
    status = models.CharField(max_length=20, choices=EXPENSE_STATUS_CHOICES)
    notes = models.TextField(blank=True, null=True)
    file_upload = models.FileField(
        upload_to='property_expenses/', blank=True, null=True)

    def __str__(self):
        return f"Expense #{self.id} - {self.property.name} - {self.expense_category}"
