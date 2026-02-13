from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    ROLE_CHOICES = [
        ('USER', 'User'),
        ('CREATOR', 'Creator'),
    ]
    
    # Override id to use UUID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Core fields
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    avatar = models.URLField(blank=True, null=True, help_text="S3/MinIO ready URL")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='USER')
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.email
