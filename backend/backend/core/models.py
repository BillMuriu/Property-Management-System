from django.contrib.auth.models import User
from django.db import models
from property.models import Property, Unit

# admin user model


class PropertyManager(models.Model):

    ROLE_CHOICES = (
        ('viewer', 'Viewer'),
        ('editor', 'Editor'),
        ('admin', 'admin'),
        # Add other roles as needed
    )

    DEFAULT_ROLE = 'viewer'

    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    roles = models.CharField(
        max_length=50, choices=ROLE_CHOICES, default=DEFAULT_ROLE)
    property = models.ManyToManyField(
        Property, related_name='property_managers', blank=True)
    first_name = models.CharField(max_length=30, null=True, blank=True)
    last_name = models.CharField(max_length=30, null=True, blank=True)

    def __str__(self):
        return self.username


# Landlord model

class Landlord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=15)
    property = models.ManyToManyField(
        Property, related_name='landlords', blank=True)
    national_id = models.CharField(max_length=20, null=True, blank=True)
    krapin = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    next_of_kin = models.CharField(max_length=50, null=True, blank=True)
    next_of_kin_phone = models.CharField(max_length=15)
    notes = models.TextField(null=True, blank=True)
    disbursment_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
