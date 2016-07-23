<?//require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");?>
<title>TELEPORT</title>
<?
	$cl_style = 'display: none;';
	$autoLogin = 'Y';
	if($_POST['auth_init'] == "N") {
		echo '%%auth_failed%%';
	}
	else {
		include($_SERVER["DOCUMENT_ROOT"]."/auth/index.php");
	}	
	die();
?>