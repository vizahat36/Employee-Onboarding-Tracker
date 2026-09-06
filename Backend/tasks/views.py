from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdmin, IsAttendee
from .models import Task, TaskNote
from .serializers import TaskSerializer, TaskNoteSerializer, MyTaskSerializer


class TaskListCreateView(generics.ListCreateAPIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    queryset = Task.objects.select_related('employee__user').all()

    serializer_class = TaskSerializer


class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    queryset = Task.objects.select_related('employee__user').all()

    serializer_class = TaskSerializer


def _current_employee_tasks(user):
    employee = getattr(user, 'employee', None)
    if employee is None:
        return Task.objects.none()
    return Task.objects.filter(employee=employee)


class MyTaskListView(generics.ListAPIView):

    permission_classes = [IsAuthenticated, IsAttendee]

    serializer_class = MyTaskSerializer

    def get_queryset(self):
        return _current_employee_tasks(self.request.user)


class MyTaskUpdateView(generics.UpdateAPIView):

    permission_classes = [IsAuthenticated, IsAttendee]

    serializer_class = MyTaskSerializer

    def get_queryset(self):
        return _current_employee_tasks(self.request.user)


def _task_from_kwargs(kwargs):
    return get_object_or_404(Task, pk=kwargs['task_id'])


class TaskNoteListCreateView(generics.ListCreateAPIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    serializer_class = TaskNoteSerializer

    def get_queryset(self):
        _task_from_kwargs(self.kwargs)
        return TaskNote.objects.filter(task_id=self.kwargs['task_id'])

    def perform_create(self, serializer):
        task = _task_from_kwargs(self.kwargs)
        serializer.save(task=task)


class TaskNoteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    serializer_class = TaskNoteSerializer

    def get_queryset(self):
        _task_from_kwargs(self.kwargs)
        return TaskNote.objects.filter(task_id=self.kwargs['task_id'])