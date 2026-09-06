from rest_framework import serializers

from .models import Interview


class InterviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Interview
        fields = [
            'id',
            'employee',
            'interviewer',
            'scheduled_at',
            'location',
            'confirmed',
        ]
        read_only_fields = ['id']


class MyInterviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Interview
        fields = [
            'id',
            'interviewer',
            'scheduled_at',
            'location',
            'confirmed',
        ]
        read_only_fields = [
            'id',
            'interviewer',
            'scheduled_at',
            'location',
        ]