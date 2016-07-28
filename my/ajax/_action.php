<? //Добавлено определение url для логотипа организации(ветка getPersonInfo)
	if($arResult['company_logo'] != '') {
		$logo_url = '/my/ajax/files.php?a=detail&i='.$arResult['company_logo'].'&'.mt_rand();

		$size = getimagesize($logo_url);
	}
	else {
		$logo_url = '/include/no_avatar.svg';
	}
?>

<?
elseif($action == 'setPersonInfo'){
	$arPermitted = array("user_name", "user_fullname", "phone", "company", "duplicate_messages", "public_contact", "allow_stocks", 
		"allow_prices", "information", "deny_msgs", "deny_orders", "deny_files", "forward_to", "delivery_possible", "address", 
		"address_GPS", "delivery_info", "company_INN", "company_KPP", "company_OGRN", "company_account", "company_BIK",
		"company_bank", "company_coraccount", "company_chief", "company_buh", "company_phone", "company_activitytypes", "company_address", 
		"company_logo", "photo");

	$arParam = array();
	$photo_filename = "";
	foreach ($_POST as $key => $value) 
	{
		if(!($key == 'action' || $key=='adds'))
		{
			if(in_array($key, $arPermitted)) {
				
				if($key == 'photo' || $key == 'company_logo') {
					if($value == '') {
						$arParam[$key] = "";
					}
					else {
						$arexp = explode('?',$value); 
						$arParam[$key] = base64_encode(file_get_contents($_SERVER["DOCUMENT_ROOT"].$arexp[0]));
						$photo_filename = $_SERVER["DOCUMENT_ROOT"].$arexp[0];
					}	
				}
				else {
					$arParam[$key] = $value;
				}	
			}
		}
	}

	$arFnc = array("request_JSON"=>$arParam);
	$res = $TLP_obj->telecall('Contacts_SetPersonInfo', $arFnc);

	if(!($res['return'] == 0))
	{
		echo '%err%'.$TLP_obj->mistakes[$res['return']];
	}
	else {
		$arFnc = array('contact'=>$_POST['name']);
		$res = $TLP_obj->telecall('Contacts_GetPersonInfo', $arFnc);
		if($res['errCode'] == 0)
		{
			$arResult = $res["return"];
			if($arResult['photo_id'] != '') {
				$im_url = '/my/ajax/files.php?a=detail&i='.$arResult['photo_id'].'&'.mt_rand();
				$size = getimagesize($im_url);
			}
			else {
				$im_url = '/include/no_avatar.svg';
			}

			if($arResult['company_logo'] != '') {																																	// Добавлен код
				$logo_url = '/my/ajax/files.php?a=detail&i='.$arResult['company_logo'].'&'.mt_rand();								// для сохранения	
				$size = getimagesize($logo_url);																																		// логотипа организации
			}																																																			// на
			else {
				$logo_url = '/include/no_avatar.svg';
			}

			$TLP_obj->user_info['photo'] = '/my/ajax/files.php?a=prev&i='.$arResult['photo_id'];
			$TLP_obj->user_info['company_logo'] = '/my/ajax/files.php?a=prev&i='.$arResult['company_logo'];				// сервере TELEPORT
			$TLP_obj->user_info['name'] = $arResult['user_name'];
			$TLP_obj->user_info['fullname'] = $arResult['user_fullname'];
			$_SESSION["TLP_obj"] = serialize($TLP_obj);
			echo json_encode(array("fullname"=>$TLP_obj->user_info['fullname'], "photo"=>$TLP_obj->user_info['photo'].'?'.mt_rand(), "company_logo"=>$TLP_obj->user_info['company_logo'].'?'.mt_rand()));
			if($photo_filename != "") {
				unlink($photo_filename);
			}
		}	
	}
}
?>

<div id="cnt_photo" class="cnt_photo"> <!--	добавлен id="cnt_photo"-->	
	<img src="<?=$im_url;?>" data-width="<?=$size[0];?>" data-height="<?=$size[1];?>" data-change="0"/>
	<div id="im_line">
		<?if ($mySettings) { 
		?>
			<div id="add_photo" class="active_icon">
				<form action="/my/ajax/upload.php" method="POST" enctype="multipart/form-data" name="fs_form">
					<?include($_SERVER["DOCUMENT_ROOT"]."/my/data/svg/add_photo.svg");?>
					<input type="hidden" name="operID" value="usr-addPhoto">
					<input type="hidden" name="usrname" value="<?=$TLP_obj->user_info['name'];?>">
					<input type="hidden" name="usrid" value="<?=$TLP_obj->user_info['id'];?>">
					<input type="file" name="filename" value="" style="display: none;">
					<input type="submit" style="display: none;">
				</form>
			</div>
			<div id="clear_photo" class="active_icon"><?include($_SERVER["DOCUMENT_ROOT"]."/my/data/svg/clear.svg");?></div>
		<?}?>	
	</div>	
</div>

<!--	Begin of добавлен элемент для отображения логотипа организации -->
<div id="cnt_logo" class="cnt_photo" style="display:none">
	<img src="<?=$logo_url;?>" data-width="<?=$size[0];?>" data-height="<?=$size[1];?>" data-change="0"/>
	<div id="im_line">
		<?if ($mySettings) {
		?>
			<div id="add_photo" class="active_icon">
				<form action="/my/ajax/upload.php" method="POST" enctype="multipart/form-data" name="fs_logo">
					<?include($_SERVER["DOCUMENT_ROOT"]."/my/data/svg/add_photo.svg");?>
					<input type="hidden" name="operID" value="usr-addLogo">
					<input type="hidden" name="usrname" value="<?=$TLP_obj->user_info['name'];?>">
					<input type="hidden" name="usrid" value="<?=$TLP_obj->user_info['id'];?>">
					<input type="file" name="filename" value="" style="display: none;">
					<input type="submit" style="display: none;">
				</form>
			</div>
			<div id="clear_photo" class="active_icon"><?include($_SERVER["DOCUMENT_ROOT"]."/my/data/svg/clear.svg");?></div>
		<?}?>	
	</div>	
</div>
<!--	End of добавлен элемент для отображения логотипа организации -->