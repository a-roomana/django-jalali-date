from django.db import models

from jalali_date.fields import JalaliDateField, SplitJalaliDateTimeField
from jalali_date.widgets import AdminJalaliDateWidget, AdminSplitJalaliDateTime

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

