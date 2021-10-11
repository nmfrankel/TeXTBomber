<?php
## This class controls sending emails

class Msg{
	public function send(){
		// check if user is overusing system
		if($_SESSION[sentCount]++ >= 100):
			BlockIP::add();
			return [
				sent => 0,
				errCode => 403,
				msg => 'You are now blocked to use the system as a result of over using it'.generErr()
			];
		endif;

		// check if data sent is valid JSON
		if(!validateJSON(file_get_contents('php://input'))) return [sent => 0, errCode => -2, msg => 'The data sent is not valid JSON'.generErr()];

		$randNum = random_int(0, 1000);
		$_POST = json_decode(file_get_contents('php://input'), true);
		$mailto = preg_replace('/[\s\(\)-]|(\+1)/', '', escXSS($_POST[mailto]));
		$body = escXSS($_POST[body]);

		// retrieve phone's SMS gateway if not included
		if(!filter_var($mailto, FILTER_VALIDATE_EMAIL)){
			if(strlen($mailto) === 10 || strlen($mailto) === 11)
				return [sent => 0, errCode => 2, msg => 'The number entered is invalid or unsupported'.generErr()];

			// $mailto = GatewayLookup::search($mailto);
			return [sent => 0, errCode => 3, msg => 'Only entering a phone number is not supported yet, try appending the carrier gateway'.generErr()];
		}

		// prepare email vars
		$name       = 'Jhon Doe '.$randNum;
		$co_email   = "no_reply@remind$randNum.com";
		$subject    = '';
		$headers    = "From: $name <$co_email> \r\n";
		$headers   .= "Reply-To: $name <$co_email> \r\n";
		$headers   .= "MIME-Version: 1.0\r\n";
		$headers   .= "Content-Type: text/plain; charset=UTF-8\r\n";
		// $headers   .= "Content-Type: text/html; charset=UTF-8-1\r\n";

		// attempt to send message
		$mailed = mail($mailto, $subject, $body, $headers);

		// give feedback to user
		return [
			sent => intval($mailed),
			errCode => intval(!$mailed),
			msg => 'One (1) message '.($mailed? 'was successfully sent': 'failed to send'.generErr()),
			recipient => formatPhone($mailto)
		];
	}
}