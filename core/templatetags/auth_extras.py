from django import template
from create.models import coordinadores,Integrante,Participante2,Rol

register = template.Library()


@register.filter(name="is_admin")
def is_admin(user):
    return user.groups.filter(name='Administrator').exists()


@register.filter(name="is_coord")
def is_coord(user):
    return user.groups.filter(name='Coordinator').exists()

@register.filter(name="have_semilleros")
def have_semilleros(user):
    coordinador=coordinadores.objects.get(user=user)
    integrante=Integrante.objects.get(id=coordinador.Integrante.id)
    rol=Rol.objects.get(name="Coordinador de semillero")
    participante=Participante2.objects.filter(id_integrante=integrante.id,rol=rol)    
    if(participante.count()>1):
        return True
    else:
        return False 


@register.filter(name="have_info")
def have_info(semillero):
    if(semillero.mision and semillero.vision and semillero.goals and semillero.history):
        return True
    else:
        return False   