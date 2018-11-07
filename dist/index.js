"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var fs = require("fs");
var rmrf = require("rimraf");
var request = require("request");
var path = require("path");
var progress = require("cli-progress");
var requestProgress = require("request-progress");
var prefix = require("prefix-si").prefix;
var promisify = require("es6-promisify").promisify;
var generateFilename = function (_a) {
    var name = _a.name, version = _a.version;
    return name + " [" + version + "].jar";
};
var download = function (url, filename) {
    if (url === null || url === "IGNORE") {
        console.log("Not downloading " + filename + ".");
        return;
    }
};
var formatBytes = function (b) { return prefix(b, "B"); };
var rename = promisify(fs.rename);
var readdir = promisify(fs.readdir);
exports.executeDL = function (modData, root) { return __awaiter(_this, void 0, void 0, function () {
    var mods, keep, alreadyDownloaded, contents, _i, contents_1, file, _loop_1, _a, mods_1, mod;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mods = modData.mods;
                keep = mods.map(generateFilename);
                alreadyDownloaded = [];
                return [4 /*yield*/, readdir(root)];
            case 1:
                contents = _b.sent();
                _i = 0, contents_1 = contents;
                _b.label = 2;
            case 2:
                if (!(_i < contents_1.length)) return [3 /*break*/, 6];
                file = contents_1[_i];
                if (!keep.includes(file)) return [3 /*break*/, 3];
                console.log("File " + file + " already downloaded.");
                alreadyDownloaded.push(file);
                return [3 /*break*/, 5];
            case 3:
                // Delete it otherwise
                console.log("File " + file + " not recognized; deleting.");
                return [4 /*yield*/, promisify(rmrf)(path.join(root, file))];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6:
                _loop_1 = function (mod) {
                    var filename, finalPath, tempPath, file_1, bar_1, len_1 // we need to use this value in multiple handlers
                    ;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                filename = generateFilename(mod);
                                if (!!alreadyDownloaded.includes(filename)) return [3 /*break*/, 3];
                                finalPath = path.join(root, filename);
                                tempPath = finalPath + ".temp" // download to temp file
                                ;
                                file_1 = fs.createWriteStream(tempPath);
                                bar_1 = new progress.Bar({
                                    format: "{bar} | " + mod.name + " | {percentage}% | {eta}s | {pos}/{size} | {speed}/s",
                                    etaBuffer: 20
                                }, progress.Presets.shades_classic);
                                requestProgress(request(mod.url))
                                    .on("response", function (response) {
                                    len_1 = parseInt(response.headers['content-length'], 10);
                                    bar_1.start(len_1, 0, {
                                        speed: "N/A",
                                        size: formatBytes(len_1),
                                        pos: formatBytes(0)
                                    });
                                })
                                    .on("progress", function (prog) {
                                    // Update bar with new values
                                    bar_1.update(prog.size.transferred, {
                                        speed: formatBytes(prog.speed),
                                        pos: formatBytes(prog.size.transferred)
                                    });
                                })
                                    .pipe(file_1);
                                // Wait until download complete
                                return [4 /*yield*/, new Promise(function (resolve) { return file_1.on("finish", resolve); })];
                            case 1:
                                // Wait until download complete
                                _a.sent();
                                bar_1.update(len_1, {
                                    pos: formatBytes(len_1)
                                }); // set bar to end
                                bar_1.stop();
                                return [4 /*yield*/, rename(tempPath, finalPath)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                };
                _a = 0, mods_1 = mods;
                _b.label = 7;
            case 7:
                if (!(_a < mods_1.length)) return [3 /*break*/, 10];
                mod = mods_1[_a];
                return [5 /*yield**/, _loop_1(mod)];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9:
                _a++;
                return [3 /*break*/, 7];
            case 10:
                console.log("Mod download complete. The modpack recommends Forge version " + (modData.forge || modData.forgeVersion) + ".");
                return [2 /*return*/];
        }
    });
}); };
