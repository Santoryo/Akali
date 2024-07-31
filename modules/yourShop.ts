import { createHttp1Request, type Credentials } from "league-connect";
import { pb, admin } from "../utils/pocketbase";

class YourShop {
    endTime: string = "";
    startTime: string = "";
    name: string = "";
    hubEnabled: boolean = false;
}

export async function yourShopFetch(credentials: Credentials) {

    const temp = await createHttp1Request({
        method: 'GET',
        url: 'lol-yourshop/v1/status'
    }, credentials);

    const yourShop: YourShop = await temp.json();

    await admin();

    const checkIfExists = await pb.collection('yourshops').getFullList({filter: `name="${yourShop.name}"`});

    if (checkIfExists.length <= 0) {
        const request = await pb.collection('yourshops').create(yourShop);
        console.log("Created new yourshop entry with ID: " + request.id);
        return yourShop;
    }

    console.log("This Your Shop already exists");
    return yourShop;
}