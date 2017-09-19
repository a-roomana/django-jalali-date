#!/usr/bin/env python
import codecs
from setuptools import setup, find_packages

try:
    from pypandoc import convert

    def read_me(filename):
        return convert(filename, 'rst')
except ImportError:
    print("warning: pypandoc module not found, could not convert Markdown to RST")

    def read_me(filename):
        return codecs.open(filename, encoding='utf-8').read()

setup(
    name='django-jalali-date',
    version='0.2.7',
    packages=find_packages(),
    include_package_data=True,
    description=(
        'Jalali Date support for user interface. Easy conversion of DateTimeFiled to JalaliDateTimeField within the admin site, views, forms and templates.'
    ),
    url='http://github.com/a-roomana/django-jalali-date',
    download_url='https://pypi.python.org/pypi/django-jalali-date/',
    author='Arman Roomana',
    author_email='roomana.arman@gmail.com',
    keywords="django jalali date",
    license='MIT',
    platforms=['any'],
    install_requires=[
        "django",
        "jdatetime"
    ],
    long_description=read_me('README.md'),
    use_2to3=True,
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
