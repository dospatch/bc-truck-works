const { execFile } = require("child_process");

const commandKeys = new Set(["pause","save","screenshot","echo","route","time"]);

function psQuote(value) {
  return String(value ?? "").replace(/'/g,"''");
}

function consoleLine(command, payload) {
  if (command === "pause") return "pause";
  if (command === "save") return "save";
  if (command === "screenshot") {
    const name = String(payload.name || "bc_truck_works").replace(/[^a-zA-Z0-9_-]/g,"_").slice(0,50);
    return "screenshot " + name;
  }
  if (command === "echo") {
    const message = String(payload.message || "BC TRUCK WORKS command").replace(/[\r\n]/g," ").slice(0,160);
    return 'echo "' + message.replace(/"/g,'""') + '"';
  }
  if (command === "route") {
    const start = String(payload.start || "").trim().slice(0,80);
    const end = String(payload.end || "").trim().slice(0,80);
    if (!start || !end) throw new Error("route requires start and end");
    return 'route "' + start.replace(/"/g,'""') + '" "' + end.replace(/"/g,'""') + '"';
  }
  if (command === "time") {
    const hour = Math.max(0,Math.min(23,Number(payload.hour)));
    const minute = Math.max(0,Math.min(59,Number(payload.minute || 0)));
    if (!Number.isFinite(hour)) throw new Error("time requires hour");
    return "g_set_time " + Math.floor(hour) + " " + Math.floor(minute) + " 0";
  }
  throw new Error("Unsupported command");
}

function executeGameCommand(command, payload, options = {}) {
  if (!commandKeys.has(command)) return Promise.reject(new Error("Unsupported command"));
  if (options.allowGameInput === false) return Promise.reject(new Error("Game input bridge is disabled"));

  const title = options.gameWindowTitle || "American Truck Simulator";
  const line = consoleLine(command,payload);

  const script = [
    "$wshell = New-Object -ComObject WScript.Shell",
    "$ok = $wshell.AppActivate('" + psQuote(title) + "')",
    "if (-not $ok) { throw 'Game window not found: " + psQuote(title) + "' }",
    "Start-Sleep -Milliseconds 150",
    "$wshell.SendKeys('{~}')",
    "Start-Sleep -Milliseconds 100",
    "$wshell.SendKeys('" + psQuote(line).replace(/'/g,"''") + "')",
    "$wshell.SendKeys('{ENTER}')"
  ].join("; ");

  return new Promise((resolve,reject)=>{
    execFile("powershell.exe",["-NoProfile","-NonInteractive","-Command",script],{windowsHide:true,timeout:5000},(error,stdout,stderr)=>{
      if(error) return reject(new Error((stderr || error.message).trim()));
      resolve((stdout || "Command sent").trim());
    });
  });
}

module.exports = { executeGameCommand };
