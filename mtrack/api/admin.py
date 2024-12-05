from django.contrib import admin
from .models import Medication, Schedule, ScheduleDay

# Register your models here.
admin.site.register(Medication)
admin.site.register(Schedule)
admin.site.register(ScheduleDay)
