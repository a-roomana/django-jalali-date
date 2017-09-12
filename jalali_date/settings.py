from __future__ import print_function
from django.conf import settings

JALALI_DATE_DEFAULTS = {
    'Strftime': {
        'date': '%y/%m/%d',
        'datetime': '%H:%M:%S _ %y/%m/%d',
    },
    'Static': {
        'js': [
            'js/django_jalali.min.js',
            # or
            # 'jquery.ui.datepicker.jalali/scripts/jquery-1.10.2.min.js',
            # 'jquery.ui.datepicker.jalali/scripts/jquery.ui.core.js',
            # 'jquery.ui.datepicker.jalali/scripts/calendar.js',
            # 'jquery.ui.datepicker.jalali/scripts/jquery.ui.datepicker-cc.js',
            # 'jquery.ui.datepicker.jalali/scripts/jquery.ui.datepicker-cc-fa.js',
            # 'js/main.js',
        ],
        'css': {
            'all': [
                'admin/jquery.ui.datepicker.jalali/themes/base/jquery-ui.min.css',
            ]
        }
    },
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
