import { authenticate, createHttp1Request, createHttpSession } from 'league-connect'
import { type MythicShop } from './interfaces/MythicShop'
import { yourShopFetch } from './modules/yourShop'
import { mythicShopFetch } from './modules/mythicShop';
import { eventsFetch } from './modules/events';
import { Agent, setGlobalDispatcher } from 'undici'

const agent = new Agent({
    connect: {
      rejectUnauthorized: false
    }
  })
  
  setGlobalDispatcher(agent)

const credentials = await authenticate()

// await yourShopFetch(credentials);
// await mythicShopFetch(credentials);
await eventsFetch(credentials);