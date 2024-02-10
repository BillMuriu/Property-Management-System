from django.contrib.auth.models import User
from rest_framework import serializers
from .models import PropertyManager, Landlord
from property.models import Property


class PropertyManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyManager
        fields = '__all__'


# Serializer for creating a new User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Define the fields you want to include
        fields = ['username', 'password']

    # Override create method to set password properly
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LandlordSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Landlord
        exclude = ['property']  # Exclude the many-to-many field

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)

        # Retrieve the property IDs from the request data
        property_ids = self.context['request'].data.get('property', [])

        # Create the Landlord instance
        landlord = Landlord.objects.create(user=user, **validated_data)

        # Add properties to the landlord
        for property_id in property_ids:
            property_obj = Property.objects.get(pk=property_id)
            landlord.property.add(property_obj)

        return landlord
