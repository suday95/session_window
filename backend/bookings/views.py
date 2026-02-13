from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.db.models import F
from .models import Booking
from .serializers import BookingSerializer
from rest_framework.throttling import UserRateThrottle


class BookingThrottle(UserRateThrottle):
    rate = "100/min"

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [BookingThrottle]
    
    def get_queryset(self):
        user = self.request.user
        role = user.role.upper() if user.role else ''
        # For update/delete actions, user should access their own bookings
        if self.action in ['update', 'partial_update', 'destroy', 'retrieve']:
            return Booking.objects.filter(user=user)
        
        # For list action
        if role == 'USER':
            return Booking.objects.filter(user=user)
        elif role == 'CREATOR':
            return Booking.objects.filter(session__creator=user)
        
        # Fallback - return user's own bookings
        return Booking.objects.filter(user=user)
    
    @transaction.atomic
    def perform_create(self, serializer):
        booking = serializer.save(user=self.request.user)
        # Increment current_bookings count atomically
        session = booking.session
        session.current_bookings = F('current_bookings') + 1
        session.save(update_fields=['current_bookings'])
        # Refresh from database to get the actual integer value (not F() expression)
        session.refresh_from_db()
        booking.refresh_from_db()
    
    @transaction.atomic
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # If cancelling, delete the booking and decrement count
        if request.data.get('status') == 'cancelled':
            session = instance.session
            instance.delete()
            # Decrement current_bookings count atomically
            session.current_bookings = F('current_bookings') - 1
            session.save(update_fields=['current_bookings'])
            return Response({'message': 'Booking cancelled and removed successfully'}, status=status.HTTP_200_OK)
        
        return super().partial_update(request, *args, **kwargs)
    
    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        session = instance.session
        instance.delete()
        # Decrement current_bookings count atomically
        session.current_bookings = F('current_bookings') - 1
        session.save(update_fields=['current_bookings'])
        return Response({'message': 'Booking deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
    
    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        """Get all bookings for the current user"""
        bookings = Booking.objects.filter(user=request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def creator_bookings(self, request):
        """Get all bookings for sessions created by the current user (creator)"""
        role = request.user.role.upper() if request.user.role else ''
        if role != 'CREATOR':
            return Response([])
        bookings = Booking.objects.filter(session__creator=request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)