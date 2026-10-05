import crypto from "crypto";
const COOKIE="bc_driver_session", TTL=604800;
function secret(){if(!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is not configured"); return process.env.SESSION_SECRET;}
function sign(v){return crypto.createHmac("sha256",secret()).update(v).digest("base64url");}
export function createSession(discordId,displayName){const p=Buffer.from(JSON.stringify({discordId,displayName,exp:Math.floor(Date.now()/1000)+TTL})).toString("base64url");return p+"."+sign(p);}
export function readSession(request){const raw=request.cookies.get(COOKIE)?.value;if(!raw)return null;const [p,s]=raw.split(".");if(!p||!s)return null;const e=sign(p);if(s.length!==e.length||!crypto.timingSafeEqual(Buffer.from(s),Buffer.from(e)))return null;const d=JSON.parse(Buffer.from(p,"base64url").toString("utf8"));return d.exp>Date.now()/1000?d:null;}
export const sessionCookie={name:COOKIE,maxAge:TTL,httpOnly:true,secure:true,sameSite:"lax",path:"/"};