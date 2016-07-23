<?require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/teleclasses.php");
if(!isset($_SESSION["TLP_obj"]))
{
	$cl_style = 'display: none;';
	$autoLogin = 'Y';
	if($_POST['auth_init'] == "N") {
		echo '%%auth_failed%%';
	}
	else {
		include($_SERVER["DOCUMENT_ROOT"]."/auth/index.php");
	}	
	die();
}
elseif (!($_POST['ui'] == ''))
{
	$TLP_obj = unserialize($_SESSION["TLP_obj"]);
	if(!($_POST['ui'] == $TLP_obj->user_info['id'])) 
	{
		if($_POST['auth_init'] == "N") {
			echo '%%auth_failed%%';
		}
		else {
			$page = $APPLICATION->GetCurPage(true);
			localRedirect($_SERVER["DOCUMENT_ROOT"].$page);
		}	
		die();
	}
}
?>