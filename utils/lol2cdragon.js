"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
String.prototype.lol2cdragon = function (version) {
    if (version === void 0) { version = "latest"; }
    return this.toLowerCase().replace("/lol-game-data/assets/", "https://raw.communitydragon.org/".concat(version, "/plugins/rcp-be-lol-game-data/global/default/"));
};
