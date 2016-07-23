<?
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

if($val_group['sortnum'] == -5 || $val_group['sortnum'] == -10) {
	$drop = '';
}
else {
	$drop = ' tl_droppable';
}
?>
<div class="group_block">
	<h3 class="close_list<?=$drop;?>" data-group="<?=mb_strtolower($val_group['group'], 'UTF-8');?>" data-group-name="<?=$val_group['group'];?>" data-srtnum="<?=$val_group['sortnum'];?>"><?=$val_group['group'];?>
	<br><span class="cnt_add" style="font-weight: normal;"><?=$val_group['groupinfo'];?></span>
	<?if($val_group['sortnum'] == 999 || $val_group['sortnum'] == -10)
	{}	else
	{?>
		<span class="cnt_icon channel_chkbox" style="opacity: 0.7;">
			<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="16" viewBox="0 0 24 24" width="16">
					<path d="M0 0h24v24H0z" fill="none"/>
					<path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
				</svg>						
			</span>
		<?}?>	
	</h3>
	<div id="cnt_short" class="contact_short" style="display: none;">
	</div>
</div>