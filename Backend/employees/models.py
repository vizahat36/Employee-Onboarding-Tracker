from django.db import models
from django.contrib.auth.models import User


class Employee(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='employee'
    )

    first_name = models.CharField(max_length=150)

    last_name = models.CharField(max_length=150)

    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
