$(document).ready(function(e)
{	
	var msg_contact = undefined;
	$('.up_pan .up_add_menu .menu_content').remove();
	$('#contact_filter, #exp_filter').css('display','none');
	$('#contact_filter, #exp_filter').off();
	hideExtPan();
	$('#cur_contact').html('');
});
