from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.projects.views import ProjectViewSet
from apps.tasks.views import (
    ActivityEventViewSet,
    ChecklistItemViewSet,
    TaskAttachmentViewSet,
    TaskCommentViewSet,
    TaskViewSet,
)
from apps.workspaces.views import WorkspaceMembershipViewSet, WorkspaceViewSet

router = DefaultRouter()
router.register("workspaces", WorkspaceViewSet, basename="workspace")
router.register("workspace-memberships", WorkspaceMembershipViewSet, basename="workspace-membership")
router.register("projects", ProjectViewSet, basename="project")
router.register("tasks", TaskViewSet, basename="task")
router.register("task-comments", TaskCommentViewSet, basename="task-comment")
router.register("task-attachments", TaskAttachmentViewSet, basename="task-attachment")
router.register("checklist-items", ChecklistItemViewSet, basename="checklist-item")
router.register("activity-events", ActivityEventViewSet, basename="activity-event")

urlpatterns = [
    path("auth/", include("apps.accounts.urls")),
    path("", include(router.urls)),
]
