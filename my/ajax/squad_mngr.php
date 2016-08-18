<?
	require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
	require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

	$TLP_obj = unserialize($_SESSION["TLP_obj"]);
	
	//$params = array('GroupName'=>'my-squad-3', 'GroupFullName'=>'rbaklanov test squad');
	//$roster = $TLP_obj->telecall('ContactGroup_Add', $params);

	$params = array('GroupName'=>'my-squad-3');
	$roster = $TLP_obj->telecall('ContactGroup_GetList', $params);

	$params = array();
	$squads = $TLP_obj->telecall('Users_ContactGroups', $params);
?>

<div id='squad-statusbar'>
	<div id='squad-statusbar-userinfo'>
		<div class="cnt_avatar cnt_avatar_small" style="background-image: none; width: 36px; height: 36px; margin-left: 10px;">
			<svg fill="#BBB" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
				<path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		</div>
		<div>
			<p>Роман БАКЛАНОВ</p>
		</div>
	</div>
	<div id='squad-statusbar-settings'>
		<div id='squad-statusbar-settings-current'>
			<p>Все контакты (52)</p>
		</div>
		<div style='display: flex;'>
			<div style="width: 25px; height: 25px;">
				<img src='/my/data/svg/expand_more.svg' style='width:100%; '>
			</div>
		</div>
		<div id='squad-statusbar-status-buttons'>
			<div>
				<img src='/include/cnt-gear.png'>
			</div>
			<div>
				<img src='/include/cnt-dog.png'>
			</div>
			<div>
				<img src='/include/cnt-power.png'>
			</div>
		</div>
	</div>
</div>

<div id='squad-toolbar'>
	<div id='squad-toolbar-header'>
		<p>Список каналов (4)</p>
	</div>
	<div id='squad-toolbar-tools'>
		<div id='squad-toolbar-tools-selectall'>
			<label class="cnt-checked-label"><input type='checkbox' id='cnt-select-all'><span></span></label>
		</div>
		<div id='squad-toolbar-tools-buttons'>
			<div>
				<img src='/include/cnt-move.png'>
			</div>
			<div>
				<img src='/include/cnt-delete.png'>
			</div>
			<div>
				<img src='/include/cnt-lock-2.png'>
			</div>
			<div>
				<img src='/include/cnt-unlock-2.png'>
			</div>
		</div>
		<div id='squad-toolbar-tools-selected'>
			<p>Выбрано: 999</p>
		</div>
		
		<div id='squad-toolbar-tools-sort'>
			<p>Сортировка: А-я</p>
		</div>
		<div id='squad-toolbar-tools-filter'>
			<p>Фильтр: нет</p>
		</div>
		<div id='squad-toolbar-tools-search'>
			<input type="text" id="squad-member-search" placeholder="Введите имя или e-mail контакта..." style="display: none">
			<div id="squad-search-button">
				<svg fill="#777" height="32px" version="1.1" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink">
					<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"></g>
					<path d="M19.4271164,21.4271164 C18.0372495,22.4174803 16.3366522,23 14.5,23 C9.80557939,23 6,19.1944206 6,14.5 C6,9.80557939 9.80557939,6 14.5,6 C19.1944206,6 23,9.80557939 23,14.5 C23,16.3366522 22.4174803,18.0372495 21.4271164,19.4271164 L27.0119176,25.0119176 C27.5621186,25.5621186 27.5575313,26.4424687 27.0117185,26.9882815 L26.9882815,27.0117185 C26.4438648,27.5561352 25.5576204,27.5576204 25.0119176,27.0119176 L19.4271164,21.4271164 L19.4271164,21.4271164 Z M14.5,21 C18.0898511,21 21,18.0898511 21,14.5 C21,10.9101489 18.0898511,8 14.5,8 C10.9101489,8 8,10.9101489 8,14.5 C8,18.0898511 10.9101489,21 14.5,21 L14.5,21 Z" id="search"></path>
				</svg>
			</div>
		</div>
	</div>
</div>

<div id='squad-content'>
	<div id='list-of-squads'>
		<div id='squad-add-new'>
			<div>
				<img src='/include/add-channel.png'>
			</div>
		</div>

		<div class="squad"> <!-- Строка -->
			<div class="squad-avatar"> <!-- Аватарка канала/команды -->
				<div>
					<img src='/include/cnt-lock-2.png'>
				</div>
			</div>
			<div class="squad-name"> <!-- Наименование канала/команды -->
				<p>Все контакты (52)</p>
			</div>
			<div style='display: flex; width: 25'>
				<div style="width: 35px; height: 25px;">
					<img src='/my/data/svg/expand_more.svg' style='width:100%;'>  <!-- Кнопка вызова контекстного меню -->
				</div>
			</div>
		</div>

		<div class="squad"> <!-- Строка -->
			<div class="squad-avatar"> <!-- Аватарка канала/команды -->
				<div>
					<img src='/include/cnt-lock-2.png'>
				</div>
			</div>
			<div class="squad-name"> <!-- Наименование канала/команды -->
				<p>Приглашенные (26)</p>
			</div>
			<div style='display: flex; width: 25'>
				<div style="width: 35px; height: 25px;">
					<img src='/my/data/svg/expand_more.svg' style='width:100%;'>  <!-- Кнопка вызова контекстного меню -->
				</div>
			</div>
		</div>

		<div class="squad"> <!-- Строка -->
			<div class="squad-avatar"> <!-- Аватарка канала/команды -->
				<div>
					<img src='/include/cnt-lock-2.png'>
				</div>
			</div>
			<div class="squad-name"> <!-- Наименование канала/команды -->
				<p>Общие (24)</p>
			</div>
			<div style='display: flex; width: 25'>
				<div style="width: 35px; height: 25px;">
					<img src='/my/data/svg/expand_more.svg' style='width:100%;'>  <!-- Кнопка вызова контекстного меню -->
				</div>
			</div>
		</div>

		<div class="squad"> <!-- Строка -->
			<div class="squad-avatar"> <!-- Аватарка канала/команды -->
				<div>
					<img src='/include/cnt-lock-2.png'>
				</div>
			</div>
			<div class="squad-name"> <!-- Наименование канала/команды -->
				<p>Заблокированные (2)</p>
			</div>
			<div style='display: flex; width: 25'>
				<div style="width: 35px; height: 25px;">
					<img src='/my/data/svg/expand_more.svg' style='width:100%;'>  <!-- Кнопка вызова контекстного меню -->
				</div>
			</div>
		</div>
	</div>

	<div id='squad-roster'>
		<div class="squad-member" data-search-exp="sandrabullok"> <!-- Строка -->
			
			<div class='squad-member-check'>
				<label class="cnt-checked-label"><input type='checkbox' class='cnt-checked'><span></span></label>
			</div>

			<div style='display: flex; width: 20; margin-left: 10px'>
				<div style="width: 20px; height: 20px;">
					<img src='/include/cnt-star-3.png' style='width:100%;'>  <!-- Принадлежность команде -->
				</div>
			</div>

			<div class="cnt_avatar cnt_avatar_small" style="background-image: none; width: 36px; height: 36px; margin: 0 10px 0 10px;"> <!-- Аватарка контакта -->
				<svg fill="#BBB" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
					<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
					<path d="M0 0h24v24H0z" fill="none"/>
				</svg>
			</div>

			<div class="squad-member-name">
				<p>Sandra Bullok</p>
			</div>
			<div class="squad-member-squad">
				<p>Канал общих контактов</p>
			</div>
			<div class="squad-member-buttons">
				<div>
					<img src='/include/cnt-info.png'>
				</div>
				<div>
					<img src='/include/cnt-delete.png'>
				</div>
				<div>
					<img src='/include/cnt-lock.png'>
				</div>
			</div>
		</div>

		<div class="squad-member" data-search-exp="sylvesterstallone"> <!-- Строка -->
			
			<div class='squad-member-check'>
				<label class="cnt-checked-label"><input type='checkbox' class='cnt-checked'><span></span></label>
			</div>

			<div style='display: flex; width: 20; margin-left: 10px'>
				<div style="width: 20px; height: 20px;">
					<img src='/include/cnt-star-3.png' style='width:100%;'>  <!-- Принадлежность команде -->
				</div>
			</div>

			<div class="cnt_avatar cnt_avatar_small" style="background-image: none; width: 36px; height: 36px; margin: 0 10px 0 10px;"> <!-- Аватарка контакта -->
				<svg fill="#BBB" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
					<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
					<path d="M0 0h24v24H0z" fill="none"/>
				</svg>
			</div>

			<div class="squad-member-name">
				<p>Sylvester Stallone</p>
			</div>
			<div class="squad-member-squad">
				<p>Канал приглашенных контактов</p>
			</div>
			<div class="squad-member-buttons">
				<div>
					<img src='/include/cnt-info.png'>
				</div>
				<div>
					<img src='/include/cnt-delete.png'>
				</div>
				<div>
					<img src='/include/cnt-lock.png'>
				</div>
			</div>
		</div>

		<div class="squad-member" data-search-exp="arnoldschwarzenegger"> <!-- Строка -->
			
			<div class='squad-member-check'>
				<label class="cnt-checked-label"><input type='checkbox' class='cnt-checked'><span></span></label>
			</div>

			<div style='display: flex; width: 20; margin-left: 10px'>
				<div style="width: 20px; height: 20px;">
					<img src='/include/cnt-star-3.png' style='width:100%;'>  <!-- Принадлежность команде -->
				</div>
			</div>

			<div class="cnt_avatar cnt_avatar_small" style="background-image: none; width: 36px; height: 36px; margin: 0 10px 0 10px;"> <!-- Аватарка контакта -->
				<svg fill="#BBB" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
					<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
					<path d="M0 0h24v24H0z" fill="none"/>
				</svg>
			</div>

			<div class="squad-member-name">
				<p>Arnold Schwarzenegger</p>
			</div>
			<div class="squad-member-squad">
				<p>Канал приглашенных контактов</p>
			</div>
			<div class="squad-member-buttons">
				<div>
					<img src='/include/cnt-info.png'>
				</div>
				<div>
					<img src='/include/cnt-delete.png'>
				</div>
				<div>
					<img src='/include/cnt-lock.png'>
				</div>
			</div>
		</div>

		<div class="squad-member" data-search-exp="eddiemurphy"> <!-- Строка -->
			
			<div class='squad-member-check'>
				<label class="cnt-checked-label"><input type='checkbox' class='cnt-checked'><span></span></label>
			</div>

			<div style='display: flex; width: 20; margin-left: 10px'>
				<div style="width: 20px; height: 20px;">
					<img src='/include/cnt-star-3.png' style='width:100%;'>  <!-- Принадлежность команде -->
				</div>
			</div>

			<div class="cnt_avatar cnt_avatar_small" style="background-image: none; width: 36px; height: 36px; margin: 0 10px 0 10px;"> <!-- Аватарка контакта -->
				<svg fill="#BBB" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
					<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
					<path d="M0 0h24v24H0z" fill="none"/>
				</svg>
			</div>

			<div class="squad-member-name">
				<p>Eddie Murphy</p>
			</div>
			<div class="squad-member-squad">
				<p>Канал заблокированных контактов</p>
			</div>
			<div class="squad-member-buttons">
				<div>
					<img src='/include/cnt-info.png'>
				</div>
				<div>
					<img src='/include/cnt-delete.png'>
				</div>
				<div>
					<img src='/include/cnt-lock.png'>
				</div>
			</div>
		</div>
	</div>
</div>

<script>
$('#list-of-squads').slimScroll({
	position: 'right',
	height: '200px',
	size: '7px', 
	disableFadeOut: true
});

$('#squad-roster').slimScroll({
	position: 'right',
	height: '200px',
	size: '7px', 
	disableFadeOut: true
});

$('#squad-toolbar-tools-filter').on('click', function(e){
	var letters = [];
	var cntName, letter;
	var contactList = $('#squad-roster').find('[class*="squad-member-name"]');
	
	contactList.each(function(i, elem){
		cntName = $(elem).children('p').text();
		letter = cntName.substr(0, 1);
		if(letters.indexOf(letter) == -1)
			letters.push(letter);
	});

	$('#squad-manager').append('<div class="modal_back back_curt"></div>');
	var htmlLettersWindow = 
		$('\
			<div id="letters-window" class="modal_window">\
				<div>\
					<p>A</p><p>B</p><p>C</p><p>D</p><p>E</p><p>F</p><p>G</p><p>H</p><p>I</p><p>J</p><p>K</p><p>L</p>\
				</div>\
				<div>\
					<p>M</p><p>N</p><p>O</p><p>P</p><p>Q</p><p>R</p><p>S</p><p>T</p><p>U</p><p>V</p><p>W</p><p>X</p>\
				</div>\
				<div>\
					<p>Y</p><p>Z</p><p>А</p><p>Б</p><p>В</p><p>Г</p><p>Д</p><p>Е,Ё</p><p>Ж</p><p>З</p><p>И,Й</p><p>К</p>\
				</div>\
				<div>\
					<p>Л</p><p>М</p><p>Н</p><p>О</p><p>П</p><p>Р</p><p>С</p><p>Т</p><p>У</p><p>Ф</p><p>Х</p><p>Ц</p>\
				</div>\
				<div>\
					<p>Ч</p><p>Ш,Щ</p><p>Э</p><p>Ю</p><p>Я</p><p>0</p><p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>\
				</div>\
				<div>\
					<p>7</p><p>8</p><p>9</p><p>0</p><p style="width: 500px; font-size: 12px">Очистить фильтр</p>\
				</div>\
			</div>\
		');

	$('#squad-manager').append(htmlLettersWindow);

	letters.forEach(function(item, i, letters){
		$('#letters-window div p').filter(function(){
			var letter = $(this).text();
			var result = (letter == item) || letter == ('Очистить фильтр');
			if(result){
				$(this).off();
				$(this).on('click', function(e){
					hideModalWindow($('#letters-window'));
					$('.modal_back').remove();

					if(letter == 'Очистить фильтр') {
						$('#squad-roster>div').show();
						$('#squad-toolbar-tools-filter p').text('Фильтр: нет');
					} else {
						$('#squad-roster>div').hide();
						$('#squad-toolbar-tools-filter p').text('Фильтр: ' + letter);
						$('#squad-roster').find('[class*="squad-member-name"]').children('p').filter(function(){
							return $(this).text().substr(0, 1) == letter;
						}).parent().parent().show();
					}
				});

				$(this).hover(function(){
					$(this).css('color', 'red');
				}, function(){
					$(this).css('color', 'black');
				});
			}
			return result;
		}).css('color', 'black');
	});

	showModalWindow($('#letters-window'));
});

$("#squad-toolbar-tools-search").on('click',"#squad-search-button", function(e) {
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

		$('.squad-member').show();
	}
});

$('#squad-member-search').on('keyup', function(){
	var inp_str = $(this).val();
	if(inp_str == '') {
		$('.squad-member').show();
		return;
	}

	var s_str = inp_str.toLowerCase();
	s_str = encodeString(s_str);
	$(this).removeClass('cnt-not-found');

	var obj = $('#squad-roster').find('[data-search-exp*='+s_str+']');
	if(!obj.length)
		$(this).addClass('cnt-not-found');

	$('.squad-member').hide();
	obj.show();
});

$('.cnt-checked').on('click', function(e){
	var checked = $(this).prop('checked');
	var cnt_checked = $(this).closest('.squad-member');

	if(checked)
		$(cnt_checked).addClass('checked');
	else
		$(cnt_checked).removeClass('checked');

	calcSelectedItems();
});		

$('#cnt-select-all').on('click', function(e){
	var checked = $(this).prop('checked');

	var checkbox_checked = $('.cnt-checked:visible').not('.cnt-checked:disabled');

	$(checkbox_checked).prop('checked', checked);

	 $(checkbox_checked).each(function(i, elem){
		var cnt_checked = $(this).closest('.squad-member');

		if(checked)
			$(cnt_checked).addClass('checked');
		else
			$(cnt_checked).removeClass('checked');	
	 });

	calcSelectedItems();
});

$('#squad-toolbar-tools-selected').on('click', function(e){
	updateRoster(true);
});

function calcSelectedItems(){
	var selectedItems = $('.cnt-checked:checked').length;

	if(!selectedItems)
		$('#cnt-select-all').prop("checked", false);

	if(selectedItems == $('.cnt-checked').length)
		$('#cnt-select-all').prop("checked", true);

	$('#squad-toolbar-tools-selected p').html('Выбрано: ' + selectedItems);
}

$('.squad-member').mouseenter(function(){
	$(this).find('[class="squad-member-buttons"]').children('div').css('display', 'flex');
});

$('.squad-member').mouseleave(function(){
	$(this).find('[class="squad-member-buttons"]').children('div').css('display', 'none');
});

function updateRoster(showCheckedOnly){
	if(showCheckedOnly){
		$('.squad-member').hide();
		$('#squad-roster').find('[class*="squad-member"][class*="checked"]').show();
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
</script>
