from django.conf import settings
from django.core.exceptions import FieldDoesNotExist
from django.db import models

from jalali_date import date2jalali, datetime2jalali
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

    def get_list_display(self, request):
        list_display = list(super(ModelAdminJalaliMixin, self).get_list_display(request))
        for index, field_name in enumerate(list_display[:]):
            try:
                field = self.opts.get_field(field_name)
            except FieldDoesNotExist:
                pass
            else:
                func_name = 'get_jalali_' + list_display[index]
                if isinstance(field, models.DateTimeField):
                    list_display[index] = func_name
                    setattr(self, func_name, self.jalali_datetime_list_display(field))
                elif isinstance(field, models.DateField):
                    list_display[index] = func_name
                    setattr(self, func_name, self.jalali_date_list_display(field))
        return list_display

    def jalali_datetime_list_display(self, field):
        def func(obj):
            strftime = settings.JALALI_DATE_DEFAULTS['Strftime']['datetime']
            return datetime2jalali(getattr(obj, field.name)).strftime(strftime)

        func.short_description = field.verbose_name
        return func

    def jalali_date_list_display(self, field):
        def func(obj):
            strftime = settings.JALALI_DATE_DEFAULTS['Strftime']['date']
            return date2jalali(getattr(obj, field.name)).strftime(strftime)

        func.short_description = field.verbose_name
        return func


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

