<?php
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

$msgStatus = array(); 
$msgStatus['new'] = 'Новый';
$msgStatus['sent'] = 'Отправлен';
$msgStatus['delivered'] = 'Доставлен';
$msgStatus['viewed'] = 'Просмотрен';


	$TLP_obj = unserialize($_SESSION["TLP_obj"]);
	$user =  $TLP_obj->user_info['name'];
	$filename = 'doclist.xlsx';
	$arFnc = array();
	foreach ($_GET as $key => $value) 
	{
		if(!($key == 'action' || $key=='header' || $key=='adds'))
			{$arFnc[$key] = $value;}
	}	
	$adds = $_GET['adds'];
	$res = $TLP_obj->telecall('Documents_GetList', $arFnc);

	if($res['errCode'] == 0)
	{
		$arResult = json_decode($_GET['header']);
		require_once 'PHPExcel.php';
		$phpexcel = new PHPExcel();

		$page = $phpexcel->setActiveSheetIndex(0); 
		$page->mergeCells('A1:F1'); 
		$page->getStyle('A1:F2')->getFont()->setBold(true);
		$page->getStyle('A1')->getFont()->setSize(16);
		$page->setCellValue("A1", $arResult[0]);
		$page->setCellValue("A2", $arResult[1]);
		$page->setCellValue("B2", $arResult[2]);
		$page->setCellValue("C2", $arResult[3]);
		$page->setCellValue("D2", $arResult[4]);
		$page->setCellValue("E2", $arResult[5]);
		$page->setCellValue("F2", $arResult[6]);
		$page->getColumnDimension('A')->setWidth(20);
		$page->getColumnDimension('B')->setWidth(20);
		$page->getColumnDimension('C')->setWidth(20);
		$page->getColumnDimension('D')->setWidth(20);
		$page->getColumnDimension('E')->setWidth(20);
		$page->getColumnDimension('F')->setWidth(20);
		$page->getRowDimension('1')->setRowHeight(30);
		$page->getRowDimension('2')->setRowHeight(30);
		
		$page->setTitle("Лист1"); 

		$arOrders = json_decode($res["return"], true);
		
		$i = 3;
		$cnt = count($arOrders) + $i;
		foreach($arOrders as $key=>$order)
		{
			$doc_type = "Заказ";
			$doc_num = $order['order']["message_N"];
			$msg_date = DateTime::createFromFormat('Y-m-d H:i:s', str_replace("T"," ",$order['order']["message_date"]));
			$str_date = ($msg_date === false)?(""):($msg_date->format('d-m-Y'));
			$contact = ($order["sender"] == $TLP_obj->user_info['name'])?($order["receiverFullname"]):($order["senderFullname"]);
			$doc_sum = number_format($order["order"]["docsum"], 2, '.', ' ');
			$doc_status = $msgStatus[$order["status"]];
			
			$page->setCellValue('A'.$i, $doc_type);
			$page->setCellValue('B'.$i, $doc_num);
			$page->setCellValue('C'.$i, $str_date);
			$page->setCellValue('D'.$i, $contact);
			$page->setCellValue('E'.$i, $doc_sum);
			$page->setCellValue('F'.$i, $doc_status);
			
			
			$i++;
		}
		$page->getStyle('A1:F'.$cnt)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$page->getStyle('A1:F'.$cnt)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
		$objWriter = PHPExcel_IOFactory::createWriter($phpexcel, 'Excel2007');
		$objWriter->save($user.'_'.$filename);

	}	
	else {
		echo '%err%'.$TLP_obj->mistakes[$res['errCode']];
	};
	

	if (file_exists($user.'_'.$filename)) {
		
		while (ob_get_level()) {
			ob_end_clean();
		}
		header('Content-Description: File Transfer');
		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: attachment; filename='.basename($filename));
		header('Content-Transfer-Encoding: binary');
		header('Expires: 0');
		header('Cache-Control: must-revalidate');
		header('Pragma: public');
		header('Content-Length: '.filesize($user.'_'.$filename));
		readfile($user.'_'.$filename);
		unlink($user.'_'.$filename);
		exit;
	};	
?>
