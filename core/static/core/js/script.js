function delete1(id) {
    window.event.preventDefault();
    $.confirm({
        boxWidth: '400px',
        useBootstrap: false,
        closeIcon: true,
        title: '¿Está seguro?',
        content: 'El semillero no podra ser restaurado',
        typeAnimated: true,
        buttons: {
            somethingElse: {
                text: 'Seguro',
                btnClass: 'btn-warning',
                action: function(){
                    let url = window.location;
                    const postData={
                        'id': id,
                        'caso':"eliminar",
                        csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
                    };
                    $.post(url, postData, function(response){
                        $.alert({
                            boxWidth: '400px',
                            useBootstrap: false,
                            closeIcon: true,
                            title: 'Exito',
                            content: 'Se ha eliminado el semillero exitosamente',
                            typeAnimated: true,
                            buttons: {
                                ok: {
                                    btnClass: 'btn-warning',
                                    action: function(){
                                        window.location.reload();
                                    }
                                }

                            }
                        });
                    });
                }
            },
            cancelar: function () {
            }
        }
    });
};

if ( window.history.replaceState ) {
    window.history.replaceState( null, null, window.location.href );
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
    $('.add').hide();
    $('.see').show();
    //$('#coordinador').val("");

    $('#see').click(function(e){
        e.preventDefault();
        $('h1').html('Semilleros');
        $('.see').show();
        $('#textSearch').show();
        $('.add').hide();
    });

    $('#register_2').click(function(){
		$('#campos').hide();
		$('.add').show();
		$('#new_coord').hide();
	});


    $('#add').click(function(e){
        e.preventDefault();
        $('h1').html('Añadir semillero');
        $('.add').show();
        $('.see').hide();
        $('#campos').hide();
        $('#new_coord').hide();
        $('#coord').show();
        $('#textSearch').hide();
    });

    $('.edit input').click(function(e){
        e.preventDefault();
        window.location.href = "edit/" + $('#lista').val();
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
    
    $("#cedula").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
           //No se permite escribir un ASCII distinto a los numeros
           return false;
       }
    });
    $('#consult').click(function(e){
        var cc = $('#cedula').val();
        if(cc==""){
            $.alert({
                boxWidth: '400px',
                useBootstrap: false,
                closeIcon: true,
                title: 'Cedula vacia',
                content: 'Porfavor digite el numero de cedula del coordinador.',
                typeAnimated: true,
                buttons: {
                    Ok: {
                        btnClass: 'btn-warning',
                    }
                }
            });
        }
        else{
            let url = window.location;
            const postData={
                'cc': cc,
                'caso': 'verificar',
                csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
            };
            $.post(url, postData, function(response){
                var lista = response.split(",")
                var response = lista[0]
                var nombre = lista[1]
                if(response == "1"){
                    var title='Coordinador existente';
                    var content='¿Desea asignar a '+ nombre +' al semillero como coordinador?';
                }
                else if(response == "2"){
                    var title='Integrante existente';
                    var content='El usuario '+ nombre +' es integrante de otro semillero pero no tiene perfil como  coordinador ¿Desea crearlo?';
                }
                else if(response == "3"){
                    var title='No existe el usuario';
                    var content='El usuario ingresado no existe en la aplicacion ¿Desea registrarlo?';
                }
                $.confirm({
                    boxWidth: '400px',
                    useBootstrap: false,
                    closeIcon: true,
                    title: title,
                    content: content,
                    typeAnimated: true,
                    buttons: {
                        somethingElse: {
                            text: 'Si',
                            btnClass: 'btn-warning',
                            action: function(){
                                if(response=="1"){
                                    $('#coordinador').val(cc);
                                    $('#coord').hide();
                                    $('#campos').show();
                                    $('#coord1').html("Nombre: "+nombre);
                                    $('#coord3').html("Documento: "+cc);
                                    $('#estado').val(response);
                                }
                                else if(response=="2"){
                                    $('#new_integr').hide();
                                    $('#new_coord').show();
                                    $('#coord').hide();
                                    $('#coordinador').val(cc);
                                    $('#coord3').html("Documento: "+cc);
                                    $('#estado').val(response);
                                }
                                else if(response=="3"){
                                    $('#new_coord').show();
                                    $('#coord').hide();
                                    $('#estado').val(response);
                                    $('#coord2').html(cc);
                                    $('#coord3').html("Documento: "+cc);
                                    $('#coordinador').val(cc);
                                }
                            }
                        },
                        No: function () {
                        }
                    }
                });
            });
        }
    });
    
    //Nuevo Coordinador
    $('#register11').click(function(e){
        e.preventDefault();
        $('#caso').val($('#estado').val());
        if($('#semilleroForm').valid()){
            $('form').submit();
        };
    }); 

    //Editar Semillero
    $('#register1').click(function(e){
        e.preventDefault();
        if($('form').valid()){
            var estado = $('#estado').val();
            let url = window.location;
            var cc = $('#coordinador').val()
            if(estado=="1"){
                var joined = $('#joined').val()
                var id_group = $('#id_group').val()
                var name = $('#name_s').val()
                var description = $('#description').val()
                var mail = $('#mail').val()
                var postData={
                    'cc': cc,
                    'joined': joined,
                    'id_group': id_group,
                    'name': name,
                    'description':description,
                    'mail': mail,
                    'caso': estado,
                    csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
                };
                $.post(url, postData, function(response){
                    $.alert({
                        boxWidth: '400px',
                        useBootstrap: false,
                        closeIcon: true,
                        title: "Edicion exitosa",
                        content: "Se ha editado exitosamente el semillero.",
                        typeAnimated: true,
                        buttons: {
                            ok: {
                                btnClass: 'btn-warning',
                                action: function(){
                                    window.location.reload();
                                }
                            }
                        }
                    });
                });    
            }
        }    
    });

    if($('#opcion').val()=="0"){
        $(".listado").hide();
    }
    else{
        $(".listado").show();
    };

    $('#opcion').change(function(){
        if($('#opcion').val()=="0"){
            $(".listado").hide();
        }
        else{
            $(".listado").show();
        };
    });

    $('#addSemillero').click(function(e){
        e.preventDefault();
        var flag=false;
        $('#tabla .SemilleroRow input').each(function(){
            if($(this).val().indexOf($('#ListaSemillero').val()) === -1){

            } else {
				flag = true;
			}
		});
        if(!flag){
            var formulario = $('#tabla');
            formulario.append('<tr class="SemilleroRow" id="tr_'+ count.toString() +'"></tr>')
            var fila = $('#tr_'+count.toString());
            fila.append('<td>'+$('#ListaSemillero option:selected').html()+'<input name="SemilleroAñadido'+count.toString()+'" type="hidden" value="'+$('#ListaSemillero option:selected').val()+'"></td>');
            $('#contador').val(count);
            count += 1;
        }
        else{
            $.confirm({
                boxWidth: '400px',
                useBootstrap: false,
                closeIcon: true,
                title: 'Semillero Añadido',
                content: 'No es posible añadir el mismo semillero dos veces.',
                typeAnimated: true,
                buttons: {
					ok: {
						btnClass: 'btn-warning',
                    }
                }
            });
        }
    });


    $('#consulta').click(function(e){
        e.preventDefault();
        var opcion = $('#opcion').val();
        var contador = 0;
        if( opcion == "1"){
            $('#tabla .SemilleroRow').each(function(){
                contador=contador+1;
            });
            if(contador == 0){
                $.alert({
                    boxWidth: '400px',
                    useBootstrap: false,
                    closeIcon: true,
                    title: 'Error',
                    content: 'Debe listar por lo menos un semillero.',
                    typeAnimated: true,
                    buttons: {
                        ok: {
                            btnClass: 'btn-warning',
                        }
                    }
                });
            }
            else{
                $('form').submit();
            }
        }
        else{
            $('form').submit();
        }
    });

    //Edicion de campos de un semillero por coordinador
    $('#enviar').click(function(e){
        e.preventDefault();
        if($('form').valid()){
            $.confirm({
                boxWidth: '400px',
                useBootstrap: false,
                closeIcon: true,
                title: "¿Esta seguro?",
                content: "Esta seguro de los cambios realizados",
                typeAnimated: true,
                buttons: {
                    somethingElse: {
                        text: 'Si',
                        btnClass: 'btn-warning',
                        action: function(){
                            $('form').submit();
                        }
                    },
                    No: function () {
                    }
                }
            });
        };
    });
    $('#register').click(function(e){
        e.preventDefault();
        if($('#semilleroForm').valid()){
            var estado = $('#estado').val();
            let url = window.location;
            var user = $('#username').val();
            var group = "Coordinador";
            var password = $('#password').val();
            var rpassword = $('#rpassword').val();
            var cc = $('#coordinador').val()
            if(estado=="2"){
                var postData={
                    'cc': cc,
                    'user': user,
                    'group': group,
                    'password': password,
                    'rpassword': rpassword,
                    'caso': estado,
                    csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
                };
            }    
            else if(estado=="3"){
                var name = $('#name').val();
                var lastname = $('#lastname').val();
                var email = $('#email').val();
                var phone = $('#phone').val();
                var adicional = $('#adicional').val();
                var postData={
                    'cc': cc,
                    'user': user,
                    'group': group,
                    'password': password,
                    'rpassword': rpassword,
                    'name':name,
                    'lastname':lastname,
                    'email':email,
                    'phone':phone,
                    'adicional':adicional,
                    'caso': estado,
                    csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
                };
            }
            $.post(url, postData, function(response){
                var lista = response.split(",")
                var response = lista[0]
                var nombre = lista[1]
                if(response=="1"){
                    var title="Nombre de usuario invalido";
                    var content="El nombre de usuario no puede tener espacios";
                }
                else if(response=="2"){
                    var title='Registro exitoso';
                    var content='El usuario fue registrado con exito.';
                    $('#new_coord').hide();
                    $('#campos').show();
                    $('#estado').val("1");
                    $('#coord1').html("Nombre: "+nombre);
                }    
                else if(response=="3"){
                    var title="Contraseñas no coinciden";
                    var content="Las contraseñas deben ser iguales";
                }
                else if(response=="4"){
                    var title="Nombre de usuario en uso";
                    var content="Porfavor digite otro nombre de usuario.";
                }
                $.alert({
                    boxWidth: '400px',
                    useBootstrap: false,
                    closeIcon: true,
                    title: title,
                    content: content,
                    typeAnimated: true,
                    buttons: {
                        ok: {
                            btnClass: 'btn-warning',
                        }
                    }
                });
            });  
        }    
    });
});