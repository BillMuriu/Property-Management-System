from django.contrib.auth.models import User
from rest_framework import serializers
from .models import PropertyManager, Landlord
from property.models import Property


class PropertyManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyManager
        fields = '__all__'
        extra_kwargs = {
            # Do not allow changing the user field directly
            'user': {'read_only': True},
        }


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}


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
