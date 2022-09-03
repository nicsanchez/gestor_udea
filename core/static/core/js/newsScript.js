function deleteNew(id) {
    window.event.preventDefault();
    $.confirm({
        boxWidth: '400px',
        useBootstrap: false,
        closeIcon: true,
        title: '¿Está seguro?',
        content: 'La noticia no podrá ser restaurada',
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
                    $.post(url, postData, function(){
                        $.alert({
                            boxWidth: '400px',
                            useBootstrap: false,
                            closeIcon: true,
                            title: 'Exito',
                            content: 'Se ha eliminado la noticia exitosamente',
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
    ClassicEditor.create( document.querySelector( '#textEditor' ));

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

    $('.add').hide();
    $('.see').show();

    $('#see').click(function(e){
        e.preventDefault();
        $('h1').html('Noticias');
        $('.see').show();
        $('#textSearch').show();
        $('.add').hide();
    });

    $('#add').click(function(e){
        e.preventDefault();
        $('h1').html('Añadir noticia');
        $('.add').show();
        $('.see').hide();
        $('#textSearch').hide();
    });

    $('#addNew').click(function(e){
        e.preventDefault();
        if($('form').valid()){
            $('form').submit();
        };
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
});