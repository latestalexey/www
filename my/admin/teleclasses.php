<?
class CTSession
{
	private $user_ID;
	private $pass_hash;
	private $session_ID;
	private $cookies;
	private $arDefault = array();
	
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
				$fields[$key] = new CURLFile($file['tmp_name']);
			//$fields[$key] = '@'.$file['tmp_name'];
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
	
	function get($func) {
		$sock = fsockopen("".$this->TLP_PREFIX."".$this->TLP_HOST, $this->TLP_PORT, $errno, $errstr, 30);
		if (!$sock) die("$errstr ($errno)\n");

		fwrite($sock, "GET /".$func." HTTP/1.0\r\n");
		fwrite($sock, "Host: ".$this->TLP_HOST."\r\n");
		fwrite($sock, "Content-type: application/json; charset=utf-8;\r\n");
		fwrite($sock, "Content-length: " . strlen($str_data) . "\r\n");
		fwrite($sock, "Cookie: ".$this->str_cookies."\r\n");
		fwrite($sock, "\r\n");

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

	function LightInit()
	{
		$this->str_cookies = $_COOKIE['tl_ck'];
		$this->TLP_HOST = 'wbs.e-teleport.ru';
		$this->TLP_PORT = '443';
		$this->TLP_PREFIX = 'ssl://';
		$this->getErrorTable();
		return true;
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
	
	function getErrorTable() {
		$this->mistakes['0'] = "Ошибок нет";
		$this->mistakes['1'] = "Пользователь не найден в системе Телепорт";
		$this->mistakes['2'] = "Контакт не найден в системе Телепорт";
		$this->mistakes['3'] = "Ваша сессия отключена, возможно у Вас долго не было связи с системой Телепорт.";
		$this->mistakes['4'] = "Неверный идентификатор сообщения или недостаточно прав доступа";
		$this->mistakes['5'] = "Отправленное приглашение не найдено или было удалено";
		$this->mistakes['6'] = "Адрес электронной почты не уникален";
		$this->mistakes['7'] = "Неверный e-mail или пароль";
		$this->mistakes['8'] = "Не удалось записать изменения или изменения приняты частично";
		$this->mistakes['9'] = "Некорректно указаны имя пользователя, e-mail или пароль";
		$this->mistakes['10'] = "Неверный e-mail";
		$this->mistakes['11'] = "Некорректный тип сообщения";
		$this->mistakes['12'] = "Ошибка подключения к системе Телепорт. Повторите попытку позже";
		$this->mistakes['13'] = "Контакт уже существует в вашем списке контактов. Отправка приглашения не нужна.";
		$this->mistakes['14'] = "Пользователь уже активирован";
		$this->mistakes['15'] = "Неверный код с картинки";
		$this->mistakes['16'] = "Не удалось отправить код подтверждения на указанную почту, некорректный почтовый адрес или ошибка почтовой системы.";
		$this->mistakes['17'] = "Неверный код подтверждения";
		$this->mistakes['18'] = "Время подтверждения пользователя истекло";
		$this->mistakes['19'] = "Не удалось подтвердить запрос контакта";
		$this->mistakes['20'] = "Не удалось удалить контакт";
		$this->mistakes['21'] = "Не удалось заблокировать контакт";
		$this->mistakes['22'] = "Исчерпан лимит попыток подтверждения пользователя";
		$this->mistakes['23'] = "Не удалось разблокировать запрос контакта";
		$this->mistakes['24'] = "Неизвестная ошибка сервера. Повторите попытку позже";
		$this->mistakes['26'] = "Контакт не найден в заблокированном списке";
		$this->mistakes['27'] = "Размер фотографии больше разрешенного (макс. 4Мб)";
		$this->mistakes['28'] = "Попытка изменения данных другого пользователя";
		$this->mistakes['29'] = "Неизвестный тип данных";
		$this->mistakes['30'] = "Нет прав читать сообщение или некорректный ИД сообщения";
		$this->mistakes['31'] = "Не удалось загрузить каталог товаров";
		$this->mistakes['32'] = "Не удалось обновить остатки товаров";
		$this->mistakes['33'] = "При добавлении группы: пользователь уже входит в другую группу";
		$this->mistakes['34'] = "Группа с указанным наименованием уже существует";
		$this->mistakes['35'] = "Не удалось добавить группу пользователей";
		$this->mistakes['36'] = "Пользователь не явлется администратором группы";
		$this->mistakes['37'] = "Не удалось очистить таблицу группы пользователей при удалении";
		$this->mistakes['38'] = "Не удалось удалить пруппу пользователей";
		$this->mistakes['39'] = "Приглашение контакту уже было отправлено";
		$this->mistakes['40'] = "Контакт вас заблокировал в своем списке. Вы не можете обмениваться с ним сообщениями, пока он Вас не разблокирует.";
		$this->mistakes['41'] = "Отправитель или получатель указаны некорректно";
		$this->mistakes['42'] = "Обработанные заказы редактировать запрещено";
		$this->mistakes['43'] = "Не удалось отправить смс, возможно некорректный телефон";
		$this->mistakes['44'] = "Некорректный статус сообщения";
		$this->mistakes['45'] = "Перед созданием группы Вам необходимо в личном кабинете указать и подтвердить свой e-mail";
		$this->mistakes['46'] = "Участника своей группы удалять или блокировать запрещено.";
		$this->mistakes['47'] = "Запрос на добавление участника своей группы не нужен.";
		$this->mistakes['48'] = "Ваш контакт не найден в списке контактов получателя, возможно он вас удалил из списка своих контактов.";
		$this->mistakes['49'] = "Ваше приглашение контакту еще не подтверждено. Дождитесь ответа на приглашение от контакта для отправки сообщений.";
		$this->mistakes['50'] = "Нет возможности отправить заказ получателю. Недостаточный лимит зазазов у получателя.";
		$this->mistakes['51'] = "Пользователь заблокировал прием документов на свое имя. Не удалось отправить заказ..";
		$this->mistakes['52'] = "Пользователь заблокировал прием сообщений на свое имя. Не удалось отправить сообщение.";
		$this->mistakes['53'] = "Пользователь заблокировал прием файов на свое имя. Не удалось отправить сообщение.";
		$this->mistakes['54'] = "Пользователи не входят в одну группу";
		$this->mistakes['55'] = "Цикличная переадресация";
		$this->mistakes['56'] = "Пользователь не активирован, Вам необходимо подтвердить свой e-mail";
		$this->mistakes['57'] = "Пересылаемое сообщение не найдено или было удалено из системы";
		$this->mistakes['58'] = "Пересылка заказов запрещена";
		$this->mistakes['59'] = "Вы не можете пригласить сами себя";
		$this->mistakes['61'] = "У вас в настройках заблокирован обмен сообщениями. Не удалось отправить сообщение.";
		$this->mistakes['62'] = "У вас в настройках заблокирован обмен файлами. Не удалось отправить сообщение.";
		$this->mistakes['63'] = "Некорректный статус файлов";
		$this->mistakes['64'] = "Неверный старый пароль";
		$this->mistakes['65'] = "Пустое сообщение. Сообщение не содержит файлов или текст.";
		$this->mistakes['66'] = "В сообщении может быть только один файл";
		$this->mistakes['67'] = "Контакт по умолчанию, нельзя удалять или редактировать.";
		$this->mistakes['68'] = "Нет прав просматривать информацию о контакте, который отсутствует в списке ваших контактов";
		$this->mistakes['69'] = "Контакт не найден в списке ваших контактов. Для обмена сообщениями необходимо отправить приглашение контакту и получить согласие на ваш запрос.";
		$this->mistakes['70'] = "Контакт еще не принял ваше приглашение, просмотр сведений о нем и его каталога невозможен";
		$this->mistakes['71'] = "Контакт вас заблокировал или удалил из списка своих контактов, просмотр его каталога невозможен.";
		$this->mistakes['72'] = "Контакт не найден в списке ваших контактов, просмотр его каталога невозможен.";
		$this->mistakes['73'] = "Документ не найден в системе или у вас нет прав доступа к нему.";
		$this->mistakes['74'] = "Групповая рассылка документов невозможно, получатель должен быть один.";
		$this->mistakes['75'] = "Документ с указанным идентификатором не найден в системе или не правильно указаны отправитель и получатель";
		$this->mistakes['76'] = "Неверный идентификатор документа, в системе уже присутствует несколько документов.";
		$this->mistakes['77'] = "Запрещено обрабатывать и корректировать документы более 7 дней.";
		$this->mistakes['78'] = "У вас в настройках заблокирован обмен документами. Не удалось отправить документ.";
		$this->mistakes['79'] = "Документ не может содержать вложенные файлы";
		$this->mistakes['80'] = "Некорректный тип документа";
		$this->mistakes['81'] = "Не указан статус документа или статус указан неверно";
		$this->mistakes['82'] = "Не указана валюта документа";
		$this->mistakes['83'] = "У контакта нет каталога";
		$this->mistakes['84'] = "Не удалось создать файл каталога";
		$this->mistakes['85'] = "Некорректный тип документа";
		$this->mistakes['86'] = "Статус документа отправленного в Телепорт не может быть 'Новый'";
		$this->mistakes['87'] = "Статус документа отправленного в первый раз может быть только 'Отправлен'";
		$this->mistakes['88'] = "Отсутствует дата документа или дата указана некорректно";
		$this->mistakes['89'] = "Некорректный заголовок документа. В docHeader не присутствуют все обязательные поля (article,name,quantity,confirmed,price,sum,unit)";
		$this->mistakes['90'] = "В таблице документа присутствуют строки без наименования или идентификатора товара";
		$this->mistakes['91'] = 'Некорректный статус документа. Документ с статусом "Отправлен" может быть переведен только в статусы "Отменен", "Передан в обработку" или "На согласовании"';
		$this->mistakes['92'] = "Статус отмененного документа изменить нельзя.";
		$this->mistakes['93'] = 'Некорректный статус документа. Документ с статусом "На согласовании" может быть переведен только в статусы "Отправлен" или "Подтвержден"';
		$this->mistakes['94'] = 'Некорректный статус документа. Документ с статусом "Передан в обработку" может быть переведен только в статусы "Готов к отгрузке" или "Выполнен"';
		$this->mistakes['95'] = "Отправитель и получатель документа не может быть изменен.";
		$this->mistakes['96'] = "Номер документа не может быть изменен";
		$this->mistakes['97'] = "Нет полей с указанными именами";
		$this->mistakes['98'] = "Опубликованный каталог отсутствует или нет к нему доступа";
		$this->mistakes['99'] = "Не удалось очистить цены перед загрузкой";
		$this->mistakes['100'] = "Не удалось установить цены";
		$this->mistakes['101'] = "Контакт не найден в списке ваших контактов";
		$this->mistakes['102'] = "Не удалось установить имя контакта";
		$this->mistakes['103'] = "При привязке к команде, необходимо указать ее имя.";
		$this->mistakes['104'] = "Нет прав доступа. Добавлять, редактировать и удалять компании и торговые точки команды может только администратор команды.";
		$this->mistakes['105'] = "Нет прав доступа. Компанию или торговую точку можно добавить только к своему профилю.";
		$this->mistakes['106'] = "Не удалось найти команду или неверное имя команды";
		$this->mistakes['107'] = "Торговая точка с указанным названием у вас уже существует.";
		$this->mistakes['108'] = "Торговая точка с указанным ИД не найдена";
		$this->mistakes['109'] = "Не удалось удалить торговую точку. Возможно указан некорректный ИД";
		$this->mistakes['110'] = "Компания с указанным названием у вас уже существует.";
		$this->mistakes['111'] = "Компания с указанным ИД не найдена";
		$this->mistakes['112'] = "Контакт не привязан к команде";
		$this->mistakes['113'] = "Нет прав доступа. Член команды может удалить из команды только себя, остальных может удалить только  администратор команды.";
		$this->mistakes['114'] = "Пользователь уже зарегистрирован в команде. Пользователь не может одновременно быть в двух командах.";
		$this->mistakes['115'] = "Пользователю уже отправлен запрос на добавление к команде. Необходимо дождаться ответа.";
		$this->mistakes['116'] = "У вас нет запросов от команд.";
		$this->mistakes['117'] = "Запрос на добавление в команду уже был успешно подтвержден.";
		$this->mistakes['118'] = "В режиме LoadMode = load недостаточно параметров для выгрузки (должен быть указан Items или Categories)";
		$this->mistakes['119'] = "При инициализации и фиксации выгрузки каталога все параметры кроме LoadMode должны быть пустые";
		$this->mistakes['120'] = "В корзине товар с такими параметрами не найден";
		$this->mistakes['121'] = "Каталог не является публичным, у вас нет прав просматривать каталог";
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
