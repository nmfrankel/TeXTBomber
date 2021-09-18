<?php
/*     _         _        _ _ _ _ _ _ _
	 /_/       /_//     /_/_/_/_/_/_/_/
	/_/_/     /_//_/  /_//_/
   /_/ /_/   /_/ /_//_/ /_/_ _ _ _
  /_/   /_/ /_/   /_/  /_/_/_/_/_/
 /_/     /_/_/        /_/
/_/       /_/        /_/

	NOSSON M FRANKEL
	nossonmfrankel@gmail.com
	ALL RIGHTS RESERVED, 2021
*/


## set defaults
	header("Access-Control-Allow-Origin: *");
	session_start();
	require_once './utils.php';

	$req = [
		auth => false,// implement apache_request_headers()[authorization];
		method => escXSS($_SERVER[REQUEST_METHOD]),
		path => escXSS(preg_replace('#\?.*#', '', $_SERVER[REQUEST_URI]))  
	];
	$res = [
		errCode => -1,
		msg => 'Invalid endpoint defined'.generErr()
	];


## route request to correct endpoints
	if (in_array($req[path], ['/api/sendMsg', '/api/sendMsg/']) && $req[method] === 'POST'):
		$res = array_merge($res, Msg::send());

	elseif (preg_match('/\/api\/blockIP\/([^\/]+)\/?/', $req[path], $ip) && $req[method] === 'GET'):
		$res = array_merge($res, BlockIP::verify(escXSS($ip[1])));

	elseif (in_array($req[path], ['/api/blockIP', '/api/blockIP/']) && $req[method] === 'POST'):
		$res = array_merge($res, BlockIP::add($_SERVER[REMOTE_ADDR]));

	else:
		http_response_code(404);

	endif;


## send response
	header('Content-Type: application/json');
	echo json_encode($res);