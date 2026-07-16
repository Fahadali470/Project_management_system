from rest_framework.permissions import BasePermission

from apps.workspaces.models import WorkspaceMembership


class IsWorkspaceMember(BasePermission):
    def has_object_permission(self, request, view, obj) -> bool:
        workspace = getattr(obj, "workspace", None)
        if workspace is None and hasattr(obj, "project"):
            workspace = obj.project.workspace

        if workspace is None:
            return False

        return WorkspaceMembership.objects.filter(
            workspace=workspace,
            user=request.user,
            is_active=True,
        ).exists()


class IsWorkspaceAdminOrOwner(BasePermission):
    allowed_roles = {WorkspaceMembership.Role.OWNER, WorkspaceMembership.Role.ADMIN}

    def has_object_permission(self, request, view, obj) -> bool:
        workspace = getattr(obj, "workspace", obj)

        return WorkspaceMembership.objects.filter(
            workspace=workspace,
            user=request.user,
            role__in=self.allowed_roles,
            is_active=True,
        ).exists()
