var msgObj = {
    "errCode": 0,
    "retval": {
		"docHeader":{
			"id":755,
			"status":"canceled",
			"sender":"virab_techno",
			"receiver":"virab_techno",
			"type":"order",
			"date":"2016-06-30T14:02:24.2071860+03:00",
			"num":"00001",
			"hash":"00001234",
			"sum":100,
			"currencyId":"RUR",
			"comment":"TEST",
			"props":[{
						"name":"paymentType",
						"header":"Вид оплаты",
						"type":"enum",
						"enumvalues":["Безналичная оплата","Наличная оплата","Оплата по карте"],
						"required":true,
						"value":"Безналичная оплата"
					},
					{
						"name":"delivery",
						"header":"Вид доставки",
						"type":"enum",
						"enumvalues":["Самовывоз","Доставка до дома"],
						"required":true,
						"value":"Самовывоз"
					},
					{
						"name":"string",
						"header":"Строка",
						"type":"string",
						"value":"аааааааааааааа"
					},
					{
						"name":"float",
						"header":"Число",
						"type":"float",
						"value":"125365"
					},
					{
						"name":"boolean",
						"header":"Логическое",
						"type":"boolean",
						"value":"кккк"
					},
					{
						"name":"string",
						"header":"Строка",
						"type":"string",
						"value":"ббббббббббббб"
					},
					{
						"name":"float",
						"header":"Число",
						"type":"float",
						"value":"333.333"
					},
					{
						"name":"boolean",
						"header":"Логическое2",
						"type":"boolean",
						"value":"ммммм"
					}]
		},
		"tabHeader":{
			"article":"Артикул",
			"name":"Товар/Услуга",
			"unit":"Ед. изм.",
			"quantity":"Кол-во",
			"confirmed":"Подтверждено",
			"price":"Цена",
			"sum":"Всего",
			"props":[{
						"name":"paymentType",
						"header":"Вид оплаты",
						"type":"enum",
						"enumvalues":["Безналичная оплата","Наличная оплата","Оплата по карте"],
						"required":true,
						"value":"Безналичная оплата"
					},					
					{
						"name":"delivery",
						"header":"Вид доставки",
						"type":"enum",
						"enumvalues":["Самовывоз","Доставка до дома"],
						"required":true,
						"value":"Самовывоз"
					},
					{
						"name":"string",
						"header":"Строка",
						"type":"string",
						"required":true,
						"value":"Строка"
					},
					{
						"name":"float",
						"header":"Число",
						"type":"float",
						"required":true,
						"value":"Число"
					},
					{
						"name":"boolean",
						"header":"Логическое",
						"type":"boolean",
						"value":"Логическое"
					}]
		},
		"docTable":[{
			"id":"hdhulreg",
			"article":"0000055",
			"name":"Автомобиль",
			"unit":"шт","quantity":3,
			"confirmed":1,
			"price":5210000,
			"sum":15630000,
			"props":[{
						"name":"delivery",
						"value":"Самовывоз"
					},
					{
						"name":"paymentType",
						"value":"Безналичная оплата"
					},
					{
						"name":"string",
						"value":"Безналичная оплата"
					},
					{
						"name":"float",
						"value":"Безналичная оплата"
					},
					{
						"name":"boolean",
						"value":true
					}]
		}]
	}
}

function getDocInfo(id) {/*
	var xhr = new XMLHttpRequest();
	var body =	'action=Documents_GetById' +
				'&message_ID=' + id;
	xhr.open("POST", '/my/ajax/action.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() { 
		if (xhr.readyState != 4) return;
			
		if(!(xhr.responseText.indexOf('%err%') == -1)) {
			showError(xhr.responseText.replace('%err%',''));	
			return;
		}
		var arResult = msgobj//jQuery.parseJSON(xhr.responseText);
		initDocView(arResult);
	};		
	xhr.send(body);	*/
	initDocView(msgObj.retval);
};	

function getTmpDocInfo(id) {
	$.post('/my/ajax/order.php', { action: 'Documents_GetById', message_ID: id }, function(data) {
		initDocView(JSON.parse(data));
	});
};

function setEditPolicy (sender, docstatus) {
	$("#upl_xls").addClass('hidden');
	$('#del_item').addClass('hidden');
	$('.cnt_inp').prop("disabled", true);
	$('.order_item_input_row').addClass('hidden');
	$(".order_item_list_content .col_0 .fa").addClass('hidden');
	$(".order_item_list_content .col_4 .fa").addClass('hidden');
	$(".order_item_list_content .col_5 .fa").addClass('hidden');
	$(".order_item_list_content input").prop("disabled", true);
	$(".order_item_list_content checkbox").prop("disabled", true);	
	$(".order_item_list_content select").prop("disabled",true);
	if (sender == smuser.name) {
		switch(docstatus) {
			case 'new':
				$("#upl_xls").removeClass('hidden');
				$('#del_item').removeClass('hidden');
				$('.cnt_inp').prop("disabled", false);
				$('.order_item_input_row').removeClass('hidden');
				$(".order_item_list_content .col_0 .fa").removeClass('hidden');
				$(".order_item_list_content .col_4 .fa").removeClass('hidden');
				$(".order_item_list_content input").prop("disabled", false);
				$(".order_item_list_content .col_5 input").prop("disabled", true);				
				$(".order_item_list_content select").prop("disabled",false);
				$(".order_item_list_content checkbox").prop("disabled", false);	
				$('#save-local').removeClass('hidden');
				$('#transmit').removeClass('hidden')			
				break;
			case 'transmitted':
				break;
			case 'canceled':
				break;
			case 'processed':
				break;
			case 'agreement':
				$("#upl_xls").removeClass('hidden');
				$('#del_item').removeClass('hidden');
				$('.order_item_input_row').removeClass('hidden');
				$(".order_item_list_content .col_0 .fa").removeClass('hidden');
				$(".order_item_list_content .col_4 .fa").removeClass('hidden')
				$(".order_item_list_content input").prop("disabled", false);
				$(".order_item_list_content .col_5 input").prop("disabled", true);			
				$(".order_item_list_content select").prop("disabled",false);
				$(".order_item_list_content checkbox").prop("disabled", false);	
				$('#cancel').removeClass('hidden');
				(isDocChanged()) ? $('#confirm').removeClass('hidden') : $('#transmit').removeClass('hidden');
				break;
			case 'shipped':
				break;
			case 'closed':
				break;
		}		
	}
	else {
		switch(docstatus) {
			case 'new':
				break;
			case 'transmitted':
				$("#upl_xls").removeClass('hidden');
				$('#del_item').removeClass('hidden');
				$('.order_item_input_row').removeClass('hidden');
				$(".order_item_list_content .col_0 .fa").removeClass('hidden');
				$(".order_item_list_content .col_5 .fa").removeClass('hidden');
				$(".order_item_list_content input").prop("disabled", false);
				$(".order_item_list_content .col_4 input").prop("disabled", true);	
				$(".order_item_list_content select").prop("disabled",false);
				$(".order_item_list_content checkbox").prop("disabled", false);	
				$('#cancel').removeClass('hidden');
				$('#process').removeClass('hidden');
				if (isDocChanged()) { $('#transmit').removeClass('hidden') };
				break;
			case 'canceled':
				break;
			case 'processed':
				$('#process').removeClass('hidden');
				break;
			case 'agreement':
				break;
			case 'shipped':
				$('#complete').removeClass('hidden');
				break;
			case 'closed':
				break;
		}	
	};
};

function getDocHeaderProps(arHeader) {
	$('#order_view #show_msg').removeClass('active');
	$('#order_view #show_addinfo').addClass('active');	
	$('#order_view .pan_bar').removeClass('opened').siblings().hide(0).parent('.sidebar').removeClass('opened');

	$('#order_view .sidebar-header').html('Свойства заказа');
	$('#order_view .sidebar-content').html('<div class="doc-add-props"></div>');

	var html_str = '';	
	$.each(arHeader.props, function(i, val){	
		$('#order_view .sidebar-content .doc-add-props').append(
			'<div id="'+val.name+'" class="sidebar-item-wrap">' +
				'<div class="sidebar-item-header"><i class="fa fa-chevron-down"></i>'+val.header+'</div>' +
				'<div class="sidebar-item-content"></div>' +
			'</div>'
		);
		
		if (val.type === 'enum'){
			$.each(val.enumvalues, function(key, enumval){
				var isChecked = '';
				var faCheck = '';
				if (val.value == enumval) {
					var isChecked = 'checked';
					var faCheck = 'fa-check';
				};
				$('#order_view #'+val.name+' .sidebar-item-content').append(
					'<div class="sidebar-item-box '+isChecked+'" data-type='+val.name+'>' +
						'<div class="fa '+faCheck+'"></div>' +
						'<div class="sidebar-item-name">'+enumval+'</div>' +
					'</div>'
				);
			});	
		}
		else if (val.type === 'boolean'){
			$('#order_view #'+val.name+' .sidebar-item-content').append(
				'<div class="sidebar-item-box" data-type='+val.name+'>' +
					'<div class="fa"></div>' +
					'<div class="sidebar-item-name">'+val.value+'</div>' +
				'</div>'
			);
		}
		else {
			$('#order_view #'+val.name+' .sidebar-item-content').append(
				'<div class="sidebar-item-box" data-type='+val.name+'>' +
					'<div class="sidebar-item-name"><input style="width: 100%; border: 0;"value="'+val.value+'"/></div>' +
				'</div>'
			);
		};
	});	
	
	$('#order_view .sidebar-content .doc-add-props').append(
		'<div class="sidebar-item-wrap comment">' +
			'<div class="sidebar-item-header"><i class="fa fa-chevron-down"></i>Комментарии</div>' +
			'<div class="sidebar-item-content">' +
				'<div class="sidebar-item-box" data-type=comment>' +
					'<div class="sidebar-item-name"><textarea style="width: 100%; border: 0; resize:none;" readonly>'+arHeader.comment+'</textarea></div>' +
				'</div>' +
			'</div>' +
		'</div>'
	);

	var h = $('#order_view .sidebar').height() - 46;
	$('#order_view .sidebar .sidebar-content .doc-add-props').slimScroll({height: h, size: '7px', disableFadeOut: false});
};


function getTabHeader(arHeader) {
	var html_str = 	
			'<div class="col_0">...</div>'+
			'<div class="col_1">'+arHeader.article+'</div>'+
			'<div class="col_2">'+arHeader.name+'</div>'+
			'<div class="col_3">'+arHeader.unit+'</div>'+
			'<div class="col_4">'+arHeader.quantity+'</div>'+
			'<div class="col_5">'+arHeader.confirmed+'</div>'+
			'<div class="col_6">'+arHeader.price+'</div>'+
			'<div class="col_7">'+arHeader.sum+'</div>';

	var col = 8;	
	$.each(arHeader.props, function(i, val){
		html_str = html_str + '<div class="col_'+col+'" add-field-name='+val.name+'>'+val.header+'</div>';
		col++;
	});		
		
	return html_str;	
};

function getSearchStr(arHeader) {
	var col = 8;	
	var html_str = '';
	$.each(arHeader, function(i, val){
		html_str = html_str + '<div class="col_'+col+'" add-field-name='+val.name+'></div>';
		col++;
	});	
	
	var docsearchrow = 				
		'<div  class="item input_row">' +
			'<div class="item_content">' +
				'<div class="item_line">' +
					'<div class="col_0"><i class="fa fa-keyboard-o" aria-hidden="true"></i></div>' +
					'<div class="col_1_2"><input class="input_col" placeholder="Введите артикул или наименование товара"/></div>' +
					'<div class="col_3"></div>'+
					'<div class="col_4"></div>'+
					'<div class="col_5"></div>'+
					'<div class="col_6"></div>'+
					'<div class="col_7"></div>'+html_str
				'</div>' +
			'</div>' +
		'</div>';	

	return docsearchrow;	
};

function getDocTable(docTable, tabHeaderProps){
	var strorderlist = '';
	
	$.each(docTable, function(key, item){	
		var html_str = '';
		var col = 8;	
		$.each(tabHeaderProps, function(i, val){	
			var	search = item.props.length ? JSON.search(item.props, '//*[name="'+val.name+'"]/value') : '';			
			if (val.type === 'enum'){
				html_str = html_str + '<td class="col_'+col+' '+val.name+' required"><select>';
				if (!val.required) { html_str = html_str + '<option></option>'};
				$.each(val.enumvalues, function(key, enumval){
					var isSelected = (enumval==search) ? 'selected' : ''; 
					html_str = html_str + '<option value="'+enumval+'" '+isSelected+'>'+enumval+'</option>';
				});	
				html_str = html_str + '</select></td>';
			}
			else if (val.type === 'boolean'){
				var isChecked = (search=='true') ? 'checked' : '';
				html_str = html_str + '<td class="col_'+col+' '+val.name+'"><input type="checkbox" '+isChecked+'></td>';
			}
			else {
				html_str = html_str + '<td class="col_'+col+' '+val.name+'"><input value='+search+'></td>';
			};
			col++;
		});
		strorderlist = strorderlist + 
			'<tr id="it_'+item.id+'" class="item" data-it-id='+item.id+'>' +
						'<td class="col_0"><i class="fa"></i></td>' +
						'<td class="col_1">'+item.article+'</td>' +
						'<td class="col_2"><span class="caption">'+item.name+'</span><i class="fa fa-chevron-up"></i></td>'+
						'<td class="col_3">'+item.unit+'</td>' +	
						'<td class="col_4 required"><i class="fa fa-minus" aria-hidden="true"></i><input class="quantity" value="'+item.quantity+'"><i class="fa fa-plus" aria-hidden="true"></i></td>' +						
						'<td class="col_5"><i class="fa fa-minus" aria-hidden="true"></i><input class="confirmed" value="'+item.confirmed+'"><i class="fa fa-plus" aria-hidden="true"></i></td>'+
						'<td class="col_6">'+item.price+'</td>'+
						'<td class="col_7">'+item.sum+'</td>'+ html_str +			
			'</tr>';	
	});
	return strorderlist;
};

function initDocView(arDoc) {
	console.log(arDoc);
	var docHeader = arDoc.docHeader;
	var tabHeader = arDoc.tabHeader;
	var docTable = arDoc.docTable;
	var docDate = getOrderDate(new Date(docHeader.date));
	var sender = getContactInfo(docHeader.sender);	
	var receiver = getContactInfo(docHeader.receiver); 
	/*=====================================Формирование HTML=====================================================*/
	$('#order_view').remove();
	$('#main_content').append(
			'<div id="order_view" class="modal_window">' +
				'<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>' +
				'<div class="docview">' +
					'<div class="order_header"></div>' +
					'<div class="order_controls"></div>' +
					'<div class="order_positions">' +
						'<div class="order_item_list_header"></div>' +
						'<div class="order_item_input_row"></div>' +
						'<table class="order_item_list_content"></table>' +
					'</div>' +			
					'<div class="sidebar">' +	
						'<div class="pan_bar"></div>' +	
						'<div class="sidebar-header"></div>' +
						'<div class="sidebar-content"></div>' +
					'</div>' +	
				'</div>' +	
			'</div>'	
	);
	
	var strorderinfo = 
		'<div id="order_num">Заказ № '+docHeader.num+' от '+ docDate.day + '-' + docDate.month + '-' + docDate.year +' (' + docDate.hh + ':' + docDate.mm +':'+ docDate.ss + ')' + '</div>' +
		'<div class="order_status"><div class="ord_hd_x1">Статус:</div><div class="ord_hd_x2">'+docStatus[docHeader.status]+'</div><br><div class="ord_hd_x1">Общая сумма:</div><div class="ord_hd_x2">'+docHeader.sum+'</div></div>' +
		'<div class="order_headline"><div class="ord_hd_x1">Получатель:</div><div class="ord_hd_x2">';
		
	if (sender.id == smuser.id) {
		strorderinfo = strorderinfo + '<input class="cnt_inp" type="text" name="receiver" value="'+receiver.fullname+'" data-owner="'+receiver.name+'"/></div></div>';
	}
	else {
		strorderinfo = strorderinfo + '<input class="cnt_inp" type="text" name="sender" value="'+sender.fullname+'" data-owner="'+receiver.name+'"/></div></div>';
	};
		
	
	var strordercontrols = 
		'<div class="func-buttons">' +	
			'<div id="show_addinfo" class="button fa fa-info-circle tooltip" data-tooltip="Показать дополнительные сведения о заказе"></div>' +
			'<div id="show_msg" class="button fa fa-commenting-o tooltip" data-tooltip="Открыть панель сообщений"></div>' +
			'<div id="upl_xls" class="button fa fa-file-excel-o tooltip"  data-tooltip="Загрузить xls-файл"></div>' +
			'<div id="del_item" class="button disabled fa fa-trash tooltip"  data-tooltip="Удалить выбранные элементы"></div>' +	
		'</div>' +	
		'<div class="confirm-buttons">' +
			'<div id="save-local" class="button fa fa-floppy-o tooltip hidden" data-tooltip="Сохранить"></div>' +
			'<div id="transmit" class="button fa fa-exchange tooltip hidden" data-tooltip="Отправить"></div>' +
			'<div id="confirm" class="button fa fa-thumbs-o-up tooltip hidden" data-tooltip="Подтвердить"></div>' +
			'<div id="cancel" class="button fa fa-times tooltip hidden" data-tooltip="Отменить"></div>' +
			'<div id="ship" class="button fa fa-times tooltip hidden" data-tooltip="Готов к отгрузке"></div>' +
			'<div id="complete" class="button fa fa-times tooltip hidden" data-tooltip="Выполнен"></div>' +
			'<div id="process" class="button fa fa-times tooltip hidden" data-tooltip="Принять в обработку"></div>' +
			//'<div id="close" class="button fa fa-sign-out tooltip" data-tooltip="Закрыть"></div>' +
		'</div>';

	var strorderlisthead = '<div class="item"><div class="item_content" style="border-top: 1px solid #CCCCCC;"><div class="item_line">'+getTabHeader(tabHeader)+'</div></div></div>'
	
	var strordersearchrow = getSearchStr(tabHeader.props);

	var strorderlist = (docTable.length) ? getDocTable(docTable, tabHeader.props) : '';

	$('#order_view .order_header').append(strorderinfo);
	$('#order_view .order_controls').append(strordercontrols);
	$('#order_view .order_positions .order_item_list_header').append(strorderlisthead);	
	$('#order_view .order_positions .order_item_input_row').append(strordersearchrow);	
	$('#order_view .order_positions .order_item_list_content').append(strorderlist);	
	$('#order_view').show(200, function(){
		setEditPolicy (sender.name, docHeader.status);
		getDocHeaderProps(docHeader);
		setOrderItemListContentHeight();	
		$('.tooltip', this).darkTooltip({
			animation:'fadeIn',
			gravity:'north'
		});	
	});
	/*=====================================**********************=====================================================*/
	//Закрытие сайдбара по клику вне его	
	$('#order_view').on('click', '.docview', function(e){
		if ((!$(e.target).closest(".sidebar").length) && (!$(e.target).closest("#show_addinfo").length) && (!$(e.target).closest("#show_msg").length)) {
			$('#order_view .pan_bar').removeClass('opened').siblings().hide(0).parent('.sidebar').removeClass('opened');
		};		
	});	
	
	//Сохранение документа в локальную базу
	$('#order_view').on('click', '#save-local', function(){
		buildTmpDoc(arDoc);
		$.post('/my/ajax/order.php', { 
			action: 'Documents_saveDocToLocalBase',
			message_id: docHeader.id, 
			sender: docHeader.sender, 
			receiver: docHeader.receiver, 
			message: JSON.stringify(arDoc),
			type: docHeader.type, 
			status: docHeader.status, 
			date: docHeader.date,
			num: docHeader.num,
			sum: docHeader.sum,
			currencyId: docHeader.currencyId, 
			hash: docHeader.hash
		}, function(data) {
			console.log(data);
		});
	});			
	
	//Отправка документа на согласование
	$('#order_view').on('click', '#transmit', function(){
		var Doc = {
			"errCode": 0,
			"retval": arDoc
		};
		var xhr = new XMLHttpRequest();
		var body =	'action=Messages_Send' +
					'&message=' + encodeURIComponent(JSON.stringify(Doc)) +
					'&message_type=docs' +
					'&contact=' + encodeURIComponent((sender.id==smuser.id) ? receiver.name : sender.name);					
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
	});
	
	//Закрытие окна заказа 
	$('.close_line div').click(function() {
		$('#order_view').hide(400);
		$('#order_view').remove();
		$('.dark-tooltip').remove();
	});
	
	//Показ сайдбара
	$("#order_view .pan_bar").click(function(){
		$(this).toggleClass('opened').siblings().hide(0).parent('.sidebar').toggleClass('opened');
		$(this).parent('.sidebar.opened').children().delay(100).show(0);	
	});
	
	//Изменение количества позиций в строке заказа кнопками
	$('#order_view').on('click', '.col_4 .fa, .col_5 .fa', function(){
		var qty = $(this).siblings('input').val();
		if ($(this).hasClass('fa-plus')) {
			qty++;
		}
		else if ($(this).hasClass('fa-minus')) {
			qty > 0 ? qty-- : qty;			
		};	
		$(this).siblings('input').val(qty);
		$('#order_view .col_4 input, #order_view .col_5 input').trigger('keyup');	
	});
	//Изменение количества позиций в строке заказа вручную
	$('#order_view').on('keyup', '.col_4 input, .col_4 input', function(){
		var price = $(this).closest('.item').children('.col_6').text();
		var qty = $(this).val();
		$(this).closest('.item').children('.col_7').text(price*qty);
	});	
	
	//Отметить позицию в заказе
	$('#order_view').on('click', '.order_item_list_content .col_0 .fa', function(){
		$(this).toggleClass('fa-check').parents('.item').toggleClass('checked');
		if ($('#order_view .order_item_list_content .item').hasClass('checked')) {
			$('#order_view #del_item').removeClass('disabled');
		} else {
			$('#order_view #del_item').addClass('disabled');
		};
	});	
	
	//Удаление выбранных позиций
	$('#order_view #del_item').click(function(e) {	
		e.stopPropagation();
		$('#order_view .order_item_list_content .item.checked').remove();		
		$(this).addClass('disabled');	
	});
	
	//Просмотр подробой информации о позиции
	$('#order_view').on('click', '.order_item_list_content .col_2', function(){
		var obj = $(this).parents('.item');
		obj.toggleClass('opened');
		$(this).children('.fa').toggleClass('fa-chevron-down fa-chevron-up');
		obj.hasClass('opened') ? getItemInfo(obj, receiver.name) : obj.next('#order-item-info').remove();
	});
	
	//Переключение вкладок в подробной информации
	$('#order_view').on('click', '#order-item-info .item_detail_info_table .simple_button', function(e) {	
		e.stopPropagation();
		$(this).toggleClass('ext_selected').siblings('.simple_button').toggleClass('ext_selected');
		$(this).closest('.item_detail_info_table').children('.info_block').toggleClass('selected');
	});
	
	//Показ доп. свойств заказа в сайдбаре
	$('#order_view #show_addinfo').click(function(e) {
		if (!$(this).hasClass('active')){
			getDocHeaderProps(docHeader);
		};	
		$('#order_view .pan_bar').trigger('click');		
	});
	
	//Выбор из списка доп. свойств заказа в сайдбаре
	$('#order_view').on('click', '.sidebar-item-box', function(){
		$(this).siblings('.sidebar-item-box').removeClass('checked').children('.fa').removeClass('fa-check');
		$(this).toggleClass('checked').children('.fa').toggleClass('fa-check');
	});
	
	//Раскрытие списка доп. свойств заказа в сайдбаре
	$('#order_view').on('click', '.sidebar-item-header', function(){
		$(this).siblings('.sidebar-item-content').slideToggle(100);
		$('.fa',this).toggleClass('fa-chevron-down fa-chevron-up');
	});
	
	//Показ сообщений в сайдбаре
	$('#order_view').on('click', '#show_msg', function(e) {
		if (!$(this).hasClass('active')){
			showSidebarMsg((sender.id==smuser.id) ? receiver.name: sender.name);
		};	
		$('#order_view .pan_bar').trigger('click');		
	});
	
	//Добавление файлов к сообщению в сайдбаре
	$('#order_view').on('click', '#add_file', function() {
		$(this).siblings('#uploadifive-file_upload').children().last().click();
	});
	
	//Выпадающий список контактов
	$('#order_view .cnt_inp').keydown(function(e) {	
		var obj = $(this);
		var cnt_sel = obj.siblings('.modal_window.cnt_sel');
		if(e.which == 38 && cnt_sel.length) {			
			$('.contact_inf:not(:first-child).sel_contact_inf', cnt_sel).removeClass('sel_contact_inf').prev().addClass('sel_contact_inf');
			var position = $('.contact_inf.sel_contact_inf', cnt_sel).position().top;
			//var scrolltop = cnt_sel.scrollTop();
			//cnt_sel.scrollTop(position);
			 $('#order_view .contact_short').slimScroll({ scrollBy: position });
		}
		else if(e.which == 40 && cnt_sel.length) {
			if ( $('.contact_inf', cnt_sel).hasClass('sel_contact_inf')) {
				$('.contact_inf:not(:last-child).sel_contact_inf', cnt_sel).removeClass('sel_contact_inf').next().addClass('sel_contact_inf');
				var position = $('.contact_inf.sel_contact_inf', cnt_sel).position().top;
				//var scrolltop = cnt_sel.scrollTop();
				//cnt_sel.scrollTop(position);
				$('#order_view .contact_short').slimScroll({ scrollBy: position });
			}
			else {
				$('.contact_inf:first-child', cnt_sel).addClass('sel_contact_inf');
				//cnt_sel.scrollTop(0);
				$('#order_view .contact_short').slimScroll({ scrollTo: 0 });
			};	
		}
		else if(e.which == 13 && cnt_sel.length) {		
			selectCntInList($('.contact_inf.sel_contact_inf', cnt_sel));		
		}
		else {
			obj.removeClass('not_find');
			delay(function(){
				if (obj.val().length>0) {showCntList(obj)};
			}, 500 );
		};	
	});
	
	//Выбор контакта в выпадающем списке
	$('#order_view').on('click', '.cnt_sel .contact_inf', function() {
		selectCntInList($(this));
	});
	
	//Закрытие модального окна контактов после потери фокуса
	$('#order_view').on('blur', '.cnt_inp', function() {
		var obj = $(this);
		setTimeout(function(){
			obj.siblings('.modal_window').remove();
			obj.val(obj.attr('value'));
			obj.removeClass('not_find');
		}, 200 );
	});
	
	//Выпадающий список позиций
	$('#order_view .order_positions .input_col').keydown(function(e) {	
		var obj = $(this);
		var item_sel = obj.closest('.input_row').children('.modal_window.item_sel');
		if(e.which == 38 && item_sel.length) {			
			$('.item:not(:first-child).selected', item_sel).removeClass('selected').prev().addClass('selected');
			var position = $('.item.selected', item_sel).position().top;
			var scrolltop = item_sel.scrollTop();
			//item_sel.scrollTop(scrolltop+position);
			$('#order_view .items_short').slimScroll({ scrollBy: scrolltop+position });
		}
		else if(e.which == 40 && item_sel.length) {
			if ( $('.item', item_sel).hasClass('selected')) {
				$('.item:not(:last-child).selected', item_sel).removeClass('selected').next().addClass('selected');
				var position = $('.item.selected', item_sel).position().top;
				var scrolltop = item_sel.scrollTop();
				//item_sel.scrollTop(scrolltop+position);
				$('#order_view .items_short').slimScroll({ scrollBy: scrolltop+position });
			}
			else {
				$('.item:first-child', item_sel).addClass('selected');
				//item_sel.scrollTop(0);
				$('#order_view .items_short').slimScroll({ scrollBy: 0 });
			};	
		}
		else if(e.which == 13 && item_sel.length) {		
			setNewDocPosition($('.item.selected', item_sel), tabHeader.props);	
			setEditPolicy (sender.name, docHeader.status);
			obj.blur();
			obj.focus();
		}
		else {
			obj.removeClass('not_find');
			delay(function(){
				if (obj.val().length>2) {showPosList(obj, receiver.name)};
			}, 500 );
		};
	});
	
	//Выбор позиции в выпадающем списке
	$('#order_view').on('click', '.item_sel .item', function(e) {
		setNewDocPosition($(this), tabHeader.props);
		setEditPolicy (sender.name, docHeader.status);
		$('#order_view .order_positions .input_col').focus();
	});	
	
	//Закрытие модального окна позиций после потери фокуса
	$('#order_view').on('blur', '.input_row .input_col', function() {
		setTimeout(function(){
			$('.item.input_row .input_col').removeClass('not_find');
			$('.item.input_row .input_col').val('');
			$('.modal_window.item_sel').remove();
		},200);	
	});
	
	//Отправка сообщения по нажатию кнопки
	$('#order_view').on('click', '#send_msg', function(event){
		event.preventDefault();
		event.stopPropagation();
		$('#order_view #msg_form').submit();
	});
	//Отправка сообщения по нажатию Enter
	$('#order_view').on('keydown', '#msgBox', function(e) {
		event.stopPropagation();
		if($(this).hasClass('sending')) {
			event.preventDefault();
			return;
		};
		if (event.which == 13){
			event.preventDefault();
			$('#order_view #msg_form').submit();
		};
	});

	//Показ кнопки отправки сообщения
	$('#order_view').on('keyup', '#msgBox', function(e) {
		event.stopPropagation();
		if($('#msgBox').hasClass('sending')) {
			event.preventDefault();
			return;
		}
		var inp_str = $(this).val();
		if($('#send_msg').css('display') == 'none' && $(this).val() != '' && $('#process_msg').css('display') == 'none') {
			$('#send_msg').show(200);
		} 
		else if($(this).val() == '' && $('#msg_fn').length == 0) {
			$('#send_msg').hide();
		}
	});	
	
	//Отправка сообщения
	$('#order_view').on('submit', ' #msg_form', function(event){
		msg_arResult = [];
	
		event.preventDefault();
		if($('#msgBox').hasClass('sending')) {
			return;
		}
		
		var msg_text= $('#msgBox').val();
		if(msg_text == '' && $("#msg_form .uploadifive-queue-item").length == 0)
			{return;}
		else if	(msg_text == '') {
			msg_text = "...";
		}

		$('#msgBox').addClass('sending');
		$('#content').append('<div id="mess_block" class="mess_send_block"></div>');
		
		var msg_type = 'text';
		if($("#msg_form .uploadifive-queue-item").length != 0) {
			msg_type = 'text_attach';
			showMessageBox('<div style="font-weight: 600;">Отправка файлов...</div><div><img src="/include/wait.gif"/></div>','');
		}

		var body =	'action=send_msg' +
			'&message_type=' + msg_type +
			'&contact=' + encodeURIComponent(receiver.name) +
			'&message='+encodeURIComponent(msg_text);
		
		var xhr = new XMLHttpRequest();
		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;

			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				msg_init();
				return;
			}

			try {
				msg_arResult = $.parseJSON(xhr.responseText);
			}	
			catch (err)	{
				showError('Не удалось отправить сообщение. <br>Сбой операции <br> Повторите попытку позже');
				msg_init();
				return;
			}
			if($("#msg_form .uploadifive-queue-item").length != 0) {
				$("#file_upload").uploadifive('appendFormData','message_ID',msg_arResult[0].ID);
				$("#file_upload").uploadifive('appendFormData','contact',contact.name);
				msg_arResult[0].files = [];
				$('#file_upload').uploadifive('upload');
			}
			else {
				msg_reset();
			}
		}		
		xhr.send(body);
	});
};

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

function buildTmpDoc (tmpDoc){
	var hash = '';
	var sum = 0.00;
	$('.order_item_list_content .col_7').each(function(){
		sum = sum + parseFloat($(this).text());
	});	
	tmpDoc.docHeader.hash = hash;
	tmpDoc.docHeader.sum = sum;
	tmpDoc.docHeader.comment = $('.sidebar .comment textarea').text();
	
	if (tmpDoc.docHeader.props.length){
		$.each(tmpDoc.docHeader.props, function(i, val){
			(val.type=='enum') ?
			val.value = $('.sidebar #'+val.name+' .sidebar-item-box.checked .sidebar-item-name').text() :
			(val.type=='boolean') ?
			val.value = $('.sidebar #'+val.name+' .sidebar-item-box').hasClass('checked') :
			val.value = $('.sidebar #'+val.name+' .sidebar-item-box .sidebar-item-name input').val()
		});
	};
	
	var arItems = [];
	$('.order_item_list_content .item').each(function(key, item){			
		if (tmpDoc.tabHeader.props.length) {
			var arItemsProps = [];
			$.each(tmpDoc.tabHeader.props, function(i, val){
				if (val.type == 'enum') {
					var jsonstr = {
						"name":val.name,
						"value":$("."+val.name+" option:selected", item).val()
					};
				} 
				else if (val.type == 'boolean') {
					var jsonstr = {
						"name":val.name,
						"value":$("."+val.name+" input", item).is(':checked')
					};
				} 
				else {
					var jsonstr = {
						"name":val.name,
						"value":$("."+val.name+" input", item).val()
					};
				};				
				arItemsProps.push(jsonstr);				
			});	
		};
		
		var jsonstr = {
			"id":$(this).attr('data-it-id'),
			"article":$('.col_1',this).text(),
			"name":$('.col_2',this).text(),
			"unit":$('.col_3',this).text(),
			"quantity":$('.col_4 input',this).val(),
			"confirmed":$('.col_5 input',this).val(),
			"price":$('.col_6',this).text(),
			"sum":$('.col_7',this).text(),
			"props":arItemsProps
		};
		arItems.push(jsonstr);

	});
	tmpDoc.docTable = arItems;
};


function selectCntInList(obj){
	if (obj.attr('data-usr-id') !== undefined) {
		var contact = obj.attr('data-usr-name');
		var contact_full = obj.attr('data-usr-fullname');
		$('.cnt_inp').attr('data-'+$('.cnt_inp').attr('name'),contact);
		$('.cnt_inp').attr('value',contact_full);
		$('.cnt_inp').val(contact_full);
		obj.closest('.modal_window').remove();	
	};
};

function setNewDocPosition(obj, arHeader){
	var col = 8;	
	var html_str = '';
	$.each(arHeader, function(i, val){
		html_str = html_str + '<div class="col_'+col+' '+val.name+'"></div>';
		col++;
	});	
	var name = $('.col_2', obj).text();
	var qty = 5;
	var price = 200;
	var sum = 1000;
	$('#order_view .order_item_list_content').prepend(
		'<tr id="it_'+obj.attr('data-it-id')+'" class="item" data-it-id='+obj.attr('data-it-id')+'>' +
			'<td class="col_0"><i class="fa"></i></td>' +
			'<td class="col_1"></td>' +
			'<td class="col_2"><span class="caption">'+name+'</span><i class="fa fa-chevron-up"></i></td>'+
			'<td class="col_3">шт</td>'+
			'<td class="col_4 required"><i class="fa fa-minus" aria-hidden="true"></i><input class="quantity" value="'+qty+'"><i class="fa fa-plus" aria-hidden="true"></i></td>'+
			'<td class="col_5"><i class="fa fa-minus" aria-hidden="true"></i><input class="confirmed" value="'+qty+'"><i class="fa fa-plus" aria-hidden="true"></i></td>'+
			'<td class="col_6">'+price+'</td>'+
			'<td class="col_7">'+sum+'</td>'+	html_str +						
		'</tr>'
	);
};

function setOrderItemListContentHeight(){
	var h1 = $('#order_view .docview').height();
	var h2 = $('#order_view .order_header')[0].clientHeight;
	var h3 = $('#order_view .order_controls')[0].clientHeight;
	var h4 = $('#order_view .order_positions .order_item_list_header')[0].clientHeight;
	var h5 = $('#order_view .order_positions .input_row')[0].clientHeight;
	var h = h1-h2-h3-h4-h5-20;
	$('#order_view .order_positions .order_item_list_content').slimScroll({height: h, size: '7px', disableFadeOut: false});
	
	$('.order_item_list_content tr:first-child td').each(function(i){
		var contentWidth = $(this).width();
		var headerWidth = $('.order_item_list_header .col_'+i).width();
		
		if (contentWidth >= headerWidth) {
			$('.order_item_list_header .col_'+i).css('min-width', contentWidth);
			$('.order_item_input_row .col_'+i).css('min-width', contentWidth);
		}
		else {
			$(this).css('min-width', headerWidth);
			$('.order_item_input_row .col_'+i).css('min-width', headerWidth);
		};	
	});
	$('.order_item_list_header').css('width', '100%');
};

function showPosList(obj, contact){
	console.log(contact);
	var inp_str = obj.val();
	it_filter = [];
	it_filter = [{"mode": "item", "name":"name", "operation":"LIKE", "value": '%'+inp_str+'%'}];

	if(!(contact == undefined)){
		var arr_fld = ['id', 'article','name','person_price','stock'];
		//var req_object = {"filter": it_filter, "fields": arr_fld};

		var xhr = new XMLHttpRequest();
		var body =	'action=catalog_get' +
					'&contact=' + encodeURIComponent(contact) +
					'&filters=' + encodeURIComponent(JSON.stringify(it_filter)) +
					'&fields=' + encodeURIComponent(JSON.stringify(arr_fld)) +
					'&limit=30' + 
					'&nom=1';

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() { 
			if (xhr.readyState != 4) return;
						
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			};
			var html_str = xhr.responseText;
			if (html_str.length) {	
				($('.modal_window.item_sel').length) 
				?
				$('.modal_window.item_sel .items_short').html(html_str)
				:
				obj.closest('.item.input_row').append('<div class="modal_window item_sel" ><div class="items_short">'+html_str+'</div></div>');
				$('.modal_window.item_sel').slideDown(100);
				setTimeout(function(){
					var h = $('.modal_window.item_sel').height();
					$('.modal_window.item_sel .items_short').slimScroll({height: h, size: '7px', disableFadeOut: false});
				},150);
			}
			else {
				obj.addClass('not_find');
			};
		}		
		xhr.send(body);
	};				
};		


function showCntList(obj){
	var inp_str = encodeString(obj.val().toLowerCase());		
	var cnt_obj = $('#contacts #m_cnt_list').find('[data-usr-index*='+inp_str+']').clone();
	if(cnt_obj.length == 0) {
		obj.addClass('not_find');
	}
	else if(cnt_obj.length < 30) {
		var html_str = '';
		for(var i=0; i<cnt_obj.length; i++) {
			html_str = html_str + cnt_obj[i].outerHTML;
		};
		($('.modal_window.cnt_sel').length) 
		?
		$('.modal_window.cnt_sel .contact_short').html(html_str)
		:
		obj.parent().append('<div class="modal_window cnt_sel" ><div class="contact_short">'+html_str+'</div></div>');

		$('.modal_window.cnt_sel').slideDown(100);
		setTimeout(function(){
			var h = $('.modal_window.cnt_sel').height();
			$('.modal_window.cnt_sel .contact_short').slimScroll({height: h, size: '7px', disableFadeOut: false});
		},150);
	};
};	

function getItemInfo(obj, contact) {
	var item_id = obj.attr('data-it-id');
	if(!(contact == undefined)){
		var arr_filter_elem = {"mode": "item", "compare": "", "name":"id", "type":"=", "value": item_id};
		var arr_filter = [arr_filter_elem];
		var req_object = {"filter": arr_filter};
		var xhr = new XMLHttpRequest();
		var body =	'action=catalog_getItem' +
					'&rtype=json' +
					'&listType=block' +
					'&contact=' + contact +
					'&requestXML=' + encodeURIComponent(JSON.stringify(req_object)) +
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
			var CountTd = $('.order_item_list_content td').length
			xhr.responseText.length ? obj.after('<tr id="order-item-info"><td colspan="'+CountTd+'"><div  class="detailed-info-block">'+xhr.responseText+'</div></td></tr>') : obj.after('<tr id="order-item-info" style="text-align:center;"><td colspan="'+CountTd+'"><div class="detailed-info-block">Информация отсутствует<div></td></tr>');
		}		
		xhr.send(body);
	};

};

function showSidebarMsg(contact){	
	console.log(contact);
	$('#order_view #show_addinfo').removeClass('active');
	$('#order_view #show_msg').addClass('active');	
	$('#order_view .pan_bar').removeClass('opened').siblings().hide(0).parent('.sidebar').removeClass('opened');

	$('#order_view .sidebar-header').html('Сообщения');
	$('#order_view .sidebar-content').html('');

	var html_str = 
	'<div id="mess_send" class="mess_send" style="display: block;">' +
		'<form id="msg_form" name="msg_form">' +
			'<div id="input_block">' +
				'<table style="border-spacing: 0px; width: 100%;" cellspacing="0" cellpadding="0">' +
					'<tbody>' +
						'<tr>' +
							'<td style="width: 42px;">' +
								'<div id="uploadfile" class="tooltip" data-tooltip="Прикрепить файл">' +
									'<div id="add_file">' +
										'<svg fill="#777" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">' +
											'<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>' +
											'<path d="M0 0h24v24H0z" fill="none"></path>' +
										'</svg>' +
									'</div>' +
									'<input type="file" name="file_upload" id="file_upload">' +
								'</div>' +
							'</td>' +
							'<td>' +
								'<textarea id="msgBox" class="message_box" placeholder="Введите сообщение"></textarea>' +
							'</td>' +
							'<td style="width: 45px;">' +
								'<div id="send_msg">' +
									'<svg fill="#777" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">' +
										'<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>' +
										'<path d="M0 0h24v24H0z" fill="none"></path>' +
									'</svg>' +
								'</div>' +
								'<div id="process_msg" style="display: none;">' +
									'<img src="/include/wait.gif">' +
								'</div>' +		
							'</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>' +
			'</div>' +
			'<div id="usr-filename"></div>' +
		'</form>' +	
	'</div>';
	
	$('#order_view .sidebar-content').append(html_str);

	var start_date = new Date();
	var formated_date = getStringFromDate(start_date);
	var xhr = new XMLHttpRequest();
	var body =	'action=msg_get' +
				'&rtype=json' +
				'&receiver=' + encodeURIComponent(contact) +
				'&type=all' +
				'&start_date=' + formated_date +
				'&limit=30';
	xhr.open("POST", '/my/ajax/action.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function()	{ 
		if (xhr.readyState != 4) return;

		if(!(xhr.responseText.indexOf('%err%') == -1)) {
			showError(xhr.responseText.replace('%err%',''));
			return;
		}
		try {
			var arResult = jQuery.parseJSON(xhr.responseText);
		}
		catch (e) {
			$('#order_view .sidebar-content').html('<div style="text-align: center;">Ошибка соединения c сервером...</div>');
			return;
		}
		showMessages(contact, arResult.result.reverse(), 'begin');
		calcMsgBoxHeight();
	}		
	xhr.send(body);	

	
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
		$("#order_view #file_upload").uploadifive({
			'auto' : false,
			'uploadScript' : '/my/ajax/action.php',
			'buttonText' : '',
			'buttonClass' : 'filename_button',
			'dnd' : false,
			'queueID' : 'usr-filename',
			'fileSizeLimit' : '20MB',
			'uploadLimit' : 0,
			'queueSizeLimit' : 10,
			'simUploadLimit' : 0,
			'itemTemplate' : file_html,
			'formData': {'action': 'send_msg'},
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
				$('#usr-filename .msg_file .filename:contains('+encodeString(file_name)+')').each(function(key, value) {
					$(value).parent().parent().find('.file_icon').html(att_svg);
					$(value).next('p').html(file_size+file_met+' '+file_type);
				});
				$('#msgBox').focus();
				$('#send_msg').show(200);
			},
			'onUploadComplete' : function(file, data) {
				arFiles = jQuery.parseJSON(data);
				msg_arResult[0].files.push(arFiles);
			},
			'onQueueComplete' : function() {
				msg_reset();
			},
			'onClearQueue' : function() {
				setTimeout(function(){calcMsgBoxHeight()},500);
			},
			'onCancel'     : function() {
				setTimeout(function(){calcMsgBoxHeight()},500);
			},
			'onSelect'     : function() {
				setTimeout(function(){calcMsgBoxHeight();},500);
			}	
		});
	});	
};	


function calcMsgBoxHeight() {
	var h1 = $('#order_view .sidebar').height();
	var h2 = $('#order_view .sidebar .sidebar-header')[0].clientHeight;
	var h3 = $('#order_view .sidebar .mess_send')[0].clientHeight;
	var h = h1 - h2 - h3;
	$('#order_view .sidebar-msg-content').height(h);
	$('#order_view .sidebar-msg-content').slimScroll({height: h, size: '7px', disableFadeOut: false});
};

function showMessages(contact, arMsg, mode){
	if(arMsg.length == 0) {
		return;
	}	
	addMessageToList(arMsg, mode);
	if(mode == 'begin') {
		$('#msg_li').attr('data-start_date', arMsg[0].dt);
	};
}	

function addMessageToList(arResult, mode) {
		if(arResult.length == 0) {
			return;
		}	

		var arStatus = {'new': 'Новый',
			'sent': 'Отправлено',
			'delivered': 'Доставлено',
			'processed': 'Обработано',
			'confirmed': 'Подтверждено',
			'viewed': 'Просмотрено'};

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
		var myheader = (smuser.fullname == smuser.name)?smuser.fullname:smuser.fullname +"  '" + smuser.name + "'";
		
		var rcv_from_obj = getContactInfo((arResult[0].from == smuser.name)?arResult[0].to:arResult[0].from);
		var rcvAvatarURL = $('#cnt_'+ rcv_from_obj.id).find('.cnt_avatar').css('background-image') || $('#login_image').find('.cnt_avatar').css('background-image') || 'url(/include/no_avatar.svg)';
		rcvAvatarURL = rcvAvatarURL.replace(new RegExp('"','g'),"");
		if(rcvAvatarURL == 'none') {
			var rcvAvatar = '<div class="cnt_image cnt_avatar" style="background-image: none">' + avatarSVG + '</div>';
		} else {
			var rcvAvatar = '<div class="cnt_image cnt_avatar" style="background-image: '+rcvAvatarURL+'"></div>';
		}
		var rcvheader = (rcv_from_obj.fullname == rcv_from_obj.name)?rcv_from_obj.fullname:rcv_from_obj.fullname +"  '" + rcv_from_obj.name + "'";
		$('#msg_li').attr('data-cnt-id',rcv_from_obj.id);
		
		var last_msg = $('#msg_li .message_line').last();
		var last_msg_cnt = last_msg.attr('data-ms-inf');
		
		var prev_cnt 	= "";
		var prev_date	= "";
		var html_block	= "";
		
		var first_cnt  = "";
		var first_date  = "";
		var last_date	= "";
		arResult.forEach(function(msg_object, key){
			var files_html = '';
			var html_date = '';
			var html_cnt = '';
			var status_text = '';
			var resend_text = '';
			var txtNode = msg_object.msg_text;

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
			
			html_cnt = 
				'<div id="msg_inf" style="margin-top: -10px;">' + msg_avatar +
					'<div class="message_header"><a>'+msg_header+'</a></div>' + 
					'<div class="message_date">'+getTimeStringFromDate(msg_date)+'</div>'+
				'</div>';

			//files
			$(msg_object.files).each(function() {
				
				files_html = files_html + addFileToList($(this), false);
			});
			if(!files_html=='') {
				files_html = '<div class="att_text">Вложенный(е) файлы:</div><div class="msg_file">' + files_html + '</div>';
			}
			
			//message
			if(msg_object.from == smuser.name) {
				status_text = '<div class="msg_status" title="Статус сообщения">'+ arStatus[msg_object.status] +'</div>';
			}
			
			var msg_ubody = '<div class="message_text">' +
							'<div class="msg_time">'+getTimeStringFromDate(msg_date)+'</div><pre>'+txtNode+'</pre>' + files_html +
							'<div class="msg_addblock">' + status_text + '</div>' +
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
				msg_html = '<div id="msg_'+ msg_object.ID+ '" class="message_line" data-ms-inf="'+msg_object.from+'">' + html_cnt + msg_ubody;
				if($('#' + 'msg_'+ msg_object.ID).find('#msg_inf').length != 0) {
					$('#' + 'msg_'+ msg_object.ID).replaceWith(msg_html);
				}
				else {
					$('#' + 'msg_'+ msg_object.ID).replaceWith(msg_html);
					$('#' + 'msg_'+ msg_object.ID).find('#msg_inf').remove();
				}
			}
			else {
				msg_html = '<div id="msg_'+ msg_object.ID+ '" class="message_line" data-ms-inf="'+msg_object.from+'">';
				if((prev_cnt == '' && prev_date == '') || (prev_date != html_date)) {
					if (mode == 'end' && first_cnt == '' && last_msg_cnt == msg_object.from) {
						msg_html = html_date + msg_html;
					} 
					else {
						msg_html = html_date + msg_html + html_cnt;
					}
					
					first_date = (first_date == "")?str_msgdate:first_date;
					first_cnt = (first_cnt == "")?msg_object.from:first_cnt;
					last_date = str_msgdate;
				}
				else if(prev_cnt != msg_header) {
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
				$("#order_view .sidebar-content").prepend('<div class="sidebar-msg-content">'+html_block+'</div>');
			}
			else if(mode == 'end') {
				$("#order_view .sidebar-content").append('<div class="sidebar-msg-content">'+html_block+'</div>');
				if ($('[data-msg-date='+first_date+']').length != 0) {
					var obj = $('[data-msg-date='+first_date+']')[$('[data-msg-date='+first_date+']').length-1];
					$(obj).remove();
				}
			}
		}	
};

function addFileToList(obj, hide_image) {
	var cloud_svg = '<svg fill="#CCCCCC" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">'+
			'<path d="M0 0h24v24H0z" fill="none"/>'+
			'<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>'+
			'</svg>	';
			
	var file_size = Math.round(obj.attr('fsize')/1024);
	var file_idat = getFileType(obj.attr('fext'));
	var file_type = file_idat.type;
	var att_svg = file_idat.svg;
	var file_url = '/my/ajax/fld.php?a=dload&i='+obj.attr('ID');//$(this).attr('furl');
	var pvfile_url = '/my/ajax/fld.php?a=prv&i='+obj.attr('ID');//$(this).attr('furl');
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
};

function msg_reset() {
	//addMessageToList(msg_arResult, 'end');
	$('#msgBox').val('');
	$('#send_msg').hide();
	msg_init();
	msg_arResult = [];
};

function msg_init() {
	hideModalWindow($('.msgInfo_box'));
	$('#msgBox').removeClass('sending');
	$('#process_msg').css('display','none');
	$('#file_upload').uploadifive('clearQueue');
	$('#content #mess_block').remove();
};

			

			
			
			
			
			
			
			
			
			
		
			
