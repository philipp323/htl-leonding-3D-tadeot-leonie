//move floors and enable/disable rooms on floors
var newSelectedFloorIndex;
var floorsToMove;
async function floorSelect(name) {
  $("#keyboard").hide();
  visableFloorName = name;
  STANDORT_VISIBLE = false;
  standort.style.display = "none";
  filterVisableRooms();
  newSelectedFloorIndex = floors.indexOf(name);
  currentlySelectedFloorIndex = floors.indexOf(currentlySelectedFloor);
  if (newSelectedFloorIndex == currentlySelectedFloorIndex || currentlyMoving) {
    //Wenn kein floor bewegt werden muss...
    TOOLTIP_VISIBLE = true;
    return;
  }

  var elementList = document.getElementById("tooltips").children;

  for(let divElement of elementList) {
    divElement.style.display = "none";
  }

  if (floorButton != null) {
    floorButton.style.backgroundColor = "";
    floorButton.style.color = "white";
  }
  floorButton = document.getElementById(name);
  floorButton.style.backgroundColor = "white";
  floorButton.style.color = "#80cbc4";


  if(newSelectedFloorIndex > currentlySelectedFloorIndex){
    //console.log("we should move down");
    floorsToMove = floors.filter(f => floors.indexOf(f) > currentlySelectedFloorIndex && floors.indexOf(f) <= newSelectedFloorIndex);
    //console.log(floorsToMove);
    await move("down", floorsToMove);
  } else{
    //console.log("we should move up");
    floorsToMove = floors.filter(f => floors.indexOf(f) < currentlySelectedFloorIndex && floors.indexOf(f) > newSelectedFloorIndex);
    floorsToMove.push(currentlySelectedFloor);
    //console.log(floorsToMove);
    await move("up", floorsToMove);
  }
  
  currentlySelectedFloor = name;

  if (floors[0].toString() == visableFloorName) {
    $("#floorDisplay").text("Untergeschoss");
  }
  if (floors[1].toString() == visableFloorName) {
    $("#floorDisplay").text("Erdgeschoss");
  }
  if (floors[2].toString() == visableFloorName) {
    $("#floorDisplay").text("1. Obergeschoss");
  }
  if (floors[3].toString() == visableFloorName) {
    $("#floorDisplay").text("2. Obergeschoss");
  }
  if(floors[4].toString() == visableFloorName) {
    $("#floorDisplay").text("HTL Leonding");
  }
  //hideTooltip();
}