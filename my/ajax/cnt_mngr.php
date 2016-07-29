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

			/*$arCnt['activedate'] = $cnt["activedate"];
			$arCnt['photo'] = '';
			if(is_array($cnt['user_info'])){
				foreach ($cnt['user_info'] as $key=>$value) {
					if($key == 'photo_url' && (!$value == '')) {
						$arCnt['photo'] = $value;
					}
					else {
						$arCnt[$key] = $value;
					}	
				}
			}*/
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
	//}
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

<table class="cnt-channel-list" style = "display: block; table-layout: fixed; max-height: 495px; overflow-y: scroll">
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

<script>
	function showProgressBar(label, max_value){
		$('#cnt-manager').append('<div class="modal_back back_curt"></div>');
		var htmlProgressWindow = $('\
								<div id="progress-window" class="modal_window">\
									<p>' + label +'</p>\
									<progress id="progressbar" value="0" max="' + max_value + '"></progress>\
								</div>\
							');

			$('#cnt-manager').append(htmlProgressWindow);

			showModalWindow($('#progress-window'));
	}

	function hideProgressBar(){
		hideModalWindow($('#progress-window'));
		$('.modal_back').remove();
	}

	function cntCheck(checkbox){
		var cnt_id = $(checkbox).attr('data-cnt-id');
		var channel_name = $(checkbox).attr('data-channel-name');
		var cnt_checked = $('.cnt-contact-list').find('[class*="cnt-contact"][data-cnt-id="' + cnt_id + '"][data-channel-name="' + channel_name + '"]');
		var cnt_selected = $('#cnt-selected-list ul').find('[data-cnt-id="' + cnt_id + '"][data-channel-name="' + channel_name + '"]');
		var checked = $(checkbox).prop('checked');

		if(checked){
			if($(cnt_selected).length==0)
				$('#cnt-selected-list ul').append('<li data-cnt-id="' + cnt_id + '" data-channel-name="' + channel_name + '">' + $(checkbox).parent().next('td').next('td').text() + '</li>');
			$(cnt_checked).addClass('checked');
		}
		else{
			$(cnt_selected).remove();
			$(cnt_checked).removeClass('checked');
		}
	}

	$('.cnt-letter').on('click', function(e){
		var letter = $(this).text();

		$('.cnt-contact').hide();

		$('.cnt-contact').find('[class*="cnt-fullname"]').filter(function(){
			return $(this).text().substr(0, 1) == letter;
		}).parent().show();
	});

	$('.cnt-checked').on('click', function(e){
		cntCheck($(this));

		calcSelectedItems();
	});

	$('#cnt-select-all').on('click', function(e){
		var is_checked = $('#cnt-select-all').prop('checked');

		var checkbox_checked = $('.cnt-checked:visible').not('.cnt-checked:disabled');

		$(checkbox_checked).prop('checked', is_checked);

		$(checkbox_checked).each(function(i, elem){
			cntCheck($(elem));
		});

		calcSelectedItems();
	});

	$("#cnt-search-box").on('click',"#cnt-search-button", function(e) {
		e.stopPropagation();
		if($(this).prev('input').css('display') == 'none') {
			$(this).css('border-radius', '0 5px 5px 0');
			$(this).prev('input').css('display', 'inline-block');
			$(this).prev('input').animate({'width': 400}, 300);
			$(this).prev('input').focus();
			$(this).html('<svg class="transform_icon" fill="#777" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">\
						<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>\
						<path d="M0 0h24v24H0z" fill="none"></path>\
					</svg>');
		}
		else {
			$(this).css('border-radius', '5px');
			$(this).prev('input').animate({'width': 10}, 300);
			$(this).prev('input').css('display', 'none');
			$(this).prev('input').val('');
			$(this).html('<svg fill="#777" height="32px" version="1.1" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink">\
							<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"></g>\
							<path d="M19.4271164,21.4271164 C18.0372495,22.4174803 16.3366522,23 14.5,23 C9.80557939,23 6,19.1944206 6,14.5 C6,9.80557939 9.80557939,6 14.5,6 C19.1944206,6 23,9.80557939 23,14.5 C23,16.3366522 22.4174803,18.0372495 21.4271164,19.4271164 L27.0119176,25.0119176 C27.5621186,25.5621186 27.5575313,26.4424687 27.0117185,26.9882815 L26.9882815,27.0117185 C26.4438648,27.5561352 25.5576204,27.5576204 25.0119176,27.0119176 L19.4271164,21.4271164 L19.4271164,21.4271164 Z M14.5,21 C18.0898511,21 21,18.0898511 21,14.5 C21,10.9101489 18.0898511,8 14.5,8 C10.9101489,8 8,10.9101489 8,14.5 C8,18.0898511 10.9101489,21 14.5,21 L14.5,21 Z" id="search"></path>\
						</svg>');

			updateContactList();
		}
	});

	$('#cnt-contact-search').on('keyup', function(){
		var inp_str = $(this).val();
		if(inp_str == '') {
			$('.cnt-contact').show();
			return;
		}

		var s_str = inp_str.toLowerCase();
		s_str = encodeString(s_str);
		$(this).removeClass('cnt-not-found');

		var obj = $('.cnt-contact-list').find('[data-search-exp*='+s_str+']');
		if(!obj.length)
			$(this).addClass('cnt-not-found');

		$('.cnt-contact').hide();
		obj.show();
	});

	$('#btn-add-channel').on('click', function(e){
		addNewChannel();
	});

	$('#href-selected-list').on('click', function(e){
		updateContactList(true);
	});

	$('#btn-selected-list').on('click', function(e){
		e.stopPropagation();

		var selectedItems = $('.cnt-checked:checked').length;
		if(selectedItems){
			var htmlSelectedList = '';

			cntList = $('.cnt-contact-list').find('[class*="cnt-contact"][class*="checked"]');
			htmlSelectedList += '<div class="modal_back"></div><div class="modal_window" id="cnt-selected-list"><ul>'
			
			$(cntList).each(function(i, elem){
				htmlSelectedList += '<li>' + $(elem).find('[class="cnt-fullname"]').text() + '</li>';
			});
			htmlSelectedList += '</ul></div>';
		
			$('#main_content').append(htmlSelectedList);
			
			if($('#cnt-selected-list ul').is(':hidden'))
				$(this).css("background", "url('/my/data/svg/expand_less.svg')");
			else
				$(this).css("background", "url('/my/data/svg/expand_more.svg')");
			$(this).css("background-size", "cover");

			var offset = $(this).offset();
			$('#cnt-selected-list').offset({top:offset.top, left:offset.left-32});
			
			showModalWindow($('#cnt-selected-list'));
		}
	});

	$('#cnt-contacts-menu').on('click', function(e){
		var channelName = '';
		//(($(this).html() == 'Заблокировать') || ($(this).html() == 'Снять блокировку')) ? 'Канал заблокированных контактов' : $(this).html();
		var promise = $.when();
		var cnt_checked = $('.cnt-contact.checked');
		var cnt_selected;
		var ac = {Delete:0, Lock:1, Unlock:2, Move:3};
		var action, pbLabel;

		function showContactsMoveMenu(position){
			var htmlChannelList = '';
			var channel;

			channelList = $('.cnt-channel-list').find('[class="cnt-channel"][data-channel-name != "Все контакты"][data-channel-name != "Последние контакты"][data-channel-name != "Канал заблокированных контактов"]');
			htmlChannelList += '<div class="modal_back"></div><div class = "modal_window" id="cnt-contact-move"><p>Переместить в</p><ul>'
			
			$(channelList).each(function(i, elem){
				htmlChannelList += '<li>' + $(elem).children().eq(0).children().eq(0).text() + '</li>';
			});
			
			/*htmlChannelList += '<li style="border-top: 1px solid #ddd; padding: 9px 6px;">Заблокировать</li><li style="padding: 9px 6px;">Снять блокировку</li><li style="border-top: 1px solid #ddd; padding: 9px 6px;">Удалить</li></ul></div>';*/

			$('#cnt-manager').append(htmlChannelList);

			$('#cnt-contact-move ul li').on('click', function(e){
				processContacts(ac.Move, $(this).html(), 'Перенос контактов');
			});
			
			// if($('#cnt-contact-move ul').is(':hidden'))
			// 	$(this).css("background", "url('/my/data/svg/expand_less.svg')");
			// else
			// 	$(this).css("background", "url('/my/data/svg/expand_more.svg')");
			// $(this).css("background-size", "cover");

			// var position = $(this).position();
			$('#cnt-contact-move').offset({top:position.top+32, left:position.left+32});

			showModalWindow($('#cnt-contact-move'));
		}

		function processContacts(action, channelName, pbLabel){
			showProgressBar(pbLabel, $(cnt_checked).length);

			hideModalWindow($('#cnt-contact-move'));
			$('.modal_back').remove();
			//$('#btn-contact-move').css('background', "url('/my/data/svg/expand_more.svg')");

			$(cnt_checked).each(function(i, elem){
				promise = promise.then(function(){
					switch(action){
						case ac.Delete:
							return deleteContact($(elem).attr('data-cnt-name'));

						case ac.Lock:
							return lockContact($(elem).attr('data-cnt-name'), true);

						case ac.Unlock:
							return lockContact($(elem).attr('data-cnt-name'), false);

						case ac.Move:
							return saveContact($(elem).attr('data-cnt-name'), channelName);		
					}
				}).then(function(result){
					console.log(JSON.stringify(result));

					value = $('#progressbar').val();
					$('#progressbar').val(++value);

					if(JSON.stringify(result) == '"0"'){
						cnt_selected = $('#cnt-selected-list ul').find('[data-cnt-id="' + $(elem).attr('data-cnt-id') + '"][data-channel-name="' + $(elem).attr('data-channel-name') + '"]');
						
						if(action != ac.Delete){
							$(elem).attr('data-channel-name', channelName);
							$(cnt_selected).attr('data-channel-name', channelName);
							$('.cnt-contact').find('[class*="cnt-checked"][data-cnt-id="' + $(elem).attr('data-cnt-id') + '"]').attr('data-channel-name', channelName);
						}
						
						$(elem).addClass('completed-ok');
					}
					else{
						showMessageBox('Ошибка при обработке контакта ' + $(elem).attr('data-cnt-name'), 3000);
					}
				});
			});

			promise.then(function(){
				$('.completed-ok').each(function(i, elem){
					switch(action){
						case ac.Delete:
							$('#cnt-selected-list ul').find('[data-cnt-id="' + $(elem).attr('data-cnt-id') + '"][data-channel-name="' + $(elem).attr('data-channel-name') + '"]').remove();
							break;

						case ac.Lock:
							$(elem).find('.cnt-contact-lock').css("background-image", "url('/include/cnt-unlock.png')");
							break;

						case ac.Unlock:
							$(elem).find('.cnt-contact-lock').css("background-image", "url('/include/cnt-lock.png')");
							break;
					}

					if(action != ac.Delete)
						$(elem).children('td').eq(3).text(channelName);
				});

				if(action != ac.Delete){
					$('.cnt-channel').removeClass('selected');
					$('.cnt-channel-list').find('[data-channel-name="' + channelName + '"]').addClass('selected');
				}
				else{
					$('.completed-ok').remove();
				}

				$('.completed-ok').removeClass('completed-ok');

				updateContactList();

				calcSelectedItems();

				hideProgressBar();
			});
		}

		e.stopPropagation();
		
		var selectedItems = $('.cnt-checked:checked').length;
		
		if(selectedItems){
			switch(e.target.id){
				case 'cnt-contacts-delete':
					processContacts(ac.Delete, '', 'Удаление контактов');
					break;

				case 'cnt-contacts-lock':
					processContacts(ac.Lock, 'Канал заблокированных контактов', 'Блокировка контактов');
					break;

				case 'cnt-contacts-unlock':
					processContacts(ac.Unlock, 'Канал приглашенных контактов', 'Разблокировка контактов');
					break;

				default:
					showContactsMoveMenu($(e.target).position());
			}
		}
	});

	// 	$('#cnt-contact-move ul li').on('click', function(e){
	// 		var channelName = (($(this).html() == 'Заблокировать') || ($(this).html() == 'Снять блокировку')) ? 'Канал заблокированных контактов' : $(this).html();
	// 		var promise = $.when();
	// 		var cnt_checked = $('.cnt-contact.checked');
	// 		var cnt_selected;
	// 		var ac = {Delete:0, Lock:1, Unlock:2, Move:3};
	// 		var action, pbLabel;

	// 		/*switch($(this).html()){
	// 			case 'Удалить':
	// 				action = ac.Delete;
	// 				channelName = '';
	// 				pbLabel = 'Удаление контактов';
					
	// 				break;
	// 			case 'Снять блокировку':
	// 				action = ac.Unlock;
	// 				channelName = 'Канал приглашенных контактов';
	// 				pbLabel = 'Разблокировка контактов';

	// 				break;
	// 			case 'Заблокировать':
	// 				action = ac.Lock;
	// 				channelName = 'Канал заблокированных контактов';
	// 				pbLabel = 'Блокировка контактов';

	// 				break;
	// 			default:
	// 				action = ac.Move;
	// 				channelName = $(this).html();
	// 				pbLabel = 'Перенос контактов';
					
	// 		}*/

			// 	showProgressBar(pbLabel, $(cnt_checked).length);

			// 	hideModalWindow($('#cnt-contact-move'));
			// 	$('.modal_back').remove();
			// 	$('#btn-contact-move').css('background', "url('/my/data/svg/expand_more.svg')");

			// 	$(cnt_checked).each(function(i, elem){
			// 		promise = promise.then(function(){
			// 			switch(action){
			// 				case ac.Delete:
			// 					return deleteContact($(elem).attr('data-cnt-name'));

			// 				case ac.Lock:
			// 					return lockContact($(elem).attr('data-cnt-name'), true);

			// 				case ac.Unlock:
			// 					return lockContact($(elem).attr('data-cnt-name'), false);

			// 				case ac.Move:
			// 					return saveContact($(elem).attr('data-cnt-name'), channelName);		
			// 			}
			// 		}).then(function(result){
			// 			console.log(JSON.stringify(result));

			// 			value = $('#progressbar').val();
			// 			$('#progressbar').val(++value);

			// 			if(JSON.stringify(result) == '"0"'){
			// 				cnt_selected = $('#cnt-selected-list ul').find('[data-cnt-id="' + $(elem).attr('data-cnt-id') + '"][data-channel-name="' + $(elem).attr('data-channel-name') + '"]');
							
			// 				if(action != ac.Delete){
			// 					$(elem).attr('data-channel-name', channelName);
			// 					$(cnt_selected).attr('data-channel-name', channelName);
			// 					$('.cnt-contact').find('[class*="cnt-checked"][data-cnt-id="' + $(elem).attr('data-cnt-id') + '"]').attr('data-channel-name', channelName);
			// 				}
							
			// 				$(elem).addClass('completed-ok');
			// 			}
			// 			else{
			// 				showMessageBox('Ошибка при обработке контакта ' + $(elem).attr('data-cnt-name'), 3000);
			// 			}
			// 		});
			// 	});

			// 	promise.then(function(){
			// 		$('.completed-ok').each(function(i, elem){
			// 			switch(action){
			// 				case ac.Delete:
			// 					$('#cnt-selected-list ul').find('[data-cnt-id="' + $(elem).attr('data-cnt-id') + '"][data-channel-name="' + $(elem).attr('data-channel-name') + '"]').remove();

			// 					break;
			// 				case ac.Lock:
			// 					$(elem).find('.cnt-contact-lock').css("background-image", "url('/include/cnt-unlock.png')");

			// 					break;
			// 				case ac.Unlock:
			// 					$(elem).find('.cnt-contact-lock').css("background-image", "url('/include/cnt-lock.png')");

			// 					break;
			// 			}

			// 			if(action != ac.Delete)
			// 				$(elem).children('td').eq(3).text(channelName);
			// 		});

			// 		if(action != ac.Delete){
			// 			$('.cnt-channel').removeClass('selected');
			// 			$('.cnt-channel-list').find('[data-channel-name="' + channelName + '"]').addClass('selected');
			// 		}
			// 		else{
			// 			$('.completed-ok').remove();
			// 		}

			// 		$('.completed-ok').removeClass('completed-ok');

			// 		updateContactList();

			// 		calcSelectedItems();

			// 		hideProgressBar();
			// 	});
			// });
	// 	}
	// });

	$('.cnt-contact').mouseenter(function(){
		$(this).find('[class="cnt-contact-menu"]').css('display', 'inline-block');
		if(($(this).attr('data-cnt-name') == 'telebot') || ($(this).attr('data-channel-name') == 'Команда Teleport')){
			$(this).find('[class="cnt-contact-delete"]').css('display', 'none');
			$(this).find('[class="cnt-contact-lock"]').css('display', 'none');
		}
	});

	$('.cnt-contact').mouseleave(function(){
		$(this).find('[class="cnt-contact-menu"]').css('display', 'none');
	});

	$('.cnt-contact-view').on('click', function(){
		ContactInfoView($(this).closest('.cnt-contact').attr('data-cnt-name'));
	});

	$('.cnt-contact-delete').on('click', function(){
		var cntContact = $(this).closest('.cnt-contact');
		var cntId = $(cntContact).attr('data-cnt-id');
		var channelName = $(cntContact).attr('data-channel-name');
		var cntName = $(cntContact).attr('data-cnt-name');

		var promise = $.when();

		promise = promise.then(function(){
				return deleteContact(cntName);
		}).then(function(result){
			if(JSON.stringify(result) == '"0"'){
				$(cntContact).remove();
				$('#cnt-selected-list ul').find('[data-cnt-id="' + cntId + '"][data-channel-name="' + channelName + '"]').remove();
			}
			else{
				showMessageBox('Ошибка обработки контакта ' + cntName, 3000);
			}
		});

		promise.then(function(){
			calcSelectedItems();

			updateContactList();	
		});
	});

	$('.cnt-contact-lock').mouseenter(function(){
		var channelName = $(this).closest('.cnt-contact').attr('data-channel-name');
		if(channelName == 'Канал заблокированных контактов')
			$(this).prop('title', 'Разблокировать контакт');
		else
			$(this).prop('title', 'Заблокировать контакт');
	});

	$('.cnt-contact-lock').on('click', function(e){
		var cntContact = $(this).closest('.cnt-contact');
		var cntName = $(cntContact).attr('data-cnt-name');
		var channelName = 'Канал приглашенных контактов';
		var ttText = 'Заблокировать контакт';
		var bgImage = "url('/include/cnt-lock.png')";
		var lock = !($(cntContact).attr('data-channel-name') == 'Канал заблокированных контактов'); //true - блокировка
		var btnLock = $(this);
		var result;

		if(lock){
			channelName = 'Канал заблокированных контактов';
			ttText = 'Разблокировать контакт';
			bgImage = "url('/include/cnt-unlock.png')"
		}

		var promise = $.when();

		promise = promise.then(function(){
				return lockContact(cntName, lock);
		}).then(function(result){
			console.log(JSON.stringify(result));
			if(JSON.stringify(result) == '"0"'){
				$(cntContact).find('[class*="cnt-checked"]').attr('data-channel-name', channelName);
				$(cntContact).attr('data-channel-name', channelName);
				$(cntContact).addClass('completed-ok');
			}
			else{
				showMessageBox('Ошибка обработки контакта ' + cntName, 3000);
			}
		});

		promise.then(function(){
			$('.completed-ok').each(function(i, elem){
				$(cntContact).find('[class="cnt-channel-name"]').text(channelName);
				$('#tooltip').html(ttText);
				$(btnLock).css('background-image', bgImage);	
			});
				
			$('.completed-ok').removeClass('completed-ok');
				
			calcSelectedItems();

			updateContactList();	
		});
	});

	function resetMouseEventListener(){
		$('.cnt-channel').off();
		$('.btn-channel-menu').off();

		$('.cnt-channel').on('mouseenter', function(e){
		if($(this).attr('data-channel-status') != 'system')
			$(this).find('[class="btn-channel-menu"]').css('display', 'table-cell');
		});

		$('.cnt-channel').on('mouseleave', function(e){
			if($(this).attr('data-channel-status') != 'system' && $.find('[class="modal_back"]').length == 0)
				$(this).find('[class="btn-channel-menu"]').css('display', 'none');
		});

		$('.btn-channel-menu').on('click', function(e){
			e.stopPropagation();

			var htmlCtxChannelMenu = 
			'<div class="modal_back"></div>\
			<div class = "modal_window" id="ctx-channel-menu" data-sort-num = ' + $(this).parent().parent().attr("data-sort-num") + ' data-channel-name="' + $(this).parent().parent().attr('data-channel-name') + '">\
				<ul>\
					<li>Новый канал</li>\
					<li>Переименовать</li>\
					<li>Удалить</li>\
				</ul>\
			</div>';

			$('#cnt-manager').append(htmlCtxChannelMenu);
			if($('#ctx-channel-menu').is(':hidden')){
				$(this).css("background-image", "url('/my/data/svg/expand_less.svg')");
			}
			else{
				$(this).css("background-image", "url('/my/data/svg/expand_more.svg')");
			}

			$(this).css("background-size", "cover");

			var position = $(this).position();
			$('#ctx-channel-menu').offset({top:position.top+16, left:position.left+16});

			$('#ctx-channel-menu ul li').off();
			$('#ctx-channel-menu ul li').on('click', function(e){
				var objChannel = $('.cnt-channel-list').find('[data-channel-name="' + $('#ctx-channel-menu').attr('data-channel-name') + '"]'); 

				hideCtxChannelMenu($('#ctx-channel-menu'));

				if($(this).html() == 'Переименовать'){
					renameChannel(objChannel);
				}

				if($(this).html() == 'Удалить'){
					deleteChannel(objChannel);
				}

				if($(this).html() == 'Новый канал'){
					addNewChannel();
				}
			});

			showModalWindow($('#ctx-channel-menu'));
		});

		$('.cnt-channel').on('click', function(e){
			e.preventDefault();
			$('.cnt-channel').removeClass('selected');
			$(this).addClass('selected');

			updateContactList();
		});

    var targets = $('[rel~=tooltip]'),
        target  = false,
        tooltip = false,
        title   = false;
  
    targets.bind('mouseenter', function()
    {
        target  = $(this);
        tip     = target.attr('title');
        tooltip = $('<div id="tooltip"></div>');
  
        if(!tip || tip == '')
            return false;
  
        target.removeAttr('title');
        tooltip.css('opacity', 0)
               .html(tip)
               .appendTo('body');
  
        var init_tooltip = function()
        {
            if($(window).width() < tooltip.outerWidth() * 1.5)
                tooltip.css('max-width', $(window).width() / 2);
            else
                tooltip.css('max-width', 340);
  
            var pos_left = target.offset().left + (target.outerWidth() / 2) - (tooltip.outerWidth() / 2),
                pos_top  = target.offset().top - tooltip.outerHeight() - 20;
  
            if(pos_left < 0)
            {
                pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                tooltip.addClass('left');
            }
            else
                tooltip.removeClass('left');
  
            if(pos_left + tooltip.outerWidth() > $(window).width())
            {
                pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                tooltip.addClass('right');
            }
            else
                tooltip.removeClass('right');
  
            if(pos_top < 0)
            {
                var pos_top  = target.offset().top + target.outerHeight();
                tooltip.addClass('top');
            }
            else
                tooltip.removeClass('top');
  
            tooltip.css({ left: pos_left, top: pos_top })
                   .animate({ top: '+=10', opacity: 1 }, 50);
        };
  
        init_tooltip();
        $(window).resize(init_tooltip);
  
        var remove_tooltip = function()
        {
            tooltip.animate({ top: '-=10', opacity: 0 }, 50, function()
            {
                $(this).remove();
            });
  
            target.attr('title', tip);
        };
  
        target.bind('mouseleave', remove_tooltip);
        tooltip.bind('click', remove_tooltip);
    });
	}

	function deleteChannel(objChannel){
		var channelName = objChannel.attr('data-channel-name');
		
		var channelContacts = $('.cnt-contact-list').find('[class*="cnt-contact"][data-channel-name="' + channelName + '"]');
		if(channelContacts.length !=0){
			var promise = $.when();
			showProgressBar('Удаление канала', channelContacts.length);

			$(channelContacts).each(function(i, elem){
				promise = promise.then(function(){
						return saveContact($(elem).attr('data-cnt-name'), 'Канал приглашенных контактов');
				}).then(function(result){
					console.log(JSON.stringify(result));

					value = $('#progressbar').val();
					$('#progressbar').val(++value);

					if(JSON.stringify(result) == '"0"'){
						$(elem).attr('data-channel-name', 'Канал приглашенных контактов');
						$('.cnt-contact-list').find('[class*="cnt-checked"][data-cnt-id="' + $(elem).attr('data-cnt-id') + '"]').attr('data-channel-name', 'Канал приглашенных контактов');
						$(elem).children('td').eq(3).text('Канал приглашенных контактов');
					}
					else{
						showMessageBox('Ошибка обработки контакта ' + $(elem).attr('data-cnt-name'));
					}
				});
			});

			promise.then(function(){
				console.log('ok');

				$('.cnt-channel').removeClass('selected');
				$('.cnt-channel-list').find('[data-channel-name="Канал приглашенных контактов"]').addClass('selected');

				updateContactList();

				hideProgressBar();
			});
		}
		objChannel.remove();
	}

	function addNewChannel(){
		var htmlNewChannel = '\
		<tr class="cnt-channel" data-channel-name="Новый канал" data-channel-status="user" data-sort-num="0">\
			<td height="45">\
				<div style="display: inline-block; vertical-align: middle;">Новый канал</div>\
			</td>\
			<td height="45">\
				<div style="display: inline-block; vertical-align: middle;" class="btn-channel-menu"></div>\
			</td>\
		</tr>'

		$('.cnt-channel-list tbody').append(htmlNewChannel);

		resetMouseEventListener();

		updateContactList();
	}

	function GetNewChannelName(objChannel){
		var htmlGetNewChannelName = '<div class="modal_back"></div> \
		<div class="modal_window" id="get-newchannel-name" data-channel-name="' + $(objChannel).attr("data-channel-name") +'"> \
			<input class="cnt_inp" id="text-newchannel-name" type="text" placeholder="Введите новое имя канала" value=""/> \
			<button class="menu_button" id="button-ok">ОК</button> \
			<button class="menu_button" id="button-cancel">Отмена</button> \
		</div>';

		$('#main_content').append(htmlGetNewChannelName);
		showModalWindow($('#get-newchannel-name'));
		$('#text-newchannel-name').focus();

		$('#button-ok').on('click', function(e){
			e.preventDefault();

			var oldChannelName = $('#get-newchannel-name').attr('data-channel-name');
			var channelContacts = $('.cnt-contact-list').find('[class*="cnt-contact"][data-channel-name="' + oldChannelName + '"]');

			//экранирование спецсимволов
			var newChannelName = $('<div>').text($('#text-newchannel-name').val()).html(); 

			var objChannelFound = $('.cnt-channel-list').find('[data-channel-name="' + newChannelName + '"]'); 

			hideModalWindow($('#get-newchannel-name'));
			$('.modal_back').remove();

			if(newChannelName != '' && objChannelFound.length == 0){
				
				var objChannel = $('.cnt-channel-list').find('[data-channel-name="' + oldChannelName + '"]'); 
				$(objChannel).attr('data-channel-name', newChannelName);
				$(objChannel).children().eq(0).children().eq(0).text(newChannelName);
				
				var promise = $.when();
				showProgressBar('Переименование канала', channelContacts.length);

				$(channelContacts).each(function(i, elem){
					promise = promise.then(function(){
							return saveContact($(elem).attr('data-cnt-name'), newChannelName);
					}).then(function(result){
						console.log(JSON.stringify(result));
						
						value = $('#progressbar').val();
						$('#progressbar').val(++value);
						
						if(JSON.stringify(result) == '"0"'){
							$(elem).attr('data-channel-name', newChannelName);
							$('.cnt-contact-list').find('[class*="cnt-checked"][data-cnt-id="' + $(elem).attr('data-cnt-id') + '"]').attr('data-channel-name', newChannelName);
							$(elem).children('td').eq(3).text(newChannelName);
						}
						else{
							showMessageBox('Ошибка обработки контакта ' + $(elem).attr('data-cnt-name'));
						}
					});
				});

				promise.then(function(){
					console.log('ok');

					$('.cnt-channel').removeClass('selected');
					$('.cnt-channel-list').find('[data-channel-name="' + newChannelName + '"]').addClass('selected');

					updateContactList();

					hideProgressBar();
				});
			}
		});

		$('#button-cancel').on('click', function(e){
			e.preventDefault();
			
			hideModalWindow($('#get-newchannel-name'));
			$('.modal_back').remove();
		});

		$('#text-newchannel-name').on('keyup', function(e){
			if(e.keyCode == 13){
				$('#button-ok').click();
			}

			if(e.keyCode == 27){
				$('#button-ok').click();
			}
		});
	}	

	function renameChannel(objChannel){
		GetNewChannelName(objChannel);
	}

	function hideCtxChannelMenu(channelMenu){
		hideModalWindow($(channelMenu));
		$('.modal_back').remove();
		$('.btn-channel-menu').css('display', 'none');
		$('.btn-channel-menu').css("background-image", "url('/my/data/svg/expand_more.svg')");
		$('.btn-channel-menu').css("background-size", "cover");
	}

	function hideSelectedList(){
		$('.modal_back').remove();
		$('#btn-selected-list').css("background-image", "url('/my/data/svg/expand_more.svg')");
		$('#btn-selected-list').css("background-size", "cover");
	}

	function hideContactMoveList(){
		$('.modal_back').remove();
		$('#btn-contact-move').css("background-image", "url('/my/data/svg/expand_more.svg')");
		$('#btn-contact-move').css("background-size", "cover");
	}

	function saveContact(cnt_name, channel_name){
		return $.post('/my/ajax/action.php', 'action=setUserGroup' +	'&contact=' + encodeURIComponent(cnt_name) + '&group_name=' + encodeURIComponent(channel_name));
	}

	function deleteContact(cnt_name){
		return $.post('/my/ajax/action.php', 'action=deletePerson' + '&adds=html' + '&contact=' + encodeURIComponent(cnt_name));
	}

	function lockContact(cnt_name, state){
		if(state)
			return $.post('/my/ajax/action.php', 'action=deletePerson' + '&adds=html' + '&contact=' + encodeURIComponent(cnt_name) + '&block=true');
		else
			return $.post('/my/ajax/action.php', 'action=unblockPerson' + '&adds=html' + '&contact=' + encodeURIComponent(cnt_name));
	}

	function updateContactList(showCheckedOnly){
		if(showCheckedOnly){
			$('.cnt-contact').hide();
			$('.cnt-contact-list').find('[class*="cnt-contact"][class*="checked"]').show();
		}
		else{
			var channelName = $('.cnt-channel-list').find('.selected').attr('data-channel-name');

			if(channelName != 'Все контакты'){
				$('.cnt-contact').hide();
				if(channelName == 'Последние контакты')				
					$('.cnt-contact-list').find('[class*="cnt-contact cnt-recent"]').show();
				else
					$('.cnt-contact-list').find('[data-channel-name=\"'+channelName+'\"]').show();
			}else
				$('.cnt-contact').show();
		}
	}

	function calcSelectedItems(){
		var selectedItems = $('.cnt-checked:checked').length;

		if(!selectedItems){
			$('#cnt-select-all').prop("checked", false);

			$('#cnt-contact-move ul').slideUp('fast');
			$('#btn-contact-move').css("background", "url('/my/data/svg/expand_more.svg')");
		}

		$('#cnt-selected-num p').html('Выбрано: ' + selectedItems);
	}
</script>