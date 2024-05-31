from datetime import datetime
from unittest.mock import patch, Mock

from django.conf import settings
from django.test import SimpleTestCase
from django.utils.translation import gettext_lazy

from jalali_date.templatetags.jalali_tags import jalali_now


class TestJalaliNowTemplateTag(SimpleTestCase):
	"""
	Tests for `jalali_now` template tag
	"""

	FAKE_NOW_DATETIME = datetime(year=2012, month=4, day=17, hour=10, minute=51, second=36)
	FAKE_NOW_DATETIME_JALALI = datetime(year=1391, month=1, day=29, hour=10, minute=51, second=36)

	@property
	def default_datetime_format(self):
		return settings.JALALI_DATE_DEFAULTS["Strftime"]["datetime"]

	@patch("jalali_date.templatetags.jalali_tags.datetime")
	def test_default_strftime(self, patched_datetime: Mock):
		patched_datetime.now.return_value = self.FAKE_NOW_DATETIME
		self.assertEqual(
			jalali_now(),
			self.FAKE_NOW_DATETIME_JALALI.strftime(self.default_datetime_format),
		)

	@patch("jalali_date.templatetags.jalali_tags.datetime")
	def test_custom_strftime(self, patched_datetime: Mock):
		patched_datetime.now.return_value = self.FAKE_NOW_DATETIME
		custom_strftime = "%H.%M.%S | %Y-%m-%d"
		self.assertEqual(
			jalali_now(strftime=custom_strftime),
			self.FAKE_NOW_DATETIME_JALALI.strftime(custom_strftime),
		)

	@patch("jalali_date.templatetags.jalali_tags.datetime")
	def test_error_prevention_with_lazy_translatable_strftime(self, patched_datetime: Mock):
		"""
		Ensure that using lazy translatable strings as strftime will not raise an error. (#78)
		"""
		patched_datetime.now.return_value = self.FAKE_NOW_DATETIME
		custom_strftime = gettext_lazy("%Y-%m-%d")
		self.assertEqual(
			jalali_now(strftime=custom_strftime),
			self.FAKE_NOW_DATETIME_JALALI.strftime(str(custom_strftime)),
		)
