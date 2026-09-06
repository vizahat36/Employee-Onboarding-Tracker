from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdmin
from .models import Employee
from .serializers import (
    EmployeeSerializer,
    EmployeeCreateSerializer,
    EmployeeUpdateSerializer,
)


class EmployeeListCreateView(generics.ListCreateAPIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return Employee.objects.select_related('user').all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EmployeeCreateSerializer
        return EmployeeSerializer


class EmployeeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):

    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = Employee.objects.select_related('user').all()

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return EmployeeUpdateSerializer
        return EmployeeSerializer