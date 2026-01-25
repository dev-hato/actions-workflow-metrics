import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// node_modules/systeminformation/package.json
var require_package = __commonJS((exports, module) => {
  module.exports = {
    name: "systeminformation",
    version: "5.30.6",
    description: "Advanced, lightweight system and OS information library",
    license: "MIT",
    author: "Sebastian Hildebrandt <hildebrandt@plus-innovations.com> (https://plus-innovations.com)",
    homepage: "https://systeminformation.io",
    main: "./lib/index.js",
    type: "commonjs",
    bin: {
      systeminformation: "lib/cli.js"
    },
    types: "./lib/index.d.ts",
    scripts: {
      test: "node ./test/test.js",
      testDeno: "deno run -A ./test/test.js"
    },
    files: [
      "lib/"
    ],
    keywords: [
      "system information",
      "sysinfo",
      "monitor",
      "monitoring",
      "os",
      "linux",
      "osx",
      "windows",
      "freebsd",
      "openbsd",
      "netbsd",
      "cpu",
      "cpuload",
      "physical cores",
      "logical cores",
      "processor",
      "cores",
      "threads",
      "socket type",
      "memory",
      "file system",
      "fsstats",
      "diskio",
      "block devices",
      "netstats",
      "network",
      "network interfaces",
      "network connections",
      "network stats",
      "iface",
      "printer",
      "processes",
      "users",
      "internet",
      "battery",
      "docker",
      "docker stats",
      "docker processes",
      "graphics",
      "graphic card",
      "graphic controller",
      "gpu",
      "display",
      "smart",
      "disk layout",
      "usb",
      "audio",
      "bluetooth",
      "wifi",
      "wifinetworks",
      "virtual box",
      "virtualbox",
      "vm",
      "backend",
      "hardware",
      "BIOS",
      "chassis"
    ],
    repository: {
      type: "git",
      url: "git+https://github.com/sebhildebrandt/systeminformation.git"
    },
    funding: {
      type: "Buy me a coffee",
      url: "https://www.buymeacoffee.com/systeminfo"
    },
    os: [
      "darwin",
      "linux",
      "win32",
      "freebsd",
      "openbsd",
      "netbsd",
      "sunos",
      "android"
    ],
    engines: {
      node: ">=8.0.0"
    }
  };
});

// node_modules/systeminformation/lib/util.js
var require_util = __commonJS((exports) => {
  var os = __require("os");
  var fs = __require("fs");
  var path = __require("path");
  var spawn = __require("child_process").spawn;
  var exec = __require("child_process").exec;
  var execSync = __require("child_process").execSync;
  var util = __require("util");
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _cores = 0;
  var codepage = "";
  var _smartMonToolsInstalled = null;
  var _rpi_cpuinfo = null;
  var WINDIR = process.env.WINDIR || "C:\\Windows";
  var _psChild;
  var _psResult = "";
  var _psCmds = [];
  var _psPersistent = false;
  var _powerShell = "";
  var _psToUTF8 = "$OutputEncoding = [System.Console]::OutputEncoding = [System.Console]::InputEncoding = [System.Text.Encoding]::UTF8 ; ";
  var _psCmdStart = "--###START###--";
  var _psError = "--ERROR--";
  var _psCmdSeperator = "--###ENDCMD###--";
  var _psIdSeperator = "--##ID##--";
  var execOptsWin = {
    windowsHide: true,
    maxBuffer: 1024 * 102400,
    encoding: "UTF-8",
    env: Object.assign({}, process.env, { LANG: "en_US.UTF-8" })
  };
  var execOptsLinux = {
    maxBuffer: 1024 * 102400,
    encoding: "UTF-8",
    stdio: ["pipe", "pipe", "ignore"]
  };
  function toInt(value) {
    let result2 = parseInt(value, 10);
    if (isNaN(result2)) {
      result2 = 0;
    }
    return result2;
  }
  function splitByNumber(str) {
    let numberStarted = false;
    let num = "";
    let cpart = "";
    for (const c of str) {
      if (c >= "0" && c <= "9" || numberStarted) {
        numberStarted = true;
        num += c;
      } else {
        cpart += c;
      }
    }
    return [cpart, num];
  }
  var stringObj = new String;
  var stringReplace = new String().replace;
  var stringToLower = new String().toLowerCase;
  var stringToString = new String().toString;
  var stringSubstr = new String().substr;
  var stringSubstring = new String().substring;
  var stringTrim = new String().trim;
  var stringStartWith = new String().startsWith;
  var mathMin = Math.min;
  function isFunction(functionToCheck) {
    let getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === "[object Function]";
  }
  function unique(obj) {
    const uniques = [];
    const stringify = {};
    for (let i = 0;i < obj.length; i++) {
      let keys = Object.keys(obj[i]);
      keys.sort((a, b) => {
        return a - b;
      });
      let str = "";
      for (let j = 0;j < keys.length; j++) {
        str += JSON.stringify(keys[j]);
        str += JSON.stringify(obj[i][keys[j]]);
      }
      if (!{}.hasOwnProperty.call(stringify, str)) {
        uniques.push(obj[i]);
        stringify[str] = true;
      }
    }
    return uniques;
  }
  function sortByKey(array, keys) {
    return array.sort((a, b) => {
      let x = "";
      let y = "";
      keys.forEach((key) => {
        x = x + a[key];
        y = y + b[key];
      });
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }
  function cores() {
    if (_cores === 0) {
      _cores = os.cpus().length;
    }
    return _cores;
  }
  function getValue(lines, property, separator, trimmed, lineMatch) {
    separator = separator || ":";
    property = property.toLowerCase();
    trimmed = trimmed || false;
    lineMatch = lineMatch || false;
    let result2 = "";
    lines.some((line) => {
      let lineLower = line.toLowerCase().replace(/\t/g, "");
      if (trimmed) {
        lineLower = lineLower.trim();
      }
      if (lineLower.startsWith(property) && (lineMatch ? lineLower.match(property + separator) || lineLower.match(property + " " + separator) : true)) {
        const parts = trimmed ? line.trim().split(separator) : line.split(separator);
        if (parts.length >= 2) {
          parts.shift();
          result2 = parts.join(separator).trim();
          return true;
        }
      }
      return false;
    });
    return result2;
  }
  function decodeEscapeSequence(str, base) {
    base = base || 16;
    return str.replace(/\\x([0-9A-Fa-f]{2})/g, function() {
      return String.fromCharCode(parseInt(arguments[1], base));
    });
  }
  function detectSplit(str) {
    let seperator = "";
    let part = 0;
    str.split("").forEach((element) => {
      if (element >= "0" && element <= "9") {
        if (part === 1) {
          part++;
        }
      } else {
        if (part === 0) {
          part++;
        }
        if (part === 1) {
          seperator += element;
        }
      }
    });
    return seperator;
  }
  function parseTime(t, pmDesignator) {
    pmDesignator = pmDesignator || "";
    t = t.toUpperCase();
    let hour = 0;
    let min = 0;
    const splitter = detectSplit(t);
    const parts = t.split(splitter);
    if (parts.length >= 2) {
      if (parts[2]) {
        parts[1] += parts[2];
      }
      let isPM = parts[1] && parts[1].toLowerCase().indexOf("pm") > -1 || parts[1].toLowerCase().indexOf("p.m.") > -1 || parts[1].toLowerCase().indexOf("p. m.") > -1 || parts[1].toLowerCase().indexOf("n") > -1 || parts[1].toLowerCase().indexOf("ch") > -1 || parts[1].toLowerCase().indexOf("ös") > -1 || pmDesignator && parts[1].toLowerCase().indexOf(pmDesignator) > -1;
      hour = parseInt(parts[0], 10);
      min = parseInt(parts[1], 10);
      hour = isPM && hour < 12 ? hour + 12 : hour;
      return ("0" + hour).substr(-2) + ":" + ("0" + min).substr(-2);
    }
  }
  function parseDateTime(dt, culture) {
    const result2 = {
      date: "",
      time: ""
    };
    culture = culture || {};
    const dateFormat = (culture.dateFormat || "").toLowerCase();
    const pmDesignator = culture.pmDesignator || "";
    const parts = dt.split(" ");
    if (parts[0]) {
      if (parts[0].indexOf("/") >= 0) {
        const dtparts = parts[0].split("/");
        if (dtparts.length === 3) {
          if (dtparts[0].length === 4) {
            result2.date = dtparts[0] + "-" + ("0" + dtparts[1]).substr(-2) + "-" + ("0" + dtparts[2]).substr(-2);
          } else if (dtparts[2].length === 2) {
            if (dateFormat.indexOf("/d/") > -1 || dateFormat.indexOf("/dd/") > -1) {
              result2.date = "20" + dtparts[2] + "-" + ("0" + dtparts[1]).substr(-2) + "-" + ("0" + dtparts[0]).substr(-2);
            } else {
              result2.date = "20" + dtparts[2] + "-" + ("0" + dtparts[1]).substr(-2) + "-" + ("0" + dtparts[0]).substr(-2);
            }
          } else {
            const isEN = dt.toLowerCase().indexOf("pm") > -1 || dt.toLowerCase().indexOf("p.m.") > -1 || dt.toLowerCase().indexOf("p. m.") > -1 || dt.toLowerCase().indexOf("am") > -1 || dt.toLowerCase().indexOf("a.m.") > -1 || dt.toLowerCase().indexOf("a. m.") > -1;
            if ((isEN || dateFormat.indexOf("/d/") > -1 || dateFormat.indexOf("/dd/") > -1) && dateFormat.indexOf("dd/") !== 0) {
              result2.date = dtparts[2] + "-" + ("0" + dtparts[0]).substr(-2) + "-" + ("0" + dtparts[1]).substr(-2);
            } else {
              result2.date = dtparts[2] + "-" + ("0" + dtparts[1]).substr(-2) + "-" + ("0" + dtparts[0]).substr(-2);
            }
          }
        }
      }
      if (parts[0].indexOf(".") >= 0) {
        const dtparts = parts[0].split(".");
        if (dtparts.length === 3) {
          if (dateFormat.indexOf(".d.") > -1 || dateFormat.indexOf(".dd.") > -1) {
            result2.date = dtparts[2] + "-" + ("0" + dtparts[0]).substr(-2) + "-" + ("0" + dtparts[1]).substr(-2);
          } else {
            result2.date = dtparts[2] + "-" + ("0" + dtparts[1]).substr(-2) + "-" + ("0" + dtparts[0]).substr(-2);
          }
        }
      }
      if (parts[0].indexOf("-") >= 0) {
        const dtparts = parts[0].split("-");
        if (dtparts.length === 3) {
          result2.date = dtparts[0] + "-" + ("0" + dtparts[1]).substr(-2) + "-" + ("0" + dtparts[2]).substr(-2);
        }
      }
    }
    if (parts[1]) {
      parts.shift();
      const time = parts.join(" ");
      result2.time = parseTime(time, pmDesignator);
    }
    return result2;
  }
  function parseHead(head, rights) {
    let space = rights > 0;
    let count = 1;
    let from = 0;
    let to = 0;
    const result2 = [];
    for (let i = 0;i < head.length; i++) {
      if (count <= rights) {
        if (/\s/.test(head[i]) && !space) {
          to = i - 1;
          result2.push({
            from,
            to: to + 1,
            cap: head.substring(from, to + 1)
          });
          from = to + 2;
          count++;
        }
        space = head[i] === " ";
      } else {
        if (!/\s/.test(head[i]) && space) {
          to = i - 1;
          if (from < to) {
            result2.push({
              from,
              to,
              cap: head.substring(from, to)
            });
          }
          from = to + 1;
          count++;
        }
        space = head[i] === " ";
      }
    }
    to = 5000;
    result2.push({
      from,
      to,
      cap: head.substring(from, to)
    });
    let len = result2.length;
    for (let i = 0;i < len; i++) {
      if (result2[i].cap.replace(/\s/g, "").length === 0) {
        if (i + 1 < len) {
          result2[i].to = result2[i + 1].to;
          result2[i].cap = result2[i].cap + result2[i + 1].cap;
          result2.splice(i + 1, 1);
          len = len - 1;
        }
      }
    }
    return result2;
  }
  function findObjectByKey(array, key, value) {
    for (let i = 0;i < array.length; i++) {
      if (array[i][key] === value) {
        return i;
      }
    }
    return -1;
  }
  function getPowershell() {
    _powerShell = "powershell.exe";
    if (_windows) {
      const defaultPath = `${WINDIR}\\system32\\WindowsPowerShell\\v1.0\\powershell.exe`;
      if (fs.existsSync(defaultPath)) {
        _powerShell = defaultPath;
      }
    }
  }
  function getVboxmanage() {
    return _windows ? `"${process.env.VBOX_INSTALL_PATH || process.env.VBOX_MSI_INSTALL_PATH}\\VBoxManage.exe"` : "vboxmanage";
  }
  function powerShellProceedResults(data) {
    let id = "";
    let parts;
    let res = "";
    if (data.indexOf(_psCmdStart) >= 0) {
      parts = data.split(_psCmdStart);
      const parts2 = parts[1].split(_psIdSeperator);
      id = parts2[0];
      if (parts2.length > 1) {
        data = parts2.slice(1).join(_psIdSeperator);
      }
    }
    if (data.indexOf(_psCmdSeperator) >= 0) {
      parts = data.split(_psCmdSeperator);
      res = parts[0];
    }
    let remove = -1;
    for (let i = 0;i < _psCmds.length; i++) {
      if (_psCmds[i].id === id) {
        remove = i;
        _psCmds[i].callback(res);
      }
    }
    if (remove >= 0) {
      _psCmds.splice(remove, 1);
    }
  }
  function powerShellStart() {
    if (!_psChild) {
      _psChild = spawn(_powerShell, ["-NoProfile", "-NoLogo", "-InputFormat", "Text", "-NoExit", "-Command", "-"], {
        stdio: "pipe",
        windowsHide: true,
        maxBuffer: 1024 * 102400,
        encoding: "UTF-8",
        env: Object.assign({}, process.env, { LANG: "en_US.UTF-8" })
      });
      if (_psChild && _psChild.pid) {
        _psPersistent = true;
        _psChild.stdout.on("data", (data) => {
          _psResult = _psResult + data.toString("utf8");
          if (data.indexOf(_psCmdSeperator) >= 0) {
            powerShellProceedResults(_psResult);
            _psResult = "";
          }
        });
        _psChild.stderr.on("data", () => {
          powerShellProceedResults(_psResult + _psError);
        });
        _psChild.on("error", () => {
          powerShellProceedResults(_psResult + _psError);
        });
        _psChild.on("close", () => {
          if (_psChild) {
            _psChild.kill();
          }
        });
      }
    }
  }
  function powerShellRelease() {
    try {
      if (_psChild) {
        _psChild.stdin.write("exit" + os.EOL);
        _psChild.stdin.end();
      }
    } catch {
      if (_psChild) {
        _psChild.kill();
      }
    }
    _psPersistent = false;
    _psChild = null;
  }
  function powerShell(cmd) {
    if (_psPersistent) {
      const id = Math.random().toString(36).substring(2, 12);
      return new Promise((resolve) => {
        process.nextTick(() => {
          function callback(data) {
            resolve(data);
          }
          _psCmds.push({
            id,
            cmd,
            callback,
            start: new Date
          });
          try {
            if (_psChild && _psChild.pid) {
              _psChild.stdin.write(_psToUTF8 + "echo " + _psCmdStart + id + _psIdSeperator + "; " + os.EOL + cmd + os.EOL + "echo " + _psCmdSeperator + os.EOL);
            }
          } catch {
            resolve("");
          }
        });
      });
    } else {
      let result2 = "";
      return new Promise((resolve) => {
        process.nextTick(() => {
          try {
            const osVersion = os.release().split(".").map(Number);
            const spanOptions = osVersion[0] < 10 ? ["-NoProfile", "-NoLogo", "-InputFormat", "Text", "-NoExit", "-ExecutionPolicy", "Unrestricted", "-Command", "-"] : ["-NoProfile", "-NoLogo", "-InputFormat", "Text", "-ExecutionPolicy", "Unrestricted", "-Command", _psToUTF8 + cmd];
            const child = spawn(_powerShell, spanOptions, {
              stdio: "pipe",
              windowsHide: true,
              maxBuffer: 1024 * 102400,
              encoding: "UTF-8",
              env: Object.assign({}, process.env, { LANG: "en_US.UTF-8" })
            });
            if (child && !child.pid) {
              child.on("error", () => {
                resolve(result2);
              });
            }
            if (child && child.pid) {
              child.stdout.on("data", (data) => {
                result2 = result2 + data.toString("utf8");
              });
              child.stderr.on("data", () => {
                child.kill();
                resolve(result2);
              });
              child.on("close", () => {
                child.kill();
                resolve(result2);
              });
              child.on("error", () => {
                child.kill();
                resolve(result2);
              });
              if (osVersion[0] < 10) {
                try {
                  child.stdin.write(_psToUTF8 + cmd + os.EOL);
                  child.stdin.write("exit" + os.EOL);
                  child.stdin.end();
                } catch {
                  child.kill();
                  resolve(result2);
                }
              }
            } else {
              resolve(result2);
            }
          } catch {
            resolve(result2);
          }
        });
      });
    }
  }
  function execSafe(cmd, args, options) {
    let result2 = "";
    options = options || {};
    return new Promise((resolve) => {
      process.nextTick(() => {
        try {
          const child = spawn(cmd, args, options);
          if (child && !child.pid) {
            child.on("error", () => {
              resolve(result2);
            });
          }
          if (child && child.pid) {
            child.stdout.on("data", (data) => {
              result2 += data.toString();
            });
            child.on("close", () => {
              child.kill();
              resolve(result2);
            });
            child.on("error", () => {
              child.kill();
              resolve(result2);
            });
          } else {
            resolve(result2);
          }
        } catch {
          resolve(result2);
        }
      });
    });
  }
  function getCodepage() {
    if (_windows) {
      if (!codepage) {
        try {
          const stdout = execSync("chcp", execOptsWin);
          const lines = stdout.toString().split(`\r
`);
          const parts = lines[0].split(":");
          codepage = parts.length > 1 ? parts[1].replace(".", "").trim() : "";
        } catch {
          codepage = "437";
        }
      }
      return codepage;
    }
    if (_linux || _darwin || _freebsd || _openbsd || _netbsd) {
      if (!codepage) {
        try {
          const stdout = execSync("echo $LANG", execOptsLinux);
          const lines = stdout.toString().split(`\r
`);
          const parts = lines[0].split(".");
          codepage = parts.length > 1 ? parts[1].trim() : "";
          if (!codepage) {
            codepage = "UTF-8";
          }
        } catch {
          codepage = "UTF-8";
        }
      }
      return codepage;
    }
  }
  function smartMonToolsInstalled() {
    if (_smartMonToolsInstalled !== null) {
      return _smartMonToolsInstalled;
    }
    _smartMonToolsInstalled = false;
    if (_windows) {
      try {
        const pathArray = execSync("WHERE smartctl 2>nul", execOptsWin).toString().split(`\r
`);
        if (pathArray && pathArray.length) {
          _smartMonToolsInstalled = pathArray[0].indexOf(":\\") >= 0;
        } else {
          _smartMonToolsInstalled = false;
        }
      } catch {
        _smartMonToolsInstalled = false;
      }
    }
    if (_linux || _darwin || _freebsd || _openbsd || _netbsd) {
      try {
        const pathArray = execSync("which smartctl 2>/dev/null", execOptsLinux).toString().split(`\r
`);
        _smartMonToolsInstalled = pathArray.length > 0;
      } catch {
        util.noop();
      }
    }
    return _smartMonToolsInstalled;
  }
  function isRaspberry(cpuinfo) {
    const PI_MODEL_NO = ["BCM2708", "BCM2709", "BCM2710", "BCM2711", "BCM2712", "BCM2835", "BCM2836", "BCM2837", "BCM2837B0"];
    if (_rpi_cpuinfo !== null) {
      cpuinfo = _rpi_cpuinfo;
    } else if (cpuinfo === undefined) {
      try {
        cpuinfo = fs.readFileSync("/proc/cpuinfo", { encoding: "utf8" }).toString().split(`
`);
        _rpi_cpuinfo = cpuinfo;
      } catch {
        return false;
      }
    }
    const hardware = getValue(cpuinfo, "hardware");
    const model = getValue(cpuinfo, "model");
    return hardware && PI_MODEL_NO.indexOf(hardware) > -1 || model && model.indexOf("Raspberry Pi") > -1;
  }
  function isRaspbian() {
    let osrelease = [];
    try {
      osrelease = fs.readFileSync("/etc/os-release", { encoding: "utf8" }).toString().split(`
`);
    } catch {
      return false;
    }
    const id = getValue(osrelease, "id", "=");
    return id && id.indexOf("raspbian") > -1;
  }
  function execWin(cmd, opts, callback) {
    if (!callback) {
      callback = opts;
      opts = execOptsWin;
    }
    let newCmd = "chcp 65001 > nul && cmd /C " + cmd + " && chcp " + codepage + " > nul";
    exec(newCmd, opts, (error2, stdout) => {
      callback(error2, stdout);
    });
  }
  function darwinXcodeExists() {
    const cmdLineToolsExists = fs.existsSync("/Library/Developer/CommandLineTools/usr/bin/");
    const xcodeAppExists = fs.existsSync("/Applications/Xcode.app/Contents/Developer/Tools");
    const xcodeExists = fs.existsSync("/Library/Developer/Xcode/");
    return cmdLineToolsExists || xcodeExists || xcodeAppExists;
  }
  function nanoSeconds() {
    const time = process.hrtime();
    if (!Array.isArray(time) || time.length !== 2) {
      return 0;
    }
    return +time[0] * 1e9 + +time[1];
  }
  function countUniqueLines(lines, startingWith) {
    startingWith = startingWith || "";
    const uniqueLines = [];
    lines.forEach((line) => {
      if (line.startsWith(startingWith)) {
        if (uniqueLines.indexOf(line) === -1) {
          uniqueLines.push(line);
        }
      }
    });
    return uniqueLines.length;
  }
  function countLines(lines, startingWith) {
    startingWith = startingWith || "";
    const uniqueLines = [];
    lines.forEach((line) => {
      if (line.startsWith(startingWith)) {
        uniqueLines.push(line);
      }
    });
    return uniqueLines.length;
  }
  function sanitizeShellString(str, strict) {
    if (typeof strict === "undefined") {
      strict = false;
    }
    const s = str || "";
    let result2 = "";
    const l = mathMin(s.length, 2000);
    for (let i = 0;i <= l; i++) {
      if (!(s[i] === undefined || s[i] === ">" || s[i] === "<" || s[i] === "*" || s[i] === "?" || s[i] === "[" || s[i] === "]" || s[i] === "|" || s[i] === "˚" || s[i] === "$" || s[i] === ";" || s[i] === "&" || s[i] === "]" || s[i] === "#" || s[i] === "\\" || s[i] === "\t" || s[i] === `
` || s[i] === "\r" || s[i] === "'" || s[i] === "`" || s[i] === '"' || s[i].length > 1 || strict && s[i] === "(" || strict && s[i] === ")" || strict && s[i] === "@" || strict && s[i] === " " || strict && s[i] === "{" || strict && s[i] === ";" || strict && s[i] === "}")) {
        result2 = result2 + s[i];
      }
    }
    return result2;
  }
  function isPrototypePolluted() {
    const s = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let notPolluted = true;
    let st = "";
    try {
      st.__proto__.replace = stringReplace;
      st.__proto__.toLowerCase = stringToLower;
      st.__proto__.toString = stringToString;
      st.__proto__.substr = stringSubstr;
      st.__proto__.substring = stringSubstring;
      st.__proto__.trim = stringTrim;
      st.__proto__.startsWith = stringStartWith;
    } catch (e) {
      Object.setPrototypeOf(st, stringObj);
    }
    notPolluted = notPolluted || s.length !== 62;
    const ms = Date.now();
    if (typeof ms === "number" && ms > 1600000000000) {
      const l = ms % 100 + 15;
      for (let i = 0;i < l; i++) {
        const r = Math.random() * 61.99999999 + 1;
        const rs = parseInt(Math.floor(r).toString(), 10);
        const rs2 = parseInt(r.toString().split(".")[0], 10);
        const q = Math.random() * 61.99999999 + 1;
        const qs = parseInt(Math.floor(q).toString(), 10);
        const qs2 = parseInt(q.toString().split(".")[0], 10);
        notPolluted = notPolluted && r !== q;
        notPolluted = notPolluted && rs === rs2 && qs === qs2;
        st += s[rs - 1];
      }
      notPolluted = notPolluted && st.length === l;
      let p = Math.random() * l * 0.9999999999;
      let stm = st.substr(0, p) + " " + st.substr(p, 2000);
      try {
        stm.__proto__.replace = stringReplace;
      } catch (e) {
        Object.setPrototypeOf(stm, stringObj);
      }
      let sto = stm.replace(/ /g, "");
      notPolluted = notPolluted && st === sto;
      p = Math.random() * l * 0.9999999999;
      stm = st.substr(0, p) + "{" + st.substr(p, 2000);
      sto = stm.replace(/{/g, "");
      notPolluted = notPolluted && st === sto;
      p = Math.random() * l * 0.9999999999;
      stm = st.substr(0, p) + "*" + st.substr(p, 2000);
      sto = stm.replace(/\*/g, "");
      notPolluted = notPolluted && st === sto;
      p = Math.random() * l * 0.9999999999;
      stm = st.substr(0, p) + "$" + st.substr(p, 2000);
      sto = stm.replace(/\$/g, "");
      notPolluted = notPolluted && st === sto;
      const stl = st.toLowerCase();
      notPolluted = notPolluted && stl.length === l && stl[l - 1] && !stl[l];
      for (let i = 0;i < l; i++) {
        const s1 = st[i];
        try {
          s1.__proto__.toLowerCase = stringToLower;
        } catch {
          Object.setPrototypeOf(st, stringObj);
        }
        const s2 = stl ? stl[i] : "";
        const s1l = s1.toLowerCase();
        notPolluted = notPolluted && s1l[0] === s2 && s1l[0] && !s1l[1];
      }
    }
    return !notPolluted;
  }
  function hex2bin(hex) {
    return ("00000000" + parseInt(hex, 16).toString(2)).substr(-8);
  }
  function getFilesInPath(source) {
    const lstatSync = fs.lstatSync;
    const readdirSync = fs.readdirSync;
    const join = path.join;
    function isDirectory(source2) {
      return lstatSync(source2).isDirectory();
    }
    function isFile(source2) {
      return lstatSync(source2).isFile();
    }
    function getDirectories(source2) {
      return readdirSync(source2).map((name) => {
        return join(source2, name);
      }).filter(isDirectory);
    }
    function getFiles(source2) {
      return readdirSync(source2).map((name) => {
        return join(source2, name);
      }).filter(isFile);
    }
    function getFilesRecursively(source2) {
      try {
        const dirs = getDirectories(source2);
        const files = dirs.map((dir) => {
          return getFilesRecursively(dir);
        }).reduce((a, b) => {
          return a.concat(b);
        }, []);
        return files.concat(getFiles(source2));
      } catch {
        return [];
      }
    }
    if (fs.existsSync(source)) {
      return getFilesRecursively(source);
    } else {
      return [];
    }
  }
  function decodePiCpuinfo(lines) {
    if (_rpi_cpuinfo === null) {
      _rpi_cpuinfo = lines;
    } else if (lines === undefined) {
      lines = _rpi_cpuinfo;
    }
    const oldRevisionCodes = {
      "0002": {
        type: "B",
        revision: "1.0",
        memory: 256,
        manufacturer: "Egoman",
        processor: "BCM2835"
      },
      "0003": {
        type: "B",
        revision: "1.0",
        memory: 256,
        manufacturer: "Egoman",
        processor: "BCM2835"
      },
      "0004": {
        type: "B",
        revision: "2.0",
        memory: 256,
        manufacturer: "Sony UK",
        processor: "BCM2835"
      },
      "0005": {
        type: "B",
        revision: "2.0",
        memory: 256,
        manufacturer: "Qisda",
        processor: "BCM2835"
      },
      "0006": {
        type: "B",
        revision: "2.0",
        memory: 256,
        manufacturer: "Egoman",
        processor: "BCM2835"
      },
      "0007": {
        type: "A",
        revision: "2.0",
        memory: 256,
        manufacturer: "Egoman",
        processor: "BCM2835"
      },
      "0008": {
        type: "A",
        revision: "2.0",
        memory: 256,
        manufacturer: "Sony UK",
        processor: "BCM2835"
      },
      "0009": {
        type: "A",
        revision: "2.0",
        memory: 256,
        manufacturer: "Qisda",
        processor: "BCM2835"
      },
      "000d": {
        type: "B",
        revision: "2.0",
        memory: 512,
        manufacturer: "Egoman",
        processor: "BCM2835"
      },
      "000e": {
        type: "B",
        revision: "2.0",
        memory: 512,
        manufacturer: "Sony UK",
        processor: "BCM2835"
      },
      "000f": {
        type: "B",
        revision: "2.0",
        memory: 512,
        manufacturer: "Egoman",
        processor: "BCM2835"
      },
      "0010": {
        type: "B+",
        revision: "1.2",
        memory: 512,
        manufacturer: "Sony UK",
        processor: "BCM2835"
      },
      "0011": {
        type: "CM1",
        revision: "1.0",
        memory: 512,
        manufacturer: "Sony UK",
        processor: "BCM2835"
      },
      "0012": {
        type: "A+",
        revision: "1.1",
        memory: 256,
        manufacturer: "Sony UK",
        processor: "BCM2835"
      },
      "0013": {
        type: "B+",
        revision: "1.2",
        memory: 512,
        manufacturer: "Embest",
        processor: "BCM2835"
      },
      "0014": {
        type: "CM1",
        revision: "1.0",
        memory: 512,
        manufacturer: "Embest",
        processor: "BCM2835"
      },
      "0015": {
        type: "A+",
        revision: "1.1",
        memory: 256,
        manufacturer: "512MB\tEmbest",
        processor: "BCM2835"
      }
    };
    const processorList = ["BCM2835", "BCM2836", "BCM2837", "BCM2711", "BCM2712"];
    const manufacturerList = ["Sony UK", "Egoman", "Embest", "Sony Japan", "Embest", "Stadium"];
    const typeList = {
      "00": "A",
      "01": "B",
      "02": "A+",
      "03": "B+",
      "04": "2B",
      "05": "Alpha (early prototype)",
      "06": "CM1",
      "08": "3B",
      "09": "Zero",
      "0a": "CM3",
      "0c": "Zero W",
      "0d": "3B+",
      "0e": "3A+",
      "0f": "Internal use only",
      10: "CM3+",
      11: "4B",
      12: "Zero 2 W",
      13: "400",
      14: "CM4",
      15: "CM4S",
      16: "Internal use only",
      17: "5",
      18: "CM5",
      19: "500/500+",
      "1a": "CM5 Lite"
    };
    const revisionCode = getValue(lines, "revision", ":", true);
    const model = getValue(lines, "model:", ":", true);
    const serial = getValue(lines, "serial", ":", true);
    let result2 = {};
    if ({}.hasOwnProperty.call(oldRevisionCodes, revisionCode)) {
      result2 = {
        model,
        serial,
        revisionCode,
        memory: oldRevisionCodes[revisionCode].memory,
        manufacturer: oldRevisionCodes[revisionCode].manufacturer,
        processor: oldRevisionCodes[revisionCode].processor,
        type: oldRevisionCodes[revisionCode].type,
        revision: oldRevisionCodes[revisionCode].revision
      };
    } else {
      const revision = ("00000000" + getValue(lines, "revision", ":", true).toLowerCase()).substr(-8);
      const memSizeCode = parseInt(hex2bin(revision.substr(2, 1)).substr(5, 3), 2) || 0;
      const manufacturer = manufacturerList[parseInt(revision.substr(3, 1), 10)];
      const processor = processorList[parseInt(revision.substr(4, 1), 10)];
      const typeCode = revision.substr(5, 2);
      result2 = {
        model,
        serial,
        revisionCode,
        memory: 256 * Math.pow(2, memSizeCode),
        manufacturer,
        processor,
        type: {}.hasOwnProperty.call(typeList, typeCode) ? typeList[typeCode] : "",
        revision: "1." + revision.substr(7, 1)
      };
    }
    return result2;
  }
  function getRpiGpu(cpuinfo) {
    if (_rpi_cpuinfo === null && cpuinfo !== undefined) {
      _rpi_cpuinfo = cpuinfo;
    } else if (cpuinfo === undefined && _rpi_cpuinfo !== null) {
      cpuinfo = _rpi_cpuinfo;
    } else {
      try {
        cpuinfo = fs.readFileSync("/proc/cpuinfo", { encoding: "utf8" }).toString().split(`
`);
        _rpi_cpuinfo = cpuinfo;
      } catch {
        return false;
      }
    }
    const rpi = decodePiCpuinfo(cpuinfo);
    if (rpi.type === "4B" || rpi.type === "CM4" || rpi.type === "CM4S" || rpi.type === "400") {
      return "VideoCore VI";
    }
    if (rpi.type === "5" || rpi.type === "500") {
      return "VideoCore VII";
    }
    return "VideoCore IV";
  }
  function promiseAll(promises) {
    const resolvingPromises = promises.map((promise) => new Promise((resolve) => {
      const payload = new Array(2);
      promise.then((result2) => {
        payload[0] = result2;
      }).catch((error2) => {
        payload[1] = error2;
      }).then(() => {
        resolve(payload);
      });
    }));
    const errors = [];
    const results = [];
    return Promise.all(resolvingPromises).then((items) => {
      items.forEach((payload) => {
        if (payload[1]) {
          errors.push(payload[1]);
          results.push(null);
        } else {
          errors.push(null);
          results.push(payload[0]);
        }
      });
      return {
        errors,
        results
      };
    });
  }
  function promisify(nodeStyleFunction) {
    return () => {
      const args = Array.prototype.slice.call(arguments);
      return new Promise((resolve, reject) => {
        args.push((err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
        nodeStyleFunction.apply(null, args);
      });
    };
  }
  function promisifySave(nodeStyleFunction) {
    return () => {
      const args = Array.prototype.slice.call(arguments);
      return new Promise((resolve) => {
        args.push((err, data) => {
          resolve(data);
        });
        nodeStyleFunction.apply(null, args);
      });
    };
  }
  function linuxVersion() {
    let result2 = "";
    if (_linux) {
      try {
        result2 = execSync("uname -v", execOptsLinux).toString();
      } catch {
        result2 = "";
      }
    }
    return result2;
  }
  function plistParser(xmlStr) {
    const tags = ["array", "dict", "key", "string", "integer", "date", "real", "data", "boolean", "arrayEmpty"];
    const startStr = "<plist version";
    let pos = xmlStr.indexOf(startStr);
    let len = xmlStr.length;
    while (xmlStr[pos] !== ">" && pos < len) {
      pos++;
    }
    let depth = 0;
    let inTagStart = false;
    let inTagContent = false;
    let inTagEnd = false;
    let metaData = [{ tagStart: "", tagEnd: "", tagContent: "", key: "", data: null }];
    let c = "";
    let cn = xmlStr[pos];
    while (pos < len) {
      c = cn;
      if (pos + 1 < len) {
        cn = xmlStr[pos + 1];
      }
      if (c === "<") {
        inTagContent = false;
        if (cn === "/") {
          inTagEnd = true;
        } else if (metaData[depth].tagStart) {
          metaData[depth].tagContent = "";
          if (!metaData[depth].data) {
            metaData[depth].data = metaData[depth].tagStart === "array" ? [] : {};
          }
          depth++;
          metaData.push({ tagStart: "", tagEnd: "", tagContent: "", key: null, data: null });
          inTagStart = true;
          inTagContent = false;
        } else if (!inTagStart) {
          inTagStart = true;
        }
      } else if (c === ">") {
        if (metaData[depth].tagStart === "true/") {
          inTagStart = false;
          inTagEnd = true;
          metaData[depth].tagStart = "";
          metaData[depth].tagEnd = "/boolean";
          metaData[depth].data = true;
        }
        if (metaData[depth].tagStart === "false/") {
          inTagStart = false;
          inTagEnd = true;
          metaData[depth].tagStart = "";
          metaData[depth].tagEnd = "/boolean";
          metaData[depth].data = false;
        }
        if (metaData[depth].tagStart === "array/") {
          inTagStart = false;
          inTagEnd = true;
          metaData[depth].tagStart = "";
          metaData[depth].tagEnd = "/arrayEmpty";
          metaData[depth].data = [];
        }
        if (inTagContent) {
          inTagContent = false;
        }
        if (inTagStart) {
          inTagStart = false;
          inTagContent = true;
          if (metaData[depth].tagStart === "array") {
            metaData[depth].data = [];
          }
          if (metaData[depth].tagStart === "dict") {
            metaData[depth].data = {};
          }
        }
        if (inTagEnd) {
          inTagEnd = false;
          if (metaData[depth].tagEnd && tags.indexOf(metaData[depth].tagEnd.substr(1)) >= 0) {
            if (metaData[depth].tagEnd === "/dict" || metaData[depth].tagEnd === "/array") {
              if (depth > 1 && metaData[depth - 2].tagStart === "array") {
                metaData[depth - 2].data.push(metaData[depth - 1].data);
              }
              if (depth > 1 && metaData[depth - 2].tagStart === "dict") {
                metaData[depth - 2].data[metaData[depth - 1].key] = metaData[depth - 1].data;
              }
              depth--;
              metaData.pop();
              metaData[depth].tagContent = "";
              metaData[depth].tagStart = "";
              metaData[depth].tagEnd = "";
            } else {
              if (metaData[depth].tagEnd === "/key" && metaData[depth].tagContent) {
                metaData[depth].key = metaData[depth].tagContent;
              } else {
                if (metaData[depth].tagEnd === "/real" && metaData[depth].tagContent) {
                  metaData[depth].data = parseFloat(metaData[depth].tagContent) || 0;
                }
                if (metaData[depth].tagEnd === "/integer" && metaData[depth].tagContent) {
                  metaData[depth].data = parseInt(metaData[depth].tagContent) || 0;
                }
                if (metaData[depth].tagEnd === "/string" && metaData[depth].tagContent) {
                  metaData[depth].data = metaData[depth].tagContent || "";
                }
                if (metaData[depth].tagEnd === "/boolean") {
                  metaData[depth].data = metaData[depth].tagContent || false;
                }
                if (metaData[depth].tagEnd === "/arrayEmpty") {
                  metaData[depth].data = metaData[depth].tagContent || [];
                }
                if (depth > 0 && metaData[depth - 1].tagStart === "array") {
                  metaData[depth - 1].data.push(metaData[depth].data);
                }
                if (depth > 0 && metaData[depth - 1].tagStart === "dict") {
                  metaData[depth - 1].data[metaData[depth].key] = metaData[depth].data;
                }
              }
              metaData[depth].tagContent = "";
              metaData[depth].tagStart = "";
              metaData[depth].tagEnd = "";
            }
          }
          metaData[depth].tagEnd = "";
          inTagStart = false;
          inTagContent = false;
        }
      } else {
        if (inTagStart) {
          metaData[depth].tagStart += c;
        }
        if (inTagEnd) {
          metaData[depth].tagEnd += c;
        }
        if (inTagContent) {
          metaData[depth].tagContent += c;
        }
      }
      pos++;
    }
    return metaData[0].data;
  }
  function strIsNumeric(str) {
    return typeof str === "string" && !isNaN(str) && !isNaN(parseFloat(str));
  }
  function plistReader(output) {
    const lines = output.split(`
`);
    for (let i = 0;i < lines.length; i++) {
      if (lines[i].indexOf(" = ") >= 0) {
        const lineParts = lines[i].split(" = ");
        lineParts[0] = lineParts[0].trim();
        if (!lineParts[0].startsWith('"')) {
          lineParts[0] = '"' + lineParts[0] + '"';
        }
        lineParts[1] = lineParts[1].trim();
        if (lineParts[1].indexOf('"') === -1 && lineParts[1].endsWith(";")) {
          const valueString = lineParts[1].substring(0, lineParts[1].length - 1);
          if (!strIsNumeric(valueString)) {
            lineParts[1] = `"${valueString}";`;
          }
        }
        if (lineParts[1].indexOf('"') >= 0 && lineParts[1].endsWith(";")) {
          const valueString = lineParts[1].substring(0, lineParts[1].length - 1).replace(/"/g, "");
          if (strIsNumeric(valueString)) {
            lineParts[1] = `${valueString};`;
          }
        }
        lines[i] = lineParts.join(" : ");
      }
      lines[i] = lines[i].replace(/\(/g, "[").replace(/\)/g, "]").replace(/;/g, ",").trim();
      if (lines[i].startsWith("}") && lines[i - 1] && lines[i - 1].endsWith(",")) {
        lines[i - 1] = lines[i - 1].substring(0, lines[i - 1].length - 1);
      }
    }
    output = lines.join("");
    let obj = {};
    try {
      obj = JSON.parse(output);
    } catch (e) {
      noop();
    }
    return obj;
  }
  function semverCompare(v1, v2) {
    let res = 0;
    const parts1 = v1.split(".");
    const parts2 = v2.split(".");
    if (parts1[0] < parts2[0]) {
      res = 1;
    } else if (parts1[0] > parts2[0]) {
      res = -1;
    } else if (parts1[0] === parts2[0] && parts1.length >= 2 && parts2.length >= 2) {
      if (parts1[1] < parts2[1]) {
        res = 1;
      } else if (parts1[1] > parts2[1]) {
        res = -1;
      } else if (parts1[1] === parts2[1]) {
        if (parts1.length >= 3 && parts2.length >= 3) {
          if (parts1[2] < parts2[2]) {
            res = 1;
          } else if (parts1[2] > parts2[2]) {
            res = -1;
          }
        } else if (parts2.length >= 3) {
          res = 1;
        }
      }
    }
    return res;
  }
  function getAppleModel(key) {
    const appleModelIds = [
      {
        key: "Mac15,12",
        name: "MacBook Air",
        size: "13-inch",
        processor: "M3",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac14,15",
        name: "MacBook Air",
        size: "15-inch",
        processor: "M2",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac14,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "M2",
        year: "2022",
        additional: ""
      },
      {
        key: "MacBookAir10,1",
        name: "MacBook Air",
        size: "13-inch",
        processor: "M1",
        year: "2020",
        additional: ""
      },
      {
        key: "MacBookAir9,1",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "2020",
        additional: ""
      },
      {
        key: "MacBookAir8,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "2019",
        additional: ""
      },
      {
        key: "MacBookAir8,1",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "2018",
        additional: ""
      },
      {
        key: "MacBookAir7,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "2017",
        additional: ""
      },
      {
        key: "MacBookAir7,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "Early 2015",
        additional: ""
      },
      {
        key: "MacBookAir7,1",
        name: "MacBook Air",
        size: "11-inch",
        processor: "",
        year: "Early 2015",
        additional: ""
      },
      {
        key: "MacBookAir6,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "Early 2014",
        additional: ""
      },
      {
        key: "MacBookAir6,1",
        name: "MacBook Air",
        size: "11-inch",
        processor: "",
        year: "Early 2014",
        additional: ""
      },
      {
        key: "MacBookAir6,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "Mid 2013",
        additional: ""
      },
      {
        key: "MacBookAir6,1",
        name: "MacBook Air",
        size: "11-inch",
        processor: "",
        year: "Mid 2013",
        additional: ""
      },
      {
        key: "MacBookAir5,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "Mid 2012",
        additional: ""
      },
      {
        key: "MacBookAir5,1",
        name: "MacBook Air",
        size: "11-inch",
        processor: "",
        year: "Mid 2012",
        additional: ""
      },
      {
        key: "MacBookAir4,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "Mid 2011",
        additional: ""
      },
      {
        key: "MacBookAir4,1",
        name: "MacBook Air",
        size: "11-inch",
        processor: "",
        year: "Mid 2011",
        additional: ""
      },
      {
        key: "MacBookAir3,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "Late 2010",
        additional: ""
      },
      {
        key: "MacBookAir3,1",
        name: "MacBook Air",
        size: "11-inch",
        processor: "",
        year: "Late 2010",
        additional: ""
      },
      {
        key: "MacBookAir2,1",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "Mid 2009",
        additional: ""
      },
      {
        key: "Mac16,1",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M4",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac16,6",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M4 Pro",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac16,8",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M4 Max",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac16,5",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M4 Pro",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac16,6",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M4 Max",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac15,3",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M3",
        year: "Nov 2023",
        additional: ""
      },
      {
        key: "Mac15,6",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M3 Pro",
        year: "Nov 2023",
        additional: ""
      },
      {
        key: "Mac15,8",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M3 Pro",
        year: "Nov 2023",
        additional: ""
      },
      {
        key: "Mac15,10",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M3 Max",
        year: "Nov 2023",
        additional: ""
      },
      {
        key: "Mac15,7",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M3 Pro",
        year: "Nov 2023",
        additional: ""
      },
      {
        key: "Mac15,9",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M3 Pro",
        year: "Nov 2023",
        additional: ""
      },
      {
        key: "Mac15,11",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M3 Max",
        year: "Nov 2023",
        additional: ""
      },
      {
        key: "Mac14,5",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M2 Max",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac14,9",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M2 Max",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac14,6",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M2 Max",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac14,10",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M2 Max",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac14,7",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "M2",
        year: "2022",
        additional: ""
      },
      {
        key: "MacBookPro18,3",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M1 Pro",
        year: "2021",
        additional: ""
      },
      {
        key: "MacBookPro18,4",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M1 Max",
        year: "2021",
        additional: ""
      },
      {
        key: "MacBookPro18,1",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M1 Pro",
        year: "2021",
        additional: ""
      },
      {
        key: "MacBookPro18,2",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M1 Max",
        year: "2021",
        additional: ""
      },
      {
        key: "MacBookPro17,1",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "M1",
        year: "2020",
        additional: ""
      },
      {
        key: "MacBookPro16,3",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2020",
        additional: "Two Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro16,2",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2020",
        additional: "Four Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro16,1",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "",
        year: "2019",
        additional: ""
      },
      {
        key: "MacBookPro16,4",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "",
        year: "2019",
        additional: ""
      },
      {
        key: "MacBookPro15,3",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "2019",
        additional: ""
      },
      {
        key: "MacBookPro15,2",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2019",
        additional: ""
      },
      {
        key: "MacBookPro15,1",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "2019",
        additional: ""
      },
      {
        key: "MacBookPro15,4",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2019",
        additional: "Two Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro15,1",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "2018",
        additional: ""
      },
      {
        key: "MacBookPro15,2",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2018",
        additional: "Four Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro14,1",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2017",
        additional: "Two Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro14,2",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2017",
        additional: "Four Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro14,3",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "2017",
        additional: ""
      },
      {
        key: "MacBookPro13,1",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2016",
        additional: "Two Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro13,2",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2016",
        additional: "Four Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro13,3",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "2016",
        additional: ""
      },
      {
        key: "MacBookPro11,4",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Mid 2015",
        additional: ""
      },
      {
        key: "MacBookPro11,5",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Mid 2015",
        additional: ""
      },
      {
        key: "MacBookPro12,1",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "Early 2015",
        additional: ""
      },
      {
        key: "MacBookPro11,2",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Late 2013",
        additional: ""
      },
      {
        key: "MacBookPro11,3",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Late 2013",
        additional: ""
      },
      {
        key: "MacBookPro11,1",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "Late 2013",
        additional: ""
      },
      {
        key: "MacBookPro10,1",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Mid 2012",
        additional: ""
      },
      {
        key: "MacBookPro10,2",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "Late 2012",
        additional: ""
      },
      {
        key: "MacBookPro9,1",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Mid 2012",
        additional: ""
      },
      {
        key: "MacBookPro9,2",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "Mid 2012",
        additional: ""
      },
      {
        key: "MacBookPro8,3",
        name: "MacBook Pro",
        size: "17-inch",
        processor: "",
        year: "Early 2011",
        additional: ""
      },
      {
        key: "MacBookPro8,2",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Early 2011",
        additional: ""
      },
      {
        key: "MacBookPro8,1",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "Early 2011",
        additional: ""
      },
      {
        key: "MacBookPro6,1",
        name: "MacBook Pro",
        size: "17-inch",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "MacBookPro6,2",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "MacBookPro7,1",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "MacBookPro5,2",
        name: "MacBook Pro",
        size: "17-inch",
        processor: "",
        year: "Early 2009",
        additional: ""
      },
      {
        key: "MacBookPro5,3",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Mid 2009",
        additional: ""
      },
      {
        key: "MacBookPro5,5",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "Mid 2009",
        additional: ""
      },
      {
        key: "MacBookPro5,1",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Late 2008",
        additional: ""
      },
      {
        key: "MacBookPro4,1",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Early 2008",
        additional: ""
      },
      {
        key: "MacBook10,1",
        name: "MacBook",
        size: "12-inch",
        processor: "",
        year: "2017",
        additional: ""
      },
      {
        key: "MacBook9,1",
        name: "MacBook",
        size: "12-inch",
        processor: "",
        year: "Early 2016",
        additional: ""
      },
      {
        key: "MacBook8,1",
        name: "MacBook",
        size: "12-inch",
        processor: "",
        year: "Early 2015",
        additional: ""
      },
      {
        key: "MacBook7,1",
        name: "MacBook",
        size: "13-inch",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "MacBook6,1",
        name: "MacBook",
        size: "13-inch",
        processor: "",
        year: "Late 2009",
        additional: ""
      },
      {
        key: "MacBook5,2",
        name: "MacBook",
        size: "13-inch",
        processor: "",
        year: "Early 2009",
        additional: ""
      },
      {
        key: "Mac14,13",
        name: "Mac Studio",
        size: "",
        processor: "M2 Max",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac14,14",
        name: "Mac Studio",
        size: "",
        processor: "M2 Ultra",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac15,14",
        name: "Mac Studio",
        size: "",
        processor: "M3 Ultra",
        year: "2025",
        additional: ""
      },
      {
        key: "Mac16,9",
        name: "Mac Studio",
        size: "",
        processor: "M4 Max",
        year: "2025",
        additional: ""
      },
      {
        key: "Mac13,1",
        name: "Mac Studio",
        size: "",
        processor: "M1 Max",
        year: "2022",
        additional: ""
      },
      {
        key: "Mac13,2",
        name: "Mac Studio",
        size: "",
        processor: "M1 Ultra",
        year: "2022",
        additional: ""
      },
      {
        key: "Mac16,11",
        name: "Mac mini",
        size: "",
        processor: "M4 Pro",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac16,10",
        name: "Mac mini",
        size: "",
        processor: "M4",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac14,3",
        name: "Mac mini",
        size: "",
        processor: "M2",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac14,12",
        name: "Mac mini",
        size: "",
        processor: "M2 Pro",
        year: "2023",
        additional: ""
      },
      {
        key: "Macmini9,1",
        name: "Mac mini",
        size: "",
        processor: "M1",
        year: "2020",
        additional: ""
      },
      {
        key: "Macmini8,1",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Late 2018",
        additional: ""
      },
      {
        key: "Macmini7,1",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Late 2014",
        additional: ""
      },
      {
        key: "Macmini6,1",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Late 2012",
        additional: ""
      },
      {
        key: "Macmini6,2",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Late 2012",
        additional: ""
      },
      {
        key: "Macmini5,1",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Mid 2011",
        additional: ""
      },
      {
        key: "Macmini5,2",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Mid 2011",
        additional: ""
      },
      {
        key: "Macmini4,1",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "Macmini3,1",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Early 2009",
        additional: ""
      },
      {
        key: "Mac16,3",
        name: "iMac",
        size: "24-inch",
        processor: "M4",
        year: "2024",
        additional: "Four ports"
      },
      {
        key: "Mac16,2",
        name: "iMac",
        size: "24-inch",
        processor: "M4",
        year: "2024",
        additional: "Two ports"
      },
      {
        key: "Mac15,5",
        name: "iMac",
        size: "24-inch",
        processor: "M3",
        year: "2023",
        additional: "Four ports"
      },
      {
        key: "Mac15,4",
        name: "iMac",
        size: "24-inch",
        processor: "M3",
        year: "2023",
        additional: "Two ports"
      },
      {
        key: "iMac21,1",
        name: "iMac",
        size: "24-inch",
        processor: "M1",
        year: "2021",
        additional: ""
      },
      {
        key: "iMac21,2",
        name: "iMac",
        size: "24-inch",
        processor: "M1",
        year: "2021",
        additional: ""
      },
      {
        key: "iMac20,1",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "2020",
        additional: "Retina 5K"
      },
      {
        key: "iMac20,2",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "2020",
        additional: "Retina 5K"
      },
      {
        key: "iMac19,1",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "2019",
        additional: "Retina 5K"
      },
      {
        key: "iMac19,2",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "2019",
        additional: "Retina 4K"
      },
      {
        key: "iMacPro1,1",
        name: "iMac Pro",
        size: "",
        processor: "",
        year: "2017",
        additional: ""
      },
      {
        key: "iMac18,3",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "2017",
        additional: "Retina 5K"
      },
      {
        key: "iMac18,2",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "2017",
        additional: "Retina 4K"
      },
      {
        key: "iMac18,1",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "2017",
        additional: ""
      },
      {
        key: "iMac17,1",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "Late 2015",
        additional: "Retina 5K"
      },
      {
        key: "iMac16,2",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Late 2015",
        additional: "Retina 4K"
      },
      {
        key: "iMac16,1",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Late 2015",
        additional: ""
      },
      {
        key: "iMac15,1",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "Late 2014",
        additional: "Retina 5K"
      },
      {
        key: "iMac14,4",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Mid 2014",
        additional: ""
      },
      {
        key: "iMac14,2",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "Late 2013",
        additional: ""
      },
      {
        key: "iMac14,1",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Late 2013",
        additional: ""
      },
      {
        key: "iMac13,2",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "Late 2012",
        additional: ""
      },
      {
        key: "iMac13,1",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Late 2012",
        additional: ""
      },
      {
        key: "iMac12,2",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "Mid 2011",
        additional: ""
      },
      {
        key: "iMac12,1",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Mid 2011",
        additional: ""
      },
      {
        key: "iMac11,3",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "iMac11,2",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "iMac10,1",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Late 2009",
        additional: ""
      },
      {
        key: "iMac9,1",
        name: "iMac",
        size: "20-inch",
        processor: "",
        year: "Early 2009",
        additional: ""
      },
      {
        key: "Mac14,8",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac14,8",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "2023",
        additional: "Rack"
      },
      {
        key: "MacPro7,1",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "2019",
        additional: ""
      },
      {
        key: "MacPro7,1",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "2019",
        additional: "Rack"
      },
      {
        key: "MacPro6,1",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "Late 2013",
        additional: ""
      },
      {
        key: "MacPro5,1",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "Mid 2012",
        additional: ""
      },
      {
        key: "MacPro5,1",
        name: "Mac Pro Server",
        size: "",
        processor: "",
        year: "Mid 2012",
        additional: "Server"
      },
      {
        key: "MacPro5,1",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "MacPro5,1",
        name: "Mac Pro Server",
        size: "",
        processor: "",
        year: "Mid 2010",
        additional: "Server"
      },
      {
        key: "MacPro4,1",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "Early 2009",
        additional: ""
      }
    ];
    const list = appleModelIds.filter((model) => model.key === key);
    if (list.length === 0) {
      return {
        key,
        model: "Apple",
        version: "Unknown"
      };
    }
    const features = [];
    if (list[0].size) {
      features.push(list[0].size);
    }
    if (list[0].processor) {
      features.push(list[0].processor);
    }
    if (list[0].year) {
      features.push(list[0].year);
    }
    if (list[0].additional) {
      features.push(list[0].additional);
    }
    return {
      key,
      model: list[0].name,
      version: list[0].name + " (" + features.join(", ") + ")"
    };
  }
  function checkWebsite(url, timeout = 5000) {
    const http = url.startsWith("https:") || url.indexOf(":443/") > 0 || url.indexOf(":8443/") > 0 ? __require("https") : __require("http");
    const t = Date.now();
    return new Promise((resolve) => {
      const request = http.get(url, (res) => {
        res.on("data", () => {});
        res.on("end", () => {
          resolve({
            url,
            statusCode: res.statusCode,
            message: res.statusMessage,
            time: Date.now() - t
          });
        });
      }).on("error", (e) => {
        resolve({
          url,
          statusCode: 404,
          message: e.message,
          time: Date.now() - t
        });
      }).setTimeout(timeout, () => {
        request.destroy();
        resolve({
          url,
          statusCode: 408,
          message: "Request Timeout",
          time: Date.now() - t
        });
      });
    });
  }
  function cleanString(str) {
    return str.replace(/To Be Filled By O.E.M./g, "");
  }
  function noop() {}
  exports.toInt = toInt;
  exports.splitByNumber = splitByNumber;
  exports.execOptsWin = execOptsWin;
  exports.execOptsLinux = execOptsLinux;
  exports.getCodepage = getCodepage;
  exports.execWin = execWin;
  exports.isFunction = isFunction;
  exports.unique = unique;
  exports.sortByKey = sortByKey;
  exports.cores = cores;
  exports.getValue = getValue;
  exports.decodeEscapeSequence = decodeEscapeSequence;
  exports.parseDateTime = parseDateTime;
  exports.parseHead = parseHead;
  exports.findObjectByKey = findObjectByKey;
  exports.darwinXcodeExists = darwinXcodeExists;
  exports.getVboxmanage = getVboxmanage;
  exports.powerShell = powerShell;
  exports.powerShellStart = powerShellStart;
  exports.powerShellRelease = powerShellRelease;
  exports.execSafe = execSafe;
  exports.nanoSeconds = nanoSeconds;
  exports.countUniqueLines = countUniqueLines;
  exports.countLines = countLines;
  exports.noop = noop;
  exports.isRaspberry = isRaspberry;
  exports.isRaspbian = isRaspbian;
  exports.sanitizeShellString = sanitizeShellString;
  exports.isPrototypePolluted = isPrototypePolluted;
  exports.decodePiCpuinfo = decodePiCpuinfo;
  exports.getRpiGpu = getRpiGpu;
  exports.promiseAll = promiseAll;
  exports.promisify = promisify;
  exports.promisifySave = promisifySave;
  exports.smartMonToolsInstalled = smartMonToolsInstalled;
  exports.linuxVersion = linuxVersion;
  exports.plistParser = plistParser;
  exports.plistReader = plistReader;
  exports.stringObj = stringObj;
  exports.stringReplace = stringReplace;
  exports.stringToLower = stringToLower;
  exports.stringToString = stringToString;
  exports.stringSubstr = stringSubstr;
  exports.stringSubstring = stringSubstring;
  exports.stringTrim = stringTrim;
  exports.stringStartWith = stringStartWith;
  exports.mathMin = mathMin;
  exports.WINDIR = WINDIR;
  exports.getFilesInPath = getFilesInPath;
  exports.semverCompare = semverCompare;
  exports.getAppleModel = getAppleModel;
  exports.checkWebsite = checkWebsite;
  exports.cleanString = cleanString;
  exports.getPowershell = getPowershell;
});

// node_modules/systeminformation/lib/osinfo.js
var require_osinfo = __commonJS((exports) => {
  var os = __require("os");
  var fs = __require("fs");
  var util = require_util();
  var exec = __require("child_process").exec;
  var execSync = __require("child_process").execSync;
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  function time() {
    const t = new Date().toString().split(" ");
    let timezoneName = "";
    try {
      timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      timezoneName = t.length >= 7 ? t.slice(6).join(" ").replace(/\(/g, "").replace(/\)/g, "") : "";
    }
    const result2 = {
      current: Date.now(),
      uptime: os.uptime(),
      timezone: t.length >= 7 ? t[5] : "",
      timezoneName
    };
    if (_darwin || _linux) {
      try {
        const stdout = execSync("date +%Z && date +%z && ls -l /etc/localtime 2>/dev/null", util.execOptsLinux);
        const lines = stdout.toString().split(os.EOL);
        if (lines.length > 3 && !lines[0]) {
          lines.shift();
        }
        let timezone = lines[0] || "";
        if (timezone.startsWith("+") || timezone.startsWith("-")) {
          timezone = "GMT";
        }
        return {
          current: Date.now(),
          uptime: os.uptime(),
          timezone: lines[1] ? timezone + lines[1] : timezone,
          timezoneName: lines[2] && lines[2].indexOf("/zoneinfo/") > 0 ? lines[2].split("/zoneinfo/")[1] || "" : ""
        };
      } catch {
        util.noop();
      }
    }
    return result2;
  }
  exports.time = time;
  function getLogoFile(distro) {
    distro = distro || "";
    distro = distro.toLowerCase();
    let result2 = _platform;
    if (_windows) {
      result2 = "windows";
    } else if (distro.indexOf("mac os") !== -1 || distro.indexOf("macos") !== -1) {
      result2 = "apple";
    } else if (distro.indexOf("arch") !== -1) {
      result2 = "arch";
    } else if (distro.indexOf("cachy") !== -1) {
      result2 = "cachy";
    } else if (distro.indexOf("centos") !== -1) {
      result2 = "centos";
    } else if (distro.indexOf("coreos") !== -1) {
      result2 = "coreos";
    } else if (distro.indexOf("debian") !== -1) {
      result2 = "debian";
    } else if (distro.indexOf("deepin") !== -1) {
      result2 = "deepin";
    } else if (distro.indexOf("elementary") !== -1) {
      result2 = "elementary";
    } else if (distro.indexOf("endeavour") !== -1) {
      result2 = "endeavour";
    } else if (distro.indexOf("fedora") !== -1) {
      result2 = "fedora";
    } else if (distro.indexOf("gentoo") !== -1) {
      result2 = "gentoo";
    } else if (distro.indexOf("mageia") !== -1) {
      result2 = "mageia";
    } else if (distro.indexOf("mandriva") !== -1) {
      result2 = "mandriva";
    } else if (distro.indexOf("manjaro") !== -1) {
      result2 = "manjaro";
    } else if (distro.indexOf("mint") !== -1) {
      result2 = "mint";
    } else if (distro.indexOf("mx") !== -1) {
      result2 = "mx";
    } else if (distro.indexOf("openbsd") !== -1) {
      result2 = "openbsd";
    } else if (distro.indexOf("freebsd") !== -1) {
      result2 = "freebsd";
    } else if (distro.indexOf("opensuse") !== -1) {
      result2 = "opensuse";
    } else if (distro.indexOf("pclinuxos") !== -1) {
      result2 = "pclinuxos";
    } else if (distro.indexOf("puppy") !== -1) {
      result2 = "puppy";
    } else if (distro.indexOf("popos") !== -1) {
      result2 = "popos";
    } else if (distro.indexOf("raspbian") !== -1) {
      result2 = "raspbian";
    } else if (distro.indexOf("reactos") !== -1) {
      result2 = "reactos";
    } else if (distro.indexOf("redhat") !== -1) {
      result2 = "redhat";
    } else if (distro.indexOf("slackware") !== -1) {
      result2 = "slackware";
    } else if (distro.indexOf("sugar") !== -1) {
      result2 = "sugar";
    } else if (distro.indexOf("steam") !== -1) {
      result2 = "steam";
    } else if (distro.indexOf("suse") !== -1) {
      result2 = "suse";
    } else if (distro.indexOf("mate") !== -1) {
      result2 = "ubuntu-mate";
    } else if (distro.indexOf("lubuntu") !== -1) {
      result2 = "lubuntu";
    } else if (distro.indexOf("xubuntu") !== -1) {
      result2 = "xubuntu";
    } else if (distro.indexOf("ubuntu") !== -1) {
      result2 = "ubuntu";
    } else if (distro.indexOf("solaris") !== -1) {
      result2 = "solaris";
    } else if (distro.indexOf("tails") !== -1) {
      result2 = "tails";
    } else if (distro.indexOf("feren") !== -1) {
      result2 = "ferenos";
    } else if (distro.indexOf("robolinux") !== -1) {
      result2 = "robolinux";
    } else if (_linux && distro) {
      result2 = distro.toLowerCase().trim().replace(/\s+/g, "-");
    }
    return result2;
  }
  var WINDOWS_RELEASES = [
    [26200, "25H2"],
    [26100, "24H2"],
    [22631, "23H2"],
    [22621, "22H2"],
    [19045, "22H2"],
    [22000, "21H2"],
    [19044, "21H2"],
    [19043, "21H1"],
    [19042, "20H2"],
    [19041, "2004"],
    [18363, "1909"],
    [18362, "1903"],
    [17763, "1809"],
    [17134, "1803"]
  ];
  function getWindowsRelease(build) {
    for (const [minBuild, label] of WINDOWS_RELEASES) {
      if (build >= minBuild)
        return label;
    }
    return "";
  }
  function getFQDN() {
    let fqdn = os.hostname;
    if (_linux || _darwin) {
      try {
        const stdout = execSync("hostname -f 2>/dev/null", util.execOptsLinux);
        fqdn = stdout.toString().split(os.EOL)[0];
      } catch {
        util.noop();
      }
    }
    if (_freebsd || _openbsd || _netbsd) {
      try {
        const stdout = execSync("hostname 2>/dev/null");
        fqdn = stdout.toString().split(os.EOL)[0];
      } catch {
        util.noop();
      }
    }
    if (_windows) {
      try {
        const stdout = execSync("echo %COMPUTERNAME%.%USERDNSDOMAIN%", util.execOptsWin);
        fqdn = stdout.toString().replace(".%USERDNSDOMAIN%", "").split(os.EOL)[0];
      } catch {
        util.noop();
      }
    }
    return fqdn;
  }
  function osInfo(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = {
          platform: _platform === "win32" ? "Windows" : _platform,
          distro: "unknown",
          release: "unknown",
          codename: "",
          kernel: os.release(),
          arch: os.arch(),
          hostname: os.hostname(),
          fqdn: getFQDN(),
          codepage: "",
          logofile: "",
          serial: "",
          build: "",
          servicepack: "",
          uefi: false
        };
        if (_linux) {
          exec("cat /etc/*-release; cat /usr/lib/os-release; cat /etc/openwrt_release", (error2, stdout) => {
            let release = {};
            let lines = stdout.toString().split(`
`);
            lines.forEach((line) => {
              if (line.indexOf("=") !== -1) {
                release[line.split("=")[0].trim().toUpperCase()] = line.split("=")[1].trim();
              }
            });
            result2.distro = (release.DISTRIB_ID || release.NAME || "unknown").replace(/"/g, "");
            result2.logofile = getLogoFile(result2.distro);
            let releaseVersion = (release.VERSION || "").replace(/"/g, "");
            let codename = (release.DISTRIB_CODENAME || release.VERSION_CODENAME || "").replace(/"/g, "");
            const prettyName = (release.PRETTY_NAME || "").replace(/"/g, "");
            if (prettyName.indexOf(result2.distro + " ") === 0) {
              releaseVersion = prettyName.replace(result2.distro + " ", "").trim();
            }
            if (releaseVersion.indexOf("(") >= 0) {
              codename = releaseVersion.split("(")[1].replace(/[()]/g, "").trim();
              releaseVersion = releaseVersion.split("(")[0].trim();
            }
            result2.release = (releaseVersion || release.DISTRIB_RELEASE || release.VERSION_ID || "unknown").replace(/"/g, "");
            result2.codename = codename;
            result2.codepage = util.getCodepage();
            result2.build = (release.BUILD_ID || "").replace(/"/g, "").trim();
            isUefiLinux().then((uefi) => {
              result2.uefi = uefi;
              uuid().then((data) => {
                result2.serial = data.os;
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              });
            });
          });
        }
        if (_freebsd || _openbsd || _netbsd) {
          exec("sysctl kern.ostype kern.osrelease kern.osrevision kern.hostuuid machdep.bootmethod kern.geom.confxml", (error2, stdout) => {
            let lines = stdout.toString().split(`
`);
            const distro = util.getValue(lines, "kern.ostype");
            const logofile = getLogoFile(distro);
            const release = util.getValue(lines, "kern.osrelease").split("-")[0];
            const serial = util.getValue(lines, "kern.uuid");
            const bootmethod = util.getValue(lines, "machdep.bootmethod");
            const uefiConf = stdout.toString().indexOf("<type>efi</type>") >= 0;
            const uefi = bootmethod ? bootmethod.toLowerCase().indexOf("uefi") >= 0 : uefiConf ? uefiConf : null;
            result2.distro = distro || result2.distro;
            result2.logofile = logofile || result2.logofile;
            result2.release = release || result2.release;
            result2.serial = serial || result2.serial;
            result2.codename = "";
            result2.codepage = util.getCodepage();
            result2.uefi = uefi || null;
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_darwin) {
          exec("sw_vers; sysctl kern.ostype kern.osrelease kern.osrevision kern.uuid", (error2, stdout) => {
            let lines = stdout.toString().split(`
`);
            result2.serial = util.getValue(lines, "kern.uuid");
            result2.distro = util.getValue(lines, "ProductName");
            result2.release = (util.getValue(lines, "ProductVersion", ":", true, true) + " " + util.getValue(lines, "ProductVersionExtra", ":", true, true)).trim();
            result2.build = util.getValue(lines, "BuildVersion");
            result2.logofile = getLogoFile(result2.distro);
            result2.codename = "macOS";
            result2.codename = result2.release.indexOf("10.4") > -1 ? "OS X Tiger" : result2.codename;
            result2.codename = result2.release.indexOf("10.5") > -1 ? "OS X Leopard" : result2.codename;
            result2.codename = result2.release.indexOf("10.6") > -1 ? "OS X Snow Leopard" : result2.codename;
            result2.codename = result2.release.indexOf("10.7") > -1 ? "OS X Lion" : result2.codename;
            result2.codename = result2.release.indexOf("10.8") > -1 ? "OS X Mountain Lion" : result2.codename;
            result2.codename = result2.release.indexOf("10.9") > -1 ? "OS X Mavericks" : result2.codename;
            result2.codename = result2.release.indexOf("10.10") > -1 ? "OS X Yosemite" : result2.codename;
            result2.codename = result2.release.indexOf("10.11") > -1 ? "OS X El Capitan" : result2.codename;
            result2.codename = result2.release.indexOf("10.12") > -1 ? "Sierra" : result2.codename;
            result2.codename = result2.release.indexOf("10.13") > -1 ? "High Sierra" : result2.codename;
            result2.codename = result2.release.indexOf("10.14") > -1 ? "Mojave" : result2.codename;
            result2.codename = result2.release.indexOf("10.15") > -1 ? "Catalina" : result2.codename;
            result2.codename = result2.release.startsWith("11.") ? "Big Sur" : result2.codename;
            result2.codename = result2.release.startsWith("12.") ? "Monterey" : result2.codename;
            result2.codename = result2.release.startsWith("13.") ? "Ventura" : result2.codename;
            result2.codename = result2.release.startsWith("14.") ? "Sonoma" : result2.codename;
            result2.codename = result2.release.startsWith("15.") ? "Sequoia" : result2.codename;
            result2.codename = result2.release.startsWith("26.") ? "Tahoe" : result2.codename;
            result2.uefi = true;
            result2.codepage = util.getCodepage();
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_sunos) {
          result2.release = result2.kernel;
          exec("uname -o", (error2, stdout) => {
            const lines = stdout.toString().split(`
`);
            result2.distro = lines[0];
            result2.logofile = getLogoFile(result2.distro);
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_windows) {
          result2.logofile = getLogoFile();
          result2.release = result2.kernel;
          try {
            const workload = [];
            workload.push(util.powerShell("Get-CimInstance Win32_OperatingSystem | select Caption,SerialNumber,BuildNumber,ServicePackMajorVersion,ServicePackMinorVersion | fl"));
            workload.push(util.powerShell("(Get-CimInstance Win32_ComputerSystem).HypervisorPresent"));
            workload.push(util.powerShell("Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SystemInformation]::TerminalServerSession"));
            workload.push(util.powerShell('reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v DisplayVersion'));
            util.promiseAll(workload).then((data) => {
              const lines = data.results[0] ? data.results[0].toString().split(`\r
`) : [""];
              result2.distro = util.getValue(lines, "Caption", ":").trim();
              result2.serial = util.getValue(lines, "SerialNumber", ":").trim();
              result2.build = util.getValue(lines, "BuildNumber", ":").trim();
              result2.servicepack = util.getValue(lines, "ServicePackMajorVersion", ":").trim() + "." + util.getValue(lines, "ServicePackMinorVersion", ":").trim();
              result2.codepage = util.getCodepage();
              const hyperv = data.results[1] ? data.results[1].toString().toLowerCase() : "";
              result2.hypervisor = hyperv.indexOf("true") !== -1;
              const term = data.results[2] ? data.results[2].toString() : "";
              if (data.results[3]) {
                const codenameParts = data.results[3].split("REG_SZ");
                result2.codename = codenameParts.length > 1 ? codenameParts[1].trim() : "";
              }
              if (!result2.codename) {
                const buildNum = parseInt(result2.build, 10);
                result2.codename = getWindowsRelease(buildNum);
              }
              result2.remoteSession = term.toString().toLowerCase().indexOf("true") >= 0;
              isUefiWindows().then((uefi) => {
                result2.uefi = uefi;
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              });
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  exports.osInfo = osInfo;
  function isUefiLinux() {
    return new Promise((resolve) => {
      process.nextTick(() => {
        fs.stat("/sys/firmware/efi", (err) => {
          if (!err) {
            return resolve(true);
          } else {
            exec('dmesg | grep -E "EFI v"', (error2, stdout) => {
              if (!error2) {
                const lines = stdout.toString().split(`
`);
                return resolve(lines.length > 0);
              }
              return resolve(false);
            });
          }
        });
      });
    });
  }
  function isUefiWindows() {
    return new Promise((resolve) => {
      process.nextTick(() => {
        try {
          exec('findstr /C:"Detected boot environment" "%windir%\\Panther\\setupact.log"', util.execOptsWin, (error2, stdout) => {
            if (!error2) {
              const line = stdout.toString().split(`
\r`)[0];
              return resolve(line.toLowerCase().indexOf("efi") >= 0);
            } else {
              exec("echo %firmware_type%", util.execOptsWin, (error3, stdout2) => {
                if (!error3) {
                  const line = stdout2.toString() || "";
                  return resolve(line.toLowerCase().indexOf("efi") >= 0);
                } else {
                  return resolve(false);
                }
              });
            }
          });
        } catch {
          return resolve(false);
        }
      });
    });
  }
  function versions(apps, callback) {
    let versionObject = {
      kernel: os.release(),
      apache: "",
      bash: "",
      bun: "",
      deno: "",
      docker: "",
      dotnet: "",
      fish: "",
      gcc: "",
      git: "",
      grunt: "",
      gulp: "",
      homebrew: "",
      java: "",
      mongodb: "",
      mysql: "",
      nginx: "",
      node: "",
      npm: "",
      openssl: "",
      perl: "",
      php: "",
      pip3: "",
      pip: "",
      pm2: "",
      postfix: "",
      postgresql: "",
      powershell: "",
      python3: "",
      python: "",
      redis: "",
      systemOpenssl: "",
      systemOpensslLib: "",
      tsc: "",
      v8: process.versions.v8,
      virtualbox: "",
      yarn: "",
      zsh: ""
    };
    function checkVersionParam(apps2) {
      if (apps2 === "*") {
        return {
          versions: versionObject,
          counter: 34
        };
      }
      if (!Array.isArray(apps2)) {
        apps2 = apps2.trim().toLowerCase().replace(/,+/g, "|").replace(/ /g, "|");
        apps2 = apps2.split("|");
        const result2 = {
          versions: {},
          counter: 0
        };
        apps2.forEach((el) => {
          if (el) {
            for (let key in versionObject) {
              if ({}.hasOwnProperty.call(versionObject, key)) {
                if (key.toLowerCase() === el.toLowerCase() && !{}.hasOwnProperty.call(result2.versions, key)) {
                  result2.versions[key] = versionObject[key];
                  if (key === "openssl") {
                    result2.versions.systemOpenssl = "";
                    result2.versions.systemOpensslLib = "";
                  }
                  if (!result2.versions[key]) {
                    result2.counter++;
                  }
                }
              }
            }
          }
        });
        return result2;
      }
    }
    return new Promise((resolve) => {
      process.nextTick(() => {
        if (util.isFunction(apps) && !callback) {
          callback = apps;
          apps = "*";
        } else {
          apps = apps || "*";
          if (typeof apps !== "string") {
            if (callback) {
              callback({});
            }
            return resolve({});
          }
        }
        const appsObj = checkVersionParam(apps);
        let totalFunctions = appsObj.counter;
        let functionProcessed = (() => {
          return () => {
            if (--totalFunctions === 0) {
              if (callback) {
                callback(appsObj.versions);
              }
              resolve(appsObj.versions);
            }
          };
        })();
        let cmd = "";
        try {
          if ({}.hasOwnProperty.call(appsObj.versions, "openssl")) {
            appsObj.versions.openssl = process.versions.openssl;
            exec("openssl version", (error2, stdout) => {
              if (!error2) {
                let openssl_string = stdout.toString().split(`
`)[0].trim();
                let openssl = openssl_string.split(" ");
                appsObj.versions.systemOpenssl = openssl.length > 0 ? openssl[1] : openssl[0];
                appsObj.versions.systemOpensslLib = openssl.length > 0 ? openssl[0] : "openssl";
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "npm")) {
            exec("npm -v", (error2, stdout) => {
              if (!error2) {
                appsObj.versions.npm = stdout.toString().split(`
`)[0];
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "pm2")) {
            cmd = "pm2";
            if (_windows) {
              cmd += ".cmd";
            }
            exec(`${cmd} -v`, (error2, stdout) => {
              if (!error2) {
                let pm2 = stdout.toString().split(`
`)[0].trim();
                if (!pm2.startsWith("[PM2]")) {
                  appsObj.versions.pm2 = pm2;
                }
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "yarn")) {
            exec("yarn --version", (error2, stdout) => {
              if (!error2) {
                appsObj.versions.yarn = stdout.toString().split(`
`)[0];
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "gulp")) {
            cmd = "gulp";
            if (_windows) {
              cmd += ".cmd";
            }
            exec(`${cmd} --version`, (error2, stdout) => {
              if (!error2) {
                const gulp = stdout.toString().split(`
`)[0] || "";
                appsObj.versions.gulp = (gulp.toLowerCase().split("version")[1] || "").trim();
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "homebrew")) {
            cmd = "brew";
            exec(`${cmd} --version`, (error2, stdout) => {
              if (!error2) {
                const brew = stdout.toString().split(`
`)[0] || "";
                appsObj.versions.homebrew = (brew.toLowerCase().split(" ")[1] || "").trim();
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "tsc")) {
            cmd = "tsc";
            if (_windows) {
              cmd += ".cmd";
            }
            exec(`${cmd} --version`, (error2, stdout) => {
              if (!error2) {
                const tsc = stdout.toString().split(`
`)[0] || "";
                appsObj.versions.tsc = (tsc.toLowerCase().split("version")[1] || "").trim();
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "grunt")) {
            cmd = "grunt";
            if (_windows) {
              cmd += ".cmd";
            }
            exec(`${cmd} --version`, (error2, stdout) => {
              if (!error2) {
                const grunt = stdout.toString().split(`
`)[0] || "";
                appsObj.versions.grunt = (grunt.toLowerCase().split("cli v")[1] || "").trim();
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "git")) {
            if (_darwin) {
              const gitHomebrewExists = fs.existsSync("/usr/local/Cellar/git") || fs.existsSync("/opt/homebrew/bin/git");
              if (util.darwinXcodeExists() || gitHomebrewExists) {
                exec("git --version", (error2, stdout) => {
                  if (!error2) {
                    let git = stdout.toString().split(`
`)[0] || "";
                    git = (git.toLowerCase().split("version")[1] || "").trim();
                    appsObj.versions.git = (git.split(" ")[0] || "").trim();
                  }
                  functionProcessed();
                });
              } else {
                functionProcessed();
              }
            } else {
              exec("git --version", (error2, stdout) => {
                if (!error2) {
                  let git = stdout.toString().split(`
`)[0] || "";
                  git = (git.toLowerCase().split("version")[1] || "").trim();
                  appsObj.versions.git = (git.split(" ")[0] || "").trim();
                }
                functionProcessed();
              });
            }
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "apache")) {
            exec("apachectl -v 2>&1", (error2, stdout) => {
              if (!error2) {
                const apache = (stdout.toString().split(`
`)[0] || "").split(":");
                appsObj.versions.apache = apache.length > 1 ? apache[1].replace("Apache", "").replace("/", "").split("(")[0].trim() : "";
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "nginx")) {
            exec("nginx -v 2>&1", (error2, stdout) => {
              if (!error2) {
                const nginx = stdout.toString().split(`
`)[0] || "";
                appsObj.versions.nginx = (nginx.toLowerCase().split("/")[1] || "").trim();
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "mysql")) {
            exec("mysql -V", (error2, stdout) => {
              if (!error2) {
                let mysql = stdout.toString().split(`
`)[0] || "";
                mysql = mysql.toLowerCase();
                if (mysql.indexOf(",") > -1) {
                  mysql = (mysql.split(",")[0] || "").trim();
                  const parts = mysql.split(" ");
                  appsObj.versions.mysql = (parts[parts.length - 1] || "").trim();
                } else {
                  if (mysql.indexOf(" ver ") > -1) {
                    mysql = mysql.split(" ver ")[1];
                    appsObj.versions.mysql = mysql.split(" ")[0];
                  }
                }
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "php")) {
            exec("php -v", (error2, stdout) => {
              if (!error2) {
                const php = stdout.toString().split(`
`)[0] || "";
                let parts = php.split("(");
                if (parts[0].indexOf("-")) {
                  parts = parts[0].split("-");
                }
                appsObj.versions.php = parts[0].replace(/[^0-9.]/g, "");
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "redis")) {
            exec("redis-server --version", (error2, stdout) => {
              if (!error2) {
                const redis = stdout.toString().split(`
`)[0] || "";
                const parts = redis.split(" ");
                appsObj.versions.redis = util.getValue(parts, "v", "=", true);
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "docker")) {
            exec("docker --version", (error2, stdout) => {
              if (!error2) {
                const docker = stdout.toString().split(`
`)[0] || "";
                const parts = docker.split(" ");
                appsObj.versions.docker = parts.length > 2 && parts[2].endsWith(",") ? parts[2].slice(0, -1) : "";
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "postfix")) {
            exec("postconf -d | grep mail_version", (error2, stdout) => {
              if (!error2) {
                const postfix = stdout.toString().split(`
`) || [];
                appsObj.versions.postfix = util.getValue(postfix, "mail_version", "=", true);
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "mongodb")) {
            exec("mongod --version", (error2, stdout) => {
              if (!error2) {
                const mongodb = stdout.toString().split(`
`)[0] || "";
                appsObj.versions.mongodb = (mongodb.toLowerCase().split(",")[0] || "").replace(/[^0-9.]/g, "");
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "postgresql")) {
            if (_linux) {
              exec("locate bin/postgres", (error2, stdout) => {
                if (!error2) {
                  const postgresqlBin = stdout.toString().split(`
`).sort();
                  if (postgresqlBin.length) {
                    exec(postgresqlBin[postgresqlBin.length - 1] + " -V", (error3, stdout2) => {
                      if (!error3) {
                        const postgresql = stdout2.toString().split(`
`)[0].split(" ") || [];
                        appsObj.versions.postgresql = postgresql.length ? postgresql[postgresql.length - 1] : "";
                      }
                      functionProcessed();
                    });
                  } else {
                    functionProcessed();
                  }
                } else {
                  exec("psql -V", (error3, stdout2) => {
                    if (!error3) {
                      const postgresql = stdout2.toString().split(`
`)[0].split(" ") || [];
                      appsObj.versions.postgresql = postgresql.length ? postgresql[postgresql.length - 1] : "";
                      appsObj.versions.postgresql = appsObj.versions.postgresql.split("-")[0];
                    }
                    functionProcessed();
                  });
                }
              });
            } else {
              if (_windows) {
                util.powerShell("Get-CimInstance Win32_Service | select caption | fl").then((stdout) => {
                  let serviceSections = stdout.split(/\n\s*\n/);
                  serviceSections.forEach((item) => {
                    if (item.trim() !== "") {
                      let lines = item.trim().split(`\r
`);
                      let srvCaption = util.getValue(lines, "caption", ":", true).toLowerCase();
                      if (srvCaption.indexOf("postgresql") > -1) {
                        const parts = srvCaption.split(" server ");
                        if (parts.length > 1) {
                          appsObj.versions.postgresql = parts[1];
                        }
                      }
                    }
                  });
                  functionProcessed();
                });
              } else {
                exec("postgres -V", (error2, stdout) => {
                  if (!error2) {
                    const postgresql = stdout.toString().split(`
`)[0].split(" ") || [];
                    appsObj.versions.postgresql = postgresql.length ? postgresql[postgresql.length - 1] : "";
                  } else {
                    exec("pg_config --version", (error3, stdout2) => {
                      if (!error3) {
                        const postgresql = stdout2.toString().split(`
`)[0].split(" ") || [];
                        appsObj.versions.postgresql = postgresql.length ? postgresql[postgresql.length - 1] : "";
                      }
                    });
                  }
                  functionProcessed();
                });
              }
            }
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "perl")) {
            exec("perl -v", (error2, stdout) => {
              if (!error2) {
                const perl = stdout.toString().split(`
`) || "";
                while (perl.length > 0 && perl[0].trim() === "") {
                  perl.shift();
                }
                if (perl.length > 0) {
                  appsObj.versions.perl = perl[0].split("(").pop().split(")")[0].replace("v", "");
                }
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "python")) {
            if (_darwin) {
              try {
                const stdout = execSync("sw_vers");
                const lines = stdout.toString().split(`
`);
                const osVersion = util.getValue(lines, "ProductVersion", ":");
                const gitHomebrewExists1 = fs.existsSync("/usr/local/Cellar/python");
                const gitHomebrewExists2 = fs.existsSync("/opt/homebrew/bin/python");
                if (util.darwinXcodeExists() && util.semverCompare("12.0.1", osVersion) < 0 || gitHomebrewExists1 || gitHomebrewExists2) {
                  const cmd2 = gitHomebrewExists1 ? "/usr/local/Cellar/python -V 2>&1" : gitHomebrewExists2 ? "/opt/homebrew/bin/python -V 2>&1" : "python -V 2>&1";
                  exec(cmd2, (error2, stdout2) => {
                    if (!error2) {
                      const python = stdout2.toString().split(`
`)[0] || "";
                      appsObj.versions.python = python.toLowerCase().replace("python", "").trim();
                    }
                    functionProcessed();
                  });
                } else {
                  functionProcessed();
                }
              } catch {
                functionProcessed();
              }
            } else {
              exec("python -V 2>&1", (error2, stdout) => {
                if (!error2) {
                  const python = stdout.toString().split(`
`)[0] || "";
                  appsObj.versions.python = python.toLowerCase().replace("python", "").trim();
                }
                functionProcessed();
              });
            }
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "python3")) {
            if (_darwin) {
              const gitHomebrewExists = fs.existsSync("/usr/local/Cellar/python3") || fs.existsSync("/opt/homebrew/bin/python3");
              if (util.darwinXcodeExists() || gitHomebrewExists) {
                exec("python3 -V 2>&1", (error2, stdout) => {
                  if (!error2) {
                    const python = stdout.toString().split(`
`)[0] || "";
                    appsObj.versions.python3 = python.toLowerCase().replace("python", "").trim();
                  }
                  functionProcessed();
                });
              } else {
                functionProcessed();
              }
            } else {
              exec("python3 -V 2>&1", (error2, stdout) => {
                if (!error2) {
                  const python = stdout.toString().split(`
`)[0] || "";
                  appsObj.versions.python3 = python.toLowerCase().replace("python", "").trim();
                }
                functionProcessed();
              });
            }
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "pip")) {
            if (_darwin) {
              const gitHomebrewExists = fs.existsSync("/usr/local/Cellar/pip") || fs.existsSync("/opt/homebrew/bin/pip");
              if (util.darwinXcodeExists() || gitHomebrewExists) {
                exec("pip -V 2>&1", (error2, stdout) => {
                  if (!error2) {
                    const pip = stdout.toString().split(`
`)[0] || "";
                    const parts = pip.split(" ");
                    appsObj.versions.pip = parts.length >= 2 ? parts[1] : "";
                  }
                  functionProcessed();
                });
              } else {
                functionProcessed();
              }
            } else {
              exec("pip -V 2>&1", (error2, stdout) => {
                if (!error2) {
                  const pip = stdout.toString().split(`
`)[0] || "";
                  const parts = pip.split(" ");
                  appsObj.versions.pip = parts.length >= 2 ? parts[1] : "";
                }
                functionProcessed();
              });
            }
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "pip3")) {
            if (_darwin) {
              const gitHomebrewExists = fs.existsSync("/usr/local/Cellar/pip3") || fs.existsSync("/opt/homebrew/bin/pip3");
              if (util.darwinXcodeExists() || gitHomebrewExists) {
                exec("pip3 -V 2>&1", (error2, stdout) => {
                  if (!error2) {
                    const pip = stdout.toString().split(`
`)[0] || "";
                    const parts = pip.split(" ");
                    appsObj.versions.pip3 = parts.length >= 2 ? parts[1] : "";
                  }
                  functionProcessed();
                });
              } else {
                functionProcessed();
              }
            } else {
              exec("pip3 -V 2>&1", (error2, stdout) => {
                if (!error2) {
                  const pip = stdout.toString().split(`
`)[0] || "";
                  const parts = pip.split(" ");
                  appsObj.versions.pip3 = parts.length >= 2 ? parts[1] : "";
                }
                functionProcessed();
              });
            }
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "java")) {
            if (_darwin) {
              exec("/usr/libexec/java_home -V 2>&1", (error2, stdout) => {
                if (!error2 && stdout.toString().toLowerCase().indexOf("no java runtime") === -1) {
                  exec("java -version 2>&1", (error3, stdout2) => {
                    if (!error3) {
                      const java = stdout2.toString().split(`
`)[0] || "";
                      const parts = java.split('"');
                      appsObj.versions.java = parts.length === 3 ? parts[1].trim() : "";
                    }
                    functionProcessed();
                  });
                } else {
                  functionProcessed();
                }
              });
            } else {
              exec("java -version 2>&1", (error2, stdout) => {
                if (!error2) {
                  const java = stdout.toString().split(`
`)[0] || "";
                  const parts = java.split('"');
                  appsObj.versions.java = parts.length === 3 ? parts[1].trim() : "";
                }
                functionProcessed();
              });
            }
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "gcc")) {
            if (_darwin && util.darwinXcodeExists() || !_darwin) {
              exec("gcc -dumpversion", (error2, stdout) => {
                if (!error2) {
                  appsObj.versions.gcc = stdout.toString().split(`
`)[0].trim() || "";
                }
                if (appsObj.versions.gcc.indexOf(".") > -1) {
                  functionProcessed();
                } else {
                  exec("gcc --version", (error3, stdout2) => {
                    if (!error3) {
                      const gcc = stdout2.toString().split(`
`)[0].trim();
                      if (gcc.indexOf("gcc") > -1 && gcc.indexOf(")") > -1) {
                        const parts = gcc.split(")");
                        appsObj.versions.gcc = parts[1].trim() || appsObj.versions.gcc;
                      }
                    }
                    functionProcessed();
                  });
                }
              });
            } else {
              functionProcessed();
            }
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "virtualbox")) {
            exec(util.getVboxmanage() + " -v 2>&1", (error2, stdout) => {
              if (!error2) {
                const vbox = stdout.toString().split(`
`)[0] || "";
                const parts = vbox.split("r");
                appsObj.versions.virtualbox = parts[0];
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "bash")) {
            exec("bash --version", (error2, stdout) => {
              if (!error2) {
                const line = stdout.toString().split(`
`)[0];
                const parts = line.split(" version ");
                if (parts.length > 1) {
                  appsObj.versions.bash = parts[1].split(" ")[0].split("(")[0];
                }
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "zsh")) {
            exec("zsh --version", (error2, stdout) => {
              if (!error2) {
                const line = stdout.toString().split(`
`)[0];
                const parts = line.split("zsh ");
                if (parts.length > 1) {
                  appsObj.versions.zsh = parts[1].split(" ")[0];
                }
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "fish")) {
            exec("fish --version", (error2, stdout) => {
              if (!error2) {
                const line = stdout.toString().split(`
`)[0];
                const parts = line.split(" version ");
                if (parts.length > 1) {
                  appsObj.versions.fish = parts[1].split(" ")[0];
                }
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "bun")) {
            exec("bun -v", (error2, stdout) => {
              if (!error2) {
                const line = stdout.toString().split(`
`)[0].trim();
                appsObj.versions.bun = line;
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "deno")) {
            exec("deno -v", (error2, stdout) => {
              if (!error2) {
                const line = stdout.toString().split(`
`)[0].trim();
                const parts = line.split(" ");
                if (parts.length > 1) {
                  appsObj.versions.deno = parts[1];
                }
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "node")) {
            exec("node -v", (error2, stdout) => {
              if (!error2) {
                let line = stdout.toString().split(`
`)[0].trim();
                if (line.startsWith("v")) {
                  line = line.slice(1);
                }
                appsObj.versions.node = line;
              }
              functionProcessed();
            });
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "powershell")) {
            if (_windows) {
              util.powerShell("$PSVersionTable").then((stdout) => {
                const lines = stdout.toString().toLowerCase().split(`
`).map((line) => line.replace(/ +/g, " ").replace(/ +/g, ":"));
                appsObj.versions.powershell = util.getValue(lines, "psversion");
                functionProcessed();
              });
            } else {
              functionProcessed();
            }
          }
          if ({}.hasOwnProperty.call(appsObj.versions, "dotnet")) {
            if (_windows) {
              util.powerShell('gci "HKLM:\\SOFTWARE\\Microsoft\\NET Framework Setup\\NDP" -recurse | gp -name Version,Release -EA 0 | where { $_.PSChildName -match "^(?!S)\\p{L}"} | select PSChildName, Version, Release').then((stdout) => {
                const lines = stdout.toString().split(`\r
`);
                let dotnet = "";
                lines.forEach((line) => {
                  line = line.replace(/ +/g, " ");
                  const parts = line.split(" ");
                  dotnet = dotnet || (parts[0].toLowerCase().startsWith("client") && parts.length > 2 ? parts[1].trim() : parts[0].toLowerCase().startsWith("full") && parts.length > 2 ? parts[1].trim() : "");
                });
                appsObj.versions.dotnet = dotnet.trim();
                functionProcessed();
              });
            } else {
              functionProcessed();
            }
          }
        } catch {
          if (callback) {
            callback(appsObj.versions);
          }
          resolve(appsObj.versions);
        }
      });
    });
  }
  exports.versions = versions;
  function shell(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        if (_windows) {
          try {
            const result2 = "CMD";
            util.powerShell(`Get-CimInstance -className win32_process | where-object {$_.ProcessId -eq ${process.ppid} } | select Name`).then((stdout) => {
              let result3 = "CMD";
              if (stdout) {
                if (stdout.toString().toLowerCase().indexOf("powershell") >= 0) {
                  result3 = "PowerShell";
                }
              }
              if (callback) {
                callback(result3);
              }
              resolve(result3);
            });
          } catch {
            if (callback) {
              callback(result);
            }
            resolve(result);
          }
        } else {
          let result2 = "";
          exec("echo $SHELL", (error2, stdout) => {
            if (!error2) {
              result2 = stdout.toString().split(`
`)[0];
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
      });
    });
  }
  exports.shell = shell;
  function getUniqueMacAdresses() {
    let macs = [];
    try {
      const ifaces = os.networkInterfaces();
      for (let dev in ifaces) {
        if ({}.hasOwnProperty.call(ifaces, dev)) {
          ifaces[dev].forEach((details) => {
            if (details && details.mac && details.mac !== "00:00:00:00:00:00") {
              const mac = details.mac.toLowerCase();
              if (macs.indexOf(mac) === -1) {
                macs.push(mac);
              }
            }
          });
        }
      }
      macs = macs.sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
    } catch {
      macs.push("00:00:00:00:00:00");
    }
    return macs;
  }
  function uuid(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = {
          os: "",
          hardware: "",
          macs: getUniqueMacAdresses()
        };
        let parts;
        if (_darwin) {
          exec("system_profiler SPHardwareDataType -json", (error2, stdout) => {
            if (!error2) {
              try {
                const jsonObj = JSON.parse(stdout.toString());
                if (jsonObj.SPHardwareDataType && jsonObj.SPHardwareDataType.length > 0) {
                  const spHardware = jsonObj.SPHardwareDataType[0];
                  result2.os = spHardware.platform_UUID.toLowerCase();
                  result2.hardware = spHardware.serial_number;
                }
              } catch {
                util.noop();
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_linux) {
          const cmd = `echo -n "os: "; cat /var/lib/dbus/machine-id 2> /dev/null ||
cat /etc/machine-id 2> /dev/null; echo;
echo -n "hardware: "; cat /sys/class/dmi/id/product_uuid 2> /dev/null; echo;`;
          exec(cmd, (error2, stdout) => {
            const lines = stdout.toString().split(`
`);
            result2.os = util.getValue(lines, "os").toLowerCase();
            result2.hardware = util.getValue(lines, "hardware").toLowerCase();
            if (!result2.hardware) {
              const lines2 = fs.readFileSync("/proc/cpuinfo", { encoding: "utf8" }).toString().split(`
`);
              const serial = util.getValue(lines2, "serial");
              result2.hardware = serial || "";
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_freebsd || _openbsd || _netbsd) {
          exec("sysctl -i kern.hostid kern.hostuuid", (error2, stdout) => {
            const lines = stdout.toString().split(`
`);
            result2.hardware = util.getValue(lines, "kern.hostid", ":").toLowerCase();
            result2.os = util.getValue(lines, "kern.hostuuid", ":").toLowerCase();
            if (result2.os.indexOf("unknown") >= 0) {
              result2.os = "";
            }
            if (result2.hardware.indexOf("unknown") >= 0) {
              result2.hardware = "";
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_windows) {
          let sysdir = "%windir%\\System32";
          if (process.arch === "ia32" && Object.prototype.hasOwnProperty.call(process.env, "PROCESSOR_ARCHITEW6432")) {
            sysdir = "%windir%\\sysnative\\cmd.exe /c %windir%\\System32";
          }
          util.powerShell("Get-CimInstance Win32_ComputerSystemProduct | select UUID | fl").then((stdout) => {
            let lines = stdout.split(`\r
`);
            result2.hardware = util.getValue(lines, "uuid", ":").toLowerCase();
            exec(`${sysdir}\\reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid`, util.execOptsWin, (error2, stdout2) => {
              parts = stdout2.toString().split(`
\r`)[0].split("REG_SZ");
              result2.os = parts.length > 1 ? parts[1].replace(/\r+|\n+|\s+/gi, "").toLowerCase() : "";
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          });
        }
      });
    });
  }
  exports.uuid = uuid;
});

// node_modules/systeminformation/lib/system.js
var require_system = __commonJS((exports) => {
  var fs = __require("fs");
  var os = __require("os");
  var util = require_util();
  var { uuid } = require_osinfo();
  var exec = __require("child_process").exec;
  var execSync = __require("child_process").execSync;
  var execPromise = util.promisify(__require("child_process").exec);
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  function system(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = {
          manufacturer: "",
          model: "Computer",
          version: "",
          serial: "-",
          uuid: "-",
          sku: "-",
          virtual: false
        };
        if (_linux || _freebsd || _openbsd || _netbsd) {
          exec("export LC_ALL=C; dmidecode -t system 2>/dev/null; unset LC_ALL", (error2, stdout) => {
            let lines = stdout.toString().split(`
`);
            result2.manufacturer = cleanDefaults(util.getValue(lines, "manufacturer"));
            result2.model = cleanDefaults(util.getValue(lines, "product name"));
            result2.version = cleanDefaults(util.getValue(lines, "version"));
            result2.serial = cleanDefaults(util.getValue(lines, "serial number"));
            result2.uuid = cleanDefaults(util.getValue(lines, "uuid")).toLowerCase();
            result2.sku = cleanDefaults(util.getValue(lines, "sku number"));
            const cmd = `echo -n "product_name: "; cat /sys/devices/virtual/dmi/id/product_name 2>/dev/null; echo;
            echo -n "product_serial: "; cat /sys/devices/virtual/dmi/id/product_serial 2>/dev/null; echo;
            echo -n "product_uuid: "; cat /sys/devices/virtual/dmi/id/product_uuid 2>/dev/null; echo;
            echo -n "product_version: "; cat /sys/devices/virtual/dmi/id/product_version 2>/dev/null; echo;
            echo -n "sys_vendor: "; cat /sys/devices/virtual/dmi/id/sys_vendor 2>/dev/null; echo;`;
            try {
              lines = execSync(cmd, util.execOptsLinux).toString().split(`
`);
              result2.manufacturer = cleanDefaults(result2.manufacturer === "" ? util.getValue(lines, "sys_vendor") : result2.manufacturer);
              result2.model = cleanDefaults(result2.model === "" ? util.getValue(lines, "product_name") : result2.model);
              result2.version = cleanDefaults(result2.version === "" ? util.getValue(lines, "product_version") : result2.version);
              result2.serial = cleanDefaults(result2.serial === "" ? util.getValue(lines, "product_serial") : result2.serial);
              result2.uuid = cleanDefaults(result2.uuid === "" ? util.getValue(lines, "product_uuid").toLowerCase() : result2.uuid);
            } catch {
              util.noop();
            }
            if (!result2.serial) {
              result2.serial = "-";
            }
            if (!result2.manufacturer) {
              result2.manufacturer = "";
            }
            if (!result2.model) {
              result2.model = "Computer";
            }
            if (!result2.version) {
              result2.version = "";
            }
            if (!result2.sku) {
              result2.sku = "-";
            }
            if (result2.model.toLowerCase() === "virtualbox" || result2.model.toLowerCase() === "kvm" || result2.model.toLowerCase() === "virtual machine" || result2.model.toLowerCase() === "bochs" || result2.model.toLowerCase().startsWith("vmware") || result2.model.toLowerCase().startsWith("droplet")) {
              result2.virtual = true;
              switch (result2.model.toLowerCase()) {
                case "virtualbox":
                  result2.virtualHost = "VirtualBox";
                  break;
                case "vmware":
                  result2.virtualHost = "VMware";
                  break;
                case "kvm":
                  result2.virtualHost = "KVM";
                  break;
                case "bochs":
                  result2.virtualHost = "bochs";
                  break;
              }
            }
            if (result2.manufacturer.toLowerCase().startsWith("vmware") || result2.manufacturer.toLowerCase() === "xen") {
              result2.virtual = true;
              switch (result2.manufacturer.toLowerCase()) {
                case "vmware":
                  result2.virtualHost = "VMware";
                  break;
                case "xen":
                  result2.virtualHost = "Xen";
                  break;
              }
            }
            if (!result2.virtual) {
              try {
                const disksById = execSync("ls -1 /dev/disk/by-id/ 2>/dev/null; pciconf -lv  2>/dev/null", util.execOptsLinux).toString();
                if (disksById.indexOf("_QEMU_") >= 0 || disksById.indexOf("QEMU ") >= 0) {
                  result2.virtual = true;
                  result2.virtualHost = "QEMU";
                }
                if (disksById.indexOf("_VBOX_") >= 0) {
                  result2.virtual = true;
                  result2.virtualHost = "VirtualBox";
                }
              } catch {
                util.noop();
              }
            }
            if (_freebsd || _openbsd || _netbsd) {
              try {
                const lines2 = execSync("sysctl -i kern.hostuuid kern.hostid hw.model", util.execOptsLinux).toString().split(`
`);
                if (!result2.uuid) {
                  result2.uuid = util.getValue(lines2, "kern.hostuuid", ":").toLowerCase();
                }
                if (!result2.serial || result2.serial === "-") {
                  result2.serial = util.getValue(lines2, "kern.hostid", ":").toLowerCase();
                }
                if (!result2.model || result2.model === "Computer") {
                  result2.model = util.getValue(lines2, "hw.model", ":").trim();
                }
              } catch {
                util.noop();
              }
            }
            if (!result2.virtual && (os.release().toLowerCase().indexOf("microsoft") >= 0 || os.release().toLowerCase().endsWith("wsl2"))) {
              const kernelVersion = parseFloat(os.release().toLowerCase());
              result2.virtual = true;
              result2.manufacturer = "Microsoft";
              result2.model = "WSL";
              result2.version = kernelVersion < 4.19 ? "1" : "2";
            }
            if ((_freebsd || _openbsd || _netbsd) && !result2.virtualHost) {
              try {
                const procInfo = execSync("dmidecode -t 4", util.execOptsLinux);
                const procLines = procInfo.toString().split(`
`);
                const procManufacturer = util.getValue(procLines, "manufacturer", ":", true);
                switch (procManufacturer.toLowerCase()) {
                  case "virtualbox":
                    result2.virtualHost = "VirtualBox";
                    break;
                  case "vmware":
                    result2.virtualHost = "VMware";
                    break;
                  case "kvm":
                    result2.virtualHost = "KVM";
                    break;
                  case "bochs":
                    result2.virtualHost = "bochs";
                    break;
                }
              } catch {
                util.noop();
              }
            }
            if (fs.existsSync("/.dockerenv") || fs.existsSync("/.dockerinit")) {
              result2.model = "Docker Container";
            }
            try {
              const stdout2 = execSync('dmesg 2>/dev/null | grep -iE "virtual|hypervisor" | grep -iE "vmware|qemu|kvm|xen" | grep -viE "Nested Virtualization|/virtual/"');
              const lines2 = stdout2.toString().split(`
`);
              if (lines2.length > 0) {
                if (result2.model === "Computer") {
                  result2.model = "Virtual machine";
                }
                result2.virtual = true;
                if (stdout2.toString().toLowerCase().indexOf("vmware") >= 0 && !result2.virtualHost) {
                  result2.virtualHost = "VMware";
                }
                if (stdout2.toString().toLowerCase().indexOf("qemu") >= 0 && !result2.virtualHost) {
                  result2.virtualHost = "QEMU";
                }
                if (stdout2.toString().toLowerCase().indexOf("xen") >= 0 && !result2.virtualHost) {
                  result2.virtualHost = "Xen";
                }
                if (stdout2.toString().toLowerCase().indexOf("kvm") >= 0 && !result2.virtualHost) {
                  result2.virtualHost = "KVM";
                }
              }
            } catch {
              util.noop();
            }
            if (result2.manufacturer === "" && result2.model === "Computer" && result2.version === "") {
              fs.readFile("/proc/cpuinfo", (error3, stdout2) => {
                if (!error3) {
                  let lines2 = stdout2.toString().split(`
`);
                  result2.model = util.getValue(lines2, "hardware", ":", true).toUpperCase();
                  result2.version = util.getValue(lines2, "revision", ":", true).toLowerCase();
                  result2.serial = util.getValue(lines2, "serial", ":", true);
                  const model = util.getValue(lines2, "model:", ":", true);
                  if (util.isRaspberry(lines2)) {
                    const rPIRevision = util.decodePiCpuinfo(lines2);
                    result2.model = rPIRevision.model;
                    result2.version = rPIRevision.revisionCode;
                    result2.manufacturer = "Raspberry Pi Foundation";
                    result2.raspberry = {
                      manufacturer: rPIRevision.manufacturer,
                      processor: rPIRevision.processor,
                      type: rPIRevision.type,
                      revision: rPIRevision.revision
                    };
                  }
                }
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              });
            } else {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
          });
        }
        if (_darwin) {
          exec("ioreg -c IOPlatformExpertDevice -d 2", (error2, stdout) => {
            if (!error2) {
              const lines = stdout.toString().replace(/[<>"]/g, "").split(`
`);
              const model = util.getAppleModel(util.getValue(lines, "model", "=", true));
              result2.manufacturer = util.getValue(lines, "manufacturer", "=", true);
              result2.model = model.key;
              result2.type = macOsChassisType(model.version);
              result2.version = model.version;
              result2.serial = util.getValue(lines, "ioplatformserialnumber", "=", true);
              result2.uuid = util.getValue(lines, "ioplatformuuid", "=", true).toLowerCase();
              result2.sku = util.getValue(lines, "board-id", "=", true) || util.getValue(lines, "target-sub-type", "=", true);
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_sunos) {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
        if (_windows) {
          try {
            util.powerShell("Get-CimInstance Win32_ComputerSystemProduct | select Name,Vendor,Version,IdentifyingNumber,UUID | fl").then((stdout, error2) => {
              if (!error2) {
                const lines = stdout.split(`\r
`);
                result2.manufacturer = util.getValue(lines, "vendor", ":");
                result2.model = util.getValue(lines, "name", ":");
                result2.version = util.getValue(lines, "version", ":");
                result2.serial = util.getValue(lines, "identifyingnumber", ":");
                result2.uuid = util.getValue(lines, "uuid", ":").toLowerCase();
                const model = result2.model.toLowerCase();
                if (model === "virtualbox" || model === "kvm" || model === "virtual machine" || model === "bochs" || model.startsWith("vmware") || model.startsWith("qemu") || model.startsWith("parallels")) {
                  result2.virtual = true;
                  if (model.startsWith("virtualbox")) {
                    result2.virtualHost = "VirtualBox";
                  }
                  if (model.startsWith("vmware")) {
                    result2.virtualHost = "VMware";
                  }
                  if (model.startsWith("kvm")) {
                    result2.virtualHost = "KVM";
                  }
                  if (model.startsWith("bochs")) {
                    result2.virtualHost = "bochs";
                  }
                  if (model.startsWith("qemu")) {
                    result2.virtualHost = "KVM";
                  }
                  if (model.startsWith("parallels")) {
                    result2.virtualHost = "Parallels";
                  }
                }
                const manufacturer = result2.manufacturer.toLowerCase();
                if (manufacturer.startsWith("vmware") || manufacturer.startsWith("qemu") || manufacturer === "xen" || manufacturer.startsWith("parallels")) {
                  result2.virtual = true;
                  if (manufacturer.startsWith("vmware")) {
                    result2.virtualHost = "VMware";
                  }
                  if (manufacturer.startsWith("xen")) {
                    result2.virtualHost = "Xen";
                  }
                  if (manufacturer.startsWith("qemu")) {
                    result2.virtualHost = "KVM";
                  }
                  if (manufacturer.startsWith("parallels")) {
                    result2.virtualHost = "Parallels";
                  }
                }
                util.powerShell('Get-CimInstance MS_Systeminformation -Namespace "root/wmi" | select systemsku | fl ').then((stdout2, error3) => {
                  if (!error3) {
                    const lines2 = stdout2.split(`\r
`);
                    result2.sku = util.getValue(lines2, "systemsku", ":");
                  }
                  if (!result2.virtual) {
                    util.powerShell("Get-CimInstance Win32_bios | select Version, SerialNumber, SMBIOSBIOSVersion").then((stdout3, error4) => {
                      if (!error4) {
                        let lines2 = stdout3.toString();
                        if (lines2.indexOf("VRTUAL") >= 0 || lines2.indexOf("A M I ") >= 0 || lines2.indexOf("VirtualBox") >= 0 || lines2.indexOf("VMWare") >= 0 || lines2.indexOf("Xen") >= 0 || lines2.indexOf("Parallels") >= 0) {
                          result2.virtual = true;
                          if (lines2.indexOf("VirtualBox") >= 0 && !result2.virtualHost) {
                            result2.virtualHost = "VirtualBox";
                          }
                          if (lines2.indexOf("VMware") >= 0 && !result2.virtualHost) {
                            result2.virtualHost = "VMware";
                          }
                          if (lines2.indexOf("Xen") >= 0 && !result2.virtualHost) {
                            result2.virtualHost = "Xen";
                          }
                          if (lines2.indexOf("VRTUAL") >= 0 && !result2.virtualHost) {
                            result2.virtualHost = "Hyper-V";
                          }
                          if (lines2.indexOf("A M I") >= 0 && !result2.virtualHost) {
                            result2.virtualHost = "Virtual PC";
                          }
                          if (lines2.indexOf("Parallels") >= 0 && !result2.virtualHost) {
                            result2.virtualHost = "Parallels";
                          }
                        }
                        if (callback) {
                          callback(result2);
                        }
                        resolve(result2);
                      } else {
                        if (callback) {
                          callback(result2);
                        }
                        resolve(result2);
                      }
                    });
                  } else {
                    if (callback) {
                      callback(result2);
                    }
                    resolve(result2);
                  }
                });
              } else {
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              }
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  exports.system = system;
  function cleanDefaults(s) {
    const cmpStr = s.toLowerCase();
    if (cmpStr.indexOf("o.e.m.") === -1 && cmpStr.indexOf("default string") === -1 && cmpStr !== "default") {
      return s || "";
    }
    return "";
  }
  function bios(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = {
          vendor: "",
          version: "",
          releaseDate: "",
          revision: ""
        };
        let cmd = "";
        if (_linux || _freebsd || _openbsd || _netbsd) {
          if (process.arch === "arm") {
            cmd = "cat /proc/cpuinfo | grep Serial";
          } else {
            cmd = "export LC_ALL=C; dmidecode -t bios 2>/dev/null; unset LC_ALL";
          }
          exec(cmd, (error2, stdout) => {
            let lines = stdout.toString().split(`
`);
            result2.vendor = util.getValue(lines, "Vendor");
            result2.version = util.getValue(lines, "Version");
            let datetime = util.getValue(lines, "Release Date");
            result2.releaseDate = util.parseDateTime(datetime).date;
            result2.revision = util.getValue(lines, "BIOS Revision");
            result2.serial = util.getValue(lines, "SerialNumber");
            let language = util.getValue(lines, "Currently Installed Language").split("|")[0];
            if (language) {
              result2.language = language;
            }
            if (lines.length && stdout.toString().indexOf("Characteristics:") >= 0) {
              const features = [];
              lines.forEach((line) => {
                if (line.indexOf(" is supported") >= 0) {
                  const feature = line.split(" is supported")[0].trim();
                  features.push(feature);
                }
              });
              result2.features = features;
            }
            const cmd2 = `echo -n "bios_date: "; cat /sys/devices/virtual/dmi/id/bios_date 2>/dev/null; echo;
            echo -n "bios_vendor: "; cat /sys/devices/virtual/dmi/id/bios_vendor 2>/dev/null; echo;
            echo -n "bios_version: "; cat /sys/devices/virtual/dmi/id/bios_version 2>/dev/null; echo;`;
            try {
              lines = execSync(cmd2, util.execOptsLinux).toString().split(`
`);
              result2.vendor = !result2.vendor ? util.getValue(lines, "bios_vendor") : result2.vendor;
              result2.version = !result2.version ? util.getValue(lines, "bios_version") : result2.version;
              datetime = util.getValue(lines, "bios_date");
              result2.releaseDate = !result2.releaseDate ? util.parseDateTime(datetime).date : result2.releaseDate;
            } catch (e) {
              util.noop();
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_darwin) {
          result2.vendor = "Apple Inc.";
          exec("system_profiler SPHardwareDataType -json", (error2, stdout) => {
            try {
              const hardwareData = JSON.parse(stdout.toString());
              if (hardwareData && hardwareData.SPHardwareDataType && hardwareData.SPHardwareDataType.length) {
                let bootRomVersion = hardwareData.SPHardwareDataType[0].boot_rom_version;
                bootRomVersion = bootRomVersion ? bootRomVersion.split("(")[0].trim() : null;
                result2.version = bootRomVersion;
              }
            } catch (e) {
              util.noop();
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_sunos) {
          result2.vendor = "Sun Microsystems";
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
        if (_windows) {
          try {
            util.powerShell('Get-CimInstance Win32_bios | select Description,Version,Manufacturer,@{n="ReleaseDate";e={$_.ReleaseDate.ToString("yyyy-MM-dd")}},BuildNumber,SerialNumber,SMBIOSBIOSVersion | fl').then((stdout, error2) => {
              if (!error2) {
                let lines = stdout.toString().split(`\r
`);
                const description = util.getValue(lines, "description", ":");
                const version = util.getValue(lines, "SMBIOSBIOSVersion", ":");
                if (description.indexOf(" Version ") !== -1) {
                  result2.vendor = description.split(" Version ")[0].trim();
                  result2.version = description.split(" Version ")[1].trim();
                } else if (description.indexOf(" Ver: ") !== -1) {
                  result2.vendor = util.getValue(lines, "manufacturer", ":");
                  result2.version = description.split(" Ver: ")[1].trim();
                } else {
                  result2.vendor = util.getValue(lines, "manufacturer", ":");
                  result2.version = version || util.getValue(lines, "version", ":");
                }
                result2.releaseDate = util.getValue(lines, "releasedate", ":");
                result2.revision = util.getValue(lines, "buildnumber", ":");
                result2.serial = cleanDefaults(util.getValue(lines, "serialnumber", ":"));
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch (e) {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  exports.bios = bios;
  function baseboard(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        const result2 = {
          manufacturer: "",
          model: "",
          version: "",
          serial: "-",
          assetTag: "-",
          memMax: null,
          memSlots: null
        };
        let cmd = "";
        if (_linux || _freebsd || _openbsd || _netbsd) {
          if (process.arch === "arm") {
            cmd = "cat /proc/cpuinfo | grep Serial";
          } else {
            cmd = "export LC_ALL=C; dmidecode -t 2 2>/dev/null; unset LC_ALL";
          }
          const workload = [];
          workload.push(execPromise(cmd));
          workload.push(execPromise("export LC_ALL=C; dmidecode -t memory 2>/dev/null"));
          util.promiseAll(workload).then((data) => {
            let lines = data.results[0] ? data.results[0].toString().split(`
`) : [""];
            result2.manufacturer = cleanDefaults(util.getValue(lines, "Manufacturer"));
            result2.model = cleanDefaults(util.getValue(lines, "Product Name"));
            result2.version = cleanDefaults(util.getValue(lines, "Version"));
            result2.serial = cleanDefaults(util.getValue(lines, "Serial Number"));
            result2.assetTag = cleanDefaults(util.getValue(lines, "Asset Tag"));
            const cmd2 = `echo -n "board_asset_tag: "; cat /sys/devices/virtual/dmi/id/board_asset_tag 2>/dev/null; echo;
            echo -n "board_name: "; cat /sys/devices/virtual/dmi/id/board_name 2>/dev/null; echo;
            echo -n "board_serial: "; cat /sys/devices/virtual/dmi/id/board_serial 2>/dev/null; echo;
            echo -n "board_vendor: "; cat /sys/devices/virtual/dmi/id/board_vendor 2>/dev/null; echo;
            echo -n "board_version: "; cat /sys/devices/virtual/dmi/id/board_version 2>/dev/null; echo;`;
            try {
              lines = execSync(cmd2, util.execOptsLinux).toString().split(`
`);
              result2.manufacturer = cleanDefaults(!result2.manufacturer ? util.getValue(lines, "board_vendor") : result2.manufacturer);
              result2.model = cleanDefaults(!result2.model ? util.getValue(lines, "board_name") : result2.model);
              result2.version = cleanDefaults(!result2.version ? util.getValue(lines, "board_version") : result2.version);
              result2.serial = cleanDefaults(!result2.serial ? util.getValue(lines, "board_serial") : result2.serial);
              result2.assetTag = cleanDefaults(!result2.assetTag ? util.getValue(lines, "board_asset_tag") : result2.assetTag);
            } catch {
              util.noop();
            }
            lines = data.results[1] ? data.results[1].toString().split(`
`) : [""];
            result2.memMax = util.toInt(util.getValue(lines, "Maximum Capacity")) * 1024 * 1024 * 1024 || null;
            result2.memSlots = util.toInt(util.getValue(lines, "Number Of Devices")) || null;
            if (util.isRaspberry()) {
              const rpi = util.decodePiCpuinfo();
              result2.manufacturer = rpi.manufacturer;
              result2.model = "Raspberry Pi";
              result2.serial = rpi.serial;
              result2.version = rpi.type + " - " + rpi.revision;
              result2.memMax = os.totalmem();
              result2.memSlots = 0;
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_darwin) {
          const workload = [];
          workload.push(execPromise("ioreg -c IOPlatformExpertDevice -d 2"));
          workload.push(execPromise("system_profiler SPMemoryDataType"));
          util.promiseAll(workload).then((data) => {
            const lines = data.results[0] ? data.results[0].toString().replace(/[<>"]/g, "").split(`
`) : [""];
            result2.manufacturer = util.getValue(lines, "manufacturer", "=", true);
            result2.model = util.getValue(lines, "model", "=", true);
            result2.version = util.getValue(lines, "version", "=", true);
            result2.serial = util.getValue(lines, "ioplatformserialnumber", "=", true);
            result2.assetTag = util.getValue(lines, "board-id", "=", true);
            let devices = data.results[1] ? data.results[1].toString().split("        BANK ") : [""];
            if (devices.length === 1) {
              devices = data.results[1] ? data.results[1].toString().split("        DIMM") : [""];
            }
            devices.shift();
            result2.memSlots = devices.length;
            if (os.arch() === "arm64") {
              result2.memSlots = 0;
              result2.memMax = os.totalmem();
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_sunos) {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
        if (_windows) {
          try {
            const workload = [];
            const win10plus = parseInt(os.release()) >= 10;
            const maxCapacityAttribute = win10plus ? "MaxCapacityEx" : "MaxCapacity";
            workload.push(util.powerShell("Get-CimInstance Win32_baseboard | select Model,Manufacturer,Product,Version,SerialNumber,PartNumber,SKU | fl"));
            workload.push(util.powerShell(`Get-CimInstance Win32_physicalmemoryarray | select ${maxCapacityAttribute}, MemoryDevices | fl`));
            util.promiseAll(workload).then((data) => {
              let lines = data.results[0] ? data.results[0].toString().split(`\r
`) : [""];
              result2.manufacturer = cleanDefaults(util.getValue(lines, "manufacturer", ":"));
              result2.model = cleanDefaults(util.getValue(lines, "model", ":"));
              if (!result2.model) {
                result2.model = cleanDefaults(util.getValue(lines, "product", ":"));
              }
              result2.version = cleanDefaults(util.getValue(lines, "version", ":"));
              result2.serial = cleanDefaults(util.getValue(lines, "serialnumber", ":"));
              result2.assetTag = cleanDefaults(util.getValue(lines, "partnumber", ":"));
              if (!result2.assetTag) {
                result2.assetTag = cleanDefaults(util.getValue(lines, "sku", ":"));
              }
              lines = data.results[1] ? data.results[1].toString().split(`\r
`) : [""];
              result2.memMax = util.toInt(util.getValue(lines, maxCapacityAttribute, ":")) * (win10plus ? 1024 : 1) || null;
              result2.memSlots = util.toInt(util.getValue(lines, "MemoryDevices", ":")) || null;
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  exports.baseboard = baseboard;
  function macOsChassisType(model) {
    model = model.toLowerCase();
    if (model.indexOf("macbookair") >= 0 || model.indexOf("macbook air") >= 0) {
      return "Notebook";
    }
    if (model.indexOf("macbookpro") >= 0 || model.indexOf("macbook pro") >= 0) {
      return "Notebook";
    }
    if (model.indexOf("macbook") >= 0) {
      return "Notebook";
    }
    if (model.indexOf("macmini") >= 0 || model.indexOf("mac mini") >= 0) {
      return "Desktop";
    }
    if (model.indexOf("imac") >= 0) {
      return "Desktop";
    }
    if (model.indexOf("macstudio") >= 0 || model.indexOf("mac studio") >= 0) {
      return "Desktop";
    }
    if (model.indexOf("macpro") >= 0 || model.indexOf("mac pro") >= 0) {
      return "Tower";
    }
    return "Other";
  }
  function chassis(callback) {
    const chassisTypes = [
      "Other",
      "Unknown",
      "Desktop",
      "Low Profile Desktop",
      "Pizza Box",
      "Mini Tower",
      "Tower",
      "Portable",
      "Laptop",
      "Notebook",
      "Hand Held",
      "Docking Station",
      "All in One",
      "Sub Notebook",
      "Space-Saving",
      "Lunch Box",
      "Main System Chassis",
      "Expansion Chassis",
      "SubChassis",
      "Bus Expansion Chassis",
      "Peripheral Chassis",
      "Storage Chassis",
      "Rack Mount Chassis",
      "Sealed-Case PC",
      "Multi-System Chassis",
      "Compact PCI",
      "Advanced TCA",
      "Blade",
      "Blade Enclosure",
      "Tablet",
      "Convertible",
      "Detachable",
      "IoT Gateway ",
      "Embedded PC",
      "Mini PC",
      "Stick PC"
    ];
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = {
          manufacturer: "",
          model: "",
          type: "",
          version: "",
          serial: "-",
          assetTag: "-",
          sku: ""
        };
        if (_linux || _freebsd || _openbsd || _netbsd) {
          const cmd = `echo -n "chassis_asset_tag: "; cat /sys/devices/virtual/dmi/id/chassis_asset_tag 2>/dev/null; echo;
            echo -n "chassis_serial: "; cat /sys/devices/virtual/dmi/id/chassis_serial 2>/dev/null; echo;
            echo -n "chassis_type: "; cat /sys/devices/virtual/dmi/id/chassis_type 2>/dev/null; echo;
            echo -n "chassis_vendor: "; cat /sys/devices/virtual/dmi/id/chassis_vendor 2>/dev/null; echo;
            echo -n "chassis_version: "; cat /sys/devices/virtual/dmi/id/chassis_version 2>/dev/null; echo;`;
          exec(cmd, (error2, stdout) => {
            let lines = stdout.toString().split(`
`);
            result2.manufacturer = cleanDefaults(util.getValue(lines, "chassis_vendor"));
            const ctype = parseInt(util.getValue(lines, "chassis_type").replace(/\D/g, ""));
            result2.type = cleanDefaults(ctype && !isNaN(ctype) && ctype < chassisTypes.length ? chassisTypes[ctype - 1] : "");
            result2.version = cleanDefaults(util.getValue(lines, "chassis_version"));
            result2.serial = cleanDefaults(util.getValue(lines, "chassis_serial"));
            result2.assetTag = cleanDefaults(util.getValue(lines, "chassis_asset_tag"));
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_darwin) {
          exec("ioreg -c IOPlatformExpertDevice -d 2", (error2, stdout) => {
            if (!error2) {
              const lines = stdout.toString().replace(/[<>"]/g, "").split(`
`);
              const model = util.getAppleModel(util.getValue(lines, "model", "=", true));
              result2.manufacturer = util.getValue(lines, "manufacturer", "=", true);
              result2.model = model.key;
              result2.type = macOsChassisType(model.model);
              result2.version = model.version;
              result2.serial = util.getValue(lines, "ioplatformserialnumber", "=", true);
              result2.assetTag = util.getValue(lines, "board-id", "=", true) || util.getValue(lines, "target-type", "=", true);
              result2.sku = util.getValue(lines, "target-sub-type", "=", true);
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_sunos) {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
        if (_windows) {
          try {
            util.powerShell("Get-CimInstance Win32_SystemEnclosure | select Model,Manufacturer,ChassisTypes,Version,SerialNumber,PartNumber,SKU,SMBIOSAssetTag | fl").then((stdout, error2) => {
              if (!error2) {
                let lines = stdout.toString().split(`\r
`);
                result2.manufacturer = cleanDefaults(util.getValue(lines, "manufacturer", ":"));
                result2.model = cleanDefaults(util.getValue(lines, "model", ":"));
                const ctype = parseInt(util.getValue(lines, "ChassisTypes", ":").replace(/\D/g, ""));
                result2.type = ctype && !isNaN(ctype) && ctype < chassisTypes.length ? chassisTypes[ctype - 1] : "";
                result2.version = cleanDefaults(util.getValue(lines, "version", ":"));
                result2.serial = cleanDefaults(util.getValue(lines, "serialnumber", ":"));
                result2.assetTag = cleanDefaults(util.getValue(lines, "partnumber", ":"));
                if (!result2.assetTag) {
                  result2.assetTag = cleanDefaults(util.getValue(lines, "SMBIOSAssetTag", ":"));
                }
                result2.sku = cleanDefaults(util.getValue(lines, "sku", ":"));
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  exports.chassis = chassis;
});

// node_modules/systeminformation/lib/cpu.js
var require_cpu = __commonJS((exports) => {
  var os = __require("os");
  var exec = __require("child_process").exec;
  var execSync = __require("child_process").execSync;
  var fs = __require("fs");
  var util = require_util();
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  var _cpu_speed = 0;
  var _current_cpu = {
    user: 0,
    nice: 0,
    system: 0,
    idle: 0,
    irq: 0,
    steal: 0,
    guest: 0,
    load: 0,
    tick: 0,
    ms: 0,
    currentLoad: 0,
    currentLoadUser: 0,
    currentLoadSystem: 0,
    currentLoadNice: 0,
    currentLoadIdle: 0,
    currentLoadIrq: 0,
    currentLoadSteal: 0,
    currentLoadGuest: 0,
    rawCurrentLoad: 0,
    rawCurrentLoadUser: 0,
    rawCurrentLoadSystem: 0,
    rawCurrentLoadNice: 0,
    rawCurrentLoadIdle: 0,
    rawCurrentLoadIrq: 0,
    rawCurrentLoadSteal: 0,
    rawCurrentLoadGuest: 0
  };
  var _cpus = [];
  var _corecount = 0;
  var AMDBaseFrequencies = {
    8346: "1.8",
    8347: "1.9",
    8350: "2.0",
    8354: "2.2",
    "8356|SE": "2.4",
    8356: "2.3",
    8360: "2.5",
    2372: "2.1",
    2373: "2.1",
    2374: "2.2",
    2376: "2.3",
    2377: "2.3",
    2378: "2.4",
    2379: "2.4",
    2380: "2.5",
    2381: "2.5",
    2382: "2.6",
    2384: "2.7",
    2386: "2.8",
    2387: "2.8",
    2389: "2.9",
    2393: "3.1",
    8374: "2.2",
    8376: "2.3",
    8378: "2.4",
    8379: "2.4",
    8380: "2.5",
    8381: "2.5",
    8382: "2.6",
    8384: "2.7",
    8386: "2.8",
    8387: "2.8",
    8389: "2.9",
    8393: "3.1",
    "2419EE": "1.8",
    "2423HE": "2.0",
    "2425HE": "2.1",
    2427: "2.2",
    2431: "2.4",
    2435: "2.6",
    "2439SE": "2.8",
    "8425HE": "2.1",
    8431: "2.4",
    8435: "2.6",
    "8439SE": "2.8",
    4122: "2.2",
    4130: "2.6",
    "4162EE": "1.7",
    "4164EE": "1.8",
    "4170HE": "2.1",
    "4174HE": "2.3",
    "4176HE": "2.4",
    4180: "2.6",
    4184: "2.8",
    "6124HE": "1.8",
    "6128HE": "2.0",
    "6132HE": "2.2",
    6128: "2.0",
    6134: "2.3",
    6136: "2.4",
    6140: "2.6",
    "6164HE": "1.7",
    "6166HE": "1.8",
    6168: "1.9",
    6172: "2.1",
    6174: "2.2",
    6176: "2.3",
    "6176SE": "2.3",
    "6180SE": "2.5",
    3250: "2.5",
    3260: "2.7",
    3280: "2.4",
    4226: "2.7",
    4228: "2.8",
    4230: "2.9",
    4234: "3.1",
    4238: "3.3",
    4240: "3.4",
    4256: "1.6",
    4274: "2.5",
    4276: "2.6",
    4280: "2.8",
    4284: "3.0",
    6204: "3.3",
    6212: "2.6",
    6220: "3.0",
    6234: "2.4",
    6238: "2.6",
    "6262HE": "1.6",
    6272: "2.1",
    6274: "2.2",
    6276: "2.3",
    6278: "2.4",
    "6282SE": "2.6",
    "6284SE": "2.7",
    6308: "3.5",
    6320: "2.8",
    6328: "3.2",
    "6338P": "2.3",
    6344: "2.6",
    6348: "2.8",
    6366: "1.8",
    "6370P": "2.0",
    6376: "2.3",
    6378: "2.4",
    6380: "2.5",
    6386: "2.8",
    "FX|4100": "3.6",
    "FX|4120": "3.9",
    "FX|4130": "3.8",
    "FX|4150": "3.8",
    "FX|4170": "4.2",
    "FX|6100": "3.3",
    "FX|6120": "3.6",
    "FX|6130": "3.6",
    "FX|6200": "3.8",
    "FX|8100": "2.8",
    "FX|8120": "3.1",
    "FX|8140": "3.2",
    "FX|8150": "3.6",
    "FX|8170": "3.9",
    "FX|4300": "3.8",
    "FX|4320": "4.0",
    "FX|4350": "4.2",
    "FX|6300": "3.5",
    "FX|6350": "3.9",
    "FX|8300": "3.3",
    "FX|8310": "3.4",
    "FX|8320": "3.5",
    "FX|8350": "4.0",
    "FX|8370": "4.0",
    "FX|9370": "4.4",
    "FX|9590": "4.7",
    "FX|8320E": "3.2",
    "FX|8370E": "3.3",
    1200: "3.1",
    "Pro 1200": "3.1",
    "1300X": "3.5",
    "Pro 1300": "3.5",
    1400: "3.2",
    "1500X": "3.5",
    "Pro 1500": "3.5",
    1600: "3.2",
    "1600X": "3.6",
    "Pro 1600": "3.2",
    1700: "3.0",
    "Pro 1700": "3.0",
    "1700X": "3.4",
    "Pro 1700X": "3.4",
    "1800X": "3.6",
    "1900X": "3.8",
    1920: "3.2",
    "1920X": "3.5",
    "1950X": "3.4",
    "200GE": "3.2",
    "Pro 200GE": "3.2",
    "220GE": "3.4",
    "240GE": "3.5",
    "3000G": "3.5",
    "300GE": "3.4",
    "3050GE": "3.4",
    "2200G": "3.5",
    "Pro 2200G": "3.5",
    "2200GE": "3.2",
    "Pro 2200GE": "3.2",
    "2400G": "3.6",
    "Pro 2400G": "3.6",
    "2400GE": "3.2",
    "Pro 2400GE": "3.2",
    "Pro 200U": "2.3",
    "300U": "2.4",
    "2200U": "2.5",
    "3200U": "2.6",
    "2300U": "2.0",
    "Pro 2300U": "2.0",
    "2500U": "2.0",
    "Pro 2500U": "2.2",
    "2600H": "3.2",
    "2700U": "2.0",
    "Pro 2700U": "2.2",
    "2800H": "3.3",
    7351: "2.4",
    "7351P": "2.4",
    7401: "2.0",
    "7401P": "2.0",
    "7551P": "2.0",
    7551: "2.0",
    7251: "2.1",
    7261: "2.5",
    7281: "2.1",
    7301: "2.2",
    7371: "3.1",
    7451: "2.3",
    7501: "2.0",
    7571: "2.2",
    7601: "2.2",
    V1500B: "2.2",
    V1780B: "3.35",
    V1202B: "2.3",
    V1404I: "2.0",
    V1605B: "2.0",
    V1756B: "3.25",
    V1807B: "3.35",
    3101: "2.1",
    3151: "2.7",
    3201: "1.5",
    3251: "2.5",
    3255: "2.5",
    3301: "2.0",
    3351: "1.9",
    3401: "1.85",
    3451: "2.15",
    "1200|AF": "3.1",
    "2300X": "3.5",
    "2500X": "3.6",
    2600: "3.4",
    "2600E": "3.1",
    "1600|AF": "3.2",
    "2600X": "3.6",
    2700: "3.2",
    "2700E": "2.8",
    "Pro 2700": "3.2",
    "2700X": "3.7",
    "Pro 2700X": "3.6",
    "2920X": "3.5",
    "2950X": "3.5",
    "2970WX": "3.0",
    "2990WX": "3.0",
    "Pro 300GE": "3.4",
    "Pro 3125GE": "3.4",
    "3150G": "3.5",
    "Pro 3150G": "3.5",
    "3150GE": "3.3",
    "Pro 3150GE": "3.3",
    "3200G": "3.6",
    "Pro 3200G": "3.6",
    "3200GE": "3.3",
    "Pro 3200GE": "3.3",
    "3350G": "3.6",
    "Pro 3350G": "3.6",
    "3350GE": "3.3",
    "Pro 3350GE": "3.3",
    "3400G": "3.7",
    "Pro 3400G": "3.7",
    "3400GE": "3.3",
    "Pro 3400GE": "3.3",
    "3300U": "2.1",
    "PRO 3300U": "2.1",
    "3450U": "2.1",
    "3500U": "2.1",
    "PRO 3500U": "2.1",
    "3500C": "2.1",
    "3550H": "2.1",
    "3580U": "2.1",
    "3700U": "2.3",
    "PRO 3700U": "2.3",
    "3700C": "2.3",
    "3750H": "2.3",
    "3780U": "2.3",
    3100: "3.6",
    "3300X": "3.8",
    3500: "3.6",
    "3500X": "3.6",
    3600: "3.6",
    "Pro 3600": "3.6",
    "3600X": "3.8",
    "3600XT": "3.8",
    "Pro 3700": "3.6",
    "3700X": "3.6",
    "3800X": "3.9",
    "3800XT": "3.9",
    3900: "3.1",
    "Pro 3900": "3.1",
    "3900X": "3.8",
    "3900XT": "3.8",
    "3950X": "3.5",
    "3960X": "3.8",
    "3970X": "3.7",
    "3990X": "2.9",
    "3945WX": "4.0",
    "3955WX": "3.9",
    "3975WX": "3.5",
    "3995WX": "2.7",
    "4300GE": "3.5",
    "Pro 4300GE": "3.5",
    "4300G": "3.8",
    "Pro 4300G": "3.8",
    "4600GE": "3.3",
    "Pro 4650GE": "3.3",
    "4600G": "3.7",
    "Pro 4650G": "3.7",
    "4700GE": "3.1",
    "Pro 4750GE": "3.1",
    "4700G": "3.6",
    "Pro 4750G": "3.6",
    "4300U": "2.7",
    "4450U": "2.5",
    "Pro 4450U": "2.5",
    "4500U": "2.3",
    "4600U": "2.1",
    "PRO 4650U": "2.1",
    "4680U": "2.1",
    "4600HS": "3.0",
    "4600H": "3.0",
    "4700U": "2.0",
    "PRO 4750U": "1.7",
    "4800U": "1.8",
    "4800HS": "2.9",
    "4800H": "2.9",
    "4900HS": "3.0",
    "4900H": "3.3",
    "5300U": "2.6",
    "5500U": "2.1",
    "5700U": "1.8",
    "7232P": "3.1",
    "7302P": "3.0",
    "7402P": "2.8",
    "7502P": "2.5",
    "7702P": "2.0",
    7252: "3.1",
    7262: "3.2",
    7272: "2.9",
    7282: "2.8",
    7302: "3.0",
    7352: "2.3",
    7402: "2.8",
    7452: "2.35",
    7502: "2.5",
    7532: "2.4",
    7542: "2.9",
    7552: "2.2",
    7642: "2.3",
    7662: "2.0",
    7702: "2.0",
    7742: "2.25",
    "7H12": "2.6",
    "7F32": "3.7",
    "7F52": "3.5",
    "7F72": "3.2",
    "7773X": "2.2",
    7763: "2.45",
    7713: "2.0",
    "7713P": "2.0",
    7663: "2.0",
    7643: "2.3",
    "7573X": "2.8",
    "75F3": "2.95",
    7543: "2.8",
    "7543P": "2.8",
    7513: "2.6",
    "7473X": "2.8",
    7453: "2.75",
    "74F3": "3.2",
    7443: "2.85",
    "7443P": "2.85",
    7413: "2.65",
    "7373X": "3.05",
    "73F3": "3.5",
    7343: "3.2",
    7313: "3.0",
    "7313P": "3.0",
    "72F3": "3.7",
    "5600X": "3.7",
    "5800X": "3.8",
    "5900X": "3.7",
    "5950X": "3.4",
    "5945WX": "4.1",
    "5955WX": "4.0",
    "5965WX": "3.8",
    "5975WX": "3.6",
    "5995WX": "2.7",
    "7960X": "4.2",
    "7970X": "4.0",
    "7980X": "3.2",
    "7965WX": "4.2",
    "7975WX": "4.0",
    "7985WX": "3.2",
    "7995WX": "2.5",
    9754: "2.25",
    "9754S": "2.25",
    9734: "2.2",
    "9684X": "2.55",
    "9384X": "3.1",
    "9184X": "3.55",
    "9654P": "2.4",
    9654: "2.4",
    9634: "2.25",
    "9554P": "3.1",
    9554: "3.1",
    9534: "2.45",
    "9474F": "3.6",
    "9454P": "2.75",
    9454: "2.75",
    "9374F": "3.85",
    "9354P": "3.25",
    9354: "3.25",
    9334: "2.7",
    "9274F": "4.05",
    9254: "2.9",
    9224: "2.5",
    "9174F": "4.1",
    9124: "3.0",
    "4124P": "3.8",
    "4244P": "3.8",
    "4344P": "3.8",
    "4364P": "4.5",
    "4464P": "3.7",
    "4484PX": "4.4",
    "4564P": "4.5",
    "4584PX": "4.2",
    "8024P": "2.4",
    "8024PN": "2.05",
    "8124P": "2.45",
    "8124PN": "2.0",
    "8224P": "2.55",
    "8224PN": "2.0",
    "8324P": "2.65",
    "8324PN": "2.05",
    "8434P": "2.5",
    "8434PN": "2.0",
    "8534P": "2.3",
    "8534PN": "2.0",
    9115: "2.6",
    9135: "3.65",
    "9175F": "4.2",
    9255: "3.25",
    "9275F": "4.1",
    9335: "3.0",
    "9355P": "3.55",
    9355: "3.55",
    "9375F": "3.8",
    9365: "3.4",
    "9455P": "3.15",
    9455: "3.15",
    "9475F": "3.65",
    9535: "2.4",
    "9555P": "3.2",
    9555: "3.2",
    "9575F": "3.3",
    9565: "3.15",
    "9655P": "2.5",
    9655: "2.5",
    9755: "2.7",
    "4245P": "3.9",
    "4345P": "3.8",
    "4465P": "3.4",
    "4545P": "3.0",
    "4565P": "4.3",
    "4585PX": "4.3",
    "5900XT": "3.3",
    5900: "3.0",
    5945: "3.0",
    "5800X3D": "3.4",
    "5800XT": "3.8",
    5800: "3.4",
    "5700X3D": "3.0",
    "5700X": "3.4",
    5845: "3.4",
    "5600X3D": "3.3",
    "5600XT": "3.7",
    "5600T": "3.5",
    5600: "3.5",
    "5600F": "3.0",
    5645: "3.7",
    "5500X3D": "3.0",
    "5980HX": "3.3",
    "5980HS": "3.0",
    "5900HX": "3.3",
    "5900HS": "3.0",
    "5800H": "3.2",
    "5800HS": "2.8",
    "5800U": "1.9",
    "5600H": "3.3",
    "5600HS": "3.0",
    "5600U": "2.3",
    "5560U": "2.3",
    "5400U": "2.7",
    "5825U": "2.0",
    "5625U": "2.3",
    "5425U": "2.7",
    "5125C": "3.0",
    "7730U": "2.0",
    "7530U": "2.0",
    "7430U": "2.3",
    "7330U": "2.3",
    7203: "2.8",
    7303: "2.4",
    "7663P": "2.0",
    "6980HX": "3.3",
    "6980HS": "3.3",
    "6900HX": "3.3",
    "6900HS": "3.3",
    "6800H": "3.2",
    "6800HS": "3.2",
    "6800U": "2.7",
    "6600H": "3.3",
    "6600HS": "3.3",
    "6600U": "2.9",
    "7735HS": "3.2",
    "7735H": "3.2",
    "7736U": "2.7",
    "7735U": "2.7",
    "7435HS": "3.1",
    "7435H": "3.1",
    "7535HS": "3.3",
    "7535H": "3.3",
    "7535U": "2.9",
    "7235HS": "3.2",
    "7235H": "3.2",
    "7335U": "3.0",
    270: "4.0",
    260: "3.8",
    250: "3.3",
    240: "4.3",
    230: "3.5",
    220: "3.0",
    210: "2.8",
    "8945HS": "4.0",
    "8845HS": "3.8",
    "8840HS": "3.3",
    "8840U": "3.3",
    "8645HS": "4.3",
    "8640HS": "3.5",
    "8640U": "3.5",
    "8540U": "3.0",
    "8440U": "2.8",
    "9950X3D": "4.3",
    "9950X": "4.3",
    "9900X3D": "4.4",
    "9900X": "4.4",
    "9800X3D": "4.7",
    "9700X": "3.8",
    "9700F": "3.8",
    "9600X": "3.9",
    9600: "3.8",
    "9500F": "3.8",
    "9995WX": "2.5",
    "9985WX": "3.2",
    "9975WX": "4.0",
    "9965WX": "4.2",
    "9955WX": "4.5",
    "9945WX": "4.7",
    "9980X": "3.2",
    "9970X": "4.0",
    "9960X": "4.2",
    "PRO HX375": "2.0",
    HX375: "2.0",
    "PRO HX370": "2.0",
    HX370: "2.0",
    365: "2.0",
    "PRO 360": "2.0",
    350: "2.0",
    "PRO 350": "2.0",
    340: "2.0",
    "PRO 340": "2.0",
    330: "2.0",
    395: "3.0",
    "PRO 395": "3.0",
    390: "3.2",
    "PRO 390": "3.2",
    385: "3.6",
    "PRO 385": "3.6",
    "PRO 380": "3.6",
    "9955HX3D": "2.3",
    "9955HX": "2.5",
    "9850HX": "3.0",
    9015: "3.6",
    9965: "2.25",
    9845: "2.1",
    9825: "2.2",
    9745: "2.4",
    9645: "2.3"
  };
  var socketTypes = {
    1: "Other",
    2: "Unknown",
    3: "Daughter Board",
    4: "ZIF Socket",
    5: "Replacement/Piggy Back",
    6: "None",
    7: "LIF Socket",
    8: "Slot 1",
    9: "Slot 2",
    10: "370 Pin Socket",
    11: "Slot A",
    12: "Slot M",
    13: "423",
    14: "A (Socket 462)",
    15: "478",
    16: "754",
    17: "940",
    18: "939",
    19: "mPGA604",
    20: "LGA771",
    21: "LGA775",
    22: "S1",
    23: "AM2",
    24: "F (1207)",
    25: "LGA1366",
    26: "G34",
    27: "AM3",
    28: "C32",
    29: "LGA1156",
    30: "LGA1567",
    31: "PGA988A",
    32: "BGA1288",
    33: "rPGA988B",
    34: "BGA1023",
    35: "BGA1224",
    36: "LGA1155",
    37: "LGA1356",
    38: "LGA2011",
    39: "FS1",
    40: "FS2",
    41: "FM1",
    42: "FM2",
    43: "LGA2011-3",
    44: "LGA1356-3",
    45: "LGA1150",
    46: "BGA1168",
    47: "BGA1234",
    48: "BGA1364",
    49: "AM4",
    50: "LGA1151",
    51: "BGA1356",
    52: "BGA1440",
    53: "BGA1515",
    54: "LGA3647-1",
    55: "SP3",
    56: "SP3r2",
    57: "LGA2066",
    58: "BGA1392",
    59: "BGA1510",
    60: "BGA1528",
    61: "LGA4189",
    62: "LGA1200",
    63: "LGA4677",
    64: "LGA1700",
    65: "BGA1744",
    66: "BGA1781",
    67: "BGA1211",
    68: "BGA2422",
    69: "LGA1211",
    70: "LGA2422",
    71: "LGA5773",
    72: "BGA5773",
    73: "AM5",
    74: "SP5",
    75: "SP6",
    76: "BGA883",
    77: "BGA1190",
    78: "BGA4129",
    79: "LGA4710",
    80: "LGA7529",
    81: "BGA1964",
    82: "BGA1792",
    83: "BGA2049",
    84: "BGA2551",
    85: "LGA1851",
    86: "BGA2114",
    87: "BGA2833"
  };
  var socketTypesByName = {
    LGA1150: "i7-5775C i3-4340 i3-4170 G3250 i3-4160T i3-4160 E3-1231 G3258 G3240 i7-4790S i7-4790K i7-4790 i5-4690K i5-4690 i5-4590T i5-4590S i5-4590 i5-4460 i3-4360 i3-4150 G1820 G3420 G3220 i7-4771 i5-4440 i3-4330 i3-4130T i3-4130 E3-1230 i7-4770S i7-4770K i7-4770 i5-4670K i5-4670 i5-4570T i5-4570S i5-4570 i5-4430",
    LGA1151: "i9-9900KS E-2288G E-2224 G5420 i9-9900T i9-9900 i7-9700T i7-9700F i7-9700E i7-9700 i5-9600 i5-9500T i5-9500F i5-9500 i5-9400T i3-9350K i3-9300 i3-9100T i3-9100F i3-9100 G4930 i9-9900KF i7-9700KF i5-9600KF i5-9400F i5-9400 i3-9350KF i9-9900K i7-9700K i5-9600K G5500 G5400 i7-8700T i7-8086K i5-8600 i5-8500T i5-8500 i5-8400T i3-8300 i3-8100T G4900 i7-8700K i7-8700 i5-8600K i5-8400 i3-8350K i3-8100 E3-1270 G4600 G4560 i7-7700T i7-7700K i7-7700 i5-7600K i5-7600 i5-7500T i5-7500 i5-7400 i3-7350K i3-7300 i3-7100T i3-7100 G3930 G3900 G4400 i7-6700T i7-6700K i7-6700 i5-6600K i5-6600 i5-6500T i5-6500 i5-6400T i5-6400 i3-6300 i3-6100T i3-6100 E3-1270 E3-1270 T4500 T4400",
    1155: "G440 G460 G465 G470 G530T G540T G550T G1610T G1620T G530 G540 G1610 G550 G1620 G555 G1630 i3-2100T i3-2120T i3-3220T i3-3240T i3-3250T i3-2100 i3-2105 i3-2102 i3-3210 i3-3220 i3-2125 i3-2120 i3-3225 i3-2130 i3-3245 i3-3240 i3-3250 i5-3570T i5-2500T i5-2400S i5-2405S i5-2390T i5-3330S i5-2500S i5-3335S i5-2300 i5-3450S i5-3340S i5-3470S i5-3475S i5-3470T i5-2310 i5-3550S i5-2320 i5-3330 i5-3350P i5-3450 i5-2400 i5-3340 i5-3570S i5-2380P i5-2450P i5-3470 i5-2500K i5-3550 i5-2500 i5-3570 i5-3570K i5-2550K i7-3770T i7-2600S i7-3770S i7-2600K i7-2600 i7-3770 i7-3770K i7-2700K G620T G630T G640T G2020T G645T G2100T G2030T G622 G860T G620 G632 G2120T G630 G640 G2010 G840 G2020 G850 G645 G2030 G860 G2120 G870 G2130 G2140 E3-1220L E3-1220L E3-1260L E3-1265L E3-1220 E3-1225 E3-1220 E3-1235 E3-1225 E3-1230 E3-1230 E3-1240 E3-1245 E3-1270 E3-1275 E3-1240 E3-1245 E3-1270 E3-1280 E3-1275 E3-1290 E3-1280 E3-1290"
  };
  function getSocketTypesByName(str) {
    let result2 = "";
    for (const key in socketTypesByName) {
      const names = socketTypesByName[key].split(" ");
      names.forEach((element) => {
        if (str.indexOf(element) >= 0) {
          result2 = key;
        }
      });
    }
    return result2;
  }
  function cpuManufacturer(str) {
    let result2 = str;
    str = str.toLowerCase();
    if (str.indexOf("intel") >= 0) {
      result2 = "Intel";
    }
    if (str.indexOf("amd") >= 0) {
      result2 = "AMD";
    }
    if (str.indexOf("qemu") >= 0) {
      result2 = "QEMU";
    }
    if (str.indexOf("hygon") >= 0) {
      result2 = "Hygon";
    }
    if (str.indexOf("centaur") >= 0) {
      result2 = "WinChip/Via";
    }
    if (str.indexOf("vmware") >= 0) {
      result2 = "VMware";
    }
    if (str.indexOf("Xen") >= 0) {
      result2 = "Xen Hypervisor";
    }
    if (str.indexOf("tcg") >= 0) {
      result2 = "QEMU";
    }
    if (str.indexOf("apple") >= 0) {
      result2 = "Apple";
    }
    if (str.indexOf("sifive") >= 0) {
      result2 = "SiFive";
    }
    if (str.indexOf("thead") >= 0) {
      result2 = "T-Head";
    }
    if (str.indexOf("andestech") >= 0) {
      result2 = "Andes Technology";
    }
    return result2;
  }
  function cpuBrandManufacturer(res) {
    res.brand = res.brand.replace(/\(R\)+/g, "®").replace(/\s+/g, " ").trim();
    res.brand = res.brand.replace(/\(TM\)+/g, "™").replace(/\s+/g, " ").trim();
    res.brand = res.brand.replace(/\(C\)+/g, "©").replace(/\s+/g, " ").trim();
    res.brand = res.brand.replace(/CPU+/g, "").replace(/\s+/g, " ").trim();
    res.manufacturer = cpuManufacturer(res.brand);
    let parts = res.brand.split(" ");
    parts.shift();
    res.brand = parts.join(" ");
    return res;
  }
  function getAMDSpeed(brand) {
    let result2 = "0";
    for (let key in AMDBaseFrequencies) {
      if ({}.hasOwnProperty.call(AMDBaseFrequencies, key)) {
        let parts = key.split("|");
        let found = 0;
        parts.forEach((item) => {
          if (brand.indexOf(item) > -1) {
            found++;
          }
        });
        if (found === parts.length) {
          result2 = AMDBaseFrequencies[key];
        }
      }
    }
    return parseFloat(result2);
  }
  function getCpu() {
    return new Promise((resolve) => {
      process.nextTick(() => {
        const UNKNOWN = "unknown";
        let result2 = {
          manufacturer: UNKNOWN,
          brand: UNKNOWN,
          vendor: "",
          family: "",
          model: "",
          stepping: "",
          revision: "",
          voltage: "",
          speed: 0,
          speedMin: 0,
          speedMax: 0,
          governor: "",
          cores: util.cores(),
          physicalCores: util.cores(),
          performanceCores: util.cores(),
          efficiencyCores: 0,
          processors: 1,
          socket: "",
          flags: "",
          virtualization: false,
          cache: {}
        };
        cpuFlags().then((flags) => {
          result2.flags = flags;
          result2.virtualization = flags.indexOf("vmx") > -1 || flags.indexOf("svm") > -1;
          if (_darwin) {
            exec("sysctl machdep.cpu hw.cpufrequency_max hw.cpufrequency_min hw.packages hw.physicalcpu_max hw.ncpu hw.tbfrequency hw.cpufamily hw.cpusubfamily", (error2, stdout) => {
              const lines = stdout.toString().split(`
`);
              const modelline = util.getValue(lines, "machdep.cpu.brand_string");
              const modellineParts = modelline.split("@");
              result2.brand = modellineParts[0].trim();
              const speed = modellineParts[1] ? modellineParts[1].trim() : "0";
              result2.speed = parseFloat(speed.replace(/GHz+/g, ""));
              let tbFrequency = util.getValue(lines, "hw.tbfrequency") / 1e9;
              tbFrequency = tbFrequency < 0.1 ? tbFrequency * 100 : tbFrequency;
              result2.speed = result2.speed === 0 ? tbFrequency : result2.speed;
              _cpu_speed = result2.speed;
              result2 = cpuBrandManufacturer(result2);
              result2.speedMin = util.getValue(lines, "hw.cpufrequency_min") ? util.getValue(lines, "hw.cpufrequency_min") / 1e9 : result2.speed;
              result2.speedMax = util.getValue(lines, "hw.cpufrequency_max") ? util.getValue(lines, "hw.cpufrequency_max") / 1e9 : result2.speed;
              result2.vendor = util.getValue(lines, "machdep.cpu.vendor") || "Apple";
              result2.family = util.getValue(lines, "machdep.cpu.family") || util.getValue(lines, "hw.cpufamily");
              result2.model = util.getValue(lines, "machdep.cpu.model");
              result2.stepping = util.getValue(lines, "machdep.cpu.stepping") || util.getValue(lines, "hw.cpusubfamily");
              result2.virtualization = true;
              const countProcessors = util.getValue(lines, "hw.packages");
              const countCores = util.getValue(lines, "hw.physicalcpu_max");
              const countThreads = util.getValue(lines, "hw.ncpu");
              if (os.arch() === "arm64") {
                result2.socket = "SOC";
                try {
                  const clusters = execSync("ioreg -c IOPlatformDevice -d 3 -r | grep cluster-type").toString().split(`
`);
                  const efficiencyCores = clusters.filter((line) => line.indexOf('"E"') >= 0).length;
                  const performanceCores = clusters.filter((line) => line.indexOf('"P"') >= 0).length;
                  result2.efficiencyCores = efficiencyCores;
                  result2.performanceCores = performanceCores;
                } catch {
                  util.noop();
                }
              }
              if (countProcessors) {
                result2.processors = parseInt(countProcessors, 10) || 1;
              }
              if (countCores && countThreads) {
                result2.cores = parseInt(countThreads) || util.cores();
                result2.physicalCores = parseInt(countCores) || util.cores();
              }
              cpuCache().then((res) => {
                result2.cache = res;
                resolve(result2);
              });
            });
          }
          if (_linux) {
            let modelline = "";
            let lines = [];
            if (os.cpus()[0] && os.cpus()[0].model) {
              modelline = os.cpus()[0].model;
            }
            exec('export LC_ALL=C; lscpu; echo -n "Governor: "; cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor 2>/dev/null; echo; unset LC_ALL', (error2, stdout) => {
              if (!error2) {
                lines = stdout.toString().split(`
`);
              }
              modelline = util.getValue(lines, "model name") || modelline;
              modelline = util.getValue(lines, "bios model name") || modelline;
              modelline = util.cleanString(modelline);
              const modellineParts = modelline.split("@");
              result2.brand = modellineParts[0].trim();
              if (result2.brand.indexOf("Unknown") >= 0) {
                result2.brand = result2.brand.split("Unknown")[0].trim();
              }
              result2.speed = modellineParts[1] ? parseFloat(modellineParts[1].trim()) : 0;
              if (result2.speed === 0 && (result2.brand.indexOf("AMD") > -1 || result2.brand.toLowerCase().indexOf("ryzen") > -1)) {
                result2.speed = getAMDSpeed(result2.brand);
              }
              if (result2.speed === 0) {
                const current = getCpuCurrentSpeedSync();
                if (current.avg !== 0) {
                  result2.speed = current.avg;
                }
              }
              _cpu_speed = result2.speed;
              result2.speedMin = Math.round(parseFloat(util.getValue(lines, "cpu min mhz").replace(/,/g, ".")) / 10) / 100;
              result2.speedMax = Math.round(parseFloat(util.getValue(lines, "cpu max mhz").replace(/,/g, ".")) / 10) / 100;
              result2 = cpuBrandManufacturer(result2);
              result2.vendor = cpuManufacturer(util.getValue(lines, "vendor id"));
              result2.family = util.getValue(lines, "cpu family");
              result2.model = util.getValue(lines, "model:");
              result2.stepping = util.getValue(lines, "stepping");
              result2.revision = util.getValue(lines, "cpu revision");
              result2.cache.l1d = util.getValue(lines, "l1d cache");
              if (result2.cache.l1d) {
                result2.cache.l1d = parseInt(result2.cache.l1d) * (result2.cache.l1d.indexOf("M") !== -1 ? 1024 * 1024 : result2.cache.l1d.indexOf("K") !== -1 ? 1024 : 1);
              }
              result2.cache.l1i = util.getValue(lines, "l1i cache");
              if (result2.cache.l1i) {
                result2.cache.l1i = parseInt(result2.cache.l1i) * (result2.cache.l1i.indexOf("M") !== -1 ? 1024 * 1024 : result2.cache.l1i.indexOf("K") !== -1 ? 1024 : 1);
              }
              result2.cache.l2 = util.getValue(lines, "l2 cache");
              if (result2.cache.l2) {
                result2.cache.l2 = parseInt(result2.cache.l2) * (result2.cache.l2.indexOf("M") !== -1 ? 1024 * 1024 : result2.cache.l2.indexOf("K") !== -1 ? 1024 : 1);
              }
              result2.cache.l3 = util.getValue(lines, "l3 cache");
              if (result2.cache.l3) {
                result2.cache.l3 = parseInt(result2.cache.l3) * (result2.cache.l3.indexOf("M") !== -1 ? 1024 * 1024 : result2.cache.l3.indexOf("K") !== -1 ? 1024 : 1);
              }
              const threadsPerCore = util.getValue(lines, "thread(s) per core") || "1";
              const processors = util.getValue(lines, "socket(s)") || "1";
              const threadsPerCoreInt = parseInt(threadsPerCore, 10);
              const processorsInt = parseInt(processors, 10) || 1;
              const coresPerSocket = parseInt(util.getValue(lines, "core(s) per socket"), 10);
              result2.physicalCores = coresPerSocket ? coresPerSocket * processorsInt : result2.cores / threadsPerCoreInt;
              result2.performanceCores = threadsPerCoreInt > 1 ? result2.cores - result2.physicalCores : result2.cores;
              result2.efficiencyCores = threadsPerCoreInt > 1 ? result2.cores - threadsPerCoreInt * result2.performanceCores : 0;
              result2.processors = processorsInt;
              result2.governor = util.getValue(lines, "governor") || "";
              if (result2.vendor === "ARM" && util.isRaspberry()) {
                const rPIRevision = util.decodePiCpuinfo();
                result2.family = result2.manufacturer;
                result2.manufacturer = rPIRevision.manufacturer;
                result2.brand = rPIRevision.processor;
                result2.revision = rPIRevision.revisionCode;
                result2.socket = "SOC";
              }
              if (util.getValue(lines, "architecture") === "riscv64") {
                const linesRiscV = fs.readFileSync("/proc/cpuinfo").toString().split(`
`);
                const uarch = util.getValue(linesRiscV, "uarch") || "";
                if (uarch.indexOf(",") > -1) {
                  const split = uarch.split(",");
                  result2.manufacturer = cpuManufacturer(split[0]);
                  result2.brand = split[1];
                }
              }
              let lines2 = [];
              exec('export LC_ALL=C; dmidecode –t 4 2>/dev/null | grep "Upgrade: Socket"; unset LC_ALL', (error22, stdout2) => {
                lines2 = stdout2.toString().split(`
`);
                if (lines2 && lines2.length) {
                  result2.socket = util.getValue(lines2, "Upgrade").replace("Socket", "").trim() || result2.socket;
                }
                resolve(result2);
              });
            });
          }
          if (_freebsd || _openbsd || _netbsd) {
            let modelline = "";
            let lines = [];
            if (os.cpus()[0] && os.cpus()[0].model) {
              modelline = os.cpus()[0].model;
            }
            exec("export LC_ALL=C; dmidecode -t 4; dmidecode -t 7 unset LC_ALL", (error2, stdout) => {
              let cache = [];
              if (!error2) {
                const data = stdout.toString().split("# dmidecode");
                const processor = data.length > 1 ? data[1] : "";
                cache = data.length > 2 ? data[2].split("Cache Information") : [];
                lines = processor.split(`
`);
              }
              result2.brand = modelline.split("@")[0].trim();
              result2.speed = modelline.split("@")[1] ? parseFloat(modelline.split("@")[1].trim()) : 0;
              if (result2.speed === 0 && (result2.brand.indexOf("AMD") > -1 || result2.brand.toLowerCase().indexOf("ryzen") > -1)) {
                result2.speed = getAMDSpeed(result2.brand);
              }
              if (result2.speed === 0) {
                const current = getCpuCurrentSpeedSync();
                if (current.avg !== 0) {
                  result2.speed = current.avg;
                }
              }
              _cpu_speed = result2.speed;
              result2.speedMin = result2.speed;
              result2.speedMax = Math.round(parseFloat(util.getValue(lines, "max speed").replace(/Mhz/g, "")) / 10) / 100;
              result2 = cpuBrandManufacturer(result2);
              result2.vendor = cpuManufacturer(util.getValue(lines, "manufacturer"));
              let sig = util.getValue(lines, "signature");
              sig = sig.split(",");
              for (let i = 0;i < sig.length; i++) {
                sig[i] = sig[i].trim();
              }
              result2.family = util.getValue(sig, "Family", " ", true);
              result2.model = util.getValue(sig, "Model", " ", true);
              result2.stepping = util.getValue(sig, "Stepping", " ", true);
              result2.revision = "";
              const voltage = parseFloat(util.getValue(lines, "voltage"));
              result2.voltage = isNaN(voltage) ? "" : voltage.toFixed(2);
              for (let i = 0;i < cache.length; i++) {
                lines = cache[i].split(`
`);
                let cacheType = util.getValue(lines, "Socket Designation").toLowerCase().replace(" ", "-").split("-");
                cacheType = cacheType.length ? cacheType[0] : "";
                const sizeParts = util.getValue(lines, "Installed Size").split(" ");
                let size = parseInt(sizeParts[0], 10);
                const unit = sizeParts.length > 1 ? sizeParts[1] : "kb";
                size = size * (unit === "kb" ? 1024 : unit === "mb" ? 1024 * 1024 : unit === "gb" ? 1024 * 1024 * 1024 : 1);
                if (cacheType) {
                  if (cacheType === "l1") {
                    result2.cache[cacheType + "d"] = size / 2;
                    result2.cache[cacheType + "i"] = size / 2;
                  } else {
                    result2.cache[cacheType] = size;
                  }
                }
              }
              result2.socket = util.getValue(lines, "Upgrade").replace("Socket", "").trim();
              const threadCount = util.getValue(lines, "thread count").trim();
              const coreCount = util.getValue(lines, "core count").trim();
              if (coreCount && threadCount) {
                result2.cores = parseInt(threadCount, 10);
                result2.physicalCores = parseInt(coreCount, 10);
              }
              resolve(result2);
            });
          }
          if (_sunos) {
            resolve(result2);
          }
          if (_windows) {
            try {
              const workload = [];
              workload.push(util.powerShell("Get-CimInstance Win32_processor | select Name, Revision, L2CacheSize, L3CacheSize, Manufacturer, MaxClockSpeed, Description, UpgradeMethod, Caption, NumberOfLogicalProcessors, NumberOfCores | fl"));
              workload.push(util.powerShell("Get-CimInstance Win32_CacheMemory | select CacheType,InstalledSize,Level | fl"));
              workload.push(util.powerShell("(Get-CimInstance Win32_ComputerSystem).HypervisorPresent"));
              Promise.all(workload).then((data) => {
                let lines = data[0].split(`\r
`);
                let name = util.getValue(lines, "name", ":") || "";
                if (name.indexOf("@") >= 0) {
                  result2.brand = name.split("@")[0].trim();
                  result2.speed = name.split("@")[1] ? parseFloat(name.split("@")[1].trim()) : 0;
                  _cpu_speed = result2.speed;
                } else {
                  result2.brand = name.trim();
                  result2.speed = 0;
                }
                result2 = cpuBrandManufacturer(result2);
                result2.revision = util.getValue(lines, "revision", ":");
                result2.vendor = util.getValue(lines, "manufacturer", ":");
                result2.speedMax = Math.round(parseFloat(util.getValue(lines, "maxclockspeed", ":").replace(/,/g, ".")) / 10) / 100;
                if (result2.speed === 0 && (result2.brand.indexOf("AMD") > -1 || result2.brand.toLowerCase().indexOf("ryzen") > -1)) {
                  result2.speed = getAMDSpeed(result2.brand);
                }
                if (result2.speed === 0) {
                  result2.speed = result2.speedMax;
                }
                result2.speedMin = result2.speed;
                let description = util.getValue(lines, "description", ":").split(" ");
                for (let i = 0;i < description.length; i++) {
                  if (description[i].toLowerCase().startsWith("family") && i + 1 < description.length && description[i + 1]) {
                    result2.family = description[i + 1];
                  }
                  if (description[i].toLowerCase().startsWith("model") && i + 1 < description.length && description[i + 1]) {
                    result2.model = description[i + 1];
                  }
                  if (description[i].toLowerCase().startsWith("stepping") && i + 1 < description.length && description[i + 1]) {
                    result2.stepping = description[i + 1];
                  }
                }
                const socketId = util.getValue(lines, "UpgradeMethod", ":");
                if (socketTypes[socketId]) {
                  result2.socket = socketTypes[socketId];
                }
                const socketByName = getSocketTypesByName(name);
                if (socketByName) {
                  result2.socket = socketByName;
                }
                const countProcessors = util.countLines(lines, "Caption");
                const countThreads = util.getValue(lines, "NumberOfLogicalProcessors", ":");
                const countCores = util.getValue(lines, "NumberOfCores", ":");
                if (countProcessors) {
                  result2.processors = parseInt(countProcessors) || 1;
                }
                if (countCores && countThreads) {
                  result2.cores = parseInt(countThreads) || util.cores();
                  result2.physicalCores = parseInt(countCores) || util.cores();
                }
                if (countProcessors > 1) {
                  result2.cores = result2.cores * countProcessors;
                  result2.physicalCores = result2.physicalCores * countProcessors;
                }
                result2.cache = parseWinCache(data[0], data[1]);
                const hyperv = data[2] ? data[2].toString().toLowerCase() : "";
                result2.virtualization = hyperv.indexOf("true") !== -1;
                resolve(result2);
              });
            } catch (e) {
              resolve(result2);
            }
          }
        });
      });
    });
  }
  function cpu(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        getCpu().then((result2) => {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        });
      });
    });
  }
  exports.cpu = cpu;
  function getCpuCurrentSpeedSync() {
    const cpus = os.cpus();
    let minFreq = 999999999;
    let maxFreq = 0;
    let avgFreq = 0;
    const cores = [];
    const speeds = [];
    if (cpus && cpus.length && Object.prototype.hasOwnProperty.call(cpus[0], "speed")) {
      for (let i in cpus) {
        speeds.push(cpus[i].speed > 100 ? (cpus[i].speed + 1) / 1000 : cpus[i].speed / 10);
      }
    } else if (_linux) {
      try {
        const speedStrings = execSync('cat /proc/cpuinfo | grep "cpu MHz" | cut -d " " -f 3', util.execOptsLinux).toString().split(`
`).filter((line) => line.length > 0);
        for (let i in speedStrings) {
          speeds.push(Math.floor(parseInt(speedStrings[i], 10) / 10) / 100);
        }
      } catch {
        util.noop();
      }
    }
    if (speeds && speeds.length) {
      try {
        for (const i in speeds) {
          avgFreq = avgFreq + speeds[i];
          if (speeds[i] > maxFreq) {
            maxFreq = speeds[i];
          }
          if (speeds[i] < minFreq) {
            minFreq = speeds[i];
          }
          cores.push(parseFloat(speeds[i].toFixed(2)));
        }
        avgFreq = avgFreq / speeds.length;
        return {
          min: parseFloat(minFreq.toFixed(2)),
          max: parseFloat(maxFreq.toFixed(2)),
          avg: parseFloat(avgFreq.toFixed(2)),
          cores
        };
      } catch (e) {
        return {
          min: 0,
          max: 0,
          avg: 0,
          cores
        };
      }
    } else {
      return {
        min: 0,
        max: 0,
        avg: 0,
        cores
      };
    }
  }
  function cpuCurrentSpeed(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = getCpuCurrentSpeedSync();
        if (result2.avg === 0 && _cpu_speed !== 0) {
          const currCpuSpeed = parseFloat(_cpu_speed);
          result2 = {
            min: currCpuSpeed,
            max: currCpuSpeed,
            avg: currCpuSpeed,
            cores: []
          };
        }
        if (callback) {
          callback(result2);
        }
        resolve(result2);
      });
    });
  }
  exports.cpuCurrentSpeed = cpuCurrentSpeed;
  function cpuTemperature(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = {
          main: null,
          cores: [],
          max: null,
          socket: [],
          chipset: null
        };
        if (_linux) {
          try {
            const cmd2 = 'cat /sys/class/thermal/thermal_zone*/type  2>/dev/null; echo "-----"; cat /sys/class/thermal/thermal_zone*/temp 2>/dev/null;';
            const parts = execSync(cmd2, util.execOptsLinux).toString().split(`-----
`);
            if (parts.length === 2) {
              const lines = parts[0].split(`
`);
              const lines2 = parts[1].split(`
`);
              for (let i = 0;i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.startsWith("acpi") && lines2[i]) {
                  result2.socket.push(Math.round(parseInt(lines2[i], 10) / 100) / 10);
                }
                if (line.startsWith("pch") && lines2[i]) {
                  result2.chipset = Math.round(parseInt(lines2[i], 10) / 100) / 10;
                }
              }
            }
          } catch (e) {
            util.noop();
          }
          const cmd = 'for mon in /sys/class/hwmon/hwmon*; do for label in "$mon"/temp*_label; do if [ -f $label ]; then value=${label%_*}_input; echo $(cat "$label")___$(cat "$value"); fi; done; done;';
          try {
            exec(cmd, (error2, stdout) => {
              stdout = stdout.toString();
              const tdiePos = stdout.toLowerCase().indexOf("tdie");
              if (tdiePos !== -1) {
                stdout = stdout.substring(tdiePos);
              }
              const lines = stdout.split(`
`);
              let tctl = 0;
              lines.forEach((line) => {
                const parts = line.split("___");
                const label = parts[0];
                const value = parts.length > 1 && parts[1] ? parts[1] : "0";
                if (value && label && label.toLowerCase() === "tctl") {
                  tctl = result2.main = Math.round(parseInt(value, 10) / 100) / 10;
                }
                if (value && (label === undefined || label && label.toLowerCase().startsWith("core"))) {
                  result2.cores.push(Math.round(parseInt(value, 10) / 100) / 10);
                } else if (value && label && result2.main === null && (label.toLowerCase().indexOf("package") >= 0 || label.toLowerCase().indexOf("physical") >= 0 || label.toLowerCase() === "tccd1")) {
                  result2.main = Math.round(parseInt(value, 10) / 100) / 10;
                }
              });
              if (tctl && result2.main === null) {
                result2.main = tctl;
              }
              if (result2.cores.length > 0) {
                if (result2.main === null) {
                  result2.main = Math.round(result2.cores.reduce((a, b) => a + b, 0) / result2.cores.length);
                }
                let maxtmp = Math.max.apply(Math, result2.cores);
                result2.max = maxtmp > result2.main ? maxtmp : result2.main;
              }
              if (result2.main !== null) {
                if (result2.max === null) {
                  result2.max = result2.main;
                }
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
                return;
              }
              exec("sensors", (error3, stdout2) => {
                if (!error3) {
                  const lines2 = stdout2.toString().split(`
`);
                  let tdieTemp = null;
                  let newSectionStarts = true;
                  let section = "";
                  lines2.forEach((line) => {
                    if (line.trim() === "") {
                      newSectionStarts = true;
                    } else if (newSectionStarts) {
                      if (line.trim().toLowerCase().startsWith("acpi")) {
                        section = "acpi";
                      }
                      if (line.trim().toLowerCase().startsWith("pch")) {
                        section = "pch";
                      }
                      if (line.trim().toLowerCase().startsWith("core")) {
                        section = "core";
                      }
                      if (line.trim().toLowerCase().startsWith("k10temp")) {
                        section = "coreAMD";
                      }
                      newSectionStarts = false;
                    }
                    const regex = /[+-]([^°]*)/g;
                    const temps = line.match(regex);
                    const firstPart = line.split(":")[0].toUpperCase();
                    if (section === "acpi") {
                      if (firstPart.indexOf("TEMP") !== -1) {
                        result2.socket.push(parseFloat(temps));
                      }
                    } else if (section === "pch") {
                      if (firstPart.indexOf("TEMP") !== -1 && !result2.chipset) {
                        result2.chipset = parseFloat(temps);
                      }
                    }
                    if (firstPart.indexOf("PHYSICAL") !== -1 || firstPart.indexOf("PACKAGE") !== -1 || section === "coreAMD" && firstPart.indexOf("TDIE") !== -1 || firstPart.indexOf("TEMP") !== -1) {
                      result2.main = parseFloat(temps);
                    }
                    if (firstPart.indexOf("CORE ") !== -1) {
                      result2.cores.push(parseFloat(temps));
                    }
                    if (firstPart.indexOf("TDIE") !== -1 && tdieTemp === null) {
                      tdieTemp = parseFloat(temps);
                    }
                  });
                  if (result2.cores.length > 0) {
                    result2.main = Math.round(result2.cores.reduce((a, b) => a + b, 0) / result2.cores.length);
                    const maxtmp = Math.max.apply(Math, result2.cores);
                    result2.max = maxtmp > result2.main ? maxtmp : result2.main;
                  } else {
                    if (result2.main === null && tdieTemp !== null) {
                      result2.main = tdieTemp;
                      result2.max = tdieTemp;
                    }
                  }
                  if (result2.main !== null && result2.max === null) {
                    result2.max = result2.main;
                  }
                  if (result2.main !== null || result2.max !== null) {
                    if (callback) {
                      callback(result2);
                    }
                    resolve(result2);
                    return;
                  }
                }
                fs.stat("/sys/class/thermal/thermal_zone0/temp", (err) => {
                  if (err === null) {
                    fs.readFile("/sys/class/thermal/thermal_zone0/temp", (error4, stdout3) => {
                      if (!error4) {
                        const lines2 = stdout3.toString().split(`
`);
                        if (lines2.length > 0) {
                          result2.main = parseFloat(lines2[0]) / 1000;
                          result2.max = result2.main;
                        }
                      }
                      if (callback) {
                        callback(result2);
                      }
                      resolve(result2);
                    });
                  } else {
                    exec("/opt/vc/bin/vcgencmd measure_temp", (error4, stdout3) => {
                      if (!error4) {
                        const lines2 = stdout3.toString().split(`
`);
                        if (lines2.length > 0 && lines2[0].indexOf("=")) {
                          result2.main = parseFloat(lines2[0].split("=")[1]);
                          result2.max = result2.main;
                        }
                      }
                      if (callback) {
                        callback(result2);
                      }
                      resolve(result2);
                    });
                  }
                });
              });
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
        if (_freebsd || _openbsd || _netbsd) {
          exec("sysctl dev.cpu | grep temp", (error2, stdout) => {
            if (!error2) {
              const lines = stdout.toString().split(`
`);
              let sum = 0;
              lines.forEach((line) => {
                const parts = line.split(":");
                if (parts.length > 1) {
                  const temp = parseFloat(parts[1].replace(",", "."));
                  if (temp > result2.max) {
                    result2.max = temp;
                  }
                  sum = sum + temp;
                  result2.cores.push(temp);
                }
              });
              if (result2.cores.length) {
                result2.main = Math.round(sum / result2.cores.length * 100) / 100;
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_darwin) {
          try {
            const osxTemp = (()=>{throw new Error("Cannot require module "+"osx-temperature-sensor");})();
            result2 = osxTemp.cpuTemperature();
            if (result2.main) {
              result2.main = Math.round(result2.main * 100) / 100;
            }
            if (result2.max) {
              result2.max = Math.round(result2.max * 100) / 100;
            }
            if (result2 && result2.cores && result2.cores.length) {
              for (let i = 0;i < result2.cores.length; i++) {
                result2.cores[i] = Math.round(result2.cores[i] * 100) / 100;
              }
            }
          } catch {
            util.noop();
          }
          try {
            const macosTemp = (()=>{throw new Error("Cannot require module "+"macos-temperature-sensor");})();
            const res = macosTemp.temperature();
            if (res.cpu) {
              result2.main = Math.round(res.cpu * 100) / 100;
              result2.max = result2.main;
            }
            if (res.soc) {
              result2.chipset = Math.round(res.soc * 100) / 100;
            }
            if (res && res.cpuDieTemps.length) {
              for (const temp of res.cpuDieTemps) {
                result2.cores.push(Math.round(temp * 100) / 100);
              }
            }
          } catch {
            util.noop();
          }
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
        if (_sunos) {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
        if (_windows) {
          try {
            util.powerShell('Get-CimInstance MSAcpi_ThermalZoneTemperature -Namespace "root/wmi" | Select CurrentTemperature').then((stdout, error2) => {
              if (!error2) {
                let sum = 0;
                const lines = stdout.split(`\r
`).filter((line) => line.trim() !== "").filter((line, idx) => idx > 0);
                lines.forEach((line) => {
                  const value = (parseInt(line, 10) - 2732) / 10;
                  if (!isNaN(value)) {
                    sum = sum + value;
                    if (value > result2.max) {
                      result2.max = value;
                    }
                    result2.cores.push(value);
                  }
                });
                if (result2.cores.length) {
                  result2.main = sum / result2.cores.length;
                }
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  exports.cpuTemperature = cpuTemperature;
  function cpuFlags(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = "";
        if (_windows) {
          try {
            exec('reg query "HKEY_LOCAL_MACHINE\\HARDWARE\\DESCRIPTION\\System\\CentralProcessor\\0" /v FeatureSet', util.execOptsWin, (error2, stdout) => {
              if (!error2) {
                let flag_hex = stdout.split("0x").pop().trim();
                let flag_bin_unpadded = parseInt(flag_hex, 16).toString(2);
                let flag_bin = "0".repeat(32 - flag_bin_unpadded.length) + flag_bin_unpadded;
                let all_flags = [
                  "fpu",
                  "vme",
                  "de",
                  "pse",
                  "tsc",
                  "msr",
                  "pae",
                  "mce",
                  "cx8",
                  "apic",
                  "",
                  "sep",
                  "mtrr",
                  "pge",
                  "mca",
                  "cmov",
                  "pat",
                  "pse-36",
                  "psn",
                  "clfsh",
                  "",
                  "ds",
                  "acpi",
                  "mmx",
                  "fxsr",
                  "sse",
                  "sse2",
                  "ss",
                  "htt",
                  "tm",
                  "ia64",
                  "pbe"
                ];
                for (let f = 0;f < all_flags.length; f++) {
                  if (flag_bin[f] === "1" && all_flags[f] !== "") {
                    result2 += " " + all_flags[f];
                  }
                }
                result2 = result2.trim().toLowerCase();
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
        if (_linux) {
          try {
            exec("export LC_ALL=C; lscpu; unset LC_ALL", (error2, stdout) => {
              if (!error2) {
                let lines = stdout.toString().split(`
`);
                lines.forEach((line) => {
                  if (line.split(":")[0].toUpperCase().indexOf("FLAGS") !== -1) {
                    result2 = line.split(":")[1].trim().toLowerCase();
                  }
                });
              }
              if (!result2) {
                fs.readFile("/proc/cpuinfo", (error3, stdout2) => {
                  if (!error3) {
                    let lines = stdout2.toString().split(`
`);
                    result2 = util.getValue(lines, "features", ":", true).toLowerCase();
                  }
                  if (callback) {
                    callback(result2);
                  }
                  resolve(result2);
                });
              } else {
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              }
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
        if (_freebsd || _openbsd || _netbsd) {
          exec("export LC_ALL=C; dmidecode -t 4 2>/dev/null; unset LC_ALL", (error2, stdout) => {
            const flags = [];
            if (!error2) {
              const parts = stdout.toString().split("\tFlags:");
              const lines = parts.length > 1 ? parts[1].split("\tVersion:")[0].split(`
`) : [];
              lines.forEach((line) => {
                const flag = (line.indexOf("(") ? line.split("(")[0].toLowerCase() : "").trim().replace(/\t/g, "");
                if (flag) {
                  flags.push(flag);
                }
              });
            }
            result2 = flags.join(" ").trim().toLowerCase();
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_darwin) {
          exec("sysctl machdep.cpu.features", (error2, stdout) => {
            if (!error2) {
              let lines = stdout.toString().split(`
`);
              if (lines.length > 0 && lines[0].indexOf("machdep.cpu.features:") !== -1) {
                result2 = lines[0].split(":")[1].trim().toLowerCase();
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_sunos) {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
      });
    });
  }
  exports.cpuFlags = cpuFlags;
  function cpuCache(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = {
          l1d: null,
          l1i: null,
          l2: null,
          l3: null
        };
        if (_linux) {
          try {
            exec("export LC_ALL=C; lscpu; unset LC_ALL", (error2, stdout) => {
              if (!error2) {
                const lines = stdout.toString().split(`
`);
                lines.forEach((line) => {
                  const parts = line.split(":");
                  if (parts[0].toUpperCase().indexOf("L1D CACHE") !== -1) {
                    result2.l1d = parseInt(parts[1].trim()) * (parts[1].indexOf("M") !== -1 ? 1024 * 1024 : parts[1].indexOf("K") !== -1 ? 1024 : 1);
                  }
                  if (parts[0].toUpperCase().indexOf("L1I CACHE") !== -1) {
                    result2.l1i = parseInt(parts[1].trim()) * (parts[1].indexOf("M") !== -1 ? 1024 * 1024 : parts[1].indexOf("K") !== -1 ? 1024 : 1);
                  }
                  if (parts[0].toUpperCase().indexOf("L2 CACHE") !== -1) {
                    result2.l2 = parseInt(parts[1].trim()) * (parts[1].indexOf("M") !== -1 ? 1024 * 1024 : parts[1].indexOf("K") !== -1 ? 1024 : 1);
                  }
                  if (parts[0].toUpperCase().indexOf("L3 CACHE") !== -1) {
                    result2.l3 = parseInt(parts[1].trim()) * (parts[1].indexOf("M") !== -1 ? 1024 * 1024 : parts[1].indexOf("K") !== -1 ? 1024 : 1);
                  }
                });
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
        if (_freebsd || _openbsd || _netbsd) {
          exec("export LC_ALL=C; dmidecode -t 7 2>/dev/null; unset LC_ALL", (error2, stdout) => {
            let cache = [];
            if (!error2) {
              const data = stdout.toString();
              cache = data.split("Cache Information");
              cache.shift();
            }
            for (let i = 0;i < cache.length; i++) {
              const lines = cache[i].split(`
`);
              let cacheType = util.getValue(lines, "Socket Designation").toLowerCase().replace(" ", "-").split("-");
              cacheType = cacheType.length ? cacheType[0] : "";
              const sizeParts = util.getValue(lines, "Installed Size").split(" ");
              let size = parseInt(sizeParts[0], 10);
              const unit = sizeParts.length > 1 ? sizeParts[1] : "kb";
              size = size * (unit === "kb" ? 1024 : unit === "mb" ? 1024 * 1024 : unit === "gb" ? 1024 * 1024 * 1024 : 1);
              if (cacheType) {
                if (cacheType === "l1") {
                  result2.cache[cacheType + "d"] = size / 2;
                  result2.cache[cacheType + "i"] = size / 2;
                } else {
                  result2.cache[cacheType] = size;
                }
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_darwin) {
          exec("sysctl hw.l1icachesize hw.l1dcachesize hw.l2cachesize hw.l3cachesize", (error2, stdout) => {
            if (!error2) {
              let lines = stdout.toString().split(`
`);
              lines.forEach((line) => {
                let parts = line.split(":");
                if (parts[0].toLowerCase().indexOf("hw.l1icachesize") !== -1) {
                  result2.l1d = parseInt(parts[1].trim()) * (parts[1].indexOf("K") !== -1 ? 1024 : 1);
                }
                if (parts[0].toLowerCase().indexOf("hw.l1dcachesize") !== -1) {
                  result2.l1i = parseInt(parts[1].trim()) * (parts[1].indexOf("K") !== -1 ? 1024 : 1);
                }
                if (parts[0].toLowerCase().indexOf("hw.l2cachesize") !== -1) {
                  result2.l2 = parseInt(parts[1].trim()) * (parts[1].indexOf("K") !== -1 ? 1024 : 1);
                }
                if (parts[0].toLowerCase().indexOf("hw.l3cachesize") !== -1) {
                  result2.l3 = parseInt(parts[1].trim()) * (parts[1].indexOf("K") !== -1 ? 1024 : 1);
                }
              });
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_sunos) {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
        if (_windows) {
          try {
            const workload = [];
            workload.push(util.powerShell("Get-CimInstance Win32_processor | select L2CacheSize, L3CacheSize | fl"));
            workload.push(util.powerShell("Get-CimInstance Win32_CacheMemory | select CacheType,InstalledSize,Level | fl"));
            Promise.all(workload).then((data) => {
              result2 = parseWinCache(data[0], data[1]);
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  function parseWinCache(linesProc, linesCache) {
    const result2 = {
      l1d: null,
      l1i: null,
      l2: null,
      l3: null
    };
    let lines = linesProc.split(`\r
`);
    result2.l1d = 0;
    result2.l1i = 0;
    result2.l2 = util.getValue(lines, "l2cachesize", ":");
    result2.l3 = util.getValue(lines, "l3cachesize", ":");
    if (result2.l2) {
      result2.l2 = parseInt(result2.l2, 10) * 1024;
    } else {
      result2.l2 = 0;
    }
    if (result2.l3) {
      result2.l3 = parseInt(result2.l3, 10) * 1024;
    } else {
      result2.l3 = 0;
    }
    const parts = linesCache.split(/\n\s*\n/);
    let l1i = 0;
    let l1d = 0;
    let l2 = 0;
    parts.forEach((part) => {
      const lines2 = part.split(`\r
`);
      const cacheType = util.getValue(lines2, "CacheType");
      const level = util.getValue(lines2, "Level");
      const installedSize = util.getValue(lines2, "InstalledSize");
      if (level === "3" && cacheType === "3") {
        result2.l1i = result2.l1i + parseInt(installedSize, 10) * 1024;
      }
      if (level === "3" && cacheType === "4") {
        result2.l1d = result2.l1d + parseInt(installedSize, 10) * 1024;
      }
      if (level === "3" && cacheType === "5") {
        l1i = parseInt(installedSize, 10) / 2;
        l1d = parseInt(installedSize, 10) / 2;
      }
      if (level === "4" && cacheType === "5") {
        l2 = l2 + parseInt(installedSize, 10) * 1024;
      }
    });
    if (!result2.l1i && !result2.l1d) {
      result2.l1i = l1i;
      result2.l1d = l1d;
    }
    if (l2) {
      result2.l2 = l2;
    }
    return result2;
  }
  exports.cpuCache = cpuCache;
  function getLoad() {
    return new Promise((resolve) => {
      process.nextTick(() => {
        const loads = os.loadavg().map((x) => {
          return x / util.cores();
        });
        const avgLoad = parseFloat(Math.max.apply(Math, loads).toFixed(2));
        let result2 = {};
        const now = Date.now() - _current_cpu.ms;
        if (now >= 200) {
          _current_cpu.ms = Date.now();
          const cpus = os.cpus().map((cpu2) => {
            cpu2.times.steal = 0;
            cpu2.times.guest = 0;
            return cpu2;
          });
          let totalUser = 0;
          let totalSystem = 0;
          let totalNice = 0;
          let totalIrq = 0;
          let totalIdle = 0;
          let totalSteal = 0;
          let totalGuest = 0;
          const cores = [];
          _corecount = cpus && cpus.length ? cpus.length : 0;
          if (_linux) {
            try {
              const lines = execSync("cat /proc/stat 2>/dev/null | grep cpu", util.execOptsLinux).toString().split(`
`);
              if (lines.length > 1) {
                lines.shift();
                if (lines.length === cpus.length) {
                  for (let i = 0;i < lines.length; i++) {
                    let parts = lines[i].split(" ");
                    if (parts.length >= 10) {
                      const steal = parseFloat(parts[8]) || 0;
                      const guest = parseFloat(parts[9]) || 0;
                      cpus[i].times.steal = steal;
                      cpus[i].times.guest = guest;
                    }
                  }
                }
              }
            } catch {
              util.noop();
            }
          }
          for (let i = 0;i < _corecount; i++) {
            const cpu2 = cpus[i].times;
            totalUser += cpu2.user;
            totalSystem += cpu2.sys;
            totalNice += cpu2.nice;
            totalIdle += cpu2.idle;
            totalIrq += cpu2.irq;
            totalSteal += cpu2.steal || 0;
            totalGuest += cpu2.guest || 0;
            const tmpTick = _cpus && _cpus[i] && _cpus[i].totalTick ? _cpus[i].totalTick : 0;
            const tmpLoad = _cpus && _cpus[i] && _cpus[i].totalLoad ? _cpus[i].totalLoad : 0;
            const tmpUser = _cpus && _cpus[i] && _cpus[i].user ? _cpus[i].user : 0;
            const tmpSystem = _cpus && _cpus[i] && _cpus[i].sys ? _cpus[i].sys : 0;
            const tmpNice = _cpus && _cpus[i] && _cpus[i].nice ? _cpus[i].nice : 0;
            const tmpIdle = _cpus && _cpus[i] && _cpus[i].idle ? _cpus[i].idle : 0;
            const tmpIrq = _cpus && _cpus[i] && _cpus[i].irq ? _cpus[i].irq : 0;
            const tmpSteal = _cpus && _cpus[i] && _cpus[i].steal ? _cpus[i].steal : 0;
            const tmpGuest = _cpus && _cpus[i] && _cpus[i].guest ? _cpus[i].guest : 0;
            _cpus[i] = cpu2;
            _cpus[i].totalTick = _cpus[i].user + _cpus[i].sys + _cpus[i].nice + _cpus[i].irq + _cpus[i].steal + _cpus[i].guest + _cpus[i].idle;
            _cpus[i].totalLoad = _cpus[i].user + _cpus[i].sys + _cpus[i].nice + _cpus[i].irq + _cpus[i].steal + _cpus[i].guest;
            _cpus[i].currentTick = _cpus[i].totalTick - tmpTick;
            _cpus[i].load = _cpus[i].totalLoad - tmpLoad;
            _cpus[i].loadUser = _cpus[i].user - tmpUser;
            _cpus[i].loadSystem = _cpus[i].sys - tmpSystem;
            _cpus[i].loadNice = _cpus[i].nice - tmpNice;
            _cpus[i].loadIdle = _cpus[i].idle - tmpIdle;
            _cpus[i].loadIrq = _cpus[i].irq - tmpIrq;
            _cpus[i].loadSteal = _cpus[i].steal - tmpSteal;
            _cpus[i].loadGuest = _cpus[i].guest - tmpGuest;
            cores[i] = {};
            cores[i].load = _cpus[i].load / _cpus[i].currentTick * 100;
            cores[i].loadUser = _cpus[i].loadUser / _cpus[i].currentTick * 100;
            cores[i].loadSystem = _cpus[i].loadSystem / _cpus[i].currentTick * 100;
            cores[i].loadNice = _cpus[i].loadNice / _cpus[i].currentTick * 100;
            cores[i].loadIdle = _cpus[i].loadIdle / _cpus[i].currentTick * 100;
            cores[i].loadIrq = _cpus[i].loadIrq / _cpus[i].currentTick * 100;
            cores[i].loadSteal = _cpus[i].loadSteal / _cpus[i].currentTick * 100;
            cores[i].loadGuest = _cpus[i].loadGuest / _cpus[i].currentTick * 100;
            cores[i].rawLoad = _cpus[i].load;
            cores[i].rawLoadUser = _cpus[i].loadUser;
            cores[i].rawLoadSystem = _cpus[i].loadSystem;
            cores[i].rawLoadNice = _cpus[i].loadNice;
            cores[i].rawLoadIdle = _cpus[i].loadIdle;
            cores[i].rawLoadIrq = _cpus[i].loadIrq;
            cores[i].rawLoadSteal = _cpus[i].loadSteal;
            cores[i].rawLoadGuest = _cpus[i].loadGuest;
          }
          const totalTick = totalUser + totalSystem + totalNice + totalIrq + totalSteal + totalGuest + totalIdle;
          const totalLoad = totalUser + totalSystem + totalNice + totalIrq + totalSteal + totalGuest;
          const currentTick = totalTick - _current_cpu.tick;
          result2 = {
            avgLoad,
            currentLoad: (totalLoad - _current_cpu.load) / currentTick * 100,
            currentLoadUser: (totalUser - _current_cpu.user) / currentTick * 100,
            currentLoadSystem: (totalSystem - _current_cpu.system) / currentTick * 100,
            currentLoadNice: (totalNice - _current_cpu.nice) / currentTick * 100,
            currentLoadIdle: (totalIdle - _current_cpu.idle) / currentTick * 100,
            currentLoadIrq: (totalIrq - _current_cpu.irq) / currentTick * 100,
            currentLoadSteal: (totalSteal - _current_cpu.steal) / currentTick * 100,
            currentLoadGuest: (totalGuest - _current_cpu.guest) / currentTick * 100,
            rawCurrentLoad: totalLoad - _current_cpu.load,
            rawCurrentLoadUser: totalUser - _current_cpu.user,
            rawCurrentLoadSystem: totalSystem - _current_cpu.system,
            rawCurrentLoadNice: totalNice - _current_cpu.nice,
            rawCurrentLoadIdle: totalIdle - _current_cpu.idle,
            rawCurrentLoadIrq: totalIrq - _current_cpu.irq,
            rawCurrentLoadSteal: totalSteal - _current_cpu.steal,
            rawCurrentLoadGuest: totalGuest - _current_cpu.guest,
            cpus: cores
          };
          _current_cpu = {
            user: totalUser,
            nice: totalNice,
            system: totalSystem,
            idle: totalIdle,
            irq: totalIrq,
            steal: totalSteal,
            guest: totalGuest,
            tick: totalTick,
            load: totalLoad,
            ms: _current_cpu.ms,
            currentLoad: result2.currentLoad,
            currentLoadUser: result2.currentLoadUser,
            currentLoadSystem: result2.currentLoadSystem,
            currentLoadNice: result2.currentLoadNice,
            currentLoadIdle: result2.currentLoadIdle,
            currentLoadIrq: result2.currentLoadIrq,
            currentLoadSteal: result2.currentLoadSteal,
            currentLoadGuest: result2.currentLoadGuest,
            rawCurrentLoad: result2.rawCurrentLoad,
            rawCurrentLoadUser: result2.rawCurrentLoadUser,
            rawCurrentLoadSystem: result2.rawCurrentLoadSystem,
            rawCurrentLoadNice: result2.rawCurrentLoadNice,
            rawCurrentLoadIdle: result2.rawCurrentLoadIdle,
            rawCurrentLoadIrq: result2.rawCurrentLoadIrq,
            rawCurrentLoadSteal: result2.rawCurrentLoadSteal,
            rawCurrentLoadGuest: result2.rawCurrentLoadGuest
          };
        } else {
          const cores = [];
          for (let i = 0;i < _corecount; i++) {
            cores[i] = {};
            cores[i].load = _cpus[i].load / _cpus[i].currentTick * 100;
            cores[i].loadUser = _cpus[i].loadUser / _cpus[i].currentTick * 100;
            cores[i].loadSystem = _cpus[i].loadSystem / _cpus[i].currentTick * 100;
            cores[i].loadNice = _cpus[i].loadNice / _cpus[i].currentTick * 100;
            cores[i].loadIdle = _cpus[i].loadIdle / _cpus[i].currentTick * 100;
            cores[i].loadIrq = _cpus[i].loadIrq / _cpus[i].currentTick * 100;
            cores[i].rawLoad = _cpus[i].load;
            cores[i].rawLoadUser = _cpus[i].loadUser;
            cores[i].rawLoadSystem = _cpus[i].loadSystem;
            cores[i].rawLoadNice = _cpus[i].loadNice;
            cores[i].rawLoadIdle = _cpus[i].loadIdle;
            cores[i].rawLoadIrq = _cpus[i].loadIrq;
            cores[i].rawLoadSteal = _cpus[i].loadSteal;
            cores[i].rawLoadGuest = _cpus[i].loadGuest;
          }
          result2 = {
            avgLoad,
            currentLoad: _current_cpu.currentLoad,
            currentLoadUser: _current_cpu.currentLoadUser,
            currentLoadSystem: _current_cpu.currentLoadSystem,
            currentLoadNice: _current_cpu.currentLoadNice,
            currentLoadIdle: _current_cpu.currentLoadIdle,
            currentLoadIrq: _current_cpu.currentLoadIrq,
            currentLoadSteal: _current_cpu.currentLoadSteal,
            currentLoadGuest: _current_cpu.currentLoadGuest,
            rawCurrentLoad: _current_cpu.rawCurrentLoad,
            rawCurrentLoadUser: _current_cpu.rawCurrentLoadUser,
            rawCurrentLoadSystem: _current_cpu.rawCurrentLoadSystem,
            rawCurrentLoadNice: _current_cpu.rawCurrentLoadNice,
            rawCurrentLoadIdle: _current_cpu.rawCurrentLoadIdle,
            rawCurrentLoadIrq: _current_cpu.rawCurrentLoadIrq,
            rawCurrentLoadSteal: _current_cpu.rawCurrentLoadSteal,
            rawCurrentLoadGuest: _current_cpu.rawCurrentLoadGuest,
            cpus: cores
          };
        }
        resolve(result2);
      });
    });
  }
  function currentLoad(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        getLoad().then((result2) => {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        });
      });
    });
  }
  exports.currentLoad = currentLoad;
  function getFullLoad() {
    return new Promise((resolve) => {
      process.nextTick(() => {
        const cpus = os.cpus();
        let totalUser = 0;
        let totalSystem = 0;
        let totalNice = 0;
        let totalIrq = 0;
        let totalIdle = 0;
        let result2 = 0;
        if (cpus && cpus.length) {
          for (let i = 0, len = cpus.length;i < len; i++) {
            const cpu2 = cpus[i].times;
            totalUser += cpu2.user;
            totalSystem += cpu2.sys;
            totalNice += cpu2.nice;
            totalIrq += cpu2.irq;
            totalIdle += cpu2.idle;
          }
          const totalTicks = totalIdle + totalIrq + totalNice + totalSystem + totalUser;
          result2 = (totalTicks - totalIdle) / totalTicks * 100;
        }
        resolve(result2);
      });
    });
  }
  function fullLoad(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        getFullLoad().then((result2) => {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        });
      });
    });
  }
  exports.fullLoad = fullLoad;
});

// node_modules/systeminformation/lib/memory.js
var require_memory = __commonJS((exports) => {
  var os = __require("os");
  var exec = __require("child_process").exec;
  var execSync = __require("child_process").execSync;
  var util = require_util();
  var fs = __require("fs");
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  var RAM_manufacturers = {
    "00CE": "Samsung Electronics Inc",
    "014F": "Transcend Information Inc.",
    "017A": "Apacer Technology Inc.",
    "0198": "HyperX",
    "029E": "Corsair",
    "02FE": "Elpida",
    "04CB": "A-DATA",
    "04CD": "G.Skill International Enterprise",
    "059B": "Crucial",
    1315: "Crucial",
    "2C00": "Micron Technology Inc.",
    5105: "Qimonda AG i. In.",
    "802C": "Micron Technology Inc.",
    "80AD": "Hynix Semiconductor Inc.",
    "80CE": "Samsung Electronics Inc.",
    8551: "Qimonda AG i. In.",
    "859B": "Crucial",
    AD00: "Hynix Semiconductor Inc.",
    CE00: "Samsung Electronics Inc.",
    SAMSUNG: "Samsung Electronics Inc.",
    HYNIX: "Hynix Semiconductor Inc.",
    "G-SKILL": "G-Skill International Enterprise",
    "G.SKILL": "G-Skill International Enterprise",
    TRANSCEND: "Transcend Information",
    APACER: "Apacer Technology Inc",
    MICRON: "Micron Technology Inc.",
    QIMONDA: "Qimonda AG i. In."
  };
  function mem(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = {
          total: os.totalmem(),
          free: os.freemem(),
          used: os.totalmem() - os.freemem(),
          active: os.totalmem() - os.freemem(),
          available: os.freemem(),
          buffers: 0,
          cached: 0,
          slab: 0,
          buffcache: 0,
          reclaimable: 0,
          swaptotal: 0,
          swapused: 0,
          swapfree: 0,
          writeback: null,
          dirty: null
        };
        if (_linux) {
          try {
            fs.readFile("/proc/meminfo", (error2, stdout) => {
              if (!error2) {
                const lines = stdout.toString().split(`
`);
                result2.total = parseInt(util.getValue(lines, "memtotal"), 10);
                result2.total = result2.total ? result2.total * 1024 : os.totalmem();
                result2.free = parseInt(util.getValue(lines, "memfree"), 10);
                result2.free = result2.free ? result2.free * 1024 : os.freemem();
                result2.used = result2.total - result2.free;
                result2.buffers = parseInt(util.getValue(lines, "buffers"), 10);
                result2.buffers = result2.buffers ? result2.buffers * 1024 : 0;
                result2.cached = parseInt(util.getValue(lines, "cached"), 10);
                result2.cached = result2.cached ? result2.cached * 1024 : 0;
                result2.slab = parseInt(util.getValue(lines, "slab"), 10);
                result2.slab = result2.slab ? result2.slab * 1024 : 0;
                result2.buffcache = result2.buffers + result2.cached + result2.slab;
                let available = parseInt(util.getValue(lines, "memavailable"), 10);
                result2.available = available ? available * 1024 : result2.free + result2.buffcache;
                result2.active = result2.total - result2.available;
                result2.swaptotal = parseInt(util.getValue(lines, "swaptotal"), 10);
                result2.swaptotal = result2.swaptotal ? result2.swaptotal * 1024 : 0;
                result2.swapfree = parseInt(util.getValue(lines, "swapfree"), 10);
                result2.swapfree = result2.swapfree ? result2.swapfree * 1024 : 0;
                result2.swapused = result2.swaptotal - result2.swapfree;
                result2.writeback = parseInt(util.getValue(lines, "writeback"), 10);
                result2.writeback = result2.writeback ? result2.writeback * 1024 : 0;
                result2.dirty = parseInt(util.getValue(lines, "dirty"), 10);
                result2.dirty = result2.dirty ? result2.dirty * 1024 : 0;
                result2.reclaimable = parseInt(util.getValue(lines, "sreclaimable"), 10);
                result2.reclaimable = result2.reclaimable ? result2.reclaimable * 1024 : 0;
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
        if (_freebsd || _openbsd || _netbsd) {
          try {
            exec("/sbin/sysctl hw.realmem hw.physmem vm.stats.vm.v_page_count vm.stats.vm.v_wire_count vm.stats.vm.v_active_count vm.stats.vm.v_inactive_count vm.stats.vm.v_cache_count vm.stats.vm.v_free_count vm.stats.vm.v_page_size", (error2, stdout) => {
              if (!error2) {
                const lines = stdout.toString().split(`
`);
                const pagesize = parseInt(util.getValue(lines, "vm.stats.vm.v_page_size"), 10);
                const inactive = parseInt(util.getValue(lines, "vm.stats.vm.v_inactive_count"), 10) * pagesize;
                const cache = parseInt(util.getValue(lines, "vm.stats.vm.v_cache_count"), 10) * pagesize;
                result2.total = parseInt(util.getValue(lines, "hw.realmem"), 10);
                if (isNaN(result2.total)) {
                  result2.total = parseInt(util.getValue(lines, "hw.physmem"), 10);
                }
                result2.free = parseInt(util.getValue(lines, "vm.stats.vm.v_free_count"), 10) * pagesize;
                result2.buffcache = inactive + cache;
                result2.available = result2.buffcache + result2.free;
                result2.active = result2.total - result2.free - result2.buffcache;
                result2.swaptotal = 0;
                result2.swapfree = 0;
                result2.swapused = 0;
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
        if (_sunos) {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
        if (_darwin) {
          let pageSize = 4096;
          try {
            let sysPpageSize = util.toInt(execSync("sysctl -n vm.pagesize").toString());
            pageSize = sysPpageSize || pageSize;
          } catch {
            util.noop();
          }
          try {
            exec('vm_stat 2>/dev/null | egrep "Pages active|Pages inactive"', (error2, stdout) => {
              if (!error2) {
                let lines = stdout.toString().split(`
`);
                result2.active = (parseInt(util.getValue(lines, "Pages active"), 10) || 0) * pageSize;
                result2.reclaimable = (parseInt(util.getValue(lines, "Pages inactive"), 10) || 0) * pageSize;
                result2.buffcache = result2.used - result2.active;
                result2.available = result2.free + result2.buffcache;
              }
              exec("sysctl -n vm.swapusage 2>/dev/null", (error3, stdout2) => {
                if (!error3) {
                  let lines = stdout2.toString().split(`
`);
                  if (lines.length > 0) {
                    let firstline = lines[0].replace(/,/g, ".").replace(/M/g, "");
                    let lineArray = firstline.trim().split("  ");
                    lineArray.forEach((line) => {
                      if (line.toLowerCase().indexOf("total") !== -1) {
                        result2.swaptotal = parseFloat(line.split("=")[1].trim()) * 1024 * 1024;
                      }
                      if (line.toLowerCase().indexOf("used") !== -1) {
                        result2.swapused = parseFloat(line.split("=")[1].trim()) * 1024 * 1024;
                      }
                      if (line.toLowerCase().indexOf("free") !== -1) {
                        result2.swapfree = parseFloat(line.split("=")[1].trim()) * 1024 * 1024;
                      }
                    });
                  }
                }
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              });
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
        if (_windows) {
          let swaptotal = 0;
          let swapused = 0;
          try {
            util.powerShell("Get-CimInstance Win32_PageFileUsage | Select AllocatedBaseSize, CurrentUsage").then((stdout, error2) => {
              if (!error2) {
                let lines = stdout.split(`\r
`).filter((line) => line.trim() !== "").filter((line, idx) => idx > 0);
                lines.forEach((line) => {
                  if (line !== "") {
                    line = line.trim().split(/\s\s+/);
                    swaptotal = swaptotal + (parseInt(line[0], 10) || 0);
                    swapused = swapused + (parseInt(line[1], 10) || 0);
                  }
                });
              }
              result2.swaptotal = swaptotal * 1024 * 1024;
              result2.swapused = swapused * 1024 * 1024;
              result2.swapfree = result2.swaptotal - result2.swapused;
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  exports.mem = mem;
  function memLayout(callback) {
    function getManufacturer(manId) {
      const manIdSearch = manId.replace("0x", "").toUpperCase();
      if (manIdSearch.length >= 4 && {}.hasOwnProperty.call(RAM_manufacturers, manIdSearch)) {
        return RAM_manufacturers[manIdSearch];
      }
      return manId;
    }
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = [];
        if (_linux || _freebsd || _openbsd || _netbsd) {
          exec('export LC_ALL=C; dmidecode -t memory 2>/dev/null | grep -iE "Size:|Type|Speed|Manufacturer|Form Factor|Locator|Memory Device|Serial Number|Voltage|Part Number"; unset LC_ALL', (error2, stdout) => {
            if (!error2) {
              const devices = stdout.toString().split("Memory Device");
              devices.shift();
              devices.forEach((device) => {
                const lines = device.split(`
`);
                const sizeString = util.getValue(lines, "Size");
                const size = sizeString.indexOf("GB") >= 0 ? parseInt(sizeString, 10) * 1024 * 1024 * 1024 : parseInt(sizeString, 10) * 1024 * 1024;
                let bank = util.getValue(lines, "Bank Locator");
                if (bank.toLowerCase().indexOf("bad") >= 0) {
                  bank = "";
                }
                if (parseInt(util.getValue(lines, "Size"), 10) > 0) {
                  const totalWidth = util.toInt(util.getValue(lines, "Total Width"));
                  const dataWidth = util.toInt(util.getValue(lines, "Data Width"));
                  result2.push({
                    size,
                    bank,
                    type: util.getValue(lines, "Type:"),
                    ecc: dataWidth && totalWidth ? totalWidth > dataWidth : false,
                    clockSpeed: util.getValue(lines, "Configured Clock Speed:") ? parseInt(util.getValue(lines, "Configured Clock Speed:"), 10) : util.getValue(lines, "Speed:") ? parseInt(util.getValue(lines, "Speed:"), 10) : null,
                    formFactor: util.getValue(lines, "Form Factor:"),
                    manufacturer: getManufacturer(util.getValue(lines, "Manufacturer:")),
                    partNum: util.getValue(lines, "Part Number:"),
                    serialNum: util.getValue(lines, "Serial Number:"),
                    voltageConfigured: parseFloat(util.getValue(lines, "Configured Voltage:")) || null,
                    voltageMin: parseFloat(util.getValue(lines, "Minimum Voltage:")) || null,
                    voltageMax: parseFloat(util.getValue(lines, "Maximum Voltage:")) || null
                  });
                } else {
                  result2.push({
                    size: 0,
                    bank,
                    type: "Empty",
                    ecc: null,
                    clockSpeed: 0,
                    formFactor: util.getValue(lines, "Form Factor:"),
                    partNum: "",
                    serialNum: "",
                    voltageConfigured: null,
                    voltageMin: null,
                    voltageMax: null
                  });
                }
              });
            }
            if (!result2.length) {
              result2.push({
                size: os.totalmem(),
                bank: "",
                type: "",
                ecc: null,
                clockSpeed: 0,
                formFactor: "",
                partNum: "",
                serialNum: "",
                voltageConfigured: null,
                voltageMin: null,
                voltageMax: null
              });
              try {
                let stdout2 = execSync("cat /proc/cpuinfo 2>/dev/null", util.execOptsLinux);
                let lines = stdout2.toString().split(`
`);
                let version = util.getValue(lines, "revision", ":", true).toLowerCase();
                if (util.isRaspberry(lines)) {
                  const clockSpeed = {
                    0: 400,
                    1: 450,
                    2: 450,
                    3: 3200,
                    4: 4267
                  };
                  result2[0].type = "LPDDR2";
                  result2[0].type = version && version[2] && version[2] === "3" ? "LPDDR4" : result2[0].type;
                  result2[0].type = version && version[2] && version[2] === "4" ? "LPDDR4X" : result2[0].type;
                  result2[0].ecc = false;
                  result2[0].clockSpeed = version && version[2] && clockSpeed[version[2]] || 400;
                  result2[0].clockSpeed = version && version[4] && version[4] === "d" ? 500 : result2[0].clockSpeed;
                  result2[0].formFactor = "SoC";
                  stdout2 = execSync("vcgencmd get_config sdram_freq 2>/dev/null", util.execOptsLinux);
                  lines = stdout2.toString().split(`
`);
                  let freq = parseInt(util.getValue(lines, "sdram_freq", "=", true), 10) || 0;
                  if (freq) {
                    result2[0].clockSpeed = freq;
                  }
                  stdout2 = execSync("vcgencmd measure_volts sdram_p 2>/dev/null", util.execOptsLinux);
                  lines = stdout2.toString().split(`
`);
                  let voltage = parseFloat(util.getValue(lines, "volt", "=", true)) || 0;
                  if (voltage) {
                    result2[0].voltageConfigured = voltage;
                    result2[0].voltageMin = voltage;
                    result2[0].voltageMax = voltage;
                  }
                }
              } catch {
                util.noop();
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_darwin) {
          exec("system_profiler SPMemoryDataType", (error2, stdout) => {
            if (!error2) {
              const allLines = stdout.toString().split(`
`);
              const eccStatus = util.getValue(allLines, "ecc", ":", true).toLowerCase();
              let devices = stdout.toString().split("        BANK ");
              let hasBank = true;
              if (devices.length === 1) {
                devices = stdout.toString().split("        DIMM");
                hasBank = false;
              }
              devices.shift();
              devices.forEach((device) => {
                const lines = device.split(`
`);
                const bank = (hasBank ? "BANK " : "DIMM") + lines[0].trim().split("/")[0];
                const size = parseInt(util.getValue(lines, "          Size"));
                if (size) {
                  result2.push({
                    size: size * 1024 * 1024 * 1024,
                    bank,
                    type: util.getValue(lines, "          Type:"),
                    ecc: eccStatus ? eccStatus === "enabled" : null,
                    clockSpeed: parseInt(util.getValue(lines, "          Speed:"), 10),
                    formFactor: "",
                    manufacturer: getManufacturer(util.getValue(lines, "          Manufacturer:")),
                    partNum: util.getValue(lines, "          Part Number:"),
                    serialNum: util.getValue(lines, "          Serial Number:"),
                    voltageConfigured: null,
                    voltageMin: null,
                    voltageMax: null
                  });
                } else {
                  result2.push({
                    size: 0,
                    bank,
                    type: "Empty",
                    ecc: null,
                    clockSpeed: 0,
                    formFactor: "",
                    manufacturer: "",
                    partNum: "",
                    serialNum: "",
                    voltageConfigured: null,
                    voltageMin: null,
                    voltageMax: null
                  });
                }
              });
            }
            if (!result2.length) {
              const lines = stdout.toString().split(`
`);
              const size = parseInt(util.getValue(lines, "      Memory:"));
              const type = util.getValue(lines, "      Type:");
              const manufacturerId = util.getValue(lines, "      Manufacturer:");
              if (size && type) {
                result2.push({
                  size: size * 1024 * 1024 * 1024,
                  bank: "0",
                  type,
                  ecc: false,
                  clockSpeed: null,
                  formFactor: "SOC",
                  manufacturer: getManufacturer(manufacturerId),
                  partNum: "",
                  serialNum: "",
                  voltageConfigured: null,
                  voltageMin: null,
                  voltageMax: null
                });
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_sunos) {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
        if (_windows) {
          const memoryTypes = "Unknown|Other|DRAM|Synchronous DRAM|Cache DRAM|EDO|EDRAM|VRAM|SRAM|RAM|ROM|FLASH|EEPROM|FEPROM|EPROM|CDRAM|3DRAM|SDRAM|SGRAM|RDRAM|DDR|DDR2|DDR2 FB-DIMM|Reserved|DDR3|FBD2|DDR4|LPDDR|LPDDR2|LPDDR3|LPDDR4|Logical non-volatile device|HBM|HBM2|DDR5|LPDDR5".split("|");
          const FormFactors = "Unknown|Other|SIP|DIP|ZIP|SOJ|Proprietary|SIMM|DIMM|TSOP|PGA|RIMM|SODIMM|SRIMM|SMD|SSMP|QFP|TQFP|SOIC|LCC|PLCC|BGA|FPBGA|LGA".split("|");
          try {
            util.powerShell("Get-CimInstance Win32_PhysicalMemory | select DataWidth,TotalWidth,Capacity,BankLabel,MemoryType,SMBIOSMemoryType,ConfiguredClockSpeed,Speed,FormFactor,Manufacturer,PartNumber,SerialNumber,ConfiguredVoltage,MinVoltage,MaxVoltage,Tag | fl").then((stdout, error2) => {
              if (!error2) {
                const devices = stdout.toString().split(/\n\s*\n/);
                devices.shift();
                devices.forEach((device) => {
                  const lines = device.split(`\r
`);
                  const dataWidth = util.toInt(util.getValue(lines, "DataWidth", ":"));
                  const totalWidth = util.toInt(util.getValue(lines, "TotalWidth", ":"));
                  const size = parseInt(util.getValue(lines, "Capacity", ":"), 10) || 0;
                  const tag = util.getValue(lines, "Tag", ":");
                  const tagInt = util.splitByNumber(tag);
                  if (size) {
                    result2.push({
                      size,
                      bank: util.getValue(lines, "BankLabel", ":") + (tagInt[1] ? "/" + tagInt[1] : ""),
                      type: memoryTypes[parseInt(util.getValue(lines, "MemoryType", ":"), 10) || parseInt(util.getValue(lines, "SMBIOSMemoryType", ":"), 10)],
                      ecc: dataWidth && totalWidth ? totalWidth > dataWidth : false,
                      clockSpeed: parseInt(util.getValue(lines, "ConfiguredClockSpeed", ":"), 10) || parseInt(util.getValue(lines, "Speed", ":"), 10) || 0,
                      formFactor: FormFactors[parseInt(util.getValue(lines, "FormFactor", ":"), 10) || 0],
                      manufacturer: getManufacturer(util.getValue(lines, "Manufacturer", ":")),
                      partNum: util.getValue(lines, "PartNumber", ":"),
                      serialNum: util.getValue(lines, "SerialNumber", ":"),
                      voltageConfigured: (parseInt(util.getValue(lines, "ConfiguredVoltage", ":"), 10) || 0) / 1000,
                      voltageMin: (parseInt(util.getValue(lines, "MinVoltage", ":"), 10) || 0) / 1000,
                      voltageMax: (parseInt(util.getValue(lines, "MaxVoltage", ":"), 10) || 0) / 1000
                    });
                  }
                });
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  exports.memLayout = memLayout;
});

// node_modules/systeminformation/lib/battery.js
var require_battery = __commonJS((exports, module) => {
  var exec = __require("child_process").exec;
  var fs = __require("fs");
  var util = require_util();
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  function parseWinBatteryPart(lines, designedCapacity, fullChargeCapacity) {
    const result2 = {};
    let status = parseInt(util.getValue(lines, "BatteryStatus", ":").trim(), 10) || 0;
    if (status >= 0) {
      const statusValue = status;
      result2.status = statusValue;
      result2.hasBattery = true;
      result2.maxCapacity = fullChargeCapacity || parseInt(util.getValue(lines, "DesignCapacity", ":") || 0);
      result2.designedCapacity = parseInt(util.getValue(lines, "DesignCapacity", ":") || designedCapacity);
      result2.voltage = (parseInt(util.getValue(lines, "DesignVoltage", ":"), 10) || 0) / 1000;
      result2.capacityUnit = "mWh";
      result2.percent = parseInt(util.getValue(lines, "EstimatedChargeRemaining", ":"), 10) || 0;
      result2.currentCapacity = parseInt(result2.maxCapacity * result2.percent / 100);
      result2.isCharging = statusValue >= 6 && statusValue <= 9 || statusValue === 11 || statusValue !== 3 && statusValue !== 1 && result2.percent < 100;
      result2.acConnected = result2.isCharging || statusValue === 2;
      result2.model = util.getValue(lines, "DeviceID", ":");
    } else {
      result2.status = -1;
    }
    return result2;
  }
  module.exports = (callback) => new Promise((resolve) => {
    process.nextTick(() => {
      let result2 = {
        hasBattery: false,
        cycleCount: 0,
        isCharging: false,
        designedCapacity: 0,
        maxCapacity: 0,
        currentCapacity: 0,
        voltage: 0,
        capacityUnit: "",
        percent: 0,
        timeRemaining: null,
        acConnected: true,
        type: "",
        model: "",
        manufacturer: "",
        serial: ""
      };
      if (_linux) {
        let battery_path = "";
        if (fs.existsSync("/sys/class/power_supply/BAT1/uevent")) {
          battery_path = "/sys/class/power_supply/BAT1/";
        } else if (fs.existsSync("/sys/class/power_supply/BAT0/uevent")) {
          battery_path = "/sys/class/power_supply/BAT0/";
        }
        let acConnected = false;
        let acPath = "";
        if (fs.existsSync("/sys/class/power_supply/AC/online")) {
          acPath = "/sys/class/power_supply/AC/online";
        } else if (fs.existsSync("/sys/class/power_supply/AC0/online")) {
          acPath = "/sys/class/power_supply/AC0/online";
        }
        if (acPath) {
          const file = fs.readFileSync(acPath);
          acConnected = file.toString().trim() === "1";
        }
        if (battery_path) {
          fs.readFile(battery_path + "uevent", (error2, stdout) => {
            if (!error2) {
              let lines = stdout.toString().split(`
`);
              result2.isCharging = util.getValue(lines, "POWER_SUPPLY_STATUS", "=").toLowerCase() === "charging";
              result2.acConnected = acConnected || result2.isCharging;
              result2.voltage = parseInt("0" + util.getValue(lines, "POWER_SUPPLY_VOLTAGE_NOW", "="), 10) / 1e6;
              result2.capacityUnit = result2.voltage ? "mWh" : "mAh";
              result2.cycleCount = parseInt("0" + util.getValue(lines, "POWER_SUPPLY_CYCLE_COUNT", "="), 10);
              result2.maxCapacity = Math.round(parseInt("0" + util.getValue(lines, "POWER_SUPPLY_CHARGE_FULL", "=", true, true), 10) / 1000 * (result2.voltage || 1));
              const desingedMinVoltage = parseInt("0" + util.getValue(lines, "POWER_SUPPLY_VOLTAGE_MIN_DESIGN", "="), 10) / 1e6;
              result2.designedCapacity = Math.round(parseInt("0" + util.getValue(lines, "POWER_SUPPLY_CHARGE_FULL_DESIGN", "=", true, true), 10) / 1000 * (desingedMinVoltage || result2.voltage || 1));
              result2.currentCapacity = Math.round(parseInt("0" + util.getValue(lines, "POWER_SUPPLY_CHARGE_NOW", "="), 10) / 1000 * (result2.voltage || 1));
              if (!result2.maxCapacity) {
                result2.maxCapacity = parseInt("0" + util.getValue(lines, "POWER_SUPPLY_ENERGY_FULL", "=", true, true), 10) / 1000;
                result2.designedCapacity = parseInt("0" + util.getValue(lines, "POWER_SUPPLY_ENERGY_FULL_DESIGN", "=", true, true), 10) / 1000 | result2.maxCapacity;
                result2.currentCapacity = parseInt("0" + util.getValue(lines, "POWER_SUPPLY_ENERGY_NOW", "="), 10) / 1000;
              }
              const percent = util.getValue(lines, "POWER_SUPPLY_CAPACITY", "=");
              const energy = parseInt("0" + util.getValue(lines, "POWER_SUPPLY_ENERGY_NOW", "="), 10);
              const power = parseInt("0" + util.getValue(lines, "POWER_SUPPLY_POWER_NOW", "="), 10);
              const current = parseInt("0" + util.getValue(lines, "POWER_SUPPLY_CURRENT_NOW", "="), 10);
              const charge = parseInt("0" + util.getValue(lines, "POWER_SUPPLY_CHARGE_NOW", "="), 10);
              result2.percent = parseInt("0" + percent, 10);
              if (result2.maxCapacity && result2.currentCapacity) {
                result2.hasBattery = true;
                if (!percent) {
                  result2.percent = 100 * result2.currentCapacity / result2.maxCapacity;
                }
              }
              if (result2.isCharging) {
                result2.hasBattery = true;
              }
              if (energy && power) {
                result2.timeRemaining = Math.floor(energy / power * 60);
              } else if (current && charge) {
                result2.timeRemaining = Math.floor(charge / current * 60);
              } else if (current && result2.currentCapacity) {
                result2.timeRemaining = Math.floor(result2.currentCapacity / current * 60);
              }
              result2.type = util.getValue(lines, "POWER_SUPPLY_TECHNOLOGY", "=");
              result2.model = util.getValue(lines, "POWER_SUPPLY_MODEL_NAME", "=");
              result2.manufacturer = util.getValue(lines, "POWER_SUPPLY_MANUFACTURER", "=");
              result2.serial = util.getValue(lines, "POWER_SUPPLY_SERIAL_NUMBER", "=");
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            } else {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
          });
        } else {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
      }
      if (_freebsd || _openbsd || _netbsd) {
        exec("sysctl -i hw.acpi.battery hw.acpi.acline", (error2, stdout) => {
          let lines = stdout.toString().split(`
`);
          const batteries = parseInt("0" + util.getValue(lines, "hw.acpi.battery.units"), 10);
          const percent = parseInt("0" + util.getValue(lines, "hw.acpi.battery.life"), 10);
          result2.hasBattery = batteries > 0;
          result2.cycleCount = null;
          result2.isCharging = util.getValue(lines, "hw.acpi.acline") !== "1";
          result2.acConnected = result2.isCharging;
          result2.maxCapacity = null;
          result2.currentCapacity = null;
          result2.capacityUnit = "unknown";
          result2.percent = batteries ? percent : null;
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        });
      }
      if (_darwin) {
        exec('ioreg -n AppleSmartBattery -r | egrep "CycleCount|IsCharging|DesignCapacity|MaxCapacity|CurrentCapacity|DeviceName|BatterySerialNumber|Serial|TimeRemaining|Voltage"; pmset -g batt | grep %', (error2, stdout) => {
          if (stdout) {
            let lines = stdout.toString().replace(/ +/g, "").replace(/"+/g, "").replace(/-/g, "").split(`
`);
            result2.cycleCount = parseInt("0" + util.getValue(lines, "cyclecount", "="), 10);
            result2.voltage = parseInt("0" + util.getValue(lines, "voltage", "="), 10) / 1000;
            result2.capacityUnit = result2.voltage ? "mWh" : "mAh";
            result2.maxCapacity = Math.round(parseInt("0" + util.getValue(lines, "applerawmaxcapacity", "="), 10) * (result2.voltage || 1));
            result2.currentCapacity = Math.round(parseInt("0" + util.getValue(lines, "applerawcurrentcapacity", "="), 10) * (result2.voltage || 1));
            result2.designedCapacity = Math.round(parseInt("0" + util.getValue(lines, "DesignCapacity", "="), 10) * (result2.voltage || 1));
            result2.manufacturer = "Apple";
            result2.serial = util.getValue(lines, "BatterySerialNumber", "=") || util.getValue(lines, "Serial", "=");
            result2.model = util.getValue(lines, "DeviceName", "=");
            let percent = null;
            const line = util.getValue(lines, "internal", "Battery");
            let parts = line.split(";");
            if (parts && parts[0]) {
              let parts2 = parts[0].split("\t");
              if (parts2 && parts2[1]) {
                percent = parseFloat(parts2[1].trim().replace(/%/g, ""));
              }
            }
            if (parts && parts[1]) {
              result2.isCharging = parts[1].trim() === "charging";
              result2.acConnected = parts[1].trim() !== "discharging";
            } else {
              result2.isCharging = util.getValue(lines, "ischarging", "=").toLowerCase() === "yes";
              result2.acConnected = result2.isCharging;
            }
            if (result2.maxCapacity && result2.currentCapacity) {
              result2.hasBattery = true;
              result2.type = "Li-ion";
              result2.percent = percent !== null ? percent : Math.round(100 * result2.currentCapacity / result2.maxCapacity);
              if (!result2.isCharging) {
                result2.timeRemaining = parseInt("0" + util.getValue(lines, "TimeRemaining", "="), 10);
              }
            }
          }
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        });
      }
      if (_sunos) {
        if (callback) {
          callback(result2);
        }
        resolve(result2);
      }
      if (_windows) {
        try {
          const workload = [];
          workload.push(util.powerShell("Get-CimInstance Win32_Battery | select BatteryStatus, DesignCapacity, DesignVoltage, EstimatedChargeRemaining, DeviceID | fl"));
          workload.push(util.powerShell("(Get-WmiObject -Class BatteryStaticData -Namespace ROOT/WMI).DesignedCapacity"));
          workload.push(util.powerShell("(Get-CimInstance -Class BatteryFullChargedCapacity -Namespace ROOT/WMI).FullChargedCapacity"));
          util.promiseAll(workload).then((data) => {
            if (data) {
              const parts = data.results[0].split(/\n\s*\n/);
              const batteries = [];
              const hasValue = (value) => /\S/.test(value);
              for (let i = 0;i < parts.length; i++) {
                if (hasValue(parts[i])) {
                  batteries.push(parts[i]);
                }
              }
              const designCapacities = data.results[1].split(`\r
`).filter((e) => e);
              const fullChargeCapacities = data.results[2].split(`\r
`).filter((e) => e);
              if (batteries.length) {
                let first = false;
                const additionalBatteries = [];
                for (let i = 0;i < batteries.length; i++) {
                  const lines = batteries[i].split(`\r
`);
                  const designedCapacity = designCapacities && designCapacities.length >= i + 1 && designCapacities[i] ? util.toInt(designCapacities[i]) : 0;
                  const fullChargeCapacity = fullChargeCapacities && fullChargeCapacities.length >= i + 1 && fullChargeCapacities[i] ? util.toInt(fullChargeCapacities[i]) : 0;
                  const parsed = parseWinBatteryPart(lines, designedCapacity, fullChargeCapacity);
                  if (!first && parsed.status > 0 && parsed.status !== 10) {
                    result2.hasBattery = parsed.hasBattery;
                    result2.maxCapacity = parsed.maxCapacity;
                    result2.designedCapacity = parsed.designedCapacity;
                    result2.voltage = parsed.voltage;
                    result2.capacityUnit = parsed.capacityUnit;
                    result2.percent = parsed.percent;
                    result2.currentCapacity = parsed.currentCapacity;
                    result2.isCharging = parsed.isCharging;
                    result2.acConnected = parsed.acConnected;
                    result2.model = parsed.model;
                    first = true;
                  } else if (parsed.status !== -1) {
                    additionalBatteries.push({
                      hasBattery: parsed.hasBattery,
                      maxCapacity: parsed.maxCapacity,
                      designedCapacity: parsed.designedCapacity,
                      voltage: parsed.voltage,
                      capacityUnit: parsed.capacityUnit,
                      percent: parsed.percent,
                      currentCapacity: parsed.currentCapacity,
                      isCharging: parsed.isCharging,
                      timeRemaining: null,
                      acConnected: parsed.acConnected,
                      model: parsed.model,
                      type: "",
                      manufacturer: "",
                      serial: ""
                    });
                  }
                }
                if (!first && additionalBatteries.length) {
                  result2 = additionalBatteries[0];
                  additionalBatteries.shift();
                }
                if (additionalBatteries.length) {
                  result2.additionalBatteries = additionalBatteries;
                }
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        } catch {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
      }
    });
  });
});

// node_modules/systeminformation/lib/graphics.js
var require_graphics = __commonJS((exports) => {
  var fs = __require("fs");
  var path = __require("path");
  var exec = __require("child_process").exec;
  var execSync = __require("child_process").execSync;
  var util = require_util();
  var _platform = process.platform;
  var _nvidiaSmiPath = "";
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  var _resolutionX = 0;
  var _resolutionY = 0;
  var _pixelDepth = 0;
  var _refreshRate = 0;
  var videoTypes = {
    "-2": "UNINITIALIZED",
    "-1": "OTHER",
    0: "HD15",
    1: "SVIDEO",
    2: "Composite video",
    3: "Component video",
    4: "DVI",
    5: "HDMI",
    6: "LVDS",
    8: "D_JPN",
    9: "SDI",
    10: "DP",
    11: "DP embedded",
    12: "UDI",
    13: "UDI embedded",
    14: "SDTVDONGLE",
    15: "MIRACAST",
    2147483648: "INTERNAL"
  };
  function getVendorFromModel(model) {
    const manufacturers = [
      { pattern: "^LG.+", manufacturer: "LG" },
      { pattern: "^BENQ.+", manufacturer: "BenQ" },
      { pattern: "^ASUS.+", manufacturer: "Asus" },
      { pattern: "^DELL.+", manufacturer: "Dell" },
      { pattern: "^SAMSUNG.+", manufacturer: "Samsung" },
      { pattern: "^VIEWSON.+", manufacturer: "ViewSonic" },
      { pattern: "^SONY.+", manufacturer: "Sony" },
      { pattern: "^ACER.+", manufacturer: "Acer" },
      { pattern: "^AOC.+", manufacturer: "AOC Monitors" },
      { pattern: "^HP.+", manufacturer: "HP" },
      { pattern: "^EIZO.?", manufacturer: "Eizo" },
      { pattern: "^PHILIPS.?", manufacturer: "Philips" },
      { pattern: "^IIYAMA.?", manufacturer: "Iiyama" },
      { pattern: "^SHARP.?", manufacturer: "Sharp" },
      { pattern: "^NEC.?", manufacturer: "NEC" },
      { pattern: "^LENOVO.?", manufacturer: "Lenovo" },
      { pattern: "COMPAQ.?", manufacturer: "Compaq" },
      { pattern: "APPLE.?", manufacturer: "Apple" },
      { pattern: "INTEL.?", manufacturer: "Intel" },
      { pattern: "AMD.?", manufacturer: "AMD" },
      { pattern: "NVIDIA.?", manufacturer: "NVDIA" }
    ];
    let result2 = "";
    if (model) {
      model = model.toUpperCase();
      manufacturers.forEach((manufacturer) => {
        const re = RegExp(manufacturer.pattern);
        if (re.test(model)) {
          result2 = manufacturer.manufacturer;
        }
      });
    }
    return result2;
  }
  function getVendorFromId(id) {
    const vendors = {
      610: "Apple",
      "1e6d": "LG",
      "10ac": "DELL",
      "4dd9": "Sony",
      "38a3": "NEC"
    };
    return vendors[id] || "";
  }
  function vendorToId(str) {
    let result2 = "";
    str = (str || "").toLowerCase();
    if (str.indexOf("apple") >= 0) {
      result2 = "0x05ac";
    } else if (str.indexOf("nvidia") >= 0) {
      result2 = "0x10de";
    } else if (str.indexOf("intel") >= 0) {
      result2 = "0x8086";
    } else if (str.indexOf("ati") >= 0 || str.indexOf("amd") >= 0) {
      result2 = "0x1002";
    }
    return result2;
  }
  function getMetalVersion(id) {
    const families = {
      spdisplays_mtlgpufamilymac1: "mac1",
      spdisplays_mtlgpufamilymac2: "mac2",
      spdisplays_mtlgpufamilyapple1: "apple1",
      spdisplays_mtlgpufamilyapple2: "apple2",
      spdisplays_mtlgpufamilyapple3: "apple3",
      spdisplays_mtlgpufamilyapple4: "apple4",
      spdisplays_mtlgpufamilyapple5: "apple5",
      spdisplays_mtlgpufamilyapple6: "apple6",
      spdisplays_mtlgpufamilyapple7: "apple7",
      spdisplays_metalfeaturesetfamily11: "family1_v1",
      spdisplays_metalfeaturesetfamily12: "family1_v2",
      spdisplays_metalfeaturesetfamily13: "family1_v3",
      spdisplays_metalfeaturesetfamily14: "family1_v4",
      spdisplays_metalfeaturesetfamily21: "family2_v1"
    };
    return families[id] || "";
  }
  function graphics(callback) {
    function parseLinesDarwin(graphicsArr) {
      const res = {
        controllers: [],
        displays: []
      };
      try {
        graphicsArr.forEach((item) => {
          const bus = (item.sppci_bus || "").indexOf("builtin") > -1 ? "Built-In" : (item.sppci_bus || "").indexOf("pcie") > -1 ? "PCIe" : "";
          const vram = (parseInt(item.spdisplays_vram || "", 10) || 0) * ((item.spdisplays_vram || "").indexOf("GB") > -1 ? 1024 : 1);
          const vramDyn = (parseInt(item.spdisplays_vram_shared || "", 10) || 0) * ((item.spdisplays_vram_shared || "").indexOf("GB") > -1 ? 1024 : 1);
          let metalVersion = getMetalVersion(item.spdisplays_metal || item.spdisplays_metalfamily || "");
          res.controllers.push({
            vendor: getVendorFromModel(item.spdisplays_vendor || "") || item.spdisplays_vendor || "",
            model: item.sppci_model || "",
            bus,
            vramDynamic: bus === "Built-In",
            vram: vram || vramDyn || null,
            deviceId: item["spdisplays_device-id"] || "",
            vendorId: item["spdisplays_vendor-id"] || vendorToId((item["spdisplays_vendor"] || "") + (item.sppci_model || "")),
            external: item.sppci_device_type === "spdisplays_egpu",
            cores: item["sppci_cores"] || null,
            metalVersion
          });
          if (item.spdisplays_ndrvs && item.spdisplays_ndrvs.length) {
            item.spdisplays_ndrvs.forEach((displayItem) => {
              const connectionType = displayItem["spdisplays_connection_type"] || "";
              const currentResolutionParts = (displayItem["_spdisplays_resolution"] || "").split("@");
              const currentResolution = currentResolutionParts[0].split("x");
              const pixelParts = (displayItem["_spdisplays_pixels"] || "").split("x");
              const pixelDepthString = displayItem["spdisplays_depth"] || "";
              const serial = displayItem["_spdisplays_display-serial-number"] || displayItem["_spdisplays_display-serial-number2"] || null;
              res.displays.push({
                vendor: getVendorFromId(displayItem["_spdisplays_display-vendor-id"] || "") || getVendorFromModel(displayItem["_name"] || ""),
                vendorId: displayItem["_spdisplays_display-vendor-id"] || "",
                model: displayItem["_name"] || "",
                productionYear: displayItem["_spdisplays_display-year"] || null,
                serial: serial !== "0" ? serial : null,
                displayId: displayItem["_spdisplays_displayID"] || null,
                main: displayItem["spdisplays_main"] ? displayItem["spdisplays_main"] === "spdisplays_yes" : false,
                builtin: (displayItem["spdisplays_display_type"] || "").indexOf("built-in") > -1,
                connection: connectionType.indexOf("_internal") > -1 ? "Internal" : connectionType.indexOf("_displayport") > -1 ? "Display Port" : connectionType.indexOf("_hdmi") > -1 ? "HDMI" : null,
                sizeX: null,
                sizeY: null,
                pixelDepth: pixelDepthString === "CGSThirtyBitColor" ? 30 : pixelDepthString === "CGSThirtytwoBitColor" ? 32 : pixelDepthString === "CGSTwentyfourBitColor" ? 24 : null,
                resolutionX: pixelParts.length > 1 ? parseInt(pixelParts[0], 10) : null,
                resolutionY: pixelParts.length > 1 ? parseInt(pixelParts[1], 10) : null,
                currentResX: currentResolution.length > 1 ? parseInt(currentResolution[0], 10) : null,
                currentResY: currentResolution.length > 1 ? parseInt(currentResolution[1], 10) : null,
                positionX: 0,
                positionY: 0,
                currentRefreshRate: currentResolutionParts.length > 1 ? parseInt(currentResolutionParts[1], 10) : null
              });
            });
          }
        });
        return res;
      } catch (e) {
        return res;
      }
    }
    function parseLinesLinuxControllers(lines) {
      let controllers = [];
      let currentController = {
        vendor: "",
        subVendor: "",
        model: "",
        bus: "",
        busAddress: "",
        vram: null,
        vramDynamic: false,
        pciID: ""
      };
      let isGraphicsController = false;
      let pciIDs = [];
      try {
        pciIDs = execSync('export LC_ALL=C; dmidecode -t 9 2>/dev/null; unset LC_ALL | grep "Bus Address: "', util.execOptsLinux).toString().split(`
`);
        for (let i2 = 0;i2 < pciIDs.length; i2++) {
          pciIDs[i2] = pciIDs[i2].replace("Bus Address:", "").replace("0000:", "").trim();
        }
        pciIDs = pciIDs.filter((el) => el != null && el);
      } catch {
        util.noop();
      }
      let i = 1;
      lines.forEach((line) => {
        let subsystem = "";
        if (i < lines.length && lines[i]) {
          subsystem = lines[i];
          if (subsystem.indexOf(":") > 0) {
            subsystem = subsystem.split(":")[1];
          }
        }
        if (line.trim() !== "") {
          if (line[0] !== " " && line[0] !== "\t") {
            let isExternal = pciIDs.indexOf(line.split(" ")[0]) >= 0;
            let vgapos = line.toLowerCase().indexOf(" vga ");
            let _3dcontrollerpos = line.toLowerCase().indexOf("3d controller");
            if (vgapos !== -1 || _3dcontrollerpos !== -1) {
              if (_3dcontrollerpos !== -1 && vgapos === -1) {
                vgapos = _3dcontrollerpos;
              }
              if (currentController.vendor || currentController.model || currentController.bus || currentController.vram !== null || currentController.vramDynamic) {
                controllers.push(currentController);
                currentController = {
                  vendor: "",
                  model: "",
                  bus: "",
                  busAddress: "",
                  vram: null,
                  vramDynamic: false
                };
              }
              const pciIDCandidate = line.split(" ")[0];
              if (/[\da-fA-F]{2}:[\da-fA-F]{2}\.[\da-fA-F]/.test(pciIDCandidate)) {
                currentController.busAddress = pciIDCandidate;
              }
              isGraphicsController = true;
              let endpos = line.search(/\[[0-9a-f]{4}:[0-9a-f]{4}]|$/);
              let parts = line.substr(vgapos, endpos - vgapos).split(":");
              currentController.busAddress = line.substr(0, vgapos).trim();
              if (parts.length > 1) {
                parts[1] = parts[1].trim();
                if (parts[1].toLowerCase().indexOf("corporation") >= 0) {
                  currentController.vendor = parts[1].substr(0, parts[1].toLowerCase().indexOf("corporation") + 11).trim();
                  currentController.model = parts[1].substr(parts[1].toLowerCase().indexOf("corporation") + 11, 200).split("(")[0].trim();
                  currentController.bus = pciIDs.length > 0 && isExternal ? "PCIe" : "Onboard";
                  currentController.vram = null;
                  currentController.vramDynamic = false;
                } else if (parts[1].toLowerCase().indexOf(" inc.") >= 0) {
                  if ((parts[1].match(/]/g) || []).length > 1) {
                    currentController.vendor = parts[1].substr(0, parts[1].toLowerCase().indexOf("]") + 1).trim();
                    currentController.model = parts[1].substr(parts[1].toLowerCase().indexOf("]") + 1, 200).trim().split("(")[0].trim();
                  } else {
                    currentController.vendor = parts[1].substr(0, parts[1].toLowerCase().indexOf(" inc.") + 5).trim();
                    currentController.model = parts[1].substr(parts[1].toLowerCase().indexOf(" inc.") + 5, 200).trim().split("(")[0].trim();
                  }
                  currentController.bus = pciIDs.length > 0 && isExternal ? "PCIe" : "Onboard";
                  currentController.vram = null;
                  currentController.vramDynamic = false;
                } else if (parts[1].toLowerCase().indexOf(" ltd.") >= 0) {
                  if ((parts[1].match(/]/g) || []).length > 1) {
                    currentController.vendor = parts[1].substr(0, parts[1].toLowerCase().indexOf("]") + 1).trim();
                    currentController.model = parts[1].substr(parts[1].toLowerCase().indexOf("]") + 1, 200).trim().split("(")[0].trim();
                  } else {
                    currentController.vendor = parts[1].substr(0, parts[1].toLowerCase().indexOf(" ltd.") + 5).trim();
                    currentController.model = parts[1].substr(parts[1].toLowerCase().indexOf(" ltd.") + 5, 200).trim().split("(")[0].trim();
                  }
                }
                if (currentController.model && subsystem.indexOf(currentController.model) !== -1) {
                  const subVendor = subsystem.split(currentController.model)[0].trim();
                  if (subVendor) {
                    currentController.subVendor = subVendor;
                  }
                }
              }
            } else {
              isGraphicsController = false;
            }
          }
          if (isGraphicsController) {
            let parts = line.split(":");
            if (parts.length > 1 && parts[0].replace(/ +/g, "").toLowerCase().indexOf("devicename") !== -1 && parts[1].toLowerCase().indexOf("onboard") !== -1) {
              currentController.bus = "Onboard";
            }
            if (parts.length > 1 && parts[0].replace(/ +/g, "").toLowerCase().indexOf("region") !== -1 && parts[1].toLowerCase().indexOf("memory") !== -1) {
              let memparts = parts[1].split("=");
              if (memparts.length > 1) {
                currentController.vram = parseInt(memparts[1]);
              }
            }
          }
        }
        i++;
      });
      if (currentController.vendor || currentController.model || currentController.bus || currentController.busAddress || currentController.vram !== null || currentController.vramDynamic) {
        controllers.push(currentController);
      }
      return controllers;
    }
    function parseLinesLinuxClinfo(controllers, lines) {
      const fieldPattern = /\[([^\]]+)\]\s+(\w+)\s+(.*)/;
      const devices = lines.reduce((devices2, line) => {
        const field = fieldPattern.exec(line.trim());
        if (field) {
          if (!devices2[field[1]]) {
            devices2[field[1]] = {};
          }
          devices2[field[1]][field[2]] = field[3];
        }
        return devices2;
      }, {});
      for (let deviceId in devices) {
        const device = devices[deviceId];
        if (device["CL_DEVICE_TYPE"] === "CL_DEVICE_TYPE_GPU") {
          let busAddress;
          if (device["CL_DEVICE_TOPOLOGY_AMD"]) {
            const bdf = device["CL_DEVICE_TOPOLOGY_AMD"].match(/[a-zA-Z0-9]+:\d+\.\d+/);
            if (bdf) {
              busAddress = bdf[0];
            }
          } else if (device["CL_DEVICE_PCI_BUS_ID_NV"] && device["CL_DEVICE_PCI_SLOT_ID_NV"]) {
            const bus = parseInt(device["CL_DEVICE_PCI_BUS_ID_NV"]);
            const slot = parseInt(device["CL_DEVICE_PCI_SLOT_ID_NV"]);
            if (!isNaN(bus) && !isNaN(slot)) {
              const b = bus & 255;
              const d = slot >> 3 & 255;
              const f = slot & 7;
              busAddress = `${b.toString().padStart(2, "0")}:${d.toString().padStart(2, "0")}.${f}`;
            }
          }
          if (busAddress) {
            let controller = controllers.find((controller2) => controller2.busAddress === busAddress);
            if (!controller) {
              controller = {
                vendor: "",
                model: "",
                bus: "",
                busAddress,
                vram: null,
                vramDynamic: false
              };
              controllers.push(controller);
            }
            controller.vendor = device["CL_DEVICE_VENDOR"];
            if (device["CL_DEVICE_BOARD_NAME_AMD"]) {
              controller.model = device["CL_DEVICE_BOARD_NAME_AMD"];
            } else {
              controller.model = device["CL_DEVICE_NAME"];
            }
            const memory = parseInt(device["CL_DEVICE_GLOBAL_MEM_SIZE"]);
            if (!isNaN(memory)) {
              controller.vram = Math.round(memory / 1024 / 1024);
            }
          }
        }
      }
      return controllers;
    }
    function getNvidiaSmi() {
      if (_nvidiaSmiPath) {
        return _nvidiaSmiPath;
      }
      if (_windows) {
        try {
          const basePath = path.join(util.WINDIR, "System32", "DriverStore", "FileRepository");
          const candidates = fs.readdirSync(basePath, { withFileTypes: true }).filter((dir) => dir.isDirectory()).map((dir) => {
            const nvidiaSmiPath = path.join(basePath, dir.name, "nvidia-smi.exe");
            try {
              const stats = fs.statSync(nvidiaSmiPath);
              return { path: nvidiaSmiPath, ctime: stats.ctimeMs };
            } catch {
              return null;
            }
          }).filter(Boolean);
          if (candidates.length > 0) {
            _nvidiaSmiPath = candidates.reduce((prev, curr) => curr.ctime > prev.ctime ? curr : prev).path;
          }
        } catch {
          util.noop();
        }
      } else if (_linux) {
        _nvidiaSmiPath = "nvidia-smi";
      }
      return _nvidiaSmiPath;
    }
    function nvidiaSmi(options) {
      const nvidiaSmiExe = getNvidiaSmi();
      options = options || util.execOptsWin;
      if (nvidiaSmiExe) {
        const nvidiaSmiOpts = "--query-gpu=driver_version,pci.sub_device_id,name,pci.bus_id,fan.speed,memory.total,memory.used,memory.free,utilization.gpu,utilization.memory,temperature.gpu,temperature.memory,power.draw,power.limit,clocks.gr,clocks.mem --format=csv,noheader,nounits";
        const cmd = `"${nvidiaSmiExe}" ${nvidiaSmiOpts}`;
        if (_linux) {
          options.stdio = ["pipe", "pipe", "ignore"];
        }
        try {
          const sanitized = cmd + (_linux ? "  2>/dev/null" : "") + (_windows ? "  2> nul" : "");
          const res = execSync(sanitized, options).toString();
          return res;
        } catch {
          util.noop();
        }
      }
      return "";
    }
    function nvidiaDevices() {
      function safeParseNumber(value) {
        if ([null, undefined].includes(value)) {
          return value;
        }
        return parseFloat(value);
      }
      const stdout = nvidiaSmi();
      if (!stdout) {
        return [];
      }
      const gpus = stdout.split(`
`).filter(Boolean);
      let results = gpus.map((gpu) => {
        const splittedData = gpu.split(", ").map((value) => value.includes("N/A") ? undefined : value);
        if (splittedData.length === 16) {
          return {
            driverVersion: splittedData[0],
            subDeviceId: splittedData[1],
            name: splittedData[2],
            pciBus: splittedData[3],
            fanSpeed: safeParseNumber(splittedData[4]),
            memoryTotal: safeParseNumber(splittedData[5]),
            memoryUsed: safeParseNumber(splittedData[6]),
            memoryFree: safeParseNumber(splittedData[7]),
            utilizationGpu: safeParseNumber(splittedData[8]),
            utilizationMemory: safeParseNumber(splittedData[9]),
            temperatureGpu: safeParseNumber(splittedData[10]),
            temperatureMemory: safeParseNumber(splittedData[11]),
            powerDraw: safeParseNumber(splittedData[12]),
            powerLimit: safeParseNumber(splittedData[13]),
            clockCore: safeParseNumber(splittedData[14]),
            clockMemory: safeParseNumber(splittedData[15])
          };
        } else {
          return {};
        }
      });
      results = results.filter((item) => {
        return "pciBus" in item;
      });
      return results;
    }
    function mergeControllerNvidia(controller, nvidia) {
      if (nvidia.driverVersion) {
        controller.driverVersion = nvidia.driverVersion;
      }
      if (nvidia.subDeviceId) {
        controller.subDeviceId = nvidia.subDeviceId;
      }
      if (nvidia.name) {
        controller.name = nvidia.name;
      }
      if (nvidia.pciBus) {
        controller.pciBus = nvidia.pciBus;
      }
      if (nvidia.fanSpeed) {
        controller.fanSpeed = nvidia.fanSpeed;
      }
      if (nvidia.memoryTotal) {
        controller.memoryTotal = nvidia.memoryTotal;
        controller.vram = nvidia.memoryTotal;
        controller.vramDynamic = false;
      }
      if (nvidia.memoryUsed) {
        controller.memoryUsed = nvidia.memoryUsed;
      }
      if (nvidia.memoryFree) {
        controller.memoryFree = nvidia.memoryFree;
      }
      if (nvidia.utilizationGpu) {
        controller.utilizationGpu = nvidia.utilizationGpu;
      }
      if (nvidia.utilizationMemory) {
        controller.utilizationMemory = nvidia.utilizationMemory;
      }
      if (nvidia.temperatureGpu) {
        controller.temperatureGpu = nvidia.temperatureGpu;
      }
      if (nvidia.temperatureMemory) {
        controller.temperatureMemory = nvidia.temperatureMemory;
      }
      if (nvidia.powerDraw) {
        controller.powerDraw = nvidia.powerDraw;
      }
      if (nvidia.powerLimit) {
        controller.powerLimit = nvidia.powerLimit;
      }
      if (nvidia.clockCore) {
        controller.clockCore = nvidia.clockCore;
      }
      if (nvidia.clockMemory) {
        controller.clockMemory = nvidia.clockMemory;
      }
      return controller;
    }
    function parseLinesLinuxEdid(edid) {
      const result2 = {
        vendor: "",
        model: "",
        deviceName: "",
        main: false,
        builtin: false,
        connection: "",
        sizeX: null,
        sizeY: null,
        pixelDepth: null,
        resolutionX: null,
        resolutionY: null,
        currentResX: null,
        currentResY: null,
        positionX: 0,
        positionY: 0,
        currentRefreshRate: null
      };
      let start = 108;
      if (edid.substr(start, 6) === "000000") {
        start += 36;
      }
      if (edid.substr(start, 6) === "000000") {
        start += 36;
      }
      if (edid.substr(start, 6) === "000000") {
        start += 36;
      }
      if (edid.substr(start, 6) === "000000") {
        start += 36;
      }
      result2.resolutionX = parseInt("0x0" + edid.substr(start + 8, 1) + edid.substr(start + 4, 2));
      result2.resolutionY = parseInt("0x0" + edid.substr(start + 14, 1) + edid.substr(start + 10, 2));
      result2.sizeX = parseInt("0x0" + edid.substr(start + 28, 1) + edid.substr(start + 24, 2));
      result2.sizeY = parseInt("0x0" + edid.substr(start + 29, 1) + edid.substr(start + 26, 2));
      start = edid.indexOf("000000fc00");
      if (start >= 0) {
        let model_raw = edid.substr(start + 10, 26);
        if (model_raw.indexOf("0a") !== -1) {
          model_raw = model_raw.substr(0, model_raw.indexOf("0a"));
        }
        try {
          if (model_raw.length > 2) {
            result2.model = model_raw.match(/.{1,2}/g).map((v) => String.fromCharCode(parseInt(v, 16))).join("");
          }
        } catch {
          util.noop();
        }
      } else {
        result2.model = "";
      }
      return result2;
    }
    function parseLinesLinuxDisplays(lines, depth) {
      const displays = [];
      let currentDisplay = {
        vendor: "",
        model: "",
        deviceName: "",
        main: false,
        builtin: false,
        connection: "",
        sizeX: null,
        sizeY: null,
        pixelDepth: null,
        resolutionX: null,
        resolutionY: null,
        currentResX: null,
        currentResY: null,
        positionX: 0,
        positionY: 0,
        currentRefreshRate: null
      };
      let is_edid = false;
      let is_current = false;
      let edid_raw = "";
      let start = 0;
      for (let i = 1;i < lines.length; i++) {
        if (lines[i].trim() !== "") {
          if (lines[i][0] !== " " && lines[i][0] !== "\t" && lines[i].toLowerCase().indexOf(" connected ") !== -1) {
            if (currentDisplay.model || currentDisplay.main || currentDisplay.builtin || currentDisplay.connection || currentDisplay.sizeX !== null || currentDisplay.pixelDepth !== null || currentDisplay.resolutionX !== null) {
              displays.push(currentDisplay);
              currentDisplay = {
                vendor: "",
                model: "",
                main: false,
                builtin: false,
                connection: "",
                sizeX: null,
                sizeY: null,
                pixelDepth: null,
                resolutionX: null,
                resolutionY: null,
                currentResX: null,
                currentResY: null,
                positionX: 0,
                positionY: 0,
                currentRefreshRate: null
              };
            }
            let parts = lines[i].split(" ");
            currentDisplay.connection = parts[0];
            currentDisplay.main = lines[i].toLowerCase().indexOf(" primary ") >= 0;
            currentDisplay.builtin = parts[0].toLowerCase().indexOf("edp") >= 0;
          }
          if (is_edid) {
            if (lines[i].search(/\S|$/) > start) {
              edid_raw += lines[i].toLowerCase().trim();
            } else {
              let edid_decoded = parseLinesLinuxEdid(edid_raw);
              currentDisplay.vendor = edid_decoded.vendor;
              currentDisplay.model = edid_decoded.model;
              currentDisplay.resolutionX = edid_decoded.resolutionX;
              currentDisplay.resolutionY = edid_decoded.resolutionY;
              currentDisplay.sizeX = edid_decoded.sizeX;
              currentDisplay.sizeY = edid_decoded.sizeY;
              currentDisplay.pixelDepth = depth;
              is_edid = false;
            }
          }
          if (lines[i].toLowerCase().indexOf("edid:") >= 0) {
            is_edid = true;
            start = lines[i].search(/\S|$/);
          }
          if (lines[i].toLowerCase().indexOf("*current") >= 0) {
            const parts1 = lines[i].split("(");
            if (parts1 && parts1.length > 1 && parts1[0].indexOf("x") >= 0) {
              const resParts = parts1[0].trim().split("x");
              currentDisplay.currentResX = util.toInt(resParts[0]);
              currentDisplay.currentResY = util.toInt(resParts[1]);
            }
            is_current = true;
          }
          if (is_current && lines[i].toLowerCase().indexOf("clock") >= 0 && lines[i].toLowerCase().indexOf("hz") >= 0 && lines[i].toLowerCase().indexOf("v: height") >= 0) {
            const parts1 = lines[i].split("clock");
            if (parts1 && parts1.length > 1 && parts1[1].toLowerCase().indexOf("hz") >= 0) {
              currentDisplay.currentRefreshRate = util.toInt(parts1[1]);
            }
            is_current = false;
          }
        }
      }
      if (currentDisplay.model || currentDisplay.main || currentDisplay.builtin || currentDisplay.connection || currentDisplay.sizeX !== null || currentDisplay.pixelDepth !== null || currentDisplay.resolutionX !== null) {
        displays.push(currentDisplay);
      }
      return displays;
    }
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = {
          controllers: [],
          displays: []
        };
        if (_darwin) {
          const cmd = "system_profiler -xml -detailLevel full SPDisplaysDataType";
          exec(cmd, (error2, stdout) => {
            if (!error2) {
              try {
                const output = stdout.toString();
                result2 = parseLinesDarwin(util.plistParser(output)[0]._items);
              } catch (e) {
                util.noop();
              }
              try {
                stdout = execSync('defaults read /Library/Preferences/com.apple.windowserver.plist 2>/dev/null;defaults read /Library/Preferences/com.apple.windowserver.displays.plist 2>/dev/null; echo ""', { maxBuffer: 1024 * 102400 });
                const output = (stdout || "").toString();
                const obj = util.plistReader(output);
                if (obj["DisplayAnyUserSets"] && obj["DisplayAnyUserSets"]["Configs"] && obj["DisplayAnyUserSets"]["Configs"][0] && obj["DisplayAnyUserSets"]["Configs"][0]["DisplayConfig"]) {
                  const current = obj["DisplayAnyUserSets"]["Configs"][0]["DisplayConfig"];
                  let i = 0;
                  current.forEach((o) => {
                    if (o["CurrentInfo"] && o["CurrentInfo"]["OriginX"] !== undefined && result2.displays && result2.displays[i]) {
                      result2.displays[i].positionX = o["CurrentInfo"]["OriginX"];
                    }
                    if (o["CurrentInfo"] && o["CurrentInfo"]["OriginY"] !== undefined && result2.displays && result2.displays[i]) {
                      result2.displays[i].positionY = o["CurrentInfo"]["OriginY"];
                    }
                    i++;
                  });
                }
                if (obj["DisplayAnyUserSets"] && obj["DisplayAnyUserSets"].length > 0 && obj["DisplayAnyUserSets"][0].length > 0 && obj["DisplayAnyUserSets"][0][0]["DisplayID"]) {
                  const current = obj["DisplayAnyUserSets"][0];
                  let i = 0;
                  current.forEach((o) => {
                    if ("OriginX" in o && result2.displays && result2.displays[i]) {
                      result2.displays[i].positionX = o["OriginX"];
                    }
                    if ("OriginY" in o && result2.displays && result2.displays[i]) {
                      result2.displays[i].positionY = o["OriginY"];
                    }
                    if (o["Mode"] && o["Mode"]["BitsPerPixel"] !== undefined && result2.displays && result2.displays[i]) {
                      result2.displays[i].pixelDepth = o["Mode"]["BitsPerPixel"];
                    }
                    i++;
                  });
                }
              } catch {
                util.noop();
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_linux) {
          if (util.isRaspberry()) {
            const cmd2 = `fbset -s 2> /dev/null | grep 'mode "' ; vcgencmd get_mem gpu 2> /dev/null; tvservice -s 2> /dev/null; tvservice -n 2> /dev/null;`;
            exec(cmd2, (error2, stdout) => {
              const lines = stdout.toString().split(`
`);
              if (lines.length > 3 && lines[0].indexOf('mode "') >= -1 && lines[2].indexOf("0x12000a") > -1) {
                const parts = lines[0].replace("mode", "").replace(/"/g, "").trim().split("x");
                if (parts.length === 2) {
                  result2.displays.push({
                    vendor: "",
                    model: util.getValue(lines, "device_name", "="),
                    main: true,
                    builtin: false,
                    connection: "HDMI",
                    sizeX: null,
                    sizeY: null,
                    pixelDepth: null,
                    resolutionX: parseInt(parts[0], 10),
                    resolutionY: parseInt(parts[1], 10),
                    currentResX: null,
                    currentResY: null,
                    positionX: 0,
                    positionY: 0,
                    currentRefreshRate: null
                  });
                }
              }
              if (lines.length >= 1 && stdout.toString().indexOf("gpu=") >= -1) {
                result2.controllers.push({
                  vendor: "Broadcom",
                  model: util.getRpiGpu(),
                  bus: "",
                  vram: util.getValue(lines, "gpu", "=").replace("M", ""),
                  vramDynamic: true
                });
              }
            });
          }
          const cmd = "lspci -vvv  2>/dev/null";
          exec(cmd, (error2, stdout) => {
            if (!error2) {
              const lines = stdout.toString().split(`
`);
              if (result2.controllers.length === 0) {
                result2.controllers = parseLinesLinuxControllers(lines);
                const nvidiaData = nvidiaDevices();
                result2.controllers = result2.controllers.map((controller) => {
                  return mergeControllerNvidia(controller, nvidiaData.find((contr) => contr.pciBus.toLowerCase().endsWith(controller.busAddress.toLowerCase())) || {});
                });
              }
            }
            const cmd2 = "clinfo --raw";
            exec(cmd2, (error3, stdout2) => {
              if (!error3) {
                const lines = stdout2.toString().split(`
`);
                result2.controllers = parseLinesLinuxClinfo(result2.controllers, lines);
              }
              const cmd3 = "xdpyinfo 2>/dev/null | grep 'depth of root window' | awk '{ print $5 }'";
              exec(cmd3, (error4, stdout3) => {
                let depth = 0;
                if (!error4) {
                  const lines = stdout3.toString().split(`
`);
                  depth = parseInt(lines[0]) || 0;
                }
                const cmd4 = "xrandr --verbose 2>/dev/null";
                exec(cmd4, (error5, stdout4) => {
                  if (!error5) {
                    const lines = stdout4.toString().split(`
`);
                    result2.displays = parseLinesLinuxDisplays(lines, depth);
                  }
                  if (callback) {
                    callback(result2);
                  }
                  resolve(result2);
                });
              });
            });
          });
        }
        if (_freebsd || _openbsd || _netbsd) {
          if (callback) {
            callback(null);
          }
          resolve(null);
        }
        if (_sunos) {
          if (callback) {
            callback(null);
          }
          resolve(null);
        }
        if (_windows) {
          try {
            const workload = [];
            workload.push(util.powerShell("Get-CimInstance win32_VideoController | fl *"));
            workload.push(util.powerShell('gp "HKLM:\\SYSTEM\\ControlSet001\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\*" -ErrorAction SilentlyContinue | where MatchingDeviceId $null -NE | select MatchingDeviceId,HardwareInformation.qwMemorySize | fl'));
            workload.push(util.powerShell("Get-CimInstance win32_desktopmonitor | fl *"));
            workload.push(util.powerShell("Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorBasicDisplayParams | fl"));
            workload.push(util.powerShell("Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Screen]::AllScreens"));
            workload.push(util.powerShell("Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorConnectionParams | fl"));
            workload.push(util.powerShell('gwmi WmiMonitorID -Namespace root\\wmi | ForEach-Object {(($_.ManufacturerName -notmatch 0 | foreach {[char]$_}) -join "") + "|" + (($_.ProductCodeID -notmatch 0 | foreach {[char]$_}) -join "") + "|" + (($_.UserFriendlyName -notmatch 0 | foreach {[char]$_}) -join "") + "|" + (($_.SerialNumberID -notmatch 0 | foreach {[char]$_}) -join "") + "|" + $_.InstanceName}'));
            const nvidiaData = nvidiaDevices();
            Promise.all(workload).then((data) => {
              const csections = data[0].replace(/\r/g, "").split(/\n\s*\n/);
              const vsections = data[1].replace(/\r/g, "").split(/\n\s*\n/);
              result2.controllers = parseLinesWindowsControllers(csections, vsections);
              result2.controllers = result2.controllers.map((controller) => {
                if (controller.vendor.toLowerCase() === "nvidia") {
                  return mergeControllerNvidia(controller, nvidiaData.find((device) => {
                    let windowsSubDeviceId = (controller.subDeviceId || "").toLowerCase();
                    const nvidiaSubDeviceIdParts = device.subDeviceId.split("x");
                    let nvidiaSubDeviceId = nvidiaSubDeviceIdParts.length > 1 ? nvidiaSubDeviceIdParts[1].toLowerCase() : nvidiaSubDeviceIdParts[0].toLowerCase();
                    const lengthDifference = Math.abs(windowsSubDeviceId.length - nvidiaSubDeviceId.length);
                    if (windowsSubDeviceId.length > nvidiaSubDeviceId.length) {
                      for (let i = 0;i < lengthDifference; i++) {
                        nvidiaSubDeviceId = "0" + nvidiaSubDeviceId;
                      }
                    } else if (windowsSubDeviceId.length < nvidiaSubDeviceId.length) {
                      for (let i = 0;i < lengthDifference; i++) {
                        windowsSubDeviceId = "0" + windowsSubDeviceId;
                      }
                    }
                    return windowsSubDeviceId === nvidiaSubDeviceId;
                  }) || {});
                } else {
                  return controller;
                }
              });
              const dsections = data[2].replace(/\r/g, "").split(/\n\s*\n/);
              if (dsections[0].trim() === "") {
                dsections.shift();
              }
              if (dsections.length && dsections[dsections.length - 1].trim() === "") {
                dsections.pop();
              }
              const msections = data[3].replace(/\r/g, "").split("Active ");
              msections.shift();
              const ssections = data[4].replace(/\r/g, "").split("BitsPerPixel ");
              ssections.shift();
              const tsections = data[5].replace(/\r/g, "").split(/\n\s*\n/);
              tsections.shift();
              const res = data[6].replace(/\r/g, "").split(/\n/);
              const isections = [];
              res.forEach((element) => {
                const parts = element.split("|");
                if (parts.length === 5) {
                  isections.push({
                    vendor: parts[0],
                    code: parts[1],
                    model: parts[2],
                    serial: parts[3],
                    instanceId: parts[4]
                  });
                }
              });
              result2.displays = parseLinesWindowsDisplaysPowershell(ssections, msections, dsections, tsections, isections);
              if (result2.displays.length === 1) {
                if (_resolutionX) {
                  result2.displays[0].resolutionX = _resolutionX;
                  if (!result2.displays[0].currentResX) {
                    result2.displays[0].currentResX = _resolutionX;
                  }
                }
                if (_resolutionY) {
                  result2.displays[0].resolutionY = _resolutionY;
                  if (result2.displays[0].currentResY === 0) {
                    result2.displays[0].currentResY = _resolutionY;
                  }
                }
                if (_pixelDepth) {
                  result2.displays[0].pixelDepth = _pixelDepth;
                }
              }
              result2.displays = result2.displays.map((element) => {
                if (_refreshRate && !element.currentRefreshRate) {
                  element.currentRefreshRate = _refreshRate;
                }
                return element;
              });
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }).catch(() => {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch (e) {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
    function parseLinesWindowsControllers(sections, vections) {
      const memorySizes = {};
      for (const i in vections) {
        if ({}.hasOwnProperty.call(vections, i)) {
          if (vections[i].trim() !== "") {
            const lines = vections[i].trim().split(`
`);
            const matchingDeviceId = util.getValue(lines, "MatchingDeviceId").match(/PCI\\(VEN_[0-9A-F]{4})&(DEV_[0-9A-F]{4})(?:&(SUBSYS_[0-9A-F]{8}))?(?:&(REV_[0-9A-F]{2}))?/i);
            if (matchingDeviceId) {
              const quadWordmemorySize = parseInt(util.getValue(lines, "HardwareInformation.qwMemorySize"));
              if (!isNaN(quadWordmemorySize)) {
                let deviceId = matchingDeviceId[1].toUpperCase() + "&" + matchingDeviceId[2].toUpperCase();
                if (matchingDeviceId[3]) {
                  deviceId += "&" + matchingDeviceId[3].toUpperCase();
                }
                if (matchingDeviceId[4]) {
                  deviceId += "&" + matchingDeviceId[4].toUpperCase();
                }
                memorySizes[deviceId] = quadWordmemorySize;
              }
            }
          }
        }
      }
      const controllers = [];
      for (const i in sections) {
        if ({}.hasOwnProperty.call(sections, i)) {
          if (sections[i].trim() !== "") {
            const lines = sections[i].trim().split(`
`);
            const pnpDeviceId = util.getValue(lines, "PNPDeviceID", ":").match(/PCI\\(VEN_[0-9A-F]{4})&(DEV_[0-9A-F]{4})(?:&(SUBSYS_[0-9A-F]{8}))?(?:&(REV_[0-9A-F]{2}))?/i);
            let subDeviceId = null;
            let memorySize = null;
            if (pnpDeviceId) {
              subDeviceId = pnpDeviceId[3] || "";
              if (subDeviceId) {
                subDeviceId = subDeviceId.split("_")[1];
              }
              if (memorySize == null && pnpDeviceId[3] && pnpDeviceId[4]) {
                const deviceId = pnpDeviceId[1].toUpperCase() + "&" + pnpDeviceId[2].toUpperCase() + "&" + pnpDeviceId[3].toUpperCase() + "&" + pnpDeviceId[4].toUpperCase();
                if ({}.hasOwnProperty.call(memorySizes, deviceId)) {
                  memorySize = memorySizes[deviceId];
                }
              }
              if (memorySize == null && pnpDeviceId[3]) {
                const deviceId = pnpDeviceId[1].toUpperCase() + "&" + pnpDeviceId[2].toUpperCase() + "&" + pnpDeviceId[3].toUpperCase();
                if ({}.hasOwnProperty.call(memorySizes, deviceId)) {
                  memorySize = memorySizes[deviceId];
                }
              }
              if (memorySize == null && pnpDeviceId[4]) {
                const deviceId = pnpDeviceId[1].toUpperCase() + "&" + pnpDeviceId[2].toUpperCase() + "&" + pnpDeviceId[4].toUpperCase();
                if ({}.hasOwnProperty.call(memorySizes, deviceId)) {
                  memorySize = memorySizes[deviceId];
                }
              }
              if (memorySize == null) {
                const deviceId = pnpDeviceId[1].toUpperCase() + "&" + pnpDeviceId[2].toUpperCase();
                if ({}.hasOwnProperty.call(memorySizes, deviceId)) {
                  memorySize = memorySizes[deviceId];
                }
              }
            }
            controllers.push({
              vendor: util.getValue(lines, "AdapterCompatibility", ":"),
              model: util.getValue(lines, "name", ":"),
              bus: util.getValue(lines, "PNPDeviceID", ":").startsWith("PCI") ? "PCI" : "",
              vram: (memorySize == null ? util.toInt(util.getValue(lines, "AdapterRAM", ":")) : memorySize) / 1024 / 1024,
              vramDynamic: util.getValue(lines, "VideoMemoryType", ":") === "2",
              subDeviceId
            });
            _resolutionX = util.toInt(util.getValue(lines, "CurrentHorizontalResolution", ":")) || _resolutionX;
            _resolutionY = util.toInt(util.getValue(lines, "CurrentVerticalResolution", ":")) || _resolutionY;
            _refreshRate = util.toInt(util.getValue(lines, "CurrentRefreshRate", ":")) || _refreshRate;
            _pixelDepth = util.toInt(util.getValue(lines, "CurrentBitsPerPixel", ":")) || _pixelDepth;
          }
        }
      }
      return controllers;
    }
    function parseLinesWindowsDisplaysPowershell(ssections, msections, dsections, tsections, isections) {
      const displays = [];
      let vendor = "";
      let model = "";
      let deviceID = "";
      let resolutionX = 0;
      let resolutionY = 0;
      if (dsections && dsections.length) {
        const linesDisplay = dsections[0].split(`
`);
        vendor = util.getValue(linesDisplay, "MonitorManufacturer", ":");
        model = util.getValue(linesDisplay, "Name", ":");
        deviceID = util.getValue(linesDisplay, "PNPDeviceID", ":").replace(/&amp;/g, "&").toLowerCase();
        resolutionX = util.toInt(util.getValue(linesDisplay, "ScreenWidth", ":"));
        resolutionY = util.toInt(util.getValue(linesDisplay, "ScreenHeight", ":"));
      }
      for (let i = 0;i < ssections.length; i++) {
        if (ssections[i].trim() !== "") {
          ssections[i] = "BitsPerPixel " + ssections[i];
          msections[i] = "Active " + msections[i];
          if (tsections.length === 0 || tsections[i] === undefined) {
            tsections[i] = "Unknown";
          }
          const linesScreen = ssections[i].split(`
`);
          const linesMonitor = msections[i].split(`
`);
          const linesConnection = tsections[i].split(`
`);
          const bitsPerPixel = util.getValue(linesScreen, "BitsPerPixel");
          const bounds = util.getValue(linesScreen, "Bounds").replace("{", "").replace("}", "").replace(/=/g, ":").split(",");
          const primary = util.getValue(linesScreen, "Primary");
          const sizeX = util.getValue(linesMonitor, "MaxHorizontalImageSize");
          const sizeY = util.getValue(linesMonitor, "MaxVerticalImageSize");
          const instanceName = util.getValue(linesMonitor, "InstanceName").toLowerCase();
          const videoOutputTechnology = util.getValue(linesConnection, "VideoOutputTechnology");
          const deviceName = util.getValue(linesScreen, "DeviceName");
          let displayVendor = "";
          let displayModel = "";
          isections.forEach((element) => {
            if (element.instanceId.toLowerCase().startsWith(instanceName) && vendor.startsWith("(") && model.startsWith("PnP")) {
              displayVendor = element.vendor;
              displayModel = element.model;
            }
          });
          displays.push({
            vendor: instanceName.startsWith(deviceID) && displayVendor === "" ? vendor : displayVendor,
            model: instanceName.startsWith(deviceID) && displayModel === "" ? model : displayModel,
            deviceName,
            main: primary.toLowerCase() === "true",
            builtin: videoOutputTechnology === "2147483648",
            connection: videoOutputTechnology && videoTypes[videoOutputTechnology] ? videoTypes[videoOutputTechnology] : "",
            resolutionX: util.toInt(util.getValue(bounds, "Width", ":")),
            resolutionY: util.toInt(util.getValue(bounds, "Height", ":")),
            sizeX: sizeX ? parseInt(sizeX, 10) : null,
            sizeY: sizeY ? parseInt(sizeY, 10) : null,
            pixelDepth: bitsPerPixel,
            currentResX: util.toInt(util.getValue(bounds, "Width", ":")),
            currentResY: util.toInt(util.getValue(bounds, "Height", ":")),
            positionX: util.toInt(util.getValue(bounds, "X", ":")),
            positionY: util.toInt(util.getValue(bounds, "Y", ":"))
          });
        }
      }
      if (ssections.length === 0) {
        displays.push({
          vendor,
          model,
          main: true,
          sizeX: null,
          sizeY: null,
          resolutionX,
          resolutionY,
          pixelDepth: null,
          currentResX: resolutionX,
          currentResY: resolutionY,
          positionX: 0,
          positionY: 0
        });
      }
      return displays;
    }
  }
  exports.graphics = graphics;
});

// node_modules/systeminformation/lib/filesystem.js
var require_filesystem = __commonJS((exports) => {
  var util = require_util();
  var fs = __require("fs");
  var exec = __require("child_process").exec;
  var execSync = __require("child_process").execSync;
  var execPromiseSave = util.promisifySave(__require("child_process").exec);
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  var _fs_speed = {};
  var _disk_io = {};
  function fsSize(drive, callback) {
    if (util.isFunction(drive)) {
      callback = drive;
      drive = "";
    }
    let macOsDisks = [];
    let osMounts = [];
    function getmacOsFsType(fs2) {
      if (!fs2.startsWith("/")) {
        return "NFS";
      }
      const parts = fs2.split("/");
      const fsShort = parts[parts.length - 1];
      const macOsDisksSingle = macOsDisks.filter((item) => item.indexOf(fsShort) >= 0);
      if (macOsDisksSingle.length === 1 && macOsDisksSingle[0].indexOf("APFS") >= 0) {
        return "APFS";
      }
      return "HFS";
    }
    function isLinuxTmpFs(fs2) {
      const linuxTmpFileSystems = ["rootfs", "unionfs", "squashfs", "cramfs", "initrd", "initramfs", "devtmpfs", "tmpfs", "udev", "devfs", "specfs", "type", "appimaged"];
      let result2 = false;
      linuxTmpFileSystems.forEach((linuxFs) => {
        if (fs2.toLowerCase().indexOf(linuxFs) >= 0) {
          result2 = true;
        }
      });
      return result2;
    }
    function filterLines(stdout) {
      const lines = stdout.toString().split(`
`);
      lines.shift();
      if (stdout.toString().toLowerCase().indexOf("filesystem")) {
        let removeLines = 0;
        for (let i = 0;i < lines.length; i++) {
          if (lines[i] && lines[i].toLowerCase().startsWith("filesystem")) {
            removeLines = i;
          }
        }
        for (let i = 0;i < removeLines; i++) {
          lines.shift();
        }
      }
      return lines;
    }
    function parseDf(lines) {
      const data = [];
      lines.forEach((line) => {
        if (line !== "") {
          line = line.replace(/ +/g, " ").split(" ");
          if (line && (line[0].startsWith("/") || line[6] && line[6] === "/" || line[0].indexOf("/") > 0 || line[0].indexOf(":") === 1 || !_darwin && !isLinuxTmpFs(line[1]))) {
            const fs2 = line[0];
            const fsType = _linux || _freebsd || _openbsd || _netbsd ? line[1] : getmacOsFsType(line[0]);
            const size = parseInt(_linux || _freebsd || _openbsd || _netbsd ? line[2] : line[1], 10) * 1024;
            const used = parseInt(_linux || _freebsd || _openbsd || _netbsd ? line[3] : line[2], 10) * 1024;
            const available = parseInt(_linux || _freebsd || _openbsd || _netbsd ? line[4] : line[3], 10) * 1024;
            const use = parseFloat((100 * (used / (used + available))).toFixed(2));
            const rw = osMounts && Object.keys(osMounts).length > 0 ? osMounts[fs2] || false : null;
            line.splice(0, _linux || _freebsd || _openbsd || _netbsd ? 6 : 5);
            const mount = line.join(" ");
            if (!data.find((el) => el.fs === fs2 && el.type === fsType && el.mount === mount)) {
              data.push({
                fs: fs2,
                type: fsType,
                size,
                used,
                available,
                use,
                mount,
                rw
              });
            }
          }
        }
      });
      return data;
    }
    return new Promise((resolve) => {
      process.nextTick(() => {
        let data = [];
        if (_linux || _freebsd || _openbsd || _netbsd || _darwin) {
          let cmd = "";
          macOsDisks = [];
          osMounts = {};
          if (_darwin) {
            cmd = "df -kP";
            try {
              macOsDisks = execSync("diskutil list").toString().split(`
`).filter((line) => {
                return !line.startsWith("/") && line.indexOf(":") > 0;
              });
              execSync("mount").toString().split(`
`).filter((line) => {
                return line.startsWith("/");
              }).forEach((line) => {
                osMounts[line.split(" ")[0]] = line.toLowerCase().indexOf("read-only") === -1;
              });
            } catch {
              util.noop();
            }
          }
          if (_linux) {
            try {
              cmd = "export LC_ALL=C; df -kPTx squashfs; unset LC_ALL";
              execSync("cat /proc/mounts 2>/dev/null", util.execOptsLinux).toString().split(`
`).filter((line) => {
                return line.startsWith("/");
              }).forEach((line) => {
                osMounts[line.split(" ")[0]] = osMounts[line.split(" ")[0]] || false;
                if (line.toLowerCase().indexOf("/snap/") === -1) {
                  osMounts[line.split(" ")[0]] = line.toLowerCase().indexOf("rw,") >= 0 || line.toLowerCase().indexOf(" rw ") >= 0;
                }
              });
            } catch {
              util.noop();
            }
          }
          if (_freebsd || _openbsd || _netbsd) {
            try {
              cmd = "df -kPT";
              execSync("mount").toString().split(`
`).forEach((line) => {
                osMounts[line.split(" ")[0]] = line.toLowerCase().indexOf("read-only") === -1;
              });
            } catch {
              util.noop();
            }
          }
          exec(cmd, { maxBuffer: 1024 * 1024 }, (error2, stdout) => {
            const lines = filterLines(stdout);
            data = parseDf(lines);
            if (drive) {
              data = data.filter((item) => {
                return item.fs.toLowerCase().indexOf(drive.toLowerCase()) >= 0 || item.mount.toLowerCase().indexOf(drive.toLowerCase()) >= 0;
              });
            }
            if ((!error2 || data.length) && stdout.toString().trim() !== "") {
              if (callback) {
                callback(data);
              }
              resolve(data);
            } else {
              exec("df -kPT 2>/dev/null", { maxBuffer: 1024 * 1024 }, (error3, stdout2) => {
                const lines2 = filterLines(stdout2);
                data = parseDf(lines2);
                if (callback) {
                  callback(data);
                }
                resolve(data);
              });
            }
          });
        }
        if (_sunos) {
          if (callback) {
            callback(data);
          }
          resolve(data);
        }
        if (_windows) {
          try {
            const driveSanitized = drive ? util.sanitizeShellString(drive, true) : "";
            const cmd = `Get-WmiObject Win32_logicaldisk | select Access,Caption,FileSystem,FreeSpace,Size ${driveSanitized ? "| where -property Caption -eq " + driveSanitized : ""} | fl`;
            util.powerShell(cmd).then((stdout, error2) => {
              if (!error2) {
                const devices = stdout.toString().split(/\n\s*\n/);
                devices.forEach((device) => {
                  const lines = device.split(`\r
`);
                  const size = util.toInt(util.getValue(lines, "size", ":"));
                  const free = util.toInt(util.getValue(lines, "freespace", ":"));
                  const caption = util.getValue(lines, "caption", ":");
                  const rwValue = util.getValue(lines, "access", ":");
                  const rw = rwValue ? util.toInt(rwValue) !== 1 : null;
                  if (size) {
                    data.push({
                      fs: caption,
                      type: util.getValue(lines, "filesystem", ":"),
                      size,
                      used: size - free,
                      available: free,
                      use: parseFloat((100 * (size - free) / size).toFixed(2)),
                      mount: caption,
                      rw
                    });
                  }
                });
              }
              if (callback) {
                callback(data);
              }
              resolve(data);
            });
          } catch {
            if (callback) {
              callback(data);
            }
            resolve(data);
          }
        }
      });
    });
  }
  exports.fsSize = fsSize;
  function fsOpenFiles(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        const result2 = {
          max: null,
          allocated: null,
          available: null
        };
        if (_freebsd || _openbsd || _netbsd || _darwin) {
          const cmd = "sysctl -i kern.maxfiles kern.num_files kern.open_files";
          exec(cmd, { maxBuffer: 1024 * 1024 }, (error2, stdout) => {
            if (!error2) {
              const lines = stdout.toString().split(`
`);
              result2.max = parseInt(util.getValue(lines, "kern.maxfiles", ":"), 10);
              result2.allocated = parseInt(util.getValue(lines, "kern.num_files", ":"), 10) || parseInt(util.getValue(lines, "kern.open_files", ":"), 10);
              result2.available = result2.max - result2.allocated;
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_linux) {
          fs.readFile("/proc/sys/fs/file-nr", (error2, stdout) => {
            if (!error2) {
              const lines = stdout.toString().split(`
`);
              if (lines[0]) {
                const parts = lines[0].replace(/\s+/g, " ").split(" ");
                if (parts.length === 3) {
                  result2.allocated = parseInt(parts[0], 10);
                  result2.available = parseInt(parts[1], 10);
                  result2.max = parseInt(parts[2], 10);
                  if (!result2.available) {
                    result2.available = result2.max - result2.allocated;
                  }
                }
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            } else {
              fs.readFile("/proc/sys/fs/file-max", (error3, stdout2) => {
                if (!error3) {
                  const lines = stdout2.toString().split(`
`);
                  if (lines[0]) {
                    result2.max = parseInt(lines[0], 10);
                  }
                }
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              });
            }
          });
        }
        if (_sunos) {
          if (callback) {
            callback(null);
          }
          resolve(null);
        }
        if (_windows) {
          if (callback) {
            callback(null);
          }
          resolve(null);
        }
      });
    });
  }
  exports.fsOpenFiles = fsOpenFiles;
  function parseBytes(s) {
    return parseInt(s.substr(s.indexOf(" (") + 2, s.indexOf(" Bytes)") - 10), 10);
  }
  function parseDevices(lines) {
    const devices = [];
    let i = 0;
    lines.forEach((line) => {
      if (line.length > 0) {
        if (line[0] === "*") {
          i++;
        } else {
          const parts = line.split(":");
          if (parts.length > 1) {
            if (!devices[i]) {
              devices[i] = {
                name: "",
                identifier: "",
                type: "disk",
                fsType: "",
                mount: "",
                size: 0,
                physical: "HDD",
                uuid: "",
                label: "",
                model: "",
                serial: "",
                removable: false,
                protocol: "",
                group: "",
                device: ""
              };
            }
            parts[0] = parts[0].trim().toUpperCase().replace(/ +/g, "");
            parts[1] = parts[1].trim();
            if (parts[0] === "DEVICEIDENTIFIER") {
              devices[i].identifier = parts[1];
            }
            if (parts[0] === "DEVICENODE") {
              devices[i].name = parts[1];
            }
            if (parts[0] === "VOLUMENAME") {
              if (parts[1].indexOf("Not applicable") === -1) {
                devices[i].label = parts[1];
              }
            }
            if (parts[0] === "PROTOCOL") {
              devices[i].protocol = parts[1];
            }
            if (parts[0] === "DISKSIZE") {
              devices[i].size = parseBytes(parts[1]);
            }
            if (parts[0] === "FILESYSTEMPERSONALITY") {
              devices[i].fsType = parts[1];
            }
            if (parts[0] === "MOUNTPOINT") {
              devices[i].mount = parts[1];
            }
            if (parts[0] === "VOLUMEUUID") {
              devices[i].uuid = parts[1];
            }
            if (parts[0] === "READ-ONLYMEDIA" && parts[1] === "Yes") {
              devices[i].physical = "CD/DVD";
            }
            if (parts[0] === "SOLIDSTATE" && parts[1] === "Yes") {
              devices[i].physical = "SSD";
            }
            if (parts[0] === "VIRTUAL") {
              devices[i].type = "virtual";
            }
            if (parts[0] === "REMOVABLEMEDIA") {
              devices[i].removable = parts[1] === "Removable";
            }
            if (parts[0] === "PARTITIONTYPE") {
              devices[i].type = "part";
            }
            if (parts[0] === "DEVICE/MEDIANAME") {
              devices[i].model = parts[1];
            }
          }
        }
      }
    });
    return devices;
  }
  function parseBlk(lines) {
    let data = [];
    lines.filter((line) => line !== "").forEach((line) => {
      try {
        line = decodeURIComponent(line.replace(/\\x/g, "%"));
        line = line.replace(/\\/g, "\\\\");
        const disk = JSON.parse(line);
        data.push({
          name: util.sanitizeShellString(disk.name),
          type: disk.type,
          fsType: disk.fsType,
          mount: disk.mountpoint,
          size: parseInt(disk.size, 10),
          physical: disk.type === "disk" ? disk.rota === "0" ? "SSD" : "HDD" : disk.type === "rom" ? "CD/DVD" : "",
          uuid: disk.uuid,
          label: disk.label,
          model: (disk.model || "").trim(),
          serial: disk.serial,
          removable: disk.rm === "1",
          protocol: disk.tran,
          group: disk.group || ""
        });
      } catch {
        util.noop();
      }
    });
    data = util.unique(data);
    data = util.sortByKey(data, ["type", "name"]);
    return data;
  }
  function decodeMdabmData(lines) {
    const raid = util.getValue(lines, "md_level", "=");
    const label = util.getValue(lines, "md_name", "=");
    const uuid = util.getValue(lines, "md_uuid", "=");
    const members = [];
    lines.forEach((line) => {
      if (line.toLowerCase().startsWith("md_device_dev") && line.toLowerCase().indexOf("/dev/") > 0) {
        members.push(line.split("/dev/")[1]);
      }
    });
    return {
      raid,
      label,
      uuid,
      members
    };
  }
  function raidMatchLinux(data) {
    let result2 = data;
    try {
      data.forEach((element) => {
        if (element.type.startsWith("raid")) {
          const lines = execSync(`mdadm --export --detail /dev/${element.name}`, util.execOptsLinux).toString().split(`
`);
          const mdData = decodeMdabmData(lines);
          element.label = mdData.label;
          element.uuid = mdData.uuid;
          if (mdData && mdData.members && mdData.members.length && mdData.raid === element.type) {
            result2 = result2.map((blockdevice) => {
              if (blockdevice.fsType === "linux_raid_member" && mdData.members.indexOf(blockdevice.name) >= 0) {
                blockdevice.group = element.name;
              }
              return blockdevice;
            });
          }
        }
      });
    } catch {
      util.noop();
    }
    return result2;
  }
  function getDevicesLinux(data) {
    const result2 = [];
    data.forEach((element) => {
      if (element.type.startsWith("disk")) {
        result2.push(element.name);
      }
    });
    return result2;
  }
  function matchDevicesLinux(data) {
    let result2 = data;
    try {
      const devices = getDevicesLinux(data);
      result2 = result2.map((blockdevice) => {
        if (blockdevice.type.startsWith("part") || blockdevice.type.startsWith("disk")) {
          devices.forEach((element) => {
            if (blockdevice.name.startsWith(element)) {
              blockdevice.device = "/dev/" + element;
            }
          });
        }
        return blockdevice;
      });
    } catch {
      util.noop();
    }
    return result2;
  }
  function getDevicesMac(data) {
    const result2 = [];
    data.forEach((element) => {
      if (element.type.startsWith("disk")) {
        result2.push({ name: element.name, model: element.model, device: element.name });
      }
      if (element.type.startsWith("virtual")) {
        let device = "";
        result2.forEach((e) => {
          if (e.model === element.model) {
            device = e.device;
          }
        });
        if (device) {
          result2.push({ name: element.name, model: element.model, device });
        }
      }
    });
    return result2;
  }
  function matchDevicesMac(data) {
    let result2 = data;
    try {
      const devices = getDevicesMac(data);
      result2 = result2.map((blockdevice) => {
        if (blockdevice.type.startsWith("part") || blockdevice.type.startsWith("disk") || blockdevice.type.startsWith("virtual")) {
          devices.forEach((element) => {
            if (blockdevice.name.startsWith(element.name)) {
              blockdevice.device = element.device;
            }
          });
        }
        return blockdevice;
      });
    } catch {
      util.noop();
    }
    return result2;
  }
  function getDevicesWin(diskDrives) {
    const result2 = [];
    diskDrives.forEach((element) => {
      const lines = element.split(`\r
`);
      const device = util.getValue(lines, "DeviceID", ":");
      let partitions = element.split("@{DeviceID=");
      if (partitions.length > 1) {
        partitions = partitions.slice(1);
        partitions.forEach((partition) => {
          result2.push({ name: partition.split(";")[0].toUpperCase(), device });
        });
      }
    });
    return result2;
  }
  function matchDevicesWin(data, diskDrives) {
    const devices = getDevicesWin(diskDrives);
    data.map((element) => {
      const filteresDevices = devices.filter((e) => {
        return e.name === element.name.toUpperCase();
      });
      if (filteresDevices.length > 0) {
        element.device = filteresDevices[0].device;
      }
      return element;
    });
    return data;
  }
  function blkStdoutToObject(stdout) {
    return stdout.toString().replace(/NAME=/g, '{"name":').replace(/FSTYPE=/g, ',"fsType":').replace(/TYPE=/g, ',"type":').replace(/SIZE=/g, ',"size":').replace(/MOUNTPOINT=/g, ',"mountpoint":').replace(/UUID=/g, ',"uuid":').replace(/ROTA=/g, ',"rota":').replace(/RO=/g, ',"ro":').replace(/RM=/g, ',"rm":').replace(/TRAN=/g, ',"tran":').replace(/SERIAL=/g, ',"serial":').replace(/LABEL=/g, ',"label":').replace(/MODEL=/g, ',"model":').replace(/OWNER=/g, ',"owner":').replace(/GROUP=/g, ',"group":').replace(/\n/g, `}
`);
  }
  function blockDevices(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let data = [];
        if (_linux) {
          const procLsblk1 = exec("lsblk -bPo NAME,TYPE,SIZE,FSTYPE,MOUNTPOINT,UUID,ROTA,RO,RM,TRAN,SERIAL,LABEL,MODEL,OWNER 2>/dev/null", { maxBuffer: 1024 * 1024 }, (error2, stdout) => {
            if (!error2) {
              const lines = blkStdoutToObject(stdout).split(`
`);
              data = parseBlk(lines);
              data = raidMatchLinux(data);
              data = matchDevicesLinux(data);
              if (callback) {
                callback(data);
              }
              resolve(data);
            } else {
              const procLsblk2 = exec("lsblk -bPo NAME,TYPE,SIZE,FSTYPE,MOUNTPOINT,UUID,ROTA,RO,RM,LABEL,MODEL,OWNER 2>/dev/null", { maxBuffer: 1024 * 1024 }, (error3, stdout2) => {
                if (!error3) {
                  const lines = blkStdoutToObject(stdout2).split(`
`);
                  data = parseBlk(lines);
                  data = raidMatchLinux(data);
                }
                if (callback) {
                  callback(data);
                }
                resolve(data);
              });
              procLsblk2.on("error", () => {
                if (callback) {
                  callback(data);
                }
                resolve(data);
              });
            }
          });
          procLsblk1.on("error", () => {
            if (callback) {
              callback(data);
            }
            resolve(data);
          });
        }
        if (_darwin) {
          const procDskutil = exec("diskutil info -all", { maxBuffer: 1024 * 1024 }, (error2, stdout) => {
            if (!error2) {
              const lines = stdout.toString().split(`
`);
              data = parseDevices(lines);
              data = matchDevicesMac(data);
            }
            if (callback) {
              callback(data);
            }
            resolve(data);
          });
          procDskutil.on("error", () => {
            if (callback) {
              callback(data);
            }
            resolve(data);
          });
        }
        if (_sunos) {
          if (callback) {
            callback(data);
          }
          resolve(data);
        }
        if (_windows) {
          const drivetypes = ["Unknown", "NoRoot", "Removable", "Local", "Network", "CD/DVD", "RAM"];
          try {
            const workload = [];
            workload.push(util.powerShell("Get-CimInstance -ClassName Win32_LogicalDisk | select Caption,DriveType,Name,FileSystem,Size,VolumeSerialNumber,VolumeName | fl"));
            workload.push(util.powerShell("Get-WmiObject -Class Win32_diskdrive | Select-Object -Property PNPDeviceId,DeviceID, Model, Size, @{L='Partitions'; E={$_.GetRelated('Win32_DiskPartition').GetRelated('Win32_LogicalDisk') | Select-Object -Property DeviceID, VolumeName, Size, FreeSpace}} | fl"));
            util.promiseAll(workload).then((res) => {
              const logicalDisks = res.results[0].toString().split(/\n\s*\n/);
              const diskDrives = res.results[1].toString().split(/\n\s*\n/);
              logicalDisks.forEach((device) => {
                const lines = device.split(`\r
`);
                const drivetype = util.getValue(lines, "drivetype", ":");
                if (drivetype) {
                  data.push({
                    name: util.getValue(lines, "name", ":"),
                    identifier: util.getValue(lines, "caption", ":"),
                    type: "disk",
                    fsType: util.getValue(lines, "filesystem", ":").toLowerCase(),
                    mount: util.getValue(lines, "caption", ":"),
                    size: util.getValue(lines, "size", ":"),
                    physical: drivetype >= 0 && drivetype <= 6 ? drivetypes[drivetype] : drivetypes[0],
                    uuid: util.getValue(lines, "volumeserialnumber", ":"),
                    label: util.getValue(lines, "volumename", ":"),
                    model: "",
                    serial: util.getValue(lines, "volumeserialnumber", ":"),
                    removable: drivetype === "2",
                    protocol: "",
                    group: "",
                    device: ""
                  });
                }
              });
              data = matchDevicesWin(data, diskDrives);
              if (callback) {
                callback(data);
              }
              resolve(data);
            });
          } catch {
            if (callback) {
              callback(data);
            }
            resolve(data);
          }
        }
        if (_freebsd || _openbsd || _netbsd) {
          if (callback) {
            callback(null);
          }
          resolve(null);
        }
      });
    });
  }
  exports.blockDevices = blockDevices;
  function calcFsSpeed(rx, wx) {
    const result2 = {
      rx: 0,
      wx: 0,
      tx: 0,
      rx_sec: null,
      wx_sec: null,
      tx_sec: null,
      ms: 0
    };
    if (_fs_speed && _fs_speed.ms) {
      result2.rx = rx;
      result2.wx = wx;
      result2.tx = result2.rx + result2.wx;
      result2.ms = Date.now() - _fs_speed.ms;
      result2.rx_sec = (result2.rx - _fs_speed.bytes_read) / (result2.ms / 1000);
      result2.wx_sec = (result2.wx - _fs_speed.bytes_write) / (result2.ms / 1000);
      result2.tx_sec = result2.rx_sec + result2.wx_sec;
      _fs_speed.rx_sec = result2.rx_sec;
      _fs_speed.wx_sec = result2.wx_sec;
      _fs_speed.tx_sec = result2.tx_sec;
      _fs_speed.bytes_read = result2.rx;
      _fs_speed.bytes_write = result2.wx;
      _fs_speed.bytes_overall = result2.rx + result2.wx;
      _fs_speed.ms = Date.now();
      _fs_speed.last_ms = result2.ms;
    } else {
      result2.rx = rx;
      result2.wx = wx;
      result2.tx = result2.rx + result2.wx;
      _fs_speed.rx_sec = null;
      _fs_speed.wx_sec = null;
      _fs_speed.tx_sec = null;
      _fs_speed.bytes_read = result2.rx;
      _fs_speed.bytes_write = result2.wx;
      _fs_speed.bytes_overall = result2.rx + result2.wx;
      _fs_speed.ms = Date.now();
      _fs_speed.last_ms = 0;
    }
    return result2;
  }
  function fsStats(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        if (_windows || _freebsd || _openbsd || _netbsd || _sunos) {
          return resolve(null);
        }
        let result2 = {
          rx: 0,
          wx: 0,
          tx: 0,
          rx_sec: null,
          wx_sec: null,
          tx_sec: null,
          ms: 0
        };
        let rx = 0;
        let wx = 0;
        if (_fs_speed && !_fs_speed.ms || _fs_speed && _fs_speed.ms && Date.now() - _fs_speed.ms >= 500) {
          if (_linux) {
            const procLsblk = exec("lsblk -r 2>/dev/null | grep /", { maxBuffer: 1024 * 1024 }, (error2, stdout) => {
              if (!error2) {
                const lines = stdout.toString().split(`
`);
                const fs_filter = [];
                lines.forEach((line) => {
                  if (line !== "") {
                    line = line.trim().split(" ");
                    if (fs_filter.indexOf(line[0]) === -1) {
                      fs_filter.push(line[0]);
                    }
                  }
                });
                const output = fs_filter.join("|");
                const procCat = exec('cat /proc/diskstats | egrep "' + output + '"', { maxBuffer: 1024 * 1024 }, (error3, stdout2) => {
                  if (!error3) {
                    const lines2 = stdout2.toString().split(`
`);
                    lines2.forEach((line) => {
                      line = line.trim();
                      if (line !== "") {
                        line = line.replace(/ +/g, " ").split(" ");
                        rx += parseInt(line[5], 10) * 512;
                        wx += parseInt(line[9], 10) * 512;
                      }
                    });
                    result2 = calcFsSpeed(rx, wx);
                  }
                  if (callback) {
                    callback(result2);
                  }
                  resolve(result2);
                });
                procCat.on("error", () => {
                  if (callback) {
                    callback(result2);
                  }
                  resolve(result2);
                });
              } else {
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              }
            });
            procLsblk.on("error", () => {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          }
          if (_darwin) {
            const procIoreg = exec(`ioreg -c IOBlockStorageDriver -k Statistics -r -w0 | sed -n "/IOBlockStorageDriver/,/Statistics/p" | grep "Statistics" | tr -cd "01234567890,
"`, { maxBuffer: 1024 * 1024 }, (error2, stdout) => {
              if (!error2) {
                const lines = stdout.toString().split(`
`);
                lines.forEach((line) => {
                  line = line.trim();
                  if (line !== "") {
                    line = line.split(",");
                    rx += parseInt(line[2], 10);
                    wx += parseInt(line[9], 10);
                  }
                });
                result2 = calcFsSpeed(rx, wx);
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
            procIoreg.on("error", () => {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          }
        } else {
          result2.ms = _fs_speed.last_ms;
          result2.rx = _fs_speed.bytes_read;
          result2.wx = _fs_speed.bytes_write;
          result2.tx = _fs_speed.bytes_read + _fs_speed.bytes_write;
          result2.rx_sec = _fs_speed.rx_sec;
          result2.wx_sec = _fs_speed.wx_sec;
          result2.tx_sec = _fs_speed.tx_sec;
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
      });
    });
  }
  exports.fsStats = fsStats;
  function calcDiskIO(rIO, wIO, rWaitTime, wWaitTime, tWaitTime) {
    const result2 = {
      rIO: 0,
      wIO: 0,
      tIO: 0,
      rIO_sec: null,
      wIO_sec: null,
      tIO_sec: null,
      rWaitTime: 0,
      wWaitTime: 0,
      tWaitTime: 0,
      rWaitPercent: null,
      wWaitPercent: null,
      tWaitPercent: null,
      ms: 0
    };
    if (_disk_io && _disk_io.ms) {
      result2.rIO = rIO;
      result2.wIO = wIO;
      result2.tIO = rIO + wIO;
      result2.ms = Date.now() - _disk_io.ms;
      result2.rIO_sec = (result2.rIO - _disk_io.rIO) / (result2.ms / 1000);
      result2.wIO_sec = (result2.wIO - _disk_io.wIO) / (result2.ms / 1000);
      result2.tIO_sec = result2.rIO_sec + result2.wIO_sec;
      result2.rWaitTime = rWaitTime;
      result2.wWaitTime = wWaitTime;
      result2.tWaitTime = tWaitTime;
      result2.rWaitPercent = (result2.rWaitTime - _disk_io.rWaitTime) * 100 / result2.ms;
      result2.wWaitPercent = (result2.wWaitTime - _disk_io.wWaitTime) * 100 / result2.ms;
      result2.tWaitPercent = (result2.tWaitTime - _disk_io.tWaitTime) * 100 / result2.ms;
      _disk_io.rIO = rIO;
      _disk_io.wIO = wIO;
      _disk_io.rIO_sec = result2.rIO_sec;
      _disk_io.wIO_sec = result2.wIO_sec;
      _disk_io.tIO_sec = result2.tIO_sec;
      _disk_io.rWaitTime = rWaitTime;
      _disk_io.wWaitTime = wWaitTime;
      _disk_io.tWaitTime = tWaitTime;
      _disk_io.rWaitPercent = result2.rWaitPercent;
      _disk_io.wWaitPercent = result2.wWaitPercent;
      _disk_io.tWaitPercent = result2.tWaitPercent;
      _disk_io.last_ms = result2.ms;
      _disk_io.ms = Date.now();
    } else {
      result2.rIO = rIO;
      result2.wIO = wIO;
      result2.tIO = rIO + wIO;
      result2.rWaitTime = rWaitTime;
      result2.wWaitTime = wWaitTime;
      result2.tWaitTime = tWaitTime;
      _disk_io.rIO = rIO;
      _disk_io.wIO = wIO;
      _disk_io.rIO_sec = null;
      _disk_io.wIO_sec = null;
      _disk_io.tIO_sec = null;
      _disk_io.rWaitTime = rWaitTime;
      _disk_io.wWaitTime = wWaitTime;
      _disk_io.tWaitTime = tWaitTime;
      _disk_io.rWaitPercent = null;
      _disk_io.wWaitPercent = null;
      _disk_io.tWaitPercent = null;
      _disk_io.last_ms = 0;
      _disk_io.ms = Date.now();
    }
    return result2;
  }
  function disksIO(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        if (_windows) {
          return resolve(null);
        }
        if (_sunos) {
          return resolve(null);
        }
        let result2 = {
          rIO: 0,
          wIO: 0,
          tIO: 0,
          rIO_sec: null,
          wIO_sec: null,
          tIO_sec: null,
          rWaitTime: 0,
          wWaitTime: 0,
          tWaitTime: 0,
          rWaitPercent: null,
          wWaitPercent: null,
          tWaitPercent: null,
          ms: 0
        };
        let rIO = 0;
        let wIO = 0;
        let rWaitTime = 0;
        let wWaitTime = 0;
        let tWaitTime = 0;
        if (_disk_io && !_disk_io.ms || _disk_io && _disk_io.ms && Date.now() - _disk_io.ms >= 500) {
          if (_linux || _freebsd || _openbsd || _netbsd) {
            const cmd = 'for mount in `lsblk 2>/dev/null | grep " disk " | sed "s/[│└─├]//g" | awk \'{$1=$1};1\' | cut -d " " -f 1 | sort -u`; do cat /sys/block/$mount/stat | sed -r "s/ +/;/g" | sed -r "s/^;//"; done';
            exec(cmd, { maxBuffer: 1024 * 1024 }, (error2, stdout) => {
              if (!error2) {
                const lines = stdout.split(`
`);
                lines.forEach((line) => {
                  if (!line) {
                    return;
                  }
                  const stats = line.split(";");
                  rIO += parseInt(stats[0], 10);
                  wIO += parseInt(stats[4], 10);
                  rWaitTime += parseInt(stats[3], 10);
                  wWaitTime += parseInt(stats[7], 10);
                  tWaitTime += parseInt(stats[10], 10);
                });
                result2 = calcDiskIO(rIO, wIO, rWaitTime, wWaitTime, tWaitTime);
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              } else {
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              }
            });
          }
          if (_darwin) {
            exec(`ioreg -c IOBlockStorageDriver -k Statistics -r -w0 | sed -n "/IOBlockStorageDriver/,/Statistics/p" | grep "Statistics" | tr -cd "01234567890,
"`, { maxBuffer: 1024 * 1024 }, (error2, stdout) => {
              if (!error2) {
                const lines = stdout.toString().split(`
`);
                lines.forEach((line) => {
                  line = line.trim();
                  if (line !== "") {
                    line = line.split(",");
                    rIO += parseInt(line[10], 10);
                    wIO += parseInt(line[0], 10);
                  }
                });
                result2 = calcDiskIO(rIO, wIO, rWaitTime, wWaitTime, tWaitTime);
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          }
        } else {
          result2.rIO = _disk_io.rIO;
          result2.wIO = _disk_io.wIO;
          result2.tIO = _disk_io.rIO + _disk_io.wIO;
          result2.ms = _disk_io.last_ms;
          result2.rIO_sec = _disk_io.rIO_sec;
          result2.wIO_sec = _disk_io.wIO_sec;
          result2.tIO_sec = _disk_io.tIO_sec;
          result2.rWaitTime = _disk_io.rWaitTime;
          result2.wWaitTime = _disk_io.wWaitTime;
          result2.tWaitTime = _disk_io.tWaitTime;
          result2.rWaitPercent = _disk_io.rWaitPercent;
          result2.wWaitPercent = _disk_io.wWaitPercent;
          result2.tWaitPercent = _disk_io.tWaitPercent;
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
      });
    });
  }
  exports.disksIO = disksIO;
  function diskLayout(callback) {
    function getVendorFromModel(model) {
      const diskManufacturers = [
        { pattern: "WESTERN.*", manufacturer: "Western Digital" },
        { pattern: "^WDC.*", manufacturer: "Western Digital" },
        { pattern: "WD.*", manufacturer: "Western Digital" },
        { pattern: "TOSHIBA.*", manufacturer: "Toshiba" },
        { pattern: "HITACHI.*", manufacturer: "Hitachi" },
        { pattern: "^IC.*", manufacturer: "Hitachi" },
        { pattern: "^HTS.*", manufacturer: "Hitachi" },
        { pattern: "SANDISK.*", manufacturer: "SanDisk" },
        { pattern: "KINGSTON.*", manufacturer: "Kingston Technology" },
        { pattern: "^SONY.*", manufacturer: "Sony" },
        { pattern: "TRANSCEND.*", manufacturer: "Transcend" },
        { pattern: "SAMSUNG.*", manufacturer: "Samsung" },
        { pattern: "^ST(?!I\\ ).*", manufacturer: "Seagate" },
        { pattern: "^STI\\ .*", manufacturer: "SimpleTech" },
        { pattern: "^D...-.*", manufacturer: "IBM" },
        { pattern: "^IBM.*", manufacturer: "IBM" },
        { pattern: "^FUJITSU.*", manufacturer: "Fujitsu" },
        { pattern: "^MP.*", manufacturer: "Fujitsu" },
        { pattern: "^MK.*", manufacturer: "Toshiba" },
        { pattern: "MAXTO.*", manufacturer: "Maxtor" },
        { pattern: "PIONEER.*", manufacturer: "Pioneer" },
        { pattern: "PHILIPS.*", manufacturer: "Philips" },
        { pattern: "QUANTUM.*", manufacturer: "Quantum Technology" },
        { pattern: "FIREBALL.*", manufacturer: "Quantum Technology" },
        { pattern: "^VBOX.*", manufacturer: "VirtualBox" },
        { pattern: "CORSAIR.*", manufacturer: "Corsair Components" },
        { pattern: "CRUCIAL.*", manufacturer: "Crucial" },
        { pattern: "ECM.*", manufacturer: "ECM" },
        { pattern: "INTEL.*", manufacturer: "INTEL" },
        { pattern: "EVO.*", manufacturer: "Samsung" },
        { pattern: "APPLE.*", manufacturer: "Apple" }
      ];
      let result2 = "";
      if (model) {
        model = model.toUpperCase();
        diskManufacturers.forEach((manufacturer) => {
          const re = RegExp(manufacturer.pattern);
          if (re.test(model)) {
            result2 = manufacturer.manufacturer;
          }
        });
      }
      return result2;
    }
    return new Promise((resolve) => {
      process.nextTick(() => {
        const commitResult = (res) => {
          for (let i = 0;i < res.length; i++) {
            delete res[i].BSDName;
          }
          if (callback) {
            callback(res);
          }
          resolve(res);
        };
        const result2 = [];
        let cmd = "";
        if (_linux) {
          let cmdFullSmart = "";
          exec("export LC_ALL=C; lsblk -ablJO 2>/dev/null; unset LC_ALL", { maxBuffer: 1024 * 1024 }, (error2, stdout) => {
            if (!error2) {
              try {
                const out = stdout.toString().trim();
                let devices = [];
                try {
                  const outJSON = JSON.parse(out);
                  if (outJSON && {}.hasOwnProperty.call(outJSON, "blockdevices")) {
                    devices = outJSON.blockdevices.filter((item) => {
                      return item.type === "disk" && item.size > 0 && (item.model !== null || item.mountpoint === null && item.label === null && item.fstype === null && item.parttype === null && item.path && item.path.indexOf("/ram") !== 0 && item.path.indexOf("/loop") !== 0 && item["disc-max"] && item["disc-max"] !== 0);
                    });
                  }
                } catch {
                  try {
                    const out2 = execSync("export LC_ALL=C; lsblk -bPo NAME,TYPE,SIZE,FSTYPE,MOUNTPOINT,UUID,ROTA,RO,RM,LABEL,MODEL,OWNER,GROUP 2>/dev/null; unset LC_ALL", util.execOptsLinux).toString();
                    const lines = blkStdoutToObject(out2).split(`
`);
                    const data = parseBlk(lines);
                    devices = data.filter((item) => {
                      return item.type === "disk" && item.size > 0 && (item.model !== null && item.model !== "" || item.mount === "" && item.label === "" && item.fsType === "");
                    });
                  } catch {
                    util.noop();
                  }
                }
                devices.forEach((device) => {
                  let mediumType = "";
                  const BSDName = "/dev/" + device.name;
                  const logical = device.name;
                  try {
                    mediumType = execSync("cat /sys/block/" + logical + "/queue/rotational 2>/dev/null", util.execOptsLinux).toString().split(`
`)[0];
                  } catch {
                    util.noop();
                  }
                  let interfaceType = device.tran ? device.tran.toUpperCase().trim() : "";
                  if (interfaceType === "NVME") {
                    mediumType = "2";
                    interfaceType = "PCIe";
                  }
                  result2.push({
                    device: BSDName,
                    type: mediumType === "0" ? "SSD" : mediumType === "1" ? "HD" : mediumType === "2" ? "NVMe" : device.model && device.model.indexOf("SSD") > -1 ? "SSD" : device.model && device.model.indexOf("NVM") > -1 ? "NVMe" : "HD",
                    name: device.model || "",
                    vendor: getVendorFromModel(device.model) || (device.vendor ? device.vendor.trim() : ""),
                    size: device.size || 0,
                    bytesPerSector: null,
                    totalCylinders: null,
                    totalHeads: null,
                    totalSectors: null,
                    totalTracks: null,
                    tracksPerCylinder: null,
                    sectorsPerTrack: null,
                    firmwareRevision: device.rev ? device.rev.trim() : "",
                    serialNum: device.serial ? device.serial.trim() : "",
                    interfaceType,
                    smartStatus: "unknown",
                    temperature: null,
                    BSDName
                  });
                  cmd += `printf "
${BSDName}|"; smartctl -H ${BSDName} | grep overall;`;
                  cmdFullSmart += `${cmdFullSmart ? 'printf ",";' : ""}smartctl -a -j ${BSDName};`;
                });
              } catch {
                util.noop();
              }
            }
            if (cmdFullSmart) {
              exec(cmdFullSmart, { maxBuffer: 1024 * 1024 }, (error3, stdout2) => {
                try {
                  const data = JSON.parse(`[${stdout2}]`);
                  data.forEach((disk) => {
                    const diskBSDName = disk.smartctl.argv[disk.smartctl.argv.length - 1];
                    for (let i = 0;i < result2.length; i++) {
                      if (result2[i].BSDName === diskBSDName) {
                        result2[i].smartStatus = disk.smart_status.passed ? "Ok" : disk.smart_status.passed === false ? "Predicted Failure" : "unknown";
                        if (disk.temperature && disk.temperature.current) {
                          result2[i].temperature = disk.temperature.current;
                        }
                        result2[i].smartData = disk;
                      }
                    }
                  });
                  commitResult(result2);
                } catch {
                  if (cmd) {
                    cmd = cmd + `printf "
"`;
                    exec(cmd, { maxBuffer: 1024 * 1024 }, (error4, stdout3) => {
                      const lines = stdout3.toString().split(`
`);
                      lines.forEach((line) => {
                        if (line) {
                          const parts = line.split("|");
                          if (parts.length === 2) {
                            const BSDName = parts[0];
                            parts[1] = parts[1].trim();
                            const parts2 = parts[1].split(":");
                            if (parts2.length === 2) {
                              parts2[1] = parts2[1].trim();
                              const status = parts2[1].toLowerCase();
                              for (let i = 0;i < result2.length; i++) {
                                if (result2[i].BSDName === BSDName) {
                                  result2[i].smartStatus = status === "passed" ? "Ok" : status === "failed!" ? "Predicted Failure" : "unknown";
                                }
                              }
                            }
                          }
                        }
                      });
                      commitResult(result2);
                    });
                  } else {
                    commitResult(result2);
                  }
                }
              });
            } else {
              commitResult(result2);
            }
          });
        }
        if (_freebsd || _openbsd || _netbsd) {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
        if (_sunos) {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
        if (_darwin) {
          exec("system_profiler SPSerialATADataType SPNVMeDataType SPUSBDataType", { maxBuffer: 1024 * 1024 }, (error2, stdout) => {
            if (!error2) {
              const lines = stdout.toString().split(`
`);
              const linesSATA = [];
              const linesNVMe = [];
              const linesUSB = [];
              let dataType = "SATA";
              lines.forEach((line) => {
                if (line === "NVMExpress:") {
                  dataType = "NVMe";
                } else if (line === "USB:") {
                  dataType = "USB";
                } else if (line === "SATA/SATA Express:") {
                  dataType = "SATA";
                } else if (dataType === "SATA") {
                  linesSATA.push(line);
                } else if (dataType === "NVMe") {
                  linesNVMe.push(line);
                } else if (dataType === "USB") {
                  linesUSB.push(line);
                }
              });
              try {
                const devices = linesSATA.join(`
`).split(" Physical Interconnect: ");
                devices.shift();
                devices.forEach((device) => {
                  device = "InterfaceType: " + device;
                  const lines2 = device.split(`
`);
                  const mediumType = util.getValue(lines2, "Medium Type", ":", true).trim();
                  const sizeStr = util.getValue(lines2, "capacity", ":", true).trim();
                  const BSDName = util.getValue(lines2, "BSD Name", ":", true).trim();
                  if (sizeStr) {
                    let sizeValue = 0;
                    if (sizeStr.indexOf("(") >= 0) {
                      sizeValue = parseInt(sizeStr.match(/\(([^)]+)\)/)[1].replace(/\./g, "").replace(/,/g, "").replace(/\s/g, ""), 10);
                    }
                    if (!sizeValue) {
                      sizeValue = parseInt(sizeStr, 10);
                    }
                    if (sizeValue) {
                      const smartStatusString = util.getValue(lines2, "S.M.A.R.T. status", ":", true).trim().toLowerCase();
                      result2.push({
                        device: BSDName,
                        type: mediumType.startsWith("Solid") ? "SSD" : "HD",
                        name: util.getValue(lines2, "Model", ":", true).trim(),
                        vendor: getVendorFromModel(util.getValue(lines2, "Model", ":", true).trim()) || util.getValue(lines2, "Manufacturer", ":", true),
                        size: sizeValue,
                        bytesPerSector: null,
                        totalCylinders: null,
                        totalHeads: null,
                        totalSectors: null,
                        totalTracks: null,
                        tracksPerCylinder: null,
                        sectorsPerTrack: null,
                        firmwareRevision: util.getValue(lines2, "Revision", ":", true).trim(),
                        serialNum: util.getValue(lines2, "Serial Number", ":", true).trim(),
                        interfaceType: util.getValue(lines2, "InterfaceType", ":", true).trim(),
                        smartStatus: smartStatusString === "verified" ? "OK" : smartStatusString || "unknown",
                        temperature: null,
                        BSDName
                      });
                      cmd = cmd + `printf "
` + BSDName + '|"; diskutil info /dev/' + BSDName + " | grep SMART;";
                    }
                  }
                });
              } catch {
                util.noop();
              }
              try {
                const devices = linesNVMe.join(`
`).split(`

          Capacity:`);
                devices.shift();
                devices.forEach((device) => {
                  device = `!Capacity: ${device}`;
                  const lines2 = device.split(`
`);
                  const linkWidth = util.getValue(lines2, "link width", ":", true).trim();
                  const sizeStr = util.getValue(lines2, "!capacity", ":", true).trim();
                  const BSDName = util.getValue(lines2, "BSD Name", ":", true).trim();
                  if (sizeStr) {
                    let sizeValue = 0;
                    if (sizeStr.indexOf("(") >= 0) {
                      sizeValue = parseInt(sizeStr.match(/\(([^)]+)\)/)[1].replace(/\./g, "").replace(/,/g, "").replace(/\s/g, ""), 10);
                    }
                    if (!sizeValue) {
                      sizeValue = parseInt(sizeStr, 10);
                    }
                    if (sizeValue) {
                      const smartStatusString = util.getValue(lines2, "S.M.A.R.T. status", ":", true).trim().toLowerCase();
                      result2.push({
                        device: BSDName,
                        type: "NVMe",
                        name: util.getValue(lines2, "Model", ":", true).trim(),
                        vendor: getVendorFromModel(util.getValue(lines2, "Model", ":", true).trim()),
                        size: sizeValue,
                        bytesPerSector: null,
                        totalCylinders: null,
                        totalHeads: null,
                        totalSectors: null,
                        totalTracks: null,
                        tracksPerCylinder: null,
                        sectorsPerTrack: null,
                        firmwareRevision: util.getValue(lines2, "Revision", ":", true).trim(),
                        serialNum: util.getValue(lines2, "Serial Number", ":", true).trim(),
                        interfaceType: ("PCIe " + linkWidth).trim(),
                        smartStatus: smartStatusString === "verified" ? "OK" : smartStatusString || "unknown",
                        temperature: null,
                        BSDName
                      });
                      cmd = `${cmd}printf "
${BSDName}|"; diskutil info /dev/${BSDName} | grep SMART;`;
                    }
                  }
                });
              } catch {
                util.noop();
              }
              try {
                const devices = linesUSB.join(`
`).replaceAll(`Media:
 `, "Model:").split(`

          Product ID:`);
                devices.shift();
                devices.forEach((device) => {
                  const lines2 = device.split(`
`);
                  const sizeStr = util.getValue(lines2, "Capacity", ":", true).trim();
                  const BSDName = util.getValue(lines2, "BSD Name", ":", true).trim();
                  if (sizeStr) {
                    let sizeValue = 0;
                    if (sizeStr.indexOf("(") >= 0) {
                      sizeValue = parseInt(sizeStr.match(/\(([^)]+)\)/)[1].replace(/\./g, "").replace(/,/g, "").replace(/\s/g, ""), 10);
                    }
                    if (!sizeValue) {
                      sizeValue = parseInt(sizeStr, 10);
                    }
                    if (sizeValue) {
                      const smartStatusString = util.getValue(lines2, "S.M.A.R.T. status", ":", true).trim().toLowerCase();
                      result2.push({
                        device: BSDName,
                        type: "USB",
                        name: util.getValue(lines2, "Model", ":", true).trim().replaceAll(":", ""),
                        vendor: getVendorFromModel(util.getValue(lines2, "Model", ":", true).trim()),
                        size: sizeValue,
                        bytesPerSector: null,
                        totalCylinders: null,
                        totalHeads: null,
                        totalSectors: null,
                        totalTracks: null,
                        tracksPerCylinder: null,
                        sectorsPerTrack: null,
                        firmwareRevision: util.getValue(lines2, "Revision", ":", true).trim(),
                        serialNum: util.getValue(lines2, "Serial Number", ":", true).trim(),
                        interfaceType: "USB",
                        smartStatus: smartStatusString === "verified" ? "OK" : smartStatusString || "unknown",
                        temperature: null,
                        BSDName
                      });
                      cmd = cmd + `printf "
` + BSDName + '|"; diskutil info /dev/' + BSDName + " | grep SMART;";
                    }
                  }
                });
              } catch {
                util.noop();
              }
              if (cmd) {
                cmd = cmd + `printf "
"`;
                exec(cmd, { maxBuffer: 1024 * 1024 }, (error3, stdout2) => {
                  const lines2 = stdout2.toString().split(`
`);
                  lines2.forEach((line) => {
                    if (line) {
                      const parts = line.split("|");
                      if (parts.length === 2) {
                        const BSDName = parts[0];
                        parts[1] = parts[1].trim();
                        const parts2 = parts[1].split(":");
                        if (parts2.length === 2) {
                          parts2[1] = parts2[1].trim();
                          const status = parts2[1].toLowerCase();
                          for (let i = 0;i < result2.length; i++) {
                            if (result2[i].BSDName === BSDName) {
                              result2[i].smartStatus = status === "not supported" ? "not supported" : status === "verified" ? "Ok" : status === "failing" ? "Predicted Failure" : "unknown";
                            }
                          }
                        }
                      }
                    }
                  });
                  commitResult(result2);
                });
              } else {
                commitResult(result2);
              }
            } else {
              commitResult(result2);
            }
          });
        }
        if (_windows) {
          try {
            const workload = [];
            workload.push(util.powerShell("Get-CimInstance Win32_DiskDrive | select Caption,Size,Status,PNPDeviceId,DeviceId,BytesPerSector,TotalCylinders,TotalHeads,TotalSectors,TotalTracks,TracksPerCylinder,SectorsPerTrack,FirmwareRevision,SerialNumber,InterfaceType | fl"));
            workload.push(util.powerShell("Get-PhysicalDisk | select BusType,MediaType,FriendlyName,Model,SerialNumber,Size | fl"));
            if (util.smartMonToolsInstalled()) {
              try {
                const smartDev = JSON.parse(execSync("smartctl --scan -j").toString());
                if (smartDev && smartDev.devices && smartDev.devices.length > 0) {
                  smartDev.devices.forEach((dev) => {
                    workload.push(execPromiseSave(`smartctl -j -a ${dev.name}`, util.execOptsWin));
                  });
                }
              } catch {
                util.noop();
              }
            }
            util.promiseAll(workload).then((data) => {
              let devices = data.results[0].toString().split(/\n\s*\n/);
              devices.forEach((device) => {
                const lines = device.split(`\r
`);
                const size = util.getValue(lines, "Size", ":").trim();
                const status = util.getValue(lines, "Status", ":").trim().toLowerCase();
                if (size) {
                  result2.push({
                    device: util.getValue(lines, "DeviceId", ":"),
                    type: device.indexOf("SSD") > -1 ? "SSD" : "HD",
                    name: util.getValue(lines, "Caption", ":"),
                    vendor: getVendorFromModel(util.getValue(lines, "Caption", ":", true).trim()),
                    size: parseInt(size, 10),
                    bytesPerSector: parseInt(util.getValue(lines, "BytesPerSector", ":"), 10),
                    totalCylinders: parseInt(util.getValue(lines, "TotalCylinders", ":"), 10),
                    totalHeads: parseInt(util.getValue(lines, "TotalHeads", ":"), 10),
                    totalSectors: parseInt(util.getValue(lines, "TotalSectors", ":"), 10),
                    totalTracks: parseInt(util.getValue(lines, "TotalTracks", ":"), 10),
                    tracksPerCylinder: parseInt(util.getValue(lines, "TracksPerCylinder", ":"), 10),
                    sectorsPerTrack: parseInt(util.getValue(lines, "SectorsPerTrack", ":"), 10),
                    firmwareRevision: util.getValue(lines, "FirmwareRevision", ":").trim(),
                    serialNum: util.getValue(lines, "SerialNumber", ":").trim(),
                    interfaceType: util.getValue(lines, "InterfaceType", ":").trim(),
                    smartStatus: status === "ok" ? "Ok" : status === "degraded" ? "Degraded" : status === "pred fail" ? "Predicted Failure" : "Unknown",
                    temperature: null
                  });
                }
              });
              devices = data.results[1].split(/\n\s*\n/);
              devices.forEach((device) => {
                const lines = device.split(`\r
`);
                const serialNum = util.getValue(lines, "SerialNumber", ":").trim();
                const name = util.getValue(lines, "FriendlyName", ":").trim().replace("Msft ", "Microsoft");
                const size = util.getValue(lines, "Size", ":").trim();
                const model = util.getValue(lines, "Model", ":").trim();
                const interfaceType = util.getValue(lines, "BusType", ":").trim();
                let mediaType = util.getValue(lines, "MediaType", ":").trim();
                if (mediaType === "3" || mediaType === "HDD") {
                  mediaType = "HD";
                }
                if (mediaType === "4") {
                  mediaType = "SSD";
                }
                if (mediaType === "5") {
                  mediaType = "SCM";
                }
                if (mediaType === "Unspecified" && (model.toLowerCase().indexOf("virtual") > -1 || model.toLowerCase().indexOf("vbox") > -1)) {
                  mediaType = "Virtual";
                }
                if (size) {
                  let i = util.findObjectByKey(result2, "serialNum", serialNum);
                  if (i === -1 || serialNum === "") {
                    i = util.findObjectByKey(result2, "name", name);
                  }
                  if (i !== -1) {
                    result2[i].type = mediaType;
                    result2[i].interfaceType = interfaceType;
                  }
                }
              });
              data.results.shift();
              data.results.shift();
              if (data.results.length) {
                data.results.forEach((smartStr) => {
                  try {
                    const smartData = JSON.parse(smartStr);
                    if (smartData.serial_number) {
                      const serialNum = smartData.serial_number;
                      const i = util.findObjectByKey(result2, "serialNum", serialNum);
                      if (i !== -1) {
                        result2[i].smartStatus = smartData.smart_status && smartData.smart_status.passed ? "Ok" : smartData.smart_status && smartData.smart_status.passed === false ? "Predicted Failure" : "unknown";
                        if (smartData.temperature && smartData.temperature.current) {
                          result2[i].temperature = smartData.temperature.current;
                        }
                        result2[i].smartData = smartData;
                      }
                    }
                  } catch {
                    util.noop();
                  }
                });
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  exports.diskLayout = diskLayout;
});

// node_modules/systeminformation/lib/network.js
var require_network = __commonJS((exports) => {
  var os = __require("os");
  var exec = __require("child_process").exec;
  var execSync = __require("child_process").execSync;
  var fs = __require("fs");
  var util = require_util();
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  var _network = {};
  var _default_iface = "";
  var _ifaces = {};
  var _dhcpNics = [];
  var _networkInterfaces = [];
  var _mac = {};
  var pathToIp;
  function getDefaultNetworkInterface() {
    let ifacename = "";
    let ifacenameFirst = "";
    try {
      const ifaces = os.networkInterfaces();
      let scopeid = 9999;
      for (let dev in ifaces) {
        if ({}.hasOwnProperty.call(ifaces, dev)) {
          ifaces[dev].forEach((details) => {
            if (details && details.internal === false) {
              ifacenameFirst = ifacenameFirst || dev;
              if (details.scopeid && details.scopeid < scopeid) {
                ifacename = dev;
                scopeid = details.scopeid;
              }
            }
          });
        }
      }
      ifacename = ifacename || ifacenameFirst || "";
      if (_windows) {
        let defaultIp = "";
        const cmd = "netstat -r";
        const result2 = execSync(cmd, util.execOptsWin);
        const lines = result2.toString().split(os.EOL);
        lines.forEach((line) => {
          line = line.replace(/\s+/g, " ").trim();
          if (line.indexOf("0.0.0.0 0.0.0.0") > -1 && !/[a-zA-Z]/.test(line)) {
            const parts = line.split(" ");
            if (parts.length >= 5) {
              defaultIp = parts[parts.length - 2];
            }
          }
        });
        if (defaultIp) {
          for (let dev in ifaces) {
            if ({}.hasOwnProperty.call(ifaces, dev)) {
              ifaces[dev].forEach((details) => {
                if (details && details.address && details.address === defaultIp) {
                  ifacename = dev;
                }
              });
            }
          }
        }
      }
      if (_linux) {
        const cmd = "ip route 2> /dev/null | grep default";
        const result2 = execSync(cmd, util.execOptsLinux);
        const parts = result2.toString().split(`
`)[0].split(/\s+/);
        if (parts[0] === "none" && parts[5]) {
          ifacename = parts[5];
        } else if (parts[4]) {
          ifacename = parts[4];
        }
        if (ifacename.indexOf(":") > -1) {
          ifacename = ifacename.split(":")[1].trim();
        }
      }
      if (_darwin || _freebsd || _openbsd || _netbsd || _sunos) {
        let cmd = "";
        if (_linux) {
          cmd = "ip route 2> /dev/null | grep default | awk '{print $5}'";
        }
        if (_darwin) {
          cmd = "route -n get default 2>/dev/null | grep interface: | awk '{print $2}'";
        }
        if (_freebsd || _openbsd || _netbsd || _sunos) {
          cmd = "route get 0.0.0.0 | grep interface:";
        }
        const result2 = execSync(cmd);
        ifacename = result2.toString().split(`
`)[0];
        if (ifacename.indexOf(":") > -1) {
          ifacename = ifacename.split(":")[1].trim();
        }
      }
    } catch {
      util.noop();
    }
    if (ifacename) {
      _default_iface = ifacename;
    }
    return _default_iface;
  }
  exports.getDefaultNetworkInterface = getDefaultNetworkInterface;
  function getMacAddresses() {
    let iface = "";
    let mac = "";
    const result2 = {};
    if (_linux || _freebsd || _openbsd || _netbsd) {
      if (typeof pathToIp === "undefined") {
        try {
          const lines = execSync("which ip", util.execOptsLinux).toString().split(`
`);
          if (lines.length && lines[0].indexOf(":") === -1 && lines[0].indexOf("/") === 0) {
            pathToIp = lines[0];
          } else {
            pathToIp = "";
          }
        } catch {
          pathToIp = "";
        }
      }
      try {
        const cmd = "export LC_ALL=C; " + (pathToIp ? pathToIp + " link show up" : "/sbin/ifconfig") + "; unset LC_ALL";
        const res = execSync(cmd, util.execOptsLinux);
        const lines = res.toString().split(`
`);
        for (let i = 0;i < lines.length; i++) {
          if (lines[i] && lines[i][0] !== " ") {
            if (pathToIp) {
              const nextline = lines[i + 1].trim().split(" ");
              if (nextline[0] === "link/ether") {
                iface = lines[i].split(" ")[1];
                iface = iface.slice(0, iface.length - 1);
                mac = nextline[1];
              }
            } else {
              iface = lines[i].split(" ")[0];
              mac = lines[i].split("HWaddr ")[1];
            }
            if (iface && mac) {
              result2[iface] = mac.trim();
              iface = "";
              mac = "";
            }
          }
        }
      } catch {
        util.noop();
      }
    }
    if (_darwin) {
      try {
        const cmd = "/sbin/ifconfig";
        const res = execSync(cmd);
        const lines = res.toString().split(`
`);
        for (let i = 0;i < lines.length; i++) {
          if (lines[i] && lines[i][0] !== "\t" && lines[i].indexOf(":") > 0) {
            iface = lines[i].split(":")[0];
          } else if (lines[i].indexOf("\tether ") === 0) {
            mac = lines[i].split("\tether ")[1];
            if (iface && mac) {
              result2[iface] = mac.trim();
              iface = "";
              mac = "";
            }
          }
        }
      } catch {
        util.noop();
      }
    }
    return result2;
  }
  function networkInterfaceDefault(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        const result2 = getDefaultNetworkInterface();
        if (callback) {
          callback(result2);
        }
        resolve(result2);
      });
    });
  }
  exports.networkInterfaceDefault = networkInterfaceDefault;
  function parseLinesWindowsNics(sections, nconfigsections) {
    const nics = [];
    for (let i in sections) {
      try {
        if ({}.hasOwnProperty.call(sections, i)) {
          if (sections[i].trim() !== "") {
            const lines = sections[i].trim().split(`\r
`);
            let linesNicConfig = null;
            try {
              linesNicConfig = nconfigsections && nconfigsections[i] ? nconfigsections[i].trim().split(`\r
`) : [];
            } catch {
              util.noop();
            }
            const netEnabled = util.getValue(lines, "NetEnabled", ":");
            let adapterType = util.getValue(lines, "AdapterTypeID", ":") === "9" ? "wireless" : "wired";
            const ifacename = util.getValue(lines, "Name", ":").replace(/\]/g, ")").replace(/\[/g, "(");
            const iface = util.getValue(lines, "NetConnectionID", ":").replace(/\]/g, ")").replace(/\[/g, "(");
            if (ifacename.toLowerCase().indexOf("wi-fi") >= 0 || ifacename.toLowerCase().indexOf("wireless") >= 0) {
              adapterType = "wireless";
            }
            if (netEnabled !== "") {
              const speed = parseInt(util.getValue(lines, "speed", ":").trim(), 10) / 1e6;
              nics.push({
                mac: util.getValue(lines, "MACAddress", ":").toLowerCase(),
                dhcp: util.getValue(linesNicConfig, "dhcpEnabled", ":").toLowerCase() === "true",
                name: ifacename,
                iface,
                netEnabled: netEnabled === "TRUE",
                speed: isNaN(speed) ? null : speed,
                operstate: util.getValue(lines, "NetConnectionStatus", ":") === "2" ? "up" : "down",
                type: adapterType
              });
            }
          }
        }
      } catch {
        util.noop();
      }
    }
    return nics;
  }
  function getWindowsNics() {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let cmd = "Get-CimInstance Win32_NetworkAdapter | fl *" + "; echo '#-#-#-#';";
        cmd += "Get-CimInstance Win32_NetworkAdapterConfiguration | fl DHCPEnabled" + "";
        try {
          util.powerShell(cmd).then((data) => {
            data = data.split("#-#-#-#");
            const nsections = (data[0] || "").split(/\n\s*\n/);
            const nconfigsections = (data[1] || "").split(/\n\s*\n/);
            resolve(parseLinesWindowsNics(nsections, nconfigsections));
          });
        } catch {
          resolve([]);
        }
      });
    });
  }
  function getWindowsDNSsuffixes() {
    let iface = {};
    const dnsSuffixes = {
      primaryDNS: "",
      exitCode: 0,
      ifaces: []
    };
    try {
      const ipconfig = execSync("ipconfig /all", util.execOptsWin);
      const ipconfigArray = ipconfig.split(`\r
\r
`);
      ipconfigArray.forEach((element, index) => {
        if (index === 1) {
          const longPrimaryDNS = element.split(`\r
`).filter((element2) => {
            return element2.toUpperCase().includes("DNS");
          });
          const primaryDNS = longPrimaryDNS[0].substring(longPrimaryDNS[0].lastIndexOf(":") + 1);
          dnsSuffixes.primaryDNS = primaryDNS.trim();
          if (!dnsSuffixes.primaryDNS) {
            dnsSuffixes.primaryDNS = "Not defined";
          }
        }
        if (index > 1) {
          if (index % 2 === 0) {
            const name = element.substring(element.lastIndexOf(" ") + 1).replace(":", "");
            iface.name = name;
          } else {
            const connectionSpecificDNS = element.split(`\r
`).filter((element2) => {
              return element2.toUpperCase().includes("DNS");
            });
            const dnsSuffix = connectionSpecificDNS[0].substring(connectionSpecificDNS[0].lastIndexOf(":") + 1);
            iface.dnsSuffix = dnsSuffix.trim();
            dnsSuffixes.ifaces.push(iface);
            iface = {};
          }
        }
      });
      return dnsSuffixes;
    } catch {
      return {
        primaryDNS: "",
        exitCode: 0,
        ifaces: []
      };
    }
  }
  function getWindowsIfaceDNSsuffix(ifaces, ifacename) {
    let dnsSuffix = "";
    const interfaceName = ifacename + ".";
    try {
      const connectionDnsSuffix = ifaces.filter((iface) => {
        return interfaceName.includes(iface.name + ".");
      }).map((iface) => iface.dnsSuffix);
      if (connectionDnsSuffix[0]) {
        dnsSuffix = connectionDnsSuffix[0];
      }
      if (!dnsSuffix) {
        dnsSuffix = "";
      }
      return dnsSuffix;
    } catch {
      return "Unknown";
    }
  }
  function getWindowsWiredProfilesInformation() {
    try {
      const result2 = execSync("netsh lan show profiles", util.execOptsWin);
      const profileList = result2.split(`\r
Profile on interface`);
      return profileList;
    } catch (error2) {
      if (error2.status === 1 && error2.stdout.includes("AutoConfig")) {
        return "Disabled";
      }
      return [];
    }
  }
  function getWindowsWirelessIfaceSSID(interfaceName) {
    try {
      const result2 = execSync(`netsh wlan show  interface name="${interfaceName}" | findstr "SSID"`, util.execOptsWin);
      const SSID = result2.split(`\r
`).shift();
      const parseSSID = SSID.split(":").pop().trim();
      return parseSSID;
    } catch {
      return "Unknown";
    }
  }
  function getWindowsIEEE8021x(connectionType, iface, ifaces) {
    const i8021x = {
      state: "Unknown",
      protocol: "Unknown"
    };
    if (ifaces === "Disabled") {
      i8021x.state = "Disabled";
      i8021x.protocol = "Not defined";
      return i8021x;
    }
    if (connectionType === "wired" && ifaces.length > 0) {
      try {
        const iface8021xInfo = ifaces.find((element) => {
          return element.includes(iface + `\r
`);
        });
        const arrayIface8021xInfo = iface8021xInfo.split(`\r
`);
        const state8021x = arrayIface8021xInfo.find((element) => {
          return element.includes("802.1x");
        });
        if (state8021x.includes("Disabled")) {
          i8021x.state = "Disabled";
          i8021x.protocol = "Not defined";
        } else if (state8021x.includes("Enabled")) {
          const protocol8021x = arrayIface8021xInfo.find((element) => {
            return element.includes("EAP");
          });
          i8021x.protocol = protocol8021x.split(":").pop();
          i8021x.state = "Enabled";
        }
      } catch {
        return i8021x;
      }
    } else if (connectionType === "wireless") {
      let i8021xState = "";
      let i8021xProtocol = "";
      try {
        const SSID = getWindowsWirelessIfaceSSID(iface);
        if (SSID !== "Unknown") {
          let ifaceSanitized = "";
          const s = util.isPrototypePolluted() ? "---" : util.sanitizeShellString(SSID);
          const l = util.mathMin(s.length, 32);
          for (let i = 0;i <= l; i++) {
            if (s[i] !== undefined) {
              ifaceSanitized = ifaceSanitized + s[i];
            }
          }
          const profiles = execSync(`netsh wlan show profiles "${ifaceSanitized}"`, util.execOptsWin).split(`\r
`);
          i8021xState = (profiles.find((l2) => l2.indexOf("802.1X") >= 0) || "").trim();
          i8021xProtocol = (profiles.find((l2) => l2.indexOf("EAP") >= 0) || "").trim();
        }
        if (i8021xState.includes(":") && i8021xProtocol.includes(":")) {
          i8021x.state = i8021xState.split(":").pop();
          i8021x.protocol = i8021xProtocol.split(":").pop();
        }
      } catch {
        if (error.status === 1 && error.stdout.includes("AutoConfig")) {
          i8021x.state = "Disabled";
          i8021x.protocol = "Not defined";
        }
        return i8021x;
      }
    }
    return i8021x;
  }
  function splitSectionsNics(lines) {
    const result2 = [];
    let section = [];
    lines.forEach((line) => {
      if (!line.startsWith("\t") && !line.startsWith(" ")) {
        if (section.length) {
          result2.push(section);
          section = [];
        }
      }
      section.push(line);
    });
    if (section.length) {
      result2.push(section);
    }
    return result2;
  }
  function parseLinesDarwinNics(sections) {
    const nics = [];
    sections.forEach((section) => {
      const nic = {
        iface: "",
        mtu: null,
        mac: "",
        ip6: "",
        ip4: "",
        speed: null,
        type: "",
        operstate: "",
        duplex: "",
        internal: false
      };
      const first = section[0];
      nic.iface = first.split(":")[0].trim();
      const parts = first.split("> mtu");
      nic.mtu = parts.length > 1 ? parseInt(parts[1], 10) : null;
      if (isNaN(nic.mtu)) {
        nic.mtu = null;
      }
      nic.internal = parts[0].toLowerCase().indexOf("loopback") > -1;
      section.forEach((line) => {
        if (line.trim().startsWith("ether ")) {
          nic.mac = line.split("ether ")[1].toLowerCase().trim();
        }
        if (line.trim().startsWith("inet6 ") && !nic.ip6) {
          nic.ip6 = line.split("inet6 ")[1].toLowerCase().split("%")[0].split(" ")[0];
        }
        if (line.trim().startsWith("inet ") && !nic.ip4) {
          nic.ip4 = line.split("inet ")[1].toLowerCase().split(" ")[0];
        }
      });
      let speed = util.getValue(section, "link rate");
      nic.speed = speed ? parseFloat(speed) : null;
      if (nic.speed === null) {
        speed = util.getValue(section, "uplink rate");
        nic.speed = speed ? parseFloat(speed) : null;
        if (nic.speed !== null && speed.toLowerCase().indexOf("gbps") >= 0) {
          nic.speed = nic.speed * 1000;
        }
      } else {
        if (speed.toLowerCase().indexOf("gbps") >= 0) {
          nic.speed = nic.speed * 1000;
        }
      }
      nic.type = util.getValue(section, "type").toLowerCase().indexOf("wi-fi") > -1 ? "wireless" : "wired";
      const operstate = util.getValue(section, "status").toLowerCase();
      nic.operstate = operstate === "active" ? "up" : operstate === "inactive" ? "down" : "unknown";
      nic.duplex = util.getValue(section, "media").toLowerCase().indexOf("half-duplex") > -1 ? "half" : "full";
      if (nic.ip6 || nic.ip4 || nic.mac) {
        nics.push(nic);
      }
    });
    return nics;
  }
  function getDarwinNics() {
    const cmd = "/sbin/ifconfig -v";
    try {
      const lines = execSync(cmd, { maxBuffer: 1024 * 102400 }).toString().split(`
`);
      const nsections = splitSectionsNics(lines);
      return parseLinesDarwinNics(nsections);
    } catch {
      return [];
    }
  }
  function getLinuxIfaceConnectionName(interfaceName) {
    const cmd = `nmcli device status 2>/dev/null | grep ${interfaceName}`;
    try {
      const result2 = execSync(cmd, util.execOptsLinux).toString();
      const resultFormat = result2.replace(/\s+/g, " ").trim();
      const connectionNameLines = resultFormat.split(" ").slice(3);
      const connectionName = connectionNameLines.join(" ");
      return connectionName !== "--" ? connectionName : "";
    } catch {
      return "";
    }
  }
  function checkLinuxDCHPInterfaces(file) {
    let result2 = [];
    try {
      const cmd = `cat ${file} 2> /dev/null | grep 'iface\\|source'`;
      const lines = execSync(cmd, util.execOptsLinux).toString().split(`
`);
      lines.forEach((line) => {
        const parts = line.replace(/\s+/g, " ").trim().split(" ");
        if (parts.length >= 4) {
          if (line.toLowerCase().indexOf(" inet ") >= 0 && line.toLowerCase().indexOf("dhcp") >= 0) {
            result2.push(parts[1]);
          }
        }
        if (line.toLowerCase().includes("source")) {
          const file2 = line.split(" ")[1];
          result2 = result2.concat(checkLinuxDCHPInterfaces(file2));
        }
      });
    } catch {
      util.noop();
    }
    return result2;
  }
  function getLinuxDHCPNics() {
    const cmd = "ip a 2> /dev/null";
    let result2 = [];
    try {
      const lines = execSync(cmd, util.execOptsLinux).toString().split(`
`);
      const nsections = splitSectionsNics(lines);
      result2 = parseLinuxDHCPNics(nsections);
    } catch {
      util.noop();
    }
    try {
      result2 = checkLinuxDCHPInterfaces("/etc/network/interfaces");
    } catch {
      util.noop();
    }
    return result2;
  }
  function parseLinuxDHCPNics(sections) {
    const result2 = [];
    if (sections && sections.length) {
      sections.forEach((lines) => {
        if (lines && lines.length) {
          const parts = lines[0].split(":");
          if (parts.length > 2) {
            for (let line of lines) {
              if (line.indexOf(" inet ") >= 0 && line.indexOf(" dynamic ") >= 0) {
                const parts2 = line.split(" ");
                const nic = parts2[parts2.length - 1].trim();
                result2.push(nic);
                break;
              }
            }
          }
        }
      });
    }
    return result2;
  }
  function getLinuxIfaceDHCPstatus(iface, connectionName, DHCPNics) {
    let result2 = false;
    if (connectionName) {
      const cmd = `nmcli connection show "${connectionName}" 2>/dev/null | grep ipv4.method;`;
      try {
        const lines = execSync(cmd, util.execOptsLinux).toString();
        const resultFormat = lines.replace(/\s+/g, " ").trim();
        const dhcStatus = resultFormat.split(" ").slice(1).toString();
        switch (dhcStatus) {
          case "auto":
            result2 = true;
            break;
          default:
            result2 = false;
            break;
        }
        return result2;
      } catch {
        return DHCPNics.indexOf(iface) >= 0;
      }
    } else {
      return DHCPNics.indexOf(iface) >= 0;
    }
  }
  function getDarwinIfaceDHCPstatus(iface) {
    let result2 = false;
    const cmd = `ipconfig getpacket "${iface}" 2>/dev/null | grep lease_time;`;
    try {
      const lines = execSync(cmd).toString().split(`
`);
      if (lines.length && lines[0].startsWith("lease_time")) {
        result2 = true;
      }
    } catch {
      util.noop();
    }
    return result2;
  }
  function getLinuxIfaceDNSsuffix(connectionName) {
    if (connectionName) {
      const cmd = `nmcli connection show "${connectionName}" 2>/dev/null | grep ipv4.dns-search;`;
      try {
        const result2 = execSync(cmd, util.execOptsLinux).toString();
        const resultFormat = result2.replace(/\s+/g, " ").trim();
        const dnsSuffix = resultFormat.split(" ").slice(1).toString();
        return dnsSuffix === "--" ? "Not defined" : dnsSuffix;
      } catch {
        return "Unknown";
      }
    } else {
      return "Unknown";
    }
  }
  function getLinuxIfaceIEEE8021xAuth(connectionName) {
    if (connectionName) {
      const cmd = `nmcli connection show "${connectionName}" 2>/dev/null | grep 802-1x.eap;`;
      try {
        const result2 = execSync(cmd, util.execOptsLinux).toString();
        const resultFormat = result2.replace(/\s+/g, " ").trim();
        const authenticationProtocol = resultFormat.split(" ").slice(1).toString();
        return authenticationProtocol === "--" ? "" : authenticationProtocol;
      } catch {
        return "Not defined";
      }
    } else {
      return "Not defined";
    }
  }
  function getLinuxIfaceIEEE8021xState(authenticationProtocol) {
    if (authenticationProtocol) {
      if (authenticationProtocol === "Not defined") {
        return "Disabled";
      }
      return "Enabled";
    } else {
      return "Unknown";
    }
  }
  function testVirtualNic(iface, ifaceName, mac) {
    const virtualMacs = [
      "00:00:00:00:00:00",
      "00:03:FF",
      "00:05:69",
      "00:0C:29",
      "00:0F:4B",
      "00:13:07",
      "00:13:BE",
      "00:15:5d",
      "00:16:3E",
      "00:1C:42",
      "00:21:F6",
      "00:24:0B",
      "00:50:56",
      "00:A0:B1",
      "00:E0:C8",
      "08:00:27",
      "0A:00:27",
      "18:92:2C",
      "16:DF:49",
      "3C:F3:92",
      "54:52:00",
      "FC:15:97"
    ];
    if (mac) {
      return virtualMacs.filter((item) => {
        return mac.toUpperCase().toUpperCase().startsWith(item.substring(0, mac.length));
      }).length > 0 || iface.toLowerCase().indexOf(" virtual ") > -1 || ifaceName.toLowerCase().indexOf(" virtual ") > -1 || iface.toLowerCase().indexOf("vethernet ") > -1 || ifaceName.toLowerCase().indexOf("vethernet ") > -1 || iface.toLowerCase().startsWith("veth") || ifaceName.toLowerCase().startsWith("veth") || iface.toLowerCase().startsWith("vboxnet") || ifaceName.toLowerCase().startsWith("vboxnet");
    } else {
      return false;
    }
  }
  function networkInterfaces(callback, rescan, defaultString) {
    if (typeof callback === "string") {
      defaultString = callback;
      rescan = true;
      callback = null;
    }
    if (typeof callback === "boolean") {
      rescan = callback;
      callback = null;
      defaultString = "";
    }
    if (typeof rescan === "undefined") {
      rescan = true;
    }
    defaultString = defaultString || "";
    defaultString = "" + defaultString;
    return new Promise((resolve) => {
      process.nextTick(() => {
        const ifaces = os.networkInterfaces();
        let result2 = [];
        let nics = [];
        let dnsSuffixes = [];
        let nics8021xInfo = [];
        if (_darwin || _freebsd || _openbsd || _netbsd) {
          if (JSON.stringify(ifaces) === JSON.stringify(_ifaces) && !rescan) {
            result2 = _networkInterfaces;
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          } else {
            const defaultInterface = getDefaultNetworkInterface();
            _ifaces = JSON.parse(JSON.stringify(ifaces));
            nics = getDarwinNics();
            nics.forEach((nic) => {
              let ip4link = "";
              let ip4linksubnet = "";
              let ip6link = "";
              let ip6linksubnet = "";
              nic.ip4 = "";
              nic.ip6 = "";
              if ({}.hasOwnProperty.call(ifaces, nic.iface)) {
                ifaces[nic.iface].forEach((details) => {
                  if (details.family === "IPv4" || details.family === 4) {
                    if (!nic.ip4 && !nic.ip4.match(/^169.254/i)) {
                      nic.ip4 = details.address;
                      nic.ip4subnet = details.netmask;
                    }
                    if (nic.ip4.match(/^169.254/i)) {
                      ip4link = details.address;
                      ip4linksubnet = details.netmask;
                    }
                  }
                  if (details.family === "IPv6" || details.family === 6) {
                    if (!nic.ip6 && !nic.ip6.match(/^fe80::/i)) {
                      nic.ip6 = details.address;
                      nic.ip6subnet = details.netmask;
                    }
                    if (nic.ip6.match(/^fe80::/i)) {
                      ip6link = details.address;
                      ip6linksubnet = details.netmask;
                    }
                  }
                });
              }
              if (!nic.ip4 && ip4link) {
                nic.ip4 = ip4link;
                nic.ip4subnet = ip4linksubnet;
              }
              if (!nic.ip6 && ip6link) {
                nic.ip6 = ip6link;
                nic.ip6subnet = ip6linksubnet;
              }
              let ifaceSanitized = "";
              const s = util.isPrototypePolluted() ? "---" : util.sanitizeShellString(nic.iface);
              const l = util.mathMin(s.length, 2000);
              for (let i = 0;i <= l; i++) {
                if (s[i] !== undefined) {
                  ifaceSanitized = ifaceSanitized + s[i];
                }
              }
              result2.push({
                iface: nic.iface,
                ifaceName: nic.iface,
                default: nic.iface === defaultInterface,
                ip4: nic.ip4,
                ip4subnet: nic.ip4subnet || "",
                ip6: nic.ip6,
                ip6subnet: nic.ip6subnet || "",
                mac: nic.mac,
                internal: nic.internal,
                virtual: nic.internal ? false : testVirtualNic(nic.iface, nic.iface, nic.mac),
                operstate: nic.operstate,
                type: nic.type,
                duplex: nic.duplex,
                mtu: nic.mtu,
                speed: nic.speed,
                dhcp: getDarwinIfaceDHCPstatus(ifaceSanitized),
                dnsSuffix: "",
                ieee8021xAuth: "",
                ieee8021xState: "",
                carrierChanges: 0
              });
            });
            _networkInterfaces = result2;
            if (defaultString.toLowerCase().indexOf("default") >= 0) {
              result2 = result2.filter((item) => item.default);
              if (result2.length > 0) {
                result2 = result2[0];
              } else {
                result2 = [];
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
        if (_linux) {
          if (JSON.stringify(ifaces) === JSON.stringify(_ifaces) && !rescan) {
            result2 = _networkInterfaces;
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          } else {
            _ifaces = JSON.parse(JSON.stringify(ifaces));
            _dhcpNics = getLinuxDHCPNics();
            const defaultInterface = getDefaultNetworkInterface();
            for (let dev in ifaces) {
              let ip4 = "";
              let ip4subnet = "";
              let ip6 = "";
              let ip6subnet = "";
              let mac = "";
              let duplex = "";
              let mtu = "";
              let speed = null;
              let carrierChanges = 0;
              let dhcp = false;
              let dnsSuffix = "";
              let ieee8021xAuth = "";
              let ieee8021xState = "";
              let type = "";
              let ip4link = "";
              let ip4linksubnet = "";
              let ip6link = "";
              let ip6linksubnet = "";
              if ({}.hasOwnProperty.call(ifaces, dev)) {
                const ifaceName = dev;
                ifaces[dev].forEach((details) => {
                  if (details.family === "IPv4" || details.family === 4) {
                    if (!ip4 && !ip4.match(/^169.254/i)) {
                      ip4 = details.address;
                      ip4subnet = details.netmask;
                    }
                    if (ip4.match(/^169.254/i)) {
                      ip4link = details.address;
                      ip4linksubnet = details.netmask;
                    }
                  }
                  if (details.family === "IPv6" || details.family === 6) {
                    if (!ip6 && !ip6.match(/^fe80::/i)) {
                      ip6 = details.address;
                      ip6subnet = details.netmask;
                    }
                    if (ip6.match(/^fe80::/i)) {
                      ip6link = details.address;
                      ip6linksubnet = details.netmask;
                    }
                  }
                  mac = details.mac;
                  const nodeMainVersion = parseInt(process.versions.node.split("."), 10);
                  if (mac.indexOf("00:00:0") > -1 && (_linux || _darwin) && !details.internal && nodeMainVersion >= 8 && nodeMainVersion <= 11) {
                    if (Object.keys(_mac).length === 0) {
                      _mac = getMacAddresses();
                    }
                    mac = _mac[dev] || "";
                  }
                });
                if (!ip4 && ip4link) {
                  ip4 = ip4link;
                  ip4subnet = ip4linksubnet;
                }
                if (!ip6 && ip6link) {
                  ip6 = ip6link;
                  ip6subnet = ip6linksubnet;
                }
                const iface = dev.split(":")[0].trim();
                let ifaceSanitized = "";
                const s = util.isPrototypePolluted() ? "---" : util.sanitizeShellString(iface);
                const l = util.mathMin(s.length, 2000);
                for (let i = 0;i <= l; i++) {
                  if (s[i] !== undefined) {
                    ifaceSanitized = ifaceSanitized + s[i];
                  }
                }
                const cmd = `echo -n "addr_assign_type: "; cat /sys/class/net/${ifaceSanitized}/addr_assign_type 2>/dev/null; echo;
            echo -n "address: "; cat /sys/class/net/${ifaceSanitized}/address 2>/dev/null; echo;
            echo -n "addr_len: "; cat /sys/class/net/${ifaceSanitized}/addr_len 2>/dev/null; echo;
            echo -n "broadcast: "; cat /sys/class/net/${ifaceSanitized}/broadcast 2>/dev/null; echo;
            echo -n "carrier: "; cat /sys/class/net/${ifaceSanitized}/carrier 2>/dev/null; echo;
            echo -n "carrier_changes: "; cat /sys/class/net/${ifaceSanitized}/carrier_changes 2>/dev/null; echo;
            echo -n "dev_id: "; cat /sys/class/net/${ifaceSanitized}/dev_id 2>/dev/null; echo;
            echo -n "dev_port: "; cat /sys/class/net/${ifaceSanitized}/dev_port 2>/dev/null; echo;
            echo -n "dormant: "; cat /sys/class/net/${ifaceSanitized}/dormant 2>/dev/null; echo;
            echo -n "duplex: "; cat /sys/class/net/${ifaceSanitized}/duplex 2>/dev/null; echo;
            echo -n "flags: "; cat /sys/class/net/${ifaceSanitized}/flags 2>/dev/null; echo;
            echo -n "gro_flush_timeout: "; cat /sys/class/net/${ifaceSanitized}/gro_flush_timeout 2>/dev/null; echo;
            echo -n "ifalias: "; cat /sys/class/net/${ifaceSanitized}/ifalias 2>/dev/null; echo;
            echo -n "ifindex: "; cat /sys/class/net/${ifaceSanitized}/ifindex 2>/dev/null; echo;
            echo -n "iflink: "; cat /sys/class/net/${ifaceSanitized}/iflink 2>/dev/null; echo;
            echo -n "link_mode: "; cat /sys/class/net/${ifaceSanitized}/link_mode 2>/dev/null; echo;
            echo -n "mtu: "; cat /sys/class/net/${ifaceSanitized}/mtu 2>/dev/null; echo;
            echo -n "netdev_group: "; cat /sys/class/net/${ifaceSanitized}/netdev_group 2>/dev/null; echo;
            echo -n "operstate: "; cat /sys/class/net/${ifaceSanitized}/operstate 2>/dev/null; echo;
            echo -n "proto_down: "; cat /sys/class/net/${ifaceSanitized}/proto_down 2>/dev/null; echo;
            echo -n "speed: "; cat /sys/class/net/${ifaceSanitized}/speed 2>/dev/null; echo;
            echo -n "tx_queue_len: "; cat /sys/class/net/${ifaceSanitized}/tx_queue_len 2>/dev/null; echo;
            echo -n "type: "; cat /sys/class/net/${ifaceSanitized}/type 2>/dev/null; echo;
            echo -n "wireless: "; cat /proc/net/wireless 2>/dev/null | grep ${ifaceSanitized}; echo;
            echo -n "wirelessspeed: "; iw dev ${ifaceSanitized} link 2>&1 | grep bitrate; echo;`;
                let lines = [];
                try {
                  lines = execSync(cmd, util.execOptsLinux).toString().split(`
`);
                  const connectionName = getLinuxIfaceConnectionName(ifaceSanitized);
                  dhcp = getLinuxIfaceDHCPstatus(ifaceSanitized, connectionName, _dhcpNics);
                  dnsSuffix = getLinuxIfaceDNSsuffix(connectionName);
                  ieee8021xAuth = getLinuxIfaceIEEE8021xAuth(connectionName);
                  ieee8021xState = getLinuxIfaceIEEE8021xState(ieee8021xAuth);
                } catch {
                  util.noop();
                }
                duplex = util.getValue(lines, "duplex");
                duplex = duplex.startsWith("cat") ? "" : duplex;
                mtu = parseInt(util.getValue(lines, "mtu"), 10);
                let myspeed = parseInt(util.getValue(lines, "speed"), 10);
                speed = isNaN(myspeed) ? null : myspeed;
                const wirelessspeed = util.getValue(lines, "tx bitrate");
                if (speed === null && wirelessspeed) {
                  myspeed = parseFloat(wirelessspeed);
                  speed = isNaN(myspeed) ? null : myspeed;
                }
                carrierChanges = parseInt(util.getValue(lines, "carrier_changes"), 10);
                const operstate = util.getValue(lines, "operstate");
                type = operstate === "up" ? util.getValue(lines, "wireless").trim() ? "wireless" : "wired" : "unknown";
                if (ifaceSanitized === "lo" || ifaceSanitized.startsWith("bond")) {
                  type = "virtual";
                }
                let internal = ifaces[dev] && ifaces[dev][0] ? ifaces[dev][0].internal : false;
                if (dev.toLowerCase().indexOf("loopback") > -1 || ifaceName.toLowerCase().indexOf("loopback") > -1) {
                  internal = true;
                }
                const virtual = internal ? false : testVirtualNic(dev, ifaceName, mac);
                result2.push({
                  iface: ifaceSanitized,
                  ifaceName,
                  default: iface === defaultInterface,
                  ip4,
                  ip4subnet,
                  ip6,
                  ip6subnet,
                  mac,
                  internal,
                  virtual,
                  operstate,
                  type,
                  duplex,
                  mtu,
                  speed,
                  dhcp,
                  dnsSuffix,
                  ieee8021xAuth,
                  ieee8021xState,
                  carrierChanges
                });
              }
            }
            _networkInterfaces = result2;
            if (defaultString.toLowerCase().indexOf("default") >= 0) {
              result2 = result2.filter((item) => item.default);
              if (result2.length > 0) {
                result2 = result2[0];
              } else {
                result2 = [];
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
        if (_windows) {
          if (JSON.stringify(ifaces) === JSON.stringify(_ifaces) && !rescan) {
            result2 = _networkInterfaces;
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          } else {
            _ifaces = JSON.parse(JSON.stringify(ifaces));
            const defaultInterface = getDefaultNetworkInterface();
            getWindowsNics().then((nics2) => {
              nics2.forEach((nic) => {
                let found = false;
                Object.keys(ifaces).forEach((key) => {
                  if (!found) {
                    ifaces[key].forEach((value) => {
                      if (Object.keys(value).indexOf("mac") >= 0) {
                        found = value["mac"] === nic.mac;
                      }
                    });
                  }
                });
                if (!found) {
                  ifaces[nic.name] = [{ mac: nic.mac }];
                }
              });
              nics8021xInfo = getWindowsWiredProfilesInformation();
              dnsSuffixes = getWindowsDNSsuffixes();
              for (let dev in ifaces) {
                let ifaceSanitized = "";
                const s = util.isPrototypePolluted() ? "---" : util.sanitizeShellString(dev);
                const l = util.mathMin(s.length, 2000);
                for (let i = 0;i <= l; i++) {
                  if (s[i] !== undefined) {
                    ifaceSanitized = ifaceSanitized + s[i];
                  }
                }
                let iface = dev;
                let ip4 = "";
                let ip4subnet = "";
                let ip6 = "";
                let ip6subnet = "";
                let mac = "";
                let duplex = "";
                let mtu = "";
                let speed = null;
                let carrierChanges = 0;
                let operstate = "down";
                let dhcp = false;
                let dnsSuffix = "";
                let ieee8021xAuth = "";
                let ieee8021xState = "";
                let type = "";
                if ({}.hasOwnProperty.call(ifaces, dev)) {
                  let ifaceName = dev;
                  ifaces[dev].forEach((details) => {
                    if (details.family === "IPv4" || details.family === 4) {
                      ip4 = details.address;
                      ip4subnet = details.netmask;
                    }
                    if (details.family === "IPv6" || details.family === 6) {
                      if (!ip6 || ip6.match(/^fe80::/i)) {
                        ip6 = details.address;
                        ip6subnet = details.netmask;
                      }
                    }
                    mac = details.mac;
                    const nodeMainVersion = parseInt(process.versions.node.split("."), 10);
                    if (mac.indexOf("00:00:0") > -1 && (_linux || _darwin) && !details.internal && nodeMainVersion >= 8 && nodeMainVersion <= 11) {
                      if (Object.keys(_mac).length === 0) {
                        _mac = getMacAddresses();
                      }
                      mac = _mac[dev] || "";
                    }
                  });
                  dnsSuffix = getWindowsIfaceDNSsuffix(dnsSuffixes.ifaces, ifaceSanitized);
                  let foundFirst = false;
                  nics2.forEach((detail) => {
                    if (detail.mac === mac && !foundFirst) {
                      iface = detail.iface || iface;
                      ifaceName = detail.name;
                      dhcp = detail.dhcp;
                      operstate = detail.operstate;
                      speed = operstate === "up" ? detail.speed : 0;
                      type = detail.type;
                      foundFirst = true;
                    }
                  });
                  if (dev.toLowerCase().indexOf("wlan") >= 0 || ifaceName.toLowerCase().indexOf("wlan") >= 0 || ifaceName.toLowerCase().indexOf("802.11n") >= 0 || ifaceName.toLowerCase().indexOf("wireless") >= 0 || ifaceName.toLowerCase().indexOf("wi-fi") >= 0 || ifaceName.toLowerCase().indexOf("wifi") >= 0) {
                    type = "wireless";
                  }
                  const IEEE8021x = getWindowsIEEE8021x(type, ifaceSanitized, nics8021xInfo);
                  ieee8021xAuth = IEEE8021x.protocol;
                  ieee8021xState = IEEE8021x.state;
                  let internal = ifaces[dev] && ifaces[dev][0] ? ifaces[dev][0].internal : false;
                  if (dev.toLowerCase().indexOf("loopback") > -1 || ifaceName.toLowerCase().indexOf("loopback") > -1) {
                    internal = true;
                  }
                  const virtual = internal ? false : testVirtualNic(dev, ifaceName, mac);
                  result2.push({
                    iface,
                    ifaceName,
                    default: iface === defaultInterface,
                    ip4,
                    ip4subnet,
                    ip6,
                    ip6subnet,
                    mac,
                    internal,
                    virtual,
                    operstate,
                    type,
                    duplex,
                    mtu,
                    speed,
                    dhcp,
                    dnsSuffix,
                    ieee8021xAuth,
                    ieee8021xState,
                    carrierChanges
                  });
                }
              }
              _networkInterfaces = result2;
              if (defaultString.toLowerCase().indexOf("default") >= 0) {
                result2 = result2.filter((item) => item.default);
                if (result2.length > 0) {
                  result2 = result2[0];
                } else {
                  result2 = [];
                }
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          }
        }
      });
    });
  }
  exports.networkInterfaces = networkInterfaces;
  function calcNetworkSpeed(iface, rx_bytes, tx_bytes, operstate, rx_dropped, rx_errors, tx_dropped, tx_errors) {
    const result2 = {
      iface,
      operstate,
      rx_bytes,
      rx_dropped,
      rx_errors,
      tx_bytes,
      tx_dropped,
      tx_errors,
      rx_sec: null,
      tx_sec: null,
      ms: 0
    };
    if (_network[iface] && _network[iface].ms) {
      result2.ms = Date.now() - _network[iface].ms;
      result2.rx_sec = rx_bytes - _network[iface].rx_bytes >= 0 ? (rx_bytes - _network[iface].rx_bytes) / (result2.ms / 1000) : 0;
      result2.tx_sec = tx_bytes - _network[iface].tx_bytes >= 0 ? (tx_bytes - _network[iface].tx_bytes) / (result2.ms / 1000) : 0;
      _network[iface].rx_bytes = rx_bytes;
      _network[iface].tx_bytes = tx_bytes;
      _network[iface].rx_sec = result2.rx_sec;
      _network[iface].tx_sec = result2.tx_sec;
      _network[iface].ms = Date.now();
      _network[iface].last_ms = result2.ms;
      _network[iface].operstate = operstate;
    } else {
      if (!_network[iface]) {
        _network[iface] = {};
      }
      _network[iface].rx_bytes = rx_bytes;
      _network[iface].tx_bytes = tx_bytes;
      _network[iface].rx_sec = null;
      _network[iface].tx_sec = null;
      _network[iface].ms = Date.now();
      _network[iface].last_ms = 0;
      _network[iface].operstate = operstate;
    }
    return result2;
  }
  function networkStats(ifaces, callback) {
    let ifacesArray = [];
    return new Promise((resolve) => {
      process.nextTick(() => {
        if (util.isFunction(ifaces) && !callback) {
          callback = ifaces;
          ifacesArray = [getDefaultNetworkInterface()];
        } else {
          if (typeof ifaces !== "string" && ifaces !== undefined) {
            if (callback) {
              callback([]);
            }
            return resolve([]);
          }
          ifaces = ifaces || getDefaultNetworkInterface();
          try {
            ifaces.__proto__.toLowerCase = util.stringToLower;
            ifaces.__proto__.replace = util.stringReplace;
            ifaces.__proto__.toString = util.stringToString;
            ifaces.__proto__.substr = util.stringSubstr;
            ifaces.__proto__.substring = util.stringSubstring;
            ifaces.__proto__.trim = util.stringTrim;
            ifaces.__proto__.startsWith = util.stringStartWith;
          } catch {
            Object.setPrototypeOf(ifaces, util.stringObj);
          }
          ifaces = ifaces.trim().replace(/,+/g, "|");
          ifacesArray = ifaces.split("|");
        }
        const result2 = [];
        const workload = [];
        if (ifacesArray.length && ifacesArray[0].trim() === "*") {
          ifacesArray = [];
          networkInterfaces(false).then((allIFaces) => {
            for (let iface of allIFaces) {
              ifacesArray.push(iface.iface);
            }
            networkStats(ifacesArray.join(",")).then((result3) => {
              if (callback) {
                callback(result3);
              }
              resolve(result3);
            });
          });
        } else {
          for (let iface of ifacesArray) {
            workload.push(networkStatsSingle(iface.trim()));
          }
          if (workload.length) {
            Promise.all(workload).then((data) => {
              if (callback) {
                callback(data);
              }
              resolve(data);
            });
          } else {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  function networkStatsSingle(iface) {
    function parseLinesWindowsPerfData(sections) {
      const perfData = [];
      for (let i in sections) {
        if ({}.hasOwnProperty.call(sections, i)) {
          if (sections[i].trim() !== "") {
            const lines = sections[i].trim().split(`\r
`);
            perfData.push({
              name: util.getValue(lines, "Name", ":").replace(/[()[\] ]+/g, "").replace(/#|\//g, "_").toLowerCase(),
              rx_bytes: parseInt(util.getValue(lines, "BytesReceivedPersec", ":"), 10),
              rx_errors: parseInt(util.getValue(lines, "PacketsReceivedErrors", ":"), 10),
              rx_dropped: parseInt(util.getValue(lines, "PacketsReceivedDiscarded", ":"), 10),
              tx_bytes: parseInt(util.getValue(lines, "BytesSentPersec", ":"), 10),
              tx_errors: parseInt(util.getValue(lines, "PacketsOutboundErrors", ":"), 10),
              tx_dropped: parseInt(util.getValue(lines, "PacketsOutboundDiscarded", ":"), 10)
            });
          }
        }
      }
      return perfData;
    }
    return new Promise((resolve) => {
      process.nextTick(() => {
        let ifaceSanitized = "";
        const s = util.isPrototypePolluted() ? "---" : util.sanitizeShellString(iface);
        const l = util.mathMin(s.length, 2000);
        for (let i = 0;i <= l; i++) {
          if (s[i] !== undefined) {
            ifaceSanitized = ifaceSanitized + s[i];
          }
        }
        let result2 = {
          iface: ifaceSanitized,
          operstate: "unknown",
          rx_bytes: 0,
          rx_dropped: 0,
          rx_errors: 0,
          tx_bytes: 0,
          tx_dropped: 0,
          tx_errors: 0,
          rx_sec: null,
          tx_sec: null,
          ms: 0
        };
        let operstate = "unknown";
        let rx_bytes = 0;
        let tx_bytes = 0;
        let rx_dropped = 0;
        let rx_errors = 0;
        let tx_dropped = 0;
        let tx_errors = 0;
        let cmd, lines, stats;
        if (!_network[ifaceSanitized] || _network[ifaceSanitized] && !_network[ifaceSanitized].ms || _network[ifaceSanitized] && _network[ifaceSanitized].ms && Date.now() - _network[ifaceSanitized].ms >= 500) {
          if (_linux) {
            if (fs.existsSync("/sys/class/net/" + ifaceSanitized)) {
              cmd = "cat /sys/class/net/" + ifaceSanitized + "/operstate; " + "cat /sys/class/net/" + ifaceSanitized + "/statistics/rx_bytes; " + "cat /sys/class/net/" + ifaceSanitized + "/statistics/tx_bytes; " + "cat /sys/class/net/" + ifaceSanitized + "/statistics/rx_dropped; " + "cat /sys/class/net/" + ifaceSanitized + "/statistics/rx_errors; " + "cat /sys/class/net/" + ifaceSanitized + "/statistics/tx_dropped; " + "cat /sys/class/net/" + ifaceSanitized + "/statistics/tx_errors; ";
              exec(cmd, (error2, stdout) => {
                if (!error2) {
                  lines = stdout.toString().split(`
`);
                  operstate = lines[0].trim();
                  rx_bytes = parseInt(lines[1], 10);
                  tx_bytes = parseInt(lines[2], 10);
                  rx_dropped = parseInt(lines[3], 10);
                  rx_errors = parseInt(lines[4], 10);
                  tx_dropped = parseInt(lines[5], 10);
                  tx_errors = parseInt(lines[6], 10);
                  result2 = calcNetworkSpeed(ifaceSanitized, rx_bytes, tx_bytes, operstate, rx_dropped, rx_errors, tx_dropped, tx_errors);
                }
                resolve(result2);
              });
            } else {
              resolve(result2);
            }
          }
          if (_freebsd || _openbsd || _netbsd) {
            cmd = "netstat -ibndI " + ifaceSanitized;
            exec(cmd, (error2, stdout) => {
              if (!error2) {
                lines = stdout.toString().split(`
`);
                for (let i = 1;i < lines.length; i++) {
                  const line = lines[i].replace(/ +/g, " ").split(" ");
                  if (line && line[0] && line[7] && line[10]) {
                    rx_bytes = rx_bytes + parseInt(line[7]);
                    if (line[6].trim() !== "-") {
                      rx_dropped = rx_dropped + parseInt(line[6]);
                    }
                    if (line[5].trim() !== "-") {
                      rx_errors = rx_errors + parseInt(line[5]);
                    }
                    tx_bytes = tx_bytes + parseInt(line[10]);
                    if (line[12].trim() !== "-") {
                      tx_dropped = tx_dropped + parseInt(line[12]);
                    }
                    if (line[9].trim() !== "-") {
                      tx_errors = tx_errors + parseInt(line[9]);
                    }
                    operstate = "up";
                  }
                }
                result2 = calcNetworkSpeed(ifaceSanitized, rx_bytes, tx_bytes, operstate, rx_dropped, rx_errors, tx_dropped, tx_errors);
              }
              resolve(result2);
            });
          }
          if (_darwin) {
            cmd = "ifconfig " + ifaceSanitized + ' | grep "status"';
            exec(cmd, (error2, stdout) => {
              result2.operstate = (stdout.toString().split(":")[1] || "").trim();
              result2.operstate = (result2.operstate || "").toLowerCase();
              result2.operstate = result2.operstate === "active" ? "up" : result2.operstate === "inactive" ? "down" : "unknown";
              cmd = "netstat -bdI " + ifaceSanitized;
              exec(cmd, (error3, stdout2) => {
                if (!error3) {
                  lines = stdout2.toString().split(`
`);
                  if (lines.length > 1 && lines[1].trim() !== "") {
                    stats = lines[1].replace(/ +/g, " ").split(" ");
                    const offset = stats.length > 11 ? 1 : 0;
                    rx_bytes = parseInt(stats[offset + 5]);
                    rx_dropped = parseInt(stats[offset + 10]);
                    rx_errors = parseInt(stats[offset + 4]);
                    tx_bytes = parseInt(stats[offset + 8]);
                    tx_dropped = parseInt(stats[offset + 10]);
                    tx_errors = parseInt(stats[offset + 7]);
                    result2 = calcNetworkSpeed(ifaceSanitized, rx_bytes, tx_bytes, result2.operstate, rx_dropped, rx_errors, tx_dropped, tx_errors);
                  }
                }
                resolve(result2);
              });
            });
          }
          if (_windows) {
            let perfData = [];
            let ifaceName = ifaceSanitized;
            util.powerShell("Get-CimInstance Win32_PerfRawData_Tcpip_NetworkInterface | select Name,BytesReceivedPersec,PacketsReceivedErrors,PacketsReceivedDiscarded,BytesSentPersec,PacketsOutboundErrors,PacketsOutboundDiscarded | fl").then((stdout, error2) => {
              if (!error2) {
                const psections = stdout.toString().split(/\n\s*\n/);
                perfData = parseLinesWindowsPerfData(psections);
              }
              networkInterfaces(false).then((interfaces) => {
                rx_bytes = 0;
                tx_bytes = 0;
                perfData.forEach((detail) => {
                  interfaces.forEach((det) => {
                    if ((det.iface.toLowerCase() === ifaceSanitized.toLowerCase() || det.mac.toLowerCase() === ifaceSanitized.toLowerCase() || det.ip4.toLowerCase() === ifaceSanitized.toLowerCase() || det.ip6.toLowerCase() === ifaceSanitized.toLowerCase() || det.ifaceName.replace(/[()[\] ]+/g, "").replace(/#|\//g, "_").toLowerCase() === ifaceSanitized.replace(/[()[\] ]+/g, "").replace("#", "_").toLowerCase()) && det.ifaceName.replace(/[()[\] ]+/g, "").replace(/#|\//g, "_").toLowerCase() === detail.name) {
                      ifaceName = det.iface;
                      rx_bytes = detail.rx_bytes;
                      rx_dropped = detail.rx_dropped;
                      rx_errors = detail.rx_errors;
                      tx_bytes = detail.tx_bytes;
                      tx_dropped = detail.tx_dropped;
                      tx_errors = detail.tx_errors;
                      operstate = det.operstate;
                    }
                  });
                });
                if (rx_bytes && tx_bytes) {
                  result2 = calcNetworkSpeed(ifaceName, parseInt(rx_bytes), parseInt(tx_bytes), operstate, rx_dropped, rx_errors, tx_dropped, tx_errors);
                }
                resolve(result2);
              });
            });
          }
        } else {
          result2.rx_bytes = _network[ifaceSanitized].rx_bytes;
          result2.tx_bytes = _network[ifaceSanitized].tx_bytes;
          result2.rx_sec = _network[ifaceSanitized].rx_sec;
          result2.tx_sec = _network[ifaceSanitized].tx_sec;
          result2.ms = _network[ifaceSanitized].last_ms;
          result2.operstate = _network[ifaceSanitized].operstate;
          resolve(result2);
        }
      });
    });
  }
  exports.networkStats = networkStats;
  function getProcessName(processes, pid) {
    let cmd = "";
    processes.forEach((line) => {
      const parts = line.split(" ");
      const id = parseInt(parts[0], 10) || -1;
      if (id === pid) {
        parts.shift();
        cmd = parts.join(" ").split(":")[0];
      }
    });
    cmd = cmd.split(" -")[0];
    cmd = cmd.split(" /")[0];
    return cmd;
  }
  function networkConnections(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        const result2 = [];
        if (_linux || _freebsd || _openbsd || _netbsd) {
          let cmd = 'export LC_ALL=C; netstat -tunap | grep "ESTABLISHED\\|SYN_SENT\\|SYN_RECV\\|FIN_WAIT1\\|FIN_WAIT2\\|TIME_WAIT\\|CLOSE\\|CLOSE_WAIT\\|LAST_ACK\\|LISTEN\\|CLOSING\\|UNKNOWN"; unset LC_ALL';
          if (_freebsd || _openbsd || _netbsd) {
            cmd = 'export LC_ALL=C; netstat -na | grep "ESTABLISHED\\|SYN_SENT\\|SYN_RECV\\|FIN_WAIT1\\|FIN_WAIT2\\|TIME_WAIT\\|CLOSE\\|CLOSE_WAIT\\|LAST_ACK\\|LISTEN\\|CLOSING\\|UNKNOWN"; unset LC_ALL';
          }
          exec(cmd, { maxBuffer: 1024 * 102400 }, (error2, stdout) => {
            let lines = stdout.toString().split(`
`);
            if (!error2 && (lines.length > 1 || lines[0] !== "")) {
              lines.forEach((line) => {
                line = line.replace(/ +/g, " ").split(" ");
                if (line.length >= 7) {
                  let localip = line[3];
                  let localport = "";
                  const localaddress = line[3].split(":");
                  if (localaddress.length > 1) {
                    localport = localaddress[localaddress.length - 1];
                    localaddress.pop();
                    localip = localaddress.join(":");
                  }
                  let peerip = line[4];
                  let peerport = "";
                  const peeraddress = line[4].split(":");
                  if (peeraddress.length > 1) {
                    peerport = peeraddress[peeraddress.length - 1];
                    peeraddress.pop();
                    peerip = peeraddress.join(":");
                  }
                  const connstate = line[5];
                  const proc = line[6].split("/");
                  if (connstate) {
                    result2.push({
                      protocol: line[0],
                      localAddress: localip,
                      localPort: localport,
                      peerAddress: peerip,
                      peerPort: peerport,
                      state: connstate,
                      pid: proc[0] && proc[0] !== "-" ? parseInt(proc[0], 10) : null,
                      process: proc[1] ? proc[1].split(" ")[0].split(":")[0] : ""
                    });
                  }
                }
              });
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            } else {
              cmd = 'ss -tunap | grep "ESTAB\\|SYN-SENT\\|SYN-RECV\\|FIN-WAIT1\\|FIN-WAIT2\\|TIME-WAIT\\|CLOSE\\|CLOSE-WAIT\\|LAST-ACK\\|LISTEN\\|CLOSING"';
              exec(cmd, { maxBuffer: 1024 * 102400 }, (error3, stdout2) => {
                if (!error3) {
                  const lines2 = stdout2.toString().split(`
`);
                  lines2.forEach((line) => {
                    line = line.replace(/ +/g, " ").split(" ");
                    if (line.length >= 6) {
                      let localip = line[4];
                      let localport = "";
                      const localaddress = line[4].split(":");
                      if (localaddress.length > 1) {
                        localport = localaddress[localaddress.length - 1];
                        localaddress.pop();
                        localip = localaddress.join(":");
                      }
                      let peerip = line[5];
                      let peerport = "";
                      const peeraddress = line[5].split(":");
                      if (peeraddress.length > 1) {
                        peerport = peeraddress[peeraddress.length - 1];
                        peeraddress.pop();
                        peerip = peeraddress.join(":");
                      }
                      let connstate = line[1];
                      if (connstate === "ESTAB") {
                        connstate = "ESTABLISHED";
                      }
                      if (connstate === "TIME-WAIT") {
                        connstate = "TIME_WAIT";
                      }
                      let pid = null;
                      let process2 = "";
                      if (line.length >= 7 && line[6].indexOf("users:") > -1) {
                        const proc = line[6].replace('users:(("', "").replace(/"/g, "").replace("pid=", "").split(",");
                        if (proc.length > 2) {
                          process2 = proc[0];
                          const pidValue = parseInt(proc[1], 10);
                          if (pidValue > 0) {
                            pid = pidValue;
                          }
                        }
                      }
                      if (connstate) {
                        result2.push({
                          protocol: line[0],
                          localAddress: localip,
                          localPort: localport,
                          peerAddress: peerip,
                          peerPort: peerport,
                          state: connstate,
                          pid,
                          process: process2
                        });
                      }
                    }
                  });
                }
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              });
            }
          });
        }
        if (_darwin) {
          const cmd = 'netstat -natvln | head -n2; netstat -natvln | grep "tcp4\\|tcp6\\|udp4\\|udp6"';
          const states = "ESTABLISHED|SYN_SENT|SYN_RECV|FIN_WAIT1|FIN_WAIT_1|FIN_WAIT2|FIN_WAIT_2|TIME_WAIT|CLOSE|CLOSE_WAIT|LAST_ACK|LISTEN|CLOSING|UNKNOWN".split("|");
          exec(cmd, { maxBuffer: 1024 * 102400 }, (error2, stdout) => {
            if (!error2) {
              exec("ps -axo pid,command", { maxBuffer: 1024 * 102400 }, (err2, stdout2) => {
                let processes = stdout2.toString().split(`
`);
                processes = processes.map((line) => {
                  return line.trim().replace(/ +/g, " ");
                });
                const lines = stdout.toString().split(`
`);
                lines.shift();
                let pidPos = 8;
                if (lines.length > 1 && lines[0].indexOf("pid") > 0) {
                  const header = (lines.shift() || "").replace(/ Address/g, "_Address").replace(/process:/g, "").replace(/ +/g, " ").split(" ");
                  pidPos = header.indexOf("pid");
                }
                lines.forEach((line) => {
                  line = line.replace(/ +/g, " ").split(" ");
                  if (line.length >= 8) {
                    let localip = line[3];
                    let localport = "";
                    const localaddress = line[3].split(".");
                    if (localaddress.length > 1) {
                      localport = localaddress[localaddress.length - 1];
                      localaddress.pop();
                      localip = localaddress.join(".");
                    }
                    let peerip = line[4];
                    let peerport = "";
                    const peeraddress = line[4].split(".");
                    if (peeraddress.length > 1) {
                      peerport = peeraddress[peeraddress.length - 1];
                      peeraddress.pop();
                      peerip = peeraddress.join(".");
                    }
                    const hasState = states.indexOf(line[5]) >= 0;
                    const connstate = hasState ? line[5] : "UNKNOWN";
                    let pidField = "";
                    if (line[line.length - 9].indexOf(":") >= 0) {
                      pidField = line[line.length - 9].split(":")[1];
                    } else {
                      pidField = line[pidPos + (hasState ? 0 : -1)];
                      if (pidField.indexOf(":") >= 0) {
                        pidField = pidField.split(":")[1];
                      }
                    }
                    const pid = parseInt(pidField, 10);
                    if (connstate) {
                      result2.push({
                        protocol: line[0],
                        localAddress: localip,
                        localPort: localport,
                        peerAddress: peerip,
                        peerPort: peerport,
                        state: connstate,
                        pid,
                        process: getProcessName(processes, pid)
                      });
                    }
                  }
                });
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              });
            }
          });
        }
        if (_windows) {
          let cmd = "netstat -nao";
          try {
            exec(cmd, util.execOptsWin, (error2, stdout) => {
              if (!error2) {
                let lines = stdout.toString().split(`\r
`);
                lines.forEach((line) => {
                  line = line.trim().replace(/ +/g, " ").split(" ");
                  if (line.length >= 4) {
                    let localip = line[1];
                    let localport = "";
                    const localaddress = line[1].split(":");
                    if (localaddress.length > 1) {
                      localport = localaddress[localaddress.length - 1];
                      localaddress.pop();
                      localip = localaddress.join(":");
                    }
                    localip = localip.replace(/\[/g, "").replace(/\]/g, "");
                    let peerip = line[2];
                    let peerport = "";
                    const peeraddress = line[2].split(":");
                    if (peeraddress.length > 1) {
                      peerport = peeraddress[peeraddress.length - 1];
                      peeraddress.pop();
                      peerip = peeraddress.join(":");
                    }
                    peerip = peerip.replace(/\[/g, "").replace(/\]/g, "");
                    const pid = util.toInt(line[4]);
                    let connstate = line[3];
                    if (connstate === "HERGESTELLT") {
                      connstate = "ESTABLISHED";
                    }
                    if (connstate.startsWith("ABH")) {
                      connstate = "LISTEN";
                    }
                    if (connstate === "SCHLIESSEN_WARTEN") {
                      connstate = "CLOSE_WAIT";
                    }
                    if (connstate === "WARTEND") {
                      connstate = "TIME_WAIT";
                    }
                    if (connstate === "SYN_GESENDET") {
                      connstate = "SYN_SENT";
                    }
                    if (connstate === "LISTENING") {
                      connstate = "LISTEN";
                    }
                    if (connstate === "SYN_RECEIVED") {
                      connstate = "SYN_RECV";
                    }
                    if (connstate === "FIN_WAIT_1") {
                      connstate = "FIN_WAIT1";
                    }
                    if (connstate === "FIN_WAIT_2") {
                      connstate = "FIN_WAIT2";
                    }
                    if (line[0].toLowerCase() !== "udp" && connstate) {
                      result2.push({
                        protocol: line[0].toLowerCase(),
                        localAddress: localip,
                        localPort: localport,
                        peerAddress: peerip,
                        peerPort: peerport,
                        state: connstate,
                        pid,
                        process: ""
                      });
                    } else if (line[0].toLowerCase() === "udp") {
                      result2.push({
                        protocol: line[0].toLowerCase(),
                        localAddress: localip,
                        localPort: localport,
                        peerAddress: peerip,
                        peerPort: peerport,
                        state: "",
                        pid: parseInt(line[3], 10),
                        process: ""
                      });
                    }
                  }
                });
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              }
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  exports.networkConnections = networkConnections;
  function networkGatewayDefault(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = "";
        if (_linux || _freebsd || _openbsd || _netbsd) {
          const cmd = "ip route get 1";
          try {
            exec(cmd, { maxBuffer: 1024 * 102400 }, (error2, stdout) => {
              if (!error2) {
                let lines = stdout.toString().split(`
`);
                const line = lines && lines[0] ? lines[0] : "";
                let parts = line.split(" via ");
                if (parts && parts[1]) {
                  parts = parts[1].split(" ");
                  result2 = parts[0];
                }
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              } else {
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              }
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
        if (_darwin) {
          let cmd = "route -n get default";
          try {
            exec(cmd, { maxBuffer: 1024 * 102400 }, (error2, stdout) => {
              if (!error2) {
                const lines = stdout.toString().split(`
`).map((line) => line.trim());
                result2 = util.getValue(lines, "gateway");
              }
              if (!result2) {
                cmd = "netstat -rn | awk '/default/ {print $2}'";
                exec(cmd, { maxBuffer: 1024 * 102400 }, (error3, stdout2) => {
                  const lines = stdout2.toString().split(`
`).map((line) => line.trim());
                  result2 = lines.find((line) => /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(line));
                  if (callback) {
                    callback(result2);
                  }
                  resolve(result2);
                });
              } else {
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              }
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
        if (_windows) {
          try {
            exec("netstat -r", util.execOptsWin, (error2, stdout) => {
              const lines = stdout.toString().split(os.EOL);
              lines.forEach((line) => {
                line = line.replace(/\s+/g, " ").trim();
                if (line.indexOf("0.0.0.0 0.0.0.0") > -1 && !/[a-zA-Z]/.test(line)) {
                  const parts = line.split(" ");
                  if (parts.length >= 5 && parts[parts.length - 3].indexOf(".") > -1) {
                    result2 = parts[parts.length - 3];
                  }
                }
              });
              if (!result2) {
                util.powerShell("Get-CimInstance -ClassName Win32_IP4RouteTable | Where-Object { $_.Destination -eq '0.0.0.0' -and $_.Mask -eq '0.0.0.0' }").then((data) => {
                  let lines2 = data.toString().split(`\r
`);
                  if (lines2.length > 1 && !result2) {
                    result2 = util.getValue(lines2, "NextHop");
                    if (callback) {
                      callback(result2);
                    }
                    resolve(result2);
                  }
                });
              } else {
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              }
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  exports.networkGatewayDefault = networkGatewayDefault;
});

// node_modules/systeminformation/lib/wifi.js
var require_wifi = __commonJS((exports) => {
  var os = __require("os");
  var exec = __require("child_process").exec;
  var execSync = __require("child_process").execSync;
  var util = require_util();
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  function wifiDBFromQuality(quality) {
    const qual = parseFloat(quality);
    if (qual < 0) {
      return 0;
    }
    if (qual >= 100) {
      return -50;
    }
    return qual / 2 - 100;
  }
  function wifiQualityFromDB(db) {
    const result2 = 2 * (parseFloat(db) + 100);
    return result2 <= 100 ? result2 : 100;
  }
  var _wifi_frequencies = {
    1: 2412,
    2: 2417,
    3: 2422,
    4: 2427,
    5: 2432,
    6: 2437,
    7: 2442,
    8: 2447,
    9: 2452,
    10: 2457,
    11: 2462,
    12: 2467,
    13: 2472,
    14: 2484,
    32: 5160,
    34: 5170,
    36: 5180,
    38: 5190,
    40: 5200,
    42: 5210,
    44: 5220,
    46: 5230,
    48: 5240,
    50: 5250,
    52: 5260,
    54: 5270,
    56: 5280,
    58: 5290,
    60: 5300,
    62: 5310,
    64: 5320,
    68: 5340,
    96: 5480,
    100: 5500,
    102: 5510,
    104: 5520,
    106: 5530,
    108: 5540,
    110: 5550,
    112: 5560,
    114: 5570,
    116: 5580,
    118: 5590,
    120: 5600,
    122: 5610,
    124: 5620,
    126: 5630,
    128: 5640,
    132: 5660,
    134: 5670,
    136: 5680,
    138: 5690,
    140: 5700,
    142: 5710,
    144: 5720,
    149: 5745,
    151: 5755,
    153: 5765,
    155: 5775,
    157: 5785,
    159: 5795,
    161: 5805,
    165: 5825,
    169: 5845,
    173: 5865,
    183: 4915,
    184: 4920,
    185: 4925,
    187: 4935,
    188: 4940,
    189: 4945,
    192: 4960,
    196: 4980
  };
  function wifiFrequencyFromChannel(channel) {
    return {}.hasOwnProperty.call(_wifi_frequencies, channel) ? _wifi_frequencies[channel] : null;
  }
  function wifiChannelFromFrequencs(frequency) {
    let channel = 0;
    for (let key in _wifi_frequencies) {
      if ({}.hasOwnProperty.call(_wifi_frequencies, key)) {
        if (_wifi_frequencies[key] === frequency) {
          channel = util.toInt(key);
        }
      }
    }
    return channel;
  }
  function ifaceListLinux() {
    const result2 = [];
    const cmd = "iw dev 2>/dev/null";
    try {
      const all = execSync(cmd, util.execOptsLinux).toString().split(`
`).map((line) => line.trim()).join(`
`);
      const parts = all.split(`
Interface `);
      parts.shift();
      parts.forEach((ifaceDetails) => {
        const lines = ifaceDetails.split(`
`);
        const iface = lines[0];
        const id = util.toInt(util.getValue(lines, "ifindex", " "));
        const mac = util.getValue(lines, "addr", " ");
        const channel = util.toInt(util.getValue(lines, "channel", " "));
        result2.push({
          id,
          iface,
          mac,
          channel
        });
      });
      return result2;
    } catch {
      try {
        const all = execSync("nmcli -t -f general,wifi-properties,wired-properties,interface-flags,capabilities,nsp device show 2>/dev/null", util.execOptsLinux).toString();
        const parts = all.split(`

`);
        let i = 1;
        parts.forEach((ifaceDetails) => {
          const lines = ifaceDetails.split(`
`);
          const iface = util.getValue(lines, "GENERAL.DEVICE");
          const type = util.getValue(lines, "GENERAL.TYPE");
          const id = i++;
          const mac = util.getValue(lines, "GENERAL.HWADDR");
          const channel = "";
          if (type.toLowerCase() === "wifi") {
            result2.push({
              id,
              iface,
              mac,
              channel
            });
          }
        });
        return result2;
      } catch {
        return [];
      }
    }
  }
  function nmiDeviceLinux(iface) {
    const cmd = `nmcli -t -f general,wifi-properties,capabilities,ip4,ip6 device show ${iface} 2> /dev/null`;
    try {
      const lines = execSync(cmd, util.execOptsLinux).toString().split(`
`);
      const ssid = util.getValue(lines, "GENERAL.CONNECTION");
      return {
        iface,
        type: util.getValue(lines, "GENERAL.TYPE"),
        vendor: util.getValue(lines, "GENERAL.VENDOR"),
        product: util.getValue(lines, "GENERAL.PRODUCT"),
        mac: util.getValue(lines, "GENERAL.HWADDR").toLowerCase(),
        ssid: ssid !== "--" ? ssid : null
      };
    } catch {
      return {};
    }
  }
  function nmiConnectionLinux(ssid) {
    const cmd = `nmcli -t --show-secrets connection show ${ssid} 2>/dev/null`;
    try {
      const lines = execSync(cmd, util.execOptsLinux).toString().split(`
`);
      const bssid = util.getValue(lines, "802-11-wireless.seen-bssids").toLowerCase();
      return {
        ssid: ssid !== "--" ? ssid : null,
        uuid: util.getValue(lines, "connection.uuid"),
        type: util.getValue(lines, "connection.type"),
        autoconnect: util.getValue(lines, "connection.autoconnect") === "yes",
        security: util.getValue(lines, "802-11-wireless-security.key-mgmt"),
        bssid: bssid !== "--" ? bssid : null
      };
    } catch {
      return {};
    }
  }
  function wpaConnectionLinux(iface) {
    if (!iface) {
      return {};
    }
    const cmd = `wpa_cli -i ${iface} status 2>&1`;
    try {
      const lines = execSync(cmd, util.execOptsLinux).toString().split(`
`);
      const freq = util.toInt(util.getValue(lines, "freq", "="));
      return {
        ssid: util.getValue(lines, "ssid", "="),
        uuid: util.getValue(lines, "uuid", "="),
        security: util.getValue(lines, "key_mgmt", "="),
        freq,
        channel: wifiChannelFromFrequencs(freq),
        bssid: util.getValue(lines, "bssid", "=").toLowerCase()
      };
    } catch {
      return {};
    }
  }
  function getWifiNetworkListNmi() {
    const result2 = [];
    const cmd = "nmcli -t -m multiline --fields active,ssid,bssid,mode,chan,freq,signal,security,wpa-flags,rsn-flags device wifi list 2>/dev/null";
    try {
      const stdout = execSync(cmd, util.execOptsLinux);
      const parts = stdout.toString().split("ACTIVE:");
      parts.shift();
      parts.forEach((part) => {
        part = "ACTIVE:" + part;
        const lines = part.split(os.EOL);
        const channel = util.getValue(lines, "CHAN");
        const frequency = util.getValue(lines, "FREQ").toLowerCase().replace("mhz", "").trim();
        const security = util.getValue(lines, "SECURITY").replace("(", "").replace(")", "");
        const wpaFlags = util.getValue(lines, "WPA-FLAGS").replace("(", "").replace(")", "");
        const rsnFlags = util.getValue(lines, "RSN-FLAGS").replace("(", "").replace(")", "");
        const quality = util.getValue(lines, "SIGNAL");
        result2.push({
          ssid: util.getValue(lines, "SSID"),
          bssid: util.getValue(lines, "BSSID").toLowerCase(),
          mode: util.getValue(lines, "MODE"),
          channel: channel ? parseInt(channel, 10) : null,
          frequency: frequency ? parseInt(frequency, 10) : null,
          signalLevel: wifiDBFromQuality(quality),
          quality: quality ? parseInt(quality, 10) : null,
          security: security && security !== "none" ? security.split(" ") : [],
          wpaFlags: wpaFlags && wpaFlags !== "none" ? wpaFlags.split(" ") : [],
          rsnFlags: rsnFlags && rsnFlags !== "none" ? rsnFlags.split(" ") : []
        });
      });
      return result2;
    } catch {
      return [];
    }
  }
  function getWifiNetworkListIw(iface) {
    const result2 = [];
    try {
      let iwlistParts = execSync(`export LC_ALL=C; iwlist ${iface} scan 2>&1; unset LC_ALL`, util.execOptsLinux).toString().split("        Cell ");
      if (iwlistParts[0].indexOf("resource busy") >= 0) {
        return -1;
      }
      if (iwlistParts.length > 1) {
        iwlistParts.shift();
        iwlistParts.forEach((element) => {
          const lines = element.split(`
`);
          const channel = util.getValue(lines, "channel", ":", true);
          const address = lines && lines.length && lines[0].indexOf("Address:") >= 0 ? lines[0].split("Address:")[1].trim().toLowerCase() : "";
          const mode = util.getValue(lines, "mode", ":", true);
          const frequency = util.getValue(lines, "frequency", ":", true);
          const qualityString = util.getValue(lines, "Quality", "=", true);
          const dbParts = qualityString.toLowerCase().split("signal level=");
          const db = dbParts.length > 1 ? util.toInt(dbParts[1]) : 0;
          const quality = db ? wifiQualityFromDB(db) : 0;
          const ssid = util.getValue(lines, "essid", ":", true);
          const isWpa = element.indexOf(" WPA ") >= 0;
          const isWpa2 = element.indexOf("WPA2 ") >= 0;
          const security = [];
          if (isWpa) {
            security.push("WPA");
          }
          if (isWpa2) {
            security.push("WPA2");
          }
          const wpaFlags = [];
          let wpaFlag = "";
          lines.forEach((line) => {
            const l = line.trim().toLowerCase();
            if (l.indexOf("group cipher") >= 0) {
              if (wpaFlag) {
                wpaFlags.push(wpaFlag);
              }
              const parts = l.split(":");
              if (parts.length > 1) {
                wpaFlag = parts[1].trim().toUpperCase();
              }
            }
            if (l.indexOf("pairwise cipher") >= 0) {
              const parts = l.split(":");
              if (parts.length > 1) {
                if (parts[1].indexOf("tkip")) {
                  wpaFlag = wpaFlag ? "TKIP/" + wpaFlag : "TKIP";
                } else if (parts[1].indexOf("ccmp")) {
                  wpaFlag = wpaFlag ? "CCMP/" + wpaFlag : "CCMP";
                } else if (parts[1].indexOf("proprietary")) {
                  wpaFlag = wpaFlag ? "PROP/" + wpaFlag : "PROP";
                }
              }
            }
            if (l.indexOf("authentication suites") >= 0) {
              const parts = l.split(":");
              if (parts.length > 1) {
                if (parts[1].indexOf("802.1x")) {
                  wpaFlag = wpaFlag ? "802.1x/" + wpaFlag : "802.1x";
                } else if (parts[1].indexOf("psk")) {
                  wpaFlag = wpaFlag ? "PSK/" + wpaFlag : "PSK";
                }
              }
            }
          });
          if (wpaFlag) {
            wpaFlags.push(wpaFlag);
          }
          result2.push({
            ssid,
            bssid: address,
            mode,
            channel: channel ? util.toInt(channel) : null,
            frequency: frequency ? util.toInt(frequency.replace(".", "")) : null,
            signalLevel: db,
            quality,
            security,
            wpaFlags,
            rsnFlags: []
          });
        });
      }
      return result2;
    } catch {
      return -1;
    }
  }
  function parseWifiDarwin(wifiStr) {
    const result2 = [];
    try {
      let wifiObj = JSON.parse(wifiStr);
      wifiObj = wifiObj.SPAirPortDataType[0].spairport_airport_interfaces[0].spairport_airport_other_local_wireless_networks;
      wifiObj.forEach((wifiItem) => {
        const security = [];
        const sm = wifiItem.spairport_security_mode || "";
        if (sm === "spairport_security_mode_wep") {
          security.push("WEP");
        } else if (sm === "spairport_security_mode_wpa2_personal") {
          security.push("WPA2");
        } else if (sm.startsWith("spairport_security_mode_wpa2_enterprise")) {
          security.push("WPA2 EAP");
        } else if (sm.startsWith("pairport_security_mode_wpa3_transition")) {
          security.push("WPA2/WPA3");
        } else if (sm.startsWith("pairport_security_mode_wpa3")) {
          security.push("WPA3");
        }
        const channel = parseInt(("" + wifiItem.spairport_network_channel).split(" ")[0]) || 0;
        const signalLevel = wifiItem.spairport_signal_noise || null;
        result2.push({
          ssid: wifiItem._name || "",
          bssid: wifiItem.spairport_network_bssid || null,
          mode: wifiItem.spairport_network_phymode,
          channel,
          frequency: wifiFrequencyFromChannel(channel),
          signalLevel: signalLevel ? parseInt(signalLevel, 10) : null,
          quality: wifiQualityFromDB(signalLevel),
          security,
          wpaFlags: [],
          rsnFlags: []
        });
      });
      return result2;
    } catch {
      return result2;
    }
  }
  function wifiNetworks(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = [];
        if (_linux) {
          result2 = getWifiNetworkListNmi();
          if (result2.length === 0) {
            try {
              const iwconfigParts = execSync("export LC_ALL=C; iwconfig 2>/dev/null; unset LC_ALL", util.execOptsLinux).toString().split(`

`);
              let iface = "";
              iwconfigParts.forEach((element) => {
                if (element.indexOf("no wireless") === -1 && element.trim() !== "") {
                  iface = element.split(" ")[0];
                }
              });
              if (iface) {
                let ifaceSanitized = "";
                const s = util.isPrototypePolluted() ? "---" : util.sanitizeShellString(iface, true);
                const l = util.mathMin(s.length, 2000);
                for (let i = 0;i <= l; i++) {
                  if (s[i] !== undefined) {
                    ifaceSanitized = ifaceSanitized + s[i];
                  }
                }
                const res = getWifiNetworkListIw(ifaceSanitized);
                if (res === -1) {
                  setTimeout((iface2) => {
                    const res2 = getWifiNetworkListIw(iface2);
                    if (res2 !== -1) {
                      result2 = res2;
                    }
                    if (callback) {
                      callback(result2);
                    }
                    resolve(result2);
                  }, 4000);
                } else {
                  result2 = res;
                  if (callback) {
                    callback(result2);
                  }
                  resolve(result2);
                }
              } else {
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              }
            } catch {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
          } else {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        } else if (_darwin) {
          const cmd = "system_profiler SPAirPortDataType -json 2>/dev/null";
          exec(cmd, { maxBuffer: 1024 * 40000 }, (error2, stdout) => {
            result2 = parseWifiDarwin(stdout.toString());
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        } else if (_windows) {
          const cmd = "netsh wlan show networks mode=Bssid";
          util.powerShell(cmd).then((stdout) => {
            const ssidParts = stdout.toString("utf8").split(os.EOL + os.EOL + "SSID ");
            ssidParts.shift();
            ssidParts.forEach((ssidPart) => {
              const ssidLines = ssidPart.split(os.EOL);
              if (ssidLines && ssidLines.length >= 8 && ssidLines[0].indexOf(":") >= 0) {
                const bssidsParts = ssidPart.split(" BSSID");
                bssidsParts.shift();
                bssidsParts.forEach((bssidPart) => {
                  const bssidLines = bssidPart.split(os.EOL);
                  const bssidLine = bssidLines[0].split(":");
                  bssidLine.shift();
                  const bssid = bssidLine.join(":").trim().toLowerCase();
                  const channel = bssidLines[3].split(":").pop().trim();
                  const quality = bssidLines[1].split(":").pop().trim();
                  result2.push({
                    ssid: ssidLines[0].split(":").pop().trim(),
                    bssid,
                    mode: "",
                    channel: channel ? parseInt(channel, 10) : null,
                    frequency: wifiFrequencyFromChannel(channel),
                    signalLevel: wifiDBFromQuality(quality),
                    quality: quality ? parseInt(quality, 10) : null,
                    security: [ssidLines[2].split(":").pop().trim()],
                    wpaFlags: [ssidLines[3].split(":").pop().trim()],
                    rsnFlags: []
                  });
                });
              }
            });
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        } else {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
      });
    });
  }
  exports.wifiNetworks = wifiNetworks;
  function getVendor(model) {
    model = model.toLowerCase();
    let result2 = "";
    if (model.indexOf("intel") >= 0) {
      result2 = "Intel";
    } else if (model.indexOf("realtek") >= 0) {
      result2 = "Realtek";
    } else if (model.indexOf("qualcom") >= 0) {
      result2 = "Qualcom";
    } else if (model.indexOf("broadcom") >= 0) {
      result2 = "Broadcom";
    } else if (model.indexOf("cavium") >= 0) {
      result2 = "Cavium";
    } else if (model.indexOf("cisco") >= 0) {
      result2 = "Cisco";
    } else if (model.indexOf("marvel") >= 0) {
      result2 = "Marvel";
    } else if (model.indexOf("zyxel") >= 0) {
      result2 = "Zyxel";
    } else if (model.indexOf("melanox") >= 0) {
      result2 = "Melanox";
    } else if (model.indexOf("d-link") >= 0) {
      result2 = "D-Link";
    } else if (model.indexOf("tp-link") >= 0) {
      result2 = "TP-Link";
    } else if (model.indexOf("asus") >= 0) {
      result2 = "Asus";
    } else if (model.indexOf("linksys") >= 0) {
      result2 = "Linksys";
    }
    return result2;
  }
  function wifiConnections(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        const result2 = [];
        if (_linux) {
          const ifaces = ifaceListLinux();
          const networkList = getWifiNetworkListNmi();
          ifaces.forEach((ifaceDetail) => {
            let ifaceSanitized = "";
            const s = util.isPrototypePolluted() ? "---" : util.sanitizeShellString(ifaceDetail.iface, true);
            const ll = util.mathMin(s.length, 2000);
            for (let i = 0;i <= ll; i++) {
              if (s[i] !== undefined) {
                ifaceSanitized = ifaceSanitized + s[i];
              }
            }
            const nmiDetails = nmiDeviceLinux(ifaceSanitized);
            const wpaDetails = wpaConnectionLinux(ifaceSanitized);
            const ssid = nmiDetails.ssid || wpaDetails.ssid;
            const network = networkList.filter((nw) => nw.ssid === ssid);
            let ssidSanitized = "";
            const t = util.isPrototypePolluted() ? "---" : util.sanitizeShellString(ssid, true);
            const l = util.mathMin(t.length, 32);
            for (let i = 0;i <= l; i++) {
              if (t[i] !== undefined) {
                ssidSanitized = ssidSanitized + t[i];
              }
            }
            const nmiConnection = nmiConnectionLinux(ssidSanitized);
            const channel = network && network.length && network[0].channel ? network[0].channel : wpaDetails.channel ? wpaDetails.channel : null;
            const bssid = network && network.length && network[0].bssid ? network[0].bssid : wpaDetails.bssid ? wpaDetails.bssid : null;
            const signalLevel = network && network.length && network[0].signalLevel ? network[0].signalLevel : null;
            if (ssid && bssid) {
              result2.push({
                id: ifaceDetail.id,
                iface: ifaceDetail.iface,
                model: nmiDetails.product,
                ssid,
                bssid: network && network.length && network[0].bssid ? network[0].bssid : wpaDetails.bssid ? wpaDetails.bssid : null,
                channel,
                frequency: channel ? wifiFrequencyFromChannel(channel) : null,
                type: nmiConnection.type ? nmiConnection.type : "802.11",
                security: nmiConnection.security ? nmiConnection.security : wpaDetails.security ? wpaDetails.security : null,
                signalLevel,
                quality: wifiQualityFromDB(signalLevel),
                txRate: null
              });
            }
          });
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        } else if (_darwin) {
          const cmd = 'system_profiler SPNetworkDataType SPAirPortDataType -xml 2>/dev/null; echo "######" ; ioreg -n AppleBCMWLANSkywalkInterface -r 2>/dev/null';
          exec(cmd, (error2, stdout) => {
            try {
              const parts = stdout.toString().split("######");
              const profilerObj = util.plistParser(parts[0]);
              const networkObj = profilerObj[0]._SPCommandLineArguments.indexOf("SPNetworkDataType") >= 0 ? profilerObj[0]._items : profilerObj[1]._items;
              const airportObj = profilerObj[0]._SPCommandLineArguments.indexOf("SPAirPortDataType") >= 0 ? profilerObj[0]._items[0].spairport_airport_interfaces : profilerObj[1]._items[0].spairport_airport_interfaces;
              let lines3 = [];
              if (parts[1].indexOf("  | {") > 0 && parts[1].indexOf("  | }") > parts[1].indexOf("  | {")) {
                lines3 = parts[1].split("  | {")[1].split("  | }")[0].replace(/ \| /g, "").replace(/"/g, "").split(`
`);
              }
              const networkWifiObj = networkObj.find((item) => {
                return item._name === "Wi-Fi";
              });
              const airportWifiObj = airportObj[0].spairport_current_network_information;
              const channel = parseInt(("" + airportWifiObj.spairport_network_channel).split(" ")[0], 10) || 0;
              const signalLevel = airportWifiObj.spairport_signal_noise || null;
              const security = [];
              const sm = airportWifiObj.spairport_security_mode || "";
              if (sm === "spairport_security_mode_wep") {
                security.push("WEP");
              } else if (sm === "spairport_security_mode_wpa2_personal") {
                security.push("WPA2");
              } else if (sm.startsWith("spairport_security_mode_wpa2_enterprise")) {
                security.push("WPA2 EAP");
              } else if (sm.startsWith("pairport_security_mode_wpa3_transition")) {
                security.push("WPA2/WPA3");
              } else if (sm.startsWith("pairport_security_mode_wpa3")) {
                security.push("WPA3");
              }
              result2.push({
                id: networkWifiObj._name || "Wi-Fi",
                iface: networkWifiObj.interface || "",
                model: networkWifiObj.hardware || "",
                ssid: (airportWifiObj._name || "").replace("&lt;", "<").replace("&gt;", ">"),
                bssid: airportWifiObj.spairport_network_bssid || "",
                channel,
                frequency: channel ? wifiFrequencyFromChannel(channel) : null,
                type: airportWifiObj.spairport_network_phymode || "802.11",
                security,
                signalLevel: signalLevel ? parseInt(signalLevel, 10) : null,
                quality: wifiQualityFromDB(signalLevel),
                txRate: airportWifiObj.spairport_network_rate || null
              });
            } catch {
              util.noop();
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        } else if (_windows) {
          const cmd = "netsh wlan show interfaces";
          util.powerShell(cmd).then((stdout) => {
            const allLines = stdout.toString().split(`\r
`);
            for (let i = 0;i < allLines.length; i++) {
              allLines[i] = allLines[i].trim();
            }
            const parts = allLines.join(`\r
`).split(`:\r
\r
`);
            parts.shift();
            parts.forEach((part) => {
              const lines = part.split(`\r
`);
              if (lines.length >= 5) {
                const iface = lines[0].indexOf(":") >= 0 ? lines[0].split(":")[1].trim() : "";
                const model = lines[1].indexOf(":") >= 0 ? lines[1].split(":")[1].trim() : "";
                const id = lines[2].indexOf(":") >= 0 ? lines[2].split(":")[1].trim() : "";
                const ssid = util.getValue(lines, "SSID", ":", true);
                const bssid = util.getValue(lines, "BSSID", ":", true) || util.getValue(lines, "AP BSSID", ":", true);
                const quality = util.getValue(lines, "Signal", ":", true);
                const signalLevel = wifiDBFromQuality(quality);
                const type = util.getValue(lines, "Radio type", ":", true) || util.getValue(lines, "Type de radio", ":", true) || util.getValue(lines, "Funktyp", ":", true) || null;
                const security = util.getValue(lines, "authentication", ":", true) || util.getValue(lines, "Authentification", ":", true) || util.getValue(lines, "Authentifizierung", ":", true) || null;
                const channel = util.getValue(lines, "Channel", ":", true) || util.getValue(lines, "Canal", ":", true) || util.getValue(lines, "Kanal", ":", true) || null;
                const txRate = util.getValue(lines, "Transmit rate (mbps)", ":", true) || util.getValue(lines, "Transmission (mbit/s)", ":", true) || util.getValue(lines, "Empfangsrate (MBit/s)", ":", true) || null;
                if (model && id && ssid && bssid) {
                  result2.push({
                    id,
                    iface,
                    model,
                    ssid,
                    bssid,
                    channel: util.toInt(channel),
                    frequency: channel ? wifiFrequencyFromChannel(channel) : null,
                    type,
                    security,
                    signalLevel,
                    quality: quality ? parseInt(quality, 10) : null,
                    txRate: util.toInt(txRate) || null
                  });
                }
              }
            });
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        } else {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
      });
    });
  }
  exports.wifiConnections = wifiConnections;
  function wifiInterfaces(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        const result2 = [];
        if (_linux) {
          const ifaces = ifaceListLinux();
          ifaces.forEach((ifaceDetail) => {
            const nmiDetails = nmiDeviceLinux(ifaceDetail.iface);
            result2.push({
              id: ifaceDetail.id,
              iface: ifaceDetail.iface,
              model: nmiDetails.product ? nmiDetails.product : null,
              vendor: nmiDetails.vendor ? nmiDetails.vendor : null,
              mac: ifaceDetail.mac
            });
          });
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        } else if (_darwin) {
          const cmd = "system_profiler SPNetworkDataType";
          exec(cmd, (error2, stdout) => {
            const parts1 = stdout.toString().split(`

    Wi-Fi:

`);
            if (parts1.length > 1) {
              const lines = parts1[1].split(`

`)[0].split(`
`);
              const iface = util.getValue(lines, "BSD Device Name", ":", true);
              const mac = util.getValue(lines, "MAC Address", ":", true);
              const model = util.getValue(lines, "hardware", ":", true);
              result2.push({
                id: "Wi-Fi",
                iface,
                model,
                vendor: "",
                mac
              });
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        } else if (_windows) {
          const cmd = "netsh wlan show interfaces";
          util.powerShell(cmd).then((stdout) => {
            const allLines = stdout.toString().split(`\r
`);
            for (let i = 0;i < allLines.length; i++) {
              allLines[i] = allLines[i].trim();
            }
            const parts = allLines.join(`\r
`).split(`:\r
\r
`);
            parts.shift();
            parts.forEach((part) => {
              const lines = part.split(`\r
`);
              if (lines.length >= 5) {
                const iface = lines[0].indexOf(":") >= 0 ? lines[0].split(":")[1].trim() : "";
                const model = lines[1].indexOf(":") >= 0 ? lines[1].split(":")[1].trim() : "";
                const id = lines[2].indexOf(":") >= 0 ? lines[2].split(":")[1].trim() : "";
                const macParts = lines[3].indexOf(":") >= 0 ? lines[3].split(":") : [];
                macParts.shift();
                const mac = macParts.join(":").trim();
                const vendor = getVendor(model);
                if (iface && model && id && mac) {
                  result2.push({
                    id,
                    iface,
                    model,
                    vendor,
                    mac
                  });
                }
              }
            });
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        } else {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
      });
    });
  }
  exports.wifiInterfaces = wifiInterfaces;
});

// node_modules/systeminformation/lib/processes.js
var require_processes = __commonJS((exports) => {
  var os = __require("os");
  var fs = __require("fs");
  var path = __require("path");
  var exec = __require("child_process").exec;
  var execSync = __require("child_process").execSync;
  var util = require_util();
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  var _processes_cpu = {
    all: 0,
    all_utime: 0,
    all_stime: 0,
    list: {},
    ms: 0,
    result: {}
  };
  var _services_cpu = {
    all: 0,
    all_utime: 0,
    all_stime: 0,
    list: {},
    ms: 0,
    result: {}
  };
  var _process_cpu = {
    all: 0,
    all_utime: 0,
    all_stime: 0,
    list: {},
    ms: 0,
    result: {}
  };
  var _winStatusValues = {
    0: "unknown",
    1: "other",
    2: "ready",
    3: "running",
    4: "blocked",
    5: "suspended blocked",
    6: "suspended ready",
    7: "terminated",
    8: "stopped",
    9: "growing"
  };
  function parseTimeUnix(time) {
    let result2 = time;
    let parts = time.replace(/ +/g, " ").split(" ");
    if (parts.length === 5) {
      result2 = parts[4] + "-" + ("0" + ("JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC".indexOf(parts[1].toUpperCase()) / 3 + 1)).slice(-2) + "-" + ("0" + parts[2]).slice(-2) + " " + parts[3];
    }
    return result2;
  }
  function parseElapsedTime(etime) {
    let current = new Date;
    current = new Date(current.getTime() - current.getTimezoneOffset() * 60000);
    const elapsed = etime.split("-");
    const timeIndex = elapsed.length - 1;
    const days = timeIndex > 0 ? parseInt(elapsed[timeIndex - 1]) : 0;
    const timeStr = elapsed[timeIndex].split(":");
    const hours = timeStr.length === 3 ? parseInt(timeStr[0] || 0) : 0;
    const mins = parseInt(timeStr[timeStr.length === 3 ? 1 : 0] || 0);
    const secs = parseInt(timeStr[timeStr.length === 3 ? 2 : 1] || 0);
    const ms = (((days * 24 + hours) * 60 + mins) * 60 + secs) * 1000;
    let res = new Date(current.getTime());
    let result2 = res.toISOString().substring(0, 10) + " " + res.toISOString().substring(11, 19);
    try {
      res = new Date(current.getTime() - ms);
      result2 = res.toISOString().substring(0, 10) + " " + res.toISOString().substring(11, 19);
    } catch (e) {
      util.noop();
    }
    return result2;
  }
  function services(srv, callback) {
    if (util.isFunction(srv) && !callback) {
      callback = srv;
      srv = "";
    }
    return new Promise((resolve) => {
      process.nextTick(() => {
        if (typeof srv !== "string") {
          if (callback) {
            callback([]);
          }
          return resolve([]);
        }
        if (srv) {
          let srvString = "";
          try {
            srvString.__proto__.toLowerCase = util.stringToLower;
            srvString.__proto__.replace = util.stringReplace;
            srvString.__proto__.toString = util.stringToString;
            srvString.__proto__.substr = util.stringSubstr;
            srvString.__proto__.substring = util.stringSubstring;
            srvString.__proto__.trim = util.stringTrim;
            srvString.__proto__.startsWith = util.stringStartWith;
          } catch (e) {
            Object.setPrototypeOf(srvString, util.stringObj);
          }
          const s = util.sanitizeShellString(srv);
          const l = util.mathMin(s.length, 2000);
          for (let i = 0;i <= l; i++) {
            if (s[i] !== undefined) {
              srvString = srvString + s[i];
            }
          }
          srvString = srvString.trim().toLowerCase().replace(/, /g, "|").replace(/,+/g, "|");
          if (srvString === "") {
            srvString = "*";
          }
          if (util.isPrototypePolluted() && srvString !== "*") {
            srvString = "------";
          }
          let srvs = srvString.split("|");
          let result2 = [];
          let dataSrv = [];
          if (_linux || _freebsd || _openbsd || _netbsd || _darwin) {
            if ((_linux || _freebsd || _openbsd || _netbsd) && srvString === "*") {
              try {
                const tmpsrv = execSync("systemctl --all --type=service --no-legend 2> /dev/null", util.execOptsLinux).toString().split(`
`);
                srvs = [];
                for (const s2 of tmpsrv) {
                  const name = s2.split(".service")[0];
                  if (name && s2.indexOf(" not-found ") === -1) {
                    srvs.push(name.trim());
                  }
                }
                srvString = srvs.join("|");
              } catch (d) {
                try {
                  srvString = "";
                  const tmpsrv = execSync("service --status-all 2> /dev/null", util.execOptsLinux).toString().split(`
`);
                  for (const s2 of tmpsrv) {
                    const parts = s2.split("]");
                    if (parts.length === 2) {
                      srvString += (srvString !== "" ? "|" : "") + parts[1].trim();
                    }
                  }
                  srvs = srvString.split("|");
                } catch (e) {
                  try {
                    const srvStr = execSync("ls /etc/init.d/ -m 2> /dev/null", util.execOptsLinux).toString().split(`
`).join("");
                    srvString = "";
                    if (srvStr) {
                      const tmpsrv = srvStr.split(",");
                      for (const s2 of tmpsrv) {
                        const name = s2.trim();
                        if (name) {
                          srvString += (srvString !== "" ? "|" : "") + name;
                        }
                      }
                      srvs = srvString.split("|");
                    }
                  } catch (f) {
                    srvString = "";
                    srvs = [];
                  }
                }
              }
            }
            if (_darwin && srvString === "*") {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
            let args = _darwin ? ["-caxo", "pcpu,pmem,pid,command"] : ["-axo", "pcpu,pmem,pid,command"];
            if (srvString !== "" && srvs.length > 0) {
              util.execSafe("ps", args).then((stdout) => {
                if (stdout) {
                  let lines = stdout.replace(/ +/g, " ").replace(/,+/g, ".").split(`
`);
                  srvs.forEach(function(srv2) {
                    let ps;
                    if (_darwin) {
                      ps = lines.filter(function(e) {
                        return e.toLowerCase().indexOf(srv2) !== -1;
                      });
                    } else {
                      ps = lines.filter(function(e) {
                        return e.toLowerCase().indexOf(" " + srv2.toLowerCase() + ":") !== -1 || e.toLowerCase().indexOf("(" + srv2.toLowerCase() + " ") !== -1 || e.toLowerCase().indexOf("(" + srv2.toLowerCase() + ")") !== -1 || e.toLowerCase().indexOf(" " + srv2.toLowerCase().replace(/[0-9.]/g, "") + ":") !== -1 || e.toLowerCase().indexOf("/" + srv2.toLowerCase()) !== -1;
                      });
                    }
                    const pids = [];
                    for (const p of ps) {
                      const pid = p.trim().split(" ")[2];
                      if (pid) {
                        pids.push(parseInt(pid, 10));
                      }
                    }
                    result2.push({
                      name: srv2,
                      running: ps.length > 0,
                      startmode: "",
                      pids,
                      cpu: parseFloat(ps.reduce(function(pv, cv) {
                        return pv + parseFloat(cv.trim().split(" ")[0]);
                      }, 0).toFixed(2)),
                      mem: parseFloat(ps.reduce(function(pv, cv) {
                        return pv + parseFloat(cv.trim().split(" ")[1]);
                      }, 0).toFixed(2))
                    });
                  });
                  if (_linux) {
                    let cmd = 'cat /proc/stat | grep "cpu "';
                    for (let i in result2) {
                      for (let j in result2[i].pids) {
                        cmd += ";cat /proc/" + result2[i].pids[j] + "/stat";
                      }
                    }
                    exec(cmd, { maxBuffer: 1024 * 102400 }, function(error2, stdout2) {
                      let curr_processes = stdout2.toString().split(`
`);
                      let all = parseProcStat(curr_processes.shift());
                      let list_new = {};
                      let resultProcess = {};
                      curr_processes.forEach((element) => {
                        resultProcess = calcProcStatLinux(element, all, _services_cpu);
                        if (resultProcess.pid) {
                          let listPos = -1;
                          for (let i in result2) {
                            for (let j in result2[i].pids) {
                              if (parseInt(result2[i].pids[j]) === parseInt(resultProcess.pid)) {
                                listPos = i;
                              }
                            }
                          }
                          if (listPos >= 0) {
                            result2[listPos].cpu += resultProcess.cpuu + resultProcess.cpus;
                          }
                          list_new[resultProcess.pid] = {
                            cpuu: resultProcess.cpuu,
                            cpus: resultProcess.cpus,
                            utime: resultProcess.utime,
                            stime: resultProcess.stime,
                            cutime: resultProcess.cutime,
                            cstime: resultProcess.cstime
                          };
                        }
                      });
                      _services_cpu.all = all;
                      _services_cpu.list = Object.assign({}, list_new);
                      _services_cpu.ms = Date.now() - _services_cpu.ms;
                      _services_cpu.result = Object.assign({}, result2);
                      if (callback) {
                        callback(result2);
                      }
                      resolve(result2);
                    });
                  } else {
                    if (callback) {
                      callback(result2);
                    }
                    resolve(result2);
                  }
                } else {
                  args = ["-o", "comm"];
                  util.execSafe("ps", args).then((stdout2) => {
                    if (stdout2) {
                      let lines = stdout2.replace(/ +/g, " ").replace(/,+/g, ".").split(`
`);
                      srvs.forEach(function(srv2) {
                        let ps = lines.filter(function(e) {
                          return e.indexOf(srv2) !== -1;
                        });
                        result2.push({
                          name: srv2,
                          running: ps.length > 0,
                          startmode: "",
                          cpu: 0,
                          mem: 0
                        });
                      });
                      if (callback) {
                        callback(result2);
                      }
                      resolve(result2);
                    } else {
                      srvs.forEach(function(srv2) {
                        result2.push({
                          name: srv2,
                          running: false,
                          startmode: "",
                          cpu: 0,
                          mem: 0
                        });
                      });
                      if (callback) {
                        callback(result2);
                      }
                      resolve(result2);
                    }
                  });
                }
              });
            } else {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
          }
          if (_windows) {
            try {
              let wincommand = "Get-CimInstance Win32_Service";
              if (srvs[0] !== "*") {
                wincommand += ' -Filter "';
                srvs.forEach((srv2) => {
                  wincommand += `Name='${srv2}' or `;
                });
                wincommand = `${wincommand.slice(0, -4)}"`;
              }
              wincommand += " | select Name,Caption,Started,StartMode,ProcessId | fl";
              util.powerShell(wincommand).then((stdout, error2) => {
                if (!error2) {
                  let serviceSections = stdout.split(/\n\s*\n/);
                  serviceSections.forEach((element) => {
                    if (element.trim() !== "") {
                      let lines = element.trim().split(`\r
`);
                      let srvName = util.getValue(lines, "Name", ":", true).toLowerCase();
                      let srvCaption = util.getValue(lines, "Caption", ":", true).toLowerCase();
                      let started = util.getValue(lines, "Started", ":", true);
                      let startMode = util.getValue(lines, "StartMode", ":", true);
                      let pid = util.getValue(lines, "ProcessId", ":", true);
                      if (srvString === "*" || srvs.indexOf(srvName) >= 0 || srvs.indexOf(srvCaption) >= 0) {
                        result2.push({
                          name: srvName,
                          running: started.toLowerCase() === "true",
                          startmode: startMode,
                          pids: [pid],
                          cpu: 0,
                          mem: 0
                        });
                        dataSrv.push(srvName);
                        dataSrv.push(srvCaption);
                      }
                    }
                  });
                  if (srvString !== "*") {
                    const srvsMissing = srvs.filter((e) => dataSrv.indexOf(e) === -1);
                    srvsMissing.forEach((srvName) => {
                      result2.push({
                        name: srvName,
                        running: false,
                        startmode: "",
                        pids: [],
                        cpu: 0,
                        mem: 0
                      });
                    });
                  }
                  if (callback) {
                    callback(result2);
                  }
                  resolve(result2);
                } else {
                  srvs.forEach((srvName) => {
                    result2.push({
                      name: srvName,
                      running: false,
                      startmode: "",
                      cpu: 0,
                      mem: 0
                    });
                  });
                  if (callback) {
                    callback(result2);
                  }
                  resolve(result2);
                }
              });
            } catch {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
          }
        } else {
          if (callback) {
            callback([]);
          }
          resolve([]);
        }
      });
    });
  }
  exports.services = services;
  function parseProcStat(line) {
    const parts = line.replace(/ +/g, " ").split(" ");
    const user = parts.length >= 2 ? parseInt(parts[1]) : 0;
    const nice = parts.length >= 3 ? parseInt(parts[2]) : 0;
    const system = parts.length >= 4 ? parseInt(parts[3]) : 0;
    const idle = parts.length >= 5 ? parseInt(parts[4]) : 0;
    const iowait = parts.length >= 6 ? parseInt(parts[5]) : 0;
    const irq = parts.length >= 7 ? parseInt(parts[6]) : 0;
    const softirq = parts.length >= 8 ? parseInt(parts[7]) : 0;
    const steal = parts.length >= 9 ? parseInt(parts[8]) : 0;
    const guest = parts.length >= 10 ? parseInt(parts[9]) : 0;
    const guest_nice = parts.length >= 11 ? parseInt(parts[10]) : 0;
    return user + nice + system + idle + iowait + irq + softirq + steal + guest + guest_nice;
  }
  function calcProcStatLinux(line, all, _cpu_old) {
    let statparts = line.replace(/ +/g, " ").split(")");
    if (statparts.length >= 2) {
      let parts = statparts[1].split(" ");
      if (parts.length >= 16) {
        let pid = parseInt(statparts[0].split(" ")[0]);
        let utime = parseInt(parts[12]);
        let stime = parseInt(parts[13]);
        let cutime = parseInt(parts[14]);
        let cstime = parseInt(parts[15]);
        let cpuu = 0;
        let cpus = 0;
        if (_cpu_old.all > 0 && _cpu_old.list[pid]) {
          cpuu = (utime + cutime - _cpu_old.list[pid].utime - _cpu_old.list[pid].cutime) / (all - _cpu_old.all) * 100;
          cpus = (stime + cstime - _cpu_old.list[pid].stime - _cpu_old.list[pid].cstime) / (all - _cpu_old.all) * 100;
        } else {
          cpuu = (utime + cutime) / all * 100;
          cpus = (stime + cstime) / all * 100;
        }
        return {
          pid,
          utime,
          stime,
          cutime,
          cstime,
          cpuu,
          cpus
        };
      } else {
        return {
          pid: 0,
          utime: 0,
          stime: 0,
          cutime: 0,
          cstime: 0,
          cpuu: 0,
          cpus: 0
        };
      }
    } else {
      return {
        pid: 0,
        utime: 0,
        stime: 0,
        cutime: 0,
        cstime: 0,
        cpuu: 0,
        cpus: 0
      };
    }
  }
  function calcProcStatWin(procStat, all, _cpu_old) {
    let cpuu = 0;
    let cpus = 0;
    if (_cpu_old.all > 0 && _cpu_old.list[procStat.pid]) {
      cpuu = (procStat.utime - _cpu_old.list[procStat.pid].utime) / (all - _cpu_old.all) * 100;
      cpus = (procStat.stime - _cpu_old.list[procStat.pid].stime) / (all - _cpu_old.all) * 100;
    } else {
      cpuu = procStat.utime / all * 100;
      cpus = procStat.stime / all * 100;
    }
    return {
      pid: procStat.pid,
      utime: procStat.utime,
      stime: procStat.stime,
      cpuu: cpuu > 0 ? cpuu : 0,
      cpus: cpus > 0 ? cpus : 0
    };
  }
  function processes(callback) {
    let parsedhead = [];
    function getName(command) {
      command = command || "";
      let result2 = command.split(" ")[0];
      if (result2.substr(-1) === ":") {
        result2 = result2.substr(0, result2.length - 1);
      }
      if (result2.substr(0, 1) !== "[") {
        let parts = result2.split("/");
        if (isNaN(parseInt(parts[parts.length - 1]))) {
          result2 = parts[parts.length - 1];
        } else {
          result2 = parts[0];
        }
      }
      return result2;
    }
    function parseLine(line) {
      let offset = 0;
      let offset2 = 0;
      function checkColumn(i) {
        offset = offset2;
        if (parsedhead[i]) {
          offset2 = line.substring(parsedhead[i].to + offset, 1e4).indexOf(" ");
        } else {
          offset2 = 1e4;
        }
      }
      checkColumn(0);
      const pid = parseInt(line.substring(parsedhead[0].from + offset, parsedhead[0].to + offset2));
      checkColumn(1);
      const ppid = parseInt(line.substring(parsedhead[1].from + offset, parsedhead[1].to + offset2));
      checkColumn(2);
      const cpu = parseFloat(line.substring(parsedhead[2].from + offset, parsedhead[2].to + offset2).replace(/,/g, "."));
      checkColumn(3);
      const mem = parseFloat(line.substring(parsedhead[3].from + offset, parsedhead[3].to + offset2).replace(/,/g, "."));
      checkColumn(4);
      const priority = parseInt(line.substring(parsedhead[4].from + offset, parsedhead[4].to + offset2));
      checkColumn(5);
      const vsz = parseInt(line.substring(parsedhead[5].from + offset, parsedhead[5].to + offset2));
      checkColumn(6);
      const rss = parseInt(line.substring(parsedhead[6].from + offset, parsedhead[6].to + offset2));
      checkColumn(7);
      const nice = parseInt(line.substring(parsedhead[7].from + offset, parsedhead[7].to + offset2)) || 0;
      checkColumn(8);
      const started = !_sunos ? parseElapsedTime(line.substring(parsedhead[8].from + offset, parsedhead[8].to + offset2).trim()) : parseTimeUnix(line.substring(parsedhead[8].from + offset, parsedhead[8].to + offset2).trim());
      checkColumn(9);
      let state = line.substring(parsedhead[9].from + offset, parsedhead[9].to + offset2).trim();
      state = state[0] === "R" ? "running" : state[0] === "S" ? "sleeping" : state[0] === "T" ? "stopped" : state[0] === "W" ? "paging" : state[0] === "X" ? "dead" : state[0] === "Z" ? "zombie" : state[0] === "D" || state[0] === "U" ? "blocked" : "unknown";
      checkColumn(10);
      let tty = line.substring(parsedhead[10].from + offset, parsedhead[10].to + offset2).trim();
      if (tty === "?" || tty === "??") {
        tty = "";
      }
      checkColumn(11);
      const user = line.substring(parsedhead[11].from + offset, parsedhead[11].to + offset2).trim();
      checkColumn(12);
      let cmdPath = "";
      let command = "";
      let params = "";
      let fullcommand = line.substring(parsedhead[12].from + offset, parsedhead[12].to + offset2).trim();
      if (fullcommand.substr(fullcommand.length - 1) === "]") {
        fullcommand = fullcommand.slice(0, -1);
      }
      if (fullcommand.substr(0, 1) === "[") {
        command = fullcommand.substring(1);
      } else {
        const p1 = fullcommand.indexOf("(");
        const p2 = fullcommand.indexOf(")");
        const p3 = fullcommand.indexOf("/");
        const p4 = fullcommand.indexOf(":");
        if (p1 < p2 && p1 < p3 && p3 < p2) {
          command = fullcommand.split(" ")[0];
          command = command.replace(/:/g, "");
        } else {
          if (p4 > 0 && (p3 === -1 || p3 > 3)) {
            command = fullcommand.split(" ")[0];
            command = command.replace(/:/g, "");
          } else {
            let firstParamPos = fullcommand.indexOf(" -");
            let firstParamPathPos = fullcommand.indexOf(" /");
            firstParamPos = firstParamPos >= 0 ? firstParamPos : 1e4;
            firstParamPathPos = firstParamPathPos >= 0 ? firstParamPathPos : 1e4;
            const firstPos = Math.min(firstParamPos, firstParamPathPos);
            let tmpCommand = fullcommand.substr(0, firstPos);
            const tmpParams = fullcommand.substr(firstPos);
            const lastSlashPos = tmpCommand.lastIndexOf("/");
            if (lastSlashPos >= 0) {
              cmdPath = tmpCommand.substr(0, lastSlashPos);
              tmpCommand = tmpCommand.substr(lastSlashPos + 1);
            }
            if (firstPos === 1e4 && tmpCommand.indexOf(" ") > -1) {
              const parts = tmpCommand.split(" ");
              if (fs.existsSync(path.join(cmdPath, parts[0]))) {
                command = parts.shift();
                params = (parts.join(" ") + " " + tmpParams).trim();
              } else {
                command = tmpCommand.trim();
                params = tmpParams.trim();
              }
            } else {
              command = tmpCommand.trim();
              params = tmpParams.trim();
            }
          }
        }
      }
      return {
        pid,
        parentPid: ppid,
        name: _linux ? getName(command) : command,
        cpu,
        cpuu: 0,
        cpus: 0,
        mem,
        priority,
        memVsz: vsz,
        memRss: rss,
        nice,
        started,
        state,
        tty,
        user,
        command,
        params,
        path: cmdPath
      };
    }
    function parseProcesses(lines) {
      let result2 = [];
      if (lines.length > 1) {
        let head = lines[0];
        parsedhead = util.parseHead(head, 8);
        lines.shift();
        lines.forEach((line) => {
          if (line.trim() !== "") {
            result2.push(parseLine(line));
          }
        });
      }
      return result2;
    }
    function parseProcesses2(lines) {
      function formatDateTime(time) {
        const month = ("0" + (time.getMonth() + 1).toString()).slice(-2);
        const year = time.getFullYear().toString();
        const day = ("0" + time.getDate().toString()).slice(-2);
        const hours = ("0" + time.getHours().toString()).slice(-2);
        const mins = ("0" + time.getMinutes().toString()).slice(-2);
        const secs = ("0" + time.getSeconds().toString()).slice(-2);
        return year + "-" + month + "-" + day + " " + hours + ":" + mins + ":" + secs;
      }
      function parseElapsed(etime) {
        let started = "";
        if (etime.indexOf("d") >= 0) {
          const elapsed_parts = etime.split("d");
          started = formatDateTime(new Date(Date.now() - (elapsed_parts[0] * 24 + elapsed_parts[1] * 1) * 60 * 60 * 1000));
        } else if (etime.indexOf("h") >= 0) {
          const elapsed_parts = etime.split("h");
          started = formatDateTime(new Date(Date.now() - (elapsed_parts[0] * 60 + elapsed_parts[1] * 1) * 60 * 1000));
        } else if (etime.indexOf(":") >= 0) {
          const elapsed_parts = etime.split(":");
          started = formatDateTime(new Date(Date.now() - (elapsed_parts.length > 1 ? (elapsed_parts[0] * 60 + elapsed_parts[1]) * 1000 : elapsed_parts[0] * 1000)));
        }
        return started;
      }
      let result2 = [];
      lines.forEach((line) => {
        if (line.trim() !== "") {
          line = line.trim().replace(/ +/g, " ").replace(/,+/g, ".");
          const parts = line.split(" ");
          const command = parts.slice(9).join(" ");
          const pmem = parseFloat((1 * parseInt(parts[3]) * 1024 / os.totalmem()).toFixed(1));
          const started = parseElapsed(parts[5]);
          result2.push({
            pid: parseInt(parts[0]),
            parentPid: parseInt(parts[1]),
            name: getName(command),
            cpu: 0,
            cpuu: 0,
            cpus: 0,
            mem: pmem,
            priority: 0,
            memVsz: parseInt(parts[2]),
            memRss: parseInt(parts[3]),
            nice: parseInt(parts[4]),
            started,
            state: parts[6] === "R" ? "running" : parts[6] === "S" ? "sleeping" : parts[6] === "T" ? "stopped" : parts[6] === "W" ? "paging" : parts[6] === "X" ? "dead" : parts[6] === "Z" ? "zombie" : parts[6] === "D" || parts[6] === "U" ? "blocked" : "unknown",
            tty: parts[7],
            user: parts[8],
            command
          });
        }
      });
      return result2;
    }
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = {
          all: 0,
          running: 0,
          blocked: 0,
          sleeping: 0,
          unknown: 0,
          list: []
        };
        let cmd = "";
        if (_processes_cpu.ms && Date.now() - _processes_cpu.ms >= 500 || _processes_cpu.ms === 0) {
          if (_linux || _freebsd || _openbsd || _netbsd || _darwin || _sunos) {
            if (_linux) {
              cmd = "export LC_ALL=C; ps -axo pid:11,ppid:11,pcpu:6,pmem:6,pri:5,vsz:11,rss:11,ni:5,etime:30,state:5,tty:15,user:20,command; unset LC_ALL";
            }
            if (_freebsd || _openbsd || _netbsd) {
              cmd = "export LC_ALL=C; ps -axo pid,ppid,pcpu,pmem,pri,vsz,rss,ni,etime,state,tty,user,command; unset LC_ALL";
            }
            if (_darwin) {
              cmd = "ps -axo pid,ppid,pcpu,pmem,pri,vsz=temp_title_1,rss=temp_title_2,nice,etime=temp_title_3,state,tty,user,command -r";
            }
            if (_sunos) {
              cmd = "ps -Ao pid,ppid,pcpu,pmem,pri,vsz,rss,nice,stime,s,tty,user,comm";
            }
            try {
              exec(cmd, { maxBuffer: 1024 * 102400 }, (error2, stdout) => {
                if (!error2 && stdout.toString().trim()) {
                  result2.list = parseProcesses(stdout.toString().split(`
`)).slice();
                  result2.all = result2.list.length;
                  result2.running = result2.list.filter((e) => {
                    return e.state === "running";
                  }).length;
                  result2.blocked = result2.list.filter((e) => {
                    return e.state === "blocked";
                  }).length;
                  result2.sleeping = result2.list.filter((e) => {
                    return e.state === "sleeping";
                  }).length;
                  if (_linux) {
                    cmd = 'cat /proc/stat | grep "cpu "';
                    result2.list.forEach((element) => {
                      cmd += ";cat /proc/" + element.pid + "/stat";
                    });
                    exec(cmd, { maxBuffer: 1024 * 102400 }, (error3, stdout2) => {
                      let curr_processes = stdout2.toString().split(`
`);
                      let all = parseProcStat(curr_processes.shift());
                      let list_new = {};
                      let resultProcess = {};
                      curr_processes.forEach((element) => {
                        resultProcess = calcProcStatLinux(element, all, _processes_cpu);
                        if (resultProcess.pid) {
                          let listPos = result2.list.map((e) => {
                            return e.pid;
                          }).indexOf(resultProcess.pid);
                          if (listPos >= 0) {
                            result2.list[listPos].cpu = resultProcess.cpuu + resultProcess.cpus;
                            result2.list[listPos].cpuu = resultProcess.cpuu;
                            result2.list[listPos].cpus = resultProcess.cpus;
                          }
                          list_new[resultProcess.pid] = {
                            cpuu: resultProcess.cpuu,
                            cpus: resultProcess.cpus,
                            utime: resultProcess.utime,
                            stime: resultProcess.stime,
                            cutime: resultProcess.cutime,
                            cstime: resultProcess.cstime
                          };
                        }
                      });
                      _processes_cpu.all = all;
                      _processes_cpu.list = Object.assign({}, list_new);
                      _processes_cpu.ms = Date.now() - _processes_cpu.ms;
                      _processes_cpu.result = Object.assign({}, result2);
                      if (callback) {
                        callback(result2);
                      }
                      resolve(result2);
                    });
                  } else {
                    if (callback) {
                      callback(result2);
                    }
                    resolve(result2);
                  }
                } else {
                  cmd = "ps -o pid,ppid,vsz,rss,nice,etime,stat,tty,user,comm";
                  if (_sunos) {
                    cmd = "ps -o pid,ppid,vsz,rss,nice,etime,s,tty,user,comm";
                  }
                  exec(cmd, { maxBuffer: 1024 * 102400 }, (error3, stdout2) => {
                    if (!error3) {
                      let lines = stdout2.toString().split(`
`);
                      lines.shift();
                      result2.list = parseProcesses2(lines).slice();
                      result2.all = result2.list.length;
                      result2.running = result2.list.filter((e) => {
                        return e.state === "running";
                      }).length;
                      result2.blocked = result2.list.filter((e) => {
                        return e.state === "blocked";
                      }).length;
                      result2.sleeping = result2.list.filter((e) => {
                        return e.state === "sleeping";
                      }).length;
                      if (callback) {
                        callback(result2);
                      }
                      resolve(result2);
                    } else {
                      if (callback) {
                        callback(result2);
                      }
                      resolve(result2);
                    }
                  });
                }
              });
            } catch {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
          } else if (_windows) {
            try {
              util.powerShell(`Get-CimInstance Win32_Process | select-Object ProcessId,ParentProcessId,ExecutionState,Caption,CommandLine,ExecutablePath,UserModeTime,KernelModeTime,WorkingSetSize,Priority,PageFileUsage,
                @{n="CreationDate";e={$_.CreationDate.ToString("yyyy-MM-dd HH:mm:ss")}} | ConvertTo-Json -compress`).then((stdout, error2) => {
                if (!error2) {
                  const procs = [];
                  const procStats = [];
                  const list_new = {};
                  let allcpuu = 0;
                  let allcpus = 0;
                  let processArray = [];
                  try {
                    stdout = stdout.trim().replace(/^\uFEFF/, "");
                    processArray = JSON.parse(stdout);
                  } catch {}
                  processArray.forEach((element) => {
                    const pid = element.ProcessId;
                    const parentPid = element.ParentProcessId;
                    const statusValue = element.ExecutionState || null;
                    const name = element.Caption;
                    const commandLine = element.CommandLine;
                    const commandPath = element.ExecutablePath;
                    const utime = element.UserModeTime;
                    const stime = element.KernelModeTime;
                    const memw = element.WorkingSetSize;
                    allcpuu = allcpuu + utime;
                    allcpus = allcpus + stime;
                    result2.all++;
                    if (!statusValue) {
                      result2.unknown++;
                    }
                    if (statusValue === "3") {
                      result2.running++;
                    }
                    if (statusValue === "4" || statusValue === "5") {
                      result2.blocked++;
                    }
                    procStats.push({
                      pid,
                      utime,
                      stime,
                      cpu: 0,
                      cpuu: 0,
                      cpus: 0
                    });
                    procs.push({
                      pid,
                      parentPid,
                      name,
                      cpu: 0,
                      cpuu: 0,
                      cpus: 0,
                      mem: memw / os.totalmem() * 100,
                      priority: element.Priority | null,
                      memVsz: element.PageFileUsage || null,
                      memRss: Math.floor((element.WorkingSetSize || 0) / 1024),
                      nice: 0,
                      started: element.CreationDate,
                      state: statusValue ? _winStatusValues[statusValue] : _winStatusValues[0],
                      tty: "",
                      user: "",
                      command: commandLine || name,
                      path: commandPath,
                      params: ""
                    });
                  });
                  result2.sleeping = result2.all - result2.running - result2.blocked - result2.unknown;
                  result2.list = procs;
                  procStats.forEach((element) => {
                    let resultProcess = calcProcStatWin(element, allcpuu + allcpus, _processes_cpu);
                    let listPos = result2.list.map((e) => e.pid).indexOf(resultProcess.pid);
                    if (listPos >= 0) {
                      result2.list[listPos].cpu = resultProcess.cpuu + resultProcess.cpus;
                      result2.list[listPos].cpuu = resultProcess.cpuu;
                      result2.list[listPos].cpus = resultProcess.cpus;
                    }
                    list_new[resultProcess.pid] = {
                      cpuu: resultProcess.cpuu,
                      cpus: resultProcess.cpus,
                      utime: resultProcess.utime,
                      stime: resultProcess.stime
                    };
                  });
                  _processes_cpu.all = allcpuu + allcpus;
                  _processes_cpu.all_utime = allcpuu;
                  _processes_cpu.all_stime = allcpus;
                  _processes_cpu.list = Object.assign({}, list_new);
                  _processes_cpu.ms = Date.now() - _processes_cpu.ms;
                  _processes_cpu.result = Object.assign({}, result2);
                }
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              });
            } catch {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
          } else {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        } else {
          if (callback) {
            callback(_processes_cpu.result);
          }
          resolve(_processes_cpu.result);
        }
      });
    });
  }
  exports.processes = processes;
  function processLoad(proc, callback) {
    if (util.isFunction(proc) && !callback) {
      callback = proc;
      proc = "";
    }
    return new Promise((resolve) => {
      process.nextTick(() => {
        proc = proc || "";
        if (typeof proc !== "string") {
          if (callback) {
            callback([]);
          }
          return resolve([]);
        }
        let processesString = "";
        try {
          processesString.__proto__.toLowerCase = util.stringToLower;
          processesString.__proto__.replace = util.stringReplace;
          processesString.__proto__.toString = util.stringToString;
          processesString.__proto__.substr = util.stringSubstr;
          processesString.__proto__.substring = util.stringSubstring;
          processesString.__proto__.trim = util.stringTrim;
          processesString.__proto__.startsWith = util.stringStartWith;
        } catch {
          Object.setPrototypeOf(processesString, util.stringObj);
        }
        const s = util.sanitizeShellString(proc);
        const l = util.mathMin(s.length, 2000);
        for (let i = 0;i <= l; i++) {
          if (s[i] !== undefined) {
            processesString = processesString + s[i];
          }
        }
        processesString = processesString.trim().toLowerCase().replace(/, /g, "|").replace(/,+/g, "|");
        if (processesString === "") {
          processesString = "*";
        }
        if (util.isPrototypePolluted() && processesString !== "*") {
          processesString = "------";
        }
        let processes2 = processesString.split("|");
        let result2 = [];
        const procSanitized = util.isPrototypePolluted() ? "" : util.sanitizeShellString(proc) || "*";
        if (procSanitized && processes2.length && processes2[0] !== "------") {
          if (_windows) {
            try {
              util.powerShell("Get-CimInstance Win32_Process | select ProcessId,Caption,UserModeTime,KernelModeTime,WorkingSetSize | ConvertTo-Json -compress").then((stdout, error2) => {
                if (!error2) {
                  const procStats = [];
                  const list_new = {};
                  let allcpuu = 0;
                  let allcpus = 0;
                  let processArray = [];
                  try {
                    stdout = stdout.trim().replace(/^\uFEFF/, "");
                    processArray = JSON.parse(stdout);
                  } catch {}
                  processArray.forEach((element) => {
                    const pid = element.ProcessId;
                    const name = element.Caption;
                    const utime = element.UserModeTime;
                    const stime = element.KernelModeTime;
                    const mem = element.WorkingSetSize;
                    allcpuu = allcpuu + utime;
                    allcpus = allcpus + stime;
                    procStats.push({
                      pid,
                      name,
                      utime,
                      stime,
                      cpu: 0,
                      cpuu: 0,
                      cpus: 0,
                      mem
                    });
                    let pname = "";
                    let inList = false;
                    processes2.forEach((proc2) => {
                      if (name.toLowerCase().indexOf(proc2.toLowerCase()) >= 0 && !inList) {
                        inList = true;
                        pname = proc2;
                      }
                    });
                    if (processesString === "*" || inList) {
                      let processFound = false;
                      result2.forEach((item) => {
                        if (item.proc.toLowerCase() === pname.toLowerCase()) {
                          item.pids.push(pid);
                          item.mem += mem / os.totalmem() * 100;
                          processFound = true;
                        }
                      });
                      if (!processFound) {
                        result2.push({
                          proc: pname,
                          pid,
                          pids: [pid],
                          cpu: 0,
                          mem: mem / os.totalmem() * 100
                        });
                      }
                    }
                  });
                  if (processesString !== "*") {
                    let processesMissing = processes2.filter((name) => procStats.filter((item) => item.name.toLowerCase().indexOf(name) >= 0).length === 0);
                    processesMissing.forEach((procName) => {
                      result2.push({
                        proc: procName,
                        pid: null,
                        pids: [],
                        cpu: 0,
                        mem: 0
                      });
                    });
                  }
                  procStats.forEach((element) => {
                    let resultProcess = calcProcStatWin(element, allcpuu + allcpus, _process_cpu);
                    let listPos = -1;
                    for (let j = 0;j < result2.length; j++) {
                      if (result2[j].pid === resultProcess.pid || result2[j].pids.indexOf(resultProcess.pid) >= 0) {
                        listPos = j;
                      }
                    }
                    if (listPos >= 0) {
                      result2[listPos].cpu += resultProcess.cpuu + resultProcess.cpus;
                    }
                    list_new[resultProcess.pid] = {
                      cpuu: resultProcess.cpuu,
                      cpus: resultProcess.cpus,
                      utime: resultProcess.utime,
                      stime: resultProcess.stime
                    };
                  });
                  _process_cpu.all = allcpuu + allcpus;
                  _process_cpu.all_utime = allcpuu;
                  _process_cpu.all_stime = allcpus;
                  _process_cpu.list = Object.assign({}, list_new);
                  _process_cpu.ms = Date.now() - _process_cpu.ms;
                  _process_cpu.result = JSON.parse(JSON.stringify(result2));
                  if (callback) {
                    callback(result2);
                  }
                  resolve(result2);
                }
              });
            } catch {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
          }
          if (_darwin || _linux || _freebsd || _openbsd || _netbsd) {
            const params = ["-axo", "pid,ppid,pcpu,pmem,comm"];
            util.execSafe("ps", params).then((stdout) => {
              if (stdout) {
                const procStats = [];
                const lines = stdout.toString().split(`
`).filter((line) => {
                  if (processesString === "*") {
                    return true;
                  }
                  if (line.toLowerCase().indexOf("grep") !== -1) {
                    return false;
                  }
                  let found = false;
                  processes2.forEach((item) => {
                    found = found || line.toLowerCase().indexOf(item.toLowerCase()) >= 0;
                  });
                  return found;
                });
                lines.shift();
                lines.forEach((line) => {
                  const data = line.trim().replace(/ +/g, " ").split(" ");
                  if (data.length > 4) {
                    const linuxName = data[4].indexOf("/") >= 0 ? data[4].substring(0, data[4].indexOf("/")) : data[4];
                    const name = _linux ? linuxName : data[4].substring(data[4].lastIndexOf("/") + 1);
                    procStats.push({
                      name,
                      pid: parseInt(data[0]) || 0,
                      ppid: parseInt(data[1]) || 0,
                      cpu: parseFloat(data[2].replace(",", ".")),
                      mem: parseFloat(data[3].replace(",", "."))
                    });
                  }
                });
                procStats.forEach((item) => {
                  let listPos = -1;
                  let inList = false;
                  let name = item.name;
                  for (let j = 0;j < result2.length; j++) {
                    if (item.name.toLowerCase().indexOf(result2[j].proc.toLowerCase()) >= 0) {
                      listPos = j;
                    }
                  }
                  processes2.forEach((proc2) => {
                    if (item.name.toLowerCase().indexOf(proc2.toLowerCase()) >= 0 && !inList) {
                      inList = true;
                      name = proc2;
                    }
                  });
                  if (processesString === "*" || inList) {
                    if (listPos < 0) {
                      if (name) {
                        result2.push({
                          proc: name,
                          pid: item.pid,
                          pids: [item.pid],
                          cpu: item.cpu,
                          mem: item.mem
                        });
                      }
                    } else {
                      if (item.ppid < 10) {
                        result2[listPos].pid = item.pid;
                      }
                      result2[listPos].pids.push(item.pid);
                      result2[listPos].cpu += item.cpu;
                      result2[listPos].mem += item.mem;
                    }
                  }
                });
                if (processesString !== "*") {
                  let processesMissing = processes2.filter((name) => {
                    return procStats.filter((item) => {
                      return item.name.toLowerCase().indexOf(name) >= 0;
                    }).length === 0;
                  });
                  processesMissing.forEach((procName) => {
                    result2.push({
                      proc: procName,
                      pid: null,
                      pids: [],
                      cpu: 0,
                      mem: 0
                    });
                  });
                }
                if (_linux) {
                  result2.forEach((item) => {
                    item.cpu = 0;
                  });
                  let cmd = 'cat /proc/stat | grep "cpu "';
                  for (let i in result2) {
                    for (let j in result2[i].pids) {
                      cmd += ";cat /proc/" + result2[i].pids[j] + "/stat";
                    }
                  }
                  exec(cmd, { maxBuffer: 1024 * 102400 }, (error2, stdout2) => {
                    let curr_processes = stdout2.toString().split(`
`);
                    let all = parseProcStat(curr_processes.shift());
                    let list_new = {};
                    let resultProcess = {};
                    curr_processes.forEach((element) => {
                      resultProcess = calcProcStatLinux(element, all, _process_cpu);
                      if (resultProcess.pid) {
                        let resultItemId = -1;
                        for (let i in result2) {
                          if (result2[i].pids.indexOf(resultProcess.pid) >= 0) {
                            resultItemId = i;
                          }
                        }
                        if (resultItemId >= 0) {
                          result2[resultItemId].cpu += resultProcess.cpuu + resultProcess.cpus;
                        }
                        list_new[resultProcess.pid] = {
                          cpuu: resultProcess.cpuu,
                          cpus: resultProcess.cpus,
                          utime: resultProcess.utime,
                          stime: resultProcess.stime,
                          cutime: resultProcess.cutime,
                          cstime: resultProcess.cstime
                        };
                      }
                    });
                    result2.forEach((item) => {
                      item.cpu = Math.round(item.cpu * 100) / 100;
                    });
                    _process_cpu.all = all;
                    _process_cpu.list = Object.assign({}, list_new);
                    _process_cpu.ms = Date.now() - _process_cpu.ms;
                    _process_cpu.result = Object.assign({}, result2);
                    if (callback) {
                      callback(result2);
                    }
                    resolve(result2);
                  });
                } else {
                  if (callback) {
                    callback(result2);
                  }
                  resolve(result2);
                }
              } else {
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              }
            });
          }
        }
      });
    });
  }
  exports.processLoad = processLoad;
});

// node_modules/systeminformation/lib/users.js
var require_users = __commonJS((exports) => {
  var exec = __require("child_process").exec;
  var util = require_util();
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  function parseDate(dtMon, dtDay) {
    let dt = new Date().toISOString().slice(0, 10);
    try {
      dt = "" + new Date().getFullYear() + "-" + ("0" + ("JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC".indexOf(dtMon.toUpperCase()) / 3 + 1)).slice(-2) + "-" + ("0" + dtDay).slice(-2);
      if (new Date(dt) > new Date) {
        dt = "" + (new Date().getFullYear() - 1) + "-" + ("0" + ("JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC".indexOf(dtMon.toUpperCase()) / 3 + 1)).slice(-2) + "-" + ("0" + dtDay).slice(-2);
      }
    } catch {
      util.noop();
    }
    return dt;
  }
  function parseUsersLinux(lines, phase) {
    const result2 = [];
    let result_who = [];
    const result_w = {};
    let w_first = true;
    let w_header = [];
    const w_pos = [];
    let who_line = {};
    let is_whopart = true;
    let is_whoerror = false;
    lines.forEach((line) => {
      if (line === "---") {
        is_whopart = false;
      } else {
        const l = line.replace(/ +/g, " ").split(" ");
        if (is_whopart) {
          if (line.toLowerCase().indexOf("unexpected") >= 0 || line.toLowerCase().indexOf("unrecognized") >= 0) {
            is_whoerror = true;
            result_who = [];
          }
          if (!is_whoerror) {
            const timePos = l && l.length > 4 && l[4].indexOf(":") > 0 ? 4 : 3;
            result_who.push({
              user: l[0],
              tty: l[1],
              date: timePos === 4 ? parseDate(l[2], l[3]) : l[2],
              time: l[timePos],
              ip: l && l.length > timePos + 1 ? l[timePos + 1].replace(/\(/g, "").replace(/\)/g, "") : "",
              command: ""
            });
          }
        } else {
          if (w_first) {
            if (line[0] !== " ") {
              w_header = l;
              w_header.forEach((item) => {
                w_pos.push(line.indexOf(item));
              });
              w_first = false;
            }
          } else {
            result_w.user = line.substring(w_pos[0], w_pos[1] - 1).trim();
            result_w.tty = line.substring(w_pos[1], w_pos[2] - 1).trim();
            result_w.ip = line.substring(w_pos[2], w_pos[3] - 1).replace(/\(/g, "").replace(/\)/g, "").trim();
            result_w.command = line.substring(w_pos[7], 1000).trim();
            if (result_who.length || phase === 1) {
              who_line = result_who.filter((obj) => {
                return obj.user.substring(0, 8).trim() === result_w.user && obj.tty === result_w.tty;
              });
            } else {
              who_line = [{ user: result_w.user, tty: result_w.tty, date: "", time: "", ip: "" }];
            }
            if (who_line.length === 1 && who_line[0].user !== "") {
              result2.push({
                user: who_line[0].user,
                tty: who_line[0].tty,
                date: who_line[0].date,
                time: who_line[0].time,
                ip: who_line[0].ip,
                command: result_w.command
              });
            }
          }
        }
      }
    });
    if (result2.length === 0 && phase === 2) {
      return result_who;
    } else {
      return result2;
    }
  }
  function parseUsersDarwin(lines) {
    const result2 = [];
    const result_who = [];
    const result_w = {};
    let who_line = {};
    let is_whopart = true;
    lines.forEach((line) => {
      if (line === "---") {
        is_whopart = false;
      } else {
        const l = line.replace(/ +/g, " ").split(" ");
        if (is_whopart) {
          result_who.push({
            user: l[0],
            tty: l[1],
            date: parseDate(l[2], l[3]),
            time: l[4]
          });
        } else {
          result_w.user = l[0];
          result_w.tty = l[1];
          result_w.ip = l[2] !== "-" ? l[2] : "";
          result_w.command = l.slice(5, 1000).join(" ");
          who_line = result_who.filter((obj) => obj.user.substring(0, 10) === result_w.user.substring(0, 10) && (obj.tty.substring(3, 1000) === result_w.tty || obj.tty === result_w.tty));
          if (who_line.length === 1) {
            result2.push({
              user: who_line[0].user,
              tty: who_line[0].tty,
              date: who_line[0].date,
              time: who_line[0].time,
              ip: result_w.ip,
              command: result_w.command
            });
          }
        }
      }
    });
    return result2;
  }
  function users(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = [];
        if (_linux) {
          exec('export LC_ALL=C; who --ips; echo "---"; w; unset LC_ALL | tail -n +2', (error2, stdout) => {
            if (!error2) {
              let lines = stdout.toString().split(`
`);
              result2 = parseUsersLinux(lines, 1);
              if (result2.length === 0) {
                exec('who; echo "---"; w | tail -n +2', (error3, stdout2) => {
                  if (!error3) {
                    lines = stdout2.toString().split(`
`);
                    result2 = parseUsersLinux(lines, 2);
                  }
                  if (callback) {
                    callback(result2);
                  }
                  resolve(result2);
                });
              } else {
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              }
            } else {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
          });
        }
        if (_freebsd || _openbsd || _netbsd) {
          exec('who; echo "---"; w -ih', (error2, stdout) => {
            if (!error2) {
              const lines = stdout.toString().split(`
`);
              result2 = parseUsersDarwin(lines);
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_sunos) {
          exec('who; echo "---"; w -h', (error2, stdout) => {
            if (!error2) {
              const lines = stdout.toString().split(`
`);
              result2 = parseUsersDarwin(lines);
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_darwin) {
          exec('export LC_ALL=C; who; echo "---"; w -ih; unset LC_ALL', (error2, stdout) => {
            if (!error2) {
              const lines = stdout.toString().split(`
`);
              result2 = parseUsersDarwin(lines);
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_windows) {
          try {
            let cmd = 'Get-CimInstance Win32_LogonSession | select LogonId,@{n="StartTime";e={$_.StartTime.ToString("yyyy-MM-dd HH:mm:ss")}} | fl' + "; echo '#-#-#-#';";
            cmd += "Get-CimInstance Win32_LoggedOnUser | select antecedent,dependent | fl " + "; echo '#-#-#-#';";
            cmd += `$process = (Get-CimInstance Win32_Process -Filter "name = 'explorer.exe'"); Invoke-CimMethod -InputObject $process[0] -MethodName GetOwner | select user, domain | fl; get-process -name explorer | select-object sessionid | fl; echo '#-#-#-#';`;
            cmd += "query user";
            util.powerShell(cmd).then((data) => {
              if (data) {
                data = data.split("#-#-#-#");
                const sessions = parseWinSessions((data[0] || "").split(/\n\s*\n/));
                const loggedons = parseWinLoggedOn((data[1] || "").split(/\n\s*\n/));
                const queryUser = parseWinUsersQuery((data[3] || "").split(`\r
`));
                const users2 = parseWinUsers((data[2] || "").split(/\n\s*\n/), queryUser);
                for (let id in loggedons) {
                  if ({}.hasOwnProperty.call(loggedons, id)) {
                    loggedons[id].dateTime = {}.hasOwnProperty.call(sessions, id) ? sessions[id] : "";
                  }
                }
                users2.forEach((user) => {
                  let dateTime = "";
                  for (let id in loggedons) {
                    if ({}.hasOwnProperty.call(loggedons, id)) {
                      if (loggedons[id].user === user.user && (!dateTime || dateTime < loggedons[id].dateTime)) {
                        dateTime = loggedons[id].dateTime;
                      }
                    }
                  }
                  result2.push({
                    user: user.user,
                    tty: user.tty,
                    date: `${dateTime.substring(0, 10)}`,
                    time: `${dateTime.substring(11, 19)}`,
                    ip: "",
                    command: ""
                  });
                });
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  function parseWinSessions(sessionParts) {
    const sessions = {};
    sessionParts.forEach((session) => {
      const lines = session.split(`\r
`);
      const id = util.getValue(lines, "LogonId");
      const starttime = util.getValue(lines, "starttime");
      if (id) {
        sessions[id] = starttime;
      }
    });
    return sessions;
  }
  function fuzzyMatch(name1, name2) {
    name1 = name1.toLowerCase();
    name2 = name2.toLowerCase();
    let eq = 0;
    let len = name1.length;
    if (name2.length > len) {
      len = name2.length;
    }
    for (let i = 0;i < len; i++) {
      const c1 = name1[i] || "";
      const c2 = name2[i] || "";
      if (c1 === c2) {
        eq++;
      }
    }
    return len > 10 ? eq / len > 0.9 : len > 0 ? eq / len > 0.8 : false;
  }
  function parseWinUsers(userParts, userQuery) {
    const users2 = [];
    userParts.forEach((user) => {
      const lines = user.split(`\r
`);
      const domain = util.getValue(lines, "domain", ":", true);
      const username = util.getValue(lines, "user", ":", true);
      const sessionid = util.getValue(lines, "sessionid", ":", true);
      if (username) {
        const quser = userQuery.filter((item) => fuzzyMatch(item.user, username));
        users2.push({
          domain,
          user: username,
          tty: quser && quser[0] && quser[0].tty ? quser[0].tty : sessionid
        });
      }
    });
    return users2;
  }
  function parseWinLoggedOn(loggedonParts) {
    const loggedons = {};
    loggedonParts.forEach((loggedon) => {
      const lines = loggedon.split(`\r
`);
      const antecendent = util.getValue(lines, "antecedent", ":", true);
      let parts = antecendent.split("=");
      const name = parts.length > 2 ? parts[1].split(",")[0].replace(/"/g, "").trim() : "";
      const domain = parts.length > 2 ? parts[2].replace(/"/g, "").replace(/\)/g, "").trim() : "";
      const dependent = util.getValue(lines, "dependent", ":", true);
      parts = dependent.split("=");
      const id = parts.length > 1 ? parts[1].replace(/"/g, "").replace(/\)/g, "").trim() : "";
      if (id) {
        loggedons[id] = {
          domain,
          user: name
        };
      }
    });
    return loggedons;
  }
  function parseWinUsersQuery(lines) {
    lines = lines.filter((item) => item);
    let result2 = [];
    const header = lines[0];
    const headerDelimiter = [];
    if (header) {
      const start = header[0] === " " ? 1 : 0;
      headerDelimiter.push(start - 1);
      let nextSpace = 0;
      for (let i = start + 1;i < header.length; i++) {
        if (header[i] === " " && (header[i - 1] === " " || header[i - 1] === ".")) {
          nextSpace = i;
        } else {
          if (nextSpace) {
            headerDelimiter.push(nextSpace);
            nextSpace = 0;
          }
        }
      }
      for (let i = 1;i < lines.length; i++) {
        if (lines[i].trim()) {
          const user = lines[i].substring(headerDelimiter[0] + 1, headerDelimiter[1]).trim() || "";
          const tty = lines[i].substring(headerDelimiter[1] + 1, headerDelimiter[2] - 2).trim() || "";
          result2.push({
            user,
            tty
          });
        }
      }
    }
    return result2;
  }
  exports.users = users;
});

// node_modules/systeminformation/lib/internet.js
var require_internet = __commonJS((exports) => {
  var util = require_util();
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  function inetChecksite(url, callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = {
          url,
          ok: false,
          status: 404,
          ms: null
        };
        if (typeof url !== "string") {
          if (callback) {
            callback(result2);
          }
          return resolve(result2);
        }
        let urlSanitized = "";
        const s = util.sanitizeShellString(url, true);
        const l = util.mathMin(s.length, 2000);
        for (let i = 0;i <= l; i++) {
          if (s[i] !== undefined) {
            try {
              s[i].__proto__.toLowerCase = util.stringToLower;
            } catch {
              Object.setPrototypeOf(s[i], util.stringObj);
            }
            const sl = s[i].toLowerCase();
            if (sl && sl[0] && !sl[1] && sl[0].length === 1) {
              urlSanitized = urlSanitized + sl[0];
            }
          }
        }
        result2.url = urlSanitized;
        try {
          if (urlSanitized && !util.isPrototypePolluted()) {
            try {
              urlSanitized.__proto__.startsWith = util.stringStartWith;
            } catch {
              Object.setPrototypeOf(urlSanitized, util.stringObj);
            }
            if (urlSanitized.startsWith("file:") || urlSanitized.startsWith("gopher:") || urlSanitized.startsWith("telnet:") || urlSanitized.startsWith("mailto:") || urlSanitized.startsWith("news:") || urlSanitized.startsWith("nntp:")) {
              if (callback) {
                callback(result2);
              }
              return resolve(result2);
            }
            util.checkWebsite(urlSanitized).then((res) => {
              result2.status = res.statusCode;
              result2.ok = res.statusCode >= 200 && res.statusCode <= 399;
              result2.ms = result2.ok ? res.time : null;
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } else {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        } catch {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
      });
    });
  }
  exports.inetChecksite = inetChecksite;
  function inetLatency(host, callback) {
    if (util.isFunction(host) && !callback) {
      callback = host;
      host = "";
    }
    host = host || "8.8.8.8";
    return new Promise((resolve) => {
      process.nextTick(() => {
        if (typeof host !== "string") {
          if (callback) {
            callback(null);
          }
          return resolve(null);
        }
        let hostSanitized = "";
        const s = (util.isPrototypePolluted() ? "8.8.8.8" : util.sanitizeShellString(host, true)).trim();
        const l = util.mathMin(s.length, 2000);
        for (let i = 0;i <= l; i++) {
          if (!(s[i] === undefined)) {
            try {
              s[i].__proto__.toLowerCase = util.stringToLower;
            } catch {
              Object.setPrototypeOf(s[i], util.stringObj);
            }
            const sl = s[i].toLowerCase();
            if (sl && sl[0] && !sl[1]) {
              hostSanitized = hostSanitized + sl[0];
            }
          }
        }
        try {
          hostSanitized.__proto__.startsWith = util.stringStartWith;
        } catch {
          Object.setPrototypeOf(hostSanitized, util.stringObj);
        }
        if (hostSanitized.startsWith("file:") || hostSanitized.startsWith("gopher:") || hostSanitized.startsWith("telnet:") || hostSanitized.startsWith("mailto:") || hostSanitized.startsWith("news:") || hostSanitized.startsWith("nntp:")) {
          if (callback) {
            callback(null);
          }
          return resolve(null);
        }
        let params;
        if (_linux || _freebsd || _openbsd || _netbsd || _darwin) {
          if (_linux) {
            params = ["-c", "2", "-w", "3", hostSanitized];
          }
          if (_freebsd || _openbsd || _netbsd) {
            params = ["-c", "2", "-t", "3", hostSanitized];
          }
          if (_darwin) {
            params = ["-c2", "-t3", hostSanitized];
          }
          util.execSafe("ping", params).then((stdout) => {
            let result2 = null;
            if (stdout) {
              const lines = stdout.split(`
`).filter((line2) => line2.indexOf("rtt") >= 0 || line2.indexOf("round-trip") >= 0 || line2.indexOf("avg") >= 0).join(`
`);
              const line = lines.split("=");
              if (line.length > 1) {
                const parts = line[1].split("/");
                if (parts.length > 1) {
                  result2 = parseFloat(parts[1]);
                }
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_sunos) {
          const params2 = ["-s", "-a", hostSanitized, "56", "2"];
          const filt = "avg";
          util.execSafe("ping", params2, { timeout: 3000 }).then((stdout) => {
            let result2 = null;
            if (stdout) {
              const lines = stdout.split(`
`).filter((line2) => line2.indexOf(filt) >= 0).join(`
`);
              const line = lines.split("=");
              if (line.length > 1) {
                const parts = line[1].split("/");
                if (parts.length > 1) {
                  result2 = parseFloat(parts[1].replace(",", "."));
                }
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_windows) {
          let result2 = null;
          try {
            const params2 = [hostSanitized, "-n", "1"];
            util.execSafe("ping", params2, util.execOptsWin).then((stdout) => {
              if (stdout) {
                const lines = stdout.split(`\r
`);
                lines.shift();
                lines.forEach((line) => {
                  if ((line.toLowerCase().match(/ms/g) || []).length === 3) {
                    let l2 = line.replace(/ +/g, " ").split(" ");
                    if (l2.length > 6) {
                      result2 = parseFloat(l2[l2.length - 1]);
                    }
                  }
                });
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            });
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  exports.inetLatency = inetLatency;
});

// node_modules/systeminformation/lib/dockerSocket.js
var require_dockerSocket = __commonJS((exports, module) => {
  var net = __require("net");
  var isWin = __require("os").type() === "Windows_NT";
  var socketPath = isWin ? "//./pipe/docker_engine" : "/var/run/docker.sock";

  class DockerSocket {
    getInfo(callback) {
      try {
        let socket = net.createConnection({ path: socketPath });
        let alldata = "";
        let data;
        socket.on("connect", () => {
          socket.write(`GET http:/info HTTP/1.0\r
\r
`);
        });
        socket.on("data", (data2) => {
          alldata = alldata + data2.toString();
        });
        socket.on("error", () => {
          socket = false;
          callback({});
        });
        socket.on("end", () => {
          const startbody = alldata.indexOf(`\r
\r
`);
          alldata = alldata.substring(startbody + 4);
          socket = false;
          try {
            data = JSON.parse(alldata);
            callback(data);
          } catch {
            callback({});
          }
        });
      } catch {
        callback({});
      }
    }
    listImages(all, callback) {
      try {
        let socket = net.createConnection({ path: socketPath });
        let alldata = "";
        let data;
        socket.on("connect", () => {
          socket.write("GET http:/images/json" + (all ? "?all=1" : "") + ` HTTP/1.0\r
\r
`);
        });
        socket.on("data", (data2) => {
          alldata = alldata + data2.toString();
        });
        socket.on("error", () => {
          socket = false;
          callback({});
        });
        socket.on("end", () => {
          const startbody = alldata.indexOf(`\r
\r
`);
          alldata = alldata.substring(startbody + 4);
          socket = false;
          try {
            data = JSON.parse(alldata);
            callback(data);
          } catch {
            callback({});
          }
        });
      } catch {
        callback({});
      }
    }
    inspectImage(id, callback) {
      id = id || "";
      if (id) {
        try {
          let socket = net.createConnection({ path: socketPath });
          let alldata = "";
          let data;
          socket.on("connect", () => {
            socket.write("GET http:/images/" + id + `/json?stream=0 HTTP/1.0\r
\r
`);
          });
          socket.on("data", (data2) => {
            alldata = alldata + data2.toString();
          });
          socket.on("error", () => {
            socket = false;
            callback({});
          });
          socket.on("end", () => {
            const startbody = alldata.indexOf(`\r
\r
`);
            alldata = alldata.substring(startbody + 4);
            socket = false;
            try {
              data = JSON.parse(alldata);
              callback(data);
            } catch {
              callback({});
            }
          });
        } catch {
          callback({});
        }
      } else {
        callback({});
      }
    }
    listContainers(all, callback) {
      try {
        let socket = net.createConnection({ path: socketPath });
        let alldata = "";
        let data;
        socket.on("connect", () => {
          socket.write("GET http:/containers/json" + (all ? "?all=1" : "") + ` HTTP/1.0\r
\r
`);
        });
        socket.on("data", (data2) => {
          alldata = alldata + data2.toString();
        });
        socket.on("error", () => {
          socket = false;
          callback({});
        });
        socket.on("end", () => {
          const startbody = alldata.indexOf(`\r
\r
`);
          alldata = alldata.substring(startbody + 4);
          socket = false;
          try {
            data = JSON.parse(alldata);
            callback(data);
          } catch {
            callback({});
          }
        });
      } catch {
        callback({});
      }
    }
    getStats(id, callback) {
      id = id || "";
      if (id) {
        try {
          let socket = net.createConnection({ path: socketPath });
          let alldata = "";
          let data;
          socket.on("connect", () => {
            socket.write("GET http:/containers/" + id + `/stats?stream=0 HTTP/1.0\r
\r
`);
          });
          socket.on("data", (data2) => {
            alldata = alldata + data2.toString();
          });
          socket.on("error", () => {
            socket = false;
            callback({});
          });
          socket.on("end", () => {
            const startbody = alldata.indexOf(`\r
\r
`);
            alldata = alldata.substring(startbody + 4);
            socket = false;
            try {
              data = JSON.parse(alldata);
              callback(data);
            } catch {
              callback({});
            }
          });
        } catch {
          callback({});
        }
      } else {
        callback({});
      }
    }
    getInspect(id, callback) {
      id = id || "";
      if (id) {
        try {
          let socket = net.createConnection({ path: socketPath });
          let alldata = "";
          let data;
          socket.on("connect", () => {
            socket.write("GET http:/containers/" + id + `/json?stream=0 HTTP/1.0\r
\r
`);
          });
          socket.on("data", (data2) => {
            alldata = alldata + data2.toString();
          });
          socket.on("error", () => {
            socket = false;
            callback({});
          });
          socket.on("end", () => {
            const startbody = alldata.indexOf(`\r
\r
`);
            alldata = alldata.substring(startbody + 4);
            socket = false;
            try {
              data = JSON.parse(alldata);
              callback(data);
            } catch {
              callback({});
            }
          });
        } catch {
          callback({});
        }
      } else {
        callback({});
      }
    }
    getProcesses(id, callback) {
      id = id || "";
      if (id) {
        try {
          let socket = net.createConnection({ path: socketPath });
          let alldata = "";
          let data;
          socket.on("connect", () => {
            socket.write("GET http:/containers/" + id + `/top?ps_args=-opid,ppid,pgid,vsz,time,etime,nice,ruser,user,rgroup,group,stat,rss,args HTTP/1.0\r
\r
`);
          });
          socket.on("data", (data2) => {
            alldata = alldata + data2.toString();
          });
          socket.on("error", () => {
            socket = false;
            callback({});
          });
          socket.on("end", () => {
            const startbody = alldata.indexOf(`\r
\r
`);
            alldata = alldata.substring(startbody + 4);
            socket = false;
            try {
              data = JSON.parse(alldata);
              callback(data);
            } catch {
              callback({});
            }
          });
        } catch {
          callback({});
        }
      } else {
        callback({});
      }
    }
    listVolumes(callback) {
      try {
        let socket = net.createConnection({ path: socketPath });
        let alldata = "";
        let data;
        socket.on("connect", () => {
          socket.write(`GET http:/volumes HTTP/1.0\r
\r
`);
        });
        socket.on("data", (data2) => {
          alldata = alldata + data2.toString();
        });
        socket.on("error", () => {
          socket = false;
          callback({});
        });
        socket.on("end", () => {
          const startbody = alldata.indexOf(`\r
\r
`);
          alldata = alldata.substring(startbody + 4);
          socket = false;
          try {
            data = JSON.parse(alldata);
            callback(data);
          } catch {
            callback({});
          }
        });
      } catch {
        callback({});
      }
    }
  }
  module.exports = DockerSocket;
});

// node_modules/systeminformation/lib/docker.js
var require_docker = __commonJS((exports) => {
  var util = require_util();
  var DockerSocket = require_dockerSocket();
  var _platform = process.platform;
  var _windows = _platform === "win32";
  var _docker_container_stats = {};
  var _docker_socket;
  var _docker_last_read = 0;
  function dockerInfo(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        if (!_docker_socket) {
          _docker_socket = new DockerSocket;
        }
        const result2 = {};
        _docker_socket.getInfo((data) => {
          result2.id = data.ID;
          result2.containers = data.Containers;
          result2.containersRunning = data.ContainersRunning;
          result2.containersPaused = data.ContainersPaused;
          result2.containersStopped = data.ContainersStopped;
          result2.images = data.Images;
          result2.driver = data.Driver;
          result2.memoryLimit = data.MemoryLimit;
          result2.swapLimit = data.SwapLimit;
          result2.kernelMemory = data.KernelMemory;
          result2.cpuCfsPeriod = data.CpuCfsPeriod;
          result2.cpuCfsQuota = data.CpuCfsQuota;
          result2.cpuShares = data.CPUShares;
          result2.cpuSet = data.CPUSet;
          result2.ipv4Forwarding = data.IPv4Forwarding;
          result2.bridgeNfIptables = data.BridgeNfIptables;
          result2.bridgeNfIp6tables = data.BridgeNfIp6tables;
          result2.debug = data.Debug;
          result2.nfd = data.NFd;
          result2.oomKillDisable = data.OomKillDisable;
          result2.ngoroutines = data.NGoroutines;
          result2.systemTime = data.SystemTime;
          result2.loggingDriver = data.LoggingDriver;
          result2.cgroupDriver = data.CgroupDriver;
          result2.nEventsListener = data.NEventsListener;
          result2.kernelVersion = data.KernelVersion;
          result2.operatingSystem = data.OperatingSystem;
          result2.osType = data.OSType;
          result2.architecture = data.Architecture;
          result2.ncpu = data.NCPU;
          result2.memTotal = data.MemTotal;
          result2.dockerRootDir = data.DockerRootDir;
          result2.httpProxy = data.HttpProxy;
          result2.httpsProxy = data.HttpsProxy;
          result2.noProxy = data.NoProxy;
          result2.name = data.Name;
          result2.labels = data.Labels;
          result2.experimentalBuild = data.ExperimentalBuild;
          result2.serverVersion = data.ServerVersion;
          result2.clusterStore = data.ClusterStore;
          result2.clusterAdvertise = data.ClusterAdvertise;
          result2.defaultRuntime = data.DefaultRuntime;
          result2.liveRestoreEnabled = data.LiveRestoreEnabled;
          result2.isolation = data.Isolation;
          result2.initBinary = data.InitBinary;
          result2.productLicense = data.ProductLicense;
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        });
      });
    });
  }
  exports.dockerInfo = dockerInfo;
  function dockerImages(all, callback) {
    if (util.isFunction(all) && !callback) {
      callback = all;
      all = false;
    }
    if (typeof all === "string" && all === "true") {
      all = true;
    }
    if (typeof all !== "boolean" && all !== undefined) {
      all = false;
    }
    all = all || false;
    let result2 = [];
    return new Promise((resolve) => {
      process.nextTick(() => {
        if (!_docker_socket) {
          _docker_socket = new DockerSocket;
        }
        const workload = [];
        _docker_socket.listImages(all, (data) => {
          let dockerImages2 = {};
          try {
            dockerImages2 = data;
            if (dockerImages2 && Object.prototype.toString.call(dockerImages2) === "[object Array]" && dockerImages2.length > 0) {
              dockerImages2.forEach((element) => {
                if (element.Names && Object.prototype.toString.call(element.Names) === "[object Array]" && element.Names.length > 0) {
                  element.Name = element.Names[0].replace(/^\/|\/$/g, "");
                }
                workload.push(dockerImagesInspect(element.Id.trim(), element));
              });
              if (workload.length) {
                Promise.all(workload).then((data2) => {
                  if (callback) {
                    callback(data2);
                  }
                  resolve(data2);
                });
              } else {
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              }
            } else {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        });
      });
    });
  }
  function dockerImagesInspect(imageID, payload) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        imageID = imageID || "";
        if (typeof imageID !== "string") {
          return resolve();
        }
        const imageIDSanitized = (util.isPrototypePolluted() ? "" : util.sanitizeShellString(imageID, true)).trim();
        if (imageIDSanitized) {
          if (!_docker_socket) {
            _docker_socket = new DockerSocket;
          }
          _docker_socket.inspectImage(imageIDSanitized.trim(), (data) => {
            try {
              resolve({
                id: payload.Id,
                container: data.Container,
                comment: data.Comment,
                os: data.Os,
                architecture: data.Architecture,
                parent: data.Parent,
                dockerVersion: data.DockerVersion,
                size: data.Size,
                sharedSize: payload.SharedSize,
                virtualSize: data.VirtualSize,
                author: data.Author,
                created: data.Created ? Math.round(new Date(data.Created).getTime() / 1000) : 0,
                containerConfig: data.ContainerConfig ? data.ContainerConfig : {},
                graphDriver: data.GraphDriver ? data.GraphDriver : {},
                repoDigests: data.RepoDigests ? data.RepoDigests : {},
                repoTags: data.RepoTags ? data.RepoTags : {},
                config: data.Config ? data.Config : {},
                rootFS: data.RootFS ? data.RootFS : {}
              });
            } catch {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    });
  }
  exports.dockerImages = dockerImages;
  function dockerContainers(all, callback) {
    function inContainers(containers, id) {
      const filtered = containers.filter((obj) => {
        return obj.Id && obj.Id === id;
      });
      return filtered.length > 0;
    }
    if (util.isFunction(all) && !callback) {
      callback = all;
      all = false;
    }
    if (typeof all === "string" && all === "true") {
      all = true;
    }
    if (typeof all !== "boolean" && all !== undefined) {
      all = false;
    }
    all = all || false;
    let result2 = [];
    return new Promise((resolve) => {
      process.nextTick(() => {
        if (!_docker_socket) {
          _docker_socket = new DockerSocket;
        }
        const workload = [];
        _docker_socket.listContainers(all, (data) => {
          let docker_containers = {};
          try {
            docker_containers = data;
            if (docker_containers && Object.prototype.toString.call(docker_containers) === "[object Array]" && docker_containers.length > 0) {
              for (let key in _docker_container_stats) {
                if ({}.hasOwnProperty.call(_docker_container_stats, key)) {
                  if (!inContainers(docker_containers, key)) {
                    delete _docker_container_stats[key];
                  }
                }
              }
              docker_containers.forEach((element) => {
                if (element.Names && Object.prototype.toString.call(element.Names) === "[object Array]" && element.Names.length > 0) {
                  element.Name = element.Names[0].replace(/^\/|\/$/g, "");
                }
                workload.push(dockerContainerInspect(element.Id.trim(), element));
              });
              if (workload.length) {
                Promise.all(workload).then((data2) => {
                  if (callback) {
                    callback(data2);
                  }
                  resolve(data2);
                });
              } else {
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              }
            } else {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
          } catch (err) {
            for (let key in _docker_container_stats) {
              if ({}.hasOwnProperty.call(_docker_container_stats, key)) {
                if (!inContainers(docker_containers, key)) {
                  delete _docker_container_stats[key];
                }
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        });
      });
    });
  }
  function dockerContainerInspect(containerID, payload) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        containerID = containerID || "";
        if (typeof containerID !== "string") {
          return resolve();
        }
        const containerIdSanitized = (util.isPrototypePolluted() ? "" : util.sanitizeShellString(containerID, true)).trim();
        if (containerIdSanitized) {
          if (!_docker_socket) {
            _docker_socket = new DockerSocket;
          }
          _docker_socket.getInspect(containerIdSanitized.trim(), (data) => {
            try {
              resolve({
                id: payload.Id,
                name: payload.Name,
                image: payload.Image,
                imageID: payload.ImageID,
                command: payload.Command,
                created: payload.Created,
                started: data.State && data.State.StartedAt ? Math.round(new Date(data.State.StartedAt).getTime() / 1000) : 0,
                finished: data.State && data.State.FinishedAt && !data.State.FinishedAt.startsWith("0001-01-01") ? Math.round(new Date(data.State.FinishedAt).getTime() / 1000) : 0,
                createdAt: data.Created ? data.Created : "",
                startedAt: data.State && data.State.StartedAt ? data.State.StartedAt : "",
                finishedAt: data.State && data.State.FinishedAt && !data.State.FinishedAt.startsWith("0001-01-01") ? data.State.FinishedAt : "",
                state: payload.State,
                restartCount: data.RestartCount || 0,
                platform: data.Platform || "",
                driver: data.Driver || "",
                ports: payload.Ports,
                mounts: payload.Mounts
              });
            } catch {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    });
  }
  exports.dockerContainers = dockerContainers;
  function docker_calcCPUPercent(cpu_stats, precpu_stats) {
    if (!_windows) {
      let cpuPercent = 0;
      let cpuDelta = cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage;
      let systemDelta = cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage;
      if (systemDelta > 0 && cpuDelta > 0) {
        if (precpu_stats.online_cpus) {
          cpuPercent = cpuDelta / systemDelta * precpu_stats.online_cpus * 100;
        } else {
          cpuPercent = cpuDelta / systemDelta * cpu_stats.cpu_usage.percpu_usage.length * 100;
        }
      }
      return cpuPercent;
    } else {
      let nanoSecNow = util.nanoSeconds();
      let cpuPercent = 0;
      if (_docker_last_read > 0) {
        let possIntervals = nanoSecNow - _docker_last_read;
        let intervalsUsed = cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage;
        if (possIntervals > 0) {
          cpuPercent = 100 * intervalsUsed / possIntervals;
        }
      }
      _docker_last_read = nanoSecNow;
      return cpuPercent;
    }
  }
  function docker_calcNetworkIO(networks) {
    let rx;
    let wx;
    for (let key in networks) {
      if (!{}.hasOwnProperty.call(networks, key)) {
        continue;
      }
      const obj = networks[key];
      rx = +obj.rx_bytes;
      wx = +obj.tx_bytes;
    }
    return {
      rx,
      wx
    };
  }
  function docker_calcBlockIO(blkio_stats) {
    let result2 = {
      r: 0,
      w: 0
    };
    if (blkio_stats && blkio_stats.io_service_bytes_recursive && Object.prototype.toString.call(blkio_stats.io_service_bytes_recursive) === "[object Array]" && blkio_stats.io_service_bytes_recursive.length > 0) {
      blkio_stats.io_service_bytes_recursive.forEach((element) => {
        if (element.op && element.op.toLowerCase() === "read" && element.value) {
          result2.r += element.value;
        }
        if (element.op && element.op.toLowerCase() === "write" && element.value) {
          result2.w += element.value;
        }
      });
    }
    return result2;
  }
  function dockerContainerStats(containerIDs, callback) {
    let containerArray = [];
    return new Promise((resolve) => {
      process.nextTick(() => {
        if (util.isFunction(containerIDs) && !callback) {
          callback = containerIDs;
          containerArray = ["*"];
        } else {
          containerIDs = containerIDs || "*";
          if (typeof containerIDs !== "string") {
            if (callback) {
              callback([]);
            }
            return resolve([]);
          }
          let containerIDsSanitized = "";
          try {
            containerIDsSanitized.__proto__.toLowerCase = util.stringToLower;
            containerIDsSanitized.__proto__.replace = util.stringReplace;
            containerIDsSanitized.__proto__.toString = util.stringToString;
            containerIDsSanitized.__proto__.substr = util.stringSubstr;
            containerIDsSanitized.__proto__.substring = util.stringSubstring;
            containerIDsSanitized.__proto__.trim = util.stringTrim;
            containerIDsSanitized.__proto__.startsWith = util.stringStartWith;
          } catch (e) {
            Object.setPrototypeOf(containerIDsSanitized, util.stringObj);
          }
          containerIDsSanitized = containerIDs;
          containerIDsSanitized = containerIDsSanitized.trim();
          if (containerIDsSanitized !== "*") {
            containerIDsSanitized = "";
            const s = (util.isPrototypePolluted() ? "" : util.sanitizeShellString(containerIDs, true)).trim();
            const l = util.mathMin(s.length, 2000);
            for (let i = 0;i <= l; i++) {
              if (s[i] !== undefined) {
                s[i].__proto__.toLowerCase = util.stringToLower;
                const sl = s[i].toLowerCase();
                if (sl && sl[0] && !sl[1]) {
                  containerIDsSanitized = containerIDsSanitized + sl[0];
                }
              }
            }
          }
          containerIDsSanitized = containerIDsSanitized.trim().toLowerCase().replace(/,+/g, "|");
          containerArray = containerIDsSanitized.split("|");
        }
        const result2 = [];
        const workload = [];
        if (containerArray.length && containerArray[0].trim() === "*") {
          containerArray = [];
          dockerContainers().then((allContainers) => {
            for (let container of allContainers) {
              containerArray.push(container.id.substring(0, 12));
            }
            if (containerArray.length) {
              dockerContainerStats(containerArray.join(",")).then((result3) => {
                if (callback) {
                  callback(result3);
                }
                resolve(result3);
              });
            } else {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
          });
        } else {
          for (let containerID of containerArray) {
            workload.push(dockerContainerStatsSingle(containerID.trim()));
          }
          if (workload.length) {
            Promise.all(workload).then((data) => {
              if (callback) {
                callback(data);
              }
              resolve(data);
            });
          } else {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        }
      });
    });
  }
  function dockerContainerStatsSingle(containerID) {
    containerID = containerID || "";
    const result2 = {
      id: containerID,
      memUsage: 0,
      memLimit: 0,
      memPercent: 0,
      cpuPercent: 0,
      pids: 0,
      netIO: {
        rx: 0,
        wx: 0
      },
      blockIO: {
        r: 0,
        w: 0
      },
      restartCount: 0,
      cpuStats: {},
      precpuStats: {},
      memoryStats: {},
      networks: {}
    };
    return new Promise((resolve) => {
      process.nextTick(() => {
        if (containerID) {
          if (!_docker_socket) {
            _docker_socket = new DockerSocket;
          }
          _docker_socket.getInspect(containerID, (dataInspect) => {
            try {
              _docker_socket.getStats(containerID, (data) => {
                try {
                  let stats = data;
                  if (!stats.message) {
                    if (data.id) {
                      result2.id = data.id;
                    }
                    result2.memUsage = stats.memory_stats && stats.memory_stats.usage ? stats.memory_stats.usage : 0;
                    result2.memLimit = stats.memory_stats && stats.memory_stats.limit ? stats.memory_stats.limit : 0;
                    result2.memPercent = stats.memory_stats && stats.memory_stats.usage && stats.memory_stats.limit ? stats.memory_stats.usage / stats.memory_stats.limit * 100 : 0;
                    result2.cpuPercent = stats.cpu_stats && stats.precpu_stats ? docker_calcCPUPercent(stats.cpu_stats, stats.precpu_stats) : 0;
                    result2.pids = stats.pids_stats && stats.pids_stats.current ? stats.pids_stats.current : 0;
                    result2.restartCount = dataInspect.RestartCount ? dataInspect.RestartCount : 0;
                    if (stats.networks) {
                      result2.netIO = docker_calcNetworkIO(stats.networks);
                    }
                    if (stats.blkio_stats) {
                      result2.blockIO = docker_calcBlockIO(stats.blkio_stats);
                    }
                    result2.cpuStats = stats.cpu_stats ? stats.cpu_stats : {};
                    result2.precpuStats = stats.precpu_stats ? stats.precpu_stats : {};
                    result2.memoryStats = stats.memory_stats ? stats.memory_stats : {};
                    result2.networks = stats.networks ? stats.networks : {};
                  }
                } catch {
                  util.noop();
                }
                resolve(result2);
              });
            } catch {
              util.noop();
            }
          });
        } else {
          resolve(result2);
        }
      });
    });
  }
  exports.dockerContainerStats = dockerContainerStats;
  function dockerContainerProcesses(containerID, callback) {
    let result2 = [];
    return new Promise((resolve) => {
      process.nextTick(() => {
        containerID = containerID || "";
        if (typeof containerID !== "string") {
          return resolve(result2);
        }
        const containerIdSanitized = (util.isPrototypePolluted() ? "" : util.sanitizeShellString(containerID, true)).trim();
        if (containerIdSanitized) {
          if (!_docker_socket) {
            _docker_socket = new DockerSocket;
          }
          _docker_socket.getProcesses(containerIdSanitized, (data) => {
            try {
              if (data && data.Titles && data.Processes) {
                let titles = data.Titles.map(function(value) {
                  return value.toUpperCase();
                });
                let pos_pid = titles.indexOf("PID");
                let pos_ppid = titles.indexOf("PPID");
                let pos_pgid = titles.indexOf("PGID");
                let pos_vsz = titles.indexOf("VSZ");
                let pos_time = titles.indexOf("TIME");
                let pos_elapsed = titles.indexOf("ELAPSED");
                let pos_ni = titles.indexOf("NI");
                let pos_ruser = titles.indexOf("RUSER");
                let pos_user = titles.indexOf("USER");
                let pos_rgroup = titles.indexOf("RGROUP");
                let pos_group = titles.indexOf("GROUP");
                let pos_stat = titles.indexOf("STAT");
                let pos_rss = titles.indexOf("RSS");
                let pos_command = titles.indexOf("COMMAND");
                data.Processes.forEach((process2) => {
                  result2.push({
                    pidHost: pos_pid >= 0 ? process2[pos_pid] : "",
                    ppid: pos_ppid >= 0 ? process2[pos_ppid] : "",
                    pgid: pos_pgid >= 0 ? process2[pos_pgid] : "",
                    user: pos_user >= 0 ? process2[pos_user] : "",
                    ruser: pos_ruser >= 0 ? process2[pos_ruser] : "",
                    group: pos_group >= 0 ? process2[pos_group] : "",
                    rgroup: pos_rgroup >= 0 ? process2[pos_rgroup] : "",
                    stat: pos_stat >= 0 ? process2[pos_stat] : "",
                    time: pos_time >= 0 ? process2[pos_time] : "",
                    elapsed: pos_elapsed >= 0 ? process2[pos_elapsed] : "",
                    nice: pos_ni >= 0 ? process2[pos_ni] : "",
                    rss: pos_rss >= 0 ? process2[pos_rss] : "",
                    vsz: pos_vsz >= 0 ? process2[pos_vsz] : "",
                    command: pos_command >= 0 ? process2[pos_command] : ""
                  });
                });
              }
            } catch {
              util.noop();
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        } else {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
      });
    });
  }
  exports.dockerContainerProcesses = dockerContainerProcesses;
  function dockerVolumes(callback) {
    let result2 = [];
    return new Promise((resolve) => {
      process.nextTick(() => {
        if (!_docker_socket) {
          _docker_socket = new DockerSocket;
        }
        _docker_socket.listVolumes((data) => {
          let dockerVolumes2 = {};
          try {
            dockerVolumes2 = data;
            if (dockerVolumes2 && dockerVolumes2.Volumes && Object.prototype.toString.call(dockerVolumes2.Volumes) === "[object Array]" && dockerVolumes2.Volumes.length > 0) {
              dockerVolumes2.Volumes.forEach((element) => {
                result2.push({
                  name: element.Name,
                  driver: element.Driver,
                  labels: element.Labels,
                  mountpoint: element.Mountpoint,
                  options: element.Options,
                  scope: element.Scope,
                  created: element.CreatedAt ? Math.round(new Date(element.CreatedAt).getTime() / 1000) : 0
                });
              });
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            } else {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
          } catch {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        });
      });
    });
  }
  exports.dockerVolumes = dockerVolumes;
  function dockerAll(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        dockerContainers(true).then((result2) => {
          if (result2 && Object.prototype.toString.call(result2) === "[object Array]" && result2.length > 0) {
            let l = result2.length;
            result2.forEach((element) => {
              dockerContainerStats(element.id).then((res) => {
                element.memUsage = res[0].memUsage;
                element.memLimit = res[0].memLimit;
                element.memPercent = res[0].memPercent;
                element.cpuPercent = res[0].cpuPercent;
                element.pids = res[0].pids;
                element.netIO = res[0].netIO;
                element.blockIO = res[0].blockIO;
                element.cpuStats = res[0].cpuStats;
                element.precpuStats = res[0].precpuStats;
                element.memoryStats = res[0].memoryStats;
                element.networks = res[0].networks;
                dockerContainerProcesses(element.id).then((processes) => {
                  element.processes = processes;
                  l -= 1;
                  if (l === 0) {
                    if (callback) {
                      callback(result2);
                    }
                    resolve(result2);
                  }
                });
              });
            });
          } else {
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          }
        });
      });
    });
  }
  exports.dockerAll = dockerAll;
});

// node_modules/systeminformation/lib/virtualbox.js
var require_virtualbox = __commonJS((exports) => {
  var os = __require("os");
  var exec = __require("child_process").exec;
  var util = require_util();
  function vboxInfo(callback) {
    let result2 = [];
    return new Promise((resolve) => {
      process.nextTick(() => {
        try {
          exec(util.getVboxmanage() + " list vms --long", (error2, stdout) => {
            let parts = (os.EOL + stdout.toString()).split(os.EOL + "Name:");
            parts.shift();
            parts.forEach((part) => {
              const lines = ("Name:" + part).split(os.EOL);
              const state = util.getValue(lines, "State");
              const running = state.startsWith("running");
              const runningSinceString = running ? state.replace("running (since ", "").replace(")", "").trim() : "";
              let runningSince = 0;
              try {
                if (running) {
                  const sinceDateObj = new Date(runningSinceString);
                  const offset = sinceDateObj.getTimezoneOffset();
                  runningSince = Math.round((Date.now() - Date.parse(sinceDateObj)) / 1000) + offset * 60;
                }
              } catch {
                util.noop();
              }
              const stoppedSinceString = !running ? state.replace("powered off (since", "").replace(")", "").trim() : "";
              let stoppedSince = 0;
              try {
                if (!running) {
                  const sinceDateObj = new Date(stoppedSinceString);
                  const offset = sinceDateObj.getTimezoneOffset();
                  stoppedSince = Math.round((Date.now() - Date.parse(sinceDateObj)) / 1000) + offset * 60;
                }
              } catch {
                util.noop();
              }
              result2.push({
                id: util.getValue(lines, "UUID"),
                name: util.getValue(lines, "Name"),
                running,
                started: runningSinceString,
                runningSince,
                stopped: stoppedSinceString,
                stoppedSince,
                guestOS: util.getValue(lines, "Guest OS"),
                hardwareUUID: util.getValue(lines, "Hardware UUID"),
                memory: parseInt(util.getValue(lines, "Memory size", "     "), 10),
                vram: parseInt(util.getValue(lines, "VRAM size"), 10),
                cpus: parseInt(util.getValue(lines, "Number of CPUs"), 10),
                cpuExepCap: util.getValue(lines, "CPU exec cap"),
                cpuProfile: util.getValue(lines, "CPUProfile"),
                chipset: util.getValue(lines, "Chipset"),
                firmware: util.getValue(lines, "Firmware"),
                pageFusion: util.getValue(lines, "Page Fusion") === "enabled",
                configFile: util.getValue(lines, "Config file"),
                snapshotFolder: util.getValue(lines, "Snapshot folder"),
                logFolder: util.getValue(lines, "Log folder"),
                hpet: util.getValue(lines, "HPET") === "enabled",
                pae: util.getValue(lines, "PAE") === "enabled",
                longMode: util.getValue(lines, "Long Mode") === "enabled",
                tripleFaultReset: util.getValue(lines, "Triple Fault Reset") === "enabled",
                apic: util.getValue(lines, "APIC") === "enabled",
                x2Apic: util.getValue(lines, "X2APIC") === "enabled",
                acpi: util.getValue(lines, "ACPI") === "enabled",
                ioApic: util.getValue(lines, "IOAPIC") === "enabled",
                biosApicMode: util.getValue(lines, "BIOS APIC mode"),
                bootMenuMode: util.getValue(lines, "Boot menu mode"),
                bootDevice1: util.getValue(lines, "Boot Device 1"),
                bootDevice2: util.getValue(lines, "Boot Device 2"),
                bootDevice3: util.getValue(lines, "Boot Device 3"),
                bootDevice4: util.getValue(lines, "Boot Device 4"),
                timeOffset: util.getValue(lines, "Time offset"),
                rtc: util.getValue(lines, "RTC")
              });
            });
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        } catch {
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
      });
    });
  }
  exports.vboxInfo = vboxInfo;
});

// node_modules/systeminformation/lib/printer.js
var require_printer = __commonJS((exports) => {
  var exec = __require("child_process").exec;
  var util = require_util();
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  var winPrinterStatus = {
    1: "Other",
    2: "Unknown",
    3: "Idle",
    4: "Printing",
    5: "Warmup",
    6: "Stopped Printing",
    7: "Offline"
  };
  function parseLinuxCupsHeader(lines) {
    const result2 = {};
    if (lines && lines.length) {
      if (lines[0].indexOf(" CUPS v") > 0) {
        const parts = lines[0].split(" CUPS v");
        result2.cupsVersion = parts[1];
      }
    }
    return result2;
  }
  function parseLinuxCupsPrinter(lines) {
    const result2 = {};
    const printerId = util.getValue(lines, "PrinterId", " ");
    result2.id = printerId ? parseInt(printerId, 10) : null;
    result2.name = util.getValue(lines, "Info", " ");
    result2.model = lines.length > 0 && lines[0] ? lines[0].split(" ")[0] : "";
    result2.uri = util.getValue(lines, "DeviceURI", " ");
    result2.uuid = util.getValue(lines, "UUID", " ");
    result2.status = util.getValue(lines, "State", " ");
    result2.local = util.getValue(lines, "Location", " ").toLowerCase().startsWith("local");
    result2.default = null;
    result2.shared = util.getValue(lines, "Shared", " ").toLowerCase().startsWith("yes");
    return result2;
  }
  function parseLinuxLpstatPrinter(lines, id) {
    const result2 = {};
    result2.id = id;
    result2.name = util.getValue(lines, "Description", ":", true);
    result2.model = lines.length > 0 && lines[0] ? lines[0].split(" ")[0] : "";
    result2.uri = null;
    result2.uuid = null;
    result2.status = lines.length > 0 && lines[0] ? lines[0].indexOf(" idle") > 0 ? "idle" : lines[0].indexOf(" printing") > 0 ? "printing" : "unknown" : null;
    result2.local = util.getValue(lines, "Location", ":", true).toLowerCase().startsWith("local");
    result2.default = null;
    result2.shared = util.getValue(lines, "Shared", " ").toLowerCase().startsWith("yes");
    return result2;
  }
  function parseDarwinPrinters(printerObject, id) {
    const result2 = {};
    const uriParts = printerObject.uri.split("/");
    result2.id = id;
    result2.name = printerObject._name;
    result2.model = uriParts.length ? uriParts[uriParts.length - 1] : "";
    result2.uri = printerObject.uri;
    result2.uuid = null;
    result2.status = printerObject.status;
    result2.local = printerObject.printserver === "local";
    result2.default = printerObject.default === "yes";
    result2.shared = printerObject.shared === "yes";
    return result2;
  }
  function parseWindowsPrinters(lines, id) {
    const result2 = {};
    const status = parseInt(util.getValue(lines, "PrinterStatus", ":"), 10);
    result2.id = id;
    result2.name = util.getValue(lines, "name", ":");
    result2.model = util.getValue(lines, "DriverName", ":");
    result2.uri = null;
    result2.uuid = null;
    result2.status = winPrinterStatus[status] ? winPrinterStatus[status] : null;
    result2.local = util.getValue(lines, "Local", ":").toUpperCase() === "TRUE";
    result2.default = util.getValue(lines, "Default", ":").toUpperCase() === "TRUE";
    result2.shared = util.getValue(lines, "Shared", ":").toUpperCase() === "TRUE";
    return result2;
  }
  function printer(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = [];
        if (_linux || _freebsd || _openbsd || _netbsd) {
          let cmd = "cat /etc/cups/printers.conf 2>/dev/null";
          exec(cmd, (error2, stdout) => {
            if (!error2) {
              const parts = stdout.toString().split("<Printer ");
              const printerHeader = parseLinuxCupsHeader(parts[0]);
              for (let i = 1;i < parts.length; i++) {
                const printers = parseLinuxCupsPrinter(parts[i].split(`
`));
                if (printers.name) {
                  printers.engine = "CUPS";
                  printers.engineVersion = printerHeader.cupsVersion;
                  result2.push(printers);
                }
              }
            }
            if (result2.length === 0) {
              if (_linux) {
                cmd = "export LC_ALL=C; lpstat -lp 2>/dev/null; unset LC_ALL";
                exec(cmd, (error3, stdout2) => {
                  const parts = (`
` + stdout2.toString()).split(`
printer `);
                  for (let i = 1;i < parts.length; i++) {
                    const printers = parseLinuxLpstatPrinter(parts[i].split(`
`), i);
                    result2.push(printers);
                  }
                });
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              } else {
                if (callback) {
                  callback(result2);
                }
                resolve(result2);
              }
            } else {
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
          });
        }
        if (_darwin) {
          let cmd = "system_profiler SPPrintersDataType -json";
          exec(cmd, (error2, stdout) => {
            if (!error2) {
              try {
                const outObj = JSON.parse(stdout.toString());
                if (outObj.SPPrintersDataType && outObj.SPPrintersDataType.length) {
                  for (let i = 0;i < outObj.SPPrintersDataType.length; i++) {
                    const printer2 = parseDarwinPrinters(outObj.SPPrintersDataType[i], i);
                    result2.push(printer2);
                  }
                }
              } catch {
                util.noop();
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_windows) {
          util.powerShell("Get-CimInstance Win32_Printer | select PrinterStatus,Name,DriverName,Local,Default,Shared | fl").then((stdout, error2) => {
            if (!error2) {
              const parts = stdout.toString().split(/\n\s*\n/);
              for (let i = 0;i < parts.length; i++) {
                const printer2 = parseWindowsPrinters(parts[i].split(`
`), i);
                if (printer2.name || printer2.model) {
                  result2.push(printer2);
                }
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_sunos) {
          resolve(null);
        }
      });
    });
  }
  exports.printer = printer;
});

// node_modules/systeminformation/lib/usb.js
var require_usb = __commonJS((exports) => {
  var exec = __require("child_process").exec;
  var util = require_util();
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  function getLinuxUsbType(type, name) {
    let result2 = type;
    const str = (name + " " + type).toLowerCase();
    if (str.indexOf("camera") >= 0) {
      result2 = "Camera";
    } else if (str.indexOf("hub") >= 0) {
      result2 = "Hub";
    } else if (str.indexOf("keybrd") >= 0) {
      result2 = "Keyboard";
    } else if (str.indexOf("keyboard") >= 0) {
      result2 = "Keyboard";
    } else if (str.indexOf("mouse") >= 0) {
      result2 = "Mouse";
    } else if (str.indexOf("stora") >= 0) {
      result2 = "Storage";
    } else if (str.indexOf("microp") >= 0) {
      result2 = "Microphone";
    } else if (str.indexOf("headset") >= 0) {
      result2 = "Audio";
    } else if (str.indexOf("audio") >= 0) {
      result2 = "Audio";
    }
    return result2;
  }
  function parseLinuxUsb(usb2) {
    const result2 = {};
    const lines = usb2.split(`
`);
    if (lines && lines.length && lines[0].indexOf("Device") >= 0) {
      const parts = lines[0].split(" ");
      result2.bus = parseInt(parts[0], 10);
      if (parts[2]) {
        result2.deviceId = parseInt(parts[2], 10);
      } else {
        result2.deviceId = null;
      }
    } else {
      result2.bus = null;
      result2.deviceId = null;
    }
    const idVendor = util.getValue(lines, "idVendor", " ", true).trim();
    let vendorParts = idVendor.split(" ");
    vendorParts.shift();
    const vendor = vendorParts.join(" ");
    const idProduct = util.getValue(lines, "idProduct", " ", true).trim();
    let productParts = idProduct.split(" ");
    productParts.shift();
    const product = productParts.join(" ");
    const interfaceClass = util.getValue(lines, "bInterfaceClass", " ", true).trim();
    let interfaceClassParts = interfaceClass.split(" ");
    interfaceClassParts.shift();
    const usbType = interfaceClassParts.join(" ");
    const iManufacturer = util.getValue(lines, "iManufacturer", " ", true).trim();
    let iManufacturerParts = iManufacturer.split(" ");
    iManufacturerParts.shift();
    const manufacturer = iManufacturerParts.join(" ");
    const iSerial = util.getValue(lines, "iSerial", " ", true).trim();
    let iSerialParts = iSerial.split(" ");
    iSerialParts.shift();
    const serial = iSerialParts.join(" ");
    result2.id = (idVendor.startsWith("0x") ? idVendor.split(" ")[0].substr(2, 10) : "") + ":" + (idProduct.startsWith("0x") ? idProduct.split(" ")[0].substr(2, 10) : "");
    result2.name = product;
    result2.type = getLinuxUsbType(usbType, product);
    result2.removable = null;
    result2.vendor = vendor;
    result2.manufacturer = manufacturer;
    result2.maxPower = util.getValue(lines, "MaxPower", " ", true);
    result2.serialNumber = serial;
    return result2;
  }
  function getDarwinUsbType(name) {
    let result2 = "";
    if (name.indexOf("camera") >= 0) {
      result2 = "Camera";
    } else if (name.indexOf("touch bar") >= 0) {
      result2 = "Touch Bar";
    } else if (name.indexOf("controller") >= 0) {
      result2 = "Controller";
    } else if (name.indexOf("headset") >= 0) {
      result2 = "Audio";
    } else if (name.indexOf("keyboard") >= 0) {
      result2 = "Keyboard";
    } else if (name.indexOf("trackpad") >= 0) {
      result2 = "Trackpad";
    } else if (name.indexOf("sensor") >= 0) {
      result2 = "Sensor";
    } else if (name.indexOf("bthusb") >= 0) {
      result2 = "Bluetooth";
    } else if (name.indexOf("bth") >= 0) {
      result2 = "Bluetooth";
    } else if (name.indexOf("rfcomm") >= 0) {
      result2 = "Bluetooth";
    } else if (name.indexOf("usbhub") >= 0) {
      result2 = "Hub";
    } else if (name.indexOf(" hub") >= 0) {
      result2 = "Hub";
    } else if (name.indexOf("mouse") >= 0) {
      result2 = "Mouse";
    } else if (name.indexOf("microp") >= 0) {
      result2 = "Microphone";
    } else if (name.indexOf("removable") >= 0) {
      result2 = "Storage";
    }
    return result2;
  }
  function parseDarwinUsb(usb2, id) {
    const result2 = {};
    result2.id = id;
    usb2 = usb2.replace(/ \|/g, "");
    usb2 = usb2.trim();
    let lines = usb2.split(`
`);
    lines.shift();
    try {
      for (let i = 0;i < lines.length; i++) {
        lines[i] = lines[i].trim();
        lines[i] = lines[i].replace(/=/g, ":");
        if (lines[i] !== "{" && lines[i] !== "}" && lines[i + 1] && lines[i + 1].trim() !== "}") {
          lines[i] = lines[i] + ",";
        }
        lines[i] = lines[i].replace(":Yes,", ':"Yes",');
        lines[i] = lines[i].replace(": Yes,", ': "Yes",');
        lines[i] = lines[i].replace(": Yes", ': "Yes"');
        lines[i] = lines[i].replace(":No,", ':"No",');
        lines[i] = lines[i].replace(": No,", ': "No",');
        lines[i] = lines[i].replace(": No", ': "No"');
        lines[i] = lines[i].replace("((", "").replace("))", "");
        const match = /<(\w+)>/.exec(lines[i]);
        if (match) {
          const number = match[0];
          lines[i] = lines[i].replace(number, `"${number}"`);
        }
      }
      const usbObj = JSON.parse(lines.join(`
`));
      const removableDrive = (usbObj["Built-In"] ? usbObj["Built-In"].toLowerCase() !== "yes" : true) && (usbObj["non-removable"] ? usbObj["non-removable"].toLowerCase() === "no" : true);
      result2.bus = null;
      result2.deviceId = null;
      result2.id = usbObj["USB Address"] || null;
      result2.name = usbObj["kUSBProductString"] || usbObj["USB Product Name"] || null;
      result2.type = getDarwinUsbType((usbObj["kUSBProductString"] || usbObj["USB Product Name"] || "").toLowerCase() + (removableDrive ? " removable" : ""));
      result2.removable = usbObj["non-removable"] ? usbObj["non-removable"].toLowerCase() || false : true;
      result2.vendor = usbObj["kUSBVendorString"] || usbObj["USB Vendor Name"] || null;
      result2.manufacturer = usbObj["kUSBVendorString"] || usbObj["USB Vendor Name"] || null;
      result2.maxPower = null;
      result2.serialNumber = usbObj["kUSBSerialNumberString"] || null;
      if (result2.name) {
        return result2;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
  function getWindowsUsbTypeCreation(creationclass, name) {
    let result2 = "";
    if (name.indexOf("storage") >= 0) {
      result2 = "Storage";
    } else if (name.indexOf("speicher") >= 0) {
      result2 = "Storage";
    } else if (creationclass.indexOf("usbhub") >= 0) {
      result2 = "Hub";
    } else if (creationclass.indexOf("storage") >= 0) {
      result2 = "Storage";
    } else if (creationclass.indexOf("usbcontroller") >= 0) {
      result2 = "Controller";
    } else if (creationclass.indexOf("keyboard") >= 0) {
      result2 = "Keyboard";
    } else if (creationclass.indexOf("pointing") >= 0) {
      result2 = "Mouse";
    } else if (creationclass.indexOf("microp") >= 0) {
      result2 = "Microphone";
    } else if (creationclass.indexOf("disk") >= 0) {
      result2 = "Storage";
    }
    return result2;
  }
  function parseWindowsUsb(lines, id) {
    const usbType = getWindowsUsbTypeCreation(util.getValue(lines, "CreationClassName", ":").toLowerCase(), util.getValue(lines, "name", ":").toLowerCase());
    if (usbType) {
      const result2 = {};
      result2.bus = null;
      result2.deviceId = util.getValue(lines, "deviceid", ":");
      result2.id = id;
      result2.name = util.getValue(lines, "name", ":");
      result2.type = usbType;
      result2.removable = null;
      result2.vendor = null;
      result2.manufacturer = util.getValue(lines, "Manufacturer", ":");
      result2.maxPower = null;
      result2.serialNumber = null;
      return result2;
    } else {
      return null;
    }
  }
  function usb(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = [];
        if (_linux) {
          const cmd = "export LC_ALL=C; lsusb -v 2>/dev/null; unset LC_ALL";
          exec(cmd, { maxBuffer: 1024 * 1024 * 128 }, function(error2, stdout) {
            if (!error2) {
              const parts = (`

` + stdout.toString()).split(`

Bus `);
              for (let i = 1;i < parts.length; i++) {
                const usb2 = parseLinuxUsb(parts[i]);
                result2.push(usb2);
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_darwin) {
          let cmd = "ioreg -p IOUSB -c AppleUSBRootHubDevice -w0 -l";
          exec(cmd, { maxBuffer: 1024 * 1024 * 128 }, function(error2, stdout) {
            if (!error2) {
              const parts = stdout.toString().split(" +-o ");
              for (let i = 1;i < parts.length; i++) {
                const usb2 = parseDarwinUsb(parts[i]);
                if (usb2) {
                  result2.push(usb2);
                }
              }
              if (callback) {
                callback(result2);
              }
              resolve(result2);
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_windows) {
          util.powerShell('Get-CimInstance CIM_LogicalDevice | where { $_.Description -match "USB"} | select Name,CreationClassName,DeviceId,Manufacturer | fl').then((stdout, error2) => {
            if (!error2) {
              const parts = stdout.toString().split(/\n\s*\n/);
              for (let i = 0;i < parts.length; i++) {
                const usb2 = parseWindowsUsb(parts[i].split(`
`), i);
                if (usb2 && result2.filter((x) => x.deviceId === usb2.deviceId).length === 0) {
                  result2.push(usb2);
                }
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_sunos || _freebsd || _openbsd || _netbsd) {
          resolve(null);
        }
      });
    });
  }
  exports.usb = usb;
});

// node_modules/systeminformation/lib/audio.js
var require_audio = __commonJS((exports) => {
  var exec = __require("child_process").exec;
  var execSync = __require("child_process").execSync;
  var util = require_util();
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  function parseAudioType(str, input, output) {
    str = str.toLowerCase();
    let result2 = "";
    if (str.indexOf("input") >= 0) {
      result2 = "Microphone";
    }
    if (str.indexOf("display audio") >= 0) {
      result2 = "Speaker";
    }
    if (str.indexOf("speak") >= 0) {
      result2 = "Speaker";
    }
    if (str.indexOf("laut") >= 0) {
      result2 = "Speaker";
    }
    if (str.indexOf("loud") >= 0) {
      result2 = "Speaker";
    }
    if (str.indexOf("head") >= 0) {
      result2 = "Headset";
    }
    if (str.indexOf("mic") >= 0) {
      result2 = "Microphone";
    }
    if (str.indexOf("mikr") >= 0) {
      result2 = "Microphone";
    }
    if (str.indexOf("phone") >= 0) {
      result2 = "Phone";
    }
    if (str.indexOf("controll") >= 0) {
      result2 = "Controller";
    }
    if (str.indexOf("line o") >= 0) {
      result2 = "Line Out";
    }
    if (str.indexOf("digital o") >= 0) {
      result2 = "Digital Out";
    }
    if (str.indexOf("smart sound technology") >= 0) {
      result2 = "Digital Signal Processor";
    }
    if (str.indexOf("high definition audio") >= 0) {
      result2 = "Sound Driver";
    }
    if (!result2 && output) {
      result2 = "Speaker";
    } else if (!result2 && input) {
      result2 = "Microphone";
    }
    return result2;
  }
  function getLinuxAudioPci() {
    const cmd = "lspci -v 2>/dev/null";
    const result2 = [];
    try {
      const parts = execSync(cmd, util.execOptsLinux).toString().split(`

`);
      parts.forEach((element) => {
        const lines = element.split(`
`);
        if (lines && lines.length && lines[0].toLowerCase().indexOf("audio") >= 0) {
          const audio2 = {};
          audio2.slotId = lines[0].split(" ")[0];
          audio2.driver = util.getValue(lines, "Kernel driver in use", ":", true) || util.getValue(lines, "Kernel modules", ":", true);
          result2.push(audio2);
        }
      });
      return result2;
    } catch {
      return result2;
    }
  }
  function parseWinAudioStatus(n) {
    let status = n;
    if (n === 1) {
      status = "other";
    } else if (n === 2) {
      status = "unknown";
    } else if (n === 3) {
      status = "enabled";
    } else if (n === 4) {
      status = "disabled";
    } else if (n === 5) {
      status = "not applicable";
    }
    return status;
  }
  function parseLinuxAudioPciMM(lines, audioPCI) {
    const result2 = {};
    const slotId = util.getValue(lines, "Slot");
    const pciMatch = audioPCI.filter((item) => item.slotId === slotId);
    result2.id = slotId;
    result2.name = util.getValue(lines, "SDevice");
    result2.manufacturer = util.getValue(lines, "SVendor");
    result2.revision = util.getValue(lines, "Rev");
    result2.driver = pciMatch && pciMatch.length === 1 && pciMatch[0].driver ? pciMatch[0].driver : "";
    result2.default = null;
    result2.channel = "PCIe";
    result2.type = parseAudioType(result2.name, null, null);
    result2.in = null;
    result2.out = null;
    result2.status = "online";
    return result2;
  }
  function parseDarwinChannel(str) {
    let result2 = "";
    if (str.indexOf("builtin") >= 0) {
      result2 = "Built-In";
    }
    if (str.indexOf("extern") >= 0) {
      result2 = "Audio-Jack";
    }
    if (str.indexOf("hdmi") >= 0) {
      result2 = "HDMI";
    }
    if (str.indexOf("displayport") >= 0) {
      result2 = "Display-Port";
    }
    if (str.indexOf("usb") >= 0) {
      result2 = "USB";
    }
    if (str.indexOf("pci") >= 0) {
      result2 = "PCIe";
    }
    return result2;
  }
  function parseDarwinAudio(audioObject, id) {
    const result2 = {};
    const channelStr = ((audioObject.coreaudio_device_transport || "") + " " + (audioObject._name || "")).toLowerCase();
    result2.id = id;
    result2.name = audioObject._name;
    result2.manufacturer = audioObject.coreaudio_device_manufacturer;
    result2.revision = null;
    result2.driver = null;
    result2.default = !!(audioObject.coreaudio_default_audio_input_device || "") || !!(audioObject.coreaudio_default_audio_output_device || "");
    result2.channel = parseDarwinChannel(channelStr);
    result2.type = parseAudioType(result2.name, !!(audioObject.coreaudio_device_input || ""), !!(audioObject.coreaudio_device_output || ""));
    result2.in = !!(audioObject.coreaudio_device_input || "");
    result2.out = !!(audioObject.coreaudio_device_output || "");
    result2.status = "online";
    return result2;
  }
  function parseWindowsAudio(lines) {
    const result2 = {};
    const status = parseWinAudioStatus(util.getValue(lines, "StatusInfo", ":"));
    result2.id = util.getValue(lines, "DeviceID", ":");
    result2.name = util.getValue(lines, "name", ":");
    result2.manufacturer = util.getValue(lines, "manufacturer", ":");
    result2.revision = null;
    result2.driver = null;
    result2.default = null;
    result2.channel = null;
    result2.type = parseAudioType(result2.name, null, null);
    result2.in = null;
    result2.out = null;
    result2.status = status;
    return result2;
  }
  function audio(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        const result2 = [];
        if (_linux || _freebsd || _openbsd || _netbsd) {
          const cmd = "lspci -vmm 2>/dev/null";
          exec(cmd, (error2, stdout) => {
            if (!error2) {
              const audioPCI = getLinuxAudioPci();
              const parts = stdout.toString().split(`

`);
              parts.forEach((element) => {
                const lines = element.split(`
`);
                if (util.getValue(lines, "class", ":", true).toLowerCase().indexOf("audio") >= 0) {
                  const audio2 = parseLinuxAudioPciMM(lines, audioPCI);
                  result2.push(audio2);
                }
              });
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_darwin) {
          const cmd = "system_profiler SPAudioDataType -json";
          exec(cmd, (error2, stdout) => {
            if (!error2) {
              try {
                const outObj = JSON.parse(stdout.toString());
                if (outObj.SPAudioDataType && outObj.SPAudioDataType.length && outObj.SPAudioDataType[0] && outObj.SPAudioDataType[0]["_items"] && outObj.SPAudioDataType[0]["_items"].length) {
                  for (let i = 0;i < outObj.SPAudioDataType[0]["_items"].length; i++) {
                    const audio2 = parseDarwinAudio(outObj.SPAudioDataType[0]["_items"][i], i);
                    result2.push(audio2);
                  }
                }
              } catch {
                util.noop();
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_windows) {
          util.powerShell("Get-CimInstance Win32_SoundDevice | select DeviceID,StatusInfo,Name,Manufacturer | fl").then((stdout, error2) => {
            if (!error2) {
              const parts = stdout.toString().split(/\n\s*\n/);
              parts.forEach((element) => {
                const lines = element.split(`
`);
                if (util.getValue(lines, "name", ":")) {
                  result2.push(parseWindowsAudio(lines));
                }
              });
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_sunos) {
          resolve(null);
        }
      });
    });
  }
  exports.audio = audio;
});

// node_modules/systeminformation/lib/bluetoothVendors.js
var require_bluetoothVendors = __commonJS((exports, module) => {
  module.exports = {
    0: "Ericsson Technology Licensing",
    1: "Nokia Mobile Phones",
    2: "Intel Corp.",
    3: "IBM Corp.",
    4: "Toshiba Corp.",
    5: "3Com",
    6: "Microsoft",
    7: "Lucent",
    8: "Motorola",
    9: "Infineon Technologies AG",
    10: "Cambridge Silicon Radio",
    11: "Silicon Wave",
    12: "Digianswer A/S",
    13: "Texas Instruments Inc.",
    14: "Ceva, Inc. (formerly Parthus Technologies, Inc.)",
    15: "Broadcom Corporation",
    16: "Mitel Semiconductor",
    17: "Widcomm, Inc",
    18: "Zeevo, Inc.",
    19: "Atmel Corporation",
    20: "Mitsubishi Electric Corporation",
    21: "RTX Telecom A/S",
    22: "KC Technology Inc.",
    23: "NewLogic",
    24: "Transilica, Inc.",
    25: "Rohde & Schwarz GmbH & Co. KG",
    26: "TTPCom Limited",
    27: "Signia Technologies, Inc.",
    28: "Conexant Systems Inc.",
    29: "Qualcomm",
    30: "Inventel",
    31: "AVM Berlin",
    32: "BandSpeed, Inc.",
    33: "Mansella Ltd",
    34: "NEC Corporation",
    35: "WavePlus Technology Co., Ltd.",
    36: "Alcatel",
    37: "NXP Semiconductors (formerly Philips Semiconductors)",
    38: "C Technologies",
    39: "Open Interface",
    40: "R F Micro Devices",
    41: "Hitachi Ltd",
    42: "Symbol Technologies, Inc.",
    43: "Tenovis",
    44: "Macronix International Co. Ltd.",
    45: "GCT Semiconductor",
    46: "Norwood Systems",
    47: "MewTel Technology Inc.",
    48: "ST Microelectronics",
    49: "Synopsis",
    50: "Red-M (Communications) Ltd",
    51: "Commil Ltd",
    52: "Computer Access Technology Corporation (CATC)",
    53: "Eclipse (HQ Espana) S.L.",
    54: "Renesas Electronics Corporation",
    55: "Mobilian Corporation",
    56: "Terax",
    57: "Integrated System Solution Corp.",
    58: "Matsushita Electric Industrial Co., Ltd.",
    59: "Gennum Corporation",
    60: "BlackBerry Limited (formerly Research In Motion)",
    61: "IPextreme, Inc.",
    62: "Systems and Chips, Inc.",
    63: "Bluetooth SIG, Inc.",
    64: "Seiko Epson Corporation",
    65: "Integrated Silicon Solution Taiwan, Inc.",
    66: "CONWISE Technology Corporation Ltd",
    67: "PARROT SA",
    68: "Socket Mobile",
    69: "Atheros Communications, Inc.",
    70: "MediaTek, Inc.",
    71: "Bluegiga",
    72: "Marvell Technology Group Ltd.",
    73: "3DSP Corporation",
    74: "Accel Semiconductor Ltd.",
    75: "Continental Automotive Systems",
    76: "Apple, Inc.",
    77: "Staccato Communications, Inc.",
    78: "Avago Technologies",
    79: "APT Licensing Ltd.",
    80: "SiRF Technology",
    81: "Tzero Technologies, Inc.",
    82: "J&M Corporation",
    83: "Free2move AB",
    84: "3DiJoy Corporation",
    85: "Plantronics, Inc.",
    86: "Sony Ericsson Mobile Communications",
    87: "Harman International Industries, Inc.",
    88: "Vizio, Inc.",
    89: "Nordic Semiconductor ASA",
    90: "EM Microelectronic-Marin SA",
    91: "Ralink Technology Corporation",
    92: "Belkin International, Inc.",
    93: "Realtek Semiconductor Corporation",
    94: "Stonestreet One, LLC",
    95: "Wicentric, Inc.",
    96: "RivieraWaves S.A.S",
    97: "RDA Microelectronics",
    98: "Gibson Guitars",
    99: "MiCommand Inc.",
    100: "Band XI International, LLC",
    101: "Hewlett-Packard Company",
    102: "9Solutions Oy",
    103: "GN Netcom A/S",
    104: "General Motors",
    105: "A&D Engineering, Inc.",
    106: "MindTree Ltd.",
    107: "Polar Electro OY",
    108: "Beautiful Enterprise Co., Ltd.",
    109: "BriarTek, Inc.",
    110: "Summit Data Communications, Inc.",
    111: "Sound ID",
    112: "Monster, LLC",
    113: "connectBlue AB",
    114: "ShangHai Super Smart Electronics Co. Ltd.",
    115: "Group Sense Ltd.",
    116: "Zomm, LLC",
    117: "Samsung Electronics Co. Ltd.",
    118: "Creative Technology Ltd.",
    119: "Laird Technologies",
    120: "Nike, Inc.",
    121: "lesswire AG",
    122: "MStar Semiconductor, Inc.",
    123: "Hanlynn Technologies",
    124: "A & R Cambridge",
    125: "Seers Technology Co. Ltd",
    126: "Sports Tracking Technologies Ltd.",
    127: "Autonet Mobile",
    128: "DeLorme Publishing Company, Inc.",
    129: "WuXi Vimicro",
    130: "Sennheiser Communications A/S",
    131: "TimeKeeping Systems, Inc.",
    132: "Ludus Helsinki Ltd.",
    133: "BlueRadios, Inc.",
    134: "equinox AG",
    135: "Garmin International, Inc.",
    136: "Ecotest",
    137: "GN ReSound A/S",
    138: "Jawbone",
    139: "Topcorn Positioning Systems, LLC",
    140: "Gimbal Inc. (formerly Qualcomm Labs, Inc. and Qualcomm Retail Solutions, Inc.)",
    141: "Zscan Software",
    142: "Quintic Corp.",
    143: "Stollman E+V GmbH",
    144: "Funai Electric Co., Ltd.",
    145: "Advanced PANMOBIL Systems GmbH & Co. KG",
    146: "ThinkOptics, Inc.",
    147: "Universal Electronics, Inc.",
    148: "Airoha Technology Corp.",
    149: "NEC Lighting, Ltd.",
    150: "ODM Technology, Inc.",
    151: "ConnecteDevice Ltd.",
    152: "zer01.tv GmbH",
    153: "i.Tech Dynamic Global Distribution Ltd.",
    154: "Alpwise",
    155: "Jiangsu Toppower Automotive Electronics Co., Ltd.",
    156: "Colorfy, Inc.",
    157: "Geoforce Inc.",
    158: "Bose Corporation",
    159: "Suunto Oy",
    160: "Kensington Computer Products Group",
    161: "SR-Medizinelektronik",
    162: "Vertu Corporation Limited",
    163: "Meta Watch Ltd.",
    164: "LINAK A/S",
    165: "OTL Dynamics LLC",
    166: "Panda Ocean Inc.",
    167: "Visteon Corporation",
    168: "ARP Devices Limited",
    169: "Magneti Marelli S.p.A",
    170: "CAEN RFID srl",
    171: "Ingenieur-Systemgruppe Zahn GmbH",
    172: "Green Throttle Games",
    173: "Peter Systemtechnik GmbH",
    174: "Omegawave Oy",
    175: "Cinetix",
    176: "Passif Semiconductor Corp",
    177: "Saris Cycling Group, Inc",
    178: "Bekey A/S",
    179: "Clarinox Technologies Pty. Ltd.",
    180: "BDE Technology Co., Ltd.",
    181: "Swirl Networks",
    182: "Meso international",
    183: "TreLab Ltd",
    184: "Qualcomm Innovation Center, Inc. (QuIC)",
    185: "Johnson Controls, Inc.",
    186: "Starkey Laboratories Inc.",
    187: "S-Power Electronics Limited",
    188: "Ace Sensor Inc",
    189: "Aplix Corporation",
    190: "AAMP of America",
    191: "Stalmart Technology Limited",
    192: "AMICCOM Electronics Corporation",
    193: "Shenzhen Excelsecu Data Technology Co.,Ltd",
    194: "Geneq Inc.",
    195: "adidas AG",
    196: "LG Electronics",
    197: "Onset Computer Corporation",
    198: "Selfly BV",
    199: "Quuppa Oy.",
    200: "GeLo Inc",
    201: "Evluma",
    202: "MC10",
    203: "Binauric SE",
    204: "Beats Electronics",
    205: "Microchip Technology Inc.",
    206: "Elgato Systems GmbH",
    207: "ARCHOS SA",
    208: "Dexcom, Inc.",
    209: "Polar Electro Europe B.V.",
    210: "Dialog Semiconductor B.V.",
    211: "Taixingbang Technology (HK) Co,. LTD.",
    212: "Kawantech",
    213: "Austco Communication Systems",
    214: "Timex Group USA, Inc.",
    215: "Qualcomm Technologies, Inc.",
    216: "Qualcomm Connected Experiences, Inc.",
    217: "Voyetra Turtle Beach",
    218: "txtr GmbH",
    219: "Biosentronics",
    220: "Procter & Gamble",
    221: "Hosiden Corporation",
    222: "Muzik LLC",
    223: "Misfit Wearables Corp",
    224: "Google",
    225: "Danlers Ltd",
    226: "Semilink Inc",
    227: "inMusic Brands, Inc",
    228: "L.S. Research Inc.",
    229: "Eden Software Consultants Ltd.",
    230: "Freshtemp",
    231: "KS Technologies",
    232: "ACTS Technologies",
    233: "Vtrack Systems",
    234: "Nielsen-Kellerman Company",
    235: "Server Technology, Inc.",
    236: "BioResearch Associates",
    237: "Jolly Logic, LLC",
    238: "Above Average Outcomes, Inc.",
    239: "Bitsplitters GmbH",
    240: "PayPal, Inc.",
    241: "Witron Technology Limited",
    242: "Aether Things Inc. (formerly Morse Project Inc.)",
    243: "Kent Displays Inc.",
    244: "Nautilus Inc.",
    245: "Smartifier Oy",
    246: "Elcometer Limited",
    247: "VSN Technologies Inc.",
    248: "AceUni Corp., Ltd.",
    249: "StickNFind",
    250: "Crystal Code AB",
    251: "KOUKAAM a.s.",
    252: "Delphi Corporation",
    253: "ValenceTech Limited",
    254: "Reserved",
    255: "Typo Products, LLC",
    256: "TomTom International BV",
    257: "Fugoo, Inc",
    258: "Keiser Corporation",
    259: "Bang & Olufsen A/S",
    260: "PLUS Locations Systems Pty Ltd",
    261: "Ubiquitous Computing Technology Corporation",
    262: "Innovative Yachtter Solutions",
    263: "William Demant Holding A/S",
    264: "Chicony Electronics Co., Ltd.",
    265: "Atus BV",
    266: "Codegate Ltd.",
    267: "ERi, Inc.",
    268: "Transducers Direct, LLC",
    269: "Fujitsu Ten Limited",
    270: "Audi AG",
    271: "HiSilicon Technologies Co., Ltd.",
    272: "Nippon Seiki Co., Ltd.",
    273: "Steelseries ApS",
    274: "vyzybl Inc.",
    275: "Openbrain Technologies, Co., Ltd.",
    276: "Xensr",
    277: "e.solutions",
    278: "1OAK Technologies",
    279: "Wimoto Technologies Inc",
    280: "Radius Networks, Inc.",
    281: "Wize Technology Co., Ltd.",
    282: "Qualcomm Labs, Inc.",
    283: "Aruba Networks",
    284: "Baidu",
    285: "Arendi AG",
    286: "Skoda Auto a.s.",
    287: "Volkswagon AG",
    288: "Porsche AG",
    289: "Sino Wealth Electronic Ltd.",
    290: "AirTurn, Inc.",
    291: "Kinsa, Inc.",
    292: "HID Global",
    293: "SEAT es",
    294: "Promethean Ltd.",
    295: "Salutica Allied Solutions",
    296: "GPSI Group Pty Ltd",
    297: "Nimble Devices Oy",
    298: "Changzhou Yongse Infotech Co., Ltd",
    299: "SportIQ",
    300: "TEMEC Instruments B.V.",
    301: "Sony Corporation",
    302: "ASSA ABLOY",
    303: "Clarion Co., Ltd.",
    304: "Warehouse Innovations",
    305: "Cypress Semiconductor Corporation",
    306: "MADS Inc",
    307: "Blue Maestro Limited",
    308: "Resolution Products, Inc.",
    309: "Airewear LLC",
    310: "Seed Labs, Inc. (formerly ETC sp. z.o.o.)",
    311: "Prestigio Plaza Ltd.",
    312: "NTEO Inc.",
    313: "Focus Systems Corporation",
    314: "Tencent Holdings Limited",
    315: "Allegion",
    316: "Murata Manufacuring Co., Ltd.",
    318: "Nod, Inc.",
    319: "B&B Manufacturing Company",
    320: "Alpine Electronics (China) Co., Ltd",
    321: "FedEx Services",
    322: "Grape Systems Inc.",
    323: "Bkon Connect",
    324: "Lintech GmbH",
    325: "Novatel Wireless",
    326: "Ciright",
    327: "Mighty Cast, Inc.",
    328: "Ambimat Electronics",
    329: "Perytons Ltd.",
    330: "Tivoli Audio, LLC",
    331: "Master Lock",
    332: "Mesh-Net Ltd",
    333: "Huizhou Desay SV Automotive CO., LTD.",
    334: "Tangerine, Inc.",
    335: "B&W Group Ltd.",
    336: "Pioneer Corporation",
    337: "OnBeep",
    338: "Vernier Software & Technology",
    339: "ROL Ergo",
    340: "Pebble Technology",
    341: "NETATMO",
    342: "Accumulate AB",
    343: "Anhui Huami Information Technology Co., Ltd.",
    344: "Inmite s.r.o.",
    345: "ChefSteps, Inc.",
    346: "micas AG",
    347: "Biomedical Research Ltd.",
    348: "Pitius Tec S.L.",
    349: "Estimote, Inc.",
    350: "Unikey Technologies, Inc.",
    351: "Timer Cap Co.",
    352: "AwoX",
    353: "yikes",
    354: "MADSGlobal NZ Ltd.",
    355: "PCH International",
    356: "Qingdao Yeelink Information Technology Co., Ltd.",
    357: "Milwaukee Tool (formerly Milwaukee Electric Tools)",
    358: "MISHIK Pte Ltd",
    359: "Bayer HealthCare",
    360: "Spicebox LLC",
    361: "emberlight",
    362: "Cooper-Atkins Corporation",
    363: "Qblinks",
    364: "MYSPHERA",
    365: "LifeScan Inc",
    366: "Volantic AB",
    367: "Podo Labs, Inc",
    368: "Roche Diabetes Care AG",
    369: "Amazon Fulfillment Service",
    370: "Connovate Technology Private Limited",
    371: "Kocomojo, LLC",
    372: "Everykey LLC",
    373: "Dynamic Controls",
    374: "SentriLock",
    375: "I-SYST inc.",
    376: "CASIO COMPUTER CO., LTD.",
    377: "LAPIS Semiconductor Co., Ltd.",
    378: "Telemonitor, Inc.",
    379: "taskit GmbH",
    380: "Daimler AG",
    381: "BatAndCat",
    382: "BluDotz Ltd",
    383: "XTel ApS",
    384: "Gigaset Communications GmbH",
    385: "Gecko Health Innovations, Inc.",
    386: "HOP Ubiquitous",
    387: "To Be Assigned",
    388: "Nectar",
    389: "bel’apps LLC",
    390: "CORE Lighting Ltd",
    391: "Seraphim Sense Ltd",
    392: "Unico RBC",
    393: "Physical Enterprises Inc.",
    394: "Able Trend Technology Limited",
    395: "Konica Minolta, Inc.",
    396: "Wilo SE",
    397: "Extron Design Services",
    398: "Fitbit, Inc.",
    399: "Fireflies Systems",
    400: "Intelletto Technologies Inc.",
    401: "FDK CORPORATION",
    402: "Cloudleaf, Inc",
    403: "Maveric Automation LLC",
    404: "Acoustic Stream Corporation",
    405: "Zuli",
    406: "Paxton Access Ltd",
    407: "WiSilica Inc",
    408: "Vengit Limited",
    409: "SALTO SYSTEMS S.L.",
    410: "TRON Forum (formerly T-Engine Forum)",
    411: "CUBETECH s.r.o.",
    412: "Cokiya Incorporated",
    413: "CVS Health",
    414: "Ceruus",
    415: "Strainstall Ltd",
    416: "Channel Enterprises (HK) Ltd.",
    417: "FIAMM",
    418: "GIGALANE.CO.,LTD",
    419: "EROAD",
    420: "Mine Safety Appliances",
    421: "Icon Health and Fitness",
    422: "Asandoo GmbH",
    423: "ENERGOUS CORPORATION",
    424: "Taobao",
    425: "Canon Inc.",
    426: "Geophysical Technology Inc.",
    427: "Facebook, Inc.",
    428: "Nipro Diagnostics, Inc.",
    429: "FlightSafety International",
    430: "Earlens Corporation",
    431: "Sunrise Micro Devices, Inc.",
    432: "Star Micronics Co., Ltd.",
    433: "Netizens Sp. z o.o.",
    434: "Nymi Inc.",
    435: "Nytec, Inc.",
    436: "Trineo Sp. z o.o.",
    437: "Nest Labs Inc.",
    438: "LM Technologies Ltd",
    439: "General Electric Company",
    440: "i+D3 S.L.",
    441: "HANA Micron",
    442: "Stages Cycling LLC",
    443: "Cochlear Bone Anchored Solutions AB",
    444: "SenionLab AB",
    445: "Syszone Co., Ltd",
    446: "Pulsate Mobile Ltd.",
    447: "Hong Kong HunterSun Electronic Limited",
    448: "pironex GmbH",
    449: "BRADATECH Corp.",
    450: "Transenergooil AG",
    451: "Bunch",
    452: "DME Microelectronics",
    453: "Bitcraze AB",
    454: "HASWARE Inc.",
    455: "Abiogenix Inc.",
    456: "Poly-Control ApS",
    457: "Avi-on",
    458: "Laerdal Medical AS",
    459: "Fetch My Pet",
    460: "Sam Labs Ltd.",
    461: "Chengdu Synwing Technology Ltd",
    462: "HOUWA SYSTEM DESIGN, k.k.",
    463: "BSH",
    464: "Primus Inter Pares Ltd",
    465: "August",
    466: "Gill Electronics",
    467: "Sky Wave Design",
    468: "Newlab S.r.l.",
    469: "ELAD srl",
    470: "G-wearables inc.",
    471: "Squadrone Systems Inc.",
    472: "Code Corporation",
    473: "Savant Systems LLC",
    474: "Logitech International SA",
    475: "Innblue Consulting",
    476: "iParking Ltd.",
    477: "Koninklijke Philips Electronics N.V.",
    478: "Minelab Electronics Pty Limited",
    479: "Bison Group Ltd.",
    480: "Widex A/S",
    481: "Jolla Ltd",
    482: "Lectronix, Inc.",
    483: "Caterpillar Inc",
    484: "Freedom Innovations",
    485: "Dynamic Devices Ltd",
    486: "Technology Solutions (UK) Ltd",
    487: "IPS Group Inc.",
    488: "STIR",
    489: "Sano, Inc",
    490: "Advanced Application Design, Inc.",
    491: "AutoMap LLC",
    492: "Spreadtrum Communications Shanghai Ltd",
    493: "CuteCircuit LTD",
    494: "Valeo Service",
    495: "Fullpower Technologies, Inc.",
    496: "KloudNation",
    497: "Zebra Technologies Corporation",
    498: "Itron, Inc.",
    499: "The University of Tokyo",
    500: "UTC Fire and Security",
    501: "Cool Webthings Limited",
    502: "DJO Global",
    503: "Gelliner Limited",
    504: "Anyka (Guangzhou) Microelectronics Technology Co, LTD",
    505: "Medtronic, Inc.",
    506: "Gozio, Inc.",
    507: "Form Lifting, LLC",
    508: "Wahoo Fitness, LLC",
    509: "Kontakt Micro-Location Sp. z o.o.",
    510: "Radio System Corporation",
    511: "Freescale Semiconductor, Inc.",
    512: "Verifone Systems PTe Ltd. Taiwan Branch",
    513: "AR Timing",
    514: "Rigado LLC",
    515: "Kemppi Oy",
    516: "Tapcentive Inc.",
    517: "Smartbotics Inc.",
    518: "Otter Products, LLC",
    519: "STEMP Inc.",
    520: "LumiGeek LLC",
    521: "InvisionHeart Inc.",
    522: "Macnica Inc. ",
    523: "Jaguar Land Rover Limited",
    524: "CoroWare Technologies, Inc",
    525: "Simplo Technology Co., LTD",
    526: "Omron Healthcare Co., LTD",
    527: "Comodule GMBH",
    528: "ikeGPS",
    529: "Telink Semiconductor Co. Ltd",
    530: "Interplan Co., Ltd",
    531: "Wyler AG",
    532: "IK Multimedia Production srl",
    533: "Lukoton Experience Oy",
    534: "MTI Ltd",
    535: "Tech4home, Lda",
    536: "Hiotech AB",
    537: "DOTT Limited",
    538: "Blue Speck Labs, LLC",
    539: "Cisco Systems, Inc",
    540: "Mobicomm Inc",
    541: "Edamic",
    542: "Goodnet, Ltd",
    543: "Luster Leaf Products Inc",
    544: "Manus Machina BV",
    545: "Mobiquity Networks Inc",
    546: "Praxis Dynamics",
    547: "Philip Morris Products S.A.",
    548: "Comarch SA",
    549: "Nestl Nespresso S.A.",
    550: "Merlinia A/S",
    551: "LifeBEAM Technologies",
    552: "Twocanoes Labs, LLC",
    553: "Muoverti Limited",
    554: "Stamer Musikanlagen GMBH",
    555: "Tesla Motors",
    556: "Pharynks Corporation",
    557: "Lupine",
    558: "Siemens AG",
    559: "Huami (Shanghai) Culture Communication CO., LTD",
    560: "Foster Electric Company, Ltd",
    561: "ETA SA",
    562: "x-Senso Solutions Kft",
    563: "Shenzhen SuLong Communication Ltd",
    564: "FengFan (BeiJing) Technology Co, Ltd",
    565: "Qrio Inc",
    566: "Pitpatpet Ltd",
    567: "MSHeli s.r.l.",
    568: "Trakm8 Ltd",
    569: "JIN CO, Ltd",
    570: "Alatech Tehnology",
    571: "Beijing CarePulse Electronic Technology Co, Ltd",
    572: "Awarepoint",
    573: "ViCentra B.V.",
    574: "Raven Industries",
    575: "WaveWare Technologies Inc.",
    576: "Argenox Technologies",
    577: "Bragi GmbH",
    578: "16Lab Inc",
    579: "Masimo Corp",
    580: "Iotera Inc",
    581: "Endress+Hauser",
    582: "ACKme Networks, Inc.",
    583: "FiftyThree Inc.",
    584: "Parker Hannifin Corp",
    585: "Transcranial Ltd",
    586: "Uwatec AG",
    587: "Orlan LLC",
    588: "Blue Clover Devices",
    589: "M-Way Solutions GmbH",
    590: "Microtronics Engineering GmbH",
    591: "Schneider Schreibgerte GmbH",
    592: "Sapphire Circuits LLC",
    593: "Lumo Bodytech Inc.",
    594: "UKC Technosolution",
    595: "Xicato Inc.",
    596: "Playbrush",
    597: "Dai Nippon Printing Co., Ltd.",
    598: "G24 Power Limited",
    599: "AdBabble Local Commerce Inc.",
    600: "Devialet SA",
    601: "ALTYOR",
    602: "University of Applied Sciences Valais/Haute Ecole Valaisanne",
    603: "Five Interactive, LLC dba Zendo",
    604: "NetEaseHangzhouNetwork co.Ltd.",
    605: "Lexmark International Inc.",
    606: "Fluke Corporation",
    607: "Yardarm Technologies",
    608: "SensaRx",
    609: "SECVRE GmbH",
    610: "Glacial Ridge Technologies",
    611: "Identiv, Inc.",
    612: "DDS, Inc.",
    613: "SMK Corporation",
    614: "Schawbel Technologies LLC",
    615: "XMI Systems SA",
    616: "Cerevo",
    617: "Torrox GmbH & Co KG",
    618: "Gemalto",
    619: "DEKA Research & Development Corp.",
    620: "Domster Tadeusz Szydlowski",
    621: "Technogym SPA",
    622: "FLEURBAEY BVBA",
    623: "Aptcode Solutions",
    624: "LSI ADL Technology",
    625: "Animas Corp",
    626: "Alps Electric Co., Ltd.",
    627: "OCEASOFT",
    628: "Motsai Research",
    629: "Geotab",
    630: "E.G.O. Elektro-Gertebau GmbH",
    631: "bewhere inc",
    632: "Johnson Outdoors Inc",
    633: "steute Schaltgerate GmbH & Co. KG",
    634: "Ekomini inc.",
    635: "DEFA AS",
    636: "Aseptika Ltd",
    637: "HUAWEI Technologies Co., Ltd. ( )",
    638: "HabitAware, LLC",
    639: "ruwido austria gmbh",
    640: "ITEC corporation",
    641: "StoneL",
    642: "Sonova AG",
    643: "Maven Machines, Inc.",
    644: "Synapse Electronics",
    645: "Standard Innovation Inc.",
    646: "RF Code, Inc.",
    647: "Wally Ventures S.L.",
    648: "Willowbank Electronics Ltd",
    649: "SK Telecom",
    650: "Jetro AS",
    651: "Code Gears LTD",
    652: "NANOLINK APS",
    653: "IF, LLC",
    654: "RF Digital Corp",
    655: "Church & Dwight Co., Inc",
    656: "Multibit Oy",
    657: "CliniCloud Inc",
    658: "SwiftSensors",
    659: "Blue Bite",
    660: "ELIAS GmbH",
    661: "Sivantos GmbH",
    662: "Petzl",
    663: "storm power ltd",
    664: "EISST Ltd",
    665: "Inexess Technology Simma KG",
    666: "Currant, Inc.",
    667: "C2 Development, Inc.",
    668: "Blue Sky Scientific, LLC",
    669: "ALOTTAZS LABS, LLC",
    670: "Kupson spol. s r.o.",
    671: "Areus Engineering GmbH",
    672: "Impossible Camera GmbH",
    673: "InventureTrack Systems",
    674: "LockedUp",
    675: "Itude",
    676: "Pacific Lock Company",
    677: "Tendyron Corporation ( )",
    678: "Robert Bosch GmbH",
    679: "Illuxtron international B.V.",
    680: "miSport Ltd.",
    681: "Chargelib",
    682: "Doppler Lab",
    683: "BBPOS Limited",
    684: "RTB Elektronik GmbH & Co. KG",
    685: "Rx Networks, Inc.",
    686: "WeatherFlow, Inc.",
    687: "Technicolor USA Inc.",
    688: "Bestechnic(Shanghai),Ltd",
    689: "Raden Inc",
    690: "JouZen Oy",
    691: "CLABER S.P.A.",
    692: "Hyginex, Inc.",
    693: "HANSHIN ELECTRIC RAILWAY CO.,LTD.",
    694: "Schneider Electric",
    695: "Oort Technologies LLC",
    696: "Chrono Therapeutics",
    697: "Rinnai Corporation",
    698: "Swissprime Technologies AG",
    699: "Koha.,Co.Ltd",
    700: "Genevac Ltd",
    701: "Chemtronics",
    702: "Seguro Technology Sp. z o.o.",
    703: "Redbird Flight Simulations",
    704: "Dash Robotics",
    705: "LINE Corporation",
    706: "Guillemot Corporation",
    707: "Techtronic Power Tools Technology Limited",
    708: "Wilson Sporting Goods",
    709: "Lenovo (Singapore) Pte Ltd. ( )",
    710: "Ayatan Sensors",
    711: "Electronics Tomorrow Limited",
    712: "VASCO Data Security International, Inc.",
    713: "PayRange Inc.",
    714: "ABOV Semiconductor",
    715: "AINA-Wireless Inc.",
    716: "Eijkelkamp Soil & Water",
    717: "BMA ergonomics b.v.",
    718: "Teva Branded Pharmaceutical Products R&D, Inc.",
    719: "Anima",
    720: "3M",
    721: "Empatica Srl",
    722: "Afero, Inc.",
    723: "Powercast Corporation",
    724: "Secuyou ApS",
    725: "OMRON Corporation",
    726: "Send Solutions",
    727: "NIPPON SYSTEMWARE CO.,LTD.",
    728: "Neosfar",
    729: "Fliegl Agrartechnik GmbH",
    730: "Gilvader",
    731: "Digi International Inc (R)",
    732: "DeWalch Technologies, Inc.",
    733: "Flint Rehabilitation Devices, LLC",
    734: "Samsung SDS Co., Ltd.",
    735: "Blur Product Development",
    736: "University of Michigan",
    737: "Victron Energy BV",
    738: "NTT docomo",
    739: "Carmanah Technologies Corp.",
    740: "Bytestorm Ltd.",
    741: "Espressif Incorporated ( () )",
    742: "Unwire",
    743: "Connected Yard, Inc.",
    744: "American Music Environments",
    745: "Sensogram Technologies, Inc.",
    746: "Fujitsu Limited",
    747: "Ardic Technology",
    748: "Delta Systems, Inc",
    749: "HTC Corporation",
    750: "Citizen Holdings Co., Ltd.",
    751: "SMART-INNOVATION.inc",
    752: "Blackrat Software",
    753: "The Idea Cave, LLC",
    754: "GoPro, Inc.",
    755: "AuthAir, Inc",
    756: "Vensi, Inc.",
    757: "Indagem Tech LLC",
    758: "Intemo Technologies",
    759: "DreamVisions co., Ltd.",
    760: "Runteq Oy Ltd",
    761: "IMAGINATION TECHNOLOGIES LTD",
    762: "CoSTAR TEchnologies",
    763: "Clarius Mobile Health Corp.",
    764: "Shanghai Frequen Microelectronics Co., Ltd.",
    765: "Uwanna, Inc.",
    766: "Lierda Science & Technology Group Co., Ltd.",
    767: "Silicon Laboratories",
    768: "World Moto Inc.",
    769: "Giatec Scientific Inc.",
    770: "Loop Devices, Inc",
    771: "IACA electronique",
    772: "Martians Inc",
    773: "Swipp ApS",
    774: "Life Laboratory Inc.",
    775: "FUJI INDUSTRIAL CO.,LTD.",
    776: "Surefire, LLC",
    777: "Dolby Labs",
    778: "Ellisys",
    779: "Magnitude Lighting Converters",
    780: "Hilti AG",
    781: "Devdata S.r.l.",
    782: "Deviceworx",
    783: "Shortcut Labs",
    784: "SGL Italia S.r.l.",
    785: "PEEQ DATA",
    786: "Ducere Technologies Pvt Ltd",
    787: "DiveNav, Inc.",
    788: "RIIG AI Sp. z o.o.",
    789: "Thermo Fisher Scientific",
    790: "AG Measurematics Pvt. Ltd.",
    791: "CHUO Electronics CO., LTD.",
    792: "Aspenta International",
    793: "Eugster Frismag AG",
    794: "Amber wireless GmbH",
    795: "HQ Inc",
    796: "Lab Sensor Solutions",
    797: "Enterlab ApS",
    798: "Eyefi, Inc.",
    799: "MetaSystem S.p.A.",
    800: "SONO ELECTRONICS. CO., LTD",
    801: "Jewelbots",
    802: "Compumedics Limited",
    803: "Rotor Bike Components",
    804: "Astro, Inc.",
    805: "Amotus Solutions",
    806: "Healthwear Technologies (Changzhou)Ltd",
    807: "Essex Electronics",
    808: "Grundfos A/S",
    809: "Eargo, Inc.",
    810: "Electronic Design Lab",
    811: "ESYLUX",
    812: "NIPPON SMT.CO.,Ltd",
    813: "BM innovations GmbH",
    814: "indoormap",
    815: "OttoQ Inc",
    816: "North Pole Engineering",
    817: "3flares Technologies Inc.",
    818: "Electrocompaniet A.S.",
    819: "Mul-T-Lock",
    820: "Corentium AS",
    821: "Enlighted Inc",
    822: "GISTIC",
    823: "AJP2 Holdings, LLC",
    824: "COBI GmbH",
    825: "Blue Sky Scientific, LLC",
    826: "Appception, Inc.",
    827: "Courtney Thorne Limited",
    828: "Virtuosys",
    829: "TPV Technology Limited",
    830: "Monitra SA",
    831: "Automation Components, Inc.",
    832: "Letsense s.r.l.",
    833: "Etesian Technologies LLC",
    834: "GERTEC BRASIL LTDA.",
    835: "Drekker Development Pty. Ltd.",
    836: "Whirl Inc",
    837: "Locus Positioning",
    838: "Acuity Brands Lighting, Inc",
    839: "Prevent Biometrics",
    840: "Arioneo",
    841: "VersaMe",
    842: "Vaddio",
    843: "Libratone A/S",
    844: "HM Electronics, Inc.",
    845: "TASER International, Inc.",
    846: "SafeTrust Inc.",
    847: "Heartland Payment Systems",
    848: "Bitstrata Systems Inc.",
    849: "Pieps GmbH",
    850: "iRiding(Xiamen)Technology Co.,Ltd.",
    851: "Alpha Audiotronics, Inc.",
    852: "TOPPAN FORMS CO.,LTD.",
    853: "Sigma Designs, Inc.",
    854: "Spectrum Brands, Inc.",
    855: "Polymap Wireless",
    856: "MagniWare Ltd.",
    857: "Novotec Medical GmbH",
    858: "Medicom Innovation Partner a/s",
    859: "Matrix Inc.",
    860: "Eaton Corporation",
    861: "KYS",
    862: "Naya Health, Inc.",
    863: "Acromag",
    864: "Insulet Corporation",
    865: "Wellinks Inc.",
    866: "ON Semiconductor",
    867: "FREELAP SA",
    868: "Favero Electronics Srl",
    869: "BioMech Sensor LLC",
    870: "BOLTT Sports technologies Private limited",
    871: "Saphe International",
    872: "Metormote AB",
    873: "littleBits",
    874: "SetPoint Medical",
    875: "BRControls Products BV",
    876: "Zipcar",
    877: "AirBolt Pty Ltd",
    878: "KeepTruckin Inc",
    879: "Motiv, Inc.",
    880: "Wazombi Labs O",
    881: "ORBCOMM",
    882: "Nixie Labs, Inc.",
    883: "AppNearMe Ltd",
    884: "Holman Industries",
    885: "Expain AS",
    886: "Electronic Temperature Instruments Ltd",
    887: "Plejd AB",
    888: "Propeller Health",
    889: "Shenzhen iMCO Electronic Technology Co.,Ltd",
    890: "Algoria",
    891: "Apption Labs Inc.",
    892: "Cronologics Corporation",
    893: "MICRODIA Ltd.",
    894: "lulabytes S.L.",
    895: "Nestec S.A.",
    896: "LLC MEGA - F service",
    897: "Sharp Corporation",
    898: "Precision Outcomes Ltd",
    899: "Kronos Incorporated",
    900: "OCOSMOS Co., Ltd.",
    901: "Embedded Electronic Solutions Ltd. dba e2Solutions",
    902: "Aterica Inc.",
    903: "BluStor PMC, Inc.",
    904: "Kapsch TrafficCom AB",
    905: "ActiveBlu Corporation",
    906: "Kohler Mira Limited",
    907: "Noke",
    908: "Appion Inc.",
    909: "Resmed Ltd",
    910: "Crownstone B.V.",
    911: "Xiaomi Inc.",
    912: "INFOTECH s.r.o.",
    913: "Thingsquare AB",
    914: "T&D",
    915: "LAVAZZA S.p.A.",
    916: "Netclearance Systems, Inc.",
    917: "SDATAWAY",
    918: "BLOKS GmbH",
    919: "LEGO System A/S",
    920: "Thetatronics Ltd",
    921: "Nikon Corporation",
    922: "NeST",
    923: "South Silicon Valley Microelectronics",
    924: "ALE International",
    925: "CareView Communications, Inc.",
    926: "SchoolBoard Limited",
    927: "Molex Corporation",
    928: "IVT Wireless Limited",
    929: "Alpine Labs LLC",
    930: "Candura Instruments",
    931: "SmartMovt Technology Co., Ltd",
    932: "Token Zero Ltd",
    933: "ACE CAD Enterprise Co., Ltd. (ACECAD)",
    934: "Medela, Inc",
    935: "AeroScout",
    936: "Esrille Inc.",
    937: "THINKERLY SRL",
    938: "Exon Sp. z o.o.",
    939: "Meizu Technology Co., Ltd.",
    940: "Smablo LTD",
    941: "XiQ",
    942: "Allswell Inc.",
    943: "Comm-N-Sense Corp DBA Verigo",
    944: "VIBRADORM GmbH",
    945: "Otodata Wireless Network Inc.",
    946: "Propagation Systems Limited",
    947: "Midwest Instruments & Controls",
    948: "Alpha Nodus, inc.",
    949: "petPOMM, Inc",
    950: "Mattel",
    951: "Airbly Inc.",
    952: "A-Safe Limited",
    953: "FREDERIQUE CONSTANT SA",
    954: "Maxscend Microelectronics Company Limited",
    955: "Abbott Diabetes Care",
    956: "ASB Bank Ltd",
    957: "amadas",
    958: "Applied Science, Inc.",
    959: "iLumi Solutions Inc.",
    960: "Arch Systems Inc.",
    961: "Ember Technologies, Inc.",
    962: "Snapchat Inc",
    963: "Casambi Technologies Oy",
    964: "Pico Technology Inc.",
    965: "St. Jude Medical, Inc.",
    966: "Intricon",
    967: "Structural Health Systems, Inc.",
    968: "Avvel International",
    969: "Gallagher Group",
    970: "In2things Automation Pvt. Ltd.",
    971: "SYSDEV Srl",
    972: "Vonkil Technologies Ltd",
    973: "Wynd Technologies, Inc.",
    974: "CONTRINEX S.A.",
    975: "MIRA, Inc.",
    976: "Watteam Ltd",
    977: "Density Inc.",
    978: "IOT Pot India Private Limited",
    979: "Sigma Connectivity AB",
    980: "PEG PEREGO SPA",
    981: "Wyzelink Systems Inc.",
    982: "Yota Devices LTD",
    983: "FINSECUR",
    984: "Zen-Me Labs Ltd",
    985: "3IWare Co., Ltd.",
    986: "EnOcean GmbH",
    987: "Instabeat, Inc",
    988: "Nima Labs",
    989: "Andreas Stihl AG & Co. KG",
    990: "Nathan Rhoades LLC",
    991: "Grob Technologies, LLC",
    992: "Actions (Zhuhai) Technology Co., Limited",
    993: "SPD Development Company Ltd",
    994: "Sensoan Oy",
    995: "Qualcomm Life Inc",
    996: "Chip-ing AG",
    997: "ffly4u",
    998: "IoT Instruments Oy",
    999: "TRUE Fitness Technology",
    1000: "Reiner Kartengeraete GmbH & Co. KG.",
    1001: "SHENZHEN LEMONJOY TECHNOLOGY CO., LTD.",
    1002: "Hello Inc.",
    1003: "Evollve Inc.",
    1004: "Jigowatts Inc.",
    1005: "BASIC MICRO.COM,INC.",
    1006: "CUBE TECHNOLOGIES",
    1007: "foolography GmbH",
    1008: "CLINK",
    1009: "Hestan Smart Cooking Inc.",
    1010: "WindowMaster A/S",
    1011: "Flowscape AB",
    1012: "PAL Technologies Ltd",
    1013: "WHERE, Inc.",
    1014: "Iton Technology Corp.",
    1015: "Owl Labs Inc.",
    1016: "Rockford Corp.",
    1017: "Becon Technologies Co.,Ltd.",
    1018: "Vyassoft Technologies Inc",
    1019: "Nox Medical",
    1020: "Kimberly-Clark",
    1021: "Trimble Navigation Ltd.",
    1022: "Littelfuse",
    1023: "Withings",
    1024: "i-developer IT Beratung UG",
    1026: "Sears Holdings Corporation",
    1027: "Gantner Electronic GmbH",
    1028: "Authomate Inc",
    1029: "Vertex International, Inc.",
    1030: "Airtago",
    1031: "Swiss Audio SA",
    1032: "ToGetHome Inc.",
    1033: "AXIS",
    1034: "Openmatics",
    1035: "Jana Care Inc.",
    1036: "Senix Corporation",
    1037: "NorthStar Battery Company, LLC",
    1038: "SKF (U.K.) Limited",
    1039: "CO-AX Technology, Inc.",
    1040: "Fender Musical Instruments",
    1041: "Luidia Inc",
    1042: "SEFAM",
    1043: "Wireless Cables Inc",
    1044: "Lightning Protection International Pty Ltd",
    1045: "Uber Technologies Inc",
    1046: "SODA GmbH",
    1047: "Fatigue Science",
    1048: "Alpine Electronics Inc.",
    1049: "Novalogy LTD",
    1050: "Friday Labs Limited",
    1051: "OrthoAccel Technologies",
    1052: "WaterGuru, Inc.",
    1053: "Benning Elektrotechnik und Elektronik GmbH & Co. KG",
    1054: "Dell Computer Corporation",
    1055: "Kopin Corporation",
    1056: "TecBakery GmbH",
    1057: "Backbone Labs, Inc.",
    1058: "DELSEY SA",
    1059: "Chargifi Limited",
    1060: "Trainesense Ltd.",
    1061: "Unify Software and Solutions GmbH & Co. KG",
    1062: "Husqvarna AB",
    1063: "Focus fleet and fuel management inc",
    1064: "SmallLoop, LLC",
    1065: "Prolon Inc.",
    1066: "BD Medical",
    1067: "iMicroMed Incorporated",
    1068: "Ticto N.V.",
    1069: "Meshtech AS",
    1070: "MemCachier Inc.",
    1071: "Danfoss A/S",
    1072: "SnapStyk Inc.",
    1073: "Amyway Corporation",
    1074: "Silk Labs, Inc.",
    1075: "Pillsy Inc.",
    1076: "Hatch Baby, Inc.",
    1077: "Blocks Wearables Ltd.",
    1078: "Drayson Technologies (Europe) Limited",
    1079: "eBest IOT Inc.",
    1080: "Helvar Ltd",
    1081: "Radiance Technologies",
    1082: "Nuheara Limited",
    1083: "Appside co., ltd.",
    1084: "DeLaval",
    1085: "Coiler Corporation",
    1086: "Thermomedics, Inc.",
    1087: "Tentacle Sync GmbH",
    1088: "Valencell, Inc.",
    1089: "iProtoXi Oy",
    1090: "SECOM CO., LTD.",
    1091: "Tucker International LLC",
    1092: "Metanate Limited",
    1093: "Kobian Canada Inc.",
    1094: "NETGEAR, Inc.",
    1095: "Fabtronics Australia Pty Ltd",
    1096: "Grand Centrix GmbH",
    1097: "1UP USA.com llc",
    1098: "SHIMANO INC.",
    1099: "Nain Inc.",
    1100: "LifeStyle Lock, LLC",
    1101: "VEGA Grieshaber KG",
    1102: "Xtrava Inc.",
    1103: "TTS Tooltechnic Systems AG & Co. KG",
    1104: "Teenage Engineering AB",
    1105: "Tunstall Nordic AB",
    1106: "Svep Design Center AB",
    1107: "GreenPeak Technologies BV",
    1108: "Sphinx Electronics GmbH & Co KG",
    1109: "Atomation",
    1110: "Nemik Consulting Inc",
    1111: "RF INNOVATION",
    1112: "Mini Solution Co., Ltd.",
    1113: "Lumenetix, Inc",
    1114: "2048450 Ontario Inc",
    1115: "SPACEEK LTD",
    1116: "Delta T Corporation",
    1117: "Boston Scientific Corporation",
    1118: "Nuviz, Inc.",
    1119: "Real Time Automation, Inc.",
    1120: "Kolibree",
    1121: "vhf elektronik GmbH",
    1122: "Bonsai Systems GmbH",
    1123: "Fathom Systems Inc.",
    1124: "Bellman & Symfon",
    1125: "International Forte Group LLC",
    1126: "CycleLabs Solutions inc.",
    1127: "Codenex Oy",
    1128: "Kynesim Ltd",
    1129: "Palago AB",
    1130: "INSIGMA INC.",
    1131: "PMD Solutions",
    1132: "Qingdao Realtime Technology Co., Ltd.",
    1133: "BEGA Gantenbrink-Leuchten KG",
    1134: "Pambor Ltd.",
    65535: "SPECIAL USE/DEFAULT"
  };
});

// node_modules/systeminformation/lib/bluetooth.js
var require_bluetooth = __commonJS((exports) => {
  var exec = __require("child_process").exec;
  var execSync = __require("child_process").execSync;
  var path = __require("path");
  var util = require_util();
  var bluetoothVendors = require_bluetoothVendors();
  var fs = __require("fs");
  var _platform = process.platform;
  var _linux = _platform === "linux" || _platform === "android";
  var _darwin = _platform === "darwin";
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  function parseBluetoothType(str) {
    let result2 = "";
    if (str.indexOf("keyboard") >= 0) {
      result2 = "Keyboard";
    }
    if (str.indexOf("mouse") >= 0) {
      result2 = "Mouse";
    }
    if (str.indexOf("trackpad") >= 0) {
      result2 = "Trackpad";
    }
    if (str.indexOf("audio") >= 0) {
      result2 = "Audio";
    }
    if (str.indexOf("sound") >= 0) {
      result2 = "Audio";
    }
    if (str.indexOf("microph") >= 0) {
      result2 = "Microphone";
    }
    if (str.indexOf("speaker") >= 0) {
      result2 = "Speaker";
    }
    if (str.indexOf("headset") >= 0) {
      result2 = "Headset";
    }
    if (str.indexOf("phone") >= 0) {
      result2 = "Phone";
    }
    if (str.indexOf("macbook") >= 0) {
      result2 = "Computer";
    }
    if (str.indexOf("imac") >= 0) {
      result2 = "Computer";
    }
    if (str.indexOf("ipad") >= 0) {
      result2 = "Tablet";
    }
    if (str.indexOf("watch") >= 0) {
      result2 = "Watch";
    }
    if (str.indexOf("headphone") >= 0) {
      result2 = "Headset";
    }
    return result2;
  }
  function parseBluetoothManufacturer(str) {
    let result2 = str.split(" ")[0];
    str = str.toLowerCase();
    if (str.indexOf("apple") >= 0) {
      result2 = "Apple";
    }
    if (str.indexOf("ipad") >= 0) {
      result2 = "Apple";
    }
    if (str.indexOf("imac") >= 0) {
      result2 = "Apple";
    }
    if (str.indexOf("iphone") >= 0) {
      result2 = "Apple";
    }
    if (str.indexOf("magic mouse") >= 0) {
      result2 = "Apple";
    }
    if (str.indexOf("magic track") >= 0) {
      result2 = "Apple";
    }
    if (str.indexOf("macbook") >= 0) {
      result2 = "Apple";
    }
    return result2;
  }
  function parseBluetoothVendor(str) {
    const id = parseInt(str);
    if (!isNaN(id))
      return bluetoothVendors[id];
  }
  function parseLinuxBluetoothInfo(lines, macAddr1, macAddr2) {
    const result2 = {};
    result2.device = null;
    result2.name = util.getValue(lines, "name", "=");
    result2.manufacturer = null;
    result2.macDevice = macAddr1;
    result2.macHost = macAddr2;
    result2.batteryPercent = null;
    result2.type = parseBluetoothType(result2.name.toLowerCase());
    result2.connected = false;
    return result2;
  }
  function parseDarwinBluetoothDevices(bluetoothObject, macAddr2) {
    const result2 = {};
    const typeStr = ((bluetoothObject.device_minorClassOfDevice_string || bluetoothObject.device_majorClassOfDevice_string || bluetoothObject.device_minorType || "") + (bluetoothObject.device_name || "")).toLowerCase();
    result2.device = bluetoothObject.device_services || "";
    result2.name = bluetoothObject.device_name || "";
    result2.manufacturer = bluetoothObject.device_manufacturer || parseBluetoothVendor(bluetoothObject.device_vendorID) || parseBluetoothManufacturer(bluetoothObject.device_name || "") || "";
    result2.macDevice = (bluetoothObject.device_addr || bluetoothObject.device_address || "").toLowerCase().replace(/-/g, ":");
    result2.macHost = macAddr2;
    result2.batteryPercent = bluetoothObject.device_batteryPercent || null;
    result2.type = parseBluetoothType(typeStr);
    result2.connected = bluetoothObject.device_isconnected === "attrib_Yes" || false;
    return result2;
  }
  function parseWindowsBluetooth(lines) {
    const result2 = {};
    result2.device = null;
    result2.name = util.getValue(lines, "name", ":");
    result2.manufacturer = util.getValue(lines, "manufacturer", ":");
    result2.macDevice = null;
    result2.macHost = null;
    result2.batteryPercent = null;
    result2.type = parseBluetoothType(result2.name.toLowerCase());
    result2.connected = null;
    return result2;
  }
  function bluetoothDevices(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let result2 = [];
        if (_linux) {
          const btFiles = util.getFilesInPath("/var/lib/bluetooth/");
          btFiles.forEach((element) => {
            const filename = path.basename(element);
            const pathParts = element.split("/");
            const macAddr1 = pathParts.length >= 6 ? pathParts[pathParts.length - 2] : null;
            const macAddr2 = pathParts.length >= 7 ? pathParts[pathParts.length - 3] : null;
            if (filename === "info") {
              const infoFile = fs.readFileSync(element, { encoding: "utf8" }).split(`
`);
              result2.push(parseLinuxBluetoothInfo(infoFile, macAddr1, macAddr2));
            }
          });
          try {
            const hdicon = execSync("hcitool con", util.execOptsLinux).toString().toLowerCase();
            for (let i = 0;i < result2.length; i++) {
              if (result2[i].macDevice && result2[i].macDevice.length > 10 && hdicon.indexOf(result2[i].macDevice.toLowerCase()) >= 0) {
                result2[i].connected = true;
              }
            }
          } catch {
            util.noop();
          }
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        }
        if (_darwin) {
          let cmd = "system_profiler SPBluetoothDataType -json";
          exec(cmd, (error2, stdout) => {
            if (!error2) {
              try {
                const outObj = JSON.parse(stdout.toString());
                if (outObj.SPBluetoothDataType && outObj.SPBluetoothDataType.length && outObj.SPBluetoothDataType[0] && outObj.SPBluetoothDataType[0]["device_title"] && outObj.SPBluetoothDataType[0]["device_title"].length) {
                  let macAddr2 = null;
                  if (outObj.SPBluetoothDataType[0]["local_device_title"] && outObj.SPBluetoothDataType[0].local_device_title.general_address) {
                    macAddr2 = outObj.SPBluetoothDataType[0].local_device_title.general_address.toLowerCase().replace(/-/g, ":");
                  }
                  outObj.SPBluetoothDataType[0]["device_title"].forEach((element) => {
                    const obj = element;
                    const objKey = Object.keys(obj);
                    if (objKey && objKey.length === 1) {
                      const innerObject = obj[objKey[0]];
                      innerObject.device_name = objKey[0];
                      const bluetoothDevice = parseDarwinBluetoothDevices(innerObject, macAddr2);
                      result2.push(bluetoothDevice);
                    }
                  });
                }
                if (outObj.SPBluetoothDataType && outObj.SPBluetoothDataType.length && outObj.SPBluetoothDataType[0] && outObj.SPBluetoothDataType[0]["device_connected"] && outObj.SPBluetoothDataType[0]["device_connected"].length) {
                  const macAddr2 = outObj.SPBluetoothDataType[0].controller_properties && outObj.SPBluetoothDataType[0].controller_properties.controller_address ? outObj.SPBluetoothDataType[0].controller_properties.controller_address.toLowerCase().replace(/-/g, ":") : null;
                  outObj.SPBluetoothDataType[0]["device_connected"].forEach((element) => {
                    const obj = element;
                    const objKey = Object.keys(obj);
                    if (objKey && objKey.length === 1) {
                      const innerObject = obj[objKey[0]];
                      innerObject.device_name = objKey[0];
                      innerObject.device_isconnected = "attrib_Yes";
                      const bluetoothDevice = parseDarwinBluetoothDevices(innerObject, macAddr2);
                      result2.push(bluetoothDevice);
                    }
                  });
                }
                if (outObj.SPBluetoothDataType && outObj.SPBluetoothDataType.length && outObj.SPBluetoothDataType[0] && outObj.SPBluetoothDataType[0]["device_not_connected"] && outObj.SPBluetoothDataType[0]["device_not_connected"].length) {
                  const macAddr2 = outObj.SPBluetoothDataType[0].controller_properties && outObj.SPBluetoothDataType[0].controller_properties.controller_address ? outObj.SPBluetoothDataType[0].controller_properties.controller_address.toLowerCase().replace(/-/g, ":") : null;
                  outObj.SPBluetoothDataType[0]["device_not_connected"].forEach((element) => {
                    const obj = element;
                    const objKey = Object.keys(obj);
                    if (objKey && objKey.length === 1) {
                      const innerObject = obj[objKey[0]];
                      innerObject.device_name = objKey[0];
                      innerObject.device_isconnected = "attrib_No";
                      const bluetoothDevice = parseDarwinBluetoothDevices(innerObject, macAddr2);
                      result2.push(bluetoothDevice);
                    }
                  });
                }
              } catch {
                util.noop();
              }
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_windows) {
          util.powerShell("Get-CimInstance Win32_PNPEntity | select PNPClass, Name, Manufacturer, Status, Service, ConfigManagerErrorCode, Present | fl").then((stdout, error2) => {
            if (!error2) {
              const parts = stdout.toString().split(/\n\s*\n/);
              parts.forEach((part) => {
                const lines = part.split(`
`);
                const service = util.getValue(lines, "Service", ":");
                const errorCode = util.getValue(lines, "ConfigManagerErrorCode", ":");
                const pnpClass = util.getValue(lines, "PNPClass", ":").toLowerCase();
                if (pnpClass === "bluetooth" && errorCode === "0" && service === "") {
                  result2.push(parseWindowsBluetooth(lines));
                }
              });
            }
            if (callback) {
              callback(result2);
            }
            resolve(result2);
          });
        }
        if (_freebsd || _netbsd || _openbsd || _sunos) {
          resolve(null);
        }
      });
    });
  }
  exports.bluetoothDevices = bluetoothDevices;
});

// node_modules/systeminformation/lib/index.js
var require_lib = __commonJS((exports) => {
  var lib_version = require_package().version;
  var util = require_util();
  var system = require_system();
  var osInfo = require_osinfo();
  var cpu = require_cpu();
  var memory = require_memory();
  var battery = require_battery();
  var graphics = require_graphics();
  var filesystem = require_filesystem();
  var network = require_network();
  var wifi = require_wifi();
  var processes = require_processes();
  var users = require_users();
  var internet = require_internet();
  var docker = require_docker();
  var vbox = require_virtualbox();
  var printer = require_printer();
  var usb = require_usb();
  var audio = require_audio();
  var bluetooth = require_bluetooth();
  var _platform = process.platform;
  var _windows = _platform === "win32";
  var _freebsd = _platform === "freebsd";
  var _openbsd = _platform === "openbsd";
  var _netbsd = _platform === "netbsd";
  var _sunos = _platform === "sunos";
  if (_windows) {
    util.getCodepage();
    util.getPowershell();
  }
  function version() {
    return lib_version;
  }
  function getStaticData(callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        const data = {};
        data.version = version();
        Promise.all([
          system.system(),
          system.bios(),
          system.baseboard(),
          system.chassis(),
          osInfo.osInfo(),
          osInfo.uuid(),
          osInfo.versions(),
          cpu.cpu(),
          cpu.cpuFlags(),
          graphics.graphics(),
          network.networkInterfaces(),
          memory.memLayout(),
          filesystem.diskLayout(),
          audio.audio(),
          bluetooth.bluetoothDevices(),
          usb.usb(),
          printer.printer()
        ]).then((res) => {
          data.system = res[0];
          data.bios = res[1];
          data.baseboard = res[2];
          data.chassis = res[3];
          data.os = res[4];
          data.uuid = res[5];
          data.versions = res[6];
          data.cpu = res[7];
          data.cpu.flags = res[8];
          data.graphics = res[9];
          data.net = res[10];
          data.memLayout = res[11];
          data.diskLayout = res[12];
          data.audio = res[13];
          data.bluetooth = res[14];
          data.usb = res[15];
          data.printer = res[16];
          if (callback) {
            callback(data);
          }
          resolve(data);
        });
      });
    });
  }
  function getDynamicData(srv, iface, callback) {
    if (util.isFunction(iface)) {
      callback = iface;
      iface = "";
    }
    if (util.isFunction(srv)) {
      callback = srv;
      srv = "";
    }
    return new Promise((resolve) => {
      process.nextTick(() => {
        iface = iface || network.getDefaultNetworkInterface();
        srv = srv || "";
        let functionProcessed = (() => {
          let totalFunctions = 15;
          if (_windows) {
            totalFunctions = 13;
          }
          if (_freebsd || _openbsd || _netbsd) {
            totalFunctions = 11;
          }
          if (_sunos) {
            totalFunctions = 6;
          }
          return function() {
            if (--totalFunctions === 0) {
              if (callback) {
                callback(data);
              }
              resolve(data);
            }
          };
        })();
        const data = {};
        data.time = osInfo.time();
        data.node = process.versions.node;
        data.v8 = process.versions.v8;
        cpu.cpuCurrentSpeed().then((res) => {
          data.cpuCurrentSpeed = res;
          functionProcessed();
        });
        users.users().then((res) => {
          data.users = res;
          functionProcessed();
        });
        processes.processes().then((res) => {
          data.processes = res;
          functionProcessed();
        });
        cpu.currentLoad().then((res) => {
          data.currentLoad = res;
          functionProcessed();
        });
        if (!_sunos) {
          cpu.cpuTemperature().then((res) => {
            data.temp = res;
            functionProcessed();
          });
        }
        if (!_openbsd && !_freebsd && !_netbsd && !_sunos) {
          network.networkStats(iface).then((res) => {
            data.networkStats = res;
            functionProcessed();
          });
        }
        if (!_sunos) {
          network.networkConnections().then((res) => {
            data.networkConnections = res;
            functionProcessed();
          });
        }
        memory.mem().then((res) => {
          data.mem = res;
          functionProcessed();
        });
        if (!_sunos) {
          battery().then((res) => {
            data.battery = res;
            functionProcessed();
          });
        }
        if (!_sunos) {
          processes.services(srv).then((res) => {
            data.services = res;
            functionProcessed();
          });
        }
        if (!_sunos) {
          filesystem.fsSize().then((res) => {
            data.fsSize = res;
            functionProcessed();
          });
        }
        if (!_windows && !_openbsd && !_freebsd && !_netbsd && !_sunos) {
          filesystem.fsStats().then((res) => {
            data.fsStats = res;
            functionProcessed();
          });
        }
        if (!_windows && !_openbsd && !_freebsd && !_netbsd && !_sunos) {
          filesystem.disksIO().then((res) => {
            data.disksIO = res;
            functionProcessed();
          });
        }
        if (!_openbsd && !_freebsd && !_netbsd && !_sunos) {
          wifi.wifiNetworks().then((res) => {
            data.wifiNetworks = res;
            functionProcessed();
          });
        }
        internet.inetLatency().then((res) => {
          data.inetLatency = res;
          functionProcessed();
        });
      });
    });
  }
  function getAllData(srv, iface, callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        let data = {};
        if (iface && util.isFunction(iface) && !callback) {
          callback = iface;
          iface = "";
        }
        if (srv && util.isFunction(srv) && !iface && !callback) {
          callback = srv;
          srv = "";
          iface = "";
        }
        getStaticData().then((res) => {
          data = res;
          getDynamicData(srv, iface).then((res2) => {
            for (let key in res2) {
              if ({}.hasOwnProperty.call(res2, key)) {
                data[key] = res2[key];
              }
            }
            if (callback) {
              callback(data);
            }
            resolve(data);
          });
        });
      });
    });
  }
  function get(valueObject, callback) {
    return new Promise((resolve) => {
      process.nextTick(() => {
        const allPromises = Object.keys(valueObject).filter((func) => ({}).hasOwnProperty.call(exports, func)).map((func) => {
          const params = valueObject[func].substring(valueObject[func].lastIndexOf("(") + 1, valueObject[func].lastIndexOf(")"));
          let funcWithoutParams = func.indexOf(")") >= 0 ? func.split(")")[1].trim() : func;
          funcWithoutParams = func.indexOf("|") >= 0 ? func.split("|")[0].trim() : funcWithoutParams;
          if (params) {
            return exports[funcWithoutParams](params);
          } else {
            return exports[funcWithoutParams]("");
          }
        });
        Promise.all(allPromises).then((data) => {
          const result2 = {};
          let i = 0;
          for (let key in valueObject) {
            if ({}.hasOwnProperty.call(valueObject, key) && {}.hasOwnProperty.call(exports, key) && data.length > i) {
              if (valueObject[key] === "*" || valueObject[key] === "all") {
                result2[key] = data[i];
              } else {
                let keys = valueObject[key];
                let filter = "";
                let filterParts = [];
                if (keys.indexOf(")") >= 0) {
                  keys = keys.split(")")[1].trim();
                }
                if (keys.indexOf("|") >= 0) {
                  filter = keys.split("|")[1].trim();
                  filterParts = filter.split(":");
                  keys = keys.split("|")[0].trim();
                }
                keys = keys.replace(/,/g, " ").replace(/ +/g, " ").split(" ");
                if (data[i]) {
                  if (Array.isArray(data[i])) {
                    const partialArray = [];
                    data[i].forEach((element) => {
                      let partialRes = {};
                      if (keys.length === 1 && (keys[0] === "*" || keys[0] === "all")) {
                        partialRes = element;
                      } else {
                        keys.forEach((k) => {
                          if ({}.hasOwnProperty.call(element, k)) {
                            partialRes[k] = element[k];
                          }
                        });
                      }
                      if (filter && filterParts.length === 2) {
                        if ({}.hasOwnProperty.call(partialRes, filterParts[0].trim())) {
                          const val = partialRes[filterParts[0].trim()];
                          if (typeof val === "number") {
                            if (val === parseFloat(filterParts[1].trim())) {
                              partialArray.push(partialRes);
                            }
                          } else if (typeof val === "string") {
                            if (val.toLowerCase() === filterParts[1].trim().toLowerCase()) {
                              partialArray.push(partialRes);
                            }
                          }
                        }
                      } else {
                        partialArray.push(partialRes);
                      }
                    });
                    result2[key] = partialArray;
                  } else {
                    const partialRes = {};
                    keys.forEach((k) => {
                      if ({}.hasOwnProperty.call(data[i], k)) {
                        partialRes[k] = data[i][k];
                      }
                    });
                    result2[key] = partialRes;
                  }
                } else {
                  result2[key] = {};
                }
              }
              i++;
            }
          }
          if (callback) {
            callback(result2);
          }
          resolve(result2);
        });
      });
    });
  }
  function observe(valueObject, interval, callback) {
    let _data = null;
    const result2 = setInterval(() => {
      get(valueObject).then((data) => {
        if (JSON.stringify(_data) !== JSON.stringify(data)) {
          _data = Object.assign({}, data);
          callback(data);
        }
      });
    }, interval);
    return result2;
  }
  exports.version = version;
  exports.system = system.system;
  exports.bios = system.bios;
  exports.baseboard = system.baseboard;
  exports.chassis = system.chassis;
  exports.time = osInfo.time;
  exports.osInfo = osInfo.osInfo;
  exports.versions = osInfo.versions;
  exports.shell = osInfo.shell;
  exports.uuid = osInfo.uuid;
  exports.cpu = cpu.cpu;
  exports.cpuFlags = cpu.cpuFlags;
  exports.cpuCache = cpu.cpuCache;
  exports.cpuCurrentSpeed = cpu.cpuCurrentSpeed;
  exports.cpuTemperature = cpu.cpuTemperature;
  exports.currentLoad = cpu.currentLoad;
  exports.fullLoad = cpu.fullLoad;
  exports.mem = memory.mem;
  exports.memLayout = memory.memLayout;
  exports.battery = battery;
  exports.graphics = graphics.graphics;
  exports.fsSize = filesystem.fsSize;
  exports.fsOpenFiles = filesystem.fsOpenFiles;
  exports.blockDevices = filesystem.blockDevices;
  exports.fsStats = filesystem.fsStats;
  exports.disksIO = filesystem.disksIO;
  exports.diskLayout = filesystem.diskLayout;
  exports.networkInterfaceDefault = network.networkInterfaceDefault;
  exports.networkGatewayDefault = network.networkGatewayDefault;
  exports.networkInterfaces = network.networkInterfaces;
  exports.networkStats = network.networkStats;
  exports.networkConnections = network.networkConnections;
  exports.wifiNetworks = wifi.wifiNetworks;
  exports.wifiInterfaces = wifi.wifiInterfaces;
  exports.wifiConnections = wifi.wifiConnections;
  exports.services = processes.services;
  exports.processes = processes.processes;
  exports.processLoad = processes.processLoad;
  exports.users = users.users;
  exports.inetChecksite = internet.inetChecksite;
  exports.inetLatency = internet.inetLatency;
  exports.dockerInfo = docker.dockerInfo;
  exports.dockerImages = docker.dockerImages;
  exports.dockerContainers = docker.dockerContainers;
  exports.dockerContainerStats = docker.dockerContainerStats;
  exports.dockerContainerProcesses = docker.dockerContainerProcesses;
  exports.dockerVolumes = docker.dockerVolumes;
  exports.dockerAll = docker.dockerAll;
  exports.vboxInfo = vbox.vboxInfo;
  exports.printer = printer.printer;
  exports.usb = usb.usb;
  exports.audio = audio.audio;
  exports.bluetoothDevices = bluetooth.bluetoothDevices;
  exports.getStaticData = getStaticData;
  exports.getDynamicData = getDynamicData;
  exports.getAllData = getAllData;
  exports.get = get;
  exports.observe = observe;
  exports.powerShellStart = util.powerShellStart;
  exports.powerShellRelease = util.powerShellRelease;
});

// src/main/server.ts
import { createServer } from "node:http";

// src/main/metrics.ts
var import_systeminformation = __toESM(require_lib(), 1);

class Metrics {
  data;
  intervalMs;
  constructor() {
    this.data = { cpuLoadPercentages: [], memoryUsageMBs: [] };
    this.intervalMs = 5 * 1000;
    const intervalSecondsInput = process.env.METRICS_INTERVAL_SECONDS;
    if (intervalSecondsInput) {
      const intervalSecondsVal = parseInt(intervalSecondsInput);
      if (Number.isInteger(intervalSecondsVal)) {
        this.intervalMs = intervalSecondsVal * 1000;
      }
    }
    this.append(Date.now()).catch((error2) => {
      console.error("Failed to collect initial metrics:", error2);
    });
  }
  get() {
    return JSON.stringify(this.data);
  }
  async append(time) {
    try {
      const {
        currentLoadUser,
        currentLoadSystem
      } = await import_systeminformation.currentLoad();
      this.data.cpuLoadPercentages.push({
        time,
        user: currentLoadUser,
        system: currentLoadSystem
      });
      const bytesPerMB = 1024 * 1024;
      const { active, available } = await import_systeminformation.mem();
      this.data.memoryUsageMBs.push({
        time,
        used: active / bytesPerMB,
        free: available / bytesPerMB
      });
    } catch (error2) {
      console.error("Error collecting metrics:", error2);
    } finally {
      const nextTime = time + this.intervalMs;
      setTimeout(() => {
        this.append(nextTime).catch((error2) => {
          console.error("Failed to collect metrics:", error2);
        });
      }, Math.max(0, nextTime - Date.now()));
    }
  }
}

// node_modules/zod/v3/external.js
var exports_external = {};
__export(exports_external, {
  void: () => voidType,
  util: () => util,
  unknown: () => unknownType,
  union: () => unionType,
  undefined: () => undefinedType,
  tuple: () => tupleType,
  transformer: () => effectsType,
  symbol: () => symbolType,
  string: () => stringType,
  strictObject: () => strictObjectType,
  setErrorMap: () => setErrorMap,
  set: () => setType,
  record: () => recordType,
  quotelessJson: () => quotelessJson,
  promise: () => promiseType,
  preprocess: () => preprocessType,
  pipeline: () => pipelineType,
  ostring: () => ostring,
  optional: () => optionalType,
  onumber: () => onumber,
  oboolean: () => oboolean,
  objectUtil: () => objectUtil,
  object: () => objectType,
  number: () => numberType,
  nullable: () => nullableType,
  null: () => nullType,
  never: () => neverType,
  nativeEnum: () => nativeEnumType,
  nan: () => nanType,
  map: () => mapType,
  makeIssue: () => makeIssue,
  literal: () => literalType,
  lazy: () => lazyType,
  late: () => late,
  isValid: () => isValid,
  isDirty: () => isDirty,
  isAsync: () => isAsync,
  isAborted: () => isAborted,
  intersection: () => intersectionType,
  instanceof: () => instanceOfType,
  getParsedType: () => getParsedType,
  getErrorMap: () => getErrorMap,
  function: () => functionType,
  enum: () => enumType,
  effect: () => effectsType,
  discriminatedUnion: () => discriminatedUnionType,
  defaultErrorMap: () => en_default,
  datetimeRegex: () => datetimeRegex,
  date: () => dateType,
  custom: () => custom,
  coerce: () => coerce,
  boolean: () => booleanType,
  bigint: () => bigIntType,
  array: () => arrayType,
  any: () => anyType,
  addIssueToContext: () => addIssueToContext,
  ZodVoid: () => ZodVoid,
  ZodUnknown: () => ZodUnknown,
  ZodUnion: () => ZodUnion,
  ZodUndefined: () => ZodUndefined,
  ZodType: () => ZodType,
  ZodTuple: () => ZodTuple,
  ZodTransformer: () => ZodEffects,
  ZodSymbol: () => ZodSymbol,
  ZodString: () => ZodString,
  ZodSet: () => ZodSet,
  ZodSchema: () => ZodType,
  ZodRecord: () => ZodRecord,
  ZodReadonly: () => ZodReadonly,
  ZodPromise: () => ZodPromise,
  ZodPipeline: () => ZodPipeline,
  ZodParsedType: () => ZodParsedType,
  ZodOptional: () => ZodOptional,
  ZodObject: () => ZodObject,
  ZodNumber: () => ZodNumber,
  ZodNullable: () => ZodNullable,
  ZodNull: () => ZodNull,
  ZodNever: () => ZodNever,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNaN: () => ZodNaN,
  ZodMap: () => ZodMap,
  ZodLiteral: () => ZodLiteral,
  ZodLazy: () => ZodLazy,
  ZodIssueCode: () => ZodIssueCode,
  ZodIntersection: () => ZodIntersection,
  ZodFunction: () => ZodFunction,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodError: () => ZodError,
  ZodEnum: () => ZodEnum,
  ZodEffects: () => ZodEffects,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodDefault: () => ZodDefault,
  ZodDate: () => ZodDate,
  ZodCatch: () => ZodCatch,
  ZodBranded: () => ZodBranded,
  ZodBoolean: () => ZodBoolean,
  ZodBigInt: () => ZodBigInt,
  ZodArray: () => ZodArray,
  ZodAny: () => ZodAny,
  Schema: () => ZodType,
  ParseStatus: () => ParseStatus,
  OK: () => OK,
  NEVER: () => NEVER,
  INVALID: () => INVALID,
  EMPTY_PATH: () => EMPTY_PATH,
  DIRTY: () => DIRTY,
  BRAND: () => BRAND
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {};
  function assertIs(_arg) {}
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error;
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};

class ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error2) => {
      for (const issue of error2.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
}
ZodError.create = (issues) => {
  const error2 = new ZodError(issues);
  return error2;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== undefined) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      overrideMap,
      overrideMap === en_default ? undefined : en_default
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}

class ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
}
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
class ParseInputLazyPath {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
}
var handleResult = (ctx, result2) => {
  if (isValid(result2)) {
    return { success: true, data: result2.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error2 = new ZodError(ctx.common.issues);
        this._error = error2;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}

class ZodType {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus,
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result2 = this._parse(input);
    if (isAsync(result2)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result2;
  }
  _parseAsync(input) {
    const result2 = this._parse(input);
    return Promise.resolve(result2);
  }
  parse(data, params) {
    const result2 = this.safeParse(data, params);
    if (result2.success)
      return result2.data;
    throw result2.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result2 = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result2);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result2 = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result2) ? {
          value: result2.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result2) => isValid(result2) ? {
      value: result2.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result2 = await this.safeParseAsync(data, params);
    if (result2.success)
      return result2.data;
    throw result2.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result2 = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result2);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result2 = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result2 instanceof Promise) {
        return result2.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result2) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(undefined).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}

class ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}

class ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
}
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};

class ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};

class ZodBoolean extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};

class ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
}
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};

class ZodSymbol extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};

class ZodUndefined extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};

class ZodNull extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};

class ZodAny extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};

class ZodUnknown extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};

class ZodNever extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
}
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};

class ZodVoid extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};

class ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : undefined,
          maximum: tooBig ? def.exactLength.value : undefined,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result3) => {
        return ParseStatus.mergeArray(status, result3);
      });
    }
    const result2 = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result2);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}

class ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {} else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== undefined ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
}
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};

class ZodUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result2 of results) {
        if (result2.result.status === "valid") {
          return result2.result;
        }
      }
      for (const result2 of results) {
        if (result2.result.status === "dirty") {
          ctx.common.issues.push(...result2.ctx.common.issues);
          return result2.result;
        }
      }
      const unionErrors = results.map((result2) => new ZodError(result2.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = undefined;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result2 = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result2.status === "valid") {
          return result2;
        } else if (result2.status === "dirty" && !dirty) {
          dirty = { result: result2, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
}
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [undefined];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [undefined, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};

class ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  static create(discriminator, options, params) {
    const optionsMap = new Map;
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
}
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0;index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}

class ZodIntersection extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
}
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};

class ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest
    });
  }
}
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};

class ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
}

class ZodMap extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = new Map;
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = new Map;
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
}
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};

class ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = new Set;
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};

class ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error2) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error2
        }
      });
    }
    function makeReturnsIssue(returns, error2) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error2
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error2 = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error2.addIssue(makeArgsIssue(args, e));
          throw error2;
        });
        const result2 = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result2, params).catch((e) => {
          error2.addIssue(makeReturnsIssue(result2, e));
          throw error2;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result2 = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result2, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result2, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
}

class ZodLazy extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
}
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};

class ZodLiteral extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
}
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}

class ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
}
ZodEnum.create = createZodEnum;

class ZodNativeEnum extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
}
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};

class ZodPromise extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
}
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};

class ZodEffects extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result2 = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result2.status === "aborted")
            return INVALID;
          if (result2.status === "dirty")
            return DIRTY(result2.value);
          if (status.value === "dirty")
            return DIRTY(result2.value);
          return result2;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result2 = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result2.status === "aborted")
          return INVALID;
        if (result2.status === "dirty")
          return DIRTY(result2.value);
        if (status.value === "dirty")
          return DIRTY(result2.value);
        return result2;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result2 = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result2);
        }
        if (result2 instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result2 = effect.transform(base.value, checkCtx);
        if (result2 instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result2 };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result2) => ({
            status: status.value,
            value: result2
          }));
        });
      }
    }
    util.assertNever(effect);
  }
}
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
class ZodOptional extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(undefined);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};

class ZodNullable extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};

class ZodDefault extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};

class ZodCatch extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result2 = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result2)) {
      return result2.then((result3) => {
        return {
          status: "valid",
          value: result3.status === "valid" ? result3.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result2.status === "valid" ? result2.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};

class ZodNaN extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
}
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");

class ZodBranded extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
}

class ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
}

class ZodReadonly extends ZodType {
  _parse(input) {
    const result2 = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result2) ? result2.then((data) => freeze(data)) : freeze(result2);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;
// src/lib.ts
var cpuLoadPercentageSchema = exports_external.object({
  time: exports_external.number().finite(),
  user: exports_external.number().finite().nonnegative().max(100),
  system: exports_external.number().finite().nonnegative().max(100)
});
var cpuLoadPercentagesSchema = exports_external.array(cpuLoadPercentageSchema);
var memoryUsageMBSchema = exports_external.object({
  time: exports_external.number().finite(),
  used: exports_external.number().finite().nonnegative(),
  free: exports_external.number().finite().nonnegative()
});
var memoryUsageMBsSchema = exports_external.array(memoryUsageMBSchema);
var metricsDataSchema = exports_external.object({
  cpuLoadPercentages: cpuLoadPercentagesSchema,
  memoryUsageMBs: memoryUsageMBsSchema
});
var serverPort = 7777;

// src/main/server.ts
async function server() {
  const metrics = new Metrics;
  const server2 = createServer((_, response) => {
    try {
      response.setHeader("Content-Type", "application/json");
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.statusCode = 200;
      response.end(metrics.get());
    } catch (error2) {
      console.error("Error handling request:", error2);
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
  server2.on("error", (error2) => {
    console.error("Server error:", error2);
  });
  server2.listen(serverPort);
}
await server();

//# debugId=B4DFD93D28CC787564756E2164756E21
//# sourceMappingURL=server.js.map
