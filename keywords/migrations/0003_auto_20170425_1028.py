# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-25 08:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('keywords', '0002_keyword_keyword_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='keyword',
            name='keyword',
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
    ]
