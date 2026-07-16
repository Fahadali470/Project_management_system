from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.workspaces.services import create_personal_workspace


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_workspace_for_new_user(sender, instance, created: bool, **kwargs) -> None:
    if created:
        create_personal_workspace(instance)
