from __future__ import print_function

from django.forms.utils import to_current_timezone
from jalali_date import settings
import jdatetime


def date2jalali(g_date):
    return jdatetime.date.fromgregorian(date=g_date) if g_date else None


def datetime2jalali(g_date):
    if g_date is None:
        return None

    g_date = to_current_timezone(g_date)
    return jdatetime.datetime.fromgregorian(datetime=g_date)


def removed_in_next_version(msg=''):
    if msg:
        print('>>>\t \x1b[%sm%s\x1b[0m' % ('31', msg))
