import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await req.json();

    if (!url || !url.startsWith("/uploads/")) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
    }

    const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
    const filePath = path.resolve(process.cwd(), "public", url.slice(1));

    if (!filePath.startsWith(uploadsDir + path.sep)) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
    }

    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    return NextResponse.json({ success: true, message: "File deleted" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
