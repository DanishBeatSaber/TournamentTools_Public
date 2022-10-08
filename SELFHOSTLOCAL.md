## Requirements:
| Program | Usecase  |
| :--- | :---: |
| [NodeJS](https://nodejs.org/en/download/) | Starting relay server |
| [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) | Installing dependencies for relay server |
| [XAMPP](https://www.apachefriends.org/download.html) | Hosting the overlay + the map-pool/playlist files for local upload |

If you plan on deploying as production, do **not** use XAMPP as it requires configuration to be safe. 

This README is assuming you're **only hosting it locally and not on a domain**

## Setup relay-server.
Install both NodeJS+NPM. (NodeJS should come with NPM default.)

- Copy `RelayServer/Standard WebSocket` to a folder on your PC. (`C:/Tournament/RelayServer/Standard WebSocket` Is used in this example).
- Change the IP to the TournmantAssistant Server on line `38` in `C:/Tournament/RelayServer/Standard WebSocket/index.ts`.
- Open your terminal of choice and navigate to the Socket-folder. I.e `cd C:/Tournament/RelayServer/Standard WebSocket`.
- Run `npm install`.
- Run `npm start` when the installation is finished

You should now see "Connected to relay-server". If not, start from step 1 and try again. - If it keeps happening, contact [Hawk](https://discordapp.com/users/592779895084679188)
- To verify the websocket-server functions, head over to [WebSocketKing](https://websocketking.com/) and connect to `ws://localhost:2223`.
If it works, you should see `{"Type": "0","message": "You've connected to the relay server."}` in the output.

If errors still keeps happening, contact [Hawk](https://discordapp.com/users/592779895084679188)

## TA Server settings:
- For 1V1, set `scoreUpdateFrequency` to `30`.
- For Battle Royale, set `scoreUpdateFrequency` to `175`.

## Setup overlay files:
- Install XAMPP/Your Webserver of choice.
- When asked to "Select Components", select the [following](https://i.imgur.com/eoPJIA9.png): 
    - Apache
    - PHP

- After installation, start the XAMPP Control Panel, and start the Apache service.
- Open a browser and go to `http://localhost/` and you should see the XAMPP welcome page.
- After verifying that the webserver is working, go to `X:/xampp/htdocs/`, delete the contents in the folder.
- Copy the contents of `Frontends/Frontend - Local` to your htdocs/public folder in your XAMPP/Webserver installation. (I'm gonna use XAMPP, so `C:/xampp/htdocs/Tournament/`.)

- Add the following files to browser sources in OBS:

| URL | Scene  | Order | Resolution |
| :--- | :---: | :---: | :---: |
| `http://localhost/Tournament/CD/CD.html` | `CD` | - | `1920x1080`|
| `http://localhost/Tournament/1V1/` | `1V1` | `Top` | `1920x1080`|
| `http://localhost/Tournament/1V1/twitchstream.html?v=0` | `1V1` | `Bottom` | `1920x1080` |
| `http://localhost/Tournament/1V1/twitchstream.html?v=1` | `1V1` | `Bottom` | `1920x1080` |
| `http://localhost/Tournament/PB/` | `Picks and Bans` | `Top` | `1920x1080` |
| `http://localhost/Tournament/BR/BROverlay/overlay.html` | `Battle Royale` | `Top` | `2560x1140` |
| `http://localhost/Tournament/BR/BROverlay/` | `Battle Royale` | `Bottom` | `1920x1080` |
| `http://localhost/Tournament/BR/BROverlay/twitchstream.html` | `Battle Royale` | `Bottom` | `1920x1080` |
| `http://localhost/Tournament/BR/PlayerScreen/` | `Battle Royale Players` | `Top` | `1920x1080` |

- When everything is setup, you can head over to `http://localhost/Tournament/WebPanel/` in your browser and start test the connections.

Things to note:
- Players have to join the TA-server **after** you've started the relay server. 
- The `Reload overlay`-button only allows for reloading the 1V1-overlay.
- `/1V1/twitchstream.html` allows for changing of the `v`-variable, `?v=0` = Player 1, `?v=1` = Player 2.
- `/BR/BROverlay/twitchstream.html` does **not** allow for this.

If you have any question or problems, feel free to reach out on Discord, [Hawk](https://discordapp.com/users/592779895084679188), and I'll try to help you out as soon as possible.
