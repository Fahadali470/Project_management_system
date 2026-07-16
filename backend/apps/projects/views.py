from rest_framework import permissions, viewsets

from .filters import ProjectFilter
from .models import Project, ProjectMembership
from .serializers import ProjectSerializer
from apps.core.permissions import IsWorkspaceMember
from apps.workspaces.services import get_active_membership


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsWorkspaceMember]
    filterset_class = ProjectFilter
    search_fields = ["name", "description"]
    ordering_fields = ["name", "due_date", "priority", "status", "updated_at", "progress"]
    ordering = ["-updated_at"]

    def get_queryset(self):
        return (
            Project.objects.filter(
                workspace__memberships__user=self.request.user,
                workspace__memberships__is_active=True,
            )
            .select_related("workspace", "created_by__user")
            .prefetch_related("members__user", "tasks")
            .distinct()
        )

    def perform_create(self, serializer):
        workspace = serializer.validated_data["workspace"]
        membership = get_active_membership(self.request.user, workspace)
        project = serializer.save(created_by=membership)
        ProjectMembership.objects.get_or_create(project=project, member=membership)
