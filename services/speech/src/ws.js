const WebSocket = require("ws");
const EventEmitter = require("events").EventEmitter;

const connect = async (host, port) => {
  const ws = new WebSocket(`ws://${host}:${port}`);

  const connection = new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve);
    ws.addEventListener("error", reject);
  });

  try {
    await connection;
  } catch (e) {
    throw e;
  } finally {
    ws.removeAllListeners();
  }

  return ws;
};

module.exports = async (host, port) => {
  const emitter = new EventEmitter();
  const ws = await connect(host, port);

  ws.addEventListener("close", () => emitter.emit("close"));
  ws.addEventListener("message", ({ data }) => {
    const { topic, payload } = JSON.parse(data);
    emitter.emit("message", topic, payload);
  });

  emitter.send = (topic, payload) =>
    ws.send(JSON.stringify({ topic, payload }));

  return emitter;
};
