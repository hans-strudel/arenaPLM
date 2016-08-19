var remote = require('remote'),
	dialog = remote.require('dialog'),
	fs = require('fs'),
	path = require('path'),
	https = require('https')
	
var sessionID // global

var currGUID // global

var host = 'api.arenasolutions.com'

var contentType = 'application/JSON' // always the same

var categories = JSON.parse(fs.readFileSync('categories.json'))

function request(pData, options, callback){  //returns JSON object
	options.headers['Content-Length'] = pData.length
	var dt = ''
	var req = https.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk)
			dt += chunk
		});
		
		res.on('end', function() {
			console.log('No more data in response.')
			callback(JSON.parse(dt))
		})
	});
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	req.write(pData)
	req.end()
}

function login(cb){ // returns sessionID to callback
	var postData = JSON.stringify({
		"email": "yongjinkim@bestronicsinc.com",
		"password": "2090Best",
		"workspaceId": 896766075
	})
	
	var options = {
		hostname: host,
		path: '/v1/login',
		method: 'POST',
		headers: {
			'Content-Type': contentType
		}
	}
	request(postData, options, function(data){
		console.log(data.arenaSessionId)
		sessionID = data.arenaSessionId
		cb(sessionID)
	})
}

window.addEventListener('load', function(){
	login(init)
})

function init(sessionID){
	//search({'number':''})
	var sData = {}
	document.getElementById('searchSub').onclick = function(){
		sData['number'] = document.getElementById('searchBar').value
		search(sData)
	}
}

function search(data){ // data is json obj	
	var query = '?'
	for (key in data){
		query += key + '=' + data[key]
	}
	var options = {
		hostname: host,
		path: '/v1/items' + query,
		method: 'GET',
		headers: {
			'Content-Type': contentType,
			'arena_session_id': sessionID
		}
	}
	request('', options, showSearch)
}

function showSearch(data){
	var container = document.getElementById('searchResults')
	container.innerHTML = ''
	var res = data.results
	if (res.length < 1){
		container.innerHTML += '<span class="error">NO RESULTS</span>'
	} else {
		res.forEach(function(e){
			container.innerHTML += 
			'<div class="info"><span hidden>' + e.guid + 
			'</span><div class="number">' + e.number + '</div>' +
			'<div class="rev">&nbsp;&nbsp;rev ' + e.revisionNumber + '</div>' +
			'<div class="name">' + e.name + '</div></div><br />'
		})
		Array.from(document.getElementsByClassName('number')).forEach(function(e){
			e.onclick = function(){
				getDetailedInfo(this.previousElementSibling.innerHTML)
			}
		})
	}
}

function getDetailedInfo(guid){
	currGUID = guid
	var options = {
		hostname: host,
		path: '/v1/items' + '/' + guid + '/revisions',
		method: 'GET',
		headers: {
			'Content-Type': contentType,
			'arena_session_id': sessionID
		}
	}
	request('', options, (data)=>{			// each item rev has a GUID
		wrguid = data.results[0].guid		// grab the working rev GUID
		console.info(data.results)
		currGUID = wrguid
		options.path = '/v1/items' + '/' + wrguid
		request('', options, showDetailedInfo)
		options.path = '/v1/items' + '/' + wrguid + '/bom'
		//request('', options, showBom)
	})
}

function showDetailedInfo(data){
	var container = document.getElementById('searchResults')
	container.innerHTML = ''

	for (key in data){
		var info = document.createElement('div')
		info.className = 'info'
		container.appendChild(info)
		info.innerHTML = '<div class="key">' + key + '</div>'
		d =''
		var dx = document.createElement('div')
				dx.className = 'data'
				info.appendChild(dx)
		if (typeof data[key] == 'object' && !!data[key] && !!data[key]['guid']){
			if (typeof data[key]['guid'] != 'undefined'){
				console.log(data[key]['guid'])
				d = categories[data[key]['guid']]
				
				var sList = document.createElement('select')
				dx.appendChild(sList)
				for (cat in categories){
					sList.innerHTML += '<option '+ ((d == categories[cat])?'selected':'')
					+ ' value={"guid":"' + cat + '"}>' + categories[cat] + '</option>'
				}
			}
		} else {
			d = JSON.stringify(data[key])
			dx.innerHTML +='<input value=' + d + '></input>'
		}

		console.log(d, typeof data[key])
		dx.innerHTML += '<button class="update" id=' + key + '>UPDATE</button>'
		container.innerHTML += '<br />'
	}
	Array.from(document.getElementsByClassName('update')).forEach(function(e){
		e.onclick = function(){
			updateAttr(this.id, this.previousElementSibling.value)
	 	}
	})
}

function updateAttr(attr, nVal){
	var data = {}
	try {
		nVal = JSON.parse(nVal)
	} catch (e) {
		console.log(e)
	}
	
	data[attr] = nVal
	console.log(data)
	data = JSON.stringify(data)
		
	var options = {
		hostname: host,
		path: '/v1/items' + '/' + currGUID,
		method: 'PUT',
		headers: {
			'Content-Type': contentType,
			'arena_session_id': sessionID
		}
	}
	request(data, options, (e)=>{console.log(e)})
}