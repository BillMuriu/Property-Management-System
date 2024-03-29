# Generated by Django 5.0.1 on 2024-02-08 09:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0003_alter_unitotherrecurringbill_bill_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='unitotherrecurringbill',
            name='bill_type',
            field=models.CharField(choices=[('water', 'Water'), ('electricity', 'Electricity'), ('garbage', 'Garbage'), ('security', 'Security'), ('internet', 'Internet'), ('cleaning', 'Cleaning'), ('service', 'Service'), ('parking fee', 'Parking Fee'), ('VAT', 'VAT')], default=None, max_length=100),
        ),
        migrations.AlterField(
            model_name='utilities',
            name='month',
            field=models.CharField(choices=[('January', 'January'), ('February', 'February'), ('March', 'March'), ('April', 'April'), ('May', 'May'), ('June', 'June'), ('July', 'July'), ('August', 'August'), ('September', 'September'), ('October', 'October'), ('November', 'November'), ('December', 'December')], max_length=20),
        ),
        migrations.AlterField(
            model_name='utilities',
            name='utility_item',
            field=models.CharField(choices=[('Water', 'Water'), ('Electricity', 'Electricity')], max_length=100),
        ),
    ]
