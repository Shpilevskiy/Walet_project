from django.conf.urls import url

from . import views

urlpatterns = [

    url(r'^$', views.mywallet, name="mywallet"),
    url(r'^logout/', views.log_out, name="mywallet"),
]