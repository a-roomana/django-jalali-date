#!/usr/bin/env python
import codecs

from setuptools import find_packages, setup


def read_me(filename):
    return codecs.open(filename, encoding='utf-8').read()


setup(
    name='django-jalali-date',
    version='1.1.3',
    python_requires='>=3',
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
    long_description_content_type='text/markdown',
    zip_safe=False,
    classifiers=[
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'Topic :: Software Development :: Libraries :: Application Frameworks',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
        'Framework :: Django',
        'Framework :: Django :: 2.2',
        'Framework :: Django :: 3.2',
        'Framework :: Django :: 4.2',
        'Framework :: Django :: 5.0',
    ],
)
