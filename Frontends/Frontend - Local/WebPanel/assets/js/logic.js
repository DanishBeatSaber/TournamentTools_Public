const debug = false;

const relayIp = "ws://localhost:2223";

let usernames;
let P1;
let P2;
let P1Name;
let P2Name;
let userids;
let twitchnames;
let inMatch = false;
let tmconfig = 3;
let round;
let PlayerInfo = [];
let local;
let poolId = [];
let songOptions = [];
let poolData = [];
let ws = new WebSocket(relayIp);

ws.onopen = function () {
    checkForFiles();
    configPop();
    if (debug) {
        console.log("Connected to Relay-server: " + relayIp);
    }
}
ws.onerror = function (event) {
    //Close all swal popups
    swal.close();
    Swal.fire({
        title: 'WebSocket <b>timed out</b>!',
        html: 'Contact Hawk on Discord.'
    })
    setTimeout(function () {
        ws = new WebSocket(relayIp);
    }, 5000);
}

function PB(hashdiff) {
    let hash = hashdiff.split("_")[0];
    let diff = hashdiff.split("_")[1];

    //Get title from img with data-hash attribute equal to hash
    let title = document.querySelector(`img[data-hash="${hash}"]`).getAttribute("title");

    Swal.fire({
        title: 'Who\'s picking?',
        showDenyButton: true,
        showDenyButton: true,
        confirmButtonText: P1Name,
        denyButtonText: P2Name,
        cancelButtonText: `Tiebreaker`,
        confirmButtonColor: '#ff5252',
        denyButtonColor: '#a768eb',
        cancelButtonColor: '#464646',
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            let data = [hash, P1];
            Swal.fire({
                title: 'Pick or Ban?',
                showDenyButton: true,
                showDenyButton: true,
                confirmButtonText: `Pick`,
                denyButtonText: `Ban`,
                cancelButtonText: `Back`,
                confirmButtonColor: '#439555',
                denyButtonColor: '#eb6868',
                cancelButtonColor: '#464646',
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    console.log("Added " + title + " to the current map list." + " | " + diff + " | " + P1Name);
                    ws.send(JSON.stringify({ "Type": "5", "command": "PicksAndBans", "Action": "Pick", "map": hash, "PlayerId": P1 }));
                    //Send ws message
                    appendSongs(hash, diff, title, P1Name);

                } else if (result.isDenied) {
                    if (debug) {
                        console.log(P1Name + "(" + P1 + ") banned " + hash);
                    }
                    ws.send(JSON.stringify({ "Type": "5", "command": "PicksAndBans", "Action": "Ban", "map": hash, "PlayerId": P1 }));
                } else if (result.isDismissed) {
                    //Go back to the previous menu
                    PB(hashdiff);
                }
            });
        } else if (result.isDenied) {
            let data = [hash, P2];
            Swal.fire({
                title: 'Pick or Ban?',
                showDenyButton: true,
                showDenyButton: true,
                confirmButtonText: `Pick`,
                denyButtonText: `Ban`,
                cancelButtonText: `Back`,
                confirmButtonColor: '#439555',
                denyButtonColor: '#eb6868',
                cancelButtonColor: '#464646',
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    console.log("Added " + title + " to the current map list." + " | " + diff + " | " + P2Name);
                    ws.send(JSON.stringify({ "Type": "5", "command": "PicksAndBans", "Action": "Pick", "map": hash, "PlayerId": P2 }));
                    appendSongs(hash, diff, title, P2Name);
                } else if (result.isDenied) {
                    if (debug) {
                        console.log(P2Name + "(" + P2 + ") banned " + hash);
                    }
                    ws.send(JSON.stringify({ "Type": "5", "command": "PicksAndBans", "Action": "Ban", "map": hash, "PlayerId": P2 }));
                    //Remove hash from currentMap selection
                } else if (result.isDismissed) {
                    //Go back to the previous menu
                    PB(hashdiff);
                }
            });
        } else if (result.isDismissed) {
            let data = [hash, "Tiebreaker"];
            ws.send(JSON.stringify({ "Type": "5", "command": "PicksAndBans", "Action": "Tiebreaker", "map": hash, "PlayerId": "0" }));
            appendSongs(hash, diff, title, "Tiebreaker");
        }
    });
}

function appendSongs(hash, diff, name, player) {
    var songs = document.getElementById("currentMap");
    var el = document.createElement("option");
    el.textContent = name + " | " + diff;
    el.value = hash;
    el.setAttribute("data-songName", name);
    el.setAttribute("data-hash", diff);
    el.setAttribute("data-player", player);
    songs.appendChild(el);
}

function setPool(hash, diff, songName) {

    if (debug) {
        console.log("SetPool reached");
        console.log(hash);
        console.log(diff);
        console.log(songName);
    }

    for (var i = 0; i < hash.length; i++) {
        var clone = document.getElementById("SongCircle").cloneNode(true);

        clone.classList.add("SongCircle" + hash[i]);
        clone.setAttribute("onclick", "PB('" + hash[i] + "_" + diff[i] + "')");
        clone.setAttribute("data-hash", hash[i]);
        clone.setAttribute("src", "https://eu.cdn.beatsaver.com/" + hash[i].toLowerCase() + ".jpg");

        switch (diff[i].toLowerCase()) {
            case "easy":
                var diffColor = "#008055";
                var diffLabel = "Easy";
                break;
            case "normal":
                var diffColor = "#1268A1";
                var diffLabel = "Normal";
                break;
            case "hard":
                var diffColor = "#BD5500";
                var diffLabel = "Hard";
                break;
            case "expert":
                var diffColor = "#B52A1C";
                var diffLabel = "Expert";
                break;
            case "expertplus":
                var diffColor = "#454588";
                var diffLabel = "Expert+";
                break;
            case "expert+":
                //Really would wish that BeatKhana API used the same naming convention as BeatSaver........
                var diffColor = "#454588";
                var diffLabel = "Expert+";
                break;
            default:
                var diffColor = "#000000";
                break;
        }

        clone.setAttribute("title", songName[i]);
        clone.style.boxShadow = "0px 0px 10px 0px " + diffColor;
        clone.style.background = diffColor;

        clone.style.display = "block";

        document.getElementById("SongDivs").appendChild(clone);
    }
};

function localPools() {
    Swal.fire({
        title: 'Upload your local pools',
        html: 'Please click on "Upload", upload your pools, and then confirm.',
        heightAuto: true,
        confirmButtonText: 'Confirm',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        footer: '<a href="./upload.php" target="blank"_>Upload.</a>'
    }).then(function (result) {
        if (result.value) {
            console.log("Checking for files pool-files.");
            $.ajax({
                url: "./pools/",
                success: function (data) {
                    $(data).find("a").attr("href", function (i, val) {
                        if (val.match(/\.bplist$/) || val.match(/\.json$/)) {
                            songOptions[val] = decodeURI(val).replace(/\.[^/.]+$/, "");
                            selectLocalMapPool();
                        }
                    });
                }
            });
        }
    });
};

function selectLocalMapPool() {
    Swal.fire({
        title: 'Select a map pool',
        input: 'select',
        inputOptions: songOptions,
        inputPlaceholder: 'Select a map pool',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value) {
                    resolve()
                } else {
                    resolve('You need to select something!');
                }
            })
        }
    }).then((result) => {
        if (result.value) {
            Swal.fire({
                title: 'Map pool selected!',
                html: 'You selected map pool<b>: ' + decodeURI(result.value).replace(/\.[^/.]+$/, "</b>"),
            });
            setSongJSON(result.value);
            document.getElementById("MATCHDIV").style.opacity = "0";
            setTimeout(function () {
                document.getElementById("VERSUSDIV").style.display = "inline-block";
                document.getElementById("MATCHDIV").style.display = "none";
                setTimeout(function () {
                    document.getElementById("VERSUSDIV").style.opacity = "1";
                }, 1);
            }, 1);
        }
    })
};

function setSongJSON(playlist) {
    $.getJSON("./pools/" + playlist, function (data) {
        var songList = data.songs;
        var songHashes = [];
        for (var i = 0; i < songList.length; i++) {
            songHashes.push(songList[i].hash);
        }
        var diffNames = [];
        for (var i = 0; i < songList.length; i++) {
            diffNames.push(songList[i].difficulties[0].name);
        }
        var songNames = [];
        for (var i = 0; i < songList.length; i++) {
            songNames.push(songList[i].songName);
        }
        if (debug) {
            console.log(songHashes + " | " + diffNames);
        }
        ws.send(JSON.stringify({
            'Type': '5',
            'command': 'setPool',
            'songHash': songHashes,
            'songDiff': diffNames
        }));
        setPool(songHashes, diffNames, songNames);
    });
};

const inputOptions = new Promise((resolve) => {
    resolve({
        '1': '1V1',
        '2': 'Battle Royale'
    })
});

function configPop() {
    const {
        value: tmstyle
    } = Swal.fire({
        title: 'Select tournament style.',
        input: 'radio',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputOptions: inputOptions,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to choose something!'
            } else {
                tmconfig = value;
                switch (value) {
                    case "1":
                        tmconfig = 1;
                        title = "1V1";
                        break;
                    case "2":
                        tmconfig = 2;
                        title = "Battle Royale";
                        break;
                }
                if (debug) {
                    console.log(value);
                }
                if (value) {
                    return new Promise((resolve) => {
						if (tmconfig == 1) {
                        Swal.fire({
                            title: 'Do you use BeatKhana?',
                            html: 'If you do, make sure your tournament is public, and map-pools can be seen.',
                            showDenyButton: true,
                            showCancelButton: false,
                            confirmButtonText: 'Yes',
                            denyButtonText: 'No',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                local = false;
                                let timerInterval
                                Swal.fire({
                                    title: 'You\'re connected!',
                                    html: 'Tournament style: <b>' + title + '</b>.<br/>BeatKhana: <b>Yes</b>.<br/>Press the "<b>Configure</b>"-button to setup the overlay.',
                                    timer: 5000,
                                    timerProgressBar: true,
                                    willClose: () => {
                                        clearInterval(timerInterval)
                                    }
                                });
                                document.getElementById("MATCHDIV").style.display = "inline-block";
                                //Delay for 1 second
                                setTimeout(function () {
                                    document.getElementById("MATCHDIV").style.opacity = "1";
                                }, 1);
                            } else if (result.isDenied) {
                                local = true;
                                let timerInterval
                                Swal.fire({
                                    title: 'You\'re connected!',
                                    html: 'Tournament style: <b>' + title + '</b>.<br/>BeatKhana: <b>no</b>.<br/>Press the "<b>Configure</b>"-button to setup the overlay.',
                                    timer: 5000,
                                    timerProgressBar: true,
                                    willClose: () => {
                                        clearInterval(timerInterval)
                                    }
                                });
                                document.getElementById("MATCHDIV").style.display = "inline-block";
                                //Delay for 1 second
                                setTimeout(function () {
                                    document.getElementById("MATCHDIV").style.opacity = "1";
                                }, 1);
                            }
                        });
						}
						if (tmconfig == 2) {
                            let timerInterval
                            Swal.fire({
                                title: 'You\'re connected!',
                                html: 'Tournament style: ' + title + '.<br/>',
                                timer: 5000,
                                timerProgressBar: true,
                                willClose: () => {
                                    clearInterval(timerInterval)
                                    configure();
                                }
                            });
						}
                    });
                }
            }
        }
    });
};

function BeatKhana() {
    Swal.fire({
        title: 'BeatKhana ID',
        input: 'number',
        inputPlaceholder: '2147484260',
        heightAuto: true,
        confirmButtonText: 'Confirm',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        footer: '<a  href="https://i.imgur.com/jDPd8WN.png" target="blank"_>How to find id?</a>',
		inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!'); } }) }
    }).then(function (result) {
        if (result.value) {
            checkForFiles(result.value);
        }
    });
}
function checkForFiles(id) {
    if (debug) {
        console.log("Checking for files pool-files.");
    }
    //Try to get pool-files.json else show error
    $.ajax({
        url: "https://beatkhana.com/api/tournament/" + id + "/map-pools",
        type: "GET",
        success: function (data) {
            var key = Object.keys(data);
            for (var i = 0; i < key.length; i++) {
                songOptions[data[key[i]].id] = data[key[i]].poolName;
                poolData.push(data[key[i]]);
                selectMapPool();
            }
        },
    });
}
function selectMapPool() {
    Swal.fire({
        title: 'Select a map pool',
        input: 'select',
        inputOptions: songOptions,
        inputPlaceholder: 'Select a map pool',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value) {
                    resolve();
                } else {
                    resolve('You need to select something!');
                }
            })
        }
    }).then((result) => {
        if (result.value) {
            //Select the array where id = result.value
            var pool = poolData.find(x => x.id == result.value);

            if (debug) {
                console.log(pool);
            }

            //Insert the hashes and diff from that array into the songHashes and diffNames array
            var songHashes = [];
            for (var i = 0; i < pool.songs.length; i++) {
                songHashes.push(pool.songs[i].hash);
            }
            var diffNames = [];
            for (var i = 0; i < pool.songs.length; i++) {
                diffNames.push(pool.songs[i].diff);
            }
            var songNames = [];
            for (var i = 0; i < pool.songs.length; i++) {
                songNames.push(pool.songs[i].name);
            }
            if (debug) {
                console.log(songHashes + " | " + diffNames);
            }

            ws.send(JSON.stringify({
                'Type': '5',
                'command': 'setPool',
                'songHash': songHashes,
                'songDiff': diffNames
            }));
            setPool(songHashes, diffNames, songNames);
        }
        Swal.fire({
            title: 'Map pool selected!',
            html: 'You selected map pool<b>: ' + pool.poolName + '<br/>',
        });
        setSongJSON(result.value);
        document.getElementById("MATCHDIV").style.opacity = "0";
        setTimeout(function () {
            document.getElementById("VERSUSDIV").style.display = "inline-block";
            document.getElementById("MATCHDIV").style.display = "none";
            setTimeout(function () {
                document.getElementById("VERSUSDIV").style.opacity = "1";
            }, 1);
        }, 1);
    });
};

function addUsernames(usernames, userids, twitchnames) {
    var select1 = document.getElementById("playerScreenNames");
    var select2 = document.getElementById("playerSpectatingNames");
    for (var i = 0; i < usernames.length; i++) {
        var opt = usernames[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = userids[i];
        select1.appendChild(el);
        var ell = document.createElement("option");
        ell.textContent = opt;
        ell.value = twitchnames[i];
        select2.appendChild(ell);
    }
}

function reset() {
    if (inMatch) {
        if (tmconfig == 1) {
            ws.send(JSON.stringify({
                'Type': '5',
                'command': 'resetOverlay'
            }));
            inMatch = false;
            location.reload();
        } else if (tmconfig == 2) {
            ws.send(JSON.stringify({
                'Type': '6',
                'command': 'resetUsers'
            }));
            ws.send(JSON.stringify({
                'Type': '6',
                'command': 'resetSpectator'
            }));
            inMatch = false;
            location.reload();
        }
    }
}

function reload() {
    if (inMatch) {
        ws.send(JSON.stringify({ 'Type': '5', 'command': 'createUsers', 'PlayerNames': [PlayerInfo[0][0], PlayerInfo[1][0]], 'PlayerIds': [P1, P2], 'TwitchIds': [PlayerInfo[0][1], PlayerInfo[1][1]], 'Round': round }));
    }
}

function sendToOverlay(type) {
	if (type == "requestMatches") {
		ws.send(JSON.stringify({ 'Type': '5', 'command': 'requestMatches' }));
	} else if (type == "selectMatch") {
		//Get the selected match
		let selectedMatch = $('#currentMatch').find(':selected');
		//Get the match data
		//If the index is 0, then the match is not selected
		if (selectedMatch.index() == 0) {
			alert("Please select a match");
			return;
		} else {
			//Get the data-player1-name, data-player2-name, data-player1-id, data-player2-id
			P1 = selectedMatch.data("player1-id");
			P2 = selectedMatch.data("player2-id");
			matchId = selectedMatch.data("match-id");
			configure();
		}
	} else if (type == "playerScreen") {
		//check if alive is not null
		if (document.getElementById("playerScreenNames").value != "") {
			if (document.getElementById("alive").value != "") {
				var username = document.getElementById("playerScreenNames").options[document.getElementById("playerScreenNames").selectedIndex].text;
				var userid = document.getElementById("playerScreenNames").value;
				var score = document.getElementById("score").value;
				var alive = document.getElementById("alive").value;
				ws.send(JSON.stringify({ 'Type': '6', 'command': 'updateScore', 'PlayerId': userid, 'score': score, 'alive': alive }));
				if (alive == "false") {
					var select = document.getElementById("playerSpectatingNames");
					for (var i = 0; i < select.options.length; i++) {
						if (select.options[i].text == username) {
							select.remove(i);
						}
					}
					document.getElementById("score").value = "";
					document.getElementById("playerScreenNames").selectedIndex = 0;
					document.getElementById("alive").selectedIndex = 0;
					$("#playerScreenNames option[value='" + userid + "']").remove();
					$("#playerSpectatingNames option[value='" + username + "']").remove();
				}
			}
		}
		if (debug) {
			console.log(JSON.stringify({ 'Type': '6', 'command': 'updateScore', 'PlayerId': userid, 'score': score, 'alive': alive }));
		}
	} else if (type == "playerSpec") {
		var username = document.getElementById("playerSpectatingNames").options[document.getElementById("playerSpectatingNames").selectedIndex].text;
		var twitchname = document.getElementById("playerSpectatingNames").value;
		ws.send(JSON.stringify({ 'Type': '6', 'command': 'updateSpectator', 'Player': username, 'Twitch': twitchname }));
	} else if (type == "resetSpec") {
		ws.send(JSON.stringify({ 'Type': '6', 'command': 'resetSpectator' }));
	} else if (type == "currentMap") {
		//Get data-hash from currentMap
		var hash = document.getElementById("currentMap").value;
		var diff = document.getElementById("currentMap").options[document.getElementById("currentMap").selectedIndex].getAttribute("data-hash");
		var player = document.getElementById("currentMap").options[document.getElementById("currentMap").selectedIndex].getAttribute("data-player");
		switch (diff.toLowerCase()) {
			case "easy":
				diff = 0;
				break;
			case "normal":
				diff = 1;
				break;
			case "hard":
				diff = 2;
				break;
			case "expert":
				diff = 3;
				break;
			case "expertplus":
				diff = 4;
				break;
			default:
				diff = 0;
				break;
		}
		ws.send(JSON.stringify({ 'Type': '3', 'command': 'updateMap', 'LevelId': hash, 'Diff': diff, 'MatchId': matchId, 'Player': player }));
	} else if (type == "sendScore") {
		var p1Score = document.getElementById("P1ScoreSlider").value;
		var p2Score = document.getElementById("P2ScoreSlider").value;
		if (debug) {
			console.log(PlayerInfo[0][0] + " | Score: " + p1Score + " - " + PlayerInfo[1][0] + " | Score: " + p2Score);
		}
		ws.send(JSON.stringify({ 'Type': '5', 'command': 'updateScore', 'PlayerIds': [P1, P2], 'Score': [p1Score, p2Score] }));
	}
}

function configure() {
    if (!inMatch) {
        if (tmconfig == 3) {
            Swal.fire({
                title: 'No tournament style selected!',
                html: 'Please select a tournament style, before configuring the overlay.',
                confirmButtonText: 'Setup'
            }).then(function (result) {
                if (result.isConfirmed) {
                    configPop();
                }
            })
        } else if (tmconfig == 1) {
            Swal.fire({
                title: 'Player 1 Info',
                input: 'textarea',
                inputPlaceholder: 'Username\nTwitch Name',
                heightAuto: true,
                showCancelButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'Confirm',
                footer: '<a href="https://www.youtube.com/watch?v=_UYZaVLu1h0" target="blank"_>How to do this.</a>',
				inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!');}})}
            }).then(function (result) {
                if (result.value) {
                    PlayerInfo.push(result.value.split("\n"));
                    Swal.fire({
                        title: 'Player 2 Info',
                        input: 'textarea',
                        inputPlaceholder: 'Username\nTwitch Name',
                        heightAuto: true,
                        showCancelButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonText: 'Confirm',
                        footer: '<a  href="https://www.youtube.com/watch?v=_UYZaVLu1h0" target="blank"_>How to do this.</a>',
						inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!');}})}
                    }).then(function (result) {
                        if (result.value) {
                            PlayerInfo.push(result.value.split("\n"));
                            Swal.fire({
                                title: 'Round',
                                input: 'text',
                                inputPlaceholder: 'Round 1',
                                heightAuto: true,
                                showCancelButton: false,
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                confirmButtonText: 'Confirm',
                                footer: '<a  href="https://www.youtube.com/watch?v=_UYZaVLu1h0" target="blank"_>How to do this.</a>',
								inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!');}})}
                            }).then(function (result) {
                                if (result.value) {
                                    PlayerInfo.push(result.value.split("\n"));
                                    round = result.value;
                                    if (debug) {
                                        console.log("Player 1 | Name: " + PlayerInfo[0][0] + " | Twitch ID: " + PlayerInfo[0][1]);
                                        console.log("Player 2 | Name: " + PlayerInfo[1][0] + " | Twitch ID: " + PlayerInfo[1][1]);
                                    }

                                    P1Name = PlayerInfo[0][0];
                                    P2Name = PlayerInfo[1][0];

                                    document.getElementById("playerScore").removeAttribute("disabled");
                                    document.getElementById("P1ScoreSlider").removeAttribute("disabled");
                                    document.getElementById("P2ScoreSlider").removeAttribute("disabled");
                                    document.getElementById("currentMap").removeAttribute("disabled");
                                    document.getElementById("mapPlaying").removeAttribute("disabled");
                                    document.getElementById("P1Name").innerHTML = PlayerInfo[0][0] + "'s score";
                                    document.getElementById("P2Name").innerHTML = PlayerInfo[1][0] + "'s score";
                                    inMatch = true;
                                    ws.send(JSON.stringify({ 'Type': '5', 'command': 'createUsers', 'PlayerNames': [PlayerInfo[0][0], PlayerInfo[1][0]], 'PlayerIds': [P1, P2], 'TwitchIds': [PlayerInfo[0][1], PlayerInfo[1][1]], 'Round': round }));
                                    if (!local) {
                                        BeatKhana();
                                    } if (local) {
                                        localPools();
                                    }
                                }
                            })
                        }
                    })
                }
            })
        } else if (tmconfig == 2) {
            Swal.fire({
                title: 'Complete list of usernames',
                input: 'textarea',
                heightAuto: true,
                confirmButtonText: 'Confirm',
                allowOutsideClick: false,
                allowEscapeKey: false,
                footer: '<a  href="https://www.youtube.com/watch?v=FxN-R_RkI7s" target="blank"_>How to do this.</a>',
				inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!');}})}
            }).then(function (result) {
                if (result.value) {
                    usernames = result.value.split("\n");

                    Swal.fire({
                        title: 'Complete list of userids',
                        input: 'textarea',
                        heightAuto: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonText: 'Confirm',
                        footer: '<a  href="https://www.youtube.com/watch?v=FxN-R_RkI7s" target="blank"_>How to do this.</a>',
						inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!');}})}
                    }).then(function (result) {
                        if (result.value) {
                            userids = result.value.split("\n");

                            Swal.fire({
                                title: 'Complete list of Twitchnames',
                                input: 'textarea',
                                heightAuto: true,
                                confirmButtonText: 'Confirm',
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                footer: '<a  href="https://www.youtube.com/watch?v=FxN-R_RkI7s" target="blank"_>How to do this.</a>',
								inputValidator: (value) => { return new Promise((resolve) => { if (value) { resolve() } else { resolve('You need to input something!');}})}
                            }).then(function (result) {
                                if (result.value) {
                                    twitchnames = result.value.split("\n");

                                    addUsernames(usernames, userids, twitchnames);

                                    document.getElementById("playerScreenNames").removeAttribute("disabled");
                                    document.getElementById("playerSpectatingNames").removeAttribute("disabled");
                                    document.getElementById("score").removeAttribute("disabled");
                                    document.getElementById("alive").removeAttribute("disabled");
                                    document.getElementById("playerScreen").removeAttribute("disabled");
                                    document.getElementById("playerSpec").removeAttribute("disabled");
                                    document.getElementById("playerResetSpec").removeAttribute("disabled");
                                    document.getElementById("BRDIV").style.display = "inline-block";

                                    setTimeout(function () {
                                        document.getElementById("BRDIV").style.opacity = "1";
                                    }, 1000);
                                    inMatch = true;
                                    ws.send(JSON.stringify({
                                        'Type': '6',
                                        'command': 'createUsers',
                                        'PlayerNames': usernames,
                                        'PlayerIds': userids,
                                        'order': usernames.length
                                    }));
                                }
                            });
                        }
                    });
                }
            })
        }
    }
}

ws.onmessage = async function (event) {
    parsedData = JSON.parse(event.data);
    // console.log(parsedData);
    if (parsedData.Type == 1) {
        // Append the match toe CurrentMatch with the
        //If player 2 is null, then it is a single player match
        if (parsedData.message.matchData.players.length == 1) {
            $('#currentMatch').append(`
            <option 
            data-match-id="${parsedData.message.matchData.matchId}"
            data-coordinator-name="${parsedData.message.matchData.coordinator.name}"
            data-coordinator-id="${parsedData.message.matchData.coordinator.id}"
            data-player1-name="${parsedData.message.matchData.players[0].name}"
            data-player1-id="${parsedData.message.matchData.players[0].user_id}"
            data-player1-guid="${parsedData.message.matchData.players[0].guid}"
            data-player2-name="Player 2"}"
            data-player2-id="76561198086326146"}"
            data-player2-guid="0"}"
            >${parsedData.message.matchData.players[0].name} vs Player 2 Placeholder</option>
            `);
        } else if (parsedData.message.matchData.players.length == 2) {
            $('#currentMatch').append(`
            <option 
            data-match-id="${parsedData.message.matchData.matchId}"
            data-coordinator-name="${parsedData.message.matchData.coordinator.name}"
            data-coordinator-id="${parsedData.message.matchData.coordinator.id}"
            data-player1-name="${parsedData.message.matchData.players[0].name}"
            data-player1-id="${parsedData.message.matchData.players[0].user_id}"
            data-player1-guid="${parsedData.message.matchData.players[0].guid}"
            data-player2-name="${parsedData.message.matchData.players[1].name}"
            data-player2-id="${parsedData.message.matchData.players[1].user_id}"
            data-player2-guid="${parsedData.message.matchData.players[1].guid}"
            >${parsedData.message.matchData.players[0].name} vs ${parsedData.message.matchData.players[1].name}</option>
            `);
        }
    }
    if (parsedData.Type == 2) {
        console.log("Match Deleted");
        //Remove the option with data-match-id matching the deleted match
        $('#currentMatch option[data-match-id="' + parsedData.message.matchData.matchId + '"]').remove();
        //Set the current match to Select map
        document.getElementById("currentMatch").selectedIndex = 0;
    }
    if (parsedData.Type == 5) {
        if (parsedData.command == "returnMatches") {
            //Check parsedData.message for matches
            if (parsedData.message == "No matches found") {
                console.log("No matches found");
                Notiflix.Notify.failure("No matches was found", { plainText: false, clickToClose: true, timeout: 5000, position: 'right-bottom' });
            } else if (parsedData.message !== "No matches found") {
                Notiflix.Notify.success("Updated matchlist", { plainText: false, clickToClose: true, timeout: 5000, position: 'right-bottom' });
                //If parsedData.message.matches[i].matchData.matchId is not in the currentMatch dropdown, then add it
                for (var i = 0; i < parsedData.message.matches.length; i++) {
                    if ($('#currentMatch option[data-match-id="' + parsedData.message.matches[i].matchData.matchId + '"]').length) {
                    } else {
                        console.log(parsedData.message.matches[i].matchData);
                        //Append the match to CurrentMatch options
                        //If player 2 is null, then it is a single player match
                        if (parsedData.message.matches[i].matchData.players.length == 1) {
                            $('#currentMatch').append(`
                        <option 
                        data-match-id="${parsedData.message.matches[i].matchData.matchId}"
                        data-coordinator-name="${parsedData.message.matches[i].matchData.coordinator.name}"
                        data-coordinator-id="${parsedData.message.matches[i].matchData.coordinator.id}"
                        data-player1-name="${parsedData.message.matches[i].matchData.players[0].name}"
                        data-player1-id="${parsedData.message.matches[i].matchData.players[0].user_id}"
                        data-player1-guid="${parsedData.message.matches[i].matchData.players[0].guid}"
                        data-player2-name="Player 2"}"
                        data-player2-id="76561198086326146"}"
                        data-player2-guid="0"}"
                        >${parsedData.message.matches[i].matchData.players[0].name} vs Player 2 Placeholder</option>
                        `);
                        } else if (parsedData.message.matches[i].matchData.players.length == 2) {
                            $('#currentMatch').append(`
                        <option 
                        data-match-id="${parsedData.message.matches[i].matchData.matchId}"
                        data-coordinator-name="${parsedData.message.matches[i].matchData.coordinator.name}"
                        data-coordinator-id="${parsedData.message.matches[i].matchData.coordinator.id}"
                        data-player1-name="${parsedData.message.matches[i].matchData.players[0].name}"
                        data-player1-id="${parsedData.message.matches[i].matchData.players[0].user_id}"
                        data-player1-guid="${parsedData.message.matches[i].matchData.players[0].guid}"
                        data-player2-name="${parsedData.message.matches[i].matchData.players[1].name}"
                        data-player2-id="${parsedData.message.matches[i].matchData.players[1].user_id}"
                        data-player2-guid="${parsedData.message.matches[i].matchData.players[1].guid}"
                        >${parsedData.message.matches[i].matchData.players[0].name} vs ${parsedData.message.matches[i].matchData.players[1].name}</option>
                        `);
                        }
                    }
                }
            }
        }
    }
};