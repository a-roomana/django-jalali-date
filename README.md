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

    INSTALLED_APPS = [
	    ...
	    'jalali_date',
	    ...
	]


python_file.py

    from jalali_date import datetime2jalali, date2jalali
    
    def my_view(request):
        jalali_join = datetime2jalali(request.user.date_joined).strftime('%y/%m/%d _ %H:%M:%S')
   
template.html
    
    {% load jalali_tags %}
    
    <p>{{ request.user.date_joined|to_jalali:'%y/%m/%d _ %H:%M:%S' }}</p>


admin.py

	from django.contrib import admin
	from jalali_date.admin import ModelAdminJalaliMixin, StackedInlineJalaliMixin, TabularInlineJalaliMixin
	
    
    class MyInlines1(admin.TabularInline, TabularInlineJalaliMixin):
	    model = SecendModel
    
    class MyInlines2(admin.StackedInline, StackedInlineJalaliMixin):
	    model = ThirdModel
	
	@admin.register(FirstModel)
	class FirstModelAdmin(admin.ModelAdmin, ModelAdminJalaliMixin):
		inlines = (MyInlines1, MyInlines2, )    

![example](http://bayanbox.ir/view/2877111068605695571/Screenshot-from-2016-07-26-01-37-07.png)
