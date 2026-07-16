from rest_framework import decorators, permissions, response, viewsets

from .models import Workspace, WorkspaceMembership
from .serializers import WorkspaceMembershipSerializer, WorkspaceSerializer
from .services import get_workspace_queryset_for_user
from apps.core.permissions import IsWorkspaceAdminOrOwner, IsWorkspaceMember


class WorkspaceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated, IsWorkspaceMember]
    search_fields = ["name", "slug", "company_email"]
    ordering_fields = ["name", "created_at", "updated_at"]
    ordering = ["name"]

    def get_queryset(self):
        return (
            get_workspace_queryset_for_user(self.request.user)
            .select_related("created_by")
            .prefetch_related("memberships__user")
        )

    def get_permissions(self):
        if self.action in {"update", "partial_update", "destroy"}:
            return [permissions.IsAuthenticated(), IsWorkspaceAdminOrOwner()]
        return super().get_permissions()

    def perform_create(self, serializer):
        workspace = serializer.save(created_by=self.request.user)
        WorkspaceMembership.objects.get_or_create(
            workspace=workspace,
            user=self.request.user,
            defaults={
                "role": WorkspaceMembership.Role.OWNER,
                "invited_by": self.request.user,
            },
        )

    @decorators.action(detail=False, methods=["get"])
    def current(self, request):
        workspace = self.get_queryset().first()

        if not workspace:
            return response.Response(None, status=404)

        return response.Response(self.get_serializer(workspace).data)


class WorkspaceMembershipViewSet(viewsets.ModelViewSet):
    serializer_class = WorkspaceMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["workspace", "role", "is_active"]
    search_fields = ["user__email", "user__first_name", "user__last_name"]
    ordering_fields = ["joined_at", "user__email"]
    ordering = ["user__email"]

    def get_queryset(self):
        return (
            WorkspaceMembership.objects.filter(
                workspace__memberships__user=self.request.user,
                workspace__memberships__is_active=True,
            )
            .select_related("workspace", "user", "invited_by")
            .distinct()
        )
