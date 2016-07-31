<?
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

function arSortByNum($a,$b) {
	if($a['sortnum'] == $b['sortnum']) {
		return 0;
	}
	 return ($a['sortnum'] < $b['sortnum']) ? -1 : 1;
}

//$client = getTeleSOAP();
$TLP_obj = unserialize($_SESSION["TLP_obj"]);
//$TLP_obj->soapobj = clone $client;

$arContacts	= array();
$arGroups	= array();
$lastContacts = array();

$arFnc = array();
$res = $TLP_obj->telecall('Contacts_Get', $arFnc);
//if($res["errCode"] == 0)
//{
	$today = new DateTime();
	$tDate = $today->format('d.m.Y');
	
	//$contacts_result = json_decode($res["return"], true);
	//$contacts = $contacts_result['result'];
	foreach ($res as $cnt) 
	{
		$name = $cnt["name"];
		$group = $cnt["groupname"];
		
		$arCnt = array();
		$arCnt['user_id'] = get_GUID();
		$arCnt['group'] = $group;
		$arCnt['name'] = $name;
		$arCnt['fullname'] = $cnt["fullname"];
		$arCnt['groupinfo'] = $cnt["groupinfo"];
		$arCnt['membergroupname'] = $cnt["membergroupname"];
		$arCnt['membergroupfullname'] = $cnt["membergroupfullname"];
		$arCnt['sortnum'] = $cnt["sortnum"];
		$arCnt['activedate'] = ($cnt["activedate"] == '0001-01-01T00:00:00.0000000')?(''):($cnt["activedate"]);
		$arCnt['photo'] = ($cnt["photo_id"] == '')?(''):('/my/ajax/files.php?a=prev&i='.$cnt["photo_id"]);

		$arContacts[$group][$name] = $arCnt;
		if(!(array_key_exists($group, $arGroups)))
		{
			$arGr = array();
			$arGr['group'] = $group;
			$arGr['groupinfo'] = $arCnt['groupinfo'];
			$arGr['sortnum'] = $arCnt['sortnum'];
			$arGroups[$group] = $arGr;
		}
		if(!($arCnt['activedate'] == "")) {
			$date = new DateTime($arCnt['activedate']);
			$cDate = $date->format('d.m.Y');
			
			if($cDate == $tDate) {
				$strDate = $date->format("H:i");}
			else {
				$strDate = $cDate;}
			
			$arCnt['strDate'] = $strDate;
			
			$strIndex = $arCnt['activedate'].'_'.$arCnt['fullname'];
			$lastContacts[$strIndex] = $arCnt;
		}	
	}
//}
krsort($lastContacts);
if(!(array_key_exists('Канал общих контактов', $arGroups)))
{
	$arGr = array();
	$arGr['group'] = 'Канал общих контактов';
	$arGr['groupinfo'] = 'General channel (unsorted)';
	$arGr['sortnum'] = -15;
	$arGroups['Канал общих контактов'] = $arGr;
}
if(!(array_key_exists('Канал личных контактов', $arGroups)))
{
	$arGr = array();
	$arGr['group'] = 'Канал личных контактов';
	$arGr['groupinfo'] = 'Personal contacts channel';
	$arGr['sortnum'] = -12;
	$arGroups['Канал личных контактов'] = $arGr;
}

if(!(array_key_exists('Канал приглашенных контактов', $arGroups)))
{
	$arGr = array();
	$arGr['group'] = 'Канал приглашенных контактов';
	$arGr['groupinfo'] = 'Invited contacts channel';
	$arGr['sortnum'] = -10;
	$arGroups['Канал приглашенных контактов'] = $arGr;
}
if(!(array_key_exists('Канал Teleport', $arGroups)))
{
	$arGr = array();
	$arGr['group'] = 'Команда Teleport';
	$arGr['groupinfo'] = 'Teleport channel';
	$arGr['sortnum'] = 990;
	$arGroups['Команда Teleport'] = $arGr;
}
if(!(array_key_exists('Канал заблокированных контактов', $arGroups)))
{
	$arGr = array();
	$arGr['group'] = 'Канал заблокированных контактов';
	$arGr['groupinfo'] = 'Blocked contacts channel';
	$arGr['sortnum'] = 999;
	$arGroups['Канал заблокированных контактов'] = $arGr;
}
uasort($arGroups, 'arSortByNum');
/*else
{
	echo $TLP_obj->mistakes[$res["errCode"]];
}*/
?>
					<h3 id="invitings" style="z-index: 10;" class="close_list">Приглашения
						<br><span class="cnt_add" style="font-weight: normal;">Запросы на приглашения</span>
					</h3>
					<div id="cnt_short_invite" class="contact_short" style="display: none;">
					</div>
					<h3 id="last_cnt" style="z-index: 10;">Контакты
						<br><span class="cnt_add" style="font-weight: normal;">Recent</span>
					</h3>
					<div style="z-index: 10;" class="contact_short">
						<?
						$cnt_classname ='';
						$active_cnt = '';
						foreach ($lastContacts as $key=>$cnt)
						{
							if($cnt['fullname']=='') {
								$usr_fullname = $cnt["name"]; }
							else {
								$usr_fullname = $cnt['fullname']; }
							
							if($_GET["cnt"]==$cnt["name"]) {
								$cnt_classname = 'active_contact_inf';
								$active_cnt = $cnt;
							}
							else {
								$cnt_classname = 'contact_inf';
							}
						?>
							
							<div id="lst_<?=$cnt['user_id']?>" class="<?=$cnt_classname;?>" data-usr-id="<?=$cnt['user_id']?>" data-usr-name="<?=$cnt['name']?>" data-usr-fullname="<?=$usr_fullname?>" data-usr-activedate="<?=$cnt['activedate'];?>" data-usr-index="<?=mb_strtolower($cnt['name'],'UTF-8').'_ins_'.mb_strtolower($cnt['fullname'],'UTF-8')?>">
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
												<?echo $usr_fullname;?>
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
						<?}?>
					</div>	
				<div id="m_cnt_list">
				<?
				foreach ($arGroups as $val_group)
				{
					if($val_group['sortnum'] == -5 || $val_group['sortnum'] == -10 || $val_group['sortnum'] == 990) {
						$drop = '';
					}
					else {
						$drop = ' tl_droppable';
					}
					
					if(count($lastContacts) > 9) {
						$gr_class = "close_list";
						$cnt_display = "none";
					}
					else {
						$gr_class = "";
						$cnt_display = "block";
					}
				?>
				
				<div class="group_block">
				<h3 class="<?=$gr_class;?><?=$drop;?>" data-group="<?=mb_strtolower($val_group['group'], 'UTF-8');?>" data-group-name="<?=$val_group['group'];?>" data-srtnum="<?=$val_group['sortnum'];?>"><?=$val_group['group'];?>
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
					<div id="cnt_short" class="contact_short" style="display: <?=$cnt_display;?>;">
						<?$arGroup_cnt = $arContacts[$val_group['group']];
						foreach ($arGroup_cnt as $key=>$cnt)
						{
							if($cnt['fullname']=='')
							{
								$usr_fullname = $cnt["name"];
							}
							else 
							{
								$usr_fullname = $cnt['fullname'];
							}
							if($cnt['sortnum'] == -5 || $cnt['sortnum'] == -10 || $cnt['sortnum'] == 990) {
								$drop = '';
								$drag = '';
							}
							else {
								$drop = ' tl_droppable';
								$drag = ' tl_draggable';
							}
							
							if(($_GET["cnt"]==$cnt["name"]) && ($active_cnt == '')) {
								$cnt_classname = 'active_contact_inf';
								$active_cnt = $cnt;
							}
							else {
								$cnt_classname = 'contact_inf';
							}
							
						?>
							
							<div id="cnt_<?=$cnt['user_id']?>" class="<?=$cnt_classname;?><?=$drag;?><?=$drop;?>" data-usr-id="<?=$cnt['user_id']?>" data-usr-name="<?=$cnt['name']?>" data-usr-fullname="<?=$usr_fullname?>" data-group="<?=mb_strtolower($cnt['group'], 'UTF-8');?>" data-group-name="<?=$cnt['group'];?>" data-usr-activedate="<?=$cnt['activedate'];?>" data-usr-index="<?=mb_strtolower($cnt['name'],'UTF-8').'_ins_'.mb_strtolower($cnt['fullname'],'UTF-8')?>">
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
												<?echo $usr_fullname;?>
											</div>
											<p class="cnt_add cnt_mail">
												<?if(!($cnt["name"] == $usr_fullname)) {
													echo $cnt["name"];
												}?>
											</p>
											<?
												$cnt_groupname = $cnt["membergroupfullname"];
												if($cnt_groupname==''){$cnt_groupname = $cnt["membergroupname"];} 
												/*if($cnt_groupname==''){$cnt_groupname = $cnt['group'];}*/
											?>
											<p class="cnt_add"><?=$cnt_groupname;?></p>
										</td>	
									</tr>	
								</table>
								<div class="new_msg" title="Непрочитанные сообщения"><span>99</span></div>
								<div class="new_ord" title="Новые заказы"><span>99</span></div>
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
						<?}
						if(count($arGroup_cnt) == 0 && ($val_group['group']=='Канал общих контактов' || $val_group['group']=='Канал личных контактов')) {
							?>
							<div class="empty_group tl_droppable">
								Перетащите нужные контакты в этот канал
								<br>
							</div>
						<?}
						?>
					</div>
					</div>					
				<?}?>	
				</div>