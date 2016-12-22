var showAllFiles = true;
var cloud_svg = '<svg fill="#CCCCCC" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">'+
			'<path d="M0 0h24v24H0z" fill="none"/>'+
			'<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>'+
			'</svg>	';
//var msgBuffer = [];

$(document).ready(function(e)
{	
/*==================>Copypast<==================*/
	var objFile;
	
	$('#msgBox').bind('paste', function (event) {
		var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
		var blob = null;
		for (var i = 0; i < items.length; i++) {
			if (items[i].type.indexOf("image") === 0) {
				blob = items[i].getAsFile();
			}
		}

		if (blob !== null) {
			var reader = new FileReader();
			reader.onload = function(event) {
				$('#pastedImage').attr('src', event.target.result);
				$('#pastedImageBlock').addClass('pasted').fadeIn(300);;
			};
			reader.readAsDataURL(blob);
			
			var strNewFileName = 'image.png';
			objFile = new File([blob], strNewFileName, {
				lastModified: new Date(0),
				type: blob.type
			});
		};
	});

	$('#pastedImageBlock .button').click(function(){
		if ($(this).hasClass('send')) {
			$('#file_upload').data('uploadifive').addQueueItem(objFile);
			var boolImageAddedToQueue = true;
			if (boolImageAddedToQueue) {
				$('#msg_form').submit();
			};
		}
		$('#pastedImageBlock').fadeOut(300);
		setTimeout(function(){
			$('#pastedImageBlock').removeClass('pasted');
			$('#pastedImage').attr('src', '');
		}, 400)
	});
	
	$(document).click(function(e){
		if ($(e.target)!=$('#pastedImageBlock') && !$(e.target).parents('#pastedImageBlock').length && $('#pastedImageBlock:visible').length) {
			$('#pastedImageBlock .button.cancel').trigger('click');
		};
	});
/*==================>Copypast End<==================*/	

	var msg_contact = undefined;
	
	var delete_svg = '<svg fill="#BBB" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
		'<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>'+
		'<path d="M0 0h24v24H0z" fill="none"/></svg>';
	var file_html = '<div class="msg_file uploadifive-queue-item"><div class="upfile" id="msg_fn"><div class="file_icon"></div>'+
		'<div class="file_block"><p class="filename"></p>'+
		'<p class="file_info"></p></div>'+
		'<a class="del_file close"><div class="cloud">'+delete_svg+'</div></a>'+
		'<div class="fileinfo">Готов к отправке</div>'+
		'<div class="progress"><div class="progress-bar"></div></div>'+
		'</div>';

	if ($("div").is("#mess_list"))
	{
		$("#mess_list").css("height", $(".main_pan").height()-$("#mess_send").height()-18);
	}
	$("#mess_list").css("maxWidth", $(".workspace").width()-$("#contacts").width()-$("#ext_pan").width()-4);
	$('#msgBoxdiv').width($('#msgBox').width());

	$('.up_pan .up_add_menu .menu_content').remove();
	$('.up_pan .up_add_menu').append('<div class="menu_content">\
											<div style="margin: 0px 10px;">\
												<p id="search_msg_files" onclick="">Показать все файлы в сообщениях контакта</p>\
											</div></div>');
	$('#contact_filter, #exp_filter').css('display','none');
	$('#contact_filter, #exp_filter').off();
	hideExtPan();

					
	var start_date = new Date();
	start_date.setDate(start_date.getDate() + 2);
	var contact	= getActiveContact();
	if(contact.id == undefined) {
		$('#cur_contact').html('');
	}
	getSelectedContactMessages(start_date, 101);
		

	$(window).resize(function() 
	{
		off_cor = $('#uploadfile').offset();
		if(!($('#up_menu').length == 0)) {
			if((off_cor.top + $('#up_menu').height()) > $('#content').height()) {
				$('#up_menu').offset({top:off_cor.top-$('#up_menu').height()-23, left:off_cor.left});
			}
			else {
				$('#up_menu').offset({top:off_cor.top+22, left:off_cor.left});
			}	
		}	
	});
	
	function msg_init() {
		hideModalWindow($('.msgInfo_box'));
		//$('#msg_form').removeClass('sending');
		//$('#uploadfile').removeClass('sending');
		$('#msgBox').removeClass('sending');
		$('#process_msg').css('display','none');
		//$('#msgBox').attr('readonly',false);
		$('#file_upload').uploadifive('clearQueue');
		$('#content #mess_block').remove();
	}

	function addSentMessages(msg_arResult) {
		if(!(msg_arResult == undefined)) {
			addMessageToList(msg_arResult, 'end');
			if(msg_arResult.length != 0) {
				var msg_resultContact = getContactInfo((msg_arResult[0].from == smuser.name)?msg_arResult[0].to:msg_arResult[0].from);

				$('#mess_list').animate({
					scrollTop: $('#msg_li').height() - $('#mess_list').height(),
				}, 100, function() {
					if($('#msg_li').attr('data-cnt-id') != '' && $('#msg_li').attr('data-cnt-id') == msg_resultContact.name) {
						var cash_obj = {'result':$('#mess_list').html(), 'top':$('#mess_list').scrollTop()};
						saveCntMessagesCash('msg_'+msg_resultContact.name, cash_obj);
					}
				});//msg_contact
				moveContactRecentTop(msg_resultContact.id);
			}	
		}	
	}
	
	function msg_reset(msg_arResult) {
		$('.cnt_check').hide(100);
		$('.channel_chkbox').hide(100);
		$('.cnt_blocked').hide(100);
		
		addSentMessages(msg_arResult);
		
		$('#msgBox').val('');
		$('#msgBoxdiv pre').text(''); 
		resizeMsgBox();

		$('#mess_send .receiver_block').html('');
		$('#mess_send .receiver_header').css('display','none');
		$('#cnt_list .cnt_check svg').css('display','none');
		$('#send_msg').hide();
		$("#mess_list").css("height", $(".main_pan").height()-$("#mess_send").height()-18);
		if($('#usr-filename').length) {
			$('#usr-filename .cloud').trigger('click');
		};
		msg_init();
	}
		
	$(function() {
		$("#file_upload").uploadifive({
			'multi' : false,
			'auto' : false,
			'uploadScript' : '/my/ajax/action.php',
			'buttonText' : '',
			'buttonClass' : 'filename_button',
			'dnd' : false,
			'queueID' : 'usr-filename',
			'fileSizeLimit' : '60MB',
			'uploadLimit' : 0,
			'queueSizeLimit' : 1,
			'simUploadLimit' : 0,
			'itemTemplate' : file_html,
			'formData': {'action': 'send_msg'},
			'onAddQueueItem': function(file_obj) {
				if($('#usr-filename .att_text').length == 0) {	
					$('#usr-filename').prepend('<div class="att_text">Вложенный(е) файл(ы):</div>');
				}	
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
				$('#usr-filename .msg_file .filename:contains('+encodeString(file_name)+')').each(function(key, value) {
					$(value).parent().parent().find('.file_icon').html(att_svg);
					$(value).next('p').html(file_size+file_met+' '+file_type);
				});
				//$("#msg_form input[name='message_type']").val('text_attach');
				$("#mess_list").css("height", $(".main_pan").height()-$("#mess_send").height()-18);
				$('#msgBox').focus();
				$('#send_msg').show(200);
			},
			'onUploadComplete' : function(file, data) {
				if(!(data.indexOf('%err%') == -1)) {
					showError(data.replace('%err%',''));
					msg_init();
					return;
				}
				try {
					msg_arResult = $.parseJSON(data);
				}	
				catch (err)	{
					showError('Не удалось отправить сообщение. <br>Сбой операции <br> Повторите попытку позже');
					console.log(err);
					console.log(data);
					msg_init();
					return;
				}
				msg_reset(msg_arResult);
			},
			'onQueueComplete' : function() {
					msg_reset();
			},
			'onClearQueue' : function() {
				$("#mess_list").css("height", $(".main_pan").height()-$("#mess_send").height()-18);

			}
		});
	});

	$('#msg_form').submit(function(event){
		event.preventDefault();
		if($('#msgBox').hasClass('sending')) {
			return;
		}
		
		var msg_text= $('#msgBox').val();
		if(msg_text == '' && $("#msg_form .uploadifive-queue-item").length == 0)
			{return;}

		msg_contact	= getActiveContact();
		if(msg_contact.id == undefined)
			{return;}
		
		$('#msgBox').addClass('sending');
		$('#content').append('<div id="mess_block" class="mess_send_block"></div>');
		
		var msg_type = 'text';
		var files_count = $("#msg_form .uploadifive-queue-item").length;
		if(files_count != 0) {
			msg_type = 'text_attach';
			showMessageBox('<div style="font-weight: 600;">Отправка файлов...</div><div><img src="/include/wait.gif"/></div>','');
		}	

		var add_receiver = [];
		add_receiver.push(msg_contact.name);
		if ($('#mess_send .receiver_block .receiver').length>0 && $("#msg_form .uploadifive-queue-item").length == 0) {
			$('#mess_send .receiver_block .receiver').each(function() {
				add_receiver.push($(this).attr('data-rec-name'));
			});
		}	
		var contactsList = JSON.stringify(add_receiver);

		if((msg_type == 'text' || files_count>1) && (msg_text != '')) {
		
			var tmp_guid = "tmp_"+createGuid();

			var body = new FormData(document.forms.msg_form);//
			body.append("action", "send_msg");
			body.append("message_type", msg_type);
			body.append("contact", contactsList);
			body.append("message", msg_text);
			body.append("tmpGUID", tmp_guid);
			
			
			var xhr = new XMLHttpRequest();
			xhr.open("POST", '/my/ajax/action.php', true);
			xhr.onreadystatechange = function() 
			{ 
				if (xhr.readyState != 4) return;
				if(!(xhr.responseText.indexOf('%err%') == -1)) {
					showError(xhr.responseText.replace('%err%',''));
					msg_init();
					return;
				}

				try {
					var msg_tmpGUID = '';
					msg_arResult = $.parseJSON(xhr.responseText);
					msg_tmpGUID = msg_arResult[0].tmpGUID;
					addSentMessages(msg_arResult);
				}	
				catch (err)	{
					showError('Не удалось отправить сообщение. <br>Сбой операции <br> Повторите попытку позже');
					console.log(xhr.responseText);
					console.log(err);
					msg_init();
					$('#msg_li #msg_'+msg_tmpGUID).remove();
					return;
				}

			}		
			xhr.send(body);

			var tmp_arResult = {
				"ID": tmp_guid,
				"type": "text",
				"dt": getStringFromDate(new Date()),
				"from": smuser.name,
				"to": msg_contact.name,
				"status": "new",
				"msg_text": htmlspecialchars(msg_text),
				"tmpGUID": "",
				"tmp_msg": "true",
				"files": {}
			}
			var ar_tmp = [tmp_arResult];
			//msgBuffer.push(ar_tmp);
			msg_reset(ar_tmp);
			
		}
		if(files_count>0) {
			$("#file_upload").uploadifive('appendFormData','message_type',msg_type);
			$("#file_upload").uploadifive('appendFormData','contact',contactsList);
			if(files_count > 1) {
				$("#file_upload").uploadifive('appendFormData','message','');
			} else {
				$("#file_upload").uploadifive('appendFormData','message',msg_text);
			}

			$('#file_upload').uploadifive('upload');
		}
		
	});

	$('#msgBox').keydown(function(event){
		event.stopPropagation();
		if($('#msgBox').hasClass('sending')) {
			event.preventDefault();
			return;
		}
		if (event.which == 13)
			{
				event.preventDefault();
				$('#msg_form').submit();
			}
		else {	
			$('#msgBoxdiv pre').text($(this).val()); 
			resizeMsgBox();	
		}	
	});
	$('#send_msg').click(function(event){
		event.preventDefault();
		event.stopPropagation();
		$('#msg_form').submit();
	});

	$('#msgBox').keyup(function(event) {
		event.stopPropagation();
		if($('#msgBox').hasClass('sending')) {
			event.preventDefault();
			return;
		}
		var inp_str = $(this).val();
		$('#msgBoxdiv pre').text(inp_str); 
		if($('#send_msg').css('display') == 'none' && $(this).val() != '' && $('#process_msg').css('display') == 'none') {
			$('#send_msg').show(200);
		} 
		else if($(this).val() == '' && $('#msg_fn').length == 0) {
			$('#send_msg').hide();
		}
		resizeMsgBox();

	});	
	
	$("#mess_list").scroll(function() {
		if($('div').is('.wait')) {
		 return;
		 }
		//var mess_list = document.getElementById("mess_list");
		if ($('#mess_list').scrollTop() == 0) 
		{
			var start_date	= $('#msg_li').attr('data-start_date');
			if (start_date != undefined) {
				$('#mess_list').prepend('<div class="wait" style="background-color: #FFF;"><img src="/include/wait.gif"/></div>');
				getSelectedContactMessages(getDateFromString(start_date), '');
			}	
		}
	});	
	$("#mess_list").on('mouseenter', '#msg_li .message_line .message_text', function(e){
		if($(this).prev('div').attr('id') != 'msg_inf') {
			$(this).children().eq(0).show(10);
		}	
	});
	$("#mess_list").on('mouseleave', '#msg_li .message_line .message_text', function(e){
		$(this).children().eq(0).hide(10);
	});
	$('#mess_list').on('click','.cnt_avatar',function(e) {//dblclick
		var cnt_name = $(this).parent().parent().attr('data-ms-inf');
		ContactInfoView(cnt_name);
	});
	$('#mess_list').on('click','.message_header',function(e) {
		var cnt_name = $(this).parent().parent().attr('data-ms-inf');
		ContactInfoView(cnt_name);
	});
	$('#mess_list').on('click','#msg_li .image_file .close_line svg',function(e) {	
		var obj = $(this).parent().parent();
		obj.toggleClass('close_image');
		if(obj.hasClass('close_image')) {
			var im_svg = '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
				'<path d="M7 10l5 5 5-5z"/>'+
				'<path d="M0 0h24v24H0z" fill="none"/>'+
				'</svg>';
		}
		else {
			var im_svg = '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
				'<path d="M7 14l5-5 5 5z"/>'+
				'<path d="M0 0h24v24H0z" fill="none"/>'+
				'</svg>';
		}
		$(this).replaceWith($(im_svg));
		
	});
	$('#mess_list').on('click','#msg_li .image_file img',function(e) {	
		e.stopPropagation();
		var strPhoto = '<div class="modal_back back_curt"></div><div id="detail_photo"><div class="modal_window" style="display: inline-block;">' +
			'<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>'+
			'<img src="'+$(this).attr('src').replace('a=prev&','')+'" style="max-height: 600px;"/>'+
						'</div></div>';
						
		$('#main_content').append(strPhoto);
		$('#detail_photo img').css('max-height', $('#content').height() - 80);
		//$('#detail_photo').css('left', ($('#content').width() - $('#detail_photo').width())/2);
		showModalWindow($('#detail_photo'));
	});
	$('#mess_list').on('click','#msg_li .msg_addblock .msg_resend',function(e) {	
		e.stopPropagation();
		var obj = $(this).parent().parent().parent();
		obj.find('.message_text pre').addClass('msg_selected');
		var msg_ID = obj.attr('id');
		msg_ID = msg_ID.replace('msg_','');
		
		
		
		//cnt_select
		var cnt_selection = $('#my_contacts').clone();
		var cnt_search = $('#contacts #search_cnt').clone();
		cnt_selection.attr('id','sel_contacts');
		cnt_selection.css('height', cnt_selection.height()-90);
		cnt_search.attr('id','sel_search');
		cnt_selection.find('.cnt_mail').css('display', 'none');
		cnt_selection.find('.cnt_text, .cnt_mail').each(function() {
			var str = $(this).html();
			str = str.replace('<span>','');
			str = str.replace('</span>','');
			$(this).html(str);
		});

		
		cnt_search.find('.search_inp').val('');
		cnt_search.find('.search_button').css('background-color', '');
		cnt_search.find('.search_button').css('border-color', '');
		cnt_search.find('.search_button svg').css('fill', '#777');

		cnt_selection.append(cnt_selection.find('.slimScrollDiv').html());
		cnt_selection.find('.slimScrollDiv').remove();
		cnt_selection.find('.slimScrollBar').remove();
		cnt_selection.find('.slimScrollRail').remove();
		
		var str_window = '<div id="cnt_selection" class="modal_window">'+
			'<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>'+
			'<div style="padding: 5px 0; color: #777;">Выберите контакт(ы):</div>'+
			'</div>'
		var str_buttons = '<div><div class="receiver_header" style="display: block; font-size: 13px; padding: 10px 0;">Выбрано (<a id="sel_quan">0</a> контактов)'+
							'<div class="receiver_cancel" style="margin: 0 0 0 27px"><span style="color: #FF0000;">X</span> Отменить все</div>'+
							'</div>'+
							'<div class="menu_button">ПЕРЕСЛАТЬ</div>'+
							'</div>';
		var modal_window = $(str_window);
		modal_window.append(cnt_search);
		modal_window.append(cnt_selection);
		modal_window.append(str_buttons);
		
		$('.my_body').append('<div class="modal_back back_curt"></div>');
		$('.my_body').append(modal_window);
		$('#cnt_selection').css('left', ($('.my_body').width()-300)/2);
		$('#sel_contacts #cnt_list').slimScroll({height: 'auto', size: '7px', disableFadeOut: true});
		$('#sel_contacts .active_contact_inf').removeClass("active_contact_inf").addClass('contact_inf');

		$('#sel_contacts .contact_inf,#sel_contacts .active_contact_inf,#sel_contacts .sel_contact_inf').css('display','block');
		$('#sel_contacts .group_block h3').css('display','block');
		$('#sel_contacts #last_cnt').css('display','block');
		
		$('#cnt_selection #cnt_list').on('click','h3', function(e){
			$("#cnt_selection .group_block").css('z-index','');
			$("#cnt_selection .group_block").css('width','');
			$("#cnt_selection .group_block").css('height','');

			$(this).next("div").slideToggle(100)
			$(this).toggleClass('close_list');
		});
		$('#cnt_selection #cnt_list').on('mouseenter','.contact_inf',function(){
			$(this).removeClass("contact_inf").addClass('sel_contact_inf');
		});
		$('#cnt_selection #cnt_list').on('mouseleave','.sel_contact_inf',function(){
			$(this).removeClass("sel_contact_inf").addClass('contact_inf');
		});
		$('#cnt_selection #cnt_list').on('click','.cnt_avatar',function(e) {//dblclick
			e.stopPropagation();
			var cnt_name = $(this).parents('[data-usr-name]').eq(0).attr('data-usr-name');
			ContactInfoView(cnt_name);
		});
		$('#cnt_selection #cnt_list').on('click','.contact_inf, .sel_contact_inf, .active_contact_inf',function(e) {
			e.stopPropagation();
			$(this).toggleClass('active_contact_inf');
			$('#sel_quan').text($('#cnt_selection #cnt_list .active_contact_inf').length);
		});
		$('#cnt_selection .receiver_cancel').on('click',function(e) {
			e.stopPropagation();
			$('#cnt_selection #cnt_list .active_contact_inf').removeClass('active_contact_inf');
			$('#sel_quan').text($('#cnt_selection #cnt_list .active_contact_inf').length);
		});
		$('#cnt_selection .clw').on('click',function(e) {
			e.stopPropagation();
			$('#cnt_selection').hide();
			$('#cnt_selection').remove();
			$('.modal_back').remove();
			$('.msg_selected').removeClass('msg_selected');
		});
		$('#cnt_selection .menu_button').on('click',function(e) {
			var add_receiver = [];
			$('#cnt_selection #cnt_list .active_contact_inf').each(function() {
				add_receiver.push($(this).attr('data-usr-name'));
				removeCntMessagesCash('msg_'+$(this).attr('data-usr-id'));
			});
			if(add_receiver.length > 0) {
				$(this).html('<img src="/include/wait.gif"/>');

				var xhr = new XMLHttpRequest();
				var body =	'action=resend_msg' +
					'&message_ID=' + msg_ID + 
					'&receiver=' + encodeURIComponent(JSON.stringify(add_receiver));
				xhr.open("POST", '/my/ajax/action.php', true);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.onreadystatechange = function() 
				{ 
					if (xhr.readyState != 4) return;
			
					if(!(xhr.responseText.indexOf('%err%') == -1)) {
						showError(xhr.responseText.replace('%err%',''));
						return;
					}

					$('#cnt_selection').hide();
					$('#cnt_selection').remove();
					$('.modal_back').remove();
					$('.msg_selected').removeClass('msg_selected');
					showMessageBox('Сообщение успешно отправлено', 10000);
				}	
				xhr.send(body);
			}	

		});
		$('#sel_search .search_inp').on('keyup',function(e) {
			var inp_str = $(this).val();
			if(inp_str == '') {
				$('#sel_contacts .contact_inf,#sel_contacts .active_contact_inf,#sel_contacts .sel_contact_inf').css('display','block');
				$('#sel_contacts .group_block h3').css('display','block');
				$('#sel_contacts #last_cnt').css('display','block');

				$(this).prev('div').css('background-color', '');
				$(this).prev('div').css('border-color', '');
				$(this).prev('div').find('svg').css('fill', '#777');
				$('#sel_contacts .cnt_mail').css('display', 'none');
				$('#sel_contacts .cnt_text , #sel_contacts .cnt_mail').each(function() {
					var str = $(this).html();
					str = str.replace('<span>','');
					str = str.replace('</span>','');
					$(this).html(str);
				});

				return;
			}	
			$(this).prev('div').css('background-color', '#26A69A');
			$(this).prev('div').css('border-color', '#26A69A');
			$(this).prev('div').find('svg').css('fill', '#FFF');
			$('#sel_contacts .cnt_mail').css('display', 'block');

			var s_str = inp_str.toLowerCase();
			s_str = encodeString(s_str);
			$(this).removeClass('not_find');
					
			var cnt_obj_1 = $('#sel_contacts #m_cnt_list').find('[data-usr-index*='+s_str+']');
			var cnt_count = cnt_obj_1.length;
			if(cnt_count == 0) {
				$(this).addClass('not_find');
			}
			
			
			
			$('#sel_contacts .contact_inf, #sel_contacts .active_contact_inf, #sel_contacts .sel_contact_inf').css('display','none');
			$('#sel_contacts .group_block h3').css('display','none');
			$('#sel_contacts #last_cnt').css('display','none');

			cnt_obj_1.css('display','block');
			
			cnt_obj_1.parent().css('display','block');
			cnt_obj_1.parent().prev('h3').removeClass('close_list');
			cnt_obj_1.parent().prev('h3').css('display','block');
			cnt_obj_1.find('.cnt_text, .cnt_mail').each(function() {
				var str = $(this).html();
				str = str.replace('<span>','');
				str = str.replace('</span>','');
				
				var pos = str.search(new RegExp(inp_str,'i'));
				if(pos != -1) {
					var sub_str = str.substr(pos , inp_str.length);
					str = str.replace(sub_str,'<span>'+sub_str+'</span>');
					$(this).html(str);
				}	
			});	
		});
		
		$('#cnt_selection').show(300);

		
	});
	$('#uploadfile').on('click',function(e){
		e.stopPropagation();
		if($('#msgBox').hasClass('sending')) {
			return;
		}
		var str ='<div class="modal_back"></div><div id="up_menu" class="modal_window" style="position: absolute;">' +
			'<div style="margin: 0px 10px;">' +
				'<p id="msg_file">Добавить файл</p>' +
				'<p id="msg_delivery">Добавить получателей</p>' +
			'</div></div>';
		$('.my_body').append(str);
		off_cor = $(this).offset();
		$('#up_menu').offset({top:off_cor.top-$('#up_menu').height()-23, left:off_cor.left});
		$('#up_menu').show(100);

		$('#msg_file').on('click',function(e){
			e.stopPropagation();
			
			//var fform = document.forms['msg_form'];
			//fform['filename'].click();
			$('#msg_form #uploadifive-file_upload').children().last().click();
		});
		$('#msg_delivery').on('click',function(e){
			e.stopPropagation();
			$('.cnt_check').show(100);
			$('.channel_chkbox').show(100);
			$('#mess_send .receiver_header').css('display','block');
			
			$('.modal_window').remove();
			$('.modal_back').remove();
			var cur_cname = $('.cur_contact_inf').attr('data-usr-id');
			$('#cnt_list [data-usr-id='+cur_cname+']').find('.cnt_check').hide(1);
			$('#cnt_list [data-srtnum=999]').next('div').find('.cnt_check').hide(1);
			$('#cnt_list [data-srtnum=-10]').next('div').find('.cnt_check').hide(1);

			$('#cnt_list [data-usr-id='+cur_cname+']').find('.cnt_blocked').show(1);
			$('#cnt_list [data-srtnum=999]').next('div').find('.cnt_blocked').show(1);
			$('#cnt_list [data-srtnum=-10]').next('div').find('.cnt_blocked').show(1);
			$("#mess_list").css("height", $(".main_pan").height()-$("#mess_send").height()-18);

			$('.cnt_blocked').each(function() {
				if($(this).css('display') != 'none') {
				$('#lst_'+$(this).parent().attr('data-usr-id')).find('.cnt_check').hide(1);
				$('#lst_'+$(this).parent().attr('data-usr-id')).find('.cnt_blocked').show(1);
				}
			});
		});
	});	
	$('#mess_send').on('click','.del_receiver', function(e) {
		var obj = $(this).parent().parent();
		$('#cnt_list [data-usr-id='+obj.attr('data-rec-id')+']').find('.cnt_check svg').css('display','none');
		obj.remove();

		$('#mess_send #rec_quan').text($('#mess_send .receiver_block .receiver').length);
		$("#mess_list").css("height", $(".main_pan").height()-$("#mess_send").height()-18);
	});
	$('#mess_send').on('click','.receiver_cancel', function(e) {
		$('.cnt_check').hide(100);
		$('.channel_chkbox').hide(100);
		$('.cnt_blocked').hide(100);

		$('#mess_send .receiver_block').html('');
		$('#mess_send .receiver_header').css('display','none');
		$('#cnt_list .cnt_check svg').css('display','none');
		$('#mess_send #rec_quan').text($('#mess_send .receiver_block .receiver').length);
		$("#mess_list").css("height", $(".main_pan").height()-$("#mess_send").height()-18);
	});

	$('.my_body').off('click', '#search_msg_files');
	$('.my_body').off('click', '#download_doclist');
	
	$('.my_body').on('click', '#search_msg_files', function(e) {
		e.stopPropagation();
		showAllFiles = ($(this).attr('id') == 'search_msg_files') ? true : false;
		hideModalWindow($('#active_menu'));
		$('.modal_back').remove();
		SearchFiles();
	});	
	
	$('#cnt_list').on('click','.contact_inf, .sel_contact_inf, .active_contact_inf',function(e) {
		e.stopPropagation();
		if ($('#ext_pan').width()>0) {
			SearchFiles();
		};
	});
	
});

function SearchFiles() {
	var	filestatus = (showAllFiles) ? '*' : 'sent'; 
	var contact	= getActiveContact();
	var xhr = new XMLHttpRequest();
	var body =	'action=filesList' +
				'&adds=json' +
				'&contact=' + encodeURIComponent(contact.name) +
				'&Category=messages';					
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
		requestFileBrowser(arResult);
	}				
	xhr.send(body);	
};
/*
function requestFileBrowser(arResult) {	
	$('#ext_pan_header_content').html('');
	$('#ext_pan_content').html('');	
	$('#ext_pan_content').off();
	
	var caption = (showAllFiles) ? 'Все файлы контакта' : 'Мои файлы у контакта';
	$('#ext_pan_header_content').append(
		'<div style="text-align: center; padding: 13px 10px; color: #777; font-weight: 800; border-bottom: 1px solid #CCC;">'+caption+'</div>');
	$('#ext_pan_content').append('<div class="scrollist"></div>');	
	var files_html = '';
	$(arResult).each(function(){
		files_html = files_html + '<div class="msg_file" style="padding: 0px 0 10px 0;">' + addFileToList($(this), true) + '</div>';
	});	
	$('#ext_pan_content .scrollist').append(files_html);
	showExtPan();
	$('#ext_pan_content').height($('#ext_pan').height()-$('#ext_pan_header_content').height());
	$('#ext_pan_content .scrollist').slimScroll({height: 'auto', size: '7px', disableFadeOut: false});		
	$('#ext_pan_content').on('click','.image_file .close_line svg',function(e) {	
		var obj = $(this).parent().parent();
		obj.toggleClass('close_image');
		if(obj.hasClass('close_image')) {
			var im_svg = '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
				'<path d="M7 10l5 5 5-5z"/>'+
				'<path d="M0 0h24v24H0z" fill="none"/>'+
				'</svg>';
		}
		else {
			var im_svg = '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
				'<path d="M7 14l5-5 5 5z"/>'+
				'<path d="M0 0h24v24H0z" fill="none"/>'+
				'</svg>';
		}
		$(this).replaceWith($(im_svg));
		
	});
};
*/

function requestFileBrowser(arResult) {	
	$('#ext_pan_header_content').html('');
	$('#ext_pan_content').html('');	
	$('#ext_pan_content').off();
	
	var caption = (showAllFiles) ? 'Все файлы контакта' : 'Мои файлы у контакта';
	$('#ext_pan_header_content').append(
		'<div style="text-align: center; padding: 13px 10px; color: #777; font-weight: 800; border-bottom: 1px solid #CCC;">'+caption+'</div>');
	$('#ext_pan_content').append('<div class="scrollist"></div>');	
	var files_html = '';
	$(arResult).each(function(){
		var file = $(this);
		files_html = files_html + '<div class="msg_file" style="padding: 0px 0 10px 0;">' + addFileToExtPanList(file[0], true) + '</div>';
	});	
	$('#ext_pan_content .scrollist').append(files_html);
	showExtPan();
	$('#ext_pan_content').height($('#ext_pan').height()-$('#ext_pan_header_content').height());
	$('#ext_pan_content .scrollist').slimScroll({height: 'auto', size: '7px', disableFadeOut: false});		
	$('#ext_pan_content').on('click','.image_file .close_line svg',function(e) {	
		var obj = $(this).parent().parent();
		obj.toggleClass('close_image');
		if(obj.hasClass('close_image')) {
			var im_svg = '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
				'<path d="M7 10l5 5 5-5z"/>'+
				'<path d="M0 0h24v24H0z" fill="none"/>'+
				'</svg>';
		}
		else {
			var im_svg = '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
				'<path d="M7 14l5-5 5 5z"/>'+
				'<path d="M0 0h24v24H0z" fill="none"/>'+
				'</svg>';
		}
		$(this).replaceWith($(im_svg));
		
	});
};

//messages
function saveCntMessagesCash(key, cash_object) {
	if(storu) {
		setTimeout(function () {
		try {
			if(cash_object.result == '') {
				sessionStorage.removeItem(key);
			}
			else {
				cash_object.result = LZString.compress(cash_object.result);
				sessionStorage.setItem(key, JSON.stringify(cash_object));
			}	
		} catch (e) {
			if(sessionStorage.length>0) {
				sessionStorage.removeItem(key);
				var fkey = sessionStorage.key(0);
				sessionStorage.removeItem(fkey);
			}
		}
		},0);
	}
}	
function removeCntMessagesCash(key) {
	if(storu) {
		try {
			sessionStorage.removeItem(key);
		} catch (e) {}
	}
}	

function resizeMsgBox() {
	var maxheight = (($("#work_zone").height()/3)/20|0)*20;
	var boxheight = Math.min($('#msgBoxdiv').height(), maxheight);
	if(maxheight == boxheight && $('#msgBox').css('overflow') == 'hidden') {
		$('#msgBox').css('overflow', 'auto');
	}
	else if (maxheight != boxheight && $('#msgBox').css('overflow') == 'auto') {
		$('#msgBox').css('overflow', 'hidden');
	}
	if($('#msgBox').height() != boxheight) {
		$('#msgBox').height(boxheight);
		$('#uploadfile').height(boxheight+20);
		$("#mess_list").css("height", $(".main_pan").height()-$("#mess_send").height()-18);
	}	

}
function messagesSetViewed(arr_id) {
	if(arr_id.length > 0) {
		var xhr = new XMLHttpRequest();
		var body =	'action=Messages_SetViewed' +
						'&id_list=' + encodeURIComponent(JSON.stringify(arr_id));

			xhr.open("POST", '/my/ajax/action.php', true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() 
			{ 
				if (xhr.readyState != 4) return;
				
				if(!(xhr.responseText.indexOf('%err%') == -1)) {
					showError(xhr.responseText.replace('%err%',''));
					return;
				}
			}
			xhr.send(body);
	}	

}

function messagesGetNewStatus()
{
	var arStatus = {'new': 'Новый',
		'sent': 'Отправлено',
		'delivered': 'Доставлено',
		'viewed': 'Просмотрено'};
	var msg_obj = $('#msg_li .send_message_line[data-ms-status!="viewed"]'); 
	var arr_id = [];
	msg_obj.each(function(key, msg){
		arr_id.push($(msg).attr('id').replace('msg_',''));
	});
	if(arr_id.length > 0) {
		var xhr = new XMLHttpRequest();
		var body =	'action=Messages_StatusGet' +
						'&id_list=' + encodeURIComponent(JSON.stringify(arr_id));

			xhr.open("POST", '/my/ajax/action.php', true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() 
			{ 
				if (xhr.readyState != 4) return;
				
				if(!(xhr.responseText.indexOf('%err%') == -1)) {
					showError(xhr.responseText.replace('%err%',''));
					return;
				}
				try {
					var arResult = $.parseJSON(xhr.responseText);
					var msg_list = arResult.result;
					arResult.forEach(function(rqobject, key){
						var txt_obj = $('#msg_'+rqobject.message_id+' .message_text .msg_status');
						var cur_status = $('#msg_'+rqobject.message_id).attr('data-ms-status');
						if(txt_obj.text() != arStatus[rqobject.status]) {
							$('#msg_'+rqobject.message_id+' .message_text .message_status').removeClass('message_'+cur_status).addClass('message_'+rqobject.status);
							txt_obj.text(arStatus[rqobject.status]);
						}	
					});
				} catch (e) {
					console.log(xhr.responseText);
				}				
			}
			xhr.send(body);
	}	
}

function addFileToList(obj, hide_image) {
	var file_size = Math.round(obj.attr('fsize')/1024);
	var file_idat = getFileType(obj.attr('fext'));
	var file_type = file_idat.type;
	var att_svg = file_idat.svg;
	var file_url = '/my/ajax/files.php?a=detail&i='+obj.attr('ID');//+'&fn='+encodeURIComponent(obj.attr('fname'));//$(this).attr('furl');//'http://localhost:15671/Files/'+obj.attr('ID');
	if(obj.attr('prev').toLowerCase() == 'true') {
		var pvfile_url = '/my/ajax/files.php?a=prev&i='+obj.attr('ID');//+'&fn='+encodeURIComponent(obj.attr('fname'));//$(this).attr('furl');
	}
	else {
		var pvfile_url = '/my/ajax/files.php?a=detail&i='+obj.attr('ID');//+'&fn='+encodeURIComponent(obj.attr('fname'));//$(this).attr('furl');
	}
	var file_met = "KB";
	if(file_size > 1024) { 
		file_size = Math.round(file_size/1024);
		file_met = "MB";
	}
	var img_str = "";	
	var hide_class = (hide_image)?(' close_image'):('');
	if(file_idat.img) {
		img_str = '<div class="image_file'+hide_class+'">' +
		'<div class="close_line">'+
		'<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
		'<path d="M7 14l5-5 5 5z"/>'+
		'<path d="M0 0h24v24H0z" fill="none"/>'+
		'</svg></div>'+
		'<img src="'+pvfile_url+'"/>'+
		'</div>';
	}
	var str_html = '<div class="upfile" id="fn_'+obj.attr('ID') + '" data-furl="'+file_url+'"><a target="_blank" href="'+file_url+'"><div class="file_icon">'+att_svg+'</div></a>'+
		'<div class="file_block"><a target="_blank" href="'+file_url+'"><p class="filename">' + obj.attr('fname') + '</p></a>'+
			'<p class="file_info">'+file_size+file_met+' '+file_type+'</p></div>'+
		'<a target="_blank" href="'+file_url+'"><div class="cloud help_icon"><div class="help_info">Скачать файл</div>'+cloud_svg+'</div></a>'+ img_str +
					'</div>';

	return str_html;
}


function addFileToExtPanList(obj, hide_image) {
	var file_size = Math.round(obj.file_size/1024);
	var file_idat = getFileType(obj.file_extention);
	var file_type = file_idat.type;
	var att_svg = file_idat.svg;
	var file_url = '/my/ajax/files.php?a=detail&i='+obj.file_id;//+'&fn='+encodeURIComponent(obj.attr('fname'));//$(this).attr('furl');//'http://localhost:15671/Files/'+obj.attr('ID');
	if(obj.has_preview == 'true') {
		var pvfile_url = '/my/ajax/files.php?a=prev&i='+obj.file_id;//+'&fn='+encodeURIComponent(obj.attr('fname'));//$(this).attr('furl');
	}
	else {
		var pvfile_url = '/my/ajax/files.php?a=detail&i='+obj.file_id;//+'&fn='+encodeURIComponent(obj.attr('fname'));//$(this).attr('furl');
	}
	var file_met = "KB";
	if(file_size > 1024) { 
		file_size = Math.round(file_size/1024);
		file_met = "MB";
	}
	var img_str = "";	
	var hide_class = (hide_image)?(' close_image'):('');
	if(file_idat.img) {
		img_str = '<div class="image_file'+hide_class+'">' +
		'<div class="close_line">'+
		'<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
		'<path d="M7 10l5 5 5-5z"/>'+
		'<path d="M0 0h24v24H0z" fill="none"/>'+
		'</svg></div>'+
		'<img src="'+pvfile_url+'"/>'+
		'</div>';
	}
	var str_html = '<div class="upfile" id="fn_'+obj.file_id + '" data-furl="'+file_url+'"><a target="_blank" href="'+file_url+'"><div class="file_icon">'+att_svg+'</div></a>'+
		'<div class="file_block"><a target="_blank" href="'+file_url+'"><p class="filename">' + obj.file_name + '</p></a>'+
			'<p class="file_info">'+file_size+file_met+' '+file_type+'</p></div>'+
		'<a target="_blank" href="'+file_url+'"><div class="cloud help_icon"><div class="help_info">Скачать файл</div>'+cloud_svg+'</div></a>'+ img_str +
					'</div>';

	return str_html;
}

function addMessageToList(arResult, mode) {
		if(arResult.length == 0) {
			return;
		}	
		var rcv_from_obj = getContactInfo((arResult[0].from == smuser.name)?arResult[0].to:arResult[0].from);
		if($('#msg_li').attr('data-cnt-id') != '' && $('#msg_li').attr('data-cnt-id') != rcv_from_obj.name) {
			return;
		 }
		/*var msg_object = {'msg_ID': $(this).attr('ID'), 'msg_type': $(this).attr('type'), 'msg_status': $(this).attr('status'), 'msg_date': getDateFromString($(this).attr('dt')),
		'msg_from': $(this).attr('from'), 'msg_to': $(this).attr('to'), 'msg_text': $(this).text(), 'files': $(this).find('file')}*/
		var arStatus = {'new': 'Новый',
			'sent': 'Отправлено',
			'delivered': 'Доставлено',
			'processed': 'Обработано',
			'confirmed': 'Подтверждено',
			'viewed': 'Просмотрено'};
		var repMessages = 0;
		var nowDate = new Date();
		
		var yesterdayDate = new Date();
		yesterdayDate.setDate(yesterdayDate.getDate() - 1); 
		
		var strNowDate = getUserStringFromDate(nowDate);
		var strYesterday = getUserStringFromDate(yesterdayDate);
		
		var avatarSVG = '<svg fill="#BBB" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">'+
					'<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>'+
					'<path d="M0 0h24v24H0z" fill="none"/>'+
					'</svg>';
		
		var myAvatarURL = $('#cnt_'+ smuser.id).find('.cnt_avatar').css('background-image') || $('#login_image').find('.cnt_avatar').css('background-image') || 'url(/include/no_avatar.svg)';
		myAvatarURL = myAvatarURL.replace(new RegExp('"','g'),"");
		if(myAvatarURL == 'none') {
			var myAvatar = '<div class="cnt_image cnt_avatar" style="background-image: none">' + avatarSVG + '</div>';
		} else {
			var myAvatar = '<div class="cnt_image cnt_avatar" style="background-image: '+myAvatarURL+'"></div>';
		}
		var myheader = smuser.fullname;
		var rcvAvatarURL = $('#cnt_'+ rcv_from_obj.id).find('.cnt_avatar').css('background-image') || $('#login_image').find('.cnt_avatar').css('background-image') || 'url(/include/no_avatar.svg)';
		rcvAvatarURL = rcvAvatarURL.replace(new RegExp('"','g'),"");
		if(rcvAvatarURL == 'none') {
			var rcvAvatar = '<div class="cnt_image cnt_avatar" style="background-image: none">' + avatarSVG + '</div>';
		} else {
			var rcvAvatar = '<div class="cnt_image cnt_avatar" style="background-image: '+rcvAvatarURL+'"></div>';
		}
		var rcvheader = rcv_from_obj.fullname;
		$('#msg_li').attr('data-cnt-id',rcv_from_obj.name);
		
		var last_msg = $('#msg_li .message_line').last();
		var last_msg_cnt = last_msg.attr('data-ms-inf');
		var last_msg_date = $('#msg_li .msg_date').last().parent();
		
		var prev_cnt 	= "";
		var prev_date	= "";
		var html_block	= "";
		
		var first_cnt  = "";
		var first_date  = "";
		var last_date	= "";
		
		var viewed_id = [];

		arResult.forEach(function(msg_object, key){
			var files_html = '';
			var html_date = '';
			var html_cnt = '';
			var status_text = '';
			var resend_text = '';
			var txtNode = msg_object.msg_text;
			
			var nodeReg = /((http|https):\/\/)|(www.)/i;
			var nodePos = txtNode.search(nodeReg);
			if(nodePos >= 0) {
				var tmpNodeText = txtNode.substr(nodePos);
				var lastPos = tmpNodeText.search(" ");
				var hrefText = (lastPos >= 0)?tmpNodeText.substr(0, lastPos):tmpNodeText;
				var new_hrefText = (/:\/\//.exec(hrefText) === null ? "http://" + hrefText : hrefText);
				var new_hrefText = "<a target=\"_blank\" href=\""+ new_hrefText + "\">" + hrefText + "</a>";
				txtNode = txtNode.replace(hrefText, new_hrefText);
			}	
			
			var str_temp = '';
			var msg_status_data = '';
			var msg_sent_class = '';
			if(!(msg_object.tmp_msg == undefined) || msg_object.tmp_msg == 'true' || msg_object.tmp_msg) {
				str_temp = ' message_tmpline';
			} else if(msg_object.from == smuser.name) {
				str_temp = ' message_'+msg_object.status;
				msg_status_data = 'data-ms-status="'+msg_object.status+'"';
				msg_sent_class = ' send_message_line';
			} else if(msg_object.status != "viewed"){
				viewed_id.push(msg_object.ID);
			}

			//date_inf
			var msg_date = getDateFromString(msg_object.dt);
			var str_msgdate = getUserStringFromDate(msg_date);
			var strDate = getUserStringFromDate(msg_date);
			if(strDate == strNowDate) {	strDate = 'Сегодня'; }
			else if (strDate == strYesterday) { strDate = 'Вчера'; }
			
			html_date = '<div class="message_line" style="text-align: center; margin: 10px 0;" data-msg-date="'+str_msgdate+'"><hr class="msg_divider"><div class="msg_date">' + strDate + '</div></div>';

			//contact_inf
			var msg_header = (msg_object.from == smuser.name)?myheader:rcvheader;
			var msg_avatar = (msg_object.from == smuser.name)?myAvatar:rcvAvatar;
			
			html_cnt = '<div id="msg_inf" style="margin-top: -10px;">' + msg_avatar +
					//'<div class="cnt_image cnt_avatar" style="background-image: '+avatarURL+'">' + avatarSVG + '</div>'+
					'<div class="message_header"><a>'+msg_header+'</a></div>' + 
					'<div class="message_date">'+getTimeStringFromDate(msg_date)+'</div>'+
				'</div>';

			//files
			$(msg_object.files).each(function() {
				if(!($(this).attr('ID') == undefined))
					files_html = files_html + addFileToList($(this), false);
			});
			if(!files_html=='') {
				files_html = '<div class="att_text">Вложенный файл:</div><div class="msg_file">' + files_html + '</div>';
			}
			
			//message
			resend_text = '<div class="msg_resend" title="Переслать сообщение">'+
				'<svg fill="#777" height="19" viewBox="0 0 24 24" width="19" xmlns="http://www.w3.org/2000/svg">'+
					'<path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"></path>'+
					'<path d="M0 0h24v24H0z" fill="none"></path>'+
				'</svg></div>';
			if(msg_object.from == smuser.name) {
				status_text = '<div class="msg_status" title="Статус сообщения">'+ arStatus[msg_object.status] +'</div>';
			}
			
			var msg_ubody = '<div class="message_text">' +
							'<div class="msg_time">'+getTimeStringFromDate(msg_date)+'</div><pre>'+txtNode+'</pre>' + files_html +
							'<div class="msg_addblock">' + resend_text + status_text + '</div>' +
							'<div class="message_status'+str_temp+'"></div>' +
						'</div>'+
						'<div class="msg_submenu">'+
							'<svg fill="#777" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">'+
								'<path d="M0 0h24v24H0z" fill="none"/>'+
								'<path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>'+
							'</svg></div>'+
						'</div>'
			
			//creating message
			var msg_html = "";
			if ($("div").is('#' + 'msg_'+ msg_object.ID)) {
				msg_html = '<div id="msg_'+ msg_object.ID+ '" class="message_line'+msg_sent_class+'" data-ms-inf="'+msg_object.from+'" '+msg_status_data+'>' + html_cnt + msg_ubody;

				var addInfo = (($('#' + 'msg_'+ msg_object.ID).find('#msg_inf').length != 0) || (!files_html==''));
				$('#' + 'msg_'+ msg_object.ID).replaceWith(msg_html);
				if (!addInfo) {
					$('#' + 'msg_'+ msg_object.ID).find('#msg_inf').remove();
				}
			}
			else if ((!msg_object.tmpGUID == '') && $("div").is('#' + 'msg_'+ msg_object.tmpGUID)) {
				msg_html = '<div id="msg_'+ msg_object.ID+ '" class="message_line'+msg_sent_class+'" data-ms-inf="'+msg_object.from+'" '+msg_status_data+'>' + html_cnt + msg_ubody;

				var addInfo = (($('#' + 'msg_'+ msg_object.tmpGUID).find('#msg_inf').length != 0) || (!files_html==''));
				$('#' + 'msg_'+ msg_object.tmpGUID).replaceWith(msg_html);
				if (!addInfo) {
					$('#' + 'msg_'+ msg_object.ID).find('#msg_inf').remove();
				}
			}
			else {
				msg_html = '<div id="msg_'+ msg_object.ID+ '" class="message_line'+msg_sent_class+'" data-ms-inf="'+msg_object.from+'" '+msg_status_data+'>';
				if((prev_cnt == '' && prev_date == '') || (prev_date != html_date)) {
					if (mode == 'end' && first_cnt == '' && last_msg_cnt == msg_object.from && files_html=='' && str_msgdate == last_msg_date.attr("data-msg-date")) {
						msg_html = html_date + msg_html;
					} 
					else {
						msg_html = html_date + msg_html + html_cnt;
					}
					
					first_date = (first_date == "")?str_msgdate:first_date;
					first_cnt = (first_cnt == "")?msg_object.from:first_cnt;
					last_date = str_msgdate;
				}
				else if((prev_cnt != msg_header) || (!files_html=='')) {
					msg_html = msg_html + html_cnt;
				}
				msg_html = msg_html + msg_ubody;
				
				prev_cnt = msg_header;
				prev_date = html_date;
				html_block = html_block + msg_html;
			}	
		});

		if(html_block != ""){
			if(mode == 'begin') {
				$('[data-msg-date='+last_date+']').remove();
				$("#msg_li").prepend(html_block);
			}
			else if(mode == 'end') {
				var date_duplicate = false;
				if ($('[data-msg-date='+first_date+']').length != 0) {
					date_duplicate = true;
				}
				$("#msg_li").append(html_block);
				if(date_duplicate) {
					var obj = $('[data-msg-date='+first_date+']')[$('[data-msg-date='+first_date+']').length-1];
					$(obj).remove();
				}
			}
		}
		messagesSetViewed(viewed_id);
}
function showMessages(contact, arMsg, mode, isBegining)
{
	$('.wait').remove();
	var cur_contact = getActiveContact();
	if(contact.id != cur_contact.id) {
		removeCntMessagesCash('msg_'+contact.id);
		return;
	}	
	if(isBegining) {
		if($("#msg_li").find('#msg_begin').length == 0) {

			var avatarURL = $('#cnt_'+ contact.id).find('.cnt_avatar').css('background-image') || 'url(/include/no_avatar.svg)';
			avatarURL = avatarURL.replace(new RegExp('"','g'),"");
			var xhr = new XMLHttpRequest();
			var body =	'contact=' + encodeURIComponent(contact.name) +
						'&fullname=' + encodeURIComponent(contact.fullname) +
						'&contact_img=' + encodeURIComponent(avatarURL);

			xhr.open("POST", '/my/ajax/msg_begin.php', true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() 
			{
				if (xhr.readyState != 4) return;
				$("#msg_li").prepend(xhr.responseText);
			}		
			xhr.send(body);
		}
	} 
	if(arMsg.length == 0) {
		return;
	}	
		
	var msg_scroll_ID = $('#msg_li').children().eq(1).attr('id');

	addMessageToList(arMsg, mode);
	new_msg_obj = $('[data-usr-name='+encodeString(contact.name)+']').find(".new_msg");
	new_msg_obj.html("<span></span>");
	new_msg_obj.css("display", "none");

	if(mode == 'begin' && arMsg.length>0) {
		$('#msg_li').attr('data-start_date', arMsg[0].dt);
	}
	if(mode == 'end') {
		$('#mess_list').scrollTop($('#msg_li').height());
		if($('#msg_li').attr('data-cnt-id') == contact.name) {
			var cash_obj = {'result':$('#mess_list').html(), 'top':$('#mess_list').scrollTop()};
			saveCntMessagesCash('msg_'+contact.name, cash_obj);
		}
		else {
			removeCntMessagesCash('msg_'+contact.id);
			removeCntMessagesCash('msg_'+$('#msg_li').attr('data-cnt-id'));
		}
	}
	else if(!(msg_scroll_ID == undefined)) {
		document.getElementById(msg_scroll_ID).scrollIntoView(false);
	}
	else {
		$('#mess_list').scrollTop($('#msg_li').height());
	}
}

function getSelectedContactMessages(start_date, limit)
{
	limit = (limit=='')?50:limit;
	var contact	= getActiveContact();
	if(!(contact.id == undefined))
	{
		hideTelebotInfo();
		if($('#msgBox').hasClass('sending')) {
			$("#msgBox").removeClass('sending');
		}	
		if(limit > 100 && storu) {
			$('#mess_list').css('opacity',0);
			$('#mess_list').css('display','none');
			$('#mess_send').css('display','none');

			var str_stored = sessionStorage.getItem('msg_'+contact.id);
			if(!(str_stored == undefined)) {
				var arStored = jQuery.parseJSON(str_stored);
				
				$('#mess_list').html(LZString.decompress(arStored.result));
				$('#mess_list').css('display','block');
				$('#mess_list').scrollTop(arStored.top || $('#msg_li').height());
				$('#mess_list').animate({opacity: 1}, 300, function() {
					$('#mess_list').scrollTop(arStored.top || $('#msg_li').height());
					getSelectedContactNewMessages();
					}
					);
				$('#mess_send').css('display','block');
				return;
			}
		}
		
		if(limit>100) {
			$('#mess_list').css('opacity',0);
			$('#mess_list').css('display','none');
			$('#mess_send').css('display','none');
			
			showTelebotInfo('Когда дует ветер перемен, кто-то возводит стены, а некоторые строят ветрянные мельницы','',0);
		}
		var formated_date = getStringFromDate(start_date);
		var xhr = new XMLHttpRequest();
		var body =	'action=msg_get' +
					'&adds=json' +
					'&mode=begin' +
					'&receiver=' + encodeURIComponent(contact.name) +
					'&type=all' +
					'&start_date=' + formated_date +
					'&limit='+limit;

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			hideTelebotInfo();
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			try {
				var arResult = jQuery.parseJSON(xhr.responseText);
			}
			catch (e) {
				showTelebotInfo('Ошибка соединения c сервером...','amaze',0);
				$('#mess_list #msg_li').attr('data-cnt-id','');
				return;
			}
			var isBegining = (arResult.length < limit)?(true):(false);
			showMessages(contact, arResult.reverse(), 'begin', isBegining);
			if(limit>100) {
				$('#mess_list').css('display','block');
				$('#mess_list').scrollTop($('#msg_li').height());
				$('#mess_list').animate({opacity: 1}, 300, function() {
					$('#mess_list').scrollTop($('#msg_li').height());
					}
					);
				$('#mess_send').css('display','block');
			}
		}		
		xhr.send(body);
	}
	else {
		url = '/my/sections/wpaper.php';
		$("#mess_list").load(url);
		//showTelebotInfo('Выберите контакт, остальное сделаю я :)','pleased',0);
		$("#msgBox").addClass('sending');

	}
}

function getSelectedContactNewMessages()
{
	var contact	= getActiveContact();
	if(!(contact.id == undefined))
	{
		var xhr = new XMLHttpRequest();
		var body =	'action=msg_getNew' +
					'&adds=json' +
					'&receiver=' + encodeURIComponent(contact.name);

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			hideTelebotInfo();
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			try {
				var arResult = jQuery.parseJSON(xhr.responseText);
			}
			catch (e) {
				$('#mess_list #msg_li').html('<div style="text-align: center;">Ошибка соединения c сервером...</div>');
				$('#mess_list #msg_li').attr('data-cnt-id','');
				return;
			}
			showMessages(contact, arResult.reverse(), 'end', false);

		}		
		xhr.send(body);
	}	
}

//msg.js-


