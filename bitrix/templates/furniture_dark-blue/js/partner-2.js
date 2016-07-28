$('#cnt_view').on('click', '#cnt_company_dld', function(e){
	var $fields = ['name', 'INN', 'KPP', 'OGRN', 'account', 'bank', 'BIK', 'coraccount', 'address', 'phone', 'chief', 'buh'];
	var $url = '/my/ajax/generate-xls.php?';
	var $obj;

	for (var i = 0; i < $fields.length; i++) {
		if($fields[i] == 'name')
			$obj = $('#cnt_company_card').find('#inf_company');
		else
			$obj = $('#cnt_company_card').find('#inf_company' + '_' + $fields[i]);
		
		if($obj.length){
			$url += ('&' + $fields[i] + '=' + encodeURIComponent($obj.val()));
		}
	}
	
	location.href = $url;																										
});