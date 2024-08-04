import { createHttp1Request, type Credentials } from "league-connect";
import { pb, admin } from "../utils/pocketbase";
import type { LolStoreItemSale } from "../interfaces/lcu-types";
import ObjectID from "bson-objectid";
import moment from "moment";

export async function storeSaleFetch(credentials: Credentials) {

    const temp = await createHttp1Request({
        method: 'GET',
        url: 'lol-store/v1/catalog/sales'
    }, credentials);

    const saleRotation: LolStoreItemSale[] = await temp.json();

    await admin();

    if(saleRotation.length <= 0)
    {
        console.log("No sales found");
        return;
    }

    for(const sale of saleRotation)
    {
        if(sale.item.inventoryType !== "CHAMPION_SKIN") continue;
        const saleId = moment(sale.sale.startDate).unix().toString(15) + moment(sale.sale.endDate).unix().toString(15);
        const checkIfExists = await pb.collection('saleRotationItems').getFullList({filter: `skin.skinId="${sale.item.itemId}" && saleId="${saleId}"`});

        if(checkIfExists.length > 0) continue;

        const skin = await pb.collection('skins4').getFirstListItem(`skinId=${sale.item.itemId}`);

        const skinData = {
            startDate: sale.sale.startDate,
            endDate: sale.sale.endDate,
            price: sale.sale.prices[0].cost,
            saleId: saleId,
            skin: skin.id,
            percentage: 100 - Math.round(sale.sale.prices[0].cost / skin.cost * 100)
        }

        const request = await pb.collection('saleRotationItems').create(skinData);
        console.log("Created new Sale Rotation entry with ID: " + request.id);
    }

}