function filterVisableRooms() {
  var helpChar;
  if (floors[0].toString() == visableFloorName) {
    helpChar = "U";
  }
  if (floors[1].toString() == visableFloorName) {
    helpChar = "E";
  }
  if (floors[2].toString() == visableFloorName) {
    helpChar = "1";
  }
  if (floors[3].toString() == visableFloorName) {
    helpChar = "2";
  }
  visableRooms = objectArr.filter(
    //filter visable(clickable)Rooms, Floors shouldn't be there.
    x =>
      x.name[0] == helpChar &&
      x.name != floors[0] &&
      x.name != floors[1] &&
      x.name != floors[2] &&
      x.name != floors[3]
  );
  if (helpChar == "U") {  //also add the K's just for the naming..
    var kRooms = objectArr.filter(x => x.name[0] == "K");
    kRooms.forEach(r => visableRooms.push(r));
  }
  //"vor" Problem lösen
  if (helpChar == "E") {
    var vorRooms = objectArr.filter(x => x.name.startsWith('v'));
    vorRooms.forEach(r => visableRooms.push(r));
  }
}

function handleEvents() {
  intersectObjects = raycaster.intersectObjects(visableRooms, true);
  intersectedFloors = raycaster.intersectObjects(objects, true);

  if (intersectObjects.length > 0 && MODE == "ROOM" && CLICKABLE) {
    selectedRoom = intersectObjects[0].object;
    var exhibit = exhibits.find(t => t.room.name == selectedRoom.name);

    //101/E30/E02 unclickbar machen
    if(selectedRoom.name == "101" || selectedRoom.name == "E02" || selectedRoom.name == "E30"){
      return 0;
    }

    $("#keyboard").hide();
    $("#abteilungsImg").show();
    allRoomsWhite();
    $("#tooltips").html("");
    $("#descCard").hide();
    selectedDepartment = "";
    TOOLTIP_VISIBLE = false;
    hideTooltip();
    $("#teacherImage").remove();

    selectedRoom = intersectObjects[0].object;
    var exhibit = exhibits.find(t => t.room.name == selectedRoom.name);
    if(line != undefined){
      line.visible = false;
    }
    mqttPublish("Standort1", selectedRoom.name);

    //wenn ein Raum ausgewählt wird der mehrere Austellungen beinhaltet.
    // if (allRooms.filter(r => r.name.substring(0, 3) == selectedRoom.name.substring(0, 3)).length > 1 && exhibit == undefined) { //nur hier reingehen wenn man den Boden auswählt, also exhibit = undefined
    //   var roomsToSelect = allRooms.filter(r => r.name.substring(0, 3) == selectedRoom.name.substring(0, 3));
    //   var localExhibit = exhibits.find(t => t.room.name == selectedRoom.name);
    //   roomsToSelect.forEach(r => {
    //     var localExhibit = exhibits.find(t => t.room.name == r.name);
    //     if (localExhibit != undefined) {
    //       chooseRoom(r.name, localExhibit.supervisor, localExhibit.name, localExhibit.department, true);
    //     }
    //   });
    //   TOOLTIP_VISIBLE = true;
    //   return;
    // }

    randomColor = new THREE.Color(Math.random() * 0xffffff);
    selectedRoom.material.color = randomColor;

    // console.log(selectedRoom.name);
    // console.log(visableRooms);

    if (exhibit != undefined) {
      setExhibitTooltip(selectedRoom.name, exhibit.tooltipText, exhibit.department, exhibit.room.visibleName);
      path = pathToRoom(selectedRoom.name);
      $("#teacherName").text(exhibit.name);
      $("#teacherDesc").text(path);
      $("#descCard").show();
    } else {
      updateTooltip(selectedRoom.name, "-", "-", selectedRoom.name, false, false);
    }
    needsUpdate = true;
    setTimeout(function () {
      TOOLTIP_VISIBLE = true;
      showTooltip();
    }, 50);
  }
  if (intersectedFloors.length > 0 && MODE == "FLOOR") {
    floorName = intersectedFloors[0].object.name;
    if (floors.includes(floorName)) {
      MODE = "ROOM";
      floorSelect(floorName);
    }
    needsUpdate = true;
  }
}

function getAllRooms() {
  allRooms = objectArr.filter(
    x =>
      x.name != floors[0] &&
      x.name != floors[1] &&
      x.name != floors[2] &&
      x.name != floors[3] &&
      x.name != 'ceiling'
  );
}
function chooseRoom(roomName, MULTIPLE_ROOMS) {
  $("#keyboard").hide();
  $("#abteilungsImg").show();
  //repositionCamera();
  var selectedRoomArray = allRooms.filter(room => room.name == roomName);
  if (!MULTIPLE_ROOMS) {
    selectedDepartment = "";
    $("#tooltips").html("");
    allRoomsWhite();
    hideTooltip();
    $("#teacherImage").remove();
  }
  selectedRoom = selectedRoomArray[0];
  if (selectedRoom != undefined) {
    var exhibit = exhibits.find(t => t.room.name == selectedRoom.name);
    if (!MULTIPLE_ROOMS) {
      if(line != undefined){
        line.visible = false;
    }
      mqttPublish("Standort1", selectedRoom.name);
      path = pathToRoom(selectedRoom.name);
      $("#teacherName").text(exhibit.name);
      $("#teacherDesc").text(path);
      $("#descCard").show();
      CHOOSING = true;
      chooseFloor(selectedRoom);
    } else {
      $("#descCard").hide();
    }
    setExhibitTooltip(selectedRoom.name, exhibit.tooltipText, exhibit.department, exhibit.room.visibleName);
    selectedRoom = selectedRoomArray[0];
    //console.log(selectedRoomArray);
    //console.log(selectedRoom);
    
    randomColor = new THREE.Color(Math.random() * 0xffffff);
    selectedRoom.material.color = randomColor;

    CHOOSING = false;
  }
}

function setExhibitTooltip(roomName, name, department, visibleRoomName) {
  var departments;
  var imagePath1;
  var imagePath2;
  var imagePath3;
  if(department.includes('/')){
    departments = department.split('/');
  }

  if(departments == undefined){
    imagePath1 = 'logos/' + department + "_big" + '.png';
  }else if(departments.length == 2){
    imagePath1 = 'logos/' + departments[0] + "_big" + '.png';
    imagePath2 = 'logos/' + departments[1] + "_big" + '.png';
  }else if(departments.length == 3){
    imagePath1 = 'logos/' + departments[0] + "_big" + '.png';
    imagePath2 = 'logos/' + departments[1] + "_big" + '.png';
    imagePath3 = 'logos/' + departments[2] + "_big" + '.png';
  }
  $.get(imagePath1)
    .done(function () {
      if(departments == undefined){
        updateTooltip(roomName, name, department, visibleRoomName, true, false, false);
        $('#' + roomName + 'Image1').attr("src", imagePath1);
        return;
      }
      if(departments.length == 2){
        updateTooltip(roomName, name, department, visibleRoomName, true, true, false);
        $('#' + roomName + 'Image1').attr("src", imagePath1);
        $('#' + roomName + 'Image2').attr("src", imagePath2);
      }
      if(departments.length == 3){
        updateTooltip(roomName, name, department, visibleRoomName, true, false, true);
        $('#' + roomName + 'Image1').attr("src", imagePath1);
        $('#' + roomName + 'Image2').attr("src", imagePath2);
        $('#' + roomName + 'Image3').attr("src", imagePath3);
      } 
    }).fail(function () {
      updateTooltip(roomName, name, department, visibleRoomName, false, false);
    });
}

async function onDocumentMouseDown(event) {
  //event.preventDefault();
  //console.log("Entered Mouse-Down");
  TOOLTIP_VISIBLE = true;
  //console.log(controls);

  mouse3D = new THREE.Vector3(
    ((event.clientX - renderer.domElement.offsetLeft) / window.innerWidth) * 2 - 1,
    -((event.clientY - renderer.domElement.offsetTop) / window.innerHeight) * 2 + 1,
    0.5);
  raycaster.setFromCamera(mouse3D, camera);
  filterVisableRooms();
  intersectObjects = raycaster.intersectObjects(visableRooms, true);
  //console.log(intersectObjects);
  if (intersectObjects.length > 0 && MODE == "ROOM") {
    event.preventDefault();

    handleEvents();
    needsUpdate = true;
  }
}

async function onDocumentMouseUp(event) {
  // console.log("Mouse up");
  TOOLTIP_VISIBLE = true;
}

async function onDocumentTouchEnd(event) {
  // console.log("touch end");
  TOOLTIP_VISIBLE = false;
}

async function onDocumentTouchDown(event) {

  //event.preventDefault();
  TOOLTIP_VISIBLE = true;
  mouse3D = new THREE.Vector3(
    ((event.changedTouches[0].clientX - renderer.domElement.offsetLeft) /
      window.innerWidth) * 2 - 1, -
      ((event.changedTouches[0].clientY - renderer.domElement.offsetTop) /
        window.innerHeight) * 2 + 1, 0.5
  );
  raycaster.setFromCamera(mouse3D, camera);

  filterVisableRooms();

  // console.log("Entered Touch-Down");
  handleEvents();
  needsUpdate = true;
}

async function onControlsChange() {
  TOOLTIP_VISIBLE = true;
}

function departmentSelect(departmentName) {
  if(line != undefined){
    line.visible = false;
  }
  allRoomsWhite();
  $("#tooltips").html("");
  exhibitsWithDepartment = exhibits.filter(x => x.department.includes(departmentName));

  selectedDepartment = departmentName;

  exhibitsWithDepartment.forEach(e => chooseRoom(e.room.name, true));

  var roomArrayWithDepartment = [];
  exhibitsWithDepartment.forEach(e => {
    roomArrayWithDepartment.push(allRooms.filter(r => r.name == e.room.name)[0]);
  });

  var currentlySelectedFloorOK = true;

  roomArrayWithDepartment.forEach(r => {
    if (r != undefined) {
      var floorChar = r.name.charAt(0);
      if (floorChar == "U" || floorChar == "K") {
        if ('cellar' == currentlySelectedFloor) {
          currentlySelectedFloorOK = true;
        } else {
          currentlySelectedFloorOK = false;
        }
      } else if (floorChar == "E" || floorChar == "v") {
        if ('ground_floor' == currentlySelectedFloor) {
          currentlySelectedFloorOK = true;
        } else {
          currentlySelectedFloorOK = false;
        }
      } else if (floorChar == "1") {
        if ('first_floor' == currentlySelectedFloor) {
          currentlySelectedFloorOK = true;
        } else {
          currentlySelectedFloorOK = false;
        }
      } else {
        if ('second_floor' == currentlySelectedFloor) {
          currentlySelectedFloorOK = true;
        } else {
          currentlySelectedFloorOK = false;
        }
      }
    }
  });

  if (!currentlySelectedFloorOK) {
    chooseFloor(roomArrayWithDepartment[0]);
  }
  var exhibitsFilterByDepartment = exhibits.filter(x => x.department.includes(departmentName));
  var floorNames = [];
  exhibitsFilterByDepartment.forEach(e => {
    if(!floorNames.includes(e.room.name[0])){
      floorNames.push(e.room.name[0]);
    }
  });
  $("#teacherName").text(departmentName);
  $("#teacherDesc").text("Austellungen insgesamt: " + exhibitsFilterByDepartment.length + "\n Stockwerke: ");
  floorNames.forEach(n => {
    if(n != 'K'){
      $("#teacherDesc").append(n);
    }
    //console.log(floorNames.indexOf(n));
    if(floorNames.length != 1 && n != floorNames[floorNames.length - 1] && n != 'K'){
      $("#teacherDesc").append(', ');
    }
  });
  $("#descCard").show();
}

function allRoomsWhite() {
  allRooms.forEach(r => {
      r.material.color.setHex(0xffffff);
      if(r.isSphere){
        //r.material = new THREE.MeshBasicMaterial({ color: 0xc7c7c7 }); //invisible
        r.material.color.setHex(0xCCCCCC);
        needsUpdate = true;
        //r.visible = false;
      }
  });
}

function chooseFloor(room) {
  var floorChar = room.name.charAt(0);
  MODE = "ROOM";
  if (floorChar == "U" || floorChar == "K") {
    floorSelect('cellar');
    hideStandort();
  } else if (floorChar == "E" || floorChar == "v") {
    floorSelect('ground_floor');
    hideStandort();
  } else if (floorChar == "1") {
    floorSelect('first_floor');
    showStandort();
  } else {
    floorSelect('second_floor');
    hideStandort();
  }
}

function calculateLatestMouseIntersection(room) {
  var vector = new THREE.Vector3(
    room.geometry.attributes.position.array[0],
    room.geometry.attributes.position.array[1],
    room.geometry.attributes.position.array[2]
  );
  //console.log(vector);
  latestMouseIntersection = vector;
}