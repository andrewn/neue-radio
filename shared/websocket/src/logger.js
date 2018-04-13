export default debug => (...args) => {
  if (debug) {
    console.log(...args);
  }
};
