from django.contrib import admin

from .models import Workspace, WorkspaceMembership


class WorkspaceMembershipInline(admin.TabularInline):
    model = WorkspaceMembership
    extra = 0
    autocomplete_fields = ("user", "invited_by")


@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "company_email", "created_by", "created_at")
    search_fields = ("name", "slug", "company_email")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [WorkspaceMembershipInline]


@admin.register(WorkspaceMembership)
class WorkspaceMembershipAdmin(admin.ModelAdmin):
    list_display = ("workspace", "user", "role", "is_active", "joined_at")
    list_filter = ("role", "is_active")
    search_fields = ("workspace__name", "user__email")
    autocomplete_fields = ("workspace", "user", "invited_by")
