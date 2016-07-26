from setuptools import setup, find_packages

setup(
        name='django-jalali-date',
        version='0.1.4',
        packages=find_packages(),
        description = ('Jalali Date support for user interface. Easy conversion of DateTimeFiled to JalaliDateTimeField within the admin site.'),
        url = 'http://github.com/a-roomana/django-jalali-date',
        download_url = 'http://github.com/a-roomana/django-jalali-date/tarball/master',
        author = 'Arman Roomana',
        author_email = 'roomana.arman@gmail.com',
        keywords = "django jalali date",
        license='Python Software Foundation License',
        platforms='any',
        requires = ["jdatetime","django"],
        long_description=open('README.md').read()
)
