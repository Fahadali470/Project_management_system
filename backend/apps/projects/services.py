from django.db import transaction
from django.db.models import Count, Q

from .models import Project, ProjectMembership
from apps.workspaces.models import WorkspaceMembership


@transaction.atomic
def sync_project_members(project: Project, memberships: list[WorkspaceMembership]) -> None:
    ProjectMembership.objects.filter(project=project).exclude(member__in=memberships).delete()

    for membership in memberships:
        ProjectMembership.objects.get_or_create(project=project, member=membership)


def recalculate_project_progress(project: Project) -> None:
    totals = project.tasks.aggregate(
        total=Count("id"),
        done=Count("id", filter=Q(status="done")),
    )
    total = totals["total"] or 0
    done = totals["done"] or 0
    progress = round((done / total) * 100) if total else 0

    Project.objects.filter(pk=project.pk).update(progress=progress)
