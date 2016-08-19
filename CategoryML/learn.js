var fs = require('fs')

var descriptions = fs.readFileSync('itemsDescrips.csv', 'utf8').split('\r\n')
var categories = fs.readFileSync('itemCats.csv', 'utf8').split('\r\n')

var appearances = {}

//console.log(descriptions)

descriptions.forEach(function(desc,ind,arr){
	desc = desc.replace(/"/g, '').replace(/,/g, '').toUpperCase().trim()

	desc.split(' ').forEach(function(word,i,a){
		appearances[word] = appearances[word] || {}
		appearances[word][categories[ind]] = appearances[word][categories[ind]] || 0
		appearances[word][categories[ind]] += Math.pow(2, a.length-i)/a.length * 10
	})
})

function match(input){
	input = input.toUpperCase().trim().split(' ')
	input.forEach(function(word, i, a){
		for (x in appearances(word)){
			
		}
	})
}