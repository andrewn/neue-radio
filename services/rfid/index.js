const { URL } = require('url');

const ws = require('./lib/ws');
const rfid = require('./lib/rfid');
const notify = require('./lib/notify');

const port = process.env.PORT || 5002;

const send = ws().send;
const { error, presented, removed } = notify(send);

// Start polling for cards
rfid({ error, presented, removed });
