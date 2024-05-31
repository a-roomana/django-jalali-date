from django.conf import settings
from django.core.exceptions import FieldDoesNotExist, FieldError
from django.db import models

from jalali_date import date2jalali, datetime2jalali
from jalali_date.fields import JalaliDateField, SplitJalaliDateTimeField
from jalali_date.utils import normalize_strftime
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
        list_display = super().get_list_display(request)

        if not settings.JALALI_DATE_DEFAULTS['LIST_DISPLAY_AUTO_CONVERT']:
            return list_display

        list_display = list(list_display)
        for index, field_name in enumerate(list_display):
            try:
                field = self.opts.get_field(field_name)
            except FieldDoesNotExist:
                pass
            else:
                if isinstance(field, (models.DateTimeField, models.DateField)):
                    func_name = f'get_jalali_{list_display[index]}'
                    list_display[index] = func_name
                    setattr(self, func_name, self.jalali_list_display(field))
        return list_display

    def jalali_list_display(self, field):
        def func(obj):
            if isinstance(field, models.DateTimeField):
                strftime = settings.JALALI_DATE_DEFAULTS['Strftime']['datetime']
                convert_func = datetime2jalali
            elif isinstance(field, models.DateField):
                strftime = settings.JALALI_DATE_DEFAULTS['Strftime']['date']
                convert_func = date2jalali
            else:
                raise FieldError('The field must be an instance of DateTimeField or DateField')

            g_date = getattr(obj, field.name)
            if not g_date:
                return ''
            else:
                strftime = normalize_strftime(strftime)
                return convert_func(g_date).strftime(strftime)

        func.short_description = field.verbose_name
        func.admin_order_field = f'-{field.name}'
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
