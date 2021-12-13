# -*- coding: utf-8 -*-
from django.contrib.admin.widgets import AdminSplitDateTime, AdminDateWidget, AdminTimeWidget
from django import forms
from django.conf import settings
from django.templatetags.static import static
from django.forms.utils import to_current_timezone
from django.utils.html import format_html
from jdatetime import GregorianToJalali

try:
    from django.utils.translation import gettext as _  
except ImportError:
    from django.utils.translation import ugettext as _ 


class AdminJalaliDateWidget(AdminDateWidget):
    @property
    def media(self):
        js = settings.JALALI_DATE_DEFAULTS['Static']['js']
        css = settings.JALALI_DATE_DEFAULTS['Static']['css']
        return forms.Media(js=[static(path) for path in js], css=css)

    def __init__(self, attrs=None, format=None):
        final_attrs = {'class': 'jalali_date-date', 'size': '10'}
        if attrs is not None:
            final_attrs.update(attrs)
        super(AdminJalaliDateWidget, self).__init__(attrs=final_attrs, format=format)


class AdminSplitJalaliDateTime(AdminSplitDateTime):
    template_name = 'admin/widgets/jalali_split_datetime.html'  # for django >= 1.11

    def __init__(self, attrs=None):
        widgets = [AdminJalaliDateWidget, AdminTimeWidget]
        # Note that we're calling MultiWidget, not SplitDateTimeWidget, because
        # we want to define widgets.
        forms.MultiWidget.__init__(self, widgets, attrs)

    def decompress(self, value):
        if value:
            value = to_current_timezone(value)
            j_date_obj = GregorianToJalali(gyear=value.year, gmonth=value.month, gday=value.day)
            date_str = '%d-%.2d-%.2d' % (j_date_obj.jyear, j_date_obj.jmonth, j_date_obj.jday)
            return [date_str, value.time().replace(microsecond=0)]
        return [None, None]

    def format_output(self, rendered_widgets):  # for django < 1.11
        return format_html(
            u'<p class="datetime">{} {} {} {}</p>', _('Date:'), rendered_widgets[0], _('Time:'), rendered_widgets[1]
        )
