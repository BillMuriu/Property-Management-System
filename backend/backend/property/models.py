from django.db import models

# Create your models here.


class Property(models.Model):
    RENT_PENALTY_TYPE_CHOICES = (
        ('fixed', 'Fixed Amount'),
        ('percentage', 'Percentage'),
    )

    name = models.CharField(max_length=255)
    number_of_units = models.PositiveIntegerField()
    city = models.CharField(max_length=100)
    water_rate = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    electricity_rate = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    rent_penalty_type = models.CharField(
        max_length=10, choices=RENT_PENALTY_TYPE_CHOICES, blank=True, null=True)
    rent_penalty_amount = models.DecimalField(
        max_digits=8, decimal_places=2, blank=True, null=True)
    rent_penalty_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True)
    # mpesa paybill
    tax_rate = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True)
    management_fee = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    street_name = models.CharField(max_length=100, null=True, blank=True)
    company_name = models.CharField(max_length=100, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

# other recurring bills


class PropertyOtherRecurringBill(models.Model):
    property = models.ForeignKey(
        'Property', on_delete=models.CASCADE, related_name='propertyrecurringbill')
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
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.property.name} - {self.unit_id_or_name}"


class UnitOtherRecurringBill(models.Model):
    unit = models.ForeignKey(
        'Unit', on_delete=models.CASCADE,  related_name='unitrecurringbill')
    bill_type = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.bill_type} - {self.amount}"


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
