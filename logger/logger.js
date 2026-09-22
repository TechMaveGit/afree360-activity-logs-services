import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getLogFilePath() {
  const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return path.join(__dirname, `${dateStr}.log`);
}

const mainAppLog = path.join(__dirname, "app.log");

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

  // Date-wise log file (e.g. 2026-09-04.log)
  const dailyLogFile = getLogFilePath();
  fs.appendFile(dailyLogFile, logMsg, (err) => {
    if (err) console.error("Daily log write failed:", err);
  });

  // Cumulative app.log
  fs.appendFile(mainAppLog, logMsg, (err) => {
    if (err) console.error("App log write failed:", err);
  });
}

const formatArgs = (...args) => {
  return args.map(arg => {
    if (arg instanceof Error) return arg.stack || arg.message;
    if (typeof arg === 'object') {
      try { return JSON.stringify(arg); } catch { return String(arg); }
    }
    return arg;
  }).join(" ");
};

export default {
  info: (...args) => writeLog("INFO", formatArgs(...args)),
  error: (...args) => writeLog("ERROR", formatArgs(...args)),
  warn: (...args) => writeLog("WARN", formatArgs(...args)),
  debug: (...args) => writeLog("DEBUG", formatArgs(...args)),
};
