// Hans Strausl @ Bestronics
// 2016

var http = require('https'),
	fs = require('fs')

var sessID

var host = 'api.arenasolutions.com'

function request(pData, options, callback){  //returns JSON object
	options.headers['Content-Length'] = pData.length
	var dt = ''
	var req = http.request(options, function(res) {
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

function login(){
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
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}
	request(postData, options, function(data){
		console.log(data.arenaSessionId)
		sessID = data.arenaSessionId
		init(sessID)
	})
}

function init(sessID){
	query = ''
	query = "/2K4NSI5VA2L2L0PVAL91"
	var dtl = JSON.stringify({
			"standardCost":50.12,
			"additionalAttributes": [{
				"value": "2000",
				"apiName": "custom269446988"
			}]
		})
	var options = {
		hostname: host,
		path: '/v1/items' + query,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/JSON',
			'arena_session_id': sessID
		}
	}
	request(dtl, options, function(data){
		console.log(data)
		fs.writeFile('data.json', JSON.stringify(data), function(err){
			console.log(err)
		})
	})
}

login()