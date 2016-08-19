var r = require('robotjs'),
	fs = require('fs')
var x
count = 0
/* setInterval(()=>{
	ms = r.getMousePos()
	console.log(ms)
	console.log(r.getPixelColor(ms.x,ms.y))
}, 1000) */


function click(le){
	clearInterval(x)
	r.moveMouse(277, 451)
	r.mouseClick()
	setTimeout(function(){
		r.moveMouse(327, 137)
		r.mouseClick()
		for (x = 0;x < le;x++) {
			r.keyTap('down')
		}
		r.keyTap('enter')
		x = setInterval(function(){
			console.log(count)
			if (count > 15){
				fs.appendFileSync('errors.txt', le + ' --- ' + count)
				throw new Error('Waited too long')
			}
			if (r.getPixelColor(277,451) == 'eaeaea' && r.getPixelColor(277,500) == 'd8ffb8'){
				count = 0
				click(le+1)
			} else {
				count++
			}
		}, 5000)
	}, 500)
	console.log(le, count)
	
	
	if (le > 1000) throw new Error('OVERFLOW')
}
click(parseInt(process.argv[2]) || 1) // 505