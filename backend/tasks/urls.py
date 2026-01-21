from django.urls import path
from .views import (
    TaskListCreateView,
    TaskUpdateDeleteView,
    TaskDependencyView,
    DependencyGraphView,
)

urlpatterns = [
    path("tasks/", TaskListCreateView.as_view()),
    path("tasks/<int:task_id>/", TaskUpdateDeleteView.as_view()),
    path("tasks/<int:task_id>/dependencies/", TaskDependencyView.as_view()),
    path("tasks/graph/", DependencyGraphView.as_view()),
]
