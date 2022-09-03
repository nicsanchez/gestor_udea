from django.shortcuts import render, redirect,HttpResponse
from .models import Convocatoria
from .models import Documento,Participante,Documento_Adjunto,Proyectos,Documentos_proyecto,Documentos_proyecto_2,observaciones
from create.models import coordinadores,Semillero
from core.models import Grupo
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
import os
import base64
from subprocess import call
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from django.template.loader import get_template

import datetime

#Controlador encargado de la creación de una convocatoria
def conv_create(request):

    if request.user.is_authenticated:
        if request.user.groups.filter(name="Administrador").exists():
            convocatorias = Convocatoria.objects.all()

            if request.method == "POST":

                estado = int(request.POST['estado'])

                if estado == 0:
                    name = request.POST['name']
                    description = request.POST['description']
                    opened = request.POST['opened']
                    closed = request.POST['closed']

                    insert = Convocatoria(name=name, description=description, opened=opened, closed=closed)
                    insert.save()

                    count = int(request.POST['contador'])
                    
                    for i in range(1,count+1):
                        id_conv = Convocatoria.objects.latest('id')
                        docs = request.POST
                        campos = request.FILES
                        documento = request.FILES['doc_' + str(i)]
                        tipo = request.POST['sel_' + str(i)]
                        description = request.POST['text_' + str(i)]

                        insert = Documento(id_conv=id_conv, tipo=tipo, description=description, documento=documento)
                        insert.save()

                elif estado == 1:
                    conv = Convocatoria.objects.get(id=request.POST['lista'])
                    conv.delete()

                else:                  
                    conv = Convocatoria.objects.get(id=request.POST['sName'])
                    id_conv = conv.id
                    name_conv = conv.name
                    description = request.POST['description']
                    opened = request.POST['opened']
                    closed = request.POST['closed']

                    insert = Convocatoria(id=id_conv, name=name_conv, description=description, opened=opened, closed=closed)
                    insert.save()

                    count = int(request.POST['contador'])

                    for i in range(1,count+1):
                        id_conv = Convocatoria.objects.latest('id')
                        documento = request.FILES['doc_' + str(i)]
                        tipo = request.POST['sel_' + str(i)]
                        description = request.POST['text_' + str(i)]

                        insert = Documento(id_conv=id_conv, tipo=tipo, description=description, documento=documento)
                        insert.save()

            today = datetime.datetime.now().strftime("%Y-%m-%d")

            return render(request, "conv/convocatoria.html",{'today':today,'convocatorias':convocatorias})

    return redirect('/')

#Controlador encargado de retornar los detalles generales de una convocatoria
def conv_details(request, id_item=None):
    grupos = Grupo.objects.all()
    today = datetime.datetime.now()
    item = Convocatoria.objects.get(id=id_item)
    inf_documents = Documento.objects.filter(id_conv=id_item,tipo=1)
    opc_documents = Documento.objects.filter(id_conv=id_item,tipo=2)
    obl_documents = Documento.objects.filter(id_conv=id_item,tipo=3)
    participantes = Participante.objects.filter(id_convocatoria=id_item)

    if request.method == "POST":

        if(request.POST["caso"]=="send-email"):
            id_semillero = request.POST["id"]
            semillero = Semillero.objects.get(id=id_semillero)
            email_destino = semillero.coordinador.email
            mensaje = 'Sr Coordinador, ya revisé los documentos adjuntos a la convocatoria, favor revisar.'
            asunto = "Revision de documentos adjuntos"
            generate_mail(email_destino,mensaje,asunto)
            return HttpResponse("1")
        else:    
            #Insert de la participacion del semilero escogido por el usuario
            id_semillero = coordinadores.objects.get(user=request.user).id_semillero
            semillero = Semillero.objects.get(id=int(id_semillero))

            try:
                participante = Participante.objects.get(id_convocatoria=item,id_semillero=semillero)
                mensaje = "El semillero ya está participando en la convocatoria."
                mensaje1 = "Error"
                return render(request, "conv/details.html",{'participantes':participantes,'grupos':grupos,'item':item,'inf_documents':inf_documents,'opc_documents':opc_documents,'obl_documents':obl_documents,'today':today,"mensaje":mensaje,"mensaje1":mensaje1,'semillero':semillero})
            except:
                if (len(obl_documents)==0 and len(opc_documents)==0):
                    insert = Participante(id_convocatoria=item,id_semillero=semillero,estado="1")
                else:
                    insert = Participante(id_convocatoria=item,id_semillero=semillero,estado="0")
                insert.save()
                #Insert de los documentos obligatorios adjuntos por el coordinador de semillero
                participante = Participante.objects.latest("id")
                for obl_document in obl_documents:
                    try:
                        document = request.FILES[str(obl_document.id)]
                        insert = Documento_Adjunto(id_participante=participante,id_documento=obl_document,documento=document,estado="0")
                        insert.save()
                    except:
                        continue

                for opc_document in opc_documents:
                    try:
                        document = request.FILES[str(opc_document.id)]
                        insert = Documento_Adjunto(id_participante=participante,id_documento=opc_document,documento=document,estado="0")
                        insert.save()
                    except:
                        continue
                #Generacion Comprobante
                retorno=os.getcwd()
                os.chdir("./pdf_files/inscripcion")
                nombre = item.name
                id_par = participante.id
                semillero = participante.id_semillero.name 
                coord = participante.id_semillero.coordinador.name + " " + participante.id_semillero.coordinador.lastname
                grupo = participante.id_semillero.id_group.name
                generate_comprobante(nombre,id_par,semillero,coord,grupo)
                with open("Comprobante.pdf", "rb") as pdf_file:
                    encoded_string = base64.b64encode(pdf_file.read())
                    comprobante=str(encoded_string)
                    comprobante=comprobante.replace("b'","")
                    comprobante=comprobante.replace("'","")
                mensaje = "El semillero fue registrado en la convocatoria."
                mensaje1 = "Exito"

                asunto = "Registro exitoso" 
                mensaje_mail = "Sr Coordinador, se ha registrado el semillero: "+semillero+" a la convocatoria: "+item.name+", con el numero: "+str(id_par)+", a continuacion se adjunta el comprobante. Muchas gracias."
                destinatario = participante.id_semillero.coordinador.email
                generate_mail(destinatario,mensaje_mail,asunto,"1")
                mensaje_mail = "Sr Administrador, se ha registrado el semillero: "+semillero+" a la convocatoria: "+item.name+", con el numero: "+str(id_par)+", a continuacion se adjunta el comprobante. Muchas gracias."
                destinatario = settings.EMAIL_HOST_USER
                generate_mail(destinatario,mensaje_mail,asunto,"1")
                delete_pdf_files("Comprobante")
                os.chdir(retorno)
                id_semillero = coordinadores.objects.get(user=request.user).id_semillero
                semillero = Semillero.objects.get(id=int(id_semillero))
                
                return render(request, "conv/details.html",{'participantes':participantes,'grupos':grupos,'item':item,'inf_documents':inf_documents,'opc_documents':opc_documents,'obl_documents':obl_documents,'today':today,"mensaje":mensaje,"mensaje1":mensaje1,"comprobante":comprobante,'semillero':semillero})

    try:
        id_semillero = coordinadores.objects.get(user=request.user).id_semillero
        semillero = Semillero.objects.get(id=int(id_semillero))
        participante = Participante.objects.get(id_convocatoria=item,id_semillero=semillero)
        return render(request, "conv/details.html",{'participantes':participantes,'grupos':grupos,'item':item,'inf_documents':inf_documents,'opc_documents':opc_documents,
            'obl_documents':obl_documents,'today':today,'semillero':semillero})
    except :
        if request.user.groups.filter(name="Coordinador").exists():
            return render(request, "conv/details.html",{'participantes':participantes,'grupos':grupos,'item':item,'inf_documents':inf_documents,'opc_documents':opc_documents,'obl_documents':obl_documents,'today':today,'participando':"false",'semillero':semillero})
        else:    
            return render(request, "conv/details.html",{'participantes':participantes,'grupos':grupos,'item':item,'inf_documents':inf_documents,'opc_documents':opc_documents,'obl_documents':obl_documents,'today':today,'participando':"false"})

#Controlador encargado de la participación de un semillero en una convocatoria
def participar(request):
    if request.method == "POST":
        estado = int(request.POST['estado'])
        if estado == 0:
            name = request.POST['name']
            description = request.POST['description']
            opened = request.POST['opened']
            closed = request.POST['closed']
            insert = Convocatoria(name=name, description=description, opened=opened, closed=closed)
            insert.save()
            count = int(request.POST['contador'])
            for i in range(1,count+1):
                try:
                    convocatoria=Convocatoria.objects.latest('id')
                    tipo = request.POST['sel_' + str(i)]
                    description = request.POST['text_' + str(i)]
                    try:
                        documento = request.FILES['doc_' + str(i)]
                        insert = Documento(id_conv=convocatoria, tipo=tipo, description=description, documento=documento)
                        insert.save()
                    except:
                        insert = Documento(id_conv=convocatoria, tipo=tipo, description=description)
                        insert.save()
                except:
                    continue                    
        elif estado == 1:
            conv = Convocatoria.objects.get(id=request.POST['conv'])
            conv.delete()

    today = datetime.datetime.now()
    convocatorias = Convocatoria.objects.all()
    if request.user.groups.filter(name="Coordinador").exists():
        id_semillero = coordinadores.objects.get(user=request.user).id_semillero
        semillero = Semillero.objects.get(id=int(id_semillero))
        participaciones = Participante.objects.filter(id_semillero=semillero)
        return render(request, "conv/participate.html",{'semillero':semillero,'convocatorias':convocatorias,'today':today,'participaciones':participaciones})    
    else:
        return render(request, "conv/participate.html",{'convocatorias':convocatorias,'today':today})

#Controlador encargado de la edición de una convocatoria
def convocatoria_edit(request, id=None):

    if request.user.is_authenticated:

        if request.user.groups.filter(name="Administrador").exists():

            convocatoria = Convocatoria.objects.get(id=id)
            documentos = Documento.objects.filter(id_conv=id)

            if request.method == "POST":
                if request.POST['caso'] == "eliminar":
                    id = request.POST['id']
                    documento = Documento.objects.get(id=id)
                    documento.delete()

                elif request.POST['caso'] == "editar":   
                    name = request.POST['name']
                    description = request.POST['description']
                    opened = request.POST['opened']
                    closed = request.POST['closed']
                    insert = Convocatoria(id=id, name=name, description=description,opened=opened, closed=closed)
                    insert.save()
                    count = int(request.POST['contador'])
                    for i in range(1,count+1):
                        try:
                            convocatoria=Convocatoria.objects.get(id=id)
                            tipo = request.POST['sel_' + str(i)]
                            description = request.POST['text_' + str(i)]
                            try:
                                documento = request.FILES['doc_' + str(i)]
                                insert = Documento(id_conv=convocatoria, tipo=tipo, description=description, documento=documento)
                                insert.save()
                            except:
                                insert = Documento(id_conv=convocatoria, tipo=tipo, description=description)
                                insert.save()
                        except:
                            continue

                return redirect('participar')

            return render(request, "conv/convocatoria_edit.html",{'convocatoria': convocatoria,'documentos':documentos})

    return redirect('/')

#Controlador encargado de la vista que muestra con detalle los adjuntos realizados por un coordinador de un semillero participante en una convocatoria
def adjuntos(request, id, id_conv):
    if request.user.groups.filter(name="Administrador").exists() or request.user.groups.filter(name="Coordinador").exists():
        convocatoria = Convocatoria.objects.get(id=id_conv)
        semillero = Semillero.objects.get(id=id)
        participante = Participante.objects.get(id_convocatoria=convocatoria,id_semillero=semillero)
        documentos = Documento_Adjunto.objects.filter(id_participante=participante)
        if request.method == "POST":
            #Envio de Email al coordinador del semillero de revision finalizada
            if(request.POST["caso"]=="send-email"):
                id_semillero = request.POST["id"]
                semillero = Semillero.objects.get(id=id_semillero)
                email_destino = semillero.coordinador.email
                mensaje = 'Sr Coordinador, ya revisé los documentos adjuntos a la convocatoria, favor revisar.'
                asunto = "Revision de documentos adjuntos"
                generate_mail(email_destino,mensaje,asunto)
                return HttpResponse("1");
            else:    
                if request.POST["caso"]=="1":
                    id_d = request.POST["id_d"]
                    original = Documento_Adjunto.objects.get(id=id_d)
                    documento = request.FILES["doc"]
                    original.estado=0
                    original.documento=documento
                    original.save(update_fields=["estado","documento"])

                elif request.POST["caso"]=="0":
                    id_c= request.POST["id_c"]
                    estado = request.POST["state_"+str(id_c)]
                    if(estado=="1"):
                        comentarios=""
                    elif(estado=="2"):
                        comentarios = request.FILES["comment_"+str(id_c)]
                    documento = Documento_Adjunto.objects.get(id=id_c)
                    documento.comentarios=comentarios
                    documento.estado=estado
                    documento.id_usuario=request.user
                    if(comentarios==""):
                        documento.save(update_fields=["estado","id_usuario"])
                    else:    
                        documento.save(update_fields=["comentarios","estado","id_usuario"])

                documentos = Documento_Adjunto.objects.filter(id_participante=participante)
                var = 0
                for documento in documentos:
                    if(documento.estado=="0" or documento.estado=="2"):
                        var = 1
                participante = Participante.objects.get(id_convocatoria=convocatoria,id_semillero=semillero)
                
                if var == 0:
                    participante.estado="1"
                else:
                    if request.POST["caso"]=="1":
                        participante.estado="2"
                    elif request.POST["caso"]=="0":    
                        participante.estado="3"

                participante.save(update_fields=["estado"])
        if request.user.groups.filter(name="Administrador").exists():
            return render(request, "conv/adjuntos.html",{'documentos':documentos,'id':id,'id_conv':id_conv})
        else:            
            coordinador = coordinadores.objects.get(user=request.user)
            semillero = Semillero.objects.get(id=int(coordinador.id_semillero))
            return render(request, "conv/adjuntos.html",{'documentos':documentos,'id':id,'id_conv':id_conv,'semillero':semillero})

    return redirect('/')

#Controlador encargado de la generación de reportes por parte de un coordinador, luego de que oprime la opción de generar reporte se genera el pdf mediante latex y se almacena en la base de datos
def reportar(request,id):
    if request.user.groups.filter(name="Coordinador").exists():
        id_semillero = coordinadores.objects.get(user=request.user).id_semillero
        semillero = Semillero.objects.get(id=int(id_semillero))
        try:
            proyecto = Proyectos.objects.get(id=id,semillero=semillero)
            if(proyecto.estado == '1'):
                if request.method == "POST":
                    actividades = request.POST["actividades"].replace('\n','\\\\')
                    comprom_cump = request.POST["compro_cum"].replace('\n','\\\\')
                    comprom_pend = request.POST["compro_pen"].replace('\n','\\\\')
                    progreso = request.POST["progreso"]
                    codigo = proyecto.codigo
                    if int(progreso) == 100:
                        tipo = "2"
                        cadena = "final"
                    else:
                        tipo = "1"
                        cadena = "de avance"
                    convocatoria = proyecto.convocatoria.name
                    semillero = proyecto.semillero.name
                    grupo = proyecto.semillero.id_group.name
                    coordinador = proyecto.semillero.coordinador.name + " " +proyecto.semillero.coordinador.lastname 
                    retorno=os.getcwd()
                    os.chdir("./pdf_files/reportes")
                    generate_reporte(codigo,convocatoria,semillero,grupo,coordinador,actividades,comprom_cump,comprom_pend,progreso)
                    if(request.POST["caso"]=="0"):
                        with open("Reporte.pdf", "rb") as file_encoded:
                            encoded_string = base64.b64encode(file_encoded.read())
                        documento = ContentFile(base64.b64decode(encoded_string), name='reporte.pdf')
                        insert = Documentos_proyecto(tipo=tipo,proyecto=proyecto,documento=documento)
                        insert.save()
                        delete_pdf_files("Reporte")
                        os.chdir(retorno)
                        proyecto.porcentaje=progreso
                        proyecto.save(update_fields=['porcentaje'])
                        email_destino = settings.EMAIL_HOST_USER
                        mensaje = 'Sr Administrador, se ha generado un nuevo reporte '+cadena+' por el coordinador del semillero: '+semillero+' a cargo del proyecto: '+str(proyecto.codigo)+ ' favor revisarlo.'
                        asunto = "Nuevo reporte generado"
                        generate_mail(email_destino,mensaje,asunto)

                        mensaje = "Se ha agregado el reporte exitosamente."
                        mensaje1 = "Exito"

                        return render(request, "conv/reporte.html",{'mensaje':mensaje,'mensaje1':mensaje1,'semillero':semillero})    
                    elif(request.POST['caso'] == "1"):
                        with open("Reporte.pdf", "rb") as pdf_file:
                            encoded_string = base64.b64encode(pdf_file.read())
                            reporte=str(encoded_string)
                            reporte=reporte.replace("b'","")
                            reporte=reporte.replace("'","")                            
                        delete_pdf_files("Reporte")
                        os.chdir(retorno)
                        return HttpResponse(reporte)                    

                return render(request, "conv/reporte.html",{'proyecto':proyecto,'semillero':semillero})
            elif(proyecto.estado == '0'):
                return redirect('/proyectos')        
        except:
            return redirect('/proyectos')
    else:
        return redirect('/proyectos')

#Controlador encargado de retornar los proyectos a un admin cuyo rol tiene el poder de cerrar o reabrir un proyecto
def proyectos(request):
    if request.user.groups.filter(name="Administrador").exists():
        if request.method == 'POST':
            if request.POST['caso']=="cerrar":
                id=request.POST['id']
                proyecto = Proyectos.objects.get(id=id)
                proyecto.estado=0
                proyecto.save(update_fields=['estado'])
            
            elif request.POST["caso"]=="reabrir":
                id=request.POST['id']
                proyecto = Proyectos.objects.get(id=id)
                proyecto.estado=1
                proyecto.save(update_fields=['estado'])
                
        proyectos = Proyectos.objects.all()
        return render(request, "conv/proyectos.html",{'proyectos':proyectos})

    elif request.user.groups.filter(name="Coordinador").exists():
        id_semillero = coordinadores.objects.get(user=request.user).id_semillero
        semillero = Semillero.objects.get(id=int(id_semillero))
        proyectos = Proyectos.objects.filter(semillero=semillero)
        return render(request, "conv/proyectos.html",{'proyectos':proyectos,'semillero':semillero})
    else:
        return redirect('/')

#Controlador asociado a la asignación de proyectos por parte del administrador
def asignar_proyecto(request,id,id_conv):
    if request.user.groups.filter(name="Administrador").exists():
        convocatoria = Convocatoria.objects.get(id=id_conv)
        semillero = Semillero.objects.get(id=id)
        if request.method == "POST":
            try:
                codigo = request.POST["codigo"]
                proyecto = Proyectos.objects.get(codigo=codigo)
                mensaje = "Ya existe un proyecto con el codigo ingresado."
                mensaje1 = "Error"
                return render(request, "conv/asignar_proyecto.html",{'mensaje':mensaje,'mensaje1':mensaje1})
            except:    
                codigo = request.POST["codigo"]
                porcentaje = 0
                descripcion = request.POST["description"]
                start = request.POST["start"]
                closed = request.POST["closed"]
                insert = Proyectos(codigo=codigo,convocatoria=convocatoria,semillero=semillero,porcentaje=porcentaje,description=descripcion,estado="1",start=start,closed=closed)
                insert.save()
                count = int(request.POST['contador'])
                for i in range(1,count+1):
                    try:
                        proyecto=Proyectos.objects.latest('id')
                        description = request.POST['text_' + str(i)]
                        try:
                            documento = request.FILES['doc_' + str(i)]
                            insert = Documentos_proyecto_2(proyecto=proyecto, documento=documento, description=description)
                            insert.save()
                        except:
                            insert = Documentos_proyecto_2(proyecto=proyecto, description=description)
                            insert.save()
                    except:
                        continue

                mensaje1 = "Exito"
                mensaje = "Proyecto creado exitosamente."
                return render(request, "conv/asignar_proyecto.html",{'mensaje':mensaje,'mensaje1':mensaje1})

        return render(request, "conv/asignar_proyecto.html",{'convocatoria':convocatoria,'semillero':semillero})     

    return redirect('/')

#Controlador encargado de traer la vista y detalles de los reportes para dos roles diferentes
def reportes(request,id):
    if request.user.groups.filter(name="Administrador").exists():
        proyecto = Proyectos.objects.get(id=id)
        reportes = Documentos_proyecto.objects.filter(proyecto=proyecto)
        if request.method=="POST":
            id_d = request.POST["id_d"]
            reporte = Documentos_proyecto.objects.get(id=id_d)
            descripcion = request.POST["descripcion"]
            try:
                documento=request.FILES["doc"]
                insert = observaciones(documento=documento,description=descripcion)
                insert.save()
            except:
                insert = observaciones(description=descripcion)
                insert.save()
            
            if(reporte.tipo == "1"):
                tipo="de avance"
            elif(reporte.tipo == "2"):
                tipo="final"
            
            semillero = str(proyecto.semillero.name)
            mensaje = "Sr Coordinador, se han revisado el reporte "+tipo+" adjunto al proyecto "+str(proyecto.codigo)+" a cargo del semillero "+semillero+", porfavor revisarlo en el sistema. Muchas Gracias"
            email_destino = proyecto.semillero.coordinador.email
            asunto = "Revision de reporte"
            generate_mail(email_destino,mensaje,asunto)

            observacion = observaciones.objects.latest('id')
            reporte.observaciones = observacion
            reporte.save(update_fields=["observaciones"])

        return render(request, "conv/reportes.html",{'reportes':reportes})     
    elif request.user.groups.filter(name="Coordinador").exists():
        id_semillero = coordinadores.objects.get(user=request.user).id_semillero
        semillero = Semillero.objects.get(id=int(id_semillero))
        try:
            if request.method == "POST":
                id = request.POST["id_d"]
                reporte = Documentos_proyecto.objects.get(id=id)
                reporte.documento = request.FILES["doc"]
                reporte.save(update_fields=["documento"])
                return redirect("/proyectos")

            proyecto = Proyectos.objects.get(id=id,semillero=semillero)
            reportes = Documentos_proyecto.objects.filter(proyecto=proyecto)
            return render(request, "conv/reportes.html",{'reportes':reportes,'semillero':semillero})     
        except:
            return redirect('/')
    else:
        return redirect('/')

#Controlador encargado de retornar los detalles generales de un proyecto
def proyecto_details(request, id_item=None):
    if request.user.is_authenticated:
        item = Proyectos.objects.get(id=id_item)
        documentos = Documentos_proyecto_2.objects.filter(proyecto=id_item)
        if request.user.groups.filter(name="Coordinador").exists():
            coordinador = coordinadores.objects.get(user=request.user)
            semillero = Semillero.objects.get(id=int(coordinador.id_semillero))
            return render(request, "conv/proyectos_details.html",{'item':item,'documentos':documentos,'semillero':semillero})
        else:
            return render(request, "conv/proyectos_details.html",{'item':item,'documentos':documentos})
    else:
        return redirect('/')

#Controlador de la vista de edición de proyectos
def proyecto_edit(request, id):
    if request.user.is_authenticated:
        if request.user.groups.filter(name="Administrador").exists():
            proyecto = Proyectos.objects.get(id=id)
            documentos = Documentos_proyecto_2.objects.filter(proyecto=proyecto)
            if request.method=="POST":
                #Si se desea eliminar un proyecto
                if request.POST['caso'] == "eliminar":
                    id = request.POST['id']
                    documento = Documentos_proyecto_2.objects.get(id=id)
                    documento.delete()
                #Si se desea editar un proyecto    
                elif request.POST['caso'] == "editar":   
                    codigo = request.POST['codigo']
                    description = request.POST['description']
                    start = request.POST['start']
                    closed = request.POST['closed']
                    proyecto=Proyectos.objects.get(id=id)
                    proyecto.codigo=codigo
                    proyecto.description=description
                    proyecto.start=start
                    proyecto.closed=closed
                    proyecto.save(update_fields=["codigo","description","start","closed"])
                    count = int(request.POST['contador'])
                    #Se agregan todos los documentos nuevos agregados al proyecto
                    for i in range(1,count+1):
                        try:
                            convocatoria=Convocatoria.objects.get(id=id)
                            description = request.POST['text_' + str(i)]
                            try:
                                documento = request.FILES['doc_' + str(i)]
                                insert = Documentos_proyecto_2(proyecto=proyecto, description=description, documento=documento)
                                insert.save()
                            except:
                                insert = Documentos_proyecto_2(proyecto=proyecto, description=description)
                                insert.save()
                        except:
                            continue 

                    return redirect('proyectos')         

            return render(request, "conv/proyecto_edit.html",{'proyecto':proyecto,'documentos':documentos})
        else:
            return redirect('/')                
    else:
        return redirect('/')        

#Función encargada de eliminar los archivos generados por latex, luego de generar un pdf
def delete_pdf_files(name):
    os.remove(name+".aux")
    os.remove(name+".log")
    os.remove(name+".pdf")
    os.remove("vars.tex")

#Funcion encargada de generar el comprobante de inscripción de un semillero en una convocatoria 
def generate_comprobante(name,id,semillero,coord,grupo):
    template="plantilla_vars.tex"
    with open(template,'r') as f:
        archivo=f.read()
    archivo=archivo.replace('conv-name',name)
    archivo=archivo.replace('id-part-conv',str(id))
    archivo=archivo.replace('name-part-conv',semillero)
    archivo=archivo.replace('coord-part-con',coord)
    archivo=archivo.replace('group-part-conv',grupo)

    with open ("vars.tex",'w') as h:
        h.write(archivo)
    d=os.getcwd()
    call("xelatex -jobname=Comprobante "+d+"/plantilla.tex",shell=1)

#Funcion encargada de generar reporte de un proyecto
def generate_reporte(codigo,conv,semi,gru,coord,act_des,act_cum,act_pen,porcen):
    template="plantilla_vars.tex"
    with open(template,'r') as f:
        archivo=f.read()
    archivo=archivo.replace('codi-proy',codigo)
    archivo=archivo.replace('conv-proy',conv)
    archivo=archivo.replace('semi-proy',semi)
    archivo=archivo.replace('gru-proy',gru)
    archivo=archivo.replace('coord-proy',coord)
    archivo=archivo.replace('act-des-proy',act_des)
    archivo=archivo.replace('act-cump-proy',act_cum)
    archivo=archivo.replace('act-pen-proy',act_pen)
    archivo=archivo.replace('porcen-proy',str(porcen))

    with open ("vars.tex",'w') as h:
        h.write(archivo)
    d=os.getcwd()
    call("xelatex -jobname=Reporte "+d+"/plantilla.tex",shell=1)
    
#Funcion encargada de enviar correos usando una plantilla.    
def generate_mail(destinatario,mensaje,asunto,file=None):
    context = {"mensaje":mensaje}
    template = get_template("./conv/email_layout.html")
    content = template.render(context)

    message = EmailMultiAlternatives(asunto,"",settings.EMAIL_HOST_USER,[destinatario])
    message.attach_alternative(content, 'text/html')
    if(file != None):
        message.attach_file('Comprobante.pdf')
    message.send()