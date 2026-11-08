# JW Player (self-hosted)

Self-hosted copy of our JW Player library `https://cdn.jwplayer.com/libraries/mxNkRalL.js`,
so the site doesn't break when that endpoint is down (it returned 502 on 2026-10-29).

`mxNkRalL.js` (JW Player 8.51.8) = official `https://ssl.p.jwpcdn.com/player/v/8.51.8/jwplayer.js`
+ the `jwplayer.defaults` block (licence key and dashboard config) from the library above.

The player still lazy-loads its chunks (core, providers, hls.js, translations) from
`https://ssl.p.jwpcdn.com/player/v/8.51.8/`. The file must not be named `jwplayer.js`,
otherwise the player looks for its chunks next to it.

## Updating

1. `curl -s --compressed https://cdn.jwplayer.com/libraries/mxNkRalL.js -o new.js`
2. Replace `mxNkRalL.js` here with it.
3. The licence key in it (`jwplayer.defaults.key`) is valid ~24h; when it expires the player
   fetches a new one from `content.jwplatform.com` (allowed in CSP, `server/app-prod.js`).
