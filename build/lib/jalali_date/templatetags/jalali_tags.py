from datetime import datetime, date
from distutils.version import StrictVersion
from django import get_version

from jalali_date import date2jalali, datetime2jalali

django_version = get_version()
if StrictVersion(django_version) >= StrictVersion('1.9'):
    from django.template import Library
else:
    from django.template.base import Library

register = Library()


@register.filter
def to_jalali(g_date, strftime=None):
    if g_date is None:
        return '-'
    elif isinstance(g_date, datetime):
        return datetime2jalali(g_date).strftime(strftime if strftime else '%y/%m/%d _ %H:%M:%S')
    elif isinstance(g_date, date):
        return date2jalali(g_date).strftime(strftime if strftime else '%y/%m/%d')
    return '-'
