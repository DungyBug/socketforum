# Socket Forum

First prototype of socket forum

### Run

Open 2 consoles,

in first type `npm run start:c`
in second type `npm run start:s`

### Notes
Every time you create topic `topics.json` updates and nodemon restarts server and logouts you.
Configurate nodemon to ignore `topics.json` or run `node ./dist/server.js` after server build in second console.

To create topic you will need an account. There is `testusr` with password `asdf` and email `asdf`.