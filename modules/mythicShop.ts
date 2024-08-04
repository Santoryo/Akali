import { createHttp1Request, type Credentials } from "league-connect";
import type { MythicShop } from "../interfaces/MythicShop";
import { pb, admin } from "../utils/pocketbase";
import { currentPatch } from "./currentPatch";
import "../utils/lol2cdragon";

class MythicShopItem {
    category: string = "";
    patch: string = "";
    price: number = 0;
    skin?: string = "";
    imagePath?: string = "";
}

export async function mythicShopFetch(credentials: Credentials) {
    try {
        const temp = await createHttp1Request(
            {
                method: "GET",
                url: "lol-loot/v1/recipes/initial-item/CURRENCY_mythic",
            },
            credentials
        );

        const mythicShop: MythicShop = await temp.json();
        const patch = await currentPatch(credentials);
        await admin();

        for (const item of mythicShop) {

            if (item.outputs[0].lootName.includes("CHAMPION_SKIN")) {
                const skinInfo = await pb.collection('skins4').getFirstListItem(`skinId=${item.outputs[0].lootName.replace("CHAMPION_SKIN_", "")}`);

                const checkIfExists = await pb.collection('mythicshop').getFullList({ filter: `skin="${skinInfo.id}" && patch="${patch}"` });

                if (checkIfExists.length > 0) {
                    console.log("This Mythic Shop item already exists: " + skinInfo.id);
                    continue;
                }

                const mythicShopItem = new MythicShopItem();
                mythicShopItem.category = "SKIN";
                mythicShopItem.patch = patch;
                mythicShopItem.price = item.slots[0].quantity;
                mythicShopItem.skin = skinInfo.id;
                mythicShopItem.imagePath = item.imagePath;

                const request = await pb.collection('mythicshop').create(mythicShopItem);
                console.log("Created new mythic shop entry with ID: " + request.id);
            }
            else if(item.imagePath != "")
            {
                const imagePath = item.imagePath.lol2cdragon(patch);
                const checkIfExists = await pb.collection('mythicshop').getFullList({ filter: `imagePath="${imagePath}" && patch="${patch}"` });

                if (checkIfExists.length > 0) {
                    console.log("This Mythic Shop item already exists: " + checkIfExists[0].id);
                    continue;
                }

                const mythicShopItem = new MythicShopItem();
                mythicShopItem.category = "ITEM";
                mythicShopItem.patch = patch;
                mythicShopItem.price = item.slots[0].quantity;
                mythicShopItem.name = item.description;
                mythicShopItem.outputs = item.outputs;
                mythicShopItem.imagePath = imagePath;

                const request = await pb.collection('mythicshop').create(mythicShopItem);
                console.log("Created new mythic shop entry with ID: " + request.id);

            }


        }
    } catch (error) {
        console.warn(error);
    }
}
