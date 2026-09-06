from django.urls import path

from .views import (
    InterviewListCreateView,
    InterviewRetrieveUpdateDestroyView,
)

urlpatterns = [
    path(
        '',
        InterviewListCreateView.as_view(),
        name='interview-list-create'
    ),
    path(
        '<int:pk>/',
        InterviewRetrieveUpdateDestroyView.as_view(),
        name='interview-detail'
    ),
]