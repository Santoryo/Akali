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
exports.eventsFetch = eventsFetch;
var league_connect_1 = require("league-connect");
var pocketbase_1 = require("../utils/pocketbase");
var Event = /** @class */ (function () {
    function Event() {
        this.eventId = "";
        this.eventName = "";
        this.eventIcon = "";
        this.eventTokenImage = "";
        this.eventType = "";
        this.helpModalImagePath = "";
        this.eventStartDate = "";
        this.eventEndDate = "";
        this.shopEndDate = "";
        this.shopOffers = "";
    }
    return Event;
}());
function eventsFetch(credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var temp, currentEvents, _i, currentEvents_1, event_1, eventId, checkIfEventExists, temp1, temp2, eventDetails, eventOffers, eventObject, formData, headers, blob, request_1, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, league_connect_1.createHttp1Request)({
                        method: 'GET',
                        url: 'lol-event-hub/v1/events'
                    }, credentials)];
                case 1:
                    temp = _a.sent();
                    return [4 /*yield*/, temp.json()];
                case 2:
                    currentEvents = _a.sent();
                    return [4 /*yield*/, (0, pocketbase_1.admin)()];
                case 3:
                    _a.sent();
                    _i = 0, currentEvents_1 = currentEvents;
                    _a.label = 4;
                case 4:
                    if (!(_i < currentEvents_1.length)) return [3 /*break*/, 15];
                    event_1 = currentEvents_1[_i];
                    eventId = event_1.eventId;
                    return [4 /*yield*/, pocketbase_1.pb.collection('events').getFullList({ filter: "eventId=\"".concat(eventId, "\"") })];
                case 5:
                    checkIfEventExists = _a.sent();
                    return [4 /*yield*/, (0, league_connect_1.createHttp1Request)({
                            method: 'GET',
                            url: "lol-event-hub/v1/events/".concat(eventId, "/event-details-data")
                        }, credentials)];
                case 6:
                    temp1 = _a.sent();
                    return [4 /*yield*/, (0, league_connect_1.createHttp1Request)({
                            method: 'GET',
                            url: "lol-event-hub/v1/events/".concat(eventId, "/token-shop/categories-offers")
                        }, credentials)];
                case 7:
                    temp2 = _a.sent();
                    eventDetails = temp1.json();
                    eventOffers = temp2.json();
                    eventObject = new Event();
                    formData = new FormData();
                    eventObject.eventId = event_1.eventId;
                    eventObject.eventName = event_1.eventInfo.eventName;
                    eventObject.eventEndDate = eventDetails.progressEndDate;
                    eventObject.eventStartDate = eventDetails.eventStartDate;
                    eventObject.shopEndDate = eventDetails.shopEndDate;
                    eventObject.shopOffers = JSON.stringify(eventOffers);
                    eventObject.eventType = event_1.eventInfo.eventType;
                    eventObject.eventIcon = "https://127.0.0.1:".concat(credentials.port) + event_1.eventInfo.eventIcon;
                    eventObject.eventTokenImage = "https://127.0.0.1:".concat(credentials.port) + event_1.eventInfo.eventTokenImage;
                    eventObject.helpModalImagePath = "https://127.0.0.1:".concat(credentials.port) + eventDetails.helpModalImagePath;
                    headers = new Headers({
                        'Authorization': "Basic ".concat(btoa("riot" + ':' + credentials.password))
                    });
                    return [4 /*yield*/, fetch(eventObject.eventIcon, { headers: headers }).then(function (r) { return r.blob(); })];
                case 8:
                    blob = _a.sent();
                    formData.append('eventIcon', blob);
                    return [4 /*yield*/, fetch(eventObject.eventTokenImage, { headers: headers }).then(function (r) { return r.blob(); })];
                case 9:
                    blob = _a.sent();
                    formData.append('eventTokenImage', blob);
                    return [4 /*yield*/, fetch(eventObject.helpModalImagePath, { headers: headers }).then(function (r) { return r.blob(); })];
                case 10:
                    blob = _a.sent();
                    formData.append('helpModalImagePath', blob);
                    formData.append('eventId', eventObject.eventId);
                    formData.append('eventName', eventObject.eventName);
                    formData.append('eventEndDate', eventObject.eventEndDate);
                    formData.append('eventStartDate', eventObject.eventStartDate);
                    formData.append('shopEndDate', eventObject.shopEndDate);
                    formData.append('shopOffers', eventObject.shopOffers);
                    formData.append('eventType', eventObject.eventType);
                    if (!(checkIfEventExists.length > 0)) return [3 /*break*/, 12];
                    return [4 /*yield*/, pocketbase_1.pb.collection('events').update(checkIfEventExists[0].id, formData)];
                case 11:
                    request_1 = _a.sent();
                    console.log("Updated event entry with ID: " + request_1.id);
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, pocketbase_1.pb.collection('events').create(formData)];
                case 13:
                    request = _a.sent();
                    console.log("Created new event entry with ID: " + request.id);
                    _a.label = 14;
                case 14:
                    _i++;
                    return [3 /*break*/, 4];
                case 15: return [2 /*return*/, currentEvents];
            }
        });
    });
}
