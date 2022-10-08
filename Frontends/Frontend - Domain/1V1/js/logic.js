const relayIp = "wss://domain:2223";

//Anything Player1
let P1;
let P1Name;
let P1Score = 0;
let P1Acc;
let P1Fc = true;

//Anything Player2
let P2;
let P2Name;
let P2Score = 0;
let P2Acc;
let P2Fc = true;

let matchId;

//Current song data
let currentSong;
let currentDiff;

function fancyTimeFormat(duration) {
	var hrs = ~~(duration / 3600);
	var mins = ~~((duration % 3600) / 60);
	var secs = ~~duration % 60;

	var ret = "";

	if (hrs > 0) {
		ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
	}

	ret += "" + mins + ":" + (secs < 10 ? "0" : "");
	ret += "" + secs;
	return ret;
}

//Set the user profile pictures
async function setOverlay(P1, P1Name, P2, P2Name, Round) {
	document.getElementById("roundTextP").innerText = Round;
	fetch('https://new.scoresaber.com/api/player/' + P1 + '/basic', {
		headers: {
			'Access-Control-Request-Headers': 'x-requested-with'
		}
	})
		.then(response => response.json())
		.then(data => {
			let playerCountry = data.playerInfo.country;
			if (data.playerInfo.avatar == "/images/oculus.png") {
				document.getElementById("Player1Image").src = "https://new.scoresaber.com/api/static/avatars/oculus.png";
			} else {
				document.getElementById("Player1Image").src = "https://new.scoresaber.com/api/static/avatars/" + P1 + ".jpg";
			}
			document.getElementById("Player1Name").innerText = P1Name;
			document.getElementById("Player1Rank").innerText = '#' + data.playerInfo.rank + ' Global | #' + data.playerInfo.countryRank + ' ' + playerCountry;
			document.getElementById("Player1Flag").src = "https://flagicons.lipis.dev/flags/4x3/" + playerCountry.toLowerCase() + ".svg";
			document.getElementById("Player1Name").style.opacity = '1';
			document.getElementById("Player1Rank").style.opacity = '0.6';
		});
	fetch('https://new.scoresaber.com/api/player/' + P2 + '/basic', {
		headers: {
			'Access-Control-Request-Headers': 'x-requested-with'
		}
	})
		.then(response => response.json())
		.then(data => {
			let playerCountry = data.playerInfo.country;
			if (data.playerInfo.avatar == "/images/oculus.png") {
				document.getElementById("Player2Image").src = "https://new.scoresaber.com/api/static/avatars/oculus.png";
			} else {
				document.getElementById("Player2Image").src = "https://new.scoresaber.com/api/static/avatars/" + P2 + ".jpg";
			}
			document.getElementById("Player2Name").innerText = P2Name;
			document.getElementById("Player2Rank").innerText = '#' + data.playerInfo.rank + ' Global | #' + data.playerInfo.countryRank + ' ' + playerCountry;
			document.getElementById("Player2Flag").src = "https://flagicons.lipis.dev/flags/4x3/" + playerCountry.toLowerCase() + ".svg";
			document.getElementById("Player2Name").style.opacity = '1';
			document.getElementById("Player2Rank").style.opacity = '0.6';
		});

	setTimeout(function () {
		document.getElementById("PlayerBounds").style.opacity = '1';
		document.getElementById("PlayerContainers").style.opacity = '1';
		document.getElementById("leftPoints").style.opacity = '1';
		document.getElementById("rightPoints").style.opacity = '1';
		document.getElementById("roundTextP").style.opacity = '1';
	}, 1000);
}

async function getMap(LevelId, LevelDiff, Player) {
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
			var diffColor = "#454088";
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
				setTimeout(function () {
					document.getElementById("SongCover").style.background = 'url(https://eu.cdn.beatsaver.com/' + songHash.toLowerCase() + '.jpg)';
					document.getElementById("SongCover").style.backgroundSize = 'cover';
					document.getElementById("SongCover").style.borderColor = diffColor;
					document.getElementById("SongInfo").style.borderColor = diffColor;
					document.getElementById("DiffTag").style.background = diffColor;
					document.getElementById("SongTitle").innerHTML = data.metadata.songName;
					document.getElementById("SongMapper").innerHTML = data.metadata.levelAuthorName;
					document.getElementById("SongArtist").innerHTML = data.metadata.songAuthorName;
					document.getElementById("SongKey").innerHTML = data.id;
					document.getElementById("DiffText").innerHTML = diffText;
					document.getElementById("SongLength").innerHTML = fancyTimeFormat(data.metadata.duration);
					if (Player == "Tiebreaker") {
						document.getElementById("SongPick").innerHTML = "Picked as tiebreaker";
					} else {
						document.getElementById("SongPick").innerHTML = "Picked by " + Player;
					}
					document.getElementById("SongBox").style.opacity = "1";

				}, 2000);
			});
	} else if (currentSong == songHash && currentDiff != songDiff) {
		currentDiff = songDiff;
		document.getElementById("DiffText").style.opacity = "0";
		setTimeout(function () {

			document.getElementById("DiffText").innerHTML = diffText;
			document.getElementById("DiffText").style.opacity = "1";

		}, 1000);
		document.getElementById("DiffTag").style.background = diffColor;
		document.getElementById("SongCover").style.borderColor = diffColor;
		document.getElementById("SongInfo").style.borderColor = diffColor;
	}
}

//Update the combo-counter, unless combo is 0
function scoreUpdate(player, score, combo, acc, misses, combined, badCuts, bombHits, wallHits, reset) {
	if (P1 == player) {
		P1Acc = acc.toFixed(2);
		document.getElementById("Player1Combo").innerHTML = combo + "x";
		document.getElementById("Player1ACC").innerHTML = P1Acc + "%";
		if (misses >= 1) {
			document.getElementById("Player1FC").style.color = "#d15252";
			document.getElementById("Player1FC").innerHTML = misses + "x";
			if (P1Fc) {
				P1Fc = false;
			}
		}
		if (misses == 0) {
			document.getElementById("Player1FC").style.color = "#ffffff";
			document.getElementById("Player1FC").innerHTML = "FC";
		}
		if (reset) {
			P1Fc = true;
			document.getElementById("Player1FC").style.color = "#ffffff";
			document.getElementById("Player1FC").innerHTML = "FC";
		}
	}
	if (P2 == player) {
		P2Acc = acc.toFixed(2);
		document.getElementById("Player2Combo").innerHTML = combo + "x";
		document.getElementById("Player2ACC").innerHTML = P2Acc + "%";
		if (misses >= 1) {
			document.getElementById("Player2FC").style.color = "#d15252";
			document.getElementById("Player2FC").innerHTML = misses + "x";
			if (P2Fc) {
				P2Fc = false;
			}
		}
		if (misses == 0) {
			document.getElementById("Player2FC").style.color = "#ffffff";
			document.getElementById("Player2FC").innerHTML = "FC";
		}
		if (reset) {
			P2Fc = true;
			document.getElementById("Player2FC").style.color = "#ffffff";
			document.getElementById("Player2FC").innerHTML = "FC";
		}
	}
}
function toFixed(num, fixed) {
	let re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || +2) + '})?');
	return num.toString().match(re)[0];
}

const ws = new WebSocket(relayIp);
ws.onopen = function () {
	console.log("Msg sent, connected");
};
ws.onmessage = async function (event) {
	jsonObj = JSON.parse(event.data);
	if (jsonObj.Type == 3) // LevelChanged
	{
		if (jsonObj.command == "updateMap") {
			var LevelId = jsonObj.LevelId;
			var Diff = jsonObj.Diff;
			var Player = jsonObj.Player;
			getMap(LevelId, Diff, Player);
			scoreUpdate(P1, 0, 0, 0, 0, 0, 0, 0, 0, 1);
			scoreUpdate(P2, 0, 0, 0, 0, 0, 0, 0, 0, 1);
		}
	}
	if (jsonObj.Type == 4) // Score Update
	{
		scoreUpdate(jsonObj.message.id, jsonObj.message.score, jsonObj.message.combo, jsonObj.message.acc * 100, jsonObj.message.Misses, jsonObj.message.notesMissed, jsonObj.message.badCuts, jsonObj.message.bombHits, jsonObj.message.wallHits);
	}
	if (jsonObj.Type == 5) { //Match Created
		if (jsonObj.command == "createUsers") {
			matchId = jsonObj.MatchId;
			P1 = jsonObj.PlayerIds[0];
			P2 = jsonObj.PlayerIds[1];
			setOverlay(jsonObj.PlayerIds[0], jsonObj.PlayerNames[0], jsonObj.PlayerIds[1], jsonObj.PlayerNames[1], jsonObj.Round);
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

			currentDiff = "";
			currentSong = "";

			document.getElementById("leftPoints").style.opacity = '0';
			document.getElementById("rightPoints").style.opacity = '0';

			setTimeout(function () {
				scoreUpdate(P1, 0, 0, 0, 0, 1);
				scoreUpdate(P2, 0, 0, 0, 0, 1);
				P1Score = 0;
				P2Score = 0;

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
