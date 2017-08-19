from django.conf import settings

JALALI_DATE_DEFAULTS = {
    'STRFTIME': {
        'date': '%y/%m/%d',
        'datetime': '%H:%M:%S _ %y/%m/%d',
    }
}

if hasattr(settings, 'JALALI_DATE_DEFAULTS'):
    jalali_date_defaults = settings.JALALI_DATE_DEFAULTS
    for item in jalali_date_defaults.keys():
        if isinstance(jalali_date_defaults[item], dict):
            JALALI_DATE_DEFAULTS[item].update(jalali_date_defaults[item])
        else:
            JALALI_DATE_DEFAULTS[item] = jalali_date_defaults[item]

setattr(settings, 'JALALI_DATE_DEFAULTS', JALALI_DATE_DEFAULTS)
