const path = require('path');
const ip = require('ip');
const { URL } = require('url');

const downloader = require('./lib/downloader');
const http = require('./lib/io/http');
const ws  = require('./lib/io/ws');

const port = process.env.PORT || 3000;
const host = new URL(`http://${ip.address()}:${port}`);
const downloadPath = path.join(__dirname, 'public', 'videos');

http({ port, publicPath: downloadPath });
ws({ host, downloader: downloader.download(downloadPath) });

if(process.env.DEBUG) {
  setTimeout(() => {
    console.log('Sending demo message');

    const WebSocket = require('ws');
    const ws = new WebSocket('ws://' + host.host + ':8000');
    const msg = JSON.stringify({topic: 'mediaRequest', payload: { url: 'https://www.youtube.com/watch?v=0bYY8m1Lb2I' }});

    ws.on('open', () => ws.send(msg));
  }, 1000);
}
