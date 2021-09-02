// set dark mode if user prefers
window.onload = ()=>{
	const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
	if(userPrefersDark && memory('read', 'darkMode') === undefined || memory('read', 'darkMode')) toggleTheme()
}

const request = document.getElementById('request'),
response = document.getElementById('response'),
queuedEl = document.getElementById('queued'),
queuedCount = document.getElementById('queuedCount'),
endpoint = 'http://localhost/api/campaign/a73b6940-f80a-4d3f-a92c-fd3dc508a1c8/confirm/' // 'https://romemus.org/sendMessage.php'

let loopID = 0

// keep track of preferences in storage
const memory = (action, key, value = null) => {
	let settings = JSON.parse(decodeURI(localStorage.getItem('settings'))) || {}

	switch (action) {
		case 'read':
			return settings[key]

		case 'set':
			if(key) settings[key] = value
			localStorage.setItem('settings', encodeURI(JSON.stringify(settings)))
			return settings

		case 'remove':
			delete settings[key]
			localStorage.setItem('settings', encodeURI(JSON.stringify(settings)))
			return settings

		case 'delete':
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
		memory('set', 'darkMode', 0)
	}else{
		rootTag.classList.add('dark')
		memory('set', 'darkMode', 1)
	}
	return !isDark
}

// generate a uuid
const uuid = ()=>{
	const u = Date.now().toString(16) + Math.random().toString(16)
	return [u.substr(0,4), u.substr(17, 4)].join('-')
}
// calculate random number
const randNum = max => {
	return Math.floor(Math.random() * max + 4)
}

// clear old message loop & prepare the new loop
const spoolRequest = () => {
	const toExecute = document.querySelector('input[name=production]:checked').value

	if(toExecute){
		const props = {
			'to': document.getElementById('to'),
			'body': document.getElementById('body'),
			'count': document.getElementById('count')
		}
		console.log(Number(props.count.value))
		
		if(Number(props.count.value) > 1) queued.classList.remove('hidden')
		queuedCount.innerText = count

		loopID++
		sendMsg(to.value, body.value, count.value--, loopID)

		// response.innerHTML = ''
		// update the last child of #response to show current status of round until complete
		// highlight the number of messaged left and display the font in system-ui
		// check cache if under 3 times
		// show error and 'return' if over 10 messages (obviously if not on over ride)
	}
}

// spool message to be sent on backend
const sendMsg = async(recip, body = "Error occured", count = 1, id = null) => {
	// prevent multiple loops going at once
	if(id !== loopID) return

	queuedCount.innerText = count
	if(count < 1) queued.classList.add('hidden')

	// send message to server
	const res = await fetch(endpoint + `?recip=${recip}&body=${body}\n[00${count}-${uuid()}]`)
		.then(res => res.json())
		.catch(error => console.error(error))

	// display response
	if(res.sent) response.innerHTML += ' | Success'
	
	// start next cycle
	if(count--){
		queuedCount.innerText = count

		const seconds = randNum(8)
		response.innerHTML += `<br>System will be sending another message in ${seconds} seconds. There are ${count+1} messages left to be sent.`
		setTimeout(() => {
			sendMsg(recip, body, count, id)
		}, seconds*1000)
	}
}