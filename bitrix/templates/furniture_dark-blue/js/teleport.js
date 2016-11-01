var doc_title = document.title;
var changeTitle = null;

//General functions
function  getPageSize(){
	   var xScroll, yScroll;

	   if (window.innerHeight && window.scrollMaxY) {
			   xScroll = document.body.scrollWidth;
			   yScroll = window.innerHeight + window.scrollMaxY;
	   } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
			   xScroll = document.body.scrollWidth;
			   yScroll = document.body.scrollHeight;
	   } else if (document.documentElement && document.documentElement.scrollHeight > document.documentElement.offsetHeight){ // Explorer 6 strict mode
			   xScroll = document.documentElement.scrollWidth;
			   yScroll = document.documentElement.scrollHeight;
	   } else { // Explorer Mac...would also work in Mozilla and Safari
			   xScroll = document.body.offsetWidth;
			   yScroll = document.body.offsetHeight;
	   }

	   var windowWidth, windowHeight;
	   if (self.innerHeight) { // all except Explorer
			   windowWidth = self.innerWidth;
			   windowHeight = self.innerHeight;
	   } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
			   windowWidth = document.documentElement.clientWidth;
			   windowHeight = document.documentElement.clientHeight;
	   } else if (document.body) { // other Explorers
			   windowWidth = document.body.clientWidth;
			   windowHeight = document.body.clientHeight;
	   }

	   // for small pages with total height less then height of the viewport
	   if(yScroll < windowHeight){
			   pageHeight = windowHeight;
	   } else {
			   pageHeight = yScroll;
	   }

	   // for small pages with total width less then width of the viewport
	   if(xScroll < windowWidth){
			   pageWidth = windowWidth;
	   } else {
			   pageWidth = xScroll;
	   }

	   return [pageWidth,pageHeight,windowWidth,windowHeight];
}

function getStringFromDate(objDate) {

	var formated_date = objDate.getFullYear() + '-' + ('0' + (objDate.getMonth() + 1)).slice(-2) + '-' + ('0' + objDate.getDate()).slice(-2) + "T" + ('0' + objDate.getHours()).slice(-2) + ':' + ('0' + objDate.getMinutes()).slice(-2) + ':' + ('0' + objDate.getSeconds()).slice(-2) + '.' + objDate.getMilliseconds();// + '+03:00';
	return formated_date;
}
function getUserStringFromDate(objDate) {

	var formated_date = ('0' + objDate.getDate()).slice(-2) + '-' + ('0' + (objDate.getMonth() + 1)).slice(-2) + '-' + objDate.getFullYear();
	return formated_date;
}
function getUserDateFromString(strDate) {
	objDate = new Date(strDate + '+03:00');
	var formated_date = ('0' + objDate.getDate()).slice(-2) + '-' + ('0' + (objDate.getMonth() + 1)).slice(-2) + '-' + objDate.getFullYear();
	return formated_date;
}
function getTimeStringFromDate(objDate) {
	var formated_date = ('0' + objDate.getHours()).slice(-2) + ':' + ('0' + objDate.getMinutes()).slice(-2);// + ':' + ('0' + objDate.getSeconds()).slice(-2);
	return formated_date;
}
function getDateFromString(strDate) {
	objDate = new Date(strDate + '+03:00');
	return objDate;
}

function getChar(event) {
  if (event.which == null) { // IE
    if (event.keyCode < 32) return null; 
    return String.fromCharCode(event.keyCode)
  }

  if (event.which != 0 && event.charCode != 0) { 
    if (event.which < 32) return null;
    return String.fromCharCode(event.which); 
  }
  return null; // спец. символ
}
function validateURL(textval) {
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}

function showError(err_text) {
	str_errBox = '<div id="error_box" class="error_box"></div>';
	if($('#error_box').length == 0) {
		$('#main_content').append(str_errBox);
	}
	var win_ID = 'err_'+$('#error_box .modal_window').length;
	str='<div id="'+win_ID+'" class="modal_window" style="position: relative;">' +
		'<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>' +
		'<svg style="position: absolute; top: 3px; left: 5px;" fill="#FF0000" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>'+
		'<p id="error_inf">' + err_text + '</p>' +
		'</div>';
	$('#error_box').append(str);
	showModalWindow($('#'+win_ID));
	setTimeout("hideModalWindow($('#"+win_ID+"'))", 10000);
}
function showMessageBox(html_text, timeoout) {
	str='<div class="modal_window msgInfo_box">' +
		'<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>' +
		'<div style="width: 100%;">' + html_text + '</div>' +
		'</div>';
	if($('.msgInfo_box').length == 0) {
		$('#main_content').append(str);
	}
	else {
		$('.msgInfo_box').replaceWith(str);
	}
	showModalWindow($('.msgInfo_box'));
	if(timeoout != 0) {
		setTimeout("hideModalWindow($('.msgInfo_box'))", timeoout);
	}	
}
function showModalWindow(obj) {
	obj.show(300);
	obj.find('.clw').click(function() {
		if ($(this).parent().parent().prev('div').hasClass('modal_back')) {
			$(this).parent().parent().prev('div').remove();
		}	
		$(this).parent().parent().hide(100);
		$(this).parent().parent().remove();
		//RB
		hideCtxChannelMenu($('#ctx-channel-menu'));
		hideSelectedList();
		hideContactMoveList();
		//RB
		
	});
}
function hideModalWindow(obj) {
	obj.hide(300);
	obj.remove();
}
function showExtPan() {
	$("#ext_pan").width(300);
	$("#ext_pan .pan_bar").css('right', 303);
	$("#ext_pan .pan_bar").text('>');
	
	$("#ext_pan").css('display','block');
	//$("#mess_list").css("maxWidth", $(".workspace").width()-$("#contacts").width()-$("#ext_pan").width()-2);
	$(window).trigger('resize');
}
function hideExtPan() {
	$("#ext_pan").css('display','none');
	$("#ext_pan").width(0); 
	$("#ext_pan .pan_bar").css('right', 0);
	$("#ext_pan .pan_bar").text('<');
	
	//$("#mess_list").css("maxWidth", $(".workspace").width()-$("#contacts").width()-$("#ext_pan").width()-2);	
	$('#it_extsearch').removeClass('ext_selected');
	$('#ext_pan_header_content').html('');
	$('#ext_pan_content').html('');
	$('#ext_pan_content').off();
	$(window).trigger('resize');
}
function expandExtPan() {
	if($("#ext_pan").width() > 0) {
		$("#ext_pan").width(0);
		$("#ext_pan .pan_bar").css('right', 0);
		$("#ext_pan .pan_bar").text('<');
		/*$("#ext_pan").animate({width: 0},100);
		$("#ext_pan .pan_bar").animate({right: 0},100, function() {
					$("#mess_list").css("maxWidth", $(".workspace").width()-$("#contacts").width()-$("#ext_pan").width()-2);
		});*/
	}
	else {
		$("#ext_pan").width(300);
		$("#ext_pan .pan_bar").css('right', 303);
		$("#ext_pan .pan_bar").text('>');
		/*$("#ext_pan").animate({width: 300},100);
		$("#ext_pan .pan_bar").animate({right: 303},100, function() {
					$("#mess_list").css("maxWidth", $(".workspace").width()-$("#contacts").width()-$("#ext_pan").width()-2);
		});*/
	}	
	//$("#mess_list").css("maxWidth", $(".workspace").width()-$("#contacts").width()-$("#ext_pan").width()-2);
	$(window).trigger('resize');
}
function expandRightPan() {
	if($("#contacts").width() > 0) {
		$("#contacts").animate({width: 0},100);
		$("#contacts .pan_bar").animate({left: 0},100, function() {
					//$("#mess_list").css("maxWidth", $(".workspace").width()-$("#contacts").width()-$("#ext_pan").width()-2);
					$(window).trigger('resize');
		});
		$("#contacts .pan_bar").text('>');
	}
	else {
		$("#contacts").animate({width: 300},100);
		$("#contacts .pan_bar").animate({left: 303},100, function() {
					//$("#mess_list").css("maxWidth", $(".workspace").width()-$("#contacts").width()-$("#ext_pan").width()-2);
					$(window).trigger('resize');
		});
		$("#contacts .pan_bar").text('<');
	}	
}



function newsSound() {
	/*var audio = new Audio(); 
	audio.src = '/my/data/snd/new_msg.mp3'; 
	audio.autoplay = true;*/
}	
function htmlspecialchars(text) {
  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}
function encodeString(str) {
	if(str == undefined) {
		return "";
	}	
	
	var fname = str.replace(new RegExp("@",'g'),'\\@');
	fname = fname.replace(new RegExp("\\.",'g'),'\\.');
	fname = fname.replace(new RegExp(" ",'g'),'\\ ');
	return fname;
}
function getFileType(ftype) {
	var type_str;
	var type = ftype.toLowerCase();
	var img_type = false;
	var svg_icon = '<svg fill="#777777" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">'+
			'<path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>'+
			'<path d="M0 0h24v24H0z" fill="none"/></svg>';
	if(type=='doc' || type=='docx') {
		type_str = 'Документ Word';
		svg_icon = '<svg width="36" height="36" viewBox="6 20 110 46" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
					'<g id="word">' +
						'<path fill="#2a5699" d=" M 67.02 0.00 L 73.00 0.00 C 73.00 2.67 73.00 5.33 73.00 8.00 C 83.70 8.06 94.39 7.89 105.08 8.06 C 107.36 7.83 109.15 9.60 108.94 11.88 C 109.11 31.58 108.90 51.29 109.04 70.99 C 108.94 73.01 109.24 75.25 108.07 77.04 C 106.61 78.08 104.72 77.95 103.02 78.03 C 93.01 77.98 83.01 78.00 73.00 78.00 C 73.00 80.67 73.00 83.33 73.00 86.00 L 66.75 86.00 C 51.53 83.22 36.27 80.67 21.02 78.00 C 21.01 54.67 21.02 31.34 21.02 8.02 C 36.35 5.34 51.69 2.73 67.02 0.00 Z" />'+
						'<path fill="#ffffff" d=" M 73.00 11.00 C 84.00 11.00 95.00 11.00 106.00 11.00 C 106.00 32.33 106.00 53.67 106.00 75.00 C 95.00 75.00 84.00 75.00 73.00 75.00 C 73.00 72.33 73.00 69.67 73.00 67.00 C 81.67 67.00 90.33 67.00 99.00 67.00 C 99.00 65.67 99.00 64.33 99.00 63.00 C 90.33 63.00 81.67 63.00 73.00 63.00 C 73.00 61.33 73.00 59.67 73.00 58.00 C 81.67 58.00 90.33 58.00 99.00 58.00 C 99.00 56.67 99.00 55.33 99.00 54.00 C 90.33 54.00 81.67 54.00 73.00 54.00 C 73.00 52.33 73.00 50.67 73.00 49.00 C 81.67 49.00 90.33 49.00 99.00 49.00 C 99.00 47.67 99.00 46.33 99.00 45.00 C 90.33 45.00 81.67 45.00 73.00 45.00 C 73.00 43.33 73.00 41.67 73.00 40.00 C 81.67 40.00 90.33 40.00 99.00 40.00 C 99.00 38.67 99.00 37.33 99.00 36.00 C 90.33 36.00 81.67 36.00 73.00 36.00 C 73.00 34.33 73.00 32.67 73.00 31.00 C 81.67 31.00 90.33 31.00 99.00 31.00 C 99.00 29.67 99.00 28.33 99.00 27.00 C 90.33 27.00 81.67 27.00 73.00 27.00 C 73.00 25.33 73.00 23.67 73.00 22.00 C 81.67 22.00 90.33 22.00 99.00 22.00 C 99.00 20.67 99.00 19.33 99.00 18.00 C 90.33 18.00 81.67 18.00 73.00 18.00 C 73.00 15.67 73.00 13.33 73.00 11.00 Z" />'+
						'<path fill="#ffffff" d=" M 41.68 28.67 C 43.58 28.56 45.48 28.48 47.38 28.38 C 48.71 35.13 50.07 41.87 51.51 48.59 C 52.64 41.65 53.89 34.73 55.10 27.80 C 57.10 27.73 59.10 27.62 61.09 27.50 C 58.83 37.19 56.85 46.96 54.38 56.59 C 52.71 57.46 50.21 56.55 48.23 56.69 C 46.90 50.07 45.35 43.49 44.16 36.84 C 42.99 43.30 41.47 49.70 40.13 56.12 C 38.21 56.02 36.28 55.90 34.35 55.77 C 32.69 46.97 30.74 38.23 29.19 29.41 C 30.90 29.33 32.62 29.26 34.33 29.20 C 35.36 35.57 36.53 41.91 37.43 48.29 C 38.84 41.75 40.28 35.21 41.68 28.67 Z" />'+
					'</g></svg>';

	}
	else if(type=='xls' || type=='xlsx') {
		type_str = 'Таблица Excel';
		svg_icon = '<svg width="36" height="36" viewBox="106 20 110 46" version="1.1" xmlns="http://www.w3.org/2000/svg">'+
						'<g id="excel">'+
							'<path fill="#207245" d=" M 167.06 0.00 L 173.00 0.00 C 173.00 2.67 173.00 5.33 173.00 8.00 C 183.01 8.00 193.02 8.02 203.03 7.97 C 204.72 8.04 206.58 7.92 208.05 8.93 C 209.08 10.41 208.96 12.29 209.03 13.99 C 208.98 31.35 209.00 48.70 209.01 66.05 C 208.96 68.96 209.28 71.93 208.67 74.80 C 208.27 76.88 205.77 76.93 204.10 77.00 C 193.74 77.03 183.37 76.98 173.00 77.00 C 173.00 80.00 173.00 83.00 173.00 86.00 L 166.79 86.00 C 151.55 83.23 136.28 80.67 121.02 78.00 C 121.02 54.67 121.02 31.34 121.02 8.01 C 136.37 5.34 151.72 2.71 167.06 0.00 Z" />'+
							'<path fill="#ffffff" d=" M 173.00 11.00 C 184.00 11.00 195.00 11.00 206.00 11.00 C 206.00 32.00 206.00 53.00 206.00 74.00 C 195.00 74.00 184.00 74.00 173.00 74.00 C 173.00 72.00 173.00 70.00 173.00 68.00 C 175.67 68.00 178.33 68.00 181.00 68.00 C 181.00 65.67 181.00 63.33 181.00 61.00 C 178.33 61.00 175.67 61.00 173.00 61.00 C 173.00 59.67 173.00 58.33 173.00 57.00 C 175.67 57.00 178.33 57.00 181.00 57.00 C 181.00 54.67 181.00 52.33 181.00 50.00 C 178.33 50.00 175.67 50.00 173.00 50.00 C 173.00 48.67 173.00 47.33 173.00 46.00 C 175.67 46.00 178.33 46.00 181.00 46.00 C 181.00 43.67 181.00 41.33 181.00 39.00 C 178.33 39.00 175.67 39.00 173.00 39.00 C 173.00 37.67 173.00 36.33 173.00 35.00 C 175.67 35.00 178.33 35.00 181.00 35.00 C 181.00 32.67 181.00 30.33 181.00 28.00 C 178.33 28.00 175.67 28.00 173.00 28.00 C 173.00 26.67 173.00 25.33 173.00 24.00 C 175.67 24.00 178.33 24.00 181.00 24.00 C 181.00 21.67 181.00 19.33 181.00 17.00 C 178.33 17.00 175.67 17.00 173.00 17.00 C 173.00 15.00 173.00 13.00 173.00 11.00 Z" />'+
							'<path fill="#207245" d=" M 185.00 17.00 C 189.67 17.00 194.33 17.00 199.00 17.00 C 199.00 19.33 199.00 21.67 199.00 24.00 C 194.33 24.00 189.67 24.00 185.00 24.00 C 185.00 21.67 185.00 19.33 185.00 17.00 Z" />'+
							'<path fill="#ffffff" d=" M 150.64 26.37 C 152.90 26.21 155.17 26.07 157.44 25.96 C 154.77 31.43 152.09 36.90 149.37 42.35 C 152.12 47.95 154.93 53.51 157.69 59.11 C 155.28 58.97 152.88 58.82 150.47 58.65 C 148.77 54.48 146.70 50.45 145.48 46.09 C 144.12 50.15 142.18 53.98 140.62 57.96 C 138.43 57.93 136.24 57.84 134.05 57.75 C 136.62 52.72 139.10 47.65 141.75 42.65 C 139.50 37.50 137.03 32.45 134.71 27.33 C 136.91 27.20 139.11 27.07 141.31 26.95 C 142.80 30.86 144.43 34.72 145.66 38.73 C 146.98 34.48 148.95 30.48 150.64 26.37 Z" />'+
							'<path fill="#207245" d=" M 185.00 28.00 C 189.67 28.00 194.33 28.00 199.00 28.00 C 199.00 30.33 199.00 32.67 199.00 35.00 C 194.33 35.00 189.67 35.00 185.00 35.00 C 185.00 32.67 185.00 30.33 185.00 28.00 Z" />'+
							'<path fill="#207245" d=" M 185.00 39.00 C 189.67 39.00 194.33 39.00 199.00 39.00 C 199.00 41.33 199.00 43.67 199.00 46.00 C 194.33 46.00 189.67 46.00 185.00 46.00 C 185.00 43.67 185.00 41.33 185.00 39.00 Z" />'+
							'<path fill="#207245" d=" M 185.00 50.00 C 189.67 50.00 194.33 50.00 199.00 50.00 C 199.00 52.33 199.00 54.67 199.00 57.00 C 194.33 57.00 189.67 57.00 185.00 57.00 C 185.00 54.67 185.00 52.33 185.00 50.00 Z" />'+
							'<path fill="#207245" d=" M 185.00 61.00 C 189.67 61.00 194.33 61.00 199.00 61.00 C 199.00 63.33 199.00 65.67 199.00 68.00 C 194.33 68.00 189.67 68.00 185.00 68.00 C 185.00 65.67 185.00 63.33 185.00 61.00 Z" />'+
					'</g></svg>';
	}
	else if(type=='epf' || type=='erf') {
		type_str = 'Внешняя обработка 1С';
		svg_icon = '<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.0" width="36" height="36" id="svg3800" viewBox="-20 10 270 106">'+
					'<defs id="defs3803"/>'+
					'<g transform="translate(-79.672264,-27.000001)" id="g4042">'+
					'<path d="M 246.74997,123.25 C 234.32997,123.25 224.24997,113.16998 224.24997,100.74999 C 224.24997,88.329986 234.32997,78.249986 246.74997,78.249986 C 259.16997,78.249986 269.24997,88.329986 269.24997,100.74999 C 269.24997,100.74999 288.49996,100.74998 288.49996,100.74998 C 288.49996,77.703984 269.79596,58.999984 246.74996,58.999984 C 223.70397,58.999984 204.99997,77.703984 204.99997,100.74998 C 204.99997,123.79598 223.70397,142.49998 246.74996,142.49998 L 418.41484,142.49998 L 418.41484,123.25 L 246.74997,123.25 z" id="path4004" style="fill:#F5D43F;fill-rule:evenodd;stroke:none;stroke-width:0.95555556px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"/>'+
					'<path d="M 418.41484,173.49998 L 418.41484,152.99998 L 246.74997,152.99998 C 217.90797,152.99998 194.49998,129.59198 194.49998,100.74999 C 194.49998,71.907989 217.90797,48.49999 246.74997,48.49999 C 275.59197,48.49999 298.99997,71.907989 298.99997,100.74999 C 298.99997,100.74999 319.49997,100.74999 319.49997,100.74999 C 319.49997,60.591987 286.90797,27.999988 246.74997,27.999988 C 206.59197,27.999988 173.99997,60.591987 173.99997,100.74999 C 173.99997,140.90798 206.59197,173.49998 246.74997,173.49998 L 418.41484,173.49998 z" id="path4008" style="fill:#FF0000;fill-rule:evenodd;stroke:none;stroke-width:0.41148326px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"/>'+
					'</g>'+
					'<text x="261.32773" y="33" id="text4018" xml:space="preserve" style="font-size:36px;font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;text-align:start;line-height:125%;writing-mode:lr-tb;text-anchor:start;fill:#ff0000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;font-family:DejaVu Sans;-inkscape-font-specification:DejaVu Sans Bold">®</text>'+
					'<g transform="translate(-79.672264,-27.000001)" id="g4046">'+
					'<path d="M 111,174 L 111,76.000001 L 90.5,76.000001 L 90.5,56.000001 L 129.5,56.000001 L 129.5,174 L 111,174 z" id="path4038" style="fill:#F5D43F;fill-rule:evenodd;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"/>'+
					'<path d="M 111,48.000001 L 138,48.000001 L 138,174 L 157,174 L 157,27.000001 L 111,27.000001 L 111,48.000001 z" id="path4040" style="fill:#FF0000;fill-rule:evenodd;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"/>'+
					'</g></svg>';
	}
	else if(type=='pdf') {
		type_str = 'Документ PDF';
		svg_icon = '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="36" height="36" viewBox="0 0 642 790" id="svg3982" version="1.1" inkscape:version="0.47 r22583" sodipodi:docname="New document 10"><title id="title4059">PDF icon</title><defs id="defs3984"><inkscape:perspective sodipodi:type="inkscape:persp3d" inkscape:vp_x="0 : 526.18109 : 1" inkscape:vp_y="0 : 1000 : 0" inkscape:vp_z="744.09448 : 526.18109 : 1" inkscape:persp3d-origin="372.04724 : 350.78739 : 1" id="perspective3990"></inkscape:perspective><inkscape:perspective id="perspective3948" inkscape:persp3d-origin="0.5 : 0.33333333 : 1" inkscape:vp_z="1 : 0.5 : 1" inkscape:vp_y="0 : 1000 : 0" inkscape:vp_x="0 : 0.5 : 1" sodipodi:type="inkscape:persp3d"></inkscape:perspective><filter color-interpolation-filters="sRGB" inkscape:collect="always" id="filter9602"><feGaussianBlur inkscape:collect="always" stdDeviation="2.3770894" id="feGaussianBlur9604"></feGaussianBlur></filter><radialGradient inkscape:collect="always" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#linearGradient9550" id="radialGradient6547" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-0.3092196,1.4117378,-2.0409641,-0.4470404,4640.1869,-1163.9918)" cx="1723.8253" cy="1028.9956" fx="1723.8253" fy="1028.9956" r="62.5"></radialGradient><linearGradient id="linearGradient9550"><stop style="stop-color:#ffffff;stop-opacity:1" offset="0" id="stop9552"></stop><stop id="stop9558" offset="0.5" style="stop-color:#ffffff;stop-opacity:1"></stop><stop style="stop-color:#4d4d4d;stop-opacity:1" offset="1" id="stop9554"></stop></linearGradient><filter color-interpolation-filters="sRGB" inkscape:collect="always" id="filter9570"><feGaussianBlur inkscape:collect="always" stdDeviation="0.30133845" id="feGaussianBlur9572"></feGaussianBlur></filter><linearGradient inkscape:collect="always" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#linearGradient9574" id="linearGradient6549" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0.650652,0.1575299,-0.1575299,0.650652,1047.7501,-132.54964)" x1="1759.1475" y1="967.50891" x2="1783.5715" y2="952.44196"></linearGradient><linearGradient inkscape:collect="always" id="linearGradient9574"><stop style="stop-color:#f2f2f2;stop-opacity:1;" offset="0" id="stop9576"></stop><stop style="stop-color:#808080;stop-opacity:1" offset="1" id="stop9578"></stop></linearGradient>'+
				'<filter color-interpolation-filters="sRGB" inkscape:collect="always" id="filter6355"><feGaussianBlur inkscape:collect="always" stdDeviation="0.6431018" id="feGaussianBlur6357"></feGaussianBlur></filter><filter color-interpolation-filters="sRGB" inkscape:collect="always" id="filter6371"><feGaussianBlur inkscape:collect="always" stdDeviation="0.45057703" id="feGaussianBlur6373"></feGaussianBlur></filter></defs><sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.34794922" inkscape:cx="498.12128" inkscape:cy="314.2007" inkscape:document-units="px" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1280" inkscape:window-height="706" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1"></sodipodi:namedview><metadata id="metadata3987"><rdf:rdf><cc:work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"></dc:type><dc:title>PDF icon</dc:title></cc:work></rdf:rdf></metadata>'+
				'<g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(-50.695688,-61.548734)">'+
				'<g id="g6375" transform="matrix(6.0006409,-1.4961278,1.4961278,6.0006409,-12869.469,-1371.3936)" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\security.png" inkscape:export-xdpi="72.300003" inkscape:export-ydpi="72.300003">'+
				  '<path id="path9584" d="m 1982.9534,739.52917 -27.5678,113.86409 81.3315,19.69125 22.8221,-94.26322 -14.8553,-24.34646 -61.7305,-14.94566 z" style="fill:#000000;fill-opacity:1;stroke:none;filter:url(#filter9602)" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" inkscape:export-xdpi="72" inkscape:export-ydpi="72"></path>'+
				  '<path inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" id="rect8729" d="m 1982.9534,739.52917 -27.5678,113.86409 81.3315,19.69125 22.8221,-94.26322 -14.8553,-24.34646 -61.7305,-14.94566 z" style="fill:#e6e6e6;fill-opacity:1;stroke:none"></path>'+
				  '<path inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" style="opacity:0.6;fill:url(#radialGradient6547);fill-opacity:1;stroke:none" d="m 1982.9534,739.52917 -27.5678,113.86409 81.3315,19.69125 22.8221,-94.26322 -14.8553,-24.34646 -61.7305,-14.94566 z" id="path9548"></path>'+
				  '<path transform="matrix(0.650652,0.1575299,-0.1575299,0.650652,1033.6148,17.796449)" inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" style="fill:#666666;fill-opacity:1;stroke:none;filter:url(#filter9570)" d="m 1726.7115,714.69189 c 0,0 1.7858,3.76115 1.7858,5.78123 0,2.02206 -1.6072,24.35266 -1.6072,24.35266 0,0 20.7217,-1.60725 23.9062,-1.51786 3.1808,0.0893 6.049,1.51786 6.049,1.51786 l -30.1338,-30.13389 z" id="path9560" sodipodi:nodetypes="czczcc"></path>'+
				  '<path inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" sodipodi:nodetypes="czczcc" id="rect8731" d="m 2044.6781,754.47341 c 0,0 0.5696,2.72854 0.2513,4.0429 -0.3186,1.31565 -4.882,15.59195 -4.882,15.59195 0,0 13.7358,2.21851 15.7938,2.77835 2.0554,0.55917 3.6966,1.94047 3.6966,1.94047 l -14.8597,-24.35367 z" style="fill:url(#linearGradient6549);fill-opacity:1;stroke:none"></path>'+
				  '<rect transform="matrix(0.650652,0.1575299,-0.1575299,0.650652,1033.6148,17.796449)" inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" style="fill:#000000;fill-opacity:1;stroke:none;filter:url(#filter6355)" id="rect9536" width="64.64286" height="26.071428" x="1612.6516" y="743.59106" rx="8" ry="8"></rect>'+
				  '<rect transform="matrix(0.9719198,0.2353123,-0.2353123,0.9719198,0,0)" inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" ry="5.3556023" rx="5.3556023" y="271.50751" x="2088.1448" height="17.453522" width="43.275177" id="rect8748" style="fill:#d40000;fill-opacity:1;stroke:none"></rect>'+
				  '<text transform="matrix(0.650652,0.1575299,-0.1575299,0.650652,1033.6148,17.796449)" inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" xml:space="preserve" style="font-size:23.03644562px;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;text-align:center;line-height:100%;writing-mode:lr-tb;text-anchor:middle;fill:#000000;fill-opacity:1;stroke:none;filter:url(#filter6371);font-family:Arial;-inkscape-font-specification:Arial" x="1644.6559" y="764.7876" id="text8754" sodipodi:linespacing="100%"><tspan sodipodi:role="line" id="tspan8756" x="1644.6559" y="764.7876" style="font-size:23.03644562px;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;text-align:center;line-height:100%;writing-mode:lr-tb;text-anchor:middle;fill:#000000;font-family:Arial Unicode MS;-inkscape-font-specification:Arial Unicode MS">PDF</tspan></text>'+
				  '<text transform="matrix(0.9719198,0.2353123,-0.2353123,0.9719198,0,0)" inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" sodipodi:linespacing="100%" id="text8750" y="285.75388" x="2109.5608" style="font-size:15.42175865px;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;text-align:center;line-height:100%;writing-mode:lr-tb;text-anchor:middle;fill:#ffffff;fill-opacity:1;stroke:none;font-family:Arial;-inkscape-font-specification:Arial" xml:space="preserve"><tspan style="font-size:15.42175865px;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;text-align:center;line-height:100%;writing-mode:lr-tb;text-anchor:middle;font-family:Arial Unicode MS;-inkscape-font-specification:Arial Unicode MS" y="285.75388" x="2109.5608" id="tspan8752" sodipodi:role="line">PDF</tspan></text>'+
				  '<path inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" transform="matrix(0.1553211,0.1403559,-0.1403559,0.1553211,1895.9012,432.65483)" d="m 1667.1428,1059.1479 c -143.5128,190.5256 34.0545,212.2928 -59.1891,-7.2558 -93.2436,-219.54846 -200.8782,-76.65427 35.8782,-47.6313 236.7564,29.0229 166.8237,-135.63851 23.3109,54.8871 z" inkscape:randomized="0" inkscape:rounded="4" inkscape:flatsided="true" sodipodi:arg2="1.6927733" sodipodi:arg1="0.64557579" sodipodi:r2="17.214323" sodipodi:r1="34.428646" sodipodi:cy="1038.4336" sodipodi:cx="1639.6428" sodipodi:sides="3" id="path9546" style="fill:none;stroke:#800000;stroke-width:10;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;stroke-dashoffset:0" sodipodi:type="star"></path>'+
				'</g></g></svg>';
		
	}
	else if(type=='txt') {
		type_str = 'Текстовый Документ';
	}
	else if(type=='jpg' || type=='jpeg' || type=='png' || type=='tiff' || type=='gif' || type=='bmp') {
		type_str = 'Файл с картинкой';
		img_type = true;
	}
	else {
	type_str = type+' Файл';
	}
	return {'type': type_str, 'svg': svg_icon, 'ext': type, 'img': img_type};
}

function messagesRequest() {

	var xhr = new XMLHttpRequest();
	var body =	'action=msg_request' +
					'&contacts_request=true'+
					'&ui=' + encodeURIComponent(smuser.id) +
					'&auth_init=N';

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			$(".new_msg").css("display", "none");
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			try {
				if(!(xhr.responseText.indexOf('%%auth_failed%%') == -1)) {
					window.location.href = window.location.href;
				}
				else {
					var arResult = $.parseJSON(xhr.responseText);
				}	
			}	
			catch (err)	{
				return;
			}
			var cur_contact = getActiveContact();
			var cur_menu = $(".topmenu li.active").attr('id');
			var needSnd = false;
			
			var notify_messages = 0;
			var notify_orders = 0;
			var notify_requests = 0;
			var notify_title = "";
			var notify_text = "";
			var all_notifies = 0;
			
			arResult.forEach(function(rqobject, key){
				var req_type 		= rqobject.type;
				var req_quantity	= 0;

				if(req_type == 'request') {
					if($('#cnt_short_invite').find('[data-usr-name='+encodeString(rqobject.contact)+']').length == 0) {
						notifyInformation("Приглашение от \n" + rqobject.contact, rqobject.info);  
					}
					showContactRequests(rqobject.contact, rqobject.info);
					all_notifies = all_notifies + 1;
				}
				else {
					req_sender		= encodeString(rqobject.contact);
					req_quantity	= rqobject.quantity;
					req_prefix 		= (req_type == 'message')?('msg'):('ord');
					all_notifies 	= all_notifies + req_quantity;
					
					var new_msg_obj = $('[data-usr-name='+req_sender+']').first().find(".new_" + req_prefix);
					if(req_quantity > 0 && new_msg_obj.length != 0) {
						new_msg_obj.css("display", "block");
						if(!(new_msg_obj.first().find('span').text() == req_quantity)) {
							new_msg_obj.html("<span>" + req_quantity + "</span>");
							
							if(req_type == 'message') {	notify_messages = notify_messages + req_quantity;} 
							else { notify_orders = notify_orders + req_quantity;}

							if(notify_text == "") {
								notify_title = getContactInfo(rqobject.contact).fullname;
								notify_text = (req_type == 'message')?("Получено новое сообщение"+"\n"+"Всего новых ("+req_quantity+")"):("Оформлен заказ"+"\n"+"Всего новых ("+req_quantity+")");
							} else {
								notify_title = "Teleport";
								notify_text = "";
								if(notify_messages != 0) {
									notify_text = notify_text + "Получено "+notify_messages+" новых сообщений. \n";
								}	
								if(notify_orders != 0) {
									notify_text = notify_text + "Оформлено "+notify_orders+" новых заказов. \n";
								}	
							}
									
							moveContactRecentTop($('[data-usr-name='+req_sender+']').attr('data-usr-id'));
							needSnd = true;
						}
					}
					if(rqobject.new_msg || req_quantity > 0) { 
						if(rqobject.contact == cur_contact.name && cur_menu == 'm_messages') {
							getSelectedContactNewMessages();
						}
					}	
				}	
			});
			if(notify_text != "") {
				var notify_q = notify_messages + notify_orders;
				notifyInformation(notify_title, notify_text);  
				changeTitle = setInterval(
					function(){
						(document.title === doc_title) ? document.title='(' + all_notifies + ') Новое уведомление' : document.title=doc_title;
						}, 1000);
			}
			
			if(all_notifies != 0) {
				clearInterval(changeTitle);
				changeTitle = setInterval(
					function(){
						(document.title === doc_title) ? document.title='(' + all_notifies + ') Новое уведомление' : document.title=doc_title;
						}, 1000);
			} else {
				clearInterval(changeTitle);
				document.title = doc_title;
			}

			if(needSnd) {
				newsSound();
			}
			if(cur_menu == 'm_messages' && !(cur_contact.name == undefined)) {
				messagesGetNewStatus();
			}	
		}
		xhr.send(body);
}

//Contacts
function sendCntRequest(name, msg_text, obj) {
	if(name == '') {
		$('#new_cnt_confirm').html('Отправить');
		obj.find('cnt_inp').focus();
		showError("Не указано имя контакта");
		return;
	}
	var xhr = new XMLHttpRequest();
		var body =	'action=requestPerson' +
					'&adds=html' +
					'&message=' + encodeURIComponent(msg_text) +
					'&contact=' + encodeURIComponent(name);

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			$('#new_cnt_confirm').html('Отправить');
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			updateContactList('');
			if(!(obj == undefined)) {
				
				obj.find('.cnt_inp').val('');
				obj.slideUp(100);

				obj.parent().find('#new_cntresponse #new_cnttext').html(xhr.responseText);
				obj.parent().find('#new_cntresponse').slideDown(100);
			}	
		}
	xhr.send(body);
}
function ContactInfoView(name) {
		var xhr = new XMLHttpRequest();
		var body =	'action=getPersonInfo' +
					'&adds=html' +
					'&contact=' + encodeURIComponent(name);

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			
			hideModalWindow($('.modal_window').not('#cnt-manager').not('#squad-manager'));
			$('#main_content #cnt_view').remove();
			$('#main_content').append('<div id="cnt_view" class="modal_window"></div>');		
			var strwindow = '<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>';

			//var arInfo = jQuery.parseJSON(xhr.responseText);

			var str_html = strwindow + xhr.responseText;
			$('#cnt_view').append(str_html);
			showModalWindow($('#cnt_view'));
			$("#cnt_view #inf_phone").inputmask("+7(999) 999-99-99");
			$('#cnt_view #cnt_photo').on('click',function(e){
				if($(e.target).parents().is('#add_photo')) {
					e.stopPropagation();
					var fform = document.forms['fs_form'];
					fform['filename'].click();

					if($('#cnt_view #cnt_info_save').css('display') == 'none') {
						$('#cnt_view #cnt_info_save').css('display','block');
					}
				}
				else if($(e.target).parents().is('#clear_photo')) {
					e.stopPropagation();
					$('#cnt_photo img').attr('src', '/include/no_avatar.svg');
					$('#cnt_photo img').attr('data-change', "2");
					$('#cnt_photo img').attr('data-width', 0);
					$('#cnt_photo img').attr('data-height', 0);
					
					if($('#cnt_view #cnt_info_save').css('display') == 'none') {
						$('#cnt_view #cnt_info_save').css('display','block');
					}
					
				}
				else {
					/*var orig_width = $(this).find('img').attr('data-width');
					var orig_height = $(this).find('img').attr('data-height');
					if(orig_width == '' || orig_height == '')
					{return;}*/
					
					var strPhoto = '<div class="modal_back back_curt"></div><div id="detail_photo" class="modal_window">' +
						'<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>'+
						'<img src="'+$(this).find('img').attr('src')+'" style="max-height: 600px;"/>'+
						'</div>';
					$('#main_content').append(strPhoto);
					$('#detail_photo img').css('max-height', $('#content').height() - 80);
					$('#detail_photo').css('left', ($('#content').width() - $('#detail_photo').width())/2);
					showModalWindow($('#detail_photo'));
				}
			});

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
					$('#cnt_logo img').attr('src', '/include/no_logo.png');
					$('#cnt_logo img').attr('data-change', "2");
					$('#cnt_logo img').attr('data-width', 0);
					$('#cnt_logo img').attr('data-height', 0);
					
					if($('#cnt_view #cnt_info_save').css('display') == 'none') {
						$('#cnt_view #cnt_info_save').css('display','block');
					}
				}
				else {
					var strPhoto = '<div class="modal_back back_curt"></div><div id="detail_photo" class="modal_window">' +
						'<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>'+
						'<img src="'+$(this).find('img').attr('src')+'" style="max-height: 600px;"/>'+
						'</div>';
					$('#main_content').append(strPhoto);
					$('#detail_photo img').css('max-height', $('#content').height() - 80);
					$('#detail_photo').css('left', ($('#content').width() - $('#detail_photo').width())/2);
					showModalWindow($('#detail_photo'));
				}
			});

			$('#cnt_view #cnt_company_info').on('click',function(e){
				e.stopPropagation();
				$('#cnt_view #buttons').hide(0);
				$('#cnt_view #cnt_info_body').hide(0);
				$('#cnt_view #cnt_company_card').show(0);
				$('#cnt_view #cnt_photo').hide(0, function(){
						$('#cnt_view #cnt_logo').show(300);
					});
			});
			$('#cnt_view #back_main').on('click',function(e){
				e.stopPropagation();
				$('#cnt_view #cnt_company_card').hide(0);
				$('#cnt_view #cnt_settings').hide(0);
				$('#cnt_view #cnt_addings').hide(0);
				$('#cnt_view #cnt_filelist').hide(0);
				$('#cnt_view #cnt_info_body').show(0);
				$('#cnt_view #buttons').show(0);
				$('#cnt_view #cnt_logo').hide(0, function(){
					$('#cnt_view #cnt_photo').show(300);
				});
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
			$('#cnt_view .checkbox').click(function(e) {
				if($(this).hasClass('checkbox_disabled')) {
					return;
				}
				$(this).toggleClass('checkbox_clicked');
				if($(this).attr('id') == 'inf_delivery_possible') {
					$('#cnt_view #delivery_info').slideToggle();
				}
			});
			$('#cnt_view #cnt_info_settings').click(function(e) {
				e.stopPropagation();
				$('#cnt_view #buttons').hide(0);
				$('#cnt_view #cnt_info_body').hide(0);
				$('#cnt_view #cnt_settings').show(0);
			});
			$('#cnt_view #cnt_info_add').click(function(e) {
				e.stopPropagation();
				$('#cnt_view #buttons').hide(0);
				$('#cnt_view #cnt_info_body').hide(0);
				$('#cnt_view #cnt_addings').show(0);
			});
			$('#cnt_view .svd').keyup(function() {
				if($('#cnt_view #cnt_info_save').css('display') == 'none') {
					$('#cnt_view #cnt_info_save').css('display','block');
				}
			});
			$('#cnt_view .svd').click(function() {
				if ($(this).hasClass('checkbox')) {
					if($('#cnt_view #cnt_info_save').css('display') == 'none') {
						$('#cnt_view #cnt_info_save').css('display','block');
					}
				}
			});
			$('#cnt_view #cnt_info_save').click(function(e) {
				e.stopPropagation();
				var xhr = new XMLHttpRequest();
				var body =	'action=setPersonInfo' +
							'&adds=html&name='+encodeURIComponent(smuser.name);
				$('#cnt_view .svd').each(function() {
					if($(this).attr('id') === undefined) {
						return;
					}
					var this_id = $(this).attr('id').replace('inf_','');
					if($(this).hasClass('checkbox')) {
						var inf_value = ($(this).hasClass('checkbox_clicked'))?true:false;
					}
					else if(this_id == 'address') {
						body =	body + '&address_GPS='+ encodeURIComponent($(this).attr('data-crd'));
						var inf_value = $(this).find('pre').text();
					}
					else {
						var inf_value = $(this).val();
					}
					body =	body + '&'+this_id+'='+ encodeURIComponent(inf_value);
				});
				if($('#cnt_view #cnt_photo img').attr('data-change') == '1') {
					body =	body + '&photo='+ encodeURIComponent($('#cnt_view #cnt_photo img').attr('src'));
				}	
				else if($('#cnt_view #cnt_photo img').attr('data-change') == '2') {
					body =	body + '&photo=';
				}
				if($('#cnt_view #cnt_logo img').attr('data-change') == '1') {
					body =	body + '&company_logo='+ encodeURIComponent($('#cnt_view #cnt_logo img').attr('src'));
				}	
				else if($('#cnt_view #cnt_logo img').attr('data-change') == '2') {
					body =	body + '&company_logo=';
				}
				xhr.open("POST", '/my/ajax/action.php', true);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.onreadystatechange = function()	{ 
					if (xhr.readyState != 4) return;
					
					if(!(xhr.responseText.indexOf('%err%') == -1)) {
						showError(xhr.responseText.replace('%err%',''));
						return;
					}
					//try{
						var arResult = $.parseJSON(xhr.responseText);
						smuser.fullname = arResult.fullname;
						$('#login_block #login_image .cnt_avatar').css('background-image', 'url('+arResult.photo+')');
						$('#login_block #login_user').attr('data-usr-fullname', arResult.fullname);
						$('#login_block #login_user').attr('data-usr-index', smuser.name.toLowerCase()+'_ins_'+arResult.fullname.toLowerCase());
						$('#login_block #login_user').text(arResult.fullname);
					/*}	
					catch(e) {}*/
					showMessageBox("Сведения успешно сохранены", 7000);
					$('#cnt_view').hide(100);
					$('#cnt_view').remove();
				}
				xhr.send(body);
			});	
			$('#cnt_view #cnt_adress_map, #cnt_view #cnt_adress_map_edit').on('click',function(e){
				e.stopPropagation();
				$('#main_content #map_view').remove();
				
				var xhr = new XMLHttpRequest();
				var edit_mode = ($(this).attr('id') == 'cnt_adress_map_edit')?'false':'true';
				var body ='rd=' + edit_mode +
						'&contact=' + encodeURIComponent($('#cnt_view #cnt_info_main').attr('data-usr-flname'))+
						'&address=' + encodeURIComponent($(this).parent().find('pre').text());
						
				xhr.open("POST", '/my/ajax/ymap.php', true);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.onreadystatechange = function() 
				{ 
					if (xhr.readyState != 4) return;
			
					if(!(xhr.responseText.indexOf('%err%') == -1)) {
						showError(xhr.responseText.replace('%err%',''));
						return;
					}
					$('#main_content').append('<div class="modal_back back_curt"></div><div id="map_view" class="modal_window" style="display: block;"></div>');
					var strwindow = '<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>';
					var str_html = strwindow + xhr.responseText;
					
					$('#map_view').append(str_html);
					$('#map_view').css('height', $('#main_content').height() - 100);
					$('#map_view').css('left', ($('#main_content').width() - $('#map_view').width())/2);
					$('#map_view #map').css('height', $('#map_view').height() - 75);

					$('#map_view #map').find('input').css('background-color', '#444');
					showModalWindow($('#map_view'));
				}
				xhr.send(body);
				
			});	

			$('#cnt_view').on('click', '#cnt_info_docs' ,function() {
				SearchCntFiles();
			});
			$('#cnt_view').on('click', '#add_cntfile' ,function() {
				$(this).siblings('#uploadifive-cntfile_upl').children().last().click();
			});	

			$('#cnt_view').on('click', '#send_cntfile', function() {	
				alert('Файлы успешно загружены');
			});	
		}		
		xhr.send(body);
}

function SearchCntFiles() {
	var contact = $('#main_content #cnt_view #cnt_info_main').attr('data-usr-name');
	var xhr = new XMLHttpRequest();
	var body =	'action=filesList' +
				'&adds=json' +
				'&contact=' + encodeURIComponent(contact) +
				'&Category=userFiles';					
	xhr.open("POST", '/my/ajax/action.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() 
	{ 
		if (xhr.readyState != 4) return;
		
		if(!(xhr.responseText.indexOf('%err%') == -1)) {
			showError(xhr.responseText.replace('%err%',''));
			return;
		}
		try {
			var arResult = jQuery.parseJSON(xhr.responseText);
			requestCntFileBrowser(arResult);
		}	
		catch (err)	{
			showError('Не удалось получить список файлов. <br>Сбой операции <br> Повторите попытку позже');
			return;
		}		
	}				
	xhr.send(body);	
};
function requestCntFileBrowser(arResult) {	
	var contact = $('#main_content #cnt_view #cnt_info_main').attr('data-usr-name');
	var contactfn = $('#main_content #cnt_view #cnt_info_main').attr('data-usr-flname');
	
	$('#cnt_filelist_content').removeClass('border_block');
	$('#cnt_view #cnt_filelist_content').html('');
	$('#cnt_view #cnt_filelist_content').off();
	
	var files_html = '';
	
	var delete_svg = '<svg fill="#BBB" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
		'<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>'+
		'<path d="M0 0h24v24H0z" fill="none"/></svg>';

	var file_html = '<div class="msg_file uploadifive-queue-item"><div class="upfile" ><div class="file_icon"></div>'+
		'<div class="file_block"><p class="filename"></p>'+
		'<p class="file_info"></p></div>'+
		'<a class="del_file close"><div class="cloud">'+delete_svg+'</div></a>'+
		//'<div class="fileinfo">Готов к отправке</div>'+
		'<div class="progress"><div class="progress-bar"></div></div>'+
		'</div>';
		
	$(arResult).each(function(key, val){
		files_html = files_html + '<div class="msg_file">' + addCntFileToList(val, true) + '</div>';
	});	
	
	if (contact == smuser.name) {
		$('#cntfile_form').remove();
		var html_str = 	
				'<form id="cntfile_form" name="cntfile_form">' +	
					'<div id="add_cntfile">' +
						'<svg fill="#777" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">' +
							'<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>' +
							'<path d="M0 0h24v24H0z" fill="none"></path>' +
						'</svg>' +
						'<p>Добавить файл в профиль контакта</p>' +
						'<p style="font-size: 12px; font-weight: 400; font-style: italic;">\
							Ваши бланки договоров, сертификаты, пресс-релизы и прайс-листы все ваши контакты смогут свободно скачивать здесь и не отвлекать вас. (Макс. 60Мб каждый файл)\
						</p>'+
					'</div>' +
					'<div id="upload_cntfile" style="display:none">' +
						'<svg fill="#777" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">' +
							'<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>' +
							'<path d="M0 0h24v24H0z" fill="none"/>' +
						'</svg>' +
					'</div>' +
					'<div id="cnt-fileinfo"></div>' +
					'<input type="file" name="cntfile_upl" id="cntfile_upl" style="display: none;">' +
					'<input type="hidden" name="action" value="upload_cntfile">' +	
				'</form>';		
		$('#cnt_filelist .cnt_headline').append(html_str);
	} else if(files_html == '') {
		files_html = '<div id="empty_files">\
			Файлы в профиле контакта отсутствуют\
			<p style="font-size: 14px;font-weight: 400;font-style: italic;">\
				Не теряйте время на отправку необходимых шаблонов и документов.<br>\
				В файлах профиля можно выкладывать и безопасно хранить для своих контактов любые файлы. Бланки договоров, сертификаты, пресс-релизы, прайс-листы и многое другое, что необходимо для работы. <br>\
				Файлы будут доступны только вашим контактам.\
			</p>\
			</div>';
		$('#cnt_filelist_content').addClass('border_block');
	};
	
	$('#cnt_filelist_content').append(files_html);
	$('#cnt_filelist_content').wrapInner('<div class="scrolllist"></div>');	

	$('#cnt_view #buttons').hide(0);
	$('#cnt_view #cnt_info_body').hide(0);
	$('#cnt_filelist').show(0);
	
	$('#cnt_filelist_content').height($('#cnt_filelist').height() - $('#cnt_filelist .cnt_headline').height()-10);
	$('#cnt_filelist_content .scrolllist').slimScroll({height: 'auto', size: '7px', disableFadeOut: false});

	$('#cnt_filelist_content').on('click','.image_file .close_line svg',function(e) {	
		e.stopPropagation();
		var obj = $(this).parent().parent();
		obj.toggleClass('close_image');
		if(obj.hasClass('close_image')) {
			var im_svg =	'<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
								'<path d="M7 10l5 5 5-5z"/>'+
								'<path d="M0 0h24v24H0z" fill="none"/>'+
							'</svg>';
		}
		else {
			var im_svg = 	'<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
								'<path d="M7 14l5-5 5 5z"/>'+
								'<path d="M0 0h24v24H0z" fill="none"/>'+
							'</svg>';
		}
		$(this).replaceWith($(im_svg));
	});
	
	$(function() {	
		$("#cnt_filelist #cntfile_upl").uploadifive({
			'auto' : true,
			'uploadScript' : '/my/ajax/action.php',
			'buttonText' : '',
			'buttonClass' : 'filename_button',
			'dnd' : false,
			'queueID' : 'cnt-fileinfo',
			'fileSizeLimit' : '20MB',
			'uploadLimit' : 0,
			'queueSizeLimit' : 10,
			'simUploadLimit' : 0,
			'itemTemplate' : file_html,
			'formData': {'action': 'Files_Upload', 'Category': 'userFiles'},
			'onAddQueueItem': function(file_obj) {
				var file_name = file_obj.name;
				var fileUrl = file_name, parts, ext = ( parts = file_name.split("/").pop().split(".") ).length > 1 ? parts.pop() : "";
				var file_size = Math.round(file_obj.size/1024);
				var file_idat = getFileType(ext);
				var file_type = file_idat.type;
				var att_svg = file_idat.svg;
				var file_met = "KB";
				if(file_size > 1024) { 
					file_size = Math.round(file_size/1024);
					file_met = "MB";
				}		
				$('#cnt-fileinfo .msg_file .filename:contains('+encodeString(file_name)+')').each(function(key, value) {
					$(value).parent().parent().find('.file_icon').html(att_svg);
					$(value).next('p').html(file_size+file_met+' '+file_type);
				});
			},
			'onUploadComplete' : function(file, data) {
				console.log(data);
				$('#cnt-fileinfo').hide(100);
				var ext = ( parts = file.name.split("/").pop().split(".") ).length > 1 ? parts.pop() : "";
				var obj = {
					add_date: new Date(), 
					file_category: 'userFiles', 
					file_extention: ext, 
					file_id: '', 
					file_name: file.name, 
					file_size: file.size, 
					has_preview: false, 
					message_id: '', 
					public_access: false, 
					receiver: '',
					user_name: smuser.name
				};
				$('#cnt_filelist_content .scrolllist').prepend('<div class="msg_file">' + addCntFileToList(obj, true) + '</div>');
			},
			'onQueueComplete' : function() {
				
			}
		});
		$('#cnt_view').on('click', '#del-user-file', function(){
			var obj = $(this).parents('.upfile');
			var xhr = new XMLHttpRequest();
			var body =	'action=Files_Delete' +
						'&file_id=' + obj.attr('id').replace('fn_','');

			xhr.open("POST", '/my/ajax/action.php', true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() 
			{ 
				if (xhr.readyState != 4) return;
				
				if(!(xhr.responseText.indexOf('%err%') == -1)) {
					showError(xhr.responseText.replace('%err%',''));
					return;
				}
				console.log(xhr.responseText)
				obj.parent('.msg_file').remove();
			}
			xhr.send(body);
		});
	});	
};
function addCntFileToList(obj, hide_image) {
	var cloud_svg = '<svg fill="#CCCCCC" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">'+
		'<path d="M0 0h24v24H0z" fill="none"/>'+
		'<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>'+
		'</svg>	';
	var file_size = Math.round(obj.file_size/1024);
	var file_idat = getFileType(obj.file_extention);
	var file_type = file_idat.type;
	var att_svg = file_idat.svg;
	var file_url = '/my/ajax/files.php?a=detail&i='+obj.file_id;//$(this).attr('furl');
	var pvfile_url = '/my/ajax/files.php?a=prev&i='+obj.file_id;//$(this).attr('furl');
	var file_met = "KB";
	if(file_size > 1024) { 
		file_size = Math.round(file_size/1024);
		file_met = "MB";
	}
	var img_str = "";	
	var hide_class = (hide_image)?(' close_image'):('');
	if(file_idat.img) {
		img_str = '<div class="image_file'+hide_class+'">' +
		'<div class="close_line">'+
		'<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'+
		'<path d="M7 10l5 5 5-5z"/>'+
		'<path d="M0 0h24v24H0z" fill="none"/>'+
		'</svg></div>'+
		'<img src="'+pvfile_url+'"/>'+
		'</div>';
	}
	var del_icon = '';
	if ($("#cnt_info_main").attr('data-usr-name') === smuser.name) {
		del_icon = '<div id="del-user-file" class="fa fa-trash-o help_icon"><div class="help_info">Удалить файл</div></div>';
	};
	var str_html = 	'<div class="upfile" id="fn_'+ obj.file_id + '" data-furl="'+file_url+'"><a target="_blank" href="'+file_url+'"><div class="file_icon">'+att_svg+'</div></a>'+
					'<div class="file_block"><a target="_blank" href="'+file_url+'"><p class="filename">' + obj.file_name + '</p></a>'+
					'<p class="file_info">'+file_size+file_met+' '+file_type+'</p></div>'+
					del_icon +
					'<a target="_blank" href="'+file_url+'"><div class="cloud help_icon"><div class="help_info">Скачать файл</div>'+cloud_svg+'</div></a>'+ img_str +
					'</div>';

	return str_html;
};

function ContactDeleteBlocking(name, block) {
	var xhr = new XMLHttpRequest();
		var body =	'action=deletePerson' +
					'&adds=html' +
					'&contact=' + encodeURIComponent(name) +
					'&block=' + block;

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			var fname = encodeString(name);
			var obj = $('[data-usr-name='+fname+']');
			if(obj.length != 0) {
				var obj = $('#cnt_'+obj.eq(0).attr('data-usr-id'));
				var lst_obj = $('#lst_'+obj.eq(0).attr('data-usr-id'));
				var contact_obj = $('#cnt_short_invite .contact_invite[data-usr-name='+fname+']');
				if(contact_obj.length != 0) {
					var inv_num = $('#cnt_short_invite .contact_invite').length;
					$('#invitings').find('.new_invites span').html(inv_num);
					if(inv_num == 0) {
						$('#cnt_short_invite').hide();
						$('#cnt_short_invite').html('');
						$('#invitings').find('.new_invites').hide(0);
						$('#invitings').hide(0);
					}
				}	
			}
			if(block == 'true') {
				var group = $("#m_cnt_list .group_block").find('h3[data-srtnum=999]');
				if(obj.length != 0 && group.length !=0) {
					moveContactToGroup(group, obj);
				}	
			}
			else {
				if(obj.length != 0) {
					if(obj.hasClass('active_contact_inf')){
						obj.next('div').click();
					}
					obj.remove();
				}	
				if(lst_obj.length != 0) {
					if(lst_obj.hasClass('active_contact_inf')){
						lst_obj.next('div').click();
					}
					lst_obj.remove();
					
				}	
			}
			
			updateContactList('');
			
		}
		xhr.send(body);

}		
function ContactUnblock(name) {
	var xhr = new XMLHttpRequest();
		var body =	'action=unblockPerson' +
					'&adds=html' +
					'&contact=' + encodeURIComponent(name);

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			updateContactList('');	
		}
		xhr.send(body);

}		
function moveContactRecentTop(cnt_id) {
	//var sname = encodeString(name);
	var obj = $('#lst_'+cnt_id);
	if(obj.length == 0) {
		obj = $('#cnt_'+cnt_id).clone();
		obj.attr('id', 'lst_'+cnt_id);
		obj.append('<div class="cnt_date"></div>');
		obj.removeClass('active_contact_inf');
		if(!obj.hasClass('contact_inf')) {
			obj.addClass('contact_inf');
		}
	}
	if(obj.length == 0) {
		return;
	}
	if ($('#last_cnt').next('div').children().first().attr('id') == obj.attr('id')) 
		{return;}
		
		obj.css('position', 'absolute');
		obj.css('z-index', 999);
		var offset = obj.offset();
		obj.css('top', offset.top-180);
		obj.css('width', '278px');
		obj.animate({top: 0}, 500, function(){
			$(this).css('z-index', '');
			$(this).css('position', '');
			$(this).css('top', '');
			$(this).css('width', '');
			if($('#last_cnt').next('div').children().length == 0) {
				$('#last_cnt').next('div').append($(this));
			}
			else {
				$('#last_cnt').next('div').children().first().before($(this));
			}	
			objDate = new Date();
			$(this).find('.cnt_date').text(getTimeStringFromDate(objDate));
			if($(this).hasClass('active_contact_inf')) {
				$('#cnt_list').slimScroll({ scrollTo: '0px' });
			}
		});
	
}
function invitaionAnswer(contact_obj, mode) {
	var contact = contact_obj.attr('data-usr-name')
	if(mode == 'cancel') {
		ContactDeleteBlocking(contact, 'false');
	}
	else if (mode == 'confirm') {
		var xhr = new XMLHttpRequest();
		var body =	'action=acceptPerson' +
					'&adds=html' +
					'&contact=' + encodeURIComponent(contact);

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			contact_obj.remove();
			var inv_num = $('#cnt_short_invite .contact_invite').length;
			$('#invitings').find('.new_invites span').html(inv_num);
			if(inv_num == 0) {
				$('#cnt_short_invite').hide();
				$('#cnt_short_invite').html('');
				$('#invitings').find('.new_invites').hide(0);
				$('#invitings').hide(0);
			}	
			
			updateContactList('');
		}	
		xhr.send(body);
	}
}

function addContactRequests(name, msg, result) {
	var fullname = (result == undefined)?(name):(result.fullname);
	var avatar = (result == undefined)?('/include/no_avatar.svg'):('/my/ajax/files.php?a=prev&amp;i='+result.photo_id);
	var str = '<div class="contact_invite" data-usr-name="'+name+'">\
				<table style="border-spacing: 0;">\
					<tbody><tr>\
						<td>\
							<div>\
								<div class="cnt_avatar cnt_avatar_small" style="background-image: url('+avatar+');"></div>\
							</div>\
						</td>\
						<td>\
							<div class="cnt_text">'+fullname+'</div>\
							<div class="cnt_add">'+msg.replace(name,'')+msg+'</div>\
						</td>\
						</tr>\
					</tbody>\
				</table>\
				<div style="text-align: center;">\
					<div id="confirm" class="simple_button accept_button" style="margin: 5px; min-width: 115px; padding: 5px;">Принять</div>\
					<div id="cancel" class="simple_button" style="margin: 5px; min-width: 115px; padding: 5px; ">Отказать</div>\
				</div>\
			</div>';

	$('#cnt_short_invite').append(str);
	$('#invitings').show(0);
	$('#invitings').removeClass('close_list');
	$('#cnt_short_invite').show(0);

	var inv_num = $('#cnt_short_invite .contact_invite').length;
	if(inv_num == 0) {
		$('#invitings').find('.new_invites span').html('0');
		$('#invitings').find('.new_invites').hide(0);
	} else {
		$('#invitings').find('.new_invites span').html(inv_num);
		$('#invitings').find('.new_invites').show(0);
	}
}
function showContactRequests(name, msg) {
	if($('#cnt_short_invite').find('[data-usr-name='+encodeString(name)+']').length != 0) {
		return;
	}
	req_name = encodeString(name);
	if($('#cnt_short_invite [data-usr-name='+req_name+']').length == 0) {

		var hasInfo = false;
		var key = 'pinf_'+req_name;
		if(storu) {
			try {
				var personInfo = sessionStorage.getItem(key);
				if(!(personInfo == undefined)) {
					personInfo = LZString.decompress(personInfo);
					var result = $.parseJSON(personInfo)[0];
					hasInfo = true;
				}	
			} catch (e) {
				sessionStorage.removeItem(key);
			}
		}
		
		if(!hasInfo) {
			var xhr = new XMLHttpRequest();
			var body =	'action=FindPersons' +
						'&adds=json' +
						'&new_cntname=' + encodeURIComponent(name);

			xhr.open("POST", '/my/ajax/action.php', true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() 
			{ 
				if (xhr.readyState != 4) return;
				
				if(!(xhr.responseText.indexOf('%err%') == -1)) {
					showError(xhr.responseText.replace('%err%',''));
					return;
				}
				try {
					result = $.parseJSON(xhr.responseText)[0];
					if(storu) {
						var zipResult = LZString.compress(xhr.responseText);
						sessionStorage.setItem(key, zipResult);
					}
					hasInfo = true;				
					addContactRequests(name, msg, result);
				} catch (e) {
					addContactRequests(name, msg, undefined);
				}			
			}
			xhr.send(body);
		} else {
			addContactRequests(name, msg, result);
		}	
	}			
}
function droppableCreate(obj) {
   obj.droppable({
		greedy: true,
		drop: function( event, ui ) {
			var gr_obj = getGroupHead($(event.target));	
			var dr_obj =ui.draggable;
			moveContactToGroup(gr_obj, dr_obj);

			ui.draggable.removeClass('cnt_dragging');
			gr_obj.css('background-image','');
		},
		over: function( event, ui ) {
			var gr_obj = getGroupHead($(event.target));	
			var dr_obj =ui.draggable;
			if(gr_obj.attr('data-group') != dr_obj.attr('data-group')) {
				dr_obj.addClass('cnt_dragging');
				gr_obj.css('background-image','url(/my/data/svg/add_circle.svg)');
			}	
		},
		out: function( event, ui ) {
			ui.draggable.removeClass('cnt_dragging');
			var gr_obj = getGroupHead($(event.target));	
			gr_obj.css('background-image','');
		}
    });
}
function updateContactList(name) {
	var actContact = getActiveContact();
	//var bj = $('#cnt_list').clone();
	//bj.html('');
	$('#cnt_list').load('/my/ajax/cnt.php', function(e) {
		if(name != '') {
			actContact = getContactInfo(name);
		}
		else {
			actContact = getContactInfo(actContact.name);
		}
		if(!(actContact.id == undefined)) {
			$("#cnt_list h3").next("div").hide(0);
			$("#cnt_list h3").addClass('close_list');
			
			$("#last_cnt").removeClass('close_list');
			$("#last_cnt").next("div").show(0);
			
			if($('#lst_'+ actContact.id).length == 0) {
				$('#cnt_'+ actContact.id).click();
				$('#cnt_'+ actContact.id).parent().prev('h3').click();
			}	
			else {
				$('#lst_'+ actContact.id).click();
			}
			
		}
	});	
}
function moveContactToGroup(group, obj) {
	if(!(group.attr('data-srtnum') == 999)) {
		registerContactInGroup(group, obj);
	}	

	var new_cr = false;
	//var prev_group = $("#m_cnt_list group_block h3[data-group="+encodeString(obj.attr('data-group'))+"]");

	obj.css('top','');
	obj.css('left','');
	group.next('div').find('.empty_group').remove();
	if(obj.parent().children().length == 1) {
		obj.parent().append(empty_group);
		droppableCreate($("#m_cnt_list .tl_droppable"));
	}	

	group.next('div').children().each(function(i, cnt_obj) {
		if(obj.attr('data-usr-fullname')<$(cnt_obj).attr('data-usr-fullname')) {
			new_cr = true;
			$(cnt_obj).before(obj);
			return false;
		}
	});
	if(!new_cr) {
		group.next('div').append(obj);
	}
	/*if(prev_group.next('div').children().length == 0) {
		prev_group.remove();
	}*/
	obj.attr('data-group', group.attr('data-group'));
	obj.attr('data-group-name', group.attr('data-group-name'));

	var lst_obj = $('#lst_'+obj.attr('data-usr-id'));
	if(lst_obj.length != 0) {
		lst_obj.find('.cnt_add').text(obj.attr('data-group-name'));
	}
	var cur_obj = $('#cur_contact [data-usr-id='+obj.attr('data-usr-id')+']');
	if(cur_obj.length != 0) {
		cur_obj.find('.cnt_add').text(obj.attr('data-group-name'));
	}

}
function registerContactInGroup(group, obj) {
	if(group.attr('data-srtnum') == -15) {
		var grpname = '';
	}
	else {
		var grpname = group.attr('data-group-name');
	}
	var xhr = new XMLHttpRequest();
	var body =	'action=setUserGroup' +
					'&contact=' + encodeURIComponent(obj.attr('data-usr-name')) + 
					'&group_name=' + encodeURIComponent(grpname);
		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
		}
		xhr.send(body);
}
function getGroupHead(obj) {
	if(obj.next('div').attr('id') == 'cnt_short') {
		return obj;
	}
	else {
		return obj.parents('#cnt_short').eq(0).prev('h3');
	}	
} 
function getActiveContact() {
	
	var contact	= {id: $('.active_contact_inf').attr('data-usr-id'), name: $('.active_contact_inf').attr('data-usr-name'), fullname: $('.active_contact_inf').attr('data-usr-fullname')};
	return contact;
}
function getContactInfo(name) {
	if(name == '') {
		var contact	= {'id': undefined, 'name': undefined, 'fullname': undefined};
		return contact;
	}

	var fname = encodeString(name);
	
	var obj = $('[data-usr-name='+fname+']');
	if(obj.length == 0) {
		var contact	= {'id': undefined, 'name': name, 'fullname': name};
	}
	else {
		var contact	= {'id': obj.attr('data-usr-id'), 'name': obj.attr('data-usr-name'), 'fullname': obj.attr('data-usr-fullname')};
	}	
	return contact;
}
function setCurrentContact(html_text) {
	$('#cur_contact').html('');
	$('#cur_contact').append(html_text);
	$('#cur_contact .active_contact_inf').removeClass('active_contact_inf');
	$('#cur_contact .contact_inf').removeClass('contact_inf');
	$('#cur_contact .sel_contact_inf').removeClass('sel_contact_inf');
	$('#cur_contact').addClass('cur_contact_inf');
	//$('#cur_contact .cnt_avatar').removeClass('cnt_avatar_small').addClass('cnt_avatar_big');
	$('#cur_contact').find('.cnt_info').remove();
	$('#cur_contact').find('.cnt_date').remove();
	$('#cur_contact').find('.cnt_check').remove();
	$('#cur_contact').find('.new_msg').remove();
	$('#cur_contact').find('.new_ord').remove();
	$('#cur_contact').children().eq(0).css('border-bottom','none');
	$('#cur_contact').css('border-bottom','none');
}
function clearContactsSearch() {
	$('#my_contacts .contact_inf,#my_contacts .active_contact_inf,#my_contacts .sel_contact_inf').css('display','block');
	$('#my_contacts .group_block h3').css('display','block');
	$('#my_contacts #last_cnt').css('display','block');

	$(this).prev('div').css('background-color', '');
	$(this).prev('div').css('border-color', '');
	$(this).prev('div').find('svg').css('fill', '#777');
	$('#my_contacts .cnt_mail').css('display', 'none');
	$('#my_contacts .cnt_text , #my_contacts .cnt_mail').each(function() {
		var str = $(this).html();
		str = str.replace('<span>','');
		str = str.replace('</span>','');
		$(this).html(str);
	});
}
function removeCurrentContact() {
	$('#cur_contact').html('');
	$('.active_contact_inf').removeClass("active_contact_inf").addClass('contact_inf');
	var id = $('.topmenu .active').attr('id');
	var hurl = '/my/index.php?mode='+id.replace('m_','');
	if((window.location.protocol + '//' + window.location.host+hurl) != window.location.href) {	
		window.history.pushState(null, null, hurl);
	}
}

//User
function MyUserLogout() {
	var xhr = new XMLHttpRequest();
	var body =	'action=logout';
	
	if(typeof(Storage) !== "undefined") {
		sessionStorage.clear();
		localStorage.removeItem('tlpGreeting');
	}
	xhr.open("POST", '/my/ajax/action.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() 
	{ 
		if (xhr.readyState != 4) return;
	}		
	xhr.send(body);
}
function ChangeUserPassword(header) {
	if(header == '') {
		header = 'Изменение пароля';
	}
	var str = '<div id="change_pass" class="modal_window" >' +
		'<div class="close_line"><div class="clw"><img src="/include/close_window.svg"/></div></div>'+
		'<div class="header">'+header+'</div>'+
		'<form id="change_pass_form" method="post" action="#">' +
			'<div style="margin-top: 5px;">' +
				'<input id="old_pass" class="input_pass_text" style="width: 300px;" type="password" placeholder="Введите старый пароль" name="old_pass" value=""/>' +
				'<br>'+
				'<br>'+
				'<input id="new_pass" class="input_pass_text" style="width: 300px;" type="password" placeholder="Введите новый пароль" name="new_pass" value=""/>' +
				'<div id="reg_error" style="margin: 10px 0; font-weight: 400;"></div>' + 
			'</div>' +
			'<input style="display: none;" type="submit" value="OK"/>' +
			'<div id="new_password_confirm" class="menu_button">Сменить пароль</div>'+
		'</form>'+	
	'</div>';
	$('#main_content').append(str);
	showModalWindow($('#change_pass'));	
	$('#new_password_confirm').click(function(e){
		e.preventDefault();
		$('#change_pass_form').submit();
	});
	$('#change_pass_form').submit(function(e){
		e.preventDefault();
		$('.reg_error_field').removeClass('reg_error_field');
		$('#reg_error').text('');

		var old_pass = $(this).find('#old_pass').val();
		if(old_pass == '') {
			$('#reg_error').text('Не указан старый пароль');
			return;
		}
		var inp_pass = $(this).find('#new_pass').val();
		if(inp_pass.length < 5) {
			$('#reg_error').text('Длина пароля должна быть не менее 5-ти символов');
			return;
		}
		$('#new_password_confirm').html('<img src="/include/wait.gif"/>');
		var xhr = new XMLHttpRequest();
		var body =	'action=changePassword' +
					'&adds=html' +
					'&pass_hash=' + encodeURIComponent($(this).find('#old_pass').val()) +
					'&new_hash=' + encodeURIComponent($(this).find('#new_pass').val());

		xhr.open("POST", '/my/ajax/action.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() 
		{ 
			if (xhr.readyState != 4) return;
			
			$('#new_password_confirm').html('Сменить пароль');
			if(!(xhr.responseText.indexOf('%err%') == -1)) {
				showError(xhr.responseText.replace('%err%',''));
				return;
			}
			$('#change_pass_form').remove();
			$('#change_pass').append('<div class="header">Пароль успешно был изенен.</div>');
			
		}
		xhr.send(body);
	});	
}
function getMainUser() {
	var obj = $('#login_user');
	if(obj.length == 0) {
		var contact	= {'id': undefined, 'name': name, 'fullname': name};
	}
	else {
		var contact	= {'id': obj.attr('data-usr-id'), 'name': obj.attr('data-usr-name'), 'fullname': obj.attr('data-usr-fullname')};
	}	
	return contact;
}


