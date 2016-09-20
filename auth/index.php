<?
function encryptString($String, $Password)
{
    $Salt='BGtlLWQtKp7KEMV7'; 
    $StrLen = strlen($String);
    $Seq = $Password;
    $Gamma = '';
    while (strlen($Gamma)<$StrLen+100)
    {
        $Seq = pack("H*",sha1($Gamma.$Seq.$Salt));
        $Gamma.=substr($Seq,0,20);
    }
    
    return $String^$Gamma;
}

if(isset($_COOKIE['tlp_sid'])) {
    $ciphertext_dec = base64_decode($_COOKIE['tlp_sid']);
	$ciphertext_dec = encryptString($ciphertext_dec, 'ZfpDLCk7');
	$arPass = explode(':',$ciphertext_dec);
}
else {
	$autoLogin = '';
}	
?>	
<div id="back-window"> <!--min-height: 650px; -->
	<div id="big_logo"></div>
	<div style="margin: 20px 0 0 0; text-align: center;">
		<img src="/include/teleport_header.png">
		<div style="font-size: 22px; margin-top: 20px; text-align: center; color: #0e9487;">Clients Environment Optimization</div>
		<hr>
	</div>
	<div style="margin: 20px 0 0 0;">
		<div style="font-size: 22px; margin-top: 7px; text-align: center; color: #FF6600; font-family: 'Open sans'; font-weight: 600;">Товары от производителей и импортеров по оптовым ценам</div>
		<div style="margin: 25px auto; border: 2px solid #0e9487; height: 50px; border-radius: 5px; max-width: 750px; position: relative;">
			<input style="width: 100%;height: 100%;font-size: 21px;padding: 0 5px 0 5px; font-family: 'Open sans';" id="all_search_inp" type="text" placeholder="Название товара, бренда или компании">
			<div id="all_search_button">
				<svg fill="#FF6600" height="45px" width="45px" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink">
					<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"></g>
					<path d="M19.4271164,21.4271164 C18.0372495,22.4174803 16.3366522,23 14.5,23 C9.80557939,23 6,19.1944206 6,14.5 C6,9.80557939 9.80557939,6 14.5,6 C19.1944206,6 23,9.80557939 23,14.5 C23,16.3366522 22.4174803,18.0372495 21.4271164,19.4271164 L27.0119176,25.0119176 C27.5621186,25.5621186 27.5575313,26.4424687 27.0117185,26.9882815 L26.9882815,27.0117185 C26.4438648,27.5561352 25.5576204,27.5576204 25.0119176,27.0119176 L19.4271164,21.4271164 L19.4271164,21.4271164 Z M14.5,21 C18.0898511,21 21,18.0898511 21,14.5 C21,10.9101489 18.0898511,8 14.5,8 C10.9101489,8 8,10.9101489 8,14.5 C8,18.0898511 10.9101489,21 14.5,21 L14.5,21 Z" id="search"/>
				</svg>
			</div>
		</div>
	</div>
	<div style="margin: 70px 0 0 0; padding: 10px 0; background-color: #607D8B;">
		<div style="margin: 20px auto 20px auto; width: 950px; background-color: #FFF;">
			<img style="width: 100%;" src="http://isonex.ru/include/action_1.jpg">
			<div style="padding: 15px; border-top: 1px solid #CCC; font-family: 'Open sans'; font-size: 23px; color: #777;">
				<div class="block_menu">О компании</div>
				<div class="block_menu">Новости</div>
				<div class="block_menu">Каталог товаров</div>
			</div>
		</div>
		<div style="margin: 20px auto 20px auto; width: 950px; background-color: #FFF;">
			<img style="width: 100%;" src="http://static.price.ru/-/home/head_banner_sapogi.jpg">
			<div style="padding: 15px; border-top: 1px solid #CCC; font-family: 'Open sans'; font-size: 23px; color: #777;">
				<div class="block_menu">О компании</div>
				<div class="block_menu">Новости</div>
				<div class="block_menu">Каталог товаров</div>
			</div>
		</div>
	</div>
</div>
	<div id="login-window" class="modal_window" style="display: block;">
	<div class="close_line" style="<?=$cl_style;?>"><div class="clw"><img src="/include/close_window.svg"/></div></div>
	<div id="logincontent">
		<div id="main_form">
			<div class="header">Войти в Ваш личный кабинет</div>
			<form id="login_form" method="post" action="#">
				<input id="email" class="loginfields" type="text" name="email" value="<?=$arPass[0];?>" placeholder="e-mail (электронная почта)"/>
				<input id="password" class="loginfields" style="margin-top: 20px;" type="password" name="password" value="" placeholder="Пароль"/>
				<input id="autolog" type="hidden" name="autolog" value="<?=$autoLogin;?>"/> 
				<p style="text-align: right; float: right; margin-top: 10px; font-size: 15px; padding-top: 2px;"><a id="forget">забыли пароль?</a></p>
				<div id="noremember" style="margin-top: 10px;"><div class="checkbox"></div><span>Запомнить меня</span></div>
				<p id="reg_error" style="text-align: right;"></p>
				<input type="submit" name="sbt" value="OK" style="display:none;"/>
				<div style="margin-top:30px; text-align: center;">
					<div id="loginsubmit" class="menu_button">ВОЙТИ</div>
				</div>
			</form>

			<div style="margin-top:20px; text-align: center;">
				<div id="regsubmit" class="simple_button">РЕГИСТРАЦИЯ</div>
			</div>
		</div>
	</div>	
	</div>
	<div id="confirmation" style="display: none;">
		<div class="resend-intro-cnt"> 
			<div class="lined-text"> 
				<div class="line left"></div>
				<div class="text">Вы зарегистрированы в системе</div>
				<div class="line right"></div>
			</div>
			<h1 class="h1 text-shadow-fix">Спасибо Вам за выбор TELEPORT!</h1>
			<h2 class="h2">Вам отправлено электронное сообщение с кодом активации на адрес<br>
				<a id="mail_info" href="" class="intro_border-bottom email_span"></a> 
			</h2>
			<p class="intro_text">Для завершения процесса регистрации проверьте входящие сообщения и пройдите по ссылке в нашем письме.<br>Если у Вас есть какие-то вопросы 
				<a class="intro_border-bottom" href="mailto:support@b-teleport.ru">напишите нам</a>
			</p>
			<div id="back-button" style="margin: auto; width: 200px;" class="menu_button">Вернуться назад</div>
		</div>	
	</div>	
<script id="auth_scr" type="text/javascript">
function  getPageSize(){
	   var xScroll, yScroll;

	   if (window.innerHeight && window.scrollMaxY) {
			   xScroll = document.body.scrollWidth;
			   yScroll = window.innerHeight + window.scrollMaxY;
	   } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
			   xScroll = document.body.scrollWidth;
			   yScroll = document.body.scrollHeight;
	   } else if (document.documentElement && document.documentElement.scrollHeight > document.documentElement.offsetHeight){ // Explorer 6 strict mode
			   xScroll = document.documentElement.scrollWidth;
			   yScroll = document.documentElement.scrollHeight;
	   } else { // Explorer Mac...would also work in Mozilla and Safari
			   xScroll = document.body.offsetWidth;
			   yScroll = document.body.offsetHeight;
	   }

	   var windowWidth, windowHeight;
	   if (self.innerHeight) { // all except Explorer
			   windowWidth = self.innerWidth;
			   windowHeight = self.innerHeight;
	   } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
			   windowWidth = document.documentElement.clientWidth;
			   windowHeight = document.documentElement.clientHeight;
	   } else if (document.body) { // other Explorers
			   windowWidth = document.body.clientWidth;
			   windowHeight = document.body.clientHeight;
	   }

	   // for small pages with total height less then height of the viewport
	   if(yScroll < windowHeight){
			   pageHeight = windowHeight;
	   } else {
			   pageHeight = yScroll;
	   }

	   // for small pages with total width less then width of the viewport
	   if(xScroll < windowWidth){
			   pageWidth = windowWidth;
	   } else {
			   pageWidth = xScroll;
	   }

	   return [pageWidth,pageHeight,windowWidth,windowHeight];
}
	$("#regsubmit").click(function(e){
		e.preventDefault();
		$('.reg_error_field').removeClass('reg_error_field');
		$('#reg_error').text('');
		$(this).html('<img src="/include/wait.gif"/>');
		$.post('/auth/reg.php', {'email': $('#email').val(), 'password': $('#password').val()}, function(data) 
				{
					var arResult = jQuery.parseJSON(data);
					$('#regsubmit').html('РЕГИСТРАЦИЯ');
					if(arResult.return)	{
						$('#mail_info').text($('#email').val());
						$('#mail_info').attr('href','mailto:'+$('#email').val());
						$("#login-window").remove();
						$("#back-window").remove();
						//$("#back-window").removeClass("usl");
						//$("#back-window").addClass("regs");
						$("#confirmation").show(200);
					}
					else {
						$('#reg_error').text(arResult.errMessage);
						$('#'+arResult.style_obj).addClass('reg_error_field');
					}	
				});
	});
	
	$('#loginsubmit').click(function(e) {
		e.preventDefault();
		$("#login_form").submit();
	});
	$('#password').keydown(function(event){
		$('#reg_error').text('');
		if (event.which == 13)
			{
				event.preventDefault();
				$("#login_form").submit();
			}
	});
	$('#email').keydown(function(event){
		$('#reg_error').text('');
		if (event.which == 13)
			{
				event.preventDefault();
				$("#password").focus();
			}
	});
	
	$("#login_form").submit(function(e)
	{
		if(typeof(Storage) !== "undefined") {
			sessionStorage.clear();
		}
		e.preventDefault();
		$('#reg_error').text('');
		$('#loginsubmit').html('<img src="/include/wait.gif"/>');
		$.post('/auth/login.php', {username: $('#email').val(), password: $('#password').val(), autolog: $('#autolog').val(), norem: $('#noremember .checkbox').hasClass('checkbox_clicked')}, function(data) 
				{
					if(jQuery.trim(data) == '')
						{
							$('#loginsubmit').html('Выполняется вход...');
							var my_url = window.location.toString();
							if(my_url.indexOf("/my/index.php") == -1) {
								my_url = '/my/index.php';
							}
							window.location.href = my_url;
						}
					else
						{
							$('#loginsubmit').html('ВОЙТИ');
							$('#reg_error').text(data);
							$('#autolog').val('');
						}
				});
				
			/*var login_body = '{\
				"UserName":"'+$('#email').val()+'",\
				"Password":"e10adc3949ba59abbe56e057f20f883e"\
				}';

			var xhr = new XMLHttpRequest();
			xhr.open("POST", 'https://sstest.e-teleport.ru/auth/credentials?ClientType=www&ClientVersion=1.0', true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onreadystatechange = function() 
			{ 
				if (xhr.readyState != 4) return;
				console.log(xhr.responseText);	
				console.log(xhr.getAllResponseHeaders());
				var login_body1 = '';
				var xhr1 = new XMLHttpRequest();
				xhr1.open("POST", 'https://sstest.e-teleport.ru/Contacts_Get?format=json', true);
				xhr1.setRequestHeader('Content-Type', 'application/json');
				xhr1.withCredentials = true;
				xhr1.onreadystatechange = function() 
				{ 
					if (xhr1.readyState != 4) return;
					console.log(xhr1.responseText);	
					console.log(xhr1.getAllResponseHeaders());
				}
				xhr1.send(login_body1);				
			}		
			xhr.send(login_body);*/

				
	});

	$('.close_line div, #back-button').click(function(e) {
		/*$('#back-window').remove();
		$('.modal_back').remove();
		$('#auth_scr').remove();*/
		window.location.href = window.location.href;
	});
	$('#forget').click(function(e) {
		$('#login-window').hide();
		$.get('/auth/forget.php', function(result) {
				$('.modal_back').append(result);
				$('#restore_form #email').val($('#login_form #email').val());
			});
	});
	$('.checkbox').click(function(e) {
		$(this).toggleClass('checkbox_clicked');
	});
	$(document).ready(function(e)
	{
		if($('#autolog').val() == 'Y') {
			$("#login_form").submit();
		}
		/*arSizes = getPageSize();
		$('#back-window').height(arSizes[3]);*/
		
	});
</script>