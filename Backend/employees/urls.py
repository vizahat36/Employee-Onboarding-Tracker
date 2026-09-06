from django.urls import path

from .views import (
    EmployeeListCreateView,
    EmployeeRetrieveUpdateDestroyView,
)

urlpatterns = [
    path(
        '',
        EmployeeListCreateView.as_view(),
        name='employee-list-create'
    ),
    path(
        '<int:pk>/',
        EmployeeRetrieveUpdateDestroyView.as_view(),
        name='employee-detail'
    ),
]
