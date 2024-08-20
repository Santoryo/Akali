"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.tftBattlePassFetch = tftBattlePassFetch;
var league_connect_1 = require("league-connect");
var pocketbase_1 = require("../../utils/pocketbase");
require("../../utils/lol2cdragon");
var moment_1 = require("moment");
var currentPatch_1 = require("../currentPatch");
function tftBattlePassFetch(credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var temp, data, patch, checkIfExists, temp1, background, dbPass, request_1, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, league_connect_1.createHttp1Request)({
                        method: "GET",
                        url: "/lol-tft-pass/v1/battle-pass",
                    }, credentials)];
                case 1:
                    temp = _a.sent();
                    return [4 /*yield*/, temp.json()];
                case 2:
                    data = _a.sent();
                    return [4 /*yield*/, (0, pocketbase_1.admin)()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, currentPatch_1.currentPatch)(credentials)];
                case 4:
                    patch = _a.sent();
                    return [4 /*yield*/, pocketbase_1.pb.collection("tftBattlepass").getFullList({ filter: "passId=\"".concat(data.info.passId, "\"") })];
                case 5:
                    checkIfExists = _a.sent();
                    return [4 /*yield*/, (0, league_connect_1.createHttp1Request)({
                            method: "GET",
                            url: "/lol-tft/v1/tft/backgrounds",
                        }, credentials)];
                case 6:
                    temp1 = _a.sent();
                    return [4 /*yield*/, temp1.json()];
                case 7:
                    background = _a.sent();
                    Object.keys(background.backgrounds).forEach(function (key) {
                        background.backgrounds[key] = background.backgrounds[key].lol2cdragon(patch);
                    });
                    dbPass = {
                        passId: data.info.passId,
                        name: data.info.title,
                        premiumName: data.info.premiumTitle,
                        startDate: (0, moment_1.default)(data.info.startDate).format(),
                        endDate: (0, moment_1.default)(data.info.endDate).format(),
                        rewards: JSON.stringify(data.milestones),
                        backgrounds: JSON.stringify(background.backgrounds),
                    };
                    if (!(checkIfExists.length > 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, pocketbase_1.pb.collection("tftBattlepass").update(checkIfExists[0].id, dbPass)];
                case 8:
                    request_1 = _a.sent();
                    console.log("Updated battle pass entry with ID: " + checkIfExists[0].id);
                    return [2 /*return*/, dbPass];
                case 9: return [4 /*yield*/, pocketbase_1.pb.collection("tftBattlepass").create(dbPass)];
                case 10:
                    request = _a.sent();
                    console.log("Created new battle pass entry with ID: " + request.id);
                    return [2 /*return*/, dbPass];
            }
        });
    });
}