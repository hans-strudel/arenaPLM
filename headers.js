// Hans Strausl @ Bestronics
// 2016


// detect file ext 

var path = require('path')

var validExt = ['.csv', '.xls', '.xlsx']

var filename = "x.xlsx"

var ext = path.extname(filename)

if (validExt.indexOf(ext) < 0){
	console.log(ext + ' filetype not supported')
} else {
	console.log(ext)
	// trigger corresponding parse function
}

// end

// handle headers

var fs = require('fs')

var data = fs.readFileSync('arenaItems.csv', 'utf8')
x = data.split('\r\n')
var max = 0
x.forEach(function(e,i,a){
	if (e.split(',').length > max && e.split(',').indexOf('') < 0 && max == 0) 
		max = i
})
console.log(max)
if (max > 1) x.splice(0,max)
data = x.join('\r\n')
console.log(data)

var csv = require('csv')

var opt = {
	skip_empty_rows: true,
	columns: ['a', 'c', 'b']
}

csv.parse(data, opt, function(err,data){
	x = data
	console.log(data)
})



/* headers = []
dt = []
data.forEach(function(e,i,a){
	cells = e.split(',')
	if (i == 0){
		cells.forEach(function(elm,ind,arr){
			headers.push(elm)
			dt[ind] = []
		})
	} else {
		cells.forEach(function(elm,ind,arr){
			console.log(arr)
			dt[ind].push(elm)
			
		})
	}
	console.log(dt)
})
 */
