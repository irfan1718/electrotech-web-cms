import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TeamSchema } from "@/validations/team";
import { deleteUploadedFile } from "@/lib/delete-file";
import { z } from "zod";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const member = await TeamMember.findById(id).lean();
    if (!member) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: member });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, createdAt, updatedAt, ...rest } = body;
    const updateData = TeamSchema.partial().parse(rest);

    const existing = await TeamMember.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const member = await TeamMember.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (
      updateData.profileImage !== undefined &&
      updateData.profileImage !== existing.profileImage
    ) {
      await deleteUploadedFile(existing.profileImage);
    }

    return NextResponse.json({ success: true, data: member });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message ?? "Validation failed" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const member = await TeamMember.findByIdAndDelete(id);
    if (!member) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deleteUploadedFile(member.profileImage);

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
