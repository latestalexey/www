<?
require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once($_SERVER["DOCUMENT_ROOT"]."/my/admin/before.php");

$icon_1c = '<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.0" width="36" height="36" id="svg3800" viewBox="-20 10 270 106">
		<defs id="defs3803"/>
		<g transform="translate(-79.672264,-27.000001)" id="g4042">
		<path d="M 246.74997,123.25 C 234.32997,123.25 224.24997,113.16998 224.24997,100.74999 C 224.24997,88.329986 234.32997,78.249986 246.74997,78.249986 C 259.16997,78.249986 269.24997,88.329986 269.24997,100.74999 C 269.24997,100.74999 288.49996,100.74998 288.49996,100.74998 C 288.49996,77.703984 269.79596,58.999984 246.74996,58.999984 C 223.70397,58.999984 204.99997,77.703984 204.99997,100.74998 C 204.99997,123.79598 223.70397,142.49998 246.74996,142.49998 L 418.41484,142.49998 L 418.41484,123.25 L 246.74997,123.25 z" id="path4004" style="fill:#F5D43F;fill-rule:evenodd;stroke:none;stroke-width:0.95555556px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"/>
		<path d="M 418.41484,173.49998 L 418.41484,152.99998 L 246.74997,152.99998 C 217.90797,152.99998 194.49998,129.59198 194.49998,100.74999 C 194.49998,71.907989 217.90797,48.49999 246.74997,48.49999 C 275.59197,48.49999 298.99997,71.907989 298.99997,100.74999 C 298.99997,100.74999 319.49997,100.74999 319.49997,100.74999 C 319.49997,60.591987 286.90797,27.999988 246.74997,27.999988 C 206.59197,27.999988 173.99997,60.591987 173.99997,100.74999 C 173.99997,140.90798 206.59197,173.49998 246.74997,173.49998 L 418.41484,173.49998 z" id="path4008" style="fill:#FF0000;fill-rule:evenodd;stroke:none;stroke-width:0.41148326px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"/>
		</g>
		<text x="261.32773" y="33" id="text4018" xml:space="preserve" style="font-size:36px;font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;text-align:start;line-height:125%;writing-mode:lr-tb;text-anchor:start;fill:#ff0000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;font-family:DejaVu Sans;-inkscape-font-specification:DejaVu Sans Bold">®</text>
		<g transform="translate(-79.672264,-27.000001)" id="g4046">
		<path d="M 111,174 L 111,76.000001 L 90.5,76.000001 L 90.5,56.000001 L 129.5,56.000001 L 129.5,174 L 111,174 z" id="path4038" style="fill:#F5D43F;fill-rule:evenodd;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"/>
		<path d="M 111,48.000001 L 138,48.000001 L 138,174 L 157,174 L 157,27.000001 L 111,27.000001 L 111,48.000001 z" id="path4040" style="fill:#FF0000;fill-rule:evenodd;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"/>
		</g></svg>';

$icon_pdf = '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="36" height="36" viewBox="0 0 642 790" id="svg3982" version="1.1" inkscape:version="0.47 r22583" sodipodi:docname="New document 10"><title id="title4059">PDF icon</title><defs id="defs3984"><inkscape:perspective sodipodi:type="inkscape:persp3d" inkscape:vp_x="0 : 526.18109 : 1" inkscape:vp_y="0 : 1000 : 0" inkscape:vp_z="744.09448 : 526.18109 : 1" inkscape:persp3d-origin="372.04724 : 350.78739 : 1" id="perspective3990"></inkscape:perspective><inkscape:perspective id="perspective3948" inkscape:persp3d-origin="0.5 : 0.33333333 : 1" inkscape:vp_z="1 : 0.5 : 1" inkscape:vp_y="0 : 1000 : 0" inkscape:vp_x="0 : 0.5 : 1" sodipodi:type="inkscape:persp3d"></inkscape:perspective><filter color-interpolation-filters="sRGB" inkscape:collect="always" id="filter9602"><feGaussianBlur inkscape:collect="always" stdDeviation="2.3770894" id="feGaussianBlur9604"></feGaussianBlur></filter><radialGradient inkscape:collect="always" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#linearGradient9550" id="radialGradient6547" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-0.3092196,1.4117378,-2.0409641,-0.4470404,4640.1869,-1163.9918)" cx="1723.8253" cy="1028.9956" fx="1723.8253" fy="1028.9956" r="62.5"></radialGradient><linearGradient id="linearGradient9550"><stop style="stop-color:#ffffff;stop-opacity:1" offset="0" id="stop9552"></stop><stop id="stop9558" offset="0.5" style="stop-color:#ffffff;stop-opacity:1"></stop><stop style="stop-color:#4d4d4d;stop-opacity:1" offset="1" id="stop9554"></stop></linearGradient><filter color-interpolation-filters="sRGB" inkscape:collect="always" id="filter9570"><feGaussianBlur inkscape:collect="always" stdDeviation="0.30133845" id="feGaussianBlur9572"></feGaussianBlur></filter><linearGradient inkscape:collect="always" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#linearGradient9574" id="linearGradient6549" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0.650652,0.1575299,-0.1575299,0.650652,1047.7501,-132.54964)" x1="1759.1475" y1="967.50891" x2="1783.5715" y2="952.44196"></linearGradient><linearGradient inkscape:collect="always" id="linearGradient9574"><stop style="stop-color:#f2f2f2;stop-opacity:1;" offset="0" id="stop9576"></stop><stop style="stop-color:#808080;stop-opacity:1" offset="1" id="stop9578"></stop></linearGradient>
		<filter color-interpolation-filters="sRGB" inkscape:collect="always" id="filter6355"><feGaussianBlur inkscape:collect="always" stdDeviation="0.6431018" id="feGaussianBlur6357"></feGaussianBlur></filter><filter color-interpolation-filters="sRGB" inkscape:collect="always" id="filter6371"><feGaussianBlur inkscape:collect="always" stdDeviation="0.45057703" id="feGaussianBlur6373"></feGaussianBlur></filter></defs><sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.34794922" inkscape:cx="498.12128" inkscape:cy="314.2007" inkscape:document-units="px" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1280" inkscape:window-height="706" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1"></sodipodi:namedview><metadata id="metadata3987"><rdf:rdf><cc:work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"></dc:type><dc:title>PDF icon</dc:title></cc:work></rdf:rdf></metadata>
		<g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(-50.695688,-61.548734)">
		<g id="g6375" transform="matrix(6.0006409,-1.4961278,1.4961278,6.0006409,-12869.469,-1371.3936)" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\security.png" inkscape:export-xdpi="72.300003" inkscape:export-ydpi="72.300003">
		<path id="path9584" d="m 1982.9534,739.52917 -27.5678,113.86409 81.3315,19.69125 22.8221,-94.26322 -14.8553,-24.34646 -61.7305,-14.94566 z" style="fill:#000000;fill-opacity:1;stroke:none;filter:url(#filter9602)" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" inkscape:export-xdpi="72" inkscape:export-ydpi="72"></path>
		<path inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" id="rect8729" d="m 1982.9534,739.52917 -27.5678,113.86409 81.3315,19.69125 22.8221,-94.26322 -14.8553,-24.34646 -61.7305,-14.94566 z" style="fill:#e6e6e6;fill-opacity:1;stroke:none"></path>
		<path inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" style="opacity:0.6;fill:url(#radialGradient6547);fill-opacity:1;stroke:none" d="m 1982.9534,739.52917 -27.5678,113.86409 81.3315,19.69125 22.8221,-94.26322 -14.8553,-24.34646 -61.7305,-14.94566 z" id="path9548"></path>
		<path transform="matrix(0.650652,0.1575299,-0.1575299,0.650652,1033.6148,17.796449)" inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" style="fill:#666666;fill-opacity:1;stroke:none;filter:url(#filter9570)" d="m 1726.7115,714.69189 c 0,0 1.7858,3.76115 1.7858,5.78123 0,2.02206 -1.6072,24.35266 -1.6072,24.35266 0,0 20.7217,-1.60725 23.9062,-1.51786 3.1808,0.0893 6.049,1.51786 6.049,1.51786 l -30.1338,-30.13389 z" id="path9560" sodipodi:nodetypes="czczcc"></path>
		<path inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" sodipodi:nodetypes="czczcc" id="rect8731" d="m 2044.6781,754.47341 c 0,0 0.5696,2.72854 0.2513,4.0429 -0.3186,1.31565 -4.882,15.59195 -4.882,15.59195 0,0 13.7358,2.21851 15.7938,2.77835 2.0554,0.55917 3.6966,1.94047 3.6966,1.94047 l -14.8597,-24.35367 z" style="fill:url(#linearGradient6549);fill-opacity:1;stroke:none"></path>
		<rect transform="matrix(0.650652,0.1575299,-0.1575299,0.650652,1033.6148,17.796449)" inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" style="fill:#000000;fill-opacity:1;stroke:none;filter:url(#filter6355)" id="rect9536" width="64.64286" height="26.071428" x="1612.6516" y="743.59106" rx="8" ry="8"></rect>
		<rect transform="matrix(0.9719198,0.2353123,-0.2353123,0.9719198,0,0)" inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" ry="5.3556023" rx="5.3556023" y="271.50751" x="2088.1448" height="17.453522" width="43.275177" id="rect8748" style="fill:#d40000;fill-opacity:1;stroke:none"></rect>
		<text transform="matrix(0.650652,0.1575299,-0.1575299,0.650652,1033.6148,17.796449)" inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" xml:space="preserve" style="font-size:23.03644562px;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;text-align:center;line-height:100%;writing-mode:lr-tb;text-anchor:middle;fill:#000000;fill-opacity:1;stroke:none;filter:url(#filter6371);font-family:Arial;-inkscape-font-specification:Arial" x="1644.6559" y="764.7876" id="text8754" sodipodi:linespacing="100%"><tspan sodipodi:role="line" id="tspan8756" x="1644.6559" y="764.7876" style="font-size:23.03644562px;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;text-align:center;line-height:100%;writing-mode:lr-tb;text-anchor:middle;fill:#000000;font-family:Arial Unicode MS;-inkscape-font-specification:Arial Unicode MS">PDF</tspan></text>
		<text transform="matrix(0.9719198,0.2353123,-0.2353123,0.9719198,0,0)" inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" sodipodi:linespacing="100%" id="text8750" y="285.75388" x="2109.5608" style="font-size:15.42175865px;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;text-align:center;line-height:100%;writing-mode:lr-tb;text-anchor:middle;fill:#ffffff;fill-opacity:1;stroke:none;font-family:Arial;-inkscape-font-specification:Arial" xml:space="preserve"><tspan style="font-size:15.42175865px;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;text-align:center;line-height:100%;writing-mode:lr-tb;text-anchor:middle;font-family:Arial Unicode MS;-inkscape-font-specification:Arial Unicode MS" y="285.75388" x="2109.5608" id="tspan8752" sodipodi:role="line">PDF</tspan></text>
		<path inkscape:export-ydpi="72" inkscape:export-xdpi="72" inkscape:export-filename="G:\SAFH INTERNAL\Website\Web Graphics\Images\download-pdf-bg.png" transform="matrix(0.1553211,0.1403559,-0.1403559,0.1553211,1895.9012,432.65483)" d="m 1667.1428,1059.1479 c -143.5128,190.5256 34.0545,212.2928 -59.1891,-7.2558 -93.2436,-219.54846 -200.8782,-76.65427 35.8782,-47.6313 236.7564,29.0229 166.8237,-135.63851 23.3109,54.8871 z" inkscape:randomized="0" inkscape:rounded="4" inkscape:flatsided="true" sodipodi:arg2="1.6927733" sodipodi:arg1="0.64557579" sodipodi:r2="17.214323" sodipodi:r1="34.428646" sodipodi:cy="1038.4336" sodipodi:cx="1639.6428" sodipodi:sides="3" id="path9546" style="fill:none;stroke:#800000;stroke-width:10;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;stroke-dashoffset:0" sodipodi:type="star"></path>
		</g></g></svg>';
		
?>
<script type="text/javascript" src="/my/js/help.js"></script>
<div id="resource_list" style="padding: 20px;">
	<div style="float: left; width: 33%;">
	<h3 style="text-align: center; color: #ff6600;">Документация</h3>
	<div class="msg_file" style="padding: 0px 0 10px 0; width: 100%; margin-bottom: 10px;">
		<div class="upfile" id="fn_1" data-furl="">
			<a target="_blank" href="/upload/user_guide.pdf">
				<div class="file_icon">
				<?echo $icon_pdf;?>
				</div>
			</a>
			<div class="file_block">
				<a target="_blank" href="/upload/user_guide.pdf"><p class="filename">Краткое руководство пользователя.</p></a>
				<p class="file_info">2.3MB</p>
			</div>
			<a target="_blank" href="/upload/user_guide.pdf">
				<div class="cloud help_icon">
					<div class="help_info">Скачать файл</div>
					<svg fill="#CCCCCC" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 0h24v24H0z" fill="none"/>
						<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
					</svg>
				</div>
			</a>
		</div>
	</div>
	<div class="msg_file" style="padding: 0px 0 10px 0; width: 100%; margin-bottom: 10px;">
		<div class="upfile" id="fn_1" data-furl="">
			<a target="_blank" href="/upload/5_tips_for_buyer.pdf">
				<div class="file_icon">
					<?echo $icon_pdf;?>
				</div>
			</a>
			<div class="file_block">
				<a target="_blank" href="/upload/5_tips_for_buyer.pdf"><p class="filename">5 советов покупателю.</p></a>
				<p class="file_info">2.4MB</p>
			</div>
			<a target="_blank" href="/upload/5_tips_for_buyer.pdf">
				<div class="cloud help_icon">
					<div class="help_info">Скачать файл</div>
					<svg fill="#CCCCCC" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 0h24v24H0z" fill="none"/>
						<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
					</svg>
				</div>
			</a>
		</div>
	</div>
	<div class="msg_file" style="padding: 0px 0 10px 0; width: 100%; margin-bottom: 10px;">
		<div class="upfile" id="fn_1" data-furl="">
			<a target="_blank" href="/upload/teleport_1С_excel.pdf">
				<div class="file_icon">
					<?echo $icon_pdf;?>
				</div>
			</a>
			<div class="file_block">
				<a target="_blank" href="/upload/teleport_1С_excel.pdf"><p class="filename">Инструкция. Как отправить заказ поставщику в Телепорте сразу из 1С или загрузить из Excel.</p></a>
				<p class="file_info">956KB</p>
			</div>
			<a target="_blank" href="/upload/teleport_1С_excel.pdf">
				<div class="cloud help_icon">
					<div class="help_info">Скачать файл</div>
					<svg fill="#CCCCCC" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 0h24v24H0z" fill="none"/>
						<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
					</svg>
				</div>
			</a>
		</div>
	</div>
	<div class="msg_file" style="padding: 0px 0 10px 0; width: 100%; margin-bottom: 10px;">
		<div class="upfile" id="fn_1" data-furl="">
			<a target="_blank" href="/upload/order_several_companies.pdf">
				<div class="file_icon">
					<?echo $icon_pdf;?>
				</div>
			</a>
			<div class="file_block">
				<a target="_blank" href="/upload/order_several_companies.pdf"><p class="filename">Инструкция. Как отправить заказ поставщику в Телепорте, если у вас несколько юридических лиц.</p></a>
				<p class="file_info">608KB</p>
			</div>
			<a target="_blank" href="/upload/order_several_companies.pdf">
				<div class="cloud help_icon">
					<div class="help_info">Скачать файл</div>
					<svg fill="#CCCCCC" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 0h24v24H0z" fill="none"/>
						<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
					</svg>
				</div>
			</a>
		</div>
	</div>
	</div>
	<div style="float: left; width: 33%;">
		<h3 style="text-align: center; color: #ff6600;">Информационные материалы</h3>
		<div class="msg_file" style="padding: 0px 0 10px 0; width: 100%; margin-bottom: 10px;">
			<div class="upfile" id="fn_1" data-furl="">
				<a target="_blank" href="/upload/info_digitalization.pdf">
					<div class="file_icon">
						<?echo $icon_pdf;?>
					</div>
				</a>
				<div class="file_block">
					<a target="_blank" href="/upload/info_digitalization.pdf"><p class="filename">Цифровизация бизнеса и  экономики</p></a>
					<p class="file_info">494KB</p>
				</div>
				<a target="_blank" href="/upload/info_digitalization.pdf">
					<div class="cloud help_icon">
						<div class="help_info">Скачать файл</div>
						<svg fill="#CCCCCC" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"/>
							<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
						</svg>
					</div>
				</a>
			</div>
		</div>
	</div>
	<div style="float: left; width: 33%;">
		<h3 style="text-align: center; color: #ff6600;">Обработки и файлы</h3>
		<div class="msg_file" style="padding: 0px 0 10px 0; width: 100%; margin-bottom: 10px;">
			<div class="upfile" id="fn_1" data-furl="">
				<a target="_blank" href="/upload/1c_teleport_ut_103.epf">
					<div class="file_icon">
						<?echo $icon_1c;?>
					</div>
				</a>
				<div class="file_block">
					<a target="_blank" href="/upload/1c_teleport_ut_103.epf"><p class="filename">Внешняя печатная форма отправки заказа (Управление торговлей 10.3)</p></a>
					<p class="file_info">32KB</p>
				</div>
				<a target="_blank" href="/upload/1c_teleport_ut_103.epf">
					<div class="cloud help_icon">
						<div class="help_info">Скачать файл</div>
						<svg fill="#CCCCCC" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"/>
							<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
						</svg>
					</div>
				</a>
			</div>
		</div>
	</div>
	<div style="float: left; width: 99%;">
		<h3 style="text-align: center; font-weight: 400">В случае возникновения вопросов или проблем, вы всегда можете обратиться в нашу <a href="/my/index.php?mode=messages&cnt=support" style="color: #ff6600; text-decoration: underline;">Службу поддержки.</a><br>
		Для этого достаточно написать свой вопрос в разделе «СООБЩЕНИЯ» контакту «Служба поддержки» в группе контактов «Команда Телепорт».<br>
		Вы можете также связаться непосредственно с Руководителем проекта Телепорт, выбрав контакт <a href="/my/index.php?mode=messages&cnt=ceo" style="color: #ff6600; text-decoration: underline;">CEO Teleport</a> в указанной группе.
		</h3>
	</div>
</div>
