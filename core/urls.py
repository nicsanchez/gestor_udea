from django.urls import path
from django.views.generic import RedirectView
from django.conf.urls import url
from core import views

urlpatterns = [
    path('', views.home, name="home"),
    path('add_news', views.add_news, name="add_news"),
    path('login', views.login, name="login"),
    path('sign-up', views.signup, name="sign-up"),
    path('choose', views.choose, name="choose"),
    path('semilleros', views.semilleros, name="semilleros"),
    path('estadisticas', views.estadisticas, name="estadisticas"),
    path('tutoriales', views.tutoriales, name="tutoriales"),
    path(r'news/<int:id_item>', views.news, name="news"),
    path(r'news/edit/<int:id_item>', views.edit_news, name="edit_news"),
    url(r'^favicon\.ico$',RedirectView.as_view(url='/static/core/favicon.ico')),
]
