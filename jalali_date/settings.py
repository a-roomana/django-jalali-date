from __future__ import print_function

from django.conf import settings

JALALI_DATE_DEFAULTS = {
    'LIST_DISPLAY_AUTO_CONVERT': False,
    'Strftime': {
        'date': '%y/%m/%d',
        'datetime': '%H:%M:%S _ %y/%m/%d',
    },
    'Static': {
        'js': [
            'admin/js/django_jalali.min.js',
            # or
            # 'admin/jquery.ui.datepicker.jalali/scripts/jquery.ui.core.js',
            # 'admin/jquery.ui.datepicker.jalali/scripts/calendar.js',
            # 'admin/jquery.ui.datepicker.jalali/scripts/jquery.ui.datepicker-cc.js',
            # 'admin/jquery.ui.datepicker.jalali/scripts/jquery.ui.datepicker-cc-fa.js',
            # 'admin/js/main.js',
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
            JALALI_DATE_DEFAULTS[item].update(jalali_date_defaults[item])
        else:
            JALALI_DATE_DEFAULTS[item] = jalali_date_defaults[item]

setattr(settings, 'JALALI_DATE_DEFAULTS', JALALI_DATE_DEFAULTS)
