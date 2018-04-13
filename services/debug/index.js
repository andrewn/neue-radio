const server = require('./lib/server');
const debuggers = require('./lib/debuggers');

const main = () => {
  const port = process.env.PORT || 5005;
  const debuggerHost = process.env.REMOTE_DEBUGGER_HOST;
  const debuggerPort = process.env.REMOTE_DEBUGGER_PORT || 9222;

  console.log(`Remote debugger: ${debuggerHost}:${debuggerPort}`);

  const getList = debuggers({ debuggerHost, debuggerPort });
  server({ debuggers: getList, port });
};

main();
