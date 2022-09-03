from django.contrib import admin
from .models import Grupo
from .models import Usuario
from .models import Noticia

# Registro de los modelos usuario y noticia, definimos también que
# sus campos id, fecha de creación y fecha de actualización son de solo-lectura.
class UsuarioAdmin(admin.ModelAdmin):
    readonly_fields = ('id', 'created', 'updated')

class NoticiaAdmin(admin.ModelAdmin):
    readonly_fields = ('id', 'created', 'updated')

# Asociamos el modelo a su respectivo administrador
admin.site.register(Grupo)
admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Noticia, NoticiaAdmin)
