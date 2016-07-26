from django.contrib import admin
from django.db import models
from django.contrib.admin.options import FORMFIELD_FOR_DBFIELD_DEFAULTS
from jalali_date import widgets as j_widgets
from jalali_date import fields as j_fields

overrides = FORMFIELD_FOR_DBFIELD_DEFAULTS.copy()
overrides.update({
    models.DateField: {
        'form_class': j_fields.JalaliDateField,
        'widget': j_widgets.AdminJalaliDateWidget
    },
    models.DateTimeField: {
        'form_class': j_fields.SplitJalaliDateTimeField,
        'widget': j_widgets.AdminSplitJalaliDateTime
    },
})


class ModelAdmin(admin.ModelAdmin):
    def __init__(self, *args, **kwargs):
        super(ModelAdmin, self).__init__(*args, **kwargs)
        self.formfield_overrides = overrides


class StackedInline(admin.StackedInline):
    def __init__(self, *args, **kwargs):
        super(StackedInline, self).__init__(*args, **kwargs)
        self.formfield_overrides = overrides


class TabularInline(admin.TabularInline):
    def __init__(self, *args, **kwargs):
        super(TabularInline, self).__init__(*args, **kwargs)
        self.formfield_overrides = overrides
