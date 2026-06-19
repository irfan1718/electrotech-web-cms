import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TeamSchema } from "@/validations/team";
import { z } from "zod";

export async function GET() {
  try {
    await connectDB();
    const team = await TeamMember.find().sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, data: team });
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
    const data = TeamSchema.parse(body);
    const member = await TeamMember.create(data);
    return NextResponse.json({ success: true, data: member }, { status: 201 });
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

