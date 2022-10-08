import * as taWSS from "tournament-assistant-client";
import { createServer } from 'https';
import { readFileSync } from 'fs';
import { WebSocket, WebSocketServer } from "ws";

const server = createServer({
    cert: readFileSync('./Keys/cert.pem'),
    key: readFileSync('./Keys/privkey.pem')
});

const wss = new WebSocketServer({ server });
wss.on('connection', function connection(ws) {
    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
    ws.send(JSON.stringify({ 'Type': '0', 'message': 'You\'ve connected to the Dane Saber Tournament relay server.' }));
    ws.on('message', function message(data) {
        if (data.toString().startsWith("{")) {
            let jsonObj = JSON.parse(data.toString());
            if (jsonObj.Type == "69" && jsonObj.message == "Close") {
                console.log("Closed connection to TA server");
                taWS.close();
            }
            if (jsonObj.Type == "5" && jsonObj.command == "requestMatches") {
                console.log("Matches got requested");
                if (matchArray != null) {
                    ws.send(JSON.stringify({ 'Type': '5', command: 'returnMatches', 'message': { matches: matchArray } }));
                } else {
                    ws.send(JSON.stringify({ 'Type': '5', command: 'returnMatches', 'message': "No matches found" }));
                }
            }
        } else {
            console.log("Someone tried to pass a non-JSON message to the relay server");
        }
    });
});
server.listen(2223);
const ws = new WebSocket(`wss://domain:2223`, { rejectUnauthorized: false });

const taWS = new taWSS.Client("TAOverlay", {
    url: "ws://taserver:2053"
});

const debug:boolean = true;
let usersArray: any = [];
let users: any = [];
let matchArray: any = [];
let matchusers: any = [];
let userIds: any = [];
let songData: [string, number] = ["", 0];

taWS.on("packet", p => {
    if (p.has_response && p.response.has_connect) {
        if (p.response.type === 1) {
            console.log(p.response.connect.message);
        } else {
            throw new Error("Connection was not successful");
        }
    }
});

taWS.on("matchCreated", m => {
    m.data.associated_users.push(taWS.Self.guid);
    taWS.updateMatch(m.data);
    let coordinatorID:string = m.data.leader;
    let coordinatorName:string = "";

    for (let i = 0; i < m.data.associated_users.length; i++) {
        if (m.data.associated_users[i] != taWS.Self.guid) {
            let index = usersArray.findIndex((x: any) => x.guid == m.data.associated_users[i]);
            if (index != -1) {
                users.push(m.data.associated_users[i]);
            }
        }
    }

    if (users.length > 3 && !debug || debug) {
        try {
            for (let i = 0; i < users.length; i++) {
                let index = usersArray.findIndex((x: any) => x.guid == users[i]);
                console.log("Found user " + usersArray[index].name + " | User Id " + usersArray[index].user_id + " in usersArray");
                userIds.push(usersArray[index].user_id);
                ws.send(JSON.stringify({ 'Type': '1', 'overlay': 'BattleRoyale' ,'userid': userIds, 'order': 1 }));
                userIds = [];
            }
        } catch (error) {
            console.log("Error: No user found in UsersArray");
        }
    }
    if (users.length < 3 && !debug || debug) {
        try {
            coordinatorName = usersArray.find((u: { guid: string; }) => u.guid === coordinatorID).name || "Unknown";
        } catch (error) {
            coordinatorName = "Unknown";
            coordinatorID = "00000000-0000-0000-0000-000000000000";
        }
        try {
        for (let i = 0; i < users.length; i++) {
            for (let j = 0; j < usersArray.length; j++) {
                if (users[i] == usersArray[j].guid) {
                    matchusers.push({ name: usersArray[j].name, user_id: usersArray[j].user_id, guid: usersArray[j].guid });
                }
            }
        } } catch (error) {
            console.log("Error: No user found in UsersArray");
        }
    
        //Push to matchArray
        matchArray.push({matchData: { matchId: m.data.guid, coordinator: { name: coordinatorName, id: coordinatorID }, players: matchusers}});
        ws.send(JSON.stringify({ 'Type': '1', 'overlay': '1V1', 'message': { matchData: { matchId: m.data.guid, coordinator: { name: coordinatorName, id: coordinatorID }, players: matchusers } } }));
        users = [];
        matchusers = [];
    }
});

taWS.on("userAdded", u => {
    if (u.data.client_type == 0) {
        usersArray.push({ "name": u.data.name, "type": u.data.client_type, "guid": u.data.guid, "user_id": u.data.user_id });
    }
});

taWS.on("userLeft", u => {
    if (u.data.client_type == 0) {
        let index = usersArray.findIndex((x: any) => x.guid == u.data.guid);
        usersArray.splice(index, 1);
    }
});

function Score(_id: any, _score: number, _acc: number, _combo: number, _notesMissed: number, _badCuts: number, _bombHits?: number, _wallHits?: number, _maxCombo?: number, _lhAvg?: any, _lhBad?: number, _lhHit?: number, _lhMiss?: number, _rhAvg?: any, _rhBad?: number, _rhHit?: number, _rhMiss?: number) {
    this.id = _id;
    this.score = _score;
    this.acc = _acc;
    this.combo = _combo;
    this.notesMissed = _notesMissed;
    this.badCuts = _badCuts;
    this.bombHits = _bombHits;
    this.wallHits = _wallHits;
    this.maxCombo = _maxCombo;
    this.lhAvg = _lhAvg;
    this.lhBad = _lhBad;
    this.lhHit = _lhHit;
    this.lhMiss = _lhMiss;
    this.rhAvg = _rhAvg;
    this.rhBad = _rhBad;
    this.rhHit = _rhHit;
    this.rhMiss = _rhMiss;
    this.Misses = _notesMissed + _badCuts;
    //Misses is just the sum of missed and badcuts - Used on the 1V1 for the FC/Miss counter.
}

taWS.on("realtimeScore", s => {
    let index = usersArray.findIndex((x: any) => x.guid == s.data.user_guid);
    let user_id = usersArray[index].user_id;
    let userScoring = new Score(user_id, s.data.score, s.data.accuracy, s.data.combo, s.data.scoreTracker.notesMissed, s.data.scoreTracker.badCuts, s.data.scoreTracker.bombHits, s.data.scoreTracker.wallHits, s.data.scoreTracker.maxCombo, s.data.scoreTracker.leftHand.avgCut, s.data.scoreTracker.leftHand.badCut, s.data.scoreTracker.leftHand.hit, s.data.scoreTracker.leftHand.miss, s.data.scoreTracker.rightHand.avgCut, s.data.scoreTracker.rightHand.badCut, s.data.scoreTracker.rightHand.hit, s.data.scoreTracker.rightHand.miss);
    ws.send(JSON.stringify({ 'Type': '4', 'message': userScoring }));
});
taWS.on("matchUpdated", m => {
    if (typeof m.data.selected_level != "undefined") {
        if (songData[0] != m.data.selected_level.level_id || songData[1] != m.data.selected_difficulty) {
            ws.send(JSON.stringify({ 'Type': '3', 'LevelId': m.data.selected_level.level_id, 'Diff': m.data.selected_difficulty }));
            songData[0] = m.data.selected_level.level_id;
            songData[1] = m.data.selected_difficulty;
        }
    }
});

taWS.on('matchDeleted', d => {
    let index = matchArray.findIndex((x: { matchData: { matchId: string; }; }) => x.matchData.matchId === d.data.guid);
    ws.send(JSON.stringify({ 'Type': '2', 'message': matchArray[index] }));
    matchArray.splice(index, 1);
});

taWS.on("error", e => {
    throw e;
});