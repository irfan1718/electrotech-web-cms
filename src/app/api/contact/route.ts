import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactInquiry from "@/models/ContactInquiry";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ContactSchema } from "@/validations/contact";
import { z } from "zod";

// GET — admin only (list all inquiries)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const inquiries = await ContactInquiry.find()
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: inquiries });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch" },
      { status: 500 },
    );
  }
}

// POST — public (submit contact form)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = ContactSchema.parse(body);
    const inquiry = await ContactInquiry.create(data);
    return NextResponse.json(
      {
        success: true,
        message: "Inquiry submitted successfully",
        data: inquiry,
      },
      { status: 201 },
    );
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

// PATCH — admin only (mark read/unread)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id, status } = await req.json();

    if (!["read", "unread"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!inquiry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: inquiry });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE — admin only
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await req.json();

    const inquiry = await ContactInquiry.findByIdAndDelete(id);
    if (!inquiry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
