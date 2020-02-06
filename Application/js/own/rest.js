function request(){
    console.log("REST: Request started...");

    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest()

    //your backend url
    request.open('GET', 'http://vm85.htl-leonding.ac.at:8080/Tadeot/api/exhibit');
    request.onload = function() {
        var data = JSON.parse(this.response)
        exhibits = data;

        exhibits.forEach(t => t.room.name = t.room.name.replace(/[^ \w]/g, ""));
        exhibits.sort((a, b) => a.name.localeCompare(b.name));

        if (request.status >= 200 && request.status < 400) {
            console.log("REST: Request finished.");
            console.log(exhibits);
            addItemsToHTML(exhibits);
            setupSpheres();
            getAllRooms();
        } else {
            console.log("REST: Request error.");
        }
    }

    // Send request
    request.send();
}

function addItemsToHTML(list){
    var itemsDiv = $("#items-wrapper");
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        //color the list Items
        var departments = [];
        if(item.department.includes("Informatik")){
            departments.push("#004f9f");
        }
        if(item.department.includes("Medientechnik")){
            departments.push("#6cb6dd");
        }
        if(item.department.includes("Medizintechnik")){
            departments.push("#f18800");
        }
        if(item.department.includes("Elektronik")){
            departments.push("#be1522");
        }

        //var segments = 100 / departments.length;

        var styleString = "background: linear-gradient(to right," + departments[0] +" 100%) !important";

        var html =
          '<li>' +
          '<a id="' + item.room.name + 'listItem' + '" class="download cursor" onclick="chooseExhibit(\'' + 
          item.room.name + '\')"' +
          '>' +
          item.name + "</a></li>";
        itemsDiv.append(html);
        if(departments.length == 3){
            $('#' + item.room.name + 'listItem').css('background', 'linear-gradient(to right, '+ departments[0] +', '+ departments[1] +', '+ departments[2]);
            $('#' + item.room.name + 'listItem').css('color', 'white');
        }
        if(departments.length == 2){
            //$('#' + item.room.name + 'listItem').css('background', 'linear-gradient(to right, '+ departments[0] +' 50%, '+ departments[1] +' 50%');
            $('#' + item.room.name + 'listItem').css('background', 'linear-gradient(to right, '+ departments[0] +', '+ departments[1] +'');
            $('#' + item.room.name + 'listItem').css('color', 'white');
        }
        if(departments.length == 1){
            $('#' + item.room.name + 'listItem').css('background', 'linear-gradient(to right, '+ departments[0] +' 100%, #ffffff 0%');
            $('#' + item.room.name + 'listItem').css('color', 'white');
        }
      }
}

function setupSpheres(){
    var exhibitsWithoutRooms = exhibits.filter(e => allRooms.filter(r => r.name == e.room.name) == 0);
    exhibitsWithoutRooms.forEach(e => {
        if(e.y != 0){
            var geometry = new THREE.SphereGeometry(80, 32, 32);
            var material = new THREE.MeshBasicMaterial({ color: 0xCCCCCC });
            //var material = new THREE.MeshBasicMaterial({ color: 0xc7c7c7 });  //invisible
            var exhibit = new THREE.Mesh(geometry, material);
            //exhibit.visible = false;
            exhibit.name = e.room.name;
            exhibit.position.x = e.x;
            exhibit.position.y = e.y;
            exhibit.position.z = e.z;
            exhibit.geometry.attributes = {};
            exhibit.geometry.attributes.position = {};
            exhibit.geometry.attributes.position.array = [exhibit.position.x,exhibit.position.y,exhibit.position.z];
            exhibit.isSphere = true;
            scene.add(exhibit);
            objectArr.push(exhibit);
        }
    });
}

function chooseExhibit(roomName){
    chooseRoom(roomName, false);
}