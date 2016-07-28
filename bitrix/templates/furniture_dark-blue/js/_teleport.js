//	Begin of добавлен обработчик для выбора логотипа организации(функция ContactInfoView())
$('#cnt_view #cnt_logo').on('click',function(e){																			
	if($(e.target).parents().is('#add_photo')) {
		e.stopPropagation();
		var fform = document.forms['fs_logo'];
		fform['filename'].click();

		if($('#cnt_view #cnt_info_save').css('display') == 'none') {
			$('#cnt_view #cnt_info_save').css('display','block');
		}
	}
	else if($(e.target).parents().is('#clear_photo')) {
		e.stopPropagation();
		$('#cnt_logo img').attr('src', '/include/no_avatar.svg');
		$('#cnt_logo img').attr('data-change', "2");
		$('#cnt_logo img').attr('data-width', 0);
		$('#cnt_logo img').attr('data-height', 0);
		
		if($('#cnt_view #cnt_info_save').css('display') == 'none') {
			$('#cnt_view #cnt_info_save').css('display','block');
		}
	}
	else {
		var strPhoto = '<div class="modal_back back_curt"></div><div id="detail_photo" class="modal_window">' +
			'<div class="close_line"><div class="clw"><img style="height: 18px;" src="/include/close_window.png"/></div></div>'+
			'<img src="'+$(this).find('img').attr('src')+'" style="max-height: 600px;"/>'+
			'</div>';
		$('#main_content').append(strPhoto);
		$('#detail_photo img').css('max-height', $('#content').height() - 80);
		$('#detail_photo').css('left', ($('#content').width() - $('#detail_photo').width())/2);
		showModalWindow($('#detail_photo'));
	}
});
//	End of добавлен обработчик для выбора логотипа организации(функция ContactInfoView())

$('#cnt_view #cnt_company_info').on('click',function(e){
	e.stopPropagation();
	$('#cnt_view #buttons').hide(0);
	$('#cnt_view #cnt_info_body').hide(0);
	$('#cnt_view #cnt_company_card').show(0);

	$('#cnt_view #cnt_photo').hide(0, function(){												// переключиться
		$('#cnt_view #cnt_logo').show(300);																// с photo
	});																																	// на logo
});

$('#cnt_view #back_main').on('click',function(e){
	e.stopPropagation();
	$('#cnt_view #cnt_company_card').hide(0);
	$('#cnt_view #cnt_settings').hide(0);
	$('#cnt_view #cnt_addings').hide(0);
	$('#cnt_view #cnt_info_body').show(0);
	$('#cnt_view #buttons').show(0);

	$('#cnt_view #cnt_logo').hide(0, function(){													// переключиться 
		$('#cnt_view #cnt_photo').show(300);																// с logo 
	});																																		// на photo
});

$('#cnt_view #nav-back').on('click',function(e){
	e.stopPropagation();
	$('#cnt_view #cnt_company_card').hide(0);
	$('#cnt_view #cnt_settings').hide(0);
	$('#cnt_view #cnt_addings').hide(0);
	$('#cnt_view #cnt_gallery').hide(0);																	// Прячем галерею
	$('#cnt_view #cnt_info_body').show(0);
	$('#cnt_view #buttons').show(0);
});