#!/usr/bin/env python
import codecs
import os
from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))


def read_file(filename):
    """Open a related file and return its content."""
    with codecs.open(os.path.join(here, filename), encoding='utf-8') as f:
        content = f.read()
    return content


README = read_file('README.md')

setup(
    name='django-jalali-date',
    version='0.2.2',
    packages=find_packages(),
    include_package_data=True,
    description=(
    'Jalali Date support for user interface. Easy conversion of DateTimeFiled to JalaliDateTimeField within the admin site.'),
    url='http://github.com/a-roomana/django-jalali-date',
    download_url='https://pypi.python.org/pypi/django-jalali-date/',
    author='Arman Roomana',
    author_email='roomana.arman@gmail.com',
    keywords="django jalali date",
    license='Python Software Foundation License',
    platforms=['any'],
    install_requires=[
        "pytz",
        "django",
        "jdatetime"
    ],
    long_description=README,
	use_2to3 = True,
    zip_safe=False,
	classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Application Frameworks',
        'Topic :: Software Development :: Libraries :: Python Modules',
    ],
)
