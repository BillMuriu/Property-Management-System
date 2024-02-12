# Generated by Django 5.0.1 on 2024-02-12 09:42

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_alter_propertymanager_roles'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='propertymanager',
            name='roles',
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('viewer', 'Viewer'), ('editor', 'Editor'), ('admin', 'Admin')], default='viewer', max_length=50)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='landlord',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.user'),
        ),
        migrations.AlterField(
            model_name='propertymanager',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.user'),
        ),
    ]