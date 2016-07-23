	<div id="restore-window" class="modal_window" style="display: block;">
	<div class="close_line" style="<?=$cl_style;?>"><div class="clw"><img src="/include/close_window.svg"/></div></div>
	<div id="logincontent">
		<div id="rst_form">
			<div class="header">Восстановление пароля</div>
			<div class="header_text">Введите адрес электронной почты, который Вы использовали при регистрации в TELEPORT<br></div>
			<br>
			<form id="restore_form" method="post" action="#">
				<input id="email" class="loginfields" type="text" name="email" value="" placeholder="e-mail (электронная почта)"/>
				<p id="reg_error"></p>
				<input type="submit" name="sbt" value="OK" style="display:none;"/>
				<div style="margin-top:30px; text-align: center;">
					<div id="restoresubmit" class="menu_button">ОТПРАВИТЬ</div>
				</div>
			</form>
		</div>
		<div id="cnf_form" style="display: none;">
			<div class="header">Подтверждение e-mail</div>
			<div class="header_text">Вам на электронный адрес <span id="cnf_mail"><span> отправлено сообщение с кодом восстановления.
				<br>Проверьте свой почтовый ящик.
				<br>
				<br>
			</div>
			<form id="confirm_form" method="post" action="#">
				<input id="ID_code" class="loginfields" type="text" name="ID_code" value="" placeholder="Код восстановления из e-mail"/>
				<br>
				<br>
				<input id="new_pass" class="loginfields" type="password" name="new_pass" value="" placeholder="Введите новый пароль"/>
				<p id="reg_error"></p>
				<input type="submit" name="sbt" value="Изменить пароль" style="display:none;"/>
				<input type="hidden" id="email" name="email" value=""/>
				<div style="margin-top:30px; text-align: center;">
					<div id="confirmsubmit" class="menu_button">Изменить пароль</div>
				</div>
			</form>
		</div>
	</div>	
	</div>
<script id="authrs_scr" type="text/javascript">
	$('#restoresubmit').click(function(e) {
		e.preventDefault();
		$("#restore_form").submit();
	});
	
	$('#confirmsubmit').click(function(e) {
		e.preventDefault();
		$("#confirm_form").submit();
	});

	$("#restore_form").submit(function(e)
	{
		e.preventDefault();
		$('#restore_form #reg_error').text('');
		$('#restoresubmit').html('<img src="/include/wait.gif"/>');
		var xhr = new XMLHttpRequest();
		var body =	'action=restorePassword' +
					'&adds=html' +
					'&username=' + encodeURIComponent($(this).find('#email').val());

		xhr.open("POST", '/auth/tl_reqs.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			$('#restoresubmit').html('ОТПРАВИТЬ');
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				$('#restore_form #reg_error').text(xhr.responseText.replace('%err%',''));
				return;
			}
			//$('#cnf_ID').val(xhr.responseText);
			$('#confirm_form #email').val($('#restore_form #email').val());
			$('#rst_form').hide();
			$('#cnf_form').show();
			
		}
		xhr.send(body);
	});

	$("#confirm_form").submit(function(e)
	{
		e.preventDefault();
		if($('#new_pass').val() == "") {
			$('#confirm_form #reg_error').text('Не указан новый пароль');
			return;
		}
		if($('#new_pass').val().length < 5) {
			$('#confirm_form #reg_error').text('Длина пароля должна быть не менее 5 символов');
			return;
		}
		if($('#ID_code').val() == "") {
			$('#confirm_form #reg_error').text('Не указан код восстановления');
			return;
		}
		$('#confirm_form #reg_error').text('');
		$('#confirmsubmit').html('<img src="/include/wait.gif"/>');
		var xhr = new XMLHttpRequest();
		var body =	'action=confirmPasswordRestore' +
					'&adds=html' +
					'&username=' + encodeURIComponent($(this).find('#email').val()) +
					'&new_hash='+$('#new_pass').val()+
					'&ChkCode='+$('#ID_code').val();

		xhr.open("POST", '/auth/tl_reqs.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			$('#confirmsubmit').html('Изменить пароль');
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				$('#restore_form #reg_error').html(xhr.responseText.replace('%err%',''));

				$('#rst_form').show();
				$('#cnf_form').hide();

				return;
			}
			$('#confirm_form').hide();
			$('#cnf_form .header_text').html('Пароль успешно изменен\
				<br><br><br>\
				<a class="menu_button" style="color: #FFF;" href="/my/index.php">Перейти в личный кабинет</a>\
				<br><br>');
		}
		xhr.send(body);
	});

	$('.close_line div, #back-button').click(function(e) {
		$('#restore-window').remove();
		$('#authrs_scr').remove();
		$('#login-window').show();
	});
</script>