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
def to_jalali(g_date, strftime='%y/%m/%d'):
    if g_date is None:
        return '-'
    elif isinstance(g_date, datetime):
        return datetime2jalali(g_date).strftime(strftime)
    elif isinstance(g_date, date):
        return date2jalali(g_date).strftime(strftime)
    return '-'


@register.filter
def jalali_admin_safe_readonly(readonly_field):
    """
    :param readonly_field: django.contrib.admin.helpers.AdminReadOnlyField
    :return: str
    """
    field_name = readonly_field.field['field']
    field = getattr(readonly_field.form.instance, field_name)

    if isinstance(field, datetime):
        return datetime2jalali(field).strftime('%H:%M:%S _ %y/%m/%d')
    elif isinstance(field, date):
        return date2jalali(field).strftime('%y/%m/%d')

    return readonly_field.contents
