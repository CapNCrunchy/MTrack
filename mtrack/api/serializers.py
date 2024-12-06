from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Medication, Record, Schedule, ScheduleDay, ScheduleTime
from datetime import datetime, date

UserModel = get_user_model()


class UserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["email", "password", "name"]

    def create(self, validated_data):
        user = UserModel.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user:
            return user
        raise serializers.ValidationError("User not found")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["email", "name"]


class ScheduleDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleDay
        fields = ['day']


class ScheduleTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleTime
        fields = ['time']


class ScheduleSerializer(serializers.ModelSerializer):
    days = serializers.ListField(
        child=serializers.IntegerField(), write_only=True)
    times = serializers.ListField(
        child=serializers.TimeField(), write_only=True)

    class Meta:
        model = Schedule
        fields = ['id', 'days', 'times', 'active', 'start_date', 'end_date']


class MedicationSerializer(serializers.ModelSerializer):
    days = serializers.ListField(
        child=serializers.IntegerField(), write_only=True)
    times = serializers.ListField(
        child=serializers.CharField(), write_only=True)

    class Meta:
        model = Medication
        fields = ['id', 'name', 'form', 'strength', 'days', 'times', 'notes']
        read_only_fields = ['user']

    def validate_form(self, value):
        """Validate that the form value matches allowed forms"""
        if value not in dict(Medication.FORMS):
            raise serializers.ValidationError(
                f"Invalid form. Must be one of: {', '.join(dict(Medication.FORMS).keys())}")
        return value

    def validate_times(self, value):
        """Validate time format"""
        try:
            return [datetime.strptime(time, '%H:%M').time() for time in value]
        except ValueError:
            raise serializers.ValidationError(
                "Times must be in 24-hour format (HH:MM)")

    def create(self, validated_data):
        # Extract days and times from the validated data
        days = validated_data.pop('days', [])
        times = validated_data.pop('times', [])

        # Add the current user to the medication data
        validated_data['user'] = self.context['request'].user

        # Create the medication
        medication = Medication.objects.create(**validated_data)

        # Create the schedule
        schedule = Schedule.objects.create(
            medication=medication,
            start_date=date.today(),
        )

        # Create schedule days
        for day in days:
            ScheduleDay.objects.create(schedule=schedule, day=day)

        # Create schedule times
        for time in times:
            ScheduleTime.objects.create(schedule=schedule, time=time)

        return medication

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Get the most recent schedule
        schedule = instance.schedules.first()
        if schedule:
            # Add days and times to the representation
            representation['days'] = [day.day for day in schedule.days.all()]
            representation['times'] = [time.time.strftime(
                '%H:%M') for time in schedule.times.all()]
            representation['schedule_id'] = schedule.id
            representation['active'] = schedule.active

        return representation

class RecordSerializer(serializers.ModelSerializer):

    def create(self, validated_data):

        validated_data['user'] = self.context['request'].user

        record = Record.objects.create(**validated_data)

        return record

        
    class Meta:
        model = Record
        fields = ['id', 'title', 'date']
        read_only_fields = ['user']

