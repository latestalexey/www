function addSquadManagerEvents(){
	$('#cnt-filter').on('click', function(e){
		var letters = [];
		var cntName, letter;
		var contactList = $('#cnt-contact-list').find('[class*="cnt-contact-name"]');
		
		contactList.each(function(i, elem){
			cntName = $(elem).children('p').text();
			letter = cntName.substr(0, 1).toUpperCase();
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
						<p>7</p><p>8</p><p>9</p><p style="width: 550px; font-size: 12px">Очистить фильтр</p>\
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
							updateRoster(false);
							$('.cnt-contact:visible:odd').css('background', '#DEEBF7');
							$('.cnt-contact:visible:even').css('background', '#FBFBFB'); 
							$('#cnt-filter p').text('Фильтр: нет');
						} else {
							$('#cnt-contact-list>div').hide();
							$('#cnt-filter p').text('Фильтр: ' + letter);
							$('#cnt-contact-list').find('[class*="cnt-contact-name"]').children('p').filter(function(){
								return $(this).text().substr(0, 1).toUpperCase() == letter;
							}).parent().parent().show();
						}

						$('.cnt-contact:visible:odd').css('background', '#DEEBF7');
						$('.cnt-contact:visible:even').css('background', '#FBFBFB'); 
					});

					$(this).hover(function(){
						$(this).css('color', '#26A69A');
					}, function(){
						$(this).css('color', 'black');
					});
				}
				return result;
			}).css('color', 'black');
		});

		showModalWindow($('#letters-window'));
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

			$('.cnt-contact').show();
		}
	});

	$('#cnt-search-input').on('keyup', function(){
		var inp_str = $(this).val();
		if(inp_str == '') {
			$('.cnt-contact').show();
			$('.cnt-contact:visible:odd').css('background', '#DEEBF7');
			$('.cnt-contact:visible:even').css('background', '#FBFBFB'); 
			return;
		}

		var s_str = inp_str.toLowerCase();
		s_str = encodeString(s_str);
		$(this).removeClass('cnt-not-found');

		var obj = $('#cnt-contact-list').find('[data-search-exp*='+s_str+']');
		if(!obj.length)
			$(this).addClass('cnt-not-found');

		$('.cnt-contact').hide();
		obj.show();
		$('.cnt-contact:visible:odd').css('background', '#DEEBF7');
		$('.cnt-contact:visible:even').css('background', '#FBFBFB'); 
	});

	$('#cnt-group-list').slimScroll({
		position: 'right',
		height: '500px',
		size: '7px', 
		disableFadeOut: true
	});

	$('#cnt-contact-list').slimScroll({
		position: 'right',
		height: '500px',
		size: '7px', 
		disableFadeOut: true
	});

	$('#cnt-group-list').on('click', '.cnt-group', function(e){
		//e.preventDefault();
		$('.cnt-group').removeClass('selected');
		$(this).addClass('selected');

		$('#cnt-group-selector p').text($(this).attr('data-group-name'));

		updateRoster(false);

		$('.cnt-contact:visible:odd').css('background', '#DEEBF7');
		$('.cnt-contact:visible:even').css('background', '#FBFBFB'); 
	});

	$('#cnt-group-list').on('mouseenter', '.cnt-group', function(e){		
		if($(this).attr('data-group-status') != 'system')
			$(this).find('[class="cnt-group-menu"]').css('display', 'flex');
	});

	$('#cnt-group-list').on('mouseleave', '.cnt-group', function(e){
		if($(this).attr('data-group-status') != 'system' && $.find('[class="modal_back"]').length == 0)
			$(this).find('[class="cnt-group-menu"]').css('display', 'none');
	});

	$('#cnt-group-list').on('click', '.cnt-group-menu', function(e){
		e.stopPropagation();

		var htmlGroupMenu = 
		'<div class="modal_back"></div>\
		<div class = "modal_window" id="ctx-group-menu" data-sort-num = ' + $(this).parent().attr("data-sort-num") + ' data-group-name="' + $(this).parent().attr('data-group-name') + '">\
			<ul>\
				<li>Переименовать</li>\
				<li>Удалить</li>\
			</ul>\
		</div>';

		$('#squad-manager').append(htmlGroupMenu);
		if($('#ctx-group-menu').is(':hidden')){
			$(this).children('div').children('img').attr('src', '/my/data/svg/expand_less.svg');
		}
		else{
			$(this).children('div').children('img').attr('src', '/my/data/svg/expand_more.svg');
		}

		$(this).css("background-size", "cover");

		$('#ctx-group-menu').offset({top:$(this).position().top+16, left:$(this).position().left+16});

		$('#ctx-group-menu ul li').off();
		$('#ctx-group-menu ul li').on('click', function(e){
			var $group = $('#cnt-group-list').find('[data-group-name="' + $('#ctx-group-menu').attr('data-group-name') + '"]'); 

			hideGroupMenu($('#ctx-group-menu'));

			if($(this).html() == 'Переименовать'){
				renameGroup($group);
			}

			if($(this).html() == 'Удалить'){
				deleteGroup($group);
			}
		});

		showModalWindow($('#ctx-group-menu'));
	});

	$('#cnt-group-selector').on('click', function(e){
		var htmlGroupList = '';
		var $groupList;

		$groupList = $('#cnt-group-list').children('.cnt-group');
		htmlGroupList += '<div class="modal_back"></div><div class = "modal_window" id="ctx-group-selector"><ul>'
		
		$groupList.each(function(i, elem){
			htmlGroupList += '<li>' + $(elem).attr('data-group-name') + '</li>';
		});

		$('#squad-manager').append(htmlGroupList);

		if($('#ctx-group-selector').is(':hidden')){
			$(this).children('div').children('div').children('img').attr('src', '/my/data/svg/expand_less.svg');
		}
		else{
			$(this).children('div').children('div').children('img').attr('src', '/my/data/svg/expand_more.svg');
		}

		$('#ctx-group-selector').offset({top:$(this).position().top+16, left:$(this).position().left+16});

		showModalWindow($('#ctx-group-selector'));

		$('#ctx-group-selector ul li').on('click', function(e){
			$('.cnt-group').removeClass('selected');
			$('#cnt-group-list').find('[class*="cnt-group"][data-group-name="' + $(this).text() + '"]').addClass('selected');

			$('#cnt-group-selector p').text($(this).text());

			updateRoster(false);

			$('.cnt-contact:visible:odd').css('background', '#DEEBF7');
			$('.cnt-contact:visible:even').css('background', '#FBFBFB'); 

			hideCtxGroupSelector();
		});
	});

	$('#cnt-select-all').on('click', function(e){
		var checked = $(this).prop('checked');

		var checkbox_checked = $('.cnt-check:visible').not('.cnt-check:disabled');

		$(checkbox_checked).prop('checked', checked);

		 $(checkbox_checked).each(function(i, elem){
			var cnt_checked = $(this).closest('.cnt-contact');

			if(checked)
				$(cnt_checked).addClass('checked');
			else
				$(cnt_checked).removeClass('checked');	
		 });

		calcSelectedItems();
	});

	$('.cnt-check').on('click', function(e){
		var isChecked = $(this).prop('checked');
		var cntChecked = $(this).closest('.cnt-contact');

		if(isChecked)
			$(cntChecked).addClass('checked');
		else
			$(cntChecked).removeClass('checked');

		calcSelectedItems();
	});		

	$('#cnt-selected-num').on('click', function(e){
		updateRoster(true);
	});

	$('.cnt-contact').mouseenter(function(){
		$(this).find('[class="cnt-contact-menu"]').children('div').css('display', 'flex');
		if(($(this).attr('data-cnt-name') == 'telebot') || ($(this).attr('data-group-name') == 'Команда Teleport')){
			$(this).find('[class="cnt-contact-delete"]').css('display', 'none');
			$(this).find('[class="cnt-contact-lock"]').css('display', 'none');
		}
	});

	$('.cnt-contact').mouseleave(function(){
		$(this).find('[class="cnt-contact-menu"]').children('div').css('display', 'none');
	});

	$('#cnt-group-add div').on('click', function(e){
		$('#button-ok').off();
		$('#button-ok').on('click', function(e){
			e.preventDefault();

			var newGroupName = $('<div>').text($('#text-newgroup-name').val()).html();

			var $groupFound = $('#cnt-group-list').find('[data-group-name="' + newGroupName + '"]'); 
			
			if($groupFound.length == 0 && newGroupName != ''){
				addNewGroup(newGroupName);	
				toggleGroupNameWindow();
			}
		});
			
		toggleGroupNameWindow();
		$('#text-newgroup-name').attr('placeholder', 'Введите имя нового канала');
	});

	$('.cnt-contact').on('click', '.cnt-avatar', function(e){
		e.stopPropagation();
		var cntName = $(this).parents('[data-cnt-name]').eq(0).attr('data-cnt-name');
		ContactInfoView(cntName);
	});

	$('#cnt-userinfo').on('click', '.cnt-avatar', function(e){
		e.stopPropagation();
		var cntName = $(this).siblings().eq(0).text();
		ContactInfoView(cntName);
	});

	$('.cnt-contact-view').on('click', function(){
		ContactInfoView($(this).closest('.cnt-contact').attr('data-cnt-name'));
	});

	$('.cnt-contact-delete').on('click', function(){
		var cntContact = $(this).closest('.cnt-contact');
		var cntId = $(cntContact).attr('data-cnt-id');
		var groupName = $(cntContact).attr('data-group-name');
		var cntName = $(cntContact).attr('data-cnt-name');

		var promise = $.when();

		promise = promise.then(function(){
				return deleteContact(cntName);
		}).then(function(result){
			if(JSON.stringify(result) == '"0"'){
				$(cntContact).remove();
			}
			else{
				showMessageBox('Ошибка обработки контакта ' + cntName, 3000);
			}
		});

		promise.then(function(){
			calcSelectedItems();

			updateRoster(false);	

			updateCntNum();
		});
	});

	$('.cnt-contact-lock').mouseenter(function(){
		var groupName = $(this).closest('.cnt-contact').attr('data-group-name');
		if(groupName == 'Канал заблокированных контактов')
			$(this).prop('title', 'Разблокировать контакт');
		else
			$(this).prop('title', 'Заблокировать контакт');
	});

	$('.cnt-contact-lock').on('click', function(e){
		var cntContact = $(this).closest('.cnt-contact');
		var cntName = $(cntContact).attr('data-cnt-name');
		var groupName = 'Канал общих контактов';
		var ttText = 'Заблокировать контакт';
		var bgImage = '/include/cnt-lock-2.png';
		var lock = !($(cntContact).attr('data-group-name') == 'Канал заблокированных контактов'); //true - блокировка
		var btnLock = $(this).children('img');
		var result;

		if(lock){
			groupName = 'Канал заблокированных контактов';
			ttText = 'Разблокировать контакт';
			bgImage = '/include/cnt-unlock-2.png'
		}

		var promise = $.when();

		promise = promise.then(function(){
				return lockContact(cntName, lock);
		}).then(function(result){
			console.log(JSON.stringify(result));
			if(JSON.stringify(result) == '"0"'){
				$(cntContact).find('[class*="cnt-check"]').attr('data-group-name', groupName);
				$(cntContact).attr('data-group-name', groupName);
				$(cntContact).addClass('completed-ok');
			}
			else{
				showMessageBox('Ошибка обработки контакта ' + cntName, 3000);
			}
		});

		promise.then(function(){
			$('.completed-ok').each(function(i, elem){
				$(cntContact).find('[class="cnt-contact-group"]').children('p').text(groupName);
				$('#tooltip').html(ttText);
				$(btnLock).attr('src', bgImage);	
			});
				
			$('.completed-ok').removeClass('completed-ok');
				
			calcSelectedItems();

			updateRoster(false);	
			$('.cnt-contact:visible:odd').css('background', '#DEEBF7');
			$('.cnt-contact:visible:even').css('background', '#FBFBFB'); 

			updateCntNum();
		});
	});

	$('#cnt-settings-menu').on('click', function(e){
		switch($(e.target).parent().attr('id')){
			case 'cnt-gear':
				alert('Настройки');
				break;
			case 'cnt-dog':
				alert('Связаться с разработчиком');
				break;
			case 'cnt-power':
				hideModalWindow($('#squad-manager'));
				$('.modal_back').remove();
		}
	});

	$('#cnt-main-menu').on('click', function(e){
		var groupName = '';
		//(($(this).html() == 'Заблокировать') || ($(this).html() == 'Снять блокировку')) ? 'Канал заблокированных контактов' : $(this).html();
		var promise = $.when();
		var cnt_checked = $('.cnt-contact.checked');
		var cnt_selected;
		var ac = {Delete:0, Lock:1, Unlock:2, Move:3};
		var action, pbLabel;

		var selectedItems = $('.cnt-check:checked').length;
		
		if(selectedItems){
			switch($(e.target).parent().attr('id')){
				case 'cnt-contacts-delete':
					processContacts(ac.Delete, '', 'Удаление контактов');
					break;

				case 'cnt-contacts-lock':
					processContacts(ac.Lock, 'Канал заблокированных контактов', 'Блокировка контактов');
					break;

				case 'cnt-contacts-unlock':
					processContacts(ac.Unlock, 'Канал общих контактов', 'Разблокировка контактов');
					break;

				default:
					showCntDropdownMenu($(e.target).position());
			}
		}

		function showCntDropdownMenu(position){
			var htmlGroupList = '';
			var groupName, $groupList;

			//$groupList = $('#cnt-group-list').find('[class*="cnt-group"][data-group-name != "Все контакты"][data-group-name != "Последние контакты"][data-group-name != "Канал заблокированных контактов"]');
			$groupList = $('#cnt-group-list').children('.cnt-group');
			htmlGroupList += '<div class="modal_back"></div><div class = "modal_window" id="cnt-dropdown-menu"><p>Переместить в</p><ul>'
			
			$groupList.each(function(i, elem){
				groupName = $(elem).attr('data-group-name');
				if(groupName != "Все контакты" && groupName != "Последние контакты" && groupName != "Канал заблокированных контактов")
					htmlGroupList += '<li>' + groupName + '</li>';
			});

			$('#squad-manager').append(htmlGroupList);

			$('#cnt-dropdown-menu ul li').on('click', function(e){
				processContacts(ac.Move, $(this).html(), 'Перенос контактов');
			});
			
			$('#cnt-dropdown-menu').offset({top:position.top+32, left:position.left+32});

			showModalWindow($('#cnt-dropdown-menu'));
		}

		function processContacts(action, groupName, pbLabel){
			showProgressBar(pbLabel, $(cnt_checked).length);

			hideModalWindow($('#cnt-dropdown-menu'));
			$('.modal_back').remove();

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
							return saveContact($(elem).attr('data-cnt-name'), groupName);		
					}
				}).then(function(result){
					console.log(JSON.stringify(result));

					value = $('#progressbar').val();
					$('#progressbar').val(++value);

					if(JSON.stringify(result) == '"0"'){
						//cnt_selected = $('#cnt-selected-list ul').find('[data-cnt-id="' + $(elem).attr('data-cnt-id') + '"][data-channel-name="' + $(elem).attr('data-channel-name') + '"]');
						
						if(action != ac.Delete){
							$(elem).attr('data-group-name', groupName);
							//$(cnt_selected).attr('data-channel-name', channelName);
							$('.cnt-contact').find('[class*="cnt-check"][data-cnt-id="' + $(elem).attr('data-cnt-id') + '"]').attr('data-group-name', groupName);
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
							//$('#cnt-selected-list ul').find('[data-cnt-id="' + $(elem).attr('data-cnt-id') + '"][data-channel-name="' + $(elem).attr('data-channel-name') + '"]').remove();
							break;

						case ac.Lock:
							$(elem).find('.cnt-contact-lock').children('img').attr("src", "/include/cnt-unlock-2.png");
							break;

						case ac.Unlock:
							$(elem).find('.cnt-contact-lock').children('img').attr("src", "/include/cnt-lock-2.png");
							break;
					}

					if(action != ac.Delete)
						$(elem).find('[class*="cnt-contact-group"]').children('p').text(groupName);
				});

				if(action != ac.Delete){
					//$('.cnt-group').removeClass('selected');
					//$('#cnt-group-list').find('[data-group-name="' + groupName + '"]').addClass('selected');
				}
				else{
					$('.completed-ok').remove();
				}

				$('.completed-ok').removeClass('completed-ok');

				updateRoster(false);

				$('.cnt-contact:visible:odd').css('background', '#DEEBF7');
				$('.cnt-contact:visible:even').css('background', '#FBFBFB'); 

				calcSelectedItems();

				updateCntNum();

				hideProgressBar();
			});
		}
	});

// Вспомогательные функции =================================================================================================================================================

	function toggleGroupNameWindow(){
		if(!$('#get-newgroup-name').is(':visible')){
			var cssValues = {
				'transform':'rotate(45deg)',
				'-moz-transform':'rotate(45deg)',
				'-ms-transform':'rotate(45deg)',
				'-webkit-transform':'rotate(45deg)',
				'-o-transform':'rotate(45deg)'
			}

			$('#cnt-group-add div').css(cssValues);
		}else{
			$('#cnt-group-add div').css({transform: 'none'});
			$('#text-newgroup-name').val('');
		}
		$('#get-newgroup-name').slideToggle(200);
		$('#text-newgroup-name').focus();
	}

	function deleteGroup($group){
		var groupName = $group.attr('data-group-name');

		var groupContacts = $('#cnt-contact-list').find('[class*="cnt-contact"][data-group-name="' + groupName + '"]');
		if(groupContacts.length !=0){
			var promise = $.when();
			showProgressBar('Удаление канала', groupContacts.length);

			$(groupContacts).each(function(i, elem){
				promise = promise.then(function(){
						return saveContact($(elem).attr('data-cnt-name'), 'Канал общих контактов');
				}).then(function(result){
					console.log(JSON.stringify(result));

					value = $('#progressbar').val();
					$('#progressbar').val(++value);

					if(JSON.stringify(result) == '"0"'){
						$(elem).attr('data-group-name', 'Канал общих контактов');
						$('#cnt-contact-list').find('[class*="cnt-check"][data-cnt-id="' + $(elem).attr('data-cnt-id') + '"]').attr('data-group-name', 'Канал общих контактов');
						$(elem).find('[class="cnt-contact-group"]').children('p').text('Канал общих контактов');
					}
					else{
						showMessageBox('Ошибка обработки контакта ' + $(elem).attr('data-cnt-name'));
					}
				});
			});

			promise.then(function(){
				console.log('ok');

				$('.cnt-group').removeClass('selected');
				$('#cnt-group-list').find('[data-group-name="Канал общих контактов"]').addClass('selected');

				updateRoster(false);

				hideProgressBar();
			});
		}
		$group.remove();
		updateCntNum();
	}

	function renameGroup($group1){
		toggleGroupNameWindow();
		$('#text-newgroup-name').focus();
		$('#text-newgroup-name').attr('placeholder', 'Введите новое имя канала');

		$('#button-ok').off();
		$('#button-ok').on('click', function(e){
			
			e.preventDefault();

			var oldGroupName = $group1.attr('data-group-name');
			var $groupContacts = $('#cnt-contact-list').find('[class*="cnt-contact"][data-group-name="' + oldGroupName + '"]');

			//экранирование спецсимволов
			var newGroupName = $('<div>').text($('#text-newgroup-name').val()).html(); 

			var $groupFound = $('#cnt-group-list').find('[data-group-name="' + newGroupName + '"]'); 

			toggleGroupNameWindow();

			if(newGroupName != '' && $groupFound.length == 0){
				
				var $group = $('#cnt-group-list').find('[data-group-name="' + oldGroupName + '"]'); 
				$group.attr('data-group-name', newGroupName);
				$group.children('.cnt-group-name p').text(newGroupName);
				
				var promise = $.when();
				showProgressBar('Переименование канала', $groupContacts.length);

				$groupContacts.each(function(i, elem){
					promise = promise.then(function(){
							return saveContact($(elem).attr('data-cnt-name'), newGroupName);
					}).then(function(result){
						console.log(JSON.stringify(result));
						
						value = $('#progressbar').val();
						$('#progressbar').val(++value);
						
						if(JSON.stringify(result) == '"0"'){
							$(elem).attr('data-group-name', newGroupName);
							$('#cnt-contact-list').find('[class*="cnt-check"][data-cnt-id="' + $(elem).attr('data-cnt-id') + '"]').attr('data-group-name', newGroupName);
							$(elem).find('[class="cnt-contact-group"]').children('p').text(newGroupName);
						}
						else{
							showMessageBox('Ошибка обработки контакта ' + $(elem).attr('data-cnt-name'));
						}
					});
				});

				promise.then(function(){
					console.log('ok');

					$('.cnt-group').removeClass('selected');
					$('#cnt-group-list').find('[data-group-name="' + newGroupName + '"]').addClass('selected');

					updateRoster(false);

					updateCntNum();

					hideProgressBar();
				});
			}
		});
	}	

	$('#text-newgroup-name').on('keyup', function(e){
		if(e.keyCode == 13){
			$('#button-ok').click();
		}

		if(e.keyCode == 27){
			toggleGroupNameWindow();
		}
	});

	function hideGroupMenu(groupMenu){
		hideModalWindow($(groupMenu));
		$('.modal_back').remove();
		$('.cnt-group-menu').css('display', 'none');
		$('.cnt-group-menu').children('div').children('img').attr('src', '/my/data/svg/expand_more.svg');
	}

	function addNewGroup(newGroupName){
		var htmlNewGroup = '\
		<div class="cnt-group" data-group-name="' + newGroupName + '" data-group-status="user" data-sort-num="0">\
			<div class="cnt-group-avatar">\
				<div>\
					<img src="/include/cnt-unlock-2.png">\
				</div>\
			</div>\
			<div class="cnt-group-name">\
				<p>' + newGroupName + ' (0)</p>\
			</div>\
			<div class="cnt-group-menu" style="display: flex; width: 25px; display: none;">\
				<div style="width: 35px; height: 25px;">\
					<img src="/my/data/svg/expand_more.svg" style="width:100%;">\
				</div>\
			</div>\
		</div>'

		$('#cnt-group-list').append(htmlNewGroup);

		updateRoster(false);

		updateCntNum();
	}

	function updateRoster(showCheckedOnly){
		if(showCheckedOnly){
			var checkedItems = $('#cnt-contact-list').find('[class*="cnt-contact"][class*="checked"]');
			if(checkedItems.length > 0){
				$('.cnt-contact').hide();
				$('#cnt-contact-list').find('[class*="cnt-contact"][class*="checked"]').show();
			}
		}
		else{
			var groupName = $('#cnt-group-list').find('.selected').attr('data-group-name');

			if(groupName != 'Все контакты'){
				$('.cnt-contact').hide();
				if(groupName == 'Последние контакты')				
					$('#cnt-contact-list').find('[class*="cnt-contact cnt-recent"]').show();
				else
					$('#cnt-contact-list').find('[data-group-name=\"'+groupName+'\"]').show();
			}else
				$('.cnt-contact').show();
		}
	}

	function updateCntNum(){
		var $groupList = $('#cnt-group-list').children('.cnt-group');
		var $contactList, $groupName, groupName;

		$groupList.each(function(i, elem){
			groupName = $(elem).attr('data-group-name');
			if(groupName == 'Все контакты'){
				$contactList = $('#cnt-contact-list').children();
			}
			else{
				if(groupName == 'Последние контакты'){
					$contactList = $('#cnt-contact-list').find('[class*="cnt-contact cnt-recent"]');
				}
				else{
					$contactList = $('#cnt-contact-list').find('[class*="cnt-contact"][data-group-name="' + groupName + '"]');
				}
			}
			$groupName = $(elem).find('[class="cnt-group-name"]').children('p');
			$groupName.text($(elem).attr('data-group-name') + ' (' + $contactList.length + ')');
		});
		$('#cnt-header p').text('Список каналов (' + $groupList.length + ')');
	}

	function calcSelectedItems(){
		var selectedItems = $('.cnt-check:checked').length;

		if(!selectedItems)
			$('#cnt-select-all').prop("checked", false);

		if(selectedItems == $('.cnt-check').length)
			$('#cnt-select-all').prop("checked", true);

		$('#cnt-selected-num p').html('Выбрано: ' + selectedItems);
	}

	function showProgressBar(label, max_value){
		$('#squad-manager').append('<div class="modal_back back_curt"></div>');
		var htmlProgressWindow = $('\
								<div id="progress-window" class="modal_window">\
									<p>' + label +'</p>\
									<progress id="progressbar" value="0" max="' + max_value + '"></progress>\
								</div>\
							');

			$('#squad-manager').append(htmlProgressWindow);

			showModalWindow($('#progress-window'));
	}

	function hideProgressBar(){
		hideModalWindow($('#progress-window'));
		$('.modal_back').remove();
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
}
// end ===========================================================================================================================================================================

function hideCtxGroupSelector(){
	hideModalWindow($('#ctx-group-selector'));
	$('.modal_back').remove();
	$('#cnt-group-selector').children('div').children('div').children('img').attr('src', '/my/data/svg/expand_more.svg');
}

function hideCtxChannelMenu(channelMenu){
	hideModalWindow($(channelMenu));
	$('.modal_back').remove();
	$('.btn-channel-menu').css('display', 'none');
	$('.btn-channel-menu').css("background-image", "url('/my/data/svg/expand_more.svg')");
	$('.btn-channel-menu').css("background-size", "cover");
}