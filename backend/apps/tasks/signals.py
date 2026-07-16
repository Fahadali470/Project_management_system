from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import ActivityEvent, Task, TaskAttachment, TaskComment
from apps.projects.services import recalculate_project_progress


@receiver(post_save, sender=Task)
def update_project_progress_on_task_save(sender, instance: Task, created: bool, **kwargs) -> None:
    recalculate_project_progress(instance.project)

    if created:
        ActivityEvent.objects.create(
            project=instance.project,
            task=instance,
            actor=instance.created_by,
            event_type=ActivityEvent.EventType.CREATED,
            message=f"Created task: {instance.title}",
        )


@receiver(post_delete, sender=Task)
def update_project_progress_on_task_delete(sender, instance: Task, **kwargs) -> None:
    recalculate_project_progress(instance.project)


@receiver(post_save, sender=TaskComment)
def create_comment_activity(sender, instance: TaskComment, created: bool, **kwargs) -> None:
    if created:
        ActivityEvent.objects.create(
            project=instance.task.project,
            task=instance.task,
            actor=instance.author,
            event_type=ActivityEvent.EventType.COMMENTED,
            message=f"Commented on task: {instance.task.title}",
        )


@receiver(post_save, sender=TaskAttachment)
def create_attachment_activity(sender, instance: TaskAttachment, created: bool, **kwargs) -> None:
    if created:
        ActivityEvent.objects.create(
            project=instance.task.project,
            task=instance.task,
            actor=instance.uploaded_by,
            event_type=ActivityEvent.EventType.ATTACHED,
            message=f"Attached file: {instance.name}",
        )
