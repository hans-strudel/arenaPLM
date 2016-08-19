var fs = require('fs')

var desc = fs.readFileSync(__dirname + '\\ItemsDescrips.csv', 'utf8').replace(/,/g,'').replace(/\./g, ',').
replace(/"/g,' ').toUpperCase().split('\r\n')
var cat = fs.readFileSync(__dirname + '\\itemCats.csv', 'utf8').split('\r\n')
var appearances = {}
desc.pop()
cat.pop()
//console.log(desc)
//console.log(cat)

results = {}
len = {}

cat.forEach(function(e,i,a){
	len[e] = len[e]+1 || 1
	desc[i].split(' ').forEach(function(e2,i2,a2){
		e2 = e2.trim()
		appearances[e2] = appearances[e2] || {}
		appearances[e2][e] ? 
			appearances[e2][e]+=5 * Math.pow(2,a2.length-i2)/(a.length+1) : appearances[e2][e]=5 * Math.pow(5,a2.length-i2)
	})
	appearances[''] = 0
})

exports.match = function(input){ // returns category of item
	var score = {},	
		appr = {}
	input = input.toUpperCase().replace(/, /g, ' ').replace(/ /g, ',').replace(/\./g, ',')
	split = input.split(',')
	if (split.length == 1) split = input.split(' ')
	//console.log(split)
	split.forEach(function(e,i,a){
		for (x in appearances[e]){
			appr[x] = appr[x] || 1
			appr[x] += (appearances[e][x] || 0) * Math.pow(2,split.length-i) / (len[x] + 1)
			appr[x] = Math.floor(appr[x])
		}
		//console.log('HEERE -> ', e, appr[e], Math.pow(10,i))
	})
	var max = 0,
		cat
	for (x in appr){
		if (appr[x] > max){
			max = appr[x]
			cat = x
		}
	}
	console.log(cat)
	return cat
}