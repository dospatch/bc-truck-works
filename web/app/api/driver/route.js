import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request) {
  try {
    const discordId = request.headers.get("x-discord-id");
    if (!discordId) return NextResponse.json({ error: "Discord account required" }, { status: 401 });
    const result = await getDb().query("select id, discord_id, display_name, game, total_miles, trips, deliveries, rank, created_at from drivers where discord_id = $1 limit 1", [discordId]);
    if (!result.rows[0]) return NextResponse.json({ error: "Driver profile not found" }, { status: 404 });
    return NextResponse.json({ driver: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }
}
