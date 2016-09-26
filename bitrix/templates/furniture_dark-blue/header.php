<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
IncludeTemplateLangFile(__FILE__);?>

<?
require_once($_SERVER["DOCUMENT_ROOT"]."/auth/adds.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/teleclasses.php");
if (isset($_SESSION["TLP_obj"]))
{
	$TLP_obj = unserialize($_SESSION["TLP_obj"]);
	$username = $TLP_obj->user_info['fullname'];
	if($username == "")
		$username = $TLP_obj->user_info['name'];

	if($TLP_obj->user_info['photo'] == '')
		$user_img_url = '/include/house.png';
	else
		$user_img_url = $TLP_obj->user_info['photo'];
}	
else
{
	$username = 'личный кабинет';
	$user_img_url = '/include/house.png';
}

?>
<html>
<head>
<?$APPLICATION->ShowHead();?>
<meta property="og:title" content="TELEPORT - новая территория вашего бизнеса.">
<meta property="og:url" content="https://test.e-teleport.ru">
<meta property="og:description" content="Облачный сервис управления своей деловой средой. Продажи, закупки, моментальный обмен каталогами c партнерами. Удобный бизнес-мессенджер. Все в одном приложении и на любом устройстве.">
<meta property="og:image" content="https://test.e-teleport.ru/include/meta_teleport.jpg">
<meta property="og:type" content="website">
<meta property="og:site_name" content="TELEPORT">
<meta name="description" content="Облачный сервис управления своей деловой средой. Продажи, закупки, моментальный обмен каталогами c партнерами. Удобный бизнес-мессенджер. Все в одном приложении и на любом устройстве.">
<meta name="msapplication-TileImage" content="https://test.e-teleport.ru/include/meta_teleport.jpg">
<title>TELEPORT - новая территория вашего бизнеса.</title>

<link rel="icon" type="image/x-icon" href="/include/favicon.png"/>
<link href='https://fonts.googleapis.com/css?family=Lobster|Open+Sans:400,600,800&subset=latin,cyrillic' rel='stylesheet' type='text/css'>

<script type="text/javascript" src="<?=SITE_TEMPLATE_PATH?>/js/jquery.js"></script>
<script type="text/javascript" src="<?=SITE_TEMPLATE_PATH?>/js/slimscroll.js"></script>
<script type="text/javascript" src="<?=SITE_TEMPLATE_PATH?>/js/jquery-ui.js"></script>
<script type="text/javascript" src="<?=SITE_TEMPLATE_PATH?>/js/jquery.inputmask.js"></script>

</head>

<body>
	<div id="content">
<?$APPLICATION->ShowPanel()?>
