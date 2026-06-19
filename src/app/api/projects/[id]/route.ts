import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProjectSchema } from "@/validations/project";
import { deleteUploadedFile, deleteUploadedFiles } from "@/lib/delete-file";
import { z } from "zod";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    let project = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(id).lean();
    }
    if (!project) {
      project = await Project.findOne({ slug: id }).lean();
    }
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
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
    const updateData = ProjectSchema.partial().parse(rest);

    const existing = await Project.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const project = await Project.findByIdAndUpdate(
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

    if (updateData.images !== undefined) {
      const removed = (existing.images as string[]).filter(
        (url) => !(updateData.images as string[]).includes(url),
      );
      await deleteUploadedFiles(removed);
    }

    return NextResponse.json({ success: true, data: project });
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

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await Promise.all([
      deleteUploadedFile(project.thumbnail),
      deleteUploadedFiles(project.images as string[]),
    ]);

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
