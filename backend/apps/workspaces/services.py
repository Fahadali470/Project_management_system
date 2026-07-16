from django.db import transaction
from django.utils.text import slugify
from rest_framework.exceptions import PermissionDenied

from .models import Workspace, WorkspaceMembership


def unique_workspace_slug(base_name: str) -> str:
    base_slug = slugify(base_name) or "workspace"
    candidate = base_slug
    counter = 2

    while Workspace.objects.filter(slug=candidate).exists():
        candidate = f"{base_slug}-{counter}"
        counter += 1

    return candidate


@transaction.atomic
def create_personal_workspace(user) -> Workspace:
    name = f"{user.get_full_name() or user.email}'s Workspace"

    workspace, created = Workspace.objects.get_or_create(
        created_by=user,
        slug=unique_workspace_slug(name),
        defaults={
            "name": name,
            "company_email": user.email,
        },
    )

    if created:
        WorkspaceMembership.objects.create(
            workspace=workspace,
            user=user,
            role=WorkspaceMembership.Role.OWNER,
            invited_by=user,
        )

    return workspace


def get_active_membership(user, workspace: Workspace) -> WorkspaceMembership:
    membership = (
        WorkspaceMembership.objects.select_related("workspace", "user")
        .filter(user=user, workspace=workspace, is_active=True)
        .first()
    )

    if not membership:
        raise PermissionDenied("You are not a member of this workspace.")

    return membership


def get_workspace_queryset_for_user(user):
    return Workspace.objects.filter(memberships__user=user, memberships__is_active=True).distinct()
