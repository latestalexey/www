const xls_upl_btn = '<div style="margin-bottom: 25px;"><form id="doc_upl_xls_form" name="upl_xls_form">' +	
						'<div id="doc_upl_xls_btn" class="button fa fa-file-excel-o"  >&nbsp;&nbsp;Выбрать файл для загрузки</div>' +
						'<input type="file" name="doc_upl_xls_queue" id="doc_upl_xls_queue" style="display: none;">' +
						'<input type="hidden" name="action" value="upload_xls">' +	
					'</form></div>';	

const xls_upl_form ='<div id="doc_excel_form">' +
						'<div class="close_cross_line"><div class="close_cross"><img src="/include/close_window.svg"></div></div>' + xls_upl_btn +
						'<div class="upl_xls_example"><div class="header">Для загрузки позиций из excel, необходимо выбрать файл с перечнем позиций согласно структуре:</div><img src="../include/upl_xls_example.png"></div>' +
					'</div>';
					
var appendXLSItemsArray = new Array();
var uploadXLSItemsArray = new Array();



function arrayCount (array) {
    var cnt = 0;
    for(k in array) {
      if(array[k] != undefined) {
        cnt++;
      }
   }
   return cnt>0 ? cnt : 0;
};

function showUploadXLSForm() {
	$('#main_content').find('#doc_excel_form').remove();
	$('#order_view .docview').append(xls_upl_form);
	setTimeout(
		function() {
			const h = $('#main_content #order_view #doc_excel_form').height();
			$('#main_content #order_view #doc_excel_form .upl_xls_example').height(h-210);
			$('#main_content #order_view #doc_excel_form .upl_xls_example').slimScroll({height: h-210});
			$('#main_content #order_view #doc_excel_form').fadeIn(200);
	}, 500);
	
	$(function() {	
		$("#main_content #order_view #doc_upl_xls_queue").uploadifive({
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
				$('#doc_upl_xls_form').hide();
				var html_text = 'Пожалуйста, подождите.<br> Идет обработка документа.';
				showTelebotInfo(html_text,"", 0);
				$('#main_content').append('<div class="modal_bg"></div>');
				$('.dark-tooltip').hide();
			},
			'onUploadComplete' : function(file, data) {
				try {
					uploadXLSItemsArray = JSON.parse(data);
				} catch (e) {
					uploadXLSItemsArray = [];
				};							
				if (arrayCount(uploadXLSItemsArray)) {
					uploadXLSItemsArray.splice(0, 1);
					const receiver = $('#order_view .cnt_inp').attr('data-receiver');
					var  article_str = '';
					uploadXLSItemsArray.forEach(function(val, key, uploadXLSItemsArray){
						article_str = article_str + '"' + val[0] + '",';
					});
					var arr_fld = ['*'];
					it_filter = [{"mode": "item", "name":"article", "operation":"IN", "value": article_str.substr(0, article_str.length-1)}];
					var xhr = new XMLHttpRequest();
					var body =	'action=catalog_get' +
								'&adds=json' +
								'&contact=' + encodeURIComponent(receiver) +
								'&smuser=' + encodeURIComponent(JSON.stringify(smuser)) +
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
						appendXLSItemsArray = JSON.parse(xhr.responseText);
						var items_str = '';
						if (appendXLSItemsArray.catalog.length) {	
							uploadXLSItemsArray.forEach(function(val, key, uploadXLSItemsArray){
								var item = appendXLSItemsArray.catalog.filter(function(subAr) {return subAr.article == val[0]});
								if (item.length) {
									item = item[0];
									var name = item.name;
									var price = number_format(item.price, 2, '.', ' ');
									var qty = val[2] || 0;
									var redClass = '';
									var strChecked = ' checked';
									var strFaCheck = ' fa-check';
									if (item.stock == 0) {
										redClass = ' red';
										strChecked = '';
										strFaCheck = '';
									}
									items_str +=
										'<tr id="it_'+item.id+'" class="item'+strChecked+'" data-it-id='+item.id+'>' +
											'<td class="col_0"><i class="fa'+strFaCheck+'"></i></td>' +
											'<td class="col_1">'+item.article+'</td>' +
											'<td class="col_2">'+item.name+'</td>'+
											'<td class="col_3">шт</td>'+
											'<td class="col_4">'+number_format(val[2], 0, '', ' ')+'</td>'+
											'<td class="col_5' + redClass + '">'+number_format(item.stock, 0, '', ' ')+'</td>'+
											'<td class="col_6">'+number_format(item.price, 2, '.', ' ')+'</td>'+
											'<td class="col_7">'+number_format(item.price*qty, 2, '.', ' ')+'</td>'+				
										'</tr>'
								} else {
									items_str +=
										'<tr class="item red">' +
											'<td class="col_0"><i class="fa"></i></td>' +
											'<td class="col_1">'+val[0]+'</td>' +
											'<td class="col_2">'+val[1]+'</td>'+
											'<td class="col_3">шт</td>'+
											'<td class="col_4">'+number_format(val[2], 0, '', ' ')+'</td>'+
											'<td class="col_5"></td>'+
											'<td class="col_6">0.00</td>'+
											'<td class="col_7">0.00</td>'+				
										'</tr>'
								}
							});	
							const table_items = '<table class="upl_xls_item_list_content"><tr><th class="col_0">...</th><th class="col_1">Артикул</th><th class="col_2">Товар/Услуга</th><th class="col_3">Ед. изм.</th><th class="col_4">Кол-во</th><th class="col_5">Остаток</th><th class="col_6">Цена</th><th class="col_7">Всего</th></tr>'+items_str+'</table>'
							$('#doc_excel_form .upl_xls_example').html(table_items);
							$('#doc_excel_form').append('<div id="append_xls_items_btn" class="button fa fa-file-excel-o"  >&nbsp;&nbsp;Загрузить в заказ</div>');
						} else {
							uploadXLSItemsArray.forEach(function(val, key, uploadXLSItemsArray){
								items_str +=
									'<tr class="item red">' +
										'<td class="col_0"><i class="fa"></i></td>' +
										'<td class="col_1">'+val[0]+'</td>' +
										'<td class="col_2">'+val[1]+'</td>'+
										'<td class="col_3">шт</td>'+
										'<td class="col_4">'+number_format(val[2], 0, '', ' ')+'</td>'+
										'<td class="col_5">0.00</td>'+
										'<td class="col_6">0.00</td>'+
										'<td class="col_7">0.00</td>'+				
									'</tr>'
							});	
							const table_items = '<table class="upl_xls_item_list_content"><tr><th class="col_0">...</th><th class="col_1">Артикул</th><th class="col_2">Товар/Услуга</th><th class="col_3">Ед. изм.</th><th class="col_4">Кол-во</th><th class="col_5">Остаток</th><th class="col_6">Цена</th><th class="col_7">Всего</th></tr>'+items_str+'</table>'
							$('#doc_excel_form .upl_xls_example').html(table_items);	
						};
						hideTelebotInfo();
						$('#main_content .modal_bg').remove();
					}		
					xhr.send(body);	
				};
			}	
		});
	});	
};

function appendItemsToDoc() {
	$('#doc_excel_form table .item.checked').each(function(){
		var curItem = $(this);
		var item = appendXLSItemsArray.catalog.filter(function(subAr) {return subAr.id === curItem.attr('data-it-id')});
		if (item.length) {
			item = item[0];
			var	exItem = $('.order_item_list_content .item[data-it-id='+item.id+']');	
			if ( exItem.length /*&& (parseFloat(item.price) == parseFloat($('.col_6', exItem).text().replace(/ /g, '')))*/ ) {
				var old_qty = $('.quantity', exItem).val() || 0;
				var new_qty = parseInt($('td.col_4', curItem).text()) || 0;
				console.log(new_qty)
				var qty = old_qty*1 + new_qty*1;
				var price = parseFloat(item.price).toFixed(2) || 0.00;
				var total = number_format(qty*price, 2, '.', ' ');
				$('.quantity', exItem).val(qty);
				$('.col_7', exItem).text(total);
			} else {
				var col = 8;	
				var html_str = '';
				var name = item.name;
				var qty = parseInt($('td.col_4', curItem).text()) || 0;
				var price = number_format(item.price, 2, '.', ' ');
				$('#order_view .order_item_list_content').prepend(
					'<tr id="it_'+item.id+'" class="item" data-it-id='+item.id+'>' +
						'<td class="col_0"><i class="fa"></i></td>' +
						'<td class="col_1">'+item.article+'</td>' +
						'<td class="col_2"><span class="caption">'+name+'</span><i class="fa fa-chevron-up"></i></td>'+
						'<td class="col_3">шт</td>'+
						'<td class="col_4 required"><i class="fa fa-minus" aria-hidden="true"></i><input class="quantity" value="'+number_format(qty, 0, '', ' ')+'"><i class="fa fa-plus" aria-hidden="true"></i></td>'+
						'<td class="col_5"><i class="fa fa-minus hidden" aria-hidden="true"></i><input class="confirmed" value="0"><i class="fa fa-plus hidden" aria-hidden="true"></i></td>'+
						'<td class="col_6">'+price+'</td>'+
						'<td class="col_7">'+number_format(item.price*qty, 2, '.', ' ')+'</td>'+					
					'</tr>'
				);
			};	
		}	
	});
	setOrderItemListContentHeight();
	getTotalSum();
	$('#main_content #order_view #doc_excel_form').fadeOut(300);

}

$(document).ready(function(){
	$('#main_content').off('click', '#order_view #doc_upl_xls_btn');
	$('#main_content').off('click', '#order_view #doc_excel_form .close_cross');
	$('#main_content').off('click', '#order_view #append_xls_items_btn');
	$('#main_content').off('click', '#order_view #doc_excel_form .upl_xls_item_list_content .item:not(.red) .col_0 .fa');
	
	$('#main_content').on('click', '#order_view #doc_upl_xls_btn' ,function() {
		$('#order_view #doc_upl_xls_queue').uploadifive('clearQueue');
		$(this).siblings('#uploadifive-doc_upl_xls_queue').children().last().click();
	});
	
	$('#main_content').on('click', '#order_view #doc_excel_form .close_cross', function(e){
		e.stopPropagation();
		e.preventDefault();
		$('#doc_excel_form').remove();
	});
	
	$('#main_content').on('click', '#order_view #append_xls_items_btn' ,function() {
		$(this).hide(0);
		appendItemsToDoc();
	});
	
	$('#main_content').on('click', '#order_view #doc_excel_form .upl_xls_item_list_content .item:not(.red) .col_0 .fa', function(){
		$(this).toggleClass('fa-check').parents('.item').toggleClass('checked');
	});	
});
