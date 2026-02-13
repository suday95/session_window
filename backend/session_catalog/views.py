from rest_framework import viewsets, permissions
from .models import Session
from .serializers import SessionSerializer
from rest_framework.throttling import UserRateThrottle



class SessionThrottle(UserRateThrottle):
    rate = "50/hour"

class IsCreatorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Fix: Check for both uppercase and lowercase role values
        return request.user.is_authenticated and request.user.role.upper() == 'CREATOR'
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.creator == request.user

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.filter(status='published')
    serializer_class = SessionSerializer
    permission_classes = [IsCreatorOrReadOnly]
    throttle_classes = [SessionThrottle]
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
    
    def get_queryset(self):
        user = self.request.user
        
        # For retrieve, update, delete - allow creator to access their own sessions
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            if user.is_authenticated and user.role.upper() == 'CREATOR':
                return Session.objects.filter(creator=user)
        
        # For list action
        if self.action == 'list':
            if user.is_authenticated:
                # Creator requesting their own sessions
                if self.request.query_params.get('my_sessions'):
                    return Session.objects.filter(creator=user)
            # Public listing - only published sessions
            return Session.objects.filter(status='published')
        
        # Default: only published sessions
        return Session.objects.filter(status='published')