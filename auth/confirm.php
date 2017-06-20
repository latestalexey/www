<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/auth/adds.php");?>
<script type="text/javascript" src="<?=SITE_TEMPLATE_PATH?>/js/cnf.js"></script>

<?
$usr = $_GET['u'];
$key = $_GET['k'];
//$ema = $_GET['e'];
$cnt = $_GET['c'];
$pas = $_GET['i'];

$check_res = array();
$check_res['return'] = true;
$check_res['errMessage'] = '';

if(!($usr == '' && $key == '')) {
	$res = post_req('Users_ConfirmRegistration',array('username'=>$usr, 'userkey'=>$key));
	$err_code = $res['return'];
	if($err_code == 0)
	{

	}	
	elseif($err_code == 10) {
		$check_res['return'] = false;
		$check_res['errMessage'] = "Неверное имя пользователя в системе 'TELEPORT'<br>Введите e-mail и пароль, мы отправим Вам повторное почтовое сообщение.";
		$usr = '';
	}	
	elseif($err_code == 14) {
		$check_res['return'] = true;
		$check_res['errMessage'] = "Пользователь уже активирован в системе 'TELEPORT'";
	}	
	elseif($err_code == 18) {
		$check_res['return'] = true;
		$check_res['errMessage'] = "Время подтверждения пользователя в системе 'TELEPORT' истекло.<br>Вам необходимо повторно зарегистрироваться.";
	}	
	elseif($err_code == 22) {
		$check_res['return'] = true;
		$check_res['errMessage'] = "Исчерпан лимит попыток корректного подтверждения пользователя в системе 'TELEPORT' истекло.<br>Вам необходимо повторно зарегистрироваться.";
	}	
	elseif($err_code == 17) {
		$check_res['return'] = true;
		$check_res['errMessage'] = "Неверный код подтверждения в системе 'TELEPORT'.<br>Введите пароль, мы отправим Вам повторное почтовое сообщение.";
		$usr = '';
	}	
	else { 
		$check_res['return'] = false;
		$check_res['errMessage'] = "Неизвестная ошибка в системе 'TELEPORT'. Код: ".$err_code;
	}
	$check_res['err_code'] = $err_code;
}
if($check_res['err_code'] == 0 || $check_res['err_code'] == 14) {
	if($pas == '' || $usr == '') {?>
		<div id="login-window" class="modal_window" style="display: block;">
		<div id="logincontent">
			<div id="main_form">
				<div class="header">E-mail успешно подтвержден</div>
				<div class="header">Введите Ваш пароль для входа в TELEPORT</div>
				<form id="login_form" method="post" action="#">
					<input id="email" class="loginfields" type="text" name="email" value="<?=$usr;?>" placeholder="e-mail (электронная почта)"/>
					<input id="password" class="loginfields" style="margin-top: 20px;" type="password" name="password" value="" placeholder="Пароль"/>
					<p id="reg_error"></p>
					<input type="submit" name="sbt" value="OK" style="display:none;"/>
					<div style="margin-top:30px; text-align: center;">
						<div id="loginsubmit" class="menu_button">ВОЙТИ</div>
					</div>
				</form>
			</div>
		</div>	
		</div>
		<script id="auth_scr" type="text/javascript">
			$('#loginsubmit').click(function(e) {
				e.preventDefault();
				$("#login_form").submit();
			});
			$("#login_form").submit(function(e)
			{
				e.preventDefault();
				$('#loginsubmit').html('<img src="/include/wait.gif"/>');
				$.post('/auth/login.php', {username: $('#email').val(), password: $('#password').val()}, function(data) 
					{
						$('#loginsubmit').html('ВОЙТИ');
						if(data == '')
							{window.location.href = '/my/index.php';}
						else
							{$('#reg_error').text(data);}
					});
			});
		</script>
	<?}
	else {
		
		$str = '';
		$session_id = "";
		$user_id = "";
					
		$login_res = post_req('Users_Login',array('UserName'=>$usr, 'Password'=>$pas));
		if(!is_array($login_res["ResponseStatus"]) || !is_array($login_res)) {
			$USER->Logout();
			echo 'Ошибка авторизации на сервере TELEPORT. Повторите позже';
			LocalRedirect('/my/index.php'.$str);
			die();
		}
		elseif(count($login_res["ResponseStatus"]) == 0)
		{
			if ($USER->GetLogin() == '') 
			{
				$arAuthResult = $USER->Login("telesite", "819f4a01ab5bd8", "N", "Y");
				if (!$arAuthResult) 
				{
					echo 'Ошибка авторизации на сайте';
					LocalRedirect('/my/index.php'.$str);
					die();
				}
			}
			include ($_SERVER["DOCUMENT_ROOT"]."/my/admin/init.php");
			
			if(!($cnt == ''))
			{
				$TLP_obj = unserialize($_SESSION["TLP_obj"]);
				$arFnc = array('contact'=>$cnt);
				$res = $TLP_obj->telecall('Contacts_AcceptPerson', $arFnc);
				if(!($res['return'] == 0))
				{
					$str = '&err='.$TLP_obj->mistakes[$res['return']];
					
				}
				else {
					$str = '&cnt='.urlencode($cnt).'&mode=catalog';
				}
			}
			?>
			<div id="confirmation">
				<div class="resend-intro-cnt"> 
					<div class="lined-text"> 
						<div class="line left"></div>
						<div class="text">Регистрация в системе</div>
						<div class="line right"></div>
					</div>
					<h1 class="h1 text-shadow-fix">Вы успешно зарегистрированы в системе TELEPORT</h1>
					<h2 class="h2">Для дальнейшей работы вам необходимо придумать и ввести пароль для входа в TELEPORT
						 
					</h2>
					<form id="change_pass_form" method="post" action="#">
						<div style="padding: 10px 0 10px 0;">
							<input id="new_name" style="height: 40px; width: 282px; border-radius: 5px; border: 1px solid #ccc; font-size: 18px; padding: 10px;11" type="text" placeholder="Введите ваше имя" name="new_name" value="">
							<div style="color: #444; font-size: 12px;">Например: Виктор, Бизнес логистика</div>
						</div>
						<div style="padding: 10px 0 20px 0;">
							<input id="new_pass" style="height: 40px; width: 282px; border-radius: 5px; border: 1px solid #ccc; font-size: 18px; padding: 10px;11" type="password" placeholder="Введите новый пароль" name="new_pass" value="">
						</div>
						<div id="new_password_confirm" style="margin: auto;width: 200px;padding: 20px;font-size: 18px;color: #FFF;border-color: #ccc;background-color: #26A69A;" class="simple_button">
							Подтвердить
						</div>
						<div id="reg_error" style="margin: auto;width: 200px;font-size: 16px;color: #FF0000;"></div>
						<input id="ui" type="hidden" name="ui" value="<?=$pas;?>"/>
						<input id="usr" type="hidden" name="usr" value="<?=$usr;?>"/>
						<input style="display: none;" type="submit" value="OK"/>
					</form>
						
				</div>	
			</div>
			<script id="auth_scr" type="text/javascript">
				$('#new_name').keydown(function(e){
					if (e.which == 13) {
						$('#new_pass').focus();
						e.preventDefault();
					}	
				});
				$('#new_password_confirm').click(function(e){
					e.preventDefault();
					$('#change_pass_form').submit();
				});
				$('#change_pass_form').submit(function(e){
					e.preventDefault();
					$('#reg_error').text('');

					var inp_pass = $(this).find('#new_pass').val();
					if(inp_pass.length < 5) {
						$('#reg_error').text('Длина пароля должна быть не менее 5-ти символов');
						return;
					}
					$('#new_password_confirm').html('<img src="/include/wait.gif"/>');
					var xhr = new XMLHttpRequest();
					var body =	'action=changePassword' +
								'&adds=cnf' +
								'&pass_hash=' + encodeURIComponent($(this).find('#ui').val()) +
								'&new_hash=' + encodeURIComponent($(this).find('#new_pass').val());

					xhr.open("POST", '/my/ajax/action.php', true);
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhr.onreadystatechange = function() 
					{ 
						if (xhr.readyState != 4) return;
						console.log(xhr.responseText);
						var inp_name = $('#change_pass_form').find('#new_name').val();
						if(inp_name != '') {
							
							var xhrName = new XMLHttpRequest();
							var bodyName =	'action=setPersonInfo' +
								'&adds=html&name='+encodeURIComponent($(this).find('#usr').val()) +
								'&user_fullname='+ encodeURIComponent(inp_name);

							xhrName.open("POST", '/my/ajax/action.php', true);
							xhrName.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
							xhrName.onreadystatechange = function() 
							{ 
								if (xhrName.readyState != 4) return;
								
								console.log(xhrName.responseText);
								window.location.href = '/my/index.php';
							}	
							xhrName.send(bodyName);
						} else {
							window.location.href = '/my/index.php';
						}
					}
					xhr.send(body);
				});	
			</script>
			<?
			//LocalRedirect('/my/index.php'.$str);
		}
		else {
			$USER->Logout();
			echo 'Ошибка авторизации на сервере TELEPORT. Повторите позже';
			LocalRedirect('/my/index.php'.$str);
			die();
		}
	}
}
else {?>
	<div id="login-window" class="modal_window" style="display: block;">
	<div id="logincontent">
		<div id="main_form">
			<div class="header"><?echo $check_res['errMessage'];?></div>
			<form id="login_form" method="post" action="#">
				<input id="email" class="loginfields" type="text" name="email" value="<?=$usr;?>" placeholder="e-mail (электронная почта)"/>
				<input id="password" class="loginfields" style="margin-top: 20px;" type="password" name="password" value="" placeholder="Пароль"/>
				<p id="reg_error"></p>
				<input type="submit" name="sbt" value="OK" style="display:none;"/>

				<div style="margin-top:20px; text-align: center;">
					<div id="regsubmit" class="menu_button">ОТПРАВИТЬ</div>
				</div>
			</form>
		</div>
	</div>	
	</div>
	<div id="confirmation_g" style="display: none;">
		<div class="resend-intro-cnt"> 
			<div class="lined-text"> 
				<div class="line_g left"></div>
				<div class="text">Сведения успешно отправлены</div>
				<div class="line_g right"></div>
			</div>
			<h2 class="h2">Вам отправлено электронное сообщение с кодом активации на адрес<br>
				<a id="mail_info" href="<?=$usr?>" class="intro_border-bottom email_span"></a> 
			</h2>
			<p class="intro_text">Для завершения процесса регистрации проверьте входящие сообщения и пройдите по ссылке в нашем письме.<br>Если у Вас есть какие-то вопросы 
				<a class="intro_border-bottom" href="mailto:support@e-teleport.ru">напишите нам</a>
			</p>
		</div>	
	</div>	
	
</div>	
<script id="auth_scr" type="text/javascript">
	$('#regsubmit').click(function(e) {
		e.preventDefault();
		$("#login_form").submit();
	});
	$("#login_form").submit(function(e){
		e.preventDefault();
		$('.reg_error_field').removeClass('reg_error_field');
		$('#reg_error').text('');
		$('#regsubmit').html('<img src="/include/wait.gif"/>');
		$.post('/auth/reg.php', {'email': $('#email').val(), 'password': $('#password').val()}, function(data) 
				{
					$('#regsubmit').html('ОТПРАВИТЬ');
					var arResult = jQuery.parseJSON(data);
					if(arResult.return)	{
						$('#mail_info').text($('#email').val());
						$('#mail_info').attr('href','mailto:'+$('#email').val());
						$("#login-window").remove();
						$("#confirmation_g").show(200);
					}
					else {
						$('#reg_error').text(arResult.errMessage);
						$('#'+arResult.style_obj).addClass('reg_error_field');
					}	
				});
	});
	
	$('#new_password_confirm').click(function(e){
		e.preventDefault();
		$('#change_pass_form').submit();
	});
	$('#change_pass_form').submit(function(e){
		e.preventDefault();
		$('#reg_error').text('');

		var inp_pass = $(this).find('#new_pass').val();
		if(inp_pass.length < 5) {
			$('#reg_error').text('Длина пароля должна быть не менее 5-ти символов');
			return;
		}
		$('#new_password_confirm').html('<img src="/include/wait.gif"/>');
		var xhr = new XMLHttpRequest();
		var body =	'action=changePassword' +
					'&adds=html' +
					'&pass_hash=' + encodeURIComponent($(this).find('#ui').val()) +
					'&new_hash=' + encodeURIComponent($(this).find('#new_pass').val());

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			$('#new_password_confirm').html('Подтвердить');
			window.location.href = '/my/index.php';
			
		}
		xhr.send(body);
	});	
}	
</script>
<?}
?>



