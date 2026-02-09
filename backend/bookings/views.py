from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'creator':
            return Booking.objects.filter(session__creator=user)
        return Booking.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        bookings = Booking.objects.filter(user=request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def creator_bookings(self, request):
        if request.user.role != 'creator':
            return Response({'error': 'Only creators can access this'}, status=403)
        bookings = Booking.objects.filter(session__creator=request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
