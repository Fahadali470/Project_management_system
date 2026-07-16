from django.db import models
from django.utils.text import slugify

from apps.workspaces.models import Workspace, WorkspaceMembership


class Project(models.Model):
    class Status(models.TextChoices):
        PLANNING = "planning", "Planning"
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        ON_HOLD = "on_hold", "On Hold"
        ARCHIVED = "archived", "Archived"

    class Priority(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"
        URGENT = "urgent", "Urgent"

    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="projects")
    name = models.CharField(max_length=180)
    slug = models.SlugField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PLANNING)
    priority = models.CharField(max_length=16, choices=Priority.choices, default=Priority.MEDIUM)
    due_date = models.DateField(null=True, blank=True)
    color = models.CharField(max_length=32, default="indigo")
    progress = models.PositiveSmallIntegerField(default=0)
    members = models.ManyToManyField(
        WorkspaceMembership,
        through="ProjectMembership",
        related_name="projects",
        blank=True,
    )
    created_by = models.ForeignKey(WorkspaceMembership, on_delete=models.PROTECT, related_name="created_projects")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archived_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("workspace", "slug")
        ordering = ["-updated_at"]
        indexes = [
            models.Index(fields=["workspace", "status"]),
            models.Index(fields=["workspace", "priority"]),
            models.Index(fields=["workspace", "due_date"]),
            models.Index(fields=["workspace", "updated_at"]),
        ]

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class ProjectMembership(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="project_memberships")
    member = models.ForeignKey(WorkspaceMembership, on_delete=models.CASCADE, related_name="project_memberships")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("project", "member")
        indexes = [
            models.Index(fields=["project", "member"]),
        ]

    def __str__(self) -> str:
        return f"{self.member.user.email} on {self.project.name}"
