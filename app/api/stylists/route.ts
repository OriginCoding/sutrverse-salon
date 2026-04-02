import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stylists = await prisma.stylist.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json({ stylists });
  } catch (e) {
    console.error("GET /api/stylists", e);
    return NextResponse.json({ error: "Failed to load stylists" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: { name?: unknown; email?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const email =
      typeof body.email === "string" && body.email.trim() !== ""
        ? body.email.trim()
        : null;

    const stylist = await prisma.stylist.create({
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ stylist }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "A stylist with this email already exists" }, { status: 409 });
    }
    console.error("POST /api/stylists", e);
    return NextResponse.json({ error: "Failed to create stylist" }, { status: 500 });
  }
}
