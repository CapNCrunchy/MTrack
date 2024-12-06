from django.db import models
from authtools.models import User


class Medication(models.Model):
    FORMS = [
        ('tablet', 'Tablet'),
        ('capsule', 'Capsule'),
        ('liquid', 'Liquid'),
        ('injection', 'Injection'),
        ('inhaler', 'Inhaler'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='medications')
    name = models.CharField(max_length=200)
    strength = models.CharField(max_length=50)  # e.g., "50mg", "100ml"
    form = models.CharField(max_length=20, choices=FORMS)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} {self.strength}"

    class Meta:
        ordering = ['name']


class Record(models.Model):

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='record')
    title = models.CharField(max_length=200)
    #type = models.CharField(max_length=200)
    date = models.DateField()

    def __str__(self):
        return f"{self.title} {self.date}"

    class Meta:
        ordering = ['date']

class Schedule(models.Model):
    medication = models.ForeignKey(
        Medication, on_delete=models.CASCADE, related_name='schedules')
    active = models.BooleanField(default=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Schedule for {self.medication.name}"

    class Meta:
        ordering = ['medication', 'start_date']


class ScheduleDay(models.Model):
    DAYS_OF_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]

    schedule = models.ForeignKey(
        Schedule, on_delete=models.CASCADE, related_name='days')
    day = models.IntegerField(choices=DAYS_OF_WEEK)

    class Meta:
        unique_together = ['schedule', 'day']


class ScheduleTime(models.Model):
    schedule = models.ForeignKey(
        Schedule, on_delete=models.CASCADE, related_name='times')
    time = models.TimeField()

    class Meta:
        ordering = ['time']
