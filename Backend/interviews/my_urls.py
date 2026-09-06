from django.urls import path

from .views import (
    MyInterviewListView,
    MyInterviewUpdateView,
)

urlpatterns = [
    path(
        '',
        MyInterviewListView.as_view(),
        name='my-interview-list'
    ),
    path(
        '<int:pk>/',
        MyInterviewUpdateView.as_view(),
        name='my-interview-detail'
    ),
]