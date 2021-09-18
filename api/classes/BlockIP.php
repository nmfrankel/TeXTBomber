<?php
## This class mananges everything with blocked IPs

// make the limit per week, save timestamp

class BlockIP{
	// return JSON or boolean if IP is blocked
	public function verify($ip, $returnBool = 0){
		$searchIP = standardizeIP($ip);

		// check if IP is in blocked list
		$list = fopen('./data/blockedIPs.txt', 'r');
		$blockedList = fread($list, filesize('./data/blockedIPs.txt'));
		fclose($list);
		$isBlocked = preg_match("/$searchIP/", $blockedList);

		return $returnBool? intval($isBlocked): [errCode => 0, msg => 'The IP is '.($isBlocked? '': 'not ')."blocked (IP: $searchIP)", blocked => $isBlocked];
	}

	// add IP to blocked list
	public function add($ip){
		$newIP = standardizeIP($ip);

		// check if IP is already blocked
		if(self::verify($newIP, 1))
			return [errCode => 1, msg => "IP is already blocked (IP: $newIP)", blocked => 1];

		// add IP to blocked list
		$list = fopen("./data/blockedIPs.txt", "w+");
		fwrite($list, "$newIP\n");
		fclose($list);

		return [errCode => 0, msg => "IP is now blocked (IP: $newIP)", blocked => 1];
	}

	// remove IP from blocked list
	public function remove($ip){
		$searchIP = standardizeIP($ip);

		// check if IP is not blocked
		if(!self::verify($searchIP, 1))
			return [errCode => 1, msg => "The IP was not blocked (IP: $searchIP)", blocked => 0];

		// remove blocked IP from list
		$list = fopen('./data/blockedIPs.txt', 'r');
		$blockedList = fread($list, filesize('./data/blockedIPs.txt'));
		$list = fopen('./data/blockedIPs.txt', 'w');
		fwrite($list, str_replace($searchIP, '', $blockedList));	
		fclose($list);

		return [errCode => 0, msg => "IP is not blocked anymore (IP: $searchIP)", blocked => 0];
	}
}