const relayIp = "ws://localhost:2223";

let currentSong = "";
let currentDiff = "";

async function getMap(LevelId, LevelDiff) {
    let songHash = LevelId.replace("custom_level_", "");
    let songDiff = LevelDiff;

    switch (songDiff) {
        case 0:
            var diffText = "Easy";
            var diffColor = "#008055";
            break;
        case 1:
            var diffText = "Normal";
            var diffColor = "#1268A1";
            break;
        case 2:
            var diffText = "Hard";
            var diffColor = "#BD5500";
            break;
        case 3:
            var diffText = "Expert";
            var diffColor = "#B52A1C";
            break;
        case 4:
            var diffText = "Expert+";
            var diffColor = "#900000";
            break;
    }
    if (currentSong != songHash) {
        currentSong = songHash;
        currentDiff = songDiff;
        console.log(currentSong + " " + currentDiff);

        fetch('https://api.beatsaver.com/maps/hash/' + songHash)
            .then(response => response.json())
            .then(data => {
                document.getElementById("SongBox").style.opacity = "0";
                document.getElementById("SongCover").style.opacity = "0";
                setTimeout(function() {
                    document.getElementById("SongCover").style.background = 'url(https://eu.cdn.beatsaver.com/' + songHash.toLowerCase() + '.jpg)';
                    document.getElementById("SongCover").style.backgroundSize = 'cover';
                    document.getElementById("DiffLabel").style.background = diffColor;
                    if (data.metadata.songSubName !== "") {
                        document.getElementById("SongTitle").innerHTML = data.metadata.songName + " - " + data.metadata.songSubName;
                    } else {
                        document.getElementById("SongTitle").innerHTML = data.name;
                    }
                    document.getElementById("SongMapper").innerHTML = "By " + data.metadata.levelAuthorName;
                    document.getElementById("SongArtist").innerHTML = data.metadata.songAuthorName;
                    document.getElementById("MapCode").innerHTML = data.id;
                    document.getElementById("DiffText").innerHTML = diffText;
                    document.getElementById("SongBox").style.opacity = "1";
                    document.getElementById("SongCover").style.opacity = "1";

                }, 1000);
            });
    } else if (currentSong == songHash && currentDiff != songDiff) {
        currentDiff = songDiff;
        document.getElementById("DiffText").style.opacity = "0";
        setTimeout(function() {

            document.getElementById("DiffText").innerHTML = diffText;
            document.getElementById("DiffText").style.opacity = "1";

        }, 1000);
        document.getElementById("DiffLabel").style.background = diffColor;
    }
}

const ws = new WebSocket(relayIp);
ws.onopen = function() {
    console.log("Connected to Relay-server: " + relayIp);
};
ws.onmessage = async function(event) {
    jsonObj = JSON.parse(event.data);

    if (jsonObj.Type == 1) { //Match Created
        
        if (jsonObj.overlay == "BattleRoyale") {
        let userCount = jsonObj.userid.length;
        document.getElementById("PlayersRemCountText").style.opacity = "0";
        setTimeout(function() {
            document.getElementById("PlayersRemCountText").innerHTML = userCount;
            document.getElementById("PlayersRemCountText").style.opacity = "1";
        }, 500);
        }
    }
    if (jsonObj.Type == 2) // Match Deleted
    {
        document.getElementById("SongBox").style.opacity = "0";
        document.getElementById("SongCover").style.opacity = "0";
        if (document.getElementById("PlayersRemCountText").innerHTML != "0") {
            document.getElementById("PlayersRemCountText").style.opacity = "0";
            setTimeout(function() {
                document.getElementById("PlayersRemCountText").innerHTML = "0";
                document.getElementById("PlayersRemCountText").style.opacity = "1";
            }, 500);
        }
        currentSong = "";
        currentDiff = "";
    }
    if (jsonObj.Type == 3) // LevelChanged
    {
        let LevelId = jsonObj.LevelId;
        let Diff = jsonObj.Diff;
        getMap(LevelId, Diff);
    }
    if (jsonObj.Type == 6) {
        if (jsonObj.command == "updateSpectator") {
            document.getElementById("CurrentPlayer").style.opacity = "0";
            setTimeout(function() {
                document.getElementById("CurrentPlayer").innerHTML = jsonObj.Player;
                document.getElementById("CurrentPlayer").style.opacity = "1";
            }, 1000);
        } else if (jsonObj.command == "resetSpectator") {
            document.getElementById("CurrentPlayer").style.opacity = "0";
            setTimeout(function() {
                document.getElementById("CurrentPlayer").innerHTML = "None";
            }, 1000);
        }
    }
};