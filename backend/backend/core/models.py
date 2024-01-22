from django.contrib.auth.models import AbstractUser
from django.db import models

# admin user model


class PropertyManager(models.Model):

    ROLE_CHOICES = (
        ('viewer', 'Viewer'),
        ('editor', 'Editor'),
        ('admin', 'admin'),
        # Add other roles as needed
    )

    username = models.CharField(max_length=30, null=True, blank=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    roles = models.CharField(
        max_length=50, choices=ROLE_CHOICES, blank=True, null=True)
    property = models.ManyToManyField(
        'Property', related_name='property_managers', blank=True)
    first_name = models.CharField(max_length=30, null=True, blank=True)
    last_name = models.CharField(max_length=30, null=True, blank=True)

    def __str__(self):
        return self.username


# Landlord model
class Landlord(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=15)
    property = models.ManyToManyField(
        'Property', related_name='landlords', blank=True)
    national_id = models.CharField(max_length=20, null=True, blank=True)
    krapin = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    next_of_kin = models.CharField(max_length=50, null=True, blank=True)
    next_of_kin_phone = models.CharField(max_length=15, )
    notes = models.TextField(null=True, blank=True)
    disbursment_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Property(models.Model):
    name = models.CharField(max_length=255)
    number_of_units = models.PositiveIntegerField()
    city = models.CharField(max_length=100)
    water_rate = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    electricity_rate = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    rent_payment_penalty = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    # mpesa paybill
    tax_rate = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True)
    management_fee = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    street_name = models.CharField(max_length=100, null=True, blank=True)
    company_name = models.CharField(max_length=100, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    other_recurring_bills = models.ManyToManyField(
        'OtherRecurringBill', related_name='properties', blank=True)

    def __str__(self):
        return self.name

# other recurring bills


class OtherRecurringBill(models.Model):
    bill_type = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.bill_type} - {self.amount}"


# properties_app/models.py


class Unit(models.Model):
    property = models.ForeignKey(
        'Property', on_delete=models.CASCADE, related_name='units')
    unit_id_or_name = models.CharField(max_length=50)
    rent_amount = models.DecimalField(max_digits=10, decimal_places=2)
    occupied = models.BooleanField(default=False)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True,
                                   blank=True, help_text='Enter as percentage (e.g., 10.50 for 10.50%)')
    other_recurring_bills = models.ManyToManyField(
        'OtherRecurringBill', related_name='units', blank=True)
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.property.name} - {self.unit_id_or_name}"


class Utilities(models.Model):
    property = models.ForeignKey(
        'Property', on_delete=models.CASCADE, related_name='utilities')
    unit = models.ForeignKey(
        'Unit', on_delete=models.CASCADE, related_name='utilities')
    utility_item = models.CharField(max_length=100)
    current_reading = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.CharField(max_length=10)
    previous_reading = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.property.name} - {self.unit.unit_id_or_name} - {self.utility_item} - {self.month}"


class Maintenance(models.Model):
    property = models.ForeignKey(
        'Property', on_delete=models.CASCADE, related_name='maintenance')
    unit = models.ForeignKey('Unit', on_delete=models.CASCADE,
                             related_name='maintenance', null=True, blank=True)
    status = models.CharField(max_length=20)
    category = models.CharField(max_length=50)
    short_description = models.TextField(null=True, blank=True)
    image_upload = models.ImageField(
        upload_to='maintenance_images/', null=True, blank=True)
    expense_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.property.name} - {self.unit.unit_id_or_name} - {self.category}"
