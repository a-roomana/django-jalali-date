from django.contrib import admin
from django.db import models
from jalali_date import removed_in_next_version
from jalali_date.fields import JalaliDateField, SplitJalaliDateTimeField
from jalali_date.widgets import AdminJalaliDateWidget, AdminSplitJalaliDateTime
from django.contrib.admin import TabularInline, StackedInline
overrides = {
    models.DateField: {
        'form_class': JalaliDateField,
        'widget': AdminJalaliDateWidget
    },
    models.DateTimeField: {
        'form_class': SplitJalaliDateTimeField,
        'widget': AdminSplitJalaliDateTime
    },
}


class ModelAdminJalaliMixin(object):
    change_form_template = 'admin/jalali_change_form.html'
    formfield_overrides = {}

    def __init__(self, *args, **kwargs):
        formfield_overrides = overrides.copy()
        formfield_overrides.update(self.formfield_overrides)
        self.formfield_overrides = formfield_overrides
        super(ModelAdminJalaliMixin, self).__init__(*args, **kwargs)


class StackedInlineJalaliMixin(object):
    template = 'admin/edit_inline/jalali_stacked.html'
    formfield_overrides = {}

    def __init__(self, *args, **kwargs):
        formfield_overrides = overrides.copy()
        formfield_overrides.update(self.formfield_overrides)
        self.formfield_overrides = formfield_overrides
        super(StackedInlineJalaliMixin, self).__init__(*args, **kwargs)


class TabularInlineJalaliMixin(object):
    template = 'admin/edit_inline/jalali_tabular.html'
    formfield_overrides = {}

    def __init__(self, *args, **kwargs):
        formfield_overrides = overrides.copy()
        formfield_overrides.update(self.formfield_overrides)
        self.formfield_overrides = formfield_overrides
        super(TabularInlineJalaliMixin, self).__init__(*args, **kwargs)


# removed in version 0.3
class ModelAdmin(admin.ModelAdmin):
    change_form_template = 'admin/jalali_change_form.html'

    def __init__(self, *args, **kwargs):
        formfield_overrides = overrides.copy()
        formfield_overrides.update(self.formfield_overrides)
        self.formfield_overrides = formfield_overrides
        super(ModelAdmin, self).__init__(*args, **kwargs)
        removed_in_next_version(
            'Django-Jalali-Date: "ModelAdmin" is removed in version 0.3, please use "ModelAdminJalaliMixin".\n\t\texample: class YourClass (ModelAdminJalaliMixin, admin.ModelAdmin):'
        )


class StackedInline(admin.StackedInline):
    template = 'admin/edit_inline/jalali_stacked.html'

    def __init__(self, *args, **kwargs):
        formfield_overrides = overrides.copy()
        formfield_overrides.update(self.formfield_overrides)
        self.formfield_overrides = formfield_overrides
        super(StackedInline, self).__init__(*args, **kwargs)
        removed_in_next_version(
            'Django-Jalali-Date: "StackedInline" is removed in version 0.3, please use "StackedInlineJalaliMixin".\n\t\texample: class YourClass (StackedInlineJalaliMixin, admin.StackedInline):'
        )


class TabularInline(admin.TabularInline):
    template = 'admin/edit_inline/jalali_tabular.html'

    def __init__(self, *args, **kwargs):
        formfield_overrides = overrides.copy()
        formfield_overrides.update(self.formfield_overrides)
        self.formfield_overrides = formfield_overrides
        super(TabularInline, self).__init__(*args, **kwargs)
        removed_in_next_version(
            'Django-Jalali-Date: "TabularInline" is removed in version 0.3, please use "TabularInlineJalaliMixin".\n\t\texample: class YourClass (TabularInlineJalaliMixin, admin.TabularInline):'
        )
