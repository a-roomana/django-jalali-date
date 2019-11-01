from datetime import date, datetime
from distutils.version import StrictVersion

from django import get_version
from django.conf import settings

from jalali_date import date2jalali, datetime2jalali

django_version = get_version()
if StrictVersion(django_version) >= StrictVersion('1.9'):
	from django.template import Library
else:
	from django.template.base import Library

register = Library()
DEFAULTS = settings.JALALI_DATE_DEFAULTS


class ObjectContents(object):
	def __init__(self, value):
		self.value = value

	def __str__(self):
		return self.value

	def contents(self):
		return self.value


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
	instance = readonly_field.form.instance
	field_name = readonly_field.field['field']

	if not hasattr(instance, field_name):
		return readonly_field

	field = getattr(instance, field_name)
	if isinstance(field, datetime):
		strftime = strftime if strftime else DEFAULTS['Strftime']['datetime']
		return ObjectContents(datetime2jalali(field).strftime(strftime))
	elif isinstance(field, date):
		strftime = strftime if strftime else DEFAULTS['Strftime']['date']
		return ObjectContents(date2jalali(field).strftime(strftime))
	elif field is None:
		return ObjectContents('-')

	return readonly_field


@register.simple_tag
def jalali_now(strftime=None):
	strftime = strftime if strftime else DEFAULTS['Strftime']['datetime']
	return datetime2jalali(datetime.now()).strftime(strftime)
