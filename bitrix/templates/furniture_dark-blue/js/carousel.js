$('#cnt_view #cnt_info_gallery').click(function(e) {
	function resetCarouselEventListener(){
		$('.thumbnail').off();
		$('.thumbnail').on('click', function(e){
			var bgi = $(this).css('background-image');
			bgi = bgi.replace('url("','').replace('")','');
			obj = $('\
				<div class="modal_back back_curt" style="z-index: 10500;"></div>\
				<div class="modal_window" id="fullsize-window">\
					<div class="thumbnail-fullsize" style="background-image: url(' + encodeURI(bgi) + '); background-size: cover;"></div>\
				</div>');

			$('#cnt_view').append(obj);

			showModalWindow($('#fullsize-window'));
		});
	}

	e.stopPropagation();

	$('#cnt_view #buttons').hide(0);
	$('#cnt_info_body').hide(0);
	$('#cnt_company_card').hide(0);
	$('#cnt_gallery').show('fast');

	resetCarouselEventListener();

	$('.nav-left').on('click', function(e){
		$(".thumbnail").eq(-1).clone().prependTo($(".carousel-wrapper")).on('click', function(e){
			var bgi = $(this).css('background-image');
			bgi = bgi.replace('url("','').replace('")','');
			obj = $('\
				<div class="modal_back back_curt" style="z-index: 10500;"></div>\
				<div class="modal_window" id="fullsize-window">\
					<div class="thumbnail-fullsize" style="background-image: url(' + encodeURI(bgi) + '); background-size: cover;"></div>\
				</div>');

			$('#cnt_view').append(obj);

			showModalWindow($('#fullsize-window'));
		}); 
		$(".carousel-wrapper").css({ left: "-150px" });
		$(".thumbnail").eq(-1).remove();
		$(".carousel-wrapper").animate({ left: "0px"}, 200, "linear");
	});

	$('.nav-right').on('click', function(e){
		  $(".carousel-wrapper").animate({left: "-150px"}, 200, function(){
			$(".thumbnail").eq(0).clone().appendTo($(".carousel-wrapper")).on('click', function(e){
				var bgi = $(this).css('background-image');
				bgi = bgi.replace('url("','').replace('")','');
				obj = $('\
					<div class="modal_back back_curt" style="z-index: 10500;"></div>\
					<div class="modal_window" id="fullsize-window">\
						<div class="thumbnail-fullsize" style="background-image: url(' + encodeURI(bgi) + '); background-size: cover;"></div>\
					</div>');

				$('#cnt_view').append(obj);

				showModalWindow($('#fullsize-window'));
			}); 
	    $(".thumbnail").eq(0).remove(); 
	    $(".carousel-wrapper").css({ left: "0px"}); 
	 	});	
	});
});