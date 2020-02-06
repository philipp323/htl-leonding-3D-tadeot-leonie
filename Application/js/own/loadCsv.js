var loadedText;
var DATA = [];
function loadCsv(){
    console.log("===== LOAD CSV =====");
    var client = new XMLHttpRequest();
    client.open('GET', '/data.csv');
    client.onreadystatechange = function() {
      if(client.readyState === 4 && client.status === 200) {
        loadedText = client.responseText;
        parseElementsIntoArray();
      }
    }
    client.send();
}

function parseElementsIntoArray(){
    // console.log(loadedText);
    // console.log(loadedText.split(/\r\n|\n/));
    var lines = loadedText.split(/\r\n|\n/); 
    var arrayLength = lines.length;

    for (var i = 0; i < arrayLength; i++) {
        var elements = lines[i].split(';');
        DATA.push({
            teacher: elements[0],
            room: elements[1]
        });
    }
    console.log(DATA);
    addItemsToHTML();
}

function addItemsToHTML(){
    var itemsDiv = $("#items-wrapper");
    for (var i = 0; i < DATA.length - 1; i++) {
        var item = DATA[i];
        var html =
          '<li>' +
          '<a class="download cursor" onclick="chooseTeacher(\'' + 
          item.room + '\',\'' + item.teacher +
          '\')"' +
          '>' +
          "Lehrer: " + item.teacher + "      " + "Raum: " + item.room +
          "</a></li>";
        itemsDiv.append(html);
      }
}

function chooseTeacher(room, teacher){
    chooseRoom(room, teacher);
}