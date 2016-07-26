# -*- coding: utf-8 -*-
from django.contrib.admin.widgets import AdminSplitDateTime, AdminDateWidget, AdminTimeWidget
from django import forms
from django.contrib.admin.templatetags.admin_static import static
from django.forms.utils import to_current_timezone
from jdatetime import GregorianToJalali


class AdminJalaliDateWidget(AdminDateWidget):
    @property
    def media(self):
        js = [
            "jquery.ui.datepicker.jalali/scripts/jquery-1.10.2.min.js",
            "jquery.ui.datepicker.jalali/scripts/jquery.ui.core.js",
            "jquery.ui.datepicker.jalali/scripts/jquery.ui.datepicker-cc.js",
            "jquery.ui.datepicker.jalali/scripts/calendar.js",
            "jquery.ui.datepicker.jalali/scripts/jquery.ui.datepicker-cc-fa.js",
            "js/main.js"
        ]
        css = {
            'all': ["admin/jquery.ui.datepicker.jalali/themes/base/jquery-ui.min.css"]
        }
        return forms.Media(js=[static("admin/%s" % path) for path in js], css=css)

    def __init__(self, attrs=None, format=None):
        final_attrs = {'class': 'jalali_date-date', 'size': '10'}
        if attrs is not None:
            final_attrs.update(attrs)
        super(AdminJalaliDateWidget, self).__init__(attrs=final_attrs, format=format)


class AdminSplitJalaliDateTime(AdminSplitDateTime):
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
