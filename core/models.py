from django.db import models

# Creamos el modelo grupo, para almacenar los grupos de investigación
# de la facultad.
class Grupo(models.Model):
    # Definimos tres campos con sus respectivos parametros
    id = models.PositiveSmallIntegerField(primary_key=True, verbose_name="Id")
    name = models.CharField(max_length=50, verbose_name="Nombre del grupo:", null=True)
    coordinator = models.CharField(max_length=50, verbose_name="Coordinador(a) del grupo", null=True)

    class Meta():
        verbose_name = "Grupo"
        verbose_name_plural = "Grupos"
        ordering = ["name"]

    def __str__(self):
        return self.name

# Creamos el modelo usuario, para almacenar los usuarios de la web.
class Usuario(models.Model):
    # Definimos los campos del modelo con sus respectivos parametros
    id = models.AutoField(primary_key=True, verbose_name="Id")
    username = models.CharField(max_length=50, verbose_name="Nombre de usuario:", null=True)
    password = models.CharField(max_length=50, verbose_name="Contraseña:", null=True)
    name = models.CharField(max_length=50, verbose_name="Nombre:", null=True)
    lastname = models.CharField(max_length=50, verbose_name="Apellidos::", null=True)
    email = models.EmailField(max_length=50, verbose_name="Correo electrónico:", null=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación", null=True)
    updated = models.DateTimeField(auto_now=True, verbose_name="Fecha de edición", null=True)

    # Asignamos un nombre a la tabla y ordenamos alfabeticamente por apellido.
    class Meta():
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ["lastname"]

    def __str__(self):
        return self.username

# Creamos el modelo noticia, para almacenar la información de las noticias 
# que aparecen en la pantalla de inicio.
class Noticia(models.Model):
    # Definimos los campos del modelo con sus respectivos parametros
    id = models.AutoField(primary_key=True, verbose_name="Id")
    title = models.CharField(max_length=200, verbose_name="Título", null=True)
    image = models.FileField(verbose_name="Imagen", null=True)
    banner = models.FileField(verbose_name="Banner", null=True)
    description = models.TextField(verbose_name="Descripción", null=True)
    content = models.TextField(verbose_name="Contenido de la noticia", null=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación", null=True)
    updated = models.DateTimeField(auto_now=True, verbose_name="Fecha de edición", null=True)

    # Asignamos un nombre a la tabla y ordenamos por ultima en ser creada     .
    class Meta():
        verbose_name = "Noticia"
        verbose_name_plural = "Noticias"
        ordering = ["-created"]

    def __str__(self):
        return self.title