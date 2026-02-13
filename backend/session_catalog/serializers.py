from rest_framework import serializers
from .models import Session
from users.serializers import UserSerializer

class SessionSerializer(serializers.ModelSerializer):
    creator_details = UserSerializer(source='creator', read_only=True)
    spots_available = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    
    class Meta:
        model = Session
        fields = '__all__'
        read_only_fields = ['id', 'creator', 'created_at', 'current_bookings']