from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin, IsAttendee

from .serializers import LoginSerializer


class LoginView(APIView):

    def post(self, request):

        serializer = LoginSerializer(
            data=request.data
        )

        if serializer.is_valid():

            user = serializer.validated_data["user"]

            token, created = Token.objects.get_or_create(
                user=user
            )

            return Response({
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "role": user.profile.role
                }
            })

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )



class AdminTestView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        return Response({
            "message": "Admin access successful."
        })


class AttendeeTestView(APIView):
    permission_classes = [IsAuthenticated, IsAttendee]

    def get(self, request):
        return Response({
            "message": "Attendee access successful."
        })