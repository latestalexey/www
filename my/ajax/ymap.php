<?
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

$contact = $_POST['contact'];
$value = $_POST['address'];
$readOnly = $_POST['rd']=='true';
$safe_value = '<pre>'.$value.'</pre>'
?>

<div class="cnt_headline" data-rd="<?=($readOnly)?'1':'0';?>" data-crd="<?=$_POST['coords'];?>">
	<div class="cnt_hd_x2" style="width: 99%; margin: 0 0 10px 0;">
	<?	
		echo $safe_value;
	?>
	</div>
</div>

<div id="map">

</div>
<script>

function getMyCoords() {
    var geolocation = ymaps.geolocation, myMap;

    geolocation.get({
        provider: 'yandex',
        mapStateAutoApply: true
    }).then(function (result) {
        var coords = result.geoObjects.get(0).geometry.getCoordinates();
		setGeoCodeByCoords(coords);
    });
}

function setGeoCodeByCoords(coords) {
	ymaps.geocode(coords, {
        results: 1
    }).then(function (res) {
		myMap.geoObjects.removeAll();
        var firstGeoObject = res.geoObjects.get(0),
		address = res.geoObjects.get(0).getAddressLine();
		obj_address.text(address);			
		coords_obj.attr('data-crd', coords);
		
        bounds = firstGeoObject.properties.get('boundedBy');
		firstGeoObject.properties.set('hintContent','<?=$contact?>');
		firstGeoObject.options.set('preset','islands#dotIcon');
		firstGeoObject.options.set('iconColor','#26A69A');
		firstGeoObject.options.set('draggable',<?=($readOnly)?'false':'true'?>);
        firstGeoObject.events.add(['dragend'], function (e) {
			ymaps.geocode(myMap.geoObjects.get(0).geometry.getCoordinates(), {
				results: 1
			}).then(function (res) {
				address = res.geoObjects.get(0).getAddressLine();
				obj_address.text(address);			
				var searchControl = myMap.controls.get('searchControl');
				searchControl.clear();
				searchControl.state.set('request',address);
				searchControl.state.set('inputValue',address);
			});	
		});
		myMap.geoObjects.add(firstGeoObject);
        myMap.setBounds(bounds, {
            checkZoomRange: true
        });
    });
}

function setGeoCode(s_address) {
	obj_address.text(s_address);
	ymaps.geocode(s_address, {
        results: 1
    }).then(function (res) {
		myMap.geoObjects.removeAll();
        var firstGeoObject = res.geoObjects.get(0),
        bounds = firstGeoObject.properties.get('boundedBy');
		coords_obj.attr('data-crd', firstGeoObject.geometry.getCoordinates());
		
		firstGeoObject.properties.set('hintContent','<?=$contact?>');
		firstGeoObject.options.set('preset','islands#dotIcon');
		firstGeoObject.options.set('iconColor','#26A69A');
		firstGeoObject.options.set('draggable',<?=($readOnly)?'false':'true'?>);
        firstGeoObject.events.add(['dragend'], function (e) {
			ymaps.geocode(myMap.geoObjects.get(0).geometry.getCoordinates(), {
				results: 1
			}).then(function (res) {
				address = res.geoObjects.get(0).getAddressLine();
				obj_address.text(address);			
				var searchControl = myMap.controls.get('searchControl');
				searchControl.clear();
				searchControl.state.set('request',address);
				searchControl.state.set('inputValue',address);
			});	
		});
		myMap.geoObjects.add(firstGeoObject);
        myMap.setBounds(bounds, {
            checkZoomRange: true
        });
    });
}

function initMap () {
    myMap = new ymaps.Map('map', {
        center: [55.76, 37.64], // Москва
        zoom: 14
		},
		{searchControlProvider: 'yandex#map'}
	);
	myMap.controls.add('routeEditor');
	myMap.controls.get('routeEditor').options.set('float', 'right');

	myMap.controls.remove('geolocationControl');
	
	var searchControl = myMap.controls.get('searchControl');
	searchControl.options.set('noCentering',true);
	searchControl.options.set('noPlacemark',true);
	if(!address == '') {
		searchControl.state.set('request',address);
		searchControl.state.set('inputValue',address);
		if(coords_obj.attr('data-crd') == '') {
			setGeoCode(address);
		}
		else {
			setGeoCodeByCoords(coords_obj.attr('data-crd'));
		}
		
		/*searchControl.search(address).then(function () {
			searchControl.hideResult();
			setGeoCode(address)}
		);*/
	}	

	<?if(!$readOnly) {?>
		var permitButton = new ymaps.control.Button({
			data: {
				content: "Сохранить адрес",
				image: '/my/data/svg/my_location.svg'
			},
			options: {
				maxWidth: [28, 150, 178],
				selectOnClick: false
			}
		});
		myMap.controls.add(permitButton);
		myMap.events.add('click', function (e) {
			var coords = e.get('coords');
			setGeoCodeByCoords(coords);
		});	
		permitButton.events.add('click', function () {
			$('#cnt_view #address').find('pre').text(obj_address.text());
			$('#cnt_view #address').attr('data-crd', coords_obj.attr('data-crd'));
			
			$('.modal_back').remove();
			$('#map_view').hide(100);
			$('#map_view').remove();

			if($('#cnt_view #cnt_info_save').css('display') == 'none') {
				$('#cnt_view #cnt_info_save').css('display','block');
			}
			
		}, this);		
		searchControl.events.add('submit', function () {
			setGeoCode(searchControl.getRequestString());
		}, this);	
		if(address == '') {
			getMyCoords();
		}	
		$('#map_view .close_line').prepend('<div style="display: inline-block;float: left;">Выберите адрес местонахождения с помощью поиска или передвигая мышкой указатель и нажмите "Сохранить адрес"</div>');
	<?}
	else{?>
		if(address == '') {
			obj_address.html('<span style="color: #FF0000;">Адрес местонахождения не указан</span>');
		}
	<?}?>
}

	var myMap;
	var obj_address = $('#map_view .cnt_hd_x2 pre'); 
	var address = $('#map_view .cnt_hd_x2 pre').text();
	var coords_obj =  $('#map_view .cnt_headline'); 

	ymaps.ready(initMap);
</script>

