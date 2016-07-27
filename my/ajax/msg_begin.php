<div data-ms-inf="<?=$_POST["contact"]?>">
	<div id="msg_begin" style="background-color: rgba(136,198,156,0.4); padding: 35px 0px;">
		<div class="msg_begin_avatar" style="background-color: #FFF; background-image: <?=($_POST["contact_img"]=='none')?('url(/include/no_avatar.svg)'):($_POST["contact_img"])?>;">
		</div>
		<div class="message_header" style="vertical-align: 30px; font-size: 20px; color: #FF6C00">
			<?
			$contactName = ($_POST["fullname"] == "" || $_POST["fullname"] == $_POST["contact"])?($_POST["contact"]):($_POST["fullname"]." '".$_POST["contact"]."'");
			?>
			<a><?=$contactName?></a>
		</div>
		<div style="font-weight: 600; padding: 5px 20px; font-size: 17px; color: #FF6C00;">
			Здесь самое начало вашего общения с <?=$contactName?> в TELEPORT
		</div>
	</div>
</div>