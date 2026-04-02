import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { startOfDay, startOfNextDay } from "@/lib/today-range";

export async function GET() {
  try {
    const dayStart = startOfDay();
    const dayEnd = startOfNextDay();

    const appointments = await prisma.appointment.findMany({
      where: {
        startsAt: { gte: dayStart, lt: dayEnd },
      },
      include: {
        stylist: { select: { id: true, name: true, email: true } },
      },
      orderBy: { startsAt: "asc" },
    });

    const totalBookings = appointments.length;
    const revenue = totalBookings * 300;

    const countByStylist = new Map<string, { stylistId: string; stylistName: string; bookingCount: number }>();
    for (const a of appointments) {
      const id = a.stylistId;
      const existing = countByStylist.get(id);
      if (existing) {
        existing.bookingCount += 1;
      } else {
        countByStylist.set(id, {
          stylistId: id,
          stylistName: a.stylist.name,
          bookingCount: 1,
        });
      }
    }

    const stylistUtilization = Array.from(countByStylist.values()).sort((a, b) =>
      a.stylistName.localeCompare(b.stylistName),
    );

    return NextResponse.json({
      totalBookings,
      revenue,
      stylistUtilization,
      appointments: appointments.map((a) => ({
        id: a.id,
        startsAt: a.startsAt.toISOString(),
        customerName: a.customerName,
        customerPhone: a.customerPhone,
        service: a.service,
        stylist: a.stylist,
      })),
    });
  } catch (e) {
    console.error("GET /api/dashboard/owner", e);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
