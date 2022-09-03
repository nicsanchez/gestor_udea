from django.db import models
from create.models import Semillero
from django.contrib.auth.models import User

# Creamos el modelo convocatoria
class Convocatoria(models.Model):
    # Definimos siete campos con sus respectivos parametros
    id = models.AutoField(primary_key=True, verbose_name="Id")
    name = models.CharField(max_length=100, verbose_name="Nombre de la convocatoria", null=True)
    description = models.TextField(max_length=400, verbose_name="Descripción", null=True)
    opened = models.DateField(verbose_name="Fecha de apertura", null=True)
    closed = models.DateField(verbose_name="Fecha de cierre", null=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación", null=True)
    updated = models.DateTimeField(auto_now=True, verbose_name="Fecha de edición", null=True)

    # Asignamos un nombre a la tabla y ordenamos por fecha de cierre
    class Meta():
        verbose_name = "Convocatoria"
        verbose_name_plural = "Convocatorias"
        ordering = ["closed"]

    # Definimos el parametro principal del modelo, por el cual lo identificaremos
    # en este caso es el nombre
    def __str__(self):
        return self.name

# Creamos el modelo documento
class Documento(models.Model):
    # Definimos siete campos con sus respectivos parametros
    id = models.AutoField(primary_key=True, verbose_name="Id")
    id_conv = models.ForeignKey(Convocatoria, null=True, blank=True, on_delete=models.CASCADE)
    documento = models.FileField(verbose_name="Documento", null=True)
    description = models.TextField(max_length=400, verbose_name="Descripción", null=True)
    tipo = models.PositiveSmallIntegerField(verbose_name="Tipo", null=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación", null=True)
    updated = models.DateTimeField(auto_now=True, verbose_name="Fecha de edición", null=True)

    # Asignamos un nombre a la tabla y agrupamos por convocatorias a las que pertenecen
    class Meta():
        verbose_name = "Documento"
        verbose_name_plural = "Documentos"
        ordering = ["id_conv"]

    # Definimos el parametro principal del modelo, por el cual lo identificaremos
    # en este caso es la descripción
    def __str__(self):
        return self.description

class Participante(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Id")
    id_convocatoria = models.ForeignKey(Convocatoria, null=True, blank=True, on_delete=models.CASCADE,verbose_name="Convocatoria")
    id_semillero = models.ForeignKey(Semillero, null=True, blank=True, on_delete=models.CASCADE,verbose_name="Semillero Participante")
    estado = models.CharField(max_length=10, verbose_name="Estado", null=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación", null=True)
    updated = models.DateTimeField(auto_now=True, verbose_name="Fecha de edición", null=True)

    class Meta():
        verbose_name = "Participante"
        verbose_name_plural = "Participantes"
        ordering = ["id"]

    def __str__(self):
        return self.id_semillero.name

class Documento_Adjunto(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Id")
    id_participante = models.ForeignKey(Participante, null=True, blank=True, on_delete=models.CASCADE,verbose_name="Participante")
    id_documento = models.ForeignKey(Documento, null=True, blank=True, on_delete=models.CASCADE,verbose_name="Documento del semillero")
    id_usuario = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE,verbose_name="Usuario")
    documento = models.FileField(verbose_name="Documento", null=True)
    comentarios = models.FileField(verbose_name="Comentarios", null=True)
    estado = models.CharField(max_length=100, verbose_name="Estado", null=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación", null=True)
    updated = models.DateTimeField(auto_now=True, verbose_name="Fecha de edición", null=True)

    class Meta():
        verbose_name = "Documento Adjunto"
        verbose_name_plural = "Documentos Adjuntos"
        ordering = ["id"]

    def __str__(self):
        return self.id_documento.description

class Proyectos(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Id")
    codigo = models.CharField(max_length=100, verbose_name="Codigo", null=True)
    estado = models.CharField(max_length=10, verbose_name="Estado", null=True)
    convocatoria = models.ForeignKey(Convocatoria, null=True, blank=True, on_delete=models.CASCADE)
    semillero = models.ForeignKey(Semillero, null=True, blank=True, on_delete=models.CASCADE)
    porcentaje = models.CharField(max_length=20, verbose_name="Porcentaje de avance", null=True)
    description = models.TextField(max_length=400, verbose_name="Descripción", null=True)
    start = models.DateField(verbose_name="Fecha de inicio", null=True)
    closed = models.DateField(verbose_name="Fecha de cierre", null=True)

    class Meta():
        verbose_name = "Proyecto"
        verbose_name_plural = "Proyectos"
        ordering = ["id"]

    def __str__(self):
        return self.codigo


#Tabla para los documentos o observaciones que el administrador adjunta al coordinador por sus reportes a un proyecto
class observaciones(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Id")
    description = models.TextField(max_length=400, verbose_name="Descripción", null=True)
    documento = models.FileField(verbose_name="Documento", null=True)

    class Meta():
        verbose_name = "Observacion"
        verbose_name_plural = "Observaciones a reporte"
        ordering = ["id"]

    def __str__(self):
        return str(self.id)        

#tabla para los reportes hechos por el usuario
class Documentos_proyecto(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Id")
    tipo = models.CharField(max_length=10, verbose_name="Tipo", null=True)
    proyecto = models.ForeignKey(Proyectos, null=True, blank=True, on_delete=models.CASCADE)
    documento = models.FileField(verbose_name="Documento", null=True)
    observaciones = models.ForeignKey(observaciones, null=True, blank=True, on_delete=models.CASCADE)

    class Meta():
        verbose_name = "Reporte"
        verbose_name_plural = "Reportes de proyecto"
        ordering = ["id"]

    def __str__(self):
        return self.proyecto.codigo

#tabla para los documentos del proyecto
class Documentos_proyecto_2(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="Id")
    proyecto = models.ForeignKey(Proyectos, null=True, blank=True, on_delete=models.CASCADE)
    description = models.TextField(max_length=400, verbose_name="Descripción", null=True)
    documento = models.FileField(verbose_name="Documento", null=True)
    
    class Meta():
        verbose_name = "Documento"
        verbose_name_plural = "Documentos de proyecto"
        ordering = ["id"]

    def __str__(self):
        return self.proyecto.codigo
