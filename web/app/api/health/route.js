import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    await getDb().query("select 1");
    return NextResponse.json({ ok: true, database: "online", service: "BC TRUCK WORKS" });
  } catch (error) {
    return NextResponse.json({ ok: false, database: "offline", service: "BC TRUCK WORKS", message: error.message }, { status: 503 });
  }
}
