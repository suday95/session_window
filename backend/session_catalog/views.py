from rest_framework import viewsets, permissions
from .models import Session
from .serializers import SessionSerializer

class IsCreatorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'creator'
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.creator == request.user

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.filter(status='active')
    serializer_class = SessionSerializer
    permission_classes = [IsCreatorOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
    
    def get_queryset(self):
        if self.action == 'list' and self.request.user.is_authenticated:
            if self.request.query_params.get('my_sessions'):
                return Session.objects.filter(creator=self.request.user)
        return super().get_queryset()