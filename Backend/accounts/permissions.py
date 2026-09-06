from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    message = "Only Admin users are allowed."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, "profile")
            and request.user.profile.role == "ADMIN"
        )


class IsAttendee(BasePermission):
    message = "Only Attendee users are allowed."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, "profile")
            and request.user.profile.role == "ATTENDEE"
        )