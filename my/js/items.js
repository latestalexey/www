var item_nom = 1;
var items_filter = [];
var noItems = false;

var last_filter_value = "";
var timer_ID = "";
var searchIdletime = 0;
var vi_timeout = "";

var hasAction = false;
var hasNew = false;
var hasBestseller = false;

$(document).ready(function()
{
	$('#item_list_header').css('display','none');
	$("#item_list").css("height", $(".main_pan").height() - $("#items_header").height());
	$('#ext_filters').height($('#ext_pan').height() - $('#ext_pan_header').height() - $('#ext_pan_topblock').height());
	$('#contact_filter, #exp_filter').css('display','none');
	$('#contact_filter, #exp_filter').off();
	$('#it_cart .simple_button').fadeOut(0);
	$('#contact_filter').css('display','inline-block');
	$('#contact_filter').text('Показать МОЙ КАТАЛОГ');
	getFeaturedItems('action');
	getFeaturedItems('popular');
	getFeaturedItems('novetly');
	hideExtPan();
	var contact	= getActiveContact();
	if(contact.id == undefined)	{
		getMyCatalogItems();
	}
	else {	
		getSelectedContactCategories();
	}	
	

	$(window).resize(function() {
		resizeSearching(false);
		$('#ext_filters').height($('#ext_pan').height() - $('#ext_pan_header').height() - $('#ext_pan_topblock').height());
		resizeItemInfo();
		var w = $('#featured-items-block').width();
		var cnt = Math.floor((w/220)+1);
		$('#featured-items-block .item_block:nth-child(-n+'+cnt+')').removeClass('hidden');	
		$('#featured-items-block .item_block:nth-child(n+'+cnt+')').addClass('hidden');	
	});
	
	$('#contact_filter').on('click', function(e) {
		e.stopPropagation();
		hideModalWindow($('.modal_window'));
		$('.modal_back').remove();	
		hideTelebotInfo();
		if(!$('#contact_filter').hasClass('ext_selected')) {
			$('#item_li').empty();
			$('.breadcrumbs').empty();
			hasAction = false;
			hasNew = false;
			hasBestseller = false;
			getFeaturedItems('action');
			getFeaturedItems('popular');
			getFeaturedItems('novetly');
			getMyCatalogItems();
		}
	});
	
	$('#cnt_list').on('click','.contact_inf', function(){
		if($(this).hasClass('active_contact_inf')) { return };
		hideTelebotInfo();
		hasAction = false;
		hasNew = false;
		hasBestseller = false;
		getFeaturedItems('action');
		getFeaturedItems('popular');
		getFeaturedItems('novetly');
		getSelectedContactCategories();
	});
	
	$('.catvwmode').click(function() {
		$('.activevwmode').removeClass('activevwmode');
		$(this).addClass('activevwmode');
		
		var hurl = '/my/index.php?mode=catalog&vwmode=' + $(this).attr('data-ln');
		var contact	= getActiveContact();
		if(!(contact.id == undefined)) {
			hurl = hurl + '&cnt=' + encodeURIComponent(contact.name);
		}
		if((window.location.protocol + '//' + window.location.host+hurl) != window.location.href) {	
			window.history.pushState(null, null, hurl);
		}	
	
		if(contact.id == undefined)	{ contact = smuser;	}

		item_nom = 1;
		$('#item_li').empty();
		//getSelectedContactItems(item_nom, items_filter);
		$('.to-parent-cat').remove();
		getFeaturedItems('action');
		getFeaturedItems('popular');
		getFeaturedItems('novetly');
		getSelectedContactCategories($('.breadcrumbs .current').attr('data-catid'));
	});
	$('#it_extsearch').on('click', function(e) {
		e.stopPropagation();
		if($(this).hasClass('ext_selected')) {
			hideExtPan(true);
		}
		else {
			showExtPan();
			requestExtendedSearch();
		}
		resizeSearching(false);

	});
	$('#ext_pan_header .clw').click(function(e) {
		e.stopPropagation();
		hideExtPan(true);
	});
	$('#it_search_inp').on('focus', function(e) {
		e.stopPropagation();
		resizeSearching(true);
	});
	$('#it_search_inp').on('blur', function(e) {
		e.stopPropagation();
		resizeSearching(true);
	});
	$('#it_search_icon').on('click', function(e) {
		e.stopPropagation();
		if($('#it_search_inp').val() != '') {
			$('#it_search_inp').val('');
			resizeSearching(true);
			if ($('.reset_search', this).length) {
				getSelectedContactCategories($('.breadcrumbs .current').attr('data-catid') || '');
			} else {
				runFiltering();
			};
			$('#it_search_icon').html('<svg fill="#CCC" height="32px" version="1.1" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink">\
				<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"></g>\
				<path d="M19.4271164,21.4271164 C18.0372495,22.4174803 16.3366522,23 14.5,23 C9.80557939,23 6,19.1944206 6,14.5 C6,9.80557939 9.80557939,6 14.5,6 C19.1944206,6 23,9.80557939 23,14.5 C23,16.3366522 22.4174803,18.0372495 21.4271164,19.4271164 L27.0119176,25.0119176 C27.5621186,25.5621186 27.5575313,26.4424687 27.0117185,26.9882815 L26.9882815,27.0117185 C26.4438648,27.5561352 25.5576204,27.5576204 25.0119176,27.0119176 L19.4271164,21.4271164 L19.4271164,21.4271164 Z M14.5,21 C18.0898511,21 21,18.0898511 21,14.5 C21,10.9101489 18.0898511,8 14.5,8 C10.9101489,8 8,10.9101489 8,14.5 C8,18.0898511 10.9101489,21 14.5,21 L14.5,21 Z" id="search"/>\
			</svg>');
		}
		else {
			$('#it_search_inp').focus();
		}
	});
	$('#it_search_inp').keyup(function(e) {
		e.stopPropagation();
		var inp_str = $(this).val();

		searchIdletime = 0;
		if(timer_ID == '' && last_filter_value != inp_str && inp_str != '') {
			timer_ID = setInterval(timeCounter, 500);
		}	

		//filterItmesByValue(inp_str);
		if(inp_str == '') {
			$('#it_search_icon').html('<svg fill="#CCC" height="32px" version="1.1" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink">\
							<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"></g>\
							<path d="M19.4271164,21.4271164 C18.0372495,22.4174803 16.3366522,23 14.5,23 C9.80557939,23 6,19.1944206 6,14.5 C6,9.80557939 9.80557939,6 14.5,6 C19.1944206,6 23,9.80557939 23,14.5 C23,16.3366522 22.4174803,18.0372495 21.4271164,19.4271164 L27.0119176,25.0119176 C27.5621186,25.5621186 27.5575313,26.4424687 27.0117185,26.9882815 L26.9882815,27.0117185 C26.4438648,27.5561352 25.5576204,27.5576204 25.0119176,27.0119176 L19.4271164,21.4271164 L19.4271164,21.4271164 Z M14.5,21 C18.0898511,21 21,18.0898511 21,14.5 C21,10.9101489 18.0898511,8 14.5,8 C10.9101489,8 8,10.9101489 8,14.5 C8,18.0898511 10.9101489,21 14.5,21 L14.5,21 Z" id="search"/>\
						</svg>');
			getSelectedContactCategories($('.breadcrumbs .current').attr('data-catid') || '');			
		}
		else {
			$('#it_search_icon').html('<svg class="transform_icon reset_search" fill="#777" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">\
				<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>\
				<path d="M0 0h24v24H0z" fill="none"></path>\
			</svg>');
		}	
	});	
	
	$("#item_list").scroll(function(e) {
		if (!$('#item_li').children().length || $('#item_li .cat').length || $('div').is('.wait') || noItems) { return };
		var item_li = document.getElementById("item_list");
		if (($("#item_li").height() - $("#item_list").scrollTop() - $("#item_list").height()  < 400)) {
			$('#item_li').append('<div class="wait"><img src="/include/wait.gif"/></div>');
			item_nom = item_nom + 1;
			getSelectedContactItems(item_nom, items_filter);
		};
	});	

	//list_type
	$('#item_li').on('mouseenter','.item', function() {
		var item_block = $(this);
		var stdown = item_block.find('.sub_info');
		stdown.css('display', 'block');
	});
	$('#item_li').on('mouseleave','.item', function() {
		var item_block = $(this);
		var stdown = item_block.find('.sub_info');
		stdown.css('display', 'none');
	});
	$('#item_li').on('click', '.col_1,.col_2,.col_3,.col_4', function() {
		var obj = $(this).parent().parent().parent();//$(this).parents().find('.item').has(this);
		if((obj.attr('id') == 'items_header') || obj.hasClass('cat')) { return; }
		getItemInfo(obj);	
	});

	//block_type
	$('#item_li').on('click', '.item_block_left', function(e) {
		e.stopPropagation();
		var obj = $(this).parent().parent().find('.item_photo_li');
		var pic_size = obj.find('.item_photo').width();
		var obj_num = Number(obj.attr('data-im-num'));
		if(obj_num == 0) { return; }
		
		obj_num = obj_num - 1;
		obj_left = -obj_num*pic_size;
		obj.animate({'left': obj_left+'px'}, 200, function() {obj.attr('data-im-num', obj_num)});
	});
	$('#item_li').on('click', '.item_block_right', function(e) {
		e.stopPropagation();
		var obj = $(this).parent().parent().find('.item_photo_li');
		var pic_size = obj.find('.item_photo').width();
		var obj_num = Number(obj.attr('data-im-num'));
		var obj_count = Number(obj.attr('data-im-count'));
		if(obj_num == obj_count-1) { return; }
		
		obj_num = obj_num + 1;
		obj_left = -obj_num*pic_size;
		obj.animate({'left': obj_left+'px'}, 200, function() {obj.attr('data-im-num', obj_num)});
	});
	$('#item_list').on('click', '.item_block .item_photo, .item_block .item_block_zoom', function(e) {
		e.stopPropagation();
		$('#detail_info_window .item_detail_block_edit').remove();
		var obj = $(this).parent().parent().parent().parent();//$(this).parents().find('.item_block').has(this);
		getItemInfo(obj);
	});
	
	//all types
	$('#item_list').on('click','.cart .cart_order', function(e) {
		//e.stopPropagation();
		$("#it_cart").removeClass('empty');
		var it_cor = $(this).offset();
		var cart_cor = $('#it_cart svg').offset();
		var cart_clone = $(this).clone();
		
		cart_clone.attr('id', 'animated_cart');
		cart_clone.css('top',it_cor.top);
		cart_clone.css('left',it_cor.left);
		
		var item_id = $(this).parent().attr('data-cart-id');
		$('#item_list #it_'+encodeString(item_id) + ' div:first').addClass('item_content_selected');
		$('#content').append(cart_clone);
		cart_clone.animate({top: cart_cor.top, left: cart_cor.left}, 400, function() {
			$('#content #animated_cart').remove(); 
		});
		getItemInfoForDoc($(this).closest('.item_block'));
	});	
	$('#item_li').on('keypress','.cart .cart_input', function(e) {
		e.stopPropagation();
		if (e.ctrlKey || e.altKey || e.metaKey) return;
			var chr = getChar(e);
			if (chr == null) return;
			if ((chr < '0' || chr > '9') && (chr != '.')) {
				return false;
			}
	});
	$('#item_list').on('click','.cart .cart_button', function(e) {
		e.stopPropagation();
		var cart_inp = $(this).parent().find(".cart_input");
		var cart_q = cart_inp.val();
		if ($(this).attr('id') == 'b_plus')
		{ cart_inp.val(++cart_q);}
		else
		{ cart_inp.val(Math.max(0, --cart_q));}
	});
	$('#item_li').on('click','#detail_info_window .item_detail_info_table .simple_button', function(e) {	
		e.stopPropagation();
		$('#detail_info_window .item_detail_info_table .simple_button').toggleClass('ext_selected');
		$('#detail_info_window .item_detail_info_table .info_block').toggleClass('selected');
	});
	$('#item_list').on('click','#detail_info_window .clw', function(e) {	
		e.stopPropagation();
		$('#detail_info_window .item_detail_block_edit').remove();
		$('#detail_info_window').remove();
		$('.item_sign').remove();
	});
	
	//cat downloads
	$('.my_body').on('click', '#cat_dwlnd',function() {
		var contact = getActiveContact();
		hideModalWindow($('.modal_window'));
		$('.modal_back').remove();	
		
		if (contact.id == undefined) {
			getDownloadButtons(smuser.name, 2);
			$('#download_cat').append( 
				'<div class="teleport_links">' +
					'<button class="share_link link_flag"></button><div class="share_text">Поделиться ссылкой с моими контактами</div>' +
					'<button class="public_link link_flag"></button><div class="public_text">Ссылка на каталог доступна всем</div>' +
				'</div>'	
			);
			$.post('/my/ajax/action.php', { action: "getPersonInfo", "contact": smuser.name, "adds": "json" }, function(data) {
				var arUser = JSON.parse(data);
				var isShared = arUser.catalog_shared || 0;
				if (isShared == 1) {
					$('.teleport_links .share_link').addClass('active');
					getSharedCatalog(smuser.name, isShared);
				} else 
				if (isShared == 2)  {
					$('.teleport_links .share_link').addClass('active');
					$('.teleport_links .public_link').addClass('active');
					getSharedCatalog(smuser.name, isShared);
				};
				showModalWindow($('#download_cat'));
			});
		} else {
			$.post('/my/ajax/action.php', { action: "getPersonInfo", "contact": contact.name, "adds": "json" }, function(data) {
				var arUser = JSON.parse(data);
				var isShared = arUser.catalog_shared || 0;
				if (isShared == 0) {
					showTelebotInfo('В настоящее время выбранный контакт не открыл доступ для скачивания своего каталога.','',5000);
					return;
				} else {
					getDownloadButtons(contact.name, isShared);
					getSharedCatalog(contact.name, isShared);
				}
				showModalWindow($('#download_cat'));
			});
		};
		
		function getDownloadButtons(contact, isShared){
			if(isShared == 1) {
				var href = window.location.protocol + '//' + window.location.host + '/my/ajax/files.php?a=catalog&i='+encodeURIComponent('contact='+contact+'&catalog_type=');
			} else {
				var href = 'https://wbs.e-teleport.ru/Catalog_GetSharedCatalog?contact='+contact+'&catalog_type=';
			}	
			$('#main_content').append(
					'<div id="download_cat" class="modal_window">' +
						'<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>' +
						'<div class="teleport_buttons">' +
							'<div class="header">Скачать каталог в формате:</div>' +
							'<div id="teleport_btn">' +
								'<a target="_blank" href="'+href+'teleport" target=_blank class="button" format-value=teleport>Teleport</a>' +
							'</div>' +	
							'<div id="yml_btn">' +
								'<a target="_blank" href="'+href+'yandex" target=_blank class="button" format-value=yandex>Яндекс</a>' +
							'</div>' +	
							'<div id="bitrix_btn">' +
								'<a target="_blank" href="'+href+'bitrix" target=_blank class="button" format-value=bitrix>Bitrix</a>' +
							'</div>' +	
							'<div id="excel_btn">' +
								'<a target="_blank" href="'+href+'excel" target=_blank class="button" format-value=excel>Excel</a>' +						
							'</div>' +
						'</div>' +
						'' +
						'</div>' +
					'</div>'
			);
		};
		
		function getSharedCatalog(contact, isShared){
			$('#download_cat .link-block').remove();
			if(isShared == 1) {
				var href = window.location.protocol + '//' + window.location.host + '/my/ajax/files.php?a=catalog&i='+encodeURIComponent('contact='+contact+'&catalog_type=');
			} else {
				var href = 'https://wbs.e-teleport.ru/Catalog_GetSharedCatalog?contact='+contact+'&catalog_type=';
			}	
			svg_dwnld = '<svg fill="#777" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\
						<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>\
						<path d="M0 0h24v24H0z" fill="none"/>\
						</svg>';
			svg_copy = '<svg fill="#777" height="22" viewBox="0 0 24 24" width="22" xmlns="http://www.w3.org/2000/svg">\
						<path d="M0 0h24v24H0z" fill="none"/>\
						<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>\
						</svg>';
			$('#download_cat').append( 
				'<div class="link-block">\
					<span>Ссылка на каталог в формате Teleport</span>\
					<input value='+href+'teleport readonly>\
					<div class="simple_button link_button link_copy help_icon">\
					<div class="help_info">Скопировать ссылку в буфер обмена</div>'+svg_copy+'</div>\
					<a target="_blank" href="'+href+'teleport"><div class="simple_button link_button link_download help_icon">\
					<div class="help_info">Скачать каталог в формате Teleport</div>'+svg_dwnld+'</div></a>\
					<span>Ссылка на каталог в формате Яндекс</span>\
					<input value='+href+'yandex readonly>\
					<div class="simple_button link_button link_copy help_icon">\
					<div class="help_info">Скопировать ссылку в буфер обмена</div>'+svg_copy+'</div>\
					<a target="_blank" href="'+href+'yandex"><div class="simple_button link_button link_download help_icon">\
					<div class="help_info">Скачать каталог в формате Яндекс</div>'+svg_dwnld+'</div></a>\
				</div>'
			);
			//https://my.e-teleport.ru/my/ajax/files.php?a=catalog&i=
			/*'<span>Ссылка на каталог в формате Bitrix</span>' + 
			'<input value='+href+'bitrix readonly>' +
			'<div class="simple_button link_button link_copy">'+svg_copy+'</div>'+
			'<a href="'+href+'bitrix"><div class="simple_button link_button link_download">'+svg_dwnld+'</div></a>'+
			'<span>Ссылка на каталог в формате Excel</span>' + 
			'<input value='+href+'excel readonly>' +
			'<div class="simple_button link_button link_copy">'+svg_copy+'</div>'+
			'<a href="'+href+'excel"><div class="simple_button link_button link_download">'+svg_dwnld+'</div></a>'+*/
		};
		
		$('#download_cat').on('click', '.link_flag', function() {
			$(this).toggleClass('active');
			
			$('.teleport_links button').attr('disabled', true);
			
			if ($(this).is('.public_link.active')) {
				$(this).siblings('.share_link').addClass('active');
			};

			if (!$(this).is('.share_link.active')) {
				$(this).siblings('.public_link').removeClass('active');
			};
			
			var catalog_shared = 0;
			var shared_link_len = $('.teleport_links .share_link.active').length;
			var public_link_len = $('.teleport_links .public_link.active').length;
			
			if (shared_link_len && public_link_len) {
				catalog_shared = 2;
			};
			
			if (shared_link_len && !public_link_len) {
				catalog_shared = 1;
			};
			$.post("/my/ajax/action.php", "action=setPersonInfo&adds=html&name=" + encodeURIComponent(smuser.name) + "&catalog_shared="+catalog_shared,  function(data){
				$('#download_cat .link-block').remove();
				if (catalog_shared) {
					getSharedCatalog(smuser.name, catalog_shared);
				};
				$('.teleport_links button').attr('disabled', false);
			});
		});
		
		$('#download_cat').on('click', 'input', function() {
			$(this).select();
		});

		$('#download_cat').on('click', '.button',function() {
			//hideModalWindow($('#download_cat'));
		});	
	});
	
	$('.my_body').on('click', '#cat_update',function() {
		var contact = getActiveContact();
		hideModalWindow($('.modal_window'));
		$('.modal_back').remove();	
		$('#main_content').append(
		'<div id="update_cat" class="modal_window">' +
			'<div class="close_line">' +
				'<div class="clw"><img src="/include/close_window.svg"/></div>' +
			'</div>' +	
			'<div class="title">Выберите файл формата xml для обновления каталога</div>' +
			'<form id="catfile_form" name="catfile_form">' +	
				'<div id="add_catfile">' +
					'<svg fill="#777" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">' +
						'<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>' +
						'<path d="M0 0h24v24H0z" fill="none"></path>' +
					'</svg>' +
					'<p>Добавить файл</p>' +
				'</div>' +
				'<div id="cat-fileinfo"></div>' +
				'<div id="upload_catfile" class="button" style="display:none">Обновить каталог</div>' +
				'<input type="file" name="file_catupd" id="file_catupd" style="display:block;">' +
				'<input type="hidden" name="action" value="upload_catfile">' +	
			'</form>' +	
		'</div>'
		);	
		showModalWindow($('#update_cat'));		
		
		var delete_svg = '<svg fill="#BBB" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
			'<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>'+
			'<path d="M0 0h24v24H0z" fill="none"/></svg>';
		var file_html = '<div class="msg_file uploadifive-queue-item"><div class="upfile" ><div class="file_icon"></div>'+
			'<div class="file_block"><p class="filename"></p>'+
			'<p class="file_info"></p></div>'+
			'<a class="del_file close"><div class="cloud">'+delete_svg+'</div></a>'+
			'<div class="fileinfo">Готов к отправке</div>'+
			'<div class="progress"><div class="progress-bar"></div></div>'+
			'</div>';
		
		$(function() {	
			$("#update_cat #file_catupd").uploadifive({
				'multi' : false,
				'auto' : false,
				'uploadScript' : '/my/ajax/action.php',
				'buttonText' : '',
				'buttonClass' : 'filename_button',
				'dnd' : false,
				'queueID' : 'cat-fileinfo',
				'fileSizeLimit' : '20MB',
				'uploadLimit' : 0,
				'queueSizeLimit' : 1,
				'simUploadLimit' : 0,
				'itemTemplate' : file_html,
				'formData': {'action': 'upload_cat'},
				'onAddQueueItem': function(file_obj) {
					var file_name = file_obj.name;
					var fileUrl = file_name, parts, ext = ( parts = file_name.split("/").pop().split(".") ).length > 1 ? parts.pop() : "";
					var file_size = Math.round(file_obj.size/1024);
					var file_idat = getFileType(ext);
					var file_type = file_idat.type;
					var att_svg = file_idat.svg;
					var file_met = "KB";
					if(file_size > 1024) { 
						file_size = Math.round(file_size/1024);
						file_met = "MB";
					}	
					
					$('#cat-fileinfo .msg_file .filename:contains('+encodeString(file_name)+')').each(function(key, value) {
						$(value).parent().parent().find('.file_icon').html(att_svg);
						$(value).next('p').html(file_size+file_met+' '+file_type);
					});
					$('#upload_catfile').show(200);
				},
				'onUploadComplete' : function(file, data) {

				},
				'onQueueComplete' : function() {
					
				},
				'onDialogOpen' : function() {	
					$('#upload_catfile').hide();
				},
				'onCancel' : function(file) {
					$('#upload_catfile').hide();
				}
			});
		});	
		
		$('#add_catfile').on('click', function(e) {	
			$('#update_cat #file_catupd').uploadifive('clearQueue');
			$(this).siblings('#uploadifive-file_catupd').children().last().click();
		});	

		$('#upload_catfile').on('click', function() {	
			alert('Каталог успешно обновлен');
			//hideModalWindow($('#update_cat'));
		});	
	});
	$('.my_body').on('click', '#cat_copy',function() {
		var contact = getActiveContact();
		hideModalWindow($('.modal_window'));
		$('.modal_back').remove();	
		$('#main_content').append(
			'<div id="copy_cat" class="modal_window">' +
				'<div class="close_line">' +
					'<div class="mail_icon active_icon help_icon">' +
						'<div class="help_info"></div>' +
						'<svg fill="#BBB" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">' +
							'<path d="M0 0h24v24H0z" fill="none"></path>' +
							'<path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>' +
						'</svg>' +	
					'</div>' +
					'<div class="clw"><img src="/include/close_window.svg"/></div>' +
				'</div>' +
				'<div class="caption">Каталог '+contact.name+' будет скопирован в МОЙ каталог.<br>Продолжить?</div>' +	
				'<div class="button yes">Да</div>' +	
				'<div class="button no">Нет</div>' +
				'<div class="cat_autoupdate">' +
					'<div class="checkbox"></div><div class="update_val" update-type-value=rest_update>Автообновление остатков</div>' +
					'<div class="mail_icon active_icon help_icon">' +
						'<div class="help_info"></div>' +
						'<svg fill="#BBB" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">' +
							'<path d="M0 0h24v24H0z" fill="none"></path>' +
							'<path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>' +
						'</svg>' +	
					'</div>' +
				'</div>' +							
				'<div class="cat_autoupdate">' +
					'<div class="checkbox"></div><div class="update_val" update-type-value=full_update>Автообновление каталога при изменении каталога контакта</div>' +
					'<div class="mail_icon active_icon help_icon">' +
						'<div class="help_info"></div>' +
						'<svg fill="#BBB" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">' +
							'<path d="M0 0h24v24H0z" fill="none"></path>' +
							'<path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>' +
						'</svg>' +	
					'</div>' +
				'</div>' +
			'</div>'
		);	
		showModalWindow($('#copy_cat'));
		
		$('#copy_cat .cat_autoupdate').on("click", "", function(e){ 
			$(this).find('.checkbox').toggleClass('checked');
		});	
		
		$('#copy_cat').on('click', '.button.no',function() {
			hideModalWindow($('#copy_cat'));
		});

		$('#copy_cat').on('click', '.button.yes',function() {
			var update_params = '';
			$('#copy_cat .cat_autoupdate .checked').each(function(i, checked_obj) {
				update_params = update_params + $(this).siblings('.update_val').attr('update-type-value')+',';
			});
			hideModalWindow($('#copy_cat'));
			InitCatCopy(update_params.substr(0,update_params.length-1));
		});
	});
	
	$('#items_header').on('click', '#it_cart .checkout_button', function(){
		var userDocId = $('#it_cart').attr('data-doc-id');
		var receiver = getActiveContact();
		getTmpDocInfo(userDocId, smuser.name, receiver.name)
		//localStorage.setItem("userDocId", userDocId);
		//localStorage.setItem("sender", smuser.name);
		//localStorage.setItem("receiver", receiver.name);
		//window.location.href = window.location.protocol + '//' + window.location.host+'/my/index.php?mode=orders';	
	});
	
	$('#item_list').on('click', '#detail_info_window .edit_item', function(){
		$('.item_detail_block_edit').remove();
		var arItem = [];
		var item_id = $(this).parents('#detail_info_window').attr('data-detail-id');
		var arr_fld = ['*'];
		var arr_props = ['*'];
		var arr_filter = [{"mode": "item", "name":"id", "operation":"=", "value": item_id}];
		var xhr = new XMLHttpRequest();
		var body =	'action=catalog_getItem' +
					'&adds=json' +
					'&contact=' + encodeURIComponent(smuser.name) +
					'&fields=' + encodeURIComponent(JSON.stringify(arr_fld)) +
					'&properties=' + encodeURIComponent(JSON.stringify(arr_props)) +
					'&filters=' + encodeURIComponent(JSON.stringify(arr_filter)) +
					'&limit=1' + 
					'&nom=1';

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			arItem = JSON.parse(xhr.responseText);
			console.log(arItem);
			var html_props = '';
			$.each(arItem['properties'][item_id], function(key, value){
				html_props = html_props + '<div class="item-prop"><span class="name">'+value.property_name+'</span><input value="'+value.property_value+'"></div>'
			});
			var item_image = (arItem['pictures'].length) ? 'https://wbs.e-teleport.ru/Catalog_Pics/'+arItem['pictures'][item_id][0].file_id : '/include/no_photo.svg';
			var html_str = '<div class="item_detail_block_edit">' +
								'<div class="close" style="float: right;"><img src="/include/close_window.svg"></div>' +
								'<h2>Редактирование карточки товара</h2>' +
								'<div class="left-column">' +
									'<div class="im_it_line">' +
										'<div id="add_item_photo" class="active_icon">' +
											'<svg fill="#CCCCCC" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
												'<defs>' +
													'<path d="M24 24H0V0h24v24z" id="a"></path>' +
												'</defs>' +
												'<clipPath id="b">' +
													'<use overflow="visible" xlink:href="#a"></use>' +
												'</clipPath>' +
												'<path clip-path="url(#b)" d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-3.2-5c0 1.77 1.43 3.2 3.2 3.2s3.2-1.43 3.2-3.2-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2z"></path>' +
											'</svg>' +
										'</div>' +
										'<input class="item_image_input" type="file" name="filename" value="" style="">' +
										'<div id="clear_item_photo" class="active_icon">' +
											'<svg fill="#CCCCCC" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">' +
												'<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>' +
												'<path d="M0 0h24v24H0z" fill="none"></path>' +
											'</svg>' +
										'</div>' +
									'</div>' +
									'<div class="item-photo"><img src="'+item_image+'"></div>' +
								'</div>' +
								'<div class="right-column">' +
									'<div class="button catalog active">Общая информация</div><div class="button properties">Характеристики</div>' +
									'<div class="catalog-block">' +
										'<div class="container">' +
											'<div class="item-catalog"><span class="name">Наименование</span><input value="'+arItem['catalog'][0].name+'"></div>' +
											'<div class="item-catalog"><span class="barcode">Штрихкод</span><input value="'+arItem['catalog'][0].barcode+'"></div>' +
											'<div class="item-catalog"><span class="description">Описание</span><textarea>'+arItem['catalog'][0].description+'</textarea></div>' +
										'</div>' +	
									'</div>' +
									'<div class="properties-block hidden"><div class="container">'+html_props+'</div></div>' +
								'</div>' +	
								'<div class="button save-item-detail">Сохранить</div>' +
							'</div>';
			$('#detail_info_window').append(html_str);
			$('#detail_info_window .item_detail_block_edit').css('max-height',$('#detail_info_window').height()-60);
			$('#detail_info_window .item_detail_block_edit .container').slimScroll({height: '180px', size: '7px', disableFadeOut: false});
		}
		xhr.send(body);
		
		
		
		$('#item_list').on('click', '.item_detail_block_edit .save-item-detail', function(e){	
			var arProps = [];
			$.each(arItem.properties[item_id], function(i, val){
				val.property_value = $('.item_detail_block_edit .properties-block .item-prop:eq('+i+') input').val();
				arProps.push(val);
			});
			var categories = [{
						"uid": arItem.catalog[0].category_uid,
						"name": "",
						"parent_uid": "",
						"sortnum": arItem.catalog[0].sortnum
			}];
			
			var items = [{
					"uid": arItem.catalog[0].uid,
					"name": $('.item_detail_block_edit .catalog-block .name+input').val(),
					"description": $('.item_detail_block_edit .catalog-block .description+textarea').val(),
					"code": arItem.catalog[0].code,
					"article": arItem.catalog[0].article,
					"unit": arItem.catalog[0].unit,
					"price": arItem.catalog[0].price,
					"category_uid": arItem.catalog[0].category_uid,
					"currency_id": arItem.catalog[0].currency_id,
					"item_url": arItem.catalog[0].item_url,
					"barcode": $('.item_detail_block_edit .catalog-block .barcode+input').val(),
					"sortnum": arItem.catalog[0].sortnum,
					"Pictures":[{
						"picture": $('.item-photo img').attr('src')
					}],
					"Properties": arProps,
					"Prices":[{
						"price_type": "",
						"price": arItem.catalog[0].price,
						"currency_id": arItem.catalog[0].currency_id
					}]
			}];

			var xhr = new XMLHttpRequest();
			var body =	'action=Catalog_AddItems' +
						'&cleanBeforeLoading=false' +
						'&Categories=' + encodeURIComponent(JSON.stringify(categories)) +
						'&Items=' + encodeURIComponent(JSON.stringify(items));

			xhr.open("POST", '/my/ajax/action.php', true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() 
			{ 
				if (xhr.readyState != 4) return;
				
				if(!(xhr.responseText.indexOf('%err%') == -1)) {
					showError(xhr.responseText.replace('%err%',''));
					return;
				}
				console.log(xhr.responseText);
			}
			xhr.send(body);
		});
		
		$('#item_list').on('click', '#detail_info_window .item_detail_block_edit .right-column .button', function(){
			if ($(this).hasClass('active')) {
				return
			};
			$('.item_detail_block_edit .right-column .button').removeClass('active');
			if ($(this).hasClass('catalog')) {
				$(this).addClass('active').siblings('.catalog-block').removeClass('hidden');
				$('.item_detail_block_edit .properties-block').addClass('hidden');
			};
			if ($(this).hasClass('properties')) {
				$(this).addClass('active').siblings('.properties-block').removeClass('hidden');
				$('.item_detail_block_edit .catalog-block').addClass('hidden');
			};
		});
		
		$('#item_list').on('click', '#detail_info_window .item_detail_block_edit .close', function(){
			$(this).parents('.item_detail_block_edit').remove();
		});
		
		$('#item_list').on('click', '#detail_info_window .item_detail_block_edit #clear_item_photo', function(e){
			$('#detail_info_window .item_detail_block_edit .item-photo img').attr('src', '../include/no_photo.svg');
		});

		$('#item_list').on('click', '#detail_info_window .item_detail_block_edit #add_item_photo', function(e){
			e.stopPropagation();
			$(this).siblings('.item_image_input').click();
		});
		
		$('#item_list').on('change', '#detail_info_window .item_detail_block_edit .item_image_input', function(e){
			if ($(this)[0].files[0]) {
				var reader = new FileReader();
				reader.onload = function (e) {
					$('#detail_info_window .item_detail_block_edit .item-photo img').attr('src', e.target.result);
				};
				reader.readAsDataURL($(this)[0].files[0]);
				if($('#cnt_view #cnt_info_save').css('display') == 'none') {
					$('#cnt_view #cnt_info_save').css('display','block');
				}
			}
		});
	});

	
	$('#item_li').on('click', '.cat', function(){
		if (!$('.breadcrumbs .breadcrumb.first').length) {
			$('.breadcrumbs').prepend('<li class="breadcrumb first" data-catid="">Главная</div>');
		};	
		if (!$('#item_li .cat.disabled').length) {
			$('.breadcrumbs').addClass('disabled');
			$('#item_li .cat').addClass('disabled');
			var cat_id = $(this).attr('data-catid');
			var cat_name = $('.cat_name', this).text();
			$('#item_li').empty();
			getSelectedContactCategories(cat_id);
			$('.breadcrumbs .breadcrumb.current').removeClass('current');
			$('.breadcrumbs').append('<li class="breadcrumb current" data-catid="'+cat_id+'">'+cat_name+'</div>');
		};
	});
	
	$('.breadcrumbs').on('click', '.breadcrumb', function(){
		if ($(this).hasClass('current')) { return };
		if (!$('.breadcrumbs.disabled').length) {	
			$('#ext_filters .local-it-filters').empty();
			$('.breadcrumbs').addClass('disabled');
			$('#item_li').empty();
			getSelectedContactCategories($(this).attr('data-catid'));
			if ($(this).hasClass('first')) {
				$('.breadcrumbs li').remove();			
			} else {
				$(this).addClass('current').nextAll().remove();			
			}
		};	
	});
	
	$('#it_cart .cart_icon').on('mouseenter', function(){
		$('#it_cart').find('.cart_items').fadeIn(200);
	});
	
	$('#it_cart').on('mouseleave', '.cart_items', function(){
		$(this).fadeOut(200);
	});
	
	$(document).on('click', function(e){
		if (!$(e.target).hasClass('cart_items') && !$(e.target).parents('.cart_items').length) {
			$('#it_cart').find('.cart_items').fadeOut(200);
		}
	});
	
	$('#it_cart').on('click', 'td:last-child .fa', function(e) {
		var contact = getActiveContact();
		var itemId = $(this).attr('data-item-id');
		if (contact.id === undefined || itemId === undefined) return;
		var row = $(this).closest('tr');
		deleteItemFromExistDoc(itemId, contact.name, row);
	});
	
	$('#featured-items-block .button').click(function(){
		var obj = $('#ext_filters .global-it-filters .it_filter[data-filter-name="'+$(this).attr('data-filter-name')+'"]');
		obj.find('.checkbox').toggleClass('checked');
		$('#item_li').html("");
		compileFilter(true);
	});
});

function hideMenuItems(has_catalog){
	$('#contact_filter').css('top','-8px');
	$('.up_pan .up_add_menu').removeClass('hidden').children('.menu_content').remove();
	var contact = getActiveContact();
	var html_str = '';
	if (contact.id == undefined) {
		html_str = '<div class="menu_content">\
						<div style="margin: 0px 10px;">\
							<p id="cat_dwlnd">Скачать текущий каталог контакта</p>\
							<p id="cat_update">Загрузить/обновить товары в "Моем каталоге"</p>\
						</div>\
					</div>';
	} else {
		if (!has_catalog) {
			$('.up_pan .up_add_menu').addClass('hidden');
			if ($('#m_catalog').hasClass('active')) { $('#contact_filter').css('top','4px'); };
		} else {
			html_str = '<div class="menu_content">\
							<div style="margin: 0px 10px;">\
								<p id="cat_dwlnd">Скачать текущий каталог контакта</p>\
								<p id="cat_copy" >Скопировать текущий каталог в "Мой каталог"</p>\
							</div>\
						</div>';
		};
	};
	$('.up_pan .up_add_menu').append(html_str);
	
};

function CatCopy(update_params) {
	/*
	var contact	= getActiveContact();
	var xhr = new XMLHttpRequest();
	var body =	'action=documents_getList' +
					'&rtype=json' +
					'&adds=json_html'+
					'&requestXML=' + encodeURIComponent(JSON.stringify(req_object)) +
					'&start_date=' + getStringFromDate(from_date) + 
					'&end_date=' + getStringFromDate(lastOrderDate) + 
					'&maxlimit=150';
		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function()	{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
		}		
		xhr.send(body);
	*/	
}

function resizeItemInfo() {
	var modal_obj = $('#detail_info_window');
	if(modal_obj.length == 0) {return}

	var modal_width = modal_obj.width();
	var img_width = modal_obj.find('.item_photo_list').width();
	if($('#item_list').width() < 1070) {
			var imMargin = (modal_width - img_width)/2;
			modal_obj.find('.item_photo_list').css('margin-left', imMargin+'px');
	}
	else {
		var new_width = modal_width - img_width - 370;
		modal_obj.find('.item_photo_list').css('margin-left', '');
		modal_obj.find('.item_detail_info_list .item_detail_info_header div:odd').css('max-width', new_width + 'px');
	}	
}

function resizeSearching(inact) {
	var pan_width = $('#it_rule_pan').width();
	var mode_width = $('#vwmode_pan').width();
	/*if(pan_width <= 700) {
		$('#it_cart .info').width(75);
	}
	else if(pan_width <= 886) {
		$('#it_cart .info').width(75);
	}
	else {
		$('#it_cart .info').width('');
	}*/
	if(pan_width <= 700) {
		$('#it_search_inp').width(75);
	}	
	else {
		//var it_cart_width = $('#it_cart').width();
		var usf_width = pan_width - mode_width - 225; //- it_cart_width
		usf_width = usf_width*0.6;
		usf_width = (usf_width <= 100)?100:usf_width;
		usf_width = (($('#it_search_inp').is(':focus') || $('#it_search_inp').val() != '')&& usf_width>150)?usf_width:150;
		if(inact) {
			$('#it_search_inp').animate({width: usf_width}, 200);
		}
		else {
			$('#it_search_inp').width(usf_width);
		}
	}	
}
//Items
function initContactItems(){
	var contact	= getActiveContact();
	if(contact.id == undefined)	{ contact = smuser;	}
	if(!(contact.id == undefined))
	{
		var xhr = new XMLHttpRequest();
		var body =	'action=getPersonInfo' +
					'&adds=json' +
					'&contact=' + encodeURIComponent(contact.name);

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			var arResult = jQuery.parseJSON(xhr.responseText);
			if(!arResult.has_catalog) {
				hideMenuItems(0);
				hideTelebotInfo();
				$('#featured-items-block').addClass('hidden');
				$('#item_li').addClass('no_catalog');
				/*if(contact.id == smuser.id) {
					showTelebotInfo('У вас нет своего каталога. Чтобы узнать, как его завести ознакомтесь с\
					<br>\
					<a href="https://e-teleport.ru/o-produkte" target="_blank">\
						Информацией по загрузке и оформлению собственного каталога\
					</a>\
					<br>\
					или выберите нужный контакт в списке, остальное я сделаю сам.','',0);
				}*/
				showRightPan();
				hideExtPan();
			}
			else {
				$('#item_li').removeClass('no_catalog');
				hideMenuItems(1);
				if(!arResult.allow_stocks)
				{
					$('.col_4').remove();
				}
				if(!arResult.allow_prices)
				{
					$('.col_3').remove();
				}
				hideRightPan();
				showExtPan();
				$('#it_extsearch').addClass('ext_selected');
				requestExtendedSearch();
				resizeSearching(false);
			}
			getSelectedContactItems(item_nom, items_filter);
		}
		xhr.send(body);
	}
}
function getSelectedContactItems(it_nom, it_filter) {
	var contact	= getActiveContact();
	if(contact.id == undefined)	{ contact = smuser;	}
	if($('#item_li').hasClass('no_catalog')) {
		var str = '<div style="width: 100%;">\
			<div style="margin-top: 50px;">\
				<img style="max-height: 300px; border-radius: 50px;" src="/my/ajax/files.php?i='+contact.photo_id+'">\
			</div>\
			<div style="color: #4b5961; background-color: #FFF;">\
				<h1 style="font-weight: 300; font-size: 36px; color: #4b5961; background-color: #FFF;">'+contact.fullname +' не выгружал свой каталог товаров в Телепорт.</h1>\
				<p style="font-size: 20px;">\
					Выберите другой контакт или перейдите в раздел \
					<a href="/my/index.php?mode=messages&cnt='+contact.name+'" style="color: #26a69a; text-decoration: underline;">сообщений</a>\
					, для общения с ним.\
				</p>\
			</div>\
			</div>';
		$('#item_li').html(str);
		$('#it_cart .info').html('');
		$('#it_cart .info').next('div').css('display','none');
		$('#it_cart .info').prev('div').css('display','none');
		return;
	}	

	showTelebotInfo('Формирую каталог товаров','',0);
	noItems = false;

	var list_type = $('.activevwmode').attr('data-ln');
	$('#item_list_header').css('display', (list_type == 'list')?'block':'none');
	if(!(contact.id == undefined))
	{
		var arr_fld = ['id', 'article','name','price','stock','unit','currencyId','action','popular','novetly','action_price','receipt_date','pictures'];
		var xhr = new XMLHttpRequest();
		var body =	'action=catalog_get' +
					'&list_type='+ list_type +
					'&contact=' + encodeURIComponent(contact.name) +
					'&fields=' + encodeURIComponent(JSON.stringify(arr_fld)) +
					'&limit=100' + 
					'&nom=' + it_nom;
		if(!(it_filter == '')) {
			body = body + '&filters=' + encodeURIComponent(JSON.stringify(it_filter));
		}	
			
		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			if(list_type == 'block') {
				$('#item_li').addClass('block_view');
			} else {
				$('#item_li').removeClass('block_view');
			}
			var has_catalog = (it_nom == 1 && xhr.responseText == '' && it_filter == '')?(false):(true);
			if(!has_catalog) {
				$('.wait').remove();
				return;
			}
			
			if(it_nom == 1) {
				$('#item_li').empty();
			}
			showItems(xhr.responseText);
			if(contact == smuser) {
				$('#item_li .cart').remove();
				if(list_type == 'list') {
					$('#item_list_header .col_5').remove();
					$('#item_li .col_5').remove();
				}	
			
			}
			$('.breadcrumbs').removeClass('disabled');
		}		
		xhr.send(body);
	}	
}

function getSelectedContactCategories(cat_id) {
	$('#featured-items-block').hide(0);
	$('#it_cart').find('.cart_items').remove();
	$('#it_cart .simple_button').fadeOut(0);
	cat_id = cat_id || "";
	items_filter = [];
	var contact	= getActiveContact();
	if(contact.id == undefined)	{ contact = smuser;	}
	if(!(contact.id == undefined)){
		var parametrs = ["pics","count"];
		var xhr = new XMLHttpRequest();
		var body =	'action=Catalog_GetCategory' +
				    '&adds=json' +
					'&parent_id=' + encodeURIComponent(cat_id) +
				    '&contact=' + encodeURIComponent(contact.name) + 
					'&parametrs=' + encodeURIComponent(parametrs);			
		
		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			var arCategories = JSON.parse(xhr.responseText);
			if (arCategories.length) {
				var html_str = '';
				if ($('#vwmode_pan .activevwmode').attr('data-ln') === 'block') {
					$.each(arCategories, function(i, val){		
					    var html_img = '';
						for (key = 0; key < 4; key++) {
							var img = (val.pics[key]!=undefined) ? 'https://wbs.e-teleport.ru/Catalog_Pics/prev/'+val.pics[key] : '/include/no_photo.svg';
							html_img = html_img + '<div><img src="'+img+'"></div>'
						};
						html_str = html_str + 
							'<div id="cat_'+val.id+'" class="cat cat_block cat_'+i+'" data-catid="'+val.id+'" data-parent-catid="'+val.parent_id+'">\
								<div class="cat_block_pict">'+html_img+'</div>\
								<div class="cat_block_name cat_name">'+val.name+ ' ('+val.count+')</div>\
							</div>';
					});
				} else {
					$.each(arCategories, function(i, val){		
						html_str = html_str + 
							'<div id="cat_'+val.id+'" class="cat item cat_'+i+'" data-catid='+val.id+' data-parent-catid='+val.parent_id+'>\
								<div class="item_content">\
									<div class="item_line">\
										<div class="col_2 cat_name">'+val.name+'</div>\
									</div>\
								</div>\
							</div>';
					});
				}
				$('#item_list_header').css('display','none');
				$('#item_li').html(html_str).position({'top':0, 'left': 0});
				getItemPosInfo();
			} else {
				item_nom = 1;
				if (cat_id.length) {
					items_filter.push({"mode": "item", "group": "AND", "name":"category_id", "operation":"=", "value": cat_id});
				};	
				initContactItems();
			}
			showExtendedFilters(cat_id);
			$('.breadcrumbs').removeClass('disabled');
			if (!$('.breadcrumbs').children().length) $('#featured-items-block').show(0);
			if ($('#contact_filter').hasClass('ext_selected')) {$('#item_list .cart').hide(0)};
		}		
		xhr.send(body);
	}	
}


function getMyCatalogItems() {
	$('#it_cart').hide(0);

	removeCurrentContact();
	$('#contact_filter').addClass('ext_selected');
	$('#cur_contact').html('<div style="padding: 5px 10px;">\
		<div style="font-weight: 800;"> МОЙ КАТАЛОГ</div>\
		<div style="color: #444; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Для просмотра каталога другого контакта выберите его в списке ваших контактов</div>\
	</div>');

	hideExtPan();
	$('#it_extsearch').removeClass('ext_selected');
	$('#it_search_inp').val('');
	$('#it_search_icon').html('<svg fill="#CCC" height="32px" version="1.1" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink">\
					<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"></g>\
					<path d="M19.4271164,21.4271164 C18.0372495,22.4174803 16.3366522,23 14.5,23 C9.80557939,23 6,19.1944206 6,14.5 C6,9.80557939 9.80557939,6 14.5,6 C19.1944206,6 23,9.80557939 23,14.5 C23,16.3366522 22.4174803,18.0372495 21.4271164,19.4271164 L27.0119176,25.0119176 C27.5621186,25.5621186 27.5575313,26.4424687 27.0117185,26.9882815 L26.9882815,27.0117185 C26.4438648,27.5561352 25.5576204,27.5576204 25.0119176,27.0119176 L19.4271164,21.4271164 L19.4271164,21.4271164 Z M14.5,21 C18.0898511,21 21,18.0898511 21,14.5 C21,10.9101489 18.0898511,8 14.5,8 C10.9101489,8 8,10.9101489 8,14.5 C8,18.0898511 10.9101489,21 14.5,21 L14.5,21 Z" id="search"/>\
				</svg>');
	resizeSearching(true);
	getSelectedContactCategories();
	//initContactItems();
}

function showItemsTotalQuantity(it_filter) {
	if($('#ext_pan_content #it_counter').length == 0) {
		return;
	}
	var contact	= getActiveContact();
	if(contact.id == undefined)	{ contact = smuser;	}

	if(!(contact.id == undefined))
	{
		var xhr = new XMLHttpRequest();
		var body =	'action=catalog_getQuantity' +
					'&contact=' + encodeURIComponent(contact.name);
		if(!(it_filter == '')) {
			body = body + '&filters=' + encodeURIComponent(JSON.stringify(it_filter));
		}	
		$('#ext_pan_content #it_counter').text('...');
		$('#ext_pan_content #it_counter').addClass('fb_waiting');
		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			var cur_quantity = xhr.responseText;
			if(cur_quantity == '' || cur_quantity == 0 || cur_quantity == '0') {
				cur_quantity = 'Нет';
				$('#ext_pan_content #it_counter').removeClass('fb_active').addClass('fb_inactive');
				$('#ext_pan_content #cancel_filters').addClass('fb_active');
			} else {
				$('#ext_pan_content #it_counter').removeClass('fb_inactive').addClass('fb_active');
				$('#ext_pan_content #cancel_filters').removeClass('fb_active');
			}
			$('#ext_pan_content #it_counter').removeClass('fb_waiting');
			$('#ext_pan_content #it_counter').text(cur_quantity + ' товаров');
			$('#ext_pan_content #it_counter').show(100);
		}		
		xhr.send(body);
	}	
}

function showItems(responseText) {
	var list_size = $('#item_li').children().size();
	var item_ID = $('#item_li').children().eq(list_size-2).attr('id');
	var contact = getActiveContact();
	var str = responseText;
	$('#item_li').append(str);
	$('.wait').remove();
	if(str == '') {
		noItems = true;
		if (item_nom >1) {
			showTelebotInfo('Вы просмотрели весь каталог.','',3000);
		} else {
			hideTelebotInfo();
			var search = '';
			if ($('#it_search_inp').val() || $('#it_extsearch').hasClass('ext_selected')){
				search = ',<br>удовлетворяющие условиям поиска';
			} 		
			var str = '<div style="width: 100%;">' +
				'<div style="margin-top: 50px;">' +
					'<img style="height: 400px;" src="/include/eshop.png">' +
				'</div>' +
				'<div style="color: #4b5961; background-color: #FFF;">' +
					'<h1 style="font-weight: 300; font-size: 36px; color: #4b5961; background-color: #FFF;">В текущей категории отсутствуют товары'+search+'</h1>' +
				'</div>' +
				'</div>';
			$('#item_li').html(str);
		}
	}
	else {
		hideTelebotInfo();
	}	
	getItemPosInfo();
	$("#items_header").css('padding-right', $("#work_zone").width() - $("#item_li").width());	
	$("#item_list").css("height", $(".main_pan").height() - $("#items_header").height());
}
function scrollItemBy(obj, yPx, duration) {
	if(duration == 0) {
		$('#item_list').scrollTop($('#item_list').scrollTop() + yPx);
	}
	else {
		var speed = yPx/duration;
		var oldScroll = $('#item_list').scrollTop();
		var newScroll = $('#item_list').scrollTop() + yPx;
		setTimeout(function scrolling() {
			oldScroll = Math.min(oldScroll + speed*100, newScroll); 
			$('#item_list').scrollTop(oldScroll);
			if(oldScroll < newScroll) {
				setTimeout(scrolling, 100);
			}
		},0);
	}	
}
function getItemInfo(obj) {
	console.log(obj);
	var contact	= getActiveContact();
	if(contact.id == undefined)	{ contact = smuser;	}

	var modal_obj = $('#detail_info_window');
	if(modal_obj.length == 0) {
		var edit_icon = (contact.id==smuser.id) ? '<div class="edit_item" style="float: right;"><i class="fa fa-pencil-square-o"></i></div>' : '';
		modal_obj = $(  '<div id="detail_info_window" class="item_detail_block">' +
						'<div class="clw" style="float: right;"><img src="/include/close_window.svg"/></div>' +
						edit_icon +
						'<div id="detail_item_info"></div>' +
						'</div>'
					);
	}	
	console.log(modal_obj);
	var list_type = $('.activevwmode').attr('data-ln');
	if(list_type == 'block') {
		modal_obj.css('float', 'left');
	}
	modal_obj.attr('data-detail-id', obj.attr('data-it-id'));

	if(!(contact.id == undefined))
	{
		var obj_sizes = {"width": $('#item_list').width(), "height": $('#item_list').height()};

		var arr_fld = ['*'];
		var arr_props = ['*'];
		var arr_filter = [{"mode": "item", "name":"id", "operation":"=", "value": obj.attr('data-it-id')}];
		var xhr = new XMLHttpRequest();
		var body =	'action=catalog_getItem' +
					'&list_type='+ list_type +
					'&sizes=' + encodeURIComponent(JSON.stringify(obj_sizes))+
					'&contact=' + encodeURIComponent(contact.name) +
					'&fields=' + encodeURIComponent(JSON.stringify(arr_fld)) +
					'&properties=' + encodeURIComponent(JSON.stringify(arr_props)) +
					'&filters=' + encodeURIComponent(JSON.stringify(arr_filter)) +
					'&limit=1' + 
					'&nom=1';

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			modal_obj.find('#detail_item_info').html(xhr.responseText);
			
			if(modal_obj.offset().top < obj.offset().top && $('#item_list #detail_info_window').length > 0) {
				$('#item_list').scrollTop($('#item_list').scrollTop() - modal_obj.height());
			}
			
			obj.after(modal_obj);
			if(obj.hasClass('item_block')) {
				obj.append('<div class="item_sign" style="top: '+(obj.height()-7)+'px;"></div>');
			}	

			var obj_height = obj.height();
			var modal_height = modal_obj.height();
			var list_height = $('#item_list').height();
			var yPx = obj.offset().top - $('#item_list').offset().top;
			if(obj_height + modal_height +30 > list_height) {
				yPx = yPx + obj_height + Math.min(modal_height - list_height + 30,0);
			}
			scrollItemBy(obj, yPx, 300);
			resizeItemInfo();
		}		
		xhr.send(body);
		$('.item_sign').remove();
	}	
}

function timeCounter() {
	searchIdletime = searchIdletime + 500;
	if(searchIdletime >= 1000) {
		runFiltering();
	}
}

function runFiltering() {
	var inp_value = $('#it_search_inp').val();
	if(last_filter_value == inp_value) {
		return;
	}	

	$('#item_li').empty();

	compileFilter(true);
	last_filter_value = inp_value;
	clearInterval(timer_ID);
	timer_ID = "";
}

function compileFilter(getItems) {
	clearTimeout(vi_timeout);
	items_filter = [];
	var vi_flag = false;
	var inp_value = $('#it_search_inp').val();
	if(inp_value != '') {
		items_filter = [{"mode": "item", "group": "OR", "name":"name", "operation":"LIKE", "value": inp_value},
					{"mode": "item", "group": "OR", "name":"article", "operation":"LIKE", "value": inp_value},
					{"mode": "item", "group": "OR", "name":"barcode", "operation":"LIKE", "value": inp_value}];
	}
	
	if($('#it_extsearch').hasClass('ext_selected') && $('.breadcrumbs .current').length) {
		items_filter.push({"mode": "item", "group": "AND", "name":"category_id", "operation":"=", "value": ($('.breadcrumbs .current').attr('data-catid') || '')});
	}
	
	var boolean_obj = $('#ext_pan_content #it_filters .it_filter[data-filter-type=boolean] .checked');
	if(boolean_obj.length != 0) {
		var parent_obj = boolean_obj.parent();
		items_filter.push({"mode": "prop", "group": "AND", "name": parent_obj.attr('data-filter-name'), "operation":"NOT IN", "value": '"0","false","","Нет"'});
		vi_flag = true;
	}	
	
	var string_obj = $('#ext_pan_content #it_filters .it_filter[data-filter-type=string] .filter_string .filter_input');
	if(string_obj.length != 0) {
		if(string_obj.val() != '') {
			var parent_obj = string_obj.parent().parent();
			items_filter.push({"mode": "prop", "group": "AND", "name": parent_obj.attr('data-filter-name'), "operation":"LIKE", "value": string_obj.val()});
		}	
		vi_flag = true;
	}	
	
	var float_obj = $('#ext_pan_content #it_filters .it_filter[data-filter-type=float] .filter_float');
	if(float_obj.length != 0) {
		var float_obj_from = float_obj.find('input').eq(0);
		var float_obj_to = float_obj.find('input').eq(1);
		if(float_obj_from.val() != '' || float_obj_to.val() != '') {
			var parent_obj = float_obj.parent();
			if(float_obj_from.val() != '') {
				items_filter.push({"mode": "prop", "group": "AND", "name": parent_obj.attr('data-filter-name'), "operation":">=", "value": float_obj_from.val()});
			}	
			if(float_obj_to.val() != '') {
				items_filter.push({"mode": "prop", "group": "AND", "name": parent_obj.attr('data-filter-name'), "operation":"<=", "value": float_obj_to.val()});
			}	
		}
		vi_flag = true;
	}	
	
	var enum_obj = $('#ext_pan_content #it_filters .it_filter[data-filter-type=enum]');
	if(enum_obj.length != 0) {
		enum_obj.each(function(i, one_enum) {
			var enum_list = '';
			var filter_obj = $(one_enum).next('div').find('.it_filter_value .checked');
			filter_obj.each(function(i, checked_obj) {
				var name_obj = $(checked_obj).parent().find('.enum_name');
				enum_list = (enum_list == '')?(''):(enum_list+',');
				enum_list = enum_list + '"'+name_obj.text()+'"';
			});
			if(enum_list != '') {
				items_filter.push({"mode": "prop", "group": "AND", "name": $(one_enum).attr('data-filter-name'), "operation":"IN", "value": enum_list});
			}	
		});
		vi_flag = true;
	}
	
	var items_obj = $('#ext_pan_content #it_filters').find('.it_filter[data-filter-type=items]');
	if(items_obj.length) {
		items_obj.each(function(i, item) {
			if ($('.checked', item).length){
				items_filter.push({"mode": "item", "group": "AND", "name": $(item).attr('data-filter-name'), "operation":"NOT IN", "value": '"0","false","","Нет"'});
				vi_flag = true;
			};
		});
	}
	showItemsTotalQuantity(items_filter);
	item_nom = 1;
	if(getItems) {
		getSelectedContactItems(item_nom, items_filter);
	} else if(vi_flag) {
		vi_timeout = setTimeout(function viewItems() {
			getSelectedContactItems(item_nom, items_filter);
		},2000);
	}
	$('#featured-items-block').slideUp(500);
}

function changeSelectedText(enum_filter) {
	var enumValue = enum_filter.find(".enum_name").text();
	var filterObj = enum_filter.parent().prev('div');
	var textObj = filterObj.find('.sel_enum');
	var check = enum_filter.find('.checkbox').hasClass('checked');
	if(check) {
		var newText = (textObj.text() == '')?(''):', ';
		newText = newText + enumValue;
		textObj.text(textObj.text() + newText);
		filterObj.addClass('it_filter_selected');
		filterObj.append('<div class="fb_cancel"></div>');
	} else {
		var newText = textObj.text();
		if(newText == enumValue) {
			newText = '';
		} else {
			newText = newText.replace(', '+enumValue,'');
			newText = newText.replace(enumValue+', ','');
		}	
		textObj.text(newText);
		if(newText == '') {
			filterObj.removeClass('it_filter_selected');
			filterObj.find('.fb_cancel').remove();
		}	
	}
}

function requestExtendedSearch() {
	$('#ext_pan_header_content').html('<div style="text-align: center; padding: 13px 10px; color: #777; font-weight: 800; border-bottom: 1px solid #CCC;">Расширенный поиск товаров</div>');

	var contact	= getActiveContact();
	if(contact.id == undefined)	{ contact = smuser;	}

	if(!(contact.id == undefined)) {

			$('#ext_pan_content').on('click','#cancel_filters', function(e) {
				e.stopPropagation();
				cancelFilters();
			});
			$('#ext_pan_content').on('click','#it_counter', function(e) {
				e.stopPropagation();
				compileFilter(true);
			});


			$('#ext_pan_content').on('click','.it_filter_value', function(e) {
				e.stopPropagation();
				$(this).find('.checkbox').toggleClass('checked');
				changeSelectedText($(this));
				compileFilter(false);	
			});	
			
			$('#ext_pan_content').on('click','.it_filter[data-filter-type=boolean], #it_filters .it_filter[data-filter-type=items]', function(e) {
				e.stopPropagation();
				$(this).find('.checkbox').toggleClass('checked');
				compileFilter(false);	
			});
			
			$('#ext_pan_content').on('click','.it_filter[data-filter-type=enum]', function(e) {
				e.stopPropagation();
				if($(this).hasClass('it_filter_expanded')) {
					$(this).next('div').toggle(200, function() {;});
					$(this).toggleClass('it_filter_expanded');
				} else {
					$('#it_filters .it_filter[data-filter-type=enum]').removeClass('it_filter_expanded');
					$('#it_filters .it_filter[data-filter-type=enum]').next('div').slideUp(200);
					$(this).next('div').slideDown(200);
					$(this).addClass('it_filter_expanded');				
				}
				$('#it_filters').scrollTop(0);
			});	
			
			$('#ext_pan_content').on('click','#it_filters .it_filter[data-filter-type=enum] .fb_cancel', function(e) {
				e.stopPropagation();
				var filterObj = $(this).parent();
				filterObj.next('div').find('.checkbox').removeClass('checked');
				filterObj.find('.sel_enum').text('');
				filterObj.removeClass('it_filter_selected');
				filterObj.find('.fb_cancel').remove();
				compileFilter(false);	
			});	
			
			$('#ext_pan_content').on('keyup','.float_input, .filter_input', function(e) {
				e.stopPropagation();
				compileFilter(false);	
			});
			
			$('#ext_pan_content').on('keypress','.float_input', function(e) {
				e.stopPropagation();
				if (e.ctrlKey || e.altKey || e.metaKey) return;
				var chr = getChar(e);
				if (chr == null) return;
				if ((chr < '0' || chr > '9') && (chr != '.')) {
					return false;
				}
			});
	}							
}

function cancelFilters() {
	$('#ext_filters .checked').removeClass('checked');
	$('#ext_filters .float_input, #ext_filters .filter_input').val('');
	getSelectedContactCategories($('.breadcrumbs .current').attr('data-catid') || '');
}

function showExtendedFilters(cat_id) {
		var obj = $('#ext_pan_content');
		obj.append('<div id="ext_filters">\
									<div id="it_filters" class="global-it-filters"></div>\
									<div id="it_filters" class="local-it-filters"></div>\
								</div>');
		if(obj.is('.wait')) {
			return;
		}
		var contact	= getActiveContact();
		if(contact.id == undefined)	{ contact = smuser;	}

		if(!(contact.id == undefined))	{
			obj.append('<div class="wait" style="background-color: #FFF;"><img src="/include/wait.gif"/></div>')
			var xhr = new XMLHttpRequest();
			var body =	'action=catalog_FiltersGet' +
					'&contact=' + encodeURIComponent(contact.name) +
					'&category_id=' + encodeURIComponent(cat_id) + 
					'&enum_values=true';

			xhr.open("POST", '/my/ajax/action.php', true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() 
			{ 
				if (xhr.readyState != 4) return;
				
				if(!(xhr.responseText.indexOf('%err%') == -1)) {
					showError(xhr.responseText.replace('%err%',''));
					return;
				}
				obj.find('.wait').remove();
				if (!obj.children('#ext_pan_topblock').length) {
					obj.prepend('<div id="ext_pan_topblock">\
						<div style="padding: 20px 0; text-align: center;">\
							<div id="it_counter" class="filter_button fb_active" style="margin-right: 10px;">...</div>\
							<div id="cancel_filters" class="filter_button">Сбросить всё</div>\
						</div>'
					);
				};
				var no_filters = false;
				var local_filters = obj.find('.local-it-filters');
				var global_filters = obj.find('.global-it-filters');
				if (cat_id.length) {
					local_filters.prepend(xhr.responseText);
					items_filter.push({"mode": "item", "group": "AND", "name":"category_id", "operation":"=", "value": cat_id})
				} else {
					global_filters.html(xhr.responseText);
					if (hasAction && !$('.breadcrumbs').children().length) {
						global_filters.prepend('<div class="it_filter" data-filter-group-id="" data-filter-type="items" data-filter-name="action"><div class="checkbox"></div><div class="filter_name">Товары по акции</div></div>');
					};
					if (hasNew && !$('.breadcrumbs').children().length) {
						global_filters.prepend('<div class="it_filter" data-filter-group-id="" data-filter-type="items" data-filter-name="novetly"><div class="checkbox"></div><div class="filter_name">Новинки</div></div>');
					};
					if (hasBestseller && !$('.breadcrumbs').children().length) {
						global_filters.prepend('<div class="it_filter" data-filter-group-id="" data-filter-type="items" data-filter-name="popular"><div class="checkbox"></div><div class="filter_name">Лидеры продаж</div></div>');
					};
				};
				if(!local_filters.children().length && !global_filters.children().length) {
					global_filters.html('<div class="empty_cat">В каталоге нет настроенных расширенных фильтров для выбранной категории товаров</div>');
				}			
				$('#ext_filters').height($('#ext_pan').height() - $('#ext_pan_header').height() - $('#ext_pan_topblock').height());
				showItemsTotalQuantity(items_filter);
				ShowStocks();
			}		
			xhr.send(body);
		}	
}

function ShowStocks() {
	var obj = $('#ext_pan_content .global-it-filters');
	if (obj.find('#show_stocks').length) return;
	var contact = getActiveContact();
	if (contact.id == undefined) {
		contact = smuser;
	};

	$.post(
		'/my/ajax/action.php', 
		{ action: "getPersonInfo", "contact": contact.name, "adds": "json" }, 
		function(data) {
			var arUser = JSON.parse(data);
			if (arUser.has_catalog && arUser.allow_stocks) {
				var stocks_obj = $('#ext_pan_content #it_filters').find('.it_filter[data-filter-name=stock]');
				if (!stocks_obj.length) {
					obj.find('.empty_cat').remove();			
					obj.prepend('<div class="it_filter" data-filter-group-id="" data-filter-type="items" data-filter-name="stock"><div class="checkbox"></div><div class="filter_name">В наличии</div></div>');
				}			
			};
		}
	);
};



function InitCatCopy(update_params) {
	console.log(update_params);
}

function getItemInfoForDoc(obj) {
	var contact = getActiveContact();
	if(!(contact.id == undefined)){
		var arr_fld = ['*'];
		var arr_props = ['*'];
		var arr_filter = [{"mode": "item", "name":"id", "operation":"=", "value": obj.attr('data-it-id')}];
		var xhr = new XMLHttpRequest();
		var body =	'action=catalog_get' +
					'&adds=json' +
					'&contact=' + encodeURIComponent(contact.name) +
					'&fields=' + encodeURIComponent(JSON.stringify(arr_fld)) +
					'&properties=' + encodeURIComponent(JSON.stringify(arr_props)) +
					'&filters=' + encodeURIComponent(JSON.stringify(arr_filter)) +
					'&limit=1' + 
					'&nom=1';
		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			var arResult = JSON.parse(xhr.responseText);
			var arResult = arResult.catalog[0];

			var id = arResult.id;
			var article = arResult.article;
			var name = arResult.name;
			var quantity = parseInt($('.cart_input', obj).val());
			var confirmed = 0;
			var price = parseInt(arResult.price);
				price = isNaN(price) ? 0.00 : (price).toFixed(2);
			var sum = (price*quantity).toFixed(2);
			var unit = 'шт';
			var Item =
			{
				owner:contact.name,
				id:id, 
				article:article, 
				name:name, 
				unit:unit, 
				quantity:quantity, 
				confirmed:confirmed, 
				price:price, 
				sum:sum, 
				props:[]
			};
			$.post('/my/ajax/order.php', { action: 'Documents_GetUserLastDocId', receiver: contact.name }, function(data) {
				(data) ? addItemToExistDoc(Item, contact.name) : addItemToNewDoc(Item, contact.name);
			});	
		}		
		xhr.send(body);
	};

};

function deleteItemFromExistDoc(itemId, contact, row) {
	$.post('/my/ajax/order.php', { action: 'Documents_deleteItemFromExistDoc', itemId: itemId, receiver: contact }, function(data){
		if (data==1) {
			var cnt = $('#it_cart .info span').text()*1 - 1;
			if (cnt) {
				var sum = $('td:nth-child(3)', row).text();
				var totalsum = $('#it_cart .total_sum span').text();
				sum = sum.replace(/\s/g, '')*1;
				totalsum = totalsum.replace(/\s/g, '')*1;
				$('#it_cart .total_sum span').text(number_format(totalsum - sum, 2, '.', ' '));
				$('#it_cart .info span').text(cnt);
				$('#item_list #it_'+itemId+' .item_block_info').removeClass('item_content_selected');
				row.remove();
			}
			else {
				$('#it_cart .info span').text(0);
				$('#it_cart .cart_items').remove();
				$('#it_cart').removeClass('not_empty');
				$('#item_list .item_block_info').removeClass('item_content_selected');
			};
		};
	});
};

function addItemToExistDoc(Item, contact) {
	$.post('/my/ajax/order.php', { action: 'Documents_addItemToExistDoc', item: JSON.stringify(Item), receiver: contact }, function(data){
		getItemPosInfo();
	});
};


function addItemToNewDoc(Item, contact) {
	$.post('/my/ajax/order.php', { action: 'Documents_GetLastId'}, function(docid) {
		var curDate = new Date;
		var message = {
			"docHeader":{
				"id":++docid,
				"status":"new",
				"owner":smuser.name,
				"type":"order",
				"date":curDate,
				"num":"",
				"hash":"00001234",
				"sum":Item.sum,
				"currencyId":"RUB",
				"comment":"",
				"props":[]
			},
			"tabHeader":{
				"article":"Артикул",
				"name":"Товар/Услуга",
				"unit":"Ед. изм.",
				"quantity":"Кол-во",
				"confirmed":"Подтверждено",
				"price":"Цена",
				"sum":"Всего",
				"props":[]
			},
			"docTable":[Item]
		};		
		$.post('/my/ajax/order.php', { 
			action: 'Documents_addNew',
			message_id: docid, 
			sender: smuser.name, 
			receiver: contact, 
			message: JSON.stringify(message),
			type: message.docHeader.type, 
			status: message.docHeader.status, 
			date: curDate,
			num: message.docHeader.num,
			sum: message.docHeader.sum,
			currencyId: message.docHeader.currencyId, 
			hash: message.docHeader.hash
			}, 
			function(data) {
				getItemPosInfo();
			}
		);
	});	
};


function getItemPosInfo() {
	$('#it_cart .cart_items').remove();
	var contact = getActiveContact();
	if (contact.id != undefined) {
		$.post('/my/ajax/order.php', {action: 'Documents_getItemPosInfo', receiver: contact.name}, function(data){
			try {
				var UserDocs = JSON.parse(data);
				var UserItemsQty = UserDocs.docTable.length*1;
				if (UserItemsQty) {
					var html_str = '';
					$.each(UserDocs.docTable, function (i, val) {
						$('#item_list').find('.item_block[data-it-id="'+val.id+'"]').children('.item_block_info').addClass('item_content_selected');
						html_str = html_str + '<tr>';
						html_str = html_str + '<td>'+val.name+'</td>';
						html_str = html_str + '<td>'+val.quantity+'</td>';
						html_str = html_str + '<td>'+number_format(val.sum, 2, '.', ' ')+'</td>';
						html_str = html_str + '<td><i class="fa fa-times" data-item-id='+val.id+'></i></td>';
						html_str = html_str + '</tr>';
					});
					$('#it_cart').append('<div class="cart_items"><table><tbody><tr><th>Наименование</th><th>Кол-во</th><th>Сумма</th><th></th></tr>'+html_str+'</tbody></table><div class="total_sum"><b>Итого: </b><span>'+number_format(UserDocs.docHeader.sum, 2, '.', ' ')+'</span></div><div class="simple_button checkout_button" style="padding: 7px 10px 6px; display: inline-block;">Оформить заказ</div></div>');
					$('#it_cart .simple_button').fadeIn(100);
				}			
				$('#it_cart .info').html('<span>'+UserItemsQty+'</span>');
				UserItemsQty ? $('#it_cart').addClass('not_empty') : $('#it_cart').removeClass('not_empty');
				$('#it_cart').attr('data-doc-id', UserDocs.docHeader.id);
			}
			catch(e) {
				$('#it_cart').attr('data-doc-id', 0);
			};	
		})	
	}	
};


function getFeaturedItems(itemType) {
	itemType = itemType.toLowerCase();
	var list_type =  $('#vwmode_pan .activevwmode').attr('data-ln');
	var item_qty = (list_type === 'block') ? 10 : 5;
	var contact = getActiveContact();
	if (typeof contact.id === 'undefined') contact = smuser;
	if (typeof contact.id === 'undefined') return;
	var arr_fld = ['id', 'article','name','price','stock','unit','currencyId','action','popular','novetly','action_price','receipt_date','pictures'];
	var arr_filter = [{"mode": "item", "name": itemType, "operation": "NOT IN", "value": '"0","false","","Нет"'}];
	var xhr = new XMLHttpRequest();
		var body =	'action=catalog_get' +
					'&list_type=' + list_type +
					'&contact=' + encodeURIComponent(contact.name) +
					'&fields=' + encodeURIComponent(JSON.stringify(arr_fld)) +
					'&filters=' + encodeURIComponent(JSON.stringify(arr_filter)) +
					'&limit=' + item_qty +
					'&nom=1';
	xhr.open("POST", '/my/ajax/action.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() { 
		if (xhr.readyState != 4) return;
		
		if(!(xhr.responseText.indexOf('%err%') == -1)) {
			showError(xhr.responseText.replace('%err%',''));
			return;
		}	
		Items = xhr.responseText;
		if (Items.length) {
			switch(itemType) {
				case 'action':
					hasAction = true;
					break;
				case 'novetly':
					hasNew = true;
					break;
				case 'popular':
					hasBestseller = true;
					break;
			}
			$('#item_'+itemType+' .container').html(Items);
			$('#item_'+itemType).removeClass('hidden');
			$('#featured-items-block').removeClass('hidden');	
		}
		var w = $('#featured-items-block').width();
		var cnt = Math.floor((w/220)+1);
		
		$('#featured-items-block .item_block:nth-child(-n+'+cnt+')').removeClass('hidden');	
		$('#featured-items-block .item_block:nth-child(n+'+cnt+')').addClass('hidden');	
	}		
	xhr.send(body);
	
};