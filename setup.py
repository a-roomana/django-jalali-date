from setuptools import setup

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.md')).read()

setup(
        name='django-jalali-date',
        version='0.1',
        packages=['jalali_date'],
        description = ("Jalali Date support for user interface. Easy conversion of DateTimeFiled to JalaliDateTimeField within the admin site."),
	long_description=README,        
	url = 'http://github.com/a-roomana/django-jalali-date',
        download_url = 'http://github.com/a-roomana/django-jalali-date/tarball/master',
        author = 'Arman Roomana',
        author_email = 'roomana.arman@gmail.com',
        keywords = "django jalali date",
        license='Python Software Foundation License',
        platforms='any',
        requires = ["django", "jdatetime"],
)
