from django.contrib.auth import get_user_model, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, UserLoginSerializer, UserSignUpSerializer, ScheduleSerializer, MedicationSerializer, RecordSerializer
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Medication, Record
from .serializers import MedicationSerializer, ScheduleSerializer


from .models import Medication, Schedule, ScheduleDay

# Create your views here.


class UserSignUp(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.create(serializer.validated_data)
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        # check for errors
        if serializer.errors:
            if 'email' in serializer.errors:
                return Response({'error': serializer.errors['email'][0]}, status=status.HTTP_400_BAD_REQUEST)
            if 'password' in serializer.errors:
                return Response({'error': serializer.errors['password'][0]}, status=status.HTTP_400_BAD_REQUEST)
            if 'name' in serializer.errors:
                return Response({'error': serializer.errors['name'][0]}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            return Response(status=status.HTTP_200_OK)
        # check for errors
        if serializer.errors:
            if 'non_field_errors' in serializer.errors:
                return Response({'error': serializer.errors['non_field_errors'][0]}, status=status.HTTP_400_BAD_REQUEST)
            if 'email' in serializer.errors:
                return Response({'error': serializer.errors['email'][0]}, status=status.HTTP_400_BAD_REQUEST)
            if 'password' in serializer.errors:
                return Response({'error': serializer.errors['password'][0]}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Unknown error'}, status=status.HTTP_400_BAD_REQUEST)


class UserLogout(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)


class MedicationViewSet(viewsets.ModelViewSet):
    serializer_class = MedicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def get_queryset(self):
        """
        Return medications belonging to the current user,
        ordered by name
        """
        return Medication.objects.filter(
            user=self.request.user
        ).order_by('name')

    def perform_create(self, serializer):
        """
        Create a new medication, automatically assigning the current user
        """
        serializer.save()

    @action(detail=True, methods=['patch'])
    def toggle_active(self, request, pk=None):
        """
        Toggle the active status of a medication's current schedule
        """
        medication = self.get_object()
        schedule = medication.schedules.first()

        if schedule:
            schedule.active = not schedule.active
            schedule.save()
            return Response({
                'status': 'success',
                'active': schedule.active
            })
        return Response(
            {'error': 'No schedule found'},
            status=status.HTTP_404_NOT_FOUND
        )

    @action(detail=True, methods=['patch'])
    def update_schedule(self, request, pk=None):
        """
        Update the days and times for a medication's schedule
        """
        medication = self.get_object()
        schedule = medication.schedules.first()

        if not schedule:
            return Response(
                {'error': 'No schedule found'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ScheduleSerializer(
            schedule, data=request.data, partial=True)
        if serializer.is_valid():
            # Clear existing days and times
            schedule.days.all().delete()
            schedule.times.all().delete()

            # Add new days and times
            for day in request.data.get('days', []):
                schedule.days.create(day=day)

            for time in request.data.get('times', []):
                schedule.times.create(time=time)

            return Response({'status': 'Schedule updated successfully'})

        return Response({'error': 'No schedule found'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def today(self, request):
        """
        Get all active medications scheduled for today
        """
        from datetime import datetime
        today_weekday = datetime.now().weekday()

        medications = self.get_queryset().filter(
            schedules__active=True,
            schedules__days__day=today_weekday
        ).distinct()

        serializer = self.get_serializer(medications, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete by deactivating the schedule instead of removing the medication
        """
        medication = self.get_object()
        schedule = medication.schedules.first()

        if schedule:
            schedule.active = False
            schedule.save()
            return Response(
                {'status': 'Medication deactivated'},
                status=status.HTTP_200_OK
            )
        return Response(
            {'error': 'No schedule found'},
            status=status.HTTP_404_NOT_FOUND
        )

class RecordViewSet(viewsets.ModelViewSet):
    serializer_class = RecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def get_queryset(self):
        """
        Return records belonging to the current user,
        ordered by name
        """
        return Record.objects.filter(
            user=self.request.user
        ).order_by('date')

    def perform_create(self, serializer):
        """
        Create a new medication, automatically assigning the current user
        """
        serializer.save()




@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"success": "CSRF cookie set"})