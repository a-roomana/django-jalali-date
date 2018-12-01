[![PyPi Version](https://img.shields.io/pypi/v/django-jalali-date.svg)](https://pypi.python.org/pypi/django-jalali-date)
[![PyPI - Downloads](https://img.shields.io/pypi/dm/django-jalali-date.svg)](https://pypistats.org/packages/django-jalali-date)
[![GitHub stars](https://img.shields.io/github/stars/a-roomana/django-jalali-date.svg?style=social)](https://github.com/a-roomana/django-jalali-date)
# django-jalali-date

Jalali Date support for user interface. Easy conversion of DateTimeFiled to JalaliDateTimeField within the admin site, view and templates.

----------
**DEPENDENCY**

To use this module you need to install jdatetime(and of course you need django) and pytz module which you can install it with easy_install or pip

----------
**INSTALL**

    pip install django-jalali-date   

----------
**USAGE**

settings.py
```python
INSTALLED_APPS = [
	'django_apps',
	
	'jalali_date',
	
	'my_apps',
]

# defaults
JALALI_DATE_DEFAULTS = {
   'Strftime': {
        'date': '%y/%m/%d',
        'datetime': '%H:%M:%S _ %y/%m/%d',
    },
    'Static': {
        'js': [ # prefix address is 'admin/'
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
```

views.py
```python
from jalali_date import datetime2jalali, date2jalali

def my_view(request):
	jalali_join = datetime2jalali(request.user.date_joined).strftime('%y/%m/%d _ %H:%M:%S')
```
forms.py
```python
from django import forms
from jalali_date.fields import JalaliDateField, SplitJalaliDateTimeField
from jalali_date.widgets import AdminJalaliDateWidget, AdminSplitJalaliDateTime


class TestForm(forms.ModelForm):
    class Meta:
        model = TestModel
        fields = ('name', 'date', 'date_time')

    def __init__(self, *args, **kwargs):
        super(TestForm, self).__init__(*args, **kwargs)
        self.fields['date'] = JalaliDateField(label=_('date'),
            widget=AdminJalaliDateWidget # optional, for user default datepicker
        )
        # you can added a "class" to this field for user your datepicker!
        # self.fields['date'].widget.attrs.update({'class': 'jalali_date-date'})

        self.fields['date_time'] = SplitJalaliDateTimeField(label=_('date time'), 
            widget=AdminSplitJalaliDateTime # required, for decompress DatetimeField to JalaliDateField and JalaliTimeField
        )
```
template.html
```html    
{% load jalali_tags %}

<p>{{ request.user.date_joined|to_jalali:'%y/%m/%d _ %H:%M:%S' }}</p>

<form method="post">{% csrf_token %}
    {{ form.media }} <!-- optinal, for load css and js of default datepicker -->
    {{ form.as_p }}
    <input type="submit">
</form>
```

admin.py
```python
from django.contrib import admin
from jalali_date.admin import ModelAdminJalaliMixin, StackedInlineJalaliMixin, TabularInlineJalaliMixin	
    
class MyInlines1(TabularInlineJalaliMixin, admin.TabularInline):
	model = SecendModel

class MyInlines2(StackedInlineJalaliMixin, admin.StackedInline):
	model = ThirdModel
	
@admin.register(FirstModel)
class FirstModelAdmin(ModelAdminJalaliMixin, admin.ModelAdmin):
	inlines = (MyInlines1, MyInlines2, )
	readonly_fields = ('some_fields', 'date_field',)
	# you can override formfield, for example:
	formfield_overrides = {
	    JSONField: {'widget': JSONEditor},
	}
```

![example](http://bayanbox.ir/view/2877111068605695571/Screenshot-from-2016-07-26-01-37-07.png)
