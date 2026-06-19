import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { status } = await req.json();

  await connectDB();
  const application = await JobApplication.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  ).lean();

  if (!application) {
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    data: JSON.parse(JSON.stringify(application)),
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await connectDB();
  const application = await JobApplication.findById(id).lean();

  if (!application) {
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 },
    );
  }

  // Delete CV file from disk
  if (application.cvUrl) {
    try {
      const filePath = path.join(process.cwd(), "public", application.cvUrl);
      await unlink(filePath);
    } catch {
      // File may already be deleted
    }
  }

  await JobApplication.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
