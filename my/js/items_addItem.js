function getItemInfoForDoc(obj) {
	console.log(obj.attr('data-it-id'));
	var contact = getActiveContact();
	if(!(contact.id == undefined)){
		var arr_filter_elem = {"mode": "item", "compare": "", "name":"id", "type":"=", "value": obj.attr('data-it-id')};
		var arr_filter = [arr_filter_elem];
		var req_object = {"filter": arr_filter};
		var xhr = new XMLHttpRequest();
		var body =	'action=catalog_getItem' +
					'&adds=json' +
					'&rtype=json' +
					'&listType=block' +
					'&contact=' + contact.name +
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
			var arResult = jQuery.parseJSON(xhr.responseText);
			var id = arResult.items[0].id;
			var article = arResult.items[0].article;
			var name = arResult.items[0].name;
			var quantity = parseInt($('.cart_input', obj).val());
			var confirmed = 0;
			var price = parseInt(arResult.items[0].price);
				price = isNaN(price) ? 0 : price;
			var sum = price*quantity;
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
				"owner":contact,
				"type":"order",
				"date":curDate,
				"num":"00003",
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
	
	
	
	
	
	
	
	