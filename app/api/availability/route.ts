import { NextResponse } from "next/server";

import { dayBoundsUtc, parseYmd, slotStartsUtcForDay } from "@/lib/day-slots";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stylistId = searchParams.get("stylistId")?.trim() ?? "";
  const dateParam = searchParams.get("date")?.trim() ?? "";

  if (!stylistId) {
    return NextResponse.json({ error: "stylistId is required" }, { status: 400 });
  }

  const parsed = parseYmd(dateParam);
  if (!parsed) {
    return NextResponse.json(
      { error: "date must be a valid calendar day in YYYY-MM-DD format" },
      { status: 400 },
    );
  }

  const { y, m, d } = parsed;

  try {
    const stylist = await prisma.stylist.findUnique({
      where: { id: stylistId },
      select: { id: true },
    });
    if (!stylist) {
      return NextResponse.json({ error: "Stylist not found" }, { status: 404 });
    }

    const { start: dayStart, end: dayEnd } = dayBoundsUtc(y, m, d);
    const allSlots = slotStartsUtcForDay(y, m, d);

    const booked = await prisma.appointment.findMany({
      where: {
        stylistId,
        startsAt: { gte: dayStart, lt: dayEnd },
      },
      select: { startsAt: true },
    });

    const bookedMs = new Set(booked.map((a) => a.startsAt.getTime()));

    const slots = allSlots
      .filter((s) => !bookedMs.has(s.getTime()))
      .map((s) => s.toISOString());

    return NextResponse.json({ stylistId, date: dateParam, slots });
  } catch (e) {
    console.error("GET /api/availability", e);
    return NextResponse.json({ error: "Failed to load availability" }, { status: 500 });
  }
}
