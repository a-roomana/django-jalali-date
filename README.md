[![PyPI](https://img.shields.io/pypi/dm/django-jalali-date.svg)](https://pypi.python.org/pypi/django-jalali-date)
[![PyPi Version](https://img.shields.io/pypi/v/django-jalali-date.svg)](https://pypi.python.org/pypi/django-jalali-date)
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
   'STRFTIME': {
		'date': '%y/%m/%d',
		'datetime': '%H:%M:%S _ %y/%m/%d',
	}
}
```

python_file.py
```python
from jalali_date import datetime2jalali, date2jalali

def my_view(request):
	jalali_join = datetime2jalali(request.user.date_joined).strftime('%y/%m/%d _ %H:%M:%S')
```
   
template.html
```html    
{% load jalali_tags %}

<p>{{ request.user.date_joined|to_jalali:'%y/%m/%d _ %H:%M:%S' }}</p>
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
```

![example](http://bayanbox.ir/view/2877111068605695571/Screenshot-from-2016-07-26-01-37-07.png)
