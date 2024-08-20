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
exports.storeSaleFetch = storeSaleFetch;
var league_connect_1 = require("league-connect");
var pocketbase_1 = require("../utils/pocketbase");
var moment_1 = require("moment");
function storeSaleFetch(credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var temp, saleRotation, _i, saleRotation_1, sale, saleId, checkIfExists, skin, skinData, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, league_connect_1.createHttp1Request)({
                        method: 'GET',
                        url: 'lol-store/v1/catalog/sales'
                    }, credentials)];
                case 1:
                    temp = _a.sent();
                    return [4 /*yield*/, temp.json()];
                case 2:
                    saleRotation = _a.sent();
                    return [4 /*yield*/, (0, pocketbase_1.admin)()];
                case 3:
                    _a.sent();
                    if (saleRotation.length <= 0) {
                        console.log("No sales found");
                        return [2 /*return*/];
                    }
                    _i = 0, saleRotation_1 = saleRotation;
                    _a.label = 4;
                case 4:
                    if (!(_i < saleRotation_1.length)) return [3 /*break*/, 9];
                    sale = saleRotation_1[_i];
                    if (sale.item.inventoryType !== "CHAMPION_SKIN")
                        return [3 /*break*/, 8];
                    saleId = (0, moment_1.default)(sale.sale.startDate).unix().toString(15) + (0, moment_1.default)(sale.sale.endDate).unix().toString(15);
                    return [4 /*yield*/, pocketbase_1.pb.collection('saleRotationItems').getFullList({ filter: "skin.skinId=\"".concat(sale.item.itemId, "\" && saleId=\"").concat(saleId, "\"") })];
                case 5:
                    checkIfExists = _a.sent();
                    if (checkIfExists.length > 0)
                        return [3 /*break*/, 8];
                    return [4 /*yield*/, pocketbase_1.pb.collection('skins4').getFirstListItem("skinId=".concat(sale.item.itemId))];
                case 6:
                    skin = _a.sent();
                    skinData = {
                        startDate: sale.sale.startDate,
                        endDate: sale.sale.endDate,
                        price: sale.sale.prices[0].cost,
                        saleId: saleId,
                        skin: skin.id,
                        percentage: 100 - Math.round(sale.sale.prices[0].cost / skin.cost * 100)
                    };
                    return [4 /*yield*/, pocketbase_1.pb.collection('saleRotationItems').create(skinData)];
                case 7:
                    request = _a.sent();
                    console.log("Created new Sale Rotation entry with ID: " + request.id);
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 4];
                case 9: return [2 /*return*/];
            }
        });
    });
}
