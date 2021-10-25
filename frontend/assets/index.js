// set vars for use throughout system
const inputs = document.forms[0].elements,
defaultRequest = document.getElementById('defaultRequest'),
request = document.getElementById('request'),
response = document.getElementById('response'),
queuedEl = document.getElementById('queued'),
queuedCount = document.getElementById('queuedCount'),
endpoint = window.location.protocol+'//'+window.location.host+'/api/sendMsg/'
// endpoint = 'https://romemus.org/sendMessage.php'

let loopID = 0

// set basic settings for system to function
window.onload = ()=>{
	// display darkMode if preferred
	const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
	if(userPrefersDark && memory('read', 'darkMode') === undefined || memory('read', 'darkMode')) toggleTheme()

	// display endpoint that will be used 
	document.getElementById('urlAddress').innerText = endpoint

	// block system if user sent over 100 msgs || allow bypass && set a system timeout
	if(memory('read', 'sentCount') >= 100) alert('You are over using this system and may not send any more messages, try again later')
}

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
	entry = entry.replace(/[\s\(\)-]/g, '')
	const validNumber = entry.match(/\(?([2-9]\d{2})\)?[-. ]?(\d{0,3})?[-. ]?(\d{0,4})?\s*$/),
	validEmail = entry.match(/^[\w0-9.!#$%&’*+\=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)

	// make sure info entered not an email
	if(validNumber?.[3]) entry = `(${validNumber[1]}) ${validNumber[2]}-${validNumber[3]}`

	// invalid entry entered
	if(!validNumber && !validEmail) console.log('Invalid phone number & email entered')

	return entry
}

// copy element text by #
const copyContents = id => {
	const copyText = document.getElementById(id).innerText
	navigator.clipboard.writeText(copyText)
}

// manage response window
const createResEl = (txt, err) => {
	let newRow = document.createElement('div')
	if(err) newRow.classList.add('error')
	newRow.innerText = txt

	response.getElementsByClassName('default')[0]?.remove()
	response.append(newRow)
}

// clear .window contents for easy reading
const clearResponse = () => {
	response.innerHTML = 'Window cleared.<div class="default">// No response received yet.</div>'
}

// display the request with parameter values entered
const fillRequest = () => {
	const populRequest = document.getElementById('populRequest')
	let hasValue = 0

	loopID++
	queued.classList.add('hidden')

	// set new params
	populRequest.innerHTML = ''
	for (const key in inputs) {
		let val = inputs[key].value
		if(!val || key >= 0) continue

		if(inputs[key].placeholder.toLowerCase() === 'string') val = '"'+val+'"'
		if(hasValue) populRequest.innerHTML += ',<br>'
		populRequest.innerHTML += `&nbsp;&nbsp;&nbsp;&nbsp;${key}: <span class="${inputs[key].placeholder.toLowerCase()}">${val}</span>`
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

// prepare message spool to send
const spoolRequest = () => {
	// do something if in sandbox mode
	// document.querySelector('input[name=production]:checked').value
	
	if(!document.forms[0].checkValidity()){
		createResEl('Input value(s) entered are invalid', 1)
		return
	}

	queued.classList.remove('hidden')
	queuedCount.innerText = inputs.count.value

	loopID++
	memory('write', 'errCount', 0)
	sendMsg(loopID, inputs.mailto.value, inputs.body.value, inputs.count.value)
}

// send msg to server to send
const sendMsg = async(id, mailto, body, count = 1) => {
	// close old msg loop
	if(id !== loopID) return

	// set fetch info
	const data = {
		mailto,
		body: body+`[${uuid()}-0${('0'+count).slice(-2)}X]`
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
	console.log(res)// for development

	// process response
	const wasSuccess = res.errCode===0
	if(res) createResEl(res.msg, res.errCode)
	if(wasSuccess){
		const sentCount = memory('read', 'sentCount') || 0
		memory('write', 'sentCount', sentCount+1)
	}else{
		const errCount = memory('read', 'errCount')
		memory('write', 'errCount', errCount+1)
		// do somethign with this info | 'return' after X errors
	}

	// prepare next msg
	if(--count /* || errCode shows that another attempt won't change anything */){
		const seconds = randNum()
		queuedCount.innerText = count+1

		createResEl('Next message '+(!wasSuccess? 'attempt ': '')+'will be sent in '+seconds+' seconds')

		setTimeout(() => {
			sendMsg(id, mailto, body, count)
		}, seconds*1000)
	}else{
		queued.classList.add('hidden')
	}
}