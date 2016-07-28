	//добавлен обработчик для выбора логотипа компании ---------------
	$(".my_body").on('change',"form[name='fs_logo'] input[type='file']", function(e) {
		$(this).submit();
	});

	$(".my_body").on('submit', "form[name='fs_logo']", function(e) {
		e.preventDefault();
		var thisForm = document.forms.fs_logo;
		var body = new FormData(thisForm);
		var operID = $(thisForm).find('[name=operID]').val();

		var xhr = new XMLHttpRequest();
		xhr.open("POST", thisForm.action, true);
		xhr.onreadystatechange = function()	{ 
			if (xhr.readyState != 4) return;
			
			try {
				var arResult = jQuery.parseJSON(xhr.responseText);
			}
			catch (err) {
				showError(xhr.responseText);
			}

			if (arResult.err == 0) {
				if(operID = 'usr-addLogo') {
					$('#cnt_logo img').attr('src', arResult.img);
					$('#cnt_logo img').attr('data-change', "1");
					$('#cnt_logo img').attr('data-width', arResult.info[0]);
					$('#cnt_logo img').attr('data-height', arResult.info[1]);
				}	
			}
			else {
				showError(arResult.err_info);
			}
		}
		xhr.send(body);
	});
//---------------------------------------------------------