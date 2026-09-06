from django.urls import path

from .views import (
    MyTaskListView,
    MyTaskUpdateView,
)

urlpatterns = [
    path(
        '',
        MyTaskListView.as_view(),
        name='my-task-list'
    ),
    path(
        '<int:pk>/',
        MyTaskUpdateView.as_view(),
        name='my-task-detail'
    ),
]