from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('property/', include('property.urls')),
    path('tenants/', include('tenant.urls')),
]
