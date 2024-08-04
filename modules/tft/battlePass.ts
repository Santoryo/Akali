import { createHttp1Request, type Credentials } from "league-connect";
import { pb, admin } from "../../utils/pocketbase";
import type { LolTftLolTftBackgrounds, LolTftPassTftBattlepass } from "../../interfaces/lcu-types";
import "../../utils/lol2cdragon";
import moment from "moment";
import { currentPatch } from "../currentPatch";

export async function tftBattlePassFetch(credentials: Credentials) {
    const temp = await createHttp1Request(
        {
            method: "GET",
            url: "/lol-tft-pass/v1/battle-pass",
        },
        credentials
    );

    const data: LolTftPassTftBattlepass = await temp.json();

    await admin();
    const patch = await currentPatch(credentials);

    const checkIfExists = await pb.collection("tftBattlepass").getFullList({ filter: `passId="${data.info.passId}"` });

    const temp1 = await createHttp1Request(
        {
            method: "GET",
            url: "/lol-tft/v1/tft/backgrounds",
        },
        credentials
    );

    const background: LolTftLolTftBackgrounds = await temp1.json();

    Object.keys(background.backgrounds).forEach((key) => {
        background.backgrounds[key] = background.backgrounds[key].lol2cdragon(patch);
    });

    const dbPass = {
        passId: data.info.passId,
        name: data.info.title,
        premiumName: data.info.premiumTitle,
        startDate: moment(data.info.startDate).format(),
        endDate: moment(data.info.endDate).format(),
        rewards: JSON.stringify(data.milestones),
        backgrounds: JSON.stringify(background.backgrounds),
    };

    if (checkIfExists.length > 0) {
        const request = await pb.collection("tftBattlepass").update(checkIfExists[0].id, dbPass);
        console.log("Updated battle pass entry with ID: " + checkIfExists[0].id);
        return dbPass;
    }
    const request = await pb.collection("tftBattlepass").create(dbPass);
    console.log("Created new battle pass entry with ID: " + request.id);

    return dbPass;
}
