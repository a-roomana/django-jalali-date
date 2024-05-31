from datetime import datetime, date
from unittest.mock import Mock

from django.conf import settings
from django.test import SimpleTestCase
from django.utils.translation import gettext_lazy

from jalali_date.templatetags.jalali_tags import jalali_admin_safe_readonly


class TestJalaliAdminSafeReadonlyTemplateTag(SimpleTestCase):
	"""
	Tests for `jalali_admin_safe_readonly` template tag
	"""

	FAKE_DATETIME = datetime(year=2012, month=4, day=17, hour=10, minute=51, second=36)
	FAKE_DATETIME_JALALI = datetime(year=1391, month=1, day=29, hour=10, minute=51, second=36)

	FAKE_DATE = date(year=2012, month=4, day=17)
	FAKE_DATE_JALALI = date(year=1391, month=1, day=29)

	@property
	def default_date_format(self):
		return settings.JALALI_DATE_DEFAULTS["Strftime"]["date"]

	@property
	def default_datetime_format(self):
		return settings.JALALI_DATE_DEFAULTS["Strftime"]["datetime"]

	@staticmethod
	def create_readonly_field(field_value=None):
		"""
		A helper method which creates a mock readonly field.
		"""
		instance = Mock()
		instance.some_field = field_value
		form = Mock()
		form.instance = instance
		readonly_field = Mock()
		readonly_field.form = form
		readonly_field.field = {"field": "some_field"}
		return readonly_field

	def test_instance_missing_field(self):
		readonly_field = self.create_readonly_field()
		readonly_field.field = {"field": "missing_field"}
		self.assertEqual(jalali_admin_safe_readonly(readonly_field), readonly_field)

	def test_with_datetime(self):
		readonly_field = self.create_readonly_field(self.FAKE_DATETIME)
		self.assertEqual(
			jalali_admin_safe_readonly(readonly_field).value,
			self.FAKE_DATETIME_JALALI.strftime(self.default_datetime_format),
		)

	def test_with_custom_strftime_datetime(self):
		readonly_field = self.create_readonly_field(self.FAKE_DATETIME)
		custom_strftime = "%H.%M.%S | %Y-%m-%d"
		self.assertEqual(
			jalali_admin_safe_readonly(readonly_field=readonly_field, strftime=custom_strftime).value,
			self.FAKE_DATETIME_JALALI.strftime(custom_strftime),
		)

	def test_with_date(self):
		readonly_field = self.create_readonly_field(self.FAKE_DATE)
		self.assertEqual(
			jalali_admin_safe_readonly(readonly_field).value,
			self.FAKE_DATE_JALALI.strftime(self.default_date_format),
		)

	def test_with_custom_strftime_date(self):
		readonly_field = self.create_readonly_field(self.FAKE_DATE)
		custom_strftime = "%Y-%m-%d"
		self.assertEqual(
			jalali_admin_safe_readonly(readonly_field=readonly_field, strftime=custom_strftime).value,
			self.FAKE_DATE_JALALI.strftime(custom_strftime),
		)

	def test_error_prevention_with_lazy_translatable_strftime(self):
		"""
		Ensure that using lazy translatable strings as strftime will not raise an error. (#78)
		"""
		readonly_field = self.create_readonly_field(self.FAKE_DATETIME)
		custom_strftime = gettext_lazy("%H.%M.%S | %Y-%m-%d")
		self.assertEqual(
			jalali_admin_safe_readonly(readonly_field=readonly_field, strftime=custom_strftime).value,
			self.FAKE_DATETIME_JALALI.strftime(str(custom_strftime)),
		)
