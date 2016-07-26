var lastOrderDate = new Date();
lastOrderDate.setDate(lastOrderDate.getDate() + 2);

var docStatus = { 
	'new': 'Новый',
	'transmitted': 'Отправлен',
	'agreement': 'На согласовании',
	'confirmed': 'Подтвержден',
	'canceled': 'Отменен',
	'processed': 'Принят в обработку',
	'shipped': 'Готов к отгрузке',
	'closed': 'Выполнен'
}

var docType = { 
	'order': 'Заказ'
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

function getOrderDate(date){
	var year = date.getFullYear();
	var month = (date.getMonth().toString().length>1) ? date.getMonth()+1 : '0'+(date.getMonth()+1);
	var day = (date.getDate().toString().length>1) ? date.getDate() : '0'+date.getDate();
	var hh = (date.getHours().toString().length>1) ? date.getHours() : '0'+date.getHours();
	var mm = (date.getMinutes().toString().length>1) ? date.getMinutes() : '0'+date.getMinutes();
	var ss = (date.getSeconds().toString().length>1) ? date.getSeconds() : '0'+date.getSeconds();
	return {"year":year, "month":month, "day":day, "hh":hh, "mm":mm, "ss":ss};
};

$(document).ready(function()
{
	$("#order_list").css("height", $(".main_pan").height() - $("#orders_header").height());
	$('.up_pan .up_add_menu .menu_content').remove();
	$('.up_pan .up_add_menu').append('<div class="menu_content">\
											<div style="margin: 0px 10px;">\
												<p id="download_doclist">Скачать реестр документов в Excel</p>\
												<p id="add_newdoc">Создать новый документ</p>\
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
		var obj = $(this).closest('.order');
		var id = obj.attr('data-order-id');
		obj.hasClass('new') ? getTmpDocInfo(id) : getDocInfo(id);
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
	
	$('.my_body').on('click','#add_newdoc', function(e) {
		e.stopPropagation();
		var contact = getActiveContact();
		if (contact.id !== undefined) {
			var xhr = new XMLHttpRequest();
			var body =	'action=catalog_getQuantity' +
						'&contact=' + encodeURIComponent(contact.name);
			xhr.open("POST", '/my/ajax/action.php', true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() { 
				if (xhr.readyState != 4) return;
				if(!(xhr.responseText.indexOf('%err%') == -1)) {
					showError(xhr.responseText.replace('%err%',''));
					return;
				}
				var itemsQty = xhr.responseText || 0;
				console.log(itemsQty);
				if (xhr.responseText>0) {
					$.post('/my/ajax/order.php', { action: 'Documents_GetLastId' }, function(docid) {
						addNewDoc(++docid, contact);				
					});
				}
				else {
					showTelebotInfo("Указанный контакт не имеет собственного каталога. Пожалуйста, выберите другой контакт...","", 3000);
				};			
			}		
			xhr.send(body);
		}
		else {
			showTelebotInfo("Выберите контакт - получателя документа ...","", 3000);
		};	
		hideModalWindow($('#active_menu'));
		$('.modal_back').remove();			
	});
	
});

function addNewDoc(docid, contact){
	var curDate = new Date;
	var message = {
		"docHeader":{
			"id":docid,
			"status":"new",
			"sender":smuser.name,
			"receiver":contact.name,
			"type":"order",
			"date":curDate,
			"num":"",
			"hash":"0000",
			"sum":0.00,
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
		"docTable":[]
	};
	$.post('/my/ajax/order.php', { 
			action: 'Documents_addNew',
			message_id: docid, 
			sender: smuser.name, 
			receiver: contact.name, 
			message: JSON.stringify(message),
			type: message.docHeader.type, 
			status: message.docHeader.status, 
			date: curDate,
			num: message.docHeader.num,
			sum: message.docHeader.sum,
			currencyId: message.docHeader.currencyId, 
			hash: message.docHeader.hash
		}, function(data) {
			if (data == 1) {
				var docDate = getOrderDate(curDate);
				$('#order_li').prepend(
					'<div id='+docid+' class="order new" data-order-id='+docid+' data-order-sender='+contact.name+' data-order-receiver="">' +
						'<div class="order_content">' +
							'<div class="order_line">' +
								'<div class="col_0">'+docType[message.docHeader.type]+'</div>' +
								'<div class="col_1">'+message.docHeader.num+'</div>' +
								'<div class="col_2">'+docDate.day+'-'+docDate.month+'-'+docDate.year+'</div>' +
								'<div class="col_3">'+contact.fullname+'</div>' +
								'<div class="col_4">'+message.docHeader.sum.toFixed(2)+'</div>' +
								'<div class="col_5">'+docStatus[message.docHeader.status]+'</div>' +
							'</div>' +
						'</div>' +
						'<p class="sub_info"><img src="/include/stdown.png"></p>' +
					'</div>'
				);	
				getTmpDocInfo(docid);	
			}		
		}
	);
};

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
				'&maxlimit=1000';
				
	var href = "/my/ajax/docslist_xls.php?" + body;
	window.open(href, '_blank');
	//window.location.href = href;
}

function compileFilter() {
	docs_filter = [];
	var ltype = $('#orders_header .selected_col').attr('data-ltype');
	var cur_contact	= getActiveContact();

	if(ltype == 'sent') {
		docs_filter.push({"name": "sender", "operation":"=", "value": smuser.name});
		if(!(cur_contact.id == undefined)) {
			docs_filter.push({"name": "receiver" , "operation":"=", "value": cur_contact.name});
		}
	}
	else if(ltype == 'recieved') {
		docs_filter.push({"name": "receiver" , "operation":"=", "value": smuser.name});
		if(!(cur_contact.id == undefined)) {
			docs_filter.push({"name": "sender" , "operation":"=", "value": cur_contact.name});
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
				docs_filter.push({"name": $(one_enum).attr('data-filter-name'), "operation":"IN", "value": enum_list});
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
	$.each(docStatus, function(index, value) {
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
			<div style="color: #444; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Для отбора документов по одному контакту выберите его в списке ваших контактов</div>\
			</div>');
	}
	lastOrderDate = new Date();
	lastOrderDate.setDate(lastOrderDate.getDate() + 2);
	$('#order_li').html('');
	showTelebotInfo('Запрашиваю документы','',0);
	getOrderList();
	getTmpDocs();
}
function getOrderList() {
	var from_date = new Date();
	from_date.setDate(lastOrderDate.getDate() - 700);

	compileFilter();
	var contact	= getActiveContact();
	var xhr = new XMLHttpRequest();
	var body =	'action=documents_getList' +
					'&adds=json_html'+
					'&filters=' + encodeURIComponent(JSON.stringify(docs_filter)) +
					'&start_date=' + getStringFromDate(from_date) + 
					'&end_date=' + getStringFromDate(lastOrderDate) + 
					'&limit=150';
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

function getTmpDocs(){
	var docDate = getOrderDate(new Date());
	var contact = getActiveContact();
	$.post('/my/ajax/order.php', {"action": "Documents_GetList", "receiver": contact.name}, function(data){
		if (data.length) {
			$.each(data, function(i, val){
				var contact = getContactInfo(val.receiver);
				$('#order_li').prepend(
					'<div id='+val.message_id+' class="order new" data-order-id='+val.message_id+' data-order-sender='+val.sender+' data-order-receiver='+val.receiver+' data-hash = '+val.hash+'>' +
						'<div class="order_content">' +
							'<div class="order_line">' +
								'<div class="col_0">'+docType[val.type]+'</div>' +
								'<div class="col_1">'+val.num+'</div>' +
								'<div class="col_2">'+docDate.day+'-'+docDate.month+'-'+docDate.year+'</div>' +
								'<div class="col_3">'+contact.fullname+'</div>' +
								'<div class="col_4">'+val.sum+'</div>' +
								'<div class="col_5">'+docStatus[val.status]+'</div>' +
							'</div>' +
						'</div>' +
						'<p class="sub_info"><img src="/include/stdown.png"></p>' +
					'</div>'
				);	
			});
		};
	}, 'json');
};

function showOrders(responseText) {
	var str = responseText;
	var arResult = jQuery.parseJSON(responseText);
	var str_orders = "";
	for(var key in arResult) {
		var order = arResult[key];
		
		var ordObject = $('<div>').append($(order.html));
		var order_name = ordObject.find('.col_3').text();
		var cnt = getContactInfo(order_name);
		ordObject.find('.col_3').text(cnt.fullname);
		
		if ($("div").is('[data-order-id='+key+']')) {
			$('[data-order-id='+key+']').replaceWith(ordObject.html());
		}
		else {
			str_orders = str_orders + ordObject.html();
		}	
	}
	hideTelebotInfo();
	if(!(str_orders == '')) {
		$('#order_li').append(str_orders);
	}	
	if(!(key == undefined)) {
		lastOrderDate = getDateFromString(arResult[key]['date']);
	};
	$('.wait').remove();

	$("#orders_header").css('padding-right', $("#work_zone").width() - $("#order_li").width());	
	$("#order_list").css("height", $(".main_pan").height() - $("#orders_header").height());
}


