import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const position =
      (formData.get("position") as string) || "General Application";
    const coverNote = (formData.get("coverNote") as string) || "";
    const cv = formData.get("cv") as File;

    // Validate required fields
    if (!name || !email || !phone || !cv) {
      return NextResponse.json(
        { success: false, error: "Name, email, phone, and CV are required" },
        { status: 400 },
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Validate file type — PDF only
    if (cv.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Only PDF files are accepted" },
        { status: 400 },
      );
    }

    // Validate file size — max 10MB
    if (cv.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "CV file must be under 10MB" },
        { status: 400 },
      );
    }

    // Save file
    const bytes = await cv.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const safeName = name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const fileName = `cv-${safeName}-${timestamp}.pdf`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "cvs");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const cvUrl = `/uploads/cvs/${fileName}`;

    // Save to database
    await connectDB();
    const application = await JobApplication.create({
      name,
      email,
      phone,
      position,
      coverNote,
      cvUrl,
      cvFileName: cv.name,
    });

    return NextResponse.json({
      success: true,
      data: { id: application._id },
      message: "Application submitted successfully",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Submission failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
