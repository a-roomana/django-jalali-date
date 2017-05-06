from datetime import datetime, date
from django.template import Library as templateLibrary
from jalali_date import datet2jalali, datetime2jalali

register = templateLibrary()


@register.filter
def to_jalali(g_date, strftime='%y/%m/%d'):
    if g_date is None:
        return '-'
    elif isinstance(g_date, datetime):
        return datetime2jalali(g_date).strftime(strftime)
    elif isinstance(g_date, date):
        return datet2jalali(g_date).strftime(strftime)
    return '-'