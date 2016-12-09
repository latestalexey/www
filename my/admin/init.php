<?//require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");?>
<?//if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();?>
<?
require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/teleclasses.php");

$TLP_obj = new CTSession();
$res = $TLP_obj->Init($login_res);//, $arSID["soapobj"]);
if($res)
{

	$arFnc = array("contact"=> $TLP_obj->user_info['name']);
	$res = $TLP_obj->telecall('Contacts_GetPersonInfo', $arFnc);
	if($res["errCode"] == 0)
	{
		$user_info = $res["return"];
		$TLP_obj->user_info['id'] = get_GUID();
		$TLP_obj->user_info['name'] = $user_info['user_name'];
		$TLP_obj->user_info['fullname'] = $user_info['user_fullname'];
		$TLP_obj->user_info['photo_id'] = '';
		
		if(!$res['return']['photo_id'] == '') {
			$TLP_obj->user_info['photo'] = '/my/ajax/files.php?a=prev&i='.$user_info['photo_id'];
			$TLP_obj->user_info['photo_id'] = $user_info['photo_id'];
		}	
		if(!$res['return']['company_logo'] == '') {
			$TLP_obj->user_info['company_logo'] = '/my/ajax/files.php?a=prev&i='.$user_info['company_logo'];
		}	
		$arFnc = array();
		$mistakes = $TLP_obj->telecall('Mistakes_Get', $arFnc);
		foreach ($mistakes as $mistake) 
		{
			$TLP_obj->mistakes[$mistake["errCode"]] = $mistake["description"];
		}
		$_SESSION["TLP_obj"] = serialize($TLP_obj);
	}
	elseif($res["errCode"] == 56)
	{
		echo 'Пользователь не активирован, Вам необходимо подтвердить свой e-mail';
	}	
	else
	{
		echo "Ошибка инициализации пользователя с кодом ".$res["errCode"];
	}
}	
?>
