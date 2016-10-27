<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");?>
<?require($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");?>
<?
$TLP_obj = unserialize($_SESSION["TLP_obj"]);

$username = $TLP_obj->user_info['fullname'];
if($username == "")
	$username = $TLP_obj->user_info['name'];

if($TLP_obj->user_info['photo'] == '')
	$img_url = '/include/no_avatar.svg';
else
	$img_url = $TLP_obj->user_info['photo'];

$need_pass = '';
if($_GET["add"]=='nps')
	$need_pass = 'y';


$mode = $_GET["mode"];
if($mode=='')
	$mode = 'catalog';
?>
<title>TELEPORT. Каталог</title>
<div style="position: fixed; top: 3px; left: 0px; height: 40px; background-color: #ECEFF1; width: 100%; z-index: 100;">
	<!--<div style="text-align: center;">
		<div id="logo"></div>
		<div id="tlp_slogan" style="position: relative; top: -7px;">Teleport</div>
	</div>-->
	<div style="position: absolute; top: 4px; left: 25px;">
		<svg fill="#777" height="32" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0h24v24H0z" fill="none"></path>
			<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
		</svg>
	</div>
	<div style="position: absolute; top: 4px; right: 62px;">
		<svg fill="#777" height="32" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0h24v24H0zm18.31 6l-2.76 5z" fill="none"></path>
			<path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"></path>
		</svg>
	</div>	
	
	<div style="position: absolute; top: 27px; right: 57px; width: 16px; height: 16px; border-radius: 15px; background-color: #FF6600;">
	</div>	
</div>
<div style="position: fixed; bottom: 3px; left: 0px; height: 40px; background-color: #ECEFF1; width: 100%; z-index: 100;">
	<div id="it_vwmode_1" style="position: absolute; top: 4px; left: 25px;" data-ln="block">
		<svg fill="#777" height="32" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
			<path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"></path>
			<path d="M0 0h24v24H0z" fill="none"></path>
		</svg>
	</div>
	<div id="it_vwmode_2" style="position: absolute; top: 4px; left: 72px;" data-ln="block">
		<svg fill="#777" height="32" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
			<path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"></path>
			<path d="M0 0h24v24H0z" fill="none"></path>
		</svg>	
	</div>
	<div style="text-align: center; border-right: none;">
		<div id="it_search" style="display: inline-block; position: relative; top: 4px;">
			<input style="display: inline-block; min-width: 150px; width: 150px;" id="it_search_inp" class="search_inp" type="text" placeholder="Введите артикул, наименование или штрихкод">
			<div id="it_search_icon" class="simple_button" style="">
				<svg fill="#777" height="32px" version="1.1" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink">
					<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"></g>
					<path d="M19.4271164,21.4271164 C18.0372495,22.4174803 16.3366522,23 14.5,23 C9.80557939,23 6,19.1944206 6,14.5 C6,9.80557939 9.80557939,6 14.5,6 C19.1944206,6 23,9.80557939 23,14.5 C23,16.3366522 22.4174803,18.0372495 21.4271164,19.4271164 L27.0119176,25.0119176 C27.5621186,25.5621186 27.5575313,26.4424687 27.0117185,26.9882815 L26.9882815,27.0117185 C26.4438648,27.5561352 25.5576204,27.5576204 25.0119176,27.0119176 L19.4271164,21.4271164 L19.4271164,21.4271164 Z M14.5,21 C18.0898511,21 21,18.0898511 21,14.5 C21,10.9101489 18.0898511,8 14.5,8 C10.9101489,8 8,10.9101489 8,14.5 C8,18.0898511 10.9101489,21 14.5,21 L14.5,21 Z" id="search"></path>
				</svg>
			</div>
		</div>
		<div id="it_extsearch" style="display: inline-block; position: relative; top: 4px;">
			<svg fill="#777" height="33" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
				<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path>
				<path d="M0 0h24v24H0z" fill="none"></path>
			</svg>
		</div>
	</div>
</div>
<div style="background-color: #FFF; width: 100%; padding: 45px; box-sizing: border-box;">
<?
	for ($i = 0; $i<=100; ++$i) {?>
		<div style="display: inline-block; min-height: 250px; width: 208px; border: 1px solid #CCC; border-radius: 5px; margin: 3px; background-color: #FEFEFE; position: relative;"></div>
	<?}
?>
</div>