<?require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/auth/adds.php");
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
$action = $_POST['action'];
$adds = $_POST['adds'];
if($action == 'restorePassword')
{
	$arFnc = array();
	foreach ($_POST as $key => $value) 
	{
		if(!($key == 'action' || $key=='adds'))
			{$arFnc[$key] = $value;}
	}	
	$res=post_req('Users_RestorePassword',$arFnc);
	if($res['return'] == 0)
	{
		echo '';
	}
	elseif ($res['return'] == 10)
	{
		echo '%err%e-mail не найден в системе';
	}
	else
	{
		echo '%err%Ошибка соединения с сервером. КОД:'.$res['return'];
	}
}
elseif($action == 'confirmPasswordRestore')
{
	$arFnc = array();
	foreach ($_POST as $key => $value) 
	{
		if(!($key == 'action' || $key=='adds'))
			{$arFnc[$key] = $value;}
	}	
	$arFnc['new_hash'] = post_req('MD5',array('input'=>$arFnc['new_hash']));
	$res = post_req('Users_ConfirmPasswordRestore',$arFnc);
	if($res['return'] == 0)
	{
		echo '';
	}
	elseif ($res['return'] == 10)
	{
		echo '%err%e-mail не найден в системе';
	}
	elseif ($res['return'] == 17)
	{
		echo '%err%Неверный код восстановления.<br>
		Запросите восстановление пароля еще раз';
	}
	elseif ($res['return'] == 18)
	{
		echo '%err%Срок действия кода восстановления истек.<br>
		Запросите восстановление пароля еще раз';
	}
	else
	{
		echo '%err%Ошибка соединения с сервером. КОД:'.$res['return'];
	}
}?>
