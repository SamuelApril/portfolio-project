

from django.db import models
from django.utils import timezone


class Blog(models.Model):
    title = models.CharField(default='', max_length=255)
    pub_date = models.DateTimeField(default=timezone.now)
    body = models.TextField(default='')
    image = models.ImageField(upload_to='images/')

    def __str__(self):
        return self.title

    def summary(self):
        return self.body[:100]

    def pub_date_pretty(self):
        return self.pub_date.strftime('%b %e, %Y')