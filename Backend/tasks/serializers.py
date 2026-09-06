from rest_framework import serializers

from .models import Task, TaskNote


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = [
            'id',
            'employee',
            'title',
            'description',
            'due_date',
            'status',
        ]
        read_only_fields = ['id']


class TaskNoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = TaskNote
        fields = [
            'id',
            'task',
            'content',
        ]
        read_only_fields = ['id', 'task']


class MyTaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'due_date',
            'status',
        ]
        read_only_fields = [
            'id',
            'title',
            'description',
            'due_date',
        ]