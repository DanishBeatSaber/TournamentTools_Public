
![Logo](GitHubImage.png)

# WIKI COMING SOON <br /> COMPATIBIBLE WITH TA 0.6.7

# TournamentTools #
This was originally made to be closed-sourced and only for use within the danish Beat Saber Discord, though someone asked me if I would open-source it, and I thought why not, more people would be able to collaborate on it and make it even better.

## Functions:
Stream Assets:
```
- Countdown file - Time remaining can be changed in Timer.txt - To activate CD, press "Interact" and click on the timer in OBS
```

The 1V1 Tools:
```
- Allows for the coordinator to push, and lock, the 1V1 overlay to 2 specific users.
- Allows for easy management of score-count.
- Allows coordinators to do Picks & Bans, and update the overlay real-time.  
```

The Battle Royale Tools:
```
- Allows for mass-creation of users on overlay.
- Allows for managing scores/alive.
- Allows for changing the spectated playername + stream. (The auto-stream changing requires HTTPS)
- Automatically removes users from the panel when declared dead and grays them out on the overlay.
```

## TODO:
| Function | Where | Why |
| :----: | :----: | :----: |
| User IDs type change | Everywhere | A numeric user ID shouldn't be a string, that simple |
| BeatKhana-support | WebPanel | To allows the user to input a BeatKhana tournament ID, which in return fetches participants, map-pool + bracket, making it easier for the coordinator to pick the match, and eliminates the need for manually typing in username, ScoreSaber ID and Twitch-link |
| TypeScript-version | Everywhere | To enforce types and allow for developers to collaborate easier |

# Preview of overlay:
- [Explaining each component](PreviewDetails.png)
- [Clean screenshot](PreviewNoDetails.png)

# How to use:
### 1V1 Tools:
- [How to Use](https://www.youtube.com/watch?v=_UYZaVLu1h0) - YouTube link.

### Battle Royale-tools:
- [How to Use](https://www.youtube.com/watch?v=FxN-R_RkI7s) - YouTube link.


# Want to rehost for yourself? 
- [README for hosting on domain](SELFHOSTDOMAIN.md)
- [README for local hosting](SELFHOSTLOCAL.md)

# For Developers
### Message Types
**OUTDATED | Will get updated with Wiki**

```json
```
## Contributing

Do you want to contribute code? Fork this, create a PR with your change(s) + explanation behind it/them and we'll have a look at it.

If you don't want to contribute code, that's ok, if you see anything completely out of order, don't hesitate to question it.
