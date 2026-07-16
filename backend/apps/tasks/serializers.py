from rest_framework import serializers

from apps.workspaces.models import WorkspaceMembership
from apps.workspaces.serializers import WorkspaceMembershipSerializer
from .models import ActivityEvent, ChecklistItem, Task, TaskAttachment, TaskComment


class ChecklistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistItem
        fields = ["id", "task", "title", "is_completed", "position", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class TaskCommentSerializer(serializers.ModelSerializer):
    author = WorkspaceMembershipSerializer(read_only=True)

    class Meta:
        model = TaskComment
        fields = ["id", "task", "author", "message", "created_at"]
        read_only_fields = ["id", "author", "created_at"]


class TaskAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = WorkspaceMembershipSerializer(read_only=True)

    class Meta:
        model = TaskAttachment
        fields = ["id", "task", "uploaded_by", "name", "file_url", "created_at"]
        read_only_fields = ["id", "uploaded_by", "created_at"]


class ActivityEventSerializer(serializers.ModelSerializer):
    actor = WorkspaceMembershipSerializer(read_only=True)

    class Meta:
        model = ActivityEvent
        fields = ["id", "project", "task", "actor", "event_type", "message", "metadata", "created_at"]
        read_only_fields = ["id", "actor", "created_at"]


class TaskSerializer(serializers.ModelSerializer):
    assignee = WorkspaceMembershipSerializer(read_only=True)
    assignee_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    comments = TaskCommentSerializer(many=True, read_only=True)
    attachments = TaskAttachmentSerializer(many=True, read_only=True)
    checklist_items = ChecklistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "project",
            "title",
            "description",
            "status",
            "priority",
            "due_date",
            "assignee",
            "assignee_id",
            "position",
            "created_by",
            "comments",
            "attachments",
            "checklist_items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]

    def validate_assignee_id(self, value):
        if value is None:
            return value

        project = self.initial_data.get("project") or getattr(self.instance, "project_id", None)

        if not WorkspaceMembership.objects.filter(id=value, projects__id=project, is_active=True).exists():
            raise serializers.ValidationError("Assignee must be an active project member.")

        return value

    def create(self, validated_data):
        assignee_id = validated_data.pop("assignee_id", None)

        if assignee_id:
            validated_data["assignee_id"] = assignee_id

        return super().create(validated_data)

    def update(self, instance, validated_data):
        assignee_id = validated_data.pop("assignee_id", serializers.empty)

        if assignee_id is not serializers.empty:
            validated_data["assignee_id"] = assignee_id

        return super().update(instance, validated_data)
