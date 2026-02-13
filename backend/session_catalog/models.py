from django.db import models
from users.models import User
import uuid


def session_image_path(instance, filename):
    """Generate upload path: sessions/<session_id>/<filename>"""
    ext = filename.split('.')[-1]
    return f"sessions/{instance.id or 'temp'}/{filename}"


class Session(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_sessions')
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_minutes = models.IntegerField(help_text="Duration in minutes")
    capacity = models.IntegerField(default=1, help_text="Maximum number of participants")
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    image = models.ImageField(upload_to=session_image_path, blank=True, null=True)
    image_url_external = models.URLField(blank=True, null=True, help_text="External image URL (alternative to upload)")
    current_bookings = models.IntegerField(default=0, help_text="Current number of bookings")
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def spots_available(self):
        return self.capacity - self.current_bookings
    
    @property
    def is_full(self):
        return self.current_bookings >= self.capacity
    
    class Meta:
        app_label = 'session_catalog'
    
    def __str__(self):
        return self.title