function delete1(id) {
    window.event.preventDefault();
	$.confirm({
		boxWidth: '400px',
		useBootstrap: false,
		closeIcon: true,
		title: '¿Está seguro?',
		content: 'El integrante no podra ser restaurado',
		typeAnimated: true,
		buttons: {
			somethingElse: {
				text: 'Seguro',
				btnClass: 'btn-warning',
				action: function(){
					var caso = "eliminar"
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
};

function generateCertified(id) {
    window.event.preventDefault();
	$.confirm({
		boxWidth: '400px',
		useBootstrap: false,
		closeIcon: true,
		title: '¿Está seguro?',
		content: 'Estas a punto de generar un certificado de pertenencia',
		typeAnimated: true,
		buttons: {
			somethingElse: {
				text: 'Seguro',
				btnClass: 'btn-warning',
				action: function(){
					var caso = "generar"
					let url = window.location;
					const postData={
						'id': id,
						'caso': caso,
						csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
					};
					$.post(url, postData, function(response){
						var a = document.createElement("a");
						a.href = "data:application/pdf;base64," + response;
						a.download = "Certificado.pdf";
						a.click();
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
	$('.tablesorter').tablesorter();
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

	$('#crear').hide();
	$('#campos').hide();
	$('#nuevo').hide();
	$('#documento').hide();
	$('.generacion').hide();
	$('.produccion').hide();
	$('.producto').hide();
	
	//Funcion util para editar los campos de un usuario
	if($('#tipo').val() == 1){
		$('.pre').each(function(){
			$(this).show();
		});
		$('.post').each(function(){
			$(this).hide();
		});
	}
	else if($('#tipo').val() == 2){
		$('.pre').each(function(){
			$(this).hide();
		});
		$('.post').each(function(){
			$(this).show();
		});
	}

	//Si estaba Seleccionado Generacion se muestra y se oculta el resto
	if($('#principal').val() == 1){
		$('.generacion').each(function(){
			$(this).show();
		});
		$('.produccion').each(function(){
			$(this).hide();
		});
		$('.producto').each(function(){
			$(this).hide();
		});
	}
	//Si estaba Seleccionado Produccion se muestra y se oculta el resto
	else if($('#principal').val() == 2){
		$('.generacion').each(function(){
			$(this).hide();
		});
		$('.produccion').each(function(){
			$(this).show();
		});
		$('.producto').each(function(){
			$(this).hide();
		});
	}
	//Si estaba Seleccionado Producto se muestra y se oculta el resto
	else if($('#principal').val() == 3){
		$('.generacion').each(function(){
			$(this).hide();
		});
		$('.produccion').each(function(){
			$(this).hide();
		});
		$('.producto').each(function(){
			$(this).show();
		});
	};

	$('#editar').click(function(){
		$('#ver').hide();
		$('#textSearch').hide();
		$('#crear').show();
	});

	$('#see').click(function(){
		$('#ver').show();
		$('#textSearch').show();
		$('#crear').hide();
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
                content: 'Porfavor digite el numero de cedula del integrante.',
                typeAnimated: true,
                buttons: {
                    ok: {
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
				console.log(response)
				var lista = response.split(",")
                var response = lista[0]
                var nombre = lista[1]
                if(response == "1"){
                    var title='Integrante existente';
                    var content='¿Desea asignar a '+ nombre +' como integrante al semillero?';
                }
                else if(response == "2"){
                    var title='No existe el integrante';
                    var content='El integrante ingresado no existe en la aplicacion ¿Desea registrarlo?';
				}
				else if(response == "3"){
                    var title='Integrante registrado';
                    var content=nombre+' ya forma parte del semillero';
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
								if(response=="1" || response=="2"){
									$('#document').val(cc);
									$('#inte').hide();
									$('#campos').show();
									$('#documento').show();
									$('#integrante2').html("Documento: "+cc);
									if(response=="1"){
										$('#caso').val("viejo");
										$('#integrante1').html("Nombre: "+nombre);
									}
									else if(response=="2"){
										$('#nuevo').show();
										$('#caso').val("nuevo");
									}
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

	var contador = 0;
	//Funciones que ocultan las divisiones al iniciar o refrescar la pagina
	if($('#rol').val() != 3){
		$('.lineas').each(function(){
			$(this).hide();
		});
	};
	if($('#rol').val() != 7){
		$('.estudiante_otra').each(function(){
			$(this).hide();
		});
	};
	if($('#rol').val() != 4 && $('#rol').val() != 5){
		$('.estudiante').each(function(){
			$(this).hide();
		});
	};
	if($('#tipo').val() != 1 && $('#tipo').val() != 2){
		$('.pre').each(function(){
			$(this).hide();
		});
		$('.post').each(function(){
			$(this).hide();
		});
	};
	//Con esta funcion se controla el select que despliega los atributos de los estudiantes (nivel, carrera) y los atributos del coordinador de linea (cuantas lineas)
	$('#rol').change(function(){
		if($('#rol').val() == 3){
			$('.lineas').each(function(){
				$(this).show();
			});
			$('.estudiante').each(function(){
				$(this).hide();
			});
			$('.estudiante_otra').each(function(){
				$(this).hide();
			});
		}
		else if($('#rol').val() == 4 || $('#rol').val() == 5){
			$('.lineas').each(function(){
				$(this).hide();
			});
			$('.estudiante').each(function(){
				$(this).show();
			});
			$('.estudiante_otra').each(function(){
				$(this).hide();
			});
		}
		else if($('#rol').val() == 7){
			$('.lineas').each(function(){
				$(this).hide();
			});
			$('.estudiante').each(function(){
				$(this).hide();
			});
			$('.estudiante_otra').each(function(){
				$(this).show();
			});
		}
		else {
			$('.lineas').each(function(){
				$(this).hide();
			});
			$('.estudiante').each(function(){
				$(this).hide();
			});
			$('.estudiante_otra').each(function(){
				$(this).hide();
			});
		};
	});
	//Con esta funcion se controla el select que despliega las carreras de pregrado o de postgrado dependeiendo del tipo de estudiante
	$('#tipo').change(function(){
		if($('#tipo').val() == 1){
			$('.pre').each(function(){
				$(this).show();
			});
			$('.post').each(function(){
				$(this).hide();
			});
		}
		else if($('#tipo').val() == 2){
			$('.pre').each(function(){
				$(this).hide();
			});
			$('.post').each(function(){
				$(this).show();
			});
		}
		else{
			$('.pre').each(function(){
				$(this).hide();
			});
			$('.post').each(function(){
				$(this).hide();
			});
		}
	});

	$('#principal').change(function(){
		if($('#principal').val() == 1){
			$('.generacion').each(function(){
				$(this).show();
			});
			$('.produccion').each(function(){
				$(this).hide();
			});
			$('.producto').each(function(){
				$(this).hide();
			});
		}
		else if($('#principal').val() == 2){
			$('.generacion').each(function(){
				$(this).hide();
			});
			$('.produccion').each(function(){
				$(this).show();
			});
			$('.producto').each(function(){
				$(this).hide();
			});
		}
		else if($('#principal').val() == 3){
			$('.generacion').each(function(){
				$(this).hide();
			});
			$('.produccion').each(function(){
				$(this).hide();
			});
			$('.producto').each(function(){
				$(this).show();
			});
		};
	});	
	$('#lañadir').click(function(){

		var flag = false;

		$('#tabla .classLine input').each(function(){
			if($(this).val().indexOf($('#lineas').val()) === -1){

			} else {
				flag = true;
			}
		});
		if(!flag){
			$('#tabla').append(`<tr id='tr_` + contador.toString() + `'>
									<td class='classLine' id='td_` + contador.toString() + `'>
										<input id='idline_` + contador.toString() + `' name='idline_` + contador.toString() + `' type='text' value='`+ $('#lineas').val() + `' readOnly>
								 	</td>
									<td>
										<input id='line_` + contador.toString() + `' name='line_` + contador.toString() + `' type='text' value='`+ $('#lineas option:selected').text() +`' readOnly>
									</td>
								</tr>`);
			contador++;
		} else {
			$.confirm({
                boxWidth: '400px',
                useBootstrap: false,
                closeIcon: true,
                title: 'Línea ya añadida',
                content: 'No es posible añadir la misma línea dos veces.',
                typeAnimated: true,
                buttons: {
					ok: {
						btnClass: 'btn-warning',
                    }
                }
            });
		}
	});

	$('#eliminar').click(function(){
		if($('#tabla tbody tr').length != 1){
			$('#tabla tr:last-child').remove();
			contador--;
		}
	});

	$('#enviar').click(function(e){
		e.preventDefault();
		if($('form').valid()){
			$('#contador').val(contador-1);
			$('form').submit();
		}	
	});

	$('#prod_submit').click(function(e){
		e.preventDefault();
		if($('form').valid()){
			$.confirm({
				boxWidth: '400px',
				useBootstrap: false,
				closeIcon: true,
				title: '¿Está seguro?',
				content: 'Esta seguro de registrar la produccion cientifica ingresada.',
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

	$('#prod_edit_submit').click(function(e){
		e.preventDefault();
		if($('form').valid()){
			$.confirm({
				boxWidth: '400px',
				useBootstrap: false,
				closeIcon: true,
				title: '¿Está seguro?',
				content: 'Esta a punto de editar la producción cientifica ingresada.',
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

	$('a[name=delete_produccion]').on('click',function(e){
		e.preventDefault();
		$.confirm({
			boxWidth: '400px',
			useBootstrap: false,
			closeIcon: true,
			title: '¿Está seguro?',
			content: 'La producción cientifica no podrá ser restaurada',
			typeAnimated: true,
			buttons: {
				somethingElse: {
					text: 'Seguro',
					btnClass: 'btn-warning',
					action: function(){
						location.href=$('a[name=delete_produccion]').attr('href');
					}
				},
				cancelar: function () {
				}
			}
		});
	})

	$('#textSearch').keyup(function(e){
		e.preventDefault();
		texto = $(this).val().toLowerCase();
		var cont = 0;
		$.each($('#tableConv .info'),function(){
			if($(this).text().toLowerCase().indexOf(texto) === -1){
				$(this).hide();
			}
			else {
				$(this).show();
				cont++;
			}
		});
	});
});
