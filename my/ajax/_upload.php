<?
//Добавлена ветка для обработки операции добавления логотипа организации
if($operID == 'usr-addLogo')
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
		$path = "/upload/tmp/".$im_name;
		if(file_exists($_SERVER["DOCUMENT_ROOT"].$path)) {
			unlink(realpath($_SERVER["DOCUMENT_ROOT"].$path));
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
			imagejpeg($new_image, $_SERVER["DOCUMENT_ROOT"].$path); 
			imagedestroy($new_image);
			imagedestroy($image);
		}	
		else {
			rename($filename , $_SERVER["DOCUMENT_ROOT"].$path);
		} 
		
		chmod($_SERVER["DOCUMENT_ROOT"].$path, 0777);
		$arResult['operID'] = $operID;
		$arResult['img'] = $path.'?'.mt_rand();
		$arResult['info'] = $file_info;
		$arResult['err'] = 0;
		echo json_encode($arResult);
	}	
}
?>