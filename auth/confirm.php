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
			
			LocalRedirect('/my/index.php'.$str);
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
</script>
<?}
?>

