<?
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

//$client = getTeleSOAP();
//$TLP_obj = unserialize($_SESSION["TLP_obj"]);
//$TLP_obj->soapobj = clone $client;

$operID = $_POST['operID'];

	$filename="";
	if(is_uploaded_file($_FILES["filename"]["tmp_name"]))
	{
		$filename = $_FILES["filename"]["tmp_name"];
	} 

if($operID == 'usr-addPhoto')
{
	$arResult = array();

	$im_name = 'tmp_'.$_POST["usrid"];
	$file_info = getimagesize($filename);
	if($file_info == false) {
		$arResult['err_info'] = "Некорректный формат файла.";
		$arResult['err'] = 1;
		echo json_encode($arResult);
	}
	else {
		$fullpath = "/upload/tmp/".$im_name;
		if(!file_exists($_SERVER["DOCUMENT_ROOT"]."/upload/tmp/")) {
			mkdir(realpath($_SERVER["DOCUMENT_ROOT"]."/upload/tmp/"),0777);
		}	
		if(file_exists($_SERVER["DOCUMENT_ROOT"].$fullpath)) {
			unlink(realpath($_SERVER["DOCUMENT_ROOT"].$fullpath));
		}	

		if($file_info[1] > 800) {
			if( $file_info[2] == IMAGETYPE_JPEG ) {
				$image = imagecreatefromjpeg($filename);
			} elseif( $file_info[2] == IMAGETYPE_GIF ) {
				$image = imagecreatefromgif($filename);
			} elseif( $file_info[2] == IMAGETYPE_PNG ) {
				$image = imagecreatefrompng($filename);
			}
			$height= 800;
			$ratio = $height / $file_info[1];
			$width = $file_info[0] * $ratio;

			$new_image = imagecreatetruecolor($width, $height);
			imagecopyresampled($new_image, $image, 0, 0, 0, 0, $width, $height, $file_info[0], $file_info[1]);
			imagejpeg($new_image, $_SERVER["DOCUMENT_ROOT"].$fullpath); 
			imagedestroy($new_image);
			imagedestroy($image);
		}	
		else {
			rename($filename , $_SERVER["DOCUMENT_ROOT"].$fullpath);
		} 
		
		chmod($_SERVER["DOCUMENT_ROOT"].$fullpath, 0777);
		$arResult['operID'] = $operID;
		$arResult['img'] = $fullpath.'?'.mt_rand();
		$arResult['info'] = $file_info;
		$arResult['err'] = 0;
		echo json_encode($arResult);
	}	
} else if($operID == 'usr-addLogo')
{
	$arResult = array();
	
	$im_name = 'logo_'.$_POST["usrid"];
	$file_info = getimagesize($filename);
	if($file_info == false) {
		$arResult['err_info'] = "Некорректный формат файла.";
		$arResult['err'] = 1;
		echo json_encode($arResult);
	}
	else {
		$fullpath = "/upload/tmp/".$im_name;
		if(!file_exists($_SERVER["DOCUMENT_ROOT"]."/upload/tmp/")) {
			mkdir(realpath($_SERVER["DOCUMENT_ROOT"]."/upload/tmp/"),0777);
		}	
		if(file_exists($_SERVER["DOCUMENT_ROOT"].$fullpath)) {
			unlink(realpath($_SERVER["DOCUMENT_ROOT"].$fullpath));
		}	

		if($file_info[1] > 800) {
			if( $file_info[2] == IMAGETYPE_JPEG ) {
				$image = imagecreatefromjpeg($filename);
			} elseif( $file_info[2] == IMAGETYPE_GIF ) {
				$image = imagecreatefromgif($filename);
			} elseif( $file_info[2] == IMAGETYPE_PNG ) {
				$image = imagecreatefrompng($filename);
			}
			$height= 500;
			$ratio = $height / $file_info[1];
			$width = $file_info[0] * $ratio;
			
			$new_image = imagecreatetruecolor($width, $height);
			imagecopyresampled($new_image, $image, 0, 0, 0, 0, $width, $height, $file_info[0], $file_info[1]);
			imagejpeg($new_image, $_SERVER["DOCUMENT_ROOT"].$fullpath); 
			imagedestroy($new_image);
			imagedestroy($image);
		}	
		else {
			rename($filename , $_SERVER["DOCUMENT_ROOT"].$fullpath);
		} 
		
		chmod($_SERVER["DOCUMENT_ROOT"].$fullpath, 0777);
		$arResult['operID'] = $operID;
		$arResult['img'] = $fullpath.'?'.mt_rand();
		$arResult['info'] = $file_info;
		$arResult['err'] = 0;
		echo json_encode($arResult);
	}	
}

?>