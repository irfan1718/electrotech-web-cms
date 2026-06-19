import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ServiceSchema } from "@/validations/service";
import { deleteUploadedFile } from "@/lib/delete-file";
import { z } from "zod";

// GET — public (by ID or slug)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    let service = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id).lean();
    }
    if (!service) {
      service = await Service.findOne({ slug: id }).lean();
    }

    if (!service) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: service });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH — admin only
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
    const updateData = ServiceSchema.partial().parse(rest);

    const existing = await Service.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (
      updateData.thumbnail !== undefined &&
      updateData.thumbnail !== existing.thumbnail
    ) {
      await deleteUploadedFile(existing.thumbnail);
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message ?? "Validation failed" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE — admin only
export async function DELETE(
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

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deleteUploadedFile(service.thumbnail);

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
