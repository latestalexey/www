<?
	require_once $_SERVER["DOCUMENT_ROOT"]."/my/ajax/PHPExcel.php";
	require_once $_SERVER['DOCUMENT_ROOT'].'/my/ajax/PHPExcel/IOFactory.php';
	$objPHPExcel = PHPExcel_IOFactory::load($_SERVER['DOCUMENT_ROOT'].'/my/ajax/partner-tmpl.xlsx');
	var_dump($_GET["phone"]);

	$objPHPExcel->setActiveSheetIndex(0);
	$objWorksheet = $objPHPExcel->getActiveSheet();

	$objWorksheet->getCell('B5')->setValue($_GET["name"]);
	$objWorksheet->getCell('E7')->setValue($_GET["INN"].'/'.$_GET["KPP"]);
	$objWorksheet->setCellValueExplicit('E8', $_GET["OGRN"], PHPExcel_Cell_DataType::TYPE_STRING);
	$objWorksheet->getCell('E9')->setValue($_GET["address"]);
	$objWorksheet->setCellValueExplicit('E11', $_GET["account"], PHPExcel_Cell_DataType::TYPE_STRING);
	$objWorksheet->getCell('E12')->setValue($_GET["bank"]);
	$objWorksheet->setCellValueExplicit('E13', $_GET["BIK"], PHPExcel_Cell_DataType::TYPE_STRING);
	$objWorksheet->setCellValueExplicit('E14', $_GET["coraccount"], PHPExcel_Cell_DataType::TYPE_STRING);
	$objWorksheet->getCell('E15')->setValue($_GET["chief"]);
	$objWorksheet->getCell('E16')->setValue($_GET["buh"]);
	$objWorksheet->setCellValueExplicit('E17', $_GET["phone"], PHPExcel_Cell_DataType::TYPE_STRING);

	ob_end_clean();
	header_remove();

	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header("Content-Disposition:attachment;filename='partner.xlsx'");
	header('Cache-Control: max-age=0');

	$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');

	$objWriter->save('php://output');
?>