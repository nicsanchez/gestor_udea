function abrir(id) {
    var file = document.getElementById(id);
    file.dispatchEvent(new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    }));
}
function texto(elem, id_text) {
    var texts = document.getElementById(id_text);
    if(elem.files.length != 0) {
        texts.innerText = elem.files[0].name;
    }
}

if ( window.history.replaceState ) {
    window.history.replaceState( null, null, window.location.href );
}

function cerrar(id){
    caso="cerrar"
    $.confirm({
        boxWidth: '400px',
        useBootstrap: false,
        closeIcon: true,
        title: '¿Está seguro?',
        content: 'Esta tratando de cerrar el proyecto, el coordinador a cargo no podrá realizar mas reportes.',
        typeAnimated: true,
        buttons: {
            somethingElse: {
                text: 'Seguro',
                btnClass: 'btn-warning',
                action: function(){
                    var caso = "cerrar"
                    let url = window.location;
                    const postData={
                        'id': id,
                        'caso': caso,
                        csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
                    };
                    $.post(url, postData, function(response){
                        window.location.reload()
                    });
                }
            },
            cancelar: function () {
            }
        }
    });
}

function reabrir(id){
    $.confirm({
        boxWidth: '400px',
        useBootstrap: false,
        closeIcon: true,
        title: '¿Está seguro?',
        content: 'Esta tratando de abrir de nuevo el proyecto, el coordinador a cargo podrá realizar reportes.',
        typeAnimated: true,
        buttons: {
            somethingElse: {
                text: 'Seguro',
                btnClass: 'btn-warning',
                action: function(){
                    var caso = "reabrir"
                    let url = window.location;
                    const postData={
                        'id': id,
                        'caso': caso,
                        csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
                    };
                    $.post(url, postData, function(response){
                        window.location.reload()
                    });
                }
            },
            cancelar: function () {
            }
        }
    });
}


function modify(id){
    window.event.preventDefault();
    $(".modificar").show();
    elemento = $("#documento_"+id).html();
    $("#nombre").children().last().remove()
    $("#nombre").append(elemento);
    $("#id_d").val(id);
    $("#f2 #caso").val("1");
}

function send(id){
    window.event.preventDefault();
    if($('#comment_'+id).val()===""){
        var comentarios = "";
    }
    else{
        var comentarios = $('#comment_'+id).prop("files")[0].name;
    }
    estado = $('#state_'+id).val();
    if((comentarios!="" && estado)||(estado==1)){
        $.confirm({
            boxWidth: '400px',
            useBootstrap: false,
            closeIcon: true,
            title: 'Está seguro',
            content: '¿Esta seguro de la revision realizada al documento?.',
            typeAnimated: true,
            buttons: {
                somethingElse: {
                    text: 'Seguro',
                    btnClass: 'btn-warning',
                    action: function(){
                        $("#id_c").val(id);
                        $("#caso").val("0");
                        $("#f1").submit();
                    }
                },
                cancelar: function () {
                }
            }
        });
    }
    else{
        if(comentarios!=""){
            var title1="Estado incompleto";
            var content1="Porfavor seleccione el estado del documento.";
        }
        else{
            var title1="Sin comentarios";
            var content1="Porfavor adjunte los comentarios realizados al documento.";
        }
        $.alert({
            boxWidth: '400px',
            useBootstrap: false,
            closeIcon: true,
            title: title1,
            content: content1,
            typeAnimated: true,
            buttons: {
                somethingElse: {
                    text: 'Ok',
                    btnClass: 'btn-warning',
                    action: function(){
                    }
                }
            }
        });
    }

}

function delete1(id, caso) {
    window.event.preventDefault();
    if(caso == "1"){
        //Seleccionamos Fila a eliminar de la tabla
        var fila = $('#tr_'+id);
        fila.remove();
    }
    else if(caso == "2"){
        $.confirm({
            boxWidth: '400px',
            useBootstrap: false,
            closeIcon: true,
            title: '¿Está seguro?',
            content: 'El documento no podra ser restaurado',
            typeAnimated: true,
            buttons: {
                somethingElse: {
                    text: 'Seguro',
                    btnClass: 'btn-warning',
                    action: function(){
                        var caso = "eliminar"
                        //Url donde esté, por ende la consulta se hace dependiendo de donde esté el navegador ya sea editando o creando
                        let url = window.location;
                        const postData={
                            'id': id,
                            'caso': caso,
                            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
                        };
                        $.post(url, postData, function(response){
                            window.location.reload()
                        });
                    }
                },
                cancelar: function () {
                }
            }
        });
    }
    else if(caso == "3"){
        $.confirm({
            boxWidth: '400px',
            useBootstrap: false,
            closeIcon: true,
            title: '¿Está seguro?',
            content: 'La convocatoria no podra ser restaurada',
            typeAnimated: true,
            buttons: {
                somethingElse: {
                    text: 'Seguro',
                    btnClass: 'btn-warning',
                    action: function(){
                        let url = window.location;
                        const postData={
                            'conv': id,
                            'estado': 1,
                            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
                        };
                        $.post(url, postData, function(response){
                            window.location.reload()
                        });
                    }
                },
                cancelar: function () {
                }
            }
        });
    }
};

function send_mail(id){
    $.confirm({
        boxWidth: '400px',
        useBootstrap: false,
        closeIcon: true,
        title: '¿Está seguro?',
        content: 'Esta tratando de enviar un correo electronico al coordinador notificandole que la revision fue realizada.',
        typeAnimated: true,
        buttons: {
            somethingElse: {
                text: 'Seguro',
                btnClass: 'btn-warning',
                action: function(){
                    var caso = "send-email"
                    let url = window.location;
                    const postData={
                        'id': id,
                        'caso': caso,
                        csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
                    };
                    $.post(url, postData, function(response){
                        $.alert({
                            boxWidth: '400px',
                            useBootstrap: false,
                            closeIcon: true,
                            title: 'Envio exitoso',
                            content: 'Se ha notificado al coordinador que la revision ha sido realizada.',
                            typeAnimated: true,
                            buttons: {
                                somethingElse: {
                                    text: 'Ok',
                                    btnClass: 'btn-warning',
                                    action: function(){
                                        window.location = window.location;
                                    }
                                },
                            }
                        });
                    });
                }
            },
            cancelar: function () {
            }
        }
    });
}

$(document).ready(function(){
    
    jQuery.extend(jQuery.validator.messages, {
        required: "Este campo es obligatorio.",
        remote: "Por favor, rellena este campo.",
        email: "Por favor, escribe una dirección de correo válida",
        url: "Por favor, escribe una URL válida.",
        date: "Por favor, escribe una fecha válida.",
        dateISO: "Por favor, escribe una fecha (ISO) válida.",
        number: "Por favor, escribe un número entero válido.",
        digits: "Por favor, escribe sólo dígitos.",
        creditcard: "Por favor, escribe un número de tarjeta válido.",
        equalTo: "Por favor, escribe el mismo valor de nuevo.",
        accept: "Por favor, escribe un valor con una extensión aceptada.",
        maxlength: jQuery.validator.format("Por favor, no escribas más de {0} caracteres."),
        minlength: jQuery.validator.format("Por favor, no escribas menos de {0} caracteres."),
        rangelength: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1} caracteres."),
        range: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1}."),
        max: jQuery.validator.format("Por favor, escribe un valor menor o igual a {0}."),
        min: jQuery.validator.format("Por favor, escribe un valor mayor o igual a {0}.")
      });
      
    var count = 1;
    $('#contador').val(count-1);

    $(".modificar").hide();
    $('.Crear').hide();
    $('#mis_convocatorias').hide();
    
    $('#see1').click(function(e){
        e.preventDefault();
        $('.h1').html('Convocatorias');
        $('.Mostrar').show();
        $('#mis_convocatorias').hide();
    });

    $('#see2').click(function(e){
        e.preventDefault();
        $('.h1').html('Mis convocatorias');
        $('.Mostrar').hide();
        $('#mis_convocatorias').show();
    });

    $('#see').click(function(e){
        e.preventDefault();
        $('.h1').html('Convocatorias');
        $('.Mostrar').show();
        $('#textSearch').show();
        $('.Crear').hide();
        $('.Convocatorias').hide();
    });
    
    $('#add').click(function(e){
        e.preventDefault();
        $('.h1').html('Crear una convocatoria');
        $('#textSearch').hide();
        $('.Mostrar').hide();
        $('.Crear').show();
        $('#estado').val(0)
    });

    //Validación para formulario editar convocatoria
    $('#enviar_editar').click(function(e){
        e.preventDefault();
        if($('#editForm').valid()){
            $.confirm({
                boxWidth: '400px',
                useBootstrap: false,
                closeIcon: true,
                title: '¿Está seguro?',
                content: 'Ha realizado cambios a una convocatoria',
                typeAnimated: true,
                buttons: {
                    somethingElse: {
                        text: 'Seguro',
                        btnClass: 'btn-warning',
                        action: function(){
                            $('form').submit();
                        }
                    },
                    cancelar: function () {
    
                    }
                }
            });
        }
    });
    
    //Formulario enviar reporte
    $('#enviar_reporte').click(function(e){
        e.preventDefault();
        if($('form').valid()){
            $.confirm({
                boxWidth: '400px',
                useBootstrap: false,
                closeIcon: true,
                title: '¿Está seguro?',
                content: 'El reporte no podrá ser modificado. Puede visualizar el reporte antes de enviarlo en caso de error.',
                typeAnimated: true,
                buttons: {
                    somethingElse: {
                        text: 'Seguro',
                        btnClass: 'btn-warning',
                        action: function(){
                            $('form').submit();
                        }
                    },
                    cancelar: function () {

                    }
                }
            });
        }    
    });

    $('#enviar').click(function(e){
        e.preventDefault();
        var obligatorios = $('.obligatorio');
        var enviar=1;
        obligatorios.each(function(){
            if($(this).val()==""){
                enviar=0;
            }
        });

        if(enviar==1){
            $.confirm({
                boxWidth: '400px',
                useBootstrap: false,
                closeIcon: true,
                title: '¿Está seguro?',
                content: 'Esta intentando participar en una convocatoria',
                typeAnimated: true,
                buttons: {
                    somethingElse: {
                        text: 'Seguro',
                        btnClass: 'btn-warning',
                        action: function(){
                            $('form').submit();
                        }
                    },
                    cancelar: function () {

                    }
                }
            });
        }
        else{
            $.alert({
                boxWidth: '400px',
                useBootstrap: false,
                closeIcon: true,
                title: 'Error',
                content: 'Debe adjuntar todos los archivos obligatorios.',
                typeAnimated: true,
                buttons: {
                    somethingElse: {
                        text: 'Ok',
                        btnClass: 'btn-warning',
                        action: function(){
                        }
                    },
                }
            });
        }
        //console.log($('.obligatorio'));
            /*$.confirm({
                boxWidth: '400px',
                useBootstrap: false,
                closeIcon: true,
                title: '¿Está seguro?',
                content: 'La convocatoria no podra ser restaurada',
                typeAnimated: true,
                buttons: {
                    somethingElse: {
                        text: 'Seguro',
                        btnClass: 'btn-warning',
                        action: function(){
                            $('form').submit();
                        }
                    },
                    cancelar: function () {

                    }
                }
            });*/
    });

    $('#visualizar_reporte').click(function(e){
        //Se debe generar reporte aqui
        e.preventDefault();
        if($('form').valid()){
            var porcentaje = $("#progreso").val();
            var actividades = $("#actividades").val();
            var compro_cum = $("#compro_cum").val();
            var compro_pen = $("#compro_pen").val();
            if(actividades==""){
                actividades="Campo vacio";
            }
            if(compro_cum==""){
                compro_cum="Campo vacio"
            }
            if(compro_pen==""){
                compro_pen="Campo vacio"
            }
            var caso = "1"
            let url = window.location;
            const postData={
                'progreso': porcentaje,
                'actividades': actividades,
                'compro_cum': compro_cum,
                'compro_pen': compro_pen,
                'caso': caso,
                csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
            };
            $.post(url, postData, function(response){
                var a = document.createElement("a");
                a.href = "data:application/pdf;base64," + response;
                a.download = "Reporte.pdf";
                a.click();
            });
        }
    });


    $('#edit1').click(function(e){
        e.preventDefault();
        id=$('#id_d').val();
        $.confirm({
            boxWidth: '400px',
            useBootstrap: false,
            closeIcon: true,
            title: '¿Está seguro?',
            content: 'El documento será modificado',
            typeAnimated: true,
            buttons: {
                somethingElse: {
                    text: 'Seguro',
                    btnClass: 'btn-warning',
                    action: function(){
                        $('#f2').submit();
                    }
                },
                cancelar: function () {

                }
            }
        });
    });

    $('#edit11').click(function(e){
        e.preventDefault();
        $.confirm({
            boxWidth: '400px',
            useBootstrap: false,
            closeIcon: true,
            title: '¿Está seguro?',
            content: 'No se podrán modificar las observaciones',
            typeAnimated: true,
            buttons: {
                somethingElse: {
                    text: 'Seguro',
                    btnClass: 'btn-warning',
                    action: function(){
                        $('#f2').submit();
                    }
                },
                cancelar: function () {

                }
            }
        });
    });

    $("#bparticipar").click(function(e){
        e.preventDefault();
        $("#bparticipar").hide();
        $("#dparticipar").show();
    });

    $('#add_doc').click(function(e){

        e.preventDefault();
        var formulario = $('#tabla');
        
        formulario.append('<tr id="tr_'+ count.toString() +'"></tr>')

        var fila = $('#tr_'+count.toString());
        fila.append("<td><textarea name='text_" + count.toString() + "' id='text_" + count.toString() + "' placeholder='Descripcion' required/></textarea></td>")
        fila.append("<td><select id='sel_"+ count.toString() +"' name='sel_"+ count.toString() +"' required></select></td>")
        fila.append('<td><span id="span_'+count.toString()+'"></span><br><br><button type="button" onclick=abrir("doc_'+count.toString()+'") id="boton_'+count.toString()+'">Adjuntar</button>  <input type="file" name="doc_' + count.toString() + '" id="doc_' + count.toString() + '" style="display:none;" onchange=texto(this,"span_'+count.toString()+'")></td>')
        fila.append('<td><a class="config2" title="Eliminar" alt="Eliminar" id="del" onclick=delete1("'+count.toString()+'","1") href="#"><i class="fas fa-trash-alt"></i></a></td>');
        $("#sel_" + count.toString()).append("<option disabled selected>Seleccione</option><option value='1'>Informativo</option><option value='2'>Opcional</option><option value='3'>Obligatorio</option>");        
        $('#contador').val(count);
        count += 1;
    });

    $('#add_doc2').click(function(e){

        e.preventDefault();
        var formulario = $('#tabla');
        
        formulario.append('<tr id="tr_'+ count.toString() +'"></tr>')

        var fila = $('#tr_'+count.toString());
        fila.append("<td><textarea name='text_" + count.toString() + "' id='text_" + count.toString() + "' placeholder='Descripcion' required/></textarea></td>")
        fila.append('<td><span id="span_'+count.toString()+'"></span><br><br><button type="button" onclick=abrir("doc_'+count.toString()+'") id="boton_'+count.toString()+'">Adjuntar</button>  <input type="file" name="doc_' + count.toString() + '" id="doc_' + count.toString() + '" style="display:none;" onchange=texto(this,"span_'+count.toString()+'")></td>')
        fila.append('<td><a class="config2" title="Eliminar" alt="Eliminar" id="del" onclick=delete1("'+count.toString()+'","1") href="#"><i class="fas fa-trash-alt"></i></a></td>');
        $("#sel_" + count.toString()).append("<option disabled selected>Seleccione</option><option value='1'>Informativo</option><option value='2'>Opcional</option><option value='3'>Obligatorio</option>");        
        $('#contador').val(count);
        count += 1;
    });

	$('#textSearch').keyup(function(e){
		e.preventDefault();
		texto = $(this).val().toLowerCase();
		var contador = 0;
		$.each($('#tableConv .info'),function(){
			if($(this).text().toLowerCase().indexOf(texto) === -1){
				$(this).hide();
			}
			else {
				$(this).show();
				contador++;
			}
		});
	});


    //Validación Para formulario de crear una nueva convocatoria
    $("#convCreate").click(function(e){
        e.preventDefault();
        if($('#convForm').valid()){
            $.confirm({
                boxWidth: '400px',
                useBootstrap: false,
                closeIcon: true,
                typeAnimated: true,
                title: "¿Estas Seguro?",
                content: "Estas a punto de crear una nueva convocatoria.",
                buttons: {
                    confirm: {
                        text: 'Seguro',
                        btnClass: 'btn-warning',
                        action: function(){
                            $('#convForm').submit();
                        }
                    },
                    cancel: {
                        text: "No",
                        btnClass: 'btn-default'
                    }
                }
            });
        }
    });
    
});
