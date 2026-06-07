from django.shortcuts import render
from music.models import Track
from django.http import HttpResponse
from django.urls import reverse
from django.utils import timezone


def home(request):
    tracks = Track.objects.filter(
        show_on_homepage=True
    ).order_by("homepage_order", "-id")[:2]

    return render(request, "jobs/home.html", {"tracks": tracks})

def contact(request):
    return render(request, "jobs/contact.html")

def custom_404(request, exception):
    return render(request, "404.html", status=404)

def custom_500(request):
    return render(request, "500.html", status=500)

def robots_txt(request):
    sitemap_url = request.build_absolute_uri(reverse("sitemap_xml"))

    lines = [
        "User-agent: *",
        "Allow: /",
        "",
        f"Sitemap: {sitemap_url}",
    ]

    return HttpResponse("\n".join(lines), content_type="text/plain")


def sitemap_xml(request):
    today = timezone.now().date().isoformat()

    pages = [
        ("home", "1.0", "weekly"),
        ("vault", "0.9", "weekly"),
        ("allblogs", "0.8", "weekly"),
        ("about", "0.7", "monthly"),
        ("contact", "0.7", "monthly"),
    ]

    xml_urls = []

    for name, priority, changefreq in pages:
        try:
            absolute_url = request.build_absolute_uri(reverse(name))
        except Exception:
            continue

        xml_urls.append(f"""
    <url>
        <loc>{absolute_url}</loc>
        <lastmod>{today}</lastmod>
        <changefreq>{changefreq}</changefreq>
        <priority>{priority}</priority>
    </url>""")

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{''.join(xml_urls)}
</urlset>
"""

    return HttpResponse(xml, content_type="application/xml")