function getDocInfo(id, sender, receiver) {
	var xhr = new XMLHttpRequest();
	var body =	'action=Documents_GetById' +
				'&message_id=' + id;
	xhr.open("POST", '/my/ajax/action.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() { 
		if (xhr.readyState != 4) return;

		if(!(xhr.responseText.indexOf('%err%') == -1)) {
			showError(xhr.responseText.replace('%err%',''));
			return;
		}
		var arResult = JSON.parse(xhr.responseText);
		initDocView(arResult, sender, receiver);
	};
	xhr.send(body);	
};

function getTmpDocInfo(id, sender, receiver) {
	$.post('/my/ajax/order.php', { action: 'Documents_GetById', message_id: id }, function(data) {
		var arResult = JSON.parse(data);
		initDocView(arResult, sender, receiver);
	});
};

function calcHash(message) {
	var hash = $.ajax({
		type: "POST",
		url: '/my/ajax/order.php',
		data: 'action=MD5_Get&message='+JSON.stringify(message),
		async: false
	}).responseText;
	return hash;
};

function setEditPolicy (sender, message) {
	$("#upl_xls").addClass('hidden');
	$('#del_item').addClass('hidden');
	$('.input_row .col_1_2 input').addClass('hidden');
	$(".order_item_list_content .col_0 .fa").addClass('hidden');
	$(".order_item_list_content .col_4 .fa").addClass('hidden');
	$(".order_item_list_content .col_5 .fa").addClass('hidden');
	$(".order_item_list_content input").prop("disabled", true);
	$(".order_item_list_content checkbox").prop("disabled", true);
	$(".order_item_list_content select").prop("disabled",true);
	if (sender == smuser.name) {
		switch(message.docHeader.status) {
			case 'new':
				$('#upl_xls').removeClass('hidden');
				$('#del_item').removeClass('hidden');
				$('.input_row .col_1_2 input').removeClass('hidden');
				$('.order_item_list_content .col_0 .fa').removeClass('hidden');
				$('.order_item_list_content .col_4 .fa').removeClass('hidden');
				$('.order_item_list_content input').prop("disabled", false);
				$('.order_item_list_content .col_5 input').prop("disabled", true);
				$('.order_item_list_content select').prop("disabled",false);
				$('.order_item_list_content checkbox').prop("disabled", false);	
				$('#save-local').removeClass('hidden');
				$('#transmit').removeClass('hidden')
				break;
			case 'transmitted':
				break;
			case 'canceled':
				break;
			case 'confirmed':
				break;	
			case 'processed':
				break;
			case 'agreement':
				$("#upl_xls").removeClass('hidden');
				$('#del_item').removeClass('hidden');
				$('.input_row .col_1_2 input').removeClass('hidden');
				$(".order_item_list_content .col_0 .fa").removeClass('hidden');
				$(".order_item_list_content .col_4 .fa").removeClass('hidden')
				$(".order_item_list_content input").prop("disabled", false);
				$(".order_item_list_content .col_5 input").prop("disabled", true);
				$(".order_item_list_content select").prop("disabled",false);
				$(".order_item_list_content checkbox").prop("disabled", false);	
				$('#cancel').removeClass('hidden');
				$('#confirm').removeClass('hidden')
				$('#transmit').removeClass('hidden');
				break;
			case 'shipped':
				break;
			case 'closed':
				break;
		}		
	}
	else {
		console.log('else');
		switch(message.docHeader.status) {
			case 'new':
				break;
			case 'transmitted':
				$("#upl_xls").removeClass('hidden');
				$('#del_item').removeClass('hidden');
				$('.input_row .col_1_2 input').removeClass('hidden');
				$(".order_item_list_content .col_0 .fa").removeClass('hidden');
				$(".order_item_list_content .col_5 .fa").removeClass('hidden');
				$(".order_item_list_content input").prop("disabled", false);
				$(".order_item_list_content .col_4 input").prop("disabled", true);
				$(".order_item_list_content select").prop("disabled",false);
				$(".order_item_list_content checkbox").prop("disabled", false);	
				$('#cancel').removeClass('hidden');
				$('#process').removeClass('hidden');
				$('#agree').removeClass('hidden');
				break;
			case 'canceled':
				break;
			case 'confirmed':
				$('#process').removeClass('hidden');
				break;	
			case 'processed':
				$('#ship').removeClass('hidden');
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
				'<div class="sidebar-item-content item_'+i+'"></div>' +
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
				$('#order_view #'+val.name+' .sidebar-item-content.item_'+i).append(
					'<div class="sidebar-item-box '+isChecked+'" data-type='+val.name+'>' +
						'<div class="fa '+faCheck+'"></div>' +
						'<div class="sidebar-item-name">'+enumval+'</div>' +
					'</div>'
				);
			});	
		}
		else if (val.type === 'boolean'){
			if (val.value) {
				var isChecked = 'checked';
				var faCheck = 'fa-check';
			};
			$('#order_view #'+val.name+' .sidebar-item-content.item_'+i).append(
				'<div class="sidebar-item-box '+isChecked+'" data-type='+val.name+'>' +
					'<div class="fa '+faCheck+'"></div>' +
					'<div class="sidebar-item-name">'+val.header+'</div>' +
				'</div>'
			);
		}
		else {
			$('#order_view #'+val.name+' .sidebar-item-content.item_'+i).append(
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
					'<div class="sidebar-item-name"><textarea>'+arHeader.comment+'</textarea></div>' +
				'</div>' +
			'</div>' +
		'</div>'
	);

	var h = $('#order_view .sidebar').height() - 46;
	$('#order_view .sidebar .sidebar-content .doc-add-props').slimScroll({height: h, size: '7px', disableFadeOut: false});
};


function getTabHeader(arHeader) {
	var html_str = ''; 
	var col = 8;
	$.each(arHeader.props, function(i, val){
		html_str = html_str + '<td class="col_'+col+'" add-field-name='+val.name+'>'+val.header+'</td>';
		col++;
	});	
	html_str = 
		'<tr  class="item item_list_header">' +
			'<td class="col_0">...</td>'+
			'<td class="col_1">'+arHeader.article+'</td>'+
			'<td class="col_2">'+arHeader.name+'</td>'+
			'<td class="col_3">'+arHeader.unit+'</td>'+
			'<td class="col_4">'+arHeader.quantity+'</td>'+
			'<td class="col_5">'+arHeader.confirmed+'</td>'+
			'<td class="col_6">'+arHeader.price+'</td>'+
			'<td class="col_7">'+arHeader.sum+'</td>' + html_str +
		'</tr>';
	return html_str;
};

function getSearchStr(arHeader) {
	var docsearchrow = 
		'<tr  class="item input_row">' +
			'<td class="col_0"><i class="fa fa-keyboard-o" aria-hidden="true"></i></td>' +
			'<td colspan="2" class="col_1_2"><input class="input_col" placeholder="Введите артикул или наименование товара"/></td>' +
			'<td colspan="'+(5+arHeader.props.length)+'" class="col_3">' +
				'<span class="totalsum-block">Общая сумма:<span class="total-sum">'+number_format(arHeader.sum, 2, '.', ' ')+'</span><span class="currency"> '+arHeader.currencyId+'</span></span>' +
			'</td>' +
		'</tr>';
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
				'<td class="col_4 required"><i class="fa fa-minus" aria-hidden="true"></i><input class="quantity" value="'+number_format(item.quantity, 0, '', ' ')+'"><i class="fa fa-plus" aria-hidden="true"></i></td>' +
				'<td class="col_5"><i class="fa fa-minus" aria-hidden="true"></i><input class="confirmed" value="'+number_format(item.confirmed, 0, '', ' ')+'"><i class="fa fa-plus" aria-hidden="true"></i></td>'+
				'<td class="col_6">'+number_format(item.price, 2, '.', ' ')+'</td>'+
				'<td class="col_7">'+number_format(item.sum, 2, '.', ' ')+'</td>'+ html_str +
			'</tr>';
	});
	return strorderlist;
};

function initDocView(arDoc, sender, receiver) {
	arDoc.docHeader.hash = calcHash(arDoc.docTable);
	console.log(arDoc);
	var docHeader = arDoc.docHeader;
	var tabHeader = arDoc.tabHeader;
	var docTable = arDoc.docTable;
	var docDate = getOrderDate(new Date(docHeader.date));
	var sender = getContactInfo(sender);
	var receiver = getContactInfo(receiver);
	var contact = (sender.id==smuser.id) ? receiver : sender;	
/*=====================================Формирование HTML=====================================================*/
	$('#order_view').remove();
	$('#main_content').append(
			'<div id="order_view" class="modal_window">' +
				'<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>' +
				'<div class="docview">' +
					'<div class="order_header"></div>' +
					'<div class="order_controls"></div>' +
					'<div class="order_positions">' +
						'<table class="order_item_list_head"></table>' +
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
		'<div class="order_status"><div class="ord_hd_x1">Статус:</div><div class="ord_hd_x2">'+docStatus[docHeader.status]+'</div></div>' +
		'<div class="order_headline"><div class="ord_hd_x1">Получатель:</div><div class="ord_hd_x2"><input class="cnt_inp" type="text" name="receiver" value="'+contact.fullname+'" data-receiver="'+contact.name+'" disabled></div></div>';

	var upl_xls = 	'<form id="upl_xls_form" name="upl_xls_form">' +	
						'<div id="upl_xls" class="button fa fa-file-excel-o tooltip"  data-tooltip="Загрузить позиции из xls-файла"></div>' +
						'<input type="file" name="xls_upl" id="xls_upl" style="display: none;">' +
						'<input type="hidden" name="action" value="upload_xls">' +	
					'</form>';		
	var strordercontrols = 
		'<div class="func-buttons">' +	
			'<div id="show_addinfo" class="button fa fa-info-circle tooltip" data-tooltip="Показать дополнительные сведения о заказе"></div>' +
			'<div id="show_msg" class="button fa fa-commenting-o tooltip" data-tooltip="Открыть панель сообщений"></div>' +
			//'<div id="upl_xls" class="button fa fa-file-excel-o tooltip"  data-tooltip="Загрузить позиции из xls-файла"></div>' +
			upl_xls +
			'<div id="del_item" class="button disabled fa fa-trash tooltip"  data-tooltip="Удалить выбранные элементы"></div>' +
		'</div>' +
		'<div class="confirm-buttons">' +
			'<div id="save-local" class="button fa fa-floppy-o tooltip hidden" data-tooltip="Сохранить заказ, не отправляя получателю"><span class="button-text">Сохранить</span></div>' +
			'<div id="transmit" class="button fa fa-exchange tooltip hidden" data-tooltip="Отправить заказ получателю"><span class="button-text">Отправить</span></div>' +
			'<div id="cancel" class="button fa fa-reply tooltip hidden" data-tooltip="Отменить заказ"><span class="button-text">Отменить</span></div>' +
			'<div id="process" class="button fa fa-share tooltip hidden" data-tooltip="Принять заказ в обработку"><span class="button-text">Принять в обработку</span></div>' +
			'<div id="agree" class="button fa fa-share tooltip hidden" data-tooltip="Отправить заказ на согласование"><span class="button-text">На согласование</span></div>' +
			'<div id="confirm" class="button fa fa-file-text-o tooltip hidden" data-tooltip="Подтвердить заказ"><span class="button-text">Подтвердить</span></div>' +
			'<div id="ship" class="button fa fa-ship tooltip hidden" data-tooltip="Готов к отгрузке"><span class="button-text">Готов к отгрузке</span></div>' +
			'<div id="complete" class="button fa fa-thumbs-o-up tooltip hidden" data-tooltip="Выполнен"><span class="button-text">Выполнен</span></div>' +
			
		'</div>';

	var strorderlisthead = getTabHeader(tabHeader);
	
	var strordersearchrow = getSearchStr(docHeader);

	var strorderlist = (docTable.length) ? getDocTable(docTable, tabHeader.props) : '';

	$('#order_view .order_header').append(strorderinfo);
	$('#order_view .order_controls').append(strordercontrols);
	$('#order_view .order_positions .order_item_list_head').prepend(strorderlisthead);	
	$('#order_view .order_positions .order_item_list_head').append(strordersearchrow);	
	$('#order_view .order_positions .order_item_list_content').append(strorderlist);	
	$('#order_view').show(200, function(){
		setEditPolicy (sender.name, arDoc);
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
		buildTmpDoc(arDoc, receiver);
		$.post('/my/ajax/order.php', { 
			action: 'Documents_saveDocToLocalBase',
			message_id: docHeader.id, 
			sender: sender.name, 
			receiver: receiver.name, 
			message: JSON.stringify(arDoc),
			type: docHeader.type, 
			status: docHeader.status, 
			date: docHeader.date,
			num: docHeader.num,
			sum: docHeader.sum,
			currencyId: docHeader.currencyId, 
			hash: docHeader.hash
		}, function(data) {
			$('#order_li .order[data-order-id='+docHeader.id+'] .col_4').text(number_format(docHeader.sum, 2, '.', ' '));
			hideModalWindow($('#order_view'));
			$('.dark-tooltip').remove();
		});
	});			
	
	//Отправка документа
	$('#order_view').on('click', '#transmit', function(){		
		var old_hash = arDoc.docHeader.hash;
		buildTmpDoc (arDoc, receiver);
		var new_hash = arDoc.docHeader.hash;
		if ((old_hash === new_hash) && (arDoc.docHeader.status!='new')) {
			showTelebotInfo('Документ возможно отправить на согласование только при условии внесения в него изменений ...','amaze',7000);
		} else {
			var delID = (arDoc.docHeader.status === 'new') ? 1 : 0;
			arDoc.docHeader.status = 'transmitted';
			sendDoc(arDoc, (sender.id==smuser.id) ? receiver.name : sender.name, delID);
		};	
	});
	
	//Подтвердить заказ
	$('#order_view').on('click', '#confirm', function(){
		buildTmpDoc (arDoc, receiver);
		arDoc.docHeader.status = 'confirmed';
		sendDoc(arDoc, (sender.id==smuser.id) ? receiver.name : sender.name, 0);	
	});	
	
	//Отменить заказ
	$('#order_view').on('click', '#cancel', function(){
		buildTmpDoc (arDoc, receiver);
		arDoc.docHeader.status = 'canceled';
		sendDoc(arDoc, (sender.id==smuser.id) ? receiver.name : sender.name, 0);
	});	
	
	//Отправить заказ на согласование
	$('#order_view').on('click', '#agree', function(){
		var old_hash = arDoc.docHeader.hash;
		buildTmpDoc (arDoc, receiver);
		var new_hash = arDoc.docHeader.hash;
		if (old_hash === new_hash) {
			showTelebotInfo('Документ возможно отправить на согласование только при условии внесения в него изменений ...','amaze',7000);				
		} else {
			arDoc.docHeader.status = 'agreement';
			sendDoc(arDoc, (sender.id==smuser.id) ? receiver.name : sender.name, 0);
		};
	});	
	
	//Заказ готов к отгрузке
	$('#order_view').on('click', '#ship', function(){
		buildTmpDoc (arDoc, receiver);
		arDoc.docHeader.status = 'shipped';
		sendDoc(arDoc, (sender.id==smuser.id) ? receiver.name : sender.name, 0);
	});	
	
	//Принять заказ в обработку
	$('#order_view').on('click', '#process', function(){
		buildTmpDoc (arDoc, receiver);
		arDoc.docHeader.status = 'processed';
		sendDoc(arDoc, (sender.id==smuser.id) ? receiver.name : sender.name, 0);
	});	
	
	//Заказ выполнен
	$('#order_view').on('click', '#complete', function(){
		buildTmpDoc (arDoc, receiver);
		arDoc.docHeader.status = 'closed';
		sendDoc(arDoc, (sender.id==smuser.id) ? receiver.name : sender.name, 0);
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
		var qty = parseFloat($(this).siblings('input').val().replace(/ /g, ''));
		var price = parseFloat($(this).closest('.item').children('.col_6').text().replace(/ /g, ''));
		if ($(this).hasClass('fa-plus')) {
			qty++;
		}
		else if ($(this).hasClass('fa-minus')) {
			qty > 0 ? qty-- : qty;			
		};	
		$(this).siblings('input').val(number_format(qty, 0, '', ' '));
		$(this).closest('.item').children('.col_7').text(number_format(price*qty, 2, '.', ' '));
		getTotalSum();
		setEditPolicy (sender.name, arDoc);
	});
	//Изменение количества позиций в строке заказа вручную
	$('#order_view').on('keydown keyup', '.col_4 input, .col_5 input', function(e){
		var qty = parseFloat($(this).val().replace(/ /g, ''));
		$(this).val(number_format(qty, 0, '', ' '));
		var arKey = [8, 9, 37, 39, 46];
		if ((e.which >= 48 && e.which <=57) || (e.which >= 96 && e.which <=105) || ($.inArray(e.which, arKey)>=0)) {
			//if (!$(this).val().length || ($(this).val() == 0)) {$(this).val(1)};
			var price = parseFloat($(this).closest('.item').children('.col_6').text().replace(/ /g, ''));
			$(this).closest('.item').children('.col_7').text(number_format(price*(qty || 0), 2, '.', ' '));
			getTotalSum();
			setEditPolicy (sender.name, arDoc);
		} 
		else {
			e.preventDefault();
		}		
	});	
	
	//Изменение количества позиций в строке заказа вручную
	$('#order_view').on('blur', '.col_4 input, .col_5 input', function(e){
		var qty = parseFloat($(this).val().replace(/ /g, ''));
		if (!qty.length || (qty == 0)) {
			$(this).val(1);
			var price = parseFloat($(this).closest('.item').children('.col_6').text().replace(/ /g, ''));
			$(this).closest('.item').children('.col_7').text(number_format(price, 2, '.', ' '));
			getTotalSum();	
			setEditPolicy (sender.name, arDoc);
		};	
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
		getTotalSum();
		setEditPolicy (sender.name, arDoc);
	});
	
	//Просмотр подробой информации о позиции
	$('#order_view').on('click', '.order_item_list_content .col_2', function(){
		var obj = $(this).parents('.item');
		obj.siblings('.item').removeClass('opened').next('#order-item-info').remove();
		obj.siblings('.item').children('.col_2').children('.fa').removeClass('fa-chevron-down').addClass('fa-chevron-up');
		$(this).children('.fa').toggleClass('fa-chevron-down fa-chevron-up');
		obj.toggleClass('opened');
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
	/*
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
	*/
	//Выпадающий список позиций
	$('#order_view .order_positions .input_col').keydown(function(e) {	
		var obj = $(this);
		var item_sel = obj.closest('.input_row').children('.modal_window.item_sel');
		if(e.which == 38 && item_sel.length) {			
			$('.item:not(:first-child).selected', item_sel).removeClass('selected').prev().addClass('selected');
			var position = $('.item.selected', item_sel).position().top;
			var scrolltop = item_sel.scrollTop();
			$('#order_view .items_short').slimScroll({ scrollBy: scrolltop+position });
		}
		else if(e.which == 40 && item_sel.length) {
			if ( $('.item', item_sel).hasClass('selected')) {
				$('.item:not(:last-child).selected', item_sel).removeClass('selected').next().addClass('selected');
				var position = $('.item.selected', item_sel).position().top;
				var scrolltop = item_sel.scrollTop();
				$('#order_view .items_short').slimScroll({ scrollBy: scrolltop+position });
			}
			else {
				$('.item:first-child', item_sel).addClass('selected');
				$('#order_view .items_short').slimScroll({ scrollBy: 0 });
			};	
		}
		else if(e.which == 13 && item_sel.length) {		
			var newItem = $('.item.selected', item_sel);
			var	exitem = $('.order_item_list_content .item[data-it-id='+newItem.attr('data-it-id')+']');	
			if ( exitem.length && (parseFloat(newItem.attr('data-price')).toFixed(2) == parseFloat($('.col_6', exitem).text()).toFixed(2)) ) {
				mergeItems(newItem, exitem);
			}
			else {
				setNewDocPosition($('.item.selected', item_sel), tabHeader.props);	
				setEditPolicy (sender.name, arDoc);
			};
			getTotalSum();
			obj.blur().focus();
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
		var	exitem = $('.order_item_list_content .item[data-it-id='+$(this).attr('data-it-id')+']');		
		if ( exitem.length && (parseFloat($(this).attr('data-price').replace(/ /g, '')) == parseFloat($('.col_6', exitem).text()).replace(/ /g, '')) ) {
			mergeItems($(this), exitem);
		}
		else {
			setNewDocPosition($(this), tabHeader.props);
			setEditPolicy (sender.name, arDoc);
		};	
		getTotalSum();
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
	
	//Показ сообщений в сайдбаре
	$('#order_view').on('click', '#show_msg', function(e) {
		if (!$(this).hasClass('active')){
			showSidebarMsg((sender.id==smuser.id) ? receiver.name: sender.name);
		};	
		$('#order_view .pan_bar').trigger('click');		
	});
	
	//Добавление файлов к сообщению в сайдбаре
	$('#order_view').on('click', '#uploadfile', function() {
		$(this).closest('#input_block').siblings('#uploadifive-file_upload').children().last().click();
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

	//Отправка сообщения
	$('#order_view').on('submit', ' #msg_form', function(e){
		e.preventDefault();
		if($('#msgBox').hasClass('sending')) {
			return
		};

		var msg_text= $('#msgBox').val();
		if(msg_text == '' && $("#msg_form .uploadifive-queue-item").length == 0){
			return
		};
		
		$('#msgBox').addClass('sending');
		$('#content').append('<div id="mess_block" class="mess_send_block"></div>');
		
		var msg_type = 'text';
		var files_count = $("#msg_form .uploadifive-queue-item").length;
		if(files_count != 0) {
			msg_type = 'text_attach';
			showMessageBox('<div style="font-weight: 600; z-index: 9999;">Отправка файлов...</div><div><img src="/include/wait.gif"/></div>','');
		}	
		
		var contact = (sender.name==smuser.name) ? receiver.name : sender.name;
		
		if((msg_type == 'text' || files_count>1) && (msg_text != '')) {
			
			var tmp_guid = "tmp_"+createGuid();

			var body = new FormData(document.forms.msg_form);//
			body.append("action", "send_msg");
			body.append("message_type", msg_type);
			body.append("contact", contact);
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
				"to": contact,
				"status": "new",
				"msg_text": htmlspecialchars(msg_text),
				"tmpGUID": "",
				"tmp_msg": "true",
				"files": {}
			}
			var ar_tmp = [tmp_arResult];
			msg_reset(ar_tmp);
		}
		if(files_count>0) {
			$("#file_upload").uploadifive('appendFormData','message_type',msg_type);
			$("#file_upload").uploadifive('appendFormData','contact',contact);
			if(files_count > 1) {
				$("#file_upload").uploadifive('appendFormData','message','');
			} else {
				$("#file_upload").uploadifive('appendFormData','message',msg_text);
			}

			$('#file_upload').uploadifive('upload');
		}
	});
	
	//Просмотр изображений в сайдбаре (сообщения)
	$('#order_view .sidebar').on('click', '#msg_li .image_file .close_line svg', function(e) {	
		e.stopPropagation();
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
	
	//Загрузка позиций каталога из xls-файла
	$('#order_view').on('click', '#upl_xls' ,function() {
		$('#order_view #xls_upl').uploadifive('clearQueue');
		$(this).siblings('#uploadifive-xls_upl').children().last().click();
	});	
	$(function() {	
		$("#order_view #xls_upl").uploadifive({
			'auto' : true,
			'multi' : false,
			'uploadScript' : '/my/ajax/order.php',
			'buttonText' : '',
			'dnd' : false,
			'fileSizeLimit' : '2MB',
			'uploadLimit' : 0,
			'queueSizeLimit' : 1,
			'simUploadLimit' : 1,
			'removeCompleted' : true,
			'formData': {'action': 'upl_pos_from_xls'},
			'onAddQueueItem': function() {	
				$('#upl_xls').removeClass('success danger error');
				var html_text = 'Пожалуйста, подождите.<br> Идет обработка документа.';
				showTelebotInfo(html_text,"", 0);
				$('#main_content').append('<div class="modal_bg"></div>');
				$('.dark-tooltip').hide();
			},
			'onUploadComplete' : function(file, data) {
				console.log(data);
				try {
					var arPos = JSON.parse(data);
				} catch (e) {
					var arPos = [];
					console.log(e);
				};
				console.log(arPos);
				if (arPos.length && (arPos[0].length == 3)) {
					delete arPos[0];
					console.log(arPos);
					var  article_str = '';
					arPos.forEach(function(val, key, arPos){
						article_str = article_str + '"' + val[0] + '",';
					});
					var arr_fld = ['*'];
					it_filter = [{"mode": "item", "name":"article", "operation":"IN", "value": article_str.substr(0, article_str.length-1)}];
					var xhr = new XMLHttpRequest();
					var body =	'action=catalog_get' +
								'&adds=json' +
								'&contact=' + encodeURIComponent(receiver.name) +
								'&filters=' + encodeURIComponent(JSON.stringify(it_filter)) +
								'&fields=' + encodeURIComponent(JSON.stringify(arr_fld)) +
								'&limit=1000' + 
								'&nom=1';

					xhr.open("POST", '/my/ajax/action.php');
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhr.onreadystatechange = function() { 
						if (xhr.readyState != 4) return;
						if(!(xhr.responseText.indexOf('%err%') == -1)) {
							showError(xhr.responseText.replace('%err%',''));
							return;
						};
						var items = JSON.parse(xhr.responseText);
						var articleAr = JSON.search(items.catalog, '//article');
						var arErr = arPos.filter(function(ar) {
							return $.inArray(ar[0], articleAr)<0;
						});
						if (items.catalog.length && (arErr.length != (arPos.length-1))) {
							$.each(items.catalog, function(key, item){
								var curPos = arPos.filter(function(subAr) {return subAr[0] == item.article});
								var	exItem = $('.order_item_list_content .item[data-it-id='+item.id+']');	
								if ( exItem.length && (parseFloat(item.price) == parseFloat($('.col_6', exItem).text().replace(/ /g, ''))) ) {
									var old_qty = $('.quantity', exItem).val() || 0;
									var new_qty = curPos[0][2] || 0;
									var qty = old_qty*1 + new_qty*1;
									var price = parseFloat(item.price).toFixed(2) || 0.00;
									var total = number_format(qty*price, 2, '.', ' ');
									$('.quantity', exItem).val(qty);
									$('.col_7', exItem).text(total);
								} else {
									var col = 8;	
									var html_str = '';
									$.each(tabHeader.props, function(i, column){
										html_str = html_str + '<td class="col_'+col+' '+column.name+'"></td>';
										col++;
									});	
									var name = item.name;
									var price = number_format(item.price, 2, '.', ' ');
									$('#order_view .order_item_list_content').prepend(
										'<tr id="it_'+item.id+'" class="item" data-it-id='+item.id+'>' +
											'<td class="col_0"><i class="fa"></i></td>' +
											'<td class="col_1">'+item.article+'</td>' +
											'<td class="col_2"><span class="caption">'+name+'</span><i class="fa fa-chevron-up"></i></td>'+
											'<td class="col_3">шт</td>'+
											'<td class="col_4 required"><i class="fa fa-minus" aria-hidden="true"></i><input class="quantity" value="'+number_format(curPos[0][2], 0, '', ' ')+'"><i class="fa fa-plus" aria-hidden="true"></i></td>'+
											'<td class="col_5"><i class="fa fa-minus" aria-hidden="true"></i><input class="confirmed" value="0"><i class="fa fa-plus" aria-hidden="true"></i></td>'+
											'<td class="col_6">'+price+'</td>'+
											'<td class="col_7">'+number_format(price*curPos[0][2], 2, '.', ' ')+'</td>'+	html_str +						
										'</tr>'
									);
									setOrderItemListContentHeight();
									setEditPolicy (sender.name, arDoc);
								};	
								getTotalSum();	
							});	
						};
						hideTelebotInfo();
						if (arErr.length && ((arPos.length-1)>arErr.length)) {
							$('#upl_xls').addClass('danger');
							if (!$('#order_view #dialog').length) {
								var html_text = 'Часть позиций, указанных в файле, не была обработана.</br> Выгрузить список необработанных позиций в отдельный файл?';
								var html_str = '<div id="dialog"><div class="text-box">'+html_text+'</div><div class="button-box"><div class="yes button">Да</div><div class="no button">Нет</div></div>';
								$('#order_view').append(html_str);
							};
							$('#order_view #dialog').fadeIn(300);
							$('#order_view').on('click', '#dialog .button', function(e){
								$('#order_view #dialog').fadeOut(300);
								if ($(this).hasClass('yes')) {
									$.post('/my/ajax/order.php', { action: 'Positions_SaveErrors', arError: JSON.stringify(arErr), filename: file.name}, function(fname){
										var html_text = 'Скачать файл с незагруженными позициями можно по <a href="/my/ajax/order.php?action=Positions_DownloadErrors&filename='+fname+'" target=_blank>cсылке</a>';
										showTelebotInfo(html_text,"", 0);
										$('#telebot_msg').on('click', 'a', function(){
											hideTelebotInfo();
											setTimeout("setOrderItemListContentHeight();", 500);
										});
										
									});
								};
								setTimeout(function(){$('#upl_xls').removeClass('danger')}, 5000);
							});
						}
						else if (arErr.length && ((arPos.length-1)==arErr.length)) {
							$('#upl_xls').addClass('error');
							var html_text = 'В выгружаемом файле нет позиций, доступных для загрузки. <br> Пожалуйста, проверьте корректность загружаемых данных';
							showTelebotInfo(html_text,"amaze", 5000);
							setTimeout(function(){$('#upl_xls').removeClass('error')}, 5000);
						}
						else {
							$('#upl_xls').addClass('success');
							setTimeout(function(){$('#upl_xls').removeClass('success');}, 5000);
						};
						$('#main_content .modal_bg').remove();
					}		
					xhr.send(body);	
				} else {
					$('#main_content .modal_bg').remove();
					var html_text = 'Вероятно, выбранный файл имеет неверный формат или структуру данных. <br> Пожалуйста, проверьте корректность загружаемых данных';
					showTelebotInfo(html_text,"amaze", 5000);
				};
			}	
		});
	});	
		
};

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

function sendDoc (message, receiver, delID) {
	docid = message.docHeader.id;
	if (delID) { message.docHeader.id='' };
	var xhr = new XMLHttpRequest();
	var body =	'action=send_msg' +
				'&message=' + encodeURIComponent(JSON.stringify(message)) +
				'&message_type=document' +
				'&contact=' + encodeURIComponent(receiver);					
	xhr.open("POST", '/my/ajax/action.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() 
	{ 
		if (xhr.readyState != 4) return;
		if(!(xhr.responseText.indexOf('%err%') == -1)) {
			showError(xhr.responseText.replace('%err%',''));
			return;
		};	
		var new_Doc = JSON.parse(xhr.responseText);
		if (new_Doc.length) {
			var obj = $('#order_li .order[data-order-id='+docid+']');
			$('.col_4', obj).text(number_format(message.docHeader.sum, 2, '.', ' '));	
			$('.col_5', obj).text(docStatus[message.docHeader.status]);		
			if (delID) {
				obj.attr('id', new_Doc[0].ID).attr('data-order-id', new_Doc[0].ID).removeClass('new');
				$.post('/my/ajax/order.php', {action: 'Documents_delSentDoc', message_id: docid, receiver: receiver});
			};
			hideModalWindow($('#order_view'));
			$('.dark-tooltip').remove();
		};				
	}				
	xhr.send(body);
};

function getTotalSum() {
	var totalSum = 0.00;
	$('.order_item_list_content .col_7').each(function(){
		totalSum = parseFloat(totalSum) + parseFloat($(this).text().replace(/ /g, ''));
	});
	$('.input_row .total-sum').text(number_format(totalSum, 2, '.', ' '));
};

function mergeItems(newItem, exItem){
	var qty = $('.quantity', exItem).val() || 0;
	var price = parseFloat(newItem.attr('data-price')).toFixed(2) || 0.00;
	var total = parseFloat(++qty*price).toFixed(2);
	$('.quantity', exItem).val(qty);
	$('.col_7', exItem).text(total);
};

function buildTmpDoc (tmpDoc, receiver){
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
			"owner":receiver.name,
			"id":$(this).attr('data-it-id'),
			"article":$('.col_1',this).text(),
			"name":$('.col_2',this).text(),
			"unit":$('.col_3',this).text(),
			"quantity":parseFloat($('.col_4 input',this).val().replace(/ /g, '')),
			"confirmed":parseFloat($('.col_5 input',this).val().replace(/ /g, '')),
			"price":parseFloat($('.col_6',this).text().replace(/ /g, '')),
			"sum":parseFloat($('.col_7',this).text().replace(/ /g, '')),
			"props":arItemsProps || []
		};
		arItems.push(jsonstr);
	});
	tmpDoc.docTable = arItems;
	var sum = parseFloat($('.total-sum').text().replace(/ /g, ''));
	tmpDoc.docHeader.sum = sum;
	var hash = calcHash(tmpDoc.docTable);
	tmpDoc.docHeader.hash = hash;
	tmpDoc.docHeader.comment = $('.sidebar .comment textarea').val();
	if (tmpDoc.docHeader.props.length){
		$.each(tmpDoc.docHeader.props, function(i, val){
			(val.type=='enum') ?
			val.value = $('.sidebar #'+val.name+' .item_'+i+' .sidebar-item-box.checked .sidebar-item-name').text() :
			(val.type=='boolean') ?
			val.value = $('.sidebar #'+val.name+' .item_'+i+' .sidebar-item-box').hasClass('checked') :
			val.value = $('.sidebar #'+val.name+' .item_'+i+' .sidebar-item-box .sidebar-item-name input').val()
		});
	};
};

function setNewDocPosition(obj, arHeader){
	var col = 8;	
	var html_str = '';
	$.each(arHeader, function(i, val){
		html_str = html_str + '<td class="col_'+col+' '+val.name+'"></td>';
		col++;
	});	
	var name = $('.col_2', obj).text();
	var price = number_format(obj.attr('data-price'), 2, '.', ' ');
	$('#order_view .order_item_list_content').prepend(
		'<tr id="it_'+obj.attr('data-it-id')+'" class="item" data-it-id='+obj.attr('data-it-id')+'>' +
			'<td class="col_0"><i class="fa"></i></td>' +
			'<td class="col_1"></td>' +
			'<td class="col_2"><span class="caption">'+name+'</span><i class="fa fa-chevron-up"></i></td>'+
			'<td class="col_3">шт</td>'+
			'<td class="col_4 required"><i class="fa fa-minus" aria-hidden="true"></i><input class="quantity" value="1"><i class="fa fa-plus" aria-hidden="true"></i></td>'+
			'<td class="col_5"><i class="fa fa-minus" aria-hidden="true"></i><input class="confirmed" value="0"><i class="fa fa-plus" aria-hidden="true"></i></td>'+
			'<td class="col_6">'+price+'</td>'+
			'<td class="col_7">'+price+'</td>'+	html_str +						
		'</tr>'
	);
	setOrderItemListContentHeight();
};

/*
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
*/

function setOrderItemListContentHeight(){
	var h1 = $('#order_view .docview').height();
	var h2 = $('#order_view .order_header')[0].clientHeight;
	var h3 = $('#order_view .order_controls')[0].clientHeight;
	var h4 = $('#order_view .order_positions .order_item_list_head')[0].clientHeight;
	var h = h1-h2-h3-h4-20;
	h = h>0 ? h : 0;
	$('#order_view .order_positions .order_item_list_content').slimScroll({height: h, size: '7px', disableFadeOut: false});
	$('#order_view .order_positions .slimScrollDiv').height(h);
	$('#order_view .order_positions .order_item_list_content').css('max-height',h);
	
	$('#order_view .order_positions .item_list_header td').each(function(i){
		var headerWidth = $(this).width() || 0;
		var contentWidth = $('#order_view .order_item_list_content .col_'+i).width() || 0;
		var width = Math.max(headerWidth, contentWidth);
		$(this).css({'min-width':width+21, 'max-width':width+21, 'width':width+21});
		$('#order_view .order_item_list_content .col_'+i).css({'min-width':width+21, 'max-width':width+21, 'width':width+21});
	})
};

$(window).resize(function() {
	if ($('#order_view').length) {
		setTimeout("setOrderItemListContentHeight()",200);
	}
});

function showPosList(obj, contact){
	console.log(obj.val());
	if(!(contact == undefined)){
		var arr_fld = ['*'];
		it_filter = [{"mode": "item", "name":"name", "operation":"LIKE", "value": +obj.val()}];
		var xhr = new XMLHttpRequest();
		var body =	'action=catalog_get' +
					'&adds=json' +
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
			var item = JSON.parse(xhr.responseText);	
			if (item.catalog.length) {	
				var html_str = '';	
				$.each(item.catalog, function(key, item){
					html_str = html_str + '<div id="'+item.id+'" class="item" data-it-id='+item.id+' data-article='+item.article+' data-price='+item.price+' data-stock='+item.stock+'><div class="item_content"><div class="item_line"><div class="col_2">'+item.name+'</div></div></div></div>';
					
				});					
				($('.modal_window.item_sel').length) 
				?
				$('.modal_window.item_sel .items_short').html(html_str)
				:
				obj.closest('.order_item_list_head').append('<div class="modal_window item_sel"><div class="items_short">'+html_str+'</div></div>');
				$('.modal_window.item_sel').slideDown(100);
				console.log($('.input_row .col_1_2'));
				$('.modal_window.item_sel').width($('.input_row .col_1_2')[0].clientWidth+$('.input_row .col_0')[0].clientWidth-18);
				setTimeout(function(){
					var item_sel_height = (item.catalog.length*43>300) ? 300 :  item.catalog.length*43;
					$('.modal_window.item_sel').height(item_sel_height);
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

function getItemInfo(obj, contact) {
	var item_id = obj.attr('data-it-id');
	if(!(contact == undefined)){
		var arr_fld = ['*'];
		var arr_props = ['*'];
		var arr_filter = [{"mode": "item", "name":"id", "operation":"=", "value": item_id}];
		var xhr = new XMLHttpRequest();
		var body =	'action=catalog_getItem' +
					'&list_type=block' +
					'&contact=' + encodeURIComponent(contact) +
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
			var CountTd = $('.order_item_list_content td').length
			xhr.responseText.length ? obj.after('<tr id="order-item-info"><td colspan="'+CountTd+'"><div  class="detailed-info-block">'+xhr.responseText+'</div></td></tr>') : obj.after('<tr id="order-item-info" style="text-align:center;"><td colspan="'+CountTd+'"><div class="detailed-info-block">Информация отсутствует<div></td></tr>');
			$('#order_view .order_positions .order_item_list_content').slimScroll({ scrollBy: obj.position().top });
		}		
		xhr.send(body);
	};

};


function showSidebarMsg(contact){	
	$('#order_view #show_addinfo').removeClass('active');
	$('#order_view #show_msg').addClass('active');	
	$('#order_view .pan_bar').removeClass('opened').siblings().hide(0).parent('.sidebar').removeClass('opened');

	$('#order_view .sidebar-header').html('Сообщения');
	$('#order_view .sidebar-content').html('<div id="msg_li"></div>');

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
			'<div id="msgBoxdiv" class="message_box" style="width: 935px;"><pre><pre></pre></pre></div>' +
			'<input type="file" name="file_upload" id="file_upload" value="" style="display: none;">' +
			'<input type="hidden" name="action" value="send_msg">' +
			'<input type="hidden" name="message_type" value="text">' +
			'<div id="usr-filename"></div>' +			
		'</form>' +	
	'</div>';
	
	$('#order_view .sidebar-content').append(html_str);
	$('#order_view .sidebar-content').prepend('<div class="loading" style="width: 100%; height: 100%; text-align: center; margin-top: 100%;"><img src="/include/wait.gif"/></div>');
	var start_date = new Date();
	var formated_date = getStringFromDate(start_date);
	var xhr = new XMLHttpRequest();
	var body =	'action=msg_get' +
				'&adds=json' +
				'&mode=begin' +
				'&receiver=' + encodeURIComponent(contact) +
				'&type=all' +
				'&start_date=' + formated_date +
				'&limit=100';			
	xhr.open("POST", '/my/ajax/action.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function()	{ 
		if (xhr.readyState != 4) return;
		$('#order_view .sidebar-content .loading').remove();
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
		if(arResult.length) {
			addMessageToList(arResult.reverse(), 'begin');
			calcMsgBoxHeight();
		}		
	}		
	xhr.send(body);	

	$(function() {	
		$("#order_view #file_upload").uploadifive({
			'multi' : false,
			'auto' : false,
			'uploadScript' : '/my/ajax/action.php',
			'buttonText' : '',
			'buttonClass' : 'filename_button',
			'dnd' : false,
			'queueID' : 'usr-filename',
			'fileSizeLimit' : '20MB',
			'uploadLimit' : 0,
			'queueSizeLimit' : 1,
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
				setTimeout(function(){calcMsgBoxHeight()},200);
			},
			'onCancel'     : function() {
				setTimeout(function(){calcMsgBoxHeight()},400);
			},
			'onSelect'     : function() {
				setTimeout(function(){calcMsgBoxHeight();},200);
			}	
		});
	});	
};	

function calcMsgBoxHeight() {
	var h1 = $('#order_view .sidebar').height();
	var h2 = $('#order_view .sidebar .sidebar-header')[0].clientHeight;
	var h3 = $('#order_view .sidebar .mess_send')[0].clientHeight;
	var h = h1 - h2 - h3;
	$('#order_view #msg_li').height(h);
	$('#order_view #msg_li').slimScroll({height: h, size: '7px', disableFadeOut: false, start: 'bottom'});
};

function addMessageToList(arResult, mode) {
		if(arResult.length == 0) {
			return;
		}	
		var rcv_from_obj = getContactInfo((arResult[0].from == smuser.name)?arResult[0].to:arResult[0].from);

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
		var myheader = (smuser.fullname == smuser.name)?smuser.fullname:smuser.fullname +"  '" + smuser.name + "'";
		var rcvAvatarURL = $('#cnt_'+ rcv_from_obj.id).find('.cnt_avatar').css('background-image') || $('#login_image').find('.cnt_avatar').css('background-image') || 'url(/include/no_avatar.svg)';
		rcvAvatarURL = rcvAvatarURL.replace(new RegExp('"','g'),"");
		if(rcvAvatarURL == 'none') {
			var rcvAvatar = '<div class="cnt_image cnt_avatar" style="background-image: none">' + avatarSVG + '</div>';
		} else {
			var rcvAvatar = '<div class="cnt_image cnt_avatar" style="background-image: '+rcvAvatarURL+'"></div>';
		}
		var rcvheader = (rcv_from_obj.fullname == rcv_from_obj.name)?rcv_from_obj.fullname:rcv_from_obj.fullname +"  '" + rcv_from_obj.name + "'";
		$('#msg_li').attr('data-cnt-id',rcv_from_obj.name);
		
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
			var str_temp = '';
			
			if(!(msg_object.tmp_msg == undefined) || msg_object.tmp_msg == 'true' || msg_object.tmp_msg) {
				str_temp = ' message_tmpline';
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
			if(msg_object.from == smuser.name) {
				status_text = '<div class="msg_status" title="Статус сообщения">'+ arStatus[msg_object.status] +'</div>';
			}
			
			var msg_ubody = '<div class="message_text'+str_temp+'">' +
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

				var addInfo = (($('#' + 'msg_'+ msg_object.ID).find('#msg_inf').length != 0) || (!files_html==''));
				$('#' + 'msg_'+ msg_object.ID).replaceWith(msg_html);
				if (!addInfo) {
					$('#' + 'msg_'+ msg_object.ID).find('#msg_inf').remove();
				}
			}
			else if ((!msg_object.tmpGUID == '') && $("div").is('#' + 'msg_'+ msg_object.tmpGUID)) {
				msg_html = '<div id="msg_'+ msg_object.ID+ '" class="message_line" data-ms-inf="'+msg_object.from+'">' + html_cnt + msg_ubody;

				var addInfo = (($('#' + 'msg_'+ msg_object.tmpGUID).find('#msg_inf').length != 0) || (!files_html==''));
				$('#' + 'msg_'+ msg_object.tmpGUID).replaceWith(msg_html);
				if (!addInfo) {
					$('#' + 'msg_'+ msg_object.ID).find('#msg_inf').remove();
				}
			}
			else {
				msg_html = '<div id="msg_'+ msg_object.ID+ '" class="message_line" data-ms-inf="'+msg_object.from+'">';
				if((prev_cnt == '' && prev_date == '') || (prev_date != html_date)) {
					if (mode == 'end' && first_cnt == '' && last_msg_cnt == msg_object.from && files_html=='') {
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
				$("#msg_li").prepend('<div class="mess-list">' + html_block + '</div>');
			}
			else if(mode == 'end') {
				$("#msg_li .mess-list").append(html_block);
				if ($('[data-msg-date='+first_date+']').length != 0) {
					var obj = $('[data-msg-date='+first_date+']')[$('[data-msg-date='+first_date+']').length-1];
					$(obj).remove();
				}
			}
		}		
}

function addFileToList(obj, hide_image) {
	var cloud_svg = '<svg fill="#CCCCCC" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">'+
					'<path d="M0 0h24v24H0z" fill="none"/>'+
					'<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>'+
					'</svg>	';
					
	var file_size = Math.round(obj.attr('fsize')/1024);
	var file_idat = getFileType(obj.attr('fext'));
	var file_type = file_idat.type;
	var att_svg = file_idat.svg;
	var file_url = '/my/ajax/files.php?a=detail&i='+obj.attr('ID');
	if(obj.attr('prev').toLowerCase() == 'true') {
		var pvfile_url = '/my/ajax/files.php?a=prev&i='+obj.attr('ID');
	}
	else {
		var pvfile_url = '/my/ajax/files.php?a=detail&i='+obj.attr('ID');
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

function msg_init() {
	hideModalWindow($('.msgInfo_box'));
	$('#msgBox').removeClass('sending');
	$('#process_msg').css('display','none');
	$('#file_upload').uploadifive('clearQueue');
	$('#content #mess_block').remove();
}

function msg_reset(msg_arResult) {
	addSentMessages(msg_arResult);
	$('#msgBox').val('');
	$('#send_msg').hide();
	msg_init();
}

function addSentMessages(msg_arResult) {
	if(!(msg_arResult == undefined)) {
		addMessageToList(msg_arResult, 'end')
	};	
	$('#msg_li').scrollTop($('.mess-list').height());
}