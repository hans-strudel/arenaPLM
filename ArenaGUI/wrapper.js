var fs = require('fs'),
	path = require('path'),
	https = require('https')
	
//var sessionID = '' // global

var currGUID // global

var host = 'api.arenasolutions.com'

var contentType = 'application/JSON' // always the same

request = function(pData, options, callback){  //returns JSON object
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
			console.log(dt)
			callback(JSON.parse(dt))
		})
	});
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	req.write(pData)
	req.end()
}

login = function(cb){ // returns sessionID to callback
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

search = function(data, cb){ // data is json obj	
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
	request('', options, cb) // returns list of items
}

getRevisions = function(GUID, cb){
	var options = {
		hostname: host,
		path: '/v1/items/' + GUID + '/revisions',
		method: 'GET',
		headers: {
			'Content-Type': contentType,
			'arena_session_id': sessionID
		}
	}
	request('', options, cb)			// each item rev has a GUID
}

getDetailedInfo = function(GUID, cb){
	var options = {
		hostname: host,
		path: '/v1/items/' + GUID,
		method: 'GET',
		headers: {
			'Content-Type': contentType,
			'arena_session_id': sessionID
		}
	}
	request('', options, cb)			// each item rev has a GUID
}

getBOM = function(GUID, cb){
	var options = {
		hostname: host,
		path: '/v1/items/' + GUID + '/bom',
		method: 'GET',
		headers: {
			'Content-Type': contentType,
			'arena_session_id': sessionID
		}
	}
	request('', options, cb)
}

updateItem = function(GUID, attr, nVal, cb){
	var data = {}
	data[attr] = nVal
	
	data = JSON.stringify(data)
		
	var options = {
		hostname: host,
		path: '/v1/items/' + GUID,
		method: 'PUT',
		headers: {
			'Content-Type': contentType,
			'arena_session_id': sessionID
		}
	}
	request(data, options, cb)
}

// this is gonna be ridiculously hard im not doing it
/* addFile = function(GUID, file, cb){ // file should be full static path
	var fileInfo = path.parse(file)
	var fileData = fs.readFileSync(file, 'utf8')
	
	var data = {
		"file": {
			"location": file,
			"storageMethod": 0,
			"title": fileInfo.name,
			"edition": "1",
			"format": fileInfo.ext.substr(1,fileInfo.ext.length)
		},
		'fileContent': fileData
	}
	data = JSON.stringify(data)
	
	var options = {
		hostname: host,
		path: '/v1/items/' + GUID + '/files',
		method: 'POST',
		headers: {
			'Content-Type': 'multipart/form-data',
			'arena_session_id': sessionID
		}
	}
	
	request(data, options, cb)
} */