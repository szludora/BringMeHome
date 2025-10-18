// TODO: change this route
let DEV_MODE = true;

function getCallerFile() {
  try {
    throw new Error();
  } catch (err) {
    const stackLines = err.stack.split("\n");
    const callerLine = stackLines[3] || stackLines[2];
    const match = callerLine.match(/\/([^\/]+\.js)/);
    return match ? match[1] : "unknown file";
  }
}

export function log(message) {
  if (!DEV_MODE) return;
  let file = "unknown";
  try {
    file = getCallerFile();
  } catch {}
  console.log(`[${file}] ${message}`);
}

export function warn(message) {
  if (!DEV_MODE) return;
  console.warn(`[${getCallerFile()}] ${message}`);

  return {
    show({ message, type, position, duration, delay }) {
      Snackbar.show({
        message: message,
        type: type,
        position: position,
        duration: duration,
        delay: delay,
      });
    },
  };
}

export function error(message) {
  if (!DEV_MODE) return;
  console.error(`[${getCallerFile()}] ${message}`);
}

export function setDevMode(value) {
  DEV_MODE = value;
  warn("DEVMODE IS ENABLED");
}
