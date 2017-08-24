from __future__ import print_function
from django.conf import settings

JALALI_DATE_DEFAULTS = {
    'Strftime': {
        'date': '%y/%m/%d',
        'datetime': '%H:%M:%S _ %y/%m/%d',
    }
}

if hasattr(settings, 'JALALI_DATE_DEFAULTS'):
    jalali_date_defaults = settings.JALALI_DATE_DEFAULTS
    for item in jalali_date_defaults.keys():
        if isinstance(jalali_date_defaults[item], dict):
            if item == 'STRFTIME':
                JALALI_DATE_DEFAULTS['Strftime'].update(jalali_date_defaults[item])
                print(
                    '>>>\t \x1b[%sm%s\x1b[0m' % (
                        '31',
                        'Django-Jalali-Date: "STRFTIME" is removed in version 0.3, please replace it by "Strftime"'
                    )
                )
            else:
                JALALI_DATE_DEFAULTS[item].update(jalali_date_defaults[item])
        else:
            JALALI_DATE_DEFAULTS[item] = jalali_date_defaults[item]

setattr(settings, 'JALALI_DATE_DEFAULTS', JALALI_DATE_DEFAULTS)
