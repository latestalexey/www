<?
	require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
	require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

	//$client = getTeleSOAP();
	$TLP_obj = unserialize($_SESSION["TLP_obj"]);
	//$TLP_obj->soapobj = clone $client;

	$arResult = array();

	$dir = $_SERVER["DOCUMENT_ROOT"]."/upload/tmp/";
	var i=0;

	foreach (new DirectoryIterator($dir) as $fileInfo) {
		if ($fileInfo->isDot() || $fileInfo->isDir()) continue;
		arResult[i++] = $dir.$fileInfo->getFilename();

		/*printf(
		'<img src="/path/img/%s" width="250px" />%s', 
		$fileInfo->getFilename(),
		PHP_EOL
		);*/
		var_dump($arResult);
		echo json_encode($arResult);
	}
?>