<?
	require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
	require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

	$TLP_obj = unserialize($_SESSION["TLP_obj"]);
	
	//$params = array('GroupName'=>'my-squad-3', 'GroupFullName'=>'rbaklanov test squad');
	//$roster = $TLP_obj->telecall('ContactGroup_Add', $params);

	// $params = array('GroupName'=>'my-squad-3');
	// $roster = $TLP_obj->telecall('ContactGroup_GetList', $params);

	// $params = array();
	// $squads = $TLP_obj->telecall('Users_ContactGroups', $params);

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
	
	$cntCount = 0;
	foreach ($arContacts as $key=>$group) {
		$cntCount += Count($group);
	}
?>

<div id='cnt-statusbar'>
	<div id='cnt-userinfo'>
		<?if($TLP_obj->user_info['photo'] == '') 
		{?>
			<div class="cnt-avatar cnt-avatar-small" style="background-image: none; width: 36px; height: 36px; margin-left: 10px;">
				<svg fill="#BBB" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
					<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
					<path d="M0 0h24v24H0z" fill="none"/>
				</svg>
			</div>
		<?}
		else
		{?>
			<div class="cnt-avatar cnt-avatar-small" style="background-image: url(<?=$TLP_obj->user_info['photo']?>); width: 36px; height: 36px; margin-left: 10px;"></div>
		<?}?>
		<div>
			<p><?=$TLP_obj->user_info['fullname']?></p>
		</div>
	</div>
	<div id='cnt-settings'>
		<div id='cnt-group-selector'>
			<p>Все контакты </p>
			<div style='display: flex;'>
				<div style="width: 25px; height: 25px;">
					<img src='/my/data/svg/expand_more.svg' style='width:100%; '>
				</div>
			</div>
		</div>

		<div id='cnt-settings-menu'>
<!-- 			<div id='cnt-gear'>
				<img src='/include/cnt-gear.png'>
			</div>
			<div id='cnt-dog'>
				<img src='/include/cnt-dog.png'>
			</div> -->
			<div id='cnt-power'>
				<img src='/include/cnt-power.png'>
			</div>
		</div>
	</div>
</div>

<div id='cnt-toolbar'>
	<div id='cnt-header'>
		<p>Список каналов (<?=count($arGroups) + 2?>)</p>
	</div>
	<div id='cnt-tools'>
		<div>
			<label class="cnt-check-label"><input type='checkbox' id='cnt-select-all'><span></span></label>
		</div>
		<div id='cnt-main-menu'>
			<div rel="tooltip" title="Переместить контакты..." id="cnt-contacts-move">
				<img src='/include/cnt-move.png'>
			</div>
			<div rel="tooltip" title="Удалить контакты" id="cnt-contacts-delete">
				<img src='/include/cnt-delete.png'>
			</div>
			<div rel="tooltip" title="Заблокировать контакты" id="cnt-contacts-lock">
				<img src='/include/cnt-lock-2.png'>
			</div>
			<div rel="tooltip" title="Снять блокировку" id="cnt-contacts-unlock">
				<img src='/include/cnt-unlock-2.png'>
			</div>
		</div>
		<div id='cnt-selected-num'>
			<p>Выбрано: 0</p>
		</div>
		
		<div id='cnt-sort' data-sort-type='0'>
			<p>Сортировка: Нет</p>
		</div>
		<div id='cnt-filter'>
			<p>Фильтр: нет</p>
		</div>
		<div id='cnt-search-box'>
			<input type="text" id="cnt-search-input" placeholder="Введите имя или e-mail контакта..." style="display: none">
			<div id="cnt-search-button">
				<svg fill="#777" height="32px" version="1.1" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink">
					<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"></g>
					<path d="M19.4271164,21.4271164 C18.0372495,22.4174803 16.3366522,23 14.5,23 C9.80557939,23 6,19.1944206 6,14.5 C6,9.80557939 9.80557939,6 14.5,6 C19.1944206,6 23,9.80557939 23,14.5 C23,16.3366522 22.4174803,18.0372495 21.4271164,19.4271164 L27.0119176,25.0119176 C27.5621186,25.5621186 27.5575313,26.4424687 27.0117185,26.9882815 L26.9882815,27.0117185 C26.4438648,27.5561352 25.5576204,27.5576204 25.0119176,27.0119176 L19.4271164,21.4271164 L19.4271164,21.4271164 Z M14.5,21 C18.0898511,21 21,18.0898511 21,14.5 C21,10.9101489 18.0898511,8 14.5,8 C10.9101489,8 8,10.9101489 8,14.5 C8,18.0898511 10.9101489,21 14.5,21 L14.5,21 Z" id="search"></path>
				</svg>
			</div>
		</div>
	</div>
</div>

<div id='cnt-content'>
	<div id='cnt-group-list'>
		<div id='cnt-group-add'>
			<div>
				<img src='/include/add-channel.png'>
			</div>
		</div>
		<div id='get-newgroup-name' style="display: none;">
			<div>
				<input class="cnt_inp" id="text-newgroup-name" type="text" placeholder="Введите имя нового канала" value="">
			</div>
			<div>
				<button class="menu-button" id="button-ok">ОК</button>
				<!-- <button class="menu_button" id="button-cancel">Отмена</button> -->
			</div>
		</div>

		<div class="cnt-group selected" data-group-name="Все контакты" data-group-status="system" data-sort-num="-30">
			<div class="cnt-group-avatar">
				<div>
					<img src='/include/cnt-lock-2.png'>
				</div>
			</div>
			<div class="cnt-group-name">
				<p>Все контакты (<?=$cntCount?>)</p>
			</div>
			<div class="cnt-group-menu" style='display: flex; width: 25px; display: none;'>
				<div style="width: 25px; height: 25px;">
					<img src='/my/data/svg/expand_more.svg' style='width:100%;'>
				</div>
			</div>
		</div>

		<div class="cnt-group" data-group-name="Последние контакты" data-group-status="system" data-sort-num="-25">
			<div class="cnt-group-avatar"> 
				<div>
					<img src='/include/cnt-lock-2.png'>
				</div>
			</div>
			<div class="cnt-group-name"> 
				<p>Последние контакты (<?=count($lastContacts)?>)</p>
			</div>
			<div class="cnt-group-menu" style='display: flex; width: 25px; display: none;'>
				<div style="width: 25px; height: 25px;">
					<img src='/my/data/svg/expand_more.svg' style='width:100%;'>
				</div>
			</div>
		</div>

		<?
		foreach ($arGroups as $key=>$value) {?>
		<div class="cnt-group" data-group-name="<?=$value["group"]?>" data-group-status=<?=$value["status"]=='system'?"system":"user"?> data-sort-num="<?=$value["sortnum"]?>">
			<div class="cnt-group-avatar">
				<div>
					<img src='/include/cnt-lock-2.png'>
				</div>
			</div>
			<div class="cnt-group-name">
				<p><?=$value["group"]?> (<?=count($arContacts[$key])?>)</p>
			</div>
			<div class="cnt-group-menu" style='display: flex; width: 25px; display: none;'>
				<div style="width: 25px; height: 25px;">
					<img src='/my/data/svg/expand_more.svg' style='width:100%;'>
				</div>
			</div>
		</div>
		<?}?>
	</div>

	<div id='cnt-contact-list'>
		<?
		foreach ($arContacts as $key=>$group) {
			foreach ($group as $key2=>$cnt) {?>
			<div <?=array_key_exists($cnt['activedate'].'_'.$cnt['fullname'], $lastContacts)?'class="cnt-contact cnt-recent"':'class="cnt-contact"'?> data-cnt-id="cnt-<?=$cnt["user_id"]?>" data-cnt-name="<?=$cnt['name']?>" data-group-name="<?=$cnt["group"]?>" data-search-exp="<?=mb_strtolower($cnt['name'],'UTF-8').mb_strtolower($cnt['fullname'],'UTF-8')?>"> 
				
				<div class='cnt-contact-check'>
					<label class="cnt-check-label"><input type='checkbox' class='cnt-check' <?=$cnt['group'] == "Команда Teleport"?"disabled":""?> data-cnt-id="cnt-<?=$cnt["user_id"]?>" data-cnt-name="<?=$cnt['name']?>" data-group-name="<?=$cnt["group"]?>"><span></span></label>
				</div>

				<div style='display: flex; width: 20; margin-left: 10px'>
					<div style="width: 20px; height: 20px;">
						<img src='/include/cnt-star-3.png' style='width:100%;'>  
					</div>
				</div>
				<?if($cnt['photo'] == '') 
				{?>
				<div class="cnt-avatar cnt-avatar-small" style="background-image: none; width: 36px; height: 36px; margin: 0 10px 0 10px;"> 
					<svg fill="#BBB" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
						<path d="M0 0h24v24H0z" fill="none"/>
					</svg>
				</div>
				<?}
				else
				{?>
					<div class="cnt-avatar cnt-avatar-small" style="background-image: url(<?=$cnt['photo']?>); width: 36px; height: 36px; margin: 0 10px 0 10px;"></div>
				<?}?>	

				<div class="cnt-contact-name">
					<p><?=$cnt["fullname"]?></p>
				</div>
				<div class="cnt-contact-group">
					<p><?=$cnt["group"]?></p>
				</div>
				<div class="cnt-contact-menu">
					<div rel="tooltip" title="Просмотр контакта" class="cnt-contact-view">
						<img src='/include/cnt-info.png'>
					</div>
					<div rel="tooltip" title="Удалить контакт" class="cnt-contact-delete">
						<img src='/include/cnt-delete.png'>
					</div>
					<div rel="tooltip" title="<?=$cnt['group'] == 'Канал заблокированных контактов'?'Разблокировать контакт':'Заблокировать контакт'?>" class="cnt-contact-lock">
						<img src='/include/cnt-lock-2.png'>
					</div>
				</div>
			</div>
			<?}
		}?>
	</div>
</div>
