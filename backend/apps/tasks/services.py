from decimal import Decimal

from django.db import transaction
from rest_framework.exceptions import ValidationError

from .models import ActivityEvent, Task
from apps.projects.services import recalculate_project_progress
from apps.workspaces.models import WorkspaceMembership


@transaction.atomic
def move_task(task: Task, status: str, position: Decimal | None = None, actor: WorkspaceMembership | None = None) -> Task:
    if status not in Task.Status.values:
        raise ValidationError({"status": "Invalid task status."})

    previous_status = task.status
    task.status = status

    if position is not None:
        task.position = position

    task.save(update_fields=["status", "position", "updated_at"])
    recalculate_project_progress(task.project)

    ActivityEvent.objects.create(
        project=task.project,
        task=task,
        actor=actor,
        event_type=ActivityEvent.EventType.MOVED,
        message=f"Moved task from {previous_status} to {status}",
        metadata={"from": previous_status, "to": status},
    )

    return task


def create_activity(task: Task, actor: WorkspaceMembership | None, event_type: str, message: str, metadata: dict | None = None) -> None:
    ActivityEvent.objects.create(
        project=task.project,
        task=task,
        actor=actor,
        event_type=event_type,
        message=message,
        metadata=metadata or {},
    )
