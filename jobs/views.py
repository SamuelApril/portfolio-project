from django.shortcuts import render
from music.models import Track


def home(request):
    tracks = Track.objects.filter(
        show_on_homepage=True
    ).order_by("homepage_order", "-id")[:2]

    return render(request, "jobs/home.html", {"tracks": tracks})