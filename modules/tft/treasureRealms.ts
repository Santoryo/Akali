import { createHttp1Request, type Credentials } from "league-connect";
import { pb, admin } from "../../utils/pocketbase";
import type { LolTftTrovesTrovesBanner } from "../../interfaces/lcu-types";
import "../../utils/lol2cdragon";
import { currentPatch } from "../currentPatch";

export async function treasureRealmsFetch(credentials: Credentials) {

    const temp = await createHttp1Request({
        method: 'GET',
        url: '/lol-tft-troves/v1/banners'
    }, credentials);

    const data: LolTftTrovesTrovesBanner[] = await temp.json();

    await admin();
    const patch = await currentPatch(credentials);

    for(const banner of data)
    {
        const checkIfExists = await pb.collection('treasureRealms').getFullList({filter: `bannerId="${banner.id}"`});

        const dbBanner = {
            bannerId: banner.id,
            name: banner.name,
            description: banner.description,
            image: banner.backgroundTexture.lol2cdragon(patch),
            startDate: banner.startDate,
            endDate: banner.endDate,
        }

        if(checkIfExists.length > 0)
        {
            const request = await pb.collection('treasureRealms').update(checkIfExists[0].id, dbBanner);
            console.log("Updated treasure realm entry with ID: " + checkIfExists[0].id);
            continue;
        }
        const request = await pb.collection('treasureRealms').create(dbBanner);
        console.log("Created new treasure realm entry with ID: " + request.id);
    }

    return data;
}