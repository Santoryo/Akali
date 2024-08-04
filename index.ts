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

const hook = new Webhook(process.env.WEBHOOK_URL);

const agent = new Agent({
  connect: {
    rejectUnauthorized: false,
  },
});

setGlobalDispatcher(agent);

try {
  const credentials = await authenticate();
  await eventsFetch(credentials);
  await treasureRealmsFetch(credentials);
  await tftBattlePassFetch(credentials);
  await storeSaleFetch(credentials);
  await mythicShopFetch(credentials);
} catch (error) {
  hook.send("**[Akali]**: " + error);
  console.error(error);
}

// await yourShopFetch(credentials);
// await mythicShopFetch(credentials);
