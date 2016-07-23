	function showProgressBar(max_value){
		$('#main_content').append('<div class="modal_back back_curt"></div>');
		var htmlProgressWindow = $('\
								<div id="progress-window" class="modal_window">\
									<span><p>Перенос(удаление) контактов</p></span>\
									<progress id="progressbar" value="0" max="' + max_value + '"></progress>\
								</div>\
							');

			$('#main_content').append(htmlProgressWindow);

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

			$('#main_content').append(htmlCtxChannelMenu);
			if($('#ctx-channel-menu').is(':hidden')){
				$(this).css("background-image", "url('/my/data/svg/expand_less.svg')");
			}
			else{
				$(this).css("background-image", "url('/my/data/svg/expand_more.svg')");
			}

			$(this).css("background-size", "cover");

			var offset = $(this).offset();
			$('#ctx-channel-menu').offset({top:offset.top, left:offset.left-18});

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

			updateContactList_cnt_mngr();
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
			showProgressBar(channelContacts.length);

			$(channelContacts).each(function(i, elem){
				promise = promise.then(function(){
						return saveContact($(elem).attr('data-cnt-name'), 'Канал общих контактов');
				}).then(function(result){
					console.log(JSON.stringify(result));

					value = $('#progressbar').val();
					$('#progressbar').val(++value);

					if(JSON.stringify(result) == '"0"'){
						$(elem).attr('data-channel-name', 'Канал общих контактов');
						$('.cnt-contact-list').find('[class*="cnt-checked"][data-cnt-id="' + $(elem).attr('data-cnt-id') + '"]').attr('data-channel-name', 'Канал общих контактов');
						$(elem).children('td').eq(3).text('Канал общих контактов');
					}
					else{
						showMessageBox('Ошибка обработки контакта ' + $(elem).attr('data-cnt-name'));
					}
				});
			});

			promise.then(function(){
				console.log('ok');

				$('.cnt-channel').removeClass('selected');
				$('.cnt-channel-list').find('[data-channel-name="Канал общих контактов"]').addClass('selected');

				updateContactList_cnt_mngr();

				hideProgressBar();
			});
		}
		objChannel.remove();
	}

	function addNewChannel(){
		var htmlNewChannel = '\
		<tr class="cnt-channel" data-channel-name="Новый канал" data-channel-status="user" data-sort-num="0">\
			<td>\
				<div style="display: inline-block; vertical-align: middle;">Новый канал</div>\
				<div class="btn-channel-menu"></div>\
			</td>\
		</tr>'

		$('.cnt-channel-list tbody').append(htmlNewChannel);

		resetMouseEventListener();

		updateContactList_cnt_mngr();
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
				showProgressBar(channelContacts.length);

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

					updateContactList_cnt_mngr();

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

	function updateContactList_cnt_mngr(showCheckedOnly){
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
	function addCntManagerEvents() {
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
			updateContactList_cnt_mngr(true);
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

		$('#btn-contact-move').on('click', function(e){
			e.stopPropagation();
			
			var selectedItems = $('.cnt-checked:checked').length;

			if(selectedItems){

				var htmlChannelList = '';

				channelList = $('.cnt-channel-list').find('[class="cnt-channel"][data-channel-name != "Все контакты"][data-channel-name != "Последние контакты"][data-channel-name != "Канал заблокированых контактов"]');
				htmlChannelList += '<div class="modal_back"></div><div class = "modal_window" id="cnt-contact-move"><p>Переместить в</p><ul>'
				
				$(channelList).each(function(i, elem){
					htmlChannelList += '<li>' + $(elem).children().eq(0).children().eq(0).text() + '</li>';
				});
				
				htmlChannelList += '<li style="border-top: 1px solid #ddd; padding: 9px 6px;">Заблокировать</li><li style="padding: 9px 6px;">Снять блокировку</li><li style="border-top: 1px solid #ddd; padding: 9px 6px;">Удалить</li></ul></div>';

				$('#main_content').append(htmlChannelList);
				
				if($('#cnt-contact-move ul').is(':hidden'))
					$(this).css("background", "url('/my/data/svg/expand_less.svg')");
				else
					$(this).css("background", "url('/my/data/svg/expand_more.svg')");
				$(this).css("background-size", "cover");

				var offset = $(this).offset();
				$('#cnt-contact-move').offset({top:offset.top, left:offset.left-32});

				showModalWindow($('#cnt-contact-move'));
				
				$('#cnt-contact-move').on('click', function(e){
					return false;
				});

				$('#cnt-contact-move ul li').on('click', function(e){
					var channelName = (($(this).html() == 'Заблокировать') || ($(this).html() == 'Снять блокировку')) ? 'Канал заблокированых контактов' : $(this).html();
					var promise = $.when();
					var cnt_checked = $('.cnt-contact.checked');
					var cnt_selected;
					var ac = {Delete:0, Lock:1, Unlock:2, Move:3};
					var action;

					switch($(this).html()){
						case 'Удалить':
							action = ac.Delete;
							channelName = '';
							
							break;
						case 'Снять блокировку':
							action = ac.Unlock;
							channelName = 'Канал общих контактов';

							break;
						case 'Заблокировать':
							action = ac.Lock;
							channelName = 'Канал заблокированых контактов';

							break;
						default:
							action = ac.Move;
							channelName = $(this).html();
					}

					//e.stopPropagation();
					//e.preventDefault();

					showProgressBar($(cnt_checked).length);

					hideModalWindow($('#cnt-contact-move'));
					$('.modal_back').remove();
					$('#btn-contact-move').css('background', "url('/my/data/svg/expand_more.svg')");

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
						console.log('ok');

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

						updateContactList_cnt_mngr();

						calcSelectedItems();

						hideProgressBar();
					});
				});
			}
		});

		$('.cnt-contact').mouseenter(function(){
			$(this).find('[class="cnt-contact-menu"]').css('display', 'inline-block');
			if($(this).attr('data-cnt-name') == 'support@e-teleport.ru'){
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
				console.log(JSON.stringify(result));
				if(JSON.stringify(result) == '"0"'){
					$(cntContact).remove();
					$('#cnt-selected-list ul').find('[data-cnt-id="' + cntId + '"][data-channel-name="' + channelName + '"]').remove();
				}
				else
					showMessageBox('Ошибка обработки контакта ' + cntName);
			});

			promise.then(function(){
				console.log('ok');

				calcSelectedItems();

				updateContactList_cnt_mngr();	
			});
		});

		$('.cnt-contact-lock').mouseenter(function(){
			var channelName = $(this).closest('.cnt-contact').attr('data-channel-name');
			if(channelName == 'Канал заблокированых контактов')
				$(this).prop('title', 'Разблокировать контакт');
			else
				$(this).prop('title', 'Заблокировать контакт');
		});

		$('.cnt-contact-lock').on('click', function(e){
			var cntContact = $(this).closest('.cnt-contact');
			//var cntId = $(cntContact).attr('data-cnt-id');
			var cntName = $(cntContact).attr('data-cnt-name');
			var channelName = 'Канал общих контактов';
			var ttText = 'Заблокировать контакт';
			var bgImage = "url('/include/cnt-lock.png')";
			var lock = !($(cntContact).attr('data-channel-name') == 'Канал заблокированых контактов'); //true - блокировка
			var btnLock = $(this);
			var result;

			if(lock){
				channelName = 'Канал заблокированых контактов';
				ttText = 'Разблокировать контакт';
				bgImage = "url('/include/cnt-unlock.png')"
			}

			var promise = $.when();

			promise = promise.then(function(){
					return lockContact(cntName, lock);
			}).then(function(result){
				if(JSON.stringify(result) == '"0"'){
					$(cntContact).find('[class*="cnt-checked"]').attr('data-channel-name', channelName);
					$(cntContact).attr('data-channel-name', channelName);
				}
				else
					showMessageBox('Ошибка обработки контакта ' + cntName);
			});

			promise.then(function(){
				$(cntContact).find('[class="cnt-channel-name"]').text(channelName);
				$('#tooltip').html(ttText);
				$(btnLock).css('background-image', bgImage);	
				
				calcSelectedItems();

				updateContactList_cnt_mngr();	
			});
		});
	}