from django.urls import path
from create import views

urlpatterns = [
    path('semillero/', views.create, name="create"),
    path(r'semillero/edit/<int:id>', views.semillero_edit, name="semillero_edit"),
    path(r'semillero/details/<int:id>', views.semillero_details, name="semillero_details"),
    path(r'semillero/remove/<int:id>', views.semillero_delete, name="semillero_delete"),
    path('linea/', views.add_workline, name="workline"),
    path('integrante/', views.register, name="register"),
    path(r'integrante/details/<int:id>', views.integrante_details, name="integrante_details"),
    path(r'integrante/edit/<int:id>', views.integrante_edit, name="integrante_edit"),
    path('produccion/', views.produccion, name="produccion"),
    path('produccion/edit/<int:id>', views.produccion_edit, name="produccion_edit"),
    path('produccion/remove/<int:id>', views.produccion_delete, name="produccion_delete"),
    path('validacion/<int:id>', views.verificacion_certificado, name="validacion"),
    path('editar/',views.editar, name="editar")
]