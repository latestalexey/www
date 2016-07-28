<div id="buttons" class="cnt_headline">
	<div id="cnt_info_docs" style="display: inline-block; min-width: 150px; margin: 0 30px 0 0;" class="menu_button">Файлы профиля</div>
	<?if($arResult['user_status'] == 'saler') {?>
		<div id="cnt_info_add" style="display: inline-block; min-width: 150px; margin: 0 30px 0 0;" class="menu_button">Доставка</div>
	<?}?>	
	<?if ($mySettings) {?>	
		<div id="cnt_info_settings" style="display: inline-block; min-width: 150px; margin: 0 30px 0 0;" class="menu_button">Настройки</div>
	<?}?>
	<!--Добавлена новая кнопка -->
	<?if ($mySettings) {?>	
		<div id="cnt_info_gallery" style="display: inline-block; min-width: 150px; margin: 0 30px 0 0;" class="menu_button">Галерея</div>
	<?}?>
</div>

<? // Begin of Загрузка изображений и формирование кода html для галереи(вставка в action.php/ветка getPersonInfo)
	$images = array();
	$subdir = "/upload/tmp/";
	$dir = $_SERVER["DOCUMENT_ROOT"].$subdir;
	$index=0;

	foreach (new DirectoryIterator($dir) as $fileInfo) {
		if ($fileInfo->isDot() || $fileInfo->isDir()) continue;
		$images[$index++] = $subdir.$fileInfo->getFilename();
	}
?>

<div id="cnt_gallery" style="display: none;">
	<div class="cnt_headline">
		<div id="nav-back" class="active_icon">
			<?include($_SERVER["DOCUMENT_ROOT"]."/my/data/svg/arrow_back.svg");?>
			<div style="display: inline-block; font-size: 14px; vertical-align: 7px; font-weight: 800;">
				Вернуться назад к основной информации
			</div>
		</div>
	</div>
	<div class="carousel-wrapper">
		<? 
		if(count($images) > 0){
			foreach ($images as $img) {?>
				<img class="thumbnail" alt="" style="background-image: url(<?=$img?>); background-size: cover"/>
		<?}
		}else{?>
			<p>Галерея пуста</p>
		<?}?>
	</div>
	<? 
	if(count($images) > 4){?>
		<button class="nav-left"></button>
		<button class="nav-right"></button>
	<?}?>
</div>
<!-- End of Загрузка изображений и формирование кода html для галереи(вставка в action.php/ветка getPersonInfo) -->