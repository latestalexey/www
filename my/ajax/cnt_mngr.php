<?
	require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
	require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

	$TLP_obj = unserialize($_SESSION["TLP_obj"]);

	$arContacts	= array();
	$arGroups	= array();
	$lastContacts = array();

	/*$req_XML = '<?xml version="1.0" encoding="utf-8"?><teleport><field name="user_id"/><field name="photo_url"/></teleport>';
	$arFnc = array('requestXML'=>$req_XML, 'rtype'=>'json');*/
	$arFnc = array();
	$res = $TLP_obj->telecall('Contacts_Get', $arFnc);

	//if($res["errCode"] == 0){
		$today = new DateTime();
		$tDate = $today->format('d.m.Y');
		
		//$contacts_result = json_decode($res["return"], true);
		//$contacts = $contacts_result['result'];

		foreach ($res as $cnt) {
			$name = $cnt["name"];
			$group = $cnt["groupname"];
			
			$arCnt = array();
			$arCnt['user_id'] = get_GUID();
			$arCnt['group'] = $group;
			$arCnt['name'] = $name;
			$arCnt['fullname'] = $cnt["fullname"];
			$arCnt['groupinfo'] = $cnt["groupinfo"];
			$arCnt['membergroupname'] = $cnt["membergroupname"];
			$arCnt['membergroupfullname'] = $cnt["membergroupfullname"];
			$arCnt['sortnum'] = $cnt["sortnum"];
			$arCnt['activedate'] = ($cnt["activedate"] == '0001-01-01T00:00:00.0000000')?(''):($cnt["activedate"]);
			$arCnt['photo'] = ($cnt["photo_id"] == '')?(''):('/my/ajax/files.php?a=prev&i='.$cnt["photo_id"]);

			$arContacts[$group][$name] = $arCnt;

			if(!(array_key_exists($group, $arGroups)))
			{
				$arGr = array();
				$arGr['group'] = $group;
				$arGr['groupinfo'] = $arCnt['groupinfo'];
				$arGr['sortnum'] = $arCnt['sortnum'];
				if(($arCnt['group']=='Канал общих контактов') || ($arCnt['group']=='Канал личных контактов') || ($arCnt['group']=='Канал приглашенных контактов') || ($arCnt['group']=='Канал Teleport') || ($arCnt['group']=='Канал заблокированных контактов') || ($arCnt['group']=='Команда Teleport')){
					$arGr['status'] = 'system';
				}
				$arGroups[$group] = $arGr;
			}
			
			if($arCnt['activedate'] != "") {
				$date = new DateTime($arCnt['activedate']);
				$cDate = $date->format('d.m.Y');
				
				if($cDate == $tDate) {
					$strDate = $date->format("H:i");}
				else {
					$strDate = $cDate;
				}
				
				$arCnt['strDate'] = $strDate;
				
				$strIndex = $arCnt['activedate'].'_'.$arCnt['fullname'];
				$lastContacts[$strIndex] = $arCnt;
			}	
		}

	krsort($lastContacts);

	if(!(array_key_exists('Канал общих контактов', $arGroups))){
		$arGr = array();
		$arGr['group'] = 'Канал общих контактов';
		$arGr['groupinfo'] = 'General channel (unsorted)';
		$arGr['sortnum'] = -15;
		$arGr['status'] = 'system';
		$arGroups['Канал общих контактов'] = $arGr;
	}
	if(!(array_key_exists('Канал личных контактов', $arGroups))){
		$arGr = array();
		$arGr['group'] = 'Канал личных контактов';
		$arGr['groupinfo'] = 'Personal contacts channel';
		$arGr['sortnum'] = -12;
		$arGr['status'] = 'system';
		$arGroups['Канал личных контактов'] = $arGr;
	}

	if(!(array_key_exists('Канал приглашенных контактов', $arGroups))){
		$arGr = array();
		$arGr['group'] = 'Канал приглашенных контактов';
		$arGr['groupinfo'] = 'Invited contacts channel';
		$arGr['sortnum'] = -10;
		$arGr['status'] = 'system';
		$arGroups['Канал приглашенных контактов'] = $arGr;
	}
	if(!(array_key_exists('Канал Teleport', $arGroups))){
		$arGr = array();
		$arGr['group'] = 'Команда Teleport';
		$arGr['groupinfo'] = 'Teleport channel';
		$arGr['sortnum'] = 990;
		$arGr['status'] = 'system';
		$arGroups['Команда Teleport'] = $arGr;
	}
	if(!(array_key_exists('Канал заблокированных контактов', $arGroups))){
		$arGr = array();
		$arGr['group'] = 'Канал заблокированных контактов';
		$arGr['groupinfo'] = 'Blocked contacts channel';
		$arGr['sortnum'] = 999;
		$arGr['status'] = 'system';
		$arGroups['Канал заблокированных контактов'] = $arGr;
	}
	
	uasort($arGroups, 'arSortByNum');
?>

<table class="cnt-statusbar" width="100%" align="left">
	<tr>
		<td>
			<div style="display:inline-block; vertical-align: middle">
				<?if($TLP_obj->user_info['photo'] == '') 
				{?>
				<div class="cnt_avatar cnt_avatar_small" style="background-image: none; width:36px; left:0">
					<svg fill="#BBB" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
						<path d="M0 0h24v24H0z" fill="none"/>
					</svg>
				</div>
				<?}
				else
				{?>
					<div class="cnt_avatar cnt_avatar_small" style="background-image: url(<?=$TLP_obj->user_info['photo']?>); vertical-align: middle"></div>
				<?}?>
			</div>
			<div id="cnt-current-user" style="margin:0; display:inline-block; padding: 10px"><?=$TLP_obj->user_info['fullname']?></div>
		</td>
		<td id="cnt-selected-num" align="right">
			<div>
				<p id="href-selected-list" style="display: inline-block; vertical-align: middle; border-bottom: 1px dashed black; text-align:center; cursor:pointer; margin: 0 10px">Выбрано: 0</p>
				<div id="btn-selected-list" style="display: none; vertical-align: middle; background: url('/my/data/svg/expand_more.svg'); width: 32px; height: 32px"></div>
			</div>
		</td>		
	</tr>
</table>

<table class="cnt-channel-list" style = "display: block; table-layout: fixed; max-height: 495px; max-width: 300px; overflow-y: scroll">
	<tr class="cnt-channel selected" data-channel-name="Все контакты" data-channel-status="system" data-sort-num="-30">
		<td height="45" width="240">
			<div style="display: inline-block; vertical-align: middle;">Все контакты</div>
		</td>
		<td height="45" width="60">
			<div id="btn-add-channel" rel="tooltip" title="Добавить новый канал"></div>
		</td>
	</tr>
	<tr class="cnt-channel" data-channel-name="Последние контакты" data-channel-status="system" data-sort-num="-25">
		<td height="45" width="240">
			<div style="display: inline-block; vertical-align: middle;">Последние контакты</div>
		</td>
		<td height="45" width="60">
			<div class="btn-channel-menu"></div>
		</td>
	</tr>
		<?
		foreach ($arGroups as $key=>$value) {?>
			<tr class="cnt-channel" data-channel-name="<?=$value["group"]?>" data-channel-status=<?=$value["status"]=='system'?"system":"user"?> data-sort-num="<?=$value["sortnum"]?>">
				<td height="45" width="240">
					<div style="display: inline-block; vertical-align: middle;"><?=$value["group"]?></div>
				</td>
				<td height="45" width="60">
					<div class="btn-channel-menu"></div>
				</td>
			</tr>
		<?}?>
</table>

<table class="cnt-contact-list" style = "display: block; table-layout: fixed; max-height: 495px; overflow-y: scroll; max-width: 1100px; overflow-x: hidden">
	<tr>
		<th width="24" align="left"><label class="cnt-checked-label"><input type="checkbox" id="cnt-select-all"><span></span></label></th>
		<th width="60">
			<!--<div>
				<div id="btn-contact-move" style="display: inline-block; vertical-align: middle; background: url('/my/data/svg/expand_more.svg'); width: 32px; height: 32px"></div>
			</div>-->
		</th>
		<th height="45" width="280">
			<div id="cnt-contacts-menu" style="float: left">
				<a href="#" rel="tooltip" title="Переместить контакты..." id="cnt-contacts-move" style="display: inline-block; vertical-align: middle; background-image: url('/include/cnt-info.png'); background-size: cover; width: 32px; height: 32px"></a>
				<a href="#" rel="tooltip" title="Удалить контакты" id="cnt-contacts-delete" style="display: inline-block; vertical-align: middle; background-image: url('/include/cnt-delete.png'); background-size: cover; width: 32px; height: 32px"></a>
				<a href="#" rel="tooltip" title="Заблокировать контакты" id="cnt-contacts-lock" style="display: inline-block; vertical-align: middle; background-image: url('/include/cnt-lock.png'); background-size: cover; width: 32px; height: 32px"></a>				
				<a href="#" rel="tooltip" title="Снять блокировку" id="cnt-contacts-unlock" style="display: inline-block; vertical-align: middle; background-image: url('/include/cnt-unlock.png'); background-size: cover; width: 28px; height: 28px"></a>
			</div>
		</th>
		<th width="610" align="right" colspan="3">
			<div id="cnt-search-box">
				<input type="text" id="cnt-contact-search" placeholder="Введите имя или e-mail контакта..." style="display:none">
				<div id="cnt-search-button">
					<svg fill="#777" height="32px" version="1.1" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink">
						<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"></g>
						<path d="M19.4271164,21.4271164 C18.0372495,22.4174803 16.3366522,23 14.5,23 C9.80557939,23 6,19.1944206 6,14.5 C6,9.80557939 9.80557939,6 14.5,6 C19.1944206,6 23,9.80557939 23,14.5 C23,16.3366522 22.4174803,18.0372495 21.4271164,19.4271164 L27.0119176,25.0119176 C27.5621186,25.5621186 27.5575313,26.4424687 27.0117185,26.9882815 L26.9882815,27.0117185 C26.4438648,27.5561352 25.5576204,27.5576204 25.0119176,27.0119176 L19.4271164,21.4271164 L19.4271164,21.4271164 Z M14.5,21 C18.0898511,21 21,18.0898511 21,14.5 C21,10.9101489 18.0898511,8 14.5,8 C10.9101489,8 8,10.9101489 8,14.5 C8,18.0898511 10.9101489,21 14.5,21 L14.5,21 Z" id="search"></path>
					</svg>
				</div>
			</div>
		</th>
	</tr>
	<?
	foreach ($arContacts as $key=>$group) {
		foreach ($group as $key2=>$cnt) {?>
			<tr <?=array_key_exists($cnt['activedate'].'_'.$cnt['fullname'], $lastContacts)?'class="cnt-contact cnt-recent"':'class="cnt-contact"'?> data-cnt-id="cnt-<?=$cnt["user_id"]?>" data-cnt-name="<?=$cnt['name']?>" data-channel-name="<?=$cnt["group"]?>" data-search-exp="<?=mb_strtolower($cnt['name'],'UTF-8').'_ins_'.mb_strtolower($cnt['fullname'],'UTF-8')?>"> 
				<td height="45" width="24" align="left"><label class="cnt-checked-label"><input type="checkbox" class="cnt-checked" <?=$cnt['name'] == "telebot"?"disabled":""?> data-cnt-id="cnt-<?=$cnt["user_id"]?>" data-cnt-name="<?=$cnt['name']?>" data-channel-name="<?=$cnt["group"]?>"><span></span></label></td>
				<td height="45" width="60">
					<div>
						<?if($cnt['photo'] == '') 
						{?>
						<div class="cnt_avatar cnt_avatar_small" style="background-image: none; width:36px;">
							<svg fill="#BBB" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
								<path d="M0 0h24v24H0z" fill="none"/>
							</svg>
						</div>
						<?}
						else
						{?>
							<div class="cnt_avatar cnt_avatar_small" style="background-image: url(<?=$cnt['photo']?>);"></div>
						<?}?>
					</div>
				</td>
				<td height="45" class="cnt-fullname" width="280"><?=$cnt["fullname"]?></td>
				<td height="45" class="cnt-channel-name" width="240"><?=$cnt["group"]?></td>
				<td height="45" width="250"><?=$cnt["name"]?></td>
				<td height="45" width="120">
					<div class="cnt-contact-menu" style="display: none; float: right">
						<a href="#" rel="tooltip" title="Просмотр контакта" class="cnt-contact-view" style="display: inline-block; vertical-align: middle; background-image: url('/include/cnt-info.png'); background-size: cover; width: 32px; height: 32px"></a>
						<a href="#" rel="tooltip" title="Удалить контакт" class="cnt-contact-delete" style="display: inline-block; vertical-align: middle; background-image: url('/include/cnt-delete.png'); background-size: cover; width: 32px; height: 32px"></a>
						<a href="#" rel="tooltip" title="<?=$cnt['group'] == 'Канал заблокированных контактов'?'Разблокировать контакт':'Заблокировать контакт'?>" class="cnt-contact-lock" style="display: inline-block; vertical-align: middle; background-image: <?=$cnt['group'] == "Канал заблокированных контактов"?"url('/include/cnt-unlock.png')":"url('/include/cnt-lock.png')"?>; background-size: cover; width: 32px; height: 32px"></a>
					</div>
				</td> 
			</tr>
		<?}
	}?>
</table>

<?
	$letters = array();

	foreach ($arContacts as $key=>$group) {
		foreach ($group as $key2=>$cnt) {
			$letter = substr($cnt['fullname'], 0, 1);
			if(!in_array($letter, $letters)){
				array_push($letters, $letter);
			}
		}
	}
	sort($letters);
?>

<table class="cnt-sort-list" style="display: block; table-layout: fixed; max-height: 450px; overflow-y: scroll; margin-top: 45px; margin-left: 0; ">
	<?
		foreach ($letters as $letter) {?>
			<tr>
				<td height="45" width="25" align="middle" class="cnt-letter"><?=$letter?></td>
			</tr>
	<?}?>
</table>