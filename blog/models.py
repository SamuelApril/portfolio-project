

from django.db import models
from django.utils import timezone


class Blog(models.Model):
    title = models.CharField(default='', max_length=255)
    pub_date = models.DateTimeField(default=timezone.now)
    body = models.TextField(default='')
    image = models.ImageField(upload_to='images/')