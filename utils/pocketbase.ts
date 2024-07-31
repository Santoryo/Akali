import PocketBase from 'pocketbase';
import dotenv from 'dotenv'; 
dotenv.config();

const user: string = process.env.PB_USER;
const pass: string = process.env.PB_PASS;

export const pb = new PocketBase(process.env.PB_URL);
export async function admin() { await pb.admins.authWithPassword(user, pass) }
