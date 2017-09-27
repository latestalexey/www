<?
if($cnt['fullname']=='') {
	$usr_fullname = $cnt["name"]; }
else {
	$usr_fullname = $cnt['fullname']; }

if($cnt['alias']!=$cnt["name"]) {
	$usr_aliasname = $cnt['alias'];
} else {
	$usr_aliasname = $usr_fullname;
}

if($get_cnt==$cnt["name"]) {
	$cnt_classname = 'active_contact_inf';
	$active_cnt = $cnt;
}
else {
	$cnt_classname = 'contact_inf';
}
?>
<div id="lst_<?=$cnt['user_id']?>" class="<?=$cnt_classname;?>" data-usr-id="<?=$cnt['user_id']?>" data-usr-name="<?=$cnt['name']?>" data-usr-fullname="<?=$usr_fullname?>" data-usr-alias="<?=$cnt['alias']?>" data-photo-id="<?=$cnt['photo_id']?>" data-usr-activedate="<?=$cnt['activedate'];?>" data-usr-index="<?=mb_strtolower($cnt['name'],'UTF-8').'_ins_'.mb_strtolower($cnt['fullname'],'UTF-8').'_ins_'.mb_strtolower($cnt['alias'],'UTF-8');?>">
	<p class="cnt_info active_icon"><?include($_SERVER["DOCUMENT_ROOT"]."/my/data/svg/expand_more.svg");?></p>
	<table style="border-spacing: 0;">
		<tr>
			<td>
				<div>
					<?if($cnt['photo'] == '') 
					{?>
					<div class="cnt_avatar cnt_avatar_small" style="background-image: none;">
						<svg fill="#BBB" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
							<path d="M0 0h24v24H0z" fill="none"/>
						</svg>
					</div>
					<?}
					else
					{?>
						<div class="cnt_avatar cnt_avatar_small" style="background-image: url(<?=$cnt['photo']?>);"></div>
					<?}?>
				</div>
			</td>
			<td>
				<div class="cnt_text">
					<?echo $usr_aliasname;?>
				</div>	
				<p class="cnt_add cnt_mail">
					<?if(!($cnt["name"] == $usr_fullname)) {
						echo $cnt["name"];
					}?>
				</p>
				<?
					$cnt_groupname = $cnt['group'];
					/*$cnt_groupname = $cnt["membergroupfullname"];
					if($cnt_groupname==''){$cnt_groupname = $cnt["membergroupname"];} 
					if($cnt_groupname==''){$cnt_groupname = $cnt['group'];}*/
				?>	
				<p class="cnt_add"><?echo $cnt_groupname;?></p>
			</td>	
		</tr>	
	</table>
	<div class="cnt_date"><?=$cnt['strDate'];?></div>
	<div class="new_msg"><span>99</span></div>
	<div class="new_ord"><span>99</span></div>
	<div class="cnt_check">
		<div class="cnt_icon">
			<svg fill="#000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
				<path d="M0 0h24v24H0z" fill="none"></path>
				<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
			</svg>								
		</div>
	</div>
	<div class="cnt_blocked"></div>
</div>
