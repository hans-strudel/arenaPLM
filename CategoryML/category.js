var fs = require('fs')

var categories = JSON.parse(fs.readFileSync('categories.json', 'utf8').toUpperCase())

//console.log(categories)

//breaks into array, not crazy
function match(input){ // returns category of item
	var score = {}
	input = input.toUpperCase().replace(/\./g, '')
	split = input.split(',')
	if (split.length == 1) split = input.split(' ')
	console.log(split)
	split.forEach(function(e,i,a){
		//console.log(categories.indexOf(e))
		e = e.trim()
		if (categories.indexOf(e) > -1){
			score[categories[categories.indexOf(e)]] = 0
			score[categories[categories.indexOf(e)]] += 10
			if (i==0) score[categories[categories.indexOf(e)]] += 15
		}
		for (c = 0; c < categories.length; c++){
			
			if (categories[c].indexOf(e) > -1){
				score[categories[c]] = 0
				score[categories[c]] += 5
				if (categories[c].indexOf(e) == 0) score[categories[c]] += 10
			}
			
		}
		//console.log(score)
	})
	console.log(score)
}

match2('Ship Box Ð 14 div 20x 13x1/2 x10')

function match2(input){
	var score = {},
		mult = 0
	
	
	input = input.toUpperCase().trim()
	categories.forEach(function(e,i,a){
		score[e] = 0
		for (c = 0; c < input.length; c++){
			if (c > e.length) break;
			if (input[c] == e[c]){
				if (c==0) score[e] += 10
				score[e] += mult * 2 + 1
				mult += 5
			} else {
				score[e] -= 1
				mult = 0
			}
		}
	})
	var max = 0,
		cat
	for (x in score){
		if (score[x] > max){
			max = score[x]
			cat = x
		}
	}
	console.log(score, cat)
	
}