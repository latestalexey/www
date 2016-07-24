<div id="msg_begin" style="background-color: #FFF; padding: 35px 0px;">
	<div class="msg_begin_avatar" style="background-image: <?=$_POST["contact_img"]?>;">
	</div>
	<div class="message_header" style="vertical-align: 30px; font-size: 20px;">
		<?
		$contactName = ($_POST["fullname"] == "" || $_POST["fullname"] == $_POST["contact"])?($_POST["contact"]):($_POST["fullname"]." '".$_POST["contact"]."'");
		?>
		<a><?=$contactName?></a>
	</div>
	<div style="font-weight: 600; padding: 5px 20px; font-size: 17px; color: #607d8b;">
		Здесь самое начало вашего общения с <?=$contactName?> в TELEPORT
	</div>
</div>