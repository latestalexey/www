var lastOrderDate = new Date();
lastOrderDate.setDate(lastOrderDate.getDate() + 2);

var ordStatus = { 
	'new': 'Новый',
	'sent': 'Отправлен',
	'delivered': 'Доставлен',
	'viewed': 'Просмотрен'
}

var payType = { 'cashless': 'Банковский перевод',
	'cash': 'Наличными',
	'card': 'Оплата банковской картой'
}

var delType = { 'pickup': 'Самовывоз',
	'delivery': 'Доставка по адресу',
	'transport_company': 'Доставка до транспортной компании'
}

var docs_filter = [];

$(document).ready(function()
{
	$("#order_list").css("height", $(".main_pan").height() - $("#orders_header").height());
	$('.up_pan .up_add_menu .menu_content').remove();
	$('.up_pan .up_add_menu').append('<div class="menu_content">\
											<div style="margin: 0px 10px;">\
												<p id="download_doclist">Скачать реестр документов в Excel</p>\
											</div></div>');

	$('#contact_filter, #exp_filter').css('display','inline-block');
	$('#contact_filter, #exp_filter').off();
	$('#contact_filter').text('Показать по всем контактам');
	hideExtPan();
	hideTelebotInfo();
	initOrderList(true);
	
	$('#contact_filter').on('click', function(e) {
		e.stopPropagation();
		if(!$('#contact_filter').hasClass('ext_selected')) {
			initOrderList(true);
		}
	});
	$('#exp_filter').on('click', function(e) {
		e.stopPropagation();
		if($('#exp_filter').hasClass('svg_selected')) {
			hideExtPan();
			$('#exp_filter').removeClass('svg_selected');
			
			initOrderList(false);
		}
		else {
			showExtPan();
			$('#exp_filter').addClass('svg_selected');
			requestExtendedSearch();
		}
	});

	$('#order_list').on('click', '.order_content',function(e) {
		e.stopPropagation();
		var order_block = $(this).parent();
		getOrderInfo(order_block.attr('data-order-id'), order_block);
	});

	$("#order_list").scroll(function() 
	{
		if($('div').is('.wait')) {
		 return;
		 }
		var order_li = document.getElementById("order_list");
		if (order_li.scrollHeight - order_li.scrollTop === order_li.clientHeight) 
		{
			$('#order_li').append('<div class="wait"><img src="/include/wait.gif"/></div>');
			
			showTelebotInfo('Запрашиваю документы','',0);
			getOrderList();
		}
	});

	//menu_col
	$(".menu_col").click(function(){
		$(".menu_col").removeClass('selected_col');
		$(this).addClass('selected_col');
		
		if($(this).attr('data-ltype') == 'recieved') {
			$('#orders_header').find('[data-contractor]').text('Отправитель');
		}
		else {
			$('#orders_header').find('[data-contractor]').text('Получатель');
		}
		
		initOrderList(false);
	
	});
	
	$('.my_body').on('click','#download_doclist', function(e) {
		e.stopPropagation();
		hideModalWindow($('#active_menu'));
		$('.modal_back').remove();	
		uploadDocsList();
		showTelebotInfo("Запустил формирование реестра документов. <br> Скачаю реестр, как только он будет готов ...","", 5000);
		
	});	
	
});

function uploadDocsList() {
	var from_date = new Date();		
	lastOrderDate = new Date();
	lastOrderDate.setDate(lastOrderDate.getDate() + 2);
	from_date.setDate(lastOrderDate.getDate() - 700);
	var arrFilter = {"filter": docs_filter};
	var arrHeader = [];
	arrHeader.push($("#orders_header .order_content_header .menu_col.selected_col").text());
	$("#orders_header .order:last-child .order_line div").each(function(i, val){
		arrHeader.push($(this).text());
	});
	
	var body =	'header=' + encodeURIComponent(JSON.stringify(arrHeader)) +
				'&rtype=json' +
				'&requestXML=' + encodeURIComponent(JSON.stringify(arrFilter)) +
				'&start_date=' + getStringFromDate(from_date) + 
				'&end_date=' + getStringFromDate(lastOrderDate) + 
				'&maxlimit=0';
				
	var href = "/my/ajax/docslist_xls.php?" + body;
	window.open(href, '_blank');
	//window.location.href = href;
}

function compileFilter() {
	docs_filter = [];
	var ltype = $('#orders_header .selected_col').attr('data-ltype');
	var cur_contact	= getActiveContact();

	if(ltype == 'sent') {
		docs_filter.push({"compare": "AND", "name": "sender", "type":"=", "value": smuser.name});
		if(!(cur_contact.id == undefined)) {
			docs_filter.push({"compare": "AND", "name": "receiver" , "type":"=", "value": cur_contact.name});
		}
	}
	else if(ltype == 'recieved') {
		docs_filter.push({"compare": "AND", "name": "receiver" , "type":"=", "value": smuser.name});
		if(!(cur_contact.id == undefined)) {
			docs_filter.push({"compare": "AND", "name": "sender" , "type":"=", "value": cur_contact.name});
		}
	}
	
	var enum_obj = $('#ext_pan_content #doc_filters .doc_filter[data-filter-type=enum]');
	if(enum_obj.length != 0) {
		enum_obj.each(function(i, one_enum) {
			var enum_list = '';
			var filter_obj = $(one_enum).next('div').find('.doc_filter_value .checked');
			filter_obj.each(function(i, checked_obj) {
				var name_obj = $(checked_obj).parent().find('.enum_name');
				enum_list = (enum_list == '')?(''):(enum_list+',');
				enum_list = enum_list + '"'+name_obj.attr('data-filter-value')+'"';
			});
			if(enum_list != '') {
				docs_filter.push({"compare": "AND", "name": $(one_enum).attr('data-filter-name'), "type":"IN", "value": enum_list});
			}	
		});
	}
};
	
function requestExtendedSearch() {

	$('#ext_pan_header_content').html('');
	$('#ext_pan_content').html('');

	$('#ext_pan_header_content').append(
		'<div style="text-align: center; padding: 13px 10px; color: #777; font-weight: 800; border-bottom: 1px solid #CCC;">\
			Отбор документов\
		</div>');
	
	$('#ext_pan_content ').append(
		'<div id="doc_filters">\
			<div class="doc_filter" data-filter-type="enum" data-filter-name="status">\
				По статусу\
			</div>\
			<div class="doc_filter_enum"></div>\
		</div>');
	$.each(ordStatus, function(index, value) {
		$('#ext_pan_content .doc_filter_enum').append('<div class="doc_filter_value">\
					<div class="checkbox"></div><div class="enum_name" data-filter-value='+index+'>'+value+'</div>\
				</div>')
	});	
	$('#ext_pan_content #doc_filters .doc_filter').next('div').toggle(200);
	
	$('#ext_pan .clw').on('click', function(e) {
		e.stopPropagation();
		$('#exp_filter').removeClass('svg_selected');
		hideExtPan();
			
		initOrderList(false);
	});
	$('#ext_pan_content').on("click", "#doc_filters .doc_filter", function(e){ 
		e.stopPropagation();
		$(this).next('div').toggle(200);
	});		
	$('#ext_pan_content').on("click", ".doc_filter_value", function(e){ 
		e.stopPropagation();
		$(this).find('.checkbox').toggleClass('checked');
		
		initOrderList(false);
	});	
};
	
//Maxim

//Orders
function initOrderList(allContacts) {
	if(allContacts) {
		removeCurrentContact();
		$('#contact_filter').addClass('ext_selected');
		$('#cur_contact').html('<div style="padding: 5px 10px;">\
			<div style="font-weight: 600;"> Включен режим просмотра документов по всем контактам.</div>\
			<div style="color: #444;">Для отбора документов по одному контакту выберите его в списке ваших контактов</div>\
			</div>');
	}
	lastOrderDate = new Date();
	lastOrderDate.setDate(lastOrderDate.getDate() + 2);
	$('#order_li').html('');
	showTelebotInfo('Запрашиваю документы','',0);
	getOrderList();
}
function getOrderList() {
	var from_date = new Date();
	from_date.setDate(lastOrderDate.getDate() - 700);

	compileFilter();
	var contact	= getActiveContact();
	var req_object = {"filter": docs_filter};
	var xhr = new XMLHttpRequest();
	var body =	'action=order_getList' +
					'&rtype=json' +
					'&adds=json_html'+
					'&requestXML=' + encodeURIComponent(JSON.stringify(req_object)) +
					'&start_date=' + getStringFromDate(from_date) + 
					'&end_date=' + getStringFromDate(lastOrderDate) + 
					'&maxlimit=150';
		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			showOrders(xhr.responseText);
		}		
		xhr.send(body);
}
function showOrders(responseText) {
	var str = responseText;
	var arResult = jQuery.parseJSON(responseText);
	var str_orders = "";
	for(var key in arResult) {
		var order = arResult[key];
		
		if ($("div").is('[data-order-id='+key+']')) {
			$('[data-order-id='+key+']').replaceWith(order.html);
		}
		else {
			str_orders = str_orders + order.html;
		}	
	}
	hideTelebotInfo();
	if(!(str_orders == '')) {
		$('#order_li').append(str_orders);
	}	
	if(!(key == undefined)) {
		lastOrderDate = getDateFromString(arResult[key]['message_date']);
	}	
	$('.wait').remove();

	$("#orders_header").css('padding-right', $("#work_zone").width() - $("#order_li").width());	
	$("#order_list").css("height", $(".main_pan").height() - $("#orders_header").height());
}
function getOrderInfo(id, obj) {
	//obj.append('<div class="order_info"></div>');

	var xhr = new XMLHttpRequest();
		var body =	'action=order_getById' +
					'&rtype=json' +
					'&adds=json' +
					'&message_ID=' + id;

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			$('#main_content').append('<div id="order_view" class="modal_window"></div>');
			
			var arOrder = jQuery.parseJSON(xhr.responseText);
			var ordDate = getDateFromString(arOrder.message_date);

			var sender = getContactInfo(arOrder.sender);
			var recipient = getContactInfo(arOrder.recipient);
			
			var disSender = '';
			var disRecipient = '';
			var disOrder = '';
			if(sender.name == smuser.name) {
				disSender = 'disabled';
			}
			else if(recipient.name == smuser.name) {
				disRecipient = 'disabled';
				disOrder = 'disabled';
			}
			var strwindow = '<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>';
			var strorderinfo = '<div class="order_header">' +
				'<div id="order_num">Заказ № '+arOrder.message_N+' от '+getUserStringFromDate(ordDate)+' (' + getTimeStringFromDate(ordDate) +')</div>' +
				'<div class="order_headline"><div class="ord_hd_x1">Отправитель:</div><div class="ord_hd_x2"><input class="cnt_inp" type="text" name="sender" value="'+sender.fullname+'" data-sender="'+arOrder.sender+'" ' + disSender + ' ' + disOrder +' /></div></div>'+
				'<div class="order_headline"><div class="ord_hd_x1">Получатель:</div><div class="ord_hd_x2"><input class="cnt_inp" type="text" name="recipient" value="'+recipient.fullname+'" data-recipient="'+arOrder.recipient+'" ' + disRecipient + ' ' + disOrder +' /></div></div>'+
				'<div class="order_headline"><div class="ord_hd_x1">Форма оплаты:</div><div id="payment_type" class="ord_hd_x2"><input type="text" name="payment_type" value="'+payType[arOrder.payment_type]+'" data-payType="'+arOrder.payment_type+'" ' + disOrder +' readonly /></div></div>'+
				'<div class="order_headline"><div class="ord_hd_x1">Доставка:</div><div id="delivery_type" class="ord_hd_x2"><input type="text" name="delivery_type" value="'+delType[arOrder.delivery_type]+'" data-delType="'+arOrder.delivery_type+'" ' + disOrder +' readonly /></div></div>'+
				'<div class="order_headline"><div class="ord_hd_x1">Адрес доставки:</div><div id="delivery_adress" class="ord_hd_x2"><input type="text" name="delivery_adress" value="'+arOrder.delivery_adress+'" ' + disOrder +' /></div></div>'+
				'</div>';
			
			var strhead = '<div class="order_bottom">'+
				'<div class="order_item_list_header"><div class="item"><div class="item_content" style="border-top: 1px solid #CCCCCC;"><div class="item_line">'+
				'<div class="col_1">Артикул</div>'+
				'<div class="col_2">Наименование</div>'+
				'<div class="col_3">Кол-во</div>'+
				'<div class="col_4">Цена</div>'+
				'<div class="col_5">Сумма</div>'+
				'</div></div></div></div>';
			var str = '';	
			arOrder.items.forEach(function(item, key){

				str = str + '<div id="it_'+item.ID+'" class="item" ' + disOrder +' ><div class="item_content"><div class="item_line">'+
					'<div class="col_1"></div><div class="col_2">'+item.name+'<p style="display: block; top: 25px;" class="sub_info"><img src="/include/stdown.png"></p></div>'+
					'<div class="col_3">'+item.quantity+'</div>'+
					'<div class="col_4">'+item.price+'</div>'+
					'<div class="col_5">'+item.sum+'</div>'+
					'</div></div>' +
					'</div>';

			});
			var str_comment = '<div class="order_headline"><div class="ord_hd_x1">Комментарий:</div><div id="comment" class="ord_hd_x2"><input type="text" name="comment" value="'+arOrder.comment+'" ' + disOrder +' /></div></div>';
			var srt_mess = '<div id="mess_send" class="mess_send" style="margin-top: 20px;">' +
								'<form id="msg_form" method="POST" action="#">' +
									'<textarea id="msgBox" placeholder="Здесь вы можете отправить сообщение получателю / отправителю"></textarea>' + 
									'<input id="send_msg" style="margin: 0 0 14px 10px;" type="image" src="/include/send.png"/>' +
								'</form>' +
							'</div>';

			var str_html = strwindow + '<div style="overflow: hidden;">'+
						strorderinfo + strhead +
						'<div class="order_item_list"><div class="order_item_li">' + str + '</div></div>'+
						str_comment + srt_mess +
						'</div></div>';

			$('#order_view').append(str_html);
			$('#order_view').show(300, function() {
				$('#order_view .order_bottom').height($('#order_view').height()-240);
				$('#order_view .order_bottom .order_item_list').height($('#order_view .order_bottom').height()-172);
				$('#order_view .order_item_list_header').css('padding-right', $('#order_view .order_bottom').width() - $('#order_view').find('.order_item_li').width());	
				//$('#order_view #comment, #delivery_adress').width($('#order_view #comment').parent().width()-130);
			});
			
			$(".item_content")		
				.click(function() 
				{
					var item_block = $(this).parent();
					if(item_block.find('.item_info').length == 0) {
						getItemInfo(item_block.attr('id').replace('it_',''), item_block, 'table', $('#order_view').find('[data-recipient]').eq(0).attr('data-recipient'));
						item_block.find('.sub_info img').attr('src','/include/stup.png');
					}
					else {
						if(item_block.find('.item_info').css('display') == 'none') {
							item_block.find('.sub_info img').attr('src','/include/stup.png');
						}
						else {
							item_block.find('.sub_info img').attr('src','/include/stdown.png');
						}
						item_block.find('.item_info').toggle(100);
					}
					
				});
			$('#order_view #msgBox').keydown(function(event){
				if (event.which == 13)
					{
						event.preventDefault();
						$('#order_view #msg_form').submit();
					}
			});
			$('#order_view #msg_form').submit(function(event){
				event.preventDefault();
				var msg_text= $('#order_view #msgBox').val();
				var name = '';
				var orSender = $('#order_view [data-sender]').attr('data-sender');
				var orRecepient  = $('#order_view [data-recipient]').attr('data-recipient');
				if(orSender == smuser.name) {
					name = orRecepient;
				}
				else if(orRecepient == smuser.name) {
					name = orSender;
				}
				$('#order_view #msgBox').val("");
				//SendMessage(name, msg_text)
			});

			
			$('.close_line div').click(function() {
				$('#order_view').hide(400);
				$('#order_view').remove();
			});
			
			$('.cnt_inp:disabled').keypress(function(e) {
				e.preventDefault();
				return false;
			});

			$('#payment_type input, #delivery_type input').focus(function() {
				if($(this).parent().find('.modal_window').length == 0) {
					$(this).parent().append('<div class="modal_window cnt_sel" ><div class="contact_short"></div></div>');
					var obj_list = $(this).parent().find('.contact_short');
					
					if($(this).attr('name') == 'payment_type') {
						for(key in payType){
							obj_list.append('<div class="slist contact_inf" data-name="payment_type" data-obj="payType" data-key="'+key+'">' + payType[key] + '</div>');
						}
					}	
					else {
						for(key in delType){
							obj_list.append('<div class="slist contact_inf" data-name="delivery_type" data-obj="delType" data-key="'+key+'">' + delType[key] + '</div>');
						}
					}
					
					//$(this).parent().find('.modal_window').slideToggle(200);
				}				
			})
			.click(function() {
				if(!($(this).parent().find('.modal_window').length == 0)) {
					$(this).parent().find('.modal_window').slideToggle(200,function(){
						$('.slist').click(function(){
							var obj = $('#' + $(this).attr('data-name') + ' input');
							obj.val(window[$(this).attr('data-obj')][$(this).attr('data-key')]);
							obj.attr('data-' + $(this).attr('data-obj'), $(this).attr('data-key'));
							obj.parent().find('.modal_window').remove();
						});
					});
					
				}
			});

			$('.cnt_inp').blur(function() {
				$(this).parent().find('.modal_window').remove();
				var contact = getContactInfo($(this).attr('data-'+$(this).attr('name')));
				if(contact.id == undefined || contact.fullname != $(this).val()) {
					$(this).val('');
					$(this).attr('data-'+$(this).attr('name'), '');
				}
			});
			
			$('.cnt_inp').keyup(function(e) {
				$(this).parent().find('.modal_window').remove();
				var inp_str = $(this).val();
				if(inp_str == '') {
					return;
				}	

				var s_str = inp_str.toLowerCase();
				s_str = encodeString(s_str);
				$(this).removeClass('not_find');
				
				var cnt_obj_1 = $('#contacts').find('[data-usr-index^='+s_str+']').clone();
				var cnt_obj_2 = $('#contacts').find('[data-usr-index*=_ins_'+s_str+']').clone();
				var cnt_count = cnt_obj_1.length + cnt_obj_2.length;
				if(cnt_count == 0) {
					$(this).addClass('not_find');
				}
				else if(cnt_count < 30) {
					$(this).parent().append('<div class="modal_window cnt_sel" ><div class="contact_short"></div></div>');
					var obj_list = $(this).parent().find('.contact_short');
					for(var i=0; i<cnt_obj_1.length; i++) {
						obj_list.append(cnt_obj_1[i]);
					}
					for(var i=0; i<cnt_obj_2.length; i++) {
						if(obj_list.find('[data-usr-id='+cnt_obj_2[i].getAttribute('data-usr-id')+']').length == 0) {
							obj_list.append(cnt_obj_2[i]);
						}
					}
					
					obj_list.find('.contact_inf').addClass('slist');
					$(this).parent().find('.modal_window').slideDown(200);

					if(cnt_count == 1) {
						e.preventDefault();
						if(cnt_obj_1.length == 0) {
							var contact = getContactInfo(cnt_obj_2.attr('data-usr-name'));}
						else {
							var contact = getContactInfo(cnt_obj_1.attr('data-usr-name'));}
						if(inp_str != contact.fullname) {	
							$(this).val(contact.fullname);
							$(this).attr('data-' + $(this).attr('name'), contact.name);
							$(this).select();
							$(this).prop('selectionStart',inp_str.length-1);
						}	
					}	
				}
			});
			//obj.find('.order_info').css('height', $('#order_list').height()-90);
			//obj.find('.order_item_list').css('height', obj.find('.order_info').height()-100);
			//obj.find('.order_item_list_header').css('padding-right', obj.find('.order_info').width() - obj.find('.order_item_li').width());	
		}		
		xhr.send(body);
	
}



