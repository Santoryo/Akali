declare global {
    interface String {
        lol2cdragon(): string;
    }
}

String.prototype.lol2cdragon = function(version: string = "latest"): string {
    return this.toLowerCase().replace("/lol-game-data/assets/", `https://raw.communitydragon.org/${version}/plugins/rcp-be-lol-game-data/global/default/`);
};

export {};