from __future__ import print_function
from pytz import timezone
import jdatetime
from jalali_date.settings import settings


def date2jalali(g_date):
    return jdatetime.date.fromgregorian(date=g_date) if g_date else None


def datetime2jalali(g_date):
    if g_date is None:
        return None

    if settings.USE_TZ:
        g_date = g_date.astimezone(timezone(settings.TIME_ZONE))

    return jdatetime.datetime.fromgregorian(datetime=g_date)


def removed_in_next_version(msg=''):
    if msg:
        print('>>>\t \x1b[%sm%s\x1b[0m' % ('31', msg))
