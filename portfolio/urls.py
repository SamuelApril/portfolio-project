handler404 = "jobs.views.custom_404"
handler500 = "jobs.views.custom_500"


from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
import jobs.views
from .import views
from music.views import vault
from jobs.views import contact
from jobs.views import robots_txt, sitemap_xml

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', jobs.views.home, name="home"),
    path('blog/', include ('blog.urls')),
    path('about/', views.about, name='about'),
    path("vault/", vault, name="vault"),
    path("contact/", contact, name="contact"),
    path("robots.txt", robots_txt, name="robots_txt"),
    path("sitemap.xml", sitemap_xml, name="sitemap_xml"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )