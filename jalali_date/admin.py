from __future__ import print_function

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


def removed_in_next_version(msg=''):
    if msg:
        print '>>>\t \x1b[%sm%s\x1b[0m' % ('31', msg)


class ModelAdminJalaliMixin(object):
    def __init__(self, *args, **kwargs):
        self.formfield_overrides = overrides
        super(ModelAdminJalaliMixin, self).__init__(*args, **kwargs)


class StackedInlineJalaliMixin(object):
    def __init__(self, *args, **kwargs):
        self.formfield_overrides = overrides
        super(StackedInlineJalaliMixin, self).__init__(*args, **kwargs)


class TabularInlineJalaliMixin(object):
    def __init__(self, *args, **kwargs):
        self.formfield_overrides = overrides
        super(TabularInlineJalaliMixin, self).__init__(*args, **kwargs)


# removed in version 0.3
class ModelAdmin(admin.ModelAdmin):
    def __init__(self, *args, **kwargs):
        super(ModelAdmin, self).__init__(*args, **kwargs)
        self.formfield_overrides = overrides
        removed_in_next_version(
            'Django-Jalali-Date: "ModelAdmin" is removed in version 0.3, please use "ModelAdminJalaliMixin".\n\t\texample: class YourClass (admin.ModelAdmin, ModelAdminJalaliMixin):'
        )


class StackedInline(admin.StackedInline):
    def __init__(self, *args, **kwargs):
        super(StackedInline, self).__init__(*args, **kwargs)
        self.formfield_overrides = overrides
        removed_in_next_version(
            'Django-Jalali-Date: "StackedInline" is removed in version 0.3, please use "StackedInlineJalaliMixin".\n\t\texample: class YourClass (admin.StackedInline, StackedInlineJalaliMixin):'
        )


class TabularInline(admin.TabularInline):
    def __init__(self, *args, **kwargs):
        super(TabularInline, self).__init__(*args, **kwargs)
        self.formfield_overrides = overrides
        removed_in_next_version(
            'Django-Jalali-Date: "TabularInline" is removed in version 0.3, please use "TabularInlineJalaliMixin".\n\t\texample: class YourClass (admin.TabularInline, TabularInlineJalaliMixin):'
        )
