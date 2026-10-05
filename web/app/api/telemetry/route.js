import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { driverId, game, speed = 0, fuel = null, odometer = null, latitude = null, longitude = null, payload = {} } = body;
    if (!driverId || !game) return NextResponse.json({ error: "driverId and game are required" }, { status: 400 });
    const result = await getDb().query("insert into telemetry (driver_id, game, speed, fuel, odometer, latitude, longitude, payload) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id, captured_at", [driverId, game, speed, fuel, odometer, latitude, longitude, payload]);
    return NextResponse.json({ ok: true, telemetry: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }
}
