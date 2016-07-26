var smuser = undefined;
var storu = (typeof(Storage) !== "undefined");
var empty_group = '<div class="empty_group tl_droppable">Перетащите нужные контакты в этот канал<br>Пустой канал сохранен не будет</div>';

$(document).ready(function() {
	arSizes = getPageSize();
	$(document.body).addClass('my_body');
	$('.my_body').on('click',function(e) {
		if($(e.target).hasClass('modal_back')) {
			e.stopPropagation();
			if($(e.target).hasClass('strong')) { return;}
			
			$(e.target).next('div').remove();
			$(e.target).remove();
			$('.cnt_info').not($(e.target).children()).hide();
			$('.msg_selected').removeClass('msg_selected');
			//RB
			hideCtxChannelMenu($('#ctx-channel-menu'));
			hideSelectedList();
			hideContactMoveList();
			//RB
			//$('.trans_svg').toggleClass('transform_icon');
		}
		else if(!($(e.target).parents().hasClass('modal_window')) && !$(e.target).hasClass('modal_window'))
		{
			if($(e.target).is('ymaps')) {return;}

			$('.modal_window').hide();
			$('.modal_window').remove();
			$('.modal_back').remove();
			$('.cnt_info').not($(e.target).children()).hide();
			$('.msg_selected').removeClass('msg_selected');
			//$('.trans_svg').toggleClass('transform_icon');
	}	
	});
	$('#ext_bar').on('click', function(e) {
		e.stopPropagation();
		expandExtPan();
	});
	$('#ext_pan_header .clw').click(function(e) {
		e.stopPropagation();
		hideExtPan();
	});
	
	$('#cnt_bar').on('click', function(e) {
		e.stopPropagation();
		expandRightPan();
	});
	
	//file selection
	$(".my_body").on('change',"form[name='fs_form'] input[type='file']", function(e) {
		$(this).submit();
	});
	$(".my_body").on('submit', "form[name='fs_form']", function(e) {
		e.preventDefault();
		var thisForm = document.forms.fs_form;
		var body = new FormData(thisForm);
		var operID = $(thisForm).find('[name=operID]').val();

		var xhr = new XMLHttpRequest();
		xhr.open("POST", thisForm.action, true);
		xhr.onreadystatechange = function()	{ 
			if (xhr.readyState != 4) return;
			
			try {
				var arResult = jQuery.parseJSON(xhr.responseText);
			}
			catch (err) {
				showError(xhr.responseText);
			}
			
			if (arResult.err == 0) {
				if(operID = 'usr-addPhoto') {
					$('#cnt_photo img').attr('src', arResult.img);
					$('#cnt_photo img').attr('data-change', "1");
					$('#cnt_photo img').attr('data-width', arResult.info[0]);
					$('#cnt_photo img').attr('data-height', arResult.info[1]);
				}	
			}
			else {
				showError(arResult.err_info);
			}
		}
		xhr.send(body);
	
	});

	//добавлен обработчик для выбора логотипа компании ---------------
	$(".my_body").on('change',"form[name='fs_logo'] input[type='file']", function(e) {
		$(this).submit();
	});
	
	$(".my_body").on('submit', "form[name='fs_logo']", function(e) {
		e.preventDefault();
		var thisForm = document.forms.fs_logo;
		var body = new FormData(thisForm);
		var operID = $(thisForm).find('[name=operID]').val();
		
		var xhr = new XMLHttpRequest();
		xhr.open("POST", thisForm.action, true);
		xhr.onreadystatechange = function()	{ 
			if (xhr.readyState != 4) return;
			
			try {
				var arResult = jQuery.parseJSON(xhr.responseText);
			}
			catch (err) {
				showError(xhr.responseText);
			}
			
			if (arResult.err == 0) {
				if(operID = 'usr-addLogo') {
					$('#cnt_logo img').attr('src', arResult.img);
					$('#cnt_logo img').attr('data-change', "1");
					$('#cnt_logo img').attr('data-width', arResult.info[0]);
					$('#cnt_logo img').attr('data-height', arResult.info[1]);
				}	
			}
			else {
				showError(arResult.err_info);
			}
		}
		xhr.send(body);
	});
	
	$(".my_body").on('mouseenter',".help_icon", function(e) {
		e.stopPropagation();
		var help_text = $(this).find('.help_info').html();
		var help_block = '<div class="help_hint">'+	help_text +	'</div>';
		$(".my_body").append(help_block);
		off_cor = $(this).offset();
		if(off_cor.top+70 > $('#content').height()) {
			var Ypx = -35;
		}
		else {
			var Ypx = 35;
		}	
		if(off_cor.left+$('.help_hint').width()+50 > $('#content').width()) {
			var Xpx = -$('.help_hint').width();
		}
		else {
			var Xpx = 30;
		}	
		$('.help_hint').offset({top:off_cor.top+Ypx, left:off_cor.left+Xpx});
		setTimeout(function() {$('.help_hint').animate({opacity: 0}, 300, function() {$('.help_hint').remove()});}, 3500);
	});
	$(".my_body").on('mouseleave',".help_icon", function(e) {
		e.stopPropagation();
		$('.help_hint').remove();
	});
	
	$(".my_body").on('click',".menu_icon", function(e) {
		e.stopPropagation();
		var str ='<div class="modal_back"></div>\
			<div id="active_menu" class="modal_window" style="position: absolute;">' + $('.menu_icon .menu_content').html() +
			'</div></div>';
		$('.my_body').append(str);
		off_cor = $(this).offset();
		$('#active_menu').offset({top:off_cor.top+36, left:off_cor.left-$('#active_menu').width()});
		$('#active_menu').slideDown(100);
	});
	$(".my_body").on('click',".leftmenu_icon", function(e) {
		e.stopPropagation();
		if($(this).find('.trans_svg').hasClass('transform_icon')) {
			$(this).find('.trans_svg').removeClass('transform_icon');
			$('#contacts_menu').html('');
		}
		else {
			var str ='<div class="modal_back"></div>\
				<div id="active_menu" class="modal_window" style="position: absolute; min-width: 277px;">' + $('.leftmenu_icon .leftmenu_content').html() +
				'</div></div>';
			$('.my_body').append(str);
			off_cor = $(this).offset();
			$('#active_menu').offset({top:off_cor.top+36, left:off_cor.left-6});
			$('#active_menu').slideDown(100);
		}	
	});
	$("#contacts").on('click',".search_button", function(e) {
		e.stopPropagation();
		if($(this).prev('input').css('display') == 'none') {
			$('#tlp_slogan').css('display', 'none');
			$(this).css('border-radius', '0 5px 5px 0');
			$(this).prev('input').css('display', 'inline-block');
			$(this).prev('input').animate({'width': 200}, 300);
			$(this).prev('input').focus();
			$(this).html('<svg class="transform_icon" fill="#777" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">\
						<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>\
						<path d="M0 0h24v24H0z" fill="none"></path>\
					</svg>');
		}
		else {
			$('#tlp_slogan').css('display', 'inline-block');
			$(this).css('border-radius', '5px');
			$(this).prev('input').css('display', 'none');
			$(this).prev('input').css('width', 10);
			$(this).prev('input').val('');
			clearContactsSearch();
			$(this).html('<svg fill="#777" height="32px" version="1.1" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink">\
							<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"></g>\
							<path d="M19.4271164,21.4271164 C18.0372495,22.4174803 16.3366522,23 14.5,23 C9.80557939,23 6,19.1944206 6,14.5 C6,9.80557939 9.80557939,6 14.5,6 C19.1944206,6 23,9.80557939 23,14.5 C23,16.3366522 22.4174803,18.0372495 21.4271164,19.4271164 L27.0119176,25.0119176 C27.5621186,25.5621186 27.5575313,26.4424687 27.0117185,26.9882815 L26.9882815,27.0117185 C26.4438648,27.5561352 25.5576204,27.5576204 25.0119176,27.0119176 L19.4271164,21.4271164 L19.4271164,21.4271164 Z M14.5,21 C18.0898511,21 21,18.0898511 21,14.5 C21,10.9101489 18.0898511,8 14.5,8 C10.9101489,8 8,10.9101489 8,14.5 C8,18.0898511 10.9101489,21 14.5,21 L14.5,21 Z" id="search"></path>\
						</svg>');
		}
	});

	$('#content').before('<div class="back_panel"></div>');
	$('#content').css('width', '98%'); 
	$("#main_content").css("height", arSizes[3]-20);
	$(".workspace").css("height", arSizes[3]-80);
	$(".main_pan").css("height", $(".workspace").height()-$(".up_pan").height());
	$("#my_contacts").css("height", $("#contacts").height()-46);
	$('#cnt_list').slimScroll({height: 'auto', size: '7px', disableFadeOut: true});
	
	$(window).resize(function() {
		arSizes = getPageSize();
		$("#main_content").css("height", arSizes[3]-20);
		$(".workspace").css("height", arSizes[3]-80);
		$(".main_pan").css("height", $(".workspace").height()-$(".up_pan").height());
		$("#my_contacts").css("height", $("#contacts").height()-46);
		$('#cnt_list').slimScroll({height: 'auto', size: '7px', disableFadeOut: true});
		
		$("#mess_list").css("height", $(".main_pan").height()-$("#mess_send").height()-18);
		$("#mess_list").css("maxWidth", $(".workspace").width()-$("#contacts").width()-$("#ext_pan").width()-2);
		$('#msgBoxdiv').width($('#msgBox').width());
		
		$("#item_list").css("height", $(".main_pan").height() - $("#items_header").height());
		$("#order_list").css("height", $(".main_pan").height() - $("#orders_header").height());
		$('#order_view .order_bottom').height($('#order_view').height()-240);
		$('#order_view .order_bottom .order_item_list').height($('#order_view .order_bottom').height()-172);
		$('#order_view .order_item_list_header').css('padding-right', $('#order_view .order_bottom').width() - $('#order_view').find('.order_item_li').width());	
		//$('#order_view #comment, #delivery_adress').width($('#order_view #comment').parent().width()-130);
		
		resizeTelebot();
	});
	
	$("#login_block > *").not("#my_info").click(function(e)
		{
		e.stopPropagation();
		if(e.target.id == 'my_logout') { return;}
		
		if (!$("div").is("#my_info")) {
			$("#login_border").after('<div id="my_info" class="modal_window" style="position: relative;"></div>');
			$("#my_info").load('/my/info.php');
			$("#my_info").slideToggle(100);
		}
		else {
			$("#my_info").slideToggle(100, function(){$("#my_info").remove();});
				
		}
	});
	
	//contact list
	droppableCreate($( "#m_cnt_list .tl_droppable"));
	$(".tl_draggable").draggable({ scroll: true,
			containment: "#m_cnt_list",
			axis: "y",
			delay: 400,
			revert: "invalid",
			start: function() {
				$(this).addClass('start_dragging');
			},	
			stop: function() {
				$(this).removeClass('start_dragging');
				$(this).removeClass('cnt_dragging');
			}
		});	
	/*$( "#m_cnt_list" ).sortable({
		containment: "#m_cnt_list",
		axis: "y",
		cursor: "move",
		revert: true,
		start: function(e) {
			$('#cnt_list h3').addClass('close_list');
			$('#cnt_list h3').next("div").hide();
			$(e.target).css('background-color',' #EEEEEE');
		},	
		stop: function() {
			$(this).find('h3').css('background-color',' #FFFFFF');
		}
    });*/
	/*$(".group_block").draggable({ scroll: true,
		containment: "#m_cnt_list",
		axis: "y",
		cursor: "move",
		connectToSortable: "#m_cnt_list",
		delay: 400,
		revert: "invalid",
		start: function() {
			$(this).zIndex(5);
			$(this).find('h3').css('background-color',' #E1E1E1');
		},	
		stop: function() {
			$(this).find('h3').css('background-color',' #FFFFFF');
		}
	});*/
	$('#cnt_list').on('click','h3', function(e){
		$(".group_block").css('z-index','');
		$(".group_block").css('width','');
		$(".group_block").css('height','');

        $(this).next("div").slideToggle(100)
		$(this).toggleClass('close_list');
    });
	$('#cnt_list').on('click','.contact_inf, .active_contact_inf, .sel_contact_inf', function(){
		if($(this).hasClass('active_contact_inf')) {
			return;}

		var preActiveContact = getActiveContact();
		
		$('.active_contact_inf').removeClass("active_contact_inf").addClass('contact_inf');
        $(this).removeClass("sel_contact_inf");
		$(this).addClass('active_contact_inf');
		
		setCurrentContact($(this).clone());
		$('#contact_filter').removeClass('ext_selected');
		$('#exp_filter').removeClass('svg_selected');
		
		if($(".topmenu li.active").attr('id') == 'm_messages') {
			if($('#mess_list').css('display') != 'none' && $('#mess_list').html() != '' && preActiveContact.id != undefined
				&& !($('div').is('.wait'))) {

				if($('#msg_li').attr('data-cnt-id') == preActiveContact.name) {
					var cash_obj = {'result':$('#mess_list').html(), 'top':$('#mess_list').scrollTop()};
					$('#mess_list').css('opacity',0);
					$('#mess_list').css('display','none');
					$('#mess_list').html('');
					saveCntMessagesCash('msg_'+preActiveContact.name, cash_obj);
				}	
			}
			
			$('#mess_list').html('<div id="msg_li" data-cnt-id=""></div>');
			var contact	= getActiveContact();
			$('.cnt_check').hide(1);
			var hurl = '/my/index.php?mode=messages&cnt=' + encodeURIComponent(contact.name);
			if((window.location.protocol + '//' + window.location.host+hurl) != window.location.href) {	
				window.history.pushState(null, null, hurl);
			}	
			
			var start_date = new Date();
			start_date.setDate(start_date.getDate() + 2);
			getSelectedContactMessages(start_date, 101);
		}
		else if($(".topmenu li.active").attr('id') == 'm_orders') {
			var contact	= getActiveContact();
			var hurl = '/my/index.php?mode=orders&cnt=' + encodeURIComponent(contact.name);
			if((window.location.protocol + '//' + window.location.host+hurl) != window.location.href) {	
				window.history.pushState(null, null, hurl);
			}	
			
			$('#order_list').html('<div id="order_li"></div>');
			initOrderList(false);
		}
		else {
			topMenu_action($(".topmenu li.active").attr('id'));
		}
    });
	$('#cnt_list').on('mouseenter','.contact_inf',function(){
		$(this).removeClass("contact_inf").addClass('sel_contact_inf');
		$(this).find('.cnt_info').show();		
    });
	$('#cnt_list').on('mouseleave','.active_contact_inf, .sel_contact_inf',function(){
		$(this).removeClass("sel_contact_inf").addClass('contact_inf');
		if($('#cnt_menu').length == 0 || $('#cnt_menu').attr('data-cnt') != $(this).attr('id')) {
			$(this).find('.cnt_info').hide();		
		}	
    });
	$('#cnt_list').on('click','.cnt_info',function(e) {
		//$('.cnt_info').not(this).hide();
		e.stopPropagation();
		if($('#cnt_menu').length != 0) {
			var cnt_id = $('#cnt_menu').attr('data-cnt');
			$('#cnt_menu').hide();
			$('#cnt_menu').remove();
			if(cnt_id == $(this).parent().attr('id')) {
				return;
			}
		}
		var block_str = '<p id="block">Заблокировать контакт</p>';
		var del_str = '<p id="del">Удалить контакт</p>';
		
		var mcnt_obj = $('#cnt_'+$(this).parent().attr('data-usr-id'));
		var gr_obj = getGroupHead(mcnt_obj);
		console.log(gr_obj);
		if(gr_obj.attr('data-srtnum') == 999) {
			block_str = '<p id="unblock">Разблокировать контакт</p>';
		}
		else if(gr_obj.attr('data-srtnum') == -5) {
			block_str = '';
			del_str = '';
		}
		else if(gr_obj.attr('data-srtnum') == -10) {
			block_str = '';
		}
		else if(gr_obj.attr('data-srtnum') == 990) {
			block_str = '';
			del_str = '';
		}
		var str ='<div class="modal_back"></div><div id="cnt_menu" class="modal_window" style="position: absolute;" data-cnt="'+$(this).parent().attr('id')+'" data-cnt-name="'+$(this).parent().attr('data-usr-name')+'">' +
			'<div style="margin: 0px 10px;">' +
				'<p id="inf">Информация о контакте</p>' +
				block_str +
				del_str +
			'</div></div>';
		$('.my_body').append(str);
		off_cor = $(this).offset();
		if((off_cor.top + $('#cnt_menu').height()) > $('#content').height()) {
			$('#cnt_menu').offset({top:off_cor.top-$('#cnt_menu').height()-13, left:off_cor.left+15});
		}
		else {
			$('#cnt_menu').offset({top:off_cor.top+22, left:off_cor.left+15});
		}	
		$('#cnt_menu').show(100);
		$('#cnt_menu').on('click','p',function(e) {
			var obj_id = $(this).attr('id');
			if(obj_id == 'inf') {
				var cnt_name = $('#cnt_menu').attr('data-cnt-name');
				ContactInfoView(cnt_name);
			}
			else if(obj_id == 'block') {
				var cnt_name = $('#cnt_menu').attr('data-cnt-name');
				ContactDeleteBlocking(cnt_name, 'true');
			}
			else if(obj_id == 'del') {
				var cnt_name = $('#cnt_menu').attr('data-cnt-name');
				ContactDeleteBlocking(cnt_name, '');
			}
			else if(obj_id == 'unblock') {
				var cnt_name = $('#cnt_menu').attr('data-cnt-name');
				ContactUnblock(cnt_name);
			}
			$('#cnt_menu').hide();
			$('#cnt_menu').remove();
			$('.modal_back').remove();
			$('.cnt_info').hide();

		});
	});
	$('#cnt_list, #cur_contact').on('click','.cnt_avatar',function(e) {//dblclick
		e.stopPropagation();
		var cnt_name = $(this).parents('[data-usr-name]').eq(0).attr('data-usr-name');
		ContactInfoView(cnt_name);

	});
	$('#cnt_list').on('click','.cnt_blocked',function(e) {
			e.stopPropagation();
	});
	$('#cnt_list').on('click','.new_msg',function(e) {
		var new_msg_obj = $(this).parent();
		var new_msg_contact = new_msg_obj.attr('data-usr-name');
		var cur_contact = getActiveContact();
		var cur_menu = $(".topmenu li.active").attr('id');
		if(new_msg_contact == cur_contact.name && cur_menu == 'm_messages') {
			return;
		}
		
		if(cur_menu != 'm_messages') {
			$('.active_contact_inf').removeClass("active_contact_inf").addClass('contact_inf');
			new_msg_obj.removeClass("sel_contact_inf");
			new_msg_obj.addClass('active_contact_inf');
			setCurrentContact(new_msg_obj.clone());
			
			$(".topmenu li.active").removeClass('active');
			$("#m_messages").addClass('active');
			topMenu_action($(".topmenu li.active").attr('id'));
		}
		else {
			new_msg_obj.removeClass("active_contact_inf");
			new_msg_obj.click();
		}	
	});
	$('#cnt_list').on('click','.cnt_check',function(e) {
		e.stopPropagation();
		var cnt_block = $(this).parent();
		var cnt_obj = getContactInfo(cnt_block.attr('data-usr-name'));

		if($(this).find('svg').css('display') == 'none') {
			var chk_text = 'inline-block';
			var checking = true;
		}
		else {
			var chk_text = 'none';
			var checking = false;
		}		
		$('#cnt_list [data-usr-id='+cnt_obj.id+']').find('.cnt_check svg').css('display',chk_text);
		
		var rec_obj = $('[data-rec-id='+cnt_obj.id+']');
		if(checking) {
			if(rec_obj.length == 0) {
				var html_str = '<div class="receiver" style="display: inline-block;" data-rec-id="'+cnt_obj.id+'" data-rec-name="'+cnt_obj.name+'">'+
						'<div class="receiver_text">'+
							cnt_obj.fullname + ' (' + cnt_obj.name + ')' +
							'<div class="del_receiver"></div>'+
						'</div>'+
					'</div>';
				$('#mess_send .receiver_block').append(html_str);
			}
		}	
		else {
			rec_obj.eq(0).remove();
		}		
		
		$('#mess_send #rec_quan').text($('#mess_send .receiver_block .receiver').length);
		$("#mess_list").css("height", $(".main_pan").height()-$("#mess_send").height()-18);
	});
	$('#cnt_list').on('click','.channel_chkbox',function(e) {
		e.stopPropagation();

		if($(this).find('svg').css('display') == 'none') {
			var chk_text = 'inline-block';
			var rev_chk_text = 'none';
			var checking = true;
		}
		else {
			var chk_text = 'none';
			var rev_chk_text = 'inline-block';
			var checking = false;
		}
		
		$(this).find('svg').css('display',chk_text);
		$(this).parent().next('div').find('.cnt_check').each(function() {
			$(this).find('svg').css('display', rev_chk_text);
			$(this).click();
		});
		
		
	});
	//menu
	 $(".topmenu li").click(function(){
		if(!$(this).hasClass('active')) {
			$(this).addClass('active');
		}
		else {
			return;
		}
        $(this).siblings("li").removeClass('active');
		topMenu_action($(this).attr('id'));
    });

	$('.my_body').on('click','#add_cnt', function(e) {
		var obj = $('#contacts_menu');//$(this).parent();
		e.stopPropagation();
		$('.modal_back').remove();
		$('#active_menu').remove();
		$('.leftmenu_icon').find('.trans_svg').toggleClass('transform_icon');
		if(obj.find('.new_cnt').length == 0) {
			obj.find('.new_cnt').remove();
			
			var str = '<div class="new_cnt" >' +
				'<div style="margin-top: 5px;">' +
					'<input class="cnt_inp" type="text" placeholder="Введите e-mail нового контакта" name="new_cntname" value=""/>' +
					'<div class="reg_error" style="display: none; padding-top: 10px;"></div>' +
					'<div class="search_result" data-last-value=""></div>' +
				'</div>' + 
				'<div style="font-size: 13px; font-weight: 600; margin: 10px 0 3px 0;">Сообщение для контакта</div>' + 
				'<div><textarea id="new_cntmsg">'+smuser.fullname+' предлагает вам присоединиться к списку своих контактов в системе TELEPORT.</textarea></div>' +
				'<div id="new_cnt_confirm" class="menu_button">Отправить</div>'+
				'</div>'+
				'<div id="new_cntresponse"><div id="new_cnttext"></div><div class="menu_button">Продолжить</div></div>';
			obj.append(str);
			$('.cnt_inp').bind("change keyup click", function() {
				if(this.value.length >= 3 && $('.search_result').attr("data-last-value") != this.value){
					$.ajax({type: 'post', url: "/my/ajax/action.php",  data: {'action': 'FindPersons', 'new_cntname':this.value},  response: 'text',
						success: function(data){
							$('.search_result').attr("data-last-value", $('.cnt_inp').val());
							$(".search_result").html(data).fadeIn(); 
						}
					});
				} else if(this.value.length < 3) {
					$(".search_result").html("").fadeOut(); 
				}
			});
				
			$(".search_result").on("click", ".contact_inf", function(){
				$(".cnt_inp").val($(this).attr('data-usr-name'));
				$(".search_result").fadeOut();
			});
			obj.find('.cnt_inp').focus();
			$('#new_cnt_confirm').click(function() {
				obj_form = $(this).parent();
				$(this).html('<img src="/include/wait.gif"/>');
				sendCntRequest(obj_form.find('.cnt_inp').val(), obj_form.find('#new_cntmsg').val(), obj_form);
			});
			$('#new_cntresponse .menu_button').click(function() {
				obj_form = $(this).parent();
				obj_form.find('#new_cnttext').html('');
				obj_form.slideUp(100);
				
				$('#new_cnt_confirm').html('Отправить');
				obj_form.parent().find('.new_cnt').slideDown(100);
				obj_form.parent().find('.new_cnt .cnt_inp').focus();
			});
			$('.new_cnt').on('keyup','.cnt_inp',function(e) {
				$(this).removeClass('not_find');
				$(this).next('div').text('');
				if(e.keyCode == 13) {
					e.stopPropagation();
					$('#new_cnt_confirm').click();
					return;
				} else if(e.keyCode == 27 && $(".search_result .contact_inf").length > 0) {
					e.stopPropagation();
					$(".search_result").html("").fadeOut(); 
				}
				var inp_str = $(this).val();
				if(inp_str == '') {
					return;
				}	
				var s_str = inp_str.toLowerCase();
				s_str = encodeString(s_str);
				var cnt_obj = $('#m_cnt_list').find('[data-usr-index='+s_str+']');
				if(!(cnt_obj.length == 0)) {
					$(this).addClass('not_find');
					$(this).next('div').text('Контакт уже существует в Вашем списке.');
				}
			});
			
		}
		obj.find('.new_cnt').slideToggle(200);
	});
	$('.my_body').on('click','#add_channel', function(e) {
		var obj = $('#contacts_menu');//$(this).parent();
		e.stopPropagation();
		$('.modal_back').remove();
		$('#active_menu').remove();
		$('.leftmenu_icon').find('.trans_svg').toggleClass('transform_icon');
		if(obj.find('.new_cnt').length == 0) {
			obj.find('.new_cnt').remove();
			
			var str = '<div class="new_cnt" >' +
				'<div style="margin-top: 5px;">' +
					'<input class="cnt_inp" type="text" placeholder="Введите имя нового канала" name="new_channel" value=""/>' +
					'<div class="reg_error" style="margin-top: 10px;"></div>' + 
				'</div>' +
				'<div id="new_channel_confirm" class="menu_button">Создать канал</div>'+
				'</div>';
			obj.append(str);
			obj.find('.cnt_inp').focus();
			$('#new_channel_confirm').click(function() {
				obj_form = $(this).parent();
				var groupname = obj_form.find('.cnt_inp').val();

				var s_str = groupname.toLowerCase();
				s_str = encodeString(s_str);
				var group_obj = $('#m_cnt_list').find('[data-group='+s_str+']');
				if(group_obj.length == 0) {
					var strCh = '<div class="group_block">' +
						'<h3 class="tl_droppable" data-group="' + groupname.toLowerCase() + '" data-group-name="' + groupname + '">' + groupname + '</h3>' + 
						'<div id="cnt_short" class="contact_short">' + 
						empty_group +'</div></div>';
					$('#m_cnt_list').prepend(strCh);
					droppableCreate($("#m_cnt_list .tl_droppable"));
					obj_form.find('.cnt_inp').val("");
				}	
			});

			$('.new_cnt').on('keyup','.cnt_inp',function(e) {
				$(this).removeClass('not_find');
				$(this).next('div').text('');
				if(e.keyCode == 13) {
					$('#new_channel_confirm').click();
					return;
				}	
				var inp_str = $(this).val();
				if(inp_str == '') {
					return;
				}	
				var s_str = inp_str.toLowerCase();
				s_str = encodeString(s_str);
				var group_obj = $('#m_cnt_list').find('[data-group='+s_str+']');
				if(!(group_obj.length == 0)) {
					$(this).addClass('not_find');
					$(this).next('div').text('Имя канала не уникально');
				}
			});
		}
		obj.find('.new_cnt').slideToggle(200);
	});
	$('.my_body').on('click','#manage_cnt', function(e) {
		e.stopPropagation();
		$('.modal_back').remove();
		$('#active_menu').remove();
		
		var xhr = new XMLHttpRequest();
		var body =	'';

		xhr.open("POST", '/my/ajax/cnt_mngr.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			
			$('#main_content #cnt-manager').remove();
			$('#main_content').append('<div id="cnt-manager" class="modal_window"></div>');

			var strwindow = '<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>';
			var str_html = strwindow + xhr.responseText;
			$('#cnt-manager').append(str_html);
			showModalWindow($('#cnt-manager'));
			//RB
			resetMouseEventListener();
			addCntManagerEvents();
			//RB


		}	
		xhr.send(body);
	});
	
	$('#contacts .search_inp').on('keyup',function(e) {
		var inp_str = $(this).val();
		if(inp_str == '') {
			clearContactsSearch();
			return;
		}	
		/*$(this).prev('div').css('background-color', '#26A69A');
		$(this).prev('div').css('border-color', '#26A69A');
		$(this).prev('div').find('svg').css('fill', '#FFF');*/
		$('#my_contacts .cnt_mail').css('display', 'block');

		var s_str = inp_str.toLowerCase();
		s_str = encodeString(s_str);
		$(this).removeClass('not_find');
				
		var cnt_obj_1 = $('#m_cnt_list').find('[data-usr-index*='+s_str+']');
		var cnt_count = cnt_obj_1.length;
		if(cnt_count == 0) {
			$(this).addClass('not_find');
		}
		
		$('#my_contacts .contact_inf, #my_contacts .active_contact_inf, #my_contacts .sel_contact_inf').css('display','none');
		$('#my_contacts .group_block h3').css('display','none');
		$('#my_contacts #last_cnt').css('display','none');

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
	
	if($('.active_contact_inf').length != 0) {
		var h3_obj = $('.active_contact_inf').parent().prev('h3');
		if(h3_obj.hasClass('close_list')) {
	        $(h3_obj).next("div").slideToggle(100)
			$(h3_obj).toggleClass('close_list');
		}
		setCurrentContact($('.active_contact_inf').eq(0).clone());
		//topMenu_action($(".topmenu li.active").attr('id'));
	}
	if($('#login_user').attr('data-nps') == 'y') {
		var strHeader = 'Добро пожаловать в TELEPORT.<br><br>Вы не знаете свой пароль?<br>Тогда укажите свой новый пароль для входа в систему.'
		ChangeUserPassword(strHeader);
	}

	smuser = getMainUser();
	messagesRequest();
	setInterval(messagesRequest, 5000);
	
	showGreeting();
	if ($('#m_cnt_list .contact_inf').length < 5) {
		setTimeout(function() {showTelebotInfo('Нажмите на значок "+" над списком контактов, чтобы пригласить в TELEPORT, своих партнеров и друзей для работы и общения.','',15000)}, 30000);
	}	
});

function parseURL(url_string) {
    var data = {};
    if(url_string) {
        var pair = (url_string.substr(1)).split('&');
        for(var i = 0; i < pair.length; i ++) {
            var param = pair[i].split('=');
            data[param[0]] = param[1];
        }
    }
    return data;
}

function createGuid()  
{  
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);  
      return v.toString(16);  
   });  
}  

function topMenu_action(id){
	/*if(id == 'm_messages') {
		$("#content").animate({width: "60%"}, 100);
	}
	else {
		$("#content").animate({width: "98%"}, 100);
	}
	*/
	$('.cnt_check').hide(1);
	var dataURL = parseURL(window.location.search);
	
	var url = '/my/sections/' + id + '.php';
	var hurl = '/my/index.php?mode='+id.replace('m_','');
	var contact	= getActiveContact();
	if(!(contact.id == undefined)) 
		{
			url = url + '?cnt=' + encodeURIComponent(contact.name);
			hurl = hurl + '&cnt=' + encodeURIComponent(contact.name);
		}
	if(id == 'm_catalog' && dataURL['vwmode'] !== undefined) {
		hurl = hurl + '&vwmode=' + dataURL['vwmode'];
	}	
	/*else if	(!(id == 'm_orders'))
		{
			url = '/my/sections/wpaper.php';
		}
	*/	
	if((window.location.protocol + '//' + window.location.host+hurl) != window.location.href) {	

		$("#work_zone").load(url);
		window.history.pushState(null, null, hurl);
	}	
}

function showTelebotInfo(msg, emojion, timeout) {
	if(!$('#telebot_info').length == 0) {
		hideTelebotInfo();
	}
	str = '<div id="telebot_info">\
				<img id="telebot_image" style="height: 150px; width: 108px;" src="/my/data/telebot_'+emojion+'.png"/>\
				<div id="telebot_msg"><div><div class="clw_bot"><img src="/include/close_window.svg"/></div></div>'+msg+'</div>\
			</div>';
	$('#content').append(str);
	$('#telebot_info').on('click','.clw_bot', function() {
		hideTelebotInfo();
	});
	$('#telebot_info').css('display','block');
	resizeTelebot();
	if(timeout > 0) {
		setTimeout(hideTelebotInfo, timeout);
	}
}
function hideTelebotInfo() {
	$('#telebot_info').remove();
}

function resizeTelebot() {
	if(!$('#telebot_info').length == 0) {
		var tlb_width = 108;
		var tlb_height = 150;
		var top = $('#main_content').height()-170;//($('#main_content').height()-50 - tlb_height)/2;
		//var left = 325;//($('#main_content').width() - tlb_width)/2;

		$('#telebot_info').css('top', top);
		//$('#telebot_info').css('left', left);
		$('#telebot_msg').css('left', tlb_width);

		var tlb_msg_height = $('#telebot_msg').height() + 30;
		$('#telebot_msg').css('top', -tlb_msg_height + 6);
	}
}

/////
function showGreeting() {
	var hasGreeting = undefined;
	if(storu) {
		var hasGreeting = localStorage.getItem('tlpGreeting');
	}
	if(!(hasGreeting == undefined)) {
		return;
	}	
		
	$('#main_content').append('<div class="modal_back back_curt strong"></div>');
	var modal_obj = $('<div id="splash-window" class="modal_window">\
		<div style="text-align: center;"><img style="height: 250px;" src="/my/invite/rover.png" alt="" /></div>\
		<span><p>Рады приветствовать вас и вашу команду в Системе Teleport !</p></span>\
		<p style="text-align: center;">Teleport – позволяет выйти за пределы привычного способа взаимодействия с клиентами и партнерами. Совместная работа в Teleport становится проще, технологичнее и эффективнее.</p>\
		<p style="text-align: center;">За технологией Clients Environment Optimization (CEO) - наше с вами развитие !</p>\
		<p>Teleport  постоянно развивается вместе с вами.  Полностью одинакового бизнеса не бывает. Поэтому мы очень внимательно относимся к пожеланиям и потребностям каждого нашего пользователя.  Рады будем ответить на ваши вопросы, порекомендовать вам наилучшее использование Teleport в вашем бизнесе и создать вместе с вами дополнительный необходимый вам функционал.</p>\
		<p style="text-align: center;">Постоянное сотрудничество и развитие – это залог нашего с вами успеха !</p>\
		<button class="menu_button" id="start-slideshow">Краткий обзор возможностей</button></div>');

	$('#main_content').append(modal_obj);

	showModalWindow($('#splash-window'));

	$('#start-slideshow').on('click', function(e){
		e.stopPropagation();
		var slides = ["/my/invite/slide_1.png","/my/invite/slide_2.png","/my/invite/slide_3.png","/my/invite/slide_4.png"];

		var slide0_descr = ["Приглашайте клиентов и партнеров в Teleport. Ваши партнеры получат на свою почту ваше приглашение, а их регистрация в Системе не займет и двух минут.\
							Для удобства дальнейших коммуникаций полезно разделить все контакты в тематические Каналы.\
							«Профиль контакта» - полные актуальные данные о вас и ваших партнерах. Дополнить и настроить свой «Профиль» вы можете в любое время."];
		var slide1_descr = ["Используйте бизнес-мессенджер для того, чтобы наладить более технологичный обмен информацией и документами с клиентами и партнерами.\
							Кроме обычных сообщений, вы можете прикреплять любые файлы и документы, работающие ссылки на сайты и изображения.\
							Выберите функционал групповой рассылки и доводите до сведения ваших партнеров любую необходимую информацию."];
		var slide2_descr = ["Разместите свой Каталог в Teleport чтобы принимать заказы от ваших клиентов on-line. Каталог товаров и услуг, остатки и цены в реальном времени - для всех ваших клиентов и партнеров.\
							Его можно легко скопировать, объединить с другим каталогом, скорректировать и использовать в своей работе.\
							Каталог всегда доступен во всех популярных форматах (Яндекс.Маркет, Битрикс, Телепорт))."];
		var slide3_descr = ["Заказы, счета, накладные и любые необходимые вашему бизнесу документы для продаж и закупок.\
			Пересылка и корректировка в on-line. Полная интеграция с 1С.\
			Статус заказа виден всем сразу. Мгновенно, просто, удобно. Без ограничений."];

		var slides_descr = [slide0_descr, slide1_descr, slide2_descr, slide3_descr];

		var slide_details = ["Далее", "Понятно", "Ясно", "Приступить к работе"]

		var i = 0;
		$('#splash-window').attr('id','slide-window');
		$('#slide-window').html('<div class="slide_monitor">\
				<div class="slide-wrapper">\
					<div id="slide-0" class="slide"><img src="/my/invite/slide_1.png" alt=""/></div>\
					<div id="slide-1" class="slide"><img src="/my/invite/slide_2.png" alt=""/></div>\
					<div id="slide-2" class="slide"><img src="/my/invite/slide_3.png" alt=""/></div>\
					<div id="slide-3" class="slide"><img src="/my/invite/slide_4.png" alt=""/></div>\
				</div></div>\
				<div class="slider-nav">\
					<p>' + slides_descr[i][0] + '</p>\
					<button class="nav-prev"></button>\
					<button class="menu_button" id="slide-details">'+slide_details[0]+'</button>\
				</div>\
			</div>');
		
		$('.nav-prev').css("visibility", "hidden");

		$('.nav-prev').on('click', function(e){
				if (--i > 0)
					$('.nav-next').css("visibility", "visible");
				else
					$('.nav-prev').css("visibility", "hidden");
				
				$('.slide-wrapper').animate({ left: "+=803px" }, 200, "linear");	
				$('.slider-nav p').html(slides_descr[i][0]);
				$('#slide-details').html(slide_details[i]);
		});

		$('#slide-details').on('click', function(e){
			  if (++i < slides.length-1)
				$('.nav-prev').css("visibility", "visible");
			
			if(i >= slides.length) {
				hideModalWindow($('#slide-window'));
				$('.modal_back').remove();
				localStorage.setItem('tlpGreeting','Y');

			}
			else {
				$('.slide-wrapper').animate({ left: "-=803px" }, 200, "linear");	
				$('.slider-nav p').html(slides_descr[i][0]);		
				$('#slide-details').html(slide_details[i]);
			}	
		});

	});
}
