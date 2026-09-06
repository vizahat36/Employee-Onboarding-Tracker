from django.contrib import admin

from .models import Interview


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'employee',
        'interviewer',
        'scheduled_at',
        'location',
    )
    list_filter = ('scheduled_at',)
    search_fields = ('interviewer', 'location')