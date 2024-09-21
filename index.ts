import { authenticate, createHttp1Request, createHttpSession } from "league-connect";
import { type MythicShop } from "./interfaces/MythicShop";
import { yourShopFetch } from "./modules/yourShop";
import { mythicShopFetch } from "./modules/mythicShop";
import { eventsFetch } from "./modules/events";
import { Agent, setGlobalDispatcher } from "undici";
import { Webhook } from "discord-webhook-node";
import dotenv from "dotenv";
import { treasureRealmsFetch } from "./modules/tft/treasureRealms";
import { tftBattlePassFetch } from "./modules/tft/battlePass";
import { storeSaleFetch } from "./modules/storeSale";
dotenv.config();
import { exec } from 'child_process';

const hook = new Webhook(process.env.WEBHOOK_URL);

const agent = new Agent({
  connect: {
    rejectUnauthorized: false,
  },
});

setGlobalDispatcher(agent);

while(true)
{
  try {
    const credentials = await authenticate();
    await eventsFetch(credentials);
    await treasureRealmsFetch(credentials);
    await tftBattlePassFetch(credentials);
    await storeSaleFetch(credentials);
    await mythicShopFetch(credentials);
    process.exit(0);
  } catch (error) {
    console.log("League client not found, retrying in 10 seconds...");
    exec('"F:\\Riot Games\\Riot Client\\RiotClientServices.exe" --launch-product=league_of_legends --launch-patchline=live', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  }
  await new Promise(resolve => setTimeout(resolve, 10000));
}

// await yourShopFetch(credentials);
// await mythicShopFetch(credentials);
