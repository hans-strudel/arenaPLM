// Hans Strausl @ Bestronics
// 2016

var XLS = require('xlsjs'),
	fs = require('fs')
ml = require('./CategoryML/learn2.js')

const AUTHOR = 'HansS'

var arenaHeaders = 'Level,Item_number,item_name,revision,Quantity,bom_notes,Unit_Of_Measure,reference_designator'

var boms = []

function loadData(){
	var compare = fs.readFileSync('ITGitems.csv', 'utf8').split('\r\n')
	//var revs = fs.readFileSync('revs.csv', 'utf8').split('\r\n')
	var nname = fs.readFileSync('nname.csv', 'utf8').split('\r\n')

	var wk = XLS.readFile(process.argv[2])

	var cells = wk.Sheets[wk.SheetNames[0]]
	
	
	var rows = cells['!range']['e']['r']
	var obj = {}
	//console.log(cells["A1"],rows)
	
	es = {v:""}
	
	for (i= 2; i <= rows; i++){
		
		obj.name = (cells["A"+i] || es).v
		obj.rev = (cells["B"+i] || es).v
		obj.desc = (cells["X"+i] || es).v
		
		if (obj.name.indexOf("-" + obj.rev + "-") > -1){
			obj.Fname = obj.name.replace("-" + obj.rev + "-", "-")
		} else {
			obj.Fname = obj.name
		}
		if (obj.desc.indexOf('USE') > -1){
			boms.push({"name":obj.name, "Fname":obj.Fname, "rev":obj.rev, "desc":obj.desc})
		} 
		if (compare.indexOf(obj.Fname) > -1 || compare.indexOf(obj.name) > -1) {
			//console.log(obj.Fname, obj.name, compare.indexOf(obj.Fname))
			//boms.push({"name":obj.name, "Fname":obj.Fname, "rev":obj.rev, "desc":obj.desc})
			boms.push({"name":obj.name, 
			"Fname": nname[compare.indexOf(obj.Fname)] || nname[compare.indexOf(obj.name)],
			"rev":obj.rev,
			//"nrev":revs[compare.indexOf(obj.Fname)] || revs[compare.indexOf(obj.name)], 
			"desc":obj.desc})
			//console.log(boms[boms.length-1])
		}
	
		
	}
	//console.log(boms)
	
	// load second data

	var cells = wk.Sheets[wk.SheetNames[1]]
	var rows = cells['!range']['e']['r']
	
	var output
	start = 2
	lines = 0
	output = ''
	boms.forEach(function(elem,ind,arr){
		output += '0,' + (elem.Fname || elem.name) + ',"' + elem.desc.replace(/"/g, "''") + '",' + elem.rev + '-A,1,X,0\r\n'
		lines++
		for (start = 2;start<rows+1;start++){
			
			if (elem.name != cells["A"+start].v || elem.rev != cells["B"+start].v){
				//console.log(elem)
			} else {
				//console.log((elem.name) + ': ' + start)
				output += '1,' + (cells["F"+start] || es).v + ',"' + (cells["M"+start] || es).v.replace(/"/g, "''") 
				+ '"' + ',A,' + (cells["G"+start] || es).v + ',"' + (cells["T"+start] || es).v.replace('\r\n', '') + '",' + 
				(cells["S"+start] || es).v + ',"' + (cells["U"+start] || es).v + '",' +
				'\r\n'
				//console.log(output)
				lines++
			}
			
		}
		
		if (lines > 1500){
			try {
				fs.unlinkSync('boms2\\' + elem.name + elem.rev + '.csv')
			} catch (e){
				console.log(e)
			}
				fs.writeFile('boms2\\' +  elem.name + elem.rev  + '.csv', 
							arenaHeaders + '\r\n' + output, {flag: 'w' }, function(err){
					if (err) console.log(err)
				})
			lines = 0
			output = ''
		}
 	
		
		
	})
	
	
	
	
}
loadData()