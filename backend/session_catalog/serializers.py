from rest_framework import serializers
from .models import Session
from users.serializers import UserSerializer
from django.conf import settings


class SessionSerializer(serializers.ModelSerializer):
    creator_details = UserSerializer(source='creator', read_only=True)
    spots_available = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    image = serializers.ImageField(required=False, allow_null=True, allow_empty_file=True)
    image_url = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Session
        fields = '__all__'
        read_only_fields = ['id', 'creator', 'created_at', 'current_bookings']
    
    def get_image_url(self, obj):
        """Return the full URL for the image (uploaded or external)"""
        # Prefer uploaded image, fallback to external URL
        if obj.image:
            # Build the correct public URL for MinIO
            # Replace internal Docker URL with public localhost URL
            url = obj.image.url
            if 'minio:9000' in url:
                url = url.replace('http://minio:9000', 'http://localhost:9000')
            elif url.startswith('https://localhost:9000'):
                url = url.replace('https://', 'http://')
            return url
        if obj.image_url_external:
            return obj.image_url_external
        return None