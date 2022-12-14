const relayIp = "ws://localhost:2223";

//Player data
let playerNames = ["",""];
let playerIDs = [0,0];
let playerScore = [0, 0];
let playerAcc = [0, 0];
let playerCombo = [0, 0];
let playerMisses = [0, 0];
let playerFC = [true,true];

//Current song data
let songData = ["",0];

const ws = new WebSocket(relayIp);
ws.onopen = function () {
	console.log("Msg sent, connected");
};
ws.onmessage = async function (event) {
	jsonObj = JSON.parse(event.data);
	if (jsonObj.Type == 3) // LevelChanged
	{
		if (jsonObj.command == "updateMap") {
			
			//getMap is sent off to mapHandler.js
			getMap(jsonObj.LevelId, jsonObj.Diff, jsonObj.Player);

			//The scoreUpdate it sent off to userScoringHandler.js, to reset the overlay-data for both players.
			scoreUpdate(0, 0, 0, 0, 0, 0, 0, 0, 0, 1);
		}
	}
	if (jsonObj.Type == 4) // Score Update
	{
		//This is sent off to the userScoringHandler.js
		scoreUpdate(jsonObj.message.user_id, jsonObj.message.score, jsonObj.message.combo, jsonObj.message.accuracy * 100, jsonObj.message.totalMisses, jsonObj.message.notesMissed, jsonObj.message.badCuts, jsonObj.message.bombHits, jsonObj.message.wallHits);
	}
	if (jsonObj.Type == 5) { //Match Created
		if (jsonObj.command == "createUsers") {
			playerIDs = [jsonObj.PlayerIds[0], jsonObj.PlayerIds[1]];
			playerNames = [jsonObj.PlayerNames[0], jsonObj.PlayerNames[1]];
			//This it sent off to overlayHandler.js
			setOverlay(playerIDs, playerNames, jsonObj.Round);
		}
		if (jsonObj.command == "updateScore") {
			//Look in ScoreLogic.js for this behemoth... :fearful:
			changeScoreline(jsonObj.PlayerIds, jsonObj.Score);
		}
		if (jsonObj.command == "resetOverlay") {

			document.getElementById("SongBox").style.opacity = "0";
			document.getElementById("PlayerBounds").style.opacity = "0";
			document.getElementById("PlayerContainers").style.opacity = '0';
			document.getElementById("roundTextP").style.opacity = '0';
			document.getElementById("leftPoints").style.opacity = '0';
			document.getElementById("rightPoints").style.opacity = '0';


			setTimeout(function () {
				scoreUpdate(0, 0, 0, 0, 0, 0, 0, 0, 0, 1);
				playerScore = [0, 0];
				songData["",0];

				document.getElementById("Player1Name").innerText = "";
				document.getElementById("Player1Rank").innerText = '#0 Global | #0 NaN';
				document.getElementById("Player2Name").innerText = "";
				document.getElementById("Player2Rank").innerText = '#0 Global | #0 NaN';
				document.getElementById("roundTextP").innerText = 'No round set';
				for (i = 1; i < 8; i++) {
					document.getElementById("l" + i).style.opacity = "0";
					document.getElementById("r" + i).style.opacity = "0";
				}
			}, 1000);
		}
	}
};
