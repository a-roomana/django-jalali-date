from datetime import datetime, date

from django.conf import settings
from django.test import SimpleTestCase
from django.utils.translation import gettext_lazy

from jalali_date.templatetags.jalali_tags import to_jalali


class TestToJalaliTemplateTag(SimpleTestCase):
	"""
	Tests for `to_jalali` template tag
	"""

	FAKE_DATE = date(year=2012, month=4, day=17)
	FAKE_DATE_JALALI = date(year=1391, month=1, day=29)

	FAKE_DATETIME = datetime(year=2012, month=4, day=17, hour=10, minute=51, second=36)
	FAKE_DATETIME_JALALI = datetime(year=1391, month=1, day=29, hour=10, minute=51, second=36)

	@property
	def default_date_format(self):
		return settings.JALALI_DATE_DEFAULTS["Strftime"]["date"]

	@property
	def default_datetime_format(self):
		return settings.JALALI_DATE_DEFAULTS["Strftime"]["datetime"]

	def test_none_g_date(self):
		self.assertEqual(to_jalali(g_date=None), "-")

	def test_invalid_type_g_date(self):
		self.assertEqual(to_jalali(g_date=123), "-")
		self.assertEqual(to_jalali(g_date="test-str"), "-")

	def test_date_conversion(self):
		self.assertEqual(
			to_jalali(self.FAKE_DATE),
			self.FAKE_DATE_JALALI.strftime(self.default_date_format),
		)

	def test_date_conversion_with_custom_strftime(self):
		custom_strftime = "%Y-%m-%d"
		self.assertEqual(
			to_jalali(g_date=self.FAKE_DATE, strftime=custom_strftime),
			self.FAKE_DATE_JALALI.strftime(custom_strftime),
		)

	def test_datetime_conversion(self):
		self.assertEqual(
			to_jalali(self.FAKE_DATETIME),
			self.FAKE_DATETIME_JALALI.strftime(self.default_datetime_format),
		)

	def test_datetime_conversion_with_custom_strftime(self):
		custom_strftime = "%H.%M.%S | %Y-%m-%d"
		self.assertEqual(
			to_jalali(g_date=self.FAKE_DATETIME, strftime=custom_strftime),
			self.FAKE_DATETIME_JALALI.strftime(custom_strftime),
		)

	def test_error_prevention_with_lazy_translatable_strftime(self):
		"""
		Ensure that using lazy translatable strings as strftime will not raise an error. (#78)
		"""
		custom_strftime = gettext_lazy("%Y-%m-%d")
		self.assertEqual(
			to_jalali(g_date=self.FAKE_DATE, strftime=custom_strftime),
			self.FAKE_DATE_JALALI.strftime(str(custom_strftime)),
		)
