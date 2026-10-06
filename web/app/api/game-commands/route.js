import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { readSession } from "@/lib/session";

const allowed = new Set(["pause","save","screenshot","echo","route","time"]);

export async function POST(request) {
  try {
    const session = readSession(request);
    if (!session?.discordId) return NextResponse.json({error:"Login required"},{status:401});

    const body = await request.json();
    const command = String(body.command || "").toLowerCase().trim();
    const payload = body.payload && typeof body.payload === "object" ? body.payload : {};

    if (!allowed.has(command)) return NextResponse.json({error:"Command is not allowed."},{status:400});

    const db = getDb();
    const driver = await db.query("select id,display_name,discord_id from drivers where discord_id=$1 limit 1",[session.discordId]);
    if (!driver.rows[0]) return NextResponse.json({error:"Driver profile was not found."},{status:404});

    const result = await db.query(
      "insert into game_commands (driver_id,command,payload,status) values ($1,$2,$3,'pending') returning id,command,status,created_at",
      [driver.rows[0].id,command,payload]
    );

    return NextResponse.json({ok:true,command:result.rows[0]});
  } catch (error) {
    return NextResponse.json({error:"Game command service unavailable"},{status:503});
  }
}

export async function GET(request) {
  try {
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
