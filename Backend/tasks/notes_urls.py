from django.urls import path

from .views import (
    TaskNoteListCreateView,
    TaskNoteRetrieveUpdateDestroyView,
)

urlpatterns = [
    path(
        '',
        TaskNoteListCreateView.as_view(),
        name='task-note-list-create'
    ),
    path(
        '<int:pk>/',
        TaskNoteRetrieveUpdateDestroyView.as_view(),
        name='task-note-detail'
    ),
]