from rest_framework import serializers
from .models import Booking
from session_catalog.serializers import SessionSerializer  # ← CHANGED
from session_catalog.models import Session
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
        
        # Check if session is at capacity - refresh from DB to get actual value
        if session:
            # Get fresh data from database to avoid F() expression issues
            fresh_session = Session.objects.get(pk=session.pk)
            if fresh_session.current_bookings >= fresh_session.capacity:
                raise serializers.ValidationError({
                    'session': f'This session is full. Maximum capacity of {fresh_session.capacity} has been reached.'
                })
        
        return attrs
    
    def create(self, validated_data):
        # Auto-set amount from session price
        validated_data['amount'] = validated_data['session'].price
        return super().create(validated_data)