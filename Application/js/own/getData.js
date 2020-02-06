function loadMqtt() {
  console.log("MQTT: Attempting to connect...");
  client = mqtt.connect("wss://leonie.htl-leonding.ac.at/mqtt-ws", {
    clientId: generateUUID()
  });

  client.on('connect', function () {
    console.log("MQTT: Connected!");
    client.subscribe('debug-token/action/show/school/room', function (err) {
      if (!err) {
        client.publish(JSON.stringify({room: "101_1"}));
      }
    });
    client.subscribe('path/result/leonie', function (err) {
    });
  });

  client.on('message', function (topic, message) {
    messageObject = JSON.parse(message.toString());
    console.log(topic);
    if(topic == "debug-token/action/show/school/room"){
      console.log(message.toString());
      chooseRoomMQTT(messageObject.room, false);    
    }
    if(topic == "path/result/leonie"){
      drawPathMQTT(messageObject);
    }
  });
}

function chooseRoomMQTT(roomNumber){
  var exhibit = exhibits.find(e => e.room.name == roomNumber);
  if(roomNumber == 'Architektur'){
    $('#architectureModal').modal('show');
  }
  if(exhibit != undefined){
    chooseRoom(exhibit.room.name);
    //TOOLTIP_VISIBLE = true;
  }else{
    console.log("MQTT: Exhibit \'" + roomNumber + "\' not found!");
  }
}

function drawPathMQTT(nodeArray){
  drawPath(nodeArray);
}

function mqttPublish(from, to){
  client.publish("path", JSON.stringify({system: 'leonie',from: encodeURI(from), to: encodeURI(to)}));
  console.log("Published: " + JSON.stringify({system: 'leonie',from: encodeURI(from), to: encodeURI(to)}));
}


function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 = (performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}