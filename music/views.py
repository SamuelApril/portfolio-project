from django.shortcuts import render
from .models import Track

def home(request):
    tracks = Track.objects.order_by("-release_date")

    return render(
        request,
        "home.html",
        {
            "tracks": tracks,
        },
    )

def vault(request):
    tracks = Track.objects.all().order_by("-id")
    return render(request, "music/vault.html", {"tracks": tracks})