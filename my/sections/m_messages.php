<?
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

//$client = getTeleSOAP();
//$TLP_obj = unserialize($_SESSION["TLP_obj"]);
//$TLP_obj->soapobj = clone $client;
?>
<script type="text/javascript" src="/my/js/msg.js"></script>
<div id="mess_list" class="mess_list">
	<div id="msg_li" data-cnt-id="">
	</div>
</div>
<div id="mess_send" class="mess_send">
	<div class="receiver_header">
		Добавлены получатели сообщения (<a id="rec_quan">0</a> контактов)
		<div class="receiver_cancel"><span style="color: #FF0000;">X</span> Отменить все</div>		
	</div>
	<div class="receiver_block">
	</div>
	<form id="msg_form" name="msg_form">
		<div id="input_block">
			<table style="border-spacing: 0px; width: 100%;" cellspacing="0" cellpadding="0">
				<tr>
					<td style="width: 42px;">
						<div id="uploadfile"><div id="add_file">
							<svg fill="#777" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">
								<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
								<path d="M0 0h24v24H0z" fill="none"/>
							</svg>
						</div></div>
					</td>
					<td>
						<textarea id="msgBox" class="message_box" placeholder="Введите сообщение"></textarea>
					</td>
					<td style="width: 45px;">
						<div id="send_msg">
							<svg fill="#777" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
								<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
								<path d="M0 0h24v24H0z" fill="none"/>
							</svg>
						</div>
						<div id="process_msg" style="display: none;">
                          	<img src="/include/wait.gif">
						</div>						
					</td>
				</tr>
			</table>	
		</div>
			<!--<div id="uploadfile"></div>-->
			<div id="msgBoxdiv" class="message_box" ><pre><pre></div>
			<!--<input id="send_msg" style="margin: 0 0 14px 10px;" type="image" src="/include/send.png"/>-->
		
		<input type="file" name="file_upload" id="file_upload" value="" style="display: none;"><!-- multiple="true"-->

		<input type="hidden" name="action" value="send_msg">
		<input type="hidden" name="message_type" value="text">
		<div id="usr-filename"></div>
	</form>	

</div>
