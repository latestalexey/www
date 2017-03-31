<?
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

//$client = getTeleSOAP();
//$TLP_obj = unserialize($_SESSION["TLP_obj"]);
//$TLP_obj->soapobj = clone $client;
?>
<script type="text/javascript" src="/my/js/orders.js"></script>
<script type="text/javascript" src="/my/js/order_view.js"></script>
<script type="text/javascript" src="/my/js/upload_from_xls.js"></script>
<div id="orders_header">
<div class="order">
	<div class="order_content_header">
		<div class="order_line">
			<div class="col_1 menu_col selected_col" data-ltype="sent">Отправленные документы</div>
			<div class="col_2 menu_col" data-ltype="recieved">Полученные документы</div>
		</div>	
	</div>
</div>

<div class="order">
	<div class="order_content_header">
		<div class="order_line">
			<div class="col_0">Тип документа</div>
			<div class="col_1">№ документа</div>
			<div class="col_2">Дата</div>
			<div class="col_3" data-contractor="">Получатель</div>
			<div class="col_4">Сумма</div>
			<div class="col_5">Статус</div>
		</div>	
	</div>
</div>
</div>

<div id="order_list" class="order_list">
	<div id="order_li">
	</div>
</div>
