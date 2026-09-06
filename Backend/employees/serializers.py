from django.contrib.auth.models import User
from rest_framework import serializers

from accounts.models import UserProfile
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Employee
        fields = ['id', 'user_id', 'username', 'first_name', 'last_name', 'email']
        read_only_fields = ['id', 'user_id', 'username']


class EmployeeCreateSerializer(serializers.Serializer):

    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "A user with this username already exists."
            )
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        if Employee.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "An employee with this email already exists."
            )
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
        )

        UserProfile.objects.create(user=user, role='ATTENDEE')

        employee = Employee.objects.create(
            user=user,
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
        )

        return employee

    def to_representation(self, instance):
        return EmployeeSerializer(instance).data


class EmployeeUpdateSerializer(serializers.Serializer):

    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)
    email = serializers.EmailField(required=False)

    def validate_email(self, value):
        if self.instance is None:
            raise serializers.ValidationError("This serializer requires an instance.")
        if User.objects.filter(email=value).exclude(id=self.instance.user.id).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        if Employee.objects.filter(email=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError(
                "An employee with this email already exists."
            )
        return value

    def update(self, instance, validated_data):
        if 'first_name' in validated_data:
            instance.first_name = validated_data['first_name']
            instance.user.first_name = validated_data['first_name']
        if 'last_name' in validated_data:
            instance.last_name = validated_data['last_name']
            instance.user.last_name = validated_data['last_name']
        if 'email' in validated_data:
            instance.email = validated_data['email']
            instance.user.email = validated_data['email']

        instance.user.save()
        instance.save()
        return instance

    def to_representation(self, instance):
        return EmployeeSerializer(instance).data