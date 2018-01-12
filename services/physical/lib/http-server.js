const http = require('http');
const readFile = require('fs').readFile;
const path = require('path');

const filePath = path.join(__dirname, '..', 'test.html');

// Allows requests from other ports
const allowCors = function(req,res){
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if ( req.method === 'OPTIONS' ) {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve the test page
  readFile(filePath, function (err, contents) {
    res.write(contents);
    res.end();
  });
};

module.exports.create = function() {
  return http.createServer(allowCors);
}
