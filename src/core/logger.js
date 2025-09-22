const DEV_MODE = true;

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
  console.log(`[${getCallerFile()}] ${message}`);
}

export function warn(message) {
  if (!DEV_MODE) return;
  console.warn(`[${getCallerFile()}] ${message}`);
}

export function error(message) {
  if (!DEV_MODE) return;
  console.error(`[${getCallerFile()}] ${message}`);
}
