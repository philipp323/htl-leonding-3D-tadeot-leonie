function drawPath(nodeArray){
    if(line != undefined){
        line.visible = false;
    }
    console.log("Draw path triggered");

    var material = new THREE.LineBasicMaterial( { color: 0xf00000 } );
    var geometry = new THREE.Geometry();

    nodeArray.forEach(o => {
        geometry.vertices.push(new THREE.Vector3( o.node.x, o.node.y + 20, o.node.z * -1) );
    });

    line = new THREE.Line( geometry, material );
    //console.log(line);
    scene.add( line );
}

function drawSpheres(nodeArray){
    console.log("DRAW SPHERE CALLED");
    var material = new THREE.LineBasicMaterial( { color: 0xf00000 } );
    nodeArray.forEach(o => {
        var geometry = new THREE.SphereGeometry(50, 32, 32);
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = o.x;
        sphere.position.y = o.y;
        sphere.position.z = o.z * -1;
        console.log(sphere);
        scene.add( sphere );
    });
}