from datetime import datetime, date
from distutils.version import StrictVersion
from django import get_version
from django.conf import settings
from django.template.defaultfilters import safe

from jalali_date import date2jalali, datetime2jalali

django_version = get_version()
if StrictVersion(django_version) >= StrictVersion('1.9'):
    from django.template import Library
else:
    from django.template.base import Library

register = Library()
DEFAULTS = settings.JALALI_DATE_DEFAULTS


@register.filter
def to_jalali(g_date, strftime=None):
    if g_date is None:
        return '-'
    elif isinstance(g_date, datetime):
        strftime = strftime if strftime else DEFAULTS['Strftime']['datetime']
        return datetime2jalali(g_date).strftime(strftime)
    elif isinstance(g_date, date):
        strftime = strftime if strftime else DEFAULTS['Strftime']['date']
        return date2jalali(g_date).strftime(strftime)
    return '-'


@register.filter
def jalali_admin_safe_readonly(readonly_field, strftime=None):
    """
    :param readonly_field: django.contrib.admin.helpers.AdminReadOnlyField
    :param strftime: format output
    :return: str
    """
    field_name = readonly_field.field['field']
    field = getattr(readonly_field.form.instance, field_name)
    if isinstance(field, datetime):
        strftime = strftime if strftime else DEFAULTS['Strftime']['datetime']
        return datetime2jalali(field).strftime(strftime)
    elif isinstance(field, date):
        strftime = strftime if strftime else DEFAULTS['Strftime']['date']
        return date2jalali(field).strftime(strftime)
    elif field is None:
        return '-'

    return readonly_field.contents


@register.simple_tag
def jalali_now(strftime=None):
    strftime = strftime if strftime else DEFAULTS['Strftime']['datetime']
    return datetime2jalali(datetime.now()).strftime(strftime)
