var item_nom = 1;
var items_filter = [];
var noItems = false;

var last_filter_value = "";
var timer_ID = "";
var searchIdletime = 0;
var vi_timeout = "";
/*var div_waiting = '<div class="wait" style="margin-top: 250px;">\
			<img src="/include/telebot.png"/><br>\
			<span style="font-size: 14px; font-weight: 600;">Просматриваю каталог...</span><br>\
			<img src="/include/wait.gif"/></div>';*/

$(document).ready(function()
{
	$("#item_list").css("height", $(".main_pan").height() - $("#items_header").height());
	$('#ext_filters').height($('#ext_pan').height() - $('#ext_pan_header').height() - $('#ext_pan_topblock').height() -30);
	$('.up_pan .up_add_menu .menu_content').remove();
	$('.up_pan .up_add_menu').append('<div class="menu_content">\
											<div style="margin: 0px 10px;">\
												<p id="cat_dwlnd">Скачать текущий каталог контакта</p>\
												<p id="cat_copy" >Скопировать текущий каталог в "Мой каталог"</p>\
												<p id="cat_update">Загрузить/обновить товары в "Моем каталоге"</p>\
											</div></div>');
	$('#contact_filter, #exp_filter').css('display','none');
	$('#contact_filter, #exp_filter').off();
	
	$('#contact_filter').css('display','inline-block');
	$('#contact_filter').text('Показать МОЙ КАТАЛОГ');
	hideExtPan();
	hideMenuItems();
	
	var contact	= getActiveContact();
	if(contact.id == undefined)	{
		getMyCatalogItems();
	}
	else {	
		showTelebotInfo('Формирую каталог товаров','',0);
		getItemPosInfo();
		initContactItems();
	}	

	/*$('#ext_pan').resize(function() {
		resizeSearching(false);
		resizeItemInfo();
	});*/
	$(window).resize(function() {
		resizeSearching(false);
		$('#ext_filters').height($('#ext_pan').height() - $('#ext_pan_header').height() - $('#ext_pan_topblock').height()-30);
		resizeItemInfo();
	});
	
	$('#contact_filter').on('click', function(e) {
		e.stopPropagation();
		hideModalWindow($('.modal_window'));
		$('.modal_back').remove();	
		hideMenuItems();
		$('#it_cart .info').html('');
		if(!$('#contact_filter').hasClass('ext_selected')) {
			getMyCatalogItems();
		}
	});
	
	$('#cnt_list').on('click','.contact_inf', function(){
		if($(this).hasClass('active_contact_inf')) { return };
		getItemPosInfo();
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
		$('#item_li').html('');
		showTelebotInfo('Формирую каталог товаров','',0);
		getSelectedContactItems(item_nom, items_filter);
		
	});
	$('#it_extsearch').on('click', function(e) {
		e.stopPropagation();
		if($(this).hasClass('ext_selected')) {
			hideExtPan();
			$('#it_extsearch').removeClass('ext_selected');
		}
		else {
			showExtPan();
			$('#it_extsearch').addClass('ext_selected');
			requestExtendedSearch();
		}
		resizeSearching(false);

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
			$('#it_search_icon').html('<svg fill="#CCC" height="32px" version="1.1" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink">\
							<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"></g>\
							<path d="M19.4271164,21.4271164 C18.0372495,22.4174803 16.3366522,23 14.5,23 C9.80557939,23 6,19.1944206 6,14.5 C6,9.80557939 9.80557939,6 14.5,6 C19.1944206,6 23,9.80557939 23,14.5 C23,16.3366522 22.4174803,18.0372495 21.4271164,19.4271164 L27.0119176,25.0119176 C27.5621186,25.5621186 27.5575313,26.4424687 27.0117185,26.9882815 L26.9882815,27.0117185 C26.4438648,27.5561352 25.5576204,27.5576204 25.0119176,27.0119176 L19.4271164,21.4271164 L19.4271164,21.4271164 Z M14.5,21 C18.0898511,21 21,18.0898511 21,14.5 C21,10.9101489 18.0898511,8 14.5,8 C10.9101489,8 8,10.9101489 8,14.5 C8,18.0898511 10.9101489,21 14.5,21 L14.5,21 Z" id="search"/>\
						</svg>');
			resizeSearching(true);
			runFiltering();
		}
		else {
			$('#it_search_inp').focus();
		}
	});
	$('#it_search_inp').keyup(function(e) {
		e.stopPropagation();
		var inp_str = $(this).val();

		searchIdletime = 0;
		if(timer_ID == '' && last_filter_value != inp_str) {
			timer_ID = setInterval(timeCounter, 500);
		}	

		//filterItmesByValue(inp_str);
		if(inp_str == '') {
			$('#it_search_icon').html('<svg fill="#CCC" height="32px" version="1.1" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink">\
							<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"></g>\
							<path d="M19.4271164,21.4271164 C18.0372495,22.4174803 16.3366522,23 14.5,23 C9.80557939,23 6,19.1944206 6,14.5 C6,9.80557939 9.80557939,6 14.5,6 C19.1944206,6 23,9.80557939 23,14.5 C23,16.3366522 22.4174803,18.0372495 21.4271164,19.4271164 L27.0119176,25.0119176 C27.5621186,25.5621186 27.5575313,26.4424687 27.0117185,26.9882815 L26.9882815,27.0117185 C26.4438648,27.5561352 25.5576204,27.5576204 25.0119176,27.0119176 L19.4271164,21.4271164 L19.4271164,21.4271164 Z M14.5,21 C18.0898511,21 21,18.0898511 21,14.5 C21,10.9101489 18.0898511,8 14.5,8 C10.9101489,8 8,10.9101489 8,14.5 C8,18.0898511 10.9101489,21 14.5,21 L14.5,21 Z" id="search"/>\
						</svg>');
		}
		else {
			$('#it_search_icon').html('<svg class="transform_icon" fill="#777" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">\
				<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>\
				<path d="M0 0h24v24H0z" fill="none"></path>\
			</svg>');
		}	
	});	
	
	$("#item_list").scroll(function() {
		if($('div').is('.wait') || noItems) {
		 return;
		 }
		var item_li = document.getElementById("item_list");
		if ($("#item_li").height() - $("#item_list").scrollTop() - $("#item_list").height()  < 400) 
		{
			$('#item_li').append('<div class="wait"><img src="/include/wait.gif"/></div>');
			item_nom = item_nom + 1;
			getSelectedContactItems(item_nom, items_filter);
		}
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
		if(obj.attr('id') == 'items_header') { return; }
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
	$('#item_li').on('click', '.item_block .item_photo, .item_block .item_block_zoom', function(e) {
		e.stopPropagation();
		var obj = $(this).parent().parent().parent().parent();//$(this).parents().find('.item_block').has(this);
		getItemInfo(obj);
	});
	
	//all types
	$('#item_li').on('click','.cart .cart_order', function(e) {
		e.stopPropagation();
		var it_cor = $(this).offset();
		var cart_cor = $('#it_cart svg').offset();
		var cart_clone = $(this).clone();
		
		cart_clone.attr('id', 'animated_cart');
		cart_clone.css('top',it_cor.top);
		cart_clone.css('left',it_cor.left);
		
		var item_id = $(this).parent().attr('data-cart-id');
		$('#item_li #it_'+encodeString(item_id) + ' div:first').addClass('item_content_selected');
		$('#content').append(cart_clone);
		cart_clone.animate({top: cart_cor.top, left: cart_cor.left+30}, 400, function() {
			$('#content #animated_cart').remove(); 
			$('#it_cart').addClass('not_empty');
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
	$('#item_li').on('click','.cart .cart_button', function(e) {
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
	$('#item_li').on('click','#detail_info_window .clw', function(e) {	
		e.stopPropagation();
		$('#detail_info_window').remove();
		$('.item_sign').remove();
	});
	
	//cat downloads
	$('.my_body').on('click', '#cat_dwlnd',function() {
		var contact = getActiveContact();
		var public_link = {
			'teleport' : 'ya.ru',
			'yml' : '',
			'bitrix' : '',
			'excel' : '',
		};
		var width = '400px';
		if (contact.id == undefined) {
			width = '800px';
		}
		else {
			$.each(public_link, function(i,val) {
				if ($.trim(val).length) {
					width = '800px';
					return false;
				};
			});
		};
		hideModalWindow($('.modal_window'));
		$('.modal_back').remove();	
		$('#main_content').append(
					'<div id="download_cat" class="modal_window" style="width:'+width+'">' +
						'<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>' +
						'<div id="teleport_link">' +
							'<div class="button" format-value=teleport>Скачать в формате Teleport</div>' +
						'</div>' +	
						'<div id="yml_link">' +
							'<div class="button" format-value=yml>Скачать в формате YML</div>' +
						'</div>' +	
						'<div id="bitrix_link">' +
							'<div class="button" format-value=bitrix>Скачать в формате Bitrix</div>' +
						'</div>' +	
						'<div id="excel_link">' +
							'<div class="button" format-value=excel>Скачать в формате Excel</div>' +						
						'</div>' +
					'</div>'	
		);
		
		if (contact.id == undefined) {
			$('#teleport_link, #yml_link, #bitrix_link, #excel_link').append( 
				'<div class="share_link link_flag"></div><div class="share_text">Поделиться ссылкой с моими контактами</div>' +
				'<div class="public_link link_flag"></div><div class="public_text">Ссылка на каталог доступна всем</div>'
			);
		}
		else {
			if (public_link.teleport.length) {
				$('#teleport_link').append(
					'<span style="font-size:12px; margin-left: 60px;">Ссылка на каталог в формате Teleport</span><br>' + 
					'<input style="width:250px; font-size: 14px; margin-left: 60px; margin-top: 5px; background: #fbfbfb; border: 1px solid #ccc; padding: 2px;" value='+public_link.teleport+' readonly>'
				);
			};
			if (public_link.yml.length) {
				$('#yml_link').append( 
					'<span style="font-size:12px; margin-left: 60px;">Ссылка на каталог в формате Teleport</span><br>' + 
					'<input style="width:250px; font-size: 14px; margin-left: 60px; margin-top: 5px; background: #fbfbfb; border: 1px solid #ccc; padding: 2px;" value='+public_link.yml+' readonly>'
				);
			};
			if (public_link.bitrix.length) {
				$('#bitrix_link').append( 
					'<span style="font-size:12px; margin-left: 60px;">Ссылка на каталог в формате Teleport</span><br>' + 
					'<input style="width:250px; font-size: 14px; margin-left: 60px; margin-top: 5px; background: #fbfbfb; border: 1px solid #ccc; padding: 2px;" value='+public_link.bitrix+' readonly>'
				);
			};	
			if (public_link.excel.length) {
				$('#excel_link').append( 
					'<span style="font-size:12px; margin-left: 60px;">Ссылка на каталог в формате Teleport</span><br>' + 
					'<input style="width:250px; font-size: 14px; margin-left: 60px; margin-top: 5px; background: #fbfbfb; border: 1px solid #ccc; padding: 2px;" value='+public_link.excel+' readonly>'
				);
			};	
		};
		showModalWindow($('#download_cat'));
		
		$('#download_cat').on('click', '.link_flag', function() {
			$(this).toggleClass('active');
		
			var linkstr = 'http://yandex.ru';
			if ($(this).is('.public_link.active')) {
				linkstr = 'http://google.ru';
				$(this).siblings('.share_link').addClass('active');
			};

			if (!$(this).is('.share_link.active')) {
				$(this).siblings('.public_link').removeClass('active');
			};
		
			if ($(this).parent().children('.share_link.active').length) {
				var str = 
				'<span style="font-size:10px; font-weight: normal; line-height:10px;">Ссылка на каталог в формате '+ $(this).siblings('.button').attr('format-value') +'</span><br>' + 
				'<input style="width:250px; margin-top: 3px; background: #fbfbfb; border: 1px solid #ccc; padding: 2px;" value='+linkstr+' readonly>';
			}
			else {
				var str = 'Поделиться ссылкой с моими контактами';
			};	
			$(this).siblings('.share_text').html(str);
		});
		
		$('#download_cat').on('click', 'input', function() {
			$(this).select();
		});

		$('#download_cat').on('click', '.button',function() {
			var format = $(this).attr('format-value');
			var isShared = $(this).siblings('.share_link').hasClass('active') ? true : false;
			var isPublic = $(this).siblings('.public_link').hasClass('active') ? true : false;
			hideModalWindow($('#download_cat'));
			CatDwnld(format, isShared, isPublic);
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
	
	$('#it_cart').on('click', '.show-docs', function(){
		$(this).toggleClass('active fa-chevron-up fa-chevron-down');
		$('#UserDocList').slideToggle(100);
	});
	
	$('#items_header #it_rule_pan').on('click', '#UserDocList .UserDocItem', function(){
		DocForView = $(this).attr('data-doc-id');
		console.log(DocForView);
		window.location.href = window.location.protocol + '//' + window.location.host+'/my/index.php?mode=orders';	
	});
});

function hideMenuItems(){
	var contact = getActiveContact();
	if (contact.id == undefined) {
		$('#cat_copy').hide(); 
		$('#cat_update').show()
	} else {
		$('#cat_copy').show(); 
		$('#cat_update').hide()
	};
};

function CatCopy(update_params) {
	//console.log(update_params);
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
function CatDwnld(format, isShared, isPublic) {
	console.log(format, isShared, isPublic);
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
	if(pan_width <= 700) {
		$('#it_cart .info').width(75);
	}
	else if(pan_width <= 886) {
		$('#it_cart .info').width(75);
	}
	else {
		$('#it_cart .info').width('');
	}
	if(pan_width <= 700) {
		$('#it_search_inp').width(75);
	}	
	else {
		var it_cart_width = $('#it_cart').width();
		var usf_width = pan_width - mode_width - it_cart_width - 225;
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
				if(contact.id == smuser.id) {
					showTelebotInfo('У вас нет своего каталога. Чтобы узнать, как его завести ознакомтесь с\
					<br>\
					<a href="https://e-teleport.ru/o-produkte" target="_blank">\
						Информацией по загрузке и оформлению собственного каталога\
					</a>\
					<br>\
					или выберите нужный контакт в списке, остальное я сделаю сам.','',0);
				}
				else {
					showTelebotInfo('У "' + contact.fullname + '" нет товаров в каталоге, выберите другой контакт','',0);
				}	
			}
			else { 
				if(!arResult.allow_stocks)
				{
					$('.col_4').remove();
				}
				if(!arResult.allow_prices)
				{
					$('.col_3').remove();
				}
				getSelectedContactItems(item_nom, items_filter);
			}
				
		}		
		xhr.send(body);
	}	
}
function getSelectedContactItems(it_nom, it_filter) {
	noItems = false;
	var contact	= getActiveContact();
	if(contact.id == undefined)	{ contact = smuser;	}

	var list_type = $('.activevwmode').attr('data-ln');
	$('#item_list_header').css('display', (list_type == 'list')?'block':'none');
	if(!(contact.id == undefined))
	{
		var arr_fld = ['id', 'article','name','price','stock','unit','currencyId','pictures'];
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
			
			//console.log(xhr.responseText);
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			if(it_nom == 1) {
				$('#item_li').html('');
			}
			//console.log(xhr.responseText);
			showItems(xhr.responseText);
		}		
		xhr.send(body);
	}	
}
function getMyCatalogItems() {
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
	
	$('#item_li').html('');
	item_nom = 1;
	items_filter = [];
	initContactItems();
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

	var str = responseText;

	$('#item_li').append(str);
	$('.wait').remove();
	if(str == '') {
		showTelebotInfo('Вы просмотрели весь каталог.','',5000);
		noItems = true;
	}
	else {
		hideTelebotInfo();
	}	

	/*if(!(item_ID == undefined)) {
		document.getElementById(item_ID).scrollIntoView(true);
	}*/

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

	var modal_obj = $('#detail_info_window');
	if(modal_obj.length == 0) {
		modal_obj = $('<div id="detail_info_window" class="item_detail_block">\
			<div class="clw" style="float: right;"><img src="/include/close_window.svg"/></div>\
			<div id="detail_item_info"></div>\
			</div>');
	}	
	var list_type = $('.activevwmode').attr('data-ln');
	if(list_type == 'block') {
		modal_obj.css('float', 'left');
	}
	modal_obj.attr('data-detail-id', obj.attr('data-it-id'));

	var contact	= getActiveContact();
	if(contact.id == undefined)	{ contact = smuser;	}

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
				obj.append('<div class="item_sign"></div>');
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

	$('#item_li').html('');

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
	
	if($('#it_extsearch').hasClass('ext_selected')) {
		if($('#ext_pan_content #it_toplevel').hasClass('it_category_selected')) {
			items_filter.push({"mode": "item", "group": "AND", "name":"category_id", "operation":"=", "value": $('#ext_pan_content #it_toplevel').attr('data-itc-id')});
		}
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
			//enum_list = (enum_list == '')?(''):(enum_list+')');
			if(enum_list != '') {
				items_filter.push({"mode": "prop", "group": "AND", "name": $(one_enum).attr('data-filter-name'), "operation":"IN", "value": enum_list});
			}	
		});
		vi_flag = true;
	}
	showItemsTotalQuantity(items_filter);
	item_nom = 1;
	if(getItems) {
		showTelebotInfo('Формирую каталог товаров','',0);
		getSelectedContactItems(item_nom, items_filter);
	} else if(vi_flag) {
		vi_timeout = setTimeout(function viewItems() {
			showTelebotInfo('Формирую каталог товаров','',0);
			getSelectedContactItems(item_nom, items_filter);
		},2000);
	}
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
	$('#ext_pan_header_content').append('<div style="text-align: center; padding: 13px 10px; color: #777; font-weight: 800; border-bottom: 1px solid #CCC;">\
								Расширенный поиск товаров\
								</div>');

	var contact	= getActiveContact();
	if(contact.id == undefined)	{ contact = smuser;	}

	if(!(contact.id == undefined))
	{
		var xhr = new XMLHttpRequest();
		var body =	'action=Catalog_GetCategory' +
				'&rtype=json' +
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
			$('#ext_pan_content').off();
			$('#ext_pan_content').html(xhr.responseText);
			if(items_filter.length == 0) {
				showItemsTotalQuantity(items_filter);
			}
			else {
				compileFilter(false);
			}	

			if($('#ext_pan_content .it_category').length == 0) {
				showExtendedFilters('');
			}
			$('#ext_filters').height($('#ext_pan').height() - $('#ext_pan_header').height() - $('#ext_pan_topblock').height() - 30);
			
			
			$('#ext_pan_content').on('click','#cancel_filters', function(e) {
				e.stopPropagation();
				cancelFilters();
			});
			$('#ext_pan_content').on('click','#it_counter', function(e) {
				e.stopPropagation();
				compileFilter(true);
			});
			$('#ext_pan_content').on('click','.it_category', function(e) {
				e.stopPropagation();
				var cat_id = $(this).attr('data-itc-id');
				showExtendedSearchLevel(cat_id, false);
			});
			$('#ext_pan_content').on('click','#it_toplevel', function(e) {
				e.stopPropagation();
				var cat_id = $(this).attr('data-itc-parentid');
				showExtendedSearchLevel(cat_id, false);
			});
			$('#ext_pan_content').on('click','.it_filter_value', function(e) {
				e.stopPropagation();
				$(this).find('.checkbox').toggleClass('checked');
				changeSelectedText($(this));
				compileFilter(false);	
			});	
			$('#ext_pan_content').on('click','.it_filter[data-filter-type=boolean]', function(e) {
				e.stopPropagation();
				$(this).find('.checkbox').toggleClass('checked');
				compileFilter(false);	
			});	
			$('#ext_pan_content').on('click','#it_filters .it_filter[data-filter-type=enum]', function(e) {
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
		xhr.send(body);
	}	
								
}
function cancelFilters() {
	if($('#ext_pan_content .it_category').length == 0) {
		$('#ext_filters .checked').removeClass('checked');
		$('#ext_filters .float_input, #ext_filters .filter_input').val('');
		compileFilter(true);
	}
	else {
		showExtendedSearchLevel('_zero_', true);
	}	
}
function showExtendedSearchLevel(parent_id, getItems) {
	if(parent_id == undefined || parent_id == '') {
		return;
	}	
	$('.it_category').removeClass('it_clevel');
	
	if(parent_id == '_zero_'){
		$('#it_toplevel').removeClass('it_category_selected');
		$('#it_toplevel').attr('data-itc-id', '');
		$('#it_toplevel').attr('data-itc-parentid', '');
		$('#it_toplevel').html('Выберите категорию товара');
	}
	else {
		var obj = $('.it_category[data-itc-id='+ parent_id +']');
		$('#it_toplevel').html(obj.find('.cat_name').html());
		$('#it_toplevel').addClass('it_category_selected');
		$('#it_toplevel').attr('data-itc-id', parent_id);
		$('#it_toplevel').attr('data-itc-parentid', obj.attr('data-itc-parentid'));
	}	
	
	$('.it_category[data-itc-parentid='+ parent_id +']').addClass('it_clevel');
	if($('.it_clevel').length == 0) {
		showExtendedFilters(parent_id);
	}
	else {
		$('#it_filters').html('');
	}
	compileFilter(getItems);	
}
function showExtendedFilters(parent_id) {
	if(parent_id == '') {
		var obj = $('#ext_pan_content');
		obj.attr('data-req-filters','0');
	}
	else {
		var obj = $('.it_category[data-itc-id='+ parent_id +']');
	}	
	if (obj.attr('data-req-filters') == '0') {
		if(obj.is('.wait')) {
			return;
		}
		var contact	= getActiveContact();
		if(contact.id == undefined)	{ contact = smuser;	}

		if(!(contact.id == undefined))
		{
			obj.append('<div class="wait" style="background-color: #FFF;"><img src="/include/wait.gif"/></div>')
			var xhr = new XMLHttpRequest();
			var body =	'action=catalog_FiltersGet' +
					'&contact=' + encodeURIComponent(contact.name) +
					'&category_id=' + encodeURIComponent(parent_id) + 
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
				obj.attr('data-req-filters','1');
				$('#it_filters').html(xhr.responseText);
				if(!parent_id == '') {
					obj.append(xhr.responseText);
				}	
			}		
			xhr.send(body);
		}	
	}
	else {
		$('#it_filters').html('');
		$('#it_filters').append(obj.find('.it_filter, .it_filter_enum').clone());
		$('#it_filters').append(obj.find('.empty_cat').clone());
	}
}
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
			$.post('/my/ajax/order.php', { action: 'Documents_GetLastId', receiver: contact.name }, function(data) {
				(data) ? addItemToExistDoc(Item, contact.name) : addItemToNewDoc(Item, contact.name);
			});	
		}		
		xhr.send(body);
	};

};


function addItemToExistDoc(Item, contact) {
	$.post('/my/ajax/order.php', { action: 'Documents_addItemToExistDoc', item: JSON.stringify(Item), receiver: contact }, function(data){
		console.log(data);
	});
};


function addItemToNewDoc(Item, contact) {
	$.post('/my/ajax/order.php', { action: 'Documents_GetLastId' }, function(docid) {
		var curDate = new Date;
		var message = {
			"docHeader":{
				"id":++docid,
				"status":"new",
				"sender":smuser.name,
				"receiver":contact,
				"type":"order",
				"date":curDate,
				"num":"",
				"hash":"00001234",
				"sum":Item.sum,
				"currencyId":"RUR",
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
				console.log(data);
			}
		);
	});	
};

function getOrderDate(date){
	var year = date.getFullYear();
	var month = (date.getMonth().toString().length>1) ? date.getMonth()+1 : '0'+(date.getMonth()+1);
	var day = (date.getDate().toString().length>1) ? date.getDate() : '0'+date.getDate();
	var hh = (date.getHours().toString().length>1) ? date.getHours() : '0'+date.getHours();
	var mm = (date.getMinutes().toString().length>1) ? date.getMinutes() : '0'+date.getMinutes();
	var ss = (date.getSeconds().toString().length>1) ? date.getSeconds() : '0'+date.getSeconds();
	return {"year":year, "month":month, "day":day, "hh":hh, "mm":mm, "ss":ss};
};

function getItemPosInfo() {
	$('#it_cart .info').html('');
	var contact = getActiveContact();
	if (contact.id != undefined) {
		$.post('/my/ajax/order.php', {action: 'Documents_getItemPosInfo', receiver: contact.name}, function(data){
			var UserDocs = JSON.parse(data);
			var UserDocsQty = UserDocs.length;
			var UserItemsQty = 0;
			var html_str = '';
			$.each(UserDocs, function(key, val){
				UserItemsQty = UserItemsQty*1 + val.docTable.length*1;
				var DocDate = getOrderDate(new Date(val.docHeader.date));	 	
				html_str = html_str + '<div class="UserDocItem" data-doc-id='+val.docHeader.id+'>Заказ №'+(++key)+' от '+DocDate.day+'-'+DocDate.month+'-'+DocDate.year+'</div>';		
			}); 
			$('#it_cart .info').html('Выбрано <span>'+UserItemsQty+'</span> позиций в <span>'+UserDocsQty+'</span> заказах <span class="show-docs fa fa-chevron-down"></span>');
			$('#items_header #it_rule_pan').append('<div id="UserDocList">'+html_str+'</div>');
		})	
	}	
};