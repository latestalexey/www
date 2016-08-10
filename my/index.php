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
<title>TELEPORT. Личный портал</title>
<link href="<?=SITE_TEMPLATE_PATH?>/css/slider.css" rel="stylesheet" type="text/css">
<link href="<?=SITE_TEMPLATE_PATH?>/css/style_max.css" rel="stylesheet" type="text/css">
<link href="<?=SITE_TEMPLATE_PATH?>/css/style_rbak.css" rel="stylesheet" type="text/css">
<link href="<?=SITE_TEMPLATE_PATH?>/css/cnt_mngr.css" rel="stylesheet" type="text/css">
<link href="<?=SITE_TEMPLATE_PATH?>/css/darktooltip.css" rel="stylesheet" type="text/css">
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet">

<script type="text/javascript" src="<?=SITE_TEMPLATE_PATH?>/js/teleport.js"></script>
<script type="text/javascript" src="<?=SITE_TEMPLATE_PATH?>/js/main.js"></script>
<script type="text/javascript" src="<?=SITE_TEMPLATE_PATH?>/js/lz-string.js"></script>
<script type="text/javascript" src="<?=SITE_TEMPLATE_PATH?>/js/uploadifive.js"></script>

<script async type="text/javascript" src="<?=SITE_TEMPLATE_PATH?>/js/darktooltip.js"></script>
<script async type="text/javascript" src="<?=SITE_TEMPLATE_PATH?>/js/defiant.min.js"></script>
<script async type="text/javascript" src="//api-maps.yandex.ru/2.1/?lang=ru_RU"></script>
<script async type="text/javascript" src="/my/js/cnt_mngr.js"></script>

<div id="main_content">
	<a href="/"><div id="logo"></div></a>
		<div id="login_block">
			<table style="border-spacing: 0; min-width: 215px;">
				<tr>
					<td>
						<div id="login_user" class="cnt_text" data-nps="<?=$need_pass;?>" data-usr-id="<?=$TLP_obj->user_info['id'];?>" data-usr-name="<?=$TLP_obj->user_info['name']?>" data-usr-fullname="<?=$username;?>" data-usr-index="<?=mb_strtolower($TLP_obj->user_info['name'],'UTF-8').'_ins_'.mb_strtolower($username,'UTF-8');?>">
							<?=$username;?>											
						</div>	
						<!--<p class="cnt_add" style="font-size: 14px; color:#444; text-align: right;"><a id="my_logout" onclick="MyUserLogout()">Выход</a></p>-->
					</td>	
					<td style="width: 45px;">
						<div id="login_image">
							<div class="cnt_avatar cnt_avatar_small" style="background-image: url(<?=$img_url?>);"></div>
						</div>
					</td>
				</tr>	
			</table>			
			<div id="login_border"></div>
		</div>
	<div class="topmenu">
		<ul>
			<li id="m_catalog" <?if($mode == "catalog"){echo 'class="active"';}?>>КАТАЛОГ</li>
			<li id="m_orders" <?if($mode == "orders"){echo 'class="active"';}?>>ДОКУМЕНТЫ</li>
			<li id="m_messages" <?if($mode == "messages"){echo 'class="active"';}?>>СООБЩЕНИЯ</li>
		</ul>	
	</div>
	<div class="workspace">
		<div id="contacts" class="right_pan">
			<div id="cnt_bar" class="pan_bar" style="left: 303px;">
				<
			</div>
			<h3 style="margin: 5px 0; position: relative; min-height: 36px;">
				<div class="search_box">
					<input style="display:none; width: 10px;" id="search_inp" class="search_inp" type="text" placeholder="Поиск контакта">
					<div class="search_button">
						<svg fill="#777" height="32px" version="1.1" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink">
							<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"></g>
							<path d="M19.4271164,21.4271164 C18.0372495,22.4174803 16.3366522,23 14.5,23 C9.80557939,23 6,19.1944206 6,14.5 C6,9.80557939 9.80557939,6 14.5,6 C19.1944206,6 23,9.80557939 23,14.5 C23,16.3366522 22.4174803,18.0372495 21.4271164,19.4271164 L27.0119176,25.0119176 C27.5621186,25.5621186 27.5575313,26.4424687 27.0117185,26.9882815 L26.9882815,27.0117185 C26.4438648,27.5561352 25.5576204,27.5576204 25.0119176,27.0119176 L19.4271164,21.4271164 L19.4271164,21.4271164 Z M14.5,21 C18.0898511,21 21,18.0898511 21,14.5 C21,10.9101489 18.0898511,8 14.5,8 C10.9101489,8 8,10.9101489 8,14.5 C8,18.0898511 10.9101489,21 14.5,21 L14.5,21 Z" id="search"></path>
						</svg>
					</div>
				</div>
				<div class="leftmenu_icon">
					<div class="trans_svg">
					<svg fill="#777" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">
						<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
						<path d="M0 0h24v24H0z" fill="none"></path>
					</svg>
					</div>
					<div class="leftmenu_content">
						<div style="margin: 0px 10px;">
							<p id="add_channel">Создать новый канал</p>
							<p id="add_cnt">Пригласить новый контакт</p>
							<p id="manage_cnt">Управление контактами</p>
							<p id="manage_squad">Управление командами</p>
						</div>
					</div>
				</div>
				<div id="tlp_slogan">Teleport</div>				
			</h3>
			<div id="contacts_menu"></div>
			<div id="my_contacts">
				<div id="cnt_list" class="contact_list">
					<?
					require($_SERVER["DOCUMENT_ROOT"]."/my/ajax/cnt.php");
					?>
				</div>
			</div>
		</div>
		<div id="ext_pan">
			<div id="ext_bar" class="pan_bar" style="right: 303px;">
				>
			</div>
			<div id="ext_pan_header" class="up_pan" style="position: relative; float: none;">
				<div class="clw" style="position: absolute; right: 0px;">
					<img src="/include/close_window.svg">
				</div>
				<div id="ext_pan_header_content">
				</div>
			</div>
			<div id="ext_pan_content">
			</div>
		</div>
		<div class="left_pan">
			<div class="up_pan">
				<div id="cur_contact"></div>
				<div id="contact_right_side_buttons">
					<div id="contact_filter" class="simple_button" style="padding: 10px; font-weight: 600;">
					</div>
					<div id="exp_filter" class="active_icon help_icon">
						<div class="help_info">
							Управление фильтром
						</div>	
					
						<svg fill="#777" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
							<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
							<path d="M0 0h24v24H0z" fill="none"/>
						</svg>
					</div>				
					<div class="up_add_menu active_icon menu_icon">
						<svg fill="#777" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
							<!--
							<path d="M0 0h24v24H0z" fill="none"/>
							<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
							-->
							<path d="M0 0h24v24H0z" fill="none"/>
							<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
						</svg>
					</div>
				</div>	
			</div>
			<div id="work_zone" class="main_pan">
				<?if(!($mode == ''))
				{	
					include($_SERVER["DOCUMENT_ROOT"]."/my/sections/m_".$mode.".php");
				}?>
			</div>
			
		</div>	
	</div>
</div>

