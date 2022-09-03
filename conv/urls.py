from django.urls import path
from conv import views

urlpatterns = [
    # Enlaces estaticos a las paginas para crear convocatoria y participar
    path('convocatoria/', views.conv_create, name="conv_create"),
    path('participar/', views.participar, name="participar"),
    path(r'participar/edit/<int:id>', views.convocatoria_edit, name="convocatoria_edit"),
    path(r'participar/asignar/<int:id_conv>/<int:id>', views.asignar_proyecto, name="asignar_proyecto"),
    # Enlace dinamico para ver la información de la convocatoria,
    # Es posible acceder definiendo el id de la convocatoria
    path(r'details/<int:id_conv>/<int:id>', views.adjuntos, name="adjuntos"),
    path(r'details/<int:id_item>', views.conv_details, name="details"),
    path('proyectos', views.proyectos, name="proyectos"),
    path(r'proyectos/<int:id>', views.reportar, name="reportar"),
    path(r'proyectos/details/<int:id_item>', views.proyecto_details, name="proyecto_details"),
    path(r'proyectos/edit/<int:id>', views.proyecto_edit, name="proyecto_edit"),
    path(r'proyectos/reportes/<int:id>', views.reportes, name="reportes"),
]
