<?php
$production = ( isset($_GET['prod']) ) ?: false;

$jsDataMainUrl = ( $production ) 
    ? "../build/js/main.js"
    : "./js/main.js";
?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html lang="en" class="lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html lang="en" class="lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html lang="en" class="lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html lang="en"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Planning</title>
    <meta name="author" content="Tomatao">
    <meta name="viewport" content="width=device-width">
</head>
<body>
    <div id="wrapper">
    </div>

    <script src="./js/curl.config.js"></script>
    <script src="./js/_vendor/curl.js"></script>
<!-- 
 -->
<? if ( $production ): ?>
<? else: // development ?>
    <script defer src="./js/main.js"></script>
<? endif; ?>
</body>
</html>
