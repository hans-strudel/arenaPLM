// Hans Strausl @ Bestronics
// 2016

var http = require('https');

var asId

var postData = JSON.stringify({
	"email": "yongjinkim@bestronicsinc.com",
	"password": "2090Best",
	"workspaceId": 896766075
})

var options = {
	hostname: 'api.arenasolutions.com',
	path: '/v1/items/attributes',
	method: 'GET',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': postData.length,
		'arena_session_id': 'LABS-HXAq91jTY1XXsjaBl2QVzkDITsA09VLr|'
	}
}

var req = http.request(options, function(res) {
	console.log('STATUS: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		console.log('BODY: ' + chunk)
		//asId = JSON.parse(chunk).arenaSessionId
	});
	
	res.on('end', function() {
		console.log('No more data in response.')
	})
});

req.on('error', function(e) {
	console.log('problem with request: ' + e.message);
});

// write data to request body

req.write(postData)