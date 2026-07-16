from django.contrib import admin

from .models import ActivityEvent, ChecklistItem, Task, TaskAttachment, TaskComment


class ChecklistItemInline(admin.TabularInline):
    model = ChecklistItem
    extra = 0


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "project", "status", "priority", "assignee", "due_date", "updated_at")
    list_filter = ("status", "priority", "project")
    search_fields = ("title", "description", "project__name", "assignee__user__email")
    autocomplete_fields = ("project", "assignee", "created_by")
    inlines = [ChecklistItemInline]


@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ("task", "author", "created_at")
    search_fields = ("task__title", "author__user__email", "message")
    autocomplete_fields = ("task", "author")


@admin.register(TaskAttachment)
class TaskAttachmentAdmin(admin.ModelAdmin):
    list_display = ("name", "task", "uploaded_by", "created_at")
    search_fields = ("name", "task__title", "uploaded_by__user__email")
    autocomplete_fields = ("task", "uploaded_by")


@admin.register(ChecklistItem)
class ChecklistItemAdmin(admin.ModelAdmin):
    list_display = ("title", "task", "is_completed", "position")
    list_filter = ("is_completed",)
    search_fields = ("title", "task__title")
    autocomplete_fields = ("task",)


@admin.register(ActivityEvent)
class ActivityEventAdmin(admin.ModelAdmin):
    list_display = ("event_type", "project", "task", "actor", "created_at")
    list_filter = ("event_type",)
    search_fields = ("message", "project__name", "task__title", "actor__user__email")
    autocomplete_fields = ("project", "task", "actor")
