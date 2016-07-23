<?
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

$TLP_obj = unserialize($_SESSION["TLP_obj"]);

$arContacts	= array();
$arGroups	= array();
$lastContacts = array();

$arFnc = array();
$res = $TLP_obj->telecall('Contacts_Get', $arFnc);

$today = new DateTime();
$tDate = $today->format('d.m.Y');
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
		if(($arCnt['group']=='Канал общих контактов') || ($arCnt['group']=='Канал личных контактов') || ($arCnt['group']=='Канал личных контактов') || ($arCnt['group']=='Канал Teleport') || ($arCnt['group']=='Канал заблокированых контактов')){
			$arGr['status'] = 'system';
		}
		$arGroups[$group] = $arGr;
	}
	
	if(!($arCnt['activedate'] == "")) {
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
	$arGr['group'] = 'Канал Teleport';
	$arGr['groupinfo'] = 'Teleport channel';
	$arGr['sortnum'] = 990;
	$arGr['status'] = 'system';
	$arGroups['Канал Teleport'] = $arGr;
}
if(!(array_key_exists('Канал заблокированных контактов', $arGroups)))
{
	$arGr = array();
	$arGr['group'] = 'Канал заблокированных контактов';
	$arGr['groupinfo'] = 'Blocked contacts channel';
	$arGr['sortnum'] = 999;
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

<table class="cnt-channel-list">
	<tr class="cnt-channel selected" data-channel-name="Все контакты" data-channel-status="system" data-sort-num="-30">
		<td>
			<div style="display: inline-block; vertical-align: middle;">Все контакты</div>
			<div id="btn-add-channel" rel="tooltip" title="Добавить новый канал"></div>
		</td>
	</tr>
	<tr class="cnt-channel" data-channel-name="Последние контакты" data-channel-status="system" data-sort-num="-25">
		<td>
			<div style="display: inline-block; vertical-align: middle;">Последние контакты</div>
			<div class="btn-channel-menu"></div>
		</td>
	</tr>
		<?
		foreach ($arGroups as $key=>$value) {?>
			<tr class="cnt-channel" data-channel-name="<?=$value["group"]?>" data-channel-status=<?=$value["status"]=='system'?"system":"user"?> data-sort-num="<?=$value["sortnum"]?>">
				<td>
					<div style="display: inline-block; vertical-align: middle;"><?=$value["group"]?></div>
					<div class="btn-channel-menu"></div>
				</td>
			</tr>
		<?}?>
</table>

<table class="cnt-contact-list">
	<tr>
		<th width="24" align="left"><input type="checkbox" id="cnt-select-all"></th>
		<th width="52">
			<div>
				<div id="btn-contact-move" style="display: inline-block; vertical-align: middle; background: url('/my/data/svg/expand_more.svg'); width: 32px; height: 32px"></div>
			</div>
		</th>
		<th width="240" align="left"><input type="text" id="cnt-contact-search" placeholder="Введите имя или e-mail контакта..."></th>
		<th width="240"></th>
		<th width="240"></th>
		<th width="90"></th>
	</tr>
	<?
	foreach ($res as $cnt) {?>
		<tr <?=array_key_exists($cnt['activedate'].'_'.$cnt['fullname'], $lastContacts)?'class="cnt-contact cnt-recent"':'class="cnt-contact"'?> data-cnt-id="cnt-<?=$cnt["user_id"]?>" data-cnt-name="<?=$cnt['name']?>" data-channel-name="<?=$cnt["groupname"]?>" data-search-exp="<?=mb_strtolower($cnt['name'],'UTF-8').'_ins_'.mb_strtolower($cnt['fullname'],'UTF-8')?>"> 
			<td width="24" align="left"><input type="checkbox" class="cnt-checked" <?=$cnt['name'] == "support@e-teleport.ru"?"disabled":""?> data-cnt-id="cnt-<?=$cnt["user_id"]?>" data-cnt-name="<?=$cnt['name']?>" data-channel-name="<?=$cnt["groupname"]?>"></td>
			<td width="50">
				<div>
					<?if($cnt["photo_id"] == '') 
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
						<div class="cnt_avatar cnt_avatar_small" style="background-image: url(<?='/my/ajax/files.php?a=prev&i='.$cnt["photo_id"]?>);"></div>
					<?}?>
				</div>
			</td>
			<td class="cnt-fullname" width="240"><?=$cnt["fullname"]?></td>
			<td class="cnt-channel-name" width="240"><?=$cnt["groupname"]?></td>
			<td width="240"><?=$cnt["name"]?></td>
			<td width="90">
				<div class="cnt-contact-menu" style="display: none;">
					<a href="#" rel="tooltip" title="Просмотр контакта" class="cnt-contact-view" style="display: inline-block; vertical-align: middle; background-image: url('/include/cnt-info.png'); background-size: cover; width: 20px; height: 20px"></a>
					<a href="#" rel="tooltip" title="Удалить контакт" class="cnt-contact-delete" style="display: inline-block; vertical-align: middle; background-image: url('/include/cnt-delete.png'); background-size: cover; width: 20px; height: 20px"></a>
					<a href="#" rel="tooltip" title="<?=$cnt['groupname'] == 'Канал заблокированных контактов'?'Разблокировать контакт':'Заблокировать контакт'?>" class="cnt-contact-lock" style="display: inline-block; vertical-align: middle; background-image: <?=$cnt['groupname'] == "Канал заблокированных контактов"?"url('/include/cnt-unlock.png')":"url('/include/cnt-lock.png')"?>; background-size: cover; width: 20px; height: 20px"></a>
				</div>
			</td> 
		</tr>
	<?}?>
</table>