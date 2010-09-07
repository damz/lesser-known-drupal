<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:svg="http://www.w3.org/2000/svg" xml:lang="fr" lang="fr" dir="ltr"> 

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <link type="text/css" rel="stylesheet" media="all" href="css/style.css" />
  <script src="js/jquery-1.4.2.min.js"></script>
  <script src="js/jquery.ba-bbq.min.js"></script>
  <script src="js/jquery.hotkeys-0.7.9.min.js"></script>
  <script src="js/bluesun.js"></script>
  <meta name="viewport" content="width=device-width, initial-scale = 1, user-scalable = no" /> 
</head>

<body class="ghosts">
<div id="logo"></div>
<div id="main-page-wrapper">
<div id="main-page">

<div class="reachable" id="start"></div>

<?php
include 'vendor/markdown/markdown.php';
include 'vendor/smartypants/smartypants.php';
include 'vendor/codefilter/codefilter.module';
function check_plain($text) {
  return htmlspecialchars($text, ENT_QUOTES);
}
function decode_entities($text) {
  return html_entity_decode($text, ENT_QUOTES, 'UTF-8');
}

foreach (glob('slides/*') as $file) {
  $html = file_get_contents($file);
  $html = Markdown($html);
  $html = codefilter_filter('prepare', 0, -1, $html);
  $html = codefilter_filter('process', 0, -1, $html);
  echo $html;
}
?>


</div>
</div>

<div id="toc" class="hidden">
<ul></ul>
</div>

</body>
</html>
