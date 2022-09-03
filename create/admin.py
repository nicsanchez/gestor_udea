from django.contrib import admin
from .models import Semillero
from .models import Integrante
from .models import LineaSemillero
from .models import Career
from .models import Linea
from .models import Atributos
from .models import Rol,Participante2,coordinadores,Atributos_otra,produccion,categoriaAdyacente,categoriaPrincipal,Mes,Certificado,Validacion

# Register your models here.
class SemilleroAdmin(admin.ModelAdmin):
	readonly_fields = ('id', 'created', 'updated')

class LineaAdmin(admin.ModelAdmin):
	readonly_fields = ('id', 'created', 'updated')

class IntegranteAdmin(admin.ModelAdmin):
	readonly_fields = ('created', 'updated')

admin.site.register(Semillero, SemilleroAdmin)
admin.site.register(Integrante, IntegranteAdmin)
admin.site.register(Linea, LineaAdmin)
admin.site.register(Career)
admin.site.register(LineaSemillero)
admin.site.register(Atributos)
admin.site.register(Atributos_otra)
admin.site.register(Rol)
admin.site.register(Participante2)
admin.site.register(coordinadores)
admin.site.register(categoriaAdyacente)
admin.site.register(categoriaPrincipal)
admin.site.register(produccion)
admin.site.register(Mes)
admin.site.register(Validacion)
admin.site.register(Certificado)