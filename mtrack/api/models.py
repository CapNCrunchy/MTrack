# implementation from https://www.geeksforgeeks.org/build-an-authentication-system-using-django-react-and-tailwind/

from django.db import models

class Medication(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    form = models.CharField(max_length=255)
    strength = models.CharField(max_length=255)

class UserMedication(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    medication_id = models.IntegerField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    dosage = models.CharField(max_length=255)
    notes = models.TextField()
    
