<?require_once($_SERVER["DOCUMENT_ROOT"]."/auth/adds.php");
$check_res = array();
$check_res['return'] = true;
$check_res['errMessage'] = '';

if ($_POST['email'] == '')
{
	$check_res['return'] = false;
	$check_res['style_obj'] = 'email';
	$check_res['errMessage'] = 'Не указан e-mail';
}
elseif ($_POST['password'] == '')
{
	$check_res['return'] = false;
	$check_res['style_obj'] = 'password';
	$check_res['errMessage'] = 'Не указан пароль';
}
elseif (strlen($_POST['password'])<5)
{
	$check_res['return'] = false;
	$check_res['style_obj'] = 'password';
	$check_res['errMessage'] = 'Длина пароля должна быть не менее 5-ти символов';
}

if(!$check_res['return'])
{
	echo json_encode($check_res);
	die();
}
else {
	//$client = new SoapClient("http://wbs.b-teleport.ru/msg_mher/ws/msg.1cws?wsdl");//, array('login'=>"teleport", 'password'=>"3tJxaZfpDLCk7Ddp"));
	$check_res = post_req('Users_CheckName',array('username'=>$_POST['email'],'usermail'=>$_POST['email'],'userphone'=>'+79111234578'));//ERR_TLP
	if(!$check_res['return'])
	{
		$check_res['style_obj'] = 'email';
		echo json_encode($check_res);
		die();
	}
}	
$pass_hash = post_req('MD5',array('input'=>$_POST['password']));

$res = post_req('Users_Registration',array('username'=>$_POST['email'], 'pass_hash'=>$pass_hash, 'usermail'=>$_POST['email'], 'userphone'=>''));
$err_code = $res['return'];
if(!$err_code == 0)
{
	$check_res['return'] = false;
	$check_res['style_obj'] = 'email';
	if($err_code == 9)
		{$check_res['errMessage'] = 'Некорректно указаны e-mail или пароль';}
	elseif($err_code == 12)
		{$check_res['errMessage'] = 'Ошибка регистрации. Повторите попытку позже';}
	elseif($err_code == 16)
		{$check_res['errMessage'] = 'Не удалось отправить код подтверждения на указанную почту, некорректный почтовый адрес или ошибка почтовой системы.';}
	else
		{$check_res['errMessage'] = 'Неизвестная ошибка в системе. Код '.$err_code.' Повторите попытку позже';}
	
	echo json_encode($check_res);
	
}
else {
	$check_res['return'] = true;
	$check_res['style_obj'] = '';

	echo json_encode($check_res);
}	
?>