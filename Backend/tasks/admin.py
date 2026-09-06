from django.contrib import admin

from .models import Task, TaskNote


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'employee',
        'due_date',
        'status',
    )
    list_filter = ('status',)
    search_fields = ('title', 'description')


@admin.register(TaskNote)
class TaskNoteAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'task',
        'content',
    )
    search_fields = ('content',)