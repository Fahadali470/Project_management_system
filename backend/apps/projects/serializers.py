from rest_framework import serializers

from apps.workspaces.models import WorkspaceMembership
from apps.workspaces.serializers import WorkspaceMembershipSerializer
from .models import Project, ProjectMembership
from .services import sync_project_members


class ProjectMembershipSerializer(serializers.ModelSerializer):
    member = WorkspaceMembershipSerializer(read_only=True)

    class Meta:
        model = ProjectMembership
        fields = ["id", "member", "created_at"]
        read_only_fields = ["id", "member", "created_at"]


class ProjectSerializer(serializers.ModelSerializer):
    members = WorkspaceMembershipSerializer(read_only=True, many=True)
    member_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "workspace",
            "name",
            "slug",
            "description",
            "status",
            "priority",
            "due_date",
            "color",
            "progress",
            "members",
            "member_ids",
            "created_by",
            "created_at",
            "updated_at",
            "archived_at",
        ]
        read_only_fields = ["id", "slug", "progress", "created_by", "created_at", "updated_at", "archived_at"]

    def validate_member_ids(self, value):
        workspace = self.initial_data.get("workspace") or getattr(self.instance, "workspace_id", None)
        memberships = WorkspaceMembership.objects.filter(id__in=value, workspace_id=workspace, is_active=True)

        if memberships.count() != len(set(value)):
            raise serializers.ValidationError("One or more members do not belong to this workspace.")

        return value

    def create(self, validated_data):
        member_ids = validated_data.pop("member_ids", [])
        project = super().create(validated_data)

        if member_ids:
            memberships = list(WorkspaceMembership.objects.filter(id__in=member_ids, workspace=project.workspace))
            sync_project_members(project, memberships)

        return project

    def update(self, instance, validated_data):
        member_ids = validated_data.pop("member_ids", None)
        project = super().update(instance, validated_data)

        if member_ids is not None:
            memberships = list(WorkspaceMembership.objects.filter(id__in=member_ids, workspace=project.workspace))
            sync_project_members(project, memberships)

        return project
