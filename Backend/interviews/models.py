from django.db import models

from employees.models import Employee


class Interview(models.Model):

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='interviews'
    )

    interviewer = models.CharField(max_length=200)

    scheduled_at = models.DateTimeField()

    location = models.CharField(max_length=200)

    confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f"Interview {self.interviewer} - {self.scheduled_at}"