import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFile = path.join(__dirname, "app.log");

function getTime() {
  return new Date().toISOString().replace("T", " ").substring(0, 19);
}

function getCallerInfo() {
  try {
    const stack = new Error().stack?.split("\n");
    return stack && stack[3] ? stack[3].trim() : "";
  } catch {
    return "";
  }
}

function writeLog(level, message) {
  const time = getTime();
  const caller = getCallerInfo();

  const logMsg = `${time} [${level}] ${message} ${caller}\n`;

  console.log(logMsg.trim());

  fs.appendFile(logFile, logMsg, (err) => {
    if (err) console.error("Log write failed:", err);
  });
}

export default {
  info: (msg) => writeLog("INFO", msg),
  error: (msg) => writeLog("ERROR", msg),
  warn: (msg) => writeLog("WARN", msg),
  debug: (msg) => writeLog("DEBUG", msg),
};
