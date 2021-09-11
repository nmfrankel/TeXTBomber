// set dark mode if user prefers
window.onload = ()=>{
	const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
	if(userPrefersDark && memory('read', 'darkMode') === undefined || memory('read', 'darkMode')) toggleTheme()

	document.getElementById('urlAddress').innerText = endpoint

	// if(memory('read', 'sentCount'))
	// if user sent over 100 msgs display error that user is blocked
	// if user sent over 100 msgs display error that user is blocked
	// if user sent over 100 msgs display error that user is blocked
	// else memory('write', 'sentCount', 1)
}

const inputs = {
	'to': document.getElementById('to'),
	'body': document.getElementById('body'),
	'count': document.getElementById('count')
},
defaultRequest = document.getElementById('defaultRequest'),
request = document.getElementById('request'),
response = document.getElementById('response'),
queuedEl = document.getElementById('queued'),
queuedCount = document.getElementById('queuedCount'),
endpoint = window.location.protocol+'//'+window.location.host+'/api/sendMsg'
// endpoint = 'https://romemus.org/sendMessage.php'

let loopID = 0

// keep track of preferences in storage
const memory = (action, key, value = null) => {
	let settings = JSON.parse(decodeURI(localStorage.getItem('settings'))) || {}

	switch (action) {
		case 'read':
			return key? settings[key]: settings

		case 'write':
			if(key) settings[key] = value
			localStorage.setItem('settings', encodeURI(JSON.stringify(settings)))
			return settings

		case 'delete':
			delete settings[key]
			localStorage.setItem('settings', encodeURI(JSON.stringify(settings)))
			return settings

		case 'wipe':
			localStorage.removeItem('settings')
			return null

		default:
			console.error('[Error] Invalid action entered')
			return undefined
	}
}

// click 'this' element | for keyboard 'enter' support
const clickThis = (el, e) => {
	const keyCode = e.keyCode || e.which
	if(keyCode == 13) el.click()
}

// toggle between light and dark theme
const toggleTheme = () => {
	const rootTag = document.documentElement,
	isDark = rootTag.classList.contains('dark')

	// move toggle
	if(isDark){
		rootTag.classList.remove('dark')
		memory('write', 'darkMode', 0)
		document.getElementById('slider').classList.remove('dark')
	}else{
		rootTag.classList.add('dark')
		memory('write', 'darkMode', 1)
		document.getElementById('slider').classList.add('dark')
	}
	return !isDark
}

// format phone number to standard
const formatPhone = entry => {
	const validNumber = entry.match(/\(?([2-9]\d{2})\)?[-. ]?(\d{0,3})?[-. ]?(\d{0,4})?\s*$/),
	validEmail = entry.match(/^[\w0-9.!#$%&’*+\=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)

	// make sure info entered not an email
	if(validNumber[3]) entry = `+1 ${validNumber[1]} ${validNumber[2]}-${validNumber[3]}`

	// invalid entry entered
	if(!validNumber && !validEmail) console.log('Invalid phone number entered')

	return entry
}

// display the request with parameter values entered
const fillRequest = () => {
	const popuRequest = document.getElementById('popuRequest')
	let hasValue = 0

	loopID++
	queued.classList.add('hidden')

	// set new params
	popuRequest.innerHTML = ''
	for (const key in inputs) {
		let val = inputs[key].value
		if(!val) continue

		if(val.match(/\D/)) val = '"'+val+'"'
		if(hasValue) popuRequest.innerHTML += ',<br>'
		popuRequest.innerHTML += `&nbsp;&nbsp;&nbsp;&nbsp;"${key}": ${val}`
		hasValue++
	}

	// determine whether to display
	if(hasValue){
		defaultRequest.classList.add('hidden')
		request.classList.remove('hidden')
	}else{
		defaultRequest.classList.remove('hidden')
		request.classList.add('hidden')
	}
}

// copy element text by #
const copyContents = id => {
	const copyText = document.getElementById(id).innerText
	navigator.clipboard.writeText(copyText)
}

// generate random content | CONSIDER IMPROVING
const genRandom = (length=8) => {
	const random = 'qwertyuiopasdfghjklzxcvbnm'
	let text = ''

	while(length--) text += random[Math.floor(Math.random()*random.length+1)]
	return text
}

// generate a uuid
const uuid = () => {
	const u = Date.now().toString(16) + Math.random().toString(16)
	return [u.substr(0,2), u.substr(17, 2)].join('')
}
// calculate random number
const randNum = (max = 12) => {
	return Math.floor(Math.random() * max + 4)
}

// manage response window
const manageResponse = () => {

}

// prepare message spool to send
const spoolRequest = () => {
	const totalCount = 3

	queued.classList.remove('hidden')
	queuedCount.innerText = totalCount

	loopID++
	sendMsg(loopID, inputs.to.value, false, totalCount)
}

// send msg to server to send
const sendMsg = async(id, mailto, body, count = 1) => {
	// close old msg loop
	if(id !== loopID) return

	// set fetch info
	const data = {
		mailto,
		body: body+`[${uuid()}-0${('0'+count).slice(-2)}0]`
	},
	options = {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	}

	// make network fetch
	const res = await fetch(endpoint, options)
		.then(res => res.json())
		.catch(error => console.error(error))
		// on error retry upto 3 times
		// on error retry upto 3 times
		// on error retry upto 3 times

		console.log(res)// for development
		

	// update 'response' element - on success update sentCount in memory
	// update 'response' element - on success update sentCount in memory
	// update 'response' element - on success update sentCount in memory
	// memory('write', 'sentCount', sentCount++)

	// prepare next msg
	if(--count){
		const seconds = randNum()
		queuedCount.innerText = count+1

		// tell user when next msg will be sent
		// tell user when next msg will be sent
		// tell user when next msg will be sent

		setTimeout(() => {
			sendMsg(id, mailto, body, count)
		}, seconds*1000)
	}else{
		queued.classList.add('hidden')
	}
}
console.error('FINISH: function spoolRequest() && function sendMsg()')

// // clear old message loop & prepare the new loop
// const spoolRequest = () => {
// 	const toExecute = document.querySelector('input[name=production]:checked').value
// 	let hasValue = 0

// 	for (const key in inputs) {
// 		let val = inputs[key].value
// 		if(!val) continue

// 		hasValue++
// 	}

// 	if(hasValue < 3) return

// 	if(toExecute && inputs.count.validity.valid){
// 		if(Number(inputs.count.value) >= 1) queued.classList.remove('hidden')
// 		queuedCount.innerText = inputs.count.value

// 		loopID++
// 		sendMsg(to.value, body.value, inputs.count.value, loopID)

// 		// update the last child of #response to show current status of round until complete
// 		// highlight the number of messaged left and display the font in system-ui
// 		// check cache if under 3 times
// 		// show error and 'return' if over 10 messages (obviously if not on over ride)

// 		// consider changing inputs Object an Array, since most uses it's used with a loop
// 	}
// }

// clear .window contents for easy reading
const clearResponse = () => {
	response.innerText = 'Window cleared.\n// No response received yet.'
}