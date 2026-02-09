from rest_framework import serializers
from .models import Booking
from session_catalog.serializers import SessionSerializer  # ← CHANGED
from users.serializers import UserSerializer

class BookingSerializer(serializers.ModelSerializer):
    session_details = SessionSerializer(source='session', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'amount']
    
    def create(self, validated_data):
        validated_data['amount'] = validated_data['session'].price
        return super().create(validated_data)