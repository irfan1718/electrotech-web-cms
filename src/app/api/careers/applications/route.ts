import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";

export async function GET() {
  await connectDB();

  const applications = await JobApplication.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    success: true,
    data: JSON.parse(JSON.stringify(applications)),
  });
}
