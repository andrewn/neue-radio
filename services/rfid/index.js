const ip = require('ip');
const { URL } = require('url');

const ws = require('./lib/ws');
const rfid = require('./lib/rfid');
const notify = require('./lib/notify');

const port = process.env.PORT || 5002;
const host = new URL(`http://${ip.address()}:${port}`);

const send = ws({ host }).send;
const { error, presented, removed } = notify(send);

// Start polling for cards
rfid({ error, presented, removed });
