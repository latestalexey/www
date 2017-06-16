<?
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

//$client = getTeleSOAP();
//$TLP_obj = unserialize($_SESSION["TLP_obj"]);
//$TLP_obj->soapobj = clone $client;
$vwmode = $_GET['vwmode'];
if($vwmode == '') {
	$vwmode = 'block';
}
?>
<script type="text/javascript" src="/my/js/items.js"></script>
<script type="text/javascript" src="/my/js/order_view.js"></script>
<script type="text/javascript" src="/my/js/upload_from_xls.js"></script>
<div id="items_header">
<div class="item">
	<div class="item_content_header">
		<div id="it_rule_pan" class="item_line">
			<div id="vwmode_pan" style="text-align: left; float: left;">
				<div id="it_vwmode_1" class="catvwmode<?=($vwmode == 'block')?' activevwmode':'';?> active_icon help_icon" data-ln="block">
					<div class="help_info">
						Просмотр каталог блоками картинок
					</div>
					<svg fill="#777" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
						<path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/>
						<path d="M0 0h24v24H0z" fill="none"/>
					</svg>
				</div>
				<div id="it_vwmode_2" class="catvwmode<?=($vwmode == 'list')?' activevwmode':'';?> active_icon help_icon" data-ln="list">
					<div class="help_info">
						Просмотр каталог списком
					</div>
					<svg fill="#777" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
						<path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/>
						<path d="M0 0h24v24H0z" fill="none"/>
					</svg>
				</div>
				<!--<div id="it_vwmode_3" class="catvwmode<?=($vwmode == 'carousel')?' activevwmode':'';?>  active_icon help_icon" data-ln="carousel">
					<div class="help_info">
						Просмотр каталог в режиме 'Карусель'
					</div>
					<svg fill="#777" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
						<path d="M7 19h10V4H7v15zm-5-2h4V6H2v11zM18 6v11h4V6h-4z"/>
						<path d="M0 0h24v24H0z" fill="none"/>
					</svg>
				</div>-->
			</div>
			<div style="text-align: center; border-right: none;">
				<div id="it_search">
					<input style="display:inline-block; min-width: 75px; width: 150px;" id="it_search_inp" class="search_inp" type="text" placeholder="Введите артикул, наименование или штрихкод">
					<div id="it_search_icon" class="simple_button" style="">
						<svg fill="#CCC" height="32px" version="1.1" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink">
							<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"></g>
							<path d="M19.4271164,21.4271164 C18.0372495,22.4174803 16.3366522,23 14.5,23 C9.80557939,23 6,19.1944206 6,14.5 C6,9.80557939 9.80557939,6 14.5,6 C19.1944206,6 23,9.80557939 23,14.5 C23,16.3366522 22.4174803,18.0372495 21.4271164,19.4271164 L27.0119176,25.0119176 C27.5621186,25.5621186 27.5575313,26.4424687 27.0117185,26.9882815 L26.9882815,27.0117185 C26.4438648,27.5561352 25.5576204,27.5576204 25.0119176,27.0119176 L19.4271164,21.4271164 L19.4271164,21.4271164 Z M14.5,21 C18.0898511,21 21,18.0898511 21,14.5 C21,10.9101489 18.0898511,8 14.5,8 C10.9101489,8 8,10.9101489 8,14.5 C8,18.0898511 10.9101489,21 14.5,21 L14.5,21 Z" id="search"/>
						</svg>
					</div>
					<div id="it_extsearch" class="simple_button" style="padding: 7px 10px 6px 10px;">
						Расширенный поиск
					</div>
				</div>
			</div>
			<div style="text-align: left; float: right;">
				<div id="it_cart" class="active_icon" data-ln="cart">
					<div class="simple_button checkout_button" style="padding: 7px 15px 6px 15px; min-width: 0px;">Оформить заказ</div>					
					<div style="height: 36px; min-width: 40px; border: none;" class="cart_icon">
						<div class="info"></div>
						<svg fill="#777" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
							<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
							<path d="M0 0h24v24H0z" fill="none"/>
						</svg>
					</div>
					<!--div class="help_info">Мои заказы</div-->
				</div>
			</div>
		</div>	
	</div>
</div>
	<ul class="breadcrumbs"></ul>
	<div id="item_list_header" class="item">
		<div class="item_content_header">
			<div class="item_line">
				<div class="col_1">Артикул</div>
				<div class="col_2">Наименование</div>
				<div class="col_3">Ваша цена</div>
				<div class="col_6">Цена в рознице</div>
				<div class="col_4">На складе</div>
				<div class="col_5" style="min-width: 156px;">В заказ</div>
			</div>	
		</div>
	</div>
</div>

<div id="item_list" class="item_list">
	<div id="featured-items-block" class="hidden">
		<div id="item_action" class="featured-items hidden">
			<div class="title">
				<hr class="divider">
				<span>Акции</span>
			</div>
			<div class="container"></div>	
			<div><div class="button" data-filter-name="action">Подробнее</div></div>
		</div>
		<div id="item_novetly" class="featured-items hidden">
			<div class="title">
				<hr class="divider">
				<span>Новинки</span>
			</div>
			<div class="container"></div>	
			<div class="button" data-filter-name="novetly">Подробнее</div>
		</div>
		<div id="item_popular" class="featured-items hidden">
			<div class="title">
				<hr class="divider">
				<span>Лидеры продаж</span>
			</div>
			<div class="container"></div>	
			<div class="button" data-filter-name="popular">Подробнее</div>
		</div>
	</div>
	<div id="item_li"></div>
</div>
