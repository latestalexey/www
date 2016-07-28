<div class="leftmenu_content">
	<div style="margin: 0px 10px;">
		<p id="add_channel">Создать новый канал</p>
		<p id="add_cnt">Пригласить новый контакт</p>
		<p id="manage_cnt">Управлять контактами</p>																								<!-- Добавлен пункт меню для вызова менеджера контактов -->
	</div>
</div>

<div id="my_contacts">
	<div id="cnt-manager" class="modal_window">
		<? require($_SERVER["DOCUMENT_ROOT"]."/my/ajax/cnt_mngr.php"); ?>													<!-- Добавлен менеджер контактов -->
	</div>
	<div id="cnt_list" class="contact_list">
		<?
		require($_SERVER["DOCUMENT_ROOT"]."/my/ajax/cnt.php");
		?>
	</div>
</div>