import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { readSession } from "@/lib/session";

const allowed = new Set(["pause","save","screenshot","echo","route","time"]);
const connectorKey = process.env.CONNECTOR_COMMAND_KEY || "";

function connectorAuthorized(request) {
  return !!connectorKey && request.headers.get("x-connector-key") === connectorKey;
}

export async function GET(request) {
  try {
    if (connectorAuthorized(request)) {
      const driverId = request.nextUrl.searchParams.get("driverId");
      if (!driverId) return NextResponse.json({error:"driverId is required"},{status:400});
      const db = getDb();
      const result = await db.query(
        "with next_command as (select id from game_commands where driver_id=$1 and status='pending' order by created_at asc limit 1 for update skip locked) update game_commands set status='claimed',claimed_at=now() where id in (select id from next_command) returning id,command,payload,created_at",
        [driverId]
      );
      return NextResponse.json({command:result.rows[0] || null});
    }

    const session = readSession(request);
    if (!session?.discordId) return NextResponse.json({error:"Login required"},{status:401});
    const db = getDb();
    const driver = await db.query("select id from drivers where discord_id=$1 limit 1",[session.discordId]);
    if (!driver.rows[0]) return NextResponse.json({commands:[]});
    const result = await db.query(
      "select id,command,payload,status,created_at,executed_at,result from game_commands where driver_id=$1 order by created_at desc limit 25",
      [driver.rows[0].id]
    );
    return NextResponse.json({commands:result.rows});
  } catch {
    return NextResponse.json({error:"Game command service unavailable"},{status:503});
  }
}

export async function POST(request) {
  try {
    if (connectorAuthorized(request)) {
      const body = await request.json();
      const id = Number(body.commandId);
      if (!Number.isInteger(id)) return NextResponse.json({error:"commandId is required"},{status:400});
      const status = ["executed","failed"].includes(body.status) ? body.status : "failed";
      const result = String(body.result || "").slice(0,1000);
      const db = getDb();
      await db.query(
        "update game_commands set status=$1,result=$2,executed_at=now() where id=$3 and status='claimed'",
        [status,result,id]
      );
      return NextResponse.json({ok:true});
    }

    const session = readSession(request);
    if (!session?.discordId) return NextResponse.json({error:"Login required"},{status:401});
    const body = await request.json();
    const command = String(body.command || "").toLowerCase().trim();
    const payload = body.payload && typeof body.payload === "object" ? body.payload : {};
    if (!allowed.has(command)) return NextResponse.json({error:"Command is not allowed."},{status:400});

    const db = getDb();
    const driver = await db.query("select id from drivers where discord_id=$1 limit 1",[session.discordId]);
    if (!driver.rows[0]) return NextResponse.json({error:"Driver profile was not found."},{status:404});
    const result = await db.query(
      "insert into game_commands (driver_id,command,payload,status) values ($1,$2,$3,'pending') returning id,command,status,created_at",
      [driver.rows[0].id,command,payload]
    );
    return NextResponse.json({ok:true,command:result.rows[0]});
  } catch {
    return NextResponse.json({error:"Game command service unavailable"},{status:503});
  }
}
