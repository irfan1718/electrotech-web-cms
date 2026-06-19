import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Career from "@/models/Career";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CareerSchema } from "@/validations/career";
import { z } from "zod";

export async function GET() {
  try {
    await connectDB();
    const careers = await Career.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: careers });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const data = CareerSchema.parse(body);
    const career = await Career.create(data);
    return NextResponse.json({ success: true, data: career }, { status: 201 });
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

