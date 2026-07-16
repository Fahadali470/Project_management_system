from decimal import Decimal

from rest_framework import decorators, permissions, response, status, viewsets

from .filters import TaskFilter
from .models import ActivityEvent, ChecklistItem, Task, TaskAttachment, TaskComment
from .serializers import (
    ActivityEventSerializer,
    ChecklistItemSerializer,
    TaskAttachmentSerializer,
    TaskCommentSerializer,
    TaskSerializer,
)
from .services import move_task
from apps.core.permissions import IsWorkspaceMember
from apps.workspaces.services import get_active_membership


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsWorkspaceMember]
    filterset_class = TaskFilter
    search_fields = ["title", "description", "assignee__user__email"]
    ordering_fields = ["due_date", "priority", "status", "position", "updated_at"]
    ordering = ["status", "position", "-updated_at"]

    def get_queryset(self):
        return (
            Task.objects.filter(
                project__workspace__memberships__user=self.request.user,
                project__workspace__memberships__is_active=True,
            )
            .select_related("project", "project__workspace", "assignee__user", "created_by__user")
            .prefetch_related("comments__author__user", "attachments__uploaded_by__user", "checklist_items")
            .distinct()
        )

    def perform_create(self, serializer):
        project = serializer.validated_data["project"]
        membership = get_active_membership(self.request.user, project.workspace)
        serializer.save(created_by=membership)

    @decorators.action(detail=True, methods=["post"])
    def move(self, request, pk=None):
        task = self.get_object()
        membership = get_active_membership(request.user, task.project.workspace)
        status_value = request.data.get("status")
        position_value = request.data.get("position")
        position = Decimal(str(position_value)) if position_value is not None else None
        moved_task = move_task(task, status=status_value, position=position, actor=membership)
        return response.Response(self.get_serializer(moved_task).data, status=status.HTTP_200_OK)


class TaskCommentViewSet(viewsets.ModelViewSet):
    serializer_class = TaskCommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsWorkspaceMember]
    filterset_fields = ["task"]
    search_fields = ["message", "author__user__email"]
    ordering_fields = ["created_at"]
    ordering = ["created_at"]

    def get_queryset(self):
        return (
            TaskComment.objects.filter(task__project__workspace__memberships__user=self.request.user)
            .select_related("task", "task__project", "author__user")
            .distinct()
        )

    def perform_create(self, serializer):
        task = serializer.validated_data["task"]
        membership = get_active_membership(self.request.user, task.project.workspace)
        serializer.save(author=membership)


class TaskAttachmentViewSet(viewsets.ModelViewSet):
    serializer_class = TaskAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsWorkspaceMember]
    filterset_fields = ["task"]
    search_fields = ["name", "file_url"]
    ordering_fields = ["created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return (
            TaskAttachment.objects.filter(task__project__workspace__memberships__user=self.request.user)
            .select_related("task", "task__project", "uploaded_by__user")
            .distinct()
        )

    def perform_create(self, serializer):
        task = serializer.validated_data["task"]
        membership = get_active_membership(self.request.user, task.project.workspace)
        serializer.save(uploaded_by=membership)


class ChecklistItemViewSet(viewsets.ModelViewSet):
    serializer_class = ChecklistItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsWorkspaceMember]
    filterset_fields = ["task", "is_completed"]
    search_fields = ["title"]
    ordering_fields = ["position", "created_at"]
    ordering = ["position", "created_at"]

    def get_queryset(self):
        return ChecklistItem.objects.filter(task__project__workspace__memberships__user=self.request.user).distinct()


class ActivityEventViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActivityEventSerializer
    permission_classes = [permissions.IsAuthenticated, IsWorkspaceMember]
    filterset_fields = ["project", "task", "event_type"]
    search_fields = ["message"]
    ordering_fields = ["created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return (
            ActivityEvent.objects.filter(project__workspace__memberships__user=self.request.user)
            .select_related("project", "task", "actor__user")
            .distinct()
        )
