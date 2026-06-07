from django.db import models


class Track(models.Model):

    title = models.CharField(max_length=200)

    artwork = models.ImageField(upload_to='tracks/artwork/')

    preview = models.FileField(upload_to='tracks/previews/')

    description = models.TextField()

    spotify_url = models.URLField(blank=True)

    youtube_url = models.URLField(blank=True)

    record_label = models.CharField(max_length=120, blank=True)
    record_label_url = models.URLField(blank=True)

    release_date = models.DateField(blank=True, null=True)

    featured = models.BooleanField(default=False)

    show_on_homepage = models.BooleanField(default=False)
    homepage_order = models.PositiveIntegerField(default=0)

    tag_exclusive = models.BooleanField(default=False)
    tag_unreleased = models.BooleanField(default=False)
    tag_teaser = models.BooleanField(default=False)

    def __str__(self):
        return self.title