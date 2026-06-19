import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ServiceSchema } from "@/validations/service";
import { z } from "zod";

// GET — public
export async function GET() {
  try {
    await connectDB();
    const services = await Service.find().sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, data: services });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 },
    );
  }
}

// POST — admin only
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const data = ServiceSchema.parse(body);

    // Auto-generate slug if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const service = await Service.create(data);
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message ?? "Validation failed" },
        { status: 400 },
      );
    }
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
