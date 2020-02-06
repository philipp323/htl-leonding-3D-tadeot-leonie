function pathToRoom(roomName) {

    var path = "";
    var roomNumber = roomName[1];
    roomNumber += roomName[2];

    if (roomName == "vor Bibliothek") {
        path += "Gehen Sie ein Stockwerk hinunter.\n Gehen Sie nach links und anschließend den rechten Gang entlang."
    }

    else if (roomName == "vor E26") {
        path += "Gehen Sie ein Stockwerk hinunter.\n Gehen Sie nach rechts und anschließend den linken Gang entlang."
    }

    else if (roomName[0] == "K") {
        path += "Gehen Sie ein Stockwerk hinunter.\n Gehen Sie nach rechts und anschließend bis zum Ende des linken Ganges.\n Gehen Sie die Treppe hinunter.\n Die Klasse befindet sich links."
        return path;
    }

    else if (roomName[0] == "U") {
        path += "Gehen Sie zwei Stockwerke runter. \n";

        if (roomNumber >= 39 && roomNumber <= 92) {
            path += "Gehen Sie anschließend nach links.";
        }
        else {
            path += "Gehen Sie anschließend nach rechts.";
        }
    }

    else if (roomName[0] == "E") {
        path += "Gehen Sie ein Stockwerk hinunter.\n"

        if (roomNumber == 02) {
            path += "Gehen Sie anschließend nach links.";
            return path;
        }

        if (roomNumber >= 05 && roomNumber <= 26 || (roomNumber >= 71 && roomNumber <= 74)) {
            path += "Gehen Sie nach rechts. \n"
            if (roomNumber >= 05 && roomNumber <= 18) {
                path += "Gehen Sie anschließend nach links.";
            }
            else {
                path += "Gehen Sie anschließend nach rechts.";
            }
        }
        else {
            path += "Gehen Sie nach links durch die Glastüre hindurch."
        }
    }

    else if (roomName[0] == 1) {
        // path += "Gehen Sie ein Stockwerk nach oben. \n";

        if (roomName.startsWith("101")) {
            path += "Das Austellungsstück befindet sich in der Aula."
            return path;
        }

        else if (roomNumber >= 31 && roomNumber <= 48) {
            path += "Gehen Sie nach links. \n";

            if (roomNumber >= 31 && roomNumber <= 38) {
                path += "Gehen Sie anschließend nach rechts.";
            }
            else {
                path += "Gehen Sie anschließend nach links.";
            }

        }

        else {
            path += "Gehen Sie nach rechts. \n";
            if (roomNumber >= 03 && roomNumber <= 15) {
                path += "Gehen Sie anschließend nach rechts.";
            }
            else {
                path += "Gehen Sie anschließend nach links.";
            }
        }
    }

    else if (roomName[0] == 2) {
        path += "Gehen Sie ein Stockwerk nach oben.\n";
        if (roomNumber >= 26 && roomNumber <= 41) {
            path += "Gehen Sie nach links. \n";
            if (roomNumber >= 26 && roomNumber <= 36) {
                path += "Gehen Sie anschließend nach rechts."
            }
            else {
                path += "Gehen Sie anschließend nach links."
            }
        }
        else {
            path += "Gehen Sie nach rechts. \n";
            if (roomNumber >= 03 && roomNumber <= 08) {
                path += "Gehen Sie anschließend nach rechts."
            }
            else {
                path += "Gehen Sie anschließend nach links."
            }
        }
    }
    return path;
}