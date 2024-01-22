from django.contrib.auth.models import AbstractUser
from django.db import models

# admin user model


class User(AbstractUser):

    ROLE_CHOICES = (
        ('viewer', 'Viewer'),
        ('editor', 'Editor'),
        ('admin', 'admin'),
        # Add other roles as needed
    )

    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    roles = models.CharField(
        max_length=50, choices=ROLE_CHOICES, blank=True, null=True)
    property = models.ManyToManyField(
        'Property', related_name='property_managers', blank=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

    def __str__(self):
        return self.username


# Landlord model
class Landlord(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=15)
    property = models.ManyToManyField(
        'Property', related_name='property_managers', blank=True)
    national_id = models.CharField(max_length=20, null=True, blank=True)
    krapin = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    next_of_kin = models.CharField(max_length=50, null=True, blank=True)
    next_of_kin_phone = models.CharField(max_length=15, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    disbursment_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
