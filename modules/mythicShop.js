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
exports.mythicShopFetch = mythicShopFetch;
var league_connect_1 = require("league-connect");
var pocketbase_1 = require("../utils/pocketbase");
var currentPatch_1 = require("./currentPatch");
require("../utils/lol2cdragon");
var MythicShopItem = /** @class */ (function () {
    function MythicShopItem() {
        this.category = "";
        this.patch = "";
        this.price = 0;
        this.skin = "";
        this.imagePath = "";
    }
    return MythicShopItem;
}());
function mythicShopFetch(credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var temp, mythicShop, patch, _i, mythicShop_1, item, skinInfo, checkIfExists, mythicShopItem, request, imagePath, checkIfExists, mythicShopItem, request, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 14, , 15]);
                    return [4 /*yield*/, (0, league_connect_1.createHttp1Request)({
                            method: "GET",
                            url: "lol-loot/v1/recipes/initial-item/CURRENCY_mythic",
                        }, credentials)];
                case 1:
                    temp = _a.sent();
                    return [4 /*yield*/, temp.json()];
                case 2:
                    mythicShop = _a.sent();
                    return [4 /*yield*/, (0, currentPatch_1.currentPatch)(credentials)];
                case 3:
                    patch = _a.sent();
                    return [4 /*yield*/, (0, pocketbase_1.admin)()];
                case 4:
                    _a.sent();
                    _i = 0, mythicShop_1 = mythicShop;
                    _a.label = 5;
                case 5:
                    if (!(_i < mythicShop_1.length)) return [3 /*break*/, 13];
                    item = mythicShop_1[_i];
                    if (!item.outputs[0].lootName.includes("CHAMPION_SKIN")) return [3 /*break*/, 9];
                    return [4 /*yield*/, pocketbase_1.pb.collection('skins4').getFirstListItem("skinId=".concat(item.outputs[0].lootName.replace("CHAMPION_SKIN_", "")))];
                case 6:
                    skinInfo = _a.sent();
                    return [4 /*yield*/, pocketbase_1.pb.collection('mythicshop').getFullList({ filter: "skin=\"".concat(skinInfo.id, "\" && patch=\"").concat(patch, "\"") })];
                case 7:
                    checkIfExists = _a.sent();
                    if (checkIfExists.length > 0) {
                        console.log("This Mythic Shop item already exists: " + skinInfo.id);
                        return [3 /*break*/, 12];
                    }
                    mythicShopItem = new MythicShopItem();
                    mythicShopItem.category = "SKIN";
                    mythicShopItem.patch = patch;
                    mythicShopItem.price = item.slots[0].quantity;
                    mythicShopItem.skin = skinInfo.id;
                    mythicShopItem.imagePath = item.imagePath;
                    return [4 /*yield*/, pocketbase_1.pb.collection('mythicshop').create(mythicShopItem)];
                case 8:
                    request = _a.sent();
                    console.log("Created new mythic shop entry with ID: " + request.id);
                    return [3 /*break*/, 12];
                case 9:
                    if (!(item.imagePath != "")) return [3 /*break*/, 12];
                    imagePath = item.imagePath.lol2cdragon(patch);
                    return [4 /*yield*/, pocketbase_1.pb.collection('mythicshop').getFullList({ filter: "imagePath=\"".concat(imagePath, "\" && patch=\"").concat(patch, "\"") })];
                case 10:
                    checkIfExists = _a.sent();
                    if (checkIfExists.length > 0) {
                        console.log("This Mythic Shop item already exists: " + checkIfExists[0].id);
                        return [3 /*break*/, 12];
                    }
                    mythicShopItem = new MythicShopItem();
                    mythicShopItem.category = "ITEM";
                    mythicShopItem.patch = patch;
                    mythicShopItem.price = item.slots[0].quantity;
                    mythicShopItem.name = item.description;
                    mythicShopItem.outputs = item.outputs;
                    mythicShopItem.imagePath = imagePath;
                    return [4 /*yield*/, pocketbase_1.pb.collection('mythicshop').create(mythicShopItem)];
                case 11:
                    request = _a.sent();
                    console.log("Created new mythic shop entry with ID: " + request.id);
                    _a.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 5];
                case 13: return [3 /*break*/, 15];
                case 14:
                    error_1 = _a.sent();
                    console.warn(error_1);
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
}
