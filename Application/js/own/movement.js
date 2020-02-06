async function move(direction, roomsToMove) {
	ANIMATING = true;
	var movArr = [];
	const milliseondsToWait = 1000;

	for (var i = 0; i < roomsToMove.length; i++) {
		movArr.push(objectArr.find(x => x.name === roomsToMove[i]));
	}
	//console.log(movArr);
	if (direction == "up") {
		//console.log("move up called");

		var position = { y: 0 };
		var target = { y: 600 };
		var tween = new TWEEN.Tween(position).to(target, milliseondsToWait);
		tween.easing(TWEEN.Easing.Linear.None);

		tween.onUpdate(function () {
			movArr.forEach(obj => obj.position.y = position.y);
			needsUpdate = true;
		});

		movArr.forEach(obj => getRoomsToHide(obj).forEach(r => r.visible = false))

		disableButtonsForAnimation();
		TOOLTIP_VISIBLE = false;
		if(selectedDepartment == ""){
			$("#tooltips").html('');
		}
		tween.start();

		setTimeout(function () {
			enableButtonsAfterAnimation();
			//mov.position.y = 0;
			TOOLTIP_VISIBLE = true;
			//back to zero and make unvisible
			movArr.forEach(obj => {
				//obj.material.forEach(m => m.opacity = "0.5");
				obj.visible = false;
				obj.position.y = 0;
			});
			ANIMATING = false;
		}, milliseondsToWait + 50);
	}


	else if (direction == "down") {
		//console.log("move down called");

		var position = { y: 600 };
		var target = { y: 0 };
		var tween = new TWEEN.Tween(position).to(target, milliseondsToWait);
		tween.easing(TWEEN.Easing.Linear.None);
		movArr.forEach(obj => {
			obj.visible = true;
			obj.position.y = 600;
		});

		tween.onUpdate(function () {
			movArr.forEach(obj => obj.position.y = position.y);
			needsUpdate = true;
		});

		disableButtonsForAnimation();
		TOOLTIP_VISIBLE = false;
		if(selectedDepartment == ""){
			$("#tooltips").html('');
		}
		tween.start();

		setTimeout(function () {
			enableButtonsAfterAnimation();
			//mov.position.y = 0;
			TOOLTIP_VISIBLE = true;
			movArr.forEach(obj => getRoomsToHide(obj).forEach(r => r.visible = true));
			//back to zero and make unvisible
			movArr.forEach(obj => {
				obj.visible = true;
				obj.position.y = 0;
			});
			ANIMATING = false;
		}, milliseondsToWait + 50);
	}
}

function disableButtonsForAnimation() {
	ENABLEDBUTTONS = false;
	document.getElementById('cellar').disabled = true;
	document.getElementById('ground_floor').disabled = true;
	document.getElementById('first_floor').disabled = true;
	document.getElementById('second_floor').disabled = true;
	document.getElementById('ceiling').disabled = true;
}

function enableButtonsAfterAnimation() {
	ENABLEDBUTTONS = true;
	document.getElementById('cellar').disabled = false;
	document.getElementById('ground_floor').disabled = false;
	document.getElementById('first_floor').disabled = false;
	document.getElementById('second_floor').disabled = false;
	document.getElementById('ceiling').disabled = false;
}

function getRoomsToHide(mov) {
	var roomsToHide = [];
	if (mov.name == "ground_floor") {
		roomsToHide = objectArr.filter(x => x.name.startsWith('E') || x.name.startsWith('v'));
	}
	if (mov.name == "first_floor") {
		roomsToHide = objectArr.filter(x => x.name.startsWith('1'));
	}
	if (mov.name == "second_floor") {
		roomsToHide = objectArr.filter(x => x.name.startsWith('2'));
	}
	return roomsToHide;
}