<?
	require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
	require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

	$TLP_obj = unserialize($_SESSION["TLP_obj"]);
	//var_dump($TLP_obj);

	//$arFnc = array();
	//$arFnc = array('requestXML'=>$req_XML, 'rtype'=>'json');
	$arFnc = array('GroupName'=>'Команда Teleport');

	$res = $TLP_obj->telecall('ContactGroup_GetList', $arFnc);
	//$res = $TLP_obj->telecall('Contacts_Get', $arFnc);
	//var_dump($res);
?>