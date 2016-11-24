<?
ob_start();
define("ADMIN_SECTION", true);
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

$TLP_obj = unserialize($_SESSION["TLP_obj"]);
$action = $_GET['a'];
$file_ID = $_GET['i'];
//$filename = ($_GET['fn'] == '')?($file_ID):($_GET['fn']);
if($action == 'prev') {
	$url = 'files/prev/'.$file_ID;
}
if($action == 'prev') {
	$url = 'files/prev/'.$file_ID;
} elseif($action == 'pics_prev') {
	$url = '/Catalog_Pics/prev/'.file_ID;

} elseif($action == 'pics') {
	$url = '/Catalog_Pics/'.file_ID;

} elseif($action == 'catalog') {
	$url = '/Catalog_GetSharedCatalog?'.$file_ID;

} else {
	$url = 'files/'.$file_ID;
}

ob_end_clean();
header_remove();

$str_data = '';
$sock = fsockopen("".$TLP_obj->TLP_PREFIX."".$TLP_obj->TLP_HOST, $TLP_obj->TLP_PORT, $errno, $errstr, 180);
if (!$sock) die("$errstr ($errno)\n");

header('Content-Description: File Transfer');
header('Content-Transfer-Encoding: binary');
header('Cache-Control: max-age=0');
		
fwrite($sock, "GET /".$url." HTTP/1.0\r\n");
fwrite($sock, "Host: ".$TLP_obj->TLP_HOST."\r\n");
fwrite($sock, "Content-type: application/json; charset=utf-8;\r\n");
fwrite($sock, "Content-length: " . strlen($str_data) . "\r\n");
fwrite($sock, "Cookie: ".$TLP_obj->str_cookies."\r\n");
fwrite($sock, "\r\n");
fwrite($sock, $str_data);

$headers = "";
while ($str = trim(fgets($sock, 4096))) {
	if(!strpos(strtolower($str),'content-type')){
		header($str);
	}
	elseif(!strpos(strtolower($str),'content-disposition')){
		header($str);
	}
	elseif(!strpos(strtolower($str),'content-length')){
		header($str);
	}
	$headers .= "$str\n";
}
while (!feof($sock)){
	print fread($sock, 8192);
	flush();
}
fclose($sock);