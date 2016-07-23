<?require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/auth/adds.php");?>
<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();?>
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

$login = $_POST['username'];
$password = $_POST['password'];

if($_POST['autolog'] == 'Y') {

	if(isset($_COOKIE['tlp_sid'])) {
		$ciphertext_dec = base64_decode($_COOKIE['tlp_sid']);
		$ciphertext_dec = encryptString($ciphertext_dec, 'ZfpDLCk7');
		$arPass = explode(':',$ciphertext_dec);
		$login = $arPass[0];
		$password = $arPass[1];
	}
}
$enc_pass = post_req('MD5', array('input'=>$password));
$session_id = "";
$user_id = "";
$login_res = post_req('Users_Login',array('UserName'=>$login, 'Password'=>$enc_pass));
if(!is_array($login_res["ResponseStatus"]) || !is_array($login_res)) {
	$USER->Logout();
	echo var_dump($login_res);
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
	if(!($_POST['norem'] == 'true')) {
		$arPass = ''.$login.':'.$password;
		$arPass = encryptString($arPass, 'ZfpDLCk7');
		$ciphertext_base64 = base64_encode($arPass);
		setcookie('tlp_sid',$ciphertext_base64,time()+(7*365*24*60*60),'/');
	}	
	
	include ($_SERVER["DOCUMENT_ROOT"]."/my/admin/init.php");
}
else
{
	$USER->Logout();
	echo 'Неверный e-mail или пароль пользователя';
	die();
}	
?>
