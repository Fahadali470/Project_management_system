from django.contrib import admin

from .models import Project, ProjectMembership


class ProjectMembershipInline(admin.TabularInline):
    model = ProjectMembership
    extra = 0
    autocomplete_fields = ("member",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "workspace", "status", "priority", "progress", "due_date", "updated_at")
    list_filter = ("status", "priority", "workspace")
    search_fields = ("name", "description", "workspace__name")
    prepopulated_fields = {"slug": ("name",)}
    autocomplete_fields = ("workspace", "created_by")
    inlines = [ProjectMembershipInline]


@admin.register(ProjectMembership)
class ProjectMembershipAdmin(admin.ModelAdmin):
    list_display = ("project", "member", "created_at")
    search_fields = ("project__name", "member__user__email")
    autocomplete_fields = ("project", "member")
