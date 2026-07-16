from rest_framework import serializers

from apps.accounts.serializers import UserSerializer
from .models import Workspace, WorkspaceMembership


class WorkspaceMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = WorkspaceMembership
        fields = ["id", "workspace", "user", "user_id", "role", "is_active", "joined_at"]
        read_only_fields = ["id", "workspace", "user", "joined_at"]


class WorkspaceSerializer(serializers.ModelSerializer):
    memberships = WorkspaceMembershipSerializer(many=True, read_only=True)

    class Meta:
        model = Workspace
        fields = [
            "id",
            "name",
            "slug",
            "logo",
            "company_email",
            "company_website",
            "timezone",
            "created_by",
            "memberships",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "created_by", "created_at", "updated_at"]
