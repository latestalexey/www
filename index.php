<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");?>
<script type="text/javascript" src="<?=SITE_TEMPLATE_PATH?>/js/tlp.js"></script>
<title>TELEPORT</title>
<?if (isset($_SESSION["TLP_obj"])) {
	localRedirect("/my/index.php");
}?>

<?require($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");?>
<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>