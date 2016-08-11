<?
class CTSession
{
	private $user_ID;
	private $pass_hash;
	private $session_ID;
	private $cookies;
	private $arDefault;
	
	//public $soapobj;
	public $str_cookies;
	public $user_info = array();
	public $mistakes = array();
	public $TLP_HOST = '';
	public $TLP_PORT = '';
	public $TLP_PREFIX = '';
	
	function datapost($func, $arParameters) {
		$postData = $arParameters['post'];
		$files = $arParameters['files'];
		
		$url = 'https://'.$this->TLP_HOST.'/'.$func.'?format=json';
		$header = array('Content-Type: multipart/form-data');
		
		$fields = array();
		foreach($postData as $key => $val) { 
			$fields[$key] = $val;
		}
		foreach($files as $key => $file) { 
			$fields[$key] = '@'.$file['tmp_name'];
		}

		$resource = curl_init();
		curl_setopt($resource, CURLOPT_URL, $url);
		curl_setopt($resource, CURLOPT_HTTPHEADER, $header);
		curl_setopt($resource, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($resource, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($resource, CURLOPT_POST, 1);
		curl_setopt($resource, CURLOPT_POSTFIELDS, $fields);
		curl_setopt($resource, CURLOPT_COOKIE, $this->str_cookies);		
		$result = curl_exec($resource);
		curl_close($resource);	

		foreach($files as $key => $file) { 
			unlink($file['tmp_name']);
		}
				
		return $result;
	}
	
	function post($str_data, $func) {
		$sock = fsockopen("".$this->TLP_PREFIX."".$this->TLP_HOST, $this->TLP_PORT, $errno, $errstr, 30);
		if (!$sock) die("$errstr ($errno)\n");
		
		fwrite($sock, "POST /".$func."?format=json HTTP/1.0\r\n");
		fwrite($sock, "Host: ".$this->TLP_HOST."\r\n");
		fwrite($sock, "Content-type: application/json; charset=utf-8;\r\n");
		fwrite($sock, "Content-length: " . strlen($str_data) . "\r\n");
		fwrite($sock, "Cookie: ".$this->str_cookies."\r\n");
		fwrite($sock, "\r\n");
		fwrite($sock, $str_data);

		$headers = "";
		while ($str = trim(fgets($sock, 4096)))
		$headers .= "$str\n";
		//echo "\n";

		$body = "";
		while (!feof($sock)){
			$body .= fread($sock, 4096);
		}
		fclose($sock);
		return $body;
	}
	
	function filepost($func) {
		$str_data = '';
		$sock = fsockopen("".$this->TLP_PREFIX."".$this->TLP_HOST, $this->TLP_PORT, $errno, $errstr, 30);
		if (!$sock) die("$errstr ($errno)\n");
		
		fwrite($sock, "GET /".$func." HTTP/1.0\r\n");
		fwrite($sock, "Host: ".$this->TLP_HOST."\r\n");
		fwrite($sock, "Content-type: application/json; charset=utf-8;\r\n");
		fwrite($sock, "Content-length: " . strlen($str_data) . "\r\n");
		fwrite($sock, "Cookie: ".$this->str_cookies."\r\n");
		fwrite($sock, "\r\n");
		fwrite($sock, $str_data);

		
		$headers = "";
		while ($str = trim(fgets($sock, 4096)))
		$headers .= "$str\n";
		//echo "\n";

		$body = "";
		while (!feof($sock)){
			$body .= fread($sock, 4096);
		}
		
		return $body;
	}

	function telecall($name, $arParameters)
	{
		$soap_array = $this->arDefault;
		foreach($arParameters as $key => $value)
		{
			$soap_array[$key] = $value;
		}
		
		$str_data = json_encode($soap_array);
		$res = $this->post($str_data, $name);
		if($name == 'MD5') {
			return $res;
		}
		elseif ($name == 'Messages_Get' || $name == 'Messages_GetNew' || $name == 'Messages_Request' || $name == 'filesList') {
			return $res;
		}
		else {
			$res = json_decode($res, true);
			if(array_key_exists('retval',$res)){
				$res['return']=$res['retval'];
				unset($res['retval']);
			}
			return $res;
		}	
	}

	function Init($arrData)//, $client, $pass)
	{
		$this->user_ID = $arrData['UserID'];
		$this->session_ID = $arrData['SessionID'];
		$this->cookies = $arrData['cookies'];
		
		$str_cookies = '';
		foreach($arrData['cookies'] as $key => $value)
		{
			$str_cookies .= ''.$key.'='.$value.';';
			setcookie($key,$value,0,'/',$GLOBALS['TLP_HOST']);

		}
		$this->str_cookies = $str_cookies;
		
		$this->arDefault = array();
		
		$this->user_info['name'] = $arrData['UserName'];
		$this->user_info['fullname'] = $arrData['DisplayName'];
		
		$this->TLP_HOST = $GLOBALS['TLP_HOST'];
		$this->TLP_PORT = $GLOBALS['TLP_PORT'];
		$this->TLP_PREFIX = $GLOBALS['TLP_PREFIX'];
		return true;
	}
	/*function InitNewPass($pass)//, $client)
	{
		$this->pass_hash = $pass;
		$this->arDefault = array("user_ID"=>$this->user_ID, "pass_hash"=>$this->pass_hash, "session_ID"=>$this->session_ID);

		return true;
	}*/
	
}

function get_GUID()
{
    if (function_exists('com_create_guid') === true)
    {
        return trim(com_create_guid(), '{}');
    }

    return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
}

/*function getTeleSOAP()
{
	$client = new SoapClient("http://wbs.b-teleport.ru/msg_mher/ws/msg.1cws?wsdl");//, array('login'=>"teleport", 'password'=>"3tJxaZfpDLCk7Ddp"));
	return $client;
}*/
?>
