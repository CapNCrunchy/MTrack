# Generated by Django 5.1.3 on 2024-12-03 22:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medication',
            name='form',
            field=models.CharField(choices=[('tablet', 'Tablet'), ('capsule', 'Capsule'), ('liquid', 'Liquid'), ('injection', 'Injection'), ('inhaler', 'Inhaler'), ('other', 'Other')], max_length=20),
        ),
    ]
