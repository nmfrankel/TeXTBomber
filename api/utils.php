<?php

// runs autoLoad() when a class is called
spl_autoload_register('autoLoad');

// loads classes as used from the '/api/classes/' folder
function autoLoad($className){
	$path = "$_SERVER[DOCUMENT_ROOT]/api/classes/";// folder where classes are in
	$fullPath = "$path$className.php";

	if (!file_exists($fullPath)) return false;
	include_once $fullPath;
}

// Prevent cross-site scripting
function escXSS($string){
	return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

// transform IPs into one format for blocking
function standardizeIP($ip){
    $parts = explode('.', $ip);

    foreach ($parts as $key => $part) {
        $parts[$key] = sprintf('%03d', $part);
    }

    return implode('.', $parts);
}

// generate random error num
function generErr(){
	return ' [Err: '.sprintf('%04x', mt_rand(0, 0x0fff) | 0x4000).']';
}

// Format phone number to +1 (XXX) XXX-XXXX
function formatPhone($string){

	$string = strval($string);
	preg_match_all('/\(?([2-9]\d{2})\)?[-. ]?(\d{0,3})?[-. ]?(\d{0,4})?/', $string, $group);

	$number = "+1 (".$group[1][0].") ".$group[2][0]."-".$group[3][0];
	return $number;
}

// check if expected JSON data is valid
function validateJSON($str){
	$temp = json_decode($str);
	return json_last_error() == JSON_ERROR_NONE;
}