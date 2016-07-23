<?
//$sock = fsockopen("51.254.69.66", 15671, $errno, $errstr, 30);
//$sock = fsockopen("ssl://sstest.e-teleport.ru", 443, $errno, $errstr, 30);

$TLP_HOST = "sstest.e-teleport.ru";
$TLP_PORT = 443;

function post_req($name, $arParameters) {
	$str_data = json_encode($arParameters);

	$sock = fsockopen("ssl://".$GLOBALS['TLP_HOST'], $GLOBALS['TLP_PORT'], $errno, $errstr, 30);
	if (!$sock) die("$errstr ($errno)\n");
		
	  $func_name = $name."?format=json";	
	  if($name=='Users_Login') {
		$func_name = '/auth/credentials?format=json&ClientType=www&ClientVersion=1.0.0';
	  }
	  elseif($name=='Users_Logout'){
		$func_name = '/auth/logout?format=json';
	  } 
	fwrite($sock, "POST /".$func_name." HTTP/1.0\r\n");
	fwrite($sock, "Host: ".$GLOBALS['TLP_HOST']."\r\n");
	fwrite($sock, "Content-type: application/json; charset=utf-8;\r\n");
	fwrite($sock, "Content-length: " . strlen($str_data) . "\r\n");
	fwrite($sock, "\r\n");
	fwrite($sock, $str_data);

	$headers = '';
	$ss_cookie = array();
	while ($str = trim(fgets($sock, 4096)))
	{
		if($name=='Users_Login') {
			$tempArr = explode(':',$str);
			if(strtolower($tempArr[0]) == 'set-cookie') {
				$cookArr = explode(';', $tempArr[1]);
				$cookArr = explode('=', $cookArr[0]);
				$ss_cookie[trim($cookArr[0])] = trim($cookArr[1]);
			}
		}	
		$headers .= "$str\n";
	}	
	//echo "\n";

	$body = "";
	while (!feof($sock)){
		$body .= fread($sock, 4096);
	}
	fclose($sock);

	if($name == 'MD5') {
		return $body;
	}
	else {
		$res = json_decode($body, true);
		if(array_key_exists('retval',$res)){
			$res['return']=$res['retval'];
			unset($res['retval']);
		}
		if($name=='Users_Login') {
			$res['cookies'] = $ss_cookie;
		}	
		return $res;
	}	
}?>