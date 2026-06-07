from django.contrib import admin
from .models import Track


@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "record_label",
        "featured",
        "show_on_homepage",
        "homepage_order",
        "release_date",
        "tag_exclusive",
        "tag_unreleased",
        "tag_teaser",
    )

    list_editable = (
        "featured",
        "show_on_homepage",
        "homepage_order",
        "tag_exclusive",
        "tag_unreleased",
        "tag_teaser",
    )

    search_fields = (
        "title",
        "description",
        "record_label",
    )

    list_filter = (
        "featured",
        "show_on_homepage",
        "record_label",
        "release_date",
        "tag_exclusive",
        "tag_unreleased",
        "tag_teaser",
    )