from django.db import models
from core.models import Property
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
    invoice = models.ForeignKey(
        Invoice, on_delete=models.CASCADE, related_name='items')
    item_name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return f"Item: {self.item_name} - Amount: {self.amount}"
