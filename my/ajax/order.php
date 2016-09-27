<?
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

$TLP_obj = unserialize($_SESSION["TLP_obj"]);
$user = $TLP_obj->user_info['name'];
$action = strlen($_POST['action']) ? $_POST['action'] : $_GET['action'];

function json_encode_cyr($str) {
$arr_replace_utf = array('\u0410', '\u0430','\u0411','\u0431','\u0412','\u0432',
'\u0413','\u0433','\u0414','\u0434','\u0415','\u0435','\u0401','\u0451','\u0416',
'\u0436','\u0417','\u0437','\u0418','\u0438','\u0419','\u0439','\u041a','\u043a',
'\u041b','\u043b','\u041c','\u043c','\u041d','\u043d','\u041e','\u043e','\u041f',
'\u043f','\u0420','\u0440','\u0421','\u0441','\u0422','\u0442','\u0423','\u0443',
'\u0424','\u0444','\u0425','\u0445','\u0426','\u0446','\u0427','\u0447','\u0428',
'\u0448','\u0429','\u0449','\u042a','\u044a','\u042b','\u044b','\u042c','\u044c',
'\u042d','\u044d','\u042e','\u044e','\u042f','\u044f');
$arr_replace_cyr = array('А', 'а', 'Б', 'б', 'В', 'в', 'Г', 'г', 'Д', 'д', 'Е', 'е',
'Ё', 'ё', 'Ж','ж','З','з','И','и','Й','й','К','к','Л','л','М','м','Н','н','О','о',
'П','п','Р','р','С','с','Т','т','У','у','Ф','ф','Х','х','Ц','ц','Ч','ч','Ш','ш',
'Щ','щ','Ъ','ъ','Ы','ы','Ь','ь','Э','э','Ю','ю','Я','я');
$str1 = json_encode($str);
$str2 = str_replace($arr_replace_utf,$arr_replace_cyr,$str1);
return $str2;
}

if($action == 'Documents_saveDocToLocalBase')
{
	$message_id = $_POST["message_id"];
	$sender = $_POST["sender"];
	$receiver = $_POST["receiver"];
	$message = $_POST["message"];
	$type = $_POST["type"];
	$status = $_POST["status"];
	$date = $_POST["date"];
	$num = $_POST["num"];
	$sum = $_POST["sum"];
	$currencyId = $_POST["currencyId"];
	$hash = $_POST["hash"];
	$result = mysql_query ("UPDATE t_documents SET 
					sender = '$sender',
					receiver = '$receiver',
					message = '$message',
					type = '$type',
					status = '$status',
					date = '$date',
					num = '$num',
					sum = $sum,
					currencyId = '$currencyId',
					hash = '$hash'
				where message_id = $message_id and sender = '$user'") or die (mysql_error());
	echo $result;		
}
elseif($action == 'Documents_addItemToExistDoc')
{
	$sender = $_POST["sender"];
	$receiver = $_POST["receiver"];
	$item = json_decode($_POST["item"], true);
	$itemid = $item[id];
	$itemsum = $item[sum];
	$itemqty = $item[quantity];
	$result = mysql_query ("SELECT message_id, message, sum FROM t_documents WHERE sender='$user' and receiver = '$receiver' order by message_id desc limit 1") or die (mysql_error());
	$id = json_decode(mysql_result ($result,0,0));
	$message = json_decode(mysql_result ($result,0,1));
	$docsum = json_decode(mysql_result ($result,0,2));
	$totalsum = $docsum + $itemsum;
	$message->docHeader->sum = $totalsum;
	$message->docHeader->hash = '';
	$itemInDoc = 0;
	foreach ( $message->docTable as $docitem ) {
		if ($itemid  == $docitem->id) {
			$itemInDoc = 1;
			$docitem->sum = $docitem->sum + $itemsum;
			$docitem->quantity = $docitem->quantity + $itemqty;
			break;
		};
	};
	if (!$itemInDoc) {
		array_push($message->docTable, $item);
	};
	print_r($message);
	$jsonmessage = json_encode_cyr($message);
	mysql_query ("UPDATE t_documents SET sum = $totalsum, message = '$jsonmessage' where message_id = $id and sender='$user'") or die (mysql_error());
}
elseif($action == 'Documents_addNew')
{	
	$sender = $_POST["sender"];
	$receiver = $_POST["receiver"];
	$message = $_POST["message"];
	$type = $_POST["type"];
	$status = $_POST["status"];
	$date = $_POST["date"];
	$num = $_POST["num"];
	$sum = $_POST["sum"];
	$currencyId = $_POST["currencyId"];
	$hash = $_POST["hash"];
	$result = mysql_query ("INSERT INTO t_documents(message_id, sender, receiver, message, type, status, num, sum, currencyId, hash) 
					values ('$message_id', '$sender', '$receiver', '$message', '$type', '$status', '$num', '$sum', '$currencyId', '$hash')") or die (mysql_error());
	echo $result;
}
elseif($action == 'Documents_GetLastId')
{
	$receiver = $_POST["receiver"];
	$query = "SELECT message_id FROM t_documents";
	if (strlen($receiver)) $query = $query . " WHERE receiver = '$receiver'";
	$query = $query . " order by message_id desc limit 1";
	$result = mysql_query ($query) or die (mysql_error());
	$docid = mysql_result ($result,0);
	echo $docid;
}
elseif($action == 'Documents_GetList')
{
	$filters = json_decode($_POST["filters"]);
	$query = "SELECT message_id, sender, receiver, type, status, date, num, sum, currencyId, hash FROM t_documents WHERE sender = '$user'";
	foreach($filters as $key=>$filter) {
		$query = $query . " AND ".$filter->name." ".$filter->operation." '".$filter->value."'";
	};
	$result = mysql_query ($query) or die (mysql_error());
	$data = array();
	while($row=mysql_fetch_assoc($result)) {
		$arr['message_id'] = $row['message_id'];
		$arr['sender'] = $row['sender'];
		$arr['receiver'] = $row['receiver'];
		$arr['type'] = $row['type'];
		$arr['status'] = $row['status'];
		$arr['date'] = $row['date'];
		$arr['num'] = $row['num'];
		$arr['sum'] = $row['sum'];
		$arr['currencyId'] = $row['currencyId'];
		$arr['hash'] = $row['hash'];
		array_push($data, $arr);
	};
	echo json_encode($data);
}
elseif($action == 'Documents_GetById')
{
	$message_ID = $_POST["message_id"];
	$result = mysql_query ("SELECT message FROM t_documents WHERE message_id=$message_ID and sender = '$user'") or die (mysql_error());
	$message = mysql_result ($result,0);
	echo $message;
}
elseif($action == 'Documents_getItemPosInfo')
{	
	$receiver = $_POST["receiver"];
	$query = "SELECT message FROM t_documents WHERE sender='$user' and receiver = '$receiver' order by message_id desc limit 1";
	$result = mysql_query ($query) or die (mysql_error());
	$data = mysql_result ($result,0);
	echo $data;
}
elseif($action == 'upl_pos_from_xls')
{
	function readExelFile($filepath){
		require_once 'PHPExcel.php';
		$arPos=array(); 
		$inputFileType = PHPExcel_IOFactory::identify($filepath);
		$objReader = PHPExcel_IOFactory::createReader($inputFileType);
		$objPHPExcel = $objReader->load($filepath); 
		$arPos = $objPHPExcel->getActiveSheet()->toArray();
		return $arPos; 
	};
	if (!empty($_FILES['Filedata'])) {
		$arPos =  readExelFile($_FILES['Filedata']['tmp_name']);
	};
	function filterPos($var){
		return($var[0] != null);
	};
	echo json_encode_cyr(array_filter($arPos, "filterPos"));	
}
elseif($action == 'Positions_SaveErrors')
{
	$today = date("d-m-Y_His");
	//$fname = iconv('cp1252', 'utf-8', $_POST['filename']);
	//$filename = substr($fname, 0, strrpos($fname, '.')-1).'_errors_'.$today.'.xlsx';
	$filename = 'errors_'.$today.'.xlsx';
	$arError = json_decode($_POST['arError']);
	require_once 'PHPExcel.php';
	$phpexcel = new PHPExcel();
	$page = $phpexcel->setActiveSheetIndex(0); 
	foreach($arError as $key=>$order){
		++$key;
		$page->setCellValue('A'.$key, $order[0], PHPExcel_Cell_DataType::TYPE_STRING);
		$page->setCellValueExplicit('B'.$key, $order[1], PHPExcel_Cell_DataType::TYPE_STRING);
		$page->setCellValue('C'.$key, $order[2], PHPExcel_Cell_DataType::TYPE_STRING);
	}
	$objWriter = PHPExcel_IOFactory::createWriter($phpexcel, 'Excel2007');
	$objWriter->save($filename);
	echo $filename;
}
elseif($action == 'Positions_DownloadErrors')
{
	$filename = $_GET['filename'];
	print_r($_POST);
	if (file_exists($filename)) {
		while (ob_get_level()) {
			ob_end_clean();
		};
		header('Content-Description: File Transfer');
		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: attachment; filename='.basename($filename));
		header('Content-Transfer-Encoding: binary');
		header('Expires: 0');
		header('Cache-Control: must-revalidate');
		header('Pragma: public');
		header('Content-Length: '.filesize($filename));
		readfile($filename);
		unlink($filename);
		exit;
	};
}
elseif($action == 'Documents_delSentDoc')
{	
	$docid = $_POST["message_id"];
	$receiver = $_POST["receiver"];
	$query = "DELETE FROM t_documents WHERE message_id=$docid AND sender='$user' AND receiver = '$receiver'";
	$result = mysql_query ($query) or die (mysql_error());
};


?>
