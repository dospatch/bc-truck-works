import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request) {
  try {
    const expectedKey = process.env.TELEMETRY_API_KEY;
    const suppliedKey = request.headers.get("x-telemetry-key");

    if (!expectedKey || !suppliedKey || suppliedKey !== expectedKey) {
      return NextResponse.json({ error: "Unauthorized telemetry request" }, { status: 401 });
    }

    const body = await request.json();
    const { driverId, game, speed = 0, fuel = null, odometer = null, latitude = null, longitude = null, payload = {} } = body;

    if (!driverId || !game) {
      return NextResponse.json({ error: "driverId and game are required" }, { status: 400 });
    }

    if (!["ATS", "ETS2"].includes(String(game).toUpperCase())) {
      return NextResponse.json({ error: "game must be ATS or ETS2" }, { status: 400 });
    }

    const result = await getDb().query(
      "insert into telemetry (driver_id, game, speed, fuel, odometer, latitude, longitude, payload) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id, captured_at",
      [driverId, String(game).toUpperCase(), speed, fuel, odometer, latitude, longitude, payload]
    );

    return NextResponse.json({ ok: true, telemetry: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: "Telemetry service unavailable" }, { status: 503 });
  }
}
