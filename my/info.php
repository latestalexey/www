<div id="info_content">
	<p id="personal">Мой профиль</p>
	<p id="pass_change">Сменить пароль</p>
	<p id="logout">Выход из TELEPORT</p>
</div>	
<script>
	$("#info_content p").click(function(e){
		if($(this).attr('id') == 'logout') {
			MyUserLogout();
		}
		else if($(this).attr('id') == 'personal') {
			ContactInfoView(smuser.name);
			$(this).parent().parent().remove();
		}
		else if($(this).attr('id') == 'pass_change') {
			ChangeUserPassword('');
			$(this).parent().parent().remove();
		}
	});

</script>	