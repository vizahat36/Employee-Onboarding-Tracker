from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdmin, IsAttendee
from .models import Interview
from .serializers import InterviewSerializer, MyInterviewSerializer


class InterviewListCreateView(generics.ListCreateAPIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    queryset = Interview.objects.select_related('employee__user').all()

    serializer_class = InterviewSerializer


class InterviewRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    queryset = Interview.objects.select_related('employee__user').all()

    serializer_class = InterviewSerializer


def _current_employee_interviews(user):
    employee = getattr(user, 'employee', None)
    if employee is None:
        return Interview.objects.none()
    return Interview.objects.filter(employee=employee)


class MyInterviewListView(generics.ListAPIView):

    permission_classes = [IsAuthenticated, IsAttendee]

    serializer_class = MyInterviewSerializer

    def get_queryset(self):
        return _current_employee_interviews(self.request.user)


class MyInterviewUpdateView(generics.UpdateAPIView):

    permission_classes = [IsAuthenticated, IsAttendee]

    serializer_class = MyInterviewSerializer

    def get_queryset(self):
        return _current_employee_interviews(self.request.user)