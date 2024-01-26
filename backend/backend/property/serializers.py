from rest_framework import serializers
from .models import (Property,
                     Unit,
                     PropertyOtherRecurringBill,
                     Utilities,
                     UnitOtherRecurringBill,
                     Maintenance
                     )


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'


class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maintenance
        fields = '__all__'


class PropertyOtherRecurringBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyOtherRecurringBill
        fields = '__all__'


class UnitOtherRecurringBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitOtherRecurringBill
        fields = '__all__'
