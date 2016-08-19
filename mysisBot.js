var r = require('robotjs'),
	fs = require('fs')
var x
count = 0
// setInterval(()=>{
	// ms = r.getMousePos()
	// console.log(ms)
	// console.log(r.getPixelColor(ms.x,ms.y))

	r.moveMouse(247, 195)
	r.mouseClick()

function click(le){

	//edit
	setTimeout(function(){
		r.moveMouse(237,71)
		r.mouseClick()
		setTimeout(function(){
			r.moveMouse(621,170)
			r.mouseClick()
			setTimeout(function(){
				r.moveMouse(1191,240)
				r.mouseClick()
				setTimeout(function(){
					r.moveMouse(1397,10)
					r.mouseClick()
					setTimeout(function(){
						// if (r.getPixelColor(831,531) == '3252a4'){
							// console.log('yeee')
							r.keyTap('tab')
							r.keyTap('enter')
						// }
						setTimeout(function(){
							//r.keyTap('tab')
							click()
						}, 1000)
					}, 1000)
				}, 1500)
			}, 2000)
		}, 3000)
	}, 1500)
	
	

	
	if (le > 5) throw new Error('OVERFLOW')
}
click(parseInt(process.argv[2]) || 1) // 
