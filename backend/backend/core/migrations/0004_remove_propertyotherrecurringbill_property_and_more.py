# Generated by Django 5.0.1 on 2024-01-26 08:46

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_remove_property_rent_payment_penalty_and_more'),
        ('financials', '0004_alter_expense_property_alter_expense_unit_and_more'),
        ('property', '0001_initial'),
        ('tenant', '0002_alter_tenant_property_alter_tenant_unit'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='propertyotherrecurringbill',
            name='property',
        ),
        migrations.RemoveField(
            model_name='utilities',
            name='property',
        ),
        migrations.RemoveField(
            model_name='unit',
            name='property',
        ),
        migrations.RemoveField(
            model_name='utilities',
            name='unit',
        ),
        migrations.RemoveField(
            model_name='unitotherrecurringbill',
            name='unit',
        ),
        migrations.RemoveField(
            model_name='propertymanager',
            name='username',
        ),
        migrations.AddField(
            model_name='landlord',
            name='user',
            field=models.OneToOneField(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='propertymanager',
            name='user',
            field=models.OneToOneField(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='landlord',
            name='property',
            field=models.ManyToManyField(blank=True, related_name='landlords', to='property.property'),
        ),
        migrations.AlterField(
            model_name='propertymanager',
            name='property',
            field=models.ManyToManyField(blank=True, related_name='property_managers', to='property.property'),
        ),
        migrations.DeleteModel(
            name='Maintenance',
        ),
        migrations.DeleteModel(
            name='PropertyOtherRecurringBill',
        ),
        migrations.DeleteModel(
            name='Property',
        ),
        migrations.DeleteModel(
            name='Utilities',
        ),
        migrations.DeleteModel(
            name='Unit',
        ),
        migrations.DeleteModel(
            name='UnitOtherRecurringBill',
        ),
    ]
