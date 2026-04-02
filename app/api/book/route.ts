import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { startsAt: "asc" },
      include: {
        stylist: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({
      appointments: appointments.map((a) => ({
        id: a.id,
        startsAt: a.startsAt.toISOString(),
        endsAt: a.endsAt?.toISOString() ?? null,
        notes: a.notes,
        customerName: a.customerName,
        customerPhone: a.customerPhone,
        service: a.service,
        stylistId: a.stylistId,
        stylist: a.stylist,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("GET /api/book", e);
    return NextResponse.json({ error: "Failed to load appointments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: {
    stylistId?: unknown;
    startsAt?: unknown;
    notes?: unknown;
    customerName?: unknown;
    customerPhone?: unknown;
    service?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const stylistId = typeof body.stylistId === "string" ? body.stylistId.trim() : "";
  if (!stylistId) {
    return NextResponse.json({ error: "stylistId is required" }, { status: 400 });
  }

  const startsRaw = body.startsAt;
  if (typeof startsRaw !== "string" || startsRaw.trim() === "") {
    return NextResponse.json({ error: "startsAt must be an ISO 8601 datetime string" }, { status: 400 });
  }

  const startsAt = new Date(startsRaw);
  if (Number.isNaN(startsAt.getTime())) {
    return NextResponse.json({ error: "startsAt must be a valid datetime" }, { status: 400 });
  }

  const customerName =
    typeof body.customerName === "string" ? body.customerName.trim() : "";
  const customerPhone =
    typeof body.customerPhone === "string" ? body.customerPhone.trim() : "";
  const service = typeof body.service === "string" ? body.service.trim() : "";

  if (!customerName) {
    return NextResponse.json({ error: "customerName is required" }, { status: 400 });
  }
  if (!customerPhone) {
    return NextResponse.json({ error: "customerPhone is required" }, { status: 400 });
  }
  if (!service) {
    return NextResponse.json({ error: "service is required" }, { status: 400 });
  }

  const notes =
    typeof body.notes === "string" && body.notes.trim() !== "" ? body.notes.trim() : null;

  try {
    const stylist = await prisma.stylist.findUnique({
      where: { id: stylistId },
      select: { id: true },
    });
    if (!stylist) {
      return NextResponse.json({ error: "Stylist not found" }, { status: 404 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        stylistId,
        startsAt,
        notes,
        customerName,
        customerPhone,
        service,
      },
      select: {
        id: true,
        startsAt: true,
        endsAt: true,
        notes: true,
        customerName: true,
        customerPhone: true,
        service: true,
        stylistId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { error: "That time slot is already booked for this stylist" },
        { status: 409 },
      );
    }
    console.error("POST /api/book", e);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
