from django.urls import path
from .views import (
    LoginView,
    AdminTestView,
    AttendeeTestView,
)


urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),

    path(
        "admin-test/",
        AdminTestView.as_view(),
        name="admin-test"
    ),

    path(
        "attendee-test/",
        AttendeeTestView.as_view(),
        name="attendee-test"
    ),
]