# -*- coding: utf-8 -*-
from django.forms.fields import DateField, SplitDateTimeField, TimeField
from django.utils.encoding import force_str
from datetime import date as datetime_date
from jdatetime import GregorianToJalali, datetime as jalali_datetime


class JalaliDateField(DateField):
    def prepare_value(self, value):
        if isinstance(value, datetime_date):
            date_obj = GregorianToJalali(gyear=value.year, gmonth=value.month, gday=value.day)
            return '%d-%.2d-%.2d' % (date_obj.jyear, date_obj.jmonth, date_obj.jday)

        return value

    def strptime(self, value, format):
        return jalali_datetime.strptime(force_str(value), format).togregorian().date()


class SplitJalaliDateTimeField(SplitDateTimeField):
    def __init__(self, input_date_formats=None, input_time_formats=None, *args, **kwargs):
        errors = self.default_error_messages.copy()
        if 'error_messages' in kwargs:
            errors.update(kwargs['error_messages'])
        localize = kwargs.get('localize', False)
        fields = (
            JalaliDateField(input_formats=input_date_formats,
                            error_messages={'invalid': errors['invalid_date']},
                            localize=localize),
            TimeField(input_formats=input_time_formats,
                      error_messages={'invalid': errors['invalid_time']},
                      localize=localize),
        )
        super(SplitDateTimeField, self).__init__(fields, *args, **kwargs)
