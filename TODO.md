**Last updated: 10/23/21**

### Frontend
**HIGH PRIORITY**
- - - - - - -
-	display the two panes in the 'Response' window -> Console | Debug
-	ability to display 'system updates' with cards in top right corner | next msg will be sent in 5 sec
-	handle that system changes actions based on Sandbox / Production toggle

**LOW PRIORITY**
- - - - - - -
-	give more options in system -> frequency range | SMS or MMS | send random text
-	display help button / cards in phone input
-	mobile view / compatability
-	change text "Send message" to "Stop sending" when running, with appropriate colors
-	auto-scroll 'response' window to bottom
-	disable system after 100 sent msgs with an error popup | allow bypass (also on backend) && only disable user for X time
-	stop sendMsg() if error thrown shows nothing will change with another attempt
-	exit loop after X errors (loopID++ || return)


### Backend
**HIGH PRIORITY**
- - - - - - -
-	handle when only a phone number entered and retrieve carrier to auto-fill sms gateway

**LOW PRIORITY**
- - - - - - -
-	consider having IP block with a time limit -> i.e. 100 msgs/per week
-	display error when mailto or body is missing
-	implement a required auth header with username and password based on time mixed with random string
-	$phoneGatewayRegex = '/^\+?[0-9]{10,11}@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/';

<!-- curl http://localhost/api/sendMsg -X POST -H 'Content-Type: application/json' -d "{'mailto': '8452132821@vtext.com','body': 'qwerty','count': 1}" -->