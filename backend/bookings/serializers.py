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
    
    def validate(self, attrs):
        session = attrs.get('session')
        
        # Check if session is at capacity
        if session and session.current_bookings >= session.capacity:
            raise serializers.ValidationError({
                'session': f'This session is full. Maximum capacity of {session.capacity} has been reached.'
            })
        
        return attrs
    
    def create(self, validated_data):
        # Auto-set amount from session price
        validated_data['amount'] = validated_data['session'].price
        return super().create(validated_data)